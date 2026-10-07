/* ==========================================================================
   FestoVault: shared helpers for the 8 book/movie vault pages.
   Pills come from the data (so none can match nothing), counts come from the data
   (so no page can claim 1,000 of anything it does not have), and every empty result
   gets an explanation instead of a blank page.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo;

  function prettyTag(key) {
    return String(key).replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  /* Keep the first entry for each id. Logs duplicates so the data can be fixed at the source. */
  function dedupe(dataset) {
    var seen = {}, out = [], dupes = [];
    (dataset || []).forEach(function (x) {
      if (x == null) return;
      if (seen[x.id]) { dupes.push(x.id); return; }
      seen[x.id] = 1; out.push(x);
    });
    if (dupes.length && global.console) console.warn('[FestoVault] dropped duplicate ids:', dupes.join(', '));
    return out;
  }

  function counts(dataset, catKey) {
    catKey = catKey || 'categoryLabel';
    var cats = {};
    dataset.forEach(function (x) { cats[x[catKey] || x.category || '-'] = 1; });
    return { total: dataset.length, categories: Object.keys(cats).length };
  }

  /* <span data-fx-count="total"> / "categories" get filled from the data. */
  function fillCounts(root, c) {
    (root || document).querySelectorAll('[data-fx-count]').forEach(function (el) {
      var k = el.getAttribute('data-fx-count');
      if (k in c) el.textContent = c[k].toLocaleString('en-US');
    });
  }

  /* Pills from tags. `prefer` lists tags the page would like first; each is used only if the data
     really has >= minCount books carrying it. Remaining slots go to distinctive tags (not carried by
     most of the library). Every returned pill therefore has results. */
  function tagPills(dataset, o) {
    o = o || {};
    var minW = o.minWeight || 0.7, minCount = o.minCount || 8, max = o.max || 6, maxShare = o.maxShare || 0.3, tally = {};
    dataset.forEach(function (b) {
      if (!b.tags) return;
      Object.keys(b.tags).forEach(function (t) { if (b.tags[t] >= minW) tally[t] = (tally[t] || 0) + 1; });
    });
    var chosen = [];
    (o.prefer || []).forEach(function (t) { if (tally[t] >= minCount && chosen.indexOf(t) < 0) chosen.push(t); });
    Object.keys(tally).filter(function (t) { return tally[t] >= minCount && tally[t] <= dataset.length * maxShare && chosen.indexOf(t) < 0; })
      .sort(function (a, b) { return tally[b] - tally[a]; })
      .forEach(function (t) { chosen.push(t); });
    return chosen.slice(0, max).map(function (t) { return { key: t, label: prettyTag(t), count: tally[t] }; });
  }
  function filterByTag(dataset, key, minWeight) {
    var w = minWeight || 0.7;
    return dataset.filter(function (b) { return b.tags && b.tags[key] >= w; });
  }

  /* Top categories (for movie sets that have no tags). */
  function categoryPills(dataset, o) {
    o = o || {};
    var max = o.max || 6, tally = {}, label = {};
    dataset.forEach(function (m) {
      var k = m.category; if (!k) return;
      tally[k] = (tally[k] || 0) + 1;
      label[k] = String(m.categoryLabel || k).replace(/^\d+\.\s*/, '');
    });
    return Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; }).slice(0, max)
      .map(function (k) { return { key: k, label: label[k], count: tally[k] }; });
  }

  function emptyState(container, o) {
    o = o || {};
    container.innerHTML = '';
    var box = F.dom.h('div', { class: 'fx-empty', role: 'status' },
      F.dom.h('div', { class: 'fx-soon-icon' }, F.dom.h('i', { class: 'fa-solid fa-' + (o.icon || 'magnifying-glass') })),
      F.dom.h('h3', { class: 'fx-h2' }, o.title || 'Nothing matches that'),
      F.dom.h('p', { class: 'fx-muted' }, o.body || 'Try a different word, or clear the filters.'),
      o.ctaLabel ? F.dom.h('button', { class: 'fx-btn', type: 'button', onclick: o.onCta }, o.ctaLabel) : null);
    container.appendChild(box);
  }

  /* A trailer key shared by 3+ different titles is a placeholder, not a trailer. */
  function trailerIndex(dataset) {
    var map = {};
    dataset.forEach(function (m) {
      if (!m.youtubeTrailerKey) return;
      (map[m.youtubeTrailerKey] = map[m.youtubeTrailerKey] || {})[m.title] = 1;
    });
    var out = {};
    Object.keys(map).forEach(function (k) { out[k] = Object.keys(map[k]).length; });
    return out;
  }
  function trailer(movie, index) {
    var search = F.links.movie(movie).trailer;
    var k = movie.youtubeTrailerKey;
    if (k && (index[k] || 0) < 3) return { mode: 'embed', key: k, url: 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(k), searchUrl: search };
    return { mode: 'search', url: search, searchUrl: search };
  }

  global.FestoVault = {
    prettyTag: prettyTag, dedupe: dedupe, counts: counts, fillCounts: fillCounts,
    tagPills: tagPills, filterByTag: filterByTag, categoryPills: categoryPills,
    emptyState: emptyState, trailerIndex: trailerIndex, trailer: trailer
  };
})(window);
