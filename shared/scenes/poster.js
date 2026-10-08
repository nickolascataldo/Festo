/* Poster artwork for the intro page: one calm, layered illustration per season.
   No outlines, no cartoon props. Each piece is a gradient sky, one focal light, three depth layers of land,
   a few quiet silhouettes, and film grain on top. Composed in an 800 x 800 box with the horizon near 60%, so it
   crops well in tall cards, wide strips and thin columns. Intro.art(id) -> element (class in-scene). */
(function (global) {
  'use strict';
  var F = global.Festo, I = global.Intro, uid = 0, PHOTOS = []; /* Intro is optional: season pages load this file without it. */

  function ridge(rnd, base, amp, fill, steps, extra) {
    steps = steps || 12; var pts = [], i, d;
    for (i = 0; i <= steps; i++) pts.push([i * 800 / steps, base - amp * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(i * 0.85 + rnd() * 5))) - rnd() * amp * 0.25]);
    d = 'M0 800V' + pts[0][1].toFixed(1);
    for (i = 1; i <= steps; i++) { var mx = (pts[i - 1][0] + pts[i][0]) / 2, my = (pts[i - 1][1] + pts[i][1]) / 2; d += 'Q' + pts[i - 1][0].toFixed(1) + ' ' + pts[i - 1][1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1); }
    d += 'L800 ' + pts[steps][1].toFixed(1) + 'V800Z';
    return '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function pine(x, y, h, fill) {
    var w = h * 0.34, s = '<g fill="' + fill + '">';
    for (var t = 0; t < 4; t++) { var ty = y - h * (0.18 + t * 0.22), tw = w * (1 - t * 0.2); s += '<polygon points="' + x + ',' + (ty - h * 0.32) + ' ' + (x - tw) + ',' + ty + ' ' + (x + tw) + ',' + ty + '"/>'; }
    return s + '<rect x="' + (x - h * 0.02) + '" y="' + (y - h * 0.1) + '" width="' + h * 0.04 + '" height="' + h * 0.1 + '"/></g>';
  }
  function branch(rnd, x, y, len, ang, depth, w, out) {
    if (depth === 0 || len < 4) return;
    var x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    out.push('<line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke-width="' + w.toFixed(1) + '"/>');
    branch(rnd, x2, y2, len * (0.72 + rnd() * 0.1), ang - 0.45 - rnd() * 0.3, depth - 1, w * 0.68, out);
    branch(rnd, x2, y2, len * (0.7 + rnd() * 0.1), ang + 0.4 + rnd() * 0.35, depth - 1, w * 0.68, out);
  }
  function dots(rnd, n, x0, x1, y0, y1, r0, r1, fill, cls, op) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<circle class="' + cls + '" style="--d:' + (6 + rnd() * 10).toFixed(1) + 's;animation-delay:-' + (rnd() * 12).toFixed(1) + 's;--dx:' + ((rnd() - 0.5) * 60).toFixed(0) + 'px" cx="' + (x0 + rnd() * (x1 - x0)).toFixed(0) + '" cy="' + (y0 + rnd() * (y1 - y0)).toFixed(0) + '" r="' + (r0 + rnd() * (r1 - r0)).toFixed(1) + '" fill="' + fill + '" opacity="' + (op || 0.8) + '"/>';
    return s;
  }
  function grad(id, stops, vertical) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vertical === false ? 1 : 0) + '" y2="' + (vertical === false ? 0 : 1) + '">' + stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join('') + '</linearGradient>';
  }
  function glow(id, color, a) { return '<radialGradient id="' + id + '"><stop offset="0" stop-color="' + color + '" stop-opacity="' + a + '"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></radialGradient>'; }

  var SEASON = {
    halloween: function (rnd, k) {
      var tree = []; branch(rnd, 150, 640, 120, -1.7, 7, 9, tree);
      var tree2 = []; branch(rnd, 690, 600, 70, -1.45, 5, 5, tree2);
      return '<defs>' + grad('sk' + k, [[0, '#0d0a21'], [0.45, '#2d1450'], [0.72, '#7a2a5a'], [1, '#e0642a']]) + glow('hl' + k, '#ffd9a0', 0.55) + '</defs>' +
        '<rect width="800" height="800" fill="url(#sk' + k + ')"/>' + dots(rnd, 36, 0, 800, 20, 420, 0.7, 1.6, '#fff', 'in-tw', 0.75) +
        '<circle cx="545" cy="355" r="330" fill="url(#hl' + k + ')"/><circle cx="545" cy="355" r="92" fill="#fbeccb"/>' +
        '<circle cx="520" cy="330" r="14" fill="#e9d3a8" opacity=".55"/><circle cx="575" cy="390" r="20" fill="#e9d3a8" opacity=".45"/><circle cx="565" cy="320" r="9" fill="#e9d3a8" opacity=".5"/>' +
        '<g fill="#150a24"><path d="M410 250c8-10 18-10 24 0 6-8 16-8 22 2-10-2-16 2-22 8-6-6-14-10-24-10z"/><path d="M630 215c6-8 14-8 19 0 5-6 12-6 17 2-8-2-13 1-17 6-5-5-11-8-19-8z"/><path d="M300 300c5-7 12-7 16 0 4-5 10-5 14 2-7-1-11 2-14 5-4-4-9-7-16-7z"/></g>' +
        ridge(rnd, 520, 70, '#4a1c55', 10, ' opacity=".9"') + ridge(rnd, 585, 60, '#2a1040', 9) +
        '<g fill="#1a0a2c"><rect x="560" y="560" width="70" height="52"/><polygon points="552,562 595,520 638,562"/><rect x="612" y="528" width="12" height="26"/></g>' +
        '<rect x="572" y="576" width="9" height="12" fill="#ffb347"/><rect x="598" y="576" width="9" height="12" fill="#ffb347" opacity=".85"/>' +
        ridge(rnd, 660, 55, '#12071f', 8) + '<g stroke="#0a0414" stroke-linecap="round" fill="none">' + tree.join('') + tree2.join('') + '</g>' +
        ridge(rnd, 735, 40, '#080312', 7) + dots(rnd, 16, 0, 800, 520, 800, 1.2, 2.6, '#ffb347', 'in-ember', 0.9);
    },
    christmas: function (rnd, k) {
      var pines = '';
      [[70, 560, 150], [130, 580, 210], [235, 600, 120], [640, 570, 170], [715, 590, 240], [770, 560, 130]].forEach(function (p) { pines += pine(p[0], p[1], p[2], '#0f3a3d'); });
      var near = '';
      [[40, 760, 300], [150, 780, 220], [690, 770, 320], [770, 790, 230]].forEach(function (p) { near += pine(p[0], p[1], p[2], '#082a2e'); });
      return '<defs>' + grad('sk' + k, [[0, '#0a1a38'], [0.4, '#1f4373'], [0.75, '#7aa7cf'], [1, '#f4dcb4']]) + glow('hl' + k, '#ffe6b0', 0.6) + '</defs>' +
        '<rect width="800" height="800" fill="url(#sk' + k + ')"/>' + dots(rnd, 26, 0, 800, 20, 330, 0.7, 1.5, '#fff', 'in-tw', 0.7) +
        '<ellipse cx="400" cy="520" rx="420" ry="150" fill="url(#hl' + k + ')"/>' +
        ridge(rnd, 500, 50, '#6d8fb8', 9) + ridge(rnd, 545, 45, '#b5cbe2', 9) + pines +
        ridge(rnd, 600, 40, '#dbe8f4', 8) +
        '<g><rect x="360" y="566" width="84" height="52" fill="#13304a"/><polygon points="350,568 402,524 454,568" fill="#0d2238"/><rect x="424" y="528" width="12" height="26" fill="#0d2238"/><rect x="380" y="582" width="16" height="20" fill="#ffc46b"/><rect x="408" y="582" width="16" height="20" fill="#ffc46b" opacity=".8"/></g>' +
        ridge(rnd, 680, 45, '#f1f7fc', 8) + near + ridge(rnd, 750, 30, '#ffffff', 6) +
        dots(rnd, 46, 0, 800, 0, 700, 1.2, 3.4, '#fff', 'in-snow', 0.9);
    },
    summer: function (rnd, k) {
      var bands = '';
      for (var i = 0; i < 9; i++) bands += '<rect x="' + (400 - 150 + i * 14) + '" y="' + (545 + i * 17) + '" width="' + (300 - i * 28) + '" height="' + (4 + i * 0.7) + '" rx="2" fill="#ffe3a6" opacity="' + (0.8 - i * 0.07).toFixed(2) + '"/>';
      var stripes = '';
      for (var j = 0; j < 6; j++) stripes += '<rect x="250" y="' + (440 + j * 14) + '" width="300" height="' + (2 + j * 1.2) + '" fill="#000"/>';
      return '<defs>' + grad('sk' + k, [[0, '#6b2a6e'], [0.35, '#e8506a'], [0.62, '#ff9a4d'], [1, '#ffd98a']]) + grad('se' + k, [[0, '#0b6a8f'], [1, '#06304a']]) + glow('hl' + k, '#ffd08a', 0.75) +
        '<mask id="sm' + k + '"><rect width="800" height="800" fill="#fff"/>' + stripes + '</mask></defs>' +
        '<rect width="800" height="800" fill="url(#sk' + k + ')"/><circle cx="400" cy="470" r="340" fill="url(#hl' + k + ')"/>' +
        '<circle cx="400" cy="470" r="118" fill="#fff4cf" mask="url(#sm' + k + ')"/>' +
        '<path d="M120 250c10-10 22-10 30 0 8-9 20-9 28 1" stroke="#4a1a52" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/><path d="M590 190c8-8 18-8 25 0 7-7 16-7 23 1" stroke="#4a1a52" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>' +
        '<rect y="540" width="800" height="260" fill="url(#se' + k + ')"/>' + bands +
        '<g fill="#04283b"><polygon points="640,540 700,540 690,532 650,532 646,500 650,532"/></g>' +
        '<g class="in-sway" fill="none" stroke="#04283b" stroke-linecap="round"><path d="M230 800C235 700 250 610 290 520" stroke-width="16"/>' +
        '<path d="M290 520C250 470 200 470 150 500M290 520C270 455 230 430 180 420M290 520C310 460 360 440 410 450M290 520C340 480 390 500 430 540M290 520C265 500 240 505 210 530" stroke-width="9"/></g>' +
        '<g class="in-sway" fill="none" stroke="#04283b" stroke-linecap="round"><path d="M730 800C720 720 700 650 660 590" stroke-width="12"/><path d="M660 590C630 550 590 548 550 570M660 590C650 540 620 520 580 515M660 590C690 545 735 540 770 560M660 590C700 575 740 590 765 625" stroke-width="7"/></g>' +
        '<path d="M0 800V760Q200 730 400 758T800 745V800Z" fill="#02202f"/>';
    },
    spring: function (rnd, k) {
      var br = []; branch(rnd, -20, 120, 150, 0.35, 6, 7, br);
      var blossoms = '';
      for (var i = 0; i < 130; i++) { var x = rnd() * 440, y = 30 + rnd() * 300 * (1 - x / 900), r = 6 + rnd() * 9; blossoms += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + r.toFixed(1) + '" fill="' + (rnd() > 0.45 ? '#f9b9cd' : '#fff1f5') + '" opacity="' + (0.7 + rnd() * 0.3).toFixed(2) + '"/>'; }
      var tul = '';
      [[90, 735], [170, 750], [260, 738], [350, 755], [455, 740], [560, 752], [655, 738], [735, 750]].forEach(function (p, n) { var c = ['#e87fa0', '#f6c453', '#b79be0', '#fff', '#e87fa0', '#f6c453', '#b79be0', '#fff'][n]; tul += '<g class="in-sway"><path d="M' + p[0] + ' ' + (p[1] + 50) + 'V' + p[1] + '" stroke="#3f7d4a" stroke-width="3" fill="none"/><ellipse cx="' + p[0] + '" cy="' + (p[1] - 8) + '" rx="9" ry="14" fill="' + c + '"/></g>'; });
      return '<defs>' + grad('sk' + k, [[0, '#bfe0f5'], [0.5, '#f6dbe6'], [1, '#fff1dc']]) + glow('hl' + k, '#fff4cf', 0.95) + '</defs>' +
        '<rect width="800" height="800" fill="url(#sk' + k + ')"/><circle cx="560" cy="330" r="300" fill="url(#hl' + k + ')"/>' +
        '<path d="M470 190c8-8 18-8 25 0 7-7 16-7 23 1M610 150c7-7 15-7 21 0 6-6 14-6 20 1" stroke="#5b6b7a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>' +
        ridge(rnd, 520, 60, '#dcefd8', 9) + ridge(rnd, 580, 55, '#bde3b2', 9) + ridge(rnd, 650, 50, '#93d08a', 8) + ridge(rnd, 725, 40, '#66b56d', 7) + tul +
        '<g stroke="#6b4a3a" stroke-linecap="round" fill="none" opacity=".95">' + br.join('') + '</g>' + blossoms +
        dots(rnd, 14, 0, 800, 0, 600, 3, 6, '#f9b9cd', 'in-petal', 0.85);
    }
  };

  /* Returns the SVG markup for a season's poster. */
  F.poster = function (id) {
    var k = ++uid, rnd = F.util.rng(F.util.hashStr(id) + 7);
    return '<svg class="in-poster" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + SEASON[id](rnd, k) +
      '<filter id="gr' + k + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>' +
      '<rect width="800" height="800" filter="url(#gr' + k + ')" opacity=".2" style="mix-blend-mode:overlay"/>' +
      /* To use a real picture for a season, add the file at shared/img/season/<season>.jpg and list the season in PHOTOS. */
      (PHOTOS.indexOf(id) >= 0 ? '<image href="' + F.rootUrl + 'shared/img/season/' + id + '.jpg" width="800" height="800" preserveAspectRatio="xMidYMid slice"/>' : '') + '</svg>';
  };
  /* Every season page and the intro page use the same posters as their backdrop. */
  F.scenes = F.scenes || {};
  Object.keys(SEASON).forEach(function (id) { F.scenes[id] = function () { return F.poster(id); }; });
  /* Intro page helpers */
  if (I) {
    I.art = function (id) { var el = F.dom.h('div', { class: 'in-scene in-art', 'data-season': id, 'aria-hidden': 'true' }); el.innerHTML = F.poster(id); return el; };
    I.scene = I.art;
  }
})(window);
