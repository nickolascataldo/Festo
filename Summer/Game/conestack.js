/* Cone Stack: tap to drop the swinging scoop onto the tower. Line it up with the scoop below and it settles in;
   miss the edge and it topples. Perfect drops build a streak worth bonus points. Speed climbs as the tower grows. */
window.SUMMER_ARCADE = {
  title: 'Cone Stack',
  storageKey: 'festo_summer_conestack',
  w: 360,
  h: 640,
  howto: 'Tap to drop the scoop. Line it up.',
  create: function (env) {
    'use strict';
    var W = env.W, H = env.H, R = 34, NAVY = '#0b3550';
    var FLAVORS = ['#ff8fb3', '#9be8c4', '#9a6a46', '#fff1c9', '#8ab6ff', '#ffe066', '#ffa94d', '#d0a2f7'];
    var CONE_TOP = H - 170;              // world y of the cone rim
    var STEP = R * 1.1;                  // vertical gap between scoop centres
    var G = 1900, SPAWN_Y = 96;          // gravity (px/s^2) and the screen y where scoops swing

    var stack, cur, cam, camTarget, fx, popups, shake, combo, count, over, overTimer, rng, total;

    function rnd() { rng = (rng * 1664525 + 1013904223) % 4294967296; return rng / 4294967296; }
    function topItem() { return stack[stack.length - 1]; }
    function topY() { return stack.length ? topItem().y : CONE_TOP; }
    function speedFor(n) { return Math.min(340, 125 + n * 7.5); }

    function spawn() {
      var n = count;
      cur = { x: n % 2 ? W - R - 14 : R + 14, y: -cam + SPAWN_Y, vx: (n % 2 ? -1 : 1) * speedFor(n), vy: 0, falling: false, c: FLAVORS[(n + Math.floor(rnd() * 3)) % FLAVORS.length], rot: 0, miss: 0 };
    }

    function reset() {
      rng = (Date.now() % 4294967296) || 7;
      total = 0; stack = []; fx = []; popups = []; combo = 0; count = 0; cam = 0; camTarget = 0; shake = 0; over = false; overTimer = 0;
      spawn();
    }

    function burst(x, y, color, n) {
      for (var i = 0; i < n; i++) {
        var a = rnd() * Math.PI * 2, s = 70 + rnd() * 140;
        fx.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, life: 0.6 + rnd() * 0.4, t: 0, c: color, r: 2 + rnd() * 3 });
      }
    }
    function popup(text, x, y, color) { popups.push({ text: text, x: x, y: y, t: 0, c: color }); }

    function tap() {
      if (over || !cur || cur.falling) return;
      cur.falling = true; cur.vy = 160; cur.vx = 0;
    }

    function land() {
      var top = topItem(), baseX = top ? top.x : W / 2, dx = cur.x - baseX, ref = top ? R : R * 1.15;
      if (Math.abs(dx) > ref) { cur.miss = dx < 0 ? -1 : 1; return false; }
      var perfect = Math.abs(dx) < 5, x = perfect ? baseX : cur.x + (baseX - cur.x) * 0.3, pts = 1;
      if (perfect) { combo++; pts += Math.min(5, combo); popup(combo > 1 ? 'Perfect x' + combo : 'Perfect', x, cur.y - R, '#ff5a3c'); burst(x, cur.y, '#ffc933', 12); }
      else combo = 0;
      stack.push({ x: x, y: topY() - STEP, c: cur.c, born: 0, squash: 1 });
      count++; total += pts; env.setScore(total);
      shake = perfect ? 3 : 1.5;
      camTarget = Math.max(0, 340 - topItem().y);
      return true;
    }

    function update(dt) {
      var i;
      cam += (camTarget - cam) * Math.min(1, dt * 4);
      if (shake > 0) shake = Math.max(0, shake - dt * 14);
      for (i = 0; i < stack.length; i++) { stack[i].born += dt; if (stack[i].squash > 0) stack[i].squash = Math.max(0, stack[i].squash - dt * 4); }
      for (i = fx.length - 1; i >= 0; i--) { var p = fx[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 520 * dt; if (p.t > p.life) fx.splice(i, 1); }
      for (i = popups.length - 1; i >= 0; i--) { popups[i].t += dt; if (popups[i].t > 1) popups.splice(i, 1); }
      if (!cur) return;
      if (!cur.falling) {
        cur.y = -cam + SPAWN_Y;
        cur.x += cur.vx * dt;
        if (cur.x < R + 10) { cur.x = R + 10; cur.vx = Math.abs(cur.vx); }
        if (cur.x > W - R - 10) { cur.x = W - R - 10; cur.vx = -Math.abs(cur.vx); }
      } else if (!cur.miss) {
        var target = topY() - STEP;
        cur.vy += G * dt; cur.y += cur.vy * dt;
        if (cur.y >= target) {
          cur.y = target;
          if (land()) { env.audio.blip(360 + Math.min(count, 30) * 16, 70, 'triangle', 0.05); spawn(); }
          else { env.audio.blip(160, 160, 'sawtooth', 0.04); cur.vx = cur.miss * 90; cur.vy = 40; }
        }
      } else {
        cur.vy += G * dt; cur.y += cur.vy * dt; cur.x += cur.vx * dt; cur.rot += cur.miss * dt * 5;
        overTimer += dt;
        if (!over && (overTimer > 0.9 || cur.y + cam > H + 80)) { over = true; env.over(); }
      }
    }

    /* ----- drawing ----- */
    function scoop(c, x, y, r, color, rot, squash) {
      c.save(); c.translate(x, y); c.rotate(rot || 0); c.scale(1 + (squash || 0) * 0.12, 1 - (squash || 0) * 0.1);
      c.lineJoin = 'round'; c.lineWidth = 3; c.strokeStyle = NAVY; c.fillStyle = color;
      var sx = -r * 1.02, w = r * 2.04, n = 5, cr = w / (2 * n), sy = r * 0.18;
      c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx, sy + r * 0.42);
      for (var k = 0; k < n; k++) c.arc(sx + cr + k * 2 * cr, sy + r * 0.42, cr, Math.PI, 0, true);
      c.lineTo(sx + w, sy); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.arc(0, 0, r * 0.95, Math.PI * 0.98, Math.PI * 0.02 + Math.PI * 2, false); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(-r * 0.36, -r * 0.4, r * 0.2, r * 0.11, -0.6, 0, Math.PI * 2); c.fill();
      c.restore();
    }
    function cone(c, x, t) {
      var y = CONE_TOP, tip = y + 118;
      c.save(); c.translate(Math.sin(t * 1.2) * Math.min(count, 14) * 0.25, 0);
      c.lineJoin = 'round'; c.lineWidth = 3; c.strokeStyle = NAVY;
      c.fillStyle = '#f0b95e'; c.beginPath(); c.moveTo(x - 38, y); c.lineTo(x + 38, y); c.lineTo(x, tip); c.closePath(); c.fill(); c.stroke();
      c.save(); c.clip(); c.strokeStyle = 'rgba(138,85,46,.7)'; c.lineWidth = 2.5;
      for (var i = -5; i < 6; i++) { c.beginPath(); c.moveTo(x + i * 14 - 40, y); c.lineTo(x + i * 14 + 40, tip); c.stroke(); c.beginPath(); c.moveTo(x + i * 14 + 40, y); c.lineTo(x + i * 14 - 40, tip); c.stroke(); }
      c.restore();
      c.fillStyle = '#e39a3b'; c.lineWidth = 3; c.beginPath(); c.rect(x - 41, y - 7, 82, 12); c.fill(); c.stroke();
      c.restore();
    }
    function background(c, t) {
      var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#35bfe8'); g.addColorStop(0.55, '#9ee4f6'); g.addColorStop(1, '#e8fbff');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      var sy = 110 + cam * 0.12;
      c.fillStyle = 'rgba(255,247,194,.5)'; c.beginPath(); c.arc(W - 78, sy, 78, 0, Math.PI * 2); c.fill();
      c.lineWidth = 3; c.strokeStyle = NAVY; c.fillStyle = '#ffc933'; c.beginPath(); c.arc(W - 78, sy, 44, 0, Math.PI * 2); c.fill(); c.stroke();
      for (var i = 0; i < 3; i++) {
        var cx = ((t * (8 + i * 4) + i * 160) % (W + 160)) - 80, cy = 180 + i * 130 + cam * (0.2 + i * 0.05);
        c.fillStyle = 'rgba(255,255,255,.92)'; c.beginPath(); c.arc(cx, cy, 20, 0, Math.PI * 2); c.arc(cx + 24, cy - 10, 26, 0, Math.PI * 2); c.arc(cx + 52, cy, 20, 0, Math.PI * 2); c.fill();
      }
      var seaY = CONE_TOP + 70 + cam;
      if (seaY < H + 40) {
        c.fillStyle = '#0aa6c9'; c.fillRect(0, seaY, W, H - seaY + 40);
        c.fillStyle = '#4fd2ec'; c.beginPath(); c.moveTo(0, seaY + 14);
        for (var x = 0; x <= W; x += 20) c.lineTo(x, seaY + 14 + Math.sin(x * 0.05 + t * 2) * 5);
        c.lineTo(W, H + 40); c.lineTo(0, H + 40); c.closePath(); c.fill();
        var sand = c.createLinearGradient(0, seaY + 60, 0, H + 40); sand.addColorStop(0, '#fbe9b5'); sand.addColorStop(1, '#f1cf8a');
        c.fillStyle = sand; c.beginPath(); c.moveTo(0, seaY + 60);
        for (var x2 = 0; x2 <= W; x2 += 20) c.lineTo(x2, seaY + 60 + Math.sin(x2 * 0.03) * 6);
        c.lineTo(W, H + 40); c.lineTo(0, H + 40); c.closePath(); c.fill();
      }
    }
    function draw(c, t, state) {
      background(c, t);
      c.save();
      if (shake > 0) c.translate((Math.sin(t * 90) * shake), (Math.cos(t * 70) * shake));
      c.translate(0, cam);
      cone(c, W / 2, t);
      var sway = Math.min(1, count / 12);
      for (var i = 0; i < stack.length; i++) {
        var s = stack[i], lift = i * 0.5, off = Math.sin(t * 1.4 + i * 0.35) * sway * (i * 0.18);
        scoop(c, s.x + off, s.y, R, s.c, Math.sin(t * 1.1 + i * 0.3) * 0.012 * sway * lift * 0.1, s.squash);
      }
      if (cur) {
        if (!cur.falling) {
          c.save(); c.strokeStyle = 'rgba(11,53,80,.35)'; c.lineWidth = 2; c.setLineDash([4, 7]);
          c.beginPath(); c.moveTo(cur.x, cur.y + R); c.lineTo(cur.x, topY() - STEP - R * 0.4); c.stroke(); c.restore();
        }
        scoop(c, cur.x, cur.y, R, cur.c, cur.rot || 0, 0);
      }
      for (var j = 0; j < fx.length; j++) { var p = fx[j]; c.globalAlpha = Math.max(0, 1 - p.t / p.life); c.fillStyle = p.c; c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill(); }
      c.globalAlpha = 1;
      c.font = '400 30px "Bebas Neue", Impact, sans-serif'; c.textAlign = 'center'; c.lineWidth = 5; c.lineJoin = 'round';
      for (var k = 0; k < popups.length; k++) { var q = popups[k]; c.globalAlpha = Math.max(0, 1 - q.t); c.strokeStyle = '#ffffff'; c.strokeText(q.text, q.x, q.y - q.t * 46); c.fillStyle = q.c; c.fillText(q.text, q.x, q.y - q.t * 46); }
      c.globalAlpha = 1;
      c.restore();
      if (state === 'ready') { c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(0, 0, W, H); }
    }

    return {
      reset: reset,
      update: update, draw: draw, tap: tap,
      _debug: function () { return { stack: stack, cur: cur, count: count, over: over, cam: cam, R: R }; }
    };
  }
};
