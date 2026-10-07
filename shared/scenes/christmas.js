/* ==========================================================================
   Christmas scene: a snowy village at blue hour, lit pines with coloured lights, a snowman,
   wrapped gifts, warm bokeh and falling snow. Pure vector art built in code.
   Festo.scenes.christmas() -> HTML string for the fixed backdrop.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo; F.scenes = F.scenes || {}; F.art = F.art || {};
  var uid = 0; function id(p) { uid++; return p + uid; }

  function star(cx, cy, r, fill) {
    var pts = [];
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pts.push((cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1)); }
    return '<polygon points="' + pts.join(' ') + '" fill="' + fill + '"/>';
  }

  /* a decorated pine: stacked tiers, snow caps, coloured lights, gold star */
  function pine(o) {
    o = o || {}; var w = o.w || 220, g = id('pn'), rnd = F.util.rng(o.seed || 4);
    var tiers = [[50, 8, 22, 54], [50, 34, 10, 90], [50, 66, 0, 128]];
    var body = '', snow = '', lights = '', cols = ['#ffd24a', '#ff5d6c', '#7bdff2', '#ffffff', '#ffa14a'];
    tiers.forEach(function (t, i) {
      var top = t[1], left = t[2], bottom = t[3] + 4;
      body += '<polygon points="50,' + top + ' ' + (left - 4) + ',' + bottom + ' ' + (100 - left + 4) + ',' + bottom + '" fill="url(#' + g + ')"/>';
      snow += '<path d="M50 ' + top + ' L' + (50 - (50 - left) * 0.5) + ' ' + (top + (bottom - top) * 0.45) + ' Q' + (50 - (50 - left) * 0.3) + ' ' + (top + (bottom - top) * 0.36) + ' 50 ' + (top + (bottom - top) * 0.46) + ' Q' + (50 + (50 - left) * 0.3) + ' ' + (top + (bottom - top) * 0.36) + ' ' + (50 + (50 - left) * 0.5) + ' ' + (top + (bottom - top) * 0.45) + ' Z" fill="#f4faff" opacity=".92"/>';
      for (var k = 0; k < 6; k++) {
        var f = (k + 1) / 7, x = 50 + (rnd() - 0.5) * (50 - left) * 1.6 * f, y = top + (bottom - top) * (0.35 + 0.6 * f * rnd());
        lights += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.2" fill="' + cols[(i * 3 + k) % cols.length] + '" class="bulb"/>';
      }
    });
    return '<svg class="art-pine" viewBox="0 0 100 150" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d8a5f"/><stop offset="1" stop-color="#0f4a35"/></linearGradient></defs>' +
      '<rect x="44" y="124" width="12" height="22" fill="#5b3a22"/>' + body + snow + '<g>' + lights + '</g>' + star(50, 8, 8, '#ffd24a') + '</svg>';
  }

  function snowman(o) {
    o = o || {}; var w = o.w || 120;
    return '<svg class="art-snowman" viewBox="0 0 100 150" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="50" cy="104" rx="36" ry="38" fill="#f6fbff"/><ellipse cx="50" cy="58" rx="27" ry="28" fill="#fbfeff"/><circle cx="50" cy="26" r="19" fill="#ffffff"/>' +
      '<path d="M26 66 Q50 82 74 66 L72 78 Q50 92 28 78 Z" fill="#d62839"/><rect x="62" y="70" width="10" height="24" rx="3" fill="#b3202e"/>' +
      '<rect x="32" y="2" width="36" height="6" rx="2" fill="#1c2540"/><rect x="38" y="-10" width="24" height="14" rx="2" fill="#1c2540"/>' +
      '<circle cx="43" cy="22" r="2.4" fill="#1c2540"/><circle cx="57" cy="22" r="2.4" fill="#1c2540"/><path d="M50 27 L66 31 L50 34 Z" fill="#ff8a1f"/>' +
      '<circle cx="50" cy="52" r="2.6" fill="#1c2540"/><circle cx="50" cy="64" r="2.6" fill="#1c2540"/><circle cx="50" cy="104" r="3" fill="#1c2540"/>' +
      '<path d="M24 56 L4 40 M24 52 L10 52 M76 56 L96 42" stroke="#5b3a22" stroke-width="3" stroke-linecap="round"/></svg>';
  }

  function gift(o) {
    o = o || {}; var w = o.w || 90, c1 = o.c1 || '#d62839', c2 = o.c2 || '#ffd24a';
    return '<svg class="art-gift" viewBox="0 0 100 100" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect x="8" y="34" width="84" height="60" rx="4" fill="' + c1 + '"/><rect x="4" y="22" width="92" height="18" rx="4" fill="' + c1 + '" stroke="rgba(0,0,0,.15)"/>' +
      '<rect x="44" y="22" width="12" height="72" fill="' + c2 + '"/><path d="M50 22 C32 -2 14 8 26 20 C34 26 46 22 50 22 Z M50 22 C68 -2 86 8 74 20 C66 26 54 22 50 22 Z" fill="' + c2 + '"/></svg>';
  }

  function village(o) {
    o = o || {}; var x = o.x || 0, y = o.y || 0, s = o.s || 1;
    function home(hx, hy, w, h, roof) {
      return '<g transform="translate(' + hx + ' ' + hy + ')"><rect x="0" y="' + (-h) + '" width="' + w + '" height="' + h + '" fill="#2b3556"/>' +
        '<polygon points="-8,' + (-h) + ' ' + (w / 2) + ',' + (-h - roof) + ' ' + (w + 8) + ',' + (-h) + '" fill="#f1f7ff"/><polygon points="-8,' + (-h) + ' ' + (w / 2) + ',' + (-h - roof) + ' ' + (w + 8) + ',' + (-h) + '" fill="none" stroke="#c9dbee" stroke-width="2"/>' +
        '<rect x="' + (w * 0.2) + '" y="' + (-h * 0.7) + '" width="' + (w * 0.22) + '" height="' + (h * 0.3) + '" fill="#ffc24a" class="win"/><rect x="' + (w * 0.58) + '" y="' + (-h * 0.7) + '" width="' + (w * 0.22) + '" height="' + (h * 0.3) + '" fill="#ffc24a" class="win"/>' +
        '<rect x="' + (w * 0.42) + '" y="' + (-h * 0.34) + '" width="' + (w * 0.16) + '" height="' + (h * 0.34) + '" fill="#6a3b1d"/></g>';
    }
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + home(0, 0, 120, 70, 44) + home(150, 10, 90, 56, 36) + home(270, -4, 140, 82, 50) + home(440, 8, 100, 60, 38) + '</g>';
  }

  F.art.christmas = { pine: pine, snowman: snowman, gift: gift, village: village };
  F.art.fab = F.art.fab || {};
  F.art.fab.christmas = function () { return '<i class="fa-solid fa-gift"></i>'; };

  F.scenes.christmas = function () {
    var rnd = F.util.rng(21), i, bokeh = '', flakes = '';
    for (i = 0; i < 16; i++) bokeh += '<i class="bk" style="left:' + (rnd() * 100).toFixed(1) + '%;top:' + (rnd() * 70).toFixed(1) + '%;--s:' + (24 + rnd() * 70).toFixed(0) + 'px;animation-delay:-' + (rnd() * 8).toFixed(1) + 's"></i>';
    for (i = 0; i < 34; i++) flakes += '<i class="fl" style="left:' + (rnd() * 100).toFixed(1) + '%;--s:' + (3 + rnd() * 6).toFixed(1) + 'px;animation-duration:' + (9 + rnd() * 12).toFixed(1) + 's;animation-delay:-' + (rnd() * 18).toFixed(1) + 's;--dx:' + ((rnd() - 0.5) * 80).toFixed(0) + 'px"></i>';
    return '' +
      '<svg class="sc-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="csky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9d9f2"/><stop offset=".55" stop-color="#e3f1fb"/><stop offset="1" stop-color="#f8fcff"/></linearGradient>' +
          '<radialGradient id="cglow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6d8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>' +
          '<linearGradient id="chill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d6e8f6"/></linearGradient>' +
        '</defs>' +
        '<rect width="1600" height="900" fill="url(#csky)"/>' +
        '<circle cx="260" cy="170" r="300" fill="url(#cglow)"/>' +
        '<path d="M0 560 Q240 470 520 540 T1040 520 T1600 500 L1600 900 L0 900 Z" fill="#dcecf9"/>' +
        village({ x: 620, y: 600, s: 1.05 }).replace('<g ', '<g class="sc-village" ') +
        '<path d="M0 640 Q300 570 700 630 T1600 600 L1600 900 L0 900 Z" fill="url(#chill)"/>' +
        '<path d="M0 760 Q400 700 900 760 T1600 740 L1600 900 L0 900 Z" fill="#ffffff"/>' +
      '</svg>' +
      '<div class="sc-bokeh">' + bokeh + '</div>' +
      '<div class="sc-foreground">' +
        '<div class="fg fg-l">' + pine({ w: 330, seed: 4 }) + '<span class="gifts">' + gift({ w: 92 }) + gift({ w: 70, c1: '#1f7a5a', c2: '#ffffff' }) + '</span></div>' +
        '<div class="fg fg-r">' + snowman({ w: 150 }) + pine({ w: 280, seed: 9 }) + '</div>' +
      '</div>' +
      '<div class="sc-snow">' + flakes + '</div>' +
      '<div class="sc-vignette"></div>';
  };
})(window);
