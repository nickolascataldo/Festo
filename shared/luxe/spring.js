/* ==========================================================================
   SPRING HAVEN · luxe art (pairs with spring.css)
   A Victorian glasshouse at dawn: cherry trees, tulip rows, sunbeams and butterflies.
   White linen cards with pressed-flower corners, a wisteria frame, blossom and bee medallions, falling petals.
   ========================================================================== */
(function (global) {
  'use strict';
  var L = global.FestoLuxe = global.FestoLuxe || { seasons: {} }; L.seasons = L.seasons || {};
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  var petals = ''; for (var i = 0; i < 5; i++) petals += '<path d="M22 22 C 17 16 17 9 22 7.5 L23 9.4 L24.6 7.6 C 28 9.5 27 16 22 22z" transform="rotate(' + (i * 72) + ' 22 22)" fill="url(#spPetal)" stroke="#d07a96" stroke-width=".5"/>';
  var stam = ''; for (var j = 0; j < 8; j++) { var a = j * 45 * Math.PI / 180; stam += '<path d="M22 22 L' + (22 + Math.cos(a) * 5).toFixed(1) + ' ' + (22 + Math.sin(a) * 5).toFixed(1) + '" stroke="#c45478" stroke-width=".5"/><circle cx="' + (22 + Math.cos(a) * 5.3).toFixed(1) + '" cy="' + (22 + Math.sin(a) * 5.3).toFixed(1) + '" r=".9" fill="#f2c14e"/>'; }
  var SPRITE =
    '<radialGradient id="spPetal" cx="50%" cy="80%" r="80%"><stop offset="0" stop-color="#f4a6bf"/><stop offset=".45" stop-color="#ffd8e4"/><stop offset="1" stop-color="#fff6f9"/></radialGradient>' +
    '<linearGradient id="spLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8d08c"/><stop offset=".55" stop-color="#5f9a52"/><stop offset="1" stop-color="#2f6a34"/></linearGradient>' +
    '<linearGradient id="spGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e6b8"/><stop offset=".4" stop-color="#c9a464"/><stop offset=".7" stop-color="#f1dca0"/><stop offset="1" stop-color="#8a6a2a"/></linearGradient>' +
    '<radialGradient id="spBee" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#e0a020"/></radialGradient>' +
    '<symbol id="sp-bloom" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20.5" fill="#fffdf8" stroke="url(#spGold)" stroke-width="1.8"/><circle cx="22" cy="22" r="17.4" fill="none" stroke="#8fae8a" stroke-width=".7"/>' + petals + stam + '<circle cx="22" cy="22" r="1.8" fill="#c45478"/></symbol>' +
    '<symbol id="sp-bee" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20.5" fill="#eef5e6" stroke="url(#spGold)" stroke-width="1.8"/><circle cx="22" cy="22" r="17.4" fill="none" stroke="#8fae8a" stroke-width=".7"/>' +
      '<ellipse cx="16.5" cy="15.5" rx="6" ry="4" transform="rotate(-30 16.5 15.5)" fill="#fff" fill-opacity=".85" stroke="#9fb6c8" stroke-width=".6"/><ellipse cx="27.5" cy="15.5" rx="6" ry="4" transform="rotate(30 27.5 15.5)" fill="#fff" fill-opacity=".85" stroke="#9fb6c8" stroke-width=".6"/>' +
      '<ellipse cx="22" cy="24" rx="7.6" ry="9.4" fill="url(#spBee)" stroke="#5a3a10" stroke-width=".6"/><path d="M14.8 22h14.4M15.2 26.4h13.6M17 30.6h10" stroke="#3a2608" stroke-width="2.2"/><circle cx="22" cy="14.6" r="4.2" fill="#3a2608"/><path d="M20 11.4c-1-3-3-4-4-4M24 11.4c1-3 3-4 4-4" stroke="#3a2608" stroke-width=".8" fill="none"/><path d="M22 33.4v2.6" stroke="#3a2608" stroke-width="1.2"/></symbol>' +
    '<symbol id="sp-sprig" viewBox="0 0 50 50"><path d="M6 44 C 14 34 22 26 40 8" stroke="#6a4a32" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M22 27 C 26 25 30 26 32 28" stroke="#6a4a32" stroke-width="1.3" fill="none"/>' +
      '<path d="M14 36 C 8 34 6 28 9 25 C 13 28 15 32 14 36z" fill="url(#spLeaf)"/><path d="M30 18 C 34 12 40 12 42 15 C 38 19 34 20 30 18z" fill="url(#spLeaf)"/>' +
      '<g transform="translate(17 13) scale(.42)"><use href="#sp-flower" width="44" height="44"/></g><g transform="translate(25 19) scale(.36)"><use href="#sp-flower" width="44" height="44"/></g><g transform="translate(5 22) scale(.34)"><use href="#sp-flower" width="44" height="44"/></g>' +
      '<circle cx="40" cy="8" r="2.4" fill="#f4a6bf"/><circle cx="34" cy="28.5" r="2" fill="#f7b6c8"/></symbol>' +
    '<symbol id="sp-flower" viewBox="0 0 44 44">' + petals + stam + '<circle cx="22" cy="22" r="2" fill="#c45478"/></symbol>';

  function glasshouse() {
    var r = rng(41), s = '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"><defs>' +
      '<linearGradient id="gbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6e2"/><stop offset=".5" stop-color="#eef1e0"/><stop offset="1" stop-color="#fbeedd"/></linearGradient>' +
      '<radialGradient id="gbSun" cx="78%" cy="18%" r="60%"><stop offset="0" stop-color="#fffbe8"/><stop offset=".2" stop-color="rgba(255,244,214,.75)"/><stop offset="1" stop-color="rgba(255,244,214,0)"/></radialGradient>' +
      '<linearGradient id="gbGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e4f2ee" stop-opacity=".9"/><stop offset="1" stop-color="#bfd9cf" stop-opacity=".75"/></linearGradient>' +
      '<linearGradient id="gbRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe8" stop-opacity=".55"/><stop offset="1" stop-color="#fffbe8" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="gbPink"><stop offset="0" stop-color="#ffe2ea"/><stop offset="1" stop-color="#f2a6bd"/></radialGradient></defs>' +
      '<rect width="1600" height="900" fill="url(#gbSky)"/><rect width="1600" height="900" fill="url(#gbSun)"/>';
    s += '<g class="shimmer" style="transform-origin:1250px 0">'; [[1180, 40], [1290, 60], [1400, 30]].forEach(function (b) { s += '<path d="M' + b[0] + ' 0 L' + (b[0] - 520) + ' 900 L' + (b[0] - 520 + b[1] * 3) + ' 900 L' + (b[0] + b[1]) + ' 0z" fill="url(#gbRay)" opacity=".5"/>'; }); s += '</g>';
    s += '<g class="drift" fill="#fff" opacity=".8"><path d="M140 160 q50-30 120-10 q40-20 90 4 q-60 26-210 6z"/><path d="M900 110 q60-26 130-6 q40-16 80 6 q-80 20-210 0z"/></g>';
    s += '<path d="M0 560 C 260 500 480 520 720 560 S 1200 500 1600 540 V900 H0z" fill="#b9d3b0"/><path d="M0 620 C 300 580 560 600 860 630 S 1300 590 1600 610 V900 H0z" fill="#9cc193"/>';
    /* glasshouse */
    var gx = 560, gw = 480, gy = 640;
    s += '<g><path d="M' + gx + ' ' + gy + 'V500 Q' + (gx + gw / 2) + ' 330 ' + (gx + gw) + ' 500 V' + gy + 'z" fill="url(#gbGlass)" stroke="#fdfdf8" stroke-width="5"/>';
    s += '<path d="M' + (gx + 150) + ' 420 Q' + (gx + gw / 2) + ' 250 ' + (gx + gw - 150) + ' 420 V440 H' + (gx + 150) + 'z" fill="url(#gbGlass)" stroke="#fdfdf8" stroke-width="4"/>';
    for (var k = 1; k < 8; k++) { var x = gx + k * gw / 8; s += '<path d="M' + x + ' ' + gy + 'V' + (500 - Math.sin(k / 8 * Math.PI) * 150).toFixed(0) + '" stroke="#fdfdf8" stroke-width="3"/>'; }
    s += '<path d="M' + gx + ' 560H' + (gx + gw) + 'M' + gx + ' 500H' + (gx + gw) + '" stroke="#fdfdf8" stroke-width="3"/><path d="M' + (gx + gw / 2) + ' 252v-24" stroke="#fdfdf8" stroke-width="4"/><circle cx="' + (gx + gw / 2) + '" cy="222" r="7" fill="#fdfdf8"/>';
    s += '<g fill="#5f9a52" opacity=".55"><ellipse cx="' + (gx + 120) + '" cy="600" rx="60" ry="40"/><ellipse cx="' + (gx + 260) + '" cy="590" rx="70" ry="50"/><ellipse cx="' + (gx + 380) + '" cy="604" rx="56" ry="34"/></g><path d="M' + (gx + gw / 2 - 30) + ' ' + gy + 'v-70 a30 30 0 0 1 60 0v70z" fill="#fdfdf8" opacity=".7"/></g>';
    /* cherry trees */
    function tree(x, y, sc) { var t = '<g class="sway" style="animation-delay:-' + (x % 5) + 's"><path d="M' + x + ' ' + y + ' C ' + (x - 6 * sc) + ' ' + (y - 60 * sc) + ' ' + (x + 10 * sc) + ' ' + (y - 100 * sc) + ' ' + x + ' ' + (y - 150 * sc) + ' M' + x + ' ' + (y - 90 * sc) + ' C ' + (x - 30 * sc) + ' ' + (y - 110 * sc) + ' ' + (x - 60 * sc) + ' ' + (y - 130 * sc) + ' ' + (x - 80 * sc) + ' ' + (y - 160 * sc) + ' M' + x + ' ' + (y - 110 * sc) + ' C ' + (x + 30 * sc) + ' ' + (y - 130 * sc) + ' ' + (x + 60 * sc) + ' ' + (y - 140 * sc) + ' ' + (x + 90 * sc) + ' ' + (y - 170 * sc) + '" stroke="#6a4a3a" stroke-width="' + (8 * sc) + '" fill="none" stroke-linecap="round"/>';
      for (var n = 0; n < 26; n++) { var a = r() * Math.PI, d = r() * 110 * sc; t += '<circle cx="' + (x + Math.cos(a) * d * 1.2 - 4).toFixed(0) + '" cy="' + (y - 150 * sc - Math.sin(a) * d * .6 + 20 * sc).toFixed(0) + '" r="' + ((22 + r() * 24) * sc).toFixed(0) + '" fill="url(#gbPink)" opacity="' + (.75 + r() * .25).toFixed(2) + '"/>'; }
      return t + '</g>'; }
    s += tree(250, 640, 1.2) + tree(1360, 650, 1.35) + tree(120, 700, .9) + tree(1520, 700, .95);
    /* tulip rows */
    var cols = ['#e8506f', '#f6b93b', '#c45bd1', '#ff8a8a', '#ffffff'];
    for (var row = 0; row < 3; row++) { var yy = 760 + row * 46; for (var tx = 10 + row * 14; tx < 1600; tx += 28 - row * 2) { var c = cols[(tx / 28 + row | 0) % cols.length], hh = 30 + row * 8;
      s += '<path d="M' + tx + ' ' + (yy + hh) + 'V' + yy + '" stroke="#4f8a4c" stroke-width="2.4"/><path d="M' + (tx - 7 - row) + ' ' + yy + ' q0 -14 7 -16 q7 2 7 16 q-7 6 -14 0z" fill="' + c + '" stroke="rgba(0,0,0,.08)"/>'; } }
    s += '<g class="drift">'; [[420, 400, '#f6b93b'], [1100, 360, '#8fb8e8'], [760, 470, '#f4a6bf']].forEach(function (b) { s += '<g transform="translate(' + b[0] + ' ' + b[1] + ')"><path d="M0 0 C -12 -14 -22 -6 -14 4 C -20 10 -10 16 0 4 C 10 16 20 10 14 4 C 22 -6 12 -14 0 0z" fill="' + b[2] + '" opacity=".85"/><path d="M0 -6v12" stroke="#3a2a1a" stroke-width="1.6"/></g>'; }); s += '</g>';
    return s + '</svg>';
  }

  var art = "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ead9a6'/><stop offset='.45' stop-color='#b4935a'/><stop offset='1' stop-color='#e8d39c'/></linearGradient><radialGradient id='p' cx='50%' cy='80%' r='80%'><stop offset='0' stop-color='#f19ab6'/><stop offset='1' stop-color='#ffe8ef'/></radialGradient><linearGradient id='l' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#b5d79a'/><stop offset='1' stop-color='#4f8a4c'/></linearGradient></defs>";
  var fl = ''; for (var q = 0; q < 5; q++) fl += "<path d='M15 15 C 12 11 12 7 15 6 C 18 7 18 11 15 15z' transform='rotate(" + (q * 72) + " 15 15)' fill='url(#p)' stroke='#d07a96' stroke-width='.4'/>";
  var corner = "<path d='M3 57 V14 Q3 3 14 3 H57' fill='none' stroke='url(#g)' stroke-width='1.8' stroke-linecap='round'/><path d='M8 48 V18 Q8 8 18 8 H48' fill='none' stroke='#9fbf98' stroke-width='.8'/>" +
    "<path d='M15 15 C 22 18 30 22 40 24' stroke='#7a9a6a' stroke-width='1' fill='none'/><path d='M15 15 C 18 22 22 30 24 40' stroke='#7a9a6a' stroke-width='1' fill='none'/>" +
    "<path d='M28 20 C 32 15 38 15 40 18 C 36 22 31 23 28 20z' fill='url(#l)'/><path d='M20 28 C 15 32 15 38 18 40 C 22 36 23 31 20 28z' fill='url(#l)'/><path d='M36 23 C 40 22 44 24 45 27 C 41 28 38 27 36 23z' fill='url(#l)' opacity='.8'/>" +
    fl + "<circle cx='15' cy='15' r='1.8' fill='#f2c14e'/><circle cx='41' cy='24' r='1.6' fill='#f4a6bf'/><circle cx='24' cy='41' r='1.6' fill='#c9b6e8'/>";
  var vine = "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='150' viewBox='0 0 28 150'><defs><radialGradient id='w' cx='40%' cy='30%'><stop offset='0' stop-color='#efe2ff'/><stop offset='1' stop-color='#a78bd8'/></radialGradient><linearGradient id='l' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#b5d79a'/><stop offset='1' stop-color='#4f8a4c'/></linearGradient></defs>" +
    "<path d='M8 0 C 16 18 2 34 8 52 S 16 88 8 104 S 2 136 8 150' fill='none' stroke='#8a6a4a' stroke-width='2.2'/><path d='M8 0 C 16 18 2 34 8 52 S 16 88 8 104 S 2 136 8 150' fill='none' stroke='#fff' stroke-width='.6' opacity='.5'/>";
  [[10, 18], [9, 92]].forEach(function (p) { for (var n = 0; n < 9; n++) { var yy = p[1] + n * 4.2, xx = p[0] + 6 + Math.sin(n) * 1.6, rr = 3.2 - n * .22; vine += "<circle cx='" + xx.toFixed(1) + "' cy='" + yy.toFixed(1) + "' r='" + rr.toFixed(1) + "' fill='url(#w)'/>"; } });
  vine += "<path d='M8 60 C 14 54 22 56 24 60 C 18 64 12 64 8 60z' fill='url(#l)'/><path d='M8 70 C 2 64 -2 68 0 72 C 4 74 6 73 8 70z' fill='url(#l)'/><path d='M9 132 C 15 126 23 128 25 132 C 19 136 13 136 9 132z' fill='url(#l)'/><path d='M8 6 C 2 2 -2 6 0 10 C 4 12 6 10 8 6z' fill='url(#l)'/></svg>";
  var rule = "<svg xmlns='http://www.w3.org/2000/svg' width='34' height='14' viewBox='0 0 34 14'><path d='M0 7H20' stroke='#8fae8a' stroke-width='1'/><path d='M20 7 C 23 3 27 3 28 5 C 26 8 23 8 20 7z' fill='#7aa86a'/><circle cx='30' cy='7.5' r='3.2' fill='#f4a6bf'/><circle cx='30' cy='7.5' r='1.1' fill='#f2c14e'/></svg>";

  L.seasons.spring = {
    sprite: SPRITE,
    backdrop: glasshouse(),
    medals: ['sp-bloom', 'sp-bloom', 'sp-bee', 'sp-bee'],
    particles: 'petals',
    art: { defs: art, corner: corner, vine: vine, rule: rule }
  };
})(window);
