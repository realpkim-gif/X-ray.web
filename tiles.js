(function () {
  if (window.RadiantTiles && window.RadiantTiles.v === 4) return;
  var OUT = 'cubic-bezier(.16,1,.3,1)', IO = 'cubic-bezier(.76,0,.24,1)', SOFT = 'cubic-bezier(.22,1,.36,1)';
  var TAN = Math.tan(10 * Math.PI / 180), SIZE = 72, SPREAD = 480, DUR = 440, LAG = 40, TOTAL = SPREAD + LAG + DUR;
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
  var ease = bez(0.16, 1, 0.3, 1);
  function reduced() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function geo() {
    var vw = window.innerWidth, vh = window.innerHeight, cols = Math.max(6, Math.round(vw / SIZE)), rows = Math.max(6, Math.round(vh / SIZE)), tw = vw / cols, th = vh / rows, cells = [], kMin = Infinity, kMax = -Infinity;
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
      var k = (j + 0.5) * th + (i + 0.5) * tw * TAN;
      if (k < kMin) kMin = k; if (k > kMax) kMax = k;
      cells.push({ k: k });
    }
    cells.forEach(function (c) { c.d = (kMax - c.k) / ((kMax - kMin) || 1) * SPREAD; });
    return { vw: vw, vh: vh, cols: cols, rows: rows, tw: tw, th: th, cells: cells, kMin: kMin, kMax: kMax };
  }
  function canvas(g, z) {
    var el = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1);
    el.width = Math.round(g.vw * dpr); el.height = Math.round(g.vh * dpr); el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;left:0;top:0;width:' + g.vw + 'px;height:' + g.vh + 'px;z-index:' + z + ';pointer-events:none';
    var ctx = el.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { el: el, ctx: ctx };
  }
  function sparks(g) {
    var P = [], range = g.kMax - g.kMin;
    return {
      alive: function () { return P.length > 0; },
      step: function (ctx, el, dt, spawn) {
        if (spawn && el > 30) {
          var k = g.kMax - c01((el - 35) / SPREAD) * range, n = Math.round(g.vw / 26);
          for (var i = 0; i < n; i++) {
            var x = Math.random() * g.vw, y = k - x * TAN + (Math.random() - 0.5) * 22;
            if (y < -8 || y > g.vh + 8) continue;
            var big = Math.random() < 0.05;
            P.push({ x: x, y: y, vx: (Math.random() - 0.5) * 0.05, vy: -(0.02 + Math.random() * 0.1), life: 420 + Math.random() * 560, age: 0, s: big ? 3 + Math.random() * 2.5 : 0.8 + Math.random() * 1.5, c: Math.random() < 0.72 ? '#F08A4B' : '#F3EDE6', r: Math.random() * 6.283, vr: (Math.random() - 0.5) * 0.012, big: big });
          }
        }
        for (var q = P.length - 1; q >= 0; q--) {
          var p = P[q]; p.age += dt;
          if (p.age >= p.life) { P[q] = P[P.length - 1]; P.pop(); continue; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          var f = 1 - p.age / p.life; ctx.globalAlpha = f * f * 0.9; ctx.fillStyle = p.c;
          if (p.big) { p.r += p.vr * dt; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore(); }
          else ctx.fillRect(p.x, p.y, p.s, p.s);
        }
        ctx.globalAlpha = 1;
      }
    };
  }
  function rect(x, y, w, h) { return 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'h' + w.toFixed(1) + 'v' + h.toFixed(1) + 'h' + (-w).toFixed(1) + 'z'; }
  function send(f, m) { try { f.contentWindow.postMessage({ radiant: m }, '*'); } catch (e) {} }

  // Seamless transition: the other page lives preloaded in an iframe and is revealed tile by tile.
  function sweep(H, opening, o) {
    var f = H.frame, cv = null;
    H.par.forEach(function (a) { a.cancel(); }); H.par = [];
    var finish = function () {
      H.busy = false; if (cv) cv.el.style.pointerEvents = 'none';
      if (opening) {
        f.style.clipPath = 'none'; f.style.visibility = 'visible'; f.style.pointerEvents = 'auto'; f.removeAttribute('aria-hidden'); f.tabIndex = 0; H.isOpen = true;
        try { H.title = document.title; if (f.contentDocument && f.contentDocument.title) document.title = f.contentDocument.title; f.contentWindow.focus(); } catch (e) {}
      } else {
        f.style.visibility = 'hidden'; f.style.pointerEvents = 'none'; f.style.clipPath = 'none'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; H.isOpen = false;
        if (H.title) document.title = H.title; try { window.focus(); } catch (e) {}
      }
      if (o.done) o.done();
    };
    if (opening) send(f, 'enter');
    if (reduced()) { finish(); return; }
    H.busy = true;
    var g = geo(), sp = sparks(g), t0 = 0, last = 0, done = false;
    cv = canvas(g, 10045); cv.el.style.pointerEvents = 'auto'; document.body.appendChild(cv.el);
    var ctx = cv.ctx;
    if (opening) { f.style.clipPath = 'path("M0 0z")'; f.style.visibility = 'visible'; }
    (o.content || []).forEach(function (el) {
      if (opening) H.par.push(el.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-6vh,0)' }], { duration: TOTAL, easing: IO, fill: 'forwards' }));
      else el.animate([{ transform: 'translate3d(0,7vh,0)' }, { transform: 'translate3d(0,0,0)' }], { duration: TOTAL + 250, easing: SOFT, fill: 'backwards' });
    });
    var frame = function (now) {
      if (!t0) { t0 = now; last = now; }
      var el = now - t0, dt = Math.min(40, now - last); last = now;
      ctx.clearRect(0, 0, g.vw, g.vh);
      if (!done) {
        var path = '', tw = g.tw, th = g.th, cols = g.cols;
        ctx.fillStyle = '#E0641C';
        for (var j = 0; j < g.rows; j++) {
          var yt = j * th, yb = yt + th, run0 = -1;
          for (var i = 0; i < cols; i++) {
            var c = g.cells[j * cols + i], pA = ease((el - c.d) / DUR), pB = ease((el - c.d - LAG) / DUR), x = i * tw;
            if (pA - pB > 0.002) ctx.fillRect(x - 0.3, yb - pA * th, tw + 0.6, (pA - pB) * th);
            if (opening ? pB >= 0.999 : pB <= 0.001) { if (run0 < 0) run0 = i; continue; }
            if (run0 >= 0) { path += rect(run0 * tw - 0.5, yt - 0.5, (i - run0) * tw + 1, th + 1); run0 = -1; }
            if (opening) { if (pB > 0.001) path += rect(x - 0.5, yb - pB * th, tw + 1, pB * th + 0.5); }
            else if (pB < 0.999) path += rect(x - 0.5, yt - 0.5, tw + 1, (1 - pB) * th + 0.5);
          }
          if (run0 >= 0) path += rect(run0 * tw - 0.5, yt - 0.5, (cols - run0) * tw + 1, th + 1);
        }
        f.style.clipPath = 'path("' + (path || 'M0 0z') + '")';
        if (el >= TOTAL) { done = true; finish(); }
      }
      sp.step(ctx, el, dt, el < SPREAD + 140);
      if (!done || sp.alive()) requestAnimationFrame(frame); else cv.el.remove();
    };
    requestAnimationFrame(function () { requestAnimationFrame(frame); });
  }
  function host(src) {
    var H = { ready: false, isOpen: false, busy: false, par: [] }, f = document.createElement('iframe');
    f.src = src + (src.indexOf('?') < 0 ? '?' : '&') + 'embed=1';
    f.title = 'Radiant'; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true');
    f.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;border:0;margin:0;padding:0;display:block;z-index:10040;visibility:hidden;pointer-events:none;background:transparent';
    document.body.appendChild(f);
    H.frame = f;
    window.addEventListener('message', function (e) {
      if (!f.contentWindow || e.source !== f.contentWindow || !e.data || !e.data.radiant) return;
      if (e.data.radiant === 'ready') { H.ready = true; if (H.pending) { var p = H.pending; H.pending = null; clearTimeout(H.pt); H.opts = p; sweep(H, true, p); } }
      else if (e.data.radiant === 'back') H.close(H.opts);
    });
    H.open = function (o) {
      o = o || {}; if (H.busy || H.isOpen) return;
      if (H.ready) { H.opts = o; sweep(H, true, o); return; }
      H.pending = o; clearTimeout(H.pt);
      H.pt = setTimeout(function () { if (H.pending) { var p = H.pending; H.pending = null; if (p.fallback) p.fallback(); } }, 3000);
    };
    H.close = function (o) { if (H.busy || !H.isOpen) return; sweep(H, false, o || {}); };
    return H;
  }

  // Fallback: cover, navigate, uncover on arrival.
  function build(hostEl, covered) {
    var g = geo(), layer = document.createElement('div'), cells = [];
    layer.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;display:grid;grid-template-columns:repeat(' + g.cols + ',1fr);grid-template-rows:repeat(' + g.rows + ',1fr)';
    var st = 'position:absolute;inset:-0.5px;will-change:transform;transform-origin:50% 100%;transform:' + (covered ? 'none' : 'scaleY(0)') + ';background:';
    g.cells.forEach(function (gc) {
      var c = document.createElement('div'), a = document.createElement('div'), b = document.createElement('div');
      c.style.position = 'relative'; a.style.cssText = st + '#E0641C'; b.style.cssText = st + '#161310';
      c.appendChild(a); c.appendChild(b); layer.appendChild(c);
      cells.push({ a: a, b: b, d: gc.d });
    });
    hostEl.insertBefore(layer, hostEl.firstChild);
    return { host: hostEl, layer: layer, cells: cells, par: [] };
  }
  function run(t, rising) {
    var fr = rising ? [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }] : [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }];
    t.cells.forEach(function (c) {
      c.a.style.transformOrigin = c.b.style.transformOrigin = rising ? '50% 100%' : '50% 0%';
      (rising ? c.a : c.b).animate(fr, { duration: DUR, delay: c.d, easing: OUT, fill: 'both' });
      (rising ? c.b : c.a).animate(fr, { duration: DUR, delay: c.d + LAG, easing: OUT, fill: 'both' });
    });
    return TOTAL;
  }
  function leave(x, y, go, o) {
    o = o || {};
    var el = document.createElement('div');
    el.setAttribute('data-radiant-tx', ''); el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:10050;pointer-events:auto';
    document.body.appendChild(el);
    var t = build(el, false), total = run(t, true);
    (o.content || []).forEach(function (c) { t.par.push(c.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-6vh,0)' }], { duration: total, easing: IO, fill: 'forwards' })); });
    t.timer = setTimeout(go, total + 30);
    return t;
  }
  function reveal(t, o) {
    o = o || {};
    clearTimeout(t.timer); t.par.forEach(function (a) { a.cancel(); }); t.par = [];
    t.host.style.pointerEvents = 'none';
    var total = run(t, false);
    (o.content || []).forEach(function (c) { c.animate([{ transform: 'translate3d(0,7vh,0)' }, { transform: 'translate3d(0,0,0)' }], { duration: total + 250, easing: SOFT, fill: 'backwards' }); });
    if (o.start) o.start(Math.round(SPREAD * 0.3));
    t.timer = setTimeout(function () { if (o.done) o.done(t); }, total + 60);
  }
  function arrive(hostEl, o) { var t = build(hostEl, true); hostEl.style.background = 'transparent'; requestAnimationFrame(function () { reveal(t, o); }); return t; }
  function prefetch(href) { try { var l = document.createElement('link'); l.rel = 'prefetch'; l.href = href; document.head.appendChild(l); } catch (e) {} }
  window.RadiantTiles = { v: 4, host: host, leave: leave, arrive: arrive, reveal: reveal, prefetch: prefetch };
})();
