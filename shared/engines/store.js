/* ==========================================================================
   FestoStore v3: the app-style shop.
     search + wishlist/list buttons
     FEATURED     horizontal carousel of feature cards
     DEPARTMENTS  a row of icon tiles (tap to filter)
     BROWSE       a list of cards, with price-tier + style filters
   No thumbnails, no checkout: every item opens a retailer SEARCH (no invented SKUs, prices or photos).

     FestoStore.mount(root, cfg)
       cfg = { season, storeName, eyebrow, storageKey, retailers:[...], disclosure,
               categories:[{id,label,icon,color,blurb}],       // icon = Font Awesome name
               items:[{id,cat,title,blurb,tier:1|2|3,tags:[],q,featured}] }
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, h = F.dom.h;
  var TIER = ['', '$', '$$', '$$$'];
  var RETAILERS = { amazon: 'Amazon', etsy: 'Etsy', target: 'Target', walmart: 'Walmart', google: 'Google Shopping' };

  /* ---------- pure ---------- */
  function filterItems(items, f) {
    var q = (f.q || '').toLowerCase().trim();
    return items.filter(function (it) {
      if (f.cat && f.cat !== 'all' && it.cat !== f.cat) return false;
      if (f.tiers && !f.tiers[it.tier]) return false;
      if (f.tag && (it.tags || []).indexOf(f.tag) < 0) return false;
      if (f.onlyWish && f.wish.indexOf(it.id) < 0) return false;
      if (q) {
        var hay = (it.title + ' ' + (it.blurb || '') + ' ' + (it.tags || []).join(' ')).toLowerCase();
        return q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
      }
      return true;
    });
  }
  function sortItems(list, how) {
    var a = list.slice();
    if (how === 'az') a.sort(function (x, y) { return x.title.localeCompare(y.title); });
    else if (how === 'low') a.sort(function (x, y) { return x.tier - y.tier || x.title.localeCompare(y.title); });
    else if (how === 'high') a.sort(function (x, y) { return y.tier - x.tier || x.title.localeCompare(y.title); });
    else a.sort(function (x, y) { return (y.featured ? 1 : 0) - (x.featured ? 1 : 0); });
    return a;
  }
  function buildOutbound(item, retailer) { return F.links.search(retailer, item.q || item.title); }
  function icon(name, extra) { return h('i', { class: 'fa-solid fa-' + name + (extra ? ' ' + extra : '') }); }

  /* ---------- mount ---------- */
  function mount(root, cfg) {
    var key = cfg.storageKey;
    var retailers = cfg.retailers || ['amazon', 'etsy', 'target', 'walmart'];
    var cats = cfg.categories, items = cfg.items, catById = {};
    cats.forEach(function (c) { catById[c.id] = c; });
    var st = {
      cat: 'all', q: '', tiers: { 1: true, 2: true, 3: true }, tag: null, sort: 'featured', onlyWish: false,
      wish: F.store.get(key + '_wish', []), list: F.store.get(key + '_list', [])
    };
    var hashCat = (location.hash || '').replace('#', '');
    if (catById[hashCat]) st.cat = hashCat;

    /* ---- shell of the page ---- */
    var searchInput = h('input', { class: 'fx-input', type: 'search', placeholder: 'Search ' + cfg.storeName, 'aria-label': 'Search the shop' });
    var wishBtn = h('button', { class: 'fx-circle-btn', type: 'button', 'aria-label': 'Wishlist', 'aria-pressed': 'false' }, icon('heart'), h('span', { class: 'fxs-count-dot' }));
    var listBtn = h('button', { class: 'fx-circle-btn', type: 'button', 'aria-label': 'Shopping list' }, icon('basket-shopping'), h('span', { class: 'fxs-count-dot' }));
    var bar = h('div', { class: 'fxs-bar' }, h('div', { class: 'fx-search fx-grow' }, icon('magnifying-glass'), searchInput), wishBtn, listBtn);

    var featuredSec = h('section', { class: 'fx-sec' }), featuredRow = h('div', { class: 'fx-hscroll' });
    featuredSec.appendChild(h('h2', { class: 'fx-sec-title' }, 'Featured'));
    featuredSec.appendChild(featuredRow);
    var deptSec = h('section', { class: 'fx-sec' }), deptRow = h('div', { class: 'fx-tiles' });
    deptSec.appendChild(h('h2', { class: 'fx-sec-title' }, cfg.deptTitle || 'Departments'));
    deptSec.appendChild(deptRow);
    var browseTitle = h('h2', { class: 'fx-sec-title' });
    var tierBox = h('div', { class: 'fx-pills' });
    var sortSel = h('select', { class: 'fx-select fxs-sort', 'aria-label': 'Sort items' },
      h('option', { value: 'featured' }, 'Featured'), h('option', { value: 'az' }, 'A to Z'), h('option', { value: 'low' }, '$ to $$$'), h('option', { value: 'high' }, '$$$ to $'));
    var tagBox = h('div', { class: 'fx-pills fx-pills--scroll' });
    var list = h('div', { class: 'fxs-list' });
    var browseSec = h('section', { class: 'fx-sec' }, browseTitle, h('div', { class: 'fxs-filters' }, tierBox, sortSel), tagBox, list);
    root.appendChild(bar); root.appendChild(featuredSec); root.appendChild(deptSec); root.appendChild(browseSec);
    if (cfg.disclosure) root.appendChild(h('p', { class: 'fx-muted fxs-note' }, cfg.disclosure));
    if (F.shell && F.shell.setAction) F.shell.setAction({ icon: 'magnifying-glass', label: 'Search', onclick: function () { searchInput.focus(); searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); } });

    /* shopping-list modal */
    var listBody = h('div', { class: 'fxs-listbody' });
    var modalEl = h('div', { class: 'fx-modal', 'aria-hidden': 'true', role: 'dialog', 'aria-label': 'Shopping list' },
      h('div', { class: 'fx-modal-card' }, h('button', { class: 'fx-modal-close', type: 'button', 'data-fx-close': '1', 'aria-label': 'Close' }, '×'), h('h3', { class: 'fx-h3' }, 'Shopping list'), listBody));
    document.body.appendChild(modalEl);
    var modal = F.ui.modal(modalEl);

    function saveWish() { F.store.set(key + '_wish', st.wish); }
    function saveList() { F.store.set(key + '_list', st.list); }
    function toggle(arr, id) { var i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1); else arr.push(id); }
    function counts() { var c = { all: items.length }; items.forEach(function (i) { c[i.cat] = (c[i.cat] || 0) + 1; }); return c; }

    /* ---- renderers ---- */
    function renderFeatured() {
      var showing = st.cat === 'all' && !st.q && !st.onlyWish;
      featuredSec.style.display = showing ? '' : 'none';
      if (!showing) return;
      featuredRow.innerHTML = '';
      var picks = items.filter(function (i) { return i.featured; });
      if (picks.length < 3) picks = picks.concat(items.filter(function (i) { return !i.featured; }).slice(0, 4 - picks.length));
      picks.slice(0, 8).forEach(function (it) {
        var c = catById[it.cat] || {};
        featuredRow.appendChild(h('article', { class: 'fx-feature fxs-feature', style: { '--c': c.color || 'var(--fx-accent)' } },
          h('div', { class: 'fx-feature-art' }, icon(c.icon || 'tag')),
          h('div', { class: 'fx-feature-body' },
            h('h3', { class: 'fx-feature-title' }, it.title),
            h('div', { class: 'fxs-meta' }, h('span', null, c.label || ''), h('span', null, TIER[it.tier])),
            h('p', { class: 'fxs-blurb' }, it.blurb || ''),
            h('button', { class: 'fx-btn fx-btn--sm', type: 'button', onclick: function () { toggle(st.list, it.id); saveList(); render(); F.ui.toast(st.list.indexOf(it.id) >= 0 ? 'Added to your list' : 'Removed from your list'); } }, icon(st.list.indexOf(it.id) >= 0 ? 'check' : 'plus'), st.list.indexOf(it.id) >= 0 ? 'Listed' : 'Add'))));
      });
    }
    function renderDepts() {
      var c = counts();
      deptRow.innerHTML = '';
      [{ id: 'all', label: 'All', icon: 'border-all' }].concat(cats).forEach(function (cat) {
        deptRow.appendChild(h('button', { class: 'fx-tile' + (st.cat === cat.id ? ' is-on' : ''), type: 'button', 'aria-pressed': String(st.cat === cat.id), style: { '--c': cat.color || 'var(--fx-accent)' }, onclick: function () { setCat(cat.id); } },
          icon(cat.icon), h('span', null, cat.label), h('small', null, String(c[cat.id] || 0))));
      });
    }
    function renderFilters(forTags) {
      tierBox.innerHTML = '';
      [1, 2, 3].forEach(function (t) {
        tierBox.appendChild(h('button', { class: 'fx-pill' + (st.tiers[t] ? ' is-active' : ''), type: 'button', 'aria-pressed': String(!!st.tiers[t]), 'aria-label': TIER[t] + ' price tier', onclick: function () { st.tiers[t] = !st.tiers[t]; render(); } }, TIER[t]));
      });
      var tally = {};
      forTags.forEach(function (i) { (i.tags || []).forEach(function (t) { tally[t] = (tally[t] || 0) + 1; }); });
      var tags = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; }).slice(0, 12);
      if (st.tag && tags.indexOf(st.tag) < 0) tags.unshift(st.tag);
      tagBox.innerHTML = '';
      tags.forEach(function (t) { tagBox.appendChild(h('button', { class: 'fx-pill' + (st.tag === t ? ' is-active' : ''), type: 'button', onclick: function () { st.tag = st.tag === t ? null : t; render(); } }, t)); });
    }
    function row(it) {
      var cat = catById[it.cat] || {};
      var wished = st.wish.indexOf(it.id) >= 0, listed = st.list.indexOf(it.id) >= 0;
      return h('article', { class: 'fx-listcard fxs-row', style: { '--c': cat.color || 'var(--fx-accent)' } },
        h('div', { class: 'fx-listcard-art' }, icon(cat.icon || 'tag')),
        h('div', { class: 'fxs-text' },
          h('h3', { class: 'fx-listcard-title' }, it.title),
          h('p', { class: 'fxs-blurb' }, it.blurb || ''),
          h('div', { class: 'fxs-meta' }, h('span', null, TIER[it.tier]), (it.tags || []).slice(0, 3).map(function (t) { return h('span', null, t); })),
          h('div', { class: 'fxs-shops' }, retailers.map(function (r) {
            return h('a', { class: 'fxs-shop', href: buildOutbound(it, r), target: '_blank', rel: 'noopener sponsored', title: 'Search ' + (RETAILERS[r] || r) + ' for ' + it.title }, RETAILERS[r] || r);
          }))),
        h('div', { class: 'fxs-acts' },
          h('button', { class: 'fx-circle-btn fxs-act' + (wished ? ' is-on' : ''), type: 'button', 'aria-pressed': String(wished), 'aria-label': (wished ? 'Remove ' : 'Save ') + it.title, onclick: function () { toggle(st.wish, it.id); saveWish(); render(); } }, h('i', { class: 'fa-' + (wished ? 'solid' : 'regular') + ' fa-heart' })),
          h('button', { class: 'fx-circle-btn fxs-act' + (listed ? ' is-on' : ''), type: 'button', 'aria-pressed': String(listed), 'aria-label': (listed ? 'Remove from list: ' : 'Add to list: ') + it.title, onclick: function () { toggle(st.list, it.id); saveList(); render(); F.ui.toast(listed ? 'Removed from your list' : 'Added to your list'); } }, icon(listed ? 'check' : 'plus'))));
    }
    function render() {
      var base = filterItems(items, { cat: st.cat, q: st.q, tiers: st.tiers, tag: null, onlyWish: st.onlyWish, wish: st.wish });
      var shown = sortItems(filterItems(items, { cat: st.cat, q: st.q, tiers: st.tiers, tag: st.tag, onlyWish: st.onlyWish, wish: st.wish }), st.sort);
      renderFeatured(); renderDepts(); renderFilters(base);
      var label = st.cat === 'all' ? 'Browse' : catById[st.cat].label;
      browseTitle.textContent = label + ' · ' + shown.length + (st.q ? ' · "' + st.q + '"' : '') + (st.onlyWish ? ' · saved' : '');
      list.innerHTML = '';
      if (!shown.length) {
        list.appendChild(h('div', { class: 'fx-empty' }, h('div', { class: 'fx-soon-icon' }, icon('magnifying-glass')), h('h3', { class: 'fx-h3' }, st.onlyWish ? 'Nothing saved yet' : 'Nothing matches'),
          h('button', { class: 'fx-btn', type: 'button', onclick: resetFilters }, 'Reset')));
      } else shown.forEach(function (it) { list.appendChild(row(it)); });
      var dots = wishBtn.querySelector('.fxs-count-dot'); dots.textContent = st.wish.length || ''; dots.hidden = !st.wish.length;
      var dot2 = listBtn.querySelector('.fxs-count-dot'); dot2.textContent = st.list.length || ''; dot2.hidden = !st.list.length;
      wishBtn.setAttribute('aria-pressed', String(st.onlyWish)); wishBtn.classList.toggle('is-on', st.onlyWish);
    }
    function setCat(id) {
      st.cat = id; st.tag = null;
      try { history.replaceState(null, '', id === 'all' ? location.pathname + location.search : '#' + id); } catch (e) { /* file:// */ }
      render();
      if (id !== 'all') browseSec.scrollIntoView({ behavior: F.motion.reduced() ? 'auto' : 'smooth', block: 'start' });
    }
    function resetFilters() { st.cat = 'all'; st.q = ''; st.tag = null; st.tiers = { 1: true, 2: true, 3: true }; st.onlyWish = false; searchInput.value = ''; render(); }

    function renderList() {
      listBody.innerHTML = '';
      var chosen = st.list.map(function (id) { return items.filter(function (i) { return i.id === id; })[0]; }).filter(Boolean);
      if (!chosen.length) { listBody.appendChild(h('p', { class: 'fx-muted' }, 'Nothing here yet.')); return; }
      var ul = h('ul', { class: 'fxs-listul' });
      chosen.forEach(function (it) {
        ul.appendChild(h('li', null,
          h('div', null, h('strong', null, it.title), h('div', { class: 'fx-muted', style: { fontSize: '0.8rem' } }, TIER[it.tier] + ' · ' + (catById[it.cat] || {}).label)),
          h('div', { class: 'fx-row' }, retailers.slice(0, 2).map(function (r) { return h('a', { class: 'fx-pill', href: buildOutbound(it, r), target: '_blank', rel: 'noopener sponsored' }, RETAILERS[r] || r); }),
            h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm fx-btn--icon', type: 'button', 'aria-label': 'Remove ' + it.title, onclick: function () { toggle(st.list, it.id); saveList(); renderList(); render(); } }, '×'))));
      });
      listBody.appendChild(ul);
      listBody.appendChild(h('div', { class: 'fx-row', style: { marginTop: '0.8rem' } },
        h('button', { class: 'fx-btn', type: 'button', onclick: function () {
          var text = chosen.map(function (it, n) { return (n + 1) + '. ' + it.title + ' (' + TIER[it.tier] + ')'; }).join('\n');
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { F.ui.toast('List copied'); }, function () { F.ui.toast('Could not copy', { kind: 'warn' }); });
          else F.ui.toast('Copy is not available here', { kind: 'warn' });
        } }, icon('copy'), 'Copy'),
        h('button', { class: 'fx-btn fx-btn--ghost', type: 'button', onclick: function () { st.list = []; saveList(); renderList(); render(); } }, 'Clear')));
    }

    searchInput.addEventListener('input', F.dom.debounce(function () { st.q = searchInput.value; render(); }, 160));
    sortSel.addEventListener('change', function () { st.sort = sortSel.value; render(); });
    wishBtn.addEventListener('click', function () { st.onlyWish = !st.onlyWish; render(); });
    listBtn.addEventListener('click', function () { renderList(); modal.open(); });
    global.addEventListener('hashchange', function () { var c = (location.hash || '').replace('#', ''); if (c !== st.cat && (catById[c] || !c)) { st.cat = c || 'all'; render(); } });
    render();
    return { state: st, render: render, setCat: setCat };
  }

  global.FestoStore = { mount: mount, _pure: { filterItems: filterItems, sortItems: sortItems, buildOutbound: buildOutbound } };
})(window);
