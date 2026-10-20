// The intro's beam over a giant wordmark (Home's closing band and the 404 page).
// Wires every [data-bw="sec"] on the page, including ones a template renders after this script runs.
(function () {
  if (window.RadiantBeam) return;
  var W = window, D = document;
  var LT = '#F08A4B', BONE = '#F3EDE6', TAU = Math.PI * 2;
  var MK = W.CSS && CSS.supports && CSS.supports('mask-image', 'none') ? 'maskImage' : 'webkitMaskImage';
  var VF = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@100..900&display=swap';
  function mq(q) { try { return W.matchMedia(q); } catch (e) { return { matches: false }; } }
  var RMQ = mq('(prefers-reduced-motion: reduce)'), HOVER = mq('(hover: hover) and (pointer: fine)').matches;
  var BS = [], raf = 0, lt = 0, poll = 0, scanT = 0;
  function now() { return performance.now(); }
  function rm() { return !!RMQ.matches; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function out3(t) { return 1 - Math.pow(1 - t, 3); }
  function pad(n) { return String(Math.max(0, Math.round(n))).padStart(4, '0'); }
  function setText(el, s) { var n = el.firstChild; if (n && n.nodeType === 3 && !n.nextSibling) { if (n.data !== s) n.data = s; } else el.textContent = s; }
  // Paused while the tab is hidden, a hosted page (Analyze, Founders) or the intro covers this one,
  // or this page is itself parked in another page's preload frame.
  function parked() { var f = null; try { f = W.frameElement; } catch (e) {} if (!f) return false; var s = f.style; return f.hasAttribute('inert') || s.visibility === 'hidden' || s.opacity === '0' || s.display === 'none'; }
  function covered() {
    if (D.hidden || parked()) return true;
    var fr = D.querySelectorAll('body > iframe[src*="embed=1"]');
    for (var i = 0; i < fr.length; i++) if (!fr[i].hasAttribute('inert') && fr[i].style.visibility !== 'hidden' && fr[i].style.opacity !== '0') return true;
    var ih = D.querySelector('[data-intro-host]'); return !!(ih && getComputedStyle(ih).visibility === 'visible');
  }
  function canvasFor(cv, w, h) { var d = Math.min(2, W.devicePixelRatio || 1); cv.width = Math.max(1, Math.round(w * d)); cv.height = Math.max(1, Math.round(h * d)); var x = cv.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); return x; }
  // Letters swell past 700, which needs the variable font.
  function varFont() {
    if (D.querySelector('link[data-bw-vf]')) return;
    var ls = D.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < ls.length; i++) if (/Hanken\+Grotesk:wght@100\.\.900/.test(ls[i].href)) return;
    var l = D.createElement('link'); l.rel = 'stylesheet'; l.href = VF; l.setAttribute('data-bw-vf', ''); D.head.appendChild(l);
  }

  // Reticle, crosshair and edge rulers, the same instrument as the intro.
  function reticle(f, x, y, r, t, a, w, h) {
    var gap = r + 22, i;
    f.fillStyle = LT; f.strokeStyle = LT;
    f.globalAlpha = 0.2 * a;
    if (x - gap > 0) f.fillRect(0, y - 0.5, x - gap, 1);
    if (x + gap < w) f.fillRect(x + gap, y - 0.5, w - x - gap, 1);
    if (y - gap > 0) f.fillRect(x - 0.5, 0, 1, y - gap);
    if (y + gap < h) f.fillRect(x - 0.5, y + gap, 1, h - y - gap);
    f.lineWidth = 1; f.globalAlpha = 0.8 * a; f.beginPath(); f.arc(x, y, r, 0, TAU); f.stroke();
    var rot = t * 0.00011; f.globalAlpha = 0.38 * a; f.beginPath();
    for (i = 0; i < 60; i++) { var an = rot + i * TAU / 60, r1 = r + 6, r2 = r + (i % 5 === 0 ? 14 : 9), co = Math.cos(an), si = Math.sin(an); f.moveTo(x + co * r1, y + si * r1); f.lineTo(x + co * r2, y + si * r2); }
    f.stroke();
    f.globalAlpha = 0.75 * a;
    f.fillRect(x - 6, y - 0.5, 12, 1); f.fillRect(x - 0.5, y - 6, 1, 12);
    f.fillRect(x - 0.5, y - r, 1, 8); f.fillRect(x - 0.5, y + r - 8, 1, 8); f.fillRect(x - r, y - 0.5, 8, 1); f.fillRect(x + r - 8, y - 0.5, 8, 1);
    f.fillStyle = BONE; f.globalAlpha = 0.16 * a;
    for (i = 0; i <= w; i += 10) f.fillRect(i, 0, 1, i % 100 === 0 ? 10 : i % 50 === 0 ? 6 : 3);
    for (i = 0; i <= h; i += 10) f.fillRect(0, i, i % 100 === 0 ? 10 : i % 50 === 0 ? 6 : 3, 1);
    f.fillStyle = LT; f.globalAlpha = 0.95 * a;
    f.beginPath(); f.moveTo(x - 4.5, 0); f.lineTo(x + 4.5, 0); f.lineTo(x, 8); f.closePath(); f.fill();
    f.beginPath(); f.moveTo(0, y - 4.5); f.lineTo(0, y + 4.5); f.lineTo(8, y); f.closePath(); f.fill();
    f.globalAlpha = 1;
  }

  function wire(sec) {
    if (sec._bw) return;
    var q = function (k) { return sec.querySelector('[data-bw="' + k + '"]'); };
    var B = { sec: sec, word: q('word'), solid: q('solid'), line: q('line'), lit: q('lit'), fx: q('fx'), read: q('read'), hint: q('hint'),
      vis: false, x: 0, y: 0, lx: 0, ly: 0, r: 0, v: 0, px: 0, py: 0, pt: -1e9, idle: 1, rings: [], lw: [], t0: 0, rt: 0, cw: 0, ch: 0, armed: true };
    if (!B.word || !B.solid || !B.line || !B.fx) return;
    sec._bw = B;
    B.L = [].slice.call(B.solid.querySelectorAll('[data-l]'));
    B.LL = [].slice.call(B.line.children);
    B.L.forEach(function () { B.lw.push(700); });
    B.max = parseFloat(B.word.getAttribute('data-max')) || 440;
    if (B.hint && !HOVER && B.hint.getAttribute('data-touch')) setText(B.hint, B.hint.getAttribute('data-touch'));
    var fq = 0, soon = function () { if (!fq) fq = requestAnimationFrame(function () { fq = 0; fit(B); kick(); }); };
    fit(B);
    if (W.ResizeObserver) new ResizeObserver(soon).observe(sec); else W.addEventListener('resize', soon);
    try { D.fonts.ready.then(soon); D.fonts.addEventListener('loadingdone', soon); } catch (e) {}
    B.x = B.lx = sec.clientWidth / 2; B.y = B.ly = sec.clientHeight * 0.58;
    BS.push(B);
    if (rm() || !W.IntersectionObserver) return;
    setTimeout(varFont, 900);
    new IntersectionObserver(function (es) {
      var v = es[es.length - 1].isIntersecting;
      if (v && !B.vis) B.t0 = now();
      B.vis = v; if (v) kick();
    }, { rootMargin: '120px 0px' }).observe(sec);
    // The letters rise in each time the band scrolls back into view.
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1];
      if (e.isIntersecting && B.armed) { B.armed = false; rise(B); } else if (!e.isIntersecting) B.armed = true;
    }, { rootMargin: '0px 0px -6% 0px' }).observe(sec);
    sec.addEventListener('pointermove', function (e) { B.px = e.clientX; B.py = e.clientY; B.pt = now(); }, { passive: true });
    sec.addEventListener('pointerleave', function () { B.pt = -1e9; });
    sec.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      var r = sec.getBoundingClientRect();
      B.px = e.clientX; B.py = e.clientY; B.pt = now();
      B.rings.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: now() }); if (B.rings.length > 4) B.rings.shift();
      kick();
    });
  }

  function rise(B) {
    if (rm()) return;
    var kf = [{ transform: 'translate3d(0,38%,0)', opacity: 0, filter: 'blur(14px)' }, { transform: 'translate3d(0,0,0)', opacity: 1, filter: 'blur(0px)' }];
    B.L.forEach(function (n, i) {
      [n, B.LL[i]].forEach(function (m) { if (m && m.animate) m.animate(kf, { duration: 1100, delay: 80 + i * 65, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }); });
    });
  }

  // Size the word to fill its row at the resting weight, so the swell has room either side.
  function fit(B) {
    var w = B.word, L = B.L, n = L.length, i; if (!n) return;
    for (i = 0; i < n; i++) w.style.setProperty('--w' + i, '700');
    var avail = w.clientWidth * (parseFloat(w.getAttribute('data-fill')) || 0.96), tw = L[n - 1].offsetLeft + L[n - 1].offsetWidth - L[0].offsetLeft;
    if (tw > 1 && avail > 1) {
      var fs = parseFloat(getComputedStyle(w).fontSize) || 200, nf = clamp(fs * avail / tw, 56, B.max);
      if (Math.abs(nf - fs) > 0.5) w.style.fontSize = nf.toFixed(1) + 'px';
    }
    for (i = 0; i < n; i++) w.style.setProperty('--w' + i, (B.lw[i] || 700).toFixed(0));
    var cw = B.sec.clientWidth, ch = B.sec.clientHeight;
    if (cw !== B.cw || ch !== B.ch) { B.cw = cw; B.ch = ch; B.ctx = canvasFor(B.fx, cw, ch); }
  }

  function step(B, t, dt) {
    if (!B.ctx) return;
    var sr = B.sec.getBoundingClientRect(), wr = B.word.getBoundingClientRect(), cw = B.cw, ch = B.ch, tt = t - (B.t0 || t), i;
    var rects = B.L.map(function (n) { return n.getBoundingClientRect(); });
    var user = t - B.pt < 2600 && B.px >= sr.left && B.px <= sr.right && B.py >= sr.top && B.py <= sr.bottom;
    if (user) { B.lx = B.px - sr.left; B.ly = B.py - sr.top; }
    B.idle += ((user ? 0 : 1) - B.idle) * (1 - Math.exp(-dt / (user ? 150 : 1100)));
    var wx = cw * (0.5 + 0.34 * Math.sin(tt * 0.00021) + 0.07 * Math.sin(tt * 0.00057 + 1.1)), wy = ch * (0.58 + 0.16 * Math.sin(tt * 0.00029 + 0.7) + 0.05 * Math.cos(tt * 0.00043));
    var tx = lerp(B.lx, wx, B.idle), ty = lerp(B.ly, wy, B.idle);
    var kb = 1 - Math.exp(-dt / 75), ox = B.x, oy = B.y;
    B.x += (tx - B.x) * kb; B.y += (ty - B.y) * kb;
    B.v += (Math.hypot(B.x - ox, B.y - oy) / dt - B.v) * (1 - Math.exp(-dt / 140));
    var fs = parseFloat(B.word.style.fontSize) || 200, boot = out3(clamp(tt / 900, 0, 1));
    var rT = clamp(fs * 0.4, 60, 150) * (1 + Math.min(0.18, B.v * 0.09)) * (1 + 0.03 * Math.sin(t * 0.0019));
    B.r += (rT - B.r) * (1 - Math.exp(-dt / 130));
    var r = B.r * boot, x = B.x, y = B.y, RL = Math.hypot(cw, ch) * 0.8;
    B.rings = B.rings.filter(function (g) { return t - g.t < 1500; });
    // The lit X-ray shows inside the beam and along each click ring.
    var Lm = [];
    if (r > 0.5) Lm.push('radial-gradient(circle ' + r.toFixed(1) + 'px at ' + x.toFixed(1) + 'px ' + y.toFixed(1) + 'px,#000 0%,#000 55%,rgba(0,0,0,.5) 80%,rgba(0,0,0,0) 100%)');
    B.rings.forEach(function (g) {
      var p = (t - g.t) / 1500, rr = out3(p) * RL, a = (1 - p) * (1 - p);
      Lm.push('radial-gradient(circle ' + (rr + 70).toFixed(1) + 'px at ' + g.x.toFixed(1) + 'px ' + g.y.toFixed(1) + 'px,rgba(0,0,0,0) ' + Math.max(0, rr - 90).toFixed(1) + 'px,rgba(0,0,0,' + a.toFixed(3) + ') ' + rr.toFixed(1) + 'px,rgba(0,0,0,0) ' + (rr + 70).toFixed(1) + 'px)');
    });
    if (B.lit) B.lit.style[MK] = Lm.length ? Lm.join(',') : 'linear-gradient(transparent,transparent)';
    // Inside the beam the letters turn to orange outline.
    var lx = (x + sr.left - wr.left).toFixed(1), ly = (y + sr.top - wr.top).toFixed(1), wR = (r * 0.94).toFixed(1);
    B.solid.style[MK] = r > 0.5 ? 'radial-gradient(circle ' + wR + 'px at ' + lx + 'px ' + ly + 'px,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 60%,#000 97%)' : 'none';
    B.line.style[MK] = r > 0.5 ? 'radial-gradient(circle ' + wR + 'px at ' + lx + 'px ' + ly + 'px,#000 0%,#000 56%,rgba(0,0,0,0) 94%)' : 'linear-gradient(transparent,transparent)';
    // Letters near the beam swell in weight and lean away from it.
    var cx0 = x + sr.left, cy0 = y + sr.top;
    for (i = 0; i < B.L.length; i++) {
      var q = rects[i], dx = q.left + q.width / 2 - cx0, dy = q.top + q.height / 2 - cy0, dd = Math.hypot(dx, dy), dn = dd / Math.max(80, r * 1.25), prox = Math.exp(-dn * dn) * boot;
      var wt = 700 + 55 * Math.sin(t * 0.0012 - i * 0.7) + 170 * prox, bx = dd > 0.5 ? dx / dd * 0.022 * prox : 0, by = Math.sin(t * 0.0017 + i * 0.95) * 0.012, sc = 1 + 0.04 * prox;
      B.lw[i] += (wt - B.lw[i]) * (1 - Math.exp(-dt / 90));
      B.word.style.setProperty('--w' + i, B.lw[i].toFixed(0));
      B.word.style.setProperty('--t' + i, 'translate3d(' + bx.toFixed(4) + 'em,' + by.toFixed(4) + 'em,0) scale(' + sc.toFixed(4) + ')');
    }
    var f = B.ctx; f.clearRect(0, 0, cw, ch);
    if (r > 0.5) reticle(f, x, y, r, t, boot, cw, ch);
    if (B.rings.length) {
      f.strokeStyle = LT; f.lineWidth = 1.5;
      B.rings.forEach(function (g) { var p = (t - g.t) / 1500; f.globalAlpha = (1 - p) * (1 - p) * 0.8; f.beginPath(); f.arc(g.x, g.y, out3(p) * RL, 0, TAU); f.stroke(); });
      f.globalAlpha = 1;
    }
    if (B.read && t - B.rt > 70) { B.rt = t; setText(B.read, 'X ' + pad(x) + '   Y ' + pad(y) + '   \u00d8 ' + pad(r * 2)); }
  }

  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  function loop(t) {
    raf = 0;
    var dt = lt ? Math.min(50, Math.max(1, t - lt)) : 16.7, more = false, wait = false, cov = null; lt = t;
    for (var i = BS.length - 1; i >= 0; i--) {
      var B = BS[i];
      if (!B.sec.isConnected) { BS.splice(i, 1); continue; }
      if (!B.vis || rm()) continue;
      if (cov === null) cov = covered();
      if (cov) { wait = true; continue; }
      step(B, t, dt); more = true;
    }
    if (more) raf = requestAnimationFrame(loop);
    else { lt = 0; if (wait && !poll) poll = setTimeout(function () { poll = 0; kick(); }, 400); }
  }

  function scan() { scanT = 0; var q = D.querySelectorAll('[data-bw="sec"]'); for (var i = 0; i < q.length; i++) wire(q[i]); }
  function boot() {
    scan();
    try { new MutationObserver(function () { if (!scanT) scanT = setTimeout(scan, 250); }).observe(D.body, { childList: true, subtree: true }); } catch (e) {}
    D.addEventListener('visibilitychange', kick);
  }
  if (D.body) boot(); else D.addEventListener('DOMContentLoaded', boot);
  W.RadiantBeam = { v: 1, scan: scan };
})();
