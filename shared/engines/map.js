/* ==========================================================================
   FestoMap: Leaflet map + sidebar of category cards (icon, count, checkbox, colour),
   a distance slider, pins, a detail card with Directions, geolocation, curated places
   plus an optional "search this area" on OpenStreetMap (Overpass).

     FestoMap.mount(root, cfg)
       cfg = { season, tiles:'dark'|'light', center:{lat,lon,zoom}, storageKey,
               categories:[{id,label,icon,color,osm:[{k,v,name}]}],
               places:[{id,cat,name,lat,lon,desc,address,url,note,tags}],
               listTitle, allowOsm }

   URL params: ?cat=a,b  ?near=me  ?id=<place>
   If Leaflet or the tiles cannot load, the list becomes the main view, so it never goes blank.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, h = F.dom.h;
  var MI = 1609.344;

  /* ---------- pure helpers (node-testable) ---------- */
  function bboxFor(lat, lon, miles) {
    var dLat = miles / 69, dLon = miles / (69 * Math.max(0.2, Math.cos(lat * Math.PI / 180)));
    return { s: lat - dLat, n: lat + dLat, w: lon - dLon, e: lon + dLon };
  }
  function buildOverpass(cats, bb, limit) {
    var box = '(' + [bb.s, bb.w, bb.n, bb.e].map(function (v) { return v.toFixed(5); }).join(',') + ')', lines = [];
    cats.forEach(function (c) {
      (c.osm || []).forEach(function (o) {
        var sel = 'nwr["' + o.k + '"~"^(' + o.v + ')$"]' + (o.name ? '["name"~"' + o.name + '",i]' : '') + box + ';';
        lines.push('  ' + sel);
      });
    });
    return '[out:json][timeout:25];\n(\n' + lines.join('\n') + '\n);\nout tags center ' + (limit || 80) + ';';
  }
  function matchCategory(cats, tags) {
    for (var i = 0; i < cats.length; i++) {
      var osm = cats[i].osm || [];
      for (var j = 0; j < osm.length; j++) {
        var o = osm[j];
        if (tags[o.k] != null && new RegExp('^(' + o.v + ')$').test(tags[o.k]) && (!o.name || new RegExp(o.name, 'i').test(tags.name || ''))) return cats[i].id;
      }
    }
    return null;
  }
  function parseOverpass(json, cats) {
    var out = [], seen = {};
    (json.elements || []).forEach(function (el) {
      var tags = el.tags || {}, lat = el.lat != null ? el.lat : el.center && el.center.lat, lon = el.lon != null ? el.lon : el.center && el.center.lon;
      if (lat == null || lon == null) return;
      var cat = matchCategory(cats, tags);
      if (!cat) return;
      var id = 'osm-' + el.type + '-' + el.id;
      if (seen[id]) return;
      seen[id] = 1;
      var addr = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean).join(' ');
      var bits = [];
      if (tags.opening_hours) bits.push('Hours: ' + tags.opening_hours);
      if (tags.phone) bits.push('Phone: ' + tags.phone);
      out.push({ id: id, cat: cat, name: tags.name || cats.filter(function (c) { return c.id === cat; })[0].label, lat: lat, lon: lon, address: addr, desc: bits.join(' · '), url: tags.website || tags['contact:website'] || '', source: 'osm' });
    });
    return out;
  }
  function withDistance(places, origin) {
    return places.map(function (p) { p.km = origin ? F.geo.haversine(origin, p) : null; return p; });
  }
  function dirLinks(dest, origin) {
    var d = dest.lat + ',' + dest.lon, o = origin ? origin.lat + ',' + origin.lon : '';
    return {
      google: 'https://www.google.com/maps/dir/?api=1&destination=' + d + (o ? '&origin=' + o : ''),
      osm: 'https://www.openstreetmap.org/directions?from=' + o + '&to=' + d,
      apple: 'https://maps.apple.com/?daddr=' + d + (o ? '&saddr=' + o : '')
    };
  }
  function fmtDur(sec) { var m = Math.round(sec / 60); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min'; }

  /* ---------- Leaflet loader ---------- */
  function haveLeaflet() { return !!global.L && !!global.L.map; }

  /* ---------- mount ---------- */
  function mount(root, cfg) {
    var cats = cfg.categories, catById = {}, store = cfg.storageKey;
    cats.forEach(function (c) { catById[c.id] = c; });
    var params = new URLSearchParams(location.search);
    var wantCats = (params.get('cat') || '').split(',').filter(function (c) { return catById[c]; });
    var st = {
      active: {}, q: '', radiusMi: 25, limit: false, origin: null, osm: [], selected: params.get('id') || null,
      saved: F.store.get(store + '_saved', []), mode: 'walk', route: null, tab: 'filters'
    };
    cats.forEach(function (c) { st.active[c.id] = wantCats.length ? wantCats.indexOf(c.id) >= 0 : true; });
    var imperial = F.store.get('festo_units', 'imperial') === 'imperial';

    /* ----- DOM ----- */
    var searchInput = h('input', { class: 'fx-input', type: 'search', placeholder: 'Search places or a city', 'aria-label': 'Search places or a city', autocomplete: 'off' });
    var suggest = h('ul', { class: 'fxwx-results', hidden: '' });
    var sideToggle = h('button', { class: 'fx-btn fx-btn--ghost fx-sidebar-toggle', type: 'button', 'aria-expanded': 'false' }, h('i', { class: 'fa-solid fa-sliders' }), 'Filters');
    var topbar = h('div', { class: 'fxm-top' }, h('div', { class: 'fxwx-search fx-grow' }, h('div', { class: 'fx-search' }, h('i', { class: 'fa-solid fa-magnifying-glass' }), searchInput), suggest), sideToggle);

    var masterSwitch = h('input', { type: 'checkbox', checked: '', 'aria-label': 'Toggle all categories' });
    var catList = h('ul', { class: 'fx-catlist' });
    var slider = h('input', { class: 'fx-range', type: 'range', min: '5', max: '50', value: String(st.radiusMi), 'aria-label': 'Maximum distance in miles' });
    var sliderVal = h('output', { class: 'fxm-sliderval' }, st.radiusMi + ' mi');
    var limitBox = h('input', { class: 'fx-check', type: 'checkbox', id: 'fxm-limit' });
    var originEl = h('div', { class: 'fxm-origin' });
    var locBtn = h('button', { class: 'fx-btn fx-btn--sm', type: 'button' }, h('i', { class: 'fa-solid fa-location-crosshairs' }), 'Use my location');
    var areaBtn = h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm', type: 'button' }, h('i', { class: 'fa-solid fa-magnifying-glass-location' }), 'Search this area');
    var filtersPane = h('div', { class: 'fxm-pane' },
      h('div', { class: 'fx-sidebar-head' }, h('span', { class: 'fx-sidebar-title' }, cfg.filterTitle || 'Filters'), h('label', { class: 'fx-switch' }, masterSwitch, h('span'))),
      catList,
      h('div', { class: 'fxm-slider' }, h('div', { class: 'fx-row' }, h('strong', { class: 'fx-grow' }, 'Max distance'), sliderVal), slider, h('div', { class: 'fx-muted fxm-range' }, h('span', null, '5 mi'), h('span', null, '50 mi')),
        h('label', { class: 'fxs-check', for: 'fxm-limit' }, limitBox, h('span', null, 'Only show places inside this distance'))),
      originEl, h('div', { class: 'fx-row' }, locBtn, areaBtn),
      Object.keys(cfg.searchLinks || {}).length ? h('div', { class: 'fxm-links' }, Object.keys(cfg.searchLinks).map(function (k) { var l = cfg.searchLinks[k]; return h('a', { class: 'fx-pill', href: l.url, target: '_blank', rel: 'noopener' }, h('i', { class: 'fa-solid fa-arrow-up-right-from-square' }), l.label); })) : null,
      h('p', { class: 'fx-muted fxs-note', id: 'fxm-note' }, ''));
    var resultsPane = h('div', { class: 'fxm-pane', hidden: '' });
    var tabFilters = h('button', { class: 'fx-pill is-active', type: 'button', role: 'tab' }, 'Filters');
    var tabResults = h('button', { class: 'fx-pill', type: 'button', role: 'tab' }, 'Results');
    var sidebar = h('aside', { class: 'fx-sidebar fxm-sidebar', 'aria-label': 'Map filters and results' }, h('div', { class: 'fx-pills' }, tabFilters, tabResults), filtersPane, resultsPane);

    var mapEl = h('div', { class: 'fxm-map', role: 'region', 'aria-label': (cfg.title || 'Map') });
    var detail = h('div', { class: 'fxm-detail', hidden: '' });
    var banner = h('div', { class: 'fxm-banner', hidden: '', role: 'status' });
    var stage = h('div', { class: 'fxm-stage' }, mapEl, banner, detail);
    root.appendChild(topbar);
    root.appendChild(h('div', { class: 'fx-layout fxm-layout' }, sidebar, stage));
    var drawer = F.ui.sidebar(sideToggle, sidebar);
    if (F.shell && F.shell.setAction) F.shell.setAction({ icon: 'magnifying-glass', label: 'Search', onclick: function () { searchInput.focus(); } });

    /* ----- Leaflet ----- */
    var map = null, pinLayer = null, routeLayer = null, originMarker = null, ring = null, markers = {};
    if (haveLeaflet()) {
      try {
        map = L.map(mapEl, { zoomControl: false, attributionControl: true });
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        // Keyless standard OpenStreetMap tiles (CARTO's free styles now return an API-key watermark).
        // Pass cfg.tileUrl / cfg.tileAttribution to use a keyed provider. Please respect the OSM tile usage policy.
        var tileUrl = cfg.tileUrl || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
        var tl = L.tileLayer(tileUrl, { maxZoom: 19, attribution: cfg.tileAttribution || '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' });
        if (cfg.tiles !== 'light') stage.classList.add('fxm-dark');
        var tileErrors = 0;
        tl.on('tileerror', function () { tileErrors++; if (tileErrors === 6) say('Map tiles are not loading (offline?). The list on the left still works.', 'warn'); });
        tl.addTo(map);
        pinLayer = L.layerGroup().addTo(map);
        routeLayer = L.layerGroup().addTo(map);
        map.setView([cfg.center.lat, cfg.center.lon], cfg.center.zoom || 5);
      } catch (e) { map = null; }
    }
    if (!map) {
      mapEl.appendChild(h('div', { class: 'fx-empty' }, h('div', { class: 'fx-soon-icon' }, h('i', { class: 'fa-solid fa-map' })), h('h3', { class: 'fx-h3' }, 'The map could not load'), h('p', { class: 'fx-muted' }, 'The list still works.')));
      mapEl.classList.add('is-fallback'); setTab('results');
    }

    /* ----- helpers ----- */
    function say(msg, kind) { banner.textContent = msg || ''; banner.hidden = !msg; banner.className = 'fxm-banner' + (kind ? ' is-' + kind : ''); if (msg && kind !== 'sticky') setTimeout(function () { if (banner.textContent === msg) banner.hidden = true; }, 6500); }
    function dist(km) { return km == null ? '' : F.util.fmtDist(km, imperial); }
    function allPlaces() { return withDistance((cfg.places || []).concat(st.osm), st.origin); }
    function visible() {
      var q = st.q.toLowerCase().trim();
      return allPlaces().filter(function (p) {
        if (!st.active[p.cat]) return false;
        if (st.limit && p.km != null && p.km > st.radiusMi * MI / 1000) return false;
        if (q && (p.name + ' ' + (p.desc || '') + ' ' + (p.address || '')).toLowerCase().indexOf(q) < 0) return false;
        return true;
      }).sort(function (a, b) { return (a.km == null ? 1e9 : a.km) - (b.km == null ? 1e9 : b.km); });
    }
    function setTab(t) {
      st.tab = t; filtersPane.hidden = t !== 'filters'; resultsPane.hidden = t !== 'results';
      tabFilters.classList.toggle('is-active', t === 'filters'); tabResults.classList.toggle('is-active', t === 'results');
    }
    function getPlace(id) { return allPlaces().filter(function (p) { return p.id === id; })[0]; }

    /* ----- renderers ----- */
    function renderCats() {
      var base = allPlaces().filter(function (p) { return !(st.limit && p.km != null && p.km > st.radiusMi * MI / 1000); });
      catList.innerHTML = '';
      cats.forEach(function (c) {
        var n = base.filter(function (p) { return p.cat === c.id; }).length;
        var cb = h('input', { class: 'fx-check', type: 'checkbox', checked: st.active[c.id] ? '' : null, 'aria-label': 'Show ' + c.label, onchange: function (e) { st.active[c.id] = e.target.checked; update(true); } });
        catList.appendChild(h('li', null, h('label', { class: 'fx-catcard' + (st.active[c.id] ? '' : ' is-off'), style: { '--c': c.color } },
          h('span', { class: 'fx-cat-ico' }, h('i', { class: 'fa-solid fa-' + c.icon })),
          h('span', { class: 'fx-cat-text' }, h('div', { class: 'fx-cat-name' }, c.label), h('div', { class: 'fx-cat-sub' }, n + (n === 1 ? ' location' : ' locations'))),
          cb)));
      });
      masterSwitch.checked = cats.every(function (c) { return st.active[c.id]; });
    }
    function renderOrigin() {
      originEl.innerHTML = '';
      originEl.appendChild(h('div', { class: 'fx-muted' }, h('i', { class: 'fa-solid fa-location-dot' }), ' From ', h('strong', null, st.origin ? st.origin.label : '…'),
        st.origin && st.origin.source === 'default' ? ' (default)' : ''));
    }
    function renderResults(list) {
      resultsPane.innerHTML = '';
      resultsPane.appendChild(h('div', { class: 'fx-muted fxs-count' }, list.length + (list.length === 1 ? ' place' : ' places')));
      if (!list.length) { resultsPane.appendChild(h('p', { class: 'fx-muted' }, 'Nothing matches. Try more categories or search this area.')); return; }
      var ul = h('ul', { class: 'fxm-results' });
      list.slice(0, 120).forEach(function (p) {
        var c = catById[p.cat];
        ul.appendChild(h('li', null, h('button', { type: 'button', class: 'fxm-item' + (st.selected === p.id ? ' is-on' : ''), style: { '--c': c.color }, onclick: function () { select(p.id, { pan: true }); drawer.close(); } },
          h('span', { class: 'fxm-item-ico' }, h('i', { class: 'fa-solid fa-' + c.icon })),
          h('span', { class: 'fxm-item-text' }, h('strong', null, p.name), h('span', { class: 'fx-muted' }, c.label + (p.address ? ' · ' + p.address : ''))),
          h('span', { class: 'fxm-item-dist' }, dist(p.km)))));
      });
      resultsPane.appendChild(ul);
    }
    function pinIcon(p, on) {
      var c = catById[p.cat];
      return L.divIcon({ className: 'fxm-pin-wrap', html: '<div class="fxm-pin' + (on ? ' is-on' : '') + '" style="--c:' + c.color + '"><span><i class="fa-solid fa-' + c.icon + '"></i></span></div>', iconSize: [44, 56], iconAnchor: [22, 54] });
    }
    function renderPins(list, fit) {
      if (!map) return;
      pinLayer.clearLayers(); markers = {};
      list.forEach(function (p) {
        var m = L.marker([p.lat, p.lon], { icon: pinIcon(p, st.selected === p.id), title: p.name, keyboard: true, riseOnHover: true });
        m.on('click', function () { select(p.id, { pan: false }); });
        m.addTo(pinLayer); markers[p.id] = m;
      });
      if (fit && list.length) {
        var pts = list.slice(0, 40).map(function (p) { return [p.lat, p.lon]; });
        if (st.origin && st.origin.source !== 'default') pts.push([st.origin.lat, st.origin.lon]);
        map.fitBounds(L.latLngBounds(pts).pad(0.18), { maxZoom: 12, animate: !F.motion.reduced() });
      }
    }
    function renderOriginMarker() {
      if (!map || !st.origin) return;
      if (originMarker) map.removeLayer(originMarker);
      if (ring) map.removeLayer(ring);
      if (st.origin.source !== 'default') {
        originMarker = L.circleMarker([st.origin.lat, st.origin.lon], { radius: 8, color: '#fff', weight: 3, fillColor: '#2f80ed', fillOpacity: 1 }).addTo(map).bindTooltip('You are here');
        if (st.limit) ring = L.circle([st.origin.lat, st.origin.lon], { radius: st.radiusMi * MI, color: '#2f80ed', weight: 1, fillOpacity: 0.04, dashArray: '6 6' }).addTo(map);
      }
    }
    function renderDetail() {
      detail.innerHTML = '';
      var p = st.selected && getPlace(st.selected);
      if (!p) { detail.hidden = true; return; }
      detail.hidden = false;
      var c = catById[p.cat], links = dirLinks(p, st.origin && st.origin.source !== 'default' ? st.origin : null);
      var saved = st.saved.indexOf(p.id) >= 0;
      var modeBtn = function (m, icon, label) { return h('button', { class: 'fx-pill' + (st.mode === m ? ' is-active' : ''), type: 'button', onclick: function () { st.mode = m; if (st.route && st.route.id === p.id) routeTo(p); else renderDetail(); } }, h('i', { class: 'fa-solid ' + icon }), label); };
      detail.appendChild(h('div', { class: 'fxm-detail-art', style: { '--c': c.color } }, h('i', { class: 'fa-solid fa-' + c.icon })));
      detail.appendChild(h('div', { class: 'fxm-detail-body' },
        h('div', { class: 'fx-row' }, h('span', { class: 'fx-badge', style: { color: c.color } }, c.label), p.km != null ? h('span', { class: 'fx-badge' }, dist(p.km) + ' away') : null, p.source === 'osm' ? h('span', { class: 'fx-badge' }, 'OpenStreetMap') : h('span', { class: 'fx-badge' }, 'Featured')),
        h('h3', { class: 'fxm-detail-name' }, p.name),
        p.address ? h('div', { class: 'fx-muted' }, p.address) : null,
        h('p', { class: 'fxm-detail-desc' }, p.desc || ''),
        p.note ? h('p', { class: 'fx-muted fxm-detail-note' }, p.note) : null,
        st.route && st.route.id === p.id ? h('div', { class: 'fxm-route' }, h('i', { class: 'fa-solid fa-route' }), ' ' + (st.route.approx ? 'About ' : '') + dist(st.route.km) + (st.route.sec ? ' · ' + fmtDur(st.route.sec) : '') + ' by ' + st.mode + (st.route.approx ? ' (straight line)' : '')) : null,
        h('div', { class: 'fx-pills' }, modeBtn('walk', 'fa-person-walking', 'Walk'), modeBtn('bike', 'fa-bicycle', 'Bike'), modeBtn('car', 'fa-car', 'Drive')),
        h('div', { class: 'fx-row' },
          h('button', { class: 'fx-btn', type: 'button', onclick: function () { routeTo(p); } }, h('i', { class: 'fa-solid fa-diamond-turn-right' }), 'Directions'),
          h('a', { class: 'fx-btn fx-btn--ghost', href: links.google, target: '_blank', rel: 'noopener' }, 'Google Maps'),
          h('a', { class: 'fx-btn fx-btn--ghost', href: links.osm, target: '_blank', rel: 'noopener' }, 'OSM'),
          p.url ? h('a', { class: 'fx-btn fx-btn--ghost', href: p.url, target: '_blank', rel: 'noopener' }, 'Website') : null,
          h('button', { class: 'fx-btn fx-btn--ghost fx-btn--icon', type: 'button', 'aria-label': saved ? 'Remove from saved' : 'Save place', 'aria-pressed': String(saved), onclick: function () { var i = st.saved.indexOf(p.id); if (i >= 0) st.saved.splice(i, 1); else st.saved.push(p.id); F.store.set(store + '_saved', st.saved); renderDetail(); } }, h('i', { class: 'fa-' + (saved ? 'solid' : 'regular') + ' fa-heart' })),
          h('button', { class: 'fx-btn fx-btn--ghost fx-btn--icon', type: 'button', 'aria-label': 'Copy link to this place', onclick: function () { copyLink(p); } }, h('i', { class: 'fa-solid fa-link' })))));
      detail.appendChild(h('button', { class: 'fxm-detail-close fx-modal-close', type: 'button', 'aria-label': 'Close details', onclick: function () { select(null); } }, '×'));
    }
    function copyLink(p) {
      var url = location.origin && location.origin !== 'null' ? location.origin + location.pathname + '?id=' + encodeURIComponent(p.id) : location.href.split('?')[0] + '?id=' + encodeURIComponent(p.id);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { F.ui.toast('Link copied'); }, function () { F.ui.toast('Could not copy', { kind: 'warn' }); });
      else F.ui.toast('Copy is not available here', { kind: 'warn' });
    }

    /* ----- actions ----- */
    function select(id, o) {
      o = o || {};
      var prev = st.selected;
      st.selected = id;
      if (st.route && st.route.id !== id) { st.route = null; if (routeLayer) routeLayer.clearLayers(); }
      if (map) {
        if (prev && markers[prev]) { var pp = getPlace(prev); if (pp) markers[prev].setIcon(pinIcon(pp, false)); }
        if (id && markers[id]) { var np = getPlace(id); markers[id].setIcon(pinIcon(np, true)); if (o.pan) map.flyTo([np.lat, np.lon], Math.max(map.getZoom(), 13), { animate: !F.motion.reduced(), duration: 0.8 }); }
        else if (id && o.pan !== false) { var q = getPlace(id); if (q) map.flyTo([q.lat, q.lon], 13, { animate: !F.motion.reduced() }); }
      }
      renderDetail();
      renderResults(visible());
    }
    function update(fit) {
      var list = visible();
      renderCats(); renderResults(list); renderPins(list, fit); renderOriginMarker();
      var note = document.getElementById('fxm-note');
      if (note) note.textContent = list.length ? '' : 'No places match these filters.';
      if (st.selected && !list.some(function (p) { return p.id === st.selected; })) select(null);
      else if (st.selected) renderDetail();
    }
    function routeTo(p) {
      if (!st.origin || st.origin.source === 'default') {
        say('Finding you so I can plan the route…');
        F.geo.get({ ask: true, season: cfg.season }).then(function (l) {
          if (l.source === 'device') { setOrigin(l, false); routeTo(p); }
          else say('Your location is not available here. Search your city in the box above, or use the Google Maps and OSM buttons.', 'warn');
        });
        return;
      }
      var o = st.origin, prof = { walk: 'routed-foot', bike: 'routed-bike', car: 'routed-car' }[st.mode];
      var path = o.lon + ',' + o.lat + ';' + p.lon + ',' + p.lat + '?overview=full&geometries=geojson';
      var tries = ['https://routing.openstreetmap.de/' + prof + '/route/v1/driving/' + path];
      if (st.mode === 'car') tries.push('https://router.project-osrm.org/route/v1/driving/' + path);
      say('Finding a route…');
      (function next(i) {
        if (i >= tries.length) return fallback();
        F.net.json(tries[i], { timeoutMs: 9000, retries: 0 }).then(function (d) {
          var r = d.routes && d.routes[0];
          if (!r) return next(i + 1);
          st.route = { id: p.id, km: r.distance / 1000, sec: r.duration, approx: false };
          if (map) { routeLayer.clearLayers(); var line = L.geoJSON(r.geometry, { style: { color: catById[p.cat].color, weight: 5, opacity: 0.9 } }).addTo(routeLayer); map.fitBounds(line.getBounds().pad(0.15)); }
          say('', ''); renderDetail();
        }, function () { next(i + 1); });
      })(0);
      function fallback() {
        st.route = { id: p.id, km: F.geo.haversine(o, p), sec: 0, approx: true };
        if (map) { routeLayer.clearLayers(); L.polyline([[o.lat, o.lon], [p.lat, p.lon]], { color: catById[p.cat].color, weight: 4, dashArray: '8 8' }).addTo(routeLayer); map.fitBounds(L.latLngBounds([[o.lat, o.lon], [p.lat, p.lon]]).pad(0.2)); }
        say('Turn-by-turn routing is not reachable right now. Showing a straight line; the Google Maps button has full directions.', 'warn'); renderDetail();
      }
    }
    function setOrigin(o, recenter) {
      st.origin = o; renderOrigin();
      if (map && recenter) map.setView([o.lat, o.lon], 11);
      update(false);
    }
    function useMyLocation() {
      say('Finding you…');
      F.geo.get({ ask: true, season: cfg.season }).then(function (l) {
        if (l.source === 'device') { setOrigin(l, true); say('Found you. Distances now start from here.'); }
        else say('Location is not available here (often a browser or file:// restriction). Search for your city instead.', 'warn');
      });
    }
    var OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
    function overpassFetch(query) {
      var body = new URLSearchParams({ data: query });
      return OVERPASS.reduce(function (p, url) {
        return p.catch(function () { return F.net.json(url, { method: 'POST', body: body, timeoutMs: 28000, retries: 0 }).then(function (d) { if (d.remark && /timed out|runtime error/i.test(d.remark) && !(d.elements || []).length) throw new Error('overpass timeout'); return d; }); });
      }, Promise.reject(new Error('start')));
    }
    function searchArea() {
      if (!cfg.allowOsm) return;
      var center = map ? map.getCenter() : { lat: st.origin ? st.origin.lat : cfg.center.lat, lng: st.origin ? st.origin.lon : cfg.center.lon };
      var withOsm = cats.filter(function (c) { return st.active[c.id] && c.osm && c.osm.length; });
      if (!withOsm.length) { say('Turn on a category that can be searched on OpenStreetMap.', 'warn'); return; }
      var radius = Math.min(st.radiusMi, 12), bb = bboxFor(center.lat, center.lng, radius);
      areaBtn.disabled = true;
      var done = 0, added = 0, failed = 0;
      say('Searching OpenStreetMap near the map center. This can take up to half a minute…', 'sticky');
      var have = {};
      st.osm.forEach(function (p) { have[p.id] = 1; });
      var q = F.net.queue(2);
      var jobs = withOsm.map(function (c) {
        var key = 'fxm_osm_' + c.id + [bb.s, bb.w, bb.n, bb.e].map(function (v) { return v.toFixed(2); }).join('_');
        var cached = null; try { cached = JSON.parse(sessionStorage.getItem(key)); } catch (e) { /* ignore */ }
        return q.add(function () { return cached ? Promise.resolve(cached) : overpassFetch(buildOverpass([c], bb, 80)); }).then(function (d) {
          try { sessionStorage.setItem(key, JSON.stringify(d)); } catch (e) { /* quota */ }
          parseOverpass(d, cats).forEach(function (p) { if (!have[p.id]) { have[p.id] = 1; st.osm.push(p); added++; } });
        }, function () { failed++; }).then(function () {
          done++;
          say('Searched ' + done + ' of ' + withOsm.length + ' categories (' + added + ' new places)…', 'sticky');
          update(false);
        });
      });
      Promise.all(jobs).then(function () {
        areaBtn.disabled = false;
        if (failed === withOsm.length) say('OpenStreetMap search is busy or offline right now. The featured places still work; try again in a minute.', 'warn');
        else say('Added ' + added + ' places from OpenStreetMap' + (failed ? ' (' + failed + ' categories timed out)' : '') + '. It is community data, so check hours before you go.', failed ? 'warn' : '');
        if (added) setTab('results');
      });
    }

    /* ----- events ----- */
    masterSwitch.addEventListener('change', function () { cats.forEach(function (c) { st.active[c.id] = masterSwitch.checked; }); update(true); });
    slider.addEventListener('input', function () { st.radiusMi = +slider.value; sliderVal.textContent = st.radiusMi + ' mi'; if (st.limit) update(false); });
    limitBox.addEventListener('change', function () { st.limit = limitBox.checked; update(true); });
    locBtn.addEventListener('click', useMyLocation);
    areaBtn.addEventListener('click', searchArea);
    if (!cfg.allowOsm) areaBtn.style.display = 'none';
    tabFilters.addEventListener('click', function () { setTab('filters'); });
    tabResults.addEventListener('click', function () { setTab('results'); });
    var runSuggest = F.dom.debounce(function () {
      var q = searchInput.value.trim();
      st.q = q; update(false);
      suggest.innerHTML = '';
      if (q.length < 2) { suggest.hidden = true; return; }
      F.geo.search(q).then(function (list) {
        suggest.innerHTML = '';
        list.slice(0, 4).forEach(function (l) {
          suggest.appendChild(h('li', null, h('button', { type: 'button', onclick: function () { searchInput.value = ''; st.q = ''; suggest.hidden = true; F.geo.save({ lat: l.lat, lon: l.lon, label: l.label }); setOrigin({ lat: l.lat, lon: l.lon, label: l.label, source: 'saved' }, true); } }, h('i', { class: 'fa-solid fa-city' }), ' Go to ' + l.label)));
        });
        suggest.hidden = !suggest.children.length;
      }, function () { suggest.hidden = true; });
    }, 280);
    searchInput.addEventListener('input', runSuggest);
    document.addEventListener('click', function (e) { if (!topbar.contains(e.target)) suggest.hidden = true; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && st.selected && !sidebar.classList.contains('is-open')) select(null); });

    /* ----- boot ----- */
    var wantMe = params.get('near') === 'me';
    F.geo.get({ season: cfg.season, ask: false }).then(function (l) {
      st.origin = l; renderOrigin(); update(true);
      if (st.selected) { var p = getPlace(st.selected); if (p) select(st.selected, { pan: true }); else st.selected = null; }
      else if (map && l.source !== 'default') map.setView([l.lat, l.lon], 10);
      if (wantMe) useMyLocation();
    });
    setTimeout(function () { if (map) map.invalidateSize(); }, 300);
    if (global.ResizeObserver && map) new ResizeObserver(F.dom.debounce(function () { map.invalidateSize(); }, 100)).observe(mapEl);
    var api = { state: st, select: select, update: update, map: function () { return map; }, searchArea: searchArea };
    global.FestoMap.last = api;   // inspection hook for tests and debugging
    return api;
  }

  global.FestoMap = { mount: mount, _pure: { bboxFor: bboxFor, buildOverpass: buildOverpass, parseOverpass: parseOverpass, matchCategory: matchCategory, dirLinks: dirLinks, fmtDur: fmtDur } };
})(window);
