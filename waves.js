(function () {
  if (window.RadiantWaves && window.RadiantWaves.v >= 3) return;
  var IO = 'cubic-bezier(.76,0,.24,1)', SOFT = 'cubic-bezier(.22,1,.36,1)';
  var DUR = 820, LAG_DEEP = 80, LAG_REV = 170, TOTAL = DUR + LAG_REV;
  var FOAM = '#FFF3EA', ORANGE = '#E0641C', LIGHT = '#F08A4B', DEEP = '#161310';
  function c01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function bez(x1, y1, x2, y2) {
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var t = x;
      for (var i = 0; i < 7; i++) {
        var u = 1 - t, fx = 3 * x1 * t * u * u + 3 * x2 * t * t * u + t * t * t - x, dx = 3 * x1 * u * u + 6 * (x2 - x1) * t * u + 3 * (1 - x2) * t * t;
        if (Math.abs(fx) < 1e-5 || Math.abs(dx) < 1e-6) break;
        t = c01(t - fx / dx);
      }
      var w = 1 - t; return 3 * y1 * t * w * w + 3 * y2 * t * t * w + t * t * t;
    };
  }
  var ease = bez(0.62, 0.02, 0.28, 1);
  function reduced() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function geo() {
    var vw = window.innerWidth, vh = window.innerHeight, sm = vw < 700;
    var A = Math.max(18, Math.min(46, vh * 0.055)), lam = Math.max(280, Math.min(780, vw / 2.2));
    var tilt = sm ? 0.03 : 0.055, sw = Math.max(36, Math.min(78, vw / 22)), sh = Math.max(8, Math.min(17, A * 0.4)), fh = Math.max(14, Math.min(28, vh * 0.03));
    var step = 6, n = Math.ceil((vw + 24) / step) + 1, xs = new Float32Array(n);
    for (var i = 0; i < n; i++) xs[i] = -12 + i * step;
    return { vw: vw, vh: vh, A: A, k1: 6.2832 / lam, k2: 6.2832 / (lam * 0.46), ks: Math.PI / sw, tilt: tilt, sh: sh, fh: fh, pad: A * 1.05 + vw * tilt / 2 + sh + fh + 16, step: step, n: n, xs: xs };
  }
  function canvas(g, z) {
    var el = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1);
    el.width = Math.round(g.vw * dpr); el.height = Math.round(g.vh * dpr); el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;left:0;top:0;width:' + g.vw + 'px;height:' + g.vh + 'px;z-index:' + z + ';pointer-events:none';
    var ctx = el.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { el: el, ctx: ctx };
  }
  function send(f, m, d) { try { f.contentWindow.postMessage({ radiant: m, d: d }, '*'); } catch (e) {} }
  function sfx(n, o) { try { if (window.RadiantSfx) window.RadiantSfx.play(n, o); } catch (e) {} }
  var idle = window.requestIdleCallback ? function (cb) { window.requestIdleCallback(cb, { timeout: 1200 }); } : function (cb) { setTimeout(cb, 80); };
  // A parked frame is fully transparent but still painted, so revealing it never waits on a first paint.
  function park(f) {
    var s = f.style; s.clipPath = 'none'; s.visibility = 'visible'; s.opacity = '0'; s.willChange = 'opacity'; s.pointerEvents = 'none';
    f.setAttribute('aria-hidden', 'true'); f.setAttribute('inert', ''); f.tabIndex = -1; solo();
  }
  function unpark(f) { if (f.hasAttribute('data-radiant-z')) { f.style.zIndex = f.getAttribute('data-radiant-z'); f.removeAttribute('data-radiant-z'); } f.style.visibility = 'visible'; f.style.opacity = '1'; solo(); }
  // While a hosted page is up it must own scrolling: this page's root scrollbar paints above every fixed layer, and an
  // invisible parked frame stacked above the open one still swallows wheel and scrollbar drags, so tuck it just underneath
  // (still painted, so the next switch stays instant).
  function solo() {
    var d = document.documentElement, fr = document.querySelectorAll('body > iframe[src*="embed=1"]'), up = false, top = Infinity, i, o;
    for (i = 0; i < fr.length; i++) if (fr[i].style.opacity === '1') { up = true; top = Math.min(top, +fr[i].style.zIndex || 0); }
    if (up && !d.hasAttribute('data-radiant-ov')) { d.setAttribute('data-radiant-ov', d.style.overflow); d.style.overflow = 'hidden'; }
    if (!up && d.hasAttribute('data-radiant-ov')) { d.style.overflow = d.getAttribute('data-radiant-ov'); d.removeAttribute('data-radiant-ov'); }
    for (i = 0; i < fr.length; i++) {
      o = fr[i]; if (o.style.opacity !== '0') continue;
      if (up && (+o.style.zIndex || 0) >= top) { if (!o.hasAttribute('data-radiant-z')) o.setAttribute('data-radiant-z', o.style.zIndex); o.style.zIndex = String(top - 1); }
      else if (!up && o.hasAttribute('data-radiant-z')) { o.style.zIndex = o.getAttribute('data-radiant-z'); o.removeAttribute('data-radiant-z'); }
    }
  }
  // While a hosted page fully covers this one, freeze this page's endless loops so they don't compete for frames.
  function hush(H, on) {
    if (!on) { (H.hushed || []).forEach(function (a) { try { a.play(); } catch (e) {} }); H.hushed = []; return; }
    H.hushed = [];
    try { document.getAnimations().forEach(function (a) { var t = a.effect && a.effect.getTiming && a.effect.getTiming(); if (t && t.iterations === Infinity && a.playState === 'running') { a.pause(); H.hushed.push(a); } }); } catch (e) {}
  }
  function edge(g) { return { y: new Float32Array(g.n), min: 0, max: 0 }; }
  function base(g, p) { return g.vh + g.pad - (g.vh + 2 * g.pad) * p; }
  // One wave front: two travelling sines, a slight diagonal, optional cartoon scallops on top.
  function wave(g, E, b, t, ph, env, scal, off) {
    var A = g.A * env, cx = g.vw / 2, a1 = t * 0.0042 + ph, a2 = -t * 0.0061 - ph * 1.7, as = t * 0.0052, lo = Infinity, hi = -Infinity, x, y;
    for (var i = 0; i < g.n; i++) {
      x = g.xs[i];
      y = b + off + (cx - x) * g.tilt + A * (0.62 * Math.sin(x * g.k1 + a1) + 0.38 * Math.sin(x * g.k2 + a2));
      if (scal) y -= scal * Math.abs(Math.sin(x * g.ks + as));
      E.y[i] = y; if (y < lo) lo = y; if (y > hi) hi = y;
    }
    E.min = lo; E.max = hi;
  }
  function yAt(g, E, x) { var f = (x - g.xs[0]) / g.step, i = f | 0; if (f <= 0) return E.y[0]; if (i >= g.n - 1) return E.y[g.n - 1]; return E.y[i] + (E.y[i + 1] - E.y[i]) * (f - i); }
  function below(ctx, g, E) { var n = g.n; ctx.beginPath(); ctx.moveTo(g.xs[0], g.vh + 40); for (var i = 0; i < n; i++) ctx.lineTo(g.xs[i], E.y[i]); ctx.lineTo(g.xs[n - 1], g.vh + 40); ctx.closePath(); ctx.fill(); }
  function along(ctx, g, E, off) { ctx.beginPath(); ctx.moveTo(g.xs[0], E.y[0] + off); for (var i = 1; i < g.n; i++) ctx.lineTo(g.xs[i], E.y[i] + off); ctx.stroke(); }
  function clip(g, E, opening) {
    var lim = opening ? g.vh + 40 : -40, L = g.n - 1, s = 'M' + g.xs[0] + ' ' + lim;
    for (var i = 0; i < L; i += 2) s += 'L' + g.xs[i].toFixed(1) + ' ' + (E.y[i] - 1.5).toFixed(1);
    s += 'L' + g.xs[L].toFixed(1) + ' ' + (E.y[L] - 1.5).toFixed(1) + 'L' + g.xs[L].toFixed(1) + ' ' + lim + 'Z';
    return 'path("' + s + '")';
  }

  // starts: [foam crest, deep water, reveal edge] in ms. Infinity = not yet, -Infinity = already passed.
  function engine(g, cv, o) {
    var S = o.starts.slice(), ctx = cv.ctx, E = [edge(g), edge(g), edge(g), edge(g)], drops = [], bub = [], t0 = 0, last = 0, el = 0, pb = null;
    var covered = false, done = false, stopped = false, raf = 0, fr = o.frame || null, opening = o.opening !== false, api;
    for (var i = 0, nb = Math.round(g.vw / 30); i < nb; i++) bub.push({ band: i % 3 ? 2 : 1, x: Math.random() * g.vw, f: Math.random(), r: 2 + Math.random() * 4.5, v: 0.00035 + Math.random() * 0.0006, w: Math.random() * 6.283 });
    function prog(s) { return s === Infinity ? 0 : s === -Infinity ? 1 : ease(c01((el - s) / DUR)); }
    function bubbles(top, bot, band, col, a, dt) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.6;
      for (var i = 0; i < bub.length; i++) {
        var b = bub[i]; if (b.band !== band) continue;
        b.f -= b.v * dt; if (b.f < 0.04) { b.f = 0.92 + Math.random() * 0.08; b.x = Math.random() * g.vw; }
        var x = b.x + Math.sin(el * 0.004 + b.w) * 3, ty = yAt(g, top, x), by = bot ? yAt(g, bot, x) : g.vh + 60, room = by - ty - 2 * b.r - 16;
        if (room < 4) continue;
        var y = ty + 8 + b.r + b.f * room; if (y < -b.r || y > g.vh + b.r) continue;
        ctx.globalAlpha = a * Math.min(1, room / 40);
        ctx.beginPath(); ctx.arc(x, y, b.r, 0, 6.2832); ctx.stroke();
        ctx.beginPath(); ctx.arc(x - b.r * 0.36, y - b.r * 0.36, Math.max(0.8, b.r * 0.24), 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function draw(dt) {
      var p0 = prog(S[0]), p2 = prog(S[1]), rev = S[2] !== Infinity, p3 = rev ? prog(S[2]) : 0, b0 = base(g, p0), e0 = 0.72 + 0.28 * Math.sin(Math.PI * p0);
      wave(g, E[0], b0, el, 0, e0, g.sh * (0.85 + 0.15 * Math.sin(el * 0.012)), 0);
      wave(g, E[1], b0, el, 0, e0, 0, g.fh);
      wave(g, E[2], base(g, p2), el, 1.05, 0.72 + 0.28 * Math.sin(Math.PI * p2), 0, 0);
      if (rev) wave(g, E[3], base(g, p3), el, 1.95, 0.72 + 0.28 * Math.sin(Math.PI * p3), 0, 0);
      ctx.clearRect(0, 0, g.vw, g.vh); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      var gone = rev && E[3].max < 0;
      if (!gone && E[0].min < g.vh && E[1].max >= 0) {
        ctx.fillStyle = FOAM; below(ctx, g, E[0]);
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 3.2; along(ctx, g, E[0], 0);
      }
      if (!gone && E[1].min < g.vh && E[2].max >= 0) {
        ctx.fillStyle = ORANGE; below(ctx, g, E[1]);
        ctx.setLineDash([46, 26, 10, 26]); ctx.lineDashOffset = -el * 0.07; ctx.strokeStyle = FOAM; ctx.globalAlpha = 0.85; ctx.lineWidth = 3; along(ctx, g, E[1], 14); ctx.setLineDash([]); ctx.globalAlpha = 1;
        bubbles(E[1], E[2], 1, FOAM, 0.7, dt);
      }
      if (!gone && E[2].min < g.vh) {
        ctx.fillStyle = DEEP; below(ctx, g, E[2]);
        ctx.setLineDash([22, 30]); ctx.lineDashOffset = el * 0.05; ctx.strokeStyle = ORANGE; ctx.globalAlpha = 0.5; ctx.lineWidth = 2.4; along(ctx, g, E[2], 16); ctx.setLineDash([]); ctx.globalAlpha = 1;
        bubbles(E[2], rev ? E[3] : null, 2, LIGHT, 0.5, dt);
      }
      if (rev && !gone && E[3].min < g.vh + 2) { ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = '#000'; below(ctx, g, E[3]); ctx.globalCompositeOperation = 'source-over'; }
      if (dt > 0 && p0 > 0.05 && p0 < 0.93 && E[0].min < g.vh && E[0].max > -20) {
        var vb = pb == null ? 0 : (b0 - pb) / dt, c = g.vw / 300 * dt / 16.7, k = (c | 0) + (Math.random() < c % 1 ? 1 : 0);
        while (k-- > 0) {
          var sx = Math.random() * g.vw, sy = yAt(g, E[0], sx) - 3; if (sy < -10 || sy > g.vh + 10) continue;
          var big = Math.random() < 0.1;
          drops.push({ x: sx, y: sy, vx: (Math.random() - 0.5) * 0.14, vy: vb - 0.1 - Math.random() * 0.34, r: big ? 4 + Math.random() * 3 : 1.4 + Math.random() * 2.4, age: 0, life: 380 + Math.random() * 420, c: Math.random() < 0.62 ? ORANGE : LIGHT });
        }
      }
      pb = b0;
      for (var q = drops.length - 1; q >= 0; q--) {
        var d = drops[q]; d.age += dt; d.vy += 0.0019 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.age > d.life || d.y < -30 || (d.age > 40 && d.y > yAt(g, E[0], d.x) + 2)) { drops[q] = drops[drops.length - 1]; drops.pop(); continue; }
        ctx.globalAlpha = Math.min(1, (d.life - d.age) / 160); ctx.fillStyle = d.c; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (fr && rev && !done) fr.style.clipPath = E[3].min > g.vh + 2 ? (opening ? 'path("M0 0z")' : 'none') : clip(g, E[3], opening);
      if (!covered && E[2].max < -1) { covered = true; if (o.onCovered) o.onCovered(api); }
      if (rev && !done && E[3].max < -1) { done = true; if (o.onDone) o.onDone(api); }
    }
    function frame(now) {
      raf = 0; if (stopped) return;
      if (!t0) { t0 = now; last = now; }
      var dt = Math.min(40, now - last); last = now; el = now - t0;
      draw(dt);
      if (done && !drops.length) { stopped = true; if (o.onEnd) o.onEnd(api); return; }
      raf = requestAnimationFrame(frame);
    }
    api = {
      layer: cv.el,
      reveal: function (f2, op, cb) { if (stopped || S[2] !== Infinity) return; if (f2) fr = f2; if (op != null) opening = op; if (cb !== undefined) o.onDone = cb; S[2] = el + 16; },
      stop: function () { stopped = true; if (raf) cancelAnimationFrame(raf); raf = 0; if (cv.el.parentNode) cv.el.parentNode.removeChild(cv.el); }
    };
    api.restore = function () { cv.el.style.pointerEvents = 'none'; sfx('waveTail'); api.reveal(null, true, null); };
    draw(0);
    raf = requestAnimationFrame(frame);
    return api;
  }

  // Seamless: the other page is preloaded in an iframe and washed in behind the wave.
  function host(src, opt) {
    var H = { ready: false, isOpen: false, busy: false, warm: false, loading: false, par: [] }, f = document.createElement('iframe'), url = src + (src.indexOf('?') < 0 ? '?' : '&') + 'embed=1';
    f.title = 'Radiant'; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true'); f.setAttribute('inert', '');
    f.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;border:0;margin:0;padding:0;display:block;z-index:10030;visibility:hidden;pointer-events:none;background:transparent';
    document.body.appendChild(f);
    H.frame = f;
    H.load = function () { if (H.loading) return; H.loading = true; f.src = url; };
    if (!(opt && opt.defer)) H.load();
    function stopPar() { H.par.forEach(function (a) { a.cancel(); }); H.par = []; }
    function layer() { var g = geo(), cv = canvas(g, 10035); cv.el.style.pointerEvents = 'auto'; document.body.appendChild(cv.el); return { g: g, cv: cv, end: function () { if (cv.el.parentNode) cv.el.parentNode.removeChild(cv.el); } }; }
    function arm(d) { f.style.clipPath = 'path("M0 0z")'; unpark(f); send(f, 'enter', d); }
    function shown(o) {
      H.busy = false; H.warm = true; f.style.clipPath = 'none'; unpark(f); f.style.pointerEvents = 'auto'; f.removeAttribute('aria-hidden'); f.removeAttribute('inert'); f.tabIndex = 0; H.isOpen = true; hush(H, true);
      try { H.title = document.title; if (f.contentDocument && f.contentDocument.title) document.title = f.contentDocument.title; f.contentWindow.focus(); } catch (e) {}
      if (o && o.done) o.done();
    }
    function hidden(o) {
      H.busy = false; park(f); H.isOpen = false; hush(H, false);
      if (H.title) document.title = H.title; try { window.focus(); } catch (e) {}
      if (o && o.done) o.done();
    }
    // Runs once, while nothing is moving: paints the parked frame and draws one wave frame so every canvas path is ready.
    function warm() {
      if (H.warm) return; H.warm = true;
      if (H.busy || H.isOpen) return;
      park(f);
      if (reduced()) return;
      var g = geo(), cv = canvas(g, 10034), n = 0;
      cv.el.style.opacity = '0'; cv.el.style.willChange = 'opacity'; document.body.appendChild(cv.el);
      var eng = engine(g, cv, { starts: [-430, -350, -260] });
      var step = function () { if (++n < 4) { requestAnimationFrame(step); return; } eng.stop(); };
      requestAnimationFrame(step);
    }
    window.addEventListener('message', function (e) {
      if (!f.contentWindow || e.source !== f.contentWindow || !e.data || !e.data.radiant) return;
      var m = e.data.radiant;
      if (m === 'ready') { H.ready = true; if (H.wait) { var w = H.wait; H.wait = null; w(); } idle(warm); }
      else if (m === 'back') { if (H.onBack) H.onBack(); else H.close(H.opts); }
      else if (H.onMessage) H.onMessage(m, e.data);
    });
    H.open = function (o) {
      o = o || {}; if (H.busy || H.isOpen) return; H.opts = o; stopPar();
      if (reduced()) { if (H.ready) { send(f, 'enter', 0); shown(o); } else if (o.fallback) o.fallback(null); return; }
      H.busy = true; sfx(o.sfx || 'wave');
      var L = layer();
      (o.content || []).forEach(function (el) { H.par.push(el.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-6vh,0)' }], { duration: TOTAL, easing: IO, fill: 'forwards' })); });
      if (H.ready) {
        arm(420);
        engine(L.g, L.cv, { starts: [0, LAG_DEEP, LAG_REV], frame: f, opening: true, onDone: function () { L.cv.el.style.pointerEvents = 'none'; shown(o); }, onEnd: L.end });
        return;
      }
      var eng = engine(L.g, L.cv, { starts: [0, LAG_DEEP, Infinity], onEnd: L.end, onCovered: function () {
        var go = function () { clearTimeout(H.wt); H.wait = null; arm(240); eng.reveal(f, true, function () { L.cv.el.style.pointerEvents = 'none'; shown(o); }); };
        if (H.ready) { go(); return; }
        H.load();
        H.wait = go;
        H.wt = setTimeout(function () {
          H.wait = null; H.busy = false;
          eng.restore = function () {
            stopPar(); L.cv.el.style.pointerEvents = 'none'; sfx('waveTail');
            (o.content || []).forEach(function (el) { el.animate([{ transform: 'translate3d(0,7vh,0)' }, { transform: 'translate3d(0,0,0)' }], { duration: DUR + 250, easing: SOFT, fill: 'backwards' }); });
            eng.reveal(null, true, null);
          };
          if (o.fallback) o.fallback(eng); else eng.restore();
        }, 4500);
      } });
    };
    H.close = function (o) {
      o = o || {}; if (H.busy || !H.isOpen) return; stopPar(); hush(H, false);
      if (reduced()) { hidden(o); return; }
      H.busy = true; sfx(o.sfxBack || 'waveBack');
      var L = layer();
      (o.content || []).forEach(function (el) { el.animate([{ transform: 'translate3d(0,7vh,0)' }, { transform: 'translate3d(0,0,0)' }], { duration: TOTAL + 260, easing: SOFT, fill: 'backwards' }); });
      engine(L.g, L.cv, { starts: [0, LAG_DEEP, LAG_REV], frame: f, opening: false, onDone: function () { L.cv.el.style.pointerEvents = 'none'; hidden(o); }, onEnd: L.end });
    };
    H.hide = function () { if (H.busy || !H.isOpen) return false; stopPar(); hidden(null); return true; };
    return H;
  }

  // Fallback: wash over, navigate, wash away on arrival.
  function leave(go, o) {
    o = o || {};
    var g = geo(), cv = canvas(g, 10050), fired = false;
    cv.el.setAttribute('data-radiant-tx', ''); cv.el.style.pointerEvents = 'auto'; document.body.appendChild(cv.el);
    sfx(o.sfx || 'wave', { cut: 0.92 });
    var par = (o.content || []).map(function (c) { return c.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-6vh,0)' }], { duration: DUR + LAG_DEEP, easing: IO, fill: 'forwards' }); });
    var eng = engine(g, cv, { starts: [0, LAG_DEEP, Infinity], onCovered: function () { if (!fired) { fired = true; setTimeout(go, 30); } }, onEnd: function () { if (cv.el.parentNode) cv.el.parentNode.removeChild(cv.el); } });
    eng.restore = function () {
      par.forEach(function (a) { a.cancel(); }); cv.el.style.pointerEvents = 'none'; sfx('waveTail');
      (o.content || []).forEach(function (c) { c.animate([{ transform: 'translate3d(0,7vh,0)' }, { transform: 'translate3d(0,0,0)' }], { duration: DUR + 250, easing: SOFT, fill: 'backwards' }); });
      eng.reveal(null, true, null);
    };
    return eng;
  }
  function arrive(hostEl, o) {
    o = o || {};
    var g = geo(), cv = canvas(g, 1), eng;
    hostEl.appendChild(cv.el);
    eng = engine(g, cv, { starts: [-Infinity, -Infinity, 60], onDone: function () { if (o.done) o.done(eng); } });
    hostEl.style.background = 'transparent'; hostEl.style.pointerEvents = 'none'; sfx('waveTail');
    (o.content || []).forEach(function (c) { c.animate([{ transform: 'translate3d(0,7vh,0)' }, { transform: 'translate3d(0,0,0)' }], { duration: DUR + 360, easing: SOFT, fill: 'backwards' }); });
    if (o.start) o.start(Math.round(DUR * 0.38));
    return eng;
  }
  function prefetch(href) { try { var l = document.createElement('link'); l.rel = 'prefetch'; l.href = href; document.head.appendChild(l); } catch (e) {} }
  window.RadiantWaves = { v: 3, host: host, leave: leave, arrive: arrive, prefetch: prefetch, DUR: DUR };
})();
