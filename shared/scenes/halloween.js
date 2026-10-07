/* ==========================================================================
   Halloween scene: a moonlit yard of glowing jack-o'-lanterns, a haunted house on the hill,
   bare trees, ghosts, bats and drifting fog. Pure vector art, built in code (no image files).
   Festo.scenes.halloween() -> HTML string for the fixed backdrop.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo; F.scenes = F.scenes || {}; F.art = F.art || {};
  var uid = 0;
  function id(p) { uid++; return p + uid; }

  /* ---- pumpkin: three lobes, ribs, stem, carved glowing face ---- */
  function pumpkin(o) {
    o = o || {};
    var g = id('pg'), f = id('pf'), w = o.w || 120, face = o.face == null ? 0 : o.face, lit = o.lit !== false;
    var faces = [
      // 0: classic triangle eyes, nose, jagged grin
      '<path d="M38 44 L52 40 L48 56 Z M82 44 L68 40 L72 56 Z M60 56 L54 68 L66 68 Z M36 72 Q60 96 84 72 L78 74 L72 70 L66 78 L60 72 L54 78 L48 70 L42 74 Z"/>',
      // 1: round eyes, soft smile
      '<circle cx="46" cy="52" r="7"/><circle cx="74" cy="52" r="7"/><path d="M60 60 L55 68 L65 68 Z"/><path d="M40 76 Q60 92 80 76 Q60 84 40 76 Z"/>',
      // 2: angry brows, fangs
      '<path d="M34 50 L54 44 L52 58 Z M86 50 L66 44 L68 58 Z M60 60 L55 68 L65 68 Z M38 74 L46 70 L50 82 L56 72 L60 84 L64 72 L70 82 L74 70 L82 74 Q60 94 38 74 Z"/>',
      // 3: surprised
      '<ellipse cx="46" cy="50" rx="6" ry="9"/><ellipse cx="74" cy="50" rx="6" ry="9"/><path d="M60 60 L55 68 L65 68 Z"/><ellipse cx="60" cy="82" rx="10" ry="8"/>'
    ];
    return '<svg class="art-pumpkin" viewBox="0 0 120 108" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><radialGradient id="' + g + '" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#ffb347"/><stop offset=".55" stop-color="#ff7a00"/><stop offset="1" stop-color="#a83e00"/></radialGradient>' +
      '<filter id="' + f + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
      '<path d="M56 14 Q54 4 62 2 Q64 8 64 14 Z" fill="#4c6b22" stroke="#2f4513" stroke-width="1.5"/>' +
      '<ellipse cx="34" cy="62" rx="27" ry="38" fill="url(#' + g + ')" stroke="#8a3600" stroke-width="1.5"/>' +
      '<ellipse cx="86" cy="62" rx="27" ry="38" fill="url(#' + g + ')" stroke="#8a3600" stroke-width="1.5"/>' +
      '<ellipse cx="60" cy="60" rx="31" ry="42" fill="url(#' + g + ')" stroke="#8a3600" stroke-width="1.5"/>' +
      '<path d="M60 20 Q50 60 60 102 M44 24 Q30 62 42 98 M76 24 Q90 62 78 98" stroke="#b34700" stroke-width="2" fill="none" opacity=".55"/>' +
      (lit ? '<g fill="#ffe27a" filter="url(#' + f + ')">' + faces[face % faces.length] + '</g>' : '<g fill="#3a1500">' + faces[face % faces.length] + '</g>') +
      '</svg>';
  }

  function ghost(o) {
    o = o || {}; var g = id('gh'), w = o.w || 90;
    return '<svg class="art-ghost" viewBox="0 0 100 120" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6fbff" stop-opacity=".95"/><stop offset="1" stop-color="#bfd6ee" stop-opacity=".55"/></linearGradient></defs>' +
      '<path d="M12 58 C12 22 30 6 50 6 C70 6 88 22 88 58 L88 108 L76 98 L64 110 L50 98 L36 110 L24 98 L12 108 Z" fill="url(#' + g + ')"/>' +
      '<ellipse cx="37" cy="52" rx="7" ry="10" fill="#1d2440"/><ellipse cx="63" cy="52" rx="7" ry="10" fill="#1d2440"/>' +
      '<ellipse cx="50" cy="76" rx="8" ry="10" fill="#1d2440" opacity=".85"/></svg>';
  }

  function bat(o) {
    o = o || {}; var w = o.w || 60;
    return '<svg class="art-bat" viewBox="0 0 120 60" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M60 14 L66 4 L68 16 Q84 8 100 16 Q112 22 118 14 Q114 36 94 36 Q86 28 78 36 L70 52 L60 40 L50 52 L42 36 Q34 28 26 36 Q6 36 2 14 Q8 22 20 16 Q36 8 52 16 L54 4 Z" fill="#0b0712"/></svg>';
  }

  function candle(o) {
    o = o || {}; var w = o.w || 34, f = id('cf');
    return '<svg class="art-candle" viewBox="0 0 40 90" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><radialGradient id="' + f + '"><stop offset="0" stop-color="#fff2b0"/><stop offset="1" stop-color="#ff9a1f" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="20" cy="18" r="22" fill="url(#' + f + ')" class="flame-glow"/>' +
      '<rect x="8" y="30" width="24" height="56" rx="4" fill="#ff7a1a"/><rect x="8" y="30" width="8" height="56" rx="4" fill="#ff9a40"/>' +
      '<path d="M20 6 C26 14 26 22 20 28 C14 22 14 14 20 6 Z" fill="#ffd45a" class="flame"/></svg>';
  }

  function house(o) {
    o = o || {}; var w = o.w || 360;
    var win = function (x, y, ww, hh) { return '<rect x="' + x + '" y="' + y + '" width="' + ww + '" height="' + hh + '" rx="2" fill="#ffc54a" class="win"/>'; };
    return '<svg class="art-house" viewBox="0 0 400 320" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M40 300 L40 150 L100 90 L100 40 L116 40 L116 78 L170 24 L224 78 L224 50 L240 50 L240 96 L300 150 L300 300 Z" fill="#0d0816"/>' +
      '<path d="M170 24 L170 6 M164 14 L176 14" stroke="#0d0816" stroke-width="4"/>' +
      '<path d="M300 300 L300 180 L360 140 L360 300 Z" fill="#0d0816"/><path d="M290 190 L330 120 L370 190 Z" fill="#0d0816"/>' +
      win(70, 170, 22, 34) + win(120, 170, 22, 34) + win(210, 170, 22, 34) + win(250, 170, 22, 34) + win(150, 110, 24, 34) + win(190, 220, 16, 26) + win(322, 200, 18, 28) +
      '<path d="M150 300 L150 240 Q170 220 190 240 L190 300 Z" fill="#241438"/></svg>';
  }

  /* recursive bare tree as stroked paths */
  function tree(o) {
    o = o || {}; var rnd = F.util.rng(o.seed || 7), out = [];
    (function branch(x, y, len, ang, depth, wid) {
      if (depth <= 0 || len < 6) return;
      var x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      out.push('<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" stroke-width="' + wid.toFixed(1) + '"/>');
      var n = depth > 3 ? 2 : 2 + (rnd() > 0.55 ? 1 : 0);
      for (var i = 0; i < n; i++) branch(x2, y2, len * (0.68 + rnd() * 0.12), ang + (rnd() - 0.5) * 1.1 + (i - (n - 1) / 2) * 0.35, depth - 1, wid * 0.7);
    })(o.x || 100, o.y || 300, o.len || 70, -Math.PI / 2 + (o.lean || 0), o.depth || 8, o.wid || 9);
    return '<g stroke="#0a0610" stroke-linecap="round" fill="none">' + out.join('') + '</g>';
  }

  function web(o) {
    o = o || {}; var w = o.w || 120, s = '';
    for (var i = 0; i < 7; i++) { var a = (i / 7) * Math.PI / 2; s += '<path d="M0 0 L' + (100 * Math.cos(a)).toFixed(1) + ' ' + (100 * Math.sin(a)).toFixed(1) + '"/>'; }
    for (var r = 18; r <= 96; r += 20) { var p = 'M' + r + ' 0'; for (var k = 1; k <= 7; k++) { var a2 = (k / 7) * Math.PI / 2, rr = r * (k % 2 ? 0.86 : 1); p += ' Q' + (rr * Math.cos(a2 - 0.11)).toFixed(1) + ' ' + (rr * Math.sin(a2 - 0.11)).toFixed(1) + ' ' + (r * Math.cos(a2)).toFixed(1) + ' ' + (r * Math.sin(a2)).toFixed(1); } s += '<path d="' + p + '"/>'; }
    return '<svg class="art-web" viewBox="0 0 100 100" width="' + w + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke="currentColor" stroke-width=".8" fill="none" opacity=".75">' + s + '</g></svg>';
  }

  F.art.fab = F.art.fab || {};
  F.art.fab.halloween = function () { return pumpkin({ w: 66, face: 0 }); };
  F.art.halloween = { pumpkin: pumpkin, ghost: ghost, bat: bat, candle: candle, house: house, tree: tree, web: web };

  /* ---- the full-screen scene ---- */
  F.scenes.halloween = function () {
    var stars = '', rnd = F.util.rng(11), i;
    for (i = 0; i < 70; i++) stars += '<circle cx="' + (rnd() * 1600).toFixed(0) + '" cy="' + (rnd() * 420).toFixed(0) + '" r="' + (0.5 + rnd() * 1.3).toFixed(1) + '" opacity="' + (0.25 + rnd() * 0.6).toFixed(2) + '"/>';
    var trees = tree({ x: 60, y: 900, len: 120, depth: 9, wid: 16, seed: 3, lean: 0.12 }) + tree({ x: 330, y: 900, len: 90, depth: 8, wid: 12, seed: 9, lean: -0.1 }) +
                tree({ x: 1500, y: 900, len: 130, depth: 9, wid: 18, seed: 5, lean: -0.1 }) + tree({ x: 1260, y: 900, len: 80, depth: 8, wid: 11, seed: 14, lean: 0.15 });
    var embers = '';
    for (i = 0; i < 22; i++) embers += '<i class="ember" style="left:' + (rnd() * 100).toFixed(1) + '%;animation-delay:-' + (rnd() * 14).toFixed(1) + 's;animation-duration:' + (9 + rnd() * 9).toFixed(1) + 's;--s:' + (2 + rnd() * 4).toFixed(1) + 'px"></i>';
    return '' +
      '<svg class="sc-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0714"/><stop offset=".55" stop-color="#1c1230"/><stop offset="1" stop-color="#2d1a3f"/></linearGradient>' +
          '<radialGradient id="hmoon" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff9e0"/><stop offset=".7" stop-color="#f1e3b2"/><stop offset="1" stop-color="#d9c88f"/></radialGradient>' +
          '<radialGradient id="hglow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".45"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="hlit" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="#ff8a1f" stop-opacity=".35"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient>' +
        '</defs>' +
        '<rect width="1600" height="900" fill="url(#hsky)"/>' +
        '<g fill="#fff">' + stars + '</g>' +
        '<circle cx="1230" cy="190" r="260" fill="url(#hglow)"/><circle cx="1230" cy="190" r="92" fill="url(#hmoon)"/>' +
        '<g fill="#cdbd85" opacity=".35"><circle cx="1200" cy="170" r="14"/><circle cx="1262" cy="214" r="10"/><circle cx="1240" cy="150" r="6"/></g>' +
        '<g class="sc-far"><path d="M0 640 Q220 560 420 620 T820 600 T1220 630 T1600 590 L1600 900 L0 900 Z" fill="#150d24"/></g>' +
        '<g transform="translate(1030 330)">' + house({ w: 460 }).replace(/^<svg[^>]*>/, '<svg viewBox="0 0 400 320" width="520" height="416">') + '</g>' +
        '<g class="sc-trees">' + trees + '</g>' +
        '<path d="M0 760 Q300 700 700 750 T1600 730 L1600 900 L0 900 Z" fill="#0c0714"/>' +
        '<rect y="560" width="1600" height="340" fill="url(#hlit)"/>' +
        '<g class="sc-ghost" transform="translate(260 380)">' + ghost({ w: 110 }).replace(/^<svg[^>]*>/, '<svg viewBox="0 0 100 120" width="110" height="132">') + '</g>' +
        '<g class="sc-ghost g2" transform="translate(1030 470)" opacity=".7">' + ghost({ w: 70 }).replace(/^<svg[^>]*>/, '<svg viewBox="0 0 100 120" width="70" height="84">') + '</g>' +
      '</svg>' +
      '<div class="sc-fog f1"></div><div class="sc-fog f2"></div>' +
      '<div class="sc-foreground">' +
        '<div class="fg fg-l">' + pumpkin({ w: 250, face: 0 }) + '<span class="c1">' + candle({ w: 40 }) + '</span>' + pumpkin({ w: 160, face: 1 }) + '</div>' +
        '<div class="fg fg-r">' + pumpkin({ w: 190, face: 2 }) + pumpkin({ w: 280, face: 3 }) + '<span class="c2">' + candle({ w: 46 }) + '</span></div>' +
      '</div>' +
      '<div class="sc-bats"><span class="b1">' + bat({ w: 54 }) + '</span><span class="b2">' + bat({ w: 38 }) + '</span><span class="b3">' + bat({ w: 46 }) + '</span></div>' +
      '<div class="sc-embers">' + embers + '</div>' +
      '<div class="sc-vignette"></div>';
  };
})(window);
