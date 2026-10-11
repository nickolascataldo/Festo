/* ==========================================================================
   SPRING HAVEN · landing config for shared/luxe/luxe-landing.js
   Books and films are real entries from Spring Reads and the Cinema data; the birdcage stations are synthesized;
   the meadow sky and the four wallpapers are painted on canvas.
   ========================================================================== */
(function (global) {
  'use strict';
  var S = global.FestoLuxe.seasons.spring;

  /* ---------- header: a flowering bough ---------- */
  function arch() {
    var s = '<svg viewBox="0 0 390 96"><path d="M8 30 C 70 14 130 40 195 26 C 260 12 320 40 382 28" stroke="#6a4a32" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M60 26 C 66 16 74 14 80 12 M140 32 C 146 42 150 46 160 48 M250 22 C 256 12 262 10 272 8 M320 34 C 326 44 334 46 342 48" stroke="#6a4a32" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
    [[34, 22, .5], [80, 12, .42], [112, 34, .55], [160, 48, .4], [232, 18, .48], [272, 8, .4], [300, 32, .55], [342, 48, .42], [370, 26, .46]].forEach(function (f, i) {
      s += '<g class="bloom" style="animation-delay:-' + (i * .4).toFixed(1) + 's;transform-origin:' + f[0] + 'px ' + f[1] + 'px"><use href="#sp-flower" x="' + (f[0] - 22 * f[2]) + '" y="' + (f[1] - 22 * f[2]) + '" width="' + (44 * f[2]) + '" height="' + (44 * f[2]) + '"/></g>'; });
    [[50, 30, -20], [96, 30, 30], [130, 34, -40], [210, 24, 20], [286, 26, -30], [330, 36, 40]].forEach(function (l) { s += '<path d="M' + l[0] + ' ' + l[1] + ' c 5 -8 13 -8 15 -4 c -4 6 -10 7 -15 4z" transform="rotate(' + l[2] + ' ' + l[0] + ' ' + l[1] + ')" fill="url(#spLeaf)"/>'; });
    return s + '<use href="#sp-bloom" x="169" y="20" width="52" height="52"/></svg>';
  }

  /* ---------- the gilded birdcage ---------- */
  var bars = ''; for (var i = 0; i < 9; i++) { var x = 30 + i * 17.5; bars += '<path d="M' + x + ' 150 V70 Q' + x + ' ' + (32 + Math.abs(i - 4) * 4) + ' 100 22" stroke="url(#spGold)" stroke-width="1.6" fill="none"/>'; }
  var DEVICE = '<div class="cage"><svg viewBox="0 0 200 170" aria-hidden="true"><defs><radialGradient id="bcBird" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#bfe0ff"/><stop offset=".6" stop-color="#5a9ad8"/><stop offset="1" stop-color="#2a5a9a"/></radialGradient>' +
    '<radialGradient id="bcBreast" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#ffd2a6"/><stop offset="1" stop-color="#e98a4a"/></radialGradient></defs>' +
    '<ellipse cx="100" cy="158" rx="80" ry="8" fill="#000" opacity=".12"/>' + bars +
    '<path d="M22 150 H178" stroke="url(#spGold)" stroke-width="6" stroke-linecap="round"/><path d="M30 70 H170" stroke="url(#spGold)" stroke-width="2"/><path d="M100 22 v-10" stroke="url(#spGold)" stroke-width="2"/><circle cx="100" cy="9" r="5" fill="none" stroke="url(#spGold)" stroke-width="2"/>' +
    '<path d="M44 112 H156" stroke="#8a6a3a" stroke-width="3" stroke-linecap="round"/>' +
    '<g class="bird"><path d="M120 104 C 132 100 142 98 150 92 C 146 104 136 108 124 110z" fill="#2a5a9a"/><ellipse cx="102" cy="98" rx="20" ry="15" fill="url(#bcBird)"/><path d="M86 94 C 86 106 94 112 104 112 C 96 106 94 98 96 90z" fill="url(#bcBreast)"/>' +
      '<g class="head"><circle cx="88" cy="82" r="10.5" fill="url(#bcBird)"/><path class="beak" d="M78 81 L 70 84 L 78 86z" fill="#f2b43a"/><circle cx="85" cy="80" r="1.9" fill="#121a24"/><circle cx="84.4" cy="79.4" r=".6" fill="#fff"/></g>' +
      '<path d="M104 92 C 114 88 124 92 128 98 C 118 100 110 98 104 92z" fill="#3a74b8"/><path d="M98 112 v4 M106 112 v4" stroke="#8a5a2a" stroke-width="1.6"/></g>' +
    '<g class="notes" fill="#c45478"><path d="M54 60 v-12 l8 -2 v12" stroke="#c45478" stroke-width="1.4" fill="none"/><circle cx="52" cy="60" r="2.6"/><circle cx="60" cy="58" r="2.6"/><path d="M146 52 v-10" stroke="#4f8a4c" stroke-width="1.4"/><circle cx="144" cy="52" r="2.6" fill="#4f8a4c"/></g>' +
    '<g transform="translate(16 128)"><use href="#sp-sprig" width="40" height="40"/></g><g transform="translate(184 128) scale(-1 1)"><use href="#sp-sprig" width="40" height="40"/></g></svg></div>';

  var SHOP = [
    { b: 'Clothing', s: 'Rain gear & sun hats', svg: '<svg viewBox="0 0 34 40"><path d="M9 6h8v22l6 2c3 1 4 3 4 6H5V6z" fill="#e8b84a" stroke="#9a7420"/><path d="M5 30h22" stroke="#9a7420"/><path d="M9 6h8" stroke="#fff" stroke-width="2"/><circle cx="9" cy="16" r="1.4" fill="#fff"/><circle cx="13" cy="20" r="1.4" fill="#fff"/></svg>' },
    { b: 'Crafts', s: 'Press, paint & stitch', svg: '<svg viewBox="0 0 34 40"><path d="M17 6C8 6 3 12 3 19c0 8 7 13 13 13 3 0 3-3 1-5-1-2 1-4 4-4h4c4 0 6-3 6-6 0-6-6-11-14-11z" fill="#fbf4e4" stroke="#8a7a5a"/><circle cx="10" cy="15" r="2.4" fill="#e8506f"/><circle cx="16" cy="11" r="2.4" fill="#f6b93b"/><circle cx="23" cy="13" r="2.4" fill="#5a9ad8"/><circle cx="9" cy="22" r="2.4" fill="#4f8a4c"/></svg>' },
    { b: 'Decoration', s: 'Planters & wreaths', svg: '<svg viewBox="0 0 34 40"><path d="M17 22V8" stroke="#4f8a4c" stroke-width="1.8"/><path d="M17 14C11 14 8 9 9 5c5 0 8 4 8 9zM17 12c5 0 8-4 8-8-5 0-8 3-8 8z" fill="#7ab86a"/><path d="M6 22h22l-3 14H9z" fill="#d9774a" stroke="#9a4a20"/><path d="M5 22h24v4H5z" fill="#e98a5a" stroke="#9a4a20"/></svg>' },
    { b: 'Food', s: 'Bakes & tea-table treats', svg: '<svg viewBox="0 0 34 40"><path d="M5 18h20v8a7 7 0 0 1-7 7h-6a7 7 0 0 1-7-7z" fill="#fff" stroke="#8fae8a"/><path d="M25 20h2a3.4 3.4 0 0 1 0 7h-2" stroke="#8fae8a" stroke-width="1.6" fill="none"/><path d="M8 24c3 2 9 2 14 0" stroke="#f4a6bf" stroke-width="1.6" fill="none"/><path d="M2 34h28" stroke="#8fae8a" stroke-width="1.6"/><path d="M11 14c-2-3 2-4 0-7M17 14c-2-3 2-4 0-7" stroke="#c9b6a0" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>' }
  ];

  var BLUEBIRD = '<svg viewBox="0 0 100 100"><defs><radialGradient id="bbBody" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#9ccaf6"/><stop offset=".6" stop-color="#4a8ad0"/><stop offset="1" stop-color="#22558f"/></radialGradient><radialGradient id="bbBreast" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#ffd9b0"/><stop offset="1" stop-color="#e8894a"/></radialGradient></defs>' +
    '<path d="M10 90 C 40 84 70 84 100 76" stroke="#6a4a32" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
    '<g transform="translate(14 70) scale(.5)"><use href="#sp-flower" width="44" height="44"/></g><g transform="translate(70 62) scale(.44)"><use href="#sp-flower" width="44" height="44"/></g><path d="M40 86 c 5 -8 13 -8 15 -4 c -4 6 -10 7 -15 4z" fill="url(#spLeaf)"/>' +
    '<path d="M68 58 C 80 54 88 50 96 44 C 92 56 82 62 72 66z" fill="#22558f"/>' +
    '<ellipse cx="54" cy="60" rx="21" ry="17" fill="url(#bbBody)"/><path d="M36 54 C 36 68 46 78 58 78 C 50 72 46 62 46 52z" fill="url(#bbBreast)"/>' +
    '<circle cx="40" cy="43" r="12" fill="url(#bbBody)"/><path d="M29 42 L 19 45 L 29 47z" fill="#3a2a1a"/><g class="eye"><circle cx="36" cy="40" r="2.2" fill="#0e1620"/><circle cx="35.4" cy="39.4" r=".7" fill="#fff"/></g>' +
    '<path d="M56 56 C 66 52 74 56 76 64 C 68 66 60 62 56 56z" fill="#3a74b8"/><path d="M50 77l-2 10M58 77l1 10" stroke="#6a4a2a" stroke-width="1.6" stroke-linecap="round"/></svg>';

  /* ---------- sky: a meadow from dawn to dusk ---------- */
  function meadow(ctx, W, H, t, info, D) {
    var f = info.frac, day = info.day, hz = H * .66, golden = day && (f < .12 || f > .88);
    var sky = ctx.createLinearGradient(0, 0, 0, hz);
    if (!day) { sky.addColorStop(0, '#1a2a4a'); sky.addColorStop(1, '#5a6a8a'); } else if (golden) { sky.addColorStop(0, '#a8c8e0'); sky.addColorStop(.6, '#fbd9c4'); sky.addColorStop(1, '#ffe8c8'); } else { sky.addColorStop(0, '#9fcfe8'); sky.addColorStop(1, '#e8f4ee'); }
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    var cf = Math.min(1, Math.max(0, f)), sx = W * (.38 + .55 * cf), sy = hz - Math.sin(Math.PI * cf) * hz * .72 + H * .06, R = Math.min(W, H) * .07;
    ctx.strokeStyle = day ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.25)'; ctx.setLineDash([3 * D, 5 * D]); ctx.lineWidth = 1.2 * D; ctx.beginPath();
    for (var k = 0; k <= 30; k++) { var u = k / 30, x = W * (.38 + .55 * u), y = hz - Math.sin(Math.PI * u) * hz * .72 + H * .06; if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
    if (day) { var g = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 5); g.addColorStop(0, 'rgba(255,250,220,.9)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(sx - R * 5, sy - R * 5, R * 10, R * 10); ctx.fillStyle = '#fffbe6'; ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.fillStyle = '#fff'; for (var s2 = 0; s2 < 30; s2++) { ctx.globalAlpha = .4 + .4 * Math.sin(t * 1.6 + s2); ctx.fillRect((s2 * 173) % W, (s2 * 61) % (hz * .8), 1.4 * D, 1.4 * D); } ctx.globalAlpha = 1; ctx.fillStyle = '#f6f2e0'; ctx.beginPath(); ctx.arc(W * .78, hz * .3, R * .7, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = day ? 'rgba(255,255,255,.85)' : 'rgba(200,210,230,.35)';
    [[.5, .18, 1], [.8, .1, .7], [.25, .3, .8]].forEach(function (c, n) { var cx = ((c[0] * W + t * 6 * (n + 1) * D) % (W * 1.3)) - W * .15, cy = c[1] * H, s = c[2] * H * .055; for (var q = 0; q < 4; q++) { ctx.beginPath(); ctx.arc(cx + (q - 1.5) * s * .9, cy - Math.sin(q / 3 * Math.PI) * s * .5, s * (.7 + Math.sin(q / 3 * Math.PI) * .35), 0, Math.PI * 2); ctx.fill(); } });
    function hill(base, amp, ph, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, H); for (var x = 0; x <= W; x += W / 40) ctx.lineTo(x, base - Math.sin(x / W * 3 + ph) * amp); ctx.lineTo(W, H); ctx.fill(); }
    hill(hz, H * .05, 1, day ? '#b9d8a8' : '#3a5a4a'); hill(hz + H * .1, H * .04, 2.4, day ? '#93c27e' : '#2a4a3a');
    var cols = ['#e8506f', '#f6b93b', '#c45bd1', '#ff8a8a', '#fffaf0'];
    for (var i = 0; i < 26; i++) { var tx = (i + .5) / 26 * W, ty = H * (.9 + (i % 3) * .03), sw = Math.sin(t * 1.4 + i * .7) * 3 * D, th = H * (.12 + (i % 4) * .02);
      ctx.strokeStyle = '#4f8a4c'; ctx.lineWidth = 2 * D; ctx.beginPath(); ctx.moveTo(tx, ty + th * .3); ctx.quadraticCurveTo(tx, ty - th * .3, tx + sw, ty - th * .6); ctx.stroke();
      ctx.fillStyle = cols[i % cols.length]; var bx = tx + sw, by = ty - th * .6, bw = H * .022; ctx.beginPath(); ctx.moveTo(bx - bw, by); ctx.quadraticCurveTo(bx - bw, by - bw * 2.2, bx - bw * .3, by - bw * 2.2); ctx.lineTo(bx, by - bw * 1.4); ctx.lineTo(bx + bw * .3, by - bw * 2.2); ctx.quadraticCurveTo(bx + bw, by - bw * 2.2, bx + bw, by); ctx.quadraticCurveTo(bx, by + bw * .6, bx - bw, by); ctx.fill(); }
    var shade = ctx.createLinearGradient(0, 0, W * .55, 0); shade.addColorStop(0, day ? 'rgba(255,253,246,.8)' : 'rgba(10,20,40,.5)'); shade.addColorStop(1, day ? 'rgba(255,253,246,0)' : 'rgba(10,20,40,0)'); ctx.fillStyle = shade; ctx.fillRect(0, 0, W * .55, H);
  }
  function fmtGain(m) { var a = Math.abs(Math.round(m)), s = m >= 0 ? '+' : '−'; return s + Math.floor(a / 60) + 'h ' + String(a % 60).padStart(2, '0') + 'm'; }

  /* ---------- wallpaper painters ---------- */
  function blossom(K, x, y, r, a) { var c = K.ctx; c.save(); c.translate(x, y); c.rotate(a || 0); for (var i = 0; i < 5; i++) { c.rotate(Math.PI * 2 / 5); var g = c.createLinearGradient(0, 0, 0, -r); g.addColorStop(0, '#f08fb0'); g.addColorStop(.5, '#ffd6e3'); g.addColorStop(1, '#fff5f8'); c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-r * .55, -r * .35, -r * .5, -r * .95, -r * .12, -r); c.lineTo(0, -r * .86); c.lineTo(r * .12, -r); c.bezierCurveTo(r * .5, -r * .95, r * .55, -r * .35, 0, 0); c.fill(); } c.fillStyle = '#f2c14e'; c.beginPath(); c.arc(0, 0, r * .16, 0, Math.PI * 2); c.fill(); c.restore(); }
  function branch(K, x0, y0, ang, len, w, depth) {
    if (depth <= 0 || len < K.U * .8) return; var c = K.ctx, x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
    c.strokeStyle = '#4a3428'; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + (K.r() - .5) * len * .3, (y0 + y1) / 2 + (K.r() - .5) * len * .3, x1, y1); c.stroke();
    if (depth <= 3) for (var i = 0; i < 7; i++) { var t = K.r(); blossom(K, x0 + (x1 - x0) * t + (K.r() - .5) * K.U * 3, y0 + (y1 - y0) * t + (K.r() - .5) * K.U * 3, K.U * (1.2 + K.r() * 1.1), K.r() * 6); }
    branch(K, x1, y1, ang + (K.r() * .5 + .15), len * (.62 + K.r() * .14), w * .66, depth - 1); branch(K, x1, y1, ang - (K.r() * .5 + .15), len * (.62 + K.r() * .14), w * .66, depth - 1);
  }
  function petalsFall(K, n) { for (var i = 0; i < n; i++) { var c = K.ctx, x = K.r() * K.W, y = K.r() * K.H, r = K.U * (.5 + K.r() * .7); c.save(); c.translate(x, y); c.rotate(K.r() * 6); c.scale(1, .5 + K.r() * .5); c.fillStyle = ['#ffd6e3', '#f7b6c8', '#fff0f4'][i % 3]; c.globalAlpha = .7 + K.r() * .3; c.beginPath(); c.ellipse(0, 0, r, r * .62, 0, 0, Math.PI * 2); c.fill(); c.restore(); } K.ctx.globalAlpha = 1; }
  function tulip(K, x, y, h, col) { var c = K.ctx, U = K.U; c.strokeStyle = '#4f8a4c'; c.lineWidth = Math.max(1, h * .05); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h); c.stroke(); var b = h * .2; c.fillStyle = col; c.beginPath(); c.moveTo(x - b, y - h); c.quadraticCurveTo(x - b, y - h - b * 2.2, x - b * .3, y - h - b * 2.2); c.lineTo(x, y - h - b * 1.4); c.lineTo(x + b * .3, y - h - b * 2.2); c.quadraticCurveTo(x + b, y - h - b * 2.2, x + b, y - h); c.quadraticCurveTo(x, y - h + b * .6, x - b, y - h); c.fill(); }
  var PAINT = {
    sakura: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait;
      K.sky([[0, '#f6d6dc'], [.4, '#fbe8e0'], [.7, '#f4efe4'], [1, '#e6efe2']]);
      K.glow(W * .5, H * (P ? .42 : .5), Math.max(W, H) * .4, 'rgba(255,248,230,A)', .9);
      K.ridge(H * .62, H * .06, 3, 'rgba(200,184,214,.55)', 5); K.ridge(H * .68, H * .04, 5, 'rgba(170,190,170,.6)', 9);
      var pond = c.createLinearGradient(0, H * .72, 0, H); pond.addColorStop(0, '#e9eef0'); pond.addColorStop(1, '#bfd6d8'); c.fillStyle = pond; c.fillRect(0, H * .72, W, H * .28);
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = U * .15; for (var i = 0; i < 18; i++) { var y = H * (.74 + K.r() * .24), x = K.r() * W; c.beginPath(); c.moveTo(x, y); c.lineTo(x + U * (3 + K.r() * 6), y); c.stroke(); }
      c.strokeStyle = '#6a4a3a'; c.lineWidth = U * .6; c.beginPath(); c.moveTo(W * .2, H * .78); c.quadraticCurveTo(W * .5, H * .66, W * .8, H * .78); c.stroke(); c.lineWidth = U * .3; for (var b = 0; b < 9; b++) { var bx = W * (.24 + b * .065), by = H * .78 - Math.sin((b + .5) / 9 * Math.PI) * H * .1; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, by + H * .025); c.stroke(); }
      branch(K, -U * 2, H * (P ? .1 : .14), .35, U * (P ? 26 : 22), U * 2.6, 6); branch(K, W + U * 2, H * (P ? .36 : .3), Math.PI - .22, U * (P ? 22 : 20), U * 2.4, 6);
      petalsFall(K, P ? 70 : 90); K.vignette(.12);
    },
    glasshouse: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait, i;
      K.sky([[0, '#eaf4ee'], [1, '#d6e8dc']]);
      var cx = W / 2, top = H * .08, aw = W * (P ? .96 : .8), base = H * .86;
      c.fillStyle = 'rgba(255,253,240,.6)'; c.beginPath(); c.moveTo(cx - aw / 2, base); c.lineTo(cx - aw / 2, top + aw * .45); c.quadraticCurveTo(cx, top - aw * .15, cx + aw / 2, top + aw * .45); c.lineTo(cx + aw / 2, base); c.fill();
      c.strokeStyle = '#ffffff'; c.lineWidth = U * .7;
      for (i = 0; i <= 10; i++) { var x = cx - aw / 2 + i * aw / 10, yt = top + aw * .45 - Math.sin(i / 10 * Math.PI) * aw * .3; c.beginPath(); c.moveTo(x, base); c.lineTo(x, yt); c.stroke(); }
      for (i = 1; i < 8; i++) { var y = top + aw * .45 + i * (base - top - aw * .45) / 8; c.lineWidth = U * .35; c.beginPath(); c.moveTo(cx - aw / 2, y); c.lineTo(cx + aw / 2, y); c.stroke(); }
      c.lineWidth = U * .9; c.beginPath(); c.moveTo(cx - aw / 2, top + aw * .45); c.quadraticCurveTo(cx, top - aw * .15, cx + aw / 2, top + aw * .45); c.stroke();
      c.globalCompositeOperation = 'lighter'; for (i = 0; i < 4; i++) { var rx = W * (.6 + i * .1), g = c.createLinearGradient(rx, 0, rx - W * .5, H); g.addColorStop(0, 'rgba(255,250,220,.22)'); g.addColorStop(1, 'rgba(255,250,220,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(rx, 0); c.lineTo(rx + W * .05, 0); c.lineTo(rx - W * .45, H); c.lineTo(rx - W * .55, H); c.fill(); } c.globalCompositeOperation = 'source-over';
      var floor = c.createLinearGradient(0, base, 0, H); floor.addColorStop(0, '#d9c4a0'); floor.addColorStop(1, '#b89c72'); c.fillStyle = floor; c.fillRect(0, base, W, H - base);
      c.strokeStyle = 'rgba(120,90,50,.25)'; c.lineWidth = U * .15; for (i = 0; i < 14; i++) { c.beginPath(); c.moveTo(cx + (i - 7) * U * 4, base); c.lineTo(cx + (i - 7) * U * 12, H); c.stroke(); }
      function plant(px, py, s, kind) { c.fillStyle = '#c96a3a'; c.beginPath(); c.moveTo(px - s, py - s * 1.2); c.lineTo(px + s, py - s * 1.2); c.lineTo(px + s * .8, py); c.lineTo(px - s * .8, py); c.fill(); c.fillStyle = '#d97a4a'; c.fillRect(px - s * 1.08, py - s * 1.35, s * 2.16, s * .3);
        for (var l = 0; l < 9; l++) { var a = -Math.PI / 2 + (l - 4) * .32, ll = s * (kind ? 2.6 : 3.4) * (.7 + K.r() * .4), lx = px + Math.cos(a) * ll, ly = py - s * 1.3 + Math.sin(a) * ll; c.fillStyle = l % 2 ? '#4f8a4c' : '#6aa860'; c.beginPath(); c.moveTo(px, py - s * 1.3); c.quadraticCurveTo(px + Math.cos(a - .3) * ll * .6, py - s * 1.3 + Math.sin(a - .3) * ll * .6, lx, ly); c.quadraticCurveTo(px + Math.cos(a + .3) * ll * .6, py - s * 1.3 + Math.sin(a + .3) * ll * .6, px, py - s * 1.3); c.fill(); }
        if (kind) for (var f = 0; f < 4; f++) blossom(K, px + (K.r() - .5) * s * 3, py - s * (2.4 + K.r() * 1.6), s * .45, K.r() * 6); }
      var ps = P ? 1.7 : 1; plant(W * .16, base + U * 2, U * 5 * ps, 0); plant(W * .84, base + U * 3, U * 5.4 * ps, 1); plant(W * .5, base + U * 1, U * 3.6 * ps, 1); plant(W * .33, base + U * 5, U * 3 * ps, 0); plant(W * .67, base + U * 5.5, U * 3.2 * ps, 0);
      [[.3, .22], [.7, .26]].forEach(function (hb) { var hx = W * hb[0], hy = H * hb[1]; c.strokeStyle = '#8a6a4a'; c.lineWidth = U * .15; c.beginPath(); c.moveTo(hx, 0); c.lineTo(hx, hy - U * 2); c.stroke(); c.fillStyle = '#a07a50'; c.beginPath(); c.arc(hx, hy - U * 2, U * 2.6, 0, Math.PI); c.fill();
        for (var v = 0; v < 7; v++) { var vx = hx + (v - 3) * U * .8; c.strokeStyle = '#5f9a52'; c.lineWidth = U * .25; c.beginPath(); c.moveTo(vx, hy - U); c.quadraticCurveTo(vx + U, hy + U * 3, vx, hy + U * (4 + K.r() * 4)); c.stroke(); } blossom(K, hx - U, hy, U * .9, 1); blossom(K, hx + U * 1.4, hy + U * .6, U * .8, 2); });
      K.vignette(.15);
    },
    tulips: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait, hz = H * (P ? .48 : .5), i;
      K.sky([[0, '#6fb0e0'], [.7, '#c8e4f4'], [1, '#eef6f2']], 0, hz);
      c.fillStyle = 'rgba(255,255,255,.95)'; for (i = 0; i < 5; i++) { var cx = K.r() * W, cy = H * (.06 + K.r() * .2), s = U * (2.6 + K.r() * 3); for (var k = 0; k < 5; k++) { c.beginPath(); c.arc(cx + (k - 2) * s * .8, cy - Math.sin(k / 4 * Math.PI) * s * .7, s * (.7 + Math.sin(k / 4 * Math.PI) * .4), 0, Math.PI * 2); c.fill(); } }
      K.ridge(hz, H * .015, 4, '#9cc58a', 3);
      var wx = W * (P ? .74 : .78), wy = hz - U; c.fillStyle = '#7a5a4a'; c.beginPath(); c.moveTo(wx - U * 2.6, wy); c.lineTo(wx - U * 1.6, wy - U * 11); c.lineTo(wx + U * 1.6, wy - U * 11); c.lineTo(wx + U * 2.6, wy); c.fill(); c.fillStyle = '#5a3a2a'; c.beginPath(); c.moveTo(wx - U * 2, wy - U * 11); c.lineTo(wx, wy - U * 14); c.lineTo(wx + U * 2, wy - U * 11); c.fill();
      c.save(); c.translate(wx, wy - U * 11.5); c.rotate(.4); c.fillStyle = '#f6efe0'; for (i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.fillRect(-U * .5, 0, U, U * 8); c.strokeStyle = '#7a5a4a'; c.lineWidth = U * .12; c.strokeRect(-U * .5, U, U, U * 7); } c.restore();
      var cols = ['#e8364f', '#f6b93b', '#ff7aa0', '#b04ad1', '#fffaf0', '#ff6a3a'];
      for (i = 0; i < 9; i++) { var a0 = (i / 9 - .5) * 2.2, a1 = ((i + 1) / 9 - .5) * 2.2; c.fillStyle = i % 2 ? '#7aa860' : '#5f8a4c'; c.beginPath(); c.moveTo(W / 2 + a0 * W * .08, hz); c.lineTo(W / 2 + a1 * W * .08, hz); c.lineTo(W / 2 + a1 * W * 1.6, H); c.lineTo(W / 2 + a0 * W * 1.6, H); c.fill(); }
      for (i = 0; i < 9; i += 2) { var b0 = (i / 9 - .5) * 2.2, b1 = ((i + 1) / 9 - .5) * 2.2, col = cols[i % cols.length];
        c.fillStyle = col; c.globalAlpha = .45; c.beginPath(); c.moveTo(W / 2 + b0 * W * .08, hz); c.lineTo(W / 2 + b1 * W * .08, hz); c.lineTo(W / 2 + b1 * W * 1.6, H); c.lineTo(W / 2 + b0 * W * 1.6, H); c.fill(); c.globalAlpha = 1;
        for (var n = 0; n < 150; n++) { var t = Math.pow(K.r(), .6), yy = hz + (H - hz) * t, f = (yy - hz) / (H - hz), xl = W / 2 + b0 * (W * .08 + f * (W * 1.6 - W * .08)), xr = W / 2 + b1 * (W * .08 + f * (W * 1.6 - W * .08)); tulip(K, xl + K.r() * (xr - xl), yy + U * 2 * f, U * (1.2 + f * 10), col); } }
      K.vignette(.15);
    },
    wisteria: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait, i, vx = W / 2, vy = H * .55;
      K.sky([[0, '#e8e0f2'], [.5, '#f6f0f2'], [1, '#e2ecd8']]);
      K.glow(vx, vy, Math.max(W, H) * .35, 'rgba(255,252,236,A)', 1);
      var path = c.createLinearGradient(0, vy, 0, H); path.addColorStop(0, '#f2e8d6'); path.addColorStop(1, '#c9b48a'); c.fillStyle = path; c.beginPath(); c.moveTo(vx - U * 2, vy); c.lineTo(vx + U * 2, vy); c.lineTo(W * .8, H); c.lineTo(W * .2, H); c.fill();
      c.fillStyle = '#9cc58a'; c.beginPath(); c.moveTo(0, vy + U * 4); c.lineTo(vx - U * 2, vy); c.lineTo(W * .2, H); c.lineTo(0, H); c.fill(); c.beginPath(); c.moveTo(W, vy + U * 4); c.lineTo(vx + U * 2, vy); c.lineTo(W * .8, H); c.lineTo(W, H); c.fill();
      for (var a = 11; a >= 0; a--) { var f = a / 11, aw = W * (.05 + Math.pow(f, 1.6) * 1.25), ax = vx - aw / 2, top = vy - U * 2 - (vy - H * .03) * Math.pow(f, 1.1), legY = vy + (H - vy) * f * .95 + U, y0 = top + aw * .22, ym = top - aw * .2;
        c.strokeStyle = 'rgba(90,60,40,' + (.35 + f * .6) + ')'; c.lineWidth = U * (.2 + f * 1.4); c.beginPath(); c.moveTo(ax, legY); c.lineTo(ax, y0); c.quadraticCurveTo(vx, ym, ax + aw, y0); c.lineTo(ax + aw, legY); c.stroke();
        var n = Math.round(8 + f * 36); for (var k = 0; k < n; k++) { var u = k / (n - 1), w1 = 1 - u, px = w1 * w1 * ax + 2 * w1 * u * vx + u * u * (ax + aw), py = w1 * w1 * y0 + 2 * w1 * u * ym + u * u * y0, len = U * (1.5 + f * 18) * (.6 + K.r() * .6);
          for (var g = 0; g < 9; g++) { var gy = py + g / 9 * len, gr = U * (.22 + f * 1.2) * (1 - g / 11); c.fillStyle = ['#c9b0ec', '#a98ad8', '#e2d4f6', '#8f6ac8'][(g + k) % 4]; c.globalAlpha = .5 + f * .5; c.beginPath(); c.arc(px + Math.sin(g * 1.3 + k) * gr * .6, gy, gr, 0, Math.PI * 2); c.fill(); }
          if (k % 3 === 0) { c.fillStyle = '#7aa860'; c.globalAlpha = .7; c.beginPath(); c.ellipse(px + U * f, py, U * (.4 + f * 1.4), U * (.2 + f * .6), .5, 0, Math.PI * 2); c.fill(); } } }
      c.globalAlpha = 1; for (i = 0; i < 50; i++) { c.fillStyle = ['#c9b0ec', '#e2d4f6'][i % 2]; c.globalAlpha = .7; c.beginPath(); c.ellipse(K.r() * W, H * (.6 + K.r() * .4), U * .4, U * .25, K.r() * 3, 0, Math.PI * 2); c.fill(); } c.globalAlpha = 1;
      K.vignette(.18);
    }
  };

  S.landing = {
    arch: arch(),
    flank: 'sp-sprig',
    plaque: { lbl: 'The Bloom Countdown', until: 'UNTIL SPRING', during: 'SPRING ENDS IN' },
    rules: ['The Garden Library & Screening Lawn', 'The Glasshouse Stalls'],
    shelf: {
      sub: 'linen-bound stories of gardens and new starts. Pull one from the shelf.', cta: 'Library', tick: 880,
      books: [
        { t: 'The Secret Garden', a: 'Frances Hodgson Burnett', y: 1911, w: 38, h: 194, c1: '#a8c8a0', c2: '#6f9a68', rib: true, b: 'Lonely Mary Lennox finds the key to a walled garden locked for ten years, and brings it, and her cousin, back to life.' },
        { t: 'Anne of Green Gables', a: 'L. M. Montgomery', y: 1908, w: 36, h: 186, c1: '#f2b8c8', c2: '#d4849e', b: 'An orphan with red hair and a big imagination is sent by mistake to a brother and sister who wanted a boy.' },
        { t: 'Enchanted April', a: 'Elizabeth von Arnim', y: 1922, w: 32, h: 176, c1: '#c9b6e8', c2: '#9a80c8', b: 'Four Englishwomen escape a grey London spring by renting a castle covered in wisteria on the Italian coast.' },
        { t: 'A Room with a View', a: 'E. M. Forster', y: 1908, w: 34, h: 182, c1: '#f6dfa0', c2: '#d8b45a', lean: true, b: 'In Florence, Lucy Honeychurch is kissed in a field of violets, and spends the rest of the book deciding what it meant.' },
        { t: 'Far from the Madding Crowd', s: 'Madding Crowd', a: 'Thomas Hardy', y: 1874, w: 40, h: 200, c1: '#8fb8d8', c2: '#5a84aa', b: 'Bathsheba Everdene inherits a farm and three very different suitors in the green hills of Wessex.' },
        { t: 'Pride and Prejudice', a: 'Jane Austen', y: 1813, w: 36, h: 190, c1: '#e8a0b4', c2: '#c06a86', rib: true, b: 'Elizabeth Bennet and Mr Darcy get almost everything about each other wrong, one country ball at a time.' },
        { t: 'The Blue Castle', a: 'L. M. Montgomery', y: 1926, w: 30, h: 168, c1: '#9ec8e8', c2: '#6a9ac8', b: 'Told she has a year to live, timid Valancy Stirling stops doing what she is told and moves to an island in the woods.' },
        { t: 'Walden', a: 'Henry David Thoreau', y: 1854, w: 30, h: 164, c1: '#bcd6a8', c2: '#86a870', b: 'Two years in a cabin by a pond, planting beans, watching the ice break and asking what a life needs.' },
        { t: 'I Capture the Castle', a: 'Dodie Smith', y: 1948, w: 34, h: 180, c1: '#f4c8a8', c2: '#d89a70', b: 'Seventeen-year-old Cassandra keeps a journal of her eccentric family in a crumbling English castle, the spring everything changes.' }
      ]
    },
    cinema: {
      board: 'Screening on the Lawn', title: 'The Garden Screening', sub: 'spring films for long, light evenings', cta: 'Box office',
      films: [
        { title: 'Amélie', year: '2001', rating: 8.3, wikiSlug: 'Am%C3%A9lie' },
        { title: "Singin' in the Rain", year: '1952', rating: 8.3, wikiSlug: "Singin'_in_the_Rain" },
        { title: 'Pride & Prejudice', year: '2005', rating: 7.8, wikiSlug: 'Pride_%26_Prejudice_(2005_film)' },
        { title: 'Little Women', year: '2019', rating: 7.8, wikiSlug: 'Little_Women_(2019_film)' },
        { title: 'The Secret Garden', year: '1993', rating: 7.3, wikiSlug: 'The_Secret_Garden_(1993_film)' },
        { title: 'The Wizard of Oz', year: '1939', rating: 8.1, wikiSlug: 'The_Wizard_of_Oz_(1939_film)' }
      ]
    },
    sound: {
      noun: 'birdcage music box', sub: 'Wake the songbird, then open the playlists for the season.', device: DEVICE,
      scope: ['rgba(244,166,191,.16)', 'rgba(244,166,191,.45)', '#fff2f6'],
      stations: [
        { n: 'Dawn Chorus', short: 'Dawn Chorus', x: 12, play: function (A) {
          var pad = A.filter('lowpass', 900), pg = A.gain(.025); pad.connect(pg); pg.connect(A.out); [60, 67, 72, 76].forEach(function (m) { A.osc('sine', A.mtof(m)).connect(pad); });
          function song() { var t = A.ac.currentTime + .05, kind = Math.random(), base = 2200 + Math.random() * 1400, n = 3 + (Math.random() * 6 | 0);
            for (var i = 0; i < n; i++) { if (kind < .4) A.chirp(t + i * .09, base * 1.2, base * .8, .07, .05); else if (kind < .75) A.chirp(t + i * .16, base * .8, base * 1.3, .12, .045); else A.chirp(t + i * .05, base, base * (i % 2 ? 1.25 : .9), .04, .04); } }
          song(); A.every(900, function () { if (Math.random() < .75) song(); });
        } },
        { n: 'Spring Rain on Glass', short: 'Spring Rain', x: 38, play: function (A) {
          var n = A.noise(), hp = A.filter('highpass', 1800, .3), lp = A.filter('lowpass', 7000), g = A.gain(.06); n.connect(hp); hp.connect(lp); lp.connect(g); g.connect(A.out);
          var low = A.filter('lowpass', 400), lg = A.gain(.05); n.connect(low); low.connect(lg); lg.connect(A.out);
          A.every(70, function () { if (Math.random() < .5) { var t = A.ac.currentTime + Math.random() * .06; A.chirp(t, 1400 + Math.random() * 1800, 600 + Math.random() * 500, .05, .025); } });
          A.seq([[72, 2], [76, 2], [79, 4], [74, 2], [77, 2], [81, 4]], .5, function (f, t) { A.bell(f, t, 2.4, .035); });
        } },
        { n: 'Glasshouse Harp', short: 'Harp', x: 63, play: function (A) {
          var scale = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81], chords = [[0, 2, 4, 5, 7, 9], [1, 3, 4, 6, 8, 9], [0, 2, 3, 5, 7, 8], [2, 4, 5, 7, 9, 9]], k = 0, next = A.ac.currentTime + .12, step = 0;
          A.every(50, function () { while (next < A.ac.currentTime + .3) { var ch = chords[(step / 12 | 0) % 4], idx = step % 12 < 6 ? step % 6 : 5 - step % 6; var f = A.mtof(scale[ch[idx]]);
            A.pluck(f, next, 1.6, .07, null, 5); A.bell(f, next, 1.4, .025, null, [[1, 1], [2, .3]]); if (step % 12 === 0) A.pluck(A.mtof(scale[ch[0]] - 24), next, 2.4, .1, null, 2.5); next += .2; step++; } });
        } },
        { n: 'Wind Chimes', short: 'Chimes', x: 88, play: function (A) {
          var n = A.noise(), bp = A.filter('bandpass', 500, .4), g = A.gain(.03); n.connect(bp); bp.connect(g); g.connect(A.out);
          var lfo = A.osc('sine', .09), lg = A.gain(.025); lfo.connect(lg); lg.connect(g.gain);
          var notes = [72, 74, 76, 79, 81, 84, 86, 88];
          A.every(260, function () { if (Math.random() < .55) { var t = A.ac.currentTime + Math.random() * .1; A.bell(A.mtof(notes[Math.random() * notes.length | 0]), t, 3.4, .06, null, [[1, 1], [2.76, .35], [5.4, .12]]); } });
        } }
      ]
    },
    game: null,
    wheel: { sub: 'Spin a small spring quest for today', dataVar: 'SPRING_WHEEL', style: { rim: ['#f6e6b8', '#8fae8a', '#f1dca0', '#6f9470', '#e2c98a'], inner: '#fffdf6', core: 'rgba(255,255,255,.6)', edge: 'rgba(0,0,0,.2)', text: '#ffffff', font: '600 #px "Jost", sans-serif', upper: true, spoke: '#fffdf6', bulbA: '#f2c94c', bulbB: '#ffffff', hub: ['#fffdf6', '#f1dca0', '#a7864a'], hubText: '#4a3a1a', hubFont: 'italic 600 #px "Fraunces", serif', pointer: '#d8577a' } },
    radar: { sub: 'Gardens, trails & birding spots near', noun: ['garden spot', 'garden spots'], mapVar: 'SPRING_MAP' },
    shop: { sub: 'Rain gear, crafts, planters & tea-table treats', items: SHOP },
    sky: { icon: 'cloud', small: function (i) { return 'The meadow over ' + (i.place || ''); }, draw: meadow,
      cells: function (i) { return [['Sunrise', i.polar ? '—' : i.hm(i.rise)], ['Sunset', i.polar ? '—' : i.hm(i.set)], ['Since winter', fmtGain(i.gained)]]; } },
    lore: { title: 'Almanac Note of the Day', hint: 'TAP FOR ANOTHER NOTE', perch: BLUEBIRD, tick: 1040 },
    walls: {
      sub: 'Blossom-soft scenes for your lockscreen or desktop.', toast: 'Wallpaper pressed & planted on your device', busy: 'Pressing…',
      scenes: [
        { id: 'sakura', name: 'Cherry Blossom Dawn', sub: 'Petals over a still garden pond', seed: 17 },
        { id: 'glasshouse', name: 'The Glasshouse', sub: 'Morning light through the palm house', seed: 23 },
        { id: 'tulips', name: 'Tulip Fields', sub: 'Painted rows to a windmill', seed: 9 },
        { id: 'wisteria', name: 'Wisteria Arbor', sub: 'A lilac tunnel in full bloom', seed: 14 }
      ],
      paint: function (K, id) { PAINT[id](K); }
    }
  };
})(window);
