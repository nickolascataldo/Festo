/* ==========================================================================
   FESTO LUXE · shared atmosphere for the Christmas, Summer and Spring editions
   (Halloween keeps its own gothic layer in shared/themes/halloween-gothic.*)
   A season file (shared/luxe/<season>.js) registers its art in FestoLuxe.seasons[id]:
     sprite    SVG <symbol>s (medallions, ornaments)       backdrop  inline SVG scene behind the page
     medals    four symbol ids for the frame corners       art       corner / vine / rule SVGs -> CSS custom properties
     particles 'snow' | 'petals' | 'motes'
   This file paints them: a backdrop, a grain veil, the frame and a particle canvas.
   Pure decoration: aria-hidden, pointer-events none, paused when hidden, skipped under reduced motion.
   ========================================================================== */
(function (global) {
  'use strict';
  var doc = document, root = doc.documentElement;
  var L = global.FestoLuxe = global.FestoLuxe || { seasons: {} };
  L.seasons = L.seasons || {};
  var reduced = global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function svgUrl(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/%20/g, ' ').replace(/%3D/g, '=').replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%2C/g, ',') + '")'; }
  L.svgUrl = svgUrl;

  /* corner art is drawn once in a 60x60 box and mirrored into the four corners */
  function corners(body, defs) {
    var T = { tl: '', tr: 'matrix(-1 0 0 1 60 0)', bl: 'matrix(1 0 0 -1 0 60)', br: 'matrix(-1 0 0 -1 60 60)' };
    Object.keys(T).forEach(function (k) {
      var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='-2 -2 64 64'>" + (defs || '') + '<g' + (T[k] ? " transform='" + T[k] + "'" : '') + '>' + body + '</g></svg>';
      root.style.setProperty('--lx-fil-' + k, svgUrl(svg));
    });
  }

  L.paintArt = function (S) {
    var a = S.art || {};
    if (a.corner) corners(a.corner, a.defs);
    if (a.vine) root.style.setProperty('--lx-vine', svgUrl(a.vine));
    if (a.rule) root.style.setProperty('--lx-rule', svgUrl(a.rule));
    if (a.extra) Object.keys(a.extra).forEach(function (k) { root.style.setProperty(k, svgUrl(a.extra[k])); });
  };

  L.atmos = function (id) {
    if (root.getAttribute('data-lx-ready')) return;
    var S = L.seasons[id]; if (!S) return;
    root.setAttribute('data-lx-ready', '1');
    L.paintArt(S);
    var b = doc.body, m = S.medals || [];
    b.insertAdjacentHTML('afterbegin', '<svg class="lx-sprite" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + (S.sprite || '') + '</defs></svg>' +
      '<div class="lx-back" aria-hidden="true">' + (S.backdrop || '') + '<div class="lx-vig"></div></div><div class="lx-veil" aria-hidden="true"></div>');
    b.insertAdjacentHTML('beforeend', '<div class="lx-frame" aria-hidden="true"><div class="rail"></div><div class="vine l"></div><div class="vine r"></div>' +
      ['tl', 'tr', 'bl', 'br'].map(function (p, i) { return m[i] ? '<svg class="medal ' + p + '"><use href="#' + m[i] + '"/></svg>' : ''; }).join('') +
      '</div><canvas id="lx-fx" aria-hidden="true"></canvas>');
    if (!reduced && S.particles) particles(doc.getElementById('lx-fx'), S.particles);
  };

  /* ---------- particle field ---------- */
  function particles(cv, kind) {
    var ctx = cv.getContext('2d'), P = [], DPR = Math.min(2, global.devicePixelRatio || 1), last = 0, sprites = [];
    function mk(size, draw) { var c = doc.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size); return c; }
    if (kind === 'snow') {
      sprites.push(mk(32, function (x, s) { var g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(240,248,255,.85)'); g.addColorStop(1, 'rgba(220,235,255,0)'); x.fillStyle = g; x.fillRect(0, 0, s, s); }));
      sprites.push(mk(32, function (x, s) { x.translate(s / 2, s / 2); x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 1.6; x.lineCap = 'round'; for (var i = 0; i < 6; i++) { x.rotate(Math.PI / 3); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -13); x.moveTo(0, -7); x.lineTo(-4, -10); x.moveTo(0, -7); x.lineTo(4, -10); x.stroke(); } }));
    } else if (kind === 'petals') {
      [['#ffd6e2', '#f49ab4'], ['#fff0f4', '#f7b6c8'], ['#ffe2ea', '#e98aa6']].forEach(function (c) {
        sprites.push(mk(40, function (x, s) {
          var g = x.createLinearGradient(0, 0, s, s); g.addColorStop(0, c[0]); g.addColorStop(1, c[1]);
          x.fillStyle = g; x.beginPath(); x.moveTo(s * .5, s * .06); x.bezierCurveTo(s * .95, s * .25, s * .9, s * .8, s * .5, s * .95); x.bezierCurveTo(s * .1, s * .8, s * .05, s * .25, s * .5, s * .06);
          x.fill(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.moveTo(s * .42, s * .02); x.lineTo(s * .5, s * .16); x.lineTo(s * .58, s * .02); x.fill();
          x.globalCompositeOperation = 'source-over'; x.strokeStyle = 'rgba(214,90,130,.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(s * .5, s * .2); x.lineTo(s * .5, s * .85); x.stroke();
        }));
      });
    } else {
      sprites.push(mk(48, function (x, s) { var g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, 'rgba(255,248,220,.95)'); g.addColorStop(.3, 'rgba(255,214,140,.55)'); g.addColorStop(.7, 'rgba(255,170,90,.14)'); g.addColorStop(1, 'rgba(255,150,80,0)'); x.fillStyle = g; x.fillRect(0, 0, s, s); }));
      sprites.push(mk(32, function (x, s) { x.translate(s / 2, s / 2); var g = x.createRadialGradient(0, 0, 0, 0, 0, s / 2); g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(1, 'rgba(255,230,160,0)'); x.fillStyle = g; x.beginPath(); for (var i = 0; i < 4; i++) { x.rotate(Math.PI / 2); x.quadraticCurveTo(1.6, 1.6, 0, s / 2); x.quadraticCurveTo(-1.6, 1.6, 0, 0); } x.fill(); }));
    }
    function spawn(W, H, init) {
      var r = Math.random(), d = .35 + Math.random() * .65;
      if (kind === 'snow') return { x: Math.random() * W, y: init ? Math.random() * H : -20 * DPR, d: d, s: (1.5 + d * d * 6) * DPR * (Math.random() < .12 ? 1.6 : 1), vy: (14 + d * 46) * DPR, w: Math.random() * 6.3, spr: Math.random() < .14 ? 1 : 0, rot: Math.random() * 6.3, a: .35 + d * .6 };
      if (kind === 'petals') return { x: init ? Math.random() * W : -30 * DPR + Math.random() * W * .6, y: init ? Math.random() * H : -30 * DPR, d: d, s: (5 + d * 8) * DPR, vy: (18 + d * 30) * DPR, vx: (12 + d * 26) * DPR, w: Math.random() * 6.3, spr: Math.floor(r * 3), rot: Math.random() * 6.3, vr: (Math.random() - .5) * 2.4, a: .55 + d * .45 };
      var sparkle = Math.random() < .18;
      return { x: Math.random() * W, y: init ? Math.random() * H : H + 20 * DPR, d: d, s: (sparkle ? 4 + d * 5 : 6 + d * 18) * DPR, vy: -(6 + d * 14) * DPR, w: Math.random() * 6.3, spr: sparkle ? 1 : 0, life: 0, max: 6 + Math.random() * 8, a: sparkle ? .9 : .25 + d * .4 };
    }
    function frame(t) {
      requestAnimationFrame(frame);
      if (doc.hidden) { last = t; return; }
      var dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
      var W = Math.round(cv.clientWidth * DPR), H = Math.round(cv.clientHeight * DPR);
      if (!W || !H) return;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; P.length = 0; P.started = false; }
      ctx.clearRect(0, 0, W, H);
      var want = kind === 'snow' ? Math.min(150, Math.round(40 + W / DPR / 12)) : kind === 'petals' ? Math.min(44, Math.round(12 + W / DPR / 40)) : Math.min(46, Math.round(16 + W / DPR / 40));
      while (P.length < want) P.push(spawn(W, H, P.length < want * .9 && !P.started));
      P.started = true;
      if (kind === 'motes') ctx.globalCompositeOperation = 'lighter';
      for (var i = P.length - 1; i >= 0; i--) {
        var p = P[i], tt = t / 1000;
        if (kind === 'snow') {
          p.y += p.vy * dt; p.x += Math.sin(tt * .8 + p.w) * 18 * p.d * dt * DPR + 6 * DPR * dt; p.rot += dt * .4;
          if (p.y > H + 20 * DPR) { P.splice(i, 1); continue; }
          ctx.globalAlpha = p.a;
          if (p.spr) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.drawImage(sprites[1], -p.s * 1.4, -p.s * 1.4, p.s * 2.8, p.s * 2.8); ctx.restore(); }
          else ctx.drawImage(sprites[0], p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
        } else if (kind === 'petals') {
          p.y += p.vy * dt; p.x += (p.vx + Math.sin(tt * 1.3 + p.w) * 24 * DPR) * dt; p.rot += p.vr * dt;
          if (p.y > H + 30 * DPR || p.x > W + 40 * DPR) { P.splice(i, 1); continue; }
          ctx.globalAlpha = p.a; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(Math.cos(tt * 2.2 + p.w), 1);
          ctx.drawImage(sprites[p.spr], -p.s, -p.s, p.s * 2, p.s * 2); ctx.restore();
        } else {
          p.life += dt; p.y += p.vy * dt; p.x += Math.sin(tt * .6 + p.w) * 10 * DPR * dt;
          if (p.life > p.max || p.y < -30 * DPR) { P.splice(i, 1); continue; }
          var fade = Math.sin(Math.PI * p.life / p.max);
          ctx.globalAlpha = Math.max(0, p.a * fade * (p.spr ? (.4 + .6 * Math.abs(Math.sin(tt * 3 + p.w))) : 1));
          ctx.drawImage(sprites[p.spr], p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
        }
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    requestAnimationFrame(frame);
  }

  /* pages declare their season on <html data-season>; the landing calls FestoLuxe.atmos itself */
  function auto() { if (root.classList.contains('lx') && !root.classList.contains('lx-landing')) L.atmos(root.getAttribute('data-season')); }
  if (doc.body) auto(); else doc.addEventListener('DOMContentLoaded', auto);
})(window);
