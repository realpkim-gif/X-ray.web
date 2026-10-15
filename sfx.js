(function () {
  if (window.RadiantSfx && window.RadiantSfx.v >= 2) return;
  // A page embedded by another Radiant page plays through the host's audio graph instead of building its own.
  try {
    var HP = window.parent !== window && /[?&]embed=1/.test(location.search) && window.parent.RadiantSfx;
    if (HP && HP.v >= 2) {
      window.RadiantSfx = HP;
      ['pointerdown', 'keydown', 'touchend'].forEach(function (t) { window.addEventListener(t, function () { try { HP.unlock(); } catch (e) {} }, true); });
      return;
    }
  } catch (e) {}
  // Transition sounds, synthesized live with Web Audio (no audio files).
  var AC = window.AudioContext || window.webkitAudioContext, ctx = null, master = null, NB = null;
  function active() { var u = navigator.userActivation; return !u || u.hasBeenActive; }
  function ensure(build) {
    if (!AC) return null;
    if (!ctx) {
      try { ctx = new AC({ latencyHint: 'interactive' }); } catch (e) { try { ctx = new AC(); } catch (e2) { return null; } }
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.2;
      master = ctx.createGain(); master.gain.value = 0.62; master.connect(comp); comp.connect(ctx.destination);
      var n = Math.floor(ctx.sampleRate * 2.5); NB = ctx.createBuffer(1, n, ctx.sampleRate);
      var d = NB.getChannelData(0); for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    if (!build && ctx.state === 'suspended' && ctx.resume) { try { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
    return ctx;
  }
  function unlock() { if (active()) ensure(); }
  ['pointerdown', 'keydown', 'touchend'].forEach(function (t) { window.addEventListener(t, unlock, true); });
  // Build the (suspended) audio graph while the page boots, so the first click only has to resume it.
  ensure(!active());

  function bus(t, o, pan0, pan1, dur) {
    var g = ctx.createGain(); g.gain.setValueAtTime(1, t);
    if (o && o.cut) { g.gain.setValueAtTime(1, t + Math.max(0.01, o.cut - 0.16)); g.gain.linearRampToValueAtTime(0.0001, t + o.cut); }
    if (pan0 != null && ctx.createStereoPanner) { var p = ctx.createStereoPanner(); p.pan.setValueAtTime(pan0, t); p.pan.linearRampToValueAtTime(pan1, t + dur); g.connect(p); p.connect(master); }
    else g.connect(master);
    return g;
  }
  function pan(out, v) { if (!ctx.createStereoPanner) return out; var p = ctx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, v)); p.connect(out); return p; }
  function noise(t, dur) { var s = ctx.createBufferSource(); s.buffer = NB; s.loop = true; s.start(t, Math.random() * 2); s.stop(t + dur); return s; }
  function filt(type, f, q) { var b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q != null) b.Q.value = q; return b; }
  function ramp(param, pts, t, expo) { param.setValueAtTime(Math.max(expo ? 0.0001 : -1e9, pts[0][1]), t + pts[0][0]); for (var i = 1; i < pts.length; i++) { if (expo) param.exponentialRampToValueAtTime(Math.max(0.0001, pts[i][1]), t + pts[i][0]); else param.linearRampToValueAtTime(pts[i][1], t + pts[i][0]); } }
  function amp(pts, t) { var g = ctx.createGain(); ramp(g.gain, pts, t, false); return g; }
  function nz(out, t, dur, type, fpts, q, gpts) { var s = noise(t, dur), f = filt(type, fpts[0][1], q), g = amp(gpts, t); ramp(f.frequency, fpts, t, true); s.connect(f); f.connect(g); g.connect(out); }
  function tone(out, t, type, fpts, gpts, dur) { var o = ctx.createOscillator(), g = amp(gpts, t); o.type = type; ramp(o.frequency, fpts, t, true); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur); }
  function pling(out, t, f, a, dec, type) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dec + 0.03);
  }
  function click(out, t, f, a, dec) {
    var s = noise(t, dec + 0.04), b = filt('bandpass', f, 5), g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    s.connect(b); b.connect(g); g.connect(out);
  }
  function bloop(out, t, f0, d, a) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 2.4, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.03);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + d + 0.06);
  }
  function bell(out, t, f, a, dec) { [1, 2.76, 5.4, 8.93].forEach(function (r, i) { pling(out, t, f * r, a / (i + 1), dec / (1 + i * 0.6), 'sine'); }); }
  function pad(out, t, fs, dur, a) { fs.forEach(function (f, i) { tone(out, t, i % 2 ? 'triangle' : 'sine', [[0, f], [dur, f]], [[0, 0], [dur * 0.35, a], [dur, 0]], dur + 0.05); }); }
  function whine(out, t, f0, f1, d, a, lp0, lp1) {
    var w = ctx.createGain(), lp = filt('lowpass', lp0, 1.8);
    w.gain.setValueAtTime(0.0001, t); w.gain.exponentialRampToValueAtTime(a, t + d * 0.92); w.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.06);
    ramp(lp.frequency, [[0, lp0], [d, lp1]], t, true); lp.connect(w); w.connect(out);
    [0, 7, -6].forEach(function (c) { var o = ctx.createOscillator(); o.type = 'sawtooth'; o.detune.value = c; ramp(o.frequency, [[0, f0], [d, f1]], t, true); o.connect(lp); o.start(t); o.stop(t + d + 0.1); });
  }

  var S = {};
  // Cartoon wave: swell, crash, spray, a rising "whoop" and bubbly bloops. Pans with the wave.
  S.wave = function (t, o) {
    var dir = o.back ? -1 : 1, B = bus(t, o, 0.45 * dir, -0.45 * dir, 1.2);
    nz(B, t, 1.5, 'lowpass', [[0, 120], [0.45, 260], [1.4, 90]], 0.7, [[0, 0], [0.42, 2.2], [0.8, 1.2], [1.45, 0]]);
    nz(B, t, 1.5, 'bandpass', [[0, 320], [0.5, 1900], [1.35, 520]], 0.85, [[0, 0], [0.4, 0.55], [0.75, 0.32], [1.4, 0]]);
    nz(B, t + 0.18, 1.0, 'bandpass', [[0, 900], [0.2, 2400], [0.8, 1200]], 0.6, [[0, 0], [0.16, 0.3], [0.7, 0]]);
    nz(B, t + 0.2, 0.9, 'highpass', [[0, 3500], [0.8, 5000]], 0.7, [[0, 0], [0.12, 0.09], [0.7, 0]]);
    tone(B, t, 'sine', [[0, o.back ? 130 : 150], [0.36, o.back ? 360 : 420]], [[0, 0], [0.06, 0.13], [0.3, 0.08], [0.42, 0]], 0.5);
    for (var i = 0; i < 9; i++) bloop(pan(B, (Math.random() * 2 - 1) * 0.7), t + 0.16 + Math.random() * 0.95, (o.back ? 230 : 280) + Math.random() * 260, 0.07 + Math.random() * 0.06, 0.1 + Math.random() * 0.08);
  };
  S.waveBack = function (t, o) { S.wave(t, { back: true, cut: o.cut }); };
  S.waveTail = function (t, o) {
    var B = bus(t, o, -0.2, 0.2, 0.9);
    nz(B, t, 1.0, 'bandpass', [[0, 1500], [0.9, 380]], 0.8, [[0, 0], [0.12, 0.32], [0.9, 0]]);
    nz(B, t, 1.0, 'lowpass', [[0, 240], [0.9, 90]], 0.7, [[0, 0], [0.15, 1.4], [0.9, 0]]);
    for (var i = 0; i < 5; i++) bloop(pan(B, (Math.random() * 2 - 1) * 0.7), t + 0.05 + Math.random() * 0.6, 260 + Math.random() * 240, 0.07 + Math.random() * 0.05, 0.08 + Math.random() * 0.06);
  };
  // Tiles: a glassy cascade of clicks and pentatonic tinks that sweeps right to left, over an airy swish.
  S.tiles = function (t, o) {
    var back = !!o.back, B = bus(t, o), notes = [880, 987.77, 1108.73, 1318.51, 1479.98, 1760, 1975.53, 2217.46], N = 26;
    nz(B, t, 1.0, 'bandpass', back ? [[0, 2600], [0.45, 700], [0.95, 420]] : [[0, 600], [0.45, 2900], [0.95, 1800]], 1.1, [[0, 0], [0.3, 0.16], [0.95, 0]]);
    tone(B, t, 'sine', [[0, 120], [0.14, 58]], [[0, 0], [0.01, 0.22], [0.2, 0]], 0.25);
    for (var i = 0; i < N; i++) {
      var u = i / (N - 1), tt = t + 0.03 + u * 0.5 + (Math.random() - 0.5) * 0.025, p = pan(B, 0.7 - 1.4 * u + (Math.random() - 0.5) * 0.2);
      click(p, tt, 2200 + Math.random() * 2600, 0.2 + Math.random() * 0.12, 0.018 + Math.random() * 0.02);
      if (i % 2 === 0) { var k = Math.min(notes.length - 1, Math.floor((back ? 1 - u : u) * notes.length)); pling(p, tt + 0.004, notes[k] * (Math.random() < 0.2 ? 2 : 1), 0.045, 0.16 + Math.random() * 0.12, 'sine'); }
    }
    for (var j = 0; j < 6; j++) pling(pan(B, (Math.random() * 2 - 1) * 0.8), t + 0.35 + Math.random() * 0.45, 2637 + Math.random() * 1800, 0.022, 0.25, 'sine');
    tone(B, t + 0.52, 'sine', [[0, back ? 196 : 220], [0.6, back ? 196 : 220]], [[0, 0], [0.03, 0.06], [0.6, 0]], 0.7);
  };
  S.tilesBack = function (t, o) { S.tiles(t, { back: true, cut: o.cut }); };
  S.tilesTail = function (t, o) {
    var B = bus(t, o), notes = [1760, 1479.98, 1318.51, 1108.73, 987.77, 880];
    nz(B, t, 0.7, 'bandpass', [[0, 2400], [0.6, 700]], 1.1, [[0, 0], [0.12, 0.12], [0.6, 0]]);
    for (var i = 0; i < 12; i++) { var u = i / 11, p = pan(B, -0.6 + 1.2 * u); click(p, t + u * 0.38, 2400 + Math.random() * 2200, 0.16, 0.02); if (i % 2 === 0) pling(p, t + u * 0.38 + 0.004, notes[Math.min(5, i / 2 | 0)], 0.035, 0.2, 'sine'); }
  };
  // Intro → site: the beam charges, exposes with a flash (sub boom + glass bell), then opens into a warm chord.
  S.introOut = function (t, o) {
    var B = bus(t, o);
    whine(B, t, 110, 440, 0.64, 0.085, 500, 4200);
    nz(B, t, 0.75, 'highpass', [[0, 800], [0.62, 6000]], 0.7, [[0, 0], [0.6, 0.14], [0.68, 0]]);
    var tf = t + 0.64;
    tone(B, tf, 'sine', [[0, 88], [0.5, 34]], [[0, 0], [0.012, 0.55], [0.9, 0]], 1.0);
    nz(B, tf, 0.6, 'highpass', [[0, 2500], [0.5, 900]], 0.6, [[0, 0], [0.005, 0.32], [0.45, 0]]);
    bell(B, tf + 0.01, 659.25, 0.06, 2.2);
    nz(B, t + 1.05, 1.3, 'bandpass', [[0, 2600], [1.1, 420]], 0.9, [[0, 0], [0.25, 0.2], [1.2, 0]]);
    pad(B, t + 1.0, [220, 277.18, 329.63, 440], 1.3, 0.035);
  };
  // Site → intro: a reversed swell pulls inward, the same flash, then the dark ambience settles.
  S.introIn = function (t, o) {
    var B = bus(t, o);
    nz(B, t, 1.0, 'bandpass', [[0, 500], [0.88, 3800]], 0.8, [[0, 0], [0.8, 0.26], [0.9, 0]]);
    nz(B, t + 0.2, 0.75, 'highpass', [[0, 3000], [0.68, 7000]], 0.7, [[0, 0], [0.66, 0.1], [0.72, 0]]);
    whine(B, t, 440, 110, 0.9, 0.06, 3600, 700);
    var tf = t + 0.89;
    tone(B, tf, 'sine', [[0, 80], [0.6, 32]], [[0, 0], [0.012, 0.5], [1.0, 0]], 1.1);
    nz(B, tf, 0.5, 'highpass', [[0, 2200], [0.45, 800]], 0.6, [[0, 0], [0.005, 0.26], [0.4, 0]]);
    bell(B, tf + 0.01, 523.25, 0.05, 2.0);
    pad(B, t + 1.0, [110, 164.81, 220], 1.4, 0.04);
  };

  function play(name, o) {
    o = o || {};
    if (!S[name] || !AC || !active()) return;
    var c = ensure(); if (!c) return;
    var go = function () { try { S[name](c.currentTime + 0.012, o); } catch (e) {} };
    if (c.state === 'running') go();
    else if (c.resume) { try { c.resume().then(function () { if (c.state === 'running') go(); }).catch(function () {}); } catch (e) {} }
  }
  window.RadiantSfx = { v: 2, play: play, unlock: unlock };
})();
