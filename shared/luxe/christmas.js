/* ==========================================================================
   CHRISTMAS SANCTUARY · luxe art (pairs with christmas.css)
   Midnight-blue snowfall over a Victorian village, evergreen velvet cards with gold and holly corners,
   a pine garland frame with wreath and glass-bauble medallions.
   ========================================================================== */
(function (global) {
  'use strict';
  var L = global.FestoLuxe = global.FestoLuxe || { seasons: {} }; L.seasons = L.seasons || {};
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- medallions + flank ---------- */
  var wreath = '';
  for (var i = 0; i < 20; i++) wreath += '<ellipse cx="22" cy="6.2" rx="2.5" ry="5" transform="rotate(' + (i * 18) + ' 22 22) rotate(32 22 6.2)" fill="' + (i % 2 ? '#1e5537' : '#2f7a4d') + '" stroke="#0d2a1a" stroke-width=".4"/>';
  for (var j = 0; j < 7; j++) { var a = (j * 51 + 20) * Math.PI / 180; wreath += '<circle cx="' + (22 + Math.cos(a) * 15).toFixed(1) + '" cy="' + (22 + Math.sin(a) * 15).toFixed(1) + '" r="1.7" fill="url(#xmBerry)"/>'; }
  var SPRITE =
    '<linearGradient id="xmGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2c4"/><stop offset=".3" stop-color="#c9952e"/><stop offset=".55" stop-color="#f6d58a"/><stop offset=".8" stop-color="#8a5e14"/><stop offset="1" stop-color="#e6bf6a"/></linearGradient>' +
    '<radialGradient id="xmBerry" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#ff9a9a"/><stop offset=".45" stop-color="#d4202e"/><stop offset="1" stop-color="#6a0610"/></radialGradient>' +
    '<radialGradient id="xmGlass" cx="34%" cy="30%" r="75%"><stop offset="0" stop-color="#ffb3b3"/><stop offset=".25" stop-color="#e0303f"/><stop offset=".7" stop-color="#8e0f1c"/><stop offset="1" stop-color="#3e0309"/></radialGradient>' +
    '<radialGradient id="xmGlassG" cx="34%" cy="30%" r="75%"><stop offset="0" stop-color="#b8f0cc"/><stop offset=".25" stop-color="#2f9a5e"/><stop offset=".7" stop-color="#145233"/><stop offset="1" stop-color="#062015"/></radialGradient>' +
    '<linearGradient id="xmLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4caf74"/><stop offset=".5" stop-color="#1f6a40"/><stop offset="1" stop-color="#0b2e1b"/></linearGradient>' +
    '<symbol id="xm-wreath" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20.5" fill="#07140d" stroke="url(#xmGold)" stroke-width="1.6"/>' + wreath +
      '<path d="M22 33c-3-3-8-3-8 0s5 2 8 0zm0 0c3-3 8-3 8 0s-5 2-8 0z" fill="#c8283a" stroke="#5a0610" stroke-width=".5"/><path d="M21 33l-3 6M23 33l3 6" stroke="#b01e2e" stroke-width="1.6" stroke-linecap="round"/><circle cx="22" cy="33" r="1.6" fill="url(#xmGold)"/></symbol>' +
    '<symbol id="xm-bauble" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20.5" fill="#07140d" stroke="url(#xmGold)" stroke-width="1.6"/><path d="M22 4v5" stroke="url(#xmGold)" stroke-width="1"/><rect x="18.5" y="8.5" width="7" height="4" rx="1" fill="url(#xmGold)"/>' +
      '<circle cx="22" cy="24" r="11.5" fill="url(#xmGlass)"/><path d="M11 24.5c4 2.4 18 2.4 22 0" fill="none" stroke="url(#xmGold)" stroke-width="1.4"/><path d="M12 20.5c4-1.6 16-1.6 20 0" fill="none" stroke="url(#xmGold)" stroke-width=".7" opacity=".8"/>' +
      '<ellipse cx="17.5" cy="18.5" rx="3" ry="1.8" transform="rotate(-35 17.5 18.5)" fill="#fff" opacity=".55"/></symbol>' +
    '<symbol id="xm-holly" viewBox="0 0 50 50"><path d="M24 30 C 16 30 8 24 4 14 C 8 15 9 12 8 9 C 12 11 14 9 14 6 C 17 10 20 9 21 7 C 22 14 25 22 24 30z" fill="url(#xmLeaf)" stroke="#0b2e1b" stroke-width=".7"/><path d="M24 30 C 18 22 12 15 7 11" stroke="#0e3a22" stroke-width=".7" fill="none"/>' +
      '<path d="M26 30 C 32 24 40 22 47 26 C 44 28 45 31 47 33 C 43 33 42 36 43 39 C 39 36 36 37 35 39 C 33 34 30 31 26 30z" fill="url(#xmLeaf)" stroke="#0b2e1b" stroke-width=".7"/><path d="M26 30 C 33 28 40 29 45 31" stroke="#0e3a22" stroke-width=".7" fill="none"/>' +
      '<circle cx="24" cy="32" r="3.4" fill="url(#xmBerry)"/><circle cx="29.5" cy="33.5" r="3.1" fill="url(#xmBerry)"/><circle cx="25.8" cy="37.3" r="3" fill="url(#xmBerry)"/><circle cx="23" cy="31" r=".9" fill="#fff" opacity=".6"/></symbol>';

  /* ---------- backdrop: Victorian village under snow ---------- */
  function village() {
    var r = rng(25), s = '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"><defs>' +
      '<linearGradient id="xbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050c18"/><stop offset=".55" stop-color="#0d2238"/><stop offset="1" stop-color="#1e3a55"/></linearGradient>' +
      '<radialGradient id="xbMoon"><stop offset="0" stop-color="#fffbe8"/><stop offset=".12" stop-color="#f4f1e0"/><stop offset=".16" stop-color="rgba(220,235,255,.35)"/><stop offset="1" stop-color="rgba(160,190,240,0)"/></radialGradient>' +
      '<radialGradient id="xbWin"><stop offset="0" stop-color="#fff1b8"/><stop offset=".6" stop-color="#ffb84a"/><stop offset="1" stop-color="#b8620e"/></radialGradient>' +
      '<linearGradient id="xbSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f1fb"/><stop offset="1" stop-color="#9fb6cf"/></linearGradient>' +
      '<filter id="xbBlur"><feGaussianBlur stdDeviation="8"/></filter></defs>' +
      '<rect width="1600" height="900" fill="url(#xbSky)"/><circle cx="1240" cy="170" r="420" fill="url(#xbMoon)"/>';
    s += '<g fill="#fff">'; for (var i = 0; i < 90; i++) s += '<circle class="twinkle' + (i % 2 ? ' b' : '') + '" cx="' + Math.round(r() * 1600) + '" cy="' + Math.round(r() * 420) + '" r="' + (r() * 1.4 + .4).toFixed(1) + '" opacity="' + (r() * .6 + .3).toFixed(2) + '"/>'; s += '</g>';
    s += '<path d="M0 600 C 200 540 380 560 560 590 S 980 540 1200 570 S 1500 560 1600 580 V900 H0z" fill="#29435e" opacity=".8"/>';
    /* far pines */
    s += '<g fill="#16304a">'; for (var p = 0; p < 40; p++) { var x = r() * 1600, h = 40 + r() * 50, y = 600 + r() * 30; s += '<path d="M' + x.toFixed(0) + ' ' + (y - h).toFixed(0) + 'l' + (h * .3).toFixed(0) + ' ' + h.toFixed(0) + 'h-' + (h * .6).toFixed(0) + 'z"/>'; } s += '</g>';
    /* houses */
    var houses = [[40, 140, 120], [190, 120, 150], [330, 160, 110], [520, 110, 130], [1010, 130, 120], [1160, 170, 140], [1350, 120, 110], [1480, 140, 150]];
    houses.forEach(function (hh, k) {
      var x = hh[0], w = hh[1], h = hh[2], base = 720, top = base - h, ridge = top - w * .42;
      s += '<g><path d="M' + x + ' ' + base + 'V' + top + 'L' + (x + w / 2) + ' ' + ridge + 'L' + (x + w) + ' ' + top + 'V' + base + 'z" fill="' + (k % 2 ? '#0d1d2e' : '#0a1724') + '"/>';
      s += '<path d="M' + (x - 8) + ' ' + (top + 4) + 'L' + (x + w / 2) + ' ' + (ridge - 6) + 'L' + (x + w + 8) + ' ' + (top + 4) + 'L' + (x + w) + ' ' + (top + 10) + 'Q' + (x + w / 2) + ' ' + (ridge + 14) + ' ' + x + ' ' + (top + 10) + 'z" fill="url(#xbSnow)"/>';
      var cx = x + w * (k % 2 ? .72 : .26); s += '<rect x="' + (cx - 7) + '" y="' + (ridge + 10) + '" width="14" height="30" fill="#0b1826"/><rect x="' + (cx - 9) + '" y="' + (ridge + 6) + '" width="18" height="6" rx="2" fill="#dfe9f5"/>';
      s += '<circle class="smoke" cx="' + cx + '" cy="' + (ridge - 6) + '" r="9" fill="#9fb3c8" opacity=".3" style="animation-delay:-' + (k * 1.3).toFixed(1) + 's"/>';
      for (var wx = 0; wx < 2; wx++) for (var wy = 0; wy < 2; wy++) { if (r() < .25) continue; s += '<rect x="' + (x + w * (.2 + wx * .44)) + '" y="' + (top + 18 + wy * 46) + '" width="' + (w * .16) + '" height="28" rx="3" fill="url(#xbWin)" opacity=".92"/>'; }
      s += '<rect x="' + (x + w * .42) + '" y="' + (base - 44) + '" width="' + (w * .16) + '" height="44" rx="' + (w * .08) + '" fill="#3a1a0c"/><circle cx="' + (x + w / 2) + '" cy="' + (base - 30) + '" r="7" fill="none" stroke="#2f7a4d" stroke-width="3"/></g>';
    });
    /* church */
    s += '<g fill="#0a1622"><path d="M720 720V520l80-60 80 60v200z"/><path d="M770 470V330l30-90 30 90v140z"/></g><path d="M762 336l38-100 38 100l-6 6l-32-86l-32 86z" fill="url(#xbSnow)"/><path d="M714 524l86-66 86 66l-8 8l-78-58l-78 58z" fill="url(#xbSnow)"/>' +
      '<path d="M786 400a14 14 0 0 1 28 0v34h-28z" fill="url(#xbWin)"/><path d="M780 640a20 20 0 0 1 40 0v80h-40z" fill="url(#xbWin)" opacity=".9"/><circle cx="800" cy="410" r="60" fill="#ffc46b" opacity=".18" filter="url(#xbBlur)"/>';
    /* street lamps */
    [640, 960].forEach(function (lx) { s += '<rect x="' + (lx - 3) + '" y="610" width="6" height="140" fill="#06101a"/><path d="M' + (lx - 12) + ' 612h24l-5-24h-14z" fill="#06101a"/><path d="M' + (lx - 7) + ' 608h14l-3-17h-8z" fill="#ffe2a0"/><circle cx="' + lx + '" cy="600" r="46" fill="#ffc46b" opacity=".22" filter="url(#xbBlur)"/>'; });
    /* snow ground + near pines */
    s += '<path d="M0 740 C 300 700 520 760 800 735 S 1300 700 1600 735 V900 H0z" fill="url(#xbSnow)" opacity=".92"/>';
    s += '<g>'; [[60, 860, 230], [180, 900, 170], [1450, 880, 240], [1560, 900, 180]].forEach(function (t) { var x = t[0], y = t[1], h = t[2];
      for (var q = 0; q < 4; q++) { var ty = y - h + q * h * .2, tw = h * .42 * (.4 + q * .2); s += '<path d="M' + x + ' ' + ty + 'l' + tw + ' ' + h * .34 + 'h-' + tw * 2 + 'z" fill="#0b2418"/><path d="M' + x + ' ' + (ty + 4) + 'l' + tw * .55 + ' ' + h * .17 + 'q-' + tw * .55 + ' -' + h * .05 + ' -' + tw * 1.1 + ' 0z" fill="#dbe7f3"/>'; } }); s += '</g>';
    return s + '</svg>';
  }

  /* ---------- frame + card art ---------- */
  var gold = "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#fff2c4'/><stop offset='.32' stop-color='#c9952e'/><stop offset='.58' stop-color='#f6d58a'/><stop offset='1' stop-color='#7a5414'/></linearGradient><radialGradient id='b' cx='35%' cy='30%' r='70%'><stop offset='0' stop-color='#ff9a9a'/><stop offset='.5' stop-color='#d4202e'/><stop offset='1' stop-color='#5e0610'/></radialGradient><linearGradient id='l' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#56b97c'/><stop offset='.5' stop-color='#1f6a40'/><stop offset='1' stop-color='#0b2e1b'/></linearGradient></defs>";
  var corner = "<path d='M3 57 V14 Q3 3 14 3 H57' fill='none' stroke='url(#g)' stroke-width='2.6' stroke-linecap='round'/><path d='M9 46 V18 Q9 9 18 9 H46' fill='none' stroke='url(#g)' stroke-width='.9' opacity='.8'/>" +
    "<path d='M16 17 C 18 9 26 6 34 8 C 31 10 32 13 34 15 C 30 15 29 18 30 21 C 26 18 23 19 22 21 C 21 18 19 17 16 17z' fill='url(#l)' stroke='#0b2e1b' stroke-width='.5'/>" +
    "<path d='M17 16 C 9 18 6 26 8 34 C 10 31 13 32 15 34 C 15 30 18 29 21 30 C 18 26 19 23 21 22 C 18 21 17 19 17 16z' fill='url(#l)' stroke='#0b2e1b' stroke-width='.5'/>" +
    "<circle cx='17.5' cy='17.5' r='3.3' fill='url(#b)'/><circle cx='22.5' cy='15' r='2.5' fill='url(#b)'/><circle cx='15' cy='22.5' r='2.5' fill='url(#b)'/><circle cx='16.5' cy='16.5' r='.9' fill='#fff' opacity='.7'/>" +
    "<path d='M40 3 l2.5 -3 l2.5 3 M3 40 l-3 2.5 l3 2.5' fill='url(#g)'/><circle cx='52' cy='3' r='1.4' fill='url(#g)'/><circle cx='3' cy='52' r='1.4' fill='url(#g)'/>";
  var vine = "<svg xmlns='http://www.w3.org/2000/svg' width='30' height='160' viewBox='0 0 30 160'><defs><radialGradient id='b' cx='35%' cy='30%'><stop offset='0' stop-color='#ffb0b0'/><stop offset='.5' stop-color='#d4202e'/><stop offset='1' stop-color='#5e0610'/></radialGradient><radialGradient id='w'><stop offset='0' stop-color='#fffbe0'/><stop offset='.35' stop-color='#ffd36b'/><stop offset='1' stop-color='rgba(255,180,60,0)'/></radialGradient><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#8a5e14'/><stop offset='.5' stop-color='#f6d58a'/><stop offset='1' stop-color='#8a5e14'/></linearGradient></defs>" +
    "<path d='M13 0 C 21 20 5 40 13 60 S 21 100 13 120 S 5 150 13 160' fill='none' stroke='#0d2b1b' stroke-width='9' stroke-linecap='round'/>";
  var rv = rng(4);
  for (var n = 0; n < 46; n++) { var yy = n * 3.5, xx = 13 + Math.sin(yy / 160 * Math.PI * 4 + .4) * 6, ang = (rv() - .5) * 140, len = 5 + rv() * 4, rad = ang * Math.PI / 180; vine += "<path d='M" + xx.toFixed(1) + ' ' + yy.toFixed(1) + ' l' + (Math.sin(rad) * len).toFixed(1) + ' ' + (-Math.cos(rad) * len * .6 + 3).toFixed(1) + "' stroke='" + (n % 3 ? '#2a6e45' : '#3f9562') + "' stroke-width='1.6' stroke-linecap='round'/>"; }
  vine += "<path d='M13 0 C 21 20 5 40 13 60 S 21 100 13 120 S 5 150 13 160' fill='none' stroke='url(#g)' stroke-width='.9' stroke-dasharray='2 5' opacity='.85'/>" +
    "<circle cx='19' cy='30' r='3' fill='url(#b)'/><circle cx='22' cy='34' r='2.6' fill='url(#b)'/><circle cx='8' cy='92' r='3' fill='url(#b)'/><circle cx='5' cy='96' r='2.4' fill='url(#b)'/>" +
    "<circle cx='12' cy='62' r='9' fill='url(#w)'/><circle cx='12' cy='62' r='2.2' fill='#fff6d0'/><circle cx='14' cy='136' r='9' fill='url(#w)'/><circle cx='14' cy='136' r='2.2' fill='#fff6d0'/></svg>";
  var rule = "<svg xmlns='http://www.w3.org/2000/svg' width='34' height='14' viewBox='0 0 34 14'><path d='M0 7H20' stroke='#b8924a' stroke-width='1'/><path d='M27 0l1.8 4.6L33.6 5l-3.8 3 1.4 4.8L27 10.2l-4.2 2.6 1.4-4.8-3.8-3 4.8-.4z' fill='#f6d58a'/></svg>";

  L.seasons.christmas = {
    sprite: SPRITE,
    backdrop: village(),
    medals: ['xm-wreath', 'xm-wreath', 'xm-bauble', 'xm-bauble'],
    particles: 'snow',
    art: { defs: gold, corner: corner, vine: vine, rule: rule }
  };
})(window);
