/* ==========================================================================
   Summer scene: a retro surf-poster beach. Sun with slow rays, drifting clouds, rolling waves, a sailboat,
   palms, a striped umbrella and surfboards in the sand. Flat colour with navy outlines. Pure vector art.
   Festo.scenes.summer() -> HTML string for the fixed backdrop.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo; F.scenes = F.scenes || {}; F.art = F.art || {};
  var NAVY = '#0b3550', uid = 0;
  function id(p) { uid++; return p + uid; }

  function palm(o) {
    o = o || {}; var w = o.w || 240, flip = o.flip ? ' transform="translate(200 0) scale(-1 1)"' : '';
    var fronds = '', angles = [-170, -135, -100, -62, -25, 12, 40, 165];
    angles.forEach(function (a, i) {
      var fill = i % 2 ? '#14a05f' : '#0d8049';
      fronds += '<g transform="translate(132 84) rotate(' + a + ')"><path d="M0 0C22-28 70-38 112-4 82-14 40-6 0 8Z" fill="' + fill + '" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/><path d="M8 0C40-12 70-12 100-4" fill="none" stroke="' + NAVY + '" stroke-width="2" opacity=".45"/></g>';
    });
    return '<svg class="art-palm" viewBox="0 0 200 300" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g' + flip + '>' +
      '<path d="M96 300C92 230 108 150 132 84" fill="none" stroke="' + NAVY + '" stroke-width="22" stroke-linecap="round"/><path d="M96 300C92 230 108 150 132 84" fill="none" stroke="#c98a4b" stroke-width="15" stroke-linecap="round"/>' +
      '<path d="M96 300C92 230 108 150 132 84" fill="none" stroke="' + NAVY + '" stroke-width="15" stroke-dasharray="2 13" opacity=".35"/>' +
      fronds + '<circle cx="124" cy="94" r="8" fill="#7a4a24" stroke="' + NAVY + '" stroke-width="3"/><circle cx="138" cy="98" r="7" fill="#7a4a24" stroke="' + NAVY + '" stroke-width="3"/></g></svg>';
  }

  function umbrella(o) {
    o = o || {}; var w = o.w || 230, c = id('um'), wedges = '', cols = ['#ff5a3c', '#ffffff'];
    for (var i = 0; i < 6; i++) wedges += '<polygon points="100,6 ' + (i * 33.4 - 0) + ',70 ' + ((i + 1) * 33.4) + ',70" fill="' + cols[i % 2] + '"/>';
    return '<svg class="art-umbrella" viewBox="0 0 200 250" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><clipPath id="' + c + '"><path d="M0 72C0 30 44 2 100 2s100 28 100 70c-14-12-32-12-50 0-16-12-34-12-50 0-16-12-34-12-50 0-18-12-36-12-50 0z"/></clipPath></defs>' +
      '<rect x="95" y="60" width="10" height="180" rx="3" fill="#f6e3b4" stroke="' + NAVY + '" stroke-width="3"/>' +
      '<g clip-path="url(#' + c + ')">' + wedges + '</g>' +
      '<path d="M0 72C0 30 44 2 100 2s100 28 100 70c-14-12-32-12-50 0-16-12-34-12-50 0-16-12-34-12-50 0-18-12-36-12-50 0z" fill="none" stroke="' + NAVY + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<circle cx="100" cy="4" r="6" fill="#ffc933" stroke="' + NAVY + '" stroke-width="3"/></svg>';
  }

  function board(o) {
    o = o || {}; var w = o.w || 60, c = o.c || '#ffc933', s = o.s || '#ff5a3c', rot = o.rot || 0;
    return '<svg class="art-board" viewBox="0 0 44 232" width="' + w + '" style="transform:rotate(' + rot + 'deg);transform-origin:50% 100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M22 2C36 36 42 76 42 134 42 192 32 218 22 230 12 218 2 192 2 134 2 76 8 36 22 2Z" fill="' + c + '" stroke="' + NAVY + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M22 14V222" stroke="' + s + '" stroke-width="5"/><path d="M8 110H36M7 128H37" stroke="' + s + '" stroke-width="4" opacity=".8"/></svg>';
  }

  function ball(o) {
    o = o || {}; var w = o.w || 56;
    return '<svg class="art-ball" viewBox="0 0 60 60" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="30" cy="30" r="26" fill="#fff" stroke="' + NAVY + '" stroke-width="3.5"/>' +
      '<path d="M30 4C18 14 14 30 18 56M30 4C42 14 46 30 42 56" fill="none" stroke="#ff5a3c" stroke-width="9"/><path d="M4 30C16 24 44 24 56 30" fill="none" stroke="#00a6c7" stroke-width="9"/><circle cx="30" cy="30" r="26" fill="none" stroke="' + NAVY + '" stroke-width="3.5"/></svg>';
  }

  function cloud(x, y, s, o) {
    return '<g class="sc-cloud" style="--cx:' + (o || 0) + 's" transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 52a30 30 0 0 1 44-26 40 40 0 0 1 76 8 28 28 0 0 1 30 18z" fill="#ffffff" opacity=".96"/></g>';
  }

  function waveBand(y, color, amp, period, opacity) {
    var d = 'M0 ' + y, n = Math.ceil(4800 / period), half = period / 2, i;
    d += ' q' + (period / 4) + ' ' + (-amp) + ' ' + half + ' 0';
    for (i = 1; i < n * 2; i++) d += ' t' + half + ' 0';
    d += ' V300 H0Z';
    return '<path d="' + d + '" fill="' + color + '" opacity="' + (opacity || 1) + '"/>';
  }

  function boat(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 0L60 0 50 14H10Z" fill="#ff5a3c" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/><path d="M30-4V-70L66-10Z" fill="#fff" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/><path d="M26-6V-56L2-10Z" fill="#ffc933" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/></g>';
  }

  function sunRays(cx, cy) {
    var s = '';
    for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, a1 = a - 0.07, a2 = a + 0.07, r1 = 118, r2 = 176; s += '<polygon points="' + (cx + Math.cos(a1) * r1).toFixed(1) + ',' + (cy + Math.sin(a1) * r1).toFixed(1) + ' ' + (cx + Math.cos(a) * r2).toFixed(1) + ',' + (cy + Math.sin(a) * r2).toFixed(1) + ' ' + (cx + Math.cos(a2) * r1).toFixed(1) + ',' + (cy + Math.sin(a2) * r1).toFixed(1) + '" fill="#ffd95a"/>'; }
    return s;
  }

  F.art.summer = { palm: palm, umbrella: umbrella, board: board, ball: ball };
  F.art.fab = F.art.fab || {};
  F.art.fab.summer = function () {
    var r = '';
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; r += '<line x1="' + (24 + Math.cos(a) * 15).toFixed(1) + '" y1="' + (24 + Math.sin(a) * 15).toFixed(1) + '" x2="' + (24 + Math.cos(a) * 21).toFixed(1) + '" y2="' + (24 + Math.sin(a) * 21).toFixed(1) + '" stroke="' + NAVY + '" stroke-width="3.4" stroke-linecap="round"/>'; }
    return '<svg viewBox="0 0 48 48" width="40" height="40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + r + '<circle cx="24" cy="24" r="10.5" fill="#ff5a3c" stroke="' + NAVY + '" stroke-width="3"/></svg>';
  };

  F.scenes.summer = function () {
    var rnd = F.util.rng(33), i, birds = '';
    for (i = 0; i < 3; i++) birds += '<path class="sc-bird" style="--d:' + (28 + i * 9) + 's;animation-delay:-' + (i * 11) + 's" transform="translate(' + (200 + i * 90) + ' ' + (120 + i * 34) + ')" d="M0 0q8-10 16 0 8-10 16 0" fill="none" stroke="' + NAVY + '" stroke-width="3" stroke-linecap="round"/>';
    return '' +
      '<svg class="sc-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="usky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#35bfe8"/><stop offset=".6" stop-color="#9ee4f6"/><stop offset="1" stop-color="#e8fbff"/></linearGradient>' +
          '<linearGradient id="usea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0aa6c9"/><stop offset="1" stop-color="#0a7fa6"/></linearGradient>' +
          '<linearGradient id="usand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe9b5"/><stop offset="1" stop-color="#f1cf8a"/></linearGradient>' +
          '<radialGradient id="uglow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff7c2" stop-opacity=".95"/><stop offset="1" stop-color="#fff7c2" stop-opacity="0"/></radialGradient>' +
        '</defs>' +
        '<rect width="1600" height="900" fill="url(#usky)"/>' +
        '<circle cx="1260" cy="210" r="320" fill="url(#uglow)"/>' +
        '<g class="sc-rays">' + sunRays(1260, 210) + '</g>' +
        '<circle cx="1260" cy="210" r="104" fill="#ffc933" stroke="' + NAVY + '" stroke-width="5"/><circle cx="1230" cy="184" r="22" fill="#fff" opacity=".4"/>' +
        cloud(160, 150, 1.5, -2) + cloud(620, 240, 1.1, -9) + cloud(900, 110, 0.9, -15) + cloud(1450, 330, 0.8, -6) +
        birds +
        '<rect x="0" y="520" width="1600" height="400" fill="url(#usea)"/>' +
        boat(520, 520).replace('<g ', '<g class="sc-boat" ') +
        '<g class="sc-wv sc-wv1" transform="translate(0 540)">' + waveBand(0, '#13b9dd', 14, 400, 0.9) + '</g>' +
        '<g class="sc-wv sc-wv2" transform="translate(0 600)">' + waveBand(0, '#4fd2ec', 18, 480, 0.95) + '</g>' +
        '<g class="sc-wv sc-wv3" transform="translate(0 660)">' + waveBand(0, '#a8ecf6', 16, 360, 0.95) + '</g>' +
        '<path d="M0 730Q200 700 420 724T860 716T1280 726T1600 706V900H0Z" fill="url(#usand)"/>' +
        '<path d="M0 730Q200 700 420 724T860 716T1280 726T1600 706" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity=".9"/>' +
        '<path d="M0 800Q300 770 620 800T1280 790T1600 780V900H0Z" fill="#f0c97a" opacity=".55"/>' +
      '</svg>' +
      '<div class="sc-foreground">' +
        '<div class="fg fg-l">' + palm({ w: 300 }) + '<span class="fg-ground">' + umbrella({ w: 230 }) + '</span></div>' +
        '<div class="fg fg-r">' + '<span class="fg-boards">' + board({ w: 54, rot: -9 }) + board({ w: 54, c: '#ff5a3c', s: '#ffffff', rot: 3 }) + board({ w: 54, c: '#00a6c7', s: '#ffc933', rot: 11 }) + '</span>' + ball({ w: 62 }) + palm({ w: 260, flip: true }) + '</div>' +
      '</div>';
  };
})(window);
