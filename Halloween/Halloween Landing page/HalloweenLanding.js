/* ==========================================================================
   HALLOWEEN HOLLOW · gothic landing
   Static HTML carries every link; this file adds the living parts:
     shelf of real library classics · Cinema posters (FestoCovers, shared cache) · synthesized radio teaser
     real Activity Wheel wedges · nearest haunts (Festo.geo + map data) · live moon phase in back-lit fog
     daily lore from the facts file · countdown · embers + street fog · scroll reveal · launcher sheet
   Every canvas pauses when it is off screen or the tab is hidden; everything respects reduced motion.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, S = F.seasons.get('halloween'), doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var reduced = F.motion.reduced();
  var DPR = Math.min(2, global.devicePixelRatio || 1);
  function el(tag, cls, html) { var e = doc.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function roman(n) { var m = [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], s = ''; m.forEach(function (p) { while (n >= p[0]) { s += p[1]; n -= p[0]; } }); return s; }
  function fit(cv) { var w = Math.round(cv.clientWidth * DPR), h = Math.round(cv.clientHeight * DPR); if (w && h && (cv.width !== w || cv.height !== h)) { cv.width = w; cv.height = h; return true; } return false; }

  /* ---------- links + counts from the season registry ---------- */
  var hub = F.url('hub', null, 'choose=1');
  $('#toSeasons').href = hub; $('#launcherSeasons').href = hub;
  $$('[data-count]').forEach(function (n) { var v = S.counts[n.getAttribute('data-count')]; if (v) n.textContent = (+v).toLocaleString('en-US'); });

  /* ---------- filigree corners + marquee bulbs ---------- */
  $$('[data-frame]').forEach(function (c) {
    ['tl', 'tr', 'bl', 'br'].forEach(function (p) {
      var s = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('class', 'fil ' + p); s.setAttribute('aria-hidden', 'true'); s.innerHTML = '<use href="#fil"/>'; c.appendChild(s);
    });
  });
  $$('.bulbs').forEach(function (b) { for (var i = 0; i < 26; i++) b.appendChild(el('i')); });
  var bulbStep = 0;
  function bulbs() { bulbStep++; $$('.bulbs').forEach(function (b, bi) { Array.prototype.forEach.call(b.children, function (i, k) { i.classList.toggle('on', (k + bulbStep + bi) % 3 !== 0); }); }); }
  bulbs(); if (!reduced) setInterval(bulbs, 420);

  /* ---------- countdown (to local midnight starting Oct 31; "It's Halloween!" all day) ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var now = F.now(), y = now.getFullYear(), spec = S.countdown;
    var start = new Date(y, spec.month - 1, spec.day), end = new Date(y, spec.month - 1, spec.day + 1);
    var today = now >= start && now < end, target = today ? end : (now < start ? start : new Date(y + 1, spec.month - 1, spec.day));
    var s = Math.max(0, Math.floor((target - now) / 1000)), d = Math.floor(s / 86400);
    $('#cdD').textContent = d; $('#cdDl').textContent = d === 1 ? 'DAY' : 'DAYS';
    $('#cdH').textContent = pad(Math.floor(s % 86400 / 3600)); $('#cdM').textContent = pad(Math.floor(s % 3600 / 60));
    $('#cdTitle').textContent = today ? "IT'S HALLOWEEN · ENDS IN" : 'UNTIL HALLOWEEN';
  }
  tick(); setInterval(tick, 15000);

  /* ---------- launcher sheet ---------- */
  var sheetOpen = false;
  function launcher(on) {
    sheetOpen = on; $('#launcher').classList.toggle('on', on); $('#sheetBg').classList.toggle('on', on);
    if (on) { var a = $('#launcher a'); if (a) a.focus(); }
  }
  $('#openLauncher').addEventListener('click', function () { launcher(true); });
  $('#dockMore').addEventListener('click', function () { launcher(true); });
  $('#sheetBg').addEventListener('click', function () { launcher(false); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheetOpen) launcher(false); });

  /* ==========================================================================
     GRIMOIRE SHELF · classics that are in the Spooky Reads library
     ========================================================================== */
  var BOOKS = [
    { t: 'Dracula', a: 'Bram Stoker', y: 1897, w: 36, h: 192, c1: '#7a1418', c2: '#3a0608', rib: true, b: 'Jonathan Harker travels to a castle in the Carpathians and slowly realises his host never eats, never sleeps and casts no reflection.' },
    { t: 'Frankenstein', a: 'Mary Shelley', y: 1818, w: 42, h: 202, c1: '#23402e', c2: '#0c1a12', b: 'A young scientist stitches life into dead tissue, then flees from what he has made. His creature follows him into the Arctic ice.' },
    { t: 'Carmilla', a: 'J. Sheridan Le Fanu', y: 1872, w: 30, h: 168, c1: '#4a1640', c2: '#1d0619', lean: true, b: 'In a lonely Styrian schloss, Laura welcomes a mysterious guest whose affection grows stranger by the night.' },
    { t: 'The Turn of the Screw', s: 'Turn of the Screw', a: 'Henry James', y: 1898, w: 28, h: 162, c1: '#14141c', c2: '#040408', b: 'A governess at a remote English estate becomes convinced that the two children in her care are being visited by ghosts.' },
    { t: 'Strange Case of Dr Jekyll and Mr Hyde', s: 'Jekyll & Hyde', a: 'Robert Louis Stevenson', y: 1886, w: 34, h: 182, c1: '#5a3a14', c2: '#241406', rib: true, b: 'A London lawyer uncovers the link between his respected friend Dr Jekyll and the brutal Mr Hyde.' },
    { t: 'The Picture of Dorian Gray', s: 'Dorian Gray', a: 'Oscar Wilde', y: 1890, w: 38, h: 196, c1: '#1f3a3a', c2: '#081616', b: 'A beautiful young man wishes his portrait would age instead of him, and every sin he commits is painted onto the canvas.' },
    { t: 'The Haunting of Hill House', s: 'Hill House', a: 'Shirley Jackson', y: 1959, w: 34, h: 178, c1: '#5e1020', c2: '#24040b', b: 'Four people move into a notorious mansion to study the supernatural. Hill House is not sane.' },
    { t: 'Something Wicked This Way Comes', s: 'Something Wicked', a: 'Ray Bradbury', y: 1962, w: 36, h: 186, c1: '#2a1a40', c2: '#0e0818', rib: true, b: 'Two boys watch a carnival arrive at three in the morning. Its carousel can make you younger or older.' },
    { t: 'The Shining', a: 'Stephen King', y: 1977, w: 40, h: 198, c1: '#6e1c14', c2: '#2a0806', b: 'A recovering alcoholic takes a winter caretaker job at the isolated Overlook Hotel with his wife and his psychic son.' }
  ];
  var books = $('#books'), sel = 0, readsUrl = F.url('halloween', 'books');
  BOOKS.forEach(function (b, i) {
    var bk = el('button', 'book' + (b.lean ? ' lean' : ''));
    bk.setAttribute('role', 'listitem'); bk.setAttribute('aria-label', b.t + ' by ' + b.a);
    bk.style.cssText = '--w:' + b.w + 'px;--h:' + b.h + 'px;--c1:' + b.c1 + ';--c2:' + b.c2;
    bk.innerHTML = '<span class="pages t"></span><span class="spine"><span class="crest"></span><span class="band"></span><span class="band"></span><span class="band"></span><span class="band"></span><span class="label"><span></span></span></span><span class="pages b"></span>' + (b.rib ? '<span class="ribbon"></span>' : '');
    $('.label span', bk).textContent = b.s || b.t;
    bk.addEventListener('click', function () {
      if (sel === i && bk.classList.contains('is-out')) { global.location.href = readsUrl; return; }
      pick(i);
    });
    books.appendChild(bk);
  });
  function pick(i) {
    sel = i; var b = BOOKS[i];
    Array.prototype.forEach.call(books.children, function (n, k) { n.classList.toggle('is-out', k === i); });
    $('#noteT').textContent = b.t; $('#noteA').textContent = b.a + ' · ' + b.y;
    var nb = $('#noteB'); nb.classList.add('swap'); setTimeout(function () { nb.textContent = b.b; nb.classList.remove('swap'); }, 200);
    wakeAudio().then(function () { playTick(520); });
  }
  $('#noteB').textContent = BOOKS[0].b;

  /* ==========================================================================
     MIDNIGHT CINEMA · posters through the shared covers engine (same cache as the Cinema page)
     ========================================================================== */
  var FILMS = [
    { title: 'Hocus Pocus', year: '1993', rating: 7.2, wikiSlug: 'Hocus_Pocus_(1993_film)' },
    { title: 'Halloween', year: '1978', rating: 7.6, wikiSlug: 'Halloween_(1978_film)' },
    { title: 'The Nightmare Before Christmas', year: '1993', rating: 7.8, wikiSlug: 'The_Nightmare_Before_Christmas' },
    { title: 'Coraline', year: '2009', rating: 7.9, wikiSlug: 'Coraline_(film)' },
    { title: 'Beetlejuice', year: '1988', rating: 7.4, wikiSlug: 'Beetlejuice' },
    { title: 'The Shining', year: '1980', rating: 8.4, wikiSlug: 'The_Shining_(film)' }
  ];
  var cinemaUrl = F.url('halloween', 'movies'), strip = $('#strip');
  FILMS.forEach(function (m) {
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
  function addRenderer(cv, fn, always) { renderers.push({ c: cv, fn: fn, always: always }); if (io && !always) io.observe(cv); else seen.set(cv, true); }
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

  /* ==========================================================================
     MOON · real phase, crater texture, earthshine, back-lit layered fog
     ========================================================================== */
  var SYN = 29.530588853, REF = Date.UTC(2000, 0, 6, 18, 14);
  function phaseOf(d) { var a = ((d - REF) / 864e5) % SYN; if (a < 0) a += SYN; return a / SYN; }
  function phaseName(p) { return p < .03 || p > .97 ? 'New moon' : p < .22 ? 'Waxing crescent' : p < .28 ? 'First quarter' : p < .47 ? 'Waxing gibbous' : p < .53 ? 'Full moon' : p < .72 ? 'Waning gibbous' : p < .78 ? 'Last quarter' : 'Waning crescent'; }
  function litPath(ctx, p, c, r) {
    var rx = Math.abs(Math.cos(2 * Math.PI * p)) * r, waxing = p < .5;
    ctx.beginPath();
    ctx.ellipse(c, c, r, r, 0, -Math.PI / 2, Math.PI / 2, !waxing);
    var bulgeOut = waxing ? p > .25 : p < .75;
    ctx.ellipse(c, c, rx, r, 0, Math.PI / 2, -Math.PI / 2, waxing ? !bulgeOut : bulgeOut);
    ctx.closePath();
  }
  var now0 = F.now(), P = phaseOf(now0), LIT = (1 - Math.cos(2 * Math.PI * P)) / 2;
  (function () {
    var hy = now0.getMonth() > 9 ? now0.getFullYear() + 1 : now0.getFullYear();
    $('#moonT').textContent = phaseName(P); $('#moonLit').textContent = Math.round(LIT * 100) + '%';
    $('#moonHw').textContent = phaseName(phaseOf(new Date(hy, 9, 31, 21))).replace(' moon', '');
  })();
  function moonDisc(R, ph) {
    var r = rng(11), s = Math.ceil(R * 2 + 4), c = el('canvas'); c.width = c.height = s;
    var x = c.getContext('2d'), m = s / 2;
    x.save(); x.beginPath(); x.arc(m, m, R, 0, Math.PI * 2); x.clip();
    var g = x.createRadialGradient(m - R * .3, m - R * .3, R * .1, m, m, R);
    g.addColorStop(0, '#fbfaf3'); g.addColorStop(.5, '#e2e1d8'); g.addColorStop(.85, '#b9bcc1'); g.addColorStop(1, '#8a919b');
    x.fillStyle = g; x.fillRect(0, 0, s, s);
    [[-.25, -.2, .38, .3], [.15, -.3, .26, .2], [.22, .1, .3, .24], [-.1, .25, .22, .16], [-.38, .12, .18, .22], [.35, -.05, .12, .2]].forEach(function (q) {
      x.save(); x.translate(m + q[0] * R, m + q[1] * R); x.rotate(r() * 3); x.scale(1, q[3] / q[2]);
      var mg = x.createRadialGradient(0, 0, 0, 0, 0, q[2] * R); mg.addColorStop(0, 'rgba(104,110,120,.5)'); mg.addColorStop(.7, 'rgba(110,116,126,.28)'); mg.addColorStop(1, 'rgba(110,116,126,0)');
      x.fillStyle = mg; x.beginPath(); x.arc(0, 0, q[2] * R, 0, Math.PI * 2); x.fill(); x.restore();
    });
    for (var i = 0; i < 70; i++) {
      var a = r() * Math.PI * 2, d = Math.sqrt(r()) * R * .95, cx = m + Math.cos(a) * d, cy = m + Math.sin(a) * d, cr = (r() * r()) * R * .11 + R * .012;
      var cg = x.createRadialGradient(cx, cy, 0, cx, cy, cr); cg.addColorStop(0, 'rgba(95,100,110,.35)'); cg.addColorStop(.75, 'rgba(120,125,135,.18)'); cg.addColorStop(1, 'rgba(120,125,135,0)');
      x.fillStyle = cg; x.beginPath(); x.arc(cx, cy, cr, 0, Math.PI * 2); x.fill();
      x.lineWidth = Math.max(.6, cr * .18);
      x.strokeStyle = 'rgba(255,255,250,.28)'; x.beginPath(); x.arc(cx, cy, cr * .82, Math.PI * .05, Math.PI * .95); x.stroke();
      x.strokeStyle = 'rgba(60,64,72,.3)'; x.beginPath(); x.arc(cx, cy, cr * .82, Math.PI * 1.05, Math.PI * 1.95); x.stroke();
    }
    var img = x.getImageData(0, 0, s, s), D = img.data;
    for (var p = 0; p < D.length; p += 4) { var n = (r() - .5) * 14; D[p] += n; D[p + 1] += n; D[p + 2] += n; }
    x.putImageData(img, 0, 0);
    var lg = x.createRadialGradient(m, m, R * .55, m, m, R); lg.addColorStop(0, 'rgba(10,14,30,0)'); lg.addColorStop(1, 'rgba(10,14,30,.42)');
    x.fillStyle = lg; x.fillRect(0, 0, s, s); x.restore();
    /* phase: earthshine everywhere, full light only on the lit part */
    var out = el('canvas'); out.width = out.height = s; var o = out.getContext('2d');
    o.globalAlpha = .13; o.drawImage(c, 0, 0); o.globalAlpha = 1;
    var lit = el('canvas'); lit.width = lit.height = s; var l = lit.getContext('2d');
    l.drawImage(c, 0, 0); l.globalCompositeOperation = 'destination-in'; litPath(l, ph === undefined ? P : ph, m, R); l.fill();
    o.drawImage(lit, 0, 0);
    return out;
  }
  function fogTexture(w, h, seed, band, count, alpha) {
    var r = rng(seed), c = el('canvas'); c.width = w; c.height = h; var x = c.getContext('2d');
    for (var i = 0; i < count; i++) {
      var px = r() * w, py = band[0] * h + r() * (band[1] - band[0]) * h, pr = (.08 + r() * .22) * w, a = alpha * (.35 + r() * .65);
      [px - w, px, px + w].forEach(function (X) {
        var g = x.createRadialGradient(X, py, 0, X, py, pr); g.addColorStop(0, 'rgba(178,190,214,' + a + ')'); g.addColorStop(.55, 'rgba(150,164,192,' + a * .45 + ')'); g.addColorStop(1, 'rgba(140,150,180,0)');
        x.fillStyle = g; x.fillRect(X - pr, py - pr, pr * 2, pr * 2);
      });
    }
    return c;
  }
  (function () {
    var cv = $('#moon'), ctx = cv.getContext('2d'), disc, fogs, tmp = el('canvas'), tx = tmp.getContext('2d'), stars = [], built = false;
    var glow = .35 + LIT * .65;
    function build() {
      var W = cv.width, H = cv.height, R = Math.round(Math.min(W, H) * .2);
      disc = moonDisc(R);
      fogs = [{ c: fogTexture(W, H, 3, [.2, .75], 26, .22), s: 6, a: .55 }, { c: fogTexture(W, H, 7, [.35, .95], 30, .28), s: 13, a: .7 }, { c: fogTexture(W, H, 13, [.55, 1.05], 34, .34), s: 22, a: .85 }];
      tmp.width = W; tmp.height = H;
      var r = rng(5); stars = []; for (var i = 0; i < 80; i++) stars.push([r() * W, r() * H * .7, r() * 1.2 * DPR + .3, r() * 6]);
      built = true;
    }
    function silhouette(W, H) {
      ctx.fillStyle = '#04050a'; ctx.beginPath(); ctx.moveTo(0, H);
      var base = H * .86, r = rng(9);
      for (var x = 0; x <= W; x += W / 40) ctx.lineTo(x, base - r() * H * .05 - (Math.sin(x / W * 6) + 1) * H * .02);
      ctx.lineTo(W, H); ctx.fill();
      var sx = W * .2, sw = W * .045;
      ctx.beginPath(); ctx.moveTo(sx - sw, base); ctx.lineTo(sx - sw, base - H * .2); ctx.lineTo(sx, base - H * .42); ctx.lineTo(sx + sw, base - H * .2); ctx.lineTo(sx + sw, base); ctx.fill();
      ctx.fillRect(sx - DPR, base - H * .5, 2 * DPR, H * .1); ctx.fillRect(sx - 4 * DPR, base - H * .47, 8 * DPR, 2 * DPR);
      ctx.fillStyle = 'rgba(255,190,100,.85)'; ctx.fillRect(sx - 2 * DPR, base - H * .14, 4 * DPR, 6 * DPR);
      ctx.strokeStyle = '#04050a'; ctx.lineCap = 'round';
      [[.86, 1], [.94, .7]].forEach(function (tr) {
        var bx = W * tr[0], by = base + 4, hgt = H * .38 * tr[1];
        ctx.lineWidth = 5 * DPR * tr[1]; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - 6, by - hgt * .5, bx + 4, by - hgt); ctx.stroke();
        ctx.lineWidth = 2.4 * DPR * tr[1]; ctx.beginPath(); ctx.moveTo(bx, by - hgt * .55); ctx.quadraticCurveTo(bx - hgt * .3, by - hgt * .7, bx - hgt * .45, by - hgt * .95); ctx.moveTo(bx + 2, by - hgt * .7); ctx.quadraticCurveTo(bx + hgt * .3, by - hgt * .85, bx + hgt * .42, by - hgt * 1.05); ctx.stroke();
      });
    }
    addRenderer(cv, function (t) {
      if (!cv.clientWidth) return;
      if (fit(cv) || !built) build();
      var W = cv.width, H = cv.height, mx = W * .66, my = H * .34, R = disc.width / 2 - 2;
      var sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#070b18'); sky.addColorStop(.6, '#121a30'); sky.addColorStop(1, '#1b2034');
      ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      stars.forEach(function (s) { ctx.fillStyle = 'rgba(230,236,255,' + (.35 + .35 * Math.sin(t * 1.3 + s[3])) + ')'; ctx.fillRect(s[0], s[1], s[2], s[2]); });
      var halo = ctx.createRadialGradient(mx, my, R * .9, mx, my, R * 4.2); halo.addColorStop(0, 'rgba(200,215,255,' + .42 * glow + ')'); halo.addColorStop(.35, 'rgba(160,185,240,' + .14 * glow + ')'); halo.addColorStop(1, 'rgba(150,170,230,0)');
      ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);
      ctx.drawImage(disc, mx - disc.width / 2, my - disc.height / 2);
      fogs.forEach(function (f, i) {
        var off = reduced ? 0 : ((t * f.s * DPR) % W + W) % W;
        tx.globalCompositeOperation = 'source-over'; tx.clearRect(0, 0, W, H);
        tx.drawImage(f.c, off - W, 0); tx.drawImage(f.c, off, 0);
        tx.globalCompositeOperation = 'source-atop';
        var sc = tx.createRadialGradient(mx, my, 0, mx, my, R * (3.4 + i)); sc.addColorStop(0, 'rgba(250,252,255,' + .95 * glow + ')'); sc.addColorStop(.3, 'rgba(205,220,255,' + .55 * glow + ')'); sc.addColorStop(1, 'rgba(60,72,104,0)');
        tx.fillStyle = sc; tx.fillRect(0, 0, W, H);
        ctx.globalAlpha = f.a; ctx.drawImage(tmp, 0, 0); ctx.globalAlpha = 1;
        if (i === 1) silhouette(W, H);
      });
    });
  })();

  /* ---------- embers along the iron frame ---------- */
  (function () {
    var cv = $('#embers'), ctx = cv.getContext('2d'), Pt = [], spr = el('canvas');
    spr.width = spr.height = 32; var sx = spr.getContext('2d'), g = sx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,240,200,1)'); g.addColorStop(.2, 'rgba(255,170,70,.9)'); g.addColorStop(.5, 'rgba(255,90,20,.35)'); g.addColorStop(1, 'rgba(255,60,10,0)');
    sx.fillStyle = g; sx.fillRect(0, 0, 32, 32);
    var rail = $('.iron .rail');
    function spawn(W, H) {
      var rr = rail.getBoundingClientRect(), L = rr.left * DPR, Rt = rr.right * DPR;
      var e = Math.random(), x, y, m = 10 * DPR;
      if (e < .42) { x = L + m + Math.random() * 12 * DPR; y = Math.random() * H; } else if (e < .84) { x = Rt - m - Math.random() * 12 * DPR; y = Math.random() * H; } else { x = L + Math.random() * (Rt - L); y = H - m - Math.random() * 30 * DPR; }
      return { x: x, y: y, vx: (Math.random() - .5) * 8, vy: -(10 + Math.random() * 22), life: 0, max: 2.5 + Math.random() * 3.5, s: (2 + Math.random() * 4) * DPR, w: Math.random() * 6 };
    }
    if (reduced) return;
    addRenderer(cv, function (t, dt) {
      fit(cv); var W = cv.width, H = cv.height; if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      var want = Math.round(28 + W / DPR / 40);
      while (Pt.length < want) Pt.push(spawn(W, H));
      ctx.globalCompositeOperation = 'lighter';
      for (var i = Pt.length - 1; i >= 0; i--) {
        var p = Pt[i]; p.life += dt;
        if (p.life > p.max) { Pt.splice(i, 1); continue; }
        p.x += (p.vx + Math.sin(t * 2 + p.w) * 6) * dt * DPR; p.y += p.vy * dt * DPR;
        ctx.globalAlpha = Math.max(0, Math.sin(Math.PI * p.life / p.max) * (.55 + .45 * Math.sin(t * 9 + p.w)));
        ctx.drawImage(spr, p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }, true);
  })();

  /* ---------- street fog (half resolution) ---------- */
  (function () {
    var cv = $('#streetFog'), ctx = cv.getContext('2d'), layers = null;
    addRenderer(cv, function (t) {
      var W = Math.round(cv.clientWidth / 2), H = Math.round(cv.clientHeight / 2); if (!W || !H) return;
      if (cv.width !== W || cv.height !== H || !layers) { cv.width = W; cv.height = H; layers = [fogTexture(W, H, 21, [.45, .95], 22, .2), fogTexture(W, H, 33, [.6, 1.05], 26, .26)]; }
      ctx.clearRect(0, 0, W, H);
      layers.forEach(function (l, i) { var off = reduced ? 0 : ((t * (8 + i * 10)) % W + W) % W; ctx.globalAlpha = .75; ctx.drawImage(l, off - W, 0); ctx.drawImage(l, off, 0); });
      ctx.globalAlpha = 1;
    }, true);
  })();

  /* ==========================================================================
     SOUND VAULT TEASER · four synthesized stations, analyser drives the ectoplasm scope
     ========================================================================== */
  var STATIONS = [{ n: 'Graveyard Drone', x: 12 }, { n: 'Crypt Organ', x: 38 }, { n: 'Theremin Waves', x: 63 }, { n: 'Music Box Waltz', x: 88 }];
  var AC = null, master = null, analyser = null, reverb = null, station = 0, playing = false, live = [], timers = [];
  function audio() {
    if (AC) return AC;
    var C = global.AudioContext || global.webkitAudioContext; if (!C) return null;
    AC = new C(); master = AC.createGain(); master.gain.value = .4;
    analyser = AC.createAnalyser(); analyser.fftSize = 1024; master.connect(analyser); analyser.connect(AC.destination);
    reverb = AC.createConvolver();
    var len = AC.sampleRate * 3.2, ir = AC.createBuffer(2, len, AC.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    reverb.buffer = ir; var rg = AC.createGain(); rg.gain.value = .55; reverb.connect(rg); rg.connect(master);
    return AC;
  }
  /* start (or resume) the audio context from a user gesture, then resolve once it can make sound */
  function wakeAudio() {
    if (!AC) audio();
    if (!AC) return Promise.reject();
    return AC.state === 'suspended' ? AC.resume() : Promise.resolve();
  }
  function playTick(f) {
    if (!AC || AC.state !== 'running') return;
    var o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime;
    o.type = 'triangle'; o.frequency.value = f || 600; g.gain.setValueAtTime(.05, n); g.gain.exponentialRampToValueAtTime(.0001, n + .12);
    o.connect(g); g.connect(master); o.start(n); o.stop(n + .13);
  }
  function track(n) { live.push(n); return n; }
  function osc(type, f) { var o = track(AC.createOscillator()); o.type = type; o.frequency.value = f; o.start(); return o; }
  function gain(v) { var g = track(AC.createGain()); g.gain.value = v === undefined ? 1 : v; return g; }
  function noiseBuf() { var b = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
  function stopStation() {
    timers.forEach(clearInterval); timers = [];
    var n = AC ? AC.currentTime : 0;
    live.forEach(function (x) { try { if (x.gain) x.gain.setTargetAtTime(0, n, .08); if (x.stop) x.stop(n + .4); } catch (e) {} });
    var dead = live; live = []; setTimeout(function () { dead.forEach(function (x) { try { x.disconnect(); } catch (e) {} }); }, 600);
  }
  function startStation(i) {
    var n = AC.currentTime, out = gain(0); out.gain.linearRampToValueAtTime(1, n + 1.2); out.connect(master); out.connect(reverb);
    if (i === 0) {
      var lp = track(AC.createBiquadFilter()); lp.type = 'lowpass'; lp.frequency.value = 380; lp.Q.value = 6;
      var dg = gain(.16); lp.connect(dg); dg.connect(out);
      [55, 55.6, 82.4].forEach(function (f) { osc('sawtooth', f).connect(lp); });
      var l = osc('sine', .07), lg = gain(240); l.connect(lg); lg.connect(lp.frequency);
      var ns = track(AC.createBufferSource()); ns.buffer = noiseBuf(); ns.loop = true; ns.start();
      var bp = track(AC.createBiquadFilter()); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = .9;
      var wg = gain(.05); ns.connect(bp); bp.connect(wg); wg.connect(out);
      var wf = osc('sine', .05), wfg = gain(300); wf.connect(wfg); wfg.connect(bp.frequency);
    } else if (i === 1) {
      var chords = [[110, 130.81, 164.81, 220], [87.31, 110, 130.81, 174.61], [73.42, 87.31, 110, 146.83], [82.41, 103.83, 123.47, 164.81]];
      var voices = chords[0].map(function (f) {
        var g = gain(.045); g.connect(out);
        var a = osc('triangle', f), b = osc('sine', f * 2), c = osc('sine', f * 3), bg = gain(.5), cg = gain(.18);
        a.connect(g); b.connect(bg); bg.connect(g); c.connect(cg); cg.connect(g);
        return [a, b, c];
      });
      var k = 0;
      timers.push(setInterval(function () { k = (k + 1) % chords.length; var t0 = AC.currentTime; voices.forEach(function (v, j) { v[0].frequency.setTargetAtTime(chords[k][j], t0, .25); v[1].frequency.setTargetAtTime(chords[k][j] * 2, t0, .25); v[2].frequency.setTargetAtTime(chords[k][j] * 3, t0, .25); }); }, 4200));
    } else if (i === 2) {
      var th = osc('sine', 440), thg = gain(.14); th.connect(thg); thg.connect(out);
      var vib = osc('sine', 5.6), vg = gain(7); vib.connect(vg); vg.connect(th.frequency);
      var notes = [440, 523.25, 587.33, 659.25, 392, 698.46, 493.88, 349.23];
      timers.push(setInterval(function () { th.frequency.setTargetAtTime(notes[Math.floor(Math.random() * notes.length)] * (Math.random() < .3 ? .5 : 1), AC.currentTime, .22); }, 1300));
    } else {
      var dl = track(AC.createDelay(1)); dl.delayTime.value = .36; var fb = gain(.38); dl.connect(fb); fb.connect(dl); dl.connect(out);
      var mel = [76, 79, 83, 81, 79, 76, 74, 76, 71, 74, 76, 79, 77, 76, 74, 71, 72, 74, 76, 72, 69, 71, 72, 74], step = 0, beat = .42, next = AC.currentTime + .1;
      timers.push(setInterval(function () {
        while (next < AC.currentTime + .25) {
          var f = 440 * Math.pow(2, (mel[step % mel.length] - 69) / 12);
          [[1, .22], [3, .05], [5.2, .02]].forEach(function (h) {
            var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = f * h[0];
            g.gain.setValueAtTime(h[1], next); g.gain.exponentialRampToValueAtTime(.0001, next + 1.4);
            o.connect(g); g.connect(out); g.connect(dl); o.start(next); o.stop(next + 1.5);
          });
          next += step % 3 === 2 ? beat * 1.5 : beat; step++;
        }
      }, 60));
    }
  }
  function setStation(i) {
    station = (i + STATIONS.length) % STATIONS.length;
    $('#needle').style.left = STATIONS[station].x + '%';
    $('#sNum').textContent = 'STATION ' + roman(station + 1); $('#sName').textContent = STATIONS[station].n;
    if (playing) { stopStation(); startStation(station); }
  }
  function play(on) {
    if (on && !audio()) return;
    if (on && AC.state === 'suspended') AC.resume();
    playing = on; if (on) startStation(station); else stopStation();
    $('#sPlayIco').innerHTML = '<use href="#i-' + (on ? 'pause' : 'play') + '"/>';
    $('#sPlay').setAttribute('aria-label', on ? 'Pause the haunted radio' : 'Play the haunted radio');
    $('#cab').classList.toggle('is-playing', on);
  }
  $('#sPlay').addEventListener('click', function () { play(!playing); });
  $('#sNext').addEventListener('click', function () { setStation(station + 1); });
  (function () {
    var cv = $('#scope'), ctx = cv.getContext('2d'), wave = new Uint8Array(1024);
    addRenderer(cv, function (t) {
      fit(cv); var W = cv.width, H = cv.height, n = 160, pts = [];
      ctx.clearRect(0, 0, W, H);
      if (playing && analyser) { analyser.getByteTimeDomainData(wave); for (var i = 0; i < n; i++) pts.push((wave[Math.floor(i / n * 1024)] - 128) / 128); }
      else for (var j = 0; j < n; j++) pts.push(Math.sin(j / n * Math.PI * 6 + t * 2) * .18 * Math.sin(t * .7 + j / 40) + Math.sin(j * .9 + t * 7) * .02);
      [[10 * DPR, 'rgba(77,255,176,.12)'], [4 * DPR, 'rgba(77,255,176,.35)'], [1.5 * DPR, '#d6ffec']].forEach(function (p) {
        ctx.lineWidth = p[0]; ctx.strokeStyle = p[1]; ctx.lineJoin = 'round'; ctx.beginPath();
        pts.forEach(function (v, k) { var x = k / (n - 1) * W, y = H / 2 + v * H * .42; if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
        ctx.stroke();
      });
    });
  })();

  /* ==========================================================================
     FORTUNE WHEEL · the Activity Wheel's real wedges
     ========================================================================== */
  var WEDGES = [['DIY Party', '#ff6f00'], ['Spirit Halloween', '#7b2cbf'], ['Haunted House', '#9d0208'], ['Ghost Hunt', '#0e8f8a'], ['Treats & Bakes', '#e85d04'], ['Costume Quest', '#5a189a'], ['Scream Park', '#6a040f'], ['Folklore Stop', '#134e5e']];
  function drawWheel() {
    var cv = $('#wheel'), ctx = cv.getContext('2d'), Sz = cv.width, c = Sz / 2, R = Sz / 2 - Sz * .02, n = WEDGES.length, sl = Math.PI * 2 / n;
    ctx.clearRect(0, 0, Sz, Sz);
    var rim = ctx.createLinearGradient(0, 0, Sz, Sz); rim.addColorStop(0, '#f6dc96'); rim.addColorStop(.3, '#8a5e1e'); rim.addColorStop(.55, '#f3d58a'); rim.addColorStop(.8, '#5e3e12'); rim.addColorStop(1, '#d8ae5e');
    ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#120a05'; ctx.beginPath(); ctx.arc(c, c, R * .9, 0, Math.PI * 2); ctx.fill();
    for (var i = 0; i < n; i++) {
      var a0 = i * sl - Math.PI / 2, g = ctx.createRadialGradient(c, c, R * .1, c, c, R * .88);
      g.addColorStop(0, '#000'); g.addColorStop(.25, WEDGES[i][1]); g.addColorStop(.85, WEDGES[i][1]); g.addColorStop(1, '#0a0503');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(c, c); ctx.arc(c, c, R * .88, a0, a0 + sl); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.translate(c, c); ctx.rotate(a0 + sl / 2); ctx.fillStyle = '#f8e6b8'; ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = Sz * .01;
      ctx.font = '700 ' + Math.round(Sz * .036) + 'px Cinzel, serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(WEDGES[i][0].toUpperCase(), R * .82, 0); ctx.restore();
    }
    ctx.strokeStyle = '#e8c27a'; ctx.lineWidth = Sz * .006;
    for (var k = 0; k < n; k++) { var a = k * sl - Math.PI / 2; ctx.beginPath(); ctx.moveTo(c + Math.cos(a) * R * .2, c + Math.sin(a) * R * .2); ctx.lineTo(c + Math.cos(a) * R * .88, c + Math.sin(a) * R * .88); ctx.stroke(); }
    for (var b = 0; b < 24; b++) { var ba = b * Math.PI / 12, bx = c + Math.cos(ba) * R * .94, by = c + Math.sin(ba) * R * .94, bg = ctx.createRadialGradient(bx, by, 0, bx, by, Sz * .02); bg.addColorStop(0, b % 2 ? '#fffbe8' : '#c9a25a'); bg.addColorStop(.5, b % 2 ? '#ffcf6b' : '#7a5520'); bg.addColorStop(1, 'rgba(60,36,16,0)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(bx, by, Sz * .02, 0, Math.PI * 2); ctx.fill(); }
    var hb = ctx.createRadialGradient(c - Sz * .03, c - Sz * .03, 0, c, c, R * .2); hb.addColorStop(0, '#f3d7a0'); hb.addColorStop(.4, '#9a6c34'); hb.addColorStop(1, '#2a1708');
    ctx.fillStyle = hb; ctx.beginPath(); ctx.arc(c, c, R * .17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#140b04'; ctx.font = Math.round(Sz * .08) + 'px UnifrakturMaguntia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('F', c, c + Sz * .005);
    ctx.fillStyle = '#f3d58a'; ctx.beginPath(); ctx.moveTo(c - Sz * .035, Sz * .005); ctx.lineTo(c + Sz * .035, Sz * .005); ctx.lineTo(c, Sz * .08); ctx.closePath(); ctx.fill();
  }
  drawWheel();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(drawWheel);

  /* ==========================================================================
     SPECTRAL MAP CARD · nearest haunts to the visitor (or the season default)
     ========================================================================== */
  (function () {
    var MAP = global.HALLOWEEN_MAP || { places: [] }, mapUrl = F.url('halloween', 'map');
    function render(loc) {
      var live = loc.source === 'device' || (loc.source === 'saved' && loc.label === 'Your location');
      var place = live ? 'you' : (loc.label && loc.label !== 'Your location' ? loc.label : 'Salem, MA');
      var list = MAP.places.map(function (p) { return { p: p, km: F.geo.haversine(loc, { lat: p.lat, lon: p.lon }) }; }).sort(function (a, b) { return a.km - b.km; });
      var close = list.filter(function (x) { return x.km <= 40; });
      $('#radarPlace').textContent = place;
      $('#radarCount').textContent = close.length ? close.length + ' haunt' + (close.length === 1 ? '' : 's') + ' within 25 mi' : MAP.places.length + ' haunts on the map';
      var near = $('#radarNear');
      if (list.length) { var mi = list[0].km * .621371; near.hidden = false; near.textContent = 'Nearest ' + (mi < 10 ? mi.toFixed(1) : Math.round(mi).toLocaleString('en-US')) + ' mi'; }
      $('#radarCard').href = live ? mapUrl + '?near=me' : mapUrl;
    }
    F.geo.get({ season: 'halloween' }).then(function (l) {
      render(l);
      if (navigator.permissions && navigator.permissions.query) navigator.permissions.query({ name: 'geolocation' }).then(function (r) { if (r.state === 'granted') F.geo.get({ ask: true, season: 'halloween' }).then(render); }).catch(function () {});
    });
  })();

  /* ==========================================================================
     LORE · the season's reviewed facts, one per day, tap for more
     ========================================================================== */
  (function () {
    var facts = (global.FESTO_FACTS && global.FESTO_FACTS.halloween) || [];
    if (!facts.length) return;
    var i = F.util && F.util.dayOfYear ? F.util.dayOfYear(F.now()) % facts.length : 0, q = $('#loreQ'), box = $('#lore');
    function show() { q.textContent = facts[i]; $('#loreN').textContent = roman(i + 1) + ' / ' + roman(facts.length); }
    function next() { i = (i + 1) % facts.length; q.classList.add('swap'); setTimeout(function () { show(); q.classList.remove('swap'); }, 300); playTick(360); }
    show();
    box.addEventListener('click', next);
    box.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } });
  })();

  /* ==========================================================================
     WALLPAPER VAULT · four procedural scenes, painted on canvas at full resolution and downloaded as PNG
     ========================================================================== */
  var toastT;
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2600); }
  var WALLS = [
    { id: 'manor', name: 'Midnight Manse', sub: 'Full moon over the misty woods' },
    { id: 'street', name: 'Cobblestone Twilight', sub: "Lanterns and jack-o'-lanterns on the stoops" },
    { id: 'grimoire', name: "The Alchemist's Grimoire", sub: 'Candles, vials and glowing runes' },
    { id: 'graveyard', name: 'The Witching Hour', sub: 'Crooked stones in ectoplasm mist' }
  ];
  var DEV = { phone: { w: 1080, h: 1920, label: 'mobile' }, desktop: { w: 1920, h: 1080, label: 'desktop' } };
  var device = 'phone';

  function paint(ctx, W, H, id) {
    var U = Math.min(W, H) / 1000, portrait = H > W, r = rng(id.length * 97 + (portrait ? 3 : 7));
    function grad(y0, y1, stops) { var g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g; }
    function glow(x, y, rad, color, a) { var g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, color.replace('A', a)); g.addColorStop(1, color.replace('A', 0)); ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    function stars(n, maxY) { for (var i = 0; i < n; i++) { ctx.fillStyle = 'rgba(235,240,255,' + (.25 + r() * .7) + ')'; var s = (r() * 1.6 + .4) * U * 1.6; ctx.fillRect(r() * W, r() * H * maxY, s, s); } }
    function moon(x, y, R, tint) {
      glow(x, y, R * 4.2, tint || 'rgba(190,210,255,A)', .38);
      var d = moonDisc(Math.round(R), .5); ctx.drawImage(d, x - d.width / 2, y - d.height / 2);
      glow(x, y, R * 1.3, 'rgba(240,245,255,A)', .25);
    }
    function fog(y0, y1, color, alpha, seed, litX, litY, litR) {
      var t = fogTexture(W, H, seed, [y0, y1], 34, alpha);
      if (litR) { var c = el('canvas'); c.width = W; c.height = H; var x = c.getContext('2d'); x.drawImage(t, 0, 0); x.globalCompositeOperation = 'source-atop'; var g = x.createRadialGradient(litX, litY, 0, litX, litY, litR); g.addColorStop(0, 'rgba(250,252,255,.85)'); g.addColorStop(1, 'rgba(60,72,104,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); t = c; }
      if (color) { var c2 = el('canvas'); c2.width = W; c2.height = H; var x2 = c2.getContext('2d'); x2.drawImage(t, 0, 0); x2.globalCompositeOperation = 'source-atop'; x2.fillStyle = color; x2.fillRect(0, 0, W, H); t = c2; }
      ctx.drawImage(t, 0, 0);
    }
    function bat(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (.6 + r() * .4)); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-10, -9, -22, -4); ctx.quadraticCurveTo(-16, -1, -14, 3); ctx.quadraticCurveTo(-9, 0, -5, 3); ctx.quadraticCurveTo(-2, 1, 0, 4); ctx.quadraticCurveTo(2, 1, 5, 3); ctx.quadraticCurveTo(9, 0, 14, 3); ctx.quadraticCurveTo(16, -1, 22, -4); ctx.quadraticCurveTo(10, -9, 0, 0); ctx.fill(); ctx.restore(); }
    function tree(x, y, len, ang, depth, w) {
      if (depth <= 0) return;
      var x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + x2) / 2 + (r() - .5) * len * .3, (y + y2) / 2, x2, y2); ctx.stroke();
      tree(x2, y2, len * (.68 + r() * .12), ang - .38 - r() * .35, depth - 1, w * .66);
      tree(x2, y2, len * (.66 + r() * .12), ang + .34 + r() * .38, depth - 1, w * .66);
      if (r() < .3) tree(x2, y2, len * .5, ang + (r() - .5) * .4, depth - 2, w * .5);
    }
    function jack(x, y, s, light) {
      glow(x, y, s * 2.4, 'rgba(255,140,40,A)', .35 * light);
      [[-.55, .78], [.55, .78], [-.25, .92], [.25, .92], [0, .96]].forEach(function (l) {
        var g = ctx.createLinearGradient(x + l[0] * s - s * .6, 0, x + l[0] * s + s * .6, 0); g.addColorStop(0, '#5e1d03'); g.addColorStop(.5, '#e8721a'); g.addColorStop(1, '#5e1d03');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x + l[0] * s * .7, y, s * .55 * l[1], s * .8, 0, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = '#3f5a1f'; ctx.fillRect(x - s * .07, y - s * 1.02, s * .14, s * .3);
      ctx.fillStyle = 'rgba(255,220,120,' + light + ')'; ctx.shadowColor = '#ff9a2a'; ctx.shadowBlur = s * .6;
      ctx.beginPath(); ctx.moveTo(x - s * .5, y - s * .1); ctx.lineTo(x - s * .28, y - s * .38); ctx.lineTo(x - s * .16, y - s * .06); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + s * .5, y - s * .1); ctx.lineTo(x + s * .28, y - s * .38); ctx.lineTo(x + s * .16, y - s * .06); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - s * .55, y + s * .2); ctx.quadraticCurveTo(x, y + s * .7, x + s * .55, y + s * .2); ctx.lineTo(x + s * .35, y + s * .34); ctx.lineTo(x + s * .2, y + s * .26); ctx.lineTo(x, y + s * .42); ctx.lineTo(x - s * .2, y + s * .26); ctx.lineTo(x - s * .35, y + s * .34); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
    }
    function candle(x, y, h, w) {
      var g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#b9a47c'); g.addColorStop(.4, '#f4e8c8'); g.addColorStop(1, '#a8916a');
      ctx.fillStyle = g; ctx.fillRect(x - w / 2, y - h, w, h);
      ctx.beginPath(); ctx.moveTo(x - w / 2, y - h); for (var i = 0; i <= 6; i++) ctx.lineTo(x - w / 2 + w * i / 6, y - h + (i % 2 ? w * .25 : 0) + r() * w * .5); ctx.lineTo(x + w / 2, y - h - 2); ctx.fill();
      ctx.fillStyle = '#2a1d10'; ctx.fillRect(x - w * .04, y - h - w * .3, w * .08, w * .3);
      glow(x, y - h - w * .7, w * 5, 'rgba(255,170,70,A)', .55);
      var fg = ctx.createRadialGradient(x, y - h - w * .55, 0, x, y - h - w * .65, w * .55); fg.addColorStop(0, '#fffbe6'); fg.addColorStop(.4, '#ffd166'); fg.addColorStop(1, 'rgba(255,120,20,0)');
      ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(x, y - h - w * .65, w * .22, w * .55, 0, 0, Math.PI * 2); ctx.fill();
    }

    if (id === 'manor') {
      ctx.fillStyle = grad(0, H, [[0, '#04060f'], [.45, '#111933'], [.75, '#232b4a'], [1, '#0a0c16']]); ctx.fillRect(0, 0, W, H);
      stars(260, .65);
      var mx = W * (portrait ? .66 : .7), my = H * (portrait ? .24 : .3), MR = U * (portrait ? 190 : 170);
      moon(mx, my, MR);
      fog(.2, .55, null, .14, 3, mx, my, MR * 4);
      ctx.fillStyle = '#121a30'; ctx.beginPath(); ctx.moveTo(0, H * .7); for (var i = 0; i <= 24; i++) ctx.lineTo(W * i / 24, H * (.66 - Math.sin(i * .7) * .02 - r() * .02)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
      ctx.fillStyle = '#0a0f1f'; for (var p = 0; p < 46; p++) { var px = r() * W, ph = U * (60 + r() * 120), pb = H * (.74 + r() * .03); ctx.beginPath(); ctx.moveTo(px, pb - ph); ctx.lineTo(px - ph * .22, pb); ctx.lineTo(px + ph * .22, pb); ctx.fill(); }
      var bx = W * (portrait ? .44 : .38), by = H * .8, S = U * (portrait ? 1.25 : 1.05);
      ctx.fillStyle = '#05070e';
      ctx.fillRect(bx - 260 * S, by - 230 * S, 520 * S, 230 * S);
      ctx.beginPath(); ctx.moveTo(bx - 290 * S, by - 230 * S); ctx.lineTo(bx, by - 380 * S); ctx.lineTo(bx + 290 * S, by - 230 * S); ctx.fill();
      [[-300, 330], [300, 300]].forEach(function (t) { ctx.fillRect(bx + t[0] * S - 55 * S, by - t[1] * S, 110 * S, t[1] * S); ctx.beginPath(); ctx.moveTo(bx + t[0] * S - 70 * S, by - t[1] * S); ctx.lineTo(bx + t[0] * S, by - t[1] * S - 150 * S); ctx.lineTo(bx + t[0] * S + 70 * S, by - t[1] * S); ctx.fill(); ctx.fillRect(bx + t[0] * S - 3 * S, by - t[1] * S - 200 * S, 6 * S, 55 * S); });
      ctx.fillRect(bx + 120 * S, by - 420 * S, 34 * S, 120 * S); ctx.fillRect(bx - 160 * S, by - 400 * S, 30 * S, 90 * S);
      ctx.shadowColor = '#ffb347'; ctx.shadowBlur = 24 * S; ctx.fillStyle = '#ffcf7a';
      [[-200, -170], [-120, -170], [100, -170], [180, -170], [-200, -80], [180, -80], [-300, -230], [300, -200], [0, -290]].forEach(function (w, k) { if (r() < .82) { ctx.globalAlpha = .55 + r() * .45; ctx.fillRect(bx + w[0] * S - 14 * S, by + w[1] * S - 24 * S, 28 * S, k === 8 ? 30 * S : 42 * S); } });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffcf7a'; ctx.beginPath(); ctx.arc(bx, by - 290 * S, 18 * S, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#04050b'; ctx.fillRect(0, H * .83, W, H * .17);
      ctx.strokeStyle = '#04050b'; ctx.lineCap = 'round'; tree(W * .08, H * .9, U * 230, -Math.PI / 2 - .12, 7, U * 26);
      for (var f = 0; f < W; f += U * 34) { ctx.fillRect(f, H * .86, U * 6, H * .14); ctx.beginPath(); ctx.moveTo(f - U * 4, H * .86); ctx.lineTo(f + U * 3, H * .84); ctx.lineTo(f + U * 10, H * .86); ctx.fill(); }
      ctx.fillRect(0, H * .875, W, U * 6); ctx.fillRect(0, H * .94, W, U * 6);
      fog(.6, 1.02, null, .3, 7, mx, my, MR * 5); fog(.72, 1.1, null, .32, 13, mx, my, MR * 5);
      ctx.fillStyle = '#05060c'; for (var b = 0; b < 7; b++) bat(mx - MR * 2 + r() * MR * 4, my - MR * 1.5 + r() * MR * 3, U * (2.2 + r() * 2));
    } else if (id === 'street') {
      var vx = W / 2, vy = H * (portrait ? .5 : .52);
      ctx.fillStyle = grad(0, H, [[0, '#0d0818'], [.3, '#2a1532'], [.5, '#6e2f2a'], [.56, '#c26a2c'], [.6, '#1a0e10'], [1, '#07050a']]); ctx.fillRect(0, 0, W, H);
      stars(120, .3);
      glow(vx, vy, U * 520, 'rgba(255,150,60,A)', .45);
      ctx.fillStyle = '#1a1018'; ctx.beginPath(); ctx.moveTo(vx - U * 60, vy); ctx.lineTo(vx - U * 50, vy - U * 160); ctx.lineTo(vx - U * 40, vy - U * 230); ctx.lineTo(vx - U * 30, vy - U * 160); ctx.lineTo(vx - U * 10, vy - U * 140); ctx.lineTo(vx + U * 40, vy - U * 110); ctx.lineTo(vx + U * 60, vy); ctx.fill();
      ctx.fillStyle = grad(vy, H, [[0, '#24161a'], [1, '#0b0709']]); ctx.beginPath(); ctx.moveTo(vx - U * 50, vy); ctx.lineTo(vx + U * 50, vy); ctx.lineTo(W * 1.1, H); ctx.lineTo(-W * .1, H); ctx.fill();
      for (var row = 0; row < 26; row++) {
        var t = Math.pow(row / 26, 1.8), yy = vy + (H - vy) * t, half = U * 50 + (W * .6) * t, sw = U * (6 + 90 * t), sh = sw * .45;
        for (var sx2 = vx - half + (row % 2) * sw / 2; sx2 < vx + half; sx2 += sw) { ctx.fillStyle = 'rgba(' + (60 + r() * 30) + ',' + (42 + r() * 20) + ',' + (40 + r() * 16) + ',' + (.5 + t * .4) + ')'; ctx.beginPath(); ctx.ellipse(sx2, yy, sw * .44, sh * .4, 0, 0, Math.PI * 2); ctx.fill(); }
      }
      [-1, 1].forEach(function (side) {
        for (var k = 0; k < 4; k++) {
          var n0 = k / 4, n1 = (k + 1) / 4, x0 = vx + side * (U * 60 + W * .62 * Math.pow(n0, 1.4)), x1 = vx + side * (U * 60 + W * .62 * Math.pow(n1, 1.4));
          var top0 = vy - U * 160 - H * .55 * Math.pow(n0, 1.2), top1 = vy - U * 160 - H * .55 * Math.pow(n1, 1.2), bot0 = vy + (H - vy) * .02 + H * .4 * Math.pow(n0, 1.4), bot1 = vy + H * .4 * Math.pow(n1, 1.4) + (H - vy) * .02;
          ctx.fillStyle = k % 2 ? '#120a10' : '#170d14'; ctx.beginPath(); ctx.moveTo(x0, top0); ctx.lineTo(x1, top1); ctx.lineTo(x1, bot1); ctx.lineTo(x0, bot0); ctx.fill();
          var gx = (x0 + x1) / 2, gt = (top0 + top1) / 2; ctx.beginPath(); ctx.moveTo(x0, top0); ctx.lineTo(gx, gt - U * 60 * (1 + k)); ctx.lineTo(x1, top1); ctx.fill();
          ctx.shadowColor = '#ffb347'; ctx.shadowBlur = U * 20;
          for (var wy = 0; wy < 3; wy++) if (r() < .7) { ctx.fillStyle = 'rgba(255,200,110,' + (.5 + r() * .5) + ')'; var wx = x0 + (x1 - x0) * (.3 + r() * .4), wyy = top0 + (bot0 - top0) * (.25 + wy * .22), ww = Math.abs(x1 - x0) * .14; ctx.fillRect(wx - ww / 2, wyy, ww, ww * 1.5); }
          ctx.shadowBlur = 0;
        }
      });
      [[-1, .35], [1, .55], [-1, .8]].forEach(function (lp) {
        var d = lp[1], x = vx + lp[0] * (U * 70 + W * .42 * Math.pow(d, 1.4)), base = vy + (H - vy) * Math.pow(d, 1.6), hh = U * (120 + 520 * d);
        ctx.fillStyle = '#07050a'; ctx.fillRect(x - U * 4 * (1 + d * 3), base - hh, U * 8 * (1 + d * 3), hh);
        glow(x, base - hh, U * (60 + 260 * d), 'rgba(255,180,90,A)', .55);
        ctx.fillStyle = '#ffd88f'; ctx.fillRect(x - U * 10 * (1 + d * 3), base - hh - U * 26 * (1 + d * 3), U * 20 * (1 + d * 3), U * 22 * (1 + d * 3));
      });
      jack(W * (portrait ? .16 : .12), H * .9, U * 70, 1); jack(W * (portrait ? .82 : .86), H * .92, U * 82, 1); jack(W * (portrait ? .3 : .22), H * .95, U * 48, .9);
      fog(.62, 1.05, 'rgba(255,170,110,.5)', .22, 21);
      ctx.fillStyle = '#08050a'; for (var bb = 0; bb < 5; bb++) bat(vx - U * 300 + r() * U * 600, H * (.12 + r() * .2), U * (1.6 + r() * 1.6));
    } else if (id === 'grimoire') {
      var bg = ctx.createRadialGradient(W / 2, H * .5, U * 50, W / 2, H * .5, Math.max(W, H) * .75); bg.addColorStop(0, '#3a1f0e'); bg.addColorStop(.5, '#170b06'); bg.addColorStop(1, '#040202'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var ty = H * (portrait ? .62 : .66);
      ctx.fillStyle = grad(ty, H, [[0, '#4a2a14'], [.08, '#2e1a0c'], [1, '#0e0703']]); ctx.fillRect(0, ty, W, H - ty);
      ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = U * 2; for (var gl = 0; gl < 18; gl++) { var yy2 = ty + (H - ty) * gl / 18 + r() * U * 10; ctx.beginPath(); ctx.moveTo(0, yy2); ctx.bezierCurveTo(W * .3, yy2 + U * 8, W * .6, yy2 - U * 6, W, yy2 + U * 4); ctx.stroke(); }
      var cx = W / 2, cy = ty - U * 10, rr = U * (portrait ? 330 : 300);
      glow(cx, cy - rr * 1.15, rr * 1.6, 'rgba(120,255,190,A)', .22);
      ctx.save(); ctx.translate(cx, cy - rr * 1.15); ctx.strokeStyle = 'rgba(140,255,200,.75)'; ctx.shadowColor = '#4dffb0'; ctx.shadowBlur = U * 24; ctx.lineWidth = U * 3;
      ctx.beginPath(); ctx.arc(0, 0, rr * .78, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, rr * .62, 0, Math.PI * 2); ctx.stroke();
      for (var k2 = 0; k2 < 5; k2++) { var a1 = -Math.PI / 2 + k2 * Math.PI * 4 / 5, a2 = a1 + Math.PI * 4 / 5; ctx.beginPath(); ctx.moveTo(Math.cos(a1) * rr * .62, Math.sin(a1) * rr * .62); ctx.lineTo(Math.cos(a2) * rr * .62, Math.sin(a2) * rr * .62); ctx.stroke(); }
      ctx.lineWidth = U * 2.4; for (var q = 0; q < 16; q++) { var aq = q * Math.PI / 8; ctx.save(); ctx.rotate(aq); ctx.translate(0, -rr * .7); ctx.beginPath(); var gk = q % 4; if (gk === 0) { ctx.moveTo(0, -U * 14); ctx.lineTo(0, U * 14); ctx.moveTo(-U * 8, -U * 4); ctx.lineTo(U * 8, U * 6); } else if (gk === 1) { ctx.moveTo(-U * 8, U * 12); ctx.lineTo(0, -U * 12); ctx.lineTo(U * 8, U * 12); } else if (gk === 2) { ctx.arc(0, 0, U * 8, 0, Math.PI * 1.5); } else { ctx.moveTo(-U * 8, -U * 10); ctx.lineTo(U * 8, U * 10); ctx.moveTo(U * 8, -U * 10); ctx.lineTo(-U * 8, U * 10); } ctx.stroke(); ctx.restore(); }
      ctx.restore();
      var bw = rr * 1.25, bh = rr * .62;
      ctx.fillStyle = '#3a0f12'; ctx.beginPath(); ctx.moveTo(cx - bw * 1.04, cy + bh * .1); ctx.lineTo(cx + bw * 1.04, cy + bh * .1); ctx.lineTo(cx + bw * .98, cy - bh * 1.02); ctx.lineTo(cx - bw * .98, cy - bh * 1.02); ctx.fill();
      [-1, 1].forEach(function (sd) {
        var pg = ctx.createLinearGradient(cx, 0, cx + sd * bw, 0); pg.addColorStop(0, '#b89a62'); pg.addColorStop(.12, '#e9d6ac'); pg.addColorStop(1, '#d8bf88');
        ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(cx, cy - bh * .02); ctx.quadraticCurveTo(cx + sd * bw * .5, cy - bh * .12, cx + sd * bw * .96, cy); ctx.lineTo(cx + sd * bw * .92, cy - bh * .96); ctx.quadraticCurveTo(cx + sd * bw * .5, cy - bh * 1.04, cx, cy - bh * .92); ctx.fill();
        ctx.strokeStyle = 'rgba(70,40,15,.45)'; ctx.lineWidth = U * 2.2;
        for (var ln = 0; ln < 9; ln++) { var ly = cy - bh * .82 + ln * bh * .085; ctx.beginPath(); ctx.moveTo(cx + sd * bw * .14, ly); ctx.lineTo(cx + sd * bw * (.8 - r() * .12), ly + sd * U * 2); ctx.stroke(); }
        ctx.fillStyle = 'rgba(122,20,22,.85)'; ctx.font = 'bold ' + Math.round(U * 46) + 'px UnifrakturMaguntia, serif'; ctx.fillText(sd < 0 ? 'A' : 'M', cx + sd * bw * .16 - (sd < 0 ? U * 4 : 0), cy - bh * .74);
      });
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(cx - U * 6, cy - bh * .95, U * 12, bh * .95);
      ctx.fillStyle = '#8e1416'; ctx.beginPath(); ctx.moveTo(cx - U * 8, cy); ctx.lineTo(cx + U * 8, cy); ctx.lineTo(cx + U * 8, cy + U * 120); ctx.lineTo(cx, cy + U * 104); ctx.lineTo(cx - U * 8, cy + U * 120); ctx.fill();
      var cs = portrait ? [[.14, 300, 56], [.26, 200, 46], [.8, 340, 60], [.9, 220, 44]] : [[.12, 320, 60], [.22, 210, 48], [.82, 360, 62], [.91, 230, 46]];
      cs.forEach(function (c) { candle(W * c[0], ty + U * 30, U * c[1], U * c[2]); });
      [[portrait ? .36 : .3, 'rgba(77,255,176,', 120], [portrait ? .66 : .7, 'rgba(180,90,255,', 150], [portrait ? .56 : .62, 'rgba(255,70,90,', 100]].forEach(function (v) {
        var vx2 = W * v[0], vb = ty + U * 40, vr = U * v[2] * .5;
        glow(vx2, vb - vr, vr * 3, v[1] + 'A)', .35);
        ctx.fillStyle = 'rgba(200,220,255,.12)'; ctx.strokeStyle = 'rgba(230,240,255,.5)'; ctx.lineWidth = U * 2;
        ctx.beginPath(); ctx.arc(vx2, vb - vr, vr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillRect(vx2 - vr * .25, vb - vr * 2.9, vr * .5, vr); ctx.strokeRect(vx2 - vr * .25, vb - vr * 2.9, vr * .5, vr);
        ctx.fillStyle = v[1] + '.8)'; ctx.beginPath(); ctx.arc(vx2, vb - vr, vr * .92, .15, Math.PI - .15); ctx.fill();
        ctx.fillStyle = '#7a5226'; ctx.fillRect(vx2 - vr * .3, vb - vr * 3.15, vr * .6, vr * .3);
      });
      for (var m = 0; m < 70; m++) { ctx.fillStyle = 'rgba(255,200,120,' + r() * .5 + ')'; var ms = U * (1 + r() * 2.5); ctx.fillRect(r() * W, r() * ty, ms, ms); }
      var vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75); vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,.75)'); ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = grad(0, H, [[0, '#07040e'], [.4, '#1a0f30'], [.7, '#2a2048'], [.85, '#163328'], [1, '#05080a']]); ctx.fillRect(0, 0, W, H);
      stars(220, .6);
      var gx = W * (portrait ? .3 : .24), gy = H * (portrait ? .2 : .26), GR = U * 110;
      moon(gx, gy, GR, 'rgba(180,255,220,A)');
      ctx.strokeStyle = '#040308'; ctx.fillStyle = '#040308'; ctx.lineCap = 'round';
      ctx.fillStyle = '#0b0a14'; ctx.beginPath(); ctx.moveTo(0, H * .78); for (var hx = 0; hx <= 20; hx++) ctx.lineTo(W * hx / 20, H * (.74 - Math.sin(hx * .5) * .025)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
      tree(W * (portrait ? .86 : .82), H * .82, U * 260, -Math.PI / 2 + .1, 8, U * 30);
      tree(W * (portrait ? .1 : .14), H * .84, U * 200, -Math.PI / 2 - .15, 7, U * 24);
      var stones = []; for (var s2 = 0; s2 < (portrait ? 11 : 14); s2++) stones.push({ x: r() * W, d: r() });
      stones.sort(function (a, b) { return a.d - b.d; }).forEach(function (st) {
        var sc = U * (40 + st.d * 120), base = H * (.76 + st.d * .2), tilt = (r() - .5) * .3;
        ctx.save(); ctx.translate(st.x, base); ctx.rotate(tilt);
        ctx.fillStyle = 'rgb(' + Math.round(14 + st.d * 18) + ',' + Math.round(13 + st.d * 16) + ',' + Math.round(22 + st.d * 18) + ')';
        if (r() < .3) { ctx.fillRect(-sc * .12, -sc * 1.6, sc * .24, sc * 1.6); ctx.fillRect(-sc * .48, -sc * 1.2, sc * .96, sc * .22); }
        else { ctx.beginPath(); ctx.moveTo(-sc * .45, 0); ctx.lineTo(-sc * .45, -sc * .9); ctx.arc(0, -sc * .9, sc * .45, Math.PI, 0); ctx.lineTo(sc * .45, 0); ctx.fill(); }
        ctx.fillStyle = 'rgba(140,255,200,' + (.06 + st.d * .08) + ')'; ctx.fillRect(-sc * .45, -sc * 1.3, sc * .06, sc * 1.3);
        ctx.restore();
      });
      fog(.68, 1.05, 'rgba(77,255,176,.55)', .3, 31, gx, gy, GR * 3);
      fog(.8, 1.12, 'rgba(120,255,200,.5)', .32, 41);
      ctx.fillStyle = '#05040a'; for (var b2 = 0; b2 < 12; b2++) bat(W * (.2 + r() * .7), H * (.08 + r() * .35), U * (1.4 + r() * 2.4));
    }
    var grain = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .4, W / 2, H / 2, Math.max(W, H) * .8); grain.addColorStop(0, 'rgba(0,0,0,0)'); grain.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = grain; ctx.fillRect(0, 0, W, H);
  }

  (function wallVault() {
    var host = $('#walls'); if (!host) return;
    var cards = WALLS.map(function (w) {
      var fig = el('figure', 'wall');
      fig.innerHTML = '<div class="wall-frame"><canvas aria-hidden="true"></canvas></div><figcaption><b></b><span></span></figcaption><button class="pill dl" type="button"><svg aria-hidden="true"><use href="#i-download"/></svg>Download</button>';
      $('b', fig).textContent = w.name; $('figcaption span', fig).textContent = w.sub;
      $('button', fig).setAttribute('aria-label', 'Download ' + w.name + ' wallpaper');
      $('button', fig).addEventListener('click', function () { download(w, this); });
      host.appendChild(fig);
      return { w: w, cv: $('canvas', fig) };
    });
    function previews() {
      host.dataset.device = device;
      var d = DEV[device], pw = device === 'phone' ? 270 : 480, ph = Math.round(pw * d.h / d.w);
      cards.forEach(function (c, i) { setTimeout(function () { c.cv.width = pw; c.cv.height = ph; paint(c.cv.getContext('2d'), pw, ph, c.w.id); }, i * 30); });
    }
    function download(w, btn) {
      var d = DEV[device], cv = el('canvas'); cv.width = d.w; cv.height = d.h;
      btn.disabled = true; var label = btn.lastChild.textContent; btn.lastChild.textContent = 'Inscribing…';
      setTimeout(function () {
        try { paint(cv.getContext('2d'), d.w, d.h, w.id); } catch (e) { btn.disabled = false; btn.lastChild.textContent = label; return; }
        cv.toBlob(function (blob) {
          btn.disabled = false; btn.lastChild.textContent = label;
          if (!blob) { toast('This browser could not save the wallpaper'); return; }
          var a = el('a'); a.href = URL.createObjectURL(blob); a.download = 'festo-halloween-' + w.id + '-' + d.label + '.png';
          doc.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
          toast('Wallpaper inscribed to your device'); playTick(440);
        }, 'image/png');
      }, 30);
    }
    $$('[data-dev]').forEach(function (b) {
      b.addEventListener('click', function () {
        device = b.getAttribute('data-dev');
        $$('[data-dev]').forEach(function (o) { o.setAttribute('aria-checked', String(o === b)); });
        previews();
      });
    });
    var wio = 'IntersectionObserver' in global ? new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { wio.disconnect(); (doc.fonts ? doc.fonts.ready : Promise.resolve()).then(previews); } }, { rootMargin: '400px' }) : null;
    if (wio) wio.observe(host); else previews();
  })();

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
