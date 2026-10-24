// Radiant language: Spanish when the browser's main language is Spanish, English otherwise, until the visitor
// picks one. The pick lives in localStorage ("radiant-lang", or ?lang=es in the URL) and every page loads this
// file first. In Spanish, English text and labels are swapped for their Spanish version as they render, so the
// pages' own templates and code stay English.
// Elements marked data-lang="en" / data-lang="es" show only in that language; any [data-set-lang] switches it.
(function () {
  if (window.RadiantI18n) return;
  var KEY = 'radiant-lang', d = document.documentElement, nav = navigator.languages || [navigator.language];
  var lang = /^es\b/i.test(nav[0] || '') ? 'es' : 'en';
  var q = /[?&]lang=(en|es)\b/.exec(location.search), saved = null;
  try {
    if (q) localStorage.setItem(KEY, q[1]);
    saved = localStorage.getItem(KEY);
  } catch (e) {}
  if (q) lang = q[1];
  else if (saved === 'es' || saved === 'en') lang = saved;
  d.lang = lang;
  var css = document.createElement('style');
  css.textContent = 'html[lang="es"] [data-lang="en"],html:not([lang="es"]) [data-lang="es"]{display:none!important}';
  (document.head || d).appendChild(css);

  function set(l) {
    if (l !== 'es') l = 'en';
    try { sessionStorage.setItem('radiant-intro-skip', '1'); } catch (e) {}
    var ok = false;
    try { localStorage.setItem(KEY, l); ok = localStorage.getItem(KEY) === l; } catch (e) {}
    var s = location.search.replace(/([?&])lang=(en|es)&?/, '$1').replace(/[?&]$/, '');
    if (!ok) s += (s ? '&' : '?') + 'lang=' + l;
    location.replace(location.pathname + s + location.hash);
  }
  window.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('[data-set-lang]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    set(b.getAttribute('data-set-lang'));
  }, true);

  var key = function (s) { return String(s).replace(/\s+/g, ' ').trim().replace(/[‘’]/g, "'"); };
  var api = window.RadiantI18n = { lang: lang, locale: lang === 'es' ? 'es-US' : undefined, set: set, t: function (s) { return s; } };
  if (lang !== 'es') return;

  // ---- Spanish (Latin American, formal "usted") ----
  var ES = {
    // shared
    'Radiant home': 'Inicio de Radiant',
    'Back to home': 'Volver al inicio',
    'Return to home page': 'Volver a la página de inicio',
    'Analyze an X-ray': 'Analizar una radiografía',
    'Analyze': 'Analizar',
    'Possible fracture': 'Posible fractura',
    'No fracture found': 'No se encontró fractura',
    'Box + heatmap': 'Recuadro + mapa de calor',
    'Box': 'Recuadro',
    'Heatmap': 'Mapa de calor',
    'What to show on the X-ray': 'Qué mostrar en la radiografía',
    'Analyzing…': 'Analizando…',
    'Image added': 'Imagen agregada',
    'Log in': 'Iniciar sesión',
    'Sign out': 'Cerrar sesión',
    'Privacy policy': 'Política de privacidad',
    'Terms of service': 'Términos del servicio',
    'Not a veterinary diagnostic tool. Does not replace evaluation by a qualified veterinarian.': 'No es una herramienta de diagnóstico veterinario. No reemplaza la evaluación de un veterinario calificado.',
    'Radiant is an AI-assisted tool. It is not a veterinary diagnostic tool and does not replace evaluation by a qualified veterinarian.': 'Radiant es una herramienta asistida por IA. No es una herramienta de diagnóstico veterinario y no reemplaza la evaluación de un veterinario calificado.',
    'Not a diagnosis. Always have a veterinarian review the X-ray.': 'No es un diagnóstico. Pida siempre a un veterinario que revise la radiografía.',

    // page titles
    'Radiant — AI fracture check for dog X-rays': 'Radiant — Detección de fracturas con IA en radiografías de perros',
    'Radiant — Insert an X-ray': 'Radiant — Inserte una radiografía',
    'About our Founders · Radiant': 'Sobre nuestros fundadores · Radiant',
    'Log in · Radiant': 'Iniciar sesión · Radiant',
    'Page not found · Radiant': 'Página no encontrada · Radiant',
    'Privacy Policy · Radiant': 'Política de privacidad · Radiant',
    'Terms of Service · Radiant': 'Términos del servicio · Radiant',

    // home: header and hero
    'About the founders': 'Los fundadores',
    'Account': 'Cuenta',
    'Menu': 'Menú',
    'Signed in': 'Sesión iniciada',
    'Saved login on this device': 'Sesión guardada en este dispositivo',
    'Signed in for this session': 'Sesión iniciada solo para esta visita',
    'For dog radiographs': 'Para radiografías de perros',
    'A clearer way to': 'Una forma más clara de',
    'review dog': 'revisar',
    'X-rays.': 'radiografías',
    'Upload a dog X-ray. Radiant\'s AI runs in your browser, flags a possible fracture, boxes where it looked, and shows how confident it is.': 'Suba la radiografía de un perro. La IA de Radiant funciona en su navegador, señala una posible fractura, enmarca la zona que analizó y muestra qué tan segura está.',
    'Analysis complete': 'Análisis completo',
    'Ready': 'Listo',
    'Radiograph: canine forelimb, lateral view': 'Radiografía: miembro anterior canino, vista lateral',
    'Result': 'Resultado',
    'Model confidence': 'Confianza del modelo',
    'Hover the image to review': 'Pase el cursor sobre la imagen',
    'Real output from Radiant\'s model on this X-ray. Hover the image or pick a view.': 'Resultado real del modelo de Radiant en esta radiografía. Pase el cursor sobre la imagen o elija una vista.',
    'Scroll to How it works': 'Ir a Cómo funciona',
    'Scroll': 'Desplazar',

    // home: how it works
    '01 · Process': '01 · Proceso',
    'How it works': 'Cómo funciona',
    'Three steps from an uploaded image to a highlighted region you can inspect, with the model\'s confidence and vote count shown alongside.': 'Tres pasos para pasar de una imagen subida a una zona resaltada que usted puede examinar, junto con la confianza del modelo y el conteo de votos.',
    'Image added · 130 KB · PNG': 'Imagen agregada · 130 KB · PNG',
    'Upload a radiograph': 'Suba una radiografía',
    'A JPG, PNG or WebP of a dog X-ray, up to 20 MB. It\'s analyzed right on your computer.': 'Un archivo JPG, PNG o WebP de la radiografía de un perro, de hasta 20 MB. Se analiza directamente en su computadora.',
    'Runs on your computer ·': 'Se ejecuta en su computadora ·',
    'The model reviews it': 'El modelo la revisa',
    'It checks the image is an X-ray, then the model casts 10 votes on whether there\'s a fracture.': 'Primero comprueba que la imagen sea una radiografía; luego el modelo emite 10 votos sobre si hay una fractura.',
    'confident ·': 'de confianza ·',
    'Review the highlighted area': 'Revise la zona resaltada',
    'See the boxed area and heatmap, the model\'s confidence, and save a PDF report.': 'Vea la zona enmarcada y el mapa de calor, la confianza del modelo, y guarde un informe en PDF.',

    // home: principles, clinic, FAQ, footer
    '02 · Principles': '02 · Principios',
    'Why we built Radiant': 'Por qué creamos Radiant',
    'Dogs can\'t say where it hurts, so radiographs do much of the explaining. Radiant explores how an AI model can point a reviewer toward areas worth a closer look while staying open about its uncertainty.': 'Los perros no pueden decir dónde les duele, así que las radiografías explican gran parte. Radiant explora cómo un modelo de IA puede orientar a quien revisa hacia las zonas que merecen una mirada más atenta, sin ocultar su incertidumbre.',
    'Meet the founders': 'Conozca a los fundadores',
    'Highlights, not diagnoses': 'Resaltados, no diagnósticos',
    'Every result is framed as an area for additional review. Radiant never names a condition.': 'Cada resultado se presenta como una zona que conviene revisar con más detalle. Radiant nunca nombra una afección.',
    'Uncertainty is always shown': 'La incertidumbre siempre está a la vista',
    'Model confidence appears next to every highlight, with a note on what it does and doesn\'t mean.': 'La confianza del modelo aparece junto a cada zona resaltada, con una nota sobre lo que significa y lo que no.',
    'Veterinarians make the call': 'Los veterinarios tienen la última palabra',
    'Radiant supports your review. Clinical decisions belong to qualified professionals.': 'Radiant apoya su revisión. Las decisiones clínicas corresponden a profesionales calificados.',
    '03 · In practice': '03 · En la práctica',
    'Used in a real clinic': 'En uso en una clínica real',
    'Radiant is in use at Alief Animal Hospital, our clinic partner. Their team uses it to review radiographs and says it works really well.': 'Radiant se usa en Alief Animal Hospital, nuestra clínica aliada. Su equipo lo utiliza para revisar radiografías y dice que funciona muy bien.',
    'Visit Alief Animal Hospital': 'Visite Alief Animal Hospital',
    '04 · FAQ': '04 · Preguntas frecuentes',
    'Questions': 'Preguntas',
    'What Radiant does, what it doesn\'t, and how to read its output.': 'Qué hace Radiant, qué no hace y cómo interpretar sus resultados.',
    'Is Radiant a diagnostic tool?': '¿Radiant es una herramienta de diagnóstico?',
    'No. Radiant flags a possible fracture and shows where the model looked and how confident it is, but it does not diagnose. A qualified veterinarian should interpret every radiograph.': 'No. Radiant señala una posible fractura y muestra dónde miró el modelo y qué tan seguro está, pero no hace diagnósticos. Un veterinario calificado debe interpretar cada radiografía.',
    'What images work best?': '¿Qué imágenes funcionan mejor?',
    'Clear JPG, PNG or WebP exports of dog radiographs (up to 20 MB), one view per image, with the anatomy filling most of the frame. Photos taken of a screen or film can work, but they lower image quality.': 'Exportaciones nítidas en JPG, PNG o WebP de radiografías de perros (hasta 20 MB), una vista por imagen, con la anatomía ocupando la mayor parte del encuadre. Las fotos tomadas a una pantalla o a una placa pueden funcionar, pero reducen la calidad de la imagen.',
    'What does the confidence score mean?': '¿Qué significa el nivel de confianza?',
    'It\'s the share of the model\'s 10 votes that agree with its answer: 8 of 10 is 80%. It is not the probability that a fracture is really there, and it can be wrong in either direction.': 'Es la proporción de los 10 votos del modelo que coinciden con su respuesta: 8 de 10 equivale a 80%. No es la probabilidad de que realmente haya una fractura, y puede equivocarse en ambos sentidos.',
    'Why does it say "possible fracture"?': '¿Por qué dice “posible fractura”?',
    'The model can be wrong, so it never says “fracture” outright. The box and heatmap show where to look; the decision stays with the person reviewing the image.': 'El modelo puede equivocarse, por eso nunca afirma “fractura” sin más. El recuadro y el mapa de calor muestran dónde mirar; la decisión queda en manos de quien revisa la imagen.',
    'AI-assisted X-ray analysis for dogs.': 'Análisis de radiografías de perros asistido por IA.',
    'Product': 'Producto',
    'Project': 'Proyecto',
    'About': 'Acerca de',
    'Founders': 'Fundadores',
    'Intro': 'Intro',
    'Sample radiographs: Wikimedia Commons contributors, used under their stated licenses. © 2026 Radiant': 'Radiografías de muestra: colaboradores de Wikimedia Commons, usadas según las licencias indicadas. © 2026 Radiant',

    // intro
    'Press': 'Pulse',
    'space': 'espacio',
    'to continue': 'para continuar',
    'Tap to continue': 'Toque para continuar',
    'Veterinary radiograph review': 'Revisión de radiografías veterinarias',
    'Detector ready': 'Detector listo',
    'Exposing': 'Exponiendo',
    'Exposure complete': 'Exposición completa',
    'Lateral view': 'Vista lateral',
    'Scroll to resize the beam · Click to expose': 'Desplácese para ajustar el haz · Haga clic para exponer',
    'Drag to move the beam': 'Arrastre para mover el haz',
    'Example highlight': 'Zona de ejemplo',

    // founders
    'The people behind the mission': 'Las personas detrás de la misión',
    'Two perspectives. One shared belief in building technology that makes a difference.': 'Dos perspectivas. Una misma convicción: crear tecnología que marque la diferencia.',
    'Scroll to the founders': 'Ir a los fundadores',
    'Photo of Patrick Kim': 'Foto de Patrick Kim',
    'Photo of Edward George Tamas': 'Foto de Edward George Tamas',
    'Co-founder': 'Cofundador',
    'Peddie School · Class of \'29': 'Peddie School · Promoción 2029',
    'Machine Learning & Technology': 'Aprendizaje automático y tecnología',
    'Patrick is passionate about machine learning and coding, and is currently taking Stanford\'s CS229 Machine Learning course. He believes in the power of technology to solve meaningful problems and hopes to make a positive impact on the world through innovation.': 'A Patrick le apasionan el aprendizaje automático y la programación, y actualmente cursa CS229 Machine Learning de Stanford. Cree en el poder de la tecnología para resolver problemas importantes y espera tener un impacto positivo en el mundo a través de la innovación.',
    'Coding': 'Programación',
    'Machine Learning': 'Aprendizaje automático',
    'Innovation': 'Innovación',
    'Business & Computer Science': 'Negocios y ciencias de la computación',
    'George is passionate about business and computer science, with a vision of creating a world where pet ownership doesn\'t come with financial barriers. He believes technology and innovative business ideas can help make essential pet care more accessible and affordable for every pet owner.': 'A George le apasionan los negocios y las ciencias de la computación, con la visión de crear un mundo en el que tener una mascota no implique barreras económicas. Cree que la tecnología y las ideas de negocio innovadoras pueden hacer que el cuidado esencial de las mascotas sea más accesible y asequible para todos sus dueños.',
    'Pet Owners': 'Dueños de mascotas',
    'Accessibility': 'Accesibilidad',
    'Entrepreneurship': 'Emprendimiento',
    'Our Shared Vision': 'Nuestra visión compartida',
    'Continue': 'Continuar',
    'Upload a dog X-ray and see whether the model flags a possible fracture.': 'Suba la radiografía de un perro y vea si el modelo señala una posible fractura.',
    'Return to the Radiant overview.': 'Regrese a la presentación de Radiant.',

    // login
    'Log in or sign up': 'Iniciar sesión o registrarse',
    'Sign up': 'Registrarse',
    'Welcome back': 'Hola de nuevo',
    'Welcome back,': 'Hola de nuevo,',
    'Welcome,': 'Hola,',
    'Log in with your Google account to continue to Radiant.': 'Inicie sesión con su cuenta de Google para continuar en Radiant.',
    'Create your account': 'Cree su cuenta',
    'Sign up with your Google account to start reviewing radiographs.': 'Regístrese con su cuenta de Google para empezar a revisar radiografías.',
    'Sign in with Google': 'Iniciar sesión con Google',
    'Sign up with Google': 'Registrarse con Google',
    'Google sign-in isn\'t connected yet': 'El inicio de sesión con Google aún no está conectado',
    'Add a Google OAuth client ID to turn it on. Until then, you can look around with a demo account.': 'Agregue un ID de cliente OAuth de Google para activarlo. Mientras tanto, puede explorar con una cuenta de demostración.',
    'Use a demo account': 'Usar una cuenta de demostración',
    'Couldn\'t reach Google': 'No se pudo conectar con Google',
    'Check your connection, then reload this page.': 'Revise su conexión y vuelva a cargar esta página.',
    'That sign-in didn\'t go through': 'No se pudo completar el inicio de sesión',
    'Please try again.': 'Inténtelo de nuevo.',
    'Keep me signed in on this device': 'Mantener la sesión iniciada en este dispositivo',
    'Radiant will remember you on this device for 30 days.': 'Radiant recordará su sesión en este dispositivo durante 30 días.',
    'Radiant asks Google for your name, email and photo, plus a private app folder in your Drive to back up your scans.': 'Radiant solicita a Google su nombre, correo electrónico y foto, además de una carpeta privada de la aplicación en su Drive para respaldar sus escaneos.',
    'Continue as': 'Continuar como',
    'Not you? Use a different account': '¿No es usted? Use otra cuenta',
    'Opening Radiant…': 'Abriendo Radiant…',
    'Guest': 'Visitante',
    'Demo account': 'Cuenta de demostración',

    // analyze
    'Drag in a JPG, PNG or WebP of a dog radiograph, or browse your files. It\'s analyzed right in your browser.': 'Arrastre un JPG, PNG o WebP de la radiografía de un perro, o busque en sus archivos. Se analiza directamente en su navegador.',
    'Every X-ray you\'ve inserted on this account. Open one to view it full size, download it or load it back into the scanner.': 'Todas las radiografías que ha insertado en esta cuenta. Abra una para verla en tamaño completo, descargarla o volver a cargarla en el escáner.',
    'Scanner views': 'Vistas del escáner',
    'New scan': 'Nuevo escaneo',
    'Previous scans': 'Escaneos anteriores',
    'Insert an X-ray image': 'Insertar una imagen de radiografía',
    'Drop to insert': 'Suelte para insertar',
    'Add an X-ray': 'Agregar una radiografía',
    'Drag an X-ray here': 'Arrastre una radiografía aquí',
    'or': 'o',
    'Browse files': 'Buscar archivos',
    'That file isn\'t an image. Choose a JPG, PNG or WebP.': 'Ese archivo no es una imagen. Elija un JPG, PNG o WebP.',
    'That image is over 20 MB. Try a smaller export.': 'Esa imagen pesa más de 20 MB. Pruebe con una exportación más pequeña.',
    'Inserted radiograph': 'Radiografía insertada',
    'Saved to Previous scans': 'Guardada en Escaneos anteriores',
    'Replace': 'Reemplazar',
    'Remove': 'Quitar',
    'Analyze again': 'Analizar de nuevo',
    'Loading the model (about 300 MB the first time, then cached)…': 'Cargando el modelo (unos 300 MB la primera vez; después queda guardado)…',
    'Analyzing… this runs on your computer and can take 10–30 seconds.': 'Analizando… se ejecuta en su computadora y puede tardar entre 10 y 30 segundos.',
    'Model ready. The analysis runs right here in your browser.': 'Modelo listo. El análisis se realiza aquí mismo, en su navegador.',
    'Still run': 'Analizar de todos modos',
    'Preparing PDF…': 'Preparando PDF…',
    'PDF failed, try again': 'No se pudo crear el PDF; inténtelo de nuevo',
    'Download PDF report': 'Descargar informe PDF',
    'One view per image': 'Una vista por imagen',
    'Upload each projection as its own file.': 'Suba cada proyección como un archivo independiente.',
    'Fill the frame': 'Llene el encuadre',
    'Crop so the anatomy takes up most of the image.': 'Recorte para que la anatomía ocupe la mayor parte de la imagen.',
    'Export, don\'t photograph': 'Exporte, no fotografíe',
    'Photos of a screen or film lower image quality.': 'Las fotos de una pantalla o de una placa reducen la calidad de la imagen.',
    'Drive backup is off. Turn it on to see your scans on any device you sign in on.': 'La copia de seguridad en Drive está desactivada. Actívela para ver sus escaneos en cualquier dispositivo donde inicie sesión.',
    'Your scans back up to your Google Drive automatically and show up on any device you sign in on.': 'Sus escaneos se respaldan automáticamente en su Google Drive y aparecen en cualquier dispositivo donde inicie sesión.',
    'Syncing…': 'Sincronizando…',
    'Sync now': 'Sincronizar ahora',
    'Turn on backup': 'Activar respaldo',
    'Reconnect': 'Volver a conectar',
    'Still loading, try again.': 'Aún se está cargando; inténtelo de nuevo.',
    'Drive wasn\'t allowed.': 'No se permitió el acceso a Drive.',
    'Sign in to keep your scans': 'Inicie sesión para conservar sus escaneos',
    'Your scans are saved in this browser under your account.': 'Sus escaneos se guardan en este navegador, en su cuenta.',
    'No scans yet': 'Aún no hay escaneos',
    'X-rays you insert while signed in are saved here, so you can open them again later.': 'Las radiografías que inserte con la sesión iniciada se guardan aquí para que pueda abrirlas más tarde.',
    'Insert an X-ray': 'Insertar una radiografía',
    'Search by file name': 'Buscar por nombre de archivo',
    'Search your scans': 'Buscar en sus escaneos',
    'Clear search': 'Borrar búsqueda',
    'Newest first': 'Más recientes primero',
    'Oldest first': 'Más antiguos primero',
    'Saved for this visit only. This browser is blocking storage.': 'Guardado solo durante esta visita. Este navegador está bloqueando el almacenamiento.',
    'No scans match “': 'Ningún escaneo coincide con “',
    'Today': 'Hoy',
    'Yesterday': 'Ayer',
    'Past 7 days': 'Últimos 7 días',
    'View': 'Ver',
    'Previous scan': 'Escaneo anterior',
    'Next scan': 'Escaneo siguiente',
    'Scan': 'Escaneo',
    'Dimensions': 'Dimensiones',
    'File size': 'Tamaño del archivo',
    'Format': 'Formato',
    'Open in scanner': 'Abrir en el escáner',
    'Download': 'Descargar',
    'Delete scan': 'Eliminar escaneo',
    'Delete this scan? It will be removed everywhere it\'s saved.': '¿Eliminar este escaneo? Se borrará de todos los lugares donde esté guardado.',
    'Cancel': 'Cancelar',
    'Delete': 'Eliminar',
    '← → to browse · Esc to close': '← → para navegar · Esc para cerrar',
    'Close viewer': 'Cerrar visor',

    // 404
    'Nothing on this film.': 'Nada en esta placa.',
    'The page you\'re looking for doesn\'t exist or has moved.': 'La página que busca no existe o se ha movido.',
    'Back to Radiant': 'Volver a Radiant',
    'Move to scan': 'Mueva el cursor para escanear',
    'Tap to scan': 'Toque para escanear'
  };
  var votes = function (v) { return String(v).replace(/^(\d+) of (\d+)$/, '$1 de $2'); };
  var at = function (time) { return (/^1:/.test(time) ? 'a la ' : 'a las ') + time; };
  // Strings the pages build from parts (numbers, names, dates).
  var PAT = [
    [/^(\d+)% · (\d+) of (\d+) votes$/, '$1% · $2 de $3 votos'],
    [/^(\d+) of (\d+) votes for fracture$/, '$1 de $2 votos a favor de fractura'],
    [/^Welcome back, (.+)$/, function (m, n) { return 'Hola de nuevo, ' + (ES[key(n)] || n); }],
    [/^Welcome, (.+)$/, function (m, n) { return 'Hola, ' + (ES[key(n)] || n); }],
    [/^Continue as (.+)$/, function (m, n) { return 'Continuar como ' + (ES[key(n)] || n); }],
    [/^JPG, PNG or WebP · up to 20 MB(?: · or paste with (.+))?$/, function (m, k) { return 'JPG, PNG o WebP · hasta 20 MB' + (k ? ' · o pegue con ' + k : ''); }],
    [/^Could not load the model: (.*)$/, 'No se pudo cargar el modelo: $1'],
    [/^Done in ([\d.]+) s\.$/, 'Listo en $1 s.'],
    [/^We believe this isn't an X-ray \(X-ray chance (\d+)%\)\. Still run\?$/, 'Creemos que esto no es una radiografía (probabilidad de radiografía: $1%). ¿Analizarla de todos modos?'],
    [/^(\d+)% confident · (.+?) votes for fracture( · X-ray check skipped)?$/, function (m, c, v, s) { return c + '% de confianza · ' + votes(v) + ' votos a favor de fractura' + (s ? ' · verificación de radiografía omitida' : ''); }],
    [/^The model failed on this image: (.*)$/, 'El modelo falló con esta imagen: $1'],
    [/^Sync failed: (.*)$/, function (m, e) { return 'Falló la sincronización: ' + (ES[key(e)] || e); }],
    [/^Pick (.+) in the Google popup\.$/, 'Elija $1 en la ventana de Google.'],
    [/^(\d+) of (\d+) scans$/, '$1 de $2 escaneos'],
    [/^1 scan$/, '1 escaneo'],
    [/^(\d+) scans$/, '$1 escaneos'],
    [/^Private to (.+?)( · backed up to your Google Drive| on this device)$/, function (m, w, how) { return 'Visible solo para ' + (w === 'your account' ? 'su cuenta' : ES[key(w)] || w) + (how === ' on this device' ? ' en este dispositivo' : ' · con respaldo en su Google Drive'); }],
    [/^View (.+)$/, 'Ver $1'],
    [/^Scan (.+)$/, 'Escaneo $1'],
    [/^Scanned (.+) at (.+)$/, function (m, day, time) { return 'Escaneado el ' + day + ' ' + at(time); }],
    [/^([a-zñáéíóú]+)( de \d{4})$/, function (m, mo, y) { return mo.charAt(0).toUpperCase() + mo.slice(1) + y; }]
  ];
  // Headlines animated word by word (or letter by letter): the Spanish words go into the same slots, in order.
  var SEQ = {
    'Return to home page': 'Volver al inicio',
    'Back to home': 'Volver al inicio',
    'About our Founders': 'Sobre nuestros fundadores',
    'Insert an X-ray.': 'Inserte una radiografía.',
    'Previous scans.': 'Escaneos anteriores.',
    'We believe technology should do more than solve technical problems. It should make everyday life better, remove unnecessary barriers, and create opportunities for people and the communities they care about.':
      'Creemos que la tecnología debe hacer más que resolver problemas técnicos. Debe mejorar la vida cotidiana, eliminar barreras innecesarias y crear oportunidades para las personas y comunidades que les importan.'
  };
  var es = {};
  for (var k in ES) es[key(k)] = ES[k];
  ES = es;

  function t(s) {
    if (s == null) return s;
    var raw = String(s), k = key(raw);
    if (!k || !/[A-Za-z]/.test(k)) return raw;
    var r = ES[k];
    if (r == null) for (var i = 0; i < PAT.length; i++) if (PAT[i][0].test(k)) { r = k.replace(PAT[i][0], PAT[i][1]); break; }
    if (r == null) return raw;
    var m = /^(\s*)[\s\S]*?(\s*)$/.exec(raw);
    return m[1] + r + m[2];
  }
  api.t = t;

  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt', 'data-touch'];
  var SKIP = /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT|CODE|X-DC|SC-HELMET)$/;
  var WORD = '[data-word],[data-vw],[data-ch]';
  var off = function (el) { return SKIP.test(el.nodeName) || el.hasAttribute('data-lang') || el.getAttribute('translate') === 'no'; };
  var outside = function (el) { return !el || el.nodeType !== 1 || !!el.closest('script,style,textarea,noscript,code,x-dc,[data-lang],[translate="no"]'); };

  function words(el) {
    var ch = el.hasAttribute('data-ch'), box = ch ? el.parentNode : el.parentNode && el.parentNode.closest('h1,h2,p');
    if (!box) return;
    var ws = box.querySelectorAll(ch ? '[data-ch]' : '[data-word],[data-vw]'), en = [];
    for (var i = 0; i < ws.length; i++) en.push(ch ? ws[i].textContent.replace(/\u00a0/g, ' ') || ' ' : key(ws[i].textContent));
    var sp = SEQ[key(en.join(ch ? '' : ' '))];
    if (!sp) return;
    var sep = ch ? '' : ' ';
    sp = ch ? sp.replace(/ /g, '\u00a0').split('') : sp.split(' ');
    for (var j = 0; j < ws.length; j++) {
      var w = j === ws.length - 1 ? sp.slice(j).join(sep) : (sp[j] || ''), tn = ws[j].firstChild;
      while (tn && tn.nodeType !== 3) tn = tn.nextSibling;
      if (tn) tn.nodeValue = w; else ws[j].textContent = w;
      if (ch && w.trim()) ws[j].style.width = '';   // a page may have sized the English space slots
    }
  }
  function text(n) {
    var v = n.nodeValue, p = n.parentNode;
    if (!v || !p || p.nodeType !== 1 || !/[A-Za-z]/.test(v)) return;
    if (p.matches(WORD)) return words(p);
    var r = t(v);
    if (r !== v) n.nodeValue = r;
  }
  function attr(el, a) {
    var v = el.getAttribute(a);
    if (!v) return;
    var r = t(v);
    if (r !== v) el.setAttribute(a, r);
  }
  function attrs(el) { for (var i = 0; i < ATTRS.length; i++) attr(el, ATTRS[i]); }
  var filter = { acceptNode: function (n) { return n.nodeType === 1 && off(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } };
  function walk(root) {
    if (root.nodeType === 3) { if (!outside(root.parentNode)) text(root); return; }
    if (root.nodeType !== 1 || outside(root)) return;
    attrs(root);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, filter), n;
    while ((n = tw.nextNode())) { if (n.nodeType === 3) text(n); else attrs(n); }
  }
  new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i];
      if (m.type === 'characterData') { if (!outside(m.target.parentNode)) text(m.target); }
      else if (m.type === 'attributes') { if (!outside(m.target)) attr(m.target, m.attributeName); }
      else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
    }
  }).observe(d, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { walk(d); });
  walk(d);
})();
