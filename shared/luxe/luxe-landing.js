/* ==========================================================================
   FESTO LUXE · season landing engine (Christmas, Summer, Spring)
   The page is built from two things:
     the season registry (shared/seasons/index.js)  every link, label, count and the countdown spec
     the season's luxe config (shared/luxe/<season>-landing.js)  art, featured books and films, radio stations,
                                                                 sky painter and the four wallpaper scenes
   Living parts: book shelf · film posters (FestoCovers, same cache as the Cinema page) · synthesized radio
   real Activity Wheel wedges · places near the visitor (Festo.geo + map data) · live sun times · daily lore
   wallpaper vault (canvas PNG at 1080x1920 or 1920x1080) · countdown · scroll reveal · launcher sheet.
   Canvases pause off screen and when the tab is hidden; everything respects reduced motion.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, L = global.FestoLuxe, doc = document, root = doc.documentElement;
  var id = root.getAttribute('data-season'), S = L.seasons[id], C = S.landing, R = F.seasons.get(id);
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var reduced = F.motion.reduced();
  var DPR = Math.min(2, global.devicePixelRatio || 1);
  function el(tag, cls, html) { var e = doc.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function roman(n) { var m = [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], s = ''; m.forEach(function (p) { while (n >= p[0]) { s += p[1]; n -= p[0]; } }); return s; }
  function fit(cv) { var w = Math.round(cv.clientWidth * DPR), h = Math.round(cv.clientHeight * DPR); if (w && h && (cv.width !== w || cv.height !== h)) { cv.width = w; cv.height = h; return true; } return false; }
  var mods = {}; R.modules.forEach(function (m) { mods[m.id] = m; });
  function href(mid) { return mid === 'landing' ? F.url(id, 'landing') : mods[mid] ? F.url(id, mid) : '#'; }
  var hub = F.url('hub', null, 'choose=1');

  L.atmos(id);

  /* ---------- UI icon sprite ---------- */
  var ICONS = {
    back: '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    grid: '<g fill="currentColor"><circle cx="6" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></g>',
    arrow: '<path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    play: '<path d="M7 4.5l13 7.5-13 7.5z" fill="currentColor"/>',
    pause: '<path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" fill="currentColor"/>',
    next: '<path d="M6 5l10 7-10 7zM16.5 5H19v14h-2.5z" fill="currentColor"/>',
    star: '<path d="M12 2l2.6 6.9 7.4.4-5.8 4.6 2 7.1L12 17l-6.2 4 2-7.1L2 9.3l7.4-.4z"/>',
    home: '<path d="M3.5 21V11.5L12 3l8.5 8.5V21h-6v-5.5a2.5 2.5 0 0 0-5 0V21z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    map: '<path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z M9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    store: '<path d="M5 8h14l-1 12H6z M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    music: '<path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="16" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    books: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    movies: '<rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" stroke="currentColor" stroke-width="1.7"/>',
    wheel: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="currentColor" stroke-width="1.4"/>',
    workshop: '<path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 7c-2-4-6-4-6-1.5S10 7 12 7c2 0 6 1 6-1.5S14 3 12 7z" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    game: '<path d="M7 9h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L14.5 14h-5l-1.1 1.8A3 3 0 0 1 3 14v-1a4 4 0 0 1 4-4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 11v3M6.5 12.5h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16" cy="12" r="1" fill="currentColor"/>',
    snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    sun: '<circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6.2 9.5 4.3 4.3 0 0 0 7 18z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    compass: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor"/>',
    download: '<path d="M12 3v12M6.5 10l5.5 5.5 5.5-5.5M4 20h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    desktop: '<rect x="2.5" y="4" width="19" height="12.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 20.5h7M12 16.5v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 5h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
  };
  var sprite = '<svg class="lx-sprite" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    Object.keys(ICONS).map(function (k) { return '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; }).join('') + '</defs></svg>';
  function ico(k) { return '<svg aria-hidden="true"><use href="#i-' + k + '"/></svg>'; }
  function modIcon(m) { return m.id === 'weather' ? (C.sky.icon || 'sun') : ICONS[m.id] ? m.id : 'compass'; }

  /* ==========================================================================
     MARKUP
     ========================================================================== */
  var gameMod = C.game && mods[C.game.module] ? C.game : null;
  var tabs = (R.tabs || ['map', 'store', 'music']).filter(function (t) { return mods[t]; }).slice(0, 3);
  var count = function (k) { var v = R.counts && R.counts[k]; return v ? (+v).toLocaleString('en-US') : ''; };
  var Radio = global.FestoRadio.init(id, { mini: false }), stations = Radio.stations();

  var html = sprite +
    '<div class="page">' +
      (C.arch ? '<div class="arch in" style="--d:.02s" aria-hidden="true">' + C.arch + '</div>' : '') +
      '<header class="hdr">' +
        '<a class="hbtn in" style="--d:.1s" href="' + hub + '" aria-label="All seasons" title="All seasons">' + ico('back') + '</a>' +
        '<div class="brand in" style="--d:.15s">' + (C.flank ? '<svg class="flank l" aria-hidden="true"><use href="#' + C.flank + '"/></svg>' : '') +
          '<h1 class="wordmark">Festo</h1><span class="edition" aria-hidden="true">' + esc(R.name) + '</span>' +
          (C.flank ? '<svg class="flank r" aria-hidden="true"><use href="#' + C.flank + '"/></svg>' : '') + '</div>' +
        '<button class="hbtn in" style="--d:.1s" id="openLauncher" aria-label="All ' + esc(R.name) + ' pages" aria-haspopup="dialog">' + ico('grid') + '</button>' +
      '</header>' +
      '<nav class="hnav in" style="--d:.25s" aria-label="' + esc(R.name) + ' pages">' + R.modules.map(function (m) { return '<a href="' + href(m.id) + '">' + esc(m.label) + '</a>'; }).join('') + '</nav>' +
      '<div class="plaque in" style="--d:.3s" role="timer" aria-label="Countdown">' +
        '<i class="rivet"></i><i class="rivet"></i><i class="rivet"></i><i class="rivet"></i>' +
        '<div class="emboss"><div class="lbl">' + esc(C.plaque.lbl) + '</div><div class="ttl" id="cdTitle">' + esc(C.plaque.until) + '</div></div>' +
        '<div class="cd-row"><div class="cd"><b id="cdD">--</b><span id="cdDl">DAYS</span></div><div class="cd sub"><b id="cdH">--</b><span>HRS</span></div><div class="cd sub"><b id="cdM">--</b><span>MIN</span></div></div>' +
      '</div>' +
      '<main class="realm" id="realm" tabindex="-1">' +
        '<div class="rule rv"><h2>' + esc(C.rules[0]) + '</h2></div>' +

        '<section class="gc c-shelf rv" aria-labelledby="shelfT">' +
          '<div class="gc-row"><div><h2 class="gc-title" id="shelfT">' + esc(mods.books.title) + '</h2><p class="gc-sub"><span>' + count('books') + '</span> ' + esc(C.shelf.sub) + '</p></div>' +
          '<a class="go" href="' + href('books') + '">' + esc(C.shelf.cta) + ' ' + ico('arrow') + '</a></div>' +
          '<div class="library"><div class="books" id="books" role="list" aria-label="Featured books"></div><div class="shelf-plank"></div></div>' +
          '<div class="shelf-note" aria-live="polite"><div><div class="t" id="noteT"></div><div class="a" id="noteA"></div></div>' +
          '<a class="pill" id="noteOpen" href="' + href('books') + '">Find in library</a><p class="b" id="noteB"></p></div>' +
        '</section>' +

        '<section class="gc marquee c-cinema rv" aria-labelledby="cineT">' +
          '<div class="mq-head"><div class="bulbs t"></div><span class="board">' + esc(C.cinema.board) + '</span><div class="bulbs b"></div></div>' +
          '<div class="reel"><div class="strip" id="strip"></div><div class="grain-anim"></div></div>' +
          '<div class="mq-foot"><div><h2 class="gc-title" id="cineT">' + esc(C.cinema.title) + '</h2><p class="gc-sub"><span>' + count('films') + '</span> ' + esc(C.cinema.sub) + '</p></div>' +
          '<a class="pill ghost" href="' + href('movies') + '">' + esc(C.cinema.cta) + '</a></div>' +
        '</section>' +

        '<div class="rule rv"><h2>' + esc(C.rules[1]) + '</h2></div>' +

        (mods.music ? '<section class="gc c-sound rv" aria-label="' + esc(mods.music.title) + '">' +
          '<div class="device" id="cab">' + C.sound.device +
            '<div class="dial" aria-hidden="true"><div class="ticks"></div><div class="names">' + stations.map(function (s) { return '<span>' + esc(s.short || s.n) + '</span>'; }).join('') + '</div><div class="needle" id="needle" style="left:' + stations[0].x + '%"></div></div>' +
            '<div class="scope"><canvas id="scope"></canvas></div>' +
          '</div>' +
          '<div class="controls"><button class="knob big" id="sPlay" aria-label="Play the ' + esc(C.sound.noun) + '"><svg id="sPlayIco" aria-hidden="true"><use href="#i-play"/></svg></button>' +
          '<button class="knob" id="sNext" aria-label="Next station">' + ico('next') + '</button>' +
          '<div class="station" aria-live="polite"><small id="sNum">STATION I</small><b id="sName">' + esc(stations[0].n) + '</b></div>' +
          '<a class="go" href="' + href('music') + '">Playlists ' + ico('arrow') + '</a></div>' +
        '</section>' : '') +

        (gameMod ? '<a class="gc c-game rv" href="' + href(gameMod.module) + '" aria-labelledby="gameT"><span class="stall-art">' + gameMod.art + '</span>' +
          '<span><h2 class="gc-title" id="gameT">' + esc(mods[gameMod.module].title) + '</h2><span class="gc-sub" style="display:block">' + esc(gameMod.sub) + '</span></span></a>' : '') +

        '<a class="gc c-wheel rv' + (gameMod ? '' : ' solo') + '" href="' + href('wheel') + '" aria-labelledby="wheelT"><span class="stall-art"><canvas class="wheel-mini" id="wheel" width="312" height="312"></canvas>' + (C.wheel.deco || '') + '</span>' +
          '<span><h2 class="gc-title" id="wheelT">' + esc(mods.wheel.title) + '</h2><span class="gc-sub" style="display:block">' + esc(C.wheel.sub) + '</span></span></a>' +

        '<a class="gc c-radar rv" href="' + href('map') + '" id="radarCard" aria-labelledby="radarT"><span class="radar-row">' +
          (C.radar.art ? '<span class="map-art" aria-hidden="true">' + C.radar.art.replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ') + '</span>' : '<span class="radar-mini" aria-hidden="true"><i style="left:66%;top:30%"></i><i style="left:28%;top:62%;animation-delay:-1.6s"></i><i style="left:58%;top:72%;animation-delay:-2.4s"></i></span>') +
          '<span><h2 class="gc-title" id="radarT">' + esc(mods.map.title) + '</h2><span class="gc-sub" style="display:block">' + esc(C.radar.sub) + ' <span id="radarPlace">' + esc(R.location.label) + '</span></span>' +
          '<span class="chips"><span class="chip" id="radarCount">Looking nearby…</span><span class="chip" id="radarNear" hidden></span></span></span></span>' +
          '<span class="go">Open the map ' + ico('arrow') + '</span></a>' +

        '<a class="gc c-shop rv" href="' + href('store') + '" aria-labelledby="shopT"><span class="gc-row"><span><h2 class="gc-title" id="shopT">' + esc(mods.store.title) + '</h2><span class="gc-sub" style="display:block">' + esc(C.shop.sub) + '</span></span></span>' +
          '<span class="vials" aria-hidden="true">' + C.shop.items.map(function (it) { return '<span class="vial">' + it.svg + '<span><b>' + esc(it.b) + '</b><span>' + esc(it.s) + '</span></span></span>'; }).join('') + '</span>' +
          '<span class="go">Browse the shop ' + ico('arrow') + '</span></a>' +

        '<a class="gc weather c-weather rv" href="' + href('weather') + '" aria-labelledby="skyT"><span class="skystage"><canvas id="sky"></canvas><span class="phase"><small id="skyS">' + esc(C.sky.small) + '</small><b id="skyT">' + esc(mods.weather ? mods.weather.title : '') + '</b></span></span>' +
          '<span class="telemetry">' + [0, 1, 2].map(function (i) { return '<span style="display:block"><small id="skyL' + i + '">—</small><b id="skyV' + i + '">--</b></span>'; }).join('') + '</span></a>' +

        '<div class="lore c-lore rv" id="lore" role="button" tabindex="0" aria-label="' + esc(C.lore.title) + '. Activate for another fact">' +
          (C.lore.perch ? '<span class="perch" aria-hidden="true">' + C.lore.perch + '</span>' : '') +
          '<div class="roll"></div><div class="sheet"><div class="lore-h"><span class="seal">' + ico('star') + '</span><b>' + esc(C.lore.title) + '</b></div>' +
          '<p class="lore-q" id="loreQ"></p><div class="lore-hint"><span>' + esc(C.lore.hint) + '</span><span id="loreN"></span></div></div><div class="roll" style="margin-top:-2px"></div>' +
        '</div>' +

        '<div class="rule rv"><h2>The Wallpaper Vault</h2></div>' +
        '<section class="gc c-walls rv" aria-labelledby="wallT"><div class="walls-head"><div><h2 class="gc-title gilt" id="wallT">The Wallpaper Vault</h2><p class="gc-sub">' + esc(C.walls.sub) + '</p></div>' +
          '<div class="seg" role="radiogroup" aria-label="Wallpaper size">' +
            '<button type="button" role="radio" aria-checked="true" data-dev="phone">' + ico('phone') + '<span>Phone<small>9:16 · 1080×1920</small></span></button>' +
            '<button type="button" role="radio" aria-checked="false" data-dev="desktop">' + ico('desktop') + '<span>Desktop<small>16:9 · 1920×1080</small></span></button>' +
          '</div></div><div class="walls" id="walls" data-device="phone"></div></section>' +
      '</main>' +
      '<footer class="foot"><b>Festo</b><span>' + esc(C.foot || 'Posters via Wikipedia · Map © OpenStreetMap contributors') + '</span><a href="' + hub + '">All seasons</a></footer>' +
    '</div>' +
    '<nav class="dock" aria-label="Main"><a class="tab on" href="' + href('landing') + '" aria-current="page">' + ico('home') + 'Home</a>' +
      tabs.map(function (t) { return '<a class="tab" href="' + href(t) + '">' + ico(modIcon(mods[t])) + esc(mods[t].label) + '</a>'; }).join('') +
      '<button class="tab" id="dockMore" aria-haspopup="dialog">' + ico('grid') + 'More</button></nav>' +
    '<div class="sheet-bg" id="sheetBg"></div><div class="toast" id="toast" role="status" aria-live="polite"></div>' +
    '<section class="gc launcher" id="launcher" role="dialog" aria-modal="true" aria-label="All ' + esc(R.name) + ' pages"><h2>' + esc(R.name) + '</h2><div class="lgrid">' +
      R.modules.map(function (m) { return '<a href="' + href(m.id) + '">' + ico(modIcon(m)) + esc(m.label) + '</a>'; }).join('') +
      '<a href="' + hub + '">' + ico('compass') + 'All seasons</a></div></section>';

  var app = $('#lx-app'); app.innerHTML = html;

  /* ---------- launcher sheet ---------- */
  var sheetOpen = false;
  function launcher(on) { sheetOpen = on; $('#launcher').classList.toggle('on', on); $('#sheetBg').classList.toggle('on', on); if (on) { var a = $('#launcher a'); if (a) a.focus(); } }
  $('#openLauncher').addEventListener('click', function () { launcher(true); });
  $('#dockMore').addEventListener('click', function () { launcher(true); });
  $('#sheetBg').addEventListener('click', function () { launcher(false); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheetOpen) launcher(false); });

  /* ---------- marquee bulbs ---------- */
  $$('.bulbs').forEach(function (b) { for (var i = 0; i < 26; i++) b.appendChild(el('i')); });
  var bulbStep = 0;
  function bulbs() { bulbStep++; $$('.bulbs').forEach(function (b, bi) { Array.prototype.forEach.call(b.children, function (i, k) { i.classList.toggle('on', (k + bulbStep + bi) % 3 !== 0); }); }); }
  bulbs(); if (!reduced) setInterval(bulbs, 460);

  /* ---------- countdown: a single day ('date') or a season window ('window') ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var now = F.now(), y = now.getFullYear(), spec = R.countdown, target, during;
    if (spec.mode === 'window') {
      var st = new Date(y, spec.start.month - 1, spec.start.day), en = new Date(y, spec.end.month - 1, spec.end.day + 1);
      during = now >= st && now < en; target = during ? en : (now < st ? st : new Date(y + 1, spec.start.month - 1, spec.start.day));
    } else {
      var s0 = new Date(y, spec.month - 1, spec.day), s1 = new Date(y, spec.month - 1, spec.day + 1);
      during = now >= s0 && now < s1; target = during ? s1 : (now < s0 ? s0 : new Date(y + 1, spec.month - 1, spec.day));
    }
    var s = Math.max(0, Math.floor((target - now) / 1000)), d = Math.floor(s / 86400);
    $('#cdD').textContent = d; $('#cdDl').textContent = d === 1 ? 'DAY' : 'DAYS';
    $('#cdH').textContent = pad(Math.floor(s % 86400 / 3600)); $('#cdM').textContent = pad(Math.floor(s % 3600 / 60));
    $('#cdTitle').textContent = during ? C.plaque.during : C.plaque.until;
  }
  tick(); setInterval(tick, 15000);

  /* ==========================================================================
     RADIO · shared/radio/radio.js plays the season's stations and keeps them going from page to page
     ========================================================================== */
  var playing = false, analyser = null;
  function wakeAudio() { return Radio.wake(); }
  function playTick(f) { Radio.tick(f); }
  if ($('#sPlay')) {
    Radio.on(function (st) {
      playing = st.playing;
      var cur = stations[st.station]; if (!cur) return;
      $('#needle').style.left = cur.x + '%';
      $('#sNum').textContent = st.suspended ? 'TAP ANYWHERE TO RESUME' : 'STATION ' + roman(st.station + 1); $('#sName').textContent = cur.n;
      $('#sPlayIco').innerHTML = '<use href="#i-' + (st.playing ? 'pause' : 'play') + '"/>';
      $('#sPlay').setAttribute('aria-label', (st.playing ? 'Pause the ' : 'Play the ') + C.sound.noun);
      $('#cab').classList.toggle('is-playing', st.playing && !st.suspended);
    });
    $('#sPlay').addEventListener('click', function () { Radio.play(); });
    $('#sNext').addEventListener('click', function () { Radio.next(); });
  }

  /* ==========================================================================
     SHELF · classics that are in this season's library
     ========================================================================== */
  var BOOKS = C.shelf.books, books = $('#books'), sel = 0, readsUrl = href('books');
  BOOKS.forEach(function (b, i) {
    var bk = el('button', 'book' + (b.lean ? ' lean' : '') + (b.v ? ' v-' + b.v : ''));
    bk.type = 'button'; bk.setAttribute('role', 'listitem'); bk.setAttribute('aria-label', b.t + ' by ' + b.a);
    bk.style.cssText = '--w:' + b.w + 'px;--h:' + b.h + 'px;--c1:' + b.c1 + ';--c2:' + b.c2 + (b.c3 ? ';--c3:' + b.c3 : '');
    bk.innerHTML = '<span class="pages t"></span><span class="spine"><span class="crest"></span><span class="band"></span><span class="band"></span><span class="band"></span><span class="band"></span><span class="label"><span></span></span></span><span class="pages b"></span>' + (b.rib ? '<span class="ribbon"></span>' : '');
    $('.label span', bk).textContent = b.s || b.t;
    bk.addEventListener('click', function () { if (sel === i && bk.classList.contains('is-out')) { global.location.href = readsUrl; return; } pick(i); });
    books.appendChild(bk);
  });
  function note(i) { var b = BOOKS[i]; $('#noteT').textContent = b.t; $('#noteA').textContent = b.a + ' · ' + b.y; }
  function pick(i) {
    sel = i; note(i);
    Array.prototype.forEach.call(books.children, function (n, k) { n.classList.toggle('is-out', k === i); });
    var nb = $('#noteB'); nb.classList.add('swap'); setTimeout(function () { nb.textContent = BOOKS[i].b; nb.classList.remove('swap'); }, 200);
    wakeAudio().then(function () { playTick(C.shelf.tick || 520); }, function () {});
  }
  note(0); $('#noteB').textContent = BOOKS[0].b;

  /* ==========================================================================
     CINEMA · posters through the shared covers engine
     ========================================================================== */
  var strip = $('#strip'), cinemaUrl = href('movies');
  C.cinema.films.forEach(function (m) {
    var a = el('a', 'frame'); a.href = cinemaUrl; a.setAttribute('aria-label', m.title + ' (' + m.year + ')');
    var img = el('img'); img.alt = ''; img.width = 256; img.height = 384;
    a.appendChild(img); a.appendChild(el('span', 'rate', '★ ' + m.rating.toFixed(1)));
    strip.appendChild(a);
    if (global.FestoCovers) global.FestoCovers.attach(img, m, 'movie');
  });

  /* ==========================================================================
     RENDER LOOP · only canvases that are on screen
     ========================================================================== */
  var renderers = [], seen = new WeakMap();
  var io = 'IntersectionObserver' in global ? new IntersectionObserver(function (es) { es.forEach(function (e) { seen.set(e.target, e.isIntersecting); }); }, { rootMargin: '120px' }) : null;
  function addRenderer(cv, fn) { renderers.push({ c: cv, fn: fn }); if (io) io.observe(cv); else seen.set(cv, true); }
  var last = 0;
  function loop(t) {
    var dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
    if (!doc.hidden) for (var i = 0; i < renderers.length; i++) {
      var r = renderers[i];
      if (r.dead || !seen.get(r.c)) continue;
      try { r.fn(t / 1000, dt); } catch (err) { r.fails = (r.fails || 0) + 1; if (r.fails > 3) r.dead = true; }
    }
    requestAnimationFrame(loop);
  }

  /* scope: the radio's analyser, or an idle shimmer */
  if ($('#scope')) (function () {
    var cv = $('#scope'), ctx = cv.getContext('2d'), wave = new Uint8Array(1024), col = C.sound.scope || ['rgba(255,210,120,.12)', 'rgba(255,210,120,.4)', '#fff3d6'];
    addRenderer(cv, function (t) {
      fit(cv); var W = cv.width, H = cv.height, n = 160, pts = [];
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      analyser = Radio.analyser(); if (analyser) { analyser.getByteTimeDomainData(wave); for (var i = 0; i < n; i++) pts.push((wave[Math.floor(i / n * 1024)] - 128) / 128); }
      else for (var j = 0; j < n; j++) pts.push(Math.sin(j / n * Math.PI * 6 + t * 2) * .16 * Math.sin(t * .7 + j / 40) + Math.sin(j * .9 + t * 7) * .02);
      [[10 * DPR, col[0]], [4 * DPR, col[1]], [1.5 * DPR, col[2]]].forEach(function (p) {
        ctx.lineWidth = p[0]; ctx.strokeStyle = p[1]; ctx.lineJoin = 'round'; ctx.beginPath();
        pts.forEach(function (v, k) { var x = k / (n - 1) * W, y = H / 2 + v * H * .42; if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
        ctx.stroke();
      });
    });
  })();

  /* ==========================================================================
     WHEEL · the Activity Wheel's real wedges, in the season's finish
     ========================================================================== */
  function drawWheel() {
    var data = global[C.wheel.dataVar], segs = data && data.segments ? data.segments : [], W = C.wheel.style;
    var cv = $('#wheel'), ctx = cv.getContext('2d'), Sz = cv.width, c = Sz / 2, Rr = Sz / 2 - Sz * .02, n = segs.length || 1, sl = Math.PI * 2 / n;
    ctx.clearRect(0, 0, Sz, Sz);
    var rim = ctx.createLinearGradient(0, 0, Sz, Sz); W.rim.forEach(function (s, i) { rim.addColorStop(i / (W.rim.length - 1), s); });
    ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(c, c, Rr, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = W.inner; ctx.beginPath(); ctx.arc(c, c, Rr * .9, 0, Math.PI * 2); ctx.fill();
    for (var i = 0; i < segs.length; i++) {
      var a0 = i * sl - Math.PI / 2, g = ctx.createRadialGradient(c, c, Rr * .1, c, c, Rr * .88), col = segs[i].color;
      g.addColorStop(0, W.core); g.addColorStop(.3, col); g.addColorStop(.86, col); g.addColorStop(1, W.edge);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(c, c); ctx.arc(c, c, Rr * .88, a0, a0 + sl); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.translate(c, c); ctx.rotate(a0 + sl / 2); ctx.fillStyle = W.text; ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = Sz * .01;
      ctx.font = W.font.replace('#', Math.round(Sz * (n > 9 ? .032 : .036))); ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(W.upper ? segs[i].label.toUpperCase() : segs[i].label, Rr * .82, 0); ctx.restore();
    }
    ctx.strokeStyle = W.spoke; ctx.lineWidth = Sz * .006;
    for (var k = 0; k < n; k++) { var a = k * sl - Math.PI / 2; ctx.beginPath(); ctx.moveTo(c + Math.cos(a) * Rr * .2, c + Math.sin(a) * Rr * .2); ctx.lineTo(c + Math.cos(a) * Rr * .88, c + Math.sin(a) * Rr * .88); ctx.stroke(); }
    for (var b = 0; b < 24; b++) {
      var ba = b * Math.PI / 12, bx = c + Math.cos(ba) * Rr * .94, by = c + Math.sin(ba) * Rr * .94, bg = ctx.createRadialGradient(bx, by, 0, bx, by, Sz * .02), on = b % 2 ? W.bulbA : W.bulbB;
      bg.addColorStop(0, '#fffdf2'); bg.addColorStop(.45, on); bg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(bx, by, Sz * .02, 0, Math.PI * 2); ctx.fill();
    }
    var hb = ctx.createRadialGradient(c - Sz * .03, c - Sz * .03, 0, c, c, Rr * .2); W.hub.forEach(function (s, i) { hb.addColorStop(i / (W.hub.length - 1), s); });
    ctx.fillStyle = hb; ctx.beginPath(); ctx.arc(c, c, Rr * .17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = W.hubText; ctx.font = W.hubFont.replace('#', Math.round(Sz * .085)); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('F', c, c + Sz * .006);
    ctx.fillStyle = W.pointer; ctx.beginPath(); ctx.moveTo(c - Sz * .035, Sz * .005); ctx.lineTo(c + Sz * .035, Sz * .005); ctx.lineTo(c, Sz * .08); ctx.closePath(); ctx.fill();
  }
  drawWheel();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(drawWheel);

  /* ==========================================================================
     MAP CARD · featured places nearest the visitor (or the season's default city)
     ========================================================================== */
  var here = R.location;
  (function () {
    var MAP = global[C.radar.mapVar] || { places: [] }, mapUrl = href('map');
    function render(loc) {
      var mine = loc.source === 'device' || (loc.source === 'saved' && loc.label === 'Your location');
      var place = mine ? 'you' : (loc.label && loc.label !== 'Your location' ? loc.label : R.location.label);
      var list = MAP.places.map(function (p) { return { p: p, km: F.geo.haversine(loc, { lat: p.lat, lon: p.lon }) }; }).sort(function (a, b) { return a.km - b.km; });
      var close = list.filter(function (x) { return x.km <= 40; });
      $('#radarPlace').textContent = place;
      $('#radarCount').textContent = close.length ? close.length + ' ' + (close.length === 1 ? C.radar.noun[0] : C.radar.noun[1]) + ' within 25 mi' : MAP.places.length + ' ' + C.radar.noun[1] + ' on the map';
      var near = $('#radarNear');
      if (list.length) { var mi = list[0].km * .621371; near.hidden = false; near.textContent = 'Nearest ' + (mi < 10 ? mi.toFixed(1) : Math.round(mi).toLocaleString('en-US')) + ' mi'; }
      $('#radarCard').href = mine ? mapUrl + '?near=me' : mapUrl;
      here = loc; sky.update();
    }
    F.geo.get({ season: id }).then(function (l) {
      render(l);
      if (navigator.permissions && navigator.permissions.query) navigator.permissions.query({ name: 'geolocation' }).then(function (r) { if (r.state === 'granted') F.geo.get({ ask: true, season: id }).then(render); }).catch(function () {});
    });
  })();

  /* ==========================================================================
     SKY · sunrise / sunset from the sunrise equation, painted by the season
     ========================================================================== */
  function sunTimes(date, lat, lon) {
    var rad = Math.PI / 180, noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
    var J = noon / 864e5 + 2440587.5, n = Math.round(J - 2451545 + .0008), Js = n - lon / 360;
    var M = (357.5291 + .98560028 * Js) % 360, Cc = 1.9148 * Math.sin(M * rad) + .02 * Math.sin(2 * M * rad) + .0003 * Math.sin(3 * M * rad);
    var lam = (M + Cc + 180 + 102.9372) % 360, Jt = 2451545 + Js + .0053 * Math.sin(M * rad) - .0069 * Math.sin(2 * lam * rad);
    var dec = Math.asin(Math.sin(lam * rad) * Math.sin(23.44 * rad)), cw = (Math.sin(-.833 * rad) - Math.sin(lat * rad) * Math.sin(dec)) / (Math.cos(lat * rad) * Math.cos(dec));
    var toDate = function (j) { return new Date((j - 2440587.5) * 864e5); };
    if (cw > 1) return { polar: 'night', noon: toDate(Jt), len: 0 };
    if (cw < -1) return { polar: 'day', noon: toDate(Jt), len: 24 };
    var w0 = Math.acos(cw) / rad;
    return { rise: toDate(Jt - w0 / 360), set: toDate(Jt + w0 / 360), noon: toDate(Jt), len: w0 / 7.5 };
  }
  /* times read in the place's own clock: the visitor's device clock when it is their location, otherwise a timezone estimated from longitude (+1h when daylight saving is in effect here) */
  var shiftMin = 0;
  function placeClock(loc) {
    var mine = loc.source === 'device' || (loc.source === 'saved' && loc.label === 'Your location'); if (mine) return 0;
    var now = F.now(), y = now.getFullYear(), std = Math.max(new Date(y, 0, 1).getTimezoneOffset(), new Date(y, 6, 1).getTimezoneOffset()), dst = now.getTimezoneOffset() < std ? 1 : 0;
    return (Math.round(loc.lon / 15) + dst) * 60 + now.getTimezoneOffset();
  }
  function hm(d) { return d ? new Date(d.getTime() + shiftMin * 6e4).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '--'; }
  function dur(h) { var m = Math.round(h * 60); return Math.floor(m / 60) + 'h ' + pad(m % 60) + 'm'; }
  var sky = (function () {
    var info = {};
    function update() {
      shiftMin = placeClock(here); var now = F.now(), st = sunTimes(now, here.lat, here.lon), y = now.getFullYear();
      var wint = sunTimes(new Date(now.getMonth() >= 6 ? y : y - 1, 11, 21), here.lat, here.lon), summ = sunTimes(new Date(y, 5, 21), here.lat, here.lon);
      info = { now: now, rise: st.rise, set: st.set, noon: st.noon, len: st.len, polar: st.polar, lat: here.lat, place: here.label,
        frac: st.rise ? (now - st.rise) / (st.set - st.rise) : (st.polar === 'day' ? .5 : -1),
        gained: (st.len - wint.len) * 60, toLongest: (summ.len - st.len) * 60, hm: hm, dur: dur };
      info.day = info.frac >= 0 && info.frac <= 1;
      var stage = $('.skystage'); if (stage) stage.classList.toggle('night', !info.day);
      var cells = C.sky.cells(info);
      cells.forEach(function (c, i) { $('#skyL' + i).textContent = c[0]; $('#skyV' + i).textContent = c[1]; });
      if (C.sky.small) $('#skyS').textContent = typeof C.sky.small === 'function' ? C.sky.small(info) : C.sky.small;
    }
    update(); setInterval(update, 60000);
    var cv = $('#sky'), ctx = cv.getContext('2d');
    addRenderer(cv, function (t, dt) { fit(cv); if (!cv.width || !cv.height) return; C.sky.draw(ctx, cv.width, cv.height, t, info, DPR, dt); });
    return { update: update };
  })();

  /* ==========================================================================
     LORE · the season's reviewed facts, one per day, tap for more
     ========================================================================== */
  (function () {
    var facts = (global.FESTO_FACTS && global.FESTO_FACTS[id]) || [], q = $('#loreQ'), box = $('#lore');
    if (!facts.length) { box.hidden = true; return; }
    var i = F.util && F.util.dayOfYear ? F.util.dayOfYear(F.now()) % facts.length : 0;
    function show() { q.textContent = facts[i]; $('#loreN').textContent = roman(i + 1) + ' / ' + roman(facts.length); }
    function next() { i = (i + 1) % facts.length; q.classList.add('swap'); setTimeout(function () { show(); q.classList.remove('swap'); }, 300); wakeAudio().then(function () { playTick(C.lore.tick || 420); }, function () {}); }
    show();
    box.addEventListener('click', next);
    box.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } });
  })();

  /* ==========================================================================
     WALLPAPER VAULT · four procedural scenes, painted at full resolution and saved as PNG
     ========================================================================== */
  var toastT;
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2600); }
  var DEV = { phone: { w: 1080, h: 1920, label: 'mobile' }, desktop: { w: 1920, h: 1080, label: 'desktop' } }, device = 'phone';
  /* painter kit: shared brushes for every season's scenes */
  function brushes(ctx, W, H, seed) {
    var K = { ctx: ctx, W: W, H: H, U: Math.min(W, H) / 100, r: rng(seed || 7), portrait: H > W };
    K.lin = function (x0, y0, x1, y1, stops) { var g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g; };
    K.sky = function (stops, y0, y1) { ctx.fillStyle = K.lin(0, y0 || 0, 0, y1 || H, stops); ctx.fillRect(0, 0, W, H); };
    K.glow = function (x, y, rad, col, a) { var g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, col.replace('A', a === undefined ? 1 : a)); g.addColorStop(1, col.replace('A', 0)); ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); };
    K.stars = function (n, ymax, a) { for (var i = 0; i < n; i++) { var x = K.r() * W, y = K.r() * H * (ymax || .6), s = K.r() * K.U * .22 + K.U * .05; ctx.globalAlpha = (a || .9) * (.3 + K.r() * .7); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill(); if (K.r() < .06) K.glow(x, y, s * 8, 'rgba(255,255,255,A)', .5); } ctx.globalAlpha = 1; };
    K.ridge = function (base, amp, freq, col, seed2, rough) {
      var r2 = rng(seed2 || 3), ph = r2() * 10, ph2 = r2() * 10; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, H);
      for (var x = 0; x <= W; x += W / 120) { var u = x / W; ctx.lineTo(x, base - amp * (Math.sin(u * freq + ph) * .6 + Math.sin(u * freq * 2.3 + ph2) * .3 + (rough ? (r2() - .5) * rough : 0))); }
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
    };
    K.pine = function (x, y, h, col, snow) {
      var w = h * .42; ctx.fillStyle = col;
      for (var k = 0; k < 4; k++) { var ty = y - h + k * h * .2, tw = w * (.4 + k * .2); ctx.beginPath(); ctx.moveTo(x, ty); ctx.lineTo(x + tw, ty + h * .34); ctx.lineTo(x - tw, ty + h * .34); ctx.closePath(); ctx.fill();
        if (snow) { ctx.fillStyle = snow; ctx.beginPath(); ctx.moveTo(x, ty + h * .02); ctx.lineTo(x + tw * .55, ty + h * .2); ctx.quadraticCurveTo(x, ty + h * .14, x - tw * .55, ty + h * .2); ctx.closePath(); ctx.fill(); ctx.fillStyle = col; } }
      ctx.fillRect(x - h * .03, y - h * .08, h * .06, h * .08);
    };
    K.vignette = function (a) { var g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .8); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + a + ')'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
    K.grainy = function (a) { var n = Math.round(W * H / 900); ctx.fillStyle = '#fff'; for (var i = 0; i < n; i++) { ctx.globalAlpha = K.r() * (a || .05); ctx.fillRect(K.r() * W, K.r() * H, 1.5, 1.5); } ctx.globalAlpha = 1; };
    return K;
  }
  (function wallVault() {
    var host = $('#walls');
    var cards = C.walls.scenes.map(function (w) {
      var fig = el('figure', 'wall');
      fig.innerHTML = '<div class="wall-frame"><canvas aria-hidden="true"></canvas></div><figcaption><b></b><span></span></figcaption><button class="pill dl" type="button">' + ico('download') + '<span>Download</span></button>';
      $('b', fig).textContent = w.name; $('figcaption span', fig).textContent = w.sub;
      $('button', fig).setAttribute('aria-label', 'Download ' + w.name + ' wallpaper');
      $('button', fig).addEventListener('click', function () { download(w, this); });
      host.appendChild(fig);
      return { w: w, cv: $('canvas', fig) };
    });
    function paint(cv, W, H, w) { var ctx = cv.getContext('2d'); ctx.save(); C.walls.paint(brushes(ctx, W, H, w.seed || 11), w.id); ctx.restore(); }
    function previews() {
      host.dataset.device = device;
      var d = DEV[device], pw = device === 'phone' ? 270 : 480, ph = Math.round(pw * d.h / d.w);
      cards.forEach(function (c, i) { setTimeout(function () { c.cv.width = pw; c.cv.height = ph; try { paint(c.cv, pw, ph, c.w); } catch (e) {} }, i * 30); });
    }
    function download(w, btn) {
      var d = DEV[device], cv = el('canvas'), lab = $('span', btn); cv.width = d.w; cv.height = d.h;
      btn.disabled = true; lab.textContent = C.walls.busy || 'Painting…';
      setTimeout(function () {
        try { paint(cv, d.w, d.h, w); } catch (e) { btn.disabled = false; lab.textContent = 'Download'; return; }
        cv.toBlob(function (blob) {
          btn.disabled = false; lab.textContent = 'Download';
          if (!blob) { toast('This browser could not save the wallpaper'); return; }
          var a = el('a'); a.href = URL.createObjectURL(blob); a.download = 'festo-' + id + '-' + w.id + '-' + d.label + '.png';
          doc.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
          toast(C.walls.toast); wakeAudio().then(function () { playTick(660); }, function () {});
        }, 'image/png');
      }, 30);
    }
    $$('[data-dev]').forEach(function (b) {
      b.addEventListener('click', function () { device = b.getAttribute('data-dev'); $$('[data-dev]').forEach(function (o) { o.setAttribute('aria-checked', String(o === b)); }); previews(); });
    });
    var wio = 'IntersectionObserver' in global ? new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { wio.disconnect(); (doc.fonts ? doc.fonts.ready : Promise.resolve()).then(previews); } }, { rootMargin: '400px' }) : null;
    if (wio) wio.observe(host); else previews();
  })();

  /* ---------- season extras (hover toys etc.) ---------- */
  if (C.after) try { C.after({ $: $, $$: $$, addRenderer: addRenderer, fit: fit, DPR: DPR, reduced: reduced, playing: function () { return playing; } }); } catch (e) {}

  /* ---------- scroll reveal ---------- */
  var rv = $$('.rv');
  if (!reduced && 'IntersectionObserver' in global) {
    var rio = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var n = en.target; rio.unobserve(n); n.style.setProperty('--rd', (batch++ * .08) + 's'); n.classList.add('is-in');
        setTimeout(function () { n.classList.remove('rv', 'is-in'); n.style.removeProperty('--rd'); }, 1200 + batch * 80);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .08 });
    rv.forEach(function (n) { rio.observe(n); });
  } else rv.forEach(function (n) { n.classList.remove('rv'); });

  requestAnimationFrame(loop);
})(window);
