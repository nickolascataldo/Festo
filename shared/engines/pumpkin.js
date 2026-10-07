/* ==========================================================================
   FestoPumpkin: a canvas pumpkin-carving studio.
     tools     knife (cuts through), chisel (carves deep), spoon (shaves the skin), marker (ink), eraser
     stencils  eyes, noses, mouths and big shapes, stamped at any size and tilt; one-tap face presets
     stickers  decorations glued on top (drawn from the icon font)
     candle    a flickering glow through everything that is cut through (respects reduced motion)
     history   undo / redo, a small gallery, PNG export, a share link
   Everything is replayed from a list of operations, so undo is exact and sharing is tiny.
   The pure helpers (paths, simplify, encode/decode) are exposed as FestoPumpkin._pure for tests.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo, h = F.dom.h;
  var W = 640, H = 600, CX = 320, CY = 330;
  var TAU = Math.PI * 2;

  /* ---------- stencil library (SVG path data in a 100x100 box, drawn with the even-odd rule) ---------- */
  var HOLE = function (cx, cy, rx, ry) { return ' M' + (cx - rx) + ' ' + cy + ' a' + rx + ' ' + ry + ' 0 1 0 ' + (2 * rx) + ' 0 a' + rx + ' ' + ry + ' 0 1 0 ' + (-2 * rx) + ' 0'; };
  var STENCILS = {
    eyes: [
      { id: 'eye-tri', icon: 'caret-up', d: 'M50 8 L92 86 L8 86 Z' },
      { id: 'eye-slant', icon: 'slash', d: 'M8 40 L92 12 L88 62 L14 88 Z' },
      { id: 'eye-round', icon: 'circle', d: 'M8 50 A42 42 0 1 0 92 50 A42 42 0 1 0 8 50 Z' },
      { id: 'eye-almond', icon: 'eye', d: 'M6 50 Q50 8 94 50 Q50 92 6 50 Z' },
      { id: 'eye-star', icon: 'star', d: 'M50 6 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z' },
      { id: 'eye-moon', icon: 'moon', d: 'M70 8 A44 44 0 1 0 70 92 A34 34 0 1 1 70 8 Z' },
      { id: 'eye-heart', icon: 'heart', d: 'M50 90 C10 58 4 30 24 16 C38 6 50 18 50 28 C50 18 62 6 76 16 C96 30 90 58 50 90 Z' },
      { id: 'eye-diamond', icon: 'gem', d: 'M50 6 L92 50 L50 94 L8 50 Z' }
    ],
    noses: [
      { id: 'nose-tri', icon: 'caret-up', d: 'M50 14 L84 84 L16 84 Z' },
      { id: 'nose-heart', icon: 'heart', d: 'M50 12 C90 44 96 72 76 86 C62 96 50 84 50 74 C50 84 38 96 24 86 C4 72 10 44 50 12 Z' },
      { id: 'nose-dots', icon: 'ellipsis', d: 'M18 55 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M58 55 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0' },
      { id: 'nose-diamond', icon: 'gem', d: 'M50 14 L80 50 L50 86 L20 50 Z' }
    ],
    mouths: [
      { id: 'mouth-jag', icon: 'face-grin-tongue', d: 'M4 32 Q50 100 96 32 L84 42 L76 30 L64 46 L50 32 L36 46 L24 30 L16 42 Z' },
      { id: 'mouth-smile', icon: 'face-smile', d: 'M6 36 Q50 96 94 36 Q50 68 6 36 Z' },
      { id: 'mouth-fangs', icon: 'face-angry', d: 'M6 28 L94 28 Q80 86 50 88 Q20 86 6 28 Z M26 28 L36 60 L46 28 Z M54 28 L64 60 L74 28 Z' },
      { id: 'mouth-teeth', icon: 'grip-lines', d: 'M4 30 L96 30 Q96 82 50 86 Q4 82 4 30 Z M14 30 L14 52 L28 52 L28 30 Z M36 30 L36 56 L50 56 L50 30 Z M58 30 L58 56 L72 56 L72 30 Z M80 30 L80 52 L86 52 L86 30 Z' },
      { id: 'mouth-o', icon: 'circle-dot', d: 'M24 50 A26 38 0 1 0 76 50 A26 38 0 1 0 24 50 Z' },
      { id: 'mouth-wavy', icon: 'water', d: 'M4 46 Q16 18 28 46 T52 46 T76 46 T96 46 L96 62 Q84 92 72 62 T48 62 T24 62 T4 62 Z' }
    ],
    shapes: [
      { id: 'bat', icon: 'dove', d: 'M50 30 L56 14 L58 32 Q74 18 96 30 Q92 40 90 52 Q80 44 70 52 Q66 44 58 48 L50 86 L42 48 Q34 44 30 52 Q20 44 10 52 Q8 40 4 30 Q26 18 42 32 L44 14 Z' },
      { id: 'cat', icon: 'cat', d: 'M18 26 L24 6 L38 20 L62 20 L76 6 L82 26 Q92 52 76 70 Q64 84 50 84 Q36 84 24 70 Q8 52 18 26 Z' + HOLE(34, 46, 6, 8) + HOLE(66, 46, 6, 8) },
      { id: 'ghost', icon: 'ghost', d: 'M16 92 L16 44 Q16 8 50 8 Q84 8 84 44 L84 92 L72 80 L61 92 L50 80 L39 92 L28 80 Z' + HOLE(40, 40, 7, 10) + HOLE(60, 40, 7, 10) + HOLE(50, 64, 8, 10) },
      { id: 'skull', icon: 'skull', d: 'M50 6 C20 6 10 28 14 50 C16 60 24 62 26 68 L26 90 L40 90 L40 80 L46 80 L46 90 L54 90 L54 80 L60 80 L60 90 L74 90 L74 68 C76 62 84 60 86 50 C90 28 80 6 50 6 Z' + HOLE(36, 42, 10, 12) + HOLE(64, 42, 10, 12) + ' M50 58 L44 72 L56 72 Z' },
      { id: 'hat', icon: 'hat-wizard', d: 'M50 4 L64 34 Q96 40 98 56 Q50 70 2 56 Q4 40 36 34 Z' },
      { id: 'moon-star', icon: 'star-and-crescent', d: 'M64 8 A42 42 0 1 0 64 92 A32 32 0 1 1 64 8 Z M82 28 L85 36 L94 36 L87 41 L90 50 L82 45 L74 50 L77 41 L70 36 L79 36 Z' },
      { id: 'spider', icon: 'spider', d: 'M50 38 a14 16 0 1 0 0.01 0 Z M50 58 a18 22 0 1 0 0.01 0 Z M36 50 L8 28 L4 40 M36 56 L6 56 M36 62 L8 80 M64 50 L92 28 L96 40 M64 56 L94 56 M64 62 L92 80' }
    ]
  };
  var ALL = [].concat(STENCILS.eyes, STENCILS.noses, STENCILS.mouths, STENCILS.shapes);
  var BY_ID = {}; ALL.forEach(function (s) { BY_ID[s.id] = s; });
  var PATHS = {};
  function pathOf(id) { return PATHS[id] || (PATHS[id] = new Path2D(BY_ID[id].d)); }

  /* face presets: placements relative to the pumpkin centre */
  function face(eye, nose, mouth, o) {
    o = o || {};
    var ex = o.ex || 88, ey = o.ey || -36, es = o.es || 0.78, er = o.er == null ? 8 : o.er;
    var ops = [{ t: 'st', id: eye, x: CX - ex, y: CY + ey, sc: es, rot: -er, d: 3 }, { t: 'st', id: eye, x: CX + ex, y: CY + ey, sc: es, rot: er, mx: 1, d: 3 }];
    if (nose) ops.push({ t: 'st', id: nose, x: CX, y: CY + (o.ny || 24), sc: o.ns || 0.5, rot: 0, d: 3 });
    if (mouth) ops.push({ t: 'st', id: mouth, x: CX, y: CY + (o.my || 98), sc: o.ms || 2.1, rot: 0, d: 3 });
    return ops;
  }
  var PRESETS = [
    { id: 'classic', label: 'Classic', icon: 'face-grin-tongue', ops: function () { return face('eye-tri', 'nose-tri', 'mouth-jag'); } },
    { id: 'friendly', label: 'Friendly', icon: 'face-smile', ops: function () { return face('eye-round', 'nose-tri', 'mouth-smile', { es: 0.62, er: 0 }); } },
    { id: 'scream', label: 'Scream', icon: 'face-surprise', ops: function () { return face('eye-almond', 'nose-dots', 'mouth-o', { es: 0.85, ms: 1.6, er: 0 }); } },
    { id: 'fangs', label: 'Fangs', icon: 'face-angry', ops: function () { return face('eye-slant', 'nose-diamond', 'mouth-fangs', { es: 0.82, er: 4 }); } },
    { id: 'starry', label: 'Starry', icon: 'star', ops: function () { return face('eye-star', 'nose-heart', 'mouth-wavy', { es: 0.7, er: 0, ms: 2.3 }); } },
    { id: 'skull', label: 'Skull', icon: 'skull', ops: function () { return [{ t: 'st', id: 'skull', x: CX, y: CY + 6, sc: 2.9, rot: 0, d: 3 }]; } },
    { id: 'cat', label: 'Cat', icon: 'cat', ops: function () { return [{ t: 'st', id: 'cat', x: CX, y: CY + 8, sc: 2.9, rot: 0, d: 3 }]; } },
    { id: 'ghost', label: 'Ghost', icon: 'ghost', ops: function () { return [{ t: 'st', id: 'ghost', x: CX, y: CY + 6, sc: 3, rot: 0, d: 3 }]; } },
    { id: 'bat', label: 'Bat', icon: 'dove', ops: function () { return [{ t: 'st', id: 'bat', x: CX, y: CY + 10, sc: 3.1, rot: 0, d: 3 }]; } }
  ];
  var STICKERS = [
    { id: 'ghost', icon: 'ghost', color: '#f2f6ff' }, { id: 'spider', icon: 'spider', color: '#15101c' }, { id: 'moon', icon: 'moon', color: '#ffe27a' },
    { id: 'skull', icon: 'skull', color: '#f2f6ff' }, { id: 'hat', icon: 'hat-wizard', color: '#7b2cbf' }, { id: 'leaf', icon: 'leaf', color: '#3fae4f' },
    { id: 'star', icon: 'star', color: '#ffd24a' }, { id: 'cat', icon: 'cat', color: '#15101c' }
  ];
  var TOOLS = [
    { id: 'knife', label: 'Knife', icon: 'scissors', depth: 3, hint: 'Cuts all the way through' },
    { id: 'chisel', label: 'Chisel', icon: 'screwdriver-wrench', depth: 2, hint: 'Carves deep, glows warm' },
    { id: 'spoon', label: 'Spoon', icon: 'spoon', depth: 1, hint: 'Shaves the skin thin' },
    { id: 'marker', label: 'Marker', icon: 'pen', depth: 0, hint: 'Draw guide lines' },
    { id: 'stencil', label: 'Stencil', icon: 'stamp', depth: 3, hint: 'Pick a shape, tap the pumpkin' },
    { id: 'eraser', label: 'Eraser', icon: 'eraser', depth: 0, hint: 'Put skin back' }
  ];

  /* ---------- pure helpers ---------- */
  function simplify(points, minDist) {
    var out = [], last = null;
    points.forEach(function (p, i) {
      if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) >= minDist || i === points.length - 1) { out.push([Math.round(p[0]), Math.round(p[1])]); last = p; }
    });
    return out;
  }
  function encode(ops) {
    var slim = ops.map(function (o) {
      if (o.p) return Object.assign({}, o, { p: simplify(o.p, 4) });
      return o;
    });
    var json = JSON.stringify(slim);
    return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decode(str) {
    try {
      var b64 = str.replace(/-/g, '+').replace(/_/g, '/'); while (b64.length % 4) b64 += '=';
      var ops = JSON.parse(decodeURIComponent(escape(atob(b64))));
      return Array.isArray(ops) ? ops.filter(function (o) { return o && typeof o.t === 'string'; }).slice(0, 400) : null;
    } catch (e) { return null; }
  }

  /* ---------- mount ---------- */
  function mount(root, cfg) {
    var key = cfg.storageKey;
    var st = { tool: 'knife', size: 20, lit: true, night: true, stencil: 'eye-tri', stencilScale: 0.9, sticker: null, ops: [], redo: [] };
    var cv = h('canvas', { class: 'fxp-canvas', width: W, height: H, role: 'img', 'aria-label': 'Pumpkin carving canvas', tabindex: '0' });
    var ctx = cv.getContext('2d');
    var layers = [null, 1, 2, 3].map(function (n) { if (!n) return null; var c = document.createElement('canvas'); c.width = W; c.height = H; return c; });
    var tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
    var body = new Path2D();
    [[CX - 150, CY + 4, 78, 138], [CX + 150, CY + 4, 78, 138], [CX - 84, CY, 92, 150], [CX + 84, CY, 92, 150], [CX, CY - 2, 96, 156]].forEach(function (e) { body.ellipse(e[0], e[1], e[2], e[3], 0, 0, TAU); });
    var live = null, hover = null, ghostPos = null, flick = 1, needs = true;

    /* ----- drawing: the pumpkin itself ----- */
    function drawBase(c) {
      c.save();
      // soft shadow on the table
      var sh = c.createRadialGradient(CX, CY + 156, 10, CX, CY + 156, 230);
      sh.addColorStop(0, 'rgba(0,0,0,0.5)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = sh; c.beginPath(); c.ellipse(CX, CY + 158, 240, 34, 0, 0, TAU); c.fill();
      // lobes
      var lobes = [[CX - 150, 78, 138], [CX + 150, 78, 138], [CX - 84, 92, 150], [CX + 84, 92, 150], [CX, 96, 156]];
      lobes.forEach(function (l, i) {
        var g = c.createRadialGradient(l[0] - 18, CY - 50, 10, l[0], CY, l[2]);
        g.addColorStop(0, '#ffb04a'); g.addColorStop(0.5, '#f26a00'); g.addColorStop(1, '#8c3000');
        c.fillStyle = g; c.strokeStyle = 'rgba(80,25,0,0.55)'; c.lineWidth = 2;
        c.beginPath(); c.ellipse(l[0], i === 4 ? CY - 2 : CY + (i < 2 ? 4 : 0), l[1], l[2], 0, 0, TAU); c.fill(); c.stroke();
      });
      // rib shading
      c.strokeStyle = 'rgba(100,35,0,0.28)'; c.lineWidth = 3;
      [-150, -84, 0, 84, 150].forEach(function (dx) { c.beginPath(); c.moveTo(CX + dx * 0.92, CY - 140); c.quadraticCurveTo(CX + dx * 1.18, CY, CX + dx * 0.92, CY + 142); c.stroke(); });
      // stem
      c.fillStyle = '#5a7a24'; c.strokeStyle = '#2f4513'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(CX - 18, CY - 140); c.quadraticCurveTo(CX - 26, CY - 186, CX + 4, CY - 204); c.quadraticCurveTo(CX + 30, CY - 190, CX + 20, CY - 140); c.closePath(); c.fill(); c.stroke();
      c.restore();
    }

    /* ----- carve layers ----- */
    function carve(depth, fn) {
      [1, 2, 3].forEach(function (d) {
        var c = layers[d].getContext('2d');
        c.save(); c.clip(body);
        if (depth === d) { c.globalCompositeOperation = 'source-over'; c.fillStyle = c.strokeStyle = '#fff'; }
        else { c.globalCompositeOperation = 'destination-out'; c.fillStyle = c.strokeStyle = '#000'; }
        fn(c); c.restore();
      });
    }
    function strokePath(c, pts, w) {
      c.lineWidth = w; c.lineCap = c.lineJoin = 'round';
      c.beginPath();
      if (pts.length === 1) { c.arc(pts[0][0], pts[0][1], w / 2, 0, TAU); c.fill(); return; }
      c.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length - 1; i++) { var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; c.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); }
      c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
      c.stroke();
    }
    var inkOps = [];   // marker + stickers, redrawn on top each frame
    function applyOp(o) {
      if (o.t === 's') { var d = o.d; carve(d, function (c) { strokePath(c, o.p, o.w); }); }
      else if (o.t === 'st') {
        var p = pathOf(o.id);
        carve(o.d, function (c) { c.save(); c.translate(o.x, o.y); c.rotate((o.rot || 0) * Math.PI / 180); c.scale((o.mx ? -1 : 1) * o.sc * 1.0, o.sc * 1.0); c.translate(-50, -50); c.fill(p, 'evenodd'); c.restore(); });
      } else if (o.t === 'm' || o.t === 'k') inkOps.push(o);
      else if (o.t === 'clear') reset();
    }
    function reset() { [1, 2, 3].forEach(function (d) { layers[d].getContext('2d').clearRect(0, 0, W, H); }); inkOps = []; }
    function replay() { reset(); st.ops.forEach(function (o) { if (o.t === 'clear') { reset(); return; } applyOp(o); }); need(); }
    function need() { needs = true; if (!loop.running()) paint(0.016); }

    /* ----- compositing with the candle ----- */
    function paintLayer(n, fill) {
      var t = tmp.getContext('2d');
      t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, W, H); t.drawImage(layers[n], 0, 0);
      t.globalCompositeOperation = 'source-in'; t.fillStyle = fill; t.fillRect(0, 0, W, H);
      ctx.drawImage(tmp, 0, 0);
    }
    function paint() {
      var lit = st.lit, f = flick;
      ctx.clearRect(0, 0, W, H);
      // room glow behind the pumpkin
      if (lit) { var rg = ctx.createRadialGradient(CX, CY, 40, CX, CY, 330); rg.addColorStop(0, 'rgba(255,150,40,' + (0.28 * f).toFixed(3) + ')'); rg.addColorStop(1, 'rgba(255,150,40,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); }
      drawBase(ctx);
      if (lit && st.night) { ctx.save(); ctx.clip(body); ctx.fillStyle = 'rgba(20,6,0,0.34)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      // shaved skin: thin and pale
      paintLayer(1, lit ? 'rgba(255,205,120,' + (0.55 * f).toFixed(2) + ')' : 'rgba(255,214,150,0.5)');
      // deep carve: warm glow when lit, dark flesh when not
      var g2 = ctx.createRadialGradient(CX, CY, 20, CX, CY, 220);
      if (lit) { g2.addColorStop(0, 'rgba(255,196,64,' + Math.min(1, 0.95 * f).toFixed(2) + ')'); g2.addColorStop(1, 'rgba(255,120,10,' + Math.min(1, 0.82 * f).toFixed(2) + ')'); }
      else { g2.addColorStop(0, '#9a4a14'); g2.addColorStop(1, '#6c2e08'); }
      paintLayer(2, g2);
      // cut through: the candle shows
      var g3 = ctx.createRadialGradient(CX, CY + 20, 10, CX, CY + 20, 200);
      if (lit) { g3.addColorStop(0, 'rgba(255,250,214,' + Math.min(1, f).toFixed(2) + ')'); g3.addColorStop(0.6, 'rgba(255,214,90,' + Math.min(1, f).toFixed(2) + ')'); g3.addColorStop(1, 'rgba(255,160,30,' + Math.min(1, f).toFixed(2) + ')'); }
      else { g3.addColorStop(0, '#120600'); g3.addColorStop(1, '#241000'); }
      paintLayer(3, g3);
      // bloom around the cut-through parts
      if (lit && typeof ctx.filter === 'string') {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(10px)'; ctx.globalAlpha = 0.5 * f; ctx.drawImage(layers[3], 0, 0); ctx.restore();
      }
      // ink and stickers
      inkOps.forEach(function (o) {
        if (o.t === 'm') { ctx.save(); ctx.strokeStyle = 'rgba(25,10,4,0.85)'; ctx.fillStyle = ctx.strokeStyle; strokePath(ctx, o.p, o.w); ctx.restore(); }
        else if (o.t === 'k') drawSticker(ctx, o);
      });
      // live stroke preview
      if (live && live.p.length) {
        ctx.save(); ctx.clip(body);
        if (live.tool === 'marker') { ctx.strokeStyle = ctx.fillStyle = 'rgba(25,10,4,0.85)'; }
        else if (live.tool === 'eraser') { ctx.strokeStyle = ctx.fillStyle = 'rgba(255,255,255,0.35)'; }
        else { ctx.strokeStyle = ctx.fillStyle = live.d === 3 ? 'rgba(255,240,170,0.95)' : live.d === 2 ? 'rgba(255,170,50,0.9)' : 'rgba(255,215,140,0.7)'; }
        strokePath(ctx, live.p, live.w); ctx.restore();
      }
      // stencil ghost under the pointer
      if (st.tool === 'stencil' && ghostPos) {
        ctx.save(); ctx.translate(ghostPos[0], ghostPos[1]); ctx.rotate(0); ctx.scale(st.stencilScale, st.stencilScale); ctx.translate(-50, -50);
        ctx.globalAlpha = 0.55; ctx.fillStyle = '#ffe9a0'; ctx.fill(pathOf(st.stencil), 'evenodd'); ctx.restore();
      }
      needs = false;
    }
    function drawSticker(c, o) {
      var ch = glyph(o.g);
      if (!ch) return;
      var s = STICKERS.filter(function (x) { return x.id === o.g; })[0];
      c.save(); c.translate(o.x, o.y); c.rotate((o.rot || 0) * Math.PI / 180);
      c.font = '900 ' + Math.round(54 * (o.sc || 1)) + 'px "Font Awesome 6 Free"';
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = 'rgba(0,0,0,0.55)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
      c.fillStyle = s ? s.color : '#fff'; c.fillText(ch, 0, 0); c.restore();
    }
    var glyphCache = {};
    function glyph(name) {
      var ic = STICKERS.filter(function (x) { return x.id === name; })[0]; if (!ic) return '';
      if (glyphCache[name]) return glyphCache[name];
      var i = document.createElement('i'); i.className = 'fa-solid fa-' + ic.icon; i.style.cssText = 'position:absolute;visibility:hidden'; document.body.appendChild(i);
      var c = global.getComputedStyle(i, '::before').content; i.remove();
      c = c && c !== 'none' && c !== 'normal' ? c.replace(/^["']|["']$/g, '') : '';
      if (c) glyphCache[name] = c; return c;
    }

    var loop = F.motion.loop(function (dt, t) {
      flick = st.lit ? 0.9 + 0.08 * Math.sin(t / 110) + 0.05 * Math.sin(t / 47 + 1.3) + (Math.random() - 0.5) * 0.04 : 1;
      paint();
    });

    /* ----- input ----- */
    function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height)]; }
    function tool() { return TOOLS.filter(function (t) { return t.id === st.tool; })[0]; }
    function commit(op) { st.ops.push(op); st.redo = []; applyOp(op); need(); syncButtons(); }
    cv.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button > 0) return;
      cv.setPointerCapture(e.pointerId); var p = pos(e);
      if (st.tool === 'stencil') { commit({ t: 'st', id: st.stencil, x: Math.round(p[0]), y: Math.round(p[1]), sc: +st.stencilScale.toFixed(2), rot: st.rot || 0, d: 3 }); F.audio.blip(300, 40, 'triangle', 0.04); return; }
      if (st.sticker) { commit({ t: 'k', g: st.sticker, x: Math.round(p[0]), y: Math.round(p[1]), sc: 1, rot: Math.round((Math.random() - 0.5) * 30) }); F.audio.blip(660, 50, 'sine', 0.04); return; }
      var tl = tool();
      live = { tool: st.tool, d: st.tool === 'eraser' ? 0 : tl.depth, w: st.tool === 'spoon' ? st.size * 1.6 : st.size, p: [p] };
      F.audio.blip(180, 30, 'sawtooth', 0.02); need();
    });
    cv.addEventListener('pointermove', function (e) {
      var p = pos(e);
      if (live) { var last = live.p[live.p.length - 1]; if (Math.hypot(p[0] - last[0], p[1] - last[1]) > 2.5) { live.p.push(p); need(); } }
      else if (st.tool === 'stencil') { ghostPos = p; need(); }
    });
    function endStroke() {
      if (!live) return;
      var pts = live.p.map(function (q) { return [Math.round(q[0]), Math.round(q[1])]; });
      var op = live.tool === 'marker' ? { t: 'm', w: live.w, p: pts } : { t: 's', d: live.d, w: Math.round(live.w), p: pts };
      live = null; commit(op);
    }
    cv.addEventListener('pointerup', endStroke); cv.addEventListener('pointercancel', endStroke);
    cv.addEventListener('pointerleave', function () { ghostPos = null; if (st.tool === 'stencil') need(); });

    /* ----- UI ----- */
    var toolBtns = {}, toolbar = h('div', { class: 'fxp-tools', role: 'toolbar', 'aria-label': 'Carving tools' });
    TOOLS.forEach(function (t) {
      var b = h('button', { class: 'fxp-tool', type: 'button', title: t.hint, 'aria-pressed': 'false', onclick: function () { st.tool = t.id; st.sticker = null; syncTools(); need(); } }, h('i', { class: 'fa-solid fa-' + t.icon }), h('span', null, t.label));
      toolBtns[t.id] = b; toolbar.appendChild(b);
    });
    var stickerBox = h('div', { class: 'fxp-stickers', 'aria-label': 'Stickers' });
    STICKERS.forEach(function (s) {
      stickerBox.appendChild(h('button', { class: 'fxp-sticker', type: 'button', 'data-id': s.id, 'aria-label': 'Sticker: ' + s.id, 'aria-pressed': 'false', onclick: function () { st.sticker = st.sticker === s.id ? null : s.id; syncTools(); } }, h('i', { class: 'fa-solid fa-' + s.icon, style: { color: s.color === '#15101c' ? '#c9b8e6' : s.color } })));
    });
    var sizeIn = h('input', { class: 'fx-range', type: 'range', min: '6', max: '48', value: String(st.size), 'aria-label': 'Brush size' });
    var scaleIn = h('input', { class: 'fx-range', type: 'range', min: '0.4', max: '3.2', step: '0.05', value: String(st.stencilScale), 'aria-label': 'Stencil size' });
    var undoBtn = h('button', { class: 'fx-circle-btn', type: 'button', 'aria-label': 'Undo', onclick: undo }, h('i', { class: 'fa-solid fa-rotate-left' }));
    var redoBtn = h('button', { class: 'fx-circle-btn', type: 'button', 'aria-label': 'Redo', onclick: redo }, h('i', { class: 'fa-solid fa-rotate-right' }));
    var candleBtn = h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm', type: 'button', 'aria-pressed': 'true' }, h('i', { class: 'fa-solid fa-fire-flame-curved' }), 'Candle');
    var nightBtn = h('button', { class: 'fx-btn fx-btn--ghost fx-btn--sm', type: 'button', 'aria-pressed': 'true' }, h('i', { class: 'fa-solid fa-moon' }), 'Dim');
    var presetRow = h('div', { class: 'fx-tiles' });
    PRESETS.forEach(function (p) { presetRow.appendChild(h('button', { class: 'fx-tile', type: 'button', onclick: function () { applyPreset(p); } }, h('i', { class: 'fa-solid fa-' + p.icon }), h('span', null, p.label))); });
    presetRow.appendChild(h('button', { class: 'fx-tile', type: 'button', onclick: randomFace }, h('i', { class: 'fa-solid fa-shuffle' }), h('span', null, 'Random')));
    var partTabs = h('div', { class: 'fx-pills fx-pills--scroll' }), partGrid = h('div', { class: 'fxp-parts' });
    var group = 'eyes';
    function renderParts() {
      partTabs.innerHTML = ''; partGrid.innerHTML = '';
      [['eyes', 'Eyes'], ['noses', 'Noses'], ['mouths', 'Mouths'], ['shapes', 'Shapes']].forEach(function (g) { partTabs.appendChild(h('button', { class: 'fx-pill' + (group === g[0] ? ' is-active' : ''), type: 'button', onclick: function () { group = g[0]; renderParts(); } }, g[1])); });
      STENCILS[group].forEach(function (s) {
        var thumb = document.createElement('canvas'); thumb.width = thumb.height = 56;
        var tc = thumb.getContext('2d'); tc.fillStyle = '#ffd98a'; tc.save(); tc.scale(0.5, 0.5); tc.translate(6, 6); tc.fill(pathOf(s.id), 'evenodd'); tc.restore();
        partGrid.appendChild(h('button', { class: 'fxp-part' + (st.stencil === s.id ? ' is-on' : ''), type: 'button', 'aria-label': s.id.replace('-', ' '), 'aria-pressed': String(st.stencil === s.id), onclick: function () { st.stencil = s.id; st.tool = 'stencil'; st.sticker = null; syncTools(); renderParts(); need(); } }, thumb));
      });
    }
    function syncTools() {
      TOOLS.forEach(function (t) { var on = st.tool === t.id && !st.sticker; toolBtns[t.id].classList.toggle('is-on', on); toolBtns[t.id].setAttribute('aria-pressed', String(on)); });
      stickerBox.querySelectorAll('.fxp-sticker').forEach(function (b) { var on = st.sticker === b.getAttribute('data-id'); b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
      cv.style.cursor = st.tool === 'stencil' || st.sticker ? 'copy' : 'crosshair';
      scaleWrap.hidden = st.tool !== 'stencil';
      sizeWrap.hidden = st.tool === 'stencil' || !!st.sticker;
    }
    function syncButtons() { undoBtn.disabled = !st.ops.length; redoBtn.disabled = !st.redo.length; }
    function undo() { if (!st.ops.length) return; st.redo.push(st.ops.pop()); replay(); syncButtons(); }
    function redo() { if (!st.redo.length) return; st.ops.push(st.redo.pop()); replay(); syncButtons(); }
    function applyPreset(p) { st.ops.push({ t: 'clear' }); p.ops().forEach(function (o) { st.ops.push(o); }); st.redo = []; replay(); syncButtons(); F.audio.chord([392, 523], 140); }
    function randomFace() {
      function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
      var eye = pick(STENCILS.eyes).id, nose = Math.random() < 0.85 ? pick(STENCILS.noses).id : null, mouth = pick(STENCILS.mouths).id;
      st.ops.push({ t: 'clear' }); face(eye, nose, mouth, { es: 0.6 + Math.random() * 0.3, er: Math.round(Math.random() * 14) }).forEach(function (o) { st.ops.push(o); }); st.redo = []; replay(); syncButtons();
    }
    candleBtn.addEventListener('click', function () { st.lit = !st.lit; candleBtn.setAttribute('aria-pressed', String(st.lit)); if (st.lit) loop.start(); else { loop.stop(); flick = 1; } need(); });
    nightBtn.addEventListener('click', function () { st.night = !st.night; nightBtn.setAttribute('aria-pressed', String(st.night)); need(); });
    sizeIn.addEventListener('input', function () { st.size = +sizeIn.value; });
    scaleIn.addEventListener('input', function () { st.stencilScale = +scaleIn.value; need(); });
    var sizeWrap = h('label', { class: 'fxp-slider' }, h('span', null, 'Size'), sizeIn);
    var scaleWrap = h('label', { class: 'fxp-slider', hidden: '' }, h('span', null, 'Size'), scaleIn);

    /* export / share / gallery */
    function exportPng() {
      cv.toBlob(function (blob) {
        if (!blob) { F.ui.toast('Could not export', { kind: 'warn' }); return; }
        var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-pumpkin.png';
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        F.ui.toast('Pumpkin saved to your downloads');
      }, 'image/png');
    }
    function shareLink() {
      var code = encode(st.ops);
      if (code.length > 7000) { F.ui.toast('Too detailed for a link. Save it as a picture.', { kind: 'warn' }); return; }
      var url = (location.origin && location.origin !== 'null' ? location.origin + location.pathname : location.href.split('#')[0]) + '#d=' + code;
      try { history.replaceState(null, '', '#d=' + code); } catch (e) { /* file:// */ }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { F.ui.toast('Link copied'); }, function () { F.ui.toast('Link is in the address bar'); });
      else F.ui.toast('Link is in the address bar');
    }
    var gallery = F.store.get(key + '_gallery', []), galRow = h('div', { class: 'fx-hscroll fxp-gallery' });
    function saveGallery() {
      var th = document.createElement('canvas'); th.width = 160; th.height = 150; var tc = th.getContext('2d');
      tc.fillStyle = '#150d22'; tc.fillRect(0, 0, 160, 150); tc.drawImage(cv, 0, 0, W, H, 0, 0, 160, 150);
      gallery.unshift({ ts: Date.now(), ops: st.ops.slice(), thumb: th.toDataURL('image/jpeg', 0.7) }); gallery = gallery.slice(0, 8);
      F.store.set(key + '_gallery', gallery); renderGallery(); F.ui.toast('Added to your gallery');
    }
    function renderGallery() {
      galRow.innerHTML = '';
      if (!gallery.length) { galRow.appendChild(h('p', { class: 'fx-muted' }, 'Finished pumpkins appear here.')); return; }
      gallery.forEach(function (g, i) {
        galRow.appendChild(h('div', { class: 'fxp-gal' }, h('button', { class: 'fxp-galbtn', type: 'button', 'aria-label': 'Open pumpkin ' + (i + 1), onclick: function () { st.ops = g.ops.slice(); st.redo = []; replay(); syncButtons(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }, h('img', { src: g.thumb, alt: '' })),
          h('button', { class: 'fx-circle-btn fxp-galdel', type: 'button', 'aria-label': 'Delete', onclick: function () { gallery.splice(i, 1); F.store.set(key + '_gallery', gallery); renderGallery(); } }, '×')));
      });
    }

    var stage = h('div', { class: 'fxp-stage' }, cv);
    var bottom = h('div', { class: 'fxp-bottom' }, sizeWrap, scaleWrap, h('div', { class: 'fx-row' }, undoBtn, redoBtn, candleBtn, nightBtn));
    var actions = h('div', { class: 'fx-row fxp-actions' },
      h('button', { class: 'fx-btn', type: 'button', onclick: function () { saveGallery(); exportPng(); } }, h('i', { class: 'fa-solid fa-flag-checkered' }), 'Finish'),
      h('button', { class: 'fx-btn fx-btn--ghost', type: 'button', onclick: exportPng }, h('i', { class: 'fa-solid fa-download' }), 'Picture'),
      h('button', { class: 'fx-btn fx-btn--ghost', type: 'button', onclick: shareLink }, h('i', { class: 'fa-solid fa-link' }), 'Link'),
      h('button', { class: 'fx-btn fx-btn--ghost', type: 'button', onclick: function () { st.ops.push({ t: 'clear' }); st.redo = []; replay(); syncButtons(); } }, h('i', { class: 'fa-solid fa-trash-can' }), 'Clear'));
    root.appendChild(h('div', { class: 'fxp' },
      h('div', { class: 'fxp-main' }, toolbar, stage, stickerBox), bottom, actions,
      h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'Faces'), presetRow),
      h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'Stencils'), partTabs, partGrid),
      h('section', { class: 'fx-sec' }, h('h2', { class: 'fx-sec-title' }, 'Gallery'), galRow)));
    if (F.shell && F.shell.setAction) F.shell.setAction({ icon: 'shuffle', label: 'Random face', onclick: randomFace });

    // load a shared design, or start with a classic face
    var m = /[#&]d=([^&]+)/.exec(location.hash || '');
    var shared = m && decode(m[1]);
    if (shared && shared.length) st.ops = shared; else st.ops = PRESETS[0].ops().slice();
    renderParts(); renderGallery(); syncTools(); syncButtons();
    if (document.fonts && document.fonts.load) document.fonts.load('900 16px "Font Awesome 6 Free"').then(function () { need(); }, function () {});
    replay(); loop.start();
    return { state: st, undo: undo, redo: redo, replay: replay };
  }

  global.FestoPumpkin = { mount: mount, _pure: { simplify: simplify, encode: encode, decode: decode, STENCILS: STENCILS, PRESETS: PRESETS } };
})(window);
