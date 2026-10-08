/* ==========================================================================
   FESTO CORE: window.Festo
   Classic script (no ES modules, no JSON fetch) so every page also works from file://.
   Load order on a module page:
     festo-core.js -> seasons/index.js -> engines/<x>.js -> <module>-data.js -> <module>.js
   ========================================================================== */
(function (global) {
  'use strict';

  var Festo = global.Festo = global.Festo || {};
  if (Festo.__core) return;
  Festo.__core = true;

  /* ---------- Root URL (works on http and file://) ---------- */
  var cs = document.currentScript;
  var coreSrc = cs && cs.src;
  if (!coreSrc) {
    var all = document.getElementsByTagName('script');
    for (var i = 0; i < all.length; i++) { if (/festo-core\.js(\?|$)/.test(all[i].src)) { coreSrc = all[i].src; break; } }
  }
  Festo.rootUrl = coreSrc ? new URL('..', coreSrc).href : new URL('./', location.href).href;

  /* ---------- Dev hooks (inert unless the query param is present) ---------- */
  var params = new URLSearchParams(location.search);
  Festo.flags = {
    offline: params.has('festoOffline'),
    mock: params.get('festoMock') || '',
    now: params.get('festoNow') || ''
  };
  Festo.now = function () {
    if (Festo.flags.now) {
      var d = new Date(Festo.flags.now);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  };

  Festo.config = { affiliate: { amazonTag: '', bookshopId: '' } };

  /* ---------- Storage (try/catch + memory fallback) ---------- */
  var memory = {};
  Festo.store = {
    get: function (k, fallback) {
      try {
        var v = localStorage.getItem(k);
        if (v === null) return k in memory ? memory[k] : fallback;
        return JSON.parse(v);
      } catch (e) { return k in memory ? memory[k] : fallback; }
    },
    set: function (k, v) {
      memory[k] = v;
      try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
    },
    remove: function (k) {
      delete memory[k];
      try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
    }
  };

  /* ---------- Small utilities ---------- */
  var util = Festo.util = {
    clamp: function (n, lo, hi) { return Math.min(hi, Math.max(lo, n)); },
    hashStr: function (s) {
      var h = 2166136261;
      s = String(s);
      for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
      return h >>> 0;
    },
    hashHue: function (s) { return util.hashStr(s) % 360; },
    rng: function (seed) {
      var a = seed >>> 0;
      return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        var t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    },
    dayOfYear: function (d) {
      d = d || Festo.now();
      var start = new Date(d.getFullYear(), 0, 0);
      return Math.floor((d - start) / 86400000);
    },
    dayKey: function (d) {
      d = d || Festo.now();
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    },
    pad2: function (n) { return n < 10 ? '0' + n : String(n); },
    uid: function () { return Math.random().toString(36).slice(2, 9); },
    km2mi: function (km) { return km * 0.621371; },
    fmtDist: function (km, imperial) {
      if (imperial !== false) { var mi = km * 0.621371; return (mi < 10 ? mi.toFixed(1) : Math.round(mi)) + ' mi'; }
      return (km < 10 ? km.toFixed(1) : Math.round(km)) + ' km';
    },
    pick: function (arr, rnd) { return arr[Math.floor((rnd || Math.random)() * arr.length)]; },
    shuffle: function (arr, rnd) {
      var a = arr.slice(), r = rnd || Math.random;
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
  };

  /* ---------- DOM helpers ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function applyAttrs(el, attrs, isSvg) {
    if (!attrs) return;
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class' || k === 'className') { if (isSvg) el.setAttribute('class', v); else el.className = v; }
      else if (k === 'style' && typeof v === 'object') {
        Object.keys(v).forEach(function (p) { if (p.indexOf('--') === 0) el.style.setProperty(p, v[p]); else el.style[p] = v[p]; });
      }
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    });
  }
  function appendKids(el, kids) {
    kids.forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) appendKids(el, c);
      else if (c instanceof Node) el.appendChild(c);
      else el.appendChild(document.createTextNode(String(c)));
    });
  }
  Festo.dom = {
    h: function (tag, attrs) {
      var el = document.createElement(tag);
      applyAttrs(el, attrs, false);
      appendKids(el, Array.prototype.slice.call(arguments, 2));
      return el;
    },
    svg: function (tag, attrs) {
      var el = document.createElementNS(SVGNS, tag);
      applyAttrs(el, attrs, true);
      appendKids(el, Array.prototype.slice.call(arguments, 2));
      return el;
    },
    esc: function (s) {
      return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    debounce: function (fn, ms) {
      var t;
      return function () {
        var a = arguments, ctx = this;
        clearTimeout(t);
        t = setTimeout(function () { fn.apply(ctx, a); }, ms);
      };
    },
    throttle: function (fn, ms) {
      var last = 0, t;
      return function () {
        var a = arguments, ctx = this, now = Date.now();
        if (now - last >= ms) { last = now; fn.apply(ctx, a); }
        else { clearTimeout(t); t = setTimeout(function () { last = Date.now(); fn.apply(ctx, a); }, ms - (now - last)); }
      };
    },
    ready: function (fn) {
      if (document.readyState !== 'loading') fn();
      else document.addEventListener('DOMContentLoaded', fn);
    }
  };

  /* ---------- Network: timeout, retries, queue ---------- */
  Festo.net = {
    json: function (url, opts) {
      opts = opts || {};
      if (Festo.flags.offline) return Promise.reject(new Error('offline'));
      var timeoutMs = opts.timeoutMs || 8000, retries = opts.retries === undefined ? 1 : opts.retries;
      function attempt(n) {
        var ctl = new AbortController();
        var timer = setTimeout(function () { ctl.abort(); }, timeoutMs);
        if (opts.signal) opts.signal.addEventListener('abort', function () { ctl.abort(); });
        var init = { signal: ctl.signal };
        if (opts.method) init.method = opts.method;
        if (opts.body) init.body = opts.body;
        if (opts.headers) init.headers = opts.headers;
        return fetch(url, init).then(function (r) {
          clearTimeout(timer);
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        }).catch(function (err) {
          clearTimeout(timer);
          if (n < retries && !(opts.signal && opts.signal.aborted)) return attempt(n + 1);
          throw err;
        });
      }
      return attempt(0);
    },
    queue: function (max) {
      max = max || 4;
      var running = 0, pending = [];
      function pump() {
        while (running < max && pending.length) {
          pending.sort(function (a, b) { return b.pri - a.pri; });
          var job = pending.shift();
          running++;
          Promise.resolve().then(job.fn).then(job.res, job.rej).then(function () { running--; pump(); });
        }
      }
      return {
        add: function (fn, priority) {
          return new Promise(function (res, rej) { pending.push({ fn: fn, pri: priority || 0, res: res, rej: rej }); pump(); });
        },
        size: function () { return pending.length + running; }
      };
    }
  };

  /* ---------- Motion ---------- */
  Festo.motion = {
    reduced: function () {
      return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    },
    /* rAF loop that pauses when the tab is hidden. Under reduced motion it renders one frame
       unless opts.always is set (games need frames regardless). */
    loop: function (fn, opts) {
      opts = opts || {};
      var raf = 0, last = 0, running = false;
      function frame(t) {
        if (!running) return;
        var dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
        last = t;
        fn(dt, t);
        raf = requestAnimationFrame(frame);
      }
      function start() {
        if (running) return;
        if (Festo.motion.reduced() && !opts.always) { fn(0.016, 0); return; }
        running = true; last = 0; raf = requestAnimationFrame(frame);
      }
      function stop() { running = false; cancelAnimationFrame(raf); }
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { if (running) { stop(); loopObj._wasRunning = true; } }
        else if (loopObj._wasRunning) { loopObj._wasRunning = false; start(); }
      });
      var loopObj = { start: start, stop: stop, _wasRunning: false, running: function () { return running; } };
      return loopObj;
    }
  };

  /* ---------- Sound (tiny WebAudio blips; mute is remembered) ---------- */
  Festo.audio = {
    ctx: null,
    muted: !!Festo.store.get('festo_muted', false),
    ensure: function () {
      if (!this.ctx) { var AC = global.AudioContext || global.webkitAudioContext; if (AC) this.ctx = new AC(); }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    blip: function (freq, ms, type, vol) {
      if (this.muted) return;
      var c = this.ensure();
      if (!c) return;
      ms = ms || 60; vol = vol || 0.04;
      var o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
      o.type = type || 'square';
      o.frequency.value = freq || 600;
      o.connect(g); g.connect(c.destination);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
      o.start(t); o.stop(t + ms / 1000 + 0.02);
    },
    chord: function (freqs, ms) {
      var self = this;
      freqs.forEach(function (f, i) { setTimeout(function () { self.blip(f, ms || 220, 'triangle', 0.05); }, i * 70); });
    },
    setMuted: function (m) { this.muted = !!m; Festo.store.set('festo_muted', this.muted); }
  };

  /* ---------- UI: toast, modal, sidebar ---------- */
  var toastHost;
  Festo.ui = {
    toast: function (msg, opts) {
      opts = opts || {};
      if (!toastHost) {
        toastHost = Festo.dom.h('div', { class: 'fx-toast-host', 'aria-live': 'polite', role: 'status' });
        document.body.appendChild(toastHost);
      }
      var t = Festo.dom.h('div', { class: 'fx-toast' + (opts.kind ? ' fx-toast--' + opts.kind : '') }, msg);
      toastHost.appendChild(t);
      setTimeout(function () { t.remove(); }, opts.ms || 2600);
    },
    modal: function (el) {
      var lastFocus = null;
      function focusables() {
        return Array.prototype.slice.call(el.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'))
          .filter(function (n) { return n.offsetParent !== null; });
      }
      function onKey(e) {
        if (e.key === 'Escape') { close(); return; }
        if (e.key !== 'Tab') return;
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      function open() {
        lastFocus = document.activeElement;
        el.classList.add('is-open');
        el.setAttribute('aria-hidden', 'false');
        document.addEventListener('keydown', onKey);
        var f = focusables();
        if (f.length) f[0].focus();
      }
      function close() {
        el.classList.remove('is-open');
        el.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', onKey);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
        if (api.onclose) api.onclose();
      }
      el.addEventListener('click', function (e) {
        if (e.target === el || e.target.closest('[data-fx-close]')) close();
      });
      var api = { el: el, open: open, close: close, isOpen: function () { return el.classList.contains('is-open'); } };
      return api;
    },
    sidebar: function (toggleBtn, sidebarEl) {
      var scrim = Festo.dom.h('div', { class: 'fx-scrim' });
      document.body.appendChild(scrim);
      function set(open) {
        sidebarEl.classList.toggle('is-open', open);
        scrim.classList.toggle('is-open', open);
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(open));
      }
      if (toggleBtn) toggleBtn.addEventListener('click', function () { set(!sidebarEl.classList.contains('is-open')); });
      scrim.addEventListener('click', function () { set(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
      return { open: function () { set(true); }, close: function () { set(false); }, toggle: function () { set(!sidebarEl.classList.contains('is-open')); } };
    }
  };

  /* ---------- Season registry (data lives in seasons/index.js) ---------- */
  var seasons = {};
  Festo.registerSeason = function (id, def) { def.id = id; seasons[id] = def; };
  Festo.seasons = {
    all: function () { return seasons; },
    get: function (id) { return seasons[id]; },
    detect: function (d) {
      var m = (d || Festo.now()).getMonth();
      if (m >= 2 && m <= 4) return 'spring';
      if (m >= 5 && m <= 7) return 'summer';
      if (m >= 8 && m <= 9) return 'halloween';
      return 'christmas';
    }
  };

  /* Absolute URL for a season module (or 'landing' / 'hub'). */
  Festo.url = function (seasonId, moduleId, query) {
    var u;
    if (seasonId === 'hub' || !seasonId) u = new URL('index.html', Festo.rootUrl).href;
    else {
      var s = seasons[seasonId];
      if (!s) return '#';
      var path = moduleId === 'landing' || !moduleId ? s.landing : null;
      if (!path) {
        for (var i = 0; i < s.modules.length; i++) if (s.modules[i].id === moduleId) path = s.modules[i].path;
      }
      if (!path) return '#';
      u = new URL((s.root ? s.root + '/' : '') + path, Festo.rootUrl).href;
    }
    return query ? u + (u.indexOf('?') < 0 ? '?' : '&') + query : u;
  };

  /* ---------- Fonts ---------- */
  Festo.loadFonts = function (seasonId) {
    var s = seasons[seasonId];
    if (!s || !s.fontsQuery || document.querySelector('link[data-fx-fonts]')) return;
    var pre1 = Festo.dom.h('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' });
    var pre2 = Festo.dom.h('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' });
    var css = Festo.dom.h('link', { rel: 'stylesheet', 'data-fx-fonts': '1', href: 'https://fonts.googleapis.com/css2?' + s.fontsQuery + '&display=swap' });
    document.head.appendChild(pre1); document.head.appendChild(pre2); document.head.appendChild(css);
  };

  /* ---------- Shell: scene + app bar + tab bar + launcher ---------- */
  function ico(name, cls) { return Festo.dom.h('i', { class: 'fa-solid fa-' + name + (cls ? ' ' + cls : '') }); }
  function pickStyle(seasonId) {
    var q = params.get('nav');
    if (q === '1' || q === '2') { Festo.store.set('festo_nav_' + seasonId, q); return q; }
    return Festo.store.get('festo_nav_' + seasonId, '1') === '2' ? '2' : '1';
  }
  Festo.navs = Festo.navs || {};   // style-2 builders: Festo.navs.halloween = function (ctx) { ... }

  var shellState = null;
  Festo.shell = {
    mount: function (cfg) {
      var s = seasons[cfg.season];
      if (!s) throw new Error('Unknown season ' + cfg.season);
      var h = Festo.dom.h, html = document.documentElement;
      html.setAttribute('data-season', cfg.season);
      var style = pickStyle(cfg.season);
      html.setAttribute('data-nav', style);
      document.body.classList.add('fx-body', 'fx-app');
      Festo.loadFonts(cfg.season);
      var mod = null;
      s.modules.forEach(function (m) { if (m.id === cfg.module) mod = m; });
      var title = cfg.title || (mod ? mod.title || mod.label : s.name);
      document.title = cfg.season === 'hub' ? 'Festo · Four seasons, one app' : (mod ? title + ' · ' + s.name : s.name) + ' · Festo';

      var scene = h('div', { class: 'fx-scene', 'aria-hidden': 'true' });
      if (Festo.scenes && Festo.scenes[cfg.season]) scene.innerHTML = Festo.scenes[cfg.season]();
      var main = document.getElementById('fx-main');
      var frame = h('div', { class: 'fx-app-frame' });
      var isHome = cfg.module === 'landing';
      var back = cfg.left || h('a', { class: 'fx-circle-btn', href: isHome ? Festo.url('hub', null, 'choose=1') : Festo.url(cfg.season, 'landing'), 'aria-label': isHome ? 'All seasons' : 'Back to ' + s.name, title: isHome ? 'All seasons' : s.name }, ico('chevron-left'));
      var action = h('button', { class: 'fx-circle-btn', type: 'button', 'aria-label': 'Open menu', 'aria-haspopup': 'dialog' }, ico('grip'));
      var appbar = h('header', { class: 'fx-appbar' }, back,
        h('h1', { class: 'fx-apptitle' }, h('span', null, title), ico(s.icon, 'fx-mascot')), action);
      document.body.insertBefore(scene, document.body.firstChild);
      document.body.insertBefore(h('a', { class: 'fx-skip', href: '#fx-main' }, 'Skip to content'), document.body.firstChild);
      if (main) main.setAttribute('tabindex', '-1');
      document.body.insertBefore(frame, scene.nextSibling);
      frame.appendChild(appbar);
      if (main) { main.classList.add('fx-main'); frame.appendChild(main); }

      shellState = { season: cfg.season, s: s, module: cfg.module, mod: mod, frame: frame, appbar: appbar, action: action, style: style, nav: null, sheet: null };
      shellState.currentAction = function () { Festo.shell.openLauncher(); };
      action.addEventListener('click', function () { shellState.currentAction(); });
      Festo.shell.buildNav();
      shellState.sheet = Festo.shell.buildLauncher();
      document.body.appendChild(shellState.sheet.el);
      return main;
    },

    /* A module can retarget the top-right circle button (for example to focus its search box). */
    setAction: function (a) {
      if (!shellState) return;
      shellState.action.innerHTML = '';
      shellState.action.appendChild(ico(a.icon || 'magnifying-glass'));
      shellState.action.setAttribute('aria-label', a.label || 'Search');
      shellState.currentAction = a.onclick;
    },

    buildNav: function () {
      var st = shellState, h = Festo.dom.h;
      if (st.nav) st.nav.remove();
      document.documentElement.setAttribute('data-nav', st.style);
      var build = st.style === '2' && Festo.navs[st.season] ? Festo.navs[st.season] : Festo.shell.tabBar;
      st.nav = build({ season: st.season, s: st.s, module: st.module, openLauncher: Festo.shell.openLauncher, h: h, ico: ico, url: Festo.url });
      document.body.appendChild(st.nav);
    },

    /* Style 1 (every season): Home, a tab, a big round centre button, then two more tabs. Each season's CSS gives it its own look. */
    tabBar: function (ctx) {
      var h = ctx.h, s = ctx.s;
      var tabs = (s.tabs || []).map(function (id) { return s.modules.filter(function (m) { return m.id === id; })[0]; }).filter(Boolean);
      function tab(m) {
        var on = m.id === ctx.module;
        return h('a', { class: 'fx-tab' + (on ? ' is-active' : ''), href: ctx.url(ctx.season, m.id), 'aria-current': on ? 'page' : null }, ctx.ico(m.icon.replace('fa-', '')), h('span', null, m.label));
      }
      var inTabs = tabs.some(function (m) { return m.id === ctx.module; });
      var fab = h('button', { class: 'fx-fab' + (!inTabs && ctx.module && ctx.module !== 'landing' ? ' is-active' : ''), type: 'button', 'aria-label': 'All sections', 'aria-haspopup': 'dialog', onclick: ctx.openLauncher });
      if (Festo.art && Festo.art.fab && Festo.art.fab[ctx.season]) fab.innerHTML = Festo.art.fab[ctx.season](); else fab.appendChild(ctx.ico(s.fab || 'grip'));
      var home = h('a', { class: 'fx-tab' + (ctx.module === 'landing' ? ' is-active' : ''), href: ctx.url(ctx.season, 'landing'), 'aria-current': ctx.module === 'landing' ? 'page' : null }, ctx.ico('house'), h('span', null, s.short));
      /* four tabs (the hub's four seasons) replace the Home tab */
      var four = tabs.length === 4;
      var left = four ? [tab(tabs[0]), tab(tabs[1])] : [home, tabs[0] ? tab(tabs[0]) : h('span')];
      var right = four ? [tab(tabs[2]), tab(tabs[3])] : [tabs[1] ? tab(tabs[1]) : h('span'), tabs[2] ? tab(tabs[2]) : h('span')];
      return h('nav', { class: 'fx-tabs', 'aria-label': s.name }, left, fab, right);
    },

    buildLauncher: function () {
      var st = shellState, h = Festo.dom.h, s = st.s;
      var tiles = [h('a', { class: 'fx-sheet-tile', href: Festo.url(st.season, 'landing') }, ico('house'), h('span', null, s.short))];
      s.modules.forEach(function (m) { tiles.push(h('a', { class: 'fx-sheet-tile' + (m.id === st.module ? ' is-active' : ''), href: Festo.url(st.season, m.id) }, ico(m.icon.replace('fa-', '')), h('span', null, m.label))); });
      if (st.season !== 'hub') tiles.push(h('a', { class: 'fx-sheet-tile', href: Festo.url('hub', null, 'choose=1') }, ico('compass'), h('span', null, 'All seasons')));
      var styleBtn = function (n) { return h('button', { class: 'fx-pill' + (st.style === n ? ' is-active' : ''), type: 'button', 'aria-label': 'Navigation style ' + n, onclick: function () { Festo.shell.setStyle(n); } }, 'Style ' + n); };
      var snd = h('button', { class: 'fx-pill', type: 'button', 'aria-label': 'Toggle sound' }, ico(Festo.audio.muted ? 'volume-xmark' : 'volume-high'));
      snd.addEventListener('click', function () { Festo.audio.setMuted(!Festo.audio.muted); snd.innerHTML = ''; snd.appendChild(ico(Festo.audio.muted ? 'volume-xmark' : 'volume-high')); });
      var el = h('div', { class: 'fx-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': s.name + ' menu' },
        h('div', { class: 'fx-sheet-card' },
          h('div', { class: 'fx-row' }, h('h2', { class: 'fx-h2 fx-grow' }, s.name), h('button', { class: 'fx-circle-btn', type: 'button', 'aria-label': 'Close menu', 'data-fx-close': '1' }, ico('xmark'))),
          h('div', { class: 'fx-sheet-grid' }, tiles),
          h('div', { class: 'fx-sheet-foot' }, Festo.navs[st.season] ? h('div', { class: 'fx-row' }, styleBtn('1'), styleBtn('2')) : h('span'), snd)));
      el.addEventListener('click', function (e) { if (e.target === el || e.target.closest('[data-fx-close]')) Festo.shell.closeLauncher(); });
      if (!shellState.escBound) { shellState.escBound = true; document.addEventListener('keydown', function (e) { if (e.key === 'Escape') Festo.shell.closeLauncher(); }); }
      return { el: el };
    },
    openLauncher: function () { if (shellState) { shellState.sheet.el.classList.add('is-open'); var f = shellState.sheet.el.querySelector('a,button'); if (f) f.focus(); } },
    closeLauncher: function () { if (shellState) shellState.sheet.el.classList.remove('is-open'); },
    setStyle: function (n) {
      if (!shellState) return;
      shellState.style = n; Festo.store.set('festo_nav_' + shellState.season, n);
      Festo.shell.buildNav();
      shellState.sheet.el.remove(); shellState.sheet = Festo.shell.buildLauncher(); document.body.appendChild(shellState.sheet.el);
      Festo.shell.openLauncher();
    },
    actions: function () { return null; }
  };

  /* Wrap an engine mount so a failure shows a friendly card, never a blank page. */
  Festo.guard = function (name, fn) {
    try { return fn(); }
    catch (err) {
      if (global.console) console.error('[Festo] ' + name + ' failed', err);
      var host = document.getElementById('fx-main') || document.body;
      var s = seasons[document.documentElement.getAttribute('data-season')];
      host.appendChild(Festo.dom.h('div', { class: 'fx-error' },
        Festo.dom.h('div', { class: 'fx-soon-icon' }, Festo.dom.h('i', { class: 'fa-solid fa-triangle-exclamation' })),
        Festo.dom.h('h2', { class: 'fx-h2' }, 'Something went wrong in ' + name),
        Festo.dom.h('p', { class: 'fx-muted' }, 'The rest of the site is fine. You can head back and try again.'),
        Festo.dom.h('a', { class: 'fx-btn', href: s ? Festo.url(s.id, 'landing') : Festo.url('hub', null, 'choose=1') }, 'Back to ' + (s ? s.name : 'the hub'))));
      return null;
    }
  };

  /* ---------- Geolocation + city search ---------- */
  var GEO_KEY = 'festo_geo';
  Festo.geo = {
    saved: function () { return Festo.store.get(GEO_KEY, null); },
    save: function (loc) { Festo.store.set(GEO_KEY, loc); },
    fallback: function (seasonId) {
      var s = seasons[seasonId || document.documentElement.getAttribute('data-season')] || seasons.halloween;
      var l = s ? s.location : { lat: 40.7128, lon: -74.006, label: 'New York, NY' };
      return { lat: l.lat, lon: l.lon, label: l.label, source: 'default' };
    },
    /* Resolves with saved -> (device if ask) -> season default. Never rejects. */
    get: function (opts) {
      opts = opts || {};
      var saved = Festo.geo.saved();
      var fb = saved ? Object.assign({ source: 'saved' }, saved) : Festo.geo.fallback(opts.season);
      if (!opts.ask || !navigator.geolocation || Festo.flags.offline) return Promise.resolve(fb);
      return new Promise(function (resolve) {
        navigator.geolocation.getCurrentPosition(function (p) {
          var loc = { lat: p.coords.latitude, lon: p.coords.longitude, label: 'Your location', source: 'device' };
          Festo.geo.save({ lat: loc.lat, lon: loc.lon, label: loc.label });
          resolve(loc);
        }, function () { resolve(fb); }, { timeout: 8000, maximumAge: 600000 });
      });
    },
    search: function (q) {
      q = String(q || '').trim();
      if (q.length < 2) return Promise.resolve([]);
      return Festo.net.json('https://geocoding-api.open-meteo.com/v1/search?count=6&language=en&format=json&name=' + encodeURIComponent(q), { timeoutMs: 6000, retries: 0 })
        .then(function (d) {
          return (d.results || []).map(function (r) {
            return { lat: r.latitude, lon: r.longitude, label: [r.name, r.admin1, r.country_code].filter(Boolean).join(', ') };
          });
        });
    },
    haversine: function (a, b) {
      var R = 6371, rad = Math.PI / 180;
      var dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
      var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      return 2 * R * Math.asin(Math.sqrt(x));
    }
  };

  /* ---------- Outbound links (search URLs only; no invented SKUs) ---------- */
  Festo.links = {
    book: function (b) {
      var q = encodeURIComponent((b.title || '') + ' ' + (b.author || ''));
      var tag = Festo.config.affiliate.amazonTag;
      return {
        bookshop: 'https://bookshop.org/search?keywords=' + q,
        amazon: 'https://www.amazon.com/s?k=' + q + (tag ? '&tag=' + encodeURIComponent(tag) : ''),
        library: 'https://www.worldcat.org/search?q=' + q,
        goodreads: 'https://www.goodreads.com/search?q=' + q,
        affiliate: !!tag
      };
    },
    movie: function (m) {
      var q = encodeURIComponent(m.title || '');
      return {
        watch: 'https://www.justwatch.com/us/search?q=' + q,
        trailer: 'https://www.youtube.com/results?search_query=' + encodeURIComponent((m.title || '') + ' ' + (m.year || '') + ' official trailer')
      };
    },
    search: function (retailer, q) {
      q = encodeURIComponent(q);
      var map = {
        amazon: 'https://www.amazon.com/s?k=' + q + (Festo.config.affiliate.amazonTag ? '&tag=' + encodeURIComponent(Festo.config.affiliate.amazonTag) : ''),
        etsy: 'https://www.etsy.com/search?q=' + q,
        target: 'https://www.target.com/s?searchTerm=' + q,
        walmart: 'https://www.walmart.com/search?q=' + q,
        google: 'https://www.google.com/search?tbm=shop&q=' + q
      };
      return map[retailer] || map.google;
    }
  };
})(window);
