/* Yo Soy Veedor — Vibras Positivas HM
   Consulta en vivo el SECOP II (datos.gov.co, dataset jbjy-vk9h) para cualquier municipio,
   y lee los datos que deja el robot de GitHub Actions en data/ (resumen nacional y noticias). */
(() => {
'use strict';

const CFG = {
  api: 'https://www.datos.gov.co/resource/jbjy-vk9h.json',
  appUrl: 'https://yo-soy-veedor.netlify.app/',
  tz: 'America/Bogota',
  pageSize: 20,
  anios: 2,
  defDepto: 'Antioquia', defMuni: 'Caucasia',
  cgr: 'cgr@contraloria.gov.co',
  pgn: 'quejas@procuraduria.gov.co'
};

/* ---------- Idioma ---------- */
const T = {
  es: {
    veeduria:'Veeduría ciudadana', kicker:'Colombia · SECOP II en vivo',
    lead:'Tus impuestos tienen dueño: tú. Mira en vivo los contratos de tu municipio, adopta uno, regístrate como veedor en el SECOP II y exige cuentas cuando algo no cuadre.',
    refresh:'Actualizar ahora', irMunicipio:'Contratos de mi municipio', irRegistro:'Cómo registrarme',
    hoy:'Hoy', grandes:'Los contratos más grandes firmados en Colombia en los últimos días', desliza:'Desliza',
    p1:'Mira', p1s:'Busca los contratos de tu municipio. No necesitas registrarte.',
    p2:'Adopta', p2s:'Escoge una obra de tu barrio y síguela de cerca.',
    p3:'Regístrate', p3s:'Crea tu cuenta de veedor en el SECOP II y opina en los procesos.',
    p4:'Exige', p4s:'Si algo no cuadra, manda el derecho de petición a todos los entes de una vez.',
    tuMunicipio:'Los contratos de tu municipio', compartirMuni:'Compartir este municipio',
    buscar:'Busca por obra, contratista, NIT, entidad o número…',
    oRiesgo:'Más alertas primero', oValor:'Más plata primero', oFin:'Vencimiento más cercano', oFirma:'Más recientes',
    sAbiertos:'contratos sin terminar', sValor:'en juego', sVencidos:'ya vencieron y siguen abiertos', sAlertas:'con alguna alerta',
    verMas:'Ver más', topContratistas:'¿Quién se lleva más contratos aquí?',
    campana:'Campaña', adoptaT:'Adopta un contrato',
    adoptaP:'Un ciudadano, un contrato. Escoge una obra de tu barrio, dale "Adoptar" y la app te avisa cada vez que cambie la plata pagada, el plazo o el estado. Ve a la obra, toma fotos y compara con lo que dice el contrato.',
    invitar:'Invitar a otros a adoptar uno',
    sinAdoptados:'Todavía no has adoptado ningún contrato. Abre uno de la lista y toca "Adoptar este contrato".',
    adoptar:'Adoptar este contrato', adoptado:'Adoptado: lo estás siguiendo', soltar:'Dejar de seguir',
    adoptadoToast:'Listo, lo estás siguiendo. Te avisamos aquí si cambia.', desde:'Adoptado el {f}',
    chgPago:'Pagado: {a} → {b}', chgDias:'Prórroga: {a} → {b} días', chgEstado:'Estado: {a} → {b}', sinCambios:'Sin cambios desde que lo adoptaste.',
    otroMuni:'De otro municipio: cámbialo arriba para ver si hubo cambios.',
    regT:'Regístrate como veedor en el SECOP II',
    regIntro:'Para mirar contratos no hace falta cuenta. Con cuenta de veedor puedes suscribirte a los procesos, recibir sus avisos y hacer observaciones a los documentos. El registro es gratis y se hace con una cuenta de tipo Proveedor.',
    abrirSecop:'Abrir el registro del SECOP II', guiaOficial:'Guía oficial de Colombia Compra (PDF)',
    regAyuda:'¿Te trabaste? Mesa de servicio del SECOP II: (601) 745 6788. Atención al ciudadano de Colombia Compra Eficiente: (601) 795 6600.',
    semT:'El semáforo: qué mirar en un contrato',
    exigirT:'Cómo exigir cuentas',
    cuidadoT:'Muestra datos, no acusaciones',
    cuidadoP:'Una alerta no prueba un delito: a veces la entidad solo no ha subido los pagos o la prórroga tiene una razón válida. Pregunta con los datos en la mano ("este contrato lleva tres prórrogas, ¿por qué?") y deja que los entes de control investiguen. Así te proteges de demandas y la veeduría gana credibilidad.',
    noticias:'En las noticias',
    riegaT:'Riega la idea', riegaP:'Mientras más ciudadanos miren, más difícil es robarse la plata de todos. Comparte la app con tu familia, tu junta de acción comunal y el grupo del colegio.',
    compartirApp:'Compartir la app', waApp:'Enviar por WhatsApp',
    fuente:'Fuente: SECOP II – Contratos Electrónicos, datos abiertos de Colombia Compra Eficiente (datos.gov.co). La app no inventa ni modifica datos: muestra lo que las entidades publican.',
    cerrar:'Cerrar',
    cargando:'Consultando el SECOP en vivo…', vivo:'En vivo desde el SECOP · {h}', error:'El SECOP no respondió. Revisa tu conexión y toca Actualizar.',
    cargandoMuni:'Trayendo los contratos de {m}…',
    cTodos:'Sin terminar', cAlertas:'Con alertas', cVencido:'Vencidos', cProrroga:'Prorrogados', cDirecta:'Contratación directa', cObra:'Obras', cAdoptados:'Adoptados', cHistorial:'Todos (incluye terminados)',
    conteo:'{n} contratos · {v}', sinResultados:'No hay contratos con ese filtro.',
    vence:'Vence', firmado:'Firmado', tiempo:'Tiempo usado', pagado:'Pagado',
    aVencido:'Venció hace {d} días y sigue abierto', aSuspendido:'Contrato suspendido', aProrroga:'Prorrogado {d} días', aProrrogaGrave:'Prorrogado {d} días: más de la mitad del plazo original',
    aTarde:'Lleva {t}% del tiempo y solo {p}% pagado', aSinPagos:'Lleva {t}% del tiempo y no hay pagos publicados', aPagadoAntes:'Ya se pagó el {p}% con solo {t}% del tiempo',
    aAnticipo:'Anticipo de {v}', aDirecta:'Contratación directa por {v}', aConcentra:'Este contratista tiene {n} contratos abiertos aquí',
    hNacional:'Firmados en Colombia', hNacionalP:'Contratos firmados en los últimos {d} días en todo el país, según el SECOP.',
    hDirecta:'A dedo', hDirectaP:'Del total de esos días, este porcentaje fue por contratación directa (sin competencia).',
    hMuni:'En {m} esta semana', hMuniP:'Contratos firmados en los últimos 7 días en tu municipio.',
    hVencen:'Vencen pronto en {m}', hVencenP:'Terminan en los próximos 7 días. Hay que mirar si de verdad se entregan.',
    hAdopt:'Tus contratos adoptados', hAdoptP0:'Todavía no sigues ninguno.', hAdoptP:'{n} con cambios desde que los adoptaste.',
    hNoticia:'Última noticia', hNoticiaNo:'El robot aún no ha traído noticias.',
    hRobotNo:'El robot todavía no ha hecho su primer resumen. Vuelve en un rato.',
    ninguno:'Ninguno por ahora.',
    entidad:'Entidad', contratista:'Contratista', nit:'NIT / documento', valor:'Valor', vPagado:'Pagado', vFacturado:'Facturado', estado:'Estado', modalidad:'Modalidad', tipo:'Tipo',
    inicio:'Inicio', fin:'Terminación', diasAd:'Días adicionados', origen:'Origen de los recursos', ref:'Referencia', idc:'ID SECOP', alertas:'Alertas', sinAlertas:'Sin alertas por ahora.',
    verSecop:'Ver en el SECOP', peticion:'Exigir respuesta (derecho de petición)', observacion:'Texto para observación en el SECOP', compartir:'Compartir este contrato',
    wa:'Enviar por WhatsApp', copiar:'Copiar texto', copiado:'Copiado',
    petT:'Derecho de petición a todos los entes de una vez',
    petNota:'Llena tus datos y los correos que faltan (los de la entidad y la Personería salen en su página web, en "Atención al ciudadano" o "PQRSD"). La app los recuerda para la próxima.',
    tuNombre:'Tu nombre completo', tuCedula:'Tu cédula', tuCorreo:'Tu correo para la respuesta',
    mailEnt:'Correo de PQRSD de la entidad', mailPer:'Correo de la Personería municipal', mailCont:'Correo de la Contraloría departamental o municipal',
    fijos:'Ya van incluidos: Contraloría General de la República ({c}) y Procuraduría General de la Nación ({p}).',
    generar:'Generar la petición', enviarTodos:'Enviar a todos de una vez (correo)', gmail:'Abrir en Gmail',
    mailLargo:'Si tu correo corta el texto, usa "Copiar texto" y pégalo en el mensaje.',
    obsNota:'Si ya tienes cuenta de veedor, pega esto en "Observaciones" del proceso en el SECOP II.',
    robotInfo:'Robot de GitHub: último resumen {h}.',
    nContratos:'{n} contratos', compartirTxt:'Mira este contrato en Yo Soy Veedor:',
    compartirMuniTxt:'Mira los contratos de {m} en vivo. Tus impuestos tienen dueño: tú.',
    invitarTxt:'Te reto a adoptar un contrato de tu barrio y seguirle los pasos. Tus impuestos tienen dueño: tú. Entra aquí:',
    appTxt:'Yo Soy Veedor: mira en vivo los contratos de tu municipio y exige cuentas. Tus impuestos tienen dueño: tú.',
    elige:'Elige', otroMunicipio:'Escribe tu municipio',
    tick:['Tus impuestos tienen dueño: tú','Un ciudadano, un contrato','Mira, adopta, regístrate, exige','Muestra datos, no acusaciones','La plata pública es de todos'],
    steps:[
      ['Ten a mano tu cédula','Como veedor individual, tu cédula reemplaza los documentos financieros. También debes llenar y firmar el formato "Constancia Veedor/Veeduría Ciudadana" que está en la sección de Formatos de colombiacompra.gov.co. Si es una veeduría, se usa el acta de creación.'],
      ['Entra al SECOP II y toca "Registro"','Usa el botón de abajo. Llena tus datos básicos con un correo que revises de verdad y una contraseña de al menos 8 caracteres con letras, números y un signo.'],
      ['Zona horaria y nombre','Escoge la zona horaria Bogotá, Lima, Quito (UTC-05:00). Donde dice "Nombre de la Entidad", escribe tu nombre completo.'],
      ['Activa la cuenta desde tu correo','Abre el correo que te llega, toca el enlace de activación y entra con tu usuario y contraseña.'],
      ['Crea la cuenta de tipo Proveedor','En "Crear o solicitar acceso a una Entidad" pon tu nombre y tu número de cédula sin dígito de verificación, toca "Validar" y "Registrar Entidad". Escoge Tipo: Proveedor; Área de negocio: Público; Tipo de organización: Veeduría Ciudadana. Toca "Generar formulario".'],
      ['Llena el formulario y anexa','Nombre en mayúsculas, sin tildes ni signos. Pon el correo donde quieres recibir los avisos. Anexa la cédula y la constancia firmada (no se aceptan .txt, .gif ni .ppt), revisa que la barra quede verde y toca "Finalizar".'],
      ['Sigue procesos y opina','Ya registrado, busca un proceso de tu municipio, suscríbete para recibir sus avisos y haz observaciones a los pliegos, a los informes de evaluación y a la ejecución del contrato.']
    ],
    sem:[
      ['var(--red)','Vencido y abierto','Ya pasó la fecha de terminación y el contrato sigue sin cerrar en el SECOP. Pregunta si la obra se entregó.'],
      ['var(--red)','Prórrogas grandes','Cuando se alarga más de la mitad del plazo original, algo no salió como se planeó.'],
      ['var(--amber)','Pagado antes de tiempo','Mucha plata pagada con poco tiempo corrido. Hay que ver si el avance real lo justifica.'],
      ['var(--amber)','Contratación directa grande','Sin competencia y por mucha plata. La ley la permite en casos puntuales; pregunta cuál fue la justificación.'],
      ['var(--blue)','Anticipos','La plata que se entrega antes de arrancar debe estar respaldada y manejada en una fiducia o cuenta especial.'],
      ['var(--blue)','El mismo contratista una y otra vez','Varios contratos abiertos con la misma empresa o persona. No es ilegal, pero vale la pena mirarlo.']
    ],
    como:[
      'Busca tu municipio y abre un contrato con alerta: mira el plazo, lo pagado y las prórrogas.',
      'Entra al SECOP con el botón del contrato y revisa los informes de supervisión o interventoría.',
      'Ve a la obra, toma fotos con fecha y compara con lo que dice el contrato.',
      'Manda el derecho de petición desde la app. Por ley tienen 15 días hábiles para responder y 10 si es solo pedir documentos (Ley 1755 de 2015).',
      'Si no responden o hay plata sin obra, insiste ante la Personería, la Contraloría y la Procuraduría (ya van copiados en la petición).',
      'Si quieren trabajar en grupo, pueden inscribir la veeduría ciudadana ante la Personería o la Cámara de Comercio (Ley 850 de 2003).'
    ],
    leyes:[
      ['Constitución, artículos 23 y 270','Toda persona puede presentar peticiones respetuosas a las autoridades, y la ciudadanía puede vigilar la gestión pública.'],
      ['Ley 850 de 2003','Crea las veedurías ciudadanas: grupos de ciudadanos que vigilan la contratación y la ejecución de los recursos públicos.'],
      ['Ley 1755 de 2015','Regula el derecho de petición: 15 días hábiles para responder en general y 10 cuando se piden documentos.'],
      ['Ley 1757 de 2015','Ley de participación ciudadana. Fortalece el control social a lo público.'],
      ['Ley 1712 de 2014','Ley de transparencia: la información pública debe estar disponible para todos, sin tener que explicar para qué la quieres.'],
      ['Ley 1474 de 2011','Estatuto anticorrupción: reglas sobre anticipos, interventoría y publicidad de los contratos.']
    ],
    cambio_nuevo:'Contrato nuevo'
  },
  en: {
    veeduria:'Citizen oversight', kicker:'Colombia · Live SECOP II data',
    lead:'Your taxes have an owner: you. See your town\'s public contracts live, adopt one, sign up as a citizen watchdog on SECOP II and demand answers when something doesn\'t add up.',
    refresh:'Refresh now', irMunicipio:'Contracts in my town', irRegistro:'How to sign up',
    hoy:'Today', grandes:'The largest contracts signed in Colombia in the last few days', desliza:'Swipe',
    p1:'Look', p1s:'Search your town\'s contracts. No account needed.',
    p2:'Adopt', p2s:'Pick a project in your neighborhood and follow it closely.',
    p3:'Sign up', p3s:'Create your watchdog account on SECOP II and comment on tenders.',
    p4:'Demand', p4s:'If something is off, send a formal petition to every oversight body at once.',
    tuMunicipio:'Contracts in your town', compartirMuni:'Share this town',
    buscar:'Search by project, contractor, tax ID, agency or number…',
    oRiesgo:'Most red flags first', oValor:'Biggest amount first', oFin:'Closest deadline', oFirma:'Most recent',
    sAbiertos:'unfinished contracts', sValor:'at stake', sVencidos:'past deadline and still open', sAlertas:'with a red flag',
    verMas:'Show more', topContratistas:'Who gets the most contracts here?',
    campana:'Campaign', adoptaT:'Adopt a contract',
    adoptaP:'One citizen, one contract. Pick a project in your neighborhood, tap "Adopt" and the app tells you whenever the amount paid, the deadline or the status changes. Visit the site, take photos and compare with the contract.',
    invitar:'Invite others to adopt one',
    sinAdoptados:'You haven\'t adopted any contract yet. Open one from the list and tap "Adopt this contract".',
    adoptar:'Adopt this contract', adoptado:'Adopted: you are following it', soltar:'Stop following',
    adoptadoToast:'Done, you are following it. Changes will show up here.', desde:'Adopted on {f}',
    chgPago:'Paid: {a} → {b}', chgDias:'Extension: {a} → {b} days', chgEstado:'Status: {a} → {b}', sinCambios:'No changes since you adopted it.',
    otroMuni:'From another town: switch above to check for changes.',
    regT:'Sign up as a citizen watchdog on SECOP II',
    regIntro:'You don\'t need an account to look at contracts. With a watchdog account you can subscribe to tenders, get their notices and submit comments on the documents. It\'s free and uses a "Supplier" type account.',
    abrirSecop:'Open SECOP II sign-up', guiaOficial:'Official Colombia Compra guide (PDF, Spanish)',
    regAyuda:'Stuck? SECOP II help desk: (601) 745 6788. Colombia Compra Eficiente citizen service: (601) 795 6600.',
    semT:'The traffic light: what to look for in a contract',
    exigirT:'How to demand answers',
    cuidadoT:'Show data, not accusations',
    cuidadoP:'A red flag does not prove a crime: sometimes the agency just hasn\'t uploaded payments, or an extension had a valid reason. Ask with the data in hand ("this contract has three extensions, why?") and let oversight bodies investigate. That protects you from lawsuits and gives the cause credibility.',
    noticias:'In the news',
    riegaT:'Spread the word', riegaP:'The more citizens watch, the harder it is to steal everyone\'s money. Share the app with your family, your neighborhood board and your school group.',
    compartirApp:'Share the app', waApp:'Send via WhatsApp',
    fuente:'Source: SECOP II – Electronic Contracts, open data from Colombia Compra Eficiente (datos.gov.co). The app does not change any data.',
    cerrar:'Close',
    cargando:'Querying SECOP live…', vivo:'Live from SECOP · {h}', error:'SECOP did not respond. Check your connection and tap Refresh.',
    cargandoMuni:'Loading contracts for {m}…',
    cTodos:'Unfinished', cAlertas:'Red flags', cVencido:'Overdue', cProrroga:'Extended', cDirecta:'Direct award', cObra:'Public works', cAdoptados:'Adopted', cHistorial:'All (incl. finished)',
    conteo:'{n} contracts · {v}', sinResultados:'No contracts match that filter.',
    vence:'Due', firmado:'Signed', tiempo:'Time used', pagado:'Paid',
    aVencido:'Due {d} days ago and still open', aSuspendido:'Contract suspended', aProrroga:'Extended {d} days', aProrrogaGrave:'Extended {d} days: over half the original term',
    aTarde:'{t}% of the time used and only {p}% paid', aSinPagos:'{t}% of the time used and no payments published', aPagadoAntes:'{p}% already paid with only {t}% of the time used',
    aAnticipo:'Advance payment of {v}', aDirecta:'Direct award for {v}', aConcentra:'This contractor has {n} open contracts here',
    hNacional:'Signed in Colombia', hNacionalP:'Contracts signed nationwide in the last {d} days, per SECOP.',
    hDirecta:'Direct awards', hDirectaP:'Share of those contracts awarded directly (no competition).',
    hMuni:'In {m} this week', hMuniP:'Contracts signed in your town in the last 7 days.',
    hVencen:'Due soon in {m}', hVencenP:'Ending in the next 7 days. Check whether they are really delivered.',
    hAdopt:'Your adopted contracts', hAdoptP0:'You are not following any yet.', hAdoptP:'{n} changed since you adopted them.',
    hNoticia:'Latest news', hNoticiaNo:'The robot hasn\'t fetched news yet.',
    hRobotNo:'The robot hasn\'t made its first summary yet. Check back soon.',
    ninguno:'None for now.',
    entidad:'Agency', contratista:'Contractor', nit:'Tax ID / document', valor:'Value', vPagado:'Paid', vFacturado:'Invoiced', estado:'Status', modalidad:'Procurement method', tipo:'Type',
    inicio:'Start', fin:'End', diasAd:'Days added', origen:'Source of funds', ref:'Reference', idc:'SECOP ID', alertas:'Red flags', sinAlertas:'No red flags for now.',
    verSecop:'Open in SECOP', peticion:'Demand an answer (formal petition, in Spanish)', observacion:'Comment text for SECOP (Spanish)', compartir:'Share this contract',
    wa:'Send via WhatsApp', copiar:'Copy text', copiado:'Copied',
    petT:'Formal petition to every oversight body at once',
    petNota:'Fill in your details and the missing emails (the agency\'s and the local ombudsman\'s are on their websites under "Atención al ciudadano" or "PQRSD"). The app remembers them.',
    tuNombre:'Your full name', tuCedula:'Your ID number', tuCorreo:'Your email for the reply',
    mailEnt:'Agency complaints email (PQRSD)', mailPer:'Municipal ombudsman (Personería) email', mailCont:'Departmental or municipal comptroller email',
    fijos:'Already included: Comptroller General ({c}) and Inspector General (Procuraduría, {p}).',
    generar:'Generate petition', enviarTodos:'Send to all at once (email)', gmail:'Open in Gmail',
    mailLargo:'If your email app cuts the text, use "Copy text" and paste it.',
    obsNota:'If you have a watchdog account, paste this in the tender\'s "Observaciones" on SECOP II.',
    robotInfo:'GitHub robot: last summary {h}.',
    nContratos:'{n} contracts', compartirTxt:'Check this contract on Yo Soy Veedor:',
    compartirMuniTxt:'See {m}\'s public contracts live. Your taxes have an owner: you.',
    invitarTxt:'I challenge you to adopt a public contract in your neighborhood and follow it. Your taxes have an owner: you.',
    appTxt:'Yo Soy Veedor: see your town\'s public contracts live and demand answers. Your taxes have an owner: you.',
    elige:'Choose', otroMunicipio:'Type your town',
    tick:['Your taxes have an owner: you','One citizen, one contract','Look, adopt, sign up, demand','Show data, not accusations','Public money belongs to everyone'],
    steps:[
      ['Have your ID ready','As an individual watchdog, your ID replaces the financial documents. You also fill in and sign the "Constancia Veedor/Veeduría Ciudadana" form found under Formatos at colombiacompra.gov.co. A group uses its founding record.'],
      ['Open SECOP II and tap "Registro"','Use the button below. Enter your basic details with an email you actually check and a password of at least 8 characters with letters, numbers and a symbol.'],
      ['Time zone and name','Pick Bogotá, Lima, Quito (UTC-05:00). Under "Nombre de la Entidad", type your full name.'],
      ['Activate from your email','Open the email you receive, tap the activation link and log in.'],
      ['Create a "Proveedor" account','Under "Crear o solicitar acceso a una Entidad" enter your name and ID number, tap "Validar" and "Registrar Entidad". Choose Tipo: Proveedor; Área de negocio: Público; Tipo de organización: Veeduría Ciudadana. Tap "Generar formulario".'],
      ['Fill in the form and attach','Name in capitals with no accents. Enter the email for notices. Attach your ID and the signed form (.txt, .gif and .ppt are rejected), check the bar turns green and tap "Finalizar".'],
      ['Follow tenders and comment','Once registered, find a tender in your town, subscribe to its notices and comment on the terms, evaluation reports and contract execution.']
    ],
    sem:[
      ['var(--red)','Overdue and open','The end date passed and the contract is still open in SECOP. Ask whether the work was delivered.'],
      ['var(--red)','Big extensions','Extended by more than half the original term: something did not go as planned.'],
      ['var(--amber)','Paid too early','A lot of money paid with little time elapsed. Check whether real progress justifies it.'],
      ['var(--amber)','Large direct awards','No competition and a lot of money. The law allows it in specific cases; ask for the justification.'],
      ['var(--blue)','Advance payments','Money paid before work starts must be backed and kept in a trust or dedicated account.'],
      ['var(--blue)','Same contractor again and again','Several open contracts with the same company or person. Not illegal, but worth a look.']
    ],
    como:[
      'Find your town and open a flagged contract: check the deadline, payments and extensions.',
      'Open it in SECOP with the contract button and read the supervision reports.',
      'Visit the site, take dated photos and compare with the contract.',
      'Send the formal petition from the app. By law they have 15 business days to reply, 10 when you only ask for documents (Law 1755 of 2015).',
      'If they don\'t reply or there is money without work, follow up with the ombudsman, the comptroller and the Procuraduría (already copied).',
      'To work as a group, register a citizen oversight committee with the Personería or the Chamber of Commerce (Law 850 of 2003).'
    ],
    leyes:[
      ['Constitution, articles 23 and 270','Anyone may submit respectful petitions to the authorities, and citizens may oversee public management.'],
      ['Law 850 of 2003','Creates citizen oversight committees that watch public contracting and spending.'],
      ['Law 1755 of 2015','Regulates petitions: 15 business days to answer, 10 when documents are requested.'],
      ['Law 1757 of 2015','Citizen participation law. Strengthens social control of public affairs.'],
      ['Law 1712 of 2014','Transparency law: public information must be available to everyone, no reason required.'],
      ['Law 1474 of 2011','Anti-corruption statute: rules on advance payments, supervision and contract publicity.']
    ],
    cambio_nuevo:'New contract'
  }
};
const store = {
  get(k, d) { try { const v = localStorage.getItem('ysv-' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('ysv-' + k, JSON.stringify(v)); } catch {} }
};
let lang = store.get('lang', 'es'); if (!T[lang]) lang = 'es';
const t = (k, v = {}) => { const s = T[lang][k] ?? T.es[k] ?? k; return typeof s === 'string' ? s.replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '') : s; };

/* ---------- Utilidades ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = v => { const n = parseFloat(String(v ?? '').replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; };
const DAY = 864e5;
const todayStr = () => new Intl.DateTimeFormat('en-CA', { timeZone: CFG.tz }).format(new Date());
const TODAY = () => new Date(todayStr() + 'T00:00:00');
const toDate = s => { if (!s) return null; const d = new Date(String(s).slice(0,10) + 'T00:00:00'); return isNaN(d) ? null : d; };
const fDate = d => d ? d.toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { day:'numeric', month:'short', year:'numeric' }) : '—';
const fNow = (d = new Date()) => d.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US', { timeZone: CFG.tz, day:'numeric', month:'short', hour:'numeric', minute:'2-digit' });
const sq = s => String(s).replace(/'/g, "''");
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function money(v) {
  if (!v) return '$0';
  if (v >= 1e6) return '$' + (v / 1e6).toLocaleString('es-CO', { maximumFractionDigits: v >= 1e8 ? 0 : 1 }) + (lang === 'es' ? ' millones' : ' million');
  return '$' + Math.round(v).toLocaleString('es-CO');
}
const moneyShort = v => v >= 1e12 ? '$' + (v/1e12).toLocaleString('es-CO',{maximumFractionDigits:1}) + (lang==='es'?' billones':' trillion')
  : v >= 1e9 ? '$' + (v/1e9).toLocaleString('es-CO',{maximumFractionDigits:1}) + (lang==='es'?' mil M':' B') : '$' + Math.round(v/1e6).toLocaleString('es-CO') + ' M';
const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
const titleCase = s => String(s || '').toLowerCase().replace(/(^|[\s(.-])([a-záéíóúñü])/g, (m, a, b) => a + b.toUpperCase());
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 2600); }
async function getJSON(url, ms = 30000) {
  const c = new AbortController(); const tm = setTimeout(() => c.abort(), ms);
  try { const r = await fetch(url, { signal: c.signal, cache: 'no-store' }); if (!r.ok) throw new Error(r.status); return await r.json(); }
  finally { clearTimeout(tm); }
}
const fetchLocal = async name => { try { return await getJSON(`data/${name}?v=${Date.now()}`, 12000); } catch { return null; } };

/* ---------- Estado ---------- */
const S = {
  all: [], view: [], shown: CFG.pageSize, chip: 'todos', q: '', orden: 'riesgo',
  depto: CFG.defDepto, muni: CFG.defMuni, munis: [], hoy: null, noticias: [], meta: null,
  adopt: store.get('adopt', {})
};
const CLOSED = /terminad|cerrad|cancelad|liquidad|cedid|borrador/i;

/* ---------- Municipios ---------- */
async function loadMunicipios() {
  const local = await fetchLocal('municipios.json');
  if (Array.isArray(local) && local.length) { S.munis = local; return; }
  try {   // sin robot todavía: se pide en vivo
    const desde = new Date(Date.now() - 365 * DAY).toISOString().slice(0, 10);
    const p = new URLSearchParams({ '$select': 'departamento,ciudad,count(id_contrato) as n', '$group': 'departamento,ciudad', '$where': `fecha_de_firma >= '${desde}'`, '$limit': '5000' });
    const rows = await getJSON(CFG.api + '?' + p, 30000);
    S.munis = rows.filter(r => r.departamento && r.ciudad && !/no definido/i.test(r.ciudad) && num(r.n) >= 3).map(r => ({ d: r.departamento, c: r.ciudad, n: num(r.n) }));
  } catch { S.munis = []; }
}
function renderMuniSelects() {
  const deps = [...new Set(S.munis.map(m => m.d))].sort((a, b) => a.localeCompare(b, 'es'));
  if (!deps.length) deps.push(S.depto);
  if (!deps.some(d => norm(d) === norm(S.depto))) deps.unshift(S.depto);
  const fd = $('#fDepto');
  fd.innerHTML = deps.map(d => `<option value="${esc(d)}">${esc(titleCase(d))}</option>`).join('');
  fd.value = deps.find(d => norm(d) === norm(S.depto)) || deps[0];
  S.depto = fd.value;
  renderMuniOptions();
}
function renderMuniOptions() {
  let ms = S.munis.filter(m => norm(m.d) === norm(S.depto)).map(m => m.c);
  ms = [...new Set(ms)].sort((a, b) => a.localeCompare(b, 'es'));
  if (!ms.some(m => norm(m) === norm(S.muni))) ms.unshift(S.muni);
  const fm = $('#fMuni');
  fm.innerHTML = ms.map(m => `<option value="${esc(m)}">${esc(titleCase(m))}</option>`).join('');
  fm.value = ms.find(m => norm(m) === norm(S.muni)) || ms[0];
  S.muni = fm.value;
}
const muniName = () => titleCase(S.muni);

/* ---------- Contratos del municipio (en vivo) ---------- */
function buildUrl() {
  const desde = new Date(Date.now() - CFG.anios * 365 * DAY).toISOString().slice(0, 10);
  const p = new URLSearchParams({
    '$where': `upper(departamento)='${sq(S.depto.toUpperCase())}' AND upper(ciudad)='${sq(S.muni.toUpperCase())}' AND fecha_de_firma >= '${desde}'`,
    '$order': 'fecha_de_firma DESC', '$limit': '5000'
  });
  return CFG.api + '?' + p;
}
function normalize(r) {
  const url = (r.urlproceso && (r.urlproceso.url || r.urlproceso)) || '';
  return {
    id: r.id_contrato || r.referencia_del_contrato || Math.random().toString(36).slice(2),
    ref: r.referencia_del_contrato || '', entidad: (r.nombre_entidad || '').trim(), estado: r.estado_contrato || '',
    objeto: (r.objeto_del_contrato || r.descripcion_del_proceso || '').trim(),
    tipo: r.tipo_de_contrato || '', modalidad: r.modalidad_de_contratacion || '',
    firma: toDate(r.fecha_de_firma), inicio: toDate(r.fecha_de_inicio_del_contrato), fin: toDate(r.fecha_de_fin_del_contrato),
    proveedor: (r.proveedor_adjudicado || '').trim(), nit: r.documento_proveedor || '',
    valor: num(r.valor_del_contrato), pagado: num(r.valor_pagado), facturado: num(r.valor_facturado),
    anticipo: num(r.valor_de_pago_adelantado), dias: num(r.dias_adicionados),
    origen: r.origen_de_los_recursos || '', url: typeof url === 'string' ? url : '',
    depto: r.departamento || S.depto, muni: r.ciudad || S.muni
  };
}
function analyze(list) {
  const hoy = TODAY();
  const byNit = {};
  list.forEach(c => { c.abierto = !CLOSED.test(c.estado); if (c.abierto && c.nit && !/no definido/i.test(c.nit)) byNit[c.nit] = (byNit[c.nit] || 0) + 1; });
  list.forEach(c => {
    const A = [];
    const ini = c.inicio || c.firma;
    const dur = c.fin && ini ? Math.max(1, (c.fin - ini) / DAY) : 0;
    c.tiempoPct = dur ? clamp(Math.round((hoy - ini) / DAY / dur * 100)) : 0;
    c.pagPct = c.valor ? clamp(Math.round(c.pagado / c.valor * 100)) : 0;
    c.vencido = !!(c.abierto && c.fin && c.fin < hoy);
    c.diasVencido = c.vencido ? Math.round((hoy - c.fin) / DAY) : 0;
    c.directa = /directa/i.test(c.modalidad);
    c.obra = /obra/i.test(c.tipo) || /^\s*(construcci|mejoramiento|adecuaci|pavimenta|rehabilita|mantenimiento)/i.test(c.objeto);
    c.suspendido = /suspend/i.test(c.estado);
    c.repetido = c.abierto ? (byNit[c.nit] || 0) : 0;
    if (c.abierto) {
      if (c.vencido) A.push({ s:3, x:t('aVencido',{d:c.diasVencido}) });
      if (c.suspendido) A.push({ s:3, x:t('aSuspendido') });
      if (!c.vencido && c.valor > 0) {
        if (c.pagado === 0 && c.tiempoPct >= 50) A.push({ s:1, x:t('aSinPagos',{t:c.tiempoPct}) });
        else if (c.tiempoPct >= 80 && c.pagPct < 30) A.push({ s:2, x:t('aTarde',{t:c.tiempoPct,p:c.pagPct}) });
      }
      if (c.pagPct >= 90 && c.tiempoPct < 50) A.push({ s:2, x:t('aPagadoAntes',{p:c.pagPct,t:c.tiempoPct}) });
      if (c.repetido >= 3) A.push({ s: c.repetido >= 6 ? 2 : 1, x:t('aConcentra',{n:c.repetido}) });
    }
    if (c.dias > 0) {
      const orig = dur - c.dias, grave = orig > 0 && c.dias / orig >= .5;
      A.push({ s: grave ? 3 : 2, x: t(grave ? 'aProrrogaGrave' : 'aProrroga', { d: Math.round(c.dias) }) });
    }
    if (c.anticipo > 0) A.push({ s: c.valor && c.anticipo / c.valor >= .3 ? 2 : 1, x:t('aAnticipo',{v:money(c.anticipo)}) });
    if (c.directa && c.valor >= 2e8) A.push({ s:2, x:t('aDirecta',{v:money(c.valor)}) });
    c.alertas = A.sort((a,b) => b.s - a.s);
    c.sev = A.length ? A[0].s : 0;
    c.score = A.reduce((s,a) => s + a.s * a.s, 0) + Math.log10(c.valor + 10) / 3;
  });
  return list;
}

/* ---------- Render ---------- */
function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $('#btnLang').textContent = lang === 'es' ? 'EN' : 'ES';
  $('#ticker').innerHTML = [...t('tick'), ...t('tick')].map(x => `<span>${esc(x)}</span>`).join('');
  $('#steps').innerHTML = t('steps').map(([b, p], i) => `<li style="animation-delay:${i*60}ms"><b>${esc(b)}</b><p>${esc(p)}</p></li>`).join('');
  $('#semaforo').innerHTML = t('sem').map(([c, b, p]) => `<div class="sem" style="--c:${c}"><b>${esc(b)}</b><p>${esc(p)}</p></div>`).join('');
  $('#comoList').innerHTML = t('como').map(x => `<li>${esc(x)}</li>`).join('');
  $('#leyes').innerHTML = t('leyes').map(([b, p]) => `<div class="ley"><b>${esc(b)}</b><p>${esc(p)}</p></div>`).join('');
  $('#btnWaApp').href = 'https://wa.me/?text=' + encodeURIComponent(t('appTxt') + '\n' + CFG.appUrl);
}

const CHIPS = [
  ['todos', c => c.abierto], ['alertas', c => c.abierto && c.alertas.length], ['vencido', c => c.vencido], ['prorroga', c => c.dias > 0],
  ['directa', c => c.directa], ['obra', c => c.obra], ['adoptados', c => !!S.adopt[c.id]], ['historial', c => true]
];
const chipLabel = { todos:'cTodos', alertas:'cAlertas', vencido:'cVencido', prorroga:'cProrroga', directa:'cDirecta', obra:'cObra', adoptados:'cAdoptados', historial:'cHistorial' };
function renderChips() {
  $('#chips').innerHTML = CHIPS.map(([k, fn]) => `<button class="chip ${S.chip === k ? 'on' : ''}" data-chip="${k}">${esc(t(chipLabel[k]))}<small>${S.all.filter(fn).length}</small></button>`).join('');
}
const sevColor = s => s >= 3 ? 'var(--red)' : s === 2 ? 'var(--amber)' : s === 1 ? 'var(--blue)' : 'var(--green)';
const tagClass = s => s >= 3 ? 'r' : s === 2 ? 'a' : 'b';

function card(c, i = 0) {
  const tags = c.alertas.slice(0, 3).map(a => `<span class="tag ${tagClass(a.s)}">${esc(a.x)}</span>`).join('') || `<span class="tag g">${esc(c.estado)}</span>`;
  const tc = c.tiempoPct >= 100 ? 'var(--red)' : c.tiempoPct >= 80 ? 'var(--amber)' : 'var(--green)';
  return `<article class="card" data-id="${esc(c.id)}" style="--sev:${sevColor(c.sev)};animation-delay:${Math.min(i,10)*40}ms">
    <div class="ent">${esc(c.entidad)}</div>
    <h3>${esc(c.objeto || c.ref)}</h3>
    <div class="money">${money(c.valor)}</div>
    <div class="who">${esc(c.proveedor || '—')}</div>
    <div class="tags">${tags}</div>
    <div class="bars">
      <div class="bar">${t('tiempo')} ${c.tiempoPct}% · ${t('vence')} ${fDate(c.fin)}<i><b data-w="${c.tiempoPct}" style="--c:${tc}"></b></i></div>
      <div class="bar">${t('pagado')} ${c.pagPct}% · ${money(c.pagado)}<i><b data-w="${c.pagPct}"></b></i></div>
    </div>
    ${S.adopt[c.id] ? `<div class="adopt">${esc(t('adoptado'))}</div>` : ''}
  </article>`;
}
const animateBars = root => requestAnimationFrame(() => root.querySelectorAll('.bar b[data-w]').forEach(b => b.style.width = b.dataset.w + '%'));

function countUp(el, end, isM) {
  const t0 = performance.now();
  const step = now => { const k = Math.min(1, (now - t0) / 900), v = end * (1 - Math.pow(1 - k, 3));
    el.textContent = isM ? moneyShort(v) : Math.round(v).toLocaleString('es-CO'); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function renderStats() {
  const open = S.all.filter(c => c.abierto);
  const vals = { abiertos: open.length, valor: open.reduce((s,c) => s + c.valor, 0), vencidos: open.filter(c => c.vencido).length, alertas: open.filter(c => c.alertas.length).length };
  document.querySelectorAll('#stats [data-count]').forEach(el => countUp(el, vals[el.dataset.count], el.hasAttribute('data-money')));
}

function cambiosAdoptado(a, c) {
  const out = [];
  if (!c) return out;
  if (a.pagado !== c.pagado) out.push(t('chgPago', { a: money(a.pagado), b: money(c.pagado) }));
  if (a.dias !== c.dias) out.push(t('chgDias', { a: a.dias, b: c.dias }));
  if (a.estado !== c.estado) out.push(t('chgEstado', { a: a.estado, b: c.estado }));
  return out;
}
const mismoMuni = a => norm(a.muni) === norm(S.muni) && norm(a.depto) === norm(S.depto);

function renderHoy() {
  const hoy = TODAY(), m = muniName(), H = S.hoy;
  $('#hoyFecha').textContent = hoy.toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { weekday:'long', day:'numeric', month:'long' });
  const short = s => esc((s || '').slice(0, 64)) + ((s || '').length > 64 ? '…' : '');
  const semana = S.all.filter(c => c.firma && hoy - c.firma <= 7 * DAY).sort((a, b) => b.valor - a.valor);
  const vencen = S.all.filter(c => c.abierto && c.fin && c.fin >= hoy && c.fin - hoy <= 7 * DAY).sort((a, b) => a.fin - b.fin);
  const ads = Object.values(S.adopt);
  const conCambio = ads.filter(a => mismoMuni(a) && cambiosAdoptado(a, S.all.find(c => c.id === a.id)).length);
  const li = (arr, f) => arr.length ? '<ul>' + arr.slice(0, 3).map(c => `<li data-id="${esc(c.id)}">${f(c)}</li>`).join('') + '</ul>' : `<ul><li>${esc(t('ninguno'))}</li></ul>`;
  const items = [];
  if (H) {
    items.push({ a:'var(--lime)', n: H.total.toLocaleString('es-CO'), h:t('hNacional'), p:t('hNacionalP', { d: H.dias }), extra:`<div class="big">${moneyShort(H.valor)}</div>` });
    items.push({ a:'var(--red)', n: H.pctDirecta + '%', h:t('hDirecta'), p:t('hDirectaP'),
      extra: H.deptos?.length ? '<ul>' + H.deptos.slice(0, 3).map(d => `<li>${esc(titleCase(d.d))} · <b>${d.n.toLocaleString('es-CO')}</b> · ${moneyShort(d.v)}</li>`).join('') + '</ul>' : '' });
  } else items.push({ a:'var(--lime)', n:'…', h:t('hNacional'), p:t('hRobotNo'), extra:'' });
  items.push({ a:'#7dd3fc', n: semana.length, h:t('hMuni', { m }), p:t('hMuniP'), extra: li(semana, c => `${short(c.objeto)} · <b>${money(c.valor)}</b>`) });
  items.push({ a:'var(--amber)', n: vencen.length, h:t('hVencen', { m }), p:t('hVencenP'), extra: li(vencen, c => `${short(c.objeto)} · <b>${fDate(c.fin)}</b>`) });
  items.push({ a:'#c4b5fd', n: ads.length, h:t('hAdopt'), p: ads.length ? t('hAdoptP', { n: conCambio.length }) : t('hAdoptP0'), extra:'', go:'#adoptados' });
  const nt = S.noticias[0];
  items.push({ a:'#fda4af', n:'', h:t('hNoticia'), p: nt ? '' : t('hNoticiaNo'),
    extra: nt ? `<ul><li><a href="${esc(nt.link)}" target="_blank" rel="noopener"><b>${esc(nt.titulo)}</b></a><br><small>${esc(nt.fuente || '')} · ${esc(fNow(new Date(nt.fecha)))}</small></li></ul>` : '' });
  $('#hoyGrid').innerHTML = items.map((it, i) => `<div class="hoy-item" style="--accent:${it.a};animation-delay:${i*70}ms" ${it.go ? `data-go="${it.go}"` : ''}>
    ${it.n !== '' ? `<div class="n">${esc(it.n)}</div>` : ''}<h3>${esc(it.h)}</h3>${it.p ? `<p>${esc(it.p)}</p>` : ''}${it.extra}</div>`).join('');
}

function renderGrandes() {
  const top = (S.hoy?.top || []).map(r => { const c = normalize(r); c.abierto = true; c.alertas = []; c.sev = 0; c.tiempoPct = 0; c.pagPct = 0; return c; });
  S.grandes = analyze(top);
  $('#grandes').innerHTML = S.grandes.length ? S.grandes.map((c, i) => card(c, i).replace('</article>', `<div class="when">${esc(titleCase(c.muni))}, ${esc(titleCase(c.depto))} · ${esc(t('firmado'))} ${fDate(c.firma)}</div></article>`)).join('')
    : `<div class="empty">${esc(t('hRobotNo'))}</div>`;
  animateBars($('#grandes'));
}

function renderList() {
  const fn = CHIPS.find(x => x[0] === S.chip)[1];
  const q = norm(S.q.trim());
  let v = S.all.filter(fn);
  if (q) v = v.filter(c => norm(c.objeto + ' ' + c.proveedor + ' ' + c.nit + ' ' + c.ref + ' ' + c.id + ' ' + c.entidad).includes(q));
  const sorters = { riesgo:(a,b) => b.score - a.score, valor:(a,b) => b.valor - a.valor, fin:(a,b) => (a.fin || 9e15) - (b.fin || 9e15), firma:(a,b) => (b.firma || 0) - (a.firma || 0) };
  v.sort(sorters[S.orden]);
  S.view = v;
  $('#conteo').textContent = t('conteo', { n: v.length.toLocaleString('es-CO'), v: money(v.reduce((s,c) => s + c.valor, 0)) });
  $('#cards').innerHTML = v.length ? v.slice(0, S.shown).map(card).join('') : `<div class="empty">${esc(t('sinResultados'))}</div>`;
  $('#btnMas').hidden = v.length <= S.shown;
  animateBars($('#cards'));
}

function renderRanking() {
  const g = {};
  S.all.filter(c => c.abierto).forEach(c => { const k = c.nit || c.proveedor; if (!k) return; (g[k] ||= { nm:c.proveedor, nit:c.nit, n:0, v:0 }); g[k].n++; g[k].v += c.valor; });
  const arr = Object.values(g).sort((a,b) => b.v - a.v).slice(0, 10);
  const max = arr[0]?.v || 1;
  $('#ranking').innerHTML = arr.map((r, i) => `<div class="rk" data-q="${esc(r.nit || r.nm)}">
    <div class="p">${i + 1}</div><div class="nm">${esc(r.nm || '—')}<small>${esc(r.nit)} · ${esc(t('nContratos',{n:r.n}))}</small></div><div class="v">${money(r.v)}</div>
    <div class="meter"><b style="width:${Math.max(4, r.v / max * 100)}%"></b></div></div>`).join('') || `<div class="empty">${esc(t('ninguno'))}</div>`;
}

function renderAdoptados() {
  const ads = Object.values(S.adopt).sort((a, b) => (b.desde || '').localeCompare(a.desde || ''));
  $('#misAdoptados').innerHTML = ads.length ? ads.map(a => {
    const c = mismoMuni(a) ? S.all.find(x => x.id === a.id) : null;
    const ch = c ? cambiosAdoptado(a, c) : [];
    const nota = !mismoMuni(a) ? t('otroMuni') : ch.length ? ch.join(' · ') : t('sinCambios');
    return `<div class="ad" data-adid="${esc(a.id)}"><b>${esc((a.objeto || '').slice(0, 110))}</b>
      <small>${esc(titleCase(a.muni))} · ${money(a.valor)} · ${esc(t('desde', { f: fDate(new Date(a.desde)) }))}</small>
      <span class="chg">${esc(nota)}</span></div>`;
  }).join('') : `<div class="ad vacio"><small>${esc(t('sinAdoptados'))}</small></div>`;
}

function renderNoticias() {
  const n = S.noticias.slice(0, 8);
  $('#noticiasSec').hidden = !n.length;
  $('#noticias').innerHTML = n.map(x => `<a href="${esc(x.link)}" target="_blank" rel="noopener"><b>${esc(x.titulo)}</b><small>${esc(x.fuente || '')} · ${esc(x.fecha ? fNow(new Date(x.fecha)) : '')}</small></a>`).join('');
}
function renderRobotInfo() { $('#robotInfo').textContent = S.meta ? t('robotInfo', { h: fNow(new Date(S.meta.actualizado)) }) : ''; }

function renderMuni() { renderChips(); renderStats(); renderList(); renderRanking(); renderAdoptados(); renderHoy(); }
function renderAll() { renderMuni(); renderGrandes(); renderNoticias(); renderRobotInfo(); }

/* ---------- Detalle ---------- */
function findC(id) { return S.all.find(x => x.id === id) || (S.grandes || []).find(x => x.id === id); }
function openDetail(id) {
  const c = findC(id); if (!c) return;
  const kv = (k, v, full) => `<div class="${full ? 'full' : ''}"><small>${esc(t(k))}</small><b>${v}</b></div>`;
  const al = c.alertas.length ? c.alertas.map(a => `<div class="alert" style="--c:${sevColor(a.s)}">${esc(a.x)}</div>`).join('') : `<div class="alert" style="--c:var(--green)">${esc(t('sinAlertas'))}</div>`;
  const ad = !!S.adopt[c.id];
  $('#sheetBody').innerHTML = `
    <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:700">${esc(c.entidad)} · ${esc(titleCase(c.muni))}</div>
    <h2>${esc(c.objeto)}</h2>
    <div style="font-family:'Archivo Black';font-size:1.8rem">${money(c.valor)}</div>
    <div class="bars">
      <div class="bar">${t('tiempo')} ${c.tiempoPct}%<i><b data-w="${c.tiempoPct}" style="--c:${c.tiempoPct >= 100 ? 'var(--red)' : 'var(--green)'}"></b></i></div>
      <div class="bar">${t('pagado')} ${c.pagPct}%<i><b data-w="${c.pagPct}"></b></i></div>
    </div>
    <h3 style="margin-top:16px">${esc(t('alertas'))}</h3>
    <div class="alerts">${al}</div>
    <div class="kv">
      ${kv('contratista', esc(c.proveedor || '—'), true)}
      ${kv('nit', esc(c.nit || '—'))}${kv('estado', esc(c.estado || '—'))}
      ${kv('vPagado', money(c.pagado))}${kv('vFacturado', money(c.facturado))}
      ${kv('firmado', fDate(c.firma))}${kv('inicio', fDate(c.inicio))}
      ${kv('fin', fDate(c.fin))}${kv('diasAd', c.dias ? Math.round(c.dias) : '0')}
      ${kv('modalidad', esc(c.modalidad || '—'))}${kv('tipo', esc(c.tipo || '—'))}
      ${kv('ref', esc(c.ref || '—'))}${kv('idc', esc(c.id))}
      ${kv('origen', esc(c.origen || '—'), true)}
    </div>
    <div class="actions">
      <button class="btn ${ad ? 'adoptado' : 'primary'}" data-adopt="${esc(c.id)}">${esc(t(ad ? 'soltar' : 'adoptar'))}</button>
      ${c.url ? `<a class="btn dark" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(t('verSecop'))}</a>` : ''}
      <button class="btn dark" data-pet="${esc(c.id)}">${esc(t('peticion'))}</button>
      <button class="btn ghost" data-obs="${esc(c.id)}" style="color:var(--ink)">${esc(t('observacion'))}</button>
      <button class="btn ghost" data-share="${esc(c.id)}" style="color:var(--ink)">${esc(t('compartir'))}</button>
    </div>
    <div id="petBox"></div>`;
  $('#sheet').hidden = false;
  document.body.style.overflow = 'hidden';
  animateBars($('#sheetBody'));
  history.replaceState(null, '', location.pathname + location.search + '#c=' + encodeURIComponent(id));
}
function closeDetail() { $('#sheet').hidden = true; document.body.style.overflow = ''; history.replaceState(null, '', location.pathname + location.search); }

function toggleAdopt(id) {
  const c = findC(id); if (!c) return;
  if (S.adopt[id]) delete S.adopt[id];
  else {
    S.adopt[id] = { id, objeto: c.objeto, entidad: c.entidad, valor: c.valor, pagado: c.pagado, dias: c.dias, estado: c.estado, muni: c.muni, depto: c.depto, desde: new Date().toISOString() };
    toast(t('adoptadoToast'));
  }
  store.set('adopt', S.adopt);
  openDetail(id); renderChips(); renderList(); renderAdoptados(); renderHoy();
}

/* ---------- Derecho de petición y observación ---------- */
const hoyLargo = () => new Date().toLocaleDateString('es-CO', { timeZone: CFG.tz, day:'numeric', month:'long', year:'numeric' });
function peticion(c, d) {
  return `${titleCase(c.muni)}, ${hoyLargo()}

Señores
${c.entidad || 'ENTIDAD CONTRATANTE'}
${titleCase(c.muni)}, ${titleCase(c.depto)}

Con copia a: Personería Municipal de ${titleCase(c.muni)}; Contraloría territorial competente; Contraloría General de la República; Procuraduría General de la Nación.

Asunto: Derecho de petición de información sobre el contrato ${c.ref || c.id}

Yo, ${d.nombre || '[NOMBRE COMPLETO]'}, identificado(a) con cédula de ciudadanía No. ${d.cedula || '[NÚMERO]'}, en ejercicio del derecho fundamental de petición (artículo 23 de la Constitución Política y Ley 1755 de 2015) y del control social a la gestión pública (artículo 270 de la Constitución, Ley 850 de 2003 y Ley 1757 de 2015), respetuosamente solicito información sobre el siguiente contrato publicado en el SECOP II:

- Referencia: ${c.ref || '—'} (ID SECOP: ${c.id})
- Objeto: ${c.objeto}
- Contratista: ${c.proveedor || '—'} (NIT/documento ${c.nit || '—'})
- Valor: ${money(c.valor)} — Pagado según SECOP: ${money(c.pagado)}
- Estado en SECOP: ${c.estado || '—'} — Fecha de terminación registrada: ${c.fin ? c.fin.toLocaleDateString('es-CO') : '—'}
- Días adicionados: ${c.dias ? Math.round(c.dias) : 0}

Solicito:
1. Porcentaje de avance físico y financiero actual, con el último informe de supervisión y/o interventoría.
2. Relación de pagos realizados al contratista (incluido el anticipo, si lo hubo) y sus soportes.
3. Copia de las modificaciones, adiciones, prórrogas o suspensiones, con su justificación.
4. Nombre del supervisor y/o interventor del contrato.
5. Fecha prevista de entrega y, si el plazo ya venció, las acciones adelantadas por la entidad (requerimientos, multas, cláusula penal, declaratoria de incumplimiento o liquidación).
6. Si la información anterior no está completa y actualizada en el SECOP II, la razón y la fecha en que se publicará.

A los entes de control en copia les solicito, dentro de sus competencias, hacer seguimiento a este contrato y a la respuesta que se dé a esta petición.

Recibiré respuesta en: ${d.correo || '[CORREO ELECTRÓNICO]'}

Agradezco la respuesta dentro de los términos que establece la Ley 1755 de 2015.

Atentamente,

${d.nombre || '[NOMBRE COMPLETO]'}
C.C. ${d.cedula || '[NÚMERO]'}`;
}
function observacion(c) {
  return `Como veedor(a) ciudadano(a), con base en la Ley 850 de 2003, solicito a la entidad informar el estado de avance físico y financiero del contrato ${c.ref || c.id}, publicar en el SECOP II los informes de supervisión o interventoría y los soportes de pago, y justificar ${c.dias > 0 ? `las prórrogas registradas (${Math.round(c.dias)} días adicionados)` : 'cualquier modificación al plazo o al valor'}. Gracias.`;
}
function petForm(c) {
  const d = store.get('datos', {});
  const ent = store.get('mailEnt:' + c.entidad, ''), per = store.get('mailPer:' + norm(c.muni), ''), con = store.get('mailCont:' + norm(c.depto), '');
  $('#petBox').innerHTML = `<div class="pet-form">
    <h4>${esc(t('petT'))}</h4>
    <p class="nota" style="opacity:1;color:var(--muted);margin:0">${esc(t('petNota'))}</p>
    <label>${esc(t('tuNombre'))}<input id="pNombre" value="${esc(d.nombre || '')}" autocomplete="name"></label>
    <label>${esc(t('tuCedula'))}<input id="pCedula" value="${esc(d.cedula || '')}" inputmode="numeric"></label>
    <label>${esc(t('tuCorreo'))}<input id="pCorreo" type="email" value="${esc(d.correo || '')}" autocomplete="email"></label>
    <label>${esc(t('mailEnt'))} · ${esc(c.entidad)}<input id="pEnt" type="email" value="${esc(ent)}"></label>
    <label>${esc(t('mailPer'))} · ${esc(titleCase(c.muni))}<input id="pPer" type="email" value="${esc(per)}"></label>
    <label>${esc(t('mailCont'))}<input id="pCont" type="email" value="${esc(con)}"></label>
    <div class="fijo">${esc(t('fijos', { c: CFG.cgr, p: CFG.pgn }))}</div>
    <button class="btn primary" id="pGen">${esc(t('generar'))}</button>
    <div id="pOut"></div></div>`;
  $('#pGen').onclick = () => {
    const v = id => $(id).value.trim();
    const datos = { nombre: v('#pNombre'), cedula: v('#pCedula'), correo: v('#pCorreo') };
    store.set('datos', datos);
    store.set('mailEnt:' + c.entidad, v('#pEnt')); store.set('mailPer:' + norm(c.muni), v('#pPer')); store.set('mailCont:' + norm(c.depto), v('#pCont'));
    const to = [v('#pEnt'), v('#pPer'), v('#pCont'), CFG.cgr, CFG.pgn].filter(x => /@/.test(x));
    const asunto = `Derecho de petición - contrato ${c.ref || c.id}`;
    const txt = peticion(c, datos);
    const mailto = `mailto:${to.join(',')}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(txt)}`;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to.join(','))}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(txt)}`;
    $('#pOut').innerHTML = `<textarea class="pet">${esc(txt)}</textarea>
      <div class="actions">
        <a class="btn primary" href="${esc(mailto)}">${esc(t('enviarTodos'))} (${to.length})</a>
        <a class="btn dark" href="${esc(gmail)}" target="_blank" rel="noopener">${esc(t('gmail'))}</a>
        <button class="btn ghost" id="pCopy" style="color:var(--ink)">${esc(t('copiar'))}</button>
        <a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(txt)}">${esc(t('wa'))}</a>
      </div><p class="nota" style="opacity:1;color:var(--muted)">${esc(t('mailLargo'))}</p>`;
    $('#pCopy').onclick = () => copy($('#pOut textarea').value);
    $('#pOut textarea').scrollIntoView({ behavior:'smooth', block:'center' });
  };
  $('#petBox').scrollIntoView({ behavior:'smooth', block:'start' });
}
function obsBox(c) {
  const txt = observacion(c);
  $('#petBox').innerHTML = `<div class="pet-form"><h4>${esc(t('observacion'))}</h4><p class="nota" style="opacity:1;color:var(--muted);margin:0">${esc(t('obsNota'))}</p>
    <textarea class="pet" style="min-height:140px">${esc(txt)}</textarea>
    <div class="actions"><button class="btn dark" id="oCopy">${esc(t('copiar'))}</button>
    ${c.url ? `<a class="btn primary" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(t('verSecop'))}</a>` : ''}</div></div>`;
  $('#oCopy').onclick = () => copy($('#petBox textarea').value);
  $('#petBox').scrollIntoView({ behavior:'smooth', block:'start' });
}
async function copy(v) {
  try { await navigator.clipboard.writeText(v); } catch { const ta = document.createElement('textarea'); ta.value = v; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  toast(t('copiado'));
}
const muniUrl = () => CFG.appUrl + '?m=' + encodeURIComponent(S.depto + '|' + S.muni);
async function share(text, url) {
  if (navigator.share) { try { await navigator.share({ title: 'Yo Soy Veedor', text, url }); return; } catch {} }
  window.open('https://wa.me/?text=' + encodeURIComponent(text + '\n' + url), '_blank');
}

/* ---------- Carga ---------- */
let reqN = 0;
async function loadMuni() {
  const my = ++reqN;
  const btn = $('#btnRefresh'); btn.classList.add('loading'); btn.disabled = true;
  $('#status').textContent = t('cargandoMuni', { m: muniName() });
  $('#cards').innerHTML = `<div class="empty">${esc(t('cargandoMuni', { m: muniName() }))}</div>`;
  let rows = null;
  try { rows = await getJSON(buildUrl(), 35000); } catch (e) { console.warn('SECOP en vivo no disponible', e); }
  if (my !== reqN) return;
  btn.classList.remove('loading'); btn.disabled = false;
  if (!rows) { $('#status').textContent = t('error'); S.all = []; renderMuni(); return; }
  S.all = analyze(rows.map(normalize));
  $('#status').innerHTML = `<span class="live"></span>${esc(t('vivo', { h: fNow() }))}`;
  S.shown = CFG.pageSize;
  renderMuni();
  const m = location.hash.match(/#c=(.+)/); if (m) openDetail(decodeURIComponent(m[1]));
}
async function loadRobot() {
  const [hoy, noticias, meta] = await Promise.all([fetchLocal('hoy.json'), fetchLocal('noticias.json'), fetchLocal('meta.json')]);
  S.hoy = hoy && hoy.total ? hoy : null;
  S.noticias = Array.isArray(noticias) ? noticias : [];
  S.meta = meta && meta.actualizado ? meta : null;
  renderGrandes(); renderNoticias(); renderRobotInfo(); renderHoy();
}
async function loadAll() {
  $('#status').textContent = t('cargando');
  loadRobot();
  if (!S.munis.length) { await loadMunicipios(); renderMuniSelects(); }
  await loadMuni();
  S.loadedAt = Date.now();
}

/* ---------- Eventos ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-id],[data-chip],[data-close],[data-pet],[data-obs],[data-share],[data-q],[data-adopt],[data-adid],[data-go]');
  if (!el) return;
  if (el.dataset.close !== undefined) return closeDetail();
  if (el.dataset.chip) { S.chip = el.dataset.chip; S.shown = CFG.pageSize; renderChips(); renderList(); return; }
  if (el.dataset.adopt) return toggleAdopt(el.dataset.adopt);
  if (el.dataset.pet) return petForm(findC(el.dataset.pet));
  if (el.dataset.obs) return obsBox(findC(el.dataset.obs));
  if (el.dataset.share) { const c = findC(el.dataset.share); return share(`${t('compartirTxt')} ${c.objeto.slice(0, 120)} — ${money(c.valor)}`, CFG.appUrl + '?m=' + encodeURIComponent(c.depto + '|' + c.muni) + '#c=' + encodeURIComponent(c.id)); }
  if (el.dataset.q) { S.q = el.dataset.q; $('#q').value = S.q; S.chip = 'historial'; renderChips(); renderList(); $('#cards').scrollIntoView({ behavior:'smooth' }); return; }
  if (el.dataset.go) { $(el.dataset.go).scrollIntoView({ behavior:'smooth' }); return; }
  if (el.dataset.adid) {
    const a = S.adopt[el.dataset.adid];
    if (findC(a.id)) return openDetail(a.id);
    S.depto = a.depto; S.muni = a.muni; renderMuniSelects(); store.set('muni', [S.depto, S.muni]);
    location.hash = 'c=' + encodeURIComponent(a.id); loadMuni(); return;
  }
  if (el.dataset.id) { if (e.target.closest('a')) return; openDetail(el.dataset.id); }
});
let qT; $('#q').addEventListener('input', e => { clearTimeout(qT); qT = setTimeout(() => { S.q = e.target.value; S.shown = CFG.pageSize; renderList(); }, 180); });
$('#fDepto').addEventListener('change', e => {
  S.depto = e.target.value;
  const ms = S.munis.filter(m => norm(m.d) === norm(S.depto)).sort((a, b) => b.n - a.n);
  S.muni = ms[0]?.c || S.muni; renderMuniOptions(); store.set('muni', [S.depto, S.muni]); loadMuni();
});
$('#fMuni').addEventListener('change', e => { S.muni = e.target.value; store.set('muni', [S.depto, S.muni]); S.q = ''; $('#q').value = ''; loadMuni(); });
$('#fOrden').addEventListener('change', e => { S.orden = e.target.value; renderList(); });
$('#btnMas').addEventListener('click', () => { S.shown += CFG.pageSize; renderList(); });
$('#btnRefresh').addEventListener('click', () => { loadRobot(); loadMuni(); });
$('#btnCompartirMuni').addEventListener('click', () => share(t('compartirMuniTxt', { m: muniName() }), muniUrl()));
$('#btnInvitar').addEventListener('click', () => share(t('invitarTxt'), CFG.appUrl + '#adoptados'));
$('#btnCompartirApp').addEventListener('click', () => share(t('appTxt'), CFG.appUrl));
$('#btnLang').addEventListener('click', () => {
  lang = lang === 'es' ? 'en' : 'es'; store.set('lang', lang);
  applyI18n();
  S.all = analyze(S.all); renderAll();
  if ($('#status').querySelector('.live')) $('#status').innerHTML = `<span class="live"></span>${esc(t('vivo', { h: fNow() }))}`;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.loadedAt && Date.now() - S.loadedAt > 10 * 6e4) { S.loadedAt = Date.now(); loadRobot(); loadMuni(); } });

/* Carrusel de fotos */
const slides = document.querySelectorAll('.slide'); let si = 0;
setInterval(() => { slides[si].classList.remove('on'); si = (si + 1) % slides.length; slides[si].classList.add('on'); }, 7000);

/* Municipio inicial: enlace compartido > último elegido > Caucasia */
const pm = new URLSearchParams(location.search).get('m');
if (pm && pm.includes('|')) { [S.depto, S.muni] = pm.split('|'); }
else { const last = store.get('muni', null); if (Array.isArray(last) && last.length === 2) [S.depto, S.muni] = last; }

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
applyI18n();
renderMuniSelects();
renderAdoptados();
loadAll();
})();
