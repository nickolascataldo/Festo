/* ==========================================================================
   SUMMER SOLSTICE · landing config for shared/luxe/luxe-landing.js
   Books and films are real entries from Beach Reads and the Cinema data; the radio stations are synthesized;
   the sun-over-the-sea sky and the four wallpapers are painted on canvas.
   ========================================================================== */
(function (global) {
  'use strict';
  var S = global.FestoLuxe.seasons.summer;

  /* ---------- header bunting ---------- */
  function arch() {
    var s = '<svg viewBox="0 0 390 96">', cols = ['#e0532a', '#fdf3df', '#1f8fb0', '#ffc94a', '#1f5fa8', '#fdf3df', '#f07a8a'];
    [[10, 22, 195, 64, 380, 22]].forEach(function (p) {
      function q(t) { var u = 1 - t; return [u * u * p[0] + 2 * u * t * p[2] + t * t * p[4], u * u * p[1] + 2 * u * t * p[3] + t * t * p[5]]; }
      s += '<path d="M' + p[0] + ' ' + p[1] + 'Q' + p[2] + ' ' + p[3] + ' ' + p[4] + ' ' + p[5] + '" fill="none" stroke="#fdf3df" stroke-width="1.6"/>';
      for (var i = 0; i < 17; i++) { if (i === 8) continue; var a = q(i / 17), b = q((i + 1) / 17), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        s += '<path class="flag" style="animation-delay:-' + (i * .23).toFixed(2) + 's;transform-origin:' + mx.toFixed(1) + 'px ' + my.toFixed(1) + 'px" d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + 'L' + mx.toFixed(1) + ' ' + (my + 18).toFixed(1) + 'z" fill="' + cols[i % cols.length] + '" stroke="rgba(60,30,30,.25)" stroke-width=".6"/>'; }
    });
    return s + '<use href="#su-sun" x="169" y="34" width="52" height="52"/></svg>';
  }

  /* ---------- the 1950s tabletop radio ---------- */
  function tabletop() {
    var ticks = ''; for (var i = 0; i <= 12; i++) { var a = (-210 + i * 20) * Math.PI / 180, r2 = i % 3 ? 31 : 33; ticks += '<path d="M' + (232 + Math.cos(a) * 27).toFixed(1) + ' ' + (80 + Math.sin(a) * 27).toFixed(1) + 'L' + (232 + Math.cos(a) * r2).toFixed(1) + ' ' + (80 + Math.sin(a) * r2).toFixed(1) + '" stroke="#7a3a1a" stroke-width="1.2"/>'; }
    return '<svg class="rad" viewBox="0 0 320 176" aria-hidden="true"><defs>' +
      '<linearGradient id="srBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8e6dc"/><stop offset=".55" stop-color="#6cc4b6"/><stop offset=".551" stop-color="#fdf3df"/><stop offset="1" stop-color="#ecd9b4"/></linearGradient>' +
      '<linearGradient id="srChrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#b8c4cc"/><stop offset=".55" stop-color="#eef3f6"/><stop offset="1" stop-color="#7c8b96"/></linearGradient>' +
      '<radialGradient id="srChromeR" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c9d3da"/><stop offset="1" stop-color="#6a7882"/></radialGradient>' +
      '<radialGradient id="srFace" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#fff1c8"/><stop offset=".55" stop-color="#ffc483"/><stop offset="1" stop-color="#f08a5a"/></radialGradient>' +
      '<pattern id="srHoles" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.5" fill="#5a6a74"/></pattern>' +
      '<radialGradient id="srGlow"><stop offset="0" stop-color="#ffd59a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd59a" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="160" cy="170" rx="128" ry="5" fill="#000" opacity=".22"/>' +
      '<path d="M112 36C112 10 208 10 208 36" fill="none" stroke="url(#srChrome)" stroke-width="8" stroke-linecap="round"/><rect x="104" y="30" width="14" height="10" rx="3" fill="#7c8b96"/><rect x="202" y="30" width="14" height="10" rx="3" fill="#7c8b96"/>' +
      '<rect x="44" y="160" width="26" height="9" rx="4" fill="#4a5a64"/><rect x="250" y="160" width="26" height="9" rx="4" fill="#4a5a64"/>' +
      '<rect x="22" y="36" width="276" height="128" rx="34" fill="url(#srBody)" stroke="#2c7a6e" stroke-width="2"/><rect x="27" y="41" width="266" height="118" rx="30" fill="none" stroke="#fff" stroke-opacity=".5"/>' +
      '<rect x="22" y="104" width="276" height="7" fill="url(#srChrome)"/>' +
      '<g class="spk"><circle cx="98" cy="100" r="50" fill="url(#srChrome)"/><circle cx="98" cy="100" r="44" fill="#eef2f4"/><circle cx="98" cy="100" r="44" fill="url(#srHoles)"/>' +
      '<circle cx="98" cy="100" r="30" fill="none" stroke="url(#srChrome)" stroke-width="3"/><circle cx="98" cy="100" r="14" fill="url(#srChromeR)"/>' +
      '<path d="M98 56V144M54 100H142" stroke="url(#srChrome)" stroke-width="3"/></g><circle class="glow" cx="98" cy="100" r="46" fill="url(#srGlow)"/>' +
      '<circle cx="232" cy="80" r="38" fill="url(#srChrome)"/><circle cx="232" cy="80" r="33" fill="url(#srFace)"/>' + ticks +
      '<path d="M210 94q6-4 11 0t11 0 11 0 11 0" stroke="#1f8fb0" stroke-width="2" fill="none"/><path class="rpointer" d="M232 80L249 61" stroke="#c2401a" stroke-width="2.2" stroke-linecap="round"/><circle cx="232" cy="80" r="3.6" fill="#7c8b96"/>' +
      '<circle class="lamp" cx="272" cy="54" r="4" fill="#ff5a3a"/>' +
      '<text x="232" y="138" text-anchor="middle" font-family="Yeseva One, serif" font-size="17" fill="#2c7a6e">Festo</text>' +
      '<circle cx="194" cy="146" r="9" fill="url(#srChromeR)" stroke="#6a7882"/><circle cx="270" cy="146" r="9" fill="url(#srChromeR)" stroke="#6a7882"/><path d="M194 139v5M270 139v5" stroke="#4a5a64" stroke-width="1.6"/></svg>';
  }
  var DEVICE = tabletop();

  /* ---------- arcade: the cone stack ---------- */
  var CONE = '<svg class="game-art" viewBox="0 0 200 170" width="160" height="136" aria-hidden="true"><defs>' +
    '<linearGradient id="cnCone" x1="0" x2="1"><stop offset="0" stop-color="#b5741e"/><stop offset=".5" stop-color="#f2b55a"/><stop offset="1" stop-color="#a8641a"/></linearGradient>' +
    '<radialGradient id="cnS1" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#ffd6e2"/><stop offset=".55" stop-color="#f7889f"/><stop offset="1" stop-color="#c84e6e"/></radialGradient>' +
    '<radialGradient id="cnS2" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#e6fff2"/><stop offset=".55" stop-color="#8fe0b8"/><stop offset="1" stop-color="#3fa878"/></radialGradient>' +
    '<radialGradient id="cnS3" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#fffdf2"/><stop offset=".55" stop-color="#ffefc0"/><stop offset="1" stop-color="#e2c27a"/></radialGradient></defs>' +
    '<ellipse cx="100" cy="162" rx="40" ry="5" fill="#000" opacity=".18"/>' +
    '<path d="M76 98 L100 160 L124 98z" fill="url(#cnCone)"/><path d="M80 106l36 0M84 118l28 0M89 130l20 0M82 104l26 40M94 102l20 34M106 100l10 18M118 100l-26 46M108 100l-20 30M96 100l-12 16" stroke="#8a4e10" stroke-width="1" opacity=".6"/>' +
    '<g class="scoop s1"><circle cx="100" cy="92" r="26" fill="url(#cnS3)"/><path d="M76 96c6 8 10 0 14 6s8-2 12 4 8-4 12 2 8 0 12-6" fill="url(#cnS3)"/></g>' +
    '<g class="scoop s2"><circle cx="100" cy="62" r="23" fill="url(#cnS2)"/><path d="M80 68c5 6 8 0 12 5s8-1 10 4 7-3 10 2 6-2 9-6" fill="url(#cnS2)"/><g fill="#5a3a20"><rect x="92" y="54" width="2.4" height="4.4" rx="1" transform="rotate(30 93 56)"/><rect x="106" y="62" width="2.4" height="4.4" rx="1" transform="rotate(-20 107 64)"/><rect x="98" y="70" width="2.4" height="4.4" rx="1" transform="rotate(60 99 72)"/></g></g>' +
    '<g class="scoop s3"><circle cx="100" cy="36" r="20" fill="url(#cnS1)"/><path d="M83 40c4 6 7 0 10 4s7-1 9 3 6-2 8 1 5-2 7-6" fill="url(#cnS1)"/><g fill="#fff"><rect x="92" y="28" width="2" height="5" rx="1" transform="rotate(40 93 30)"/><rect x="104" y="30" width="2" height="5" rx="1" transform="rotate(-30 105 32)"/></g><g fill="#3fb0d8"><rect x="98" y="40" width="2" height="5" rx="1" transform="rotate(70 99 42)"/></g>' +
    '<path d="M100 16 C 102 8 108 6 112 4" stroke="#3a7a2a" stroke-width="1.6" fill="none"/><circle cx="100" cy="17" r="6.5" fill="#d4202e"/><circle cx="98" cy="15" r="1.8" fill="#fff" opacity=".6"/></g></svg>';

  var SHOP = [
    { b: 'Swimwear', s: 'Suits & cover-ups', svg: '<svg viewBox="0 0 34 40"><path d="M9 4v8c0 3 3 5 8 5s8-2 8-5V4" stroke="#0a7fa0" stroke-width="1.6" fill="none"/><path d="M7 14c3 3 6 4 10 4s7-1 10-4l1 12c-3 0-6 2-7 6l-4 4-4-4c-1-4-4-6-7-6z" fill="#1f8fb0" stroke="#0b4a6e"/><path d="M8 20c6 2 12 2 18 0M9 25c5 1.6 11 1.6 16 0" stroke="#fdf3df" stroke-width="1.6"/></svg>' },
    { b: 'Apparel', s: 'Sun hats & sandals', svg: '<svg viewBox="0 0 34 40"><ellipse cx="17" cy="25" rx="16" ry="6" fill="#f2d39a" stroke="#a87c3a"/><path d="M8 24c0-8 4-13 9-13s9 5 9 13" fill="#f6dfae" stroke="#a87c3a"/><path d="M8.4 21c5 2 12 2 17.2 0" stroke="#e0532a" stroke-width="3"/><path d="M12 13l1 2M17 11v2M22 13l-1 2" stroke="#c9a26a"/></svg>' },
    { b: 'Outdoor', s: 'Lights & lawn games', svg: '<svg viewBox="0 0 34 40"><path d="M17 4v32" stroke="#6a4a2a" stroke-width="1.8"/><path d="M2 18 C 4 8 10 4 17 4 C 24 4 30 8 32 18 C 28 15 24 15 22 18 C 20 15 14 15 12 18 C 10 15 6 15 2 18z" fill="#e0532a" stroke="#9a3414"/><path d="M12 18 C 13 10 15 6 17 4 C 19 6 21 10 22 18" fill="#fdf3df"/><path d="M4 36c4-2 8-2 13 0s9 2 13 0" stroke="#f2c88a" stroke-width="2.4" fill="none"/></svg>' },
    { b: 'Summer Foods', s: 'Grill, freeze & chill', svg: '<svg viewBox="0 0 34 40"><path d="M2 14 A15 15 0 0 0 32 14z" fill="#3fa850" stroke="#1d6a2a"/><path d="M4.4 14 A12.6 12.6 0 0 0 29.6 14z" fill="#fdf3df"/><path d="M6 14 A11 11 0 0 0 28 14z" fill="#f05a6a"/><g fill="#2a1a1a"><ellipse cx="12" cy="18" rx=".9" ry="1.5"/><ellipse cx="17" cy="21" rx=".9" ry="1.5"/><ellipse cx="22" cy="18" rx=".9" ry="1.5"/><ellipse cx="17" cy="16" rx=".9" ry="1.5"/></g><rect x="13" y="24" width="8" height="12" rx="4" fill="#ffb347"/><rect x="16" y="33" width="2.2" height="6" rx="1" fill="#c9a26a"/></svg>' }
  ];

  var GULL = '<svg viewBox="0 0 100 100"><defs><linearGradient id="glBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e0e6"/></linearGradient><linearGradient id="glPost" x1="0" x2="1"><stop offset="0" stop-color="#6a4a2a"/><stop offset=".5" stop-color="#a87c4a"/><stop offset="1" stop-color="#5a3a1a"/></linearGradient></defs>' +
    '<rect x="44" y="78" width="16" height="22" rx="2" fill="url(#glPost)"/><ellipse cx="52" cy="78" rx="8" ry="2.4" fill="#c9a26a"/>' +
    '<path d="M70 52 C 84 48 92 50 98 46 C 92 56 82 60 70 60z" fill="#6a7682"/>' +
    '<ellipse cx="54" cy="56" rx="22" ry="15" fill="url(#glBody)"/><path d="M46 50 C 58 44 74 46 84 52 C 74 58 60 60 48 58z" fill="#a9b6c2" stroke="#7f8e9c" stroke-width=".6"/><path d="M76 52 C 82 52 86 54 88 56 C 82 56 78 56 76 54z" fill="#2a3038"/>' +
    '<circle cx="36" cy="40" r="11" fill="url(#glBody)"/><path d="M26 40 L 14 42 L 26 45z" fill="#ffc22a" stroke="#c98a10" stroke-width=".6"/><circle cx="20" cy="43" r="1.2" fill="#e0402a"/>' +
    '<g class="eye"><circle cx="33" cy="37" r="2" fill="#1a1a1a"/><circle cx="32.4" cy="36.4" r=".6" fill="#fff"/></g><path d="M50 70l-1 8M58 70l1 8" stroke="#f2a03a" stroke-width="1.8" stroke-linecap="round"/></svg>';

  /* ---------- sky: the sun over the sea ---------- */
  function sea(ctx, W, H, t, info, D) {
    var hz = H * .62, f = info.frac, day = info.day, golden = day && (f < .14 || f > .86), dawn = info.frac < 0 && false;
    var sky = ctx.createLinearGradient(0, 0, 0, hz);
    if (!day) { sky.addColorStop(0, '#0a1630'); sky.addColorStop(1, '#2a3a6a'); }
    else if (golden) { sky.addColorStop(0, '#3a5a9a'); sky.addColorStop(.5, '#e98a7a'); sky.addColorStop(1, '#ffd59a'); }
    else { sky.addColorStop(0, '#3f8ad0'); sky.addColorStop(1, '#bfe6f6'); }
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, hz);
    var sx = W * (.1 + .8 * Math.min(1, Math.max(0, f))), sy = hz - Math.sin(Math.PI * Math.min(1, Math.max(0, f))) * hz * .78 + H * .04, R = Math.min(W, H) * .085;
    if (day) {
      var gl = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 6); gl.addColorStop(0, golden ? 'rgba(255,220,150,.9)' : 'rgba(255,255,230,.8)'); gl.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, hz);
      ctx.fillStyle = golden ? '#fff1c0' : '#fffbe8'; ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#fff'; for (var i = 0; i < 40; i++) { var x = (i * 97.3 % 1) * W || (i * 37 % W), y = (i * 53 % 100) / 100 * hz * .8; ctx.globalAlpha = .4 + .4 * Math.sin(t * 2 + i); ctx.fillRect((i * 131) % W, y, 1.4 * D, 1.4 * D); }
      ctx.globalAlpha = 1; ctx.fillStyle = '#f6f2e0'; ctx.beginPath(); ctx.arc(W * .7, hz * .3, R * .7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = .55; ctx.fillStyle = day ? '#ffffff' : '#8aa0c8';
    [[.2, .22, 1], [.55, .14, .7], [.82, .3, .9]].forEach(function (c, k) { var cx = ((c[0] * W + t * 8 * (k + 1) * D) % (W * 1.3)) - W * .15, cy = c[1] * hz, s = c[2] * H * .05; ctx.beginPath(); ctx.ellipse(cx, cy, s * 2.4, s * .7, 0, 0, Math.PI * 2); ctx.ellipse(cx + s * 1.2, cy - s * .4, s * 1.4, s * .7, 0, 0, Math.PI * 2); ctx.fill(); });
    ctx.globalAlpha = 1;
    var sea = ctx.createLinearGradient(0, hz, 0, H); sea.addColorStop(0, day ? (golden ? '#3f7aa0' : '#2aa6c4') : '#16284a'); sea.addColorStop(1, day ? '#0b4a6e' : '#050c1a'); ctx.fillStyle = sea; ctx.fillRect(0, hz, W, H - hz);
    var lx = day ? sx : W * .7;
    for (var j = 0; j < 16; j++) { var y2 = hz + 3 * D + j * (H - hz) / 16, w = (day ? R * 2.4 : R * 1.2) * (1 + j * .12) * (.7 + .3 * Math.sin(t * 2 + j)); ctx.globalAlpha = (day ? .8 : .45) * (1 - j / 18); ctx.fillStyle = day ? (golden ? '#ffe2a8' : '#ffffff') : '#e8eefc'; ctx.fillRect(lx - w / 2 + Math.sin(t * 1.4 + j * 1.7) * 6 * D, y2, w, 1.6 * D); }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 1.2 * D;
    for (var k2 = 0; k2 < 7; k2++) { var wy = hz + (k2 + 1) * (H - hz) / 8, off = (t * 14 * D + k2 * 40) % 80; ctx.beginPath(); for (var x2 = -80 + off; x2 < W; x2 += 80) { ctx.moveTo(x2, wy); ctx.quadraticCurveTo(x2 + 20, wy - 3 * D, x2 + 40, wy); } ctx.stroke(); }
    var shade = ctx.createLinearGradient(0, 0, W * .6, 0); shade.addColorStop(0, 'rgba(10,20,40,.45)'); shade.addColorStop(1, 'rgba(10,20,40,0)'); ctx.fillStyle = shade; ctx.fillRect(0, 0, W * .6, H);
  }

  /* ---------- wallpaper painters ---------- */
  function sunDisc(K, x, y, r, col) { K.glow(x, y, r * 8, 'rgba(255,190,120,A)', .45); K.glow(x, y, r * 2.6, 'rgba(255,235,180,A)', .7); K.ctx.fillStyle = col || '#fff3c8'; K.ctx.beginPath(); K.ctx.arc(x, y, r, 0, Math.PI * 2); K.ctx.fill(); }
  function reflection(K, x, hz, r, col, a) { var c = K.ctx; for (var j = 0; j < 40; j++) { var y = hz + K.U * .4 + j * K.U * .9, w = r * 2.6 * (1 + j * .06) * (.6 + K.r() * .5); c.globalAlpha = (a || .8) * (1 - j / 42); c.fillStyle = col; c.fillRect(x - w / 2 + (K.r() - .5) * r, y, w, K.U * (.18 + j * .012)); } c.globalAlpha = 1; }
  /* palm: a tapering curved trunk and drooping fronds with feathered leaflets */
  function palm(K, x, y, h, lean, col, leaf) {
    var c = K.ctx, U = K.U, tx = x + lean * h * .35, ty = y - h; c.strokeStyle = col; c.lineCap = 'round';
    for (var s2 = 0; s2 < 26; s2++) { var t1 = s2 / 26, t2 = (s2 + 1) / 26; c.lineWidth = U * (1.9 - t1 * .9) * h / (K.H * .5); c.beginPath(); c.moveTo(x + lean * h * .35 * t1 * t1, y - h * t1); c.lineTo(x + lean * h * .35 * t2 * t2, y - h * t2); c.stroke(); }
    c.strokeStyle = leaf || col;
    [-175, -150, -122, -95, -62, -35, -8, 18, -200].forEach(function (d, k) {
      var a = d * Math.PI / 180, l = h * (.3 + (k % 3) * .04), cx = tx + Math.cos(a) * l * .55, cy = ty + Math.sin(a) * l * .55 - l * .12, ex = tx + Math.cos(a) * l, ey = ty + Math.sin(a) * l * .35 + l * .42;
      c.lineWidth = U * .32 * h / (K.H * .5); c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(cx, cy, ex, ey); c.stroke();
      for (var t = .08; t < 1; t += .045) { var u = 1 - t, px = u * u * tx + 2 * u * t * cx + t * t * ex, py = u * u * ty + 2 * u * t * cy + t * t * ey, dx = 2 * u * (cx - tx) + 2 * t * (ex - cx), dy = 2 * u * (cy - ty) + 2 * t * (ey - cy), m = Math.hypot(dx, dy) || 1, nx = -dy / m, ny = dx / m, ll = l * .2 * (1 - t * .7);
        c.lineWidth = U * .22 * h / (K.H * .5); c.beginPath(); c.moveTo(px, py); c.lineTo(px + nx * ll + dx / m * ll * .5, py + ny * ll + dy / m * ll * .5 + ll * .35); c.moveTo(px, py); c.lineTo(px - nx * ll + dx / m * ll * .5, py - ny * ll + dy / m * ll * .5 + ll * .35); c.stroke(); }
    });
    c.fillStyle = col; for (var n = 0; n < 4; n++) { c.beginPath(); c.arc(tx + (n - 1.5) * U * .7, ty + U * .8, U * .55, 0, Math.PI * 2); c.fill(); }
  }
  function boat(K, x, y, s, col, sail) { var c = K.ctx; c.fillStyle = col; c.beginPath(); c.moveTo(x - s, y); c.lineTo(x + s, y); c.lineTo(x + s * .7, y + s * .3); c.lineTo(x - s * .7, y + s * .3); c.fill(); c.fillStyle = sail; c.beginPath(); c.moveTo(x, y - s * .1); c.lineTo(x, y - s * 2.3); c.lineTo(x + s * .85, y - s * .2); c.fill(); c.globalAlpha = .8; c.beginPath(); c.moveTo(x - s * .1, y - s * .15); c.lineTo(x - s * .1, y - s * 1.9); c.lineTo(x - s * .75, y - s * .2); c.fill(); c.globalAlpha = 1; }
  var PAINT = {
    coast: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait, hz = H * (P ? .6 : .62);
      K.sky([[0, '#21407a'], [.32, '#6a5c9c'], [.55, '#e0867a'], [.7, '#ffbf86'], [.8, '#ffe0a8']], 0, hz);
      c.fillStyle = 'rgba(255,214,190,.5)'; for (var i = 0; i < 5; i++) { var cy = H * (.12 + i * .07), cx = K.r() * W; c.beginPath(); c.ellipse(cx, cy, W * (.16 + K.r() * .12), U * (.8 + K.r()), 0, 0, Math.PI * 2); c.fill(); }
      var sx = W * (P ? .6 : .62); sunDisc(K, sx, hz - U * 2, U * (P ? 9 : 7), '#fff1c4');
      var sea = c.createLinearGradient(0, hz, 0, H); sea.addColorStop(0, '#3f7aa0'); sea.addColorStop(.3, '#1d5a82'); sea.addColorStop(1, '#062a44'); c.fillStyle = sea; c.fillRect(0, hz, W, H - hz);
      reflection(K, sx, hz, U * 8, '#ffe2a8', .85);
      var cl = c.createLinearGradient(0, hz - H * .2, 0, hz); cl.addColorStop(0, '#8a5a6a'); cl.addColorStop(1, '#3c2a44'); c.fillStyle = cl;
      c.beginPath(); c.moveTo(0, hz - H * .2); c.bezierCurveTo(W * .2, hz - H * .24, W * .3, hz - H * .2, W * .42, hz - H * .1); c.lineTo(W * .5, hz + U); c.lineTo(0, hz + U); c.fill();
      var bx = W * .02; while (bx < W * .34) { var bw = U * (2.6 + K.r() * 2), by = hz - H * .19 + (bx / W) * H * .26 + K.r() * U * 2.4, bh = U * (2 + K.r() * 1.6); c.fillStyle = K.r() < .7 ? '#f6ece2' : '#ffe2cc'; c.fillRect(bx, by - bh, bw, bh + U * 5);
        c.fillStyle = K.r() < .5 ? '#d9774a' : '#e9a07a'; c.fillRect(bx, by - bh, bw, U * .5); c.fillStyle = K.r() < .5 ? '#ffcf7a' : '#3f7aa0'; c.fillRect(bx + bw * .35, by - bh + U * .9, bw * .2, U * .9); bx += bw + U * (.3 + K.r() * .8); }
      c.fillStyle = '#4a3050'; c.beginPath(); c.moveTo(0, hz - H * .1); c.bezierCurveTo(W * .14, hz - H * .12, W * .3, hz - H * .08, W * .46, hz + U); c.lineTo(0, hz + U); c.fill();
      c.fillStyle = '#fff4ea'; var dx = W * .2, dy = hz - H * .24; c.fillRect(dx, dy, U * 4, U * 5); c.fillStyle = '#1f5fa8'; c.beginPath(); c.arc(dx + U * 2, dy, U * 2, Math.PI, 0); c.fill();
      boat(K, W * .76, hz + U * 3, U * 2.2, '#2a1f34', '#fff6ea'); boat(K, W * .3, hz + U * 6, U * 1.4, '#2a1f34', '#ffe6d0');
      c.strokeStyle = '#3a2a44'; c.lineWidth = U * .35; c.lineCap = 'round'; [[.4, .3], [.46, .26], [.7, .34]].forEach(function (g) { var gx = g[0] * W, gy = g[1] * H, s = U * 1.4; c.beginPath(); c.moveTo(gx - s, gy); c.quadraticCurveTo(gx - s / 2, gy - s * .6, gx, gy); c.quadraticCurveTo(gx + s / 2, gy - s * .6, gx + s, gy); c.stroke(); });
      palm(K, W * (P ? 1.02 : .95), H * 1.02, H * (P ? .3 : .5), -.5, '#1e1428'); palm(K, W * (P ? .06 : .04), H * 1.02, H * (P ? .26 : .44), .7, '#1e1428');
      K.vignette(.35); K.grainy(.04);
    },
    lagoon: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait, hz = H * (P ? .42 : .45);
      K.sky([[0, '#2f86d0'], [.6, '#8fd0f2'], [1, '#d8f2fb']], 0, hz);
      c.fillStyle = 'rgba(255,255,255,.9)'; for (var i = 0; i < 6; i++) { var cx = K.r() * W, cy = H * (.06 + K.r() * .22), s = U * (2 + K.r() * 3); for (var k = 0; k < 5; k++) { c.beginPath(); c.arc(cx + (k - 2) * s * .8, cy - Math.sin(k / 4 * Math.PI) * s * .7, s * (.7 + Math.sin(k / 4 * Math.PI) * .4), 0, Math.PI * 2); c.fill(); } }
      sunDisc(K, W * .82, H * .1, U * 4, '#fffef2');
      c.fillStyle = '#3a8a6a'; c.beginPath(); c.moveTo(W * .55, hz); c.quadraticCurveTo(W * .7, hz - H * .06, W * .9, hz); c.fill(); c.fillStyle = '#2f7a5a'; c.beginPath(); c.moveTo(W * .1, hz); c.quadraticCurveTo(W * .2, hz - H * .03, W * .32, hz); c.fill();
      var sea = c.createLinearGradient(0, hz, 0, H); sea.addColorStop(0, '#1f8fc0'); sea.addColorStop(.35, '#2ec4c8'); sea.addColorStop(.7, '#7fe6d6'); sea.addColorStop(1, '#c8f6e8'); c.fillStyle = sea; c.fillRect(0, hz, W, H - hz);
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = U * .2; for (var w = 0; w < 30; w++) { var wy = hz + U + K.r() * (H - hz) * .7, wx = K.r() * W; c.beginPath(); c.moveTo(wx, wy); c.quadraticCurveTo(wx + U * 2, wy - U * .5, wx + U * 4, wy); c.stroke(); }
      var sand = c.createLinearGradient(0, H * .7, 0, H); sand.addColorStop(0, '#fff3d6'); sand.addColorStop(1, '#f0d6a6'); c.fillStyle = sand;
      c.beginPath(); c.moveTo(0, H * (P ? .74 : .7)); c.bezierCurveTo(W * .35, H * (P ? .7 : .66), W * .6, H * .86, W, H * .82); c.lineTo(W, H); c.lineTo(0, H); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = U * .6; c.beginPath(); c.moveTo(0, H * (P ? .74 : .7) - U * .3); c.bezierCurveTo(W * .35, H * (P ? .7 : .66) - U * .3, W * .6, H * .86 - U * .3, W, H * .82 - U * .3); c.stroke();
      palm(K, W * (P ? .14 : .1), H * .96, H * (P ? .48 : .66), .9, '#6a4a2a', '#2f7a3a'); palm(K, W * (P ? .3 : .2), H * .98, H * (P ? .36 : .5), .55, '#5a3a20', '#3a8a44');
      c.fillStyle = 'rgba(30,60,30,.18)'; c.beginPath(); c.ellipse(W * .3, H * .93, W * .14, U * 1.5, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#e0532a'; c.beginPath(); c.moveTo(W * .7, H * .8); c.quadraticCurveTo(W * .75, H * .74, W * .8, H * .8); c.fill(); c.strokeStyle = '#6a4a2a'; c.lineWidth = U * .3; c.beginPath(); c.moveTo(W * .75, H * .78); c.lineTo(W * .74, H * .9); c.stroke();
      K.grainy(.03);
    },
    pier: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait, hz = H * (P ? .62 : .64), i;
      K.sky([[0, '#1a1840'], [.35, '#5a3a7a'], [.6, '#d0607a'], [.8, '#ff9a6a'], [1, '#ffc88a']], 0, hz);
      K.stars(80, .3, .7);
      var sea = c.createLinearGradient(0, hz, 0, H); sea.addColorStop(0, '#5a4a7a'); sea.addColorStop(1, '#120c24'); c.fillStyle = sea; c.fillRect(0, hz, W, H - hz);
      var wx = W * (P ? .58 : .66), wy = hz - H * (P ? .2 : .26), wr = H * (P ? .17 : .22);
      c.strokeStyle = '#1a1028'; c.lineWidth = U * .7; c.beginPath(); c.moveTo(wx - wr * .7, hz); c.lineTo(wx, wy); c.lineTo(wx + wr * .7, hz); c.stroke();
      c.lineWidth = U * .35; c.beginPath(); c.arc(wx, wy, wr, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(wx, wy, wr * .85, 0, Math.PI * 2); c.stroke();
      for (i = 0; i < 16; i++) { var a = i / 16 * Math.PI * 2; c.lineWidth = U * .18; c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + Math.cos(a) * wr, wy + Math.sin(a) * wr); c.stroke(); c.fillStyle = '#1a1028'; c.fillRect(wx + Math.cos(a) * wr - U * .9, wy + Math.sin(a) * wr, U * 1.8, U * 1.4); }
      c.globalCompositeOperation = 'lighter';
      for (i = 0; i < 64; i++) { var a2 = i / 64 * Math.PI * 2; K.glow(wx + Math.cos(a2) * wr, wy + Math.sin(a2) * wr, U * 1.1, ['rgba(255,220,140,A)', 'rgba(255,120,170,A)', 'rgba(120,220,255,A)'][i % 3], .9); }
      c.globalCompositeOperation = 'source-over';
      var py = hz - U * 3; c.fillStyle = '#1a1028'; c.fillRect(0, py, W, U * 1.2); for (i = 0; i < 30; i++) c.fillRect(i * W / 28, py, U * .5, hz - py + U * 6);
      c.strokeStyle = '#1a1028'; c.lineWidth = U * .2; c.beginPath(); for (i = 0; i <= 12; i++) { var lx = i * W / 12; if (i) c.quadraticCurveTo(lx - W / 24, py - U * 6, lx, py - U * 8); else c.moveTo(lx, py - U * 8); } c.stroke();
      for (i = 0; i <= 12; i++) { var lx2 = i * W / 12; c.fillRect(lx2 - U * .25, py - U * 8, U * .5, U * 8); for (var b = 1; b < 6; b++) { var bx = lx2 - W / 12 + b * W / 72, by = py - U * 8 + Math.sin(b / 6 * Math.PI) * U * 2.4; if (i) K.glow(bx, by + U * .4, U * 1.2, 'rgba(255,214,140,A)', .95); } }
      c.globalCompositeOperation = 'lighter';
      for (i = 0; i < 30; i++) { var ry = hz + U + i * U * 1.1, rw = wr * (.9 - i * .02); c.globalAlpha = .35 * (1 - i / 30); c.fillStyle = ['#ffd27a', '#ff7aa8', '#7ad6ff'][i % 3]; c.fillRect(wx - rw / 2 + (K.r() - .5) * U * 3, ry, rw, U * .25); }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      K.vignette(.4); K.grainy(.04);
    },
    solstice: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait, i;
      K.sky([[0, '#030614'], [.55, '#0c1838'], [.85, '#1e2f5a'], [1, '#3a3a6a']]);
      c.save(); c.translate(W / 2, H * .4); c.rotate(P ? -1.1 : -.35);
      for (i = 0; i < 6; i++) { var g = c.createRadialGradient(0, 0, 0, 0, 0, Math.max(W, H) * .7); g.addColorStop(0, 'rgba(200,180,255,.06)'); g.addColorStop(1, 'rgba(200,180,255,0)'); c.fillStyle = g; c.beginPath(); c.ellipse((i - 3) * U * 8, 0, Math.max(W, H) * .7, U * (6 + i * 2), 0, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = '#fff'; for (i = 0; i < 1400; i++) { var gx = (K.r() - .5) * Math.max(W, H) * 1.5, gy = (K.r() + K.r() + K.r() - 1.5) * U * 9; c.globalAlpha = K.r() * .7; c.fillRect(gx, gy, U * .12, U * .12); }
      c.globalAlpha = 1; c.fillStyle = 'rgba(40,20,50,.35)'; for (i = 0; i < 10; i++) { c.beginPath(); c.ellipse((K.r() - .5) * W, (K.r() - .5) * U * 3, U * (6 + K.r() * 12), U * (.6 + K.r()), 0, 0, Math.PI * 2); c.fill(); }
      c.restore(); K.stars(300, .8, .9);
      K.ridge(H * .74, H * .05, 4, '#0a1024', 3); K.ridge(H * .82, H * .03, 6, '#060a18', 9);
      for (i = 0; i < 9; i++) { var tx = W * (i < 4 ? i * .06 : .76 + (i - 4) * .06), th = H * (.18 + K.r() * .12); c.fillStyle = '#04060e'; c.beginPath(); c.ellipse(tx, H * .8 - th * .6, th * .18, th * .5, 0, 0, Math.PI * 2); c.fill(); c.fillRect(tx - U * .3, H * .8 - th * .2, U * .6, th * .3); }
      var fx = W * .5, fy = H * .86; K.glow(fx, fy, H * .22, 'rgba(255,150,60,A)', .35);
      c.fillStyle = '#ffd27a'; c.beginPath(); c.moveTo(fx - U * 2, fy); c.quadraticCurveTo(fx - U, fy - U * 5, fx, fy - U * 7); c.quadraticCurveTo(fx + U, fy - U * 5, fx + U * 2, fy); c.fill(); c.fillStyle = '#fff3c4'; c.beginPath(); c.moveTo(fx - U, fy); c.quadraticCurveTo(fx, fy - U * 3.4, fx + U, fy); c.fill();
      c.fillStyle = '#2a1a10'; c.save(); c.translate(fx, fy + U * .4); c.rotate(.3); c.fillRect(-U * 3, -U * .5, U * 6, U); c.rotate(-.6); c.fillRect(-U * 3, -U * .5, U * 6, U); c.restore();
      c.fillStyle = '#05070f'; c.beginPath(); c.moveTo(fx - W * .28, fy + U * .6); c.lineTo(fx - W * .2, fy - U * 9); c.lineTo(fx - W * .12, fy + U * .6); c.fill(); K.glow(fx - W * .2, fy - U * 2, U * 4, 'rgba(255,190,110,A)', .25);
      c.globalCompositeOperation = 'lighter'; for (i = 0; i < 70; i++) K.glow(K.r() * W, H * (.55 + K.r() * .4), U * (.6 + K.r() * 1.2), 'rgba(220,255,120,A)', .5 + K.r() * .5); c.globalCompositeOperation = 'source-over';
      K.vignette(.45);
    }
  };

  function pin(x, y, col, d) { return '<g transform="translate(' + x + ' ' + y + ')"><circle class="ring" r="5" fill="none" stroke="' + col + '" stroke-width="1.6" style="animation-delay:' + d + 's"/><g class="pin" style="animation-delay:' + d + 's"><path d="M0 0C-4.5-6-7-9.5-7-13.5a7 7 0 0 1 14 0C7-9.5 4.5-6 0 0z" fill="' + col + '" stroke="rgba(0,0,0,.35)" stroke-width=".8"/><circle cy="-13.5" r="2.6" fill="#fff"/></g></g>'; }
  var MAP = '<svg viewBox="0 0 132 116"><defs><linearGradient id="suChart" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fe0ec"/><stop offset="1" stop-color="#2a9ec0"/></linearGradient></defs>' +
    '<rect width="132" height="116" fill="url(#suChart)"/><path d="M0 29H132M0 58H132M0 87H132M33 0V116M66 0V116M99 0V116" stroke="#fff" stroke-opacity=".18"/>' +
    '<g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1" stroke-linecap="round"><path d="M10 14q3-3 6 0t6 0"/><path d="M96 90q3-3 6 0t6 0"/><path d="M14 92q3-3 6 0t6 0"/><path d="M104 12q3-3 6 0t6 0"/><path d="M56 104q3-3 6 0t6 0"/></g>' +
    '<path d="M44 30C60 18 92 22 100 40S96 78 78 84S38 80 34 62S30 40 44 30z" fill="#f6deaa" stroke="#fff6dc" stroke-width="3"/><path d="M52 40C64 32 84 34 90 46S84 70 72 72S48 66 46 56S44 46 52 40z" fill="#8fc46a"/>' +
    '<path d="M68 58V44" stroke="#6a4a2a" stroke-width="1.6"/><path d="M68 44c-6-2-9 1-10 3M68 44c6-2 9 1 10 3M68 44c-3-5-7-5-9-4M68 44c3-5 7-5 9-4" stroke="#2f7a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
    '<path class="route" d="M8 104C24 98 26 84 36 78M100 40C112 34 118 22 124 10" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M118 16l6-9 1 9z" fill="#fff"/><path d="M116 17h10l-2 3h-6z" fill="#0b4a6e"/>' +
    '<g transform="translate(20 22)"><circle r="10" fill="#fdf3df" stroke="#0b4a6e" stroke-width="1"/><path d="M0-9L2 0 0 9-2 0zM-9 0L0 2 9 0 0-2z" fill="#0b4a6e"/><path d="M0-9L2 0 0 0z" fill="#e0532a"/></g>' +
    pin(60, 40, '#e0532a', 0) + pin(88, 68, '#ffb347', -.8) + pin(44, 70, '#f07a8a', -1.6) +
    '<rect x="1" y="1" width="130" height="114" rx="14" fill="none" stroke="#fdf3df" stroke-width="2.4"/></svg>';

  S.landing = {
    arch: arch(),
    flank: 'su-lemon',
    plaque: { lbl: 'The Solstice Countdown', until: 'UNTIL SUMMER', during: 'SUMMER ENDS IN' },
    rules: ['The Beach Library & Drive-In', 'Boardwalk & Breezes'],
    shelf: {
      sub: 'sun-faded paperbacks for the deckchair. Pull one from the shelf.', cta: 'Library', tick: 740,
      books: [
        { t: 'The Great Gatsby', a: 'F. Scott Fitzgerald', y: 1925, w: 34, h: 184, c1: '#1f8fb0', c2: '#0b4a6e', b: 'One hot Long Island summer, Nick Carraway watches his mysterious neighbour throw glittering parties for a woman across the bay.' },
        { t: 'A Room with a View', a: 'E.M. Forster', y: 1908, w: 32, h: 176, c1: '#e0532a', c2: '#9a2e10', b: 'In a Florentine pensione, Lucy Honeychurch swaps rooms with an unconventional father and son, and her careful life tilts.' },
        { t: 'The Old Man and the Sea', s: 'Old Man and the Sea', a: 'Ernest Hemingway', y: 1952, w: 34, h: 164, c1: '#2f8a6a', c2: '#145a42', b: 'An old Cuban fisherman rows far out into the Gulf Stream and hooks the biggest marlin of his life.' },
        { t: 'The Talented Mr. Ripley', s: 'Mr. Ripley', a: 'Patricia Highsmith', y: 1955, w: 32, h: 182, c1: '#ffb347', c2: '#d4780a', lean: true, b: 'Tom Ripley is paid to bring a rich young man home from the Italian coast, and decides he would rather become him.' },
        { t: 'Tender Is the Night', a: 'F. Scott Fitzgerald', y: 1934, w: 34, h: 188, c1: '#f07a8a', c2: '#b8404e', b: 'A glamorous American couple holds court on the French Riviera, until a young film star joins them on the beach.' },
        { t: 'The Sun Also Rises', a: 'Ernest Hemingway', y: 1926, w: 30, h: 172, c1: '#e8a33a', c2: '#a8640a', b: 'Expatriates drift from Paris cafes to the bullfights of Pamplona over one restless summer.' },
        { t: 'The Blue Lagoon', a: 'Henry De Vere Stacpoole', y: 1908, w: 32, h: 178, c1: '#2ec4c8', c2: '#0f7a8a', b: 'Two shipwrecked children grow up alone on a tropical island, with a lagoon for a playground.' },
        { t: 'The Coral Island', a: 'R.M. Ballantyne', y: 1857, w: 30, h: 168, c1: '#1f5fa8', c2: '#0b2f5a', b: 'Three boys are cast away on a Pacific island and make a life of coconuts, coral reefs and adventure.' },
        { t: 'A Moveable Feast', a: 'Ernest Hemingway', y: 1964, w: 32, h: 162, c1: '#d9574a', c2: '#8a2a20', b: 'Hemingway remembers his young, poor and happy years in Paris, writing in cafes and walking the Seine.' }
      ]
    },
    cinema: {
      board: 'Tonight at the Drive-In', title: 'The Drive-In', sub: 'summer films under the stars', cta: 'Box office',
      films: [
        { title: 'Jaws', year: '1975', rating: 8.1, wikiSlug: 'Jaws_(film)' },
        { title: 'Back to the Future', year: '1985', rating: 8.5, wikiSlug: 'Back_to_the_Future' },
        { title: 'Moana', year: '2016', rating: 7.6, wikiSlug: 'Moana_(2016_film)' },
        { title: 'Lilo & Stitch', year: '2002', rating: 7.9, wikiSlug: 'Lilo_%26_Stitch' },
        { title: 'The Sandlot', year: '1993', rating: 7.8, wikiSlug: 'The_Sandlot' },
        { title: 'Luca', year: '2021', rating: 7.4, wikiSlug: 'Luca_(2021_film)' }
      ]
    },
    sound: {
      noun: 'beach radio', device: DEVICE,
      scope: ['rgba(120,230,255,.14)', 'rgba(120,230,255,.45)', '#effcff']
    },
    game: { module: 'game', sub: 'Stack the cones before they melt', art: CONE },
    wheel: { sub: 'Spin for today’s adventure', dataVar: 'SUMMER_WHEEL', style: { rim: ['#fff6e0', '#e0532a', '#ffd27a', '#1f8fb0', '#fff6e0'], inner: '#fff8ec', core: 'rgba(255,255,255,.5)', edge: 'rgba(0,0,0,.25)', text: '#ffffff', font: '700 #px "Josefin Sans", sans-serif', upper: true, spoke: '#fff6e0', bulbA: '#ffd36b', bulbB: '#ffffff', hub: ['#ffffff', '#ffd27a', '#e0532a'], hubText: '#ffffff', hubFont: '400 #px "Yeseva One", serif', pointer: '#e0532a' } },
    radar: { sub: 'Beaches, pools, markets & trails near', noun: ['spot', 'spots'], mapVar: 'SUMMER_MAP', art: MAP },
    shop: { sub: 'Swim, sun hats, patio & picnic', items: SHOP },
    sky: { icon: 'sun', small: function (i) { return 'Sun over ' + (i.place || 'the coast'); }, draw: sea,
      cells: function (i) { return [['Sunrise', i.polar ? '—' : i.hm(i.rise)], ['Sunset', i.polar ? '—' : i.hm(i.set)], ['Daylight', i.dur(i.len)]]; } },
    lore: { title: 'Postcard of the Day', hint: 'TAP FOR ANOTHER POSTCARD', perch: GULL, tick: 700 },
    walls: {
      sub: 'Golden-hour scenes for your lockscreen or desktop.', toast: 'Wallpaper sent with sunshine to your device', busy: 'Developing…',
      scenes: [
        { id: 'coast', name: 'Golden Hour Coast', sub: 'A cliff village as the sun goes down', seed: 21 },
        { id: 'lagoon', name: 'Palm Lagoon', sub: 'Turquoise shallows and white sand', seed: 8 },
        { id: 'pier', name: 'Boardwalk Dusk', sub: 'The Ferris wheel lights up the pier', seed: 33 },
        { id: 'solstice', name: 'Solstice Night', sub: 'Fireflies under the Milky Way', seed: 5 }
      ],
      paint: function (K, id) { PAINT[id](K); }
    }
  };
})(window);
