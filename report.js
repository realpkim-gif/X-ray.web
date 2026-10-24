// Radiant report: one US Letter page drawn on a canvas in the site's type, wrapped in a PDF by hand (no libraries).
(function () {
  if (window.RadiantReport) return;
  var INK = '#1A1612', BODY = '#4A433C', MUTE = '#6E665E', LINE = '#E2DBD2', OR = '#E0641C', ORD = '#C9551A', FILM = '#0B0A09';
  var SANS = "'Hanken Grotesk',system-ui,sans-serif", MONO = "'IBM Plex Mono',ui-monospace,monospace";
  var PW = 850, PH = 1100, K = 2, M = 60, CW = PW - 2 * M;   // 8.5 x 11 in at 100 px/in, drawn at 200 dpi
  // Every word printed on the page, in English and Spanish; the report follows the site's language.
  var W = window.RadiantI18n && RadiantI18n.lang === 'es' ? {
    disclaimer: 'Radiant es una herramienta asistida por IA. No es una herramienta de diagn\u00f3stico veterinario y no reemplaza la evaluaci\u00f3n de un veterinario calificado.',
    qa: [
      ['\u00bfQu\u00e9 significa el nivel de confianza?', 'Es la proporci\u00f3n de los 10 votos del modelo que coinciden con su respuesta: 8 de 10 equivale a 80%. No es la probabilidad de que realmente haya una fractura, y puede equivocarse en ambos sentidos.'],
      ['\u00bfPor qu\u00e9 \u201cposible fractura\u201d?', 'El modelo puede equivocarse, por eso nunca afirma \u201cfractura\u201d sin m\u00e1s. El recuadro y el mapa de calor muestran d\u00f3nde mirar; la decisi\u00f3n queda en manos de quien revisa la imagen.']
    ],
    locale: 'es-US', report: 'INFORME DE AN\u00c1LISIS', title: 'An\u00e1lisis radiogr\u00e1fico', run: 'an\u00e1lisis del modelo: ', xray: 'RADIOGRAF\u00cdA',
    both: 'RECUADRO + MAPA DE CALOR', box: 'RECUADRO', heat: 'MAPA DE CALOR', none: 'SIN ZONA MARCADA',
    result: 'RESULTADO', conf: 'CONFIANZA', votes: 'VOTOS DEL MODELO', of: ' de ', skipped: 'Verificaci\u00f3n de radiograf\u00eda omitida', forFx: 'a favor de fractura',
    fx: 'Posible fractura', noFx: 'No se encontr\u00f3 fractura', file: 'informe-radiant-', pdfTitle: 'Informe de an\\341lisis de Radiant'   // \341 = \u00e1 in PDFDocEncoding
  } : {
    disclaimer: 'Radiant is an AI-assisted tool. It is not a veterinary diagnostic tool and does not replace evaluation by a qualified veterinarian.',
    qa: [
      ['What does the confidence score mean?', 'It\u2019s the share of the model\u2019s 10 votes that agree with its answer: 8 of 10 is 80%. It is not the probability that a fracture is really there, and it can be wrong in either direction.'],
      ['Why \u201cpossible fracture\u201d?', 'The model can be wrong, so it never says \u201cfracture\u201d outright. The box and heatmap show where to look; the decision stays with the person reviewing the image.']
    ],
    locale: 'en-US', report: 'ANALYSIS REPORT', title: 'Radiograph analysis', run: 'model run ', xray: 'X-RAY',
    both: 'BOX + HEATMAP', box: 'BOX', heat: 'HEATMAP', none: 'NO AREA MARKED',
    result: 'RESULT', conf: 'CONFIDENCE', votes: 'MODEL VOTES', of: ' of ', skipped: 'X-ray check skipped', forFx: 'for fracture',
    fx: 'Possible fracture', noFx: 'No fracture found', file: 'radiant-report-', pdfTitle: 'Radiant analysis report'
  };

  function load(src) {
    return new Promise(function (ok, no) {
      if (!src) { ok(null); return; }
      var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { no(new Error('Could not read the image')); }; i.src = src;
    });
  }
  function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function wrap(c, s, w) {
    var out = [], cur = '';
    s.split(/\s+/).forEach(function (wd) { var t = cur ? cur + ' ' + wd : wd; if (cur && c.measureText(t).width > w) { out.push(cur); cur = wd; } else cur = t; });
    if (cur) out.push(cur); return out;
  }
  function clip(c, s, w) { if (c.measureText(s).width <= w) return s; while (s.length > 1 && c.measureText(s + '\u2026').width > w) s = s.slice(0, -1); return s + '\u2026'; }
  function label(c, s, x, y) { c.font = '500 10.5px ' + MONO; c.fillStyle = MUTE; c.fillText(s, x, y); }
  function logo(c, x, y, s) {
    c.save(); c.fillStyle = OR; rr(c, x, y, s, s, s * 9 / 32); c.fill();
    c.translate(x + s / 2, y + s / 2); c.scale(s * 20 / 32 / 24, s * 20 / 32 / 24); c.rotate(-Math.PI / 4); c.translate(-12, -12);
    c.fillStyle = '#fff'; rr(c, 7, 10.2, 10, 3.6, 1); c.fill();
    [[7, 9.9], [7, 14.1], [17, 9.9], [17, 14.1]].forEach(function (p) { c.beginPath(); c.arc(p[0], p[1], 2.3, 0, Math.PI * 2); c.fill(); });
    c.restore();
  }
  function shield(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s / 24, s / 24);
    c.strokeStyle = ORD; c.lineWidth = 1.9; c.lineCap = 'round'; c.lineJoin = 'round';
    try { c.stroke(new Path2D('M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z')); c.stroke(new Path2D('M12 8v5M12 16h.01')); } catch (e) {}
    c.restore();
  }
  // A dark film panel with the given layers stacked and fitted inside.
  function panel(c, x, y, w, h, layers) {
    c.save(); rr(c, x, y, w, h, 12); c.fillStyle = FILM; c.fill(); c.clip();
    var base = layers[0], p = 10, iw = base.naturalWidth, ih = base.naturalHeight, s = Math.min((w - 2 * p) / iw, (h - 2 * p) / ih);
    var dw = iw * s, dh = ih * s, dx = x + (w - dw) / 2, dy = y + (h - dh) / 2;
    c.imageSmoothingQuality = 'high';
    layers.forEach(function (im) { if (im) c.drawImage(im, dx, dy, dw, dh); });
    c.restore();
  }

  async function draw(o) {
    try {
      var F = document.fonts;
      await Promise.all(['400', '500', '600', '700'].map(function (w) { return F.load(w + ' 16px "Hanken Grotesk"'); }).concat(['400', '500'].map(function (w) { return F.load(w + ' 12px "IBM Plex Mono"'); })));
    } catch (e) {}
    var I = await Promise.all([load(o.xray), load(o.heat), load(o.box)]), X = I[0], H = I[1], Bx = I[2];
    if (!X) throw new Error('No X-ray to put in the report');
    var cv = document.createElement('canvas'); cv.width = PW * K; cv.height = PH * K;
    var c = cv.getContext('2d'); c.scale(K, K);
    c.fillStyle = '#fff'; c.fillRect(0, 0, PW, PH);
    c.textBaseline = 'alphabetic';
    var when = o.when || new Date();
    var day = when.toLocaleDateString(W.locale, { month: 'short', day: 'numeric', year: 'numeric' }), clock = when.toLocaleTimeString(W.locale, { hour: 'numeric', minute: '2-digit' });

    logo(c, M, 48, 30);
    c.fillStyle = INK; c.font = '700 20px ' + SANS; c.fillText('Radiant', M + 42, 70);
    c.textAlign = 'right';
    c.font = '500 10.5px ' + MONO; c.fillStyle = ORD; c.fillText(W.report, PW - M, 59);
    c.font = '400 10.5px ' + MONO; c.fillStyle = MUTE; c.fillText(day + ' \u00b7 ' + clock, PW - M, 75);
    c.textAlign = 'left';
    c.fillStyle = LINE; c.fillRect(M, 98, CW, 1);

    c.fillStyle = INK; c.font = '700 34px ' + SANS; c.fillText(W.title, M, 150);
    c.font = '400 11.5px ' + MONO; c.fillStyle = MUTE;
    var tail = [o.dims, o.secs ? W.run + o.secs + ' s' : ''].filter(Boolean).join('  \u00b7  ');
    var tailW = tail ? c.measureText('  \u00b7  ' + tail).width : 0;
    c.fillText(clip(c, o.fileName || 'X-ray', CW - tailW) + (tail ? '  \u00b7  ' + tail : ''), M, 174);

    // X-ray on the left, the same X-ray with what the viewer was showing on the right.
    var showHeat = o.view !== 'box' && !!H, showBox = o.view !== 'heatmap' && !!Bx;
    var cap = showBox && showHeat ? W.both : showBox ? W.box : showHeat ? W.heat : W.none;
    var top = 204, gap = 20, pw = (CW - gap) / 2, ar = X.naturalWidth / X.naturalHeight;
    var ph = Math.max(180, Math.min(380, (pw - 20) / ar + 20));
    label(c, W.xray, M, top + 10); label(c, cap, M + pw + gap, top + 10);
    panel(c, M, top + 22, pw, ph, [X]);
    panel(c, M + pw + gap, top + 22, pw, ph, [X, showHeat ? H : null, showBox ? Bx : null]);

    var ry = top + 22 + ph + 46, c1 = Math.round(CW * 0.4), c2 = Math.round(CW * 0.3), conf = Math.max(0, Math.min(1, +o.confidence || 0));
    var vm = /^(\d+)\s+of\s+(\d+)$/.exec(o.votes || '');
    label(c, W.result, M, ry); label(c, W.conf, M + c1, ry); label(c, W.votes, M + c1 + c2, ry);
    var ans = o.answer === 'fracture' ? W.fx : o.answer ? W.noFx : (o.answerText || ''), fs = 24;
    do { c.font = '700 ' + fs + 'px ' + SANS; } while (c.measureText(ans).width > c1 - 16 && --fs > 16);
    c.fillStyle = o.answer === 'fracture' ? ORD : INK; c.fillText(ans, M, ry + 34);
    c.font = '700 24px ' + SANS; c.fillStyle = INK; c.fillText(Math.round(conf * 100) + '%', M + c1, ry + 34);
    c.fillText(vm ? vm[1] + W.of + vm[2] : (o.votes || '\u2013'), M + c1 + c2, ry + 34);
    var bw = c2 - 44; c.fillStyle = '#EFEAE3'; rr(c, M + c1, ry + 48, bw, 5, 2.5); c.fill();
    if (conf > 0) { c.fillStyle = OR; rr(c, M + c1, ry + 48, Math.max(5, bw * conf), 5, 2.5); c.fill(); }
    c.font = '400 13px ' + SANS; c.fillStyle = MUTE;
    if (o.gateSkipped) c.fillText(W.skipped, M, ry + 56);
    c.fillText(W.forFx, M + c1 + c2, ry + 56);

    var qy = ry + 122, qw = (CW - 36) / 2, qEnd = qy;
    c.fillStyle = LINE; c.fillRect(M, ry + 84, CW, 1);
    W.qa.forEach(function (q, i) {
      var x = M + i * (qw + 36), y = qy;
      c.font = '600 14px ' + SANS; c.fillStyle = INK;
      wrap(c, q[0], qw).forEach(function (l) { c.fillText(l, x, y); y += 20; });
      y += 4; c.font = '400 13px ' + SANS; c.fillStyle = BODY;
      wrap(c, q[1], qw).forEach(function (l) { c.fillText(l, x, y); y += 20; });
      qEnd = Math.max(qEnd, y);
    });

    var dh = 78, dy = Math.min(PH - 176, qEnd + 30);
    rr(c, M, dy, CW, dh, 14); c.fillStyle = '#FBF0E8'; c.fill();
    c.beginPath(); c.arc(M + 40, dy + dh / 2, 18, 0, Math.PI * 2); c.fillStyle = '#F6E4D7'; c.fill();
    shield(c, M + 31, dy + dh / 2 - 9, 18);
    c.font = '400 13.5px ' + SANS; c.fillStyle = INK;
    var dl = wrap(c, W.disclaimer, CW - 100), ly = dy + dh / 2 - (dl.length - 1) * 10 + 5;
    dl.forEach(function (l) { c.fillText(l, M + 76, ly); ly += 20; });

    c.fillStyle = LINE; c.fillRect(M, PH - 70, CW, 1);
    c.font = '400 10.5px ' + MONO; c.fillStyle = MUTE;
    c.fillText(o.site || '', M, PH - 46);
    c.textAlign = 'right'; c.fillText('\u00a9 ' + when.getFullYear() + ' Radiant', PW - M, PH - 46); c.textAlign = 'left';
    return cv;
  }

  // Minimal PDF 1.4: one page, the report as a full-page JPEG.
  async function pdf(cv) {
    var blob = await new Promise(function (ok) { cv.toBlob(ok, 'image/jpeg', 0.93); });
    if (!blob) throw new Error('Could not encode the report');
    var jpg = new Uint8Array(await blob.arrayBuffer()), enc = new TextEncoder(), parts = [], offs = [], len = 0;
    var put = function (x) { var b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); len += b.length; };
    var obj = function (n, body) { offs[n] = len; put(n + ' 0 obj\n'); body(); put('\nendobj\n'); };
    var w = 612, h = 792, cs = 'q ' + w + ' 0 0 ' + h + ' 0 0 cm /Im0 Do Q';
    put('%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n');
    obj(1, function () { put('<< /Type /Catalog /Pages 2 0 R >>'); });
    obj(2, function () { put('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'); });
    obj(3, function () { put('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + w + ' ' + h + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'); });
    obj(4, function () { put('<< /Type /XObject /Subtype /Image /Width ' + cv.width + ' /Height ' + cv.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpg.length + ' >>\nstream\n'); put(jpg); put('\nendstream'); });
    obj(5, function () { put('<< /Length ' + cs.length + ' >>\nstream\n' + cs + '\nendstream'); });
    obj(6, function () { put('<< /Title (' + W.pdfTitle + ') /Producer (Radiant) >>'); });
    var xref = len, x = 'xref\n0 7\n0000000000 65535 f \n';
    for (var i = 1; i <= 6; i++) x += String(offs[i]).padStart(10, '0') + ' 00000 n \n';
    put(x + 'trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
    return new Blob(parts, { type: 'application/pdf' });
  }

  function save(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = u; a.download = name; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
  }

  window.RadiantReport = {
    v: 1, draw: draw, pdf: pdf,
    make: async function (o) {
      o = o || {}; o.when = o.when || new Date();
      if (!o.site) o.site = (location.host + location.pathname.replace(/[^\/]*$/, '')).replace(/\/$/, '');
      var blob = await pdf(await draw(o));
      var slug = String(o.fileName || 'x-ray').replace(/\.[a-z0-9]+$/i, '').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'x-ray';
      var d = o.when, ymd = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      save(blob, W.file + slug + '-' + ymd + '.pdf');
      return blob;
    }
  };
})();
