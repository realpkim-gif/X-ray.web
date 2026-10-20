// Founders portraits: a lens that shows the photo as a radiograph negative under the cursor.
// Wires every [data-xlens] container (mouse only; touch screens keep the plain photo).
(function () {
  if (window.RadiantLens) return;
  var W = window, D = document, LT = '#F08A4B';
  function mq(q) { try { return W.matchMedia(q); } catch (e) { return { matches: false }; } }
  var RMQ = mq('(prefers-reduced-motion: reduce)');
  var LS = [], raf = 0, lt = 0, scanT = 0;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function el(tag, css, parent) { var n = D.createElement(tag); n.setAttribute('aria-hidden', 'true'); n.style.cssText = css; parent.appendChild(n); return n; }

  function wire(c) {
    if (c._xl) return;
    var S = c._xl = { c: c, on: false, live: false, a: 0, x: 0, y: 0, tx: 0, ty: 0, rot: 0, el: null, R: 0 };
    LS.push(S);
    var pos = function (e) { var r = c.getBoundingClientRect(); S.tx = e.clientX - r.left; S.ty = e.clientY - r.top; };
    c.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      build(S); pos(e);
      if (!S.live) { S.x = S.tx; S.y = S.ty; }
      S.on = S.live = true; kick();
    });
    c.addEventListener('pointermove', function (e) { if (S.on) pos(e); });
    c.addEventListener('pointerleave', function () { S.on = false; kick(); });
  }

  function build(S) {
    var R = Math.round(clamp(S.c.clientWidth * 0.2, 60, 110));
    if (S.el && S.R === R && S.el.isConnected) return;
    if (S.el) S.el.remove();
    S.R = R;
    var f = 'grayscale(1) invert(1) contrast(1.35) brightness(1.06)';
    var L = S.el = el('div', 'position:absolute;left:0;top:0;width:' + 2 * R + 'px;height:' + 2 * R + 'px;border-radius:50%;z-index:6;pointer-events:none;opacity:0;will-change:transform,opacity;-webkit-backdrop-filter:' + f + ';backdrop-filter:' + f + ';box-shadow:0 0 0 1.5px ' + LT + ',0 22px 50px -18px rgba(0,0,0,.7)', S.c);
    var ring = 'radial-gradient(closest-side,transparent calc(100% - 7px),#000 calc(100% - 6px))';
    S.T = el('div', 'position:absolute;left:-12px;top:-12px;right:-12px;bottom:-12px;border-radius:50%;background:repeating-conic-gradient(rgba(240,138,75,.9) 0deg 1.2deg,rgba(240,138,75,0) 1.2deg 6deg);-webkit-mask:' + ring + ';mask:' + ring, L);
    el('span', 'position:absolute;left:50%;top:50%;width:14px;height:1px;margin:-.5px 0 0 -7px;background:' + LT, L);
    el('span', 'position:absolute;left:50%;top:50%;width:1px;height:14px;margin:-7px 0 0 -.5px;background:' + LT, L);
    var lb = el('span', "position:absolute;left:50%;bottom:12px;transform:translateX(-50%);padding:3px 6px;border-radius:4px;background:rgba(14,12,10,.78);color:#F3EDE6;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;line-height:1;letter-spacing:.08em;white-space:nowrap", L);
    lb.textContent = 'NEG';
  }

  function step(S, dt) {
    var r = !!RMQ.matches, k = r ? 1 : 1 - Math.exp(-dt / 70), ka = r ? 1 : 1 - Math.exp(-dt / (S.on ? 140 : 110));
    S.x += (S.tx - S.x) * k; S.y += (S.ty - S.y) * k; S.a += ((S.on ? 1 : 0) - S.a) * ka;
    if (!r) S.rot += dt * 0.012;
    if (!S.on && S.a < 0.01) { S.a = 0; S.live = false; }
    if (S.el) {
      S.el.style.opacity = S.a.toFixed(3);
      S.el.style.transform = 'translate3d(' + (S.x - S.R).toFixed(1) + 'px,' + (S.y - S.R).toFixed(1) + 'px,0) scale(' + (0.6 + 0.4 * S.a).toFixed(3) + ')';
      if (S.T) S.T.style.transform = 'rotate(' + (S.rot % 360).toFixed(1) + 'deg)';
    }
    return S.live;
  }

  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  function loop(t) {
    raf = 0; var dt = lt ? Math.min(50, Math.max(1, t - lt)) : 16.7, more = false; lt = t;
    for (var i = LS.length - 1; i >= 0; i--) {
      if (!LS[i].c.isConnected) { LS.splice(i, 1); continue; }
      if (LS[i].live && step(LS[i], dt)) more = true;
    }
    if (more) raf = requestAnimationFrame(loop); else lt = 0;
  }

  function scan() { scanT = 0; var q = D.querySelectorAll('[data-xlens]'); for (var i = 0; i < q.length; i++) wire(q[i]); }
  function boot() {
    scan();
    try { new MutationObserver(function () { if (!scanT) scanT = setTimeout(scan, 250); }).observe(D.body, { childList: true, subtree: true }); } catch (e) {}
  }
  if (D.body) boot(); else D.addEventListener('DOMContentLoaded', boot);
  W.RadiantLens = { v: 1, scan: scan };
})();
