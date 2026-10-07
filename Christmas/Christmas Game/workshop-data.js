/* Santa's Workshop: four decorating boards drawn entirely in SVG (no images, no emoji).
   Pieces live in a 0..100 box and are scaled by `size` on the board. */
(function () {
  'use strict';

  /* ---- tiny colour helpers ---- */
  function rgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function hex(a) { return '#' + a.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b); return hex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]); }
  function lum(c) { var v = rgb(c); return (0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2]) / 255; }
  function pts(cx, cy, R, r, n) {
    var out = [];
    for (var i = 0; i < n * 2; i++) { var a = -Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R; out.push((cx + d * Math.cos(a)).toFixed(1) + ',' + (cy + d * Math.sin(a)).toFixed(1)); }
    return out.join(' ');
  }
  function f1(n) { return Math.round(n * 10) / 10; }

  var RED = '#d62839', DRED = '#a61e2b', GREEN = '#1f7a5a', LGREEN = '#3fa37d', GOLD = '#e0a526', BLUE = '#3a86c8', WHITE = '#f7fbff', BROWN = '#8a552e', PINK = '#f08ca8', PURPLE = '#7b4fb3', SILVER = '#c9d6e3';

  /* ---- piece art ---- */
  function ball(c) {
    return '<rect x="43" y="12" width="14" height="10" rx="2" fill="' + GOLD + '"/><circle cx="50" cy="58" r="33" fill="' + c + '"/><circle cx="50" cy="58" r="33" fill="none" stroke="' + mix(c, '#000000', 0.25) + '" stroke-width="2"/>' +
      '<ellipse cx="38" cy="46" rx="10" ry="6" transform="rotate(-35 38 46)" fill="#fff" opacity=".42"/>';
  }
  function star(c) { return '<polygon points="' + pts(50, 54, 42, 18, 5) + '" fill="' + c + '" stroke="' + mix(c, '#000000', 0.25) + '" stroke-width="3" stroke-linejoin="round"/>'; }
  function gift(c) {
    var r = mix(c, '#ffffff', 0.55);
    return '<rect x="16" y="44" width="68" height="46" rx="4" fill="' + c + '"/><rect x="45" y="44" width="10" height="46" fill="' + r + '"/><rect x="16" y="60" width="68" height="9" fill="' + r + '"/>' +
      '<ellipse cx="37" cy="38" rx="13" ry="7" transform="rotate(-25 37 38)" fill="' + r + '"/><ellipse cx="63" cy="38" rx="13" ry="7" transform="rotate(25 63 38)" fill="' + r + '"/><circle cx="50" cy="42" r="5.5" fill="' + r + '"/>';
  }
  function bow(c) {
    var d = mix(c, '#000000', 0.25);
    return '<path d="M50 52L28 88l12-4 6 10z" fill="' + d + '"/><path d="M50 52L72 88l-12-4-6 10z" fill="' + d + '"/><ellipse cx="31" cy="44" rx="21" ry="12" transform="rotate(-20 31 44)" fill="' + c + '"/><ellipse cx="69" cy="44" rx="21" ry="12" transform="rotate(20 69 44)" fill="' + c + '"/><circle cx="50" cy="50" r="8.5" fill="' + d + '"/>';
  }
  function flake() {
    var d = '';
    for (var a = 0; a < 6; a++) {
      var r = a * Math.PI / 3, c = Math.cos(r), s = Math.sin(r), px = 50 + 24 * c, py = 50 + 24 * s;
      d += 'M50 50L' + f1(50 + 38 * c) + ' ' + f1(50 + 38 * s);
      [-1, 1].forEach(function (k) { var b = r + k * Math.PI / 3; d += 'M' + f1(px) + ' ' + f1(py) + 'L' + f1(px + 11 * Math.cos(b)) + ' ' + f1(py + 11 * Math.sin(b)); });
    }
    return '<path d="' + d + '" fill="none" stroke="#7fa3c8" stroke-width="8" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round"/>';
  }
  function holly() {
    return '<ellipse cx="31" cy="50" rx="25" ry="10.5" transform="rotate(-24 31 50)" fill="' + GREEN + '"/><ellipse cx="69" cy="50" rx="25" ry="10.5" transform="rotate(24 69 50)" fill="#26946c"/>' +
      '<path d="M14 56L48 46M86 56L52 46" stroke="#14543d" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="45" cy="58" r="7" fill="' + RED + '"/><circle cx="56" cy="60" r="7" fill="' + RED + '"/><circle cx="50" cy="68" r="7" fill="' + RED + '"/>' +
      '<circle cx="43" cy="56" r="2" fill="#fff" opacity=".6"/><circle cx="54" cy="58" r="2" fill="#fff" opacity=".6"/><circle cx="48" cy="66" r="2" fill="#fff" opacity=".6"/>';
  }
  function poinsettia() {
    var s = '', i;
    for (i = 0; i < 3; i++) s += '<ellipse cx="50" cy="76" rx="9" ry="18" transform="rotate(' + (i * 120 + 60) + ' 50 50)" fill="' + GREEN + '"/>';
    for (i = 0; i < 6; i++) s += '<ellipse cx="50" cy="27" rx="11.5" ry="24" transform="rotate(' + (i * 60) + ' 50 50)" fill="' + DRED + '"/>';
    for (i = 0; i < 6; i++) s += '<ellipse cx="50" cy="32" rx="9" ry="19" transform="rotate(' + (i * 60 + 30) + ' 50 50)" fill="' + RED + '"/>';
    return s + '<circle cx="50" cy="50" r="8" fill="' + GOLD + '"/><circle cx="46" cy="47" r="2" fill="#a06a00"/><circle cx="54" cy="47" r="2" fill="#a06a00"/><circle cx="50" cy="54" r="2" fill="#a06a00"/>';
  }
  function heart(c) { return '<path d="M50 88C12 60 10 30 31 24c10-3 17 4 19 10 2-6 9-13 19-10 21 6 19 36-19 64z" fill="' + c + '" stroke="' + mix(c, '#000000', 0.25) + '" stroke-width="2.5" stroke-linejoin="round"/>'; }
  function ginger() {
    var c = '#b9774a', d = '#8a552e';
    return '<g fill="' + c + '" stroke="' + d + '" stroke-width="2.5" stroke-linejoin="round"><rect x="14" y="40" width="72" height="15" rx="7.5"/><rect x="33" y="58" width="15" height="32" rx="7.5"/><rect x="52" y="58" width="15" height="32" rx="7.5"/><rect x="31" y="38" width="38" height="34" rx="14"/><circle cx="50" cy="24" r="15"/></g>' +
      '<circle cx="44.5" cy="22" r="2.2" fill="#fff"/><circle cx="55.5" cy="22" r="2.2" fill="#fff"/><path d="M43 29q7 6 14 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="50" cy="46" r="3" fill="' + RED + '"/><circle cx="50" cy="55" r="3" fill="' + GREEN + '"/><circle cx="50" cy="64" r="3" fill="' + BLUE + '"/>';
  }
  function miniTree() {
    return '<rect x="45" y="78" width="10" height="14" rx="2" fill="#7a4a24"/><polygon points="50,8 76,44 24,44" fill="' + LGREEN + '" stroke="' + GREEN + '" stroke-width="3" stroke-linejoin="round"/><polygon points="50,28 82,68 18,68" fill="' + GREEN + '" stroke="#14543d" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="45" cy="52" r="3.5" fill="' + RED + '"/><circle cx="60" cy="58" r="3.5" fill="' + GOLD + '"/><circle cx="36" cy="40" r="3" fill="' + GOLD + '"/>';
  }
  function snowman() {
    return '<circle cx="50" cy="76" r="20" fill="#fff" stroke="#9fb7cf" stroke-width="2.5"/><circle cx="50" cy="50" r="15" fill="#fff" stroke="#9fb7cf" stroke-width="2.5"/><circle cx="50" cy="30" r="11.5" fill="#fff" stroke="#9fb7cf" stroke-width="2.5"/>' +
      '<rect x="40" y="9" width="20" height="10" rx="2" fill="#2a3b4d"/><rect x="35" y="18" width="30" height="4" rx="2" fill="#2a3b4d"/><circle cx="46" cy="28" r="1.8" fill="#2a3b4d"/><circle cx="54" cy="28" r="1.8" fill="#2a3b4d"/>' +
      '<polygon points="50,31 66,34 50,36" fill="#f08a24"/><circle cx="50" cy="47" r="2.2" fill="#2a3b4d"/><circle cx="50" cy="54" r="2.2" fill="#2a3b4d"/><circle cx="50" cy="75" r="2.2" fill="#2a3b4d"/><circle cx="50" cy="83" r="2.2" fill="#2a3b4d"/>';
  }
  function pom() { return '<circle cx="50" cy="50" r="30" fill="#fff" stroke="#c9d6e3" stroke-width="2"/><circle cx="41" cy="42" r="12" fill="#eef5fb"/><circle cx="60" cy="58" r="11" fill="#eef5fb"/><circle cx="57" cy="39" r="7" fill="#f7fbff"/>'; }
  function stripes() {
    var s = '<rect x="6" y="36" width="88" height="28" rx="5" fill="#fff"/>';
    for (var i = 0; i < 6; i++) { var x = 14 + i * 14; s += '<polygon points="' + x + ',36 ' + (x + 7) + ',36 ' + (x + 1) + ',64 ' + (x - 6) + ',64" fill="' + RED + '"/>'; }
    return s + '<rect x="6" y="36" width="88" height="28" rx="5" fill="none" stroke="#c9d6e3" stroke-width="2"/>';
  }
  function dots() {
    var s = '', cols = [RED, GOLD, BLUE];
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) s += '<circle cx="' + (22 + c * 28) + '" cy="' + (22 + r * 28) + '" r="9" fill="' + cols[(r + c) % 3] + '"/>';
    return s;
  }
  function zig(c) { return '<path d="M6 60l11-22 11 22 11-22 11 22 11-22 11 22 11-22 11 22" fill="none" stroke="' + c + '" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>'; }
  function sparkle(c) { return '<polygon points="' + pts(50, 50, 42, 9, 4) + '" fill="' + c + '" stroke="' + mix(c, '#000000', 0.22) + '" stroke-width="2" stroke-linejoin="round"/>'; }
  function bell() {
    return '<circle cx="50" cy="11" r="5" fill="' + GOLD + '"/><path d="M50 16c-17 0-23 14-23 30 0 14-8 18-12 26h70c-4-8-12-12-12-26 0-16-6-30-23-30z" fill="' + GOLD + '" stroke="#b07d10" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="38" cy="40" rx="5" ry="12" transform="rotate(12 38 40)" fill="#fff" opacity=".35"/><circle cx="50" cy="79" r="7" fill="#b07d10"/>';
  }
  function cane() {
    var d = 'M66 92V38a18 18 0 1 0-36 0';
    return '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + RED + '" stroke-width="14" stroke-dasharray="9 9"/><path d="' + d + '" fill="none" stroke="#c9d6e3" stroke-width="1" opacity=".6"/>';
  }
  function lights() {
    var p = [[15.5, 54.5], [27, 60], [38.5, 56.5], [50, 44], [61.5, 31], [73, 26], [84.5, 29]], cols = [RED, GOLD, BLUE, '#4ac19b', RED, GOLD, BLUE], s = '<path d="M3 40Q27 78 50 44T97 40" fill="none" stroke="#2a3b4d" stroke-width="2.4" stroke-linecap="round"/>';
    p.forEach(function (q, i) { s += '<circle cx="' + q[0] + '" cy="' + (q[1] + 5) + '" r="5.2" fill="' + cols[i] + '" stroke="#2a3b4d" stroke-width="1.2"/><circle cx="' + (q[0] - 1.5) + '" cy="' + (q[1] + 3.2) + '" r="1.4" fill="#fff" opacity=".8"/>'; });
    return s;
  }
  function peppermint() {
    var s = '<circle cx="50" cy="50" r="38" fill="#fff"/>';
    for (var i = 0; i < 4; i++) {
      var a = i * Math.PI / 2, b = a + Math.PI / 4, R = 38;
      s += '<path d="M50 50L' + f1(50 + R * Math.cos(a)) + ' ' + f1(50 + R * Math.sin(a)) + 'A38 38 0 0 1 ' + f1(50 + R * Math.cos(b)) + ' ' + f1(50 + R * Math.sin(b)) + 'Z" fill="' + RED + '"/>';
    }
    return s + '<circle cx="50" cy="50" r="38" fill="none" stroke="' + RED + '" stroke-width="3"/><circle cx="50" cy="50" r="6" fill="#fff"/>';
  }
  function gumdrop(c) {
    var s = '<path d="M16 84V58C16 32 32 14 50 14s34 18 34 44v26z" fill="' + c + '" stroke="' + mix(c, '#000000', 0.22) + '" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="38" cy="36" rx="8" ry="12" transform="rotate(20 38 36)" fill="#fff" opacity=".32"/>';
    [[30, 62], [46, 72], [62, 58], [70, 74], [40, 50], [58, 40]].forEach(function (q) { s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="2" fill="#fff" opacity=".7"/>'; });
    return s;
  }
  function lolli(c) {
    return '<rect x="47" y="56" width="6" height="38" rx="3" fill="#e9d6b6"/><circle cx="50" cy="36" r="30" fill="' + c + '"/><path d="M50 36a5 5 0 1 1 10 0 10 10 0 1 1-20 0 15 15 0 1 1 30 0 20 20 0 1 1-40 0" fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round"/><ellipse cx="38" cy="24" rx="7" ry="4" transform="rotate(-35 38 24)" fill="#fff" opacity=".4"/>';
  }
  function candyMix() {
    var s = '', cols = [RED, GOLD, BLUE, GREEN, PINK, PURPLE, '#f08a24'];
    [[22, 28], [50, 20], [78, 30], [34, 56], [64, 54], [20, 78], [48, 82], [80, 76]].forEach(function (q, i) { s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="9" fill="' + cols[i % cols.length] + '"/><ellipse cx="' + (q[0] - 3) + '" cy="' + (q[1] - 3) + '" rx="3" ry="2" fill="#fff" opacity=".55"/>'; });
    return s;
  }
  function icingRoof() {
    return '<path d="M4 34Q4 26 12 26H88Q96 26 96 34V42Q96 50 88 50Q82 50 82 58Q82 68 74 68Q66 68 66 58Q66 50 58 50H44Q36 50 36 60Q36 74 26 74Q16 74 16 60Q16 50 8 50Q4 50 4 42Z" fill="#fff" stroke="#c9d6e3" stroke-width="2" stroke-linejoin="round"/>';
  }
  function garland() {
    var s = '<path d="M4 30Q50 96 96 30" fill="none" stroke="' + GREEN + '" stroke-width="10" stroke-linecap="round"/><path d="M4 30Q50 96 96 30" fill="none" stroke="' + LGREEN + '" stroke-width="4" stroke-dasharray="3 9" stroke-linecap="round"/>';
    [[22, 52], [38, 66], [54, 69], [70, 60], [86, 40]].forEach(function (q, i) { s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="4.6" fill="' + (i % 2 ? GOLD : RED) + '"/>'; });
    return s;
  }
  function door() {
    return '<path d="M24 94V44a26 26 0 0 1 52 0v50z" fill="#6b3f1e"/><path d="M33 94V46a17 17 0 0 1 34 0v48" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><circle cx="64" cy="68" r="3.6" fill="' + GOLD + '"/><path d="M24 94h52" stroke="#fff" stroke-width="5"/>';
  }
  function windowP() {
    return '<rect x="20" y="20" width="60" height="60" rx="7" fill="#ffe08a"/><path d="M20 50H80M50 20V80" stroke="#fff" stroke-width="5"/><rect x="20" y="20" width="60" height="60" rx="7" fill="none" stroke="#fff" stroke-width="5"/>';
  }
  function wreath() {
    var s = '<circle cx="50" cy="50" r="30" fill="none" stroke="' + GREEN + '" stroke-width="17"/><circle cx="50" cy="50" r="30" fill="none" stroke="' + LGREEN + '" stroke-width="6" stroke-dasharray="5 10"/>';
    for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5 + 0.4; s += '<circle cx="' + f1(50 + 30 * Math.cos(a)) + '" cy="' + f1(50 + 30 * Math.sin(a)) + '" r="4.2" fill="' + RED + '"/>'; }
    return s + '<g transform="translate(50 82) scale(.32) translate(-50 -50)">' + bow(RED) + '</g>';
  }
  function fence() {
    var s = '<rect x="4" y="54" width="92" height="5" fill="#fff"/><rect x="4" y="72" width="92" height="5" fill="#fff"/>';
    for (var i = 0; i < 6; i++) { var x = 6 + i * 15.5; s += '<polygon points="' + x + ',88 ' + x + ',46 ' + (x + 5) + ',38 ' + (x + 10) + ',46 ' + (x + 10) + ',88" fill="#fff" stroke="#c9d6e3" stroke-width="1.6" stroke-linejoin="round"/>'; }
    return s;
  }
  function lamp() {
    return '<rect x="46" y="38" width="8" height="54" fill="#2a3b4d"/><rect x="38" y="86" width="24" height="8" rx="2" fill="#2a3b4d"/><path d="M36 38l4-18h20l4 18z" fill="#ffe08a" stroke="#2a3b4d" stroke-width="3" stroke-linejoin="round"/><rect x="40" y="14" width="20" height="6" rx="2" fill="#2a3b4d"/>';
  }

  /* ---- shared piece table ---- */
  function P(id, label, svg, size) { return { id: id, label: label, svg: svg, size: size || 56 }; }
  var LIB = {
    ballRed: P('ball-red', 'Red ball', ball(RED), 46), ballGold: P('ball-gold', 'Gold ball', ball(GOLD), 46), ballBlue: P('ball-blue', 'Blue ball', ball(BLUE), 46),
    ballSilver: P('ball-silver', 'Silver ball', ball(SILVER), 46), ballPurple: P('ball-purple', 'Purple ball', ball(PURPLE), 46), ballWhite: P('ball-white', 'White ball', ball('#ffffff'), 46),
    starGold: P('star-gold', 'Gold star', star('#f2c230'), 58), starSilver: P('star-silver', 'Silver star', star(SILVER), 50), starRed: P('star-red', 'Red star', star(RED), 44),
    bell: P('bell', 'Bell', bell(), 48), cane: P('cane', 'Candy cane', cane(), 56), lights: P('lights', 'Lights', lights(), 150),
    giftRed: P('gift-red', 'Red gift', gift(RED), 62), giftGreen: P('gift-green', 'Green gift', gift(GREEN), 58), giftBlue: P('gift-blue', 'Blue gift', gift(BLUE), 54), giftGold: P('gift-gold', 'Gold gift', gift(GOLD), 50),
    bowRed: P('bow-red', 'Red bow', bow(RED), 54), bowGold: P('bow-gold', 'Gold bow', bow('#e8b730'), 54), bowGreen: P('bow-green', 'Green bow', bow(GREEN), 54),
    flake: P('flake', 'Snowflake', flake(), 52), holly: P('holly', 'Holly', holly(), 54), poinsettia: P('poinsettia', 'Poinsettia', poinsettia(), 56),
    heartRed: P('heart-red', 'Red heart', heart(RED), 44), heartWhite: P('heart-white', 'White heart', heart('#ffffff'), 44),
    ginger: P('ginger', 'Gingerbread man', ginger(), 56), tree: P('tree', 'Tiny tree', miniTree(), 60), snowman: P('snowman', 'Snowman', snowman(), 62),
    pom: P('pom', 'Pom-pom', pom(), 40), stripes: P('stripes', 'Stripes', stripes(), 120), dots: P('dots', 'Dots', dots(), 74), zigRed: P('zig-red', 'Zigzag red', zig(RED), 100), zigGreen: P('zig-green', 'Zigzag green', zig(GREEN), 100),
    sparkle: P('sparkle', 'Sparkle', sparkle('#f2c230'), 40), sparkleW: P('sparkle-w', 'White sparkle', sparkle('#ffffff'), 36),
    peppermint: P('peppermint', 'Peppermint', peppermint(), 40),
    gumRed: P('gum-red', 'Red gumdrop', gumdrop(RED), 36), gumGreen: P('gum-green', 'Green gumdrop', gumdrop('#2fa66f'), 36), gumYellow: P('gum-yellow', 'Yellow gumdrop', gumdrop('#f2c230'), 36), gumPurple: P('gum-purple', 'Purple gumdrop', gumdrop(PURPLE), 36), gumPink: P('gum-pink', 'Pink gumdrop', gumdrop(PINK), 36),
    lolliPink: P('lolli-pink', 'Pink lollipop', lolli(PINK), 50), lolliBlue: P('lolli-blue', 'Blue lollipop', lolli(BLUE), 50),
    candies: P('candies', 'Candy buttons', candyMix(), 64),
    icing: P('icing', 'Snow icing', icingRoof(), 170), garland: P('garland', 'Garland', garland(), 110), door: P('door', 'Door', door(), 70), window: P('window', 'Window', windowP(), 56),
    wreath: P('wreath', 'Wreath', wreath(), 56), fence: P('fence', 'Fence', fence(), 130), lamp: P('lamp', 'Lamp post', lamp(), 60)
  };
  function pick() { return Array.prototype.slice.call(arguments).map(function (k) { return LIB[k]; }); }

  /* ---- board bases ---- */
  function bgRect(id, a, b, w, h) {
    return '<defs><linearGradient id="bg' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs><rect width="' + w + '" height="' + h + '" fill="url(#bg' + id + ')"/>';
  }
  function snowDots(w, h) {
    var s = '<g fill="#fff" opacity=".85">';
    for (var i = 0; i < 26; i++) { var x = (i * 97 + 31) % w, y = (i * 61 + 17) % (h - 70); s += '<circle cx="' + x + '" cy="' + y + '" r="' + (1.4 + (i % 3) * 0.9) + '"/>'; }
    return s + '</g>';
  }

  function treeBase(c) {
    var d1 = mix(c, '#000000', 0.18), d2 = mix(c, '#000000', 0.32), st = mix(c, '#000000', 0.45), flocked = lum(c) > 0.8;
    var line = flocked ? '#9fb7cf' : st;
    return bgRect('Tree', '#cfe4f6', '#f4faff', 400, 500) + snowDots(400, 500) +
      '<ellipse cx="200" cy="470" rx="178" ry="22" fill="#fff"/>' +
      '<rect x="178" y="408" width="44" height="52" rx="4" fill="#7a4a24"/>' +
      '<g stroke-linejoin="round" stroke-width="14">' +
      '<path d="M200 200L360 412H40Z" fill="' + d2 + '" stroke="' + d2 + '"/>' +
      '<path d="M200 120L330 300H70Z" fill="' + d1 + '" stroke="' + d1 + '"/>' +
      '<path d="M200 52L282 190H118Z" fill="' + c + '" stroke="' + c + '"/></g>' +
      '<g fill="none" stroke="' + line + '" stroke-width="3" stroke-linecap="round" opacity=".5"><path d="M150 232Q200 262 250 232"/><path d="M130 342Q200 376 270 342"/><path d="M170 150Q200 170 230 150"/></g>' +
      '<ellipse cx="200" cy="452" rx="120" ry="18" fill="' + RED + '"/><ellipse cx="200" cy="448" rx="120" ry="14" fill="' + mix(RED, '#ffffff', 0.18) + '"/>';
  }
  function stockingBase(c) {
    var d = mix(c, '#000000', 0.28), light = lum(c) > 0.8, patch = light ? '#b9cfe4' : mix(c, '#ffffff', 0.42), line = light ? '#9fb7cf' : d;
    return bgRect('Sock', '#f6e6d4', '#fff7ee', 360, 480) +
      '<path d="M212 106C212 38 268 38 268 106" fill="none" stroke="' + GOLD + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M118 110H242V292Q242 330 292 346Q340 362 336 402Q330 440 280 440H178Q116 440 116 372Z" fill="' + c + '" stroke="' + line + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M116 338V372Q116 440 178 440H198Q150 424 150 338Z" fill="' + patch + '"/><path d="M296 350Q340 364 336 402Q330 440 280 440H262Q302 420 296 350Z" fill="' + patch + '"/>' +
      '<rect x="132" y="130" width="14" height="150" rx="7" fill="#fff" opacity=".2"/>' +
      '<rect x="98" y="70" width="164" height="58" rx="28" fill="#fff" stroke="#c9d6e3" stroke-width="3"/><g fill="#e8f1f9"><circle cx="130" cy="98" r="9"/><circle cx="168" cy="108" r="8"/><circle cx="204" cy="94" r="9"/><circle cx="236" cy="106" r="7"/></g>';
  }
  function ornamentBase(c) {
    var d = mix(c, '#000000', 0.3), light = lum(c) > 0.8;
    return bgRect('Orn', '#cfe4f6', '#f4faff', 360, 400) + snowDots(360, 400) +
      '<defs><radialGradient id="orbShine" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient></defs>' +
      '<path d="M180 70V6" stroke="#8aa0b8" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="180" cy="86" r="16" fill="none" stroke="' + GOLD + '" stroke-width="6"/>' +
      '<rect x="150" y="100" width="60" height="36" rx="7" fill="' + GOLD + '" stroke="#b07d10" stroke-width="3"/><path d="M158 110V128M172 110V128M186 110V128M200 110V128" stroke="#b07d10" stroke-width="2" opacity=".6"/>' +
      '<circle cx="180" cy="256" r="124" fill="' + c + '" stroke="' + (light ? '#9fb7cf' : d) + '" stroke-width="4"/><circle cx="180" cy="256" r="124" fill="url(#orbShine)"/>' +
      '<ellipse cx="128" cy="186" rx="30" ry="16" transform="rotate(-38 128 186)" fill="#fff" opacity=".45"/>';
  }
  function houseBase(c) {
    var roof = mix(c, '#000000', 0.26), edge = mix(c, '#000000', 0.42);
    return bgRect('House', '#cfe4f6', '#f4faff', 480, 400) + snowDots(480, 400) +
      '<ellipse cx="240" cy="352" rx="226" ry="34" fill="#fff"/><ellipse cx="240" cy="346" rx="226" ry="28" fill="#eef5fb"/>' +
      '<rect x="306" y="96" width="34" height="76" fill="' + roof + '" stroke="' + edge + '" stroke-width="4"/>' +
      '<rect x="126" y="196" width="228" height="150" fill="' + c + '" stroke="' + edge + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M92 208L240 90L388 208Z" fill="' + roof + '" stroke="' + edge + '" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M92 208H388" stroke="' + edge + '" stroke-width="8" stroke-linecap="round"/>' +
      '<g fill="none" stroke="' + mix(c, '#ffffff', 0.18) + '" stroke-width="2.4" opacity=".7"><path d="M140 232H340M140 262H340M140 292H340M140 322H340"/></g>';
  }

  window.CHRISTMAS_WORKSHOP = {
    season: 'christmas',
    storageKey: 'festo_christmas_workshop',
    exportBg: '#eaf3fb',
    boards: [
      {
        id: 'tree', label: 'Tree', icon: 'tree', w: 400, h: 500, base: treeBase,
        colors: [GREEN, '#2e8b57', '#14543d', '#3f7f93', '#f4f9ff', '#8a63c9'],
        groups: [
          { id: 'orn', label: 'Ornaments', pieces: pick('starGold', 'ballRed', 'ballGold', 'ballBlue', 'ballSilver', 'ballPurple', 'ballWhite', 'bell', 'heartRed', 'starSilver', 'sparkle') },
          { id: 'trim', label: 'Trim', pieces: pick('lights', 'cane', 'bowRed', 'bowGold', 'holly', 'flake', 'sparkleW', 'poinsettia', 'pom', 'peppermint') },
          { id: 'extra', label: 'Underneath', pieces: pick('giftRed', 'giftGreen', 'giftBlue', 'giftGold', 'snowman', 'ginger', 'lolliPink', 'wreath') }
        ]
      },
      {
        id: 'stocking', label: 'Stocking', icon: 'socks', w: 360, h: 480, base: stockingBase,
        colors: [RED, GREEN, BLUE, '#f4f9ff', PURPLE, '#d9487c'],
        groups: [
          { id: 'patch', label: 'Patches', pieces: pick('starGold', 'heartWhite', 'heartRed', 'flake', 'tree', 'holly', 'bell', 'snowman', 'ginger', 'poinsettia') },
          { id: 'trim', label: 'Trim', pieces: pick('stripes', 'zigRed', 'zigGreen', 'dots', 'pom', 'bowGold', 'bowRed', 'lights') },
          { id: 'treats', label: 'Treats', pieces: pick('cane', 'peppermint', 'lolliPink', 'lolliBlue', 'giftGold', 'candies', 'gumRed', 'gumGreen') }
        ]
      },
      {
        id: 'ornament', label: 'Ornament', icon: 'circle', w: 360, h: 400, base: ornamentBase,
        colors: [RED, '#c9a24d', BLUE, GREEN, PURPLE, '#f4f9ff', '#d9487c', '#2a3b4d'],
        groups: [
          { id: 'pattern', label: 'Patterns', pieces: pick('stripes', 'zigRed', 'zigGreen', 'dots', 'flake', 'sparkleW', 'sparkle', 'peppermint') },
          { id: 'charm', label: 'Charms', pieces: pick('starGold', 'heartWhite', 'heartRed', 'holly', 'tree', 'bowGold', 'bowRed', 'poinsettia', 'bell', 'snowman') }
        ]
      },
      {
        id: 'house', label: 'Gingerbread', icon: 'house-chimney', w: 480, h: 400, base: houseBase,
        colors: ['#b9774a', '#c98d5a', '#8a552e', '#d9a066', '#6b4a3a'],
        groups: [
          { id: 'candy', label: 'Candy', pieces: pick('gumRed', 'gumGreen', 'gumYellow', 'gumPurple', 'gumPink', 'peppermint', 'cane', 'lolliPink', 'lolliBlue', 'candies') },
          { id: 'icing', label: 'Icing', pieces: pick('icing', 'door', 'window', 'garland', 'wreath', 'heartWhite', 'flake', 'starGold', 'lights') },
          { id: 'yard', label: 'Yard', pieces: pick('fence', 'tree', 'snowman', 'ginger', 'lamp', 'giftRed', 'giftGreen') }
        ]
      }
    ]
  };
})();
