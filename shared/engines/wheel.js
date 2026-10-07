/* ==========================================================================
   FestoWheel: canvas spin wheel + a ready-made "spin for a plan" page.

   FestoWheel.create(host, opts)   -> { spin(forceIndex), setSegments(), resize(), destroy() }
   FestoWheel.mountPage(root, cfg) -> builds wheel + result card + history + saved plan
   FestoWheel._pure                -> pure math for tests
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo;
  var TAU = Math.PI * 2;

  /* ---------- pure helpers ---------- */
  function norm(a) { a = a % TAU; return a < 0 ? a + TAU : a; }
  /* Which segment is under the pointer (pointer is at the top, -90deg) for a wheel rotated by `rot`. */
  function indexAt(rot, n) { return Math.floor(norm(-Math.PI / 2 - rot) / (TAU / n)) % n; }
  /* A final rotation (> from + minTurns full turns) that lands inside segment `target` at fraction `frac`. */
  function rotationFor(target, frac, n, from, minTurns) {
    var step = TAU / n;
    var base = -Math.PI / 2 - (target + frac) * step;
    var rot = base + Math.ceil((from + minTurns * TAU - base) / TAU) * TAU;
    return rot;
  }
  function weightedPick(weights, rnd) {
    var total = 0, i;
    for (i = 0; i < weights.length; i++) total += weights[i];
    var x = rnd() * total;
    for (i = 0; i < weights.length; i++) { x -= weights[i]; if (x < 0) return i; }
    return weights.length - 1;
  }
  function dailyIndex(n, date, salt) { return Math.floor(F.util.rng(F.util.hashStr(F.util.dayKey(date) + '|' + (salt || '')))() * n); }
  function ease(t) { return 1 - Math.pow(1 - t, 4); }
  /* Font Awesome glyph character for a canvas (read from the icon font's own stylesheet). */
  var glyphCache = {};
  function glyph(name) {
    if (glyphCache[name]) return glyphCache[name];
    var i = document.createElement('i');
    i.className = 'fa-solid fa-' + name; i.style.cssText = 'position:absolute;visibility:hidden';
    document.body.appendChild(i);
    var c = global.getComputedStyle(i, '::before').content;
    i.remove();
    c = c && c !== 'none' && c !== 'normal' ? c.replace(/^["']|["']$/g, '') : '';
    if (c) glyphCache[name] = c;
    return c;
  }

  /* ---------- the wheel ---------- */
  function create(host, opts) {
    opts = opts || {};
    var segs = opts.segments || [];
    var dur = opts.duration || 4400;
    var rot = Math.random() * TAU, spinning = false, last = null, raf = 0;
    var wrap = F.dom.h('div', { class: 'fxw' });
    var pointer = F.dom.h('div', { class: 'fxw-pointer', 'aria-hidden': 'true' });
    var canvas = F.dom.h('canvas', { class: 'fxw-canvas', role: 'img', 'aria-label': opts.ariaLabel || 'Spin wheel' });
    var hub = F.dom.h('button', { class: 'fxw-hub', type: 'button', 'aria-label': opts.spinLabel || 'Spin' }, opts.spinLabel || 'SPIN');
    wrap.appendChild(pointer); wrap.appendChild(canvas); wrap.appendChild(hub);
    host.appendChild(wrap);
    var ctx = canvas.getContext('2d');
    var size = 420;

    function fit() {
      var w = Math.min(host.clientWidth || 420, opts.maxSize || 520);
      size = Math.max(240, w);
      var dpr = global.devicePixelRatio || 1;
      canvas.width = Math.round(size * dpr); canvas.height = Math.round(size * dpr);
      canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
      wrap.style.width = size + 'px'; wrap.style.height = size + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function wrapText(text, maxW, maxLines) {
      var words = String(text).split(/\s+/), lines = [], cur = '';
      words.forEach(function (w) {
        var t = cur ? cur + ' ' + w : w;
        if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
      });
      if (cur) lines.push(cur);
      if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'; }
      return lines;
    }

    function draw() {
      var n = segs.length;
      ctx.clearRect(0, 0, size, size);
      if (!n) return;
      var cx = size / 2, cy = size / 2, R = size / 2 - 6, rim = Math.max(10, size * 0.035), r = R - rim, step = TAU / n;
      // outer rim with bulbs
      var g = ctx.createRadialGradient(cx, cy, r, cx, cy, R);
      g.addColorStop(0, opts.rimA || '#2a2118'); g.addColorStop(1, opts.rimB || '#0c0907');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fillStyle = g; ctx.fill();
      var bulbs = Math.max(16, n * 3);
      for (var b = 0; b < bulbs; b++) {
        var ba = (b / bulbs) * TAU + rot * 0.35;
        ctx.beginPath(); ctx.arc(cx + Math.cos(ba) * (R - rim / 2), cy + Math.sin(ba) * (R - rim / 2), rim * 0.2, 0, TAU);
        ctx.fillStyle = (b % 2 ? (opts.bulbA || '#ffd166') : (opts.bulbB || '#fff3c4')); ctx.fill();
      }
      for (var i = 0; i < n; i++) {
        var a0 = rot + i * step, a1 = a0 + step, mid = a0 + step / 2, s = segs[i];
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
        var gr = ctx.createRadialGradient(cx, cy, r * 0.12, cx, cy, r);
        gr.addColorStop(0, shade(s.color, 0.28)); gr.addColorStop(0.55, s.color); gr.addColorStop(1, shade(s.color, -0.2));
        ctx.fillStyle = gr; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,0.38)'; ctx.stroke();
        // label + icon
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(mid);
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        var fs = Math.max(11, Math.min(18, size * 0.036 * (n > 8 ? 0.85 : 1)));
        ctx.font = '800 ' + fs + 'px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillStyle = s.textColor || '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 4;
        var maxW = r * 0.5;
        var lines = wrapText(s.label, maxW, 2);
        var lh = fs * 1.15, y0 = -((lines.length - 1) * lh) / 2;
        lines.forEach(function (ln, k) { ctx.fillText(ln, r * 0.7, y0 + k * lh); });
        var ch = s.icon ? glyph(s.icon) : '';
        if (ch) { ctx.font = '900 ' + Math.round(fs * 1.55) + 'px "Font Awesome 6 Free"'; ctx.shadowBlur = 0; ctx.textAlign = 'center'; ctx.fillText(ch, r * 0.85, 0); }
        ctx.restore();
      }
      // inner ring + hub shadow
      ctx.beginPath(); ctx.arc(cx, cy, size * 0.095, 0, TAU); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();
    }

    function shade(hex, amt) {
      var c = String(hex).replace('#', '');
      if (c.length === 3) c = c.replace(/(.)/g, '$1$1');
      var n = parseInt(c, 16), rr = (n >> 16) & 255, gg = (n >> 8) & 255, bb = n & 255;
      function f(v) { return Math.max(0, Math.min(255, Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt)))); }
      return 'rgb(' + f(rr) + ',' + f(gg) + ',' + f(bb) + ')';
    }

    function pickIndex() {
      return weightedPick(segs.map(function (s) { return s.weight || 1; }), Math.random);
    }

    function spin(forceIndex) {
      if (spinning || !segs.length) return;
      var n = segs.length;
      var target = typeof forceIndex === 'number' ? forceIndex : pickIndex();
      var frac = 0.2 + Math.random() * 0.6;
      var from = rot, to = rotationFor(target, frac, n, from, 5 + Math.floor(Math.random() * 2));
      spinning = true; wrap.classList.add('is-spinning'); hub.disabled = true;
      if (opts.onStart) opts.onStart();
      function finish() {
        rot = to; draw(); spinning = false; wrap.classList.remove('is-spinning'); hub.disabled = false;
        F.audio.chord([523, 659, 784], 200);
        if (opts.onResult) opts.onResult(segs[target], target);
      }
      if (F.motion.reduced()) { finish(); return; }
      var t0 = 0; last = indexAt(from, n);
      (function frame(ts) {
        if (!t0) t0 = ts;
        var t = Math.min(1, (ts - t0) / dur);
        rot = from + (to - from) * ease(t);
        var idx = indexAt(rot, n);
        if (idx !== last) { last = idx; F.audio.blip(520 + (idx % 5) * 40, 35, 'square', 0.03); pointer.classList.remove('is-tick'); void pointer.offsetWidth; pointer.classList.add('is-tick'); }
        draw();
        if (t < 1) raf = requestAnimationFrame(frame); else finish();
      })(performance.now());
    }

    hub.addEventListener('click', function () { spin(); });
    canvas.addEventListener('click', function () { spin(); });
    var ro = global.ResizeObserver ? new ResizeObserver(F.dom.debounce(fit, 80)) : null;
    if (ro) ro.observe(host); else global.addEventListener('resize', F.dom.debounce(fit, 120));
    fit();
    if (document.fonts && document.fonts.load) document.fonts.load('900 16px "Font Awesome 6 Free"').then(function () { draw(); }, function () {});
    return {
      spin: spin,
      setSegments: function (s) { segs = s; draw(); },
      resize: fit,
      isSpinning: function () { return spinning; },
      destroy: function () { cancelAnimationFrame(raf); if (ro) ro.disconnect(); wrap.remove(); }
    };
  }

  /* ---------- the standard page ---------- */
  function mountPage(root, cfg) {
    var h = F.dom.h, esc = F.dom.esc;
    var plan = F.store.get(cfg.saveKey, []);
    var hist = F.store.get(cfg.saveKey + '_hist', []);
    var rnd = Math.random;
    var current = null;

    var resultCard = h('div', { class: 'fx-card fxw-result', 'aria-live': 'polite' });
    var histEl = h('div', { class: 'fxw-hist' });
    var planEl = h('div', { class: 'fx-card fxw-plan' });
    var stage = h('div', { class: 'fxw-stage' });
    var left = h('div', { class: 'fxw-left' });
    var right = h('div', { class: 'fxw-right' }, resultCard, planEl);
    stage.appendChild(left); stage.appendChild(right);

    var hero = h('div', { class: 'fx-hero' },
      h('span', { class: 'fx-eyebrow' }, cfg.eyebrow || 'Let fate decide'),
      h('h2', { class: 'fx-h2' }, cfg.headline || 'Spin for a plan'),
      h('p', { class: 'fx-muted' }, cfg.sub || ''));
    root.appendChild(hero);
    root.appendChild(stage);

    var wheelHost = h('div', { class: 'fxw-host' });
    left.appendChild(wheelHost);
    var controls = h('div', { class: 'fxw-controls' });
    var soundBtn = h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm', type: 'button', 'aria-pressed': String(!F.audio.muted), onclick: function () { F.audio.setMuted(!F.audio.muted); soundBtn.setAttribute('aria-pressed', String(!F.audio.muted)); soundBtn.innerHTML = F.audio.muted ? '<i class="fa-solid fa-volume-xmark"></i> Sound off' : '<i class="fa-solid fa-volume-high"></i> Sound on'; } }, '');
    soundBtn.innerHTML = F.audio.muted ? '<i class="fa-solid fa-volume-xmark"></i> Sound off' : '<i class="fa-solid fa-volume-high"></i> Sound on';
    controls.appendChild(soundBtn);
    var wheel;
    if (cfg.daily) {
      controls.appendChild(h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm', type: 'button', onclick: function () { wheel.spin(dailyIndex(cfg.segments.length, F.now(), cfg.saveKey)); } }, h('i', { class: 'fa-solid fa-calendar-day' }), "Today's pick"));
    }
    left.appendChild(controls);
    left.appendChild(h('div', { class: 'fx-muted fxw-histlabel' }, 'Recent spins'));
    left.appendChild(histEl);

    function renderResult(seg, idea) {
      resultCard.innerHTML = '';
      var ctas = (idea.cta || []).concat(seg.cta || []);
      resultCard.appendChild(h('div', { class: 'fxw-result-head' },
        h('span', { class: 'fxw-result-ico', style: { background: seg.color } }, h('i', { class: 'fa-solid fa-' + (seg.icon || 'star') })),
        h('div', null, h('span', { class: 'fx-eyebrow' }, seg.label), h('h3', { class: 'fx-h3' }, idea.title))));
      resultCard.appendChild(h('p', { class: 'fxw-blurb' }, idea.blurb || ''));
      if (idea.steps && idea.steps.length) {
        resultCard.appendChild(h('ol', { class: 'fxw-steps' }, idea.steps.map(function (s) { return h('li', null, s); })));
      }
      var actions = h('div', { class: 'fx-row fxw-actions' });
      ctas.forEach(function (c) {
        var href = c.href || F.url(c.season || cfg.season, c.module, c.query);
        actions.appendChild(h('a', { class: 'fx-btn' + (c.ghost ? ' fx-btn--ghost' : ''), href: href, target: c.href ? '_blank' : null, rel: c.href ? 'noopener' : null }, c.icon ? h('i', { class: 'fa-solid ' + c.icon }) : null, c.label));
      });
      actions.appendChild(h('button', { class: 'fx-btn fx-btn--ghost', type: 'button', onclick: function () { addPlan(seg, idea); } }, h('i', { class: 'fa-regular fa-bookmark' }), 'Save to my plan'));
      actions.appendChild(h('button', { class: 'fx-btn fx-btn--ghost', type: 'button', onclick: function () { wheel.spin(); } }, h('i', { class: 'fa-solid fa-rotate' }), 'Spin again'));
      resultCard.appendChild(actions);
    }

    function renderHist() {
      histEl.innerHTML = '';
      if (!hist.length) { histEl.appendChild(h('span', { class: 'fx-muted' }, 'Nothing yet. Give it a spin.')); return; }
      hist.slice(0, 8).forEach(function (x) { histEl.appendChild(h('span', { class: 'fx-pill', title: x.label }, x.title)); });
    }

    function renderPlan() {
      planEl.innerHTML = '';
      planEl.appendChild(h('div', { class: 'fx-row' },
        h('h3', { class: 'fx-h3 fx-grow' }, 'My plan (' + plan.length + ')'),
        plan.length ? h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm', type: 'button', onclick: copyPlan }, h('i', { class: 'fa-regular fa-copy' }), 'Copy') : null,
        plan.length ? h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm', type: 'button', onclick: function () { global.print(); } }, h('i', { class: 'fa-solid fa-print' }), 'Print') : null));
      if (!plan.length) { planEl.appendChild(h('p', { class: 'fx-muted' }, 'Save the ideas you like and they will collect here.')); return; }
      var ul = h('ul', { class: 'fxw-planlist' });
      plan.forEach(function (p, i) {
        ul.appendChild(h('li', null, h('span', null, p.title), h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm fx-btn--icon', type: 'button', 'aria-label': 'Remove ' + p.title, onclick: function () { plan.splice(i, 1); F.store.set(cfg.saveKey, plan); renderPlan(); } }, '×')));
      });
      planEl.appendChild(ul);
    }

    function addPlan(seg, idea) {
      if (plan.some(function (p) { return p.title === idea.title; })) { F.ui.toast('Already in your plan'); return; }
      plan.unshift({ title: idea.title, icon: seg.icon, label: seg.label, blurb: idea.blurb });
      F.store.set(cfg.saveKey, plan);
      renderPlan(); F.ui.toast('Saved to your plan');
    }
    function copyPlan() {
      var text = plan.map(function (p, i) { return (i + 1) + '. ' + p.title + ' (' + p.label + ')'; }).join('\n');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { F.ui.toast('Plan copied'); }, function () { F.ui.toast('Could not copy', { kind: 'warn' }); });
      else F.ui.toast('Copy is not available here', { kind: 'warn' });
    }

    function onResult(seg) {
      var pool = (cfg.pools && cfg.pools[seg.pool]) || [{ title: seg.label, blurb: '' }];
      var idea = pool[Math.floor(rnd() * pool.length)];
      current = { seg: seg, idea: idea };
      renderResult(seg, idea);
      hist.unshift({ title: idea.title, icon: seg.icon, label: seg.label });
      hist = hist.slice(0, 20);
      F.store.set(cfg.saveKey + '_hist', hist);
      renderHist();
      resultCard.classList.remove('fx-pop'); void resultCard.offsetWidth; resultCard.classList.add('fx-pop');
    }

    resultCard.appendChild(h('div', { class: 'fxw-empty' }, h('div', { class: 'fx-soon-icon' }, h('i', { class: 'fa-solid fa-' + (cfg.emptyIcon || 'dharmachakra') })), h('p', { class: 'fx-muted' }, cfg.emptyText || 'Spin the wheel to get an idea.')));
    wheel = create(wheelHost, { segments: cfg.segments, onResult: onResult, bulbA: cfg.bulbA, bulbB: cfg.bulbB, rimA: cfg.rimA, rimB: cfg.rimB, ariaLabel: cfg.ariaLabel, maxSize: cfg.maxSize });
    renderHist(); renderPlan();
    return { wheel: wheel, getCurrent: function () { return current; } };
  }

  global.FestoWheel = { create: create, mountPage: mountPage, _pure: { norm: norm, indexAt: indexAt, rotationFor: rotationFor, weightedPick: weightedPick, dailyIndex: dailyIndex } };
})(window);
