/* ==========================================================================
   FESTO RADIO · background music that follows the visitor around a season
   Plays the synthesized stations in shared/radio/stations.js. What is playing (season, station, on/off) is kept in
   sessionStorage, so the radio picks up again on every page of the same season until the visitor turns it off.
   Browsers only let sound start after a tap or key press on each page, so if a page opens silently the small
   player says so and the next tap anywhere brings the music back.

   FestoRadio.init(season, { mini: false })  the landing page drives its own big radio, so it hides the small player
   FestoRadio.play([on]) / next() / set(i) / on(fn) / state() / stations() / analyser() / wake() / tick(freq)
   ========================================================================== */
(function (global) {
  'use strict';
  var doc = document, KEY = 'festo_radio';
  var R = global.FestoRadio = global.FestoRadio || {};
  var season = null, list = [], AC = null, master = null, analyser = null, reverb = null, NB = null;
  var live = [], timers = [], station = 0, playing = false, subs = [], inited = false;

  function load() { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify({ season: season, station: station, playing: playing })); } catch (e) {} }

  /* ---------- audio graph: master -> compressor -> analyser -> speakers, plus a convolver hall ---------- */
  function audio() {
    if (AC) return AC;
    var Ctor = global.AudioContext || global.webkitAudioContext; if (!Ctor) return null;
    AC = new Ctor(); master = AC.createGain(); master.gain.value = .42;
    var comp = AC.createDynamicsCompressor(); master.connect(comp);
    analyser = AC.createAnalyser(); analyser.fftSize = 1024; comp.connect(analyser); analyser.connect(AC.destination);
    reverb = AC.createConvolver();
    var len = AC.sampleRate * 2.8, ir = AC.createBuffer(2, len, AC.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8); }
    reverb.buffer = ir; var rg = AC.createGain(); rg.gain.value = .5; reverb.connect(rg); rg.connect(master);
    AC.onstatechange = emit;
    return AC;
  }
  function track(n) { live.push(n); return n; }
  function noiseBuf() { if (NB) return NB; NB = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate); var d = NB.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return NB; }

  /* the synth kit handed to each station recipe */
  function kit(out) {
    var A = { ac: AC, out: out, reverb: reverb };
    A.mtof = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
    A.osc = function (type, f) { var o = track(AC.createOscillator()); o.type = type; o.frequency.value = f; o.start(); return o; };
    A.gain = function (v) { var g = track(AC.createGain()); g.gain.value = v === undefined ? 1 : v; return g; };
    A.filter = function (type, f, q) { var b = track(AC.createBiquadFilter()); b.type = type; b.frequency.value = f; if (q !== undefined) b.Q.value = q; return b; };
    A.noise = function () { var s = track(AC.createBufferSource()); s.buffer = noiseBuf(); s.loop = true; s.start(); return s; };
    A.delay = function (time, fb, dest) { var dl = track(AC.createDelay(2)); dl.delayTime.value = time; var g = A.gain(fb); dl.connect(g); g.connect(dl); dl.connect(dest || out); return dl; };
    A.every = function (ms, fn) { timers.push(setInterval(fn, ms)); };
    A.bell = function (f, t, dur, vol, dest, partials) {
      (partials || [[1, 1], [2.76, .32], [5.4, .1], [8.93, .04]]).forEach(function (p) {
        var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = f * p[0];
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol * p[1], t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + dur / (p[0] > 3 ? 2.5 : 1));
        o.connect(g); g.connect(dest || out); o.start(t); o.stop(t + dur + .05);
      });
    };
    A.pluck = function (f, t, dur, vol, dest, bright) {
      var o = AC.createOscillator(), o2 = AC.createOscillator(), lp = AC.createBiquadFilter(), g = AC.createGain();
      o.type = 'sawtooth'; o.frequency.value = f; o2.type = 'triangle'; o2.frequency.value = f * 1.003;
      lp.type = 'lowpass'; lp.Q.value = 1; lp.frequency.setValueAtTime(f * (bright || 9), t); lp.frequency.exponentialRampToValueAtTime(f * 1.2, t + dur * .6);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(dest || out); o.start(t); o2.start(t); o.stop(t + dur + .05); o2.stop(t + dur + .05);
    };
    A.tone = function (f, t, dur, vol, type, dest, att) {
      var o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + (att || .02)); g.gain.setTargetAtTime(0, t + dur * .7, dur * .2);
      o.connect(g); g.connect(dest || out); o.start(t); o.stop(t + dur * 1.6 + .1);
    };
    A.chirp = function (t, f0, f1, dur, vol, dest) {
      var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * .2); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(dest || out); o.start(t); o.stop(t + dur + .02);
    };
    A.burst = function (t, dur, vol, type, f, q, dest) {
      var s = AC.createBufferSource(), b = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf(); b.type = type || 'highpass'; b.frequency.value = f || 6000; b.Q.value = q || .7;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      s.connect(b); b.connect(g); g.connect(dest || out); s.start(t, Math.random() * 1.5); s.stop(t + dur + .02);
    };
    A.seq = function (notes, beat, voice) {
      var step = 0, next = AC.currentTime + .12;
      A.every(50, function () { while (next < AC.currentTime + .3) { var n = notes[step % notes.length]; if (n[0] !== null) voice(A.mtof(n[0]), next, n[1] * beat, step); next += n[1] * beat; step++; } });
    };
    return A;
  }
  function stopStation() {
    timers.forEach(clearInterval); timers = [];
    var n = AC ? AC.currentTime : 0;
    live.forEach(function (x) { try { if (x.gain) x.gain.setTargetAtTime(0, n, .08); if (x.stop) x.stop(n + .4); } catch (e) {} });
    var dead = live; live = []; setTimeout(function () { dead.forEach(function (x) { try { x.disconnect(); } catch (e) {} }); }, 600);
  }
  function startStation(i) {
    if (!list[i]) return;
    var out = track(AC.createGain()), n = AC.currentTime; out.gain.value = 0; out.gain.linearRampToValueAtTime(1, n + 1); out.connect(master); out.connect(reverb);
    try { list[i].play(kit(out)); } catch (e) { if (global.console) console.warn('Festo radio station', i, e); }
  }

  /* ---------- browsers need a tap or key press before sound can start on a page ---------- */
  var GESTURES = ['pointerdown', 'pointerup', 'keydown', 'touchend', 'click'], waiting = false;
  function resumeOnGesture() {
    if (waiting) return; waiting = true;
    function go() { if (!AC) return; AC.resume().then(function () { GESTURES.forEach(function (t) { doc.removeEventListener(t, go, true); }); waiting = false; emit(); }, function () {}); }
    GESTURES.forEach(function (t) { doc.addEventListener(t, go, true); });
  }

  function state() { return { season: season, playing: playing, station: station, name: list[station] ? list[station].n : '', suspended: !!(playing && AC && AC.state !== 'running') }; }
  function emit() { var st = state(); subs.forEach(function (fn) { try { fn(st); } catch (e) {} }); }

  R.state = state;
  R.stations = function () { return list; };
  R.on = function (fn) { subs.push(fn); fn(state()); };
  R.analyser = function () { return playing && AC && AC.state === 'running' ? analyser : null; };
  R.wake = function () { if (!audio()) return Promise.reject(); return AC.state === 'suspended' ? AC.resume() : Promise.resolve(); };
  R.tick = function (f) {
    if (!AC || AC.state !== 'running') return;
    var o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime;
    o.type = 'triangle'; o.frequency.value = f || 600; g.gain.setValueAtTime(.05, n); g.gain.exponentialRampToValueAtTime(.0001, n + .14);
    o.connect(g); g.connect(master); o.start(n); o.stop(n + .15);
  };
  R.play = function (on) {
    if (on === undefined) on = !playing;
    if (on && !audio()) return;
    stopStation(); playing = on;
    if (on) { startStation(station); if (AC.state !== 'running') AC.resume().then(emit, resumeOnGesture); }
    save(); emit();
  };
  R.set = function (i) { if (!list.length) return; station = (i + list.length) % list.length; if (playing) { stopStation(); startStation(station); } save(); emit(); };
  R.next = function () { R.set(station + 1); };
  R.init = function (id, opts) {
    if (inited) return R; inited = true; opts = opts || {};
    season = id; list = (global.FESTO_STATIONS && global.FESTO_STATIONS[id]) || [];
    var s = load();
    if (s.season === id && list.length) {
      station = Math.min(list.length - 1, Math.max(0, s.station | 0));
      if (s.playing && audio()) { playing = true; startStation(station); if (AC.state !== 'running') { AC.resume().then(emit, function () {}); resumeOnGesture(); } }
    }
    if (opts.mini !== false) mini();
    emit();
    return R;
  };

  /* ---------- the small player on every page except the landing ---------- */
  var CSS = '.fr-mini{--fr-bg:rgba(14,10,18,.9);--fr-ink:#f1e6d2;--fr-sub:#b7a991;--fr-acc:#ffb347;--fr-line:rgba(241,212,138,.35);position:fixed;left:50%;z-index:96;bottom:calc(max(12px, env(safe-area-inset-bottom)) + var(--fr-lift, 0px));transform:translateX(-50%);display:flex;align-items:center;gap:10px;max-width:calc(100% - 28px);padding:7px 7px 7px 14px;border-radius:999px;background:var(--fr-bg);color:var(--fr-ink);box-shadow:inset 0 0 0 1px var(--fr-line),0 14px 30px -10px rgba(0,0,0,.6);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);font-family:var(--lx-engr,var(--gh-engr,system-ui,sans-serif));animation:fr-in .45s cubic-bezier(.2,.8,.2,1)}' +
    '.fr-mini[hidden]{display:none}@keyframes fr-in{from{opacity:0;transform:translate(-50%,14px)}}' +
    '.fr-eq{display:flex;align-items:flex-end;gap:2px;width:18px;height:16px;flex:none}.fr-eq i{flex:1;height:30%;border-radius:1px;background:var(--fr-acc);animation:fr-eq .9s ease-in-out infinite alternate}.fr-eq i:nth-child(2){animation-delay:-.3s}.fr-eq i:nth-child(3){animation-delay:-.6s}.fr-eq i:nth-child(4){animation-delay:-.15s}.fr-mini.is-wait .fr-eq i{animation:none;height:30%}' +
    '@keyframes fr-eq{from{height:20%}to{height:100%}}' +
    '.fr-txt{display:flex;flex-direction:column;min-width:0;line-height:1.15}.fr-txt small{font-size:8.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--fr-sub)}.fr-txt b{font-size:12.5px;font-weight:700;letter-spacing:.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:46vw}' +
    '.fr-mini button{display:grid;place-items:center;width:34px;height:34px;flex:none;border:0;border-radius:50%;padding:0;cursor:pointer;color:var(--fr-ink);background:transparent;box-shadow:inset 0 0 0 1px var(--fr-line);transition:background .2s ease}.fr-mini button:hover{background:rgba(255,255,255,.1)}.fr-mini button svg{width:15px;height:15px}.fr-mini .fr-x{color:var(--fr-acc)}' +
    '[data-season="christmas"] .fr-mini{--fr-bg:rgba(8,28,20,.92);--fr-ink:#fbf1d6;--fr-sub:#b6c0b0;--fr-acc:#f6d58a;--fr-line:rgba(246,213,138,.35)}' +
    '[data-season="summer"] .fr-mini{--fr-bg:rgba(255,250,240,.94);--fr-ink:#0f2c48;--fr-sub:#6a7886;--fr-acc:#e0532a;--fr-line:rgba(224,83,42,.3)}[data-season="summer"] .fr-mini button:hover,[data-season="spring"] .fr-mini button:hover{background:rgba(0,0,0,.05)}' +
    '[data-season="spring"] .fr-mini{--fr-bg:rgba(255,255,250,.94);--fr-ink:#1f3a29;--fr-sub:#6a7a66;--fr-acc:#cc4a6c;--fr-line:rgba(143,174,138,.55)}' +
    '@media (prefers-reduced-motion:reduce){.fr-mini,.fr-eq i{animation:none}}';
  function mini() {
    var st = doc.createElement('style'); st.textContent = CSS; doc.head.appendChild(st);
    var el = doc.createElement('div'); el.className = 'fr-mini'; el.hidden = true; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Background music');
    el.innerHTML = '<span class="fr-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="fr-txt" aria-live="polite"><small></small><b></b></span>' +
      '<button type="button" class="fr-nx" aria-label="Next station"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5l10 7-10 7zM16.5 5H19v14h-2.5z" fill="currentColor"/></svg></button>' +
      '<button type="button" class="fr-x" aria-label="Turn the music off"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" fill="currentColor"/></svg></button>';
    function mount() {
      doc.body.appendChild(el);
      el.querySelector('.fr-nx').addEventListener('click', function () { R.next(); });
      el.querySelector('.fr-x').addEventListener('click', function () { R.play(false); });
      R.on(function (s) {
        el.hidden = !s.playing;
        el.classList.toggle('is-wait', s.suspended);
        el.querySelector('small').textContent = s.suspended ? 'Tap anywhere to resume' : 'Now playing';
        el.querySelector('b').textContent = s.name;
        /* sit above the page's tab bar when it has one */
        var bar = doc.querySelector('.fx-tabs, .dock');
        el.style.setProperty('--fr-lift', bar ? Math.round(bar.getBoundingClientRect().height + 14) + 'px' : '6px');
      });
    }
    if (doc.body) mount(); else doc.addEventListener('DOMContentLoaded', mount);
    /* the shell builds its tab bar after load: re-measure once it exists */
    global.addEventListener('load', emit);
  }

  /* pages other than the landings start the radio themselves from <html data-season> */
  function auto() { var id = doc.documentElement.getAttribute('data-season'); if (id && !doc.documentElement.hasAttribute('data-radio-manual')) R.init(id); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', auto); else setTimeout(auto, 0);
})(window);
