/* ==========================================================================
   FestoLanding: the home screen of a season, built on the shared shell.
     - a countdown card (days to the holiday, or days until / left in the season)
     - featured cards, an icon tile row for every module, the two vaults (reads + cinema)
     - a daily fact (from shared/seasons/<season>.facts.js)
   Also exposes Festo.countdown(spec, now) so other pages can reuse the date maths.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, h = F.dom.h;

  function utc(d) { return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); }
  function daysBetween(a, b) { return Math.round((utc(b) - utc(a)) / 86400000); }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

  /* spec: { mode:'date', month, day, label, todayLabel } or { mode:'window', start:{month,day}, end:{month,day}, label } */
  function countdown(spec, now) {
    now = now || F.now();
    var y = now.getFullYear(), diff;
    if (spec.mode === 'date') {
      var t = new Date(y, spec.month - 1, spec.day);
      diff = daysBetween(now, t);
      if (diff === 0) return { state: 'today', days: 0, big: spec.todayLabel || 'Today', label: '' };
      if (diff < 0) { t = new Date(y + 1, spec.month - 1, spec.day); diff = daysBetween(now, t); }
      return { state: 'before', days: diff, big: String(diff), label: (diff === 1 ? 'day' : 'days') + ' until ' + spec.label };
    }
    var start = new Date(y, spec.start.month - 1, spec.start.day), end = new Date(y, spec.end.month - 1, spec.end.day);
    var ds = daysBetween(now, start), de = daysBetween(now, end);
    if (ds > 0) return { state: 'before', days: ds, big: String(ds), label: (ds === 1 ? 'day' : 'days') + ' until ' + spec.label };
    if (de >= 0) {
      if (de === 0) return { state: 'last', days: 0, big: 'Last day', label: 'of ' + spec.label };
      return { state: 'during', days: de, big: String(de), label: (de === 1 ? 'day' : 'days') + ' of ' + spec.label + ' left' };
    }
    var next = new Date(y + 1, spec.start.month - 1, spec.start.day), dn = daysBetween(now, next);
    return { state: 'before', days: dn, big: String(dn), label: 'days until ' + spec.label };
  }
  F.countdown = countdown;

  var BLURBS = {
    halloween: { books: 'Gothic, horror and haunted tales', movies: 'Midnight picks for every fear level', wheel: 'Spin for tonight\'s plan', pumpkin: 'Carve, stencil and save', map: 'Haunts, graves and ghost tours', store: 'Costumes, decor, crafts, treats', music: 'Playlists for the witching hour', weather: 'Moon phase and trick-or-treat odds' },
    christmas: { books: 'Fireside stories and classics', movies: 'Holiday films, ready for the couch', wheel: 'Spin for tonight\'s plan', workshop: 'Trim a tree and save it', map: 'Lights, rinks, slopes and Santa', store: 'Apparel, decor, crafts, treats', music: 'Playlists by the fire', weather: 'Snowfall and wind chill' },
    summer: { books: 'Page-turners for the sand', movies: 'Summer films for long evenings', wheel: 'Spin for a summer day', game: 'Stack scoops, beat your best', map: 'Beaches, pools, markets, stars', store: 'Swim, wear, outdoors, eat', music: 'Playlists for the sun', weather: 'UV, heat and sun safety' },
    spring: { books: 'Gardens, romance and renewal', movies: 'Light, bright films for spring', wheel: 'Spin for a spring quest', map: 'Gardens, blooms and birding', store: 'Wear, make, decorate, taste', music: 'Birdsong and meadow folk', weather: 'Pollen, rain and UV' }
  };
  var FEATURED = { halloween: ['pumpkin', 'wheel', 'map', 'weather'], christmas: ['workshop', 'wheel', 'map', 'weather'], summer: ['game', 'wheel', 'map', 'weather'], spring: ['wheel', 'map', 'store', 'weather'] };
  function n(v) { return (+v).toLocaleString('en-US'); }

  function mount(root, seasonId) {
    var s = F.seasons.get(seasonId), blurbs = BLURBS[seasonId] || {}, byId = {};
    s.modules.forEach(function (m) { byId[m.id] = m; });
    var now = F.now(), cd = countdown(s.countdown, now);

    /* ----- countdown hero ----- */
    var hero = h('section', { class: 'fx-card fxl-hero', 'aria-label': 'Countdown' },
      h('div', { class: 'fxl-hero-main' },
        h('span', { class: 'fx-eyebrow' }, s.name),
        h('div', { class: 'fxl-count' + (cd.state === 'today' || cd.state === 'last' ? ' is-word' : ''), 'aria-live': 'polite' }, cd.big),
        cd.label ? h('span', { class: 'fxl-count-sub' }, cd.label) : null,
        h('a', { class: 'fx-btn fx-btn--sm fxl-hero-cta', href: F.url(seasonId, 'wheel') }, h('i', { class: 'fa-solid fa-dharmachakra' }), 'Plan something')),
      h('div', { class: 'fxl-emblem', 'aria-hidden': 'true' }, h('i', { class: 'fa-solid fa-' + s.icon })));

    /* ----- featured ----- */
    var feat = (FEATURED[seasonId] || []).map(function (id) { return byId[id]; }).filter(Boolean).map(function (m) {
      return h('a', { class: 'fx-feature fxl-feature', href: F.url(seasonId, m.id) },
        h('div', { class: 'fx-feature-art' }, h('i', { class: 'fa-solid ' + m.icon })),
        h('div', { class: 'fx-feature-body' }, h('h3', { class: 'fx-feature-title' }, m.title), h('p', { class: 'fx-muted fxl-blurb' }, blurbs[m.id] || ''),
          h('span', { class: 'fx-btn fx-btn--sm fxl-open' }, 'Open', h('i', { class: 'fa-solid fa-arrow-right' }))));
    });

    /* ----- every module as a tile ----- */
    var tiles = s.modules.map(function (m) {
      return h('a', { class: 'fx-tile', href: F.url(seasonId, m.id) }, h('i', { class: 'fa-solid ' + m.icon }), m.label);
    });

    /* ----- the two vaults ----- */
    function vault(id, count, unit) {
      var m = byId[id]; if (!m) return null;
      return h('a', { class: 'fx-listcard', href: F.url(seasonId, id) },
        h('div', { class: 'fx-listcard-art' }, h('i', { class: 'fa-solid ' + m.icon })),
        h('div', { class: 'fxl-vault-text' }, h('span', { class: 'fx-listcard-title' }, m.title), h('span', { class: 'fx-muted' }, n(count) + ' ' + unit + ' · ' + (blurbs[id] || ''))),
        h('i', { class: 'fa-solid fa-chevron-right fx-muted', 'aria-hidden': 'true' }));
    }

    /* ----- daily fact ----- */
    var facts = (global.FESTO_FACTS && global.FESTO_FACTS[seasonId]) || [];
    var factIdx = facts.length ? F.util.dayOfYear(now) % facts.length : 0;
    var factText = h('p', { class: 'fxl-fact-text' }), factNum = h('span', { class: 'fx-badge' });
    function showFact() { if (!facts.length) return; factText.textContent = facts[factIdx]; factNum.textContent = (factIdx + 1) + ' of ' + facts.length; }
    showFact();
    var factCard = facts.length ? h('section', { class: 'fx-card fxl-fact', 'aria-label': 'Fact of the day' },
      h('div', { class: 'fx-row' }, h('span', { class: 'fx-eyebrow fx-grow' }, 'Did you know'), factNum),
      factText,
      h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm fxl-next', type: 'button', onclick: function () { factIdx = (factIdx + 1) % facts.length; showFact(); factText.classList.remove('fx-pop'); void factText.offsetWidth; factText.classList.add('fx-pop'); } }, h('i', { class: 'fa-solid fa-shuffle' }), 'Another')) : null;

    root.appendChild(h('div', { class: 'fxl' },
      hero,
      feat.length ? h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'Featured'), h('div', { class: 'fx-hscroll fxl-feats' }, feat)) : null,
      h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'Everything here'), h('div', { class: 'fx-tiles fxl-tiles' }, tiles)),
      h('div', { class: 'fxl-split' },
        h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'The vaults'), h('div', { class: 'fxl-vaults' }, vault('books', s.counts.books, 'books'), vault('movies', s.counts.films, 'films'))),
        factCard)));
  }

  global.FestoLanding = { mount: mount, countdown: countdown };
})(window);
