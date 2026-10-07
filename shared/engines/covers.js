/* ==========================================================================
   FestoCovers: book jackets and movie posters, with a title plate that is always
   there first, so a card is never an empty box.

   Books : Open Library by ISBN (as an <img>, no CORS) within a request budget,
           then Open Library search -> /b/id/{cover_i}, then a Wikipedia page IF its
           title resembles the book (rejects author pages).
   Movies: Wikipedia action API, 20 titles per request, origin=*, no custom headers
           (so no CORS preflight), pilicense=any (otherwise film posters come back empty).

   API
     FestoCovers.attach(imgEl, item, kind)        // kind: 'book' | 'movie'
     FestoCovers.resolve(item, kind, {overview})  // Promise<{poster, overview, wikiUrl, source}>
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo;
  var CFG = { rootMargin: '320px', ttlMs: 30 * 86400000, negTtlMs: 2 * 86400000, isbnBudget: 70, isbnWindowMs: 300000, maxEntries: 2400, batchMs: 70, batchSize: 20 };

  /* ---------- pure helpers (node-testable via _pure) ---------- */
  function normTitle(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/\([^)]*\)/g, ' ').replace(/&/g, ' and ').replace(/^(the|a|an)\s+/, '')
      .replace(/[^a-z0-9]+/g, ' ').replace(/\b(the|a|an|of)\b/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function dice(a, b) {
    var ta = a.split(' ').filter(Boolean), tb = b.split(' ').filter(Boolean);
    if (!ta.length || !tb.length) return 0;
    var set = {}, hit = 0;
    tb.forEach(function (t) { set[t] = (set[t] || 0) + 1; });
    ta.forEach(function (t) { if (set[t] > 0) { hit++; set[t]--; } });
    return (2 * hit) / (ta.length + tb.length);
  }
  function titleSimilarity(a, b) {
    var na = normTitle(a), nb = normTitle(b);
    if (!na || !nb) return 0;
    if (na === nb) return 1;
    var a0 = normTitle(String(a).split(':')[0]), b0 = normTitle(String(b).split(':')[0]);
    return Math.max(dice(na, nb), a0 && b0 ? dice(a0, b0) : 0);
  }
  function isbnOk(s) {
    s = String(s || '').replace(/[-\s]/g, '');
    var i, sum;
    if (s.length === 13 && /^\d{13}$/.test(s)) { sum = 0; for (i = 0; i < 13; i++) sum += (+s[i]) * (i % 2 ? 3 : 1); return sum % 10 === 0; }
    if (s.length === 10 && /^\d{9}[\dX]$/.test(s)) { sum = 0; for (i = 0; i < 10; i++) sum += (s[i] === 'X' ? 10 : +s[i]) * (10 - i); return sum % 11 === 0; }
    return false;
  }
  function chunk(arr, n) { var out = []; for (var i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; }
  /* Map a MediaWiki batch response back onto the titles that were asked for. */
  function mapWikiBatch(asked, resp) {
    var q = (resp && resp.query) || {}, norm = {}, redir = {}, byTitle = {}, out = {};
    (q.normalized || []).forEach(function (n) { norm[n.from] = n.to; });
    (q.redirects || []).forEach(function (r) { redir[r.from] = r.to; });
    var pages = q.pages || {};
    Object.keys(pages).forEach(function (k) { byTitle[pages[k].title] = pages[k]; });
    asked.forEach(function (t) {
      var n = norm[t] || t, r = redir[n] || n, p = byTitle[r];
      out[t] = (p && !('missing' in p)) ? { title: p.title, thumb: p.thumbnail ? p.thumbnail.source : null, extract: p.extract || '', url: p.fullurl || ('https://en.wikipedia.org/wiki/' + encodeURIComponent(String(p.title).replace(/ /g, '_'))) } : null;
    });
    return out;
  }

  /* ---------- persistent cache ---------- */
  var CKEY = 'festo_cover_cache_v1';
  var cache = F.store.get(CKEY, {}) || {};
  var saveTimer = 0;
  function cget(k) {
    var e = cache[k];
    if (!e) return undefined;
    var ttl = (e.u === null || e.t === null) ? CFG.negTtlMs : CFG.ttlMs;
    if (Date.now() - e.ts > ttl) { delete cache[k]; return undefined; }
    return e;
  }
  function cset(k, v) {
    v.ts = Date.now();
    cache[k] = v;
    if (!saveTimer) saveTimer = setTimeout(function () {
      saveTimer = 0;
      var keys = Object.keys(cache);
      if (keys.length > CFG.maxEntries) {
        keys.sort(function (a, b) { return cache[a].ts - cache[b].ts; });
        keys.slice(0, keys.length - CFG.maxEntries + 200).forEach(function (kk) { delete cache[kk]; });
      }
      F.store.set(CKEY, cache);
    }, 1500);
  }

  /* ---------- Wikipedia batching ---------- */
  var FAIL = { fail: true };   /* network/transport failure: never cached as a miss */
  var wikiMemo = {}, wikiQueue = [], wikiTimer = 0;
  var wikiNet = F.net.queue(2);
  function wikiLookup(title) {
    title = String(title).replace(/_/g, ' ');
    var c = cget('w:' + title);
    if (c) return Promise.resolve(c.hit === false ? null : { title: c.n || title, thumb: c.t || null, extract: c.e || '', url: 'https://en.wikipedia.org/wiki/' + encodeURIComponent((c.n || title).replace(/ /g, '_')) });
    if (wikiMemo[title]) return wikiMemo[title];
    wikiMemo[title] = new Promise(function (resolve) {
      wikiQueue.push({ title: title, resolve: resolve });
      if (!wikiTimer) wikiTimer = setTimeout(flushWiki, CFG.batchMs);
    });
    return wikiMemo[title];
  }
  function flushWiki() {
    wikiTimer = 0;
    var jobs = wikiQueue.splice(0, wikiQueue.length);
    chunk(jobs, CFG.batchSize).forEach(function (grp) {
      var asked = grp.map(function (j) { return j.title; });
      var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages%7Cextracts%7Cinfo&inprop=url' +
        '&piprop=thumbnail&pithumbsize=342&pilicense=any&exintro=1&explaintext=1&exsentences=3&exlimit=' + asked.length +
        '&titles=' + encodeURIComponent(asked.join('|'));
      wikiNet.add(function () { return F.net.json(url, { timeoutMs: 9000, retries: 1 }); }).then(function (resp) {
        var map = mapWikiBatch(asked, resp);
        grp.forEach(function (j) {
          var hit = map[j.title];
          cset('w:' + j.title, hit ? { n: hit.title, t: hit.thumb, e: (hit.extract || '').slice(0, 420) } : { hit: false, t: null });
          j.resolve(hit);
        });
      }, function () { grp.forEach(function (j) { delete wikiMemo[j.title]; j.resolve(FAIL); }); });
    });
  }

  /* ---------- Open Library ---------- */
  function isbnBudgetOk() {
    var now = Date.now(), log = F.store.get('festo_ol_isbn_log', []).filter(function (t) { return now - t < CFG.isbnWindowMs; });
    if (log.length >= CFG.isbnBudget) return false;
    log.push(now);
    F.store.set('festo_ol_isbn_log', log);
    return true;
  }
  function probeImage(url, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var im = new Image(), done = false;
      var t = setTimeout(function () { if (!done) { done = true; im.src = ''; reject(new Error('timeout')); } }, timeoutMs || 7000);
      im.referrerPolicy = 'no-referrer';
      im.onload = function () { if (done) return; done = true; clearTimeout(t); (im.naturalWidth > 1) ? resolve(url) : reject(new Error('blank')); };
      im.onerror = function () { if (done) return; done = true; clearTimeout(t); reject(new Error('error')); };
      im.src = url;
    });
  }
  var olNet = F.net.queue(2);
  function olSearchCover(item) {
    var url = 'https://openlibrary.org/search.json?limit=4&fields=title,author_name,cover_i&title=' + encodeURIComponent(item.title || '') +
      (item.author ? '&author=' + encodeURIComponent(item.author) : '');
    return olNet.add(function () {
      return F.net.json(url, { timeoutMs: 8000, retries: 0 }).then(function (d) {
        var best = null, bestScore = 0;
        (d.docs || []).forEach(function (doc) {
          if (!doc.cover_i) return;
          var s = titleSimilarity(item.title, doc.title);
          if (s > bestScore) { best = doc; bestScore = s; }
        });
        return new Promise(function (r) { setTimeout(function () { r(best && bestScore >= 0.6 ? 'https://covers.openlibrary.org/b/id/' + best.cover_i + '-M.jpg' : null); }, 180); });
      });
    });
  }

  /* ---------- resolution ---------- */
  var posterMemo = {};
  function keyOf(item, kind) {
    return (kind === 'book' ? 'b:' : 'm:') + (item.isbn ? item.isbn : F.util.hashStr((item.title || '') + '|' + (item.author || item.year || '')));
  }
  function wikiTitleOf(item) {
    var s = item.wikiSlug ? decodeURIComponent(String(item.wikiSlug)) : item.title;
    return String(s || '').replace(/_/g, ' ');
  }
  function resolvePoster(item, kind) {
    var key = 'p:' + keyOf(item, kind);
    var c = cget(key);
    if (c) return Promise.resolve(c.u ? { url: c.u, source: c.s } : null);
    if (posterMemo[key]) return posterMemo[key];
    var p, transient = false;
    if (F.flags.offline) return Promise.resolve(null);
    function done(res) { if (res || !transient) cset(key, res ? { u: res.url, s: res.source } : { u: null }); return res; }
    function wikiOk(w, min) { if (w === FAIL) { transient = true; return false; } return !!(w && w.thumb && titleSimilarity(item.title, w.title) >= min); }
    if (kind === 'movie') {
      p = wikiLookup(wikiTitleOf(item)).then(function (w) {
        return wikiOk(w, 0.4) ? { url: w.thumb, source: 'wikipedia' } : null;
      }).then(done);
    } else {
      p = Promise.resolve().then(function () {
        if (isbnOk(item.isbn) && isbnBudgetOk()) {
          return probeImage('https://covers.openlibrary.org/b/isbn/' + encodeURIComponent(item.isbn) + '-M.jpg?default=false').then(function (u) { return { url: u, source: 'openlibrary-isbn' }; }, function () { return null; });
        }
        return null;
      }).then(function (r) {
        if (r) return r;
        return olSearchCover(item).then(function (u) { return u ? { url: u, source: 'openlibrary-search' } : null; }, function () { transient = true; return null; });
      }).then(function (r) {
        if (r) return r;
        return wikiLookup(wikiTitleOf(item)).then(function (w) {
          return wikiOk(w, 0.6) ? { url: w.thumb, source: 'wikipedia' } : null;
        });
      }).then(done);
    }
    posterMemo[key] = p;
    return p;
  }
  function resolve(item, kind, opts) {
    opts = opts || {};
    var wantWiki = !!opts.overview;
    return Promise.all([
      resolvePoster(item, kind).catch(function () { return null; }),
      wantWiki ? wikiLookup(wikiTitleOf(item)).catch(function () { return null; }) : Promise.resolve(null)
    ]).then(function (r) {
      var poster = r[0], w = r[1] === FAIL ? null : r[1];
      var plausible = w && titleSimilarity(item.title, w.title) >= (kind === 'book' ? 0.6 : 0.4);
      return {
        poster: poster ? poster.url : null,
        source: poster ? poster.source : null,
        overview: plausible ? w.extract : '',
        wikiUrl: plausible ? w.url : 'https://en.wikipedia.org/wiki/' + encodeURIComponent(String(wikiTitleOf(item)).replace(/ /g, '_'))
      };
    });
  }

  /* ---------- attach: plate + lazy load ---------- */
  var io = null;
  var pending = new WeakMap();
  function ensureObserver() {
    if (io || !('IntersectionObserver' in global)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var job = pending.get(en.target);
        if (job) { pending.delete(en.target); job(); }
      });
    }, { rootMargin: CFG.rootMargin, threshold: 0.01 });
  }
  function buildPlate(item, kind, glyph) {
    var sub = kind === 'book' ? (item.author || '') : [item.year, item.cast && item.cast[0]].filter(Boolean).join(' · ');
    var plate = document.createElement('div');
    plate.className = 'fx-plate';
    plate.setAttribute('aria-hidden', 'true');
    plate.style.setProperty('--h', F.util.hashHue(item.title || ''));
    var t = document.createElement('span'); t.className = 'fx-plate-title'; t.textContent = item.title || 'Untitled';
    var s = document.createElement('span'); s.className = 'fx-plate-sub'; s.textContent = sub;
    plate.appendChild(t); if (sub) plate.appendChild(s);
    return plate;
  }
  function attach(imgEl, item, kind, opts) {
    opts = opts || {};
    if (!imgEl || !item) return;
    var box = imgEl.parentElement;
    if (box && !box.querySelector(':scope > .fx-plate')) {
      box.classList.add('fx-has-plate');
      box.insertBefore(buildPlate(item, kind, opts.glyph || CFG.glyph), box.firstChild);
    }
    imgEl.decoding = 'async';
    imgEl.referrerPolicy = 'no-referrer';
    var run = function () {
      resolvePoster(item, kind).then(function (p) {
        if (!p) return;
        imgEl.onload = function () { imgEl.classList.add('loaded'); };
        imgEl.onerror = function () { imgEl.removeAttribute('src'); imgEl.classList.remove('loaded'); cset('p:' + keyOf(item, kind), { u: null }); };
        imgEl.src = p.url;
      });
    };
    if (F.flags.offline) return;
    ensureObserver();
    if (!io) { run(); return; }
    pending.set(box || imgEl, run);
    io.observe(box || imgEl);
  }

  global.FestoCovers = {
    attach: attach,
    resolve: resolve,
    configure: function (o) { Object.assign(CFG, o || {}); },
    _pure: { normTitle: normTitle, titleSimilarity: titleSimilarity, isbnOk: isbnOk, chunk: chunk, mapWikiBatch: mapWikiBatch }
  };
})(window);
