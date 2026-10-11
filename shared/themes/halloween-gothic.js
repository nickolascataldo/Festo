/* ==========================================================================
   HALLOWEEN HOLLOW · GOTHIC LAYER (pairs with halloween-gothic.css)
   Adds the shared atmosphere to every Halloween page: a gothic street backdrop with drifting fog,
   film grain, the wrought-iron frame with bronze medallions, and embers drifting up the frame edges.
   Pure decoration: aria-hidden, pointer-events none, paused when the tab is hidden, skipped under reduced motion.
   ========================================================================== */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  if (root.getAttribute('data-gh-ready')) return;
  root.setAttribute('data-gh-ready', '1');
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<radialGradient id="ghBronze" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#e8c48a"/><stop offset=".35" stop-color="#9a6c34"/><stop offset=".75" stop-color="#4a2e14"/><stop offset="1" stop-color="#1e1108"/></radialGradient>' +
    '<radialGradient id="ghBronzeIn" cx="60%" cy="70%" r="70%"><stop offset="0" stop-color="#3a2410"/><stop offset="1" stop-color="#140b04"/></radialGradient>' +
    '<symbol id="gh-skull" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="url(#ghBronze)" stroke="#120a04" stroke-width="1.4"/><circle cx="22" cy="22" r="15.5" fill="url(#ghBronzeIn)" stroke="#c99a5a" stroke-width=".8"/><path d="M22 10.5c-5.6 0-9 3.6-9 8.4 0 3 1.4 5.2 3.4 6.4v3.2c0 .8.6 1.4 1.4 1.4h1v-2h1.6v2h3.2v-2h1.6v2h1c.8 0 1.4-.6 1.4-1.4v-3.2c2-1.2 3.4-3.4 3.4-6.4 0-4.8-3.4-8.4-9-8.4z" fill="url(#ghBronze)" stroke="#120a04" stroke-width=".7"/><path d="M16 19a2.6 2.6 0 1 0 5.2 0 2.6 2.6 0 1 0-5.2 0zM22.8 19a2.6 2.6 0 1 0 5.2 0 2.6 2.6 0 1 0-5.2 0z" fill="#140b04"/><path d="M22 21.8l-1.4 2.6h2.8z" fill="#140b04"/></symbol>' +
    '<symbol id="gh-bat" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="url(#ghBronze)" stroke="#120a04" stroke-width="1.4"/><circle cx="22" cy="22" r="15.5" fill="url(#ghBronzeIn)" stroke="#c99a5a" stroke-width=".8"/><path transform="translate(9 15) scale(.41)" d="M32 9c1.6-3.4 3-4.6 3-4.6s.3 2.8 1 4.4C42 3.4 52 1.8 63 5c-5 2.2-7.5 6-7.8 11-3-3-7-3-10 .3-2-3-6-3.4-8.4-.4-.9-2-2.6-3.2-4.8-3.2s-3.9 1.2-4.8 3.2c-2.4-3-6.4-2.6-8.4.4-3-3.3-7-3.3-10-.3C8.5 11 6 7.2 1 5c11-3.2 21-1.6 27 3.8.7-1.6 1-4.4 1-4.4s1.4 1.2 3 4.6z" fill="url(#ghBronze)" stroke="#120a04" stroke-width="1.2"/></symbol>' +
    '</defs></svg>';

  var STREET = '<div class="gh-street" aria-hidden="true"><svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">' +
    '<defs><radialGradient id="ghWin"><stop offset="0" stop-color="#ffd28a"/><stop offset=".6" stop-color="#ff9a3a"/><stop offset="1" stop-color="#7a3a08"/></radialGradient><linearGradient id="ghRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14141c"/><stop offset="1" stop-color="#050508"/></linearGradient></defs>' +
    '<g fill="#141624"><path d="M560 560V420l20-60 20 60v140zM640 560V380l14-90 14 90v180zM900 560V400l22-80 22 80v160zM980 560V440h60v120z"/><rect x="520" y="470" width="560" height="90"/></g>' +
    '<g fill="#0b0c14"><path d="M0 900V300l80-90 80 90v40h40V250l70-110 70 110v650z"/><path d="M340 900V360l60-80 60 80v540z"/><path d="M1600 900V280l-90-100-90 100v60h-40V230l-70-120-70 120v670z"/><path d="M1180 900V380l-50-70-50 70v520z"/></g>' +
    '<g fill="url(#ghWin)" opacity=".85"><rect x="50" y="360" width="22" height="34" rx="11"/><rect x="100" y="360" width="22" height="34" rx="11"/><rect x="250" y="300" width="20" height="30" rx="10"/><rect x="1490" y="340" width="24" height="36" rx="12"/><rect x="1320" y="290" width="20" height="30" rx="10"/><rect x="1110" y="420" width="18" height="28" rx="9"/></g>' +
    '<path d="M0 900L700 600h200l700 300z" fill="url(#ghRoad)"/>' +
    '<g fill="#07070b"><rect x="476" y="430" width="8" height="380"/><path d="M462 430h36l-6-34h-24z"/><rect x="1116" y="430" width="8" height="380"/><path d="M1102 430h36l-6-34h-24z"/></g>' +
    '<g fill="#ffcf7a" opacity=".9"><path d="M468 426h24l-4-26h-16z"/><path d="M1108 426h24l-4-26h-16z"/></g>' +
    '</svg><div class="gh-vig"></div></div>';

  var IRON = '<div class="gh-iron" aria-hidden="true"><div class="rail"></div><div class="vine l"></div><div class="vine r"></div>' +
    '<svg class="medal tl"><use href="#gh-bat"/></svg><svg class="medal tr"><use href="#gh-bat"/></svg>' +
    '<svg class="medal bl"><use href="#gh-skull"/></svg><svg class="medal br"><use href="#gh-skull"/></svg></div>';

  function mount() {
    var b = doc.body;
    b.insertAdjacentHTML('afterbegin', SPRITE + STREET + '<div class="gh-veil" aria-hidden="true"></div>');
    b.insertAdjacentHTML('beforeend', IRON + '<canvas id="gh-embers" aria-hidden="true"></canvas>');
    if (!reduced) embers(doc.getElementById('gh-embers'));
  }

  function embers(cv) {
    var ctx = cv.getContext('2d'), P = [], DPR = Math.min(2, window.devicePixelRatio || 1), last = 0, spr = doc.createElement('canvas');
    spr.width = spr.height = 32;
    var sx = spr.getContext('2d'), g = sx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,240,200,1)'); g.addColorStop(.2, 'rgba(255,170,70,.9)'); g.addColorStop(.5, 'rgba(255,90,20,.35)'); g.addColorStop(1, 'rgba(255,60,10,0)');
    sx.fillStyle = g; sx.fillRect(0, 0, 32, 32);
    function spawn(W, H) {
      var e = Math.random(), m = 10 * DPR, x, y;
      if (e < .42) { x = m + Math.random() * 12 * DPR; y = Math.random() * H; } else if (e < .84) { x = W - m - Math.random() * 12 * DPR; y = Math.random() * H; } else { x = Math.random() * W; y = H - m - Math.random() * 30 * DPR; }
      return { x: x, y: y, vx: (Math.random() - .5) * 8, vy: -(10 + Math.random() * 22), life: 0, max: 2.5 + Math.random() * 3.5, s: (2 + Math.random() * 4) * DPR, w: Math.random() * 6 };
    }
    function frame(t) {
      requestAnimationFrame(frame);
      if (doc.hidden) { last = t; return; }
      var dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
      var W = Math.round(cv.clientWidth * DPR), H = Math.round(cv.clientHeight * DPR);
      if (!W || !H) return;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      ctx.clearRect(0, 0, W, H);
      var want = Math.round(24 + W / DPR / 45);
      while (P.length < want) P.push(spawn(W, H));
      ctx.globalCompositeOperation = 'lighter';
      for (var i = P.length - 1; i >= 0; i--) {
        var p = P[i]; p.life += dt;
        if (p.life > p.max) { P.splice(i, 1); continue; }
        p.x += (p.vx + Math.sin(t / 500 + p.w) * 6) * dt * DPR; p.y += p.vy * dt * DPR;
        ctx.globalAlpha = Math.max(0, Math.sin(Math.PI * p.life / p.max) * (.55 + .45 * Math.sin(t / 110 + p.w)));
        ctx.drawImage(spr, p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    requestAnimationFrame(frame);
  }

  if (doc.body) mount(); else doc.addEventListener('DOMContentLoaded', mount);
})();
