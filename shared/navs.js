/* ==========================================================================
   Style 2 navigation, one completely different layout per season. Style 1 (the tab bar with a big round centre
   button) lives in festo-core.js and is re-skinned by each theme; these builders replace it entirely.

     Halloween  Crypt Rail   an arched stone rail down the left edge, a lit pumpkin at its top
     Christmas  Garland      a pine garland across the top with hanging ornaments, a star in the middle
     Summer     Sun Dial     a sun in the corner that fans its buttons out in two arcs
     Spring     Vine         a leafy vine up the right edge with a flower bud at its top

   Each builder receives ctx = { season, s, module, openLauncher, h, ico, url } and returns one element.
   The look of each lives in shared/themes/<season>.css under [data-nav="2"].
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo; F.navs = F.navs || {};

  function mod(ctx, id) { return ctx.s.modules.filter(function (m) { return m.id === id; })[0]; }
  function mods(ctx, ids) { return ids.map(function (id) { return mod(ctx, id); }).filter(Boolean); }
  function iconName(m) { return m.icon.replace('fa-', ''); }
  function label(m) { return m.title || m.label; }

  /* a link to a module, or to the landing page when m is the string 'home' */
  function item(ctx, cls, m) {
    var home = m === 'home', on = home ? ctx.module === 'landing' : m.id === ctx.module;
    return ctx.h('a', {
      class: cls + (on ? ' is-active' : ''), href: home ? ctx.url(ctx.season, 'landing') : ctx.url(ctx.season, m.id),
      'aria-label': home ? ctx.s.name : label(m), title: home ? ctx.s.name : m.label, 'aria-current': on ? 'page' : null
    }, ctx.ico(home ? 'house' : iconName(m)));
  }
  function launcherBtn(ctx, cls, art) {
    var b = ctx.h('button', { class: cls, type: 'button', 'aria-label': 'All sections', 'aria-haspopup': 'dialog', title: 'All sections', onclick: ctx.openLauncher });
    if (art) b.innerHTML = art; else b.appendChild(ctx.ico('grip'));
    return b;
  }
  function art(season) { return F.art && F.art.fab && F.art.fab[season] ? F.art.fab[season]() : ''; }

  /* ---------------- Halloween: Crypt Rail ---------------- */
  F.navs.halloween = function (ctx) {
    var list = ['home'].concat(mods(ctx, ['map', 'wheel', 'pumpkin', 'store', 'music', 'weather']));
    var nav = ctx.h('nav', { class: 'fx-rail', 'aria-label': ctx.s.name },
      launcherBtn(ctx, 'fx-rail-lamp', art('halloween')),
      ctx.h('span', { class: 'fx-rail-sep', 'aria-hidden': 'true' }),
      list.map(function (m) { return item(ctx, 'fx-rail-btn', m); }),
      ctx.h('span', { class: 'fx-rail-foot', 'aria-hidden': 'true' }, ctx.ico('cross')));
    return nav;
  };

  /* ---------------- Christmas: Garland ---------------- */
  F.navs.christmas = function (ctx) {
    var list = ['home'].concat(mods(ctx, ['map', 'store', 'music', 'workshop', 'weather']));
    var colors = ['#d62839', '#e0a526', '#1f7a5a', '#3a86c8', '#b8c4d4', '#8a63c9'];
    var star = launcherBtn(ctx, 'fx-orn-star', '<i class="fa-solid fa-star"></i>');
    var all = list.slice(0, 2).concat(['star']).concat(list.slice(2, 5));
    var n = all.length, slots = [];
    all.forEach(function (m, i) {
      var p = (i + 0.5) / n, y = Math.pow(1 - p, 2) * 4 + 2 * (1 - p) * p * 36 + p * p * 4;
      var node = m === 'star' ? star : item(ctx, 'fx-orn', m);
      if (m !== 'star') node.style.setProperty('--c', colors[i % colors.length]);
      slots.push(ctx.h('div', { class: 'fx-orn-slot' + (m === 'star' ? ' fx-orn-slot--star' : ''), style: { left: (p * 100).toFixed(2) + '%', top: y.toFixed(1) + 'px' } }, ctx.h('span', { class: 'fx-orn-str', 'aria-hidden': 'true' }), node));
    });
    var swag = '<svg class="fx-garland-swag" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true"><path d="M0 4Q50 36 100 4" fill="none" stroke="#14543d" stroke-width="9" vector-effect="non-scaling-stroke" stroke-linecap="round"/><path d="M0 4Q50 36 100 4" fill="none" stroke="#2e9a6c" stroke-width="3" stroke-dasharray="2 7" vector-effect="non-scaling-stroke" stroke-linecap="round"/></svg>';
    var nav = ctx.h('nav', { class: 'fx-garland', 'aria-label': ctx.s.name }, slots);
    nav.insertAdjacentHTML('afterbegin', swag);
    return nav;
  };

  /* ---------------- Summer: Sun Dial ---------------- */
  F.navs.summer = function (ctx) {
    var ring1 = ['home'].concat(mods(ctx, ['map', 'store', 'weather']));
    var ring2 = mods(ctx, ['wheel', 'game', 'music']).concat(['all']);
    var dial = ctx.h('div', { class: 'fx-dial' });
    var sun = ctx.h('button', { class: 'fx-dial-sun', type: 'button', 'aria-expanded': 'false', 'aria-label': 'Open the sun dial menu', title: 'Menu' });
    sun.innerHTML = art('summer');
    function place(arr, radius, startDelay) {
      arr.forEach(function (m, i) {
        var a = (180 + (arr.length > 1 ? (90 / (arr.length - 1)) * i : 45)) * Math.PI / 180;
        var node = m === 'all' ? launcherBtn(ctx, 'fx-dial-item', null) : item(ctx, 'fx-dial-item', m);
        node.style.setProperty('--x', (Math.cos(a) * radius).toFixed(1) + 'px');
        node.style.setProperty('--y', (Math.sin(a) * radius).toFixed(1) + 'px');
        node.style.setProperty('--d', (startDelay + i * 40) + 'ms');
        node.setAttribute('tabindex', '-1');
        dial.appendChild(node);
      });
    }
    place(ring1, 96, 0); place(ring2, 168, 120);
    dial.appendChild(sun);
    function setOpen(on) {
      dial.classList.toggle('is-open', on); sun.setAttribute('aria-expanded', String(on));
      sun.setAttribute('aria-label', on ? 'Close the sun dial menu' : 'Open the sun dial menu');
      Array.prototype.forEach.call(dial.querySelectorAll('.fx-dial-item'), function (el) { el.setAttribute('tabindex', on ? '0' : '-1'); });
    }
    sun.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!dial.classList.contains('is-open')); });
    document.addEventListener('click', function (e) { if (dial.classList.contains('is-open') && !dial.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dial.classList.contains('is-open')) { setOpen(false); sun.focus(); } });
    return dial;
  };

  /* ---------------- Spring: Vine ---------------- */
  F.navs.spring = function (ctx) {
    var list = ['home'].concat(mods(ctx, ['map', 'wheel', 'store', 'music', 'weather']));
    var vine = '<svg class="fx-vine-stem" viewBox="0 0 74 600" preserveAspectRatio="none" aria-hidden="true"><path d="M37 0C62 80 12 160 37 240S62 400 37 480 12 560 37 600" fill="none" stroke="#4f8a4c" stroke-width="5" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="M37 0C62 80 12 160 37 240S62 400 37 480 12 560 37 600" fill="none" stroke="#7fb67a" stroke-width="2" stroke-dasharray="3 10" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';
    var nav = ctx.h('nav', { class: 'fx-vine', 'aria-label': ctx.s.name },
      launcherBtn(ctx, 'fx-vine-bud', art('spring')),
      list.map(function (m, i) { return item(ctx, 'fx-leaf fx-leaf--' + (i % 2 ? 'r' : 'l'), m); }));
    nav.insertAdjacentHTML('afterbegin', vine);
    return nav;
  };
})(window);
