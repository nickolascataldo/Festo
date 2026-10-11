/* Festo intro page: suggest the season for today's date, show it as a postcard you can swipe through, and list all
   four seasons underneath. Choosing one offers to make it the home season. Shared pieces (icon, posters, confirm
   sheet, saved choice) live in shared/intro/ and shared/scenes/poster.js. */
Festo.dom.ready(function () {
  'use strict';
  var F = Festo, h = F.dom.h, I = Intro, root = document.getElementById('app');
  var rec = I.recommended(), mine = I.saved(), start = mine || rec;
  function vars(id) { var i = I.info(id); return { '--c1': i.c1, '--c2': i.c2, '--on': i.on }; }
  var d = F.now(), post = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() + ' ' + d.getDate();
  var order = [start].concat(I.order.filter(function (x) { return x !== start; })), rots = [0, -5, 4, -2];
  var cards = {}, rows = {}, layers = {};
  /* real photographs: the postcard picture and the full-screen backdrop behind it for every season */
  var PHOTO = {
    halloween: { card: 'shared/img/season/halloween-card.jpg', bg: 'shared/img/season/halloween-backdrop.jpg' },
    summer: { card: 'shared/img/season/summer-card.jpg', bg: 'shared/img/season/summer-backdrop.jpg' },
    christmas: { card: 'shared/img/season/christmas-card.jpg', bg: 'shared/img/season/christmas-backdrop.jpg' },
    spring: { card: 'shared/img/season/spring-card.jpg', bg: 'shared/img/season/spring-backdrop.jpg' }
  };
  function photo(id, which) {
    var el = h('div', { class: 'in-scene in-art home-pic', 'aria-hidden': 'true' });
    el.style.backgroundImage = 'url("' + PHOTO[id][which] + '")';
    return el;
  }
  function art(id, which) { return PHOTO[id] ? photo(id, which) : I.art(id); }

  /* ----- backdrop: the selected season's poster, softly darkened ----- */
  var bg = h('div', { class: 'home-bg', 'aria-hidden': 'true' });
  I.order.forEach(function (id) { layers[id] = art(id, 'bg'); layers[id].classList.add('home-layer'); bg.appendChild(layers[id]); });

  /* ----- postcards ----- */
  var stage = h('div', { class: 'home-stage', 'aria-label': 'Season postcards' });
  I.order.forEach(function (id) {
    var inf = I.info(id);
    cards[id] = h('article', { class: 'home-card', 'data-id': id, style: vars(id), 'aria-label': inf.name },
      h('div', { class: 'home-photo' }, art(id, 'card'),
        h('span', { class: 'home-post', 'aria-hidden': 'true' }, h('b', null, 'Festo'), h('i', null, post)),
        id === rec ? h('span', { class: 'home-sug' }, I.ico('star'), I.suggestLabel()) : null,
        id === mine ? h('span', { class: 'home-mine' }, I.ico('house'), 'Your home') : null),
      h('div', { class: 'home-note' }, h('p', { class: 'home-greet' }, 'Greetings from'), h('h2', { class: 'home-name f-' + id }, inf.name), h('p', { class: 'home-tag' }, inf.tag)));
    stage.appendChild(cards[id]);
  });

  /* ----- the four-season sheet ----- */
  var list = h('div', { class: 'home-list', role: 'radiogroup', 'aria-label': 'Season' });
  I.order.forEach(function (id) {
    var inf = I.info(id);
    rows[id] = h('button', { class: 'home-row', type: 'button', role: 'radio', 'aria-checked': 'false', style: vars(id), onclick: function () { select(id); } },
      h('span', { class: 'home-thumb' }, art(id, 'card')),
      h('span', { class: 'home-rtext' }, h('b', { class: 'f-' + id }, inf.short), h('small', null, I.countdown(id))));
    list.appendChild(rows[id]);
  });
  var go = h('button', { class: 'in-btn in-btn--main home-go', type: 'button', onclick: function () { I.enter(order[0]); } });

  function layout(animate) {
    order.forEach(function (id, i) {
      var c = cards[id]; c.classList.toggle('no-anim', !animate);
      c.style.zIndex = String(10 - i); c.style.transform = 'translate3d(0,' + (i * 14) + 'px,0) scale(' + (1 - i * 0.05) + ') rotate(' + rots[i] + 'deg)';
      c.style.filter = 'brightness(' + (1 - i * 0.16) + ')'; c.style.pointerEvents = i === 0 ? 'auto' : 'none'; c.setAttribute('aria-hidden', String(i !== 0));
    });
    var top = order[0], inf = I.info(top);
    I.order.forEach(function (k) { layers[k].classList.toggle('is-on', k === top); rows[k].setAttribute('aria-checked', String(k === top)); rows[k].classList.toggle('is-on', k === top); });
    go.textContent = 'Enter ' + inf.name; go.style.setProperty('--c1', inf.c1); go.style.setProperty('--on', inf.on);
  }
  function select(id) { while (order[0] !== id) order.push(order.shift()); layout(true); }
  function next(dir) {
    var top = cards[order[0]]; dir = dir || 1;
    top.classList.remove('no-anim'); top.style.transform = 'translate3d(' + (dir * 130) + '%,40px,0) rotate(' + (dir * 22) + 'deg)'; top.style.opacity = '0';
    setTimeout(function () { order.push(order.shift()); top.style.opacity = ''; layout(false); void top.offsetWidth; layout(true); }, 240);
  }
  function prev() { order.unshift(order.pop()); layout(true); }

  var sx = 0, sy = 0, dx = 0, drag = false;
  stage.addEventListener('pointerdown', function (e) { drag = true; sx = e.clientX; sy = e.clientY; dx = 0; cards[order[0]].classList.add('no-anim'); try { stage.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } });
  stage.addEventListener('pointermove', function (e) { if (!drag) return; dx = e.clientX - sx; cards[order[0]].style.transform = 'translate3d(' + dx + 'px,' + ((e.clientY - sy) * 0.3) + 'px,0) rotate(' + (dx / 14) + 'deg)'; });
  function release() { if (!drag) return; drag = false; if (Math.abs(dx) > 60) next(dx > 0 ? 1 : -1); else layout(true); }
  stage.addEventListener('pointerup', release); stage.addEventListener('pointercancel', release);
  document.addEventListener('keydown', function (e) { if (document.querySelector('.in-sheet')) return; if (e.key === 'ArrowRight') next(1); else if (e.key === 'ArrowLeft') prev(); });

  root.appendChild(bg);
  root.appendChild(h('main', { class: 'home' },
    h('header', { class: 'home-top' }, I.brand(mine ? 'Your home is ' + I.info(mine).name : I.dateLabel())),
    h('section', { class: 'home-hero' }, h('button', { class: 'home-arrow', type: 'button', 'aria-label': 'Previous season', onclick: prev }, I.ico('chevron-left')), stage, h('button', { class: 'home-arrow', type: 'button', 'aria-label': 'Next season', onclick: function () { next(1); } }, I.ico('chevron-right'))),
    h('section', { class: 'home-sheet' }, h('span', { class: 'home-grab', 'aria-hidden': 'true' }), h('div', { class: 'home-year' }, I.yearBar()), list, go)));
  layout(false);
});
