/* ==========================================================================
   FestoArcade: a small shell for one-button canvas games. Handles the canvas size, the start / pause / game-over
   panels, the best score, sound mute, keyboard + pointer input and auto-pause when the tab loses focus.

     FestoArcade.mount(root, cfg)
       cfg = { title, storageKey, w, h, howto, create(env) -> game }
       game = { reset(), update(dt), draw(ctx, t, state), tap(x, y) }      (x, y are in the w x h game space)
       env  = { W, H, setScore(n), over(), best(), perfect(), reduced }
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, h = F.dom.h;

  function mount(root, cfg) {
    var W = cfg.w || 360, H = cfg.h || 640, dpr = Math.min(2, global.devicePixelRatio || 1);
    var bestKey = cfg.storageKey + '_best';
    var state = 'ready', score = 0, best = +F.store.get(bestKey, 0) || 0, newBest = false;

    var canvas = h('canvas', { class: 'fxa-canvas', width: Math.round(W * dpr), height: Math.round(H * dpr), tabindex: '0', role: 'img', 'aria-label': cfg.title + ' game area' });
    var ctx = canvas.getContext('2d');
    var scoreEl = h('span', { class: 'fxa-score', 'aria-live': 'off' }, '0');
    var bestEl = h('span', { class: 'fxa-best' }, 'Best ' + best);
    var muteBtn = h('button', { class: 'fx-circle-btn', type: 'button', 'aria-label': 'Toggle sound' });
    var pauseBtn = h('button', { class: 'fx-circle-btn', type: 'button', 'aria-label': 'Pause' }, h('i', { class: 'fa-solid fa-pause' }));
    var overlay = h('div', { class: 'fxa-overlay' });
    var stage = h('div', { class: 'fxa-stage' }, canvas, overlay);
    stage.style.aspectRatio = W + ' / ' + H;
    var live = h('div', { class: 'fx-sr', role: 'status', 'aria-live': 'polite' });
    var wrap = h('div', { class: 'fxa' },
      h('div', { class: 'fxa-hud' }, h('div', { class: 'fxa-nums' }, scoreEl, bestEl), h('div', { class: 'fxa-btns' }, pauseBtn, muteBtn)),
      stage, live);
    wrap.style.setProperty('--ar', (W / H).toFixed(4));
    root.appendChild(wrap);

    function setMuteIcon() { muteBtn.innerHTML = '<i class="fa-solid fa-volume-' + (F.audio.muted ? 'xmark' : 'high') + '"></i>'; }
    setMuteIcon();
    muteBtn.addEventListener('click', function () { F.audio.setMuted(!F.audio.muted); setMuteIcon(); });

    var env = {
      W: W, H: H, audio: F.audio, reduced: F.motion.reduced(),
      setScore: function (n) { score = n; scoreEl.textContent = String(n); },
      best: function () { return best; },
      over: function () { finish(); }
    };
    var game = cfg.create(env);

    function panel(kind) {
      overlay.innerHTML = '';
      overlay.hidden = kind === 'play';
      overlay.setAttribute('data-kind', kind);
      if (kind === 'play') return;
      var title = kind === 'ready' ? cfg.title : kind === 'paused' ? 'Paused' : 'Game over';
      var card = h('div', { class: 'fxa-card' }, h('h2', { class: 'fxa-title' }, title));
      if (kind === 'ready') card.appendChild(h('p', { class: 'fx-muted fxa-how' }, cfg.howto || 'Tap to play.'));
      if (kind === 'over') {
        card.appendChild(h('div', { class: 'fxa-final' }, h('span', { class: 'fxa-final-n' }, String(score)), h('span', { class: 'fx-muted' }, newBest ? 'New best' : 'Best ' + best)));
      }
      var go = h('button', { class: 'fx-btn fx-btn--lg', type: 'button', onclick: kind === 'paused' ? resume : start }, h('i', { class: 'fa-solid fa-' + (kind === 'over' ? 'rotate-right' : 'play') }), kind === 'over' ? 'Play again' : kind === 'paused' ? 'Resume' : 'Play');
      card.appendChild(go);
      overlay.appendChild(card);
      setTimeout(function () { try { go.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 30);
    }

    function start() {
      score = 0; newBest = false; env.setScore(0); game.reset(); state = 'play'; panel('play'); canvas.focus({ preventScroll: true });
      pauseBtn.disabled = false; F.audio.blip(520, 70, 'triangle', 0.05);
    }
    function pause() { if (state !== 'play') return; state = 'paused'; panel('paused'); }
    function resume() { if (state !== 'paused') return; state = 'play'; panel('play'); canvas.focus({ preventScroll: true }); }
    function finish() {
      if (state !== 'play') return;
      state = 'over'; pauseBtn.disabled = true;
      if (score > best) { best = score; newBest = true; F.store.set(bestKey, best); }
      bestEl.textContent = 'Best ' + best;
      F.audio.chord(newBest ? [523, 659, 784, 1046] : [392, 330, 262], 200);
      live.textContent = 'Game over. Score ' + score + '.';
      panel('over');
    }
    pauseBtn.addEventListener('click', function () { if (state === 'play') pause(); else if (state === 'paused') resume(); });
    pauseBtn.disabled = true;

    function toGame(e) { var r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
    canvas.addEventListener('pointerdown', function (e) { e.preventDefault(); if (state === 'ready') { start(); return; } if (state !== 'play') return; var p = toGame(e); game.tap(p.x, p.y); });
    document.addEventListener('keydown', function (e) {
      var a = document.activeElement; if (a && /input|textarea|select/i.test(a.tagName)) return;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') { if (state === 'play') pause(); else if (state === 'paused' && e.key !== 'Escape') resume(); return; }
      if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter') {
        if (a && a.tagName === 'BUTTON') return;
        e.preventDefault();
        if (state === 'ready' || state === 'over') start(); else if (state === 'play') game.tap(W / 2, H / 2);
      }
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
    global.addEventListener('blur', pause);

    var loop = F.motion.loop(function (dt, t) {
      if (state === 'play') game.update(dt);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      game.draw(ctx, t / 1000, state);
    }, { always: true });
    panel('ready');
    loop.start();
    game.reset();
    return { env: env, game: game, state: function () { return state; }, start: start, pause: pause, resume: resume };
  }

  global.FestoArcade = { mount: mount };
})(window);
