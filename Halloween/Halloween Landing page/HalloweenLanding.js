/* ==========================================================================
   Halloween Hollow landing ("Midnight Hollow").
   The page is complete as static HTML; this file layers on the live parts:
     - countdown to Halloween + time-of-day greeting
     - tonight's moon phase (and the phase on Halloween night)
     - Cinema posters from the same Wikipedia source + cache as the Cinema page (FestoCovers)
     - a Leaflet mini map centred on the visitor (Festo.geo), with the nearest curated haunts
     - scroll reveals, a pointer-following tile glow, and search that filters the tiles
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, doc = document;
  var S = F.seasons.get('halloween');
  var $ = function (sel, root) { return (root || doc).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
  var reduced = F.motion.reduced();

  /* ---------- links + counts from the season registry ---------- */
  var hub = $('#mh-allseasons');
  if (hub) hub.href = F.url('hub', null, 'choose=1');
  $$('[data-count]').forEach(function (el) {
    var n = S.counts[el.getAttribute('data-count')];
    if (n) el.textContent = (+n).toLocaleString('en-US');
  });

  /* ---------- hero art: on narrow screens keep the moon and chapel (right side) in frame ---------- */
  var heroArt = $('.mh-hero-art');
  if (heroArt && global.matchMedia) {
    var narrow = global.matchMedia('(max-width: 760px)');
    var frameArt = function () {
      heroArt.setAttribute('viewBox', narrow.matches ? '880 0 400 520' : '0 0 1320 520');
      heroArt.setAttribute('preserveAspectRatio', narrow.matches ? 'xMinYMax slice' : 'xMidYMax slice');
    };
    frameArt();
    if (narrow.addEventListener) narrow.addEventListener('change', frameArt);
  }

  /* ---------- greeting ---------- */
  function greeting(d) {
    var h = d.getHours();
    return h < 5 ? 'Witching hour' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }
  $('#mh-greeting').textContent = greeting(F.now());

  /* ---------- countdown (to local midnight starting Oct 31; "It's Halloween!" all day) ---------- */
  var cdEls = {}; $$('[data-cd]').forEach(function (b) { cdEls[b.getAttribute('data-cd')] = b; });
  var cdBox = $('.mh-count'), cdLabel = $('#mh-count-label');
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var now = F.now(), y = now.getFullYear(), spec = S.countdown;
    var start = new Date(y, spec.month - 1, spec.day), end = new Date(y, spec.month - 1, spec.day + 1);
    var today = now >= start && now < end;
    var target = today ? end : (now < start ? start : new Date(y + 1, spec.month - 1, spec.day));
    var s = Math.max(0, Math.floor((target - now) / 1000));
    cdEls.d.textContent = Math.floor(s / 86400);
    cdEls.h.textContent = pad(Math.floor(s % 86400 / 3600));
    cdEls.m.textContent = pad(Math.floor(s % 3600 / 60));
    cdEls.s.textContent = pad(s % 60);
    cdBox.classList.toggle('is-today', today);
    cdLabel.textContent = today ? spec.todayLabel + ' · ends in' : "Until All Hallows' Eve";
  }
  tick();
  var cdTimer = setInterval(tick, 1000);
  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden) { clearInterval(cdTimer); cdTimer = null; }
    else if (!cdTimer) { tick(); cdTimer = setInterval(tick, 1000); }
  });

  /* ---------- moon ---------- */
  var SYN = 29.530588853, REF = Date.UTC(2000, 0, 6, 18, 14);
  function phase(d) { var a = ((d - REF) / 864e5) % SYN; if (a < 0) a += SYN; return a / SYN; }
  function phaseName(p) {
    return p < 0.03 || p > 0.97 ? 'New moon' : p < 0.22 ? 'Waxing crescent' : p < 0.28 ? 'First quarter' : p < 0.47 ? 'Waxing gibbous'
      : p < 0.53 ? 'Full moon' : p < 0.72 ? 'Waning gibbous' : p < 0.78 ? 'Last quarter' : 'Waning crescent';
  }
  /* lit part of a disc centred at c with radius r: outer limb arc + terminator half-ellipse */
  function litPath(p, c, r) {
    var rx = (Math.abs(Math.cos(2 * Math.PI * p)) * r).toFixed(2);
    var limb = p < 0.5 ? 1 : 0, term = p < 0.5 ? (p < 0.25 ? 0 : 1) : (p > 0.75 ? 1 : 0);
    return 'M' + c + ' ' + (c - r) + 'A' + r + ' ' + r + ' 0 0 ' + limb + ' ' + c + ' ' + (c + r) + 'A' + rx + ' ' + r + ' 0 0 ' + term + ' ' + c + ' ' + (c - r) + 'Z';
  }
  (function moon() {
    var now = F.now(), p = phase(now), pct = Math.round((1 - Math.cos(2 * Math.PI * p)) / 2 * 100);
    var hy = now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() > 31) ? now.getFullYear() + 1 : now.getFullYear();
    $('#mh-moon-lit').setAttribute('d', litPath(p, 66, 50));
    $('#mh-moon-name').textContent = phaseName(p);
    $('#mh-moon-pct').textContent = pct + '%';
    $('#mh-moon-hallow').textContent = phaseName(phase(new Date(hy, 9, 31, 21)));
    var fill = $('#mh-moon-fill');
    requestAnimationFrame(function () { fill.style.width = pct + '%'; });
  })();

  /* ---------- Cinema posters (same items + source as the Cinema page) ---------- */
  var FILMS = [
    { title: 'Hocus Pocus', year: '1993', rating: 7.2, tag: 'Cosy', wikiSlug: 'Hocus_Pocus_(1993_film)' },
    { title: 'Halloween', year: '1978', rating: 7.6, tag: 'Classic', wikiSlug: 'Halloween_(1978_film)' },
    { title: 'The Nightmare Before Christmas', year: '1993', rating: 7.8, tag: 'Stop-motion', wikiSlug: 'The_Nightmare_Before_Christmas' },
    { title: 'Coraline', year: '2009', rating: 7.9, tag: 'Stop-motion', wikiSlug: 'Coraline_(film)' },
    { title: 'Beetlejuice', year: '1988', rating: 7.4, tag: 'Gothic', wikiSlug: 'Beetlejuice' },
    { title: 'The Shining', year: '1980', rating: 8.4, tag: 'Haunted', wikiSlug: 'The_Shining_(film)' }
  ];
  var cinemaUrl = F.url('halloween', 'movies'), h = F.dom.h;
  var posters = $('#mh-posters');
  FILMS.forEach(function (m) {
    var img = h('img', { alt: m.title + ' poster', width: '256', height: '384' });
    var card = h('a', { class: 'pst', href: cinemaUrl },
      h('span', { class: 'im' }, img, h('span', { class: 'rate' }, '★ ' + m.rating.toFixed(1))),
      h('span', { class: 'cap' }, m.title),
      h('span', { class: 'yr' }, m.year + ' · ' + m.tag));
    posters.appendChild(card);
    if (global.FestoCovers) global.FestoCovers.attach(img, m, 'movie');
  });

  /* ---------- scroll reveal + pointer glow ---------- */
  var rv = $$('.rv');
  if (!reduced && 'IntersectionObserver' in global) {
    var io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        el.style.setProperty('--rd', (batch++ * 0.07) + 's');
        el.classList.add('is-in');
        /* hand the element back to its own hover transitions once it has arrived */
        setTimeout(function () { el.classList.remove('rv', 'is-in'); el.style.removeProperty('--rd'); }, 1100 + batch * 70);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.remove('rv'); });
  }
  if (!reduced && global.matchMedia && global.matchMedia('(hover: hover)').matches) {
    $$('.tile').forEach(function (t) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        t.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        t.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
      t.addEventListener('pointerleave', function () { t.style.removeProperty('--mx'); t.style.removeProperty('--my'); });
    });
  }

  /* ---------- search: dims tiles that do not match, Enter opens the best match ---------- */
  var form = $('#mh-search'), q = $('#mh-q'), hint = $('#mh-search-hint'), matchEl = $('#mh-match');
  var tiles = $$('#mh-grid > .tile');
  function tileHref(t) { var a = t.matches('a') ? t : $('a', t); return a ? a.href : null; }
  function filter() {
    var words = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean), hits = [];
    tiles.forEach(function (t) {
      var keys = (t.getAttribute('data-keys') || '') + ' ' + t.textContent.toLowerCase();
      var ok = !words.length || words.every(function (w) { return keys.indexOf(w) >= 0; });
      t.classList.toggle('is-dim', !ok);
      t.classList.toggle('is-hit', !!words.length && ok);
      if (ok) hits.push(t);
    });
    if (!words.length) { matchEl.textContent = '08 destinations'; hint.textContent = ''; return hits; }
    matchEl.textContent = pad(hits.length) + ' match' + (hits.length === 1 ? '' : 'es');
    hint.textContent = hits.length ? hits.length + ' matching destinations. Press Enter to open the first.' : 'No matches. Try films, books, haunts or playlists.';
    return hits;
  }
  q.addEventListener('input', filter);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var hits = filter();
    if (hits.length && q.value.trim()) global.location.href = tileHref(hits[0]);
  });
  q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { q.value = ''; filter(); q.blur(); } });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (doc.activeElement && doc.activeElement.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || (doc.activeElement && doc.activeElement.isContentEditable)) return;
    if (form.offsetParent === null) return;
    e.preventDefault(); q.focus();
  });

  /* ---------- Spectral Map mini map ---------- */
  var MAP = global.HALLOWEEN_MAP || { categories: [], places: [] };
  var catColor = {}; MAP.categories.forEach(function (c) { catColor[c.id] = c.color; });
  var mapEl = $('#mh-map'), mapLink = $('#mh-map-link'), info = $('.map-info');
  var geoLabel = $('#mh-geo-label'), geoSub = $('#mh-geo-sub'), locBtn = $('#mh-locate');
  var mapUrl = F.url('halloween', 'map');
  var map = null, layer = null, leafletState = 'idle', leafletWaiters = [], loc = null;

  function km2mi(k) { return k * 0.621371; }
  function fmtMi(k) { var m = km2mi(k); return m < 10 ? m.toFixed(1) + ' mi' : Math.round(m).toLocaleString('en-US') + ' mi'; }
  function coords(l) { return Math.abs(l.lat).toFixed(2) + '° ' + (l.lat >= 0 ? 'N' : 'S') + ' · ' + Math.abs(l.lon).toFixed(2) + '° ' + (l.lon >= 0 ? 'E' : 'W'); }
  /* "live" = the visitor's own position (now, or saved from an earlier visit); a city picked on the Spectral Map keeps its name */
  function isLive(l) { return !!l && (l.source === 'device' || (l.source === 'saved' && l.label === 'Your location')); }
  function placeName(l) { return (l && l.label && l.label !== 'Your location') ? l.label : 'Salem, MA'; }

  function loadLeaflet(cb) {
    if (global.L) return cb(true);
    leafletWaiters.push(cb);
    if (leafletState === 'loading') return;
    leafletState = 'loading';
    var s = doc.createElement('script');
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    s.crossOrigin = '';
    s.onload = function () { leafletState = 'ready'; leafletWaiters.splice(0).forEach(function (f) { f(true); }); };
    s.onerror = function () { leafletState = 'failed'; leafletWaiters.splice(0).forEach(function (f) { f(false); }); };
    doc.head.appendChild(s);
  }

  function nearby(l) {
    return MAP.places.map(function (p) { return { p: p, km: F.geo.haversine(l, { lat: p.lat, lon: p.lon }) }; })
      .sort(function (a, b) { return a.km - b.km; });
  }

  function pinIcon(color) {
    return global.L.divIcon({
      className: '', iconSize: [26, 34], iconAnchor: [13, 34],
      html: '<svg class="mh-pin" viewBox="0 0 30 38" aria-hidden="true"><path d="M15 37s13-12 13-22A13 13 0 0 0 2 15c0 10 13 22 13 22z" fill="' + color + '" stroke="#07141a" stroke-width="2"/><circle cx="15" cy="15" r="5" fill="#07141a"/></svg>'
    });
  }

  function render() {
    if (!loc) return;
    var live = isLive(loc), list = nearby(loc), close = list.filter(function (x) { return x.km <= 40; });
    info.classList.toggle('is-live', live);
    $$('[data-place]').forEach(function (el) { el.textContent = live ? el.getAttribute('data-place-live') : placeName(loc); });
    geoLabel.textContent = live ? 'You are here' : placeName(loc);
    if (close.length) geoSub.textContent = close.length + ' haunt' + (close.length === 1 ? '' : 's') + ' within 25 mi · ' + coords(loc);
    else if (list.length) geoSub.textContent = 'Nearest: ' + list[0].p.name.replace(/\s*\(.*\)$/, '') + ' · ' + fmtMi(list[0].km);
    else geoSub.textContent = coords(loc);
    mapLink.href = live ? mapUrl + '?near=me' : mapUrl;
    $$('.map-chips .chip-link').forEach(function (a) { a.href = mapUrl + '?cat=' + a.getAttribute('data-cat') + (live ? '&near=me' : ''); });
    locBtn.hidden = live;

    if (!map || !global.L) return;
    var L = global.L;
    if (layer) layer.remove();
    layer = L.layerGroup().addTo(map);
    var shown = (close.length ? close : list.slice(0, 1)).slice(0, 8);
    shown.forEach(function (x) { L.marker([x.p.lat, x.p.lon], { icon: pinIcon(catColor[x.p.cat] || '#2ec4b6'), keyboard: false, interactive: false }).addTo(layer); });
    L.marker([loc.lat, loc.lon], { icon: L.divIcon({ className: '', iconSize: [18, 18], iconAnchor: [9, 9], html: '<div class="mh-me' + (live ? '' : ' is-default') + '"></div>' }), keyboard: false, interactive: false, zIndexOffset: 1000 }).addTo(layer);
    if (close.length) {
      var b = L.latLngBounds([[loc.lat, loc.lon]].concat(shown.map(function (x) { return [x.p.lat, x.p.lon]; })));
      map.fitBounds(b.pad(0.25), { maxZoom: 14, animate: !reduced });
    } else {
      map.setView([loc.lat, loc.lon], 12, { animate: !reduced });
    }
  }

  function buildMap() {
    loadLeaflet(function (ok) {
      if (!ok || map) { render(); return; }
      var L = global.L;
      map = L.map(mapEl, { zoomControl: false, attributionControl: true, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false, tap: false, zoomSnap: 0.25, fadeAnimation: !reduced, zoomAnimation: !reduced });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(map);
      map.setView([loc.lat, loc.lon], 12);
      render();
    });
  }

  function setLoc(l) { loc = l; render(); }

  /* saved or season default first (no prompt), then the device if permission is already granted */
  F.geo.get({ season: 'halloween' }).then(function (l) {
    setLoc(l);
    if (navigator.permissions && navigator.permissions.query && !isLive(l)) {
      navigator.permissions.query({ name: 'geolocation' }).then(function (r) {
        if (r.state === 'granted') F.geo.get({ ask: true, season: 'halloween' }).then(setLoc);
      }).catch(function () {});
    }
  });

  locBtn.addEventListener('click', function () {
    locBtn.disabled = true; locBtn.lastElementChild.textContent = 'Finding you…';
    F.geo.get({ ask: true, season: 'halloween' }).then(function (l) {
      locBtn.disabled = false;
      if (isLive(l)) { setLoc(l); return; }
      locBtn.lastElementChild.textContent = 'Location is off';
      geoSub.textContent = 'Allow location in your browser to see haunts near you';
      setTimeout(function () { locBtn.lastElementChild.textContent = 'Use my location'; }, 3200);
    });
  });

  /* load Leaflet + tiles only when the map is about to scroll into view */
  if ('IntersectionObserver' in global) {
    var mio = new IntersectionObserver(function (en) {
      if (en.some(function (e) { return e.isIntersecting; })) { mio.disconnect(); var wait = function () { if (loc) buildMap(); else setTimeout(wait, 100); }; wait(); }
    }, { rootMargin: '300px 0px' });
    mio.observe(mapEl);
  } else {
    var wait0 = function () { if (loc) buildMap(); else setTimeout(wait0, 100); }; wait0();
  }
})(window);
