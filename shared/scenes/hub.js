/* ==========================================================================
   Hub scene: a deep night sky with slow stars, a faint aurora, and four soft glows along the horizon,
   one in each season's colour. Pure CSS + SVG. Festo.scenes.hub() -> HTML string.
   ========================================================================== */
(function (global) {
  'use strict';
  var F = global.Festo; F.scenes = F.scenes || {};
  F.scenes.hub = function () {
    var rnd = F.util.rng(77), i, stars = '';
    for (i = 0; i < 70; i++) stars += '<i class="st" style="left:' + (rnd() * 100).toFixed(1) + '%;top:' + (rnd() * 78).toFixed(1) + '%;--s:' + (1 + rnd() * 2.2).toFixed(1) + 'px;animation-delay:-' + (rnd() * 6).toFixed(1) + 's"></i>';
    return '' +
      '<div class="hb-sky"></div><div class="hb-aurora"></div><div class="hb-stars">' + stars + '</div>' +
      '<svg class="hb-ridge" viewBox="0 0 1600 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="hg1"><stop offset="0" stop-color="#f4a9bf" stop-opacity=".75"/><stop offset="1" stop-color="#f4a9bf" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="hg2"><stop offset="0" stop-color="#ffc933" stop-opacity=".75"/><stop offset="1" stop-color="#ffc933" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="hg3"><stop offset="0" stop-color="#ff8a1f" stop-opacity=".75"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="hg4"><stop offset="0" stop-color="#d62839" stop-opacity=".75"/><stop offset="1" stop-color="#d62839" stop-opacity="0"/></radialGradient>' +
        '</defs>' +
        '<ellipse cx="200" cy="300" rx="320" ry="190" fill="url(#hg1)"/><ellipse cx="600" cy="300" rx="320" ry="190" fill="url(#hg2)"/>' +
        '<ellipse cx="1000" cy="300" rx="320" ry="190" fill="url(#hg3)"/><ellipse cx="1400" cy="300" rx="320" ry="190" fill="url(#hg4)"/>' +
        '<path d="M0 300V250Q200 214 400 246T800 236T1200 250T1600 230V300Z" fill="#0a0d1c"/>' +
      '</svg>';
  };
})(window);
