/* Festo hub: pick a season. Built on the shared shell (see shared/festo-core.js); this file only fills the page. */
Festo.dom.ready(function () {
  'use strict';
  var F = Festo, h = F.dom.h;
  var PIN_KEY = 'festo_hub_pinned';
  var PORTALS = {
    spring: { c1: '#f08fae', c2: '#4f8a4c', sub: 'Gardens, blooms and birdsong' },
    summer: { c1: '#ffb81f', c2: '#0aa6c9', sub: 'Beaches, sun and long evenings' },
    halloween: { c1: '#ff8a1f', c2: '#5b1f8a', sub: 'Haunts, harvest and midnight' },
    christmas: { c1: '#d62839', c2: '#1f7a5a', sub: 'Lights, hearth and snow' }
  };
  var ORDER = ['spring', 'summer', 'halloween', 'christmas'];
  function n(v) { return (+v).toLocaleString('en-US'); }

  var brand = h('span', { class: 'fx-circle-btn fxh-brand', 'aria-hidden': 'true' }, h('img', { src: F.rootUrl + 'hxqoep4p.png', alt: '', decoding: 'async' }));
  var main = F.shell.mount({ season: 'hub', module: 'landing', left: brand });

  F.guard('the hub', function () {
    var now = F.now(), natural = F.seasons.detect(now);
    var pinned = F.store.get(PIN_KEY, null);
    if (ORDER.indexOf(pinned) < 0) pinned = null;
    var target = pinned || natural;
    var seasons = [target].concat(ORDER.filter(function (id) { return id !== target; }));

    /* ----- direct jump ----- */
    var ts = F.seasons.get(target), cd = F.countdown(ts.countdown, now), p = PORTALS[target];
    var jump = h('section', { class: 'fx-card fxh-jump', style: { '--c1': p.c1 }, 'aria-label': 'Jump to the current season' },
      h('div', { class: 'fxh-jump-main' },
        h('span', { class: 'fx-eyebrow' }, pinned ? 'Your pinned season' : 'Right now'),
        h('h2', { class: 'fxh-jump-title' }, ts.name),
        h('span', { class: 'fxh-date' }, now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })),
        h('span', { class: 'fx-muted' }, cd.state === 'today' || cd.state === 'last' ? cd.big + ' ' + cd.label : cd.big + ' ' + cd.label),
        h('a', { class: 'fx-btn', href: F.url(target, 'landing') }, h('i', { class: 'fa-solid fa-arrow-right' }), 'Jump in')),
      h('div', { class: 'fxh-ring', 'aria-hidden': 'true' }, h('i', { class: 'fa-solid fa-' + ts.icon })));

    /* ----- four portals ----- */
    function portal(id) {
      var s = F.seasons.get(id), c = PORTALS[id], on = pinned === id;
      var pin = h('button', { class: 'fxh-pin', type: 'button', 'aria-pressed': String(on), 'aria-label': 'Pin ' + s.name + ' as my default season', title: on ? 'Unpin' : 'Pin as default', onclick: function () {
        if (F.store.get(PIN_KEY, null) === id) F.store.remove(PIN_KEY); else F.store.set(PIN_KEY, id);
        location.reload();
      } }, h('i', { class: 'fa-solid fa-thumbtack' }));
      return h('div', { class: 'fxh-portal-wrap' },
        h('a', { class: 'fxh-portal', href: F.url(id, 'landing'), style: { '--c1': c.c1, '--c2': c.c2 } },
          h('span', { class: 'fxh-portal-art', 'aria-hidden': 'true' }, h('i', { class: 'fa-solid fa-' + s.icon })),
          h('span', { class: 'fxh-portal-text' },
            h('span', { class: 'fxh-portal-name' }, s.name),
            h('span', { class: 'fxh-portal-sub' }, c.sub),
            h('span', { class: 'fxh-portal-meta' }, n(s.counts.books) + ' books · ' + n(s.counts.films) + ' films')),
          h('i', { class: 'fa-solid fa-arrow-right fxh-portal-go', 'aria-hidden': 'true' })),
        id === natural ? h('span', { class: 'fxh-now' }, 'In season') : null,
        pin);
    }

    /* ----- quick tiles for the target season ----- */
    var tiles = ts.modules.map(function (m) { return h('a', { class: 'fx-tile', href: F.url(target, m.id) }, h('i', { class: 'fa-solid ' + m.icon }), m.label); });

    main.appendChild(h('div', { class: 'fxh' },
      jump,
      h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'Choose a season'), h('div', { class: 'fxh-grid' }, seasons.map(portal))),
      h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'Quick links · ' + ts.name), h('div', { class: 'fx-tiles' }, tiles))));
  });
});
