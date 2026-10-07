/* ==========================================================================
   Spring scene: a soft watercolour meadow. Pale sky, rolling hills dotted with flowers, a cherry-blossom tree,
   a row of tulips, butterflies and drifting petals. Pure vector art built in code.
   Festo.scenes.spring() -> HTML string for the fixed backdrop.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo; F.scenes = F.scenes || {}; F.art = F.art || {};
  var uid = 0; function id(p) { uid++; return p + uid; }

  /* a cherry-blossom tree: curved trunk, forked branches, a canopy of overlapping pink clusters */
  function blossomTree(o) {
    o = o || {}; var w = o.w || 320, rnd = F.util.rng(o.seed || 5), pinks = ['#f9c6d4', '#f4a9bf', '#ffdbe4', '#f08fae', '#fbd2dc'], c = '', i;
    var spots = [[150, 100, 78], [90, 140, 62], [210, 140, 64], [150, 60, 54], [60, 100, 44], [240, 100, 46], [120, 170, 44], [190, 175, 46]];
    spots.forEach(function (s) {
      for (i = 0; i < 6; i++) {
        var a = rnd() * Math.PI * 2, d = rnd() * s[2] * 0.8, r = 14 + rnd() * 24;
        c += '<circle cx="' + (s[0] + Math.cos(a) * d).toFixed(1) + '" cy="' + (s[1] + Math.sin(a) * d * 0.8).toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + pinks[Math.floor(rnd() * pinks.length)] + '" opacity=".9"/>';
      }
    });
    var dots = '';
    for (i = 0; i < 26; i++) dots += '<circle cx="' + (40 + rnd() * 220).toFixed(0) + '" cy="' + (30 + rnd() * 170).toFixed(0) + '" r="' + (2 + rnd() * 2.4).toFixed(1) + '" fill="#ffffff" opacity=".85"/>';
    return '<svg class="art-tree" viewBox="0 0 300 380" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M146 380C144 320 150 270 140 214M146 300C120 270 96 250 70 200M148 262C176 234 200 214 232 168" fill="none" stroke="#6b4a3a" stroke-width="16" stroke-linecap="round"/>' +
      '<path d="M146 380C144 320 150 270 140 214" fill="none" stroke="#8a6350" stroke-width="7" stroke-linecap="round" opacity=".7"/>' +
      '<g class="canopy">' + c + dots + '</g></svg>';
  }

  function tulip(o) {
    o = o || {}; var w = o.w || 56, col = o.c || '#e0607e', dk = o.d || '#b83f5f', g = id('tg');
    return '<svg class="art-tulip" viewBox="0 0 60 150" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M30 70C30 100 28 124 30 150" fill="none" stroke="#4f8a4c" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M30 140C14 128 8 108 8 90 20 102 28 118 30 140Z" fill="#6ab466"/><path d="M30 146C46 132 52 114 52 98 40 108 32 124 30 146Z" fill="#5aa457"/>' +
      '<path d="M30 14C12 18 8 46 16 60 22 70 38 70 44 60 52 46 48 18 30 14Z" fill="' + col + '"/>' +
      '<path d="M30 14C20 26 20 50 30 68 40 50 40 26 30 14Z" fill="' + dk + '" opacity=".55"/>' +
      '<path d="M18 22C22 14 28 12 30 14 26 24 24 40 26 60 16 54 12 36 18 22Z" fill="#fff" opacity=".18"/></svg>';
  }

  function daisy(o) {
    o = o || {}; var w = o.w || 40, s = '';
    for (var i = 0; i < 10; i++) s += '<ellipse cx="50" cy="26" rx="8" ry="20" transform="rotate(' + (i * 36) + ' 50 50)" fill="#ffffff" stroke="#e6dcc7" stroke-width="1.5"/>';
    return '<svg class="art-daisy" viewBox="0 0 100 100" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + s + '<circle cx="50" cy="50" r="13" fill="#f2c94c"/><circle cx="46" cy="46" r="4" fill="#ffe595"/></svg>';
  }

  function butterfly(o) {
    o = o || {}; var w = o.w || 44, c1 = o.c1 || '#9b8bd1', c2 = o.c2 || '#f4a9bf';
    return '<svg class="art-bfly" viewBox="0 0 80 60" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<g class="wing wl"><path d="M40 30C28 6 6 4 4 18 2 30 20 38 40 30Z" fill="' + c1 + '"/><path d="M40 32C26 36 14 50 24 56 34 60 40 44 40 32Z" fill="' + c2 + '"/></g>' +
      '<g class="wing wr"><path d="M40 30C52 6 74 4 76 18 78 30 60 38 40 30Z" fill="' + c1 + '"/><path d="M40 32C54 36 66 50 56 56 46 60 40 44 40 32Z" fill="' + c2 + '"/></g>' +
      '<rect x="38" y="20" width="4" height="28" rx="2" fill="#4a3b45"/></svg>';
  }

  function flower5(c, ring) {
    var s = '';
    for (var i = 0; i < 5; i++) s += '<ellipse cx="24" cy="12" rx="8" ry="11" transform="rotate(' + (i * 72) + ' 24 24)" fill="' + c + '"/>';
    return '<svg viewBox="0 0 48 48" width="42" height="42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + s + '<circle cx="24" cy="24" r="7" fill="' + (ring || '#f2c94c') + '"/></svg>';
  }

  F.art.spring = { blossomTree: blossomTree, tulip: tulip, daisy: daisy, butterfly: butterfly };
  F.art.fab = F.art.fab || {};
  F.art.fab.spring = function () { return flower5('#ffffff', '#f2c94c'); };

  F.scenes.spring = function () {
    var rnd = F.util.rng(14), i, petals = '', bumps = '';
    for (i = 0; i < 30; i++) petals += '<i class="pt" style="left:' + (rnd() * 100).toFixed(1) + '%;--s:' + (9 + rnd() * 10).toFixed(1) + 'px;--dur:' + (12 + rnd() * 12).toFixed(1) + 's;--sw:' + (3 + rnd() * 4).toFixed(1) + 's;--dx:' + ((rnd() - 0.5) * 220).toFixed(0) + 'px;animation-delay:-' + (rnd() * 20).toFixed(1) + 's,-' + (rnd() * 6).toFixed(1) + 's"></i>';
    for (i = 0; i < 46; i++) {
      var x = rnd() * 1600, y = 680 + rnd() * 200, c = ['#ffffff', '#f4a9bf', '#f2c94c', '#cdb8f2', '#ffffff'][Math.floor(rnd() * 5)];
      bumps += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (3 + rnd() * 4).toFixed(1) + '" fill="' + c + '"/>';
    }
    var farTrees = '';
    [180, 420, 760, 1010, 1330, 1500].forEach(function (x, k) { farTrees += '<g transform="translate(' + x + ' ' + (572 + (k % 2) * 14) + ')"><rect x="-3" y="14" width="6" height="26" fill="#8a6350"/><circle cx="0" cy="0" r="' + (30 + (k % 3) * 6) + '" fill="#f7bfd0"/><circle cx="-16" cy="12" r="20" fill="#f4a9bf"/><circle cx="18" cy="10" r="22" fill="#fbd2dc"/></g>'; });
    return '' +
      '<svg class="sc-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="spsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9ecf8"/><stop offset=".55" stop-color="#f3eef0"/><stop offset="1" stop-color="#fdf3e3"/></linearGradient>' +
          '<radialGradient id="spglow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>' +
          '<linearGradient id="sph1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4e9c8"/><stop offset="1" stop-color="#bddcae"/></linearGradient>' +
          '<linearGradient id="sph2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d49b"/><stop offset="1" stop-color="#8fc27f"/></linearGradient>' +
          '<linearGradient id="sph3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86bd74"/><stop offset="1" stop-color="#6aa65a"/></linearGradient>' +
        '</defs>' +
        '<rect width="1600" height="900" fill="url(#spsky)"/>' +
        '<circle cx="1320" cy="150" r="300" fill="url(#spglow)"/><circle cx="1320" cy="150" r="58" fill="#fff6d1" opacity=".95"/>' +
        '<g fill="#ffffff" opacity=".85"><path d="M180 170a34 34 0 0 1 64-14 40 40 0 0 1 76 8 28 28 0 0 1 8 56H196a28 28 0 0 1-16-50z"/><path d="M820 120a26 26 0 0 1 50-10 32 32 0 0 1 58 8 22 22 0 0 1 6 44H836a22 22 0 0 1-16-42z"/></g>' +
        '<path d="M0 560Q260 500 560 548T1120 536T1600 512V900H0Z" fill="url(#sph1)"/>' + farTrees +
        '<path d="M0 640Q300 580 680 630T1300 612T1600 600V900H0Z" fill="url(#sph2)"/>' +
        '<path d="M0 740Q360 680 800 730T1600 700V900H0Z" fill="url(#sph3)"/>' +
        '<g opacity=".95">' + bumps + '</g>' +
      '</svg>' +
      '<div class="sc-foreground">' +
        '<div class="fg fg-l">' + blossomTree({ w: 340, seed: 5 }) + '<span class="fg-flowers">' + daisy({ w: 38 }) + daisy({ w: 30 }) + '</span></div>' +
        '<div class="fg fg-r"><span class="fg-tulips">' + tulip({ w: 54 }) + tulip({ w: 64, c: '#f2c94c', d: '#c99a1a' }) + tulip({ w: 50, c: '#9b8bd1', d: '#6f5fb0' }) + tulip({ w: 60, c: '#f08fae', d: '#c85a82' }) + tulip({ w: 52, c: '#ffffff', d: '#c9bfae' }) + '</span></div>' +
      '</div>' +
      '<div class="sc-bflies">' + butterfly({ w: 40 }).replace('<svg ', '<svg style="--k:0" ') + butterfly({ w: 30, c1: '#f2c94c', c2: '#f08fae' }).replace('<svg ', '<svg style="--k:1" ') + '</div>' +
      '<div class="sc-petals">' + petals + '</div>' +
      '<div class="sc-paper"></div>';
  };
})(window);
