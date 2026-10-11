/* ==========================================================================
   FESTO RADIO · the synthesized stations for every season (played by shared/radio/radio.js)
   Each station: { n: name, short: dial label, x: needle position (%), play(A) } where A is the synth kit:
     A.osc/gain/filter/noise/delay make long-lived nodes; A.bell/pluck/tone/chirp/burst are one-shot voices;
     A.seq(notes, beat, voice) and A.every(ms, fn) keep time. Everything is cleaned up when the station stops.
   All melodies are traditional or original.
   ========================================================================== */
(function (global) {
  'use strict';
  var S = global.FESTO_STATIONS = global.FESTO_STATIONS || {};

  S.halloween = [
    { n: 'Graveyard Drone', short: 'Graveyard', x: 12, play: function (A) {
      var lp = A.filter('lowpass', 380, 6), dg = A.gain(.16); lp.connect(dg); dg.connect(A.out);
      [55, 55.6, 82.4].forEach(function (f) { A.osc('sawtooth', f).connect(lp); });
      var l = A.osc('sine', .07), lg = A.gain(240); l.connect(lg); lg.connect(lp.frequency);
      var bp = A.filter('bandpass', 520, .9), wg = A.gain(.05); A.noise().connect(bp); bp.connect(wg); wg.connect(A.out);
      var wf = A.osc('sine', .05), wfg = A.gain(300); wf.connect(wfg); wfg.connect(bp.frequency);
    } },
    { n: 'Crypt Organ', short: 'Organ', x: 38, play: function (A) {
      var chords = [[110, 130.81, 164.81, 220], [87.31, 110, 130.81, 174.61], [73.42, 87.31, 110, 146.83], [82.41, 103.83, 123.47, 164.81]];
      var voices = chords[0].map(function (f) {
        var g = A.gain(.045); g.connect(A.out);
        var a = A.osc('triangle', f), b = A.osc('sine', f * 2), c = A.osc('sine', f * 3), bg = A.gain(.5), cg = A.gain(.18);
        a.connect(g); b.connect(bg); bg.connect(g); c.connect(cg); cg.connect(g);
        return [a, b, c];
      });
      var k = 0;
      A.every(4200, function () { k = (k + 1) % chords.length; var t0 = A.ac.currentTime; voices.forEach(function (v, j) { v.forEach(function (o, h) { o.frequency.setTargetAtTime(chords[k][j] * (h + 1), t0, .25); }); }); });
    } },
    { n: 'Theremin Waves', short: 'Theremin', x: 63, play: function (A) {
      var th = A.osc('sine', 440), thg = A.gain(.14); th.connect(thg); thg.connect(A.out);
      var vib = A.osc('sine', 5.6), vg = A.gain(7); vib.connect(vg); vg.connect(th.frequency);
      var notes = [440, 523.25, 587.33, 659.25, 392, 698.46, 493.88, 349.23];
      A.every(1300, function () { th.frequency.setTargetAtTime(notes[Math.floor(Math.random() * notes.length)] * (Math.random() < .3 ? .5 : 1), A.ac.currentTime, .22); });
    } },
    { n: 'Music Box Waltz', short: 'Music Box', x: 88, play: function (A) {
      var dl = A.delay(.36, .38), mel = [76, 79, 83, 81, 79, 76, 74, 76, 71, 74, 76, 79, 77, 76, 74, 71, 72, 74, 76, 72, 69, 71, 72, 74], step = 0, beat = .42, next = A.ac.currentTime + .1;
      A.every(60, function () {
        while (next < A.ac.currentTime + .25) {
          var f = A.mtof(mel[step % mel.length]);
          A.bell(f, next, 1.4, .22, null, [[1, 1], [3, .23], [5.2, .09]]); A.bell(f, next, 1.4, .06, dl, [[1, 1]]);
          next += step % 3 === 2 ? beat * 1.5 : beat; step++;
        }
      });
    } }
  ];

  S.christmas = [
    { n: 'Silent Night · Celesta', short: 'Silent Night', x: 12, play: function (A) {
      var dl = A.delay(.34, .32);
      A.seq([[79, 1.5], [81, .5], [79, 1], [76, 3], [79, 1.5], [81, .5], [79, 1], [76, 3], [86, 2], [86, 1], [83, 3], [84, 2], [84, 1], [79, 3], [81, 2], [81, 1], [84, 1.5], [83, .5], [81, 1], [79, 1.5], [81, .5], [79, 1], [76, 3], [81, 2], [81, 1], [84, 1.5], [83, .5], [81, 1], [79, 1.5], [81, .5], [79, 1], [76, 3], [86, 2], [86, 1], [89, 1.5], [86, .5], [83, 1], [84, 3], [88, 3], [84, 1.5], [79, .5], [76, 1], [79, 1.5], [77, .5], [74, 1], [72, 6], [null, 3]], .3, function (f, t, d) {
        A.bell(f, t, 1.8, .2, null, [[1, 1], [4, .14], [8.2, .04]]); A.bell(f, t, 1.2, .05, dl, [[1, 1]]);
      });
    } },
    { n: 'Deck the Halls · Celesta', short: 'Deck the Halls', x: 38, play: function (A) {
      var bass = [48, 43, 45, 41];
      A.seq([[79, 1.5], [77, .5], [76, 1], [74, 1], [72, 1], [74, 1], [76, 1], [72, 1], [74, .5], [76, .5], [77, .5], [74, .5], [76, 1.5], [74, .5], [72, 1], [71, 1], [72, 2], [79, 1.5], [77, .5], [76, 1], [74, 1], [72, 1], [74, 1], [76, 1], [72, 1], [74, .5], [76, .5], [77, .5], [74, .5], [76, 1.5], [74, .5], [72, 1], [71, 1], [72, 2],
        [74, 1.5], [76, .5], [77, 1], [74, 1], [76, 1.5], [77, .5], [79, 1], [74, 1], [76, .5], [78, .5], [79, 1], [81, .5], [83, .5], [84, 1], [83, 1], [81, 1], [79, 2], [79, 1.5], [77, .5], [76, 1], [74, 1], [72, 1], [74, 1], [76, 1], [72, 1], [81, .5], [81, .5], [81, .5], [81, .5], [79, 1.5], [77, .5], [76, 1], [74, 1], [72, 2]], .27, function (f, t, d, step) {
        A.bell(f, t, 1.1, .16, null, [[1, 1], [3, .2], [6.1, .05]]);
        if (step % 4 === 0) A.pluck(A.mtof(bass[(step / 4 | 0) % 4]), t, .9, .12, null, 4);
      });
    } },
    { n: 'Sleigh Bells · Jingle Bells', short: 'Sleigh Bells', x: 63, play: function (A) {
      A.seq([[76, 1], [76, 1], [76, 2], [76, 1], [76, 1], [76, 2], [76, 1], [79, 1], [72, 1.5], [74, .5], [76, 4], [77, 1], [77, 1], [77, 1.5], [77, .5], [77, 1], [76, 1], [76, 1], [76, .5], [76, .5], [76, 1], [74, 1], [74, 1], [76, 1], [74, 2], [79, 2],
        [76, 1], [76, 1], [76, 2], [76, 1], [76, 1], [76, 2], [76, 1], [79, 1], [72, 1.5], [74, .5], [76, 4], [77, 1], [77, 1], [77, 1.5], [77, .5], [77, 1], [76, 1], [76, 1], [76, .5], [76, .5], [79, 1], [79, 1], [77, 1], [74, 1], [72, 4]], .22, function (f, t, d, step) {
        A.pluck(f, t, .5, .13, null, 7); A.bell(f * 2, t, .4, .03);
      });
      var bt = A.ac.currentTime + .12, k = 0;
      A.every(50, function () { while (bt < A.ac.currentTime + .3) { A.burst(bt, k % 2 ? .12 : .2, k % 4 === 0 ? .09 : .05, 'highpass', 7200, .8); A.bell(2637 + (k % 3) * 140, bt, .18, .015, null, [[1, 1], [1.5, .5]]); bt += .22; k++; } });
    } },
    { n: 'Choir by Candlelight', short: 'Choir', x: 88, play: function (A) {
      var form = A.filter('bandpass', 820, 2.2), form2 = A.filter('bandpass', 1180, 3), lp = A.filter('lowpass', 2200, .5), g = A.gain(.05);
      lp.connect(form); lp.connect(form2); form.connect(g); form2.connect(g); var dry = A.gain(.012); lp.connect(dry); dry.connect(A.out); g.connect(A.out);
      var chords = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]];
      var voices = chords[0].map(function (m) { return [-6, 0, 7].map(function (det) { var o = A.osc('sawtooth', A.mtof(m)); o.detune.value = det; o.connect(lp); return o; }); });
      var vib = A.osc('sine', 4.8), vg = A.gain(4); vib.connect(vg); voices.forEach(function (vs) { vs.forEach(function (o) { vg.connect(o.detune); }); });
      var k = 0; A.every(4400, function () { k = (k + 1) % chords.length; var t0 = A.ac.currentTime; voices.forEach(function (vs, j) { vs.forEach(function (o) { o.frequency.setTargetAtTime(A.mtof(chords[k][j]), t0, .35); }); }); });
      var tb = A.ac.currentTime + .2; A.every(4400, function () { A.bell(A.mtof(84 + [0, -3, -7, -5][k]), A.ac.currentTime + .05, 3, .05); }); A.bell(A.mtof(84), tb, 3, .05);
    } }
  ];

  S.summer = [
    { n: 'Steel Drum Sunset', short: 'Steel Drum', x: 12, play: function (A) {
      var bass = [48, 48, 53, 55];
      A.seq([[72, .5], [76, .5], [79, .5], [76, .5], [77, 1], [74, 1], [72, .5], [74, .5], [76, .5], [72, .5], [71, 1.5], [null, .5], [72, .5], [76, .5], [79, .5], [81, .5], [79, 1], [77, .5], [76, .5], [74, .5], [72, .5], [74, .5], [76, .5], [72, 2]], .3, function (f, t) {
        A.bell(f, t, .8, .16, null, [[1, 1], [2, .5], [3, .22], [4.2, .08]]);
      });
      var bt = A.ac.currentTime + .12, k = 0;
      A.every(50, function () { while (bt < A.ac.currentTime + .3) { if (k % 4 === 0 || k % 4 === 3) A.pluck(A.mtof(bass[(k / 8 | 0) % 4]), bt, .5, .16, null, 3); A.burst(bt, .06, k % 2 ? .03 : .05, 'highpass', 8000); bt += .15; k++; } });
    } },
    { n: 'Ocean Waves & Gulls', short: 'Ocean', x: 38, play: function (A) {
      var lp = A.filter('lowpass', 520, .4), g = A.gain(.0), n = A.noise(); n.connect(lp); lp.connect(g); g.connect(A.out);
      var hp = A.filter('bandpass', 2400, .5), g2 = A.gain(0); n.connect(hp); hp.connect(g2); g2.connect(A.out);
      function swell() { var t = A.ac.currentTime; g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(.55, t, 1.6); g.gain.setTargetAtTime(.12, t + 3.6, 1.8); g2.gain.setTargetAtTime(.06, t + 2.4, .5); g2.gain.setTargetAtTime(.005, t + 3.6, 1.2); lp.frequency.setTargetAtTime(900, t, 1.4); lp.frequency.setTargetAtTime(420, t + 3.6, 1.6); }
      swell(); A.every(7600, swell);
      var pad = A.filter('lowpass', 700), pg = A.gain(.03); pad.connect(pg); pg.connect(A.out); [57, 64, 69].forEach(function (m) { A.osc('triangle', A.mtof(m)).connect(pad); });
      A.every(5300, function () { if (Math.random() < .7) { var t = A.ac.currentTime + .1; A.chirp(t, 2100, 1300, .32, .04); A.chirp(t + .4, 2000, 1250, .28, .035); } });
    } },
    { n: 'Ukulele on the Porch', short: 'Ukulele', x: 63, play: function (A) {
      var chords = [[67, 60, 64, 72], [69, 60, 64, 69], [69, 60, 65, 69], [67, 62, 67, 71]], pat = [[0, 1], [1, 1], [1.5, -1], [2.5, -1], [3, 1], [3.5, -1]], beat = .3, bar = 0, next = A.ac.currentTime + .12;
      A.every(50, function () { while (next < A.ac.currentTime + .35) { var ch = chords[bar % 4]; pat.forEach(function (p) { var t0 = next + p[0] * beat, notes = p[1] > 0 ? ch : ch.slice().reverse(); notes.forEach(function (m, j) { A.pluck(A.mtof(m), t0 + j * .016, .7, .07, null, 6); }); }); next += 4 * beat; bar++; } });
      A.seq([[null, 4], [76, 1], [79, 1], [81, 2], [79, 1], [76, 1], [74, 2], [72, 1], [74, 1], [76, 2], [74, 4]], .3, function (f, t) { A.tone(f, t, .5, .05, 'triangle'); });
    } },
    { n: 'Synthwave Drive', short: 'Synthwave', x: 88, play: function (A) {
      var roots = [45, 41, 48, 43], lp = A.filter('lowpass', 900, 6), lg = A.gain(.9); lp.connect(lg); lg.connect(A.out);
      var sw = A.osc('sine', .08), swg = A.gain(700); sw.connect(swg); swg.connect(lp.frequency);
      var bt = A.ac.currentTime + .12, k = 0;
      A.every(50, function () { while (bt < A.ac.currentTime + .3) { var r = roots[(k / 8 | 0) % 4];
        var o = A.ac.createOscillator(), g = A.ac.createGain(); o.type = 'sawtooth'; o.frequency.value = A.mtof(r); g.gain.setValueAtTime(.1, bt); g.gain.exponentialRampToValueAtTime(.001, bt + .25); o.connect(g); g.connect(lp); o.start(bt); o.stop(bt + .27);
        var ar = A.ac.createOscillator(), ag = A.ac.createGain(); ar.type = 'square'; ar.frequency.value = A.mtof(r + 24 + [0, 7, 12, 15][k % 4]); ag.gain.setValueAtTime(.025, bt); ag.gain.exponentialRampToValueAtTime(.001, bt + .2); ar.connect(ag); ag.connect(lp); ar.start(bt); ar.stop(bt + .22);
        if (k % 4 === 0) { var kk = A.ac.createOscillator(), kg = A.ac.createGain(); kk.frequency.setValueAtTime(140, bt); kk.frequency.exponentialRampToValueAtTime(40, bt + .18); kg.gain.setValueAtTime(.35, bt); kg.gain.exponentialRampToValueAtTime(.001, bt + .22); kk.connect(kg); kg.connect(A.out); kk.start(bt); kk.stop(bt + .24); }
        if (k % 2 === 1) A.burst(bt, .05, .03, 'highpass', 9000);
        if (k % 8 === 4) A.burst(bt, .18, .06, 'bandpass', 1800, 1);
        bt += .135; k++; } });
    } }
  ];

  S.spring = [
    { n: 'Dawn Chorus', short: 'Dawn Chorus', x: 12, play: function (A) {
      var pad = A.filter('lowpass', 900), pg = A.gain(.025); pad.connect(pg); pg.connect(A.out); [60, 67, 72, 76].forEach(function (m) { A.osc('sine', A.mtof(m)).connect(pad); });
      function song() { var t = A.ac.currentTime + .05, kind = Math.random(), base = 2200 + Math.random() * 1400, n = 3 + (Math.random() * 6 | 0);
        for (var i = 0; i < n; i++) { if (kind < .4) A.chirp(t + i * .09, base * 1.2, base * .8, .07, .05); else if (kind < .75) A.chirp(t + i * .16, base * .8, base * 1.3, .12, .045); else A.chirp(t + i * .05, base, base * (i % 2 ? 1.25 : .9), .04, .04); } }
      song(); A.every(900, function () { if (Math.random() < .75) song(); });
    } },
    { n: 'Spring Rain on Glass', short: 'Spring Rain', x: 38, play: function (A) {
      var n = A.noise(), hp = A.filter('highpass', 1800, .3), lp = A.filter('lowpass', 7000), g = A.gain(.06); n.connect(hp); hp.connect(lp); lp.connect(g); g.connect(A.out);
      var low = A.filter('lowpass', 400), lg = A.gain(.05); n.connect(low); low.connect(lg); lg.connect(A.out);
      A.every(70, function () { if (Math.random() < .5) { var t = A.ac.currentTime + Math.random() * .06; A.chirp(t, 1400 + Math.random() * 1800, 600 + Math.random() * 500, .05, .025); } });
      A.seq([[72, 2], [76, 2], [79, 4], [74, 2], [77, 2], [81, 4]], .5, function (f, t) { A.bell(f, t, 2.4, .035); });
    } },
    { n: 'Glasshouse Harp', short: 'Harp', x: 63, play: function (A) {
      var scale = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81], chords = [[0, 2, 4, 5, 7, 9], [1, 3, 4, 6, 8, 9], [0, 2, 3, 5, 7, 8], [2, 4, 5, 7, 9, 9]], k = 0, next = A.ac.currentTime + .12, step = 0;
      A.every(50, function () { while (next < A.ac.currentTime + .3) { var ch = chords[(step / 12 | 0) % 4], idx = step % 12 < 6 ? step % 6 : 5 - step % 6; var f = A.mtof(scale[ch[idx]]);
        A.pluck(f, next, 1.6, .07, null, 5); A.bell(f, next, 1.4, .025, null, [[1, 1], [2, .3]]); if (step % 12 === 0) A.pluck(A.mtof(scale[ch[0]] - 24), next, 2.4, .1, null, 2.5); next += .2; step++; } });
    } },
    { n: 'Wind Chimes', short: 'Chimes', x: 88, play: function (A) {
      var n = A.noise(), bp = A.filter('bandpass', 500, .4), g = A.gain(.03); n.connect(bp); bp.connect(g); g.connect(A.out);
      var lfo = A.osc('sine', .09), lg = A.gain(.025); lfo.connect(lg); lg.connect(g.gain);
      var notes = [72, 74, 76, 79, 81, 84, 86, 88];
      A.every(260, function () { if (Math.random() < .55) { var t = A.ac.currentTime + Math.random() * .1; A.bell(A.mtof(notes[Math.random() * notes.length | 0]), t, 3.4, .06, null, [[1, 1], [2.76, .35], [5.4, .12]]); } });
    } }
  ];

})(window);
