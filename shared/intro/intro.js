/* Shared logic for the five intro-page drafts: which season to suggest, the saved home season, the confirm sheet,
   and a small draft switcher. Everything visual lives in drafts.css / drafts.js. */
(function (global) {
  'use strict';
  var F = global.Festo, h = F.dom.h, KEY = 'festo_home_season';
  var ORDER = ['spring', 'summer', 'halloween', 'christmas'];
  var INFO = {
    spring: { name: 'Spring Haven', short: 'Spring', tag: 'Gardens, blooms and birdsong', c1: '#f08fae', c2: '#4f8a4c', ink: '#33402f', on: '#2a1320', icon: 'seedling' },
    summer: { name: 'Summer Solstice', short: 'Summer', tag: 'Beaches, sun and long evenings', c1: '#ffb81f', c2: '#0aa6c9', ink: '#0b3550', on: '#0b3550', icon: 'sun' },
    halloween: { name: 'Halloween Hollow', short: 'Halloween', tag: 'Haunts, harvest and midnight', c1: '#ff8a1f', c2: '#5b1f8a', ink: '#f7efe4', on: '#2a1100', icon: 'ghost' },
    christmas: { name: 'Christmas Sanctuary', short: 'Christmas', tag: 'Lights, hearth and snow', c1: '#d62839', c2: '#1f7a5a', ink: '#14233b', on: '#ffffff', icon: 'tree' }
  };
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var Intro = global.Intro = {
    order: ORDER, info: function (id) { return INFO[id]; },
    now: function () { return F.now(); },
    recommended: function () { return F.seasons.detect(F.now()); },
    saved: function () { var s = F.store.get(KEY, null); return ORDER.indexOf(s) < 0 ? null : s; },
    reset: function () { F.store.remove(KEY); },
    /* "Suggested for October" */
    suggestLabel: function () { return 'Suggested for ' + MONTHS[F.now().getMonth()]; },
    dateLabel: function () { return F.now().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); },
    /* "24 days until Halloween", "Last day of Summer" ... */
    countdown: function (id) {
      var c = F.countdown(F.seasons.get(id).countdown, F.now());
      return c.state === 'today' || c.state === 'last' ? (c.big + ' ' + c.label).trim() : c.big + ' ' + c.label;
    },
    /* 0..1 position of today in the year, for the dial */
    yearFraction: function () { var d = F.now(); return (F.util.dayOfYear(d) - 1) / 365; },
    scene: function (id) {
      var el = h('div', { class: 'in-scene', 'data-season': id, 'aria-hidden': 'true' });
      el.innerHTML = F.scenes[id] ? F.scenes[id]() : '';
      return el;
    },
    /* The Festo app icon, used in every header. */
    logo: function (size) { return h('img', { class: 'in-logo', src: F.rootUrl + 'shared/img/festo-icon-192.png', alt: 'Festo', width: size || 48, height: size || 48, decoding: 'async' }); },
    brand: function (sub) { return h('div', { class: 'in-brand' }, Intro.logo(46), h('div', { class: 'in-brand-text' }, h('h1', { class: 'in-wordmark' }, 'Festo'), sub ? h('p', null, sub) : null)); },
    /* A thin year: four season colours with a marker for today. */
    yearBar: function () {
      var seg = { spring: [[60, 152]], summer: [[152, 244]], halloween: [[244, 305]], christmas: [[305, 365], [0, 60]] }, bar = h('div', { class: 'in-year', role: 'img', 'aria-label': 'Where today falls in the year' });
      Object.keys(seg).forEach(function (id) { seg[id].forEach(function (r) { bar.appendChild(h('i', { style: { left: (r[0] / 365 * 100) + '%', width: ((r[1] - r[0]) / 365 * 100) + '%', background: INFO[id].c1 } })); }); });
      bar.appendChild(h('b', { style: { left: (Intro.yearFraction() * 100) + '%' } }));
      return bar;
    },
    ico: function (name, cls) { return h('i', { class: 'fa-solid fa-' + name + (cls ? ' ' + cls : ''), 'aria-hidden': 'true' }); },

    /* ----- confirm sheet: the one place a season gets chosen ----- */
    enter: function (id) {
      var inf = INFO[id], prev = document.activeElement;
      var url = F.url(id, 'landing');
      function go(save) { if (save) F.store.set(KEY, id); location.href = url; }
      function close() { sheet.remove(); document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); }
      function onKey(e) { if (e.key === 'Escape') close(); }
      var primary = h('button', { class: 'in-btn in-btn--main', type: 'button', onclick: function () { go(true); } }, 'Make it my home');
      var sheet = h('div', { class: 'in-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Open ' + inf.name, 'data-season': id, style: { '--c1': inf.c1, '--c2': inf.c2, '--on': inf.on } },
        h('div', { class: 'in-sheet-card' },
          h('span', { class: 'in-sheet-icon', 'aria-hidden': 'true' }, Intro.ico(inf.icon)),
          h('h2', { class: 'in-sheet-title' }, 'Open ' + inf.short + ' every time?'),
          h('p', { class: 'in-sheet-text' }, 'Festo will take you straight to ' + inf.name + ' when you launch the app. The home button on any season page brings you back here.'),
          primary,
          h('button', { class: 'in-btn in-btn--quiet', type: 'button', onclick: function () { go(false); } }, 'Just this once'),
          h('button', { class: 'in-link', type: 'button', onclick: close }, 'Not now')));
      sheet.addEventListener('click', function (e) { if (e.target === sheet) close(); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(sheet);
      primary.focus();
    },

    /* ----- draft switcher (removed once a design is chosen) ----- */
    draftbar: function (n) {
      var links = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) { return h('a', { href: 'draft-' + i + '.html', class: i === n ? 'is-on' : '', 'aria-label': 'Draft ' + i, 'aria-current': i === n ? 'page' : null }, String(i)); });
      var bar = h('nav', { class: 'in-draftbar', 'aria-label': 'Design drafts' }, h('span', null, 'Draft'), links,
        h('button', { type: 'button', title: 'Forget the saved home season', onclick: function () { Intro.reset(); bar.querySelector('button').textContent = 'Cleared'; } }, 'Reset'));
      document.body.appendChild(bar);
    }
  };
})(window);
