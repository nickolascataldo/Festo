// Site check: node tools/check-site.mjs [root] [--data]
// Checks every href/src/url() against disk (case-exact), zero-byte linked files, fonts, viewport, claims.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execSync } from 'node:child_process';

import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(process.argv.slice(2).find(a => !a.startsWith('--')) || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const out = [];
const rel = f => path.relative(ROOT, f).split(path.sep).join('/');
const bad = (k, f, m = '') => out.push(`${k.padEnd(9)} ${rel(f)}  ${m}`);
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
  (e.name === '.git' || e.name === '.claude' || e.name === 'tools') ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(ROOT);

function exact(abs) {
  const segs = path.relative(ROOT, abs).split(path.sep);
  if (segs[0] === '..') return 'OUTSIDE';
  let cur = ROOT;
  for (const s of segs) {
    let names = [];
    try { names = fs.readdirSync(cur); } catch {}
    if (names.includes(s)) { cur = path.join(cur, s); continue; }
    return names.some(n => n.toLowerCase() === s.toLowerCase()) ? 'CASE' : 'MISSING';
  }
  return 'OK';
}
const external = u => /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|%23|\{|\$|data:)/i.test(u.trim());
function check(from, ref, baseDir) {
  if (!ref || external(ref)) return;
  let p = ref.split('#')[0].split('?')[0];
  try { p = decodeURIComponent(p); } catch {}
  if (!p) return;
  const abs = path.resolve(baseDir, p);
  const r = exact(abs);
  if (r !== 'OK') return bad(r, from, ref);
  const st = fs.statSync(abs);
  if (st.isFile() && st.size <= 1 && /\.(html|css|js)$/i.test(abs)) bad('EMPTY', from, ref);
}

const scriptUsers = new Map();
for (const f of files.filter(f => /\.html$/i.test(f))) {
  const s = fs.readFileSync(f, 'utf8'), dir = path.dirname(f);
  for (const m of s.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi)) {
    check(f, m[1], dir);
    if (/\.js(\?|#|$)/i.test(m[1]) && !external(m[1])) {
      let a;
      try { a = path.resolve(dir, decodeURIComponent(m[1].split('?')[0])); } catch { continue; }
      if (!scriptUsers.has(a)) scriptUsers.set(a, []);
      scriptUsers.get(a).push(dir);
    }
  }
  for (const m of s.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) check(f, m[1], dir);
  const fams = new Set([...s.matchAll(/[?&]family=([^&:"']+)/g)].map(m => decodeURIComponent(m[1]).replace(/\+/g, ' ')));
  if (fams.size > 3) bad('FONTS', f, `${fams.size}: ${[...fams].join(', ')}`);
  const vp = s.match(/<meta[^>]+name=["']viewport["'][^>]*>/i);
  if (!vp) bad('VIEWPORT', f, 'missing');
  else if (/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(vp[0])) bad('VIEWPORT', f, 'zoom disabled');
  if (/1,?000\+?\s*(books|reads|films|reels|volumes|shelves)|1,000\+/i.test(s)) bad('CLAIM', f, 'hard-coded 1,000 claim');
}
for (const f of files.filter(f => /\.css$/i.test(f))) {
  const s = fs.readFileSync(f, 'utf8').replace(/["']data:image[^"']*["']/g, '""');
  for (const m of s.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) check(f, m[1], path.dirname(f));
}
for (const f of files.filter(f => /\.js$/i.test(f) && !/(Data\d*\.js|_Part\d+|HalloweenData|Playlist|-data\.js|shared[\\/]seasons[\\/])/i.test(f))) {
  const s = fs.readFileSync(f, 'utf8'), bases = new Set(scriptUsers.get(f) || [path.dirname(f)]);
  for (const m of s.matchAll(/['"`]((?:\.{1,2}\/|[A-Z][\w ]*\/)[^'"`\n$]*\.(?:html|js|css|png|jpe?g|svg|webp|gif))['"`]/g))
    for (const b of bases) check(f, m[1], b);
}
// season registry: every module route must exist and be non-empty
try {
  const reg = {};
  const F = { registerSeason(id, d) { reg[id] = d; } };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'shared/seasons/index.js'), 'utf8'), { window: { Festo: F } });
  for (const [id, s] of Object.entries(reg)) {
    const targets = [['landing', s.landing], ...s.modules.map(m => [m.id, m.path])];
    for (const [mid, p] of targets) {
      const abs = path.join(ROOT, s.root, p), r = exact(abs);
      if (r !== 'OK') bad(r, path.join(ROOT, 'shared/seasons/index.js'), `${id}.${mid} -> ${s.root}/${p}`);
      else if (fs.statSync(abs).size <= 1) bad('EMPTY', abs, `registry ${id}.${mid}`);
    }
  }
} catch (e) { bad('REGISTRY', path.join(ROOT, 'shared/seasons/index.js'), e.message); }
for (const f of files) if (fs.statSync(f).size <= 1) bad('ZEROBYTE', f);
try {
  const tracked = execSync('git ls-files', { cwd: ROOT }).toString().split(/\r?\n/).filter(Boolean);
  const disk = new Set(files.map(rel));
  for (const t of tracked) if (!disk.has(t) && fs.existsSync(path.join(ROOT, t))) bad('GITCASE', path.join(ROOT, t), 'tracked name differs in case from disk');
} catch {}

if (process.argv.includes('--data')) {
  const isbnOk = s => {
    s = String(s || '').replace(/[-\s]/g, '');
    if (s.length === 13) return /^\d{13}$/.test(s) && [...s].reduce((a, c, i) => a + c * (i % 2 ? 3 : 1), 0) % 10 === 0;
    if (s.length === 10) return /^\d{9}[\dX]$/.test(s) && [...s].reduce((a, c, i) => a + (c === 'X' ? 10 : +c) * (10 - i), 0) % 11 === 0;
    return false;
  };
  const sets = [
    ['Spring Book', 'Spring/Book List/Book Data', /SpringBook_Data\d+\.js$/, 'springBookData', 'book'],
    ['Spring Movie', 'Spring/Movie list/Movie Data', /SpringData_Part\d+\.js$/, 'springData', 'movie'],
    ['Summer Book', 'Summer/Book List/Book Data', /SummerBook_Data\d+\.js$/, 'summerBookData', 'book'],
    ['Summer Movie', 'Summer/Movie List/Movie Data', /SummerData_Part\d+\.js$/, 'summerData', 'movie'],
    ['Spooky Book', 'Halloween/Spooky Reads/Book Data', /SpookyBook_Data\d+\.js$/, 'spookyBookData', 'book'],
    ['Halloween Movie', 'Halloween/Halloween Movie List', /HalloweenData\.js$/, 'halloweenData', 'movie'],
    ['Christmas Book', 'Christmas/Book List/Data List', /ChristmasReads_Data\d+\.js$/, 'christmasBookData', 'book'],
    ['Christmas Movie', 'Christmas/Movie List/Movie Data', /ChristmasData_Part\d+\.js$/, 'christmasData', 'movie'],
  ];
  const rows = [];
  for (const [name, dir, re, g, kind] of sets) {
    const d = path.join(ROOT, dir);
    const sb = {};
    sb.window = sb;
    vm.createContext(sb);
    const names = fs.readdirSync(d).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    for (const n of names) {
      if (/\.js$|,js$/i.test(n) && !re.test(n) && /Data|Part/i.test(n)) bad('STRAY', path.join(d, n), 'data file not matched by loader pattern');
      if (re.test(n)) {
        try { vm.runInContext(fs.readFileSync(path.join(d, n), 'utf8') + `\n;try{if(typeof ${g}!=='undefined')globalThis.${g}=${g};}catch(e){}`, sb); }
        catch (e) { bad('PARSE', path.join(d, n), e.message); }
      }
    }
    let arr = sb[g];
    arr = Array.isArray(arr) ? arr : [];
    const ids = new Map();
    arr.forEach(x => ids.set(x.id, (ids.get(x.id) || 0) + 1));
    const dupIds = [...ids].filter(([, c]) => c > 1).map(([i]) => i);
    const ty = new Map();
    arr.forEach(x => { const k = `${x.title}|${x.year}`; ty.set(k, (ty.get(k) || 0) + 1); });
    const keys = new Map();
    if (kind === 'movie') arr.forEach(x => x.youtubeTrailerKey && keys.set(x.youtubeTrailerKey, (keys.get(x.youtubeTrailerKey) || 0) + 1));
    rows.push({
      set: name, count: arr.length, categories: new Set(arr.map(x => x.category)).size,
      dupIds: dupIds.join(',') || '-', dupTitleYear: [...ty].filter(([, c]) => c > 1).length,
      badIsbn: kind === 'book' ? arr.filter(x => !isbnOk(x.isbn)).length : '-',
      sharedTrailerKeys: kind === 'movie' ? [...keys].filter(([, c]) => c >= 3).length : '-',
      noSlug: arr.filter(x => !x.wikiSlug).length,
    });
    if (dupIds.length) bad('DUPID', d, `${name}: ${dupIds.join(',')}`);
  }
  console.table(rows);
}
out.sort();
console.log(out.join('\n'));
console.log(`\n${out.length} problem(s)`);
process.exit(out.length ? 1 : 0);
