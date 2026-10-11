/* ==========================================================================
   CHRISTMAS SANCTUARY · landing config for shared/luxe/luxe-landing.js
   Books and films are real entries from the Fireside Reads and Cinema data; stations are synthesized;
   the snow globe and the four wallpapers are painted on canvas.
   ========================================================================== */
(function (global) {
  'use strict';
  var S = global.FestoLuxe.seasons.christmas;
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- header garland ---------- */
  function arch() {
    var s = '<svg viewBox="0 0 390 100">', sw = [[14, 28, 100, 74, 195, 36], [195, 36, 290, 74, 376, 28]];
    function q(p, t) { var u = 1 - t; return [u * u * p[0] + 2 * u * t * p[2] + t * t * p[4], u * u * p[1] + 2 * u * t * p[3] + t * t * p[5]]; }
    sw.forEach(function (p) {
      var d = 'M' + p[0] + ' ' + p[1] + 'Q' + p[2] + ' ' + p[3] + ' ' + p[4] + ' ' + p[5];
      s += '<path d="' + d + '" fill="none" stroke="#0b2618" stroke-width="13" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#24603d" stroke-width="10" stroke-dasharray="1.6 2.4" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#3f9562" stroke-width="6" stroke-dasharray="1 3.4" stroke-dashoffset="1.5" stroke-linecap="round"/>';
      s += '<path d="M' + p[0] + ' ' + (p[1] + 3) + 'Q' + p[2] + ' ' + (p[3] + 8) + ' ' + p[4] + ' ' + (p[5] + 3) + '" fill="none" stroke="url(#xmGold)" stroke-width="1.1" stroke-dasharray="3 3"/>';
      for (var i = 1; i < 12; i++) { var pt = q(p, i / 12), c = ['#ffe28a', '#ff6b6b', '#8ef0b0', '#ffd36b', '#9cc8ff'][i % 5]; s += '<circle class="tw" style="animation-delay:-' + (i * .37).toFixed(2) + 's" cx="' + pt[0].toFixed(1) + '" cy="' + (pt[1] + 4).toFixed(1) + '" r="2.3" fill="' + c + '"/>'; }
      [.28, .62].forEach(function (t, k) { var pt = q(p, t), len = 14 + k * 10; s += '<path d="M' + pt[0].toFixed(1) + ' ' + pt[1].toFixed(1) + 'v' + len + '" stroke="url(#xmGold)" stroke-width=".8"/><rect x="' + (pt[0] - 3).toFixed(1) + '" y="' + (pt[1] + len - 1).toFixed(1) + '" width="6" height="3.4" rx=".8" fill="url(#xmGold)"/><circle cx="' + pt[0].toFixed(1) + '" cy="' + (pt[1] + len + 9).toFixed(1) + '" r="7.5" fill="url(#' + (k ? 'xmGlassG' : 'xmGlass') + ')"/><ellipse cx="' + (pt[0] - 2.5).toFixed(1) + '" cy="' + (pt[1] + len + 6).toFixed(1) + '" rx="2" ry="1.2" fill="#fff" opacity=".6"/>'; });
    });
    return s + '<use href="#xm-wreath" x="171" y="10" width="48" height="48"/></svg>';
  }

  /* ---------- the cathedral radio ---------- */
  function cathedral() {
    var spind = '';
    for (var x = 84; x <= 236; x += 13) { var u = (x - 160) / 92, top = 84 - 52 * Math.sqrt(Math.max(0, 1 - u * u)); spind += '<path d="M' + x + ' 118V' + (top + 4).toFixed(1) + '" stroke="#e6bf6a" stroke-width="2.2" stroke-linecap="round"/>'; }
    return '<svg class="rad" viewBox="0 0 320 176" aria-hidden="true"><defs>' +
      '<linearGradient id="crWood" x1="0" x2="1"><stop offset="0" stop-color="#2a1006"/><stop offset=".18" stop-color="#6e3416"/><stop offset=".42" stop-color="#a5592a"/><stop offset=".6" stop-color="#7e3f1a"/><stop offset=".85" stop-color="#4a200a"/><stop offset="1" stop-color="#220c04"/></linearGradient>' +
      '<linearGradient id="crShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>' +
      '<radialGradient id="crCloth" cx="50%" cy="60%" r="65%"><stop offset="0" stop-color="#b3283a"/><stop offset=".7" stop-color="#6e0e1c"/><stop offset="1" stop-color="#3a040c"/></radialGradient>' +
      '<radialGradient id="crGlow" cx="50%" cy="62%" r="55%"><stop offset="0" stop-color="#ffd27a" stop-opacity=".95"/><stop offset=".55" stop-color="#ff9a3a" stop-opacity=".35"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="crKnob" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff2c4"/><stop offset=".45" stop-color="#c9952e"/><stop offset="1" stop-color="#4a2e06"/></radialGradient>' +
      '<radialGradient id="crLamp"><stop offset="0" stop-color="#fffbe0"/><stop offset=".4" stop-color="#ffd36b"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="160" cy="170" rx="132" ry="5" fill="#000" opacity=".45"/>' +
      '<rect x="26" y="158" width="268" height="10" rx="4" fill="#2a1006"/><rect x="40" y="166" width="22" height="6" rx="2" fill="#1a0904"/><rect x="258" y="166" width="22" height="6" rx="2" fill="#1a0904"/>' +
      '<path d="M34 160V86C34 36 92 10 160 10S286 36 286 86V160z" fill="url(#crWood)" stroke="#1a0904" stroke-width="2"/><path d="M34 160V86C34 36 92 10 160 10S286 36 286 86V160z" fill="url(#crShade)"/>' +
      '<path d="M46 154V88C46 46 100 22 160 22S274 46 274 88V154" fill="none" stroke="url(#xmGold)" stroke-width="1.8"/>' +
      '<g fill="#3a1808"><rect x="50" y="92" width="16" height="62" rx="3"/><rect x="254" y="92" width="16" height="62" rx="3"/></g><path d="M54 96v54M58 96v54M62 96v54M258 96v54M262 96v54M266 96v54" stroke="#6e3416" stroke-width="1.2"/>' +
      '<path class="spk" d="M70 120V84C70 52 112 32 160 32S250 52 250 84V120z" fill="url(#crCloth)" stroke="#1a0904" stroke-width="1.5"/>' +
      '<path class="glow" d="M70 120V84C70 52 112 32 160 32S250 52 250 84V120z" fill="url(#crGlow)"/>' +
      spind +
      '<path d="M84 84C100 60 124 50 160 48C196 50 220 60 236 84" fill="none" stroke="url(#xmGold)" stroke-width="2"/><path d="M98 104C112 92 136 86 160 86C184 86 208 92 222 104" fill="none" stroke="url(#xmGold)" stroke-width="1.6"/>' +
      '<circle cx="160" cy="64" r="16" fill="#3a040c" stroke="url(#xmGold)" stroke-width="2.4"/><path d="M160 50v28M146 64h28M150 54l20 20M170 54l-20 20" stroke="url(#xmGold)" stroke-width="1.8" stroke-linecap="round"/><circle cx="160" cy="64" r="3.6" fill="url(#xmGold)"/>' +
      '<path d="M70 120H250" stroke="#e6bf6a" stroke-width="2.4"/>' +
      '<rect x="118" y="128" width="84" height="18" rx="9" fill="#f6ead0" stroke="url(#xmGold)" stroke-width="1.6"/><path d="M128 137h64" stroke="#a5592a" stroke-width=".8" stroke-dasharray="1 5"/><circle class="lamp" cx="160" cy="137" r="12" fill="url(#crLamp)"/><path d="M160 130v14" stroke="#c8283a" stroke-width="1.8"/>' +
      '<circle cx="88" cy="137" r="11" fill="url(#crKnob)" stroke="#2a1006"/><circle cx="232" cy="137" r="11" fill="url(#crKnob)" stroke="#2a1006"/><path d="M88 128v6M232 128v6" stroke="#3a2208" stroke-width="1.6"/>' +
      '<path d="M50 42C72 18 116 4 160 4S248 18 270 42C258 34 240 30 226 32C212 24 188 20 172 22C156 18 136 20 122 24C104 22 84 26 72 34C64 34 56 38 50 42z" fill="#f4f8fd"/><path d="M76 34c4 6 10 8 16 6M160 22c2 6 8 8 14 6M230 34c-4 6-10 8-16 6" stroke="#cfdcea" stroke-width="1.4" fill="none"/>' +
      '<use href="#xm-holly" x="214" y="-8" width="58" height="58"/><g transform="translate(110 -4) scale(-1 1)"><use href="#xm-holly" width="46" height="46"/></g></svg>';
  }
  var DEVICE = cathedral();

  /* ---------- workshop gift ---------- */
  var GIFT = '<svg class="game-art" viewBox="0 0 200 170" width="160" height="136" aria-hidden="true"><defs>' +
    '<linearGradient id="gfBox" x1="0" x2="1"><stop offset="0" stop-color="#6e0c18"/><stop offset=".35" stop-color="#c8283a"/><stop offset=".7" stop-color="#a51a2c"/><stop offset="1" stop-color="#4e0610"/></linearGradient>' +
    '<linearGradient id="gfLid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2404f"/><stop offset="1" stop-color="#8e1424"/></linearGradient>' +
    '<radialGradient id="gfGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>' +
    '<ellipse cx="100" cy="92" rx="92" ry="70" fill="url(#gfGlow)"/><ellipse cx="100" cy="160" rx="64" ry="6" fill="#000" opacity=".5"/>' +
    '<rect x="46" y="80" width="108" height="78" rx="3" fill="url(#gfBox)"/><path d="M46 92h108" stroke="#000" stroke-opacity=".25"/><rect x="91" y="80" width="18" height="78" fill="url(#xmGold)"/><path d="M60 100l6 6M130 124l6 6M70 140l6 6M120 96l6 6" stroke="#ffd9a0" stroke-opacity=".35" stroke-width="2"/>' +
    '<g class="lid"><rect x="38" y="64" width="124" height="22" rx="3" fill="url(#gfLid)"/><rect x="89" y="64" width="22" height="22" fill="url(#xmGold)"/>' +
    '<path d="M100 64 C 82 40 56 44 64 58 C 70 68 90 66 100 64z" fill="url(#xmGold)" stroke="#7a5414" stroke-width="1"/><path d="M100 64 C 118 40 144 44 136 58 C 130 68 110 66 100 64z" fill="url(#xmGold)" stroke="#7a5414" stroke-width="1"/>' +
    '<path d="M76 55c6 0 14 4 20 8M124 55c-6 0-14 4-20 8" stroke="#8a5e14" stroke-width="1" fill="none"/><circle cx="100" cy="63" r="6" fill="url(#xmGold)" stroke="#7a5414"/></g>' +
    '<g fill="#fff6d0" class="spk"><path d="M30 40l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M166 30l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z"/><path d="M172 100l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4z"/></g></svg>';

  /* ---------- shop ---------- */
  var SHOP = [
    { b: 'Apparel', s: 'Sweaters & pajamas', svg: '<svg viewBox="0 0 34 40"><path d="M10 6l-8 6 3 8 4-2v18h16V18l4 2 3-8-8-6c-1 3-4 5-7 5s-6-2-7-5z" fill="#b3202e" stroke="#5a0610"/><path d="M9 22h16M9 27h16" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 2"/><path d="M9 34h16" stroke="#1f6a40" stroke-width="3"/><path d="M14 6c1 2 2 3 3 3s2-1 3-3" stroke="#fff" fill="none"/></svg>' },
    { b: 'Decorations', s: 'Lights & ornaments', svg: '<svg viewBox="0 0 34 40"><path d="M17 1v6" stroke="#c9952e"/><rect x="13" y="6" width="8" height="5" rx="1" fill="#e6bf6a"/><circle cx="17" cy="24" r="13" fill="url(#xmGlassG)"/><path d="M5 24c6 3 18 3 24 0" stroke="#f6d58a" stroke-width="1.6" fill="none"/><ellipse cx="12" cy="18" rx="3.4" ry="2" transform="rotate(-35 12 18)" fill="#fff" opacity=".5"/></svg>' },
    { b: 'Crafts', s: 'Kits for the table', svg: '<svg viewBox="0 0 34 40"><rect x="6" y="12" width="22" height="20" rx="2" fill="#e6bf6a" stroke="#7a5414"/><rect x="6" y="15" width="22" height="14" fill="#c8283a"/><path d="M6 22h22" stroke="#fff" stroke-width=".8" stroke-dasharray="1.5 1.5"/><path d="M28 22c4 0 5 6 1 9s-6 6-3 8" stroke="#c8283a" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="17" cy="12" rx="11" ry="3" fill="#f6d58a" stroke="#7a5414"/><ellipse cx="17" cy="12" rx="3" ry="1" fill="#7a5414"/></svg>' },
    { b: 'Treats', s: 'Cocoa & baking', svg: '<svg viewBox="0 0 34 40"><path d="M11 9c-2-3 2-4 0-7M17 9c-2-3 2-4 0-7M23 9c-2-3 2-4 0-7" stroke="#e6dccb" stroke-width="1.4" fill="none" opacity=".8" stroke-linecap="round"/><path d="M5 13h22v17a6 6 0 0 1-6 6H11a6 6 0 0 1-6-6z" fill="#f4ede0" stroke="#7a5a3a"/><path d="M5 18h22" stroke="#b3202e" stroke-width="3"/><path d="M27 17h2a4 4 0 0 1 0 8h-2" stroke="#7a5a3a" stroke-width="2.4" fill="none"/><ellipse cx="16" cy="13" rx="11" ry="2.4" fill="#5a3418"/><path d="M8 5v14c0 2 3 2 3 0" stroke="#fff" stroke-width="2.4" fill="none"/><path d="M8 6v2M8 11v2M8 16v2" stroke="#d4202e" stroke-width="2.4"/></svg>' }
  ];

  /* ---------- robin on holly ---------- */
  var ROBIN = '<svg viewBox="0 0 100 100"><defs><radialGradient id="rbBody" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#8a7562"/><stop offset="1" stop-color="#3e3026"/></radialGradient><radialGradient id="rbBreast" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#ff9a5a"/><stop offset=".6" stop-color="#d9572b"/><stop offset="1" stop-color="#9a3412"/></radialGradient></defs>' +
    '<path d="M18 92 C 40 86 70 86 100 80" stroke="#4a2c14" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<g transform="translate(10 66) scale(.7)"><use href="#xm-holly" width="50" height="50"/></g><g transform="translate(70 62) scale(.6) rotate(20)"><use href="#xm-holly" width="50" height="50"/></g>' +
    '<path d="M70 62 C 82 56 90 52 96 46 C 92 58 84 64 74 68z" fill="#3e3026"/>' +
    '<ellipse cx="54" cy="62" rx="22" ry="19" fill="url(#rbBody)"/><path d="M36 56 C 36 70 46 80 58 80 C 50 74 46 64 46 54z" fill="url(#rbBreast)"/>' +
    '<circle cx="40" cy="44" r="13" fill="url(#rbBody)"/><path d="M30 46 C 30 54 38 58 44 56 C 40 52 38 48 38 44z" fill="url(#rbBreast)"/>' +
    '<path d="M28 42 L 18 45 L 28 47z" fill="#3a2410"/><g class="eye"><circle cx="35" cy="41" r="2.4" fill="#120a04"/><circle cx="34.3" cy="40.3" r=".7" fill="#fff"/></g>' +
    '<path d="M58 60 C 66 58 72 62 74 68 C 66 68 60 66 58 60z" fill="#5a4636"/><path d="M50 80l-2 10M58 80l1 10" stroke="#6a4a2a" stroke-width="1.6" stroke-linecap="round"/></svg>';

  /* ---------- snow globe sky ---------- */
  var flakes = []; (function () { var r = rng(9); for (var i = 0; i < 70; i++) flakes.push({ x: r() * 2 - 1, y: r() * 2 - 1, s: .5 + r() * 1.4, w: r() * 6.3, v: .04 + r() * .08 }); })();
  function globe(ctx, W, H, t, info, D, dt) {
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b1d30'); g.addColorStop(1, '#050d16'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    [[.12, .3, '#ffcf6b'], [.3, .7, '#ff6b6b'], [.08, .82, '#8ef0b0'], [.42, .2, '#ffd36b']].forEach(function (b, i) {
      var x = b[0] * W, y = b[1] * H, rr = H * .12, gg = ctx.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, b[2] + '55'); gg.addColorStop(1, b[2] + '00'); ctx.fillStyle = gg; ctx.globalAlpha = .55 + .45 * Math.sin(t * 1.3 + i * 2); ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2); ctx.globalAlpha = 1;
    });
    var R = Math.min(H * .36, W * .27), cx = W - R * 1.32, cy = H * .42;
    /* base */
    var by = cy + R * .82, bw = R * 1.25;
    var wood = ctx.createLinearGradient(0, by, 0, by + R * .5); wood.addColorStop(0, '#7a3a1f'); wood.addColorStop(.5, '#4a2010'); wood.addColorStop(1, '#22100a');
    ctx.fillStyle = wood; ctx.beginPath(); ctx.moveTo(cx - bw * .78, by); ctx.lineTo(cx + bw * .78, by); ctx.lineTo(cx + bw, by + R * .5); ctx.lineTo(cx - bw, by + R * .5); ctx.closePath(); ctx.fill();
    var gold = ctx.createLinearGradient(cx - bw, 0, cx + bw, 0); gold.addColorStop(0, '#8a5e14'); gold.addColorStop(.5, '#f6d58a'); gold.addColorStop(1, '#8a5e14');
    ctx.fillStyle = gold; ctx.fillRect(cx - bw * .8, by - 2 * D, bw * 1.6, 4 * D); ctx.fillRect(cx - bw * .99, by + R * .46, bw * 1.98, 3 * D);
    ctx.fillStyle = gold; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - R * .34, by + R * .16, R * .68, R * .2, 3 * D) : ctx.rect(cx - R * .34, by + R * .16, R * .68, R * .2); ctx.fill();
    ctx.fillStyle = '#3a2208'; ctx.font = '700 ' + Math.round(R * .1) + 'px "Playfair Display SC", serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('NOEL', cx, by + R * .265);
    /* inside the glass */
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    var day = info.day, sg = ctx.createLinearGradient(0, cy - R, 0, cy + R);
    sg.addColorStop(0, day ? '#5b86b8' : '#071628'); sg.addColorStop(1, day ? '#c7dcef' : '#29496b'); ctx.fillStyle = sg; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    var mx = cx + R * .38, my = cy - R * .42; ctx.fillStyle = day ? 'rgba(255,248,220,.95)' : '#f8f4e2'; ctx.beginPath(); ctx.arc(mx, my, R * .13, 0, Math.PI * 2); ctx.fill();
    var mg = ctx.createRadialGradient(mx, my, 0, mx, my, R * .5); mg.addColorStop(0, 'rgba(255,250,230,.35)'); mg.addColorStop(1, 'rgba(255,250,230,0)'); ctx.fillStyle = mg; ctx.fillRect(mx - R * .5, my - R * .5, R, R);
    ctx.fillStyle = '#e6eef8'; ctx.beginPath(); ctx.ellipse(cx, cy + R * .78, R * 1.1, R * .5, 0, 0, Math.PI * 2); ctx.fill();
    function house(x, w, h, c) { var b = cy + R * .44; ctx.fillStyle = c; ctx.fillRect(x, b - h, w, h); ctx.beginPath(); ctx.moveTo(x - w * .12, b - h); ctx.lineTo(x + w / 2, b - h - w * .5); ctx.lineTo(x + w * 1.12, b - h); ctx.fill(); ctx.fillStyle = '#f4f8fd'; ctx.beginPath(); ctx.moveTo(x - w * .14, b - h + 1); ctx.lineTo(x + w / 2, b - h - w * .54); ctx.lineTo(x + w * 1.14, b - h + 1); ctx.lineTo(x + w * 1.0, b - h + w * .1); ctx.lineTo(x + w / 2, b - h - w * .36); ctx.lineTo(x, b - h + w * .1); ctx.fill();
      var wl = ctx.createRadialGradient(x + w * .5, b - h * .45, 0, x + w * .5, b - h * .45, w * .5); wl.addColorStop(0, 'rgba(255,230,150,1)'); wl.addColorStop(1, 'rgba(255,170,60,.0)'); ctx.fillStyle = wl; ctx.fillRect(x - w * .2, b - h - w * .1, w * 1.4, h); ctx.fillStyle = '#ffd88a'; ctx.fillRect(x + w * .38, b - h * .62, w * .24, h * .3); }
    house(cx - R * .46, R * .3, R * .26, '#1d3048'); house(cx - R * .08, R * .26, R * .34, '#162a40'); house(cx + R * .26, R * .24, R * .22, '#1d3048');
    ctx.fillStyle = '#123a28'; [[-.72, .5, .32], [.62, .5, .28], [.8, .56, .2]].forEach(function (p) { var x = cx + p[0] * R, y = cy + p[1] * R, h = p[2] * R; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + h * .4, y); ctx.lineTo(x - h * .4, y); ctx.fill(); });
    ctx.fillStyle = '#fff';
    flakes.forEach(function (f) {
      f.y += f.v * (dt || .016) * 1.4; f.x += Math.sin(t * .7 + f.w + f.y * 3) * .002;
      if (f.y > .62 || Math.hypot(f.x, f.y) > .98) { f.y = -.95 + Math.random() * .3; f.x = Math.random() * 1.6 - .8; }
      ctx.globalAlpha = .55 + .45 * Math.sin(f.w + t); ctx.beginPath(); ctx.arc(cx + f.x * R, cy + f.y * R, f.s * D * Math.max(1, R / 110), 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    var edge = ctx.createRadialGradient(cx, cy, R * .7, cx, cy, R); edge.addColorStop(0, 'rgba(180,210,255,0)'); edge.addColorStop(1, 'rgba(200,225,255,.35)'); ctx.fillStyle = edge; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 2.5 * D; ctx.beginPath(); ctx.arc(cx, cy, R * .86, Math.PI * 1.08, Math.PI * 1.42); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.ellipse(cx - R * .36, cy - R * .52, R * .16, R * .07, -.7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(220,235,255,.35)'; ctx.lineWidth = 1.2 * D; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  }
  function daysTo(now, m, d) { var t = new Date(now.getFullYear(), m, d); if (t < new Date(now.getFullYear(), now.getMonth(), now.getDate())) t = new Date(now.getFullYear() + 1, m, d); return Math.round((t - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5); }

  /* ---------- wallpaper painters ---------- */
  function snowfall(K, n, big) { var c = K.ctx; c.fillStyle = '#fff'; for (var i = 0; i < n; i++) { var s = (K.r() * K.r() * (big || 1) * .7 + .12) * K.U; c.globalAlpha = .35 + K.r() * .6; c.beginPath(); c.arc(K.r() * K.W, K.r() * K.H, s, 0, Math.PI * 2); c.fill(); } c.globalAlpha = 1; }
  function moon(K, x, y, r) { var c = K.ctx; K.glow(x, y, r * 7, 'rgba(200,220,255,A)', .25); K.glow(x, y, r * 2.4, 'rgba(255,250,230,A)', .4); var g = c.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r); g.addColorStop(0, '#fffdf2'); g.addColorStop(1, '#e6e1cc'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.fillStyle = 'rgba(160,150,120,.18)'; [[.3, -.2, .22], [-.25, .25, .16], [.1, .4, .12]].forEach(function (m) { c.beginPath(); c.arc(x + m[0] * r, y + m[1] * r, m[2] * r, 0, Math.PI * 2); c.fill(); }); }
  function house(K, x, base, w, h, body) {
    var c = K.ctx, ridge = base - h - w * .45;
    c.fillStyle = body; c.beginPath(); c.moveTo(x, base); c.lineTo(x, base - h); c.lineTo(x + w / 2, ridge); c.lineTo(x + w, base - h); c.lineTo(x + w, base); c.fill();
    var cx = x + w * (K.r() < .5 ? .25 : .72); c.fillRect(cx - w * .06, ridge + w * .05, w * .12, w * .3);
    c.fillStyle = '#eef4fb'; c.beginPath(); c.moveTo(x - w * .08, base - h + w * .02); c.lineTo(x + w / 2, ridge - w * .05); c.lineTo(x + w * 1.08, base - h + w * .02); c.lineTo(x + w, base - h + w * .09); c.quadraticCurveTo(x + w / 2, ridge + w * .1, x, base - h + w * .09); c.fill();
    c.fillRect(cx - w * .08, ridge + w * .02, w * .16, w * .05);
    var rows = Math.max(1, Math.floor(h / (w * .36))), cols = 2;
    for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) { if (K.r() < .22) continue; var wx = x + w * (.18 + i * .46), wy = base - h + w * .14 + j * w * .34, ww = w * .18, wh = w * .22;
      K.glow(wx + ww / 2, wy + wh / 2, w * .38, 'rgba(255,190,90,A)', .35); c.fillStyle = '#ffd98a'; c.fillRect(wx, wy, ww, wh); c.fillStyle = body; c.fillRect(wx + ww / 2 - w * .008, wy, w * .016, wh); c.fillRect(wx, wy + wh / 2 - w * .008, ww, w * .016); }
    c.fillStyle = '#3a1a0c'; c.fillRect(x + w * .42, base - w * .3, w * .16, w * .3);
  }
  function star5(c, x, y, r, rot) { c.beginPath(); for (var i = 0; i < 10; i++) { var a = rot + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; c.lineTo(x + Math.sin(a) * rr, y - Math.cos(a) * rr); } c.closePath(); }
  var PAINT = {
    village: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait;
      K.sky([[0, '#040a16'], [.45, '#0c2340'], [.75, '#24476b'], [1, '#3a6188']]);
      K.stars(P ? 220 : 300, .55); moon(K, W * .72, H * (P ? .15 : .2), U * (P ? 7 : 8));
      K.ridge(H * .64, H * .04, 5, '#3b5d80', 3); K.ridge(H * .67, H * .03, 7, '#2a4a6a', 8);
      for (var x = -U * 2; x < W + U * 4; x += U * (2 + K.r() * 3)) K.pine(x, H * .68 + K.r() * H * .01, U * (5 + K.r() * 5), '#143049', 'rgba(220,235,255,.55)');
      var base = H * .76, x2 = -U * 4;
      while (x2 < W) { var w = U * (10 + K.r() * 6), h = U * (8 + K.r() * 6);
        if (Math.abs(x2 + w / 2 - W / 2) < U * 9) { var cw = U * 14, cx = W / 2 - cw / 2; c.fillStyle = '#0c1a2a'; c.fillRect(cx, base - U * 16, cw, U * 16); c.fillRect(cx + cw * .32, base - U * 30, cw * .36, U * 16); c.beginPath(); c.moveTo(cx + cw * .26, base - U * 30); c.lineTo(W / 2, base - U * 44); c.lineTo(cx + cw * .74, base - U * 30); c.fill();
          c.fillStyle = '#eef4fb'; c.beginPath(); c.moveTo(cx + cw * .24, base - U * 29.6); c.lineTo(W / 2, base - U * 44.6); c.lineTo(cx + cw * .76, base - U * 29.6); c.lineTo(cx + cw * .7, base - U * 29); c.lineTo(W / 2, base - U * 41); c.lineTo(cx + cw * .3, base - U * 29); c.fill();
          K.glow(W / 2, base - U * 24, U * 9, 'rgba(255,200,110,A)', .45); c.fillStyle = '#ffd98a'; c.beginPath(); c.arc(W / 2, base - U * 25, U * 1.6, Math.PI, 0); c.lineTo(W / 2 + U * 1.6, base - U * 21.5); c.lineTo(W / 2 - U * 1.6, base - U * 21.5); c.fill();
          c.beginPath(); c.arc(W / 2, base - U * 7, U * 2.6, Math.PI, 0); c.lineTo(W / 2 + U * 2.6, base); c.lineTo(W / 2 - U * 2.6, base); c.fill();
          x2 = cx + cw + U; continue; }
        house(K, x2, base, w, h, K.r() < .5 ? '#0d1d2e' : '#112539'); x2 += w + U * (1 + K.r() * 2); }
      [W * .3, W * .7].forEach(function (lx) { c.fillStyle = '#06101a'; c.fillRect(lx - U * .3, base - U * 12, U * .6, U * 13); c.fillStyle = '#ffe2a0'; c.fillRect(lx - U * .8, base - U * 13.6, U * 1.6, U * 1.8); K.glow(lx, base - U * 12.8, U * 7, 'rgba(255,200,110,A)', .45); });
      var sn = c.createLinearGradient(0, base, 0, H); sn.addColorStop(0, '#dfe9f5'); sn.addColorStop(1, '#8aa3c0'); c.fillStyle = sn; c.beginPath(); c.moveTo(0, base + U); c.quadraticCurveTo(W * .3, base - U * 1.5, W * .55, base + U * .8); c.quadraticCurveTo(W * .8, base + U * 2, W, base); c.lineTo(W, H); c.lineTo(0, H); c.fill();
      K.pine(W * .06, H * 1.02, H * (P ? .3 : .44), '#0a2016', '#e6eef8'); K.pine(W * .94, H * 1.03, H * (P ? .34 : .48), '#0a2016', '#e6eef8');
      snowfall(K, Math.round(W * H / 5000), 1.3); K.vignette(.45);
    },
    tree: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait, i;
      var bg = c.createRadialGradient(W / 2, H * .55, 0, W / 2, H * .55, Math.max(W, H) * .8); bg.addColorStop(0, '#3a1810'); bg.addColorStop(.5, '#1c0a08'); bg.addColorStop(1, '#070302'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
      for (i = 0; i < (P ? 40 : 70); i++) { var col = ['rgba(255,200,110,A)', 'rgba(255,90,90,A)', 'rgba(120,230,160,A)'][i % 3]; K.glow(K.r() * W, K.r() * H, U * (2 + K.r() * 6), col, .12 + K.r() * .18); }
      var cx = W / 2, base = H * .84, h = H * (P ? .62 : .7), top = base - h, hw = h * .36;
      K.glow(cx, base - h * .45, h * .7, 'rgba(255,190,100,A)', .2);
      for (i = 0; i < 6; i++) { var ty = top + h * .1 + i * h * .14, by = ty + h * .26, w = hw * (.28 + i * .15);
        var g = c.createLinearGradient(cx - w, 0, cx + w, 0); g.addColorStop(0, '#06200f'); g.addColorStop(.45, '#1d5a35'); g.addColorStop(.6, '#246b40'); g.addColorStop(1, '#06200f');
        c.fillStyle = g; c.beginPath(); c.moveTo(cx, ty - h * .05); c.lineTo(cx + w, by);
        for (var k = 6; k >= 0; k--) { var bx = cx - w + (k / 6) * w * 2; c.quadraticCurveTo(bx + w / 6, by + h * .025, bx, by); }
        c.closePath(); c.fill(); }
      c.globalCompositeOperation = 'lighter';
      for (i = 0; i < 260; i++) { var t = i / 260, y = top + h * .08 + t * h * .82, ww = hw * (.12 + t * .95), a = t * Math.PI * 14, x = cx + Math.sin(a) * ww * .92, front = Math.cos(a);
        if (front < -.3) continue; var lc = ['rgba(255,226,150,A)', 'rgba(255,120,120,A)', 'rgba(150,240,190,A)', 'rgba(255,214,107,A)'][i % 4]; K.glow(x, y, U * (1.2 + front * .6), lc, .7 + front * .3); }
      c.globalCompositeOperation = 'source-over';
      for (i = 0; i < 38; i++) { var t2 = .12 + K.r() * .82, y2 = top + h * .1 + t2 * h * .8, w2 = hw * (.12 + t2 * .9) * .8, x3 = cx + (K.r() * 2 - 1) * w2, rr = U * (1 + K.r() * .9);
        var bc = [['#ff9a9a', '#c8283a', '#4e0610'], ['#fff2c4', '#d4a23a', '#5a3a08'], ['#bcd8ff', '#2f6ac8', '#0b2050']][i % 3], gb = c.createRadialGradient(x3 - rr * .35, y2 - rr * .35, 0, x3, y2, rr);
        gb.addColorStop(0, bc[0]); gb.addColorStop(.5, bc[1]); gb.addColorStop(1, bc[2]); c.fillStyle = gb; c.beginPath(); c.arc(x3, y2, rr, 0, Math.PI * 2); c.fill(); }
      K.glow(cx, top + h * .04, U * 14, 'rgba(255,230,150,A)', .7); var sg = c.createLinearGradient(cx - U * 4, top - U * 4, cx + U * 4, top + U * 4); sg.addColorStop(0, '#fff8d6'); sg.addColorStop(.5, '#f6c650'); sg.addColorStop(1, '#a8740e'); c.fillStyle = sg; star5(c, cx, top + h * .03, U * 4.2, 0); c.fill();
      c.fillStyle = '#3a1a0c'; c.fillRect(cx - U * 1.6, base - U * 2, U * 3.2, U * 4);
      var gifts = [[-.52, 9, 7, '#c8283a', '#f6d58a'], [-.3, 7, 5.5, '#1f6a40', '#f4e6c8'], [.28, 8, 6.5, '#2f4f9a', '#f6d58a'], [.5, 6.5, 8, '#f4e6c8', '#c8283a'], [.04, 10, 5, '#8e1b26', '#f6d58a']];
      gifts.forEach(function (gf) { var gw = U * gf[1], gh = U * gf[2], gx = cx + gf[0] * hw * 1.6 - gw / 2, gy = base + U * 2 - gh; c.fillStyle = gf[3]; c.fillRect(gx, gy, gw, gh); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(gx + gw * .7, gy, gw * .3, gh); c.fillStyle = gf[4]; c.fillRect(gx + gw * .44, gy, gw * .12, gh); c.fillRect(gx, gy + gh * .3, gw, gh * .1);
        c.beginPath(); c.ellipse(gx + gw * .4, gy - U * .6, U * 1.3, U * .7, -.4, 0, Math.PI * 2); c.ellipse(gx + gw * .6, gy - U * .6, U * 1.3, U * .7, .4, 0, Math.PI * 2); c.fill(); });
      var fl = c.createLinearGradient(0, base + U * 2, 0, H); fl.addColorStop(0, 'rgba(60,24,12,.9)'); fl.addColorStop(1, '#050202'); c.fillStyle = fl; c.fillRect(0, base + U * 2, W, H);
      K.glow(cx, base + U * 3, h * .5, 'rgba(255,170,80,A)', .18); K.vignette(.55);
    },
    aurora: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait;
      K.sky([[0, '#02080f'], [.5, '#06202a'], [1, '#0d3a44']]); K.stars(P ? 260 : 360, .6, .8);
      c.globalCompositeOperation = 'lighter';
      [['rgba(70,255,170,A)', .2, 3.2, 0], ['rgba(60,210,255,A)', .26, 2.4, 2], ['rgba(180,110,255,A)', .14, 4.1, 4]].forEach(function (b) {
        var r2 = rng(Math.round(b[3] * 99 + 5)), ph = r2() * 6;
        for (var x = 0; x < W; x += 2) { var u = x / W, y = H * (b[1] + Math.sin(u * b[2] * 3 + ph) * .05 + Math.sin(u * 13 + ph) * .012), len = H * (.16 + .1 * Math.sin(u * 7 + ph * 2)), a = .07 + .06 * Math.sin(u * 23 + ph);
          var g = c.createLinearGradient(0, y, 0, y + len); g.addColorStop(0, b[0].replace('A', 0)); g.addColorStop(.15, b[0].replace('A', a * 1.8)); g.addColorStop(1, b[0].replace('A', 0)); c.fillStyle = g; c.fillRect(x, y, 2, len); }
      });
      c.globalCompositeOperation = 'source-over';
      var mx = W * (P ? .3 : .24), my = H * .2, mr = U * 4.5; moon(K, mx, my, mr);
      c.fillStyle = '#05131a'; c.save(); c.translate(mx - mr * 2.2, my + mr * .2); var sc = mr / 11; c.scale(sc, sc);
      for (var d = 0; d < 4; d++) { var dx = 30 + d * 10; c.beginPath(); c.ellipse(dx, 0, 4, 1.8, 0, 0, Math.PI * 2); c.fill(); c.fillRect(dx + 3, -3, 1.2, 3); c.beginPath(); c.arc(dx + 4.2, -3.6, 1.2, 0, Math.PI * 2); c.fill();
        c.fillRect(dx - 3, 1, .7, 3); c.fillRect(dx + 2, 1, .7, 3); c.strokeStyle = '#05131a'; c.lineWidth = .5; c.beginPath(); c.moveTo(dx + 4, -4.5); c.lineTo(dx + 3, -7); c.lineTo(dx + 1.8, -8); c.moveTo(dx + 3.3, -6); c.lineTo(dx + 5, -7.4); c.stroke(); }
      c.beginPath(); c.moveTo(4, -2); c.lineTo(22, -2); c.lineTo(22, 2); c.quadraticCurveTo(14, 5, 6, 3); c.quadraticCurveTo(0, 2, 4, -2); c.fill(); c.fillRect(10, -6, 6, 4); c.restore();
      K.ridge(H * .6, H * .1, 5, '#d6e4ef', 21, .05); K.ridge(H * .625, H * .1, 5, '#183040', 21, .05); K.ridge(H * .7, H * .05, 8, '#9fb6c9', 4);
      for (var x2 = -U * 2; x2 < W + U * 3; x2 += U * (1.6 + K.r() * 2.2)) K.pine(x2, H * .76 + K.r() * H * .02, U * (7 + K.r() * 7), '#04121a', 'rgba(220,235,248,.8)');
      var sn = c.createLinearGradient(0, H * .78, 0, H); sn.addColorStop(0, '#cbdbe8'); sn.addColorStop(1, '#5d7a92'); c.fillStyle = sn; c.fillRect(0, H * .78, W, H * .22);
      K.pine(W * .9, H * 1.02, H * (P ? .3 : .42), '#03100a', 'rgba(230,240,250,.9)'); K.pine(W * .1, H * 1.04, H * (P ? .24 : .36), '#03100a', 'rgba(230,240,250,.9)');
      snowfall(K, Math.round(W * H / 9000), 1); K.vignette(.4);
    },
    hearth: function (K) {
      var c = K.ctx, W = K.W, H = K.H, U = K.U, P = K.portrait, i;
      var wall = c.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, '#120806'); wall.addColorStop(1, '#2a120a'); c.fillStyle = wall; c.fillRect(0, 0, W, H);
      var sy0 = H * (P ? .05 : .04), sag = H * (P ? .05 : .08);
      for (i = 0; i <= 90; i++) { var st = i / 90, sx2 = st * W, sy2 = sy0 + Math.sin(st * Math.PI * 3) * sag * .5 + sag * .5; c.fillStyle = i % 2 ? '#1d5a35' : '#2a7a4a'; c.beginPath(); c.ellipse(sx2, sy2, U * 1.5, U * .8, (K.r() - .5) * 2, 0, Math.PI * 2); c.fill(); if (i % 5 === 0) K.glow(sx2, sy2 + U, U * 2.6, ['rgba(255,226,150,A)', 'rgba(255,110,110,A)', 'rgba(150,240,190,A)'][(i / 5) % 3], .9); }
      for (i = 0; i < 26; i++) { c.fillStyle = 'rgba(255,220,180,' + (K.r() * .03).toFixed(3) + ')'; c.fillRect(0, K.r() * H, W, U * (.2 + K.r() * .6)); }
      var fw = Math.min(W * .78, H * (P ? .5 : .9)), fx = W / 2 - fw / 2, mantel = H * (P ? .5 : .38), floor = H * (P ? .86 : .92), ow = fw * .62, ox = W / 2 - ow / 2, otop = mantel + (floor - mantel) * .22;
      for (var y = mantel; y < floor; y += U * 3) for (var x = fx - ((y / (U * 3)) % 2) * U * 3; x < fx + fw; x += U * 6) { var sh = 40 + K.r() * 30; c.fillStyle = 'rgb(' + (sh + 40 | 0) + ',' + (sh + 14 | 0) + ',' + (sh | 0) + ')'; c.fillRect(Math.max(fx, x) + U * .2, y + U * .2, U * 5.6, U * 2.6); }
      c.fillStyle = '#060202'; c.beginPath(); c.moveTo(ox, floor); c.lineTo(ox, otop + ow * .2); c.quadraticCurveTo(W / 2, otop - ow * .12, ox + ow, otop + ow * .2); c.lineTo(ox + ow, floor); c.fill();
      K.glow(W / 2, floor - U * 4, ow * .9, 'rgba(255,140,40,A)', .45);
      c.fillStyle = '#4a2410'; c.save(); c.translate(W / 2, floor - U * 3); c.rotate(.12); c.fillRect(-ow * .32, -U * 1.6, ow * .64, U * 3.2); c.rotate(-.24); c.fillRect(-ow * .3, -U * 1.4, ow * .6, U * 2.8); c.restore();
      c.globalCompositeOperation = 'lighter';
      for (i = 0; i < 9; i++) { var fx2 = W / 2 + (i - 4) * ow * .07, fh = (floor - otop) * (.35 + K.r() * .35), fb = floor - U * 4, fg = c.createLinearGradient(0, fb, 0, fb - fh);
        fg.addColorStop(0, 'rgba(255,240,180,.9)'); fg.addColorStop(.35, 'rgba(255,150,40,.7)'); fg.addColorStop(1, 'rgba(200,40,10,0)'); c.fillStyle = fg;
        c.beginPath(); c.moveTo(fx2 - ow * .07, fb); c.bezierCurveTo(fx2 - ow * .08, fb - fh * .5, fx2 + ow * .02, fb - fh * .6, fx2 + (K.r() - .5) * ow * .04, fb - fh); c.bezierCurveTo(fx2 + ow * .06, fb - fh * .5, fx2 + ow * .09, fb - fh * .3, fx2 + ow * .07, fb); c.fill(); }
      c.globalCompositeOperation = 'source-over';
      var mg = c.createLinearGradient(0, mantel - U * 3, 0, mantel + U * 1.5); mg.addColorStop(0, '#7a3a1f'); mg.addColorStop(1, '#2a1006'); c.fillStyle = mg; c.fillRect(fx - U * 3, mantel - U * 3, fw + U * 6, U * 4.5);
      for (i = 0; i < 70; i++) { var t = i / 70, gx = fx - U * 2 + t * (fw + U * 4), gy = mantel + U * 1.5 + Math.sin(t * Math.PI * 4) * U * 1.6 + U * 1.6; c.fillStyle = i % 2 ? '#1d5a35' : '#2a7a4a'; c.beginPath(); c.ellipse(gx, gy, U * 1.6, U * .8, (K.r() - .5) * 2, 0, Math.PI * 2); c.fill(); if (i % 6 === 0) K.glow(gx, gy, U * 2.4, ['rgba(255,226,150,A)', 'rgba(255,110,110,A)'][(i / 6) % 2 | 0], .9); }
      var nS = P ? 3 : 4; for (i = 0; i < nS; i++) { var sx = fx + fw * ((i + .5) / nS), sy = mantel + U * 3, s = U * (P ? 2.2 : 2.6);
        c.fillStyle = i % 2 ? '#1f6a40' : '#b3202e'; c.beginPath(); c.moveTo(sx - s, sy); c.lineTo(sx + s, sy); c.lineTo(sx + s, sy + s * 3.2); c.quadraticCurveTo(sx + s * 3, sy + s * 3.4, sx + s * 2.6, sy + s * 4.6); c.lineTo(sx - s * .2, sy + s * 4.6); c.quadraticCurveTo(sx - s * 1.2, sy + s * 4.4, sx - s, sy + s * 3.2); c.fill();
        c.fillStyle = '#f4ede0'; c.fillRect(sx - s * 1.15, sy - s * .2, s * 2.3, s * .9); }
      [fx + U, fx + fw - U * 2].forEach(function (cx2, k) { var ch = U * (5 + k * 2); c.fillStyle = '#f4ead6'; c.fillRect(cx2, mantel - U * 3 - ch, U * 1.4, ch); K.glow(cx2 + U * .7, mantel - U * 3.6 - ch, U * 6, 'rgba(255,200,110,A)', .5); c.fillStyle = '#ffe9a8'; c.beginPath(); c.ellipse(cx2 + U * .7, mantel - U * 4.2 - ch, U * .45, U * 1.1, 0, 0, Math.PI * 2); c.fill(); });
      var wy = mantel - (P ? H * .16 : H * .2), wr = U * (P ? 9 : 10);
      for (i = 0; i < 46; i++) { var a = i / 46 * Math.PI * 2; c.fillStyle = i % 2 ? '#1d5a35' : '#2f7a4d'; c.beginPath(); c.ellipse(W / 2 + Math.cos(a) * wr, wy + Math.sin(a) * wr, U * 2.2, U * 1, a + .6, 0, Math.PI * 2); c.fill(); }
      for (i = 0; i < 10; i++) { var a2 = i / 10 * Math.PI * 2 + .3; c.fillStyle = '#d4202e'; c.beginPath(); c.arc(W / 2 + Math.cos(a2) * wr, wy + Math.sin(a2) * wr, U * .8, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = '#c8283a'; c.beginPath(); c.ellipse(W / 2 - U * 2, wy + wr, U * 2.4, U * 1.3, -.4, 0, Math.PI * 2); c.ellipse(W / 2 + U * 2, wy + wr, U * 2.4, U * 1.3, .4, 0, Math.PI * 2); c.fill(); c.fillRect(W / 2 - U * 1.6, wy + wr, U * .9, U * 5); c.fillRect(W / 2 + U * .7, wy + wr, U * .9, U * 5);
      var fl = c.createLinearGradient(0, floor, 0, H); fl.addColorStop(0, '#2a1208'); fl.addColorStop(1, '#0a0402'); c.fillStyle = fl; c.fillRect(0, floor, W, H - floor);
      K.glow(W / 2, floor, ow, 'rgba(255,150,60,A)', .2); K.vignette(.6);
    }
  };

  function pin(x, y, col, d) { return '<g transform="translate(' + x + ' ' + y + ')"><circle class="ring" r="5" fill="none" stroke="' + col + '" stroke-width="1.6" style="animation-delay:' + d + 's"/><g class="pin" style="animation-delay:' + d + 's"><path d="M0 0C-4.5-6-7-9.5-7-13.5a7 7 0 0 1 14 0C7-9.5 4.5-6 0 0z" fill="' + col + '" stroke="rgba(0,0,0,.35)" stroke-width=".8"/><circle cy="-13.5" r="2.6" fill="#fff"/></g></g>'; }
  var MAP = '<svg viewBox="0 0 132 116"><defs><linearGradient id="xmMap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#e6d8b8"/></linearGradient></defs>' +
    '<rect width="132" height="116" fill="url(#xmMap)"/><g fill="#fff" opacity=".85"><ellipse cx="22" cy="20" rx="20" ry="9"/><ellipse cx="104" cy="96" rx="26" ry="10"/><ellipse cx="96" cy="24" rx="14" ry="6"/></g>' +
    '<path d="M-4 70C20 62 34 80 58 74S96 52 136 60" fill="none" stroke="#b9d0e4" stroke-width="7"/><path d="M-4 70C20 62 34 80 58 74S96 52 136 60" fill="none" stroke="#e6f0f8" stroke-width="1.4" stroke-dasharray="3 5"/>' +
    '<path d="M20 -4C26 30 40 44 70 50S110 70 118 120M0 36H132" fill="none" stroke="#d8c7a2" stroke-width="4"/><path d="M20 -4C26 30 40 44 70 50S110 70 118 120M0 36H132" fill="none" stroke="#fffaf0" stroke-width=".9" stroke-dasharray="3 3"/>' +
    '<path d="M58 72v8M62 72v8" stroke="#8a6a3a" stroke-width="1.4"/>' +
    '<g fill="#1f5a3a"><path d="M8 52l5-10 5 10z"/><path d="M15 58l5-11 5 11z"/><path d="M100 40l5-11 5 11z"/><path d="M108 46l4-9 4 9z"/><path d="M40 98l5-10 5 10z"/><path d="M84 86l4-9 4 9z"/></g>' +
    '<g fill="#fff"><path d="M13 42l2 4h-4z"/><path d="M20 47l2 4h-4z"/><path d="M105 29l2 4h-4z"/><path d="M45 88l2 4h-4z"/></g>' +
    '<g><rect x="44" y="20" width="10" height="8" fill="#f4ead6" stroke="#7a5a3a" stroke-width=".6"/><path d="M42 21l7-6 7 6z" fill="#b3202e"/><rect x="74" y="26" width="9" height="7" fill="#f4ead6" stroke="#7a5a3a" stroke-width=".6"/><path d="M72 27l6.5-5 6.5 5z" fill="#1f6a40"/><rect x="66" y="88" width="10" height="8" fill="#f4ead6" stroke="#7a5a3a" stroke-width=".6"/><path d="M64 89l7-6 7 6z" fill="#b3202e"/></g>' +
    '<path class="route" d="M10 106C30 96 34 70 52 62S86 40 98 18" fill="none" stroke="#c8283a" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M118 8l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill="#c9952e"/>' +
    pin(52, 62, '#c8283a', 0) + pin(98, 20, '#d4a23a', -.8) + pin(30, 92, '#1f6a40', -1.6) +
    '<rect x="1" y="1" width="130" height="114" rx="14" fill="none" stroke="#c9a050" stroke-width="2"/></svg>';

  S.landing = {
    arch: arch(),
    flank: 'xm-holly',
    plaque: { lbl: 'The Advent Countdown', until: 'UNTIL CHRISTMAS', during: 'MERRY CHRISTMAS · ENDS IN' },
    rules: ['The Fireside Library & Picture House', 'The Workshop & Wonders'],
    shelf: {
      sub: 'holiday tales by the fire. Pull a volume from the shelf.', cta: 'Library', tick: 660,
      books: [
        { t: 'A Christmas Carol', a: 'Charles Dickens', y: 1843, w: 38, h: 196, c1: '#8e1b26', c2: '#45070f', rib: true, b: 'Ebenezer Scrooge is visited by his dead partner Marley and three spirits who show him Christmas past, present and yet to come.' },
        { t: 'The Night Before Christmas', s: 'Night Before Christmas', a: 'Clement C. Moore', y: 1823, w: 30, h: 166, c1: '#1f4d36', c2: '#0b2219', b: 'The poem that gave Santa eight named reindeer, a rooftop landing and his trip down the chimney.' },
        { t: 'The Lion, the Witch and the Wardrobe', s: 'The Wardrobe', a: 'C.S. Lewis', y: 1950, w: 40, h: 200, c1: '#1d2e5a', c2: '#0a1430', b: 'Four children step through a wardrobe into Narnia, where the White Witch has made it always winter and never Christmas.' },
        { t: 'Hercule Poirot’s Christmas', s: 'Poirot’s Christmas', a: 'Agatha Christie', y: 1938, w: 34, h: 184, c1: '#4e1f4a', c2: '#200a1e', lean: true, b: 'A tyrannical millionaire gathers his family for Christmas and is found dead in a locked room on Christmas Eve.' },
        { t: 'The Polar Express', a: 'Chris Van Allsburg', y: 1985, w: 30, h: 160, c1: '#6e4a1c', c2: '#2e1c08', b: 'A boy who has begun to doubt boards a midnight train to the North Pole and is given the first gift of Christmas.' },
        { t: 'How the Grinch Stole Christmas!', s: 'The Grinch', a: 'Dr. Seuss', y: 1957, w: 32, h: 174, c1: '#2f6a2a', c2: '#123010', rib: true, b: 'A grouch in a mountain cave steals every present in Who-ville, and learns that Christmas came just the same.' },
        { t: 'The Dark Is Rising', a: 'Susan Cooper', y: 1973, w: 36, h: 192, c1: '#15283e', c2: '#060e18', b: 'On his eleventh birthday, at midwinter, Will Stanton learns he is the last of the Old Ones, sworn to fight the Dark.' },
        { t: 'Mystery in White', a: 'J. Jefferson Farjeon', y: 1937, w: 34, h: 180, c1: '#7a1420', c2: '#330509', b: 'Snowbound train passengers shelter in an empty country house where the fire is lit and the table is laid for tea.' },
        { t: 'The Box of Delights', a: 'John Masefield', y: 1935, w: 38, h: 190, c1: '#5a3a14', c2: '#241406', b: 'Kay Harker is given a magical box by a Punch and Judy man and must keep it from a gang of wizards before Christmas.' }
      ]
    },
    cinema: {
      board: 'Now Showing', title: 'The Picture House', sub: 'holiday films for every kind of evening', cta: 'Box office',
      films: [
        { title: "It's a Wonderful Life", year: '1946', rating: 8.6, wikiSlug: "It's_a_Wonderful_Life" },
        { title: 'Home Alone', year: '1990', rating: 7.7, wikiSlug: 'Home_Alone' },
        { title: 'Klaus', year: '2019', rating: 8.2, wikiSlug: 'Klaus_(film)' },
        { title: 'The Muppet Christmas Carol', year: '1992', rating: 7.8, wikiSlug: 'The_Muppet_Christmas_Carol' },
        { title: 'Elf', year: '2003', rating: 7.1, wikiSlug: 'Elf_(film)' },
        { title: 'Miracle on 34th Street', year: '1947', rating: 7.9, wikiSlug: 'Miracle_on_34th_Street_(1947_film)' }
      ]
    },
    sound: {
      noun: 'radio', device: DEVICE,
      scope: ['rgba(255,214,140,.14)', 'rgba(255,214,140,.42)', '#fff6dc']
    },
    game: { module: 'workshop', sub: 'Build, wrap and deliver gifts', art: GIFT },
    wheel: { sub: 'Spin for tonight’s plan', dataVar: 'CHRISTMAS_WHEEL', style: { rim: ['#fff2c4', '#8a5e14', '#f6d58a', '#5e3e0a', '#e6bf6a'], inner: '#06140c', core: '#000', edge: '#05100a', text: '#fff6df', font: '700 #px "Playfair Display SC", serif', spoke: '#e8c27a', bulbA: '#ffd36b', bulbB: '#ff5a5a', hub: ['#fff2c4', '#c9952e', '#5a3a08'], hubText: '#3a2208', hubFont: '400 #px "Pinyon Script", cursive', pointer: '#f6d58a' } },
    radar: { sub: 'Light displays, markets & rinks near', noun: ['place', 'places'], mapVar: 'CHRISTMAS_MAP', art: MAP },
    shop: { sub: 'Sweaters, decorations, kits & treats', items: SHOP },
    sky: { icon: 'snow', small: function (i) { return 'The snow globe · ' + (i.place || ''); }, draw: globe,
      cells: function (i) { var d = daysTo(i.now, 11, 21); return [['Sunset', i.polar ? '—' : i.hm(i.set)], ['Daylight', i.dur(i.len)], ['Solstice', d === 0 ? 'Tonight' : d + (d === 1 ? ' day' : ' days')]]; } },
    lore: { title: 'Yuletide Lore of the Day', hint: 'TAP FOR ANOTHER TALE', perch: ROBIN, tick: 880 },
    walls: {
      sub: 'Snowbound scenes for your lockscreen or desktop.', toast: 'Wallpaper wrapped & delivered to your device', busy: 'Wrapping…',
      scenes: [
        { id: 'village', name: 'Silent Night Village', sub: 'Lamplit rooftops under the snow', seed: 31 },
        { id: 'tree', name: 'The Grand Tannenbaum', sub: 'Glass baubles, gifts and a golden star', seed: 12 },
        { id: 'aurora', name: 'Northern Lights', sub: 'A sleigh crosses the moon over the pines', seed: 44 },
        { id: 'hearth', name: 'Hearthside Eve', sub: 'Stockings hung by the chimney with care', seed: 7 }
      ],
      paint: function (K, sceneId) { PAINT[sceneId](K); }
    }
  };
})(window);
