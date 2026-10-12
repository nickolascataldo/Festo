// node tools/regen-pages.js [filter]
// Regenerates the small module pages (HTML + the one-line mount script) from shared/seasons/index.js and tools/pages.json.
// Page-specific data lives beside each page (wheel-data.js, store-data.js, map-data.js, ...). Edit pages.json to add a module.
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = path.resolve(__dirname, '..').split(path.sep).join('/') + '/';
const reg = {};
vm.runInNewContext(fs.readFileSync(R + 'shared/seasons/index.js', 'utf8'), { window: { Festo: { registerSeason: (id, d) => (reg[id] = d) } } });

const LEAFLET_CSS = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">';
const LEAFLET_JS = '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>';

// The season look layered over every module page: Halloween's gothic layer, and the luxe layer for the other three.
// Landing pages are hand-built (Halloween Landing page/, shared/luxe/<season>-landing.js), so they are skipped here.
const PRE = '<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
const LUXE_FONTS = {
  christmas: 'family=Pinyon+Script&family=Playfair+Display+SC:wght@400;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600',
  summer: 'family=Yeseva+One&family=Josefin+Sans:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500',
  spring: 'family=Fraunces:ital,opsz,wght@1,9..144,500;1,9..144,600;1,9..144,700&family=Jost:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600'
};
function layer(season) {
  if (season === 'halloween') return {
    cls: 'gh-theme gh-shell',
    head: [PRE, '<link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@500;600;700;900&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet" data-gh-fonts>', '<link rel="stylesheet" href="../../shared/themes/halloween-gothic.css?v=5">'],
    tail: ['<script src="../../shared/themes/halloween-gothic.js?v=1"></script>', '<script src="../../shared/radio/stations.js?v=1"></script>', '<script src="../../shared/radio/radio.js?v=1"></script>']
  };
  return {
    cls: 'lx lx-shell',
    head: [PRE, '<link href="https://fonts.googleapis.com/css2?' + LUXE_FONTS[season] + '&display=swap" rel="stylesheet" data-lx-fonts>', '<link rel="stylesheet" href="../../shared/luxe/luxe-base.css?v=3">', '<link rel="stylesheet" href="../../shared/luxe/luxe-pages.css?v=2">', '<link rel="stylesheet" href="../../shared/luxe/' + season + '.css?v=2">'],
    tail: ['<script src="../../shared/luxe/' + season + '.js?v=2"></script>', '<script src="../../shared/luxe/luxe-atmos.js?v=2"></script>', '<script src="../../shared/radio/stations.js?v=1"></script>', '<script src="../../shared/radio/radio.js?v=1"></script>']
  };
}

// engines: shared/engines/<name>.js, data: files beside the page, js/css: module files beside the page
const pages = require('./pages.json');

const list = v => v || [];
function s0(id) { return reg[id].name; }
function build(p) {
  const s = reg[p.season], m = p.module === 'landing' ? { title: s0(p.season) } : s.modules.find(x => x.id === p.module);
  if (!m) throw new Error('unknown module ' + p.season + '.' + p.module);
  const file = R + s.root + '/' + p.dir + '/' + p.file;
  const up = '../../shared/';
  const isMap = !!p.leaflet;
  const landingRel = path.posix.relative(s.root + '/' + p.dir, s.root + '/' + s.landing);
  const lay = layer(p.season);
  const html = `<!DOCTYPE html>
<html lang="en" data-season="${p.season}" class="${lay.cls}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.module === 'landing' ? s.name : m.title + ' · ' + s.name} · Festo</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">${isMap ? '\n  ' + LEAFLET_CSS : ''}
  <link rel="stylesheet" href="${up}festo-core.css">
  <link rel="stylesheet" href="${up}engines/fx-engines.css">
  <link rel="stylesheet" href="${up}themes/${p.season}.css">
  <link rel="stylesheet" href="${up}scenes/poster.css?v=4">${p.css ? `\n  <link rel="stylesheet" href="${p.css}">` : ''}
${lay.head.map(l => '  ' + l).join('\n')}
</head>
<body class="fx-body">
  <main id="fx-main" class="fx-main${isMap ? ' fx-main--wide' : ''}">
    <noscript><div class="fx-soon"><h1 class="fx-h2">${m.title}</h1><p class="fx-muted">This page needs JavaScript.</p><a class="fx-btn" href="${landingRel}">Back</a></div></noscript>
  </main>${isMap ? '\n  ' + LEAFLET_JS : ''}
  <script src="${up}festo-core.js"></script>
  <script src="${up}seasons/index.js"></script>
  <script src="${up}scenes/${p.season}.js"></script>
  <script src="${up}scenes/poster.js?v=6"></script>
  <script src="${up}navs.js"></script>
${list(p.engines).map(e => `  <script src="${up}engines/${e}.js"></script>`).join('\n')}
${list(p.data).map(d => `  <script src="${d}"></script>`).join('\n')}
  <script src="${p.js}"></script>
${lay.tail.map(l => '  ' + l).join('\n')}
</body>
</html>
`.replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(file, html.replace(/\n/g, '\r\n'));
  return s.root + '/' + p.dir + '/' + p.file;
}

const sub = p => (p.subtitle ? `, subtitle: ${JSON.stringify(p.subtitle).replace(/'/g, "\\'").replace(/^"|"$/g, "'")}` : '');
const TEMPLATES = {
  music: (p) => `Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: '${p.season}', module: 'music'${sub(p)} });
  Festo.guard('the music page', function () { FestoMusic.mount(main, window.${p.global}); });
});
`,
  wheel: (p) => `Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: '${p.season}', module: 'wheel'${sub(p)} });
  Festo.guard('the wheel', function () { FestoWheel.mountPage(main, window.${p.global}); });
});
`,
  store: (p) => `Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: '${p.season}', module: 'store'${sub(p)} });
  Festo.guard('the shop', function () { FestoStore.mount(main, window.${p.global}); });
});
`,
  landing: (p) => `Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: '${p.season}', module: 'landing' });
  Festo.guard('the home page', function () { FestoLanding.mount(main, '${p.season}'); });
});
`,
  arcade: (p) => `Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: '${p.season}', module: '${p.module}'${sub(p)} });
  Festo.guard('the game', function () { FestoArcade.mount(main, window.${p.global}); });
});
`,
  studio: (p) => `Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: '${p.season}', module: '${p.module}'${sub(p)} });
  Festo.guard('the workshop', function () { FestoStudio.mount(main, window.${p.global}); });
});
`,
  pumpkin: (p) => `Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: 'halloween', module: 'pumpkin' });
  Festo.guard('the pumpkin studio', function () { FestoPumpkin.mount(main, { storageKey: 'festo_halloween_pumpkin' }); });
});
`,
  map: (p) => `Festo.dom.ready(function () {
  var main = Festo.shell.mount({ season: '${p.season}', module: 'map'${sub(p)} });
  Festo.guard('the map', function () { FestoMap.mount(main, Object.assign({ title: '${p.mapTitle || 'Map'}' }, window.${p.global})); });
});
`
};
const filter = process.argv[2];
let n = 0;
for (const p of pages) {
  if (filter && !(p.season + '.' + p.module).includes(filter)) continue;
  if (p.module === 'landing') continue;
  if (p.template) { const sd = reg[p.season]; fs.writeFileSync(R + sd.root + '/' + p.dir + '/' + p.js, TEMPLATES[p.template](p).replace(/\n/g, '\r\n')); }
  console.log('wrote', build(p)); n++;
}
console.log(n, 'pages');
