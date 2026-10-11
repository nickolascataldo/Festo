/* ==========================================================================
   SUMMER SOLSTICE · luxe art (pairs with summer.css)
   Golden hour on a Mediterranean coast: whitewashed cliff village, sailboats, palms, a sun on the horizon.
   Ivory linen cards with azulejo-tile corners, a nautical rope frame, sun and shell medallions, golden motes.
   ========================================================================== */
(function (global) {
  'use strict';
  var L = global.FestoLuxe = global.FestoLuxe || { seasons: {} }; L.seasons = L.seasons || {};
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  var rays = ''; for (var i = 0; i < 12; i++) rays += '<path d="M22 6.5 l1.6 4.5 h-3.2z" transform="rotate(' + (i * 30) + ' 22 22)" fill="url(#suSun)"/>';
  var ribs = ''; for (var k = 0; k < 7; k++) { var a = -150 + k * 20; ribs += '<path d="M22 31 L' + (22 + Math.cos(a * Math.PI / 180) * 14).toFixed(1) + ' ' + (31 + Math.sin(a * Math.PI / 180) * 14).toFixed(1) + '" stroke="#c4683e" stroke-width=".9" opacity=".7"/>'; }
  var SPRITE =
    '<linearGradient id="suSun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a0"/><stop offset=".55" stop-color="#ffb347"/><stop offset="1" stop-color="#f0743a"/></linearGradient>' +
    '<linearGradient id="suSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2aa6c4"/><stop offset="1" stop-color="#0b4a6e"/></linearGradient>' +
    '<radialGradient id="suShell" cx="50%" cy="85%" r="90%"><stop offset="0" stop-color="#fff4e6"/><stop offset=".6" stop-color="#ffc9a6"/><stop offset="1" stop-color="#e98a62"/></radialGradient>' +
    '<radialGradient id="suLemon" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff8b8"/><stop offset=".45" stop-color="#ffd83a"/><stop offset="1" stop-color="#d49a0a"/></radialGradient>' +
    '<linearGradient id="suLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cc46a"/><stop offset=".55" stop-color="#2f8a3e"/><stop offset="1" stop-color="#155a26"/></linearGradient>' +
    '<symbol id="su-sun" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20.5" fill="#fdf6e8" stroke="#1f5fa8" stroke-width="1.8"/><circle cx="22" cy="22" r="17.2" fill="none" stroke="#1f5fa8" stroke-width=".7" stroke-dasharray="1.6 1.6"/>' + rays +
      '<circle cx="22" cy="22" r="7.4" fill="url(#suSun)" stroke="#e0532a" stroke-width=".6"/><path d="M19 21.5h.01M25 21.5h.01" stroke="#a8401a" stroke-width="1.6" stroke-linecap="round"/><path d="M19.4 24c1.6 1.4 3.6 1.4 5.2 0" stroke="#a8401a" stroke-width=".9" fill="none" stroke-linecap="round"/></symbol>' +
    '<symbol id="su-shell" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20.5" fill="url(#suSea)" stroke="#fdf6e8" stroke-width="1.8"/><circle cx="22" cy="22" r="17.2" fill="none" stroke="#fdf6e8" stroke-width=".6" opacity=".6"/>' +
      '<path d="M22 31 C 12 31 7 22 9 17 C 11 12 16 10 22 10 C 28 10 33 12 35 17 C 37 22 32 31 22 31z" fill="url(#suShell)" stroke="#b5532c" stroke-width=".8"/>' + ribs + '<path d="M18 31h8l-1.4 3.4h-5.2z" fill="#f2a27a" stroke="#b5532c" stroke-width=".6"/></symbol>' +
    '<symbol id="su-lemon" viewBox="0 0 50 50"><path d="M8 10 C 18 12 26 18 30 30" stroke="#5a3a1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M14 12 C 10 4 18 0 24 4 C 22 10 18 13 14 12z" fill="url(#suLeaf)" stroke="#155a26" stroke-width=".5"/><path d="M22 18 C 26 9 35 10 37 16 C 32 20 26 21 22 18z" fill="url(#suLeaf)" stroke="#155a26" stroke-width=".5"/><path d="M14 12 L22 5M22 18 L35 15" stroke="#155a26" stroke-width=".5" opacity=".7"/>' +
      '<ellipse cx="26" cy="35" rx="9.5" ry="7.5" transform="rotate(-25 26 35)" fill="url(#suLemon)" stroke="#b07d08" stroke-width=".6"/><path d="M33.5 30.5l2.4-1.6" stroke="#b07d08" stroke-width="1.4" stroke-linecap="round"/>' +
      '<ellipse cx="13" cy="28" rx="7" ry="5.6" transform="rotate(20 13 28)" fill="url(#suLemon)" stroke="#b07d08" stroke-width=".6"/><ellipse cx="23" cy="32" rx="2.4" ry="1.3" transform="rotate(-25 23 32)" fill="#fff" opacity=".55"/></symbol>';

  function coast() {
    var r = rng(19), s = '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"><defs>' +
      '<linearGradient id="sbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26457a"/><stop offset=".3" stop-color="#6a5c9c"/><stop offset=".52" stop-color="#d9837a"/><stop offset=".66" stop-color="#ffb27a"/><stop offset=".7" stop-color="#ffd59a"/></linearGradient>' +
      '<linearGradient id="sbSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f7aa0"/><stop offset=".25" stop-color="#1d5a82"/><stop offset="1" stop-color="#062a44"/></linearGradient>' +
      '<radialGradient id="sbSun"><stop offset="0" stop-color="#fffbe6"/><stop offset=".18" stop-color="#ffe7a0"/><stop offset=".22" stop-color="rgba(255,200,120,.55)"/><stop offset="1" stop-color="rgba(255,150,90,0)"/></radialGradient>' +
      '<linearGradient id="sbCliff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a6a"/><stop offset="1" stop-color="#3c2a44"/></linearGradient>' +
      '<linearGradient id="sbPath" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c8" stop-opacity=".9"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></linearGradient></defs>' +
      '<rect width="1600" height="900" fill="url(#sbSky)"/><circle cx="1010" cy="630" r="560" fill="url(#sbSun)"/>';
    s += '<g fill="#fff" opacity=".5">'; for (var i = 0; i < 26; i++) s += '<circle class="twinkle' + (i % 2 ? ' b' : '') + '" cx="' + Math.round(r() * 1600) + '" cy="' + Math.round(r() * 200) + '" r="' + (r() + .4).toFixed(1) + '"/>'; s += '</g>';
    s += '<g class="drift" fill="#ffd9c0" opacity=".55"><path d="M120 300 q60-30 140-10 q50-18 110 6 q-90 22-250 4z"/><path d="M1240 250 q70-26 150-6 q40-14 90 6 q-90 18-240 0z"/></g><g class="drift b" fill="#ffc6b0" opacity=".45"><path d="M560 380 q80-24 170-4 q60-16 120 8 q-120 20-290-4z"/></g>';
    s += '<circle cx="1010" cy="632" r="62" fill="#fff4cc"/><rect x="0" y="632" width="1600" height="268" fill="url(#sbSea)"/>';
    s += '<g class="shimmer" style="transform-origin:1010px 700px">'; for (var j = 0; j < 22; j++) { var y = 640 + j * 11, w = 160 - j * 4 + r() * 40; s += '<rect x="' + (1010 - w / 2 + (r() - .5) * 40).toFixed(0) + '" y="' + y + '" width="' + w.toFixed(0) + '" height="' + (2 + j * .2).toFixed(1) + '" rx="2" fill="#ffe2a8" opacity="' + (.75 - j * .028).toFixed(2) + '"/>'; } s += '</g>';
    s += '<g stroke="#bfe0ef" stroke-opacity=".25" fill="none">'; for (var w2 = 0; w2 < 14; w2++) { var yy = 660 + w2 * 18, xx = r() * 1400; s += '<path d="M' + xx.toFixed(0) + ' ' + yy + 'q20-5 40 0t40 0"/>'; } s += '</g>';
    /* cliffs + village (left) */
    s += '<path d="M0 470 C 120 440 220 452 300 480 C 360 500 420 560 470 640 L0 640z" fill="url(#sbCliff)"/><path d="M0 560 C 140 540 260 560 380 620 L 420 660 L0 660z" fill="#2c2038" opacity=".85"/>';
    var hx = [24, 62, 104, 150, 198, 240, 40, 88, 132, 180, 226, 272];
    hx.forEach(function (x, n) { var row = n < 6 ? 0 : 1, y = 470 - row * 0 + row * 44 + (n % 3) * 4, w = 34 + (n % 3) * 6, h = 26 + (n % 2) * 8;
      s += '<rect x="' + x + '" y="' + (y - h + 10) + '" width="' + w + '" height="' + h + '" fill="' + (n % 4 ? '#f6ece2' : '#ffe6d0') + '"/><rect x="' + x + '" y="' + (y - h + 10) + '" width="' + w + '" height="5" fill="' + (n % 3 ? '#d9774a' : '#e9a07a') + '"/>';
      s += '<rect x="' + (x + w * .3) + '" y="' + (y - h + 20) + '" width="6" height="8" rx="3" fill="' + (n % 2 ? '#ffcf7a' : '#3f7aa0') + '"/>'; });
    s += '<path d="M150 410 h22 v-34 l11-14 11 14 v34 h22 v40 h-66z" fill="#fff4ea"/><path d="M172 376l11-14 11 14z" fill="#1f5fa8"/><circle cx="183" cy="396" r="5" fill="#ffcf7a"/>';
    /* lighthouse (right) */
    s += '<path d="M1600 560 C 1500 548 1430 560 1370 600 L 1340 640 H1600z" fill="#3c2a44"/><path d="M1478 552 l8-120 h24 l8 120z" fill="#fdf3e6"/><path d="M1482 500h32l-2 16h-28zM1484 460h28l-1 14h-26z" fill="#d9574a"/><rect x="1484" y="410" width="28" height="22" fill="#2a2030"/><path d="M1480 410l18-16 18 16z" fill="#d9574a"/><rect x="1489" y="414" width="18" height="14" fill="#fff2b0"/>' +
      '<path d="M1498 421 L1130 360 L1130 440z" fill="#fff2c0" opacity=".14"/>';
    /* sailboats */
    [[640, 660, 1], [1250, 690, .7], [380, 700, .55]].forEach(function (b) { s += '<g transform="translate(' + b[0] + ' ' + b[1] + ') scale(' + b[2] + ')"><path d="M-40 0h80l-12 12h-56z" fill="#2a1f34"/><path d="M0 -4V-96L34 -8z" fill="#fff6ea"/><path d="M-4 -6V-80L-30 -8z" fill="#ffe2c8"/><path d="M-40 14h80" stroke="#ffe2a8" stroke-opacity=".4"/></g>'; });
    /* gulls */
    s += '<g class="drift" fill="none" stroke="#3a2a44" stroke-width="2.4" stroke-linecap="round"><path d="M700 300q10-8 18 0q8-8 18 0"/><path d="M760 270q8-6 14 0q6-6 14 0"/><path d="M1180 330q10-8 18 0q8-8 18 0"/></g>';
    /* palms */
    function palm(x, y, h, flip) { var f = flip ? -1 : 1, t = '<g class="sway" style="animation-delay:-' + (x % 7) + 's"><path d="M' + x + ' ' + y + ' C ' + (x + f * 20) + ' ' + (y - h * .4) + ' ' + (x + f * 10) + ' ' + (y - h * .8) + ' ' + (x + f * 40) + ' ' + (y - h) + '" stroke="#24182e" stroke-width="14" fill="none" stroke-linecap="round"/>', tx = x + f * 40, ty = y - h;
      [[-150, 120], [-110, 140], [-60, 130], [-20, 120], [20, 110], [-190, 100]].forEach(function (fr) { var a = (fr[0]) * Math.PI / 180, l = fr[1], ex = tx + Math.cos(a) * l * f, ey = ty + Math.sin(a) * l * .6 + l * .45;
        t += '<path d="M' + tx + ' ' + ty + ' Q ' + (tx + Math.cos(a) * l * .5 * f).toFixed(0) + ' ' + (ty + Math.sin(a) * l * .8).toFixed(0) + ' ' + ex.toFixed(0) + ' ' + ey.toFixed(0) + ' Q ' + (tx + Math.cos(a) * l * .55 * f).toFixed(0) + ' ' + (ty + Math.sin(a) * l * .55 + 18).toFixed(0) + ' ' + tx + ' ' + ty + 'z" fill="#1e1428"/>'; });
      return t + '</g>'; }
    s += palm(70, 900, 420, false) + palm(1540, 900, 460, true) + palm(1450, 900, 340, true);
    s += '<path d="M0 860 C 300 830 600 850 900 840 S 1400 830 1600 850 V900 H0z" fill="#1a1222" opacity=".9"/>';
    return s + '</svg>';
  }

  var tile = "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#3f86d0'/><stop offset='1' stop-color='#123f7a'/></linearGradient></defs>";
  var corner = "<path d='M3 57 V14 Q3 3 14 3 H57' fill='none' stroke='url(#g)' stroke-width='2.2' stroke-linecap='round'/><path d='M8.5 47 V18 Q8.5 8.5 18 8.5 H47' fill='none' stroke='url(#g)' stroke-width='.8' opacity='.7'/>" +
    "<rect x='3' y='3' width='25' height='25' rx='3' fill='#fbf6ec' stroke='url(#g)' stroke-width='1.4'/><path d='M3 21 A18 18 0 0 0 21 3' fill='none' stroke='url(#g)' stroke-width='1.2'/>" +
    "<path d='M5 5 C 12 6 15 9 16 16 C 9 15 6 12 5 5z' fill='url(#g)'/><path d='M16 16 C 22 12 26 13 27 16 C 24 19 20 19 16 16z M16 16 C 12 22 13 26 16 27 C 19 24 19 20 16 16z' fill='url(#g)' opacity='.85'/>" +
    "<circle cx='16' cy='16' r='2.2' fill='#f2a03a' stroke='#123f7a' stroke-width='.5'/><circle cx='24' cy='6' r='1.3' fill='url(#g)'/><circle cx='6' cy='24' r='1.3' fill='url(#g)'/><path d='M38 3 l2 -3 l2 3 M3 38 l-3 2 l3 2' fill='url(#g)'/>";
  var rope = "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='24' viewBox='0 0 22 24'><defs><linearGradient id='r' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#f6e2b8'/><stop offset='.5' stop-color='#c9a26a'/><stop offset='1' stop-color='#8a6634'/></linearGradient></defs>" +
    "<rect x='6' y='0' width='10' height='24' fill='#7a5a30'/><path d='M6 -2 C 10 4 16 6 16 12 M6 10 C 10 16 16 18 16 24' stroke='url(#r)' stroke-width='5.4' fill='none'/><path d='M6 -2 C 10 4 16 6 16 12 M6 10 C 10 16 16 18 16 24' stroke='#5a3e1a' stroke-width='.6' fill='none' opacity='.6' transform='translate(0 2.4)'/></svg>";
  var rule = "<svg xmlns='http://www.w3.org/2000/svg' width='34' height='14' viewBox='0 0 34 14'><path d='M0 7H18' stroke='#fff2dc' stroke-width='1'/><circle cx='27' cy='7' r='3.4' fill='#ffd27a' stroke='#e0532a' stroke-width='.8'/><path d='M27 0.6v2M27 11.4v2M20.6 7h2M31.4 7h2M22.5 2.5l1.4 1.4M30.1 10.1l1.4 1.4M22.5 11.5l1.4-1.4M30.1 3.9l1.4-1.4' stroke='#ffd27a' stroke-width='1.1' stroke-linecap='round'/></svg>";

  L.seasons.summer = {
    sprite: SPRITE,
    backdrop: coast(),
    medals: ['su-sun', 'su-sun', 'su-shell', 'su-shell'],
    particles: 'motes',
    art: { defs: tile, corner: corner, vine: rope, rule: rule }
  };
})(window);
