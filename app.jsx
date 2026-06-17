const { useState, useEffect, useRef } = React;

/* ─── DATA ─────────────────────────────────────────── */
const BRANDS = ['Spectra', 'Sea Recovery', 'Schenker', 'Village Marine', 'Parker', 'HRO', 'Katadyn', 'Idronautica'];

const BRAND_LOGOS = [
{ name: 'Spectra Watermakers', src: 'uploads/SPECTRA LOGO VECTOR.png', h: 36 },
{ name: 'Katadyn', src: 'uploads/KATDYN_LOGO_VECTOR.png', h: 32 },
{ name: 'Pentair', src: 'uploads/PENTAIR LOGO VECTOR.png', h: 38 },
{ name: 'FilmTec', src: 'uploads/FILMTEC LOGO VECTOR.png', h: 30 },
{ name: 'CruiseRO Water', src: 'uploads/CRUISE_RO LOGO VECTOR.png', h: 42 },
{ name: 'Cat Pumps', src: 'uploads/CAT PUMPS LOGO VECTOR.png', h: 44 },
{ name: 'General Pump', src: 'uploads/GENERAL_PUMP-removebg-preview.png', h: 48 },
{ name: 'March Pumps', src: 'uploads/LOGO VECTOR MARCH PUMPS.png', h: 44 },
{ name: 'WEG', src: 'uploads/LOGO VECTOR WEG.png', h: 38 },
{ name: 'Barrett', src: 'uploads/BARRET LOGO VECTOR.png', h: 36 }];


const SERVICES = [
{ icon: 'anchor', title: 'Marino', desc: 'Yates, veleros y embarcaciones de cualquier eslora. Salidas a marina incluidas.' },
{ icon: 'home', title: 'Residencial', desc: 'Instalación y mantenimiento para casas y comunidades en BCS.' },
{ icon: 'factory', title: 'Industrial', desc: 'Plantas de ósmosis inversa de alto volumen para hoteles y empresas.' }];


const WA_NUMBER = '526121400253';
const WA_MESSAGE = encodeURIComponent('Hola, necesito ayuda con mi watermaker.');
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;
const MAPS_LINK = 'https://maps.app.goo.gl/EPvF11c8RnEtGdNq5';
const ACCENT = '#0A4A6E';

const I18N = {
  en: {
    langCode: 'en',
    langLabel: 'ES',
    nav: [
      ['#servicios', 'Services'],
      ['#contacto', 'Contact'],
      ['#faq', 'FAQ']
    ],
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    hero: {
      title: <>The water you need,<br />when you need it most.</>,
      subtitle: 'Service, parts, and installation for watermakers on yachts, homes, and industrial systems in Baja California Sur.',
      contact: 'Contact now',
      services: 'View services',
      contactAria: 'Go to the contact section'
    },
    stats: [
      { value: 15, suffix: '+', label: 'Years of experience' },
      { value: 8, label: 'Authorized brands' },
      { value: 100, suffix: '+', label: 'Boats served' }
    ],
    logoStrip: 'Brands we distribute and service',
    services: {
      eyebrow: 'Services',
      title: 'How can we help?',
      subtitle: 'We serve marine, residential, and industrial systems across Baja California Sur.',
      items: [
        { icon: 'anchor', title: 'Marine', desc: 'Yachts, sailboats, and vessels of any size. Marina visits included.' },
        { icon: 'home', title: 'Residential', desc: 'Installation and maintenance for homes and communities in BCS.' },
        { icon: 'factory', title: 'Industrial', desc: 'High-volume reverse osmosis plants for hotels and businesses.' }
      ]
    },
    parts: {
      eyebrow: 'Parts',
      title: <>Parts in stock.<br />No waiting.</>,
      body: 'We keep the largest local inventory of watermaker parts in Baja California Sur, including membranes, pumps, filters, valves, seals, and more. If you need it today, we probably have it today.',
      cta: 'Check availability',
      imageAlt: 'Watermaker parts inventory at The Watermaker Store'
    },
    marine: {
      eyebrow: 'Marine service',
      title: 'We come to your vessel.',
      body: 'Visits to Marina de La Paz, Marina Palmira, and Puerto Escondido. On-board diagnostics and repairs without moving your yacht.',
      cta: 'Schedule visit',
      imageAlt: 'The Watermaker Store technician servicing a boat at the marina'
    },
    beforeAfter: {
      eyebrow: 'Diagnostics and repair',
      beforeTitle: 'Does your system look like this?',
      afterTitle: 'Ready to go back to work.',
      beforeBody: 'Do not worry. We have seen worse.',
      afterBody: 'Clean, calibrated, and ready for more hours.',
      tap: 'Tap to see the result',
      beforeBadge: 'BEFORE',
      afterBadge: 'AFTER',
      showBefore: 'View before',
      cta: 'I need this service',
      beforeAlt: 'Watermaker pump before service',
      afterAlt: 'Watermaker pump after service'
    },
    location: {
      eyebrow: 'Where to find us',
      title: 'Visit us in La Paz',
      note: 'We speak English',
      hours: 'Mon-Sat · 9:00-18:00',
      mapCta: 'Open in Google Maps',
      iframeTitle: 'The Watermaker Store location'
    },
    faq: {
      eyebrow: 'Frequently asked questions',
      title: 'What clients ask most',
      items: [
        { q: 'Which watermaker brands do you service?', a: 'We are an authorized service center for Spectra Watermakers, Sea Recovery, Schenker, Village Marine, Parker, HRO, Katadyn, Idronautica, Pentair, Cruise RO, FilmTec, Cat Pumps, General Pump, March Pumps, and WEG. If your brand is not listed, contact us. We can usually help.' },
        { q: 'Do you service boats outside La Paz?', a: 'Yes. We visit Marina de La Paz, Marina Palmira, Puerto Escondido, and projects across Baja California Sur. For remote locations, we coordinate logistics by WhatsApp.' },
        { q: 'How long does a typical service take?', a: 'Diagnostics are usually same day. Minor repairs usually take 1-2 days. Full overhauls usually take 3-5 days, depending on parts availability.' },
        { q: 'Do you keep parts in stock?', a: 'Yes. We keep a strong local inventory of membranes, pumps, filters, valves, seals, and more. If we do not have it, we source it through our manufacturer network.' },
        { q: 'How much does membrane replacement cost?', a: 'The cost depends on your watermaker model and membrane size. Send us the brand and model, or a photo of the plate, and we can quote accurately.' },
        { q: 'Do you service industrial and residential systems?', a: 'Yes. We install and maintain reverse osmosis systems for hotels, residential developments, ranches, and businesses across BCS, in addition to marine service.' },
        { q: 'Do you speak English?', a: 'Yes, we speak English fluently. We welcome cruisers and international clients, and have served boats from the US, Canada, and Europe for more than 15 years.' }
      ]
    },
    contact: {
      eyebrow: 'Direct contact',
      title: 'Leave your email and tell us what your watermaker needs.',
      body: 'We respond to service, parts, and installation requests in La Paz and Baja California Sur. If you are at a marina, we can also coordinate an on-board visit.',
      trust: 'We usually respond the same business day.',
      email: 'Email',
      phone: 'Phone number (optional)',
      message: 'Message',
      emailPlaceholder: 'you@email.com',
      phonePlaceholder: '+1 555 000 0000',
      messagePlaceholder: 'Brand, model, location, or what problem you are seeing.',
      preparing: 'Preparing verification...',
      verificationMissing: 'Verification unavailable.',
      submit: 'Send message',
      sending: 'Sending...',
      success: 'Message sent. We will reply soon.',
      validationEmail: 'Enter a valid email so we can reply.',
      validationPhone: 'Keep the phone number under 40 characters.',
      validationMessageShort: 'Tell us a little more so we can guide you well.',
      validationMessageLong: 'The message is too long. Keep it under 1500 characters.',
      validationConfig: 'The form is not configured yet. Contact us by WhatsApp.',
      validationTurnstile: 'Complete the verification to send the message.',
      turnstileError: 'We could not verify the form. Please try again.',
      configError: 'We could not prepare the form. Use WhatsApp while we review it.',
      serverFallback: 'We could not send your message. Try WhatsApp.'
    },
    footer: {
      blurb: '"Trust in every drop" - The authorized service center for leading watermaker brands in Baja California Sur.',
      services: 'Services',
      find: 'Find us',
      website: 'Website',
      speaks: 'We speak English',
      rights: 'All rights reserved.',
      place: 'La Paz, Baja California Sur, Mexico',
      serviceList: ['Marine & Nautical', 'Residential', 'Industrial', 'Parts', 'Installation', 'Diagnostics']
    },
    tweaks: {
      close: 'Close',
      accent: 'Accent color'
    },
    whatsappAria: 'Contact us by WhatsApp'
  },
  es: {
    langCode: 'es',
    langLabel: 'EN',
    nav: [
      ['#servicios', 'Servicios'],
      ['#contacto', 'Contacto'],
      ['#faq', 'FAQ']
    ],
    menuOpen: 'Abrir menu',
    menuClose: 'Cerrar menu',
    hero: {
      title: <>El agua que necesitas,<br />cuando mas la necesitas.</>,
      subtitle: 'Servicio, refacciones e instalacion de desaladores para yates, hogares e industria en Baja California Sur.',
      contact: 'Contactar ahora',
      services: 'Ver servicios',
      contactAria: 'Ir a la seccion de contacto'
    },
    stats: [
      { value: 15, suffix: '+', label: 'Anios de experiencia' },
      { value: 8, label: 'Marcas autorizadas' },
      { value: 100, suffix: '+', label: 'Embarcaciones atendidas' }
    ],
    logoStrip: 'Marcas que distribuimos y serviciamos',
    services: {
      eyebrow: 'Servicios',
      title: 'En que podemos ayudarte?',
      subtitle: 'Atendemos marino, residencial e industrial en toda Baja California Sur.',
      items: [
        { icon: 'anchor', title: 'Marino', desc: 'Yates, veleros y embarcaciones de cualquier eslora. Salidas a marina incluidas.' },
        { icon: 'home', title: 'Residencial', desc: 'Instalacion y mantenimiento para casas y comunidades en BCS.' },
        { icon: 'factory', title: 'Industrial', desc: 'Plantas de osmosis inversa de alto volumen para hoteles y empresas.' }
      ]
    },
    parts: {
      eyebrow: 'Refacciones',
      title: <>Partes en inventario.<br />Sin esperas.</>,
      body: 'Contamos con el mayor inventario local de refacciones para desaladores en Baja California Sur: membranas, bombas, filtros, valvulas, sellos y mas. Si lo necesitas hoy, probablemente lo tenemos hoy.',
      cta: 'Consultar disponibilidad',
      imageAlt: 'Inventario de refacciones para desaladores en The Watermaker Store'
    },
    marine: {
      eyebrow: 'Servicio marino',
      title: 'Vamos hasta tu embarcacion.',
      body: 'Salidas a Marina de La Paz, Marina Palmira y Puerto Escondido. Diagnostico y reparacion a bordo, sin mover tu yate.',
      cta: 'Agendar visita',
      imageAlt: 'Tecnico de The Watermaker Store dando servicio en marina'
    },
    beforeAfter: {
      eyebrow: 'Diagnostico y reparacion',
      beforeTitle: 'Tu equipo se ve asi?',
      afterTitle: 'Asi lo devolvemos.',
      beforeBody: 'No entres en panico. Lo hemos visto peor.',
      afterBody: 'Limpio, calibrado y listo para mas horas.',
      tap: 'Toca para ver el resultado',
      beforeBadge: 'ANTES',
      afterBadge: 'DESPUES',
      showBefore: 'Ver antes',
      cta: 'Quiero este servicio',
      beforeAlt: 'Bomba de desalador antes del servicio',
      afterAlt: 'Bomba de desalador despues del servicio'
    },
    location: {
      eyebrow: 'Donde encontrarnos',
      title: 'Visitanos en La Paz',
      note: 'Hablamos ingles',
      hours: 'Lun-Sab · 9:00-18:00 h',
      mapCta: 'Abrir en Google Maps',
      iframeTitle: 'Ubicacion The Watermaker Store'
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Lo que mas nos preguntan',
      items: [
        { q: 'Que marcas de desaladores atienden?', a: 'Somos centro de servicio autorizado para Spectra Watermakers, Sea Recovery, Schenker, Village Marine, Parker, HRO, Katadyn, Idronautica, Pentair, Cruise RO, FilmTec, Cat Pumps, General Pump, March Pumps y WEG. Si tu marca no esta en la lista, contactanos. Casi siempre podemos ayudar.' },
        { q: 'Atienden fuera de La Paz?', a: 'Si. Hacemos salidas a Marina de La Paz, Marina Palmira, Puerto Escondido y proyectos en todo Baja California Sur. Para ubicaciones lejanas coordinamos logistica por WhatsApp.' },
        { q: 'Cuanto tarda un servicio tipico?', a: 'El diagnostico normalmente es el mismo dia. Reparaciones menores suelen tomar 1-2 dias. Overhauls completos suelen tomar 3-5 dias, dependiendo de la disponibilidad de refacciones.' },
        { q: 'Tienen refacciones en stock?', a: 'Si. Tenemos inventario local de membranas, bombas, filtros, valvulas, sellos y mas. Lo que no tenemos, lo conseguimos con nuestra red de fabricantes.' },
        { q: 'Cuanto cuesta reemplazar una membrana?', a: 'El costo depende del modelo y tamano de tu watermaker. Envia marca y modelo, o una foto de la placa, y podemos cotizar con precision.' },
        { q: 'Dan servicio a sistemas industriales y residenciales?', a: 'Si. Instalamos y damos mantenimiento a plantas de osmosis inversa para hoteles, desarrollos residenciales, ranchos y empresas en BCS, ademas del servicio marino.' },
        { q: 'Do you speak English?', a: 'Yes, we speak English fluently. Welcome to all cruisers and international clients.' }
      ]
    },
    contact: {
      eyebrow: 'Contacto directo',
      title: 'Dejanos tu correo y cuentanos que necesita tu watermaker.',
      body: 'Respondemos solicitudes de servicio, refacciones e instalacion en La Paz y Baja California Sur. Si estas en marina, tambien podemos coordinar una visita a bordo.',
      trust: 'Respondemos normalmente el mismo dia habil.',
      email: 'Correo electronico',
      phone: 'Telefono (opcional)',
      message: 'Mensaje',
      emailPlaceholder: 'tu@email.com',
      phonePlaceholder: '+52 612 000 0000',
      messagePlaceholder: 'Marca, modelo, ubicacion o que problema estas viendo.',
      preparing: 'Preparando verificacion...',
      verificationMissing: 'Verificacion no disponible.',
      submit: 'Enviar mensaje',
      sending: 'Enviando...',
      success: 'Mensaje enviado. Te responderemos pronto.',
      validationEmail: 'Escribe un correo valido para poder responderte.',
      validationPhone: 'Mantén el telefono en menos de 40 caracteres.',
      validationMessageShort: 'Cuentanos un poco mas para poder orientarte bien.',
      validationMessageLong: 'El mensaje es muy largo. Resume la solicitud en menos de 1500 caracteres.',
      validationConfig: 'El formulario aun no esta configurado. Contactanos por WhatsApp.',
      validationTurnstile: 'Completa la verificacion para enviar el mensaje.',
      turnstileError: 'No se pudo verificar el formulario. Intenta otra vez.',
      configError: 'No pudimos preparar el formulario. Intenta por WhatsApp mientras lo revisamos.',
      serverFallback: 'No pudimos enviar tu mensaje. Intenta por WhatsApp.'
    },
    footer: {
      blurb: '"Trust in every drop" - El centro de servicio autorizado para las principales marcas de desaladores en Baja California Sur.',
      services: 'Servicios',
      find: 'Encuentranos',
      website: 'Sitio web',
      speaks: 'Hablamos ingles',
      rights: 'Todos los derechos reservados.',
      place: 'La Paz, Baja California Sur, Mexico',
      serviceList: ['Marino & Nautico', 'Residencial', 'Industrial', 'Refacciones', 'Instalacion', 'Diagnostico']
    },
    tweaks: {
      close: 'Cerrar',
      accent: 'Color de acento'
    },
    whatsappAria: 'Contactanos por WhatsApp'
  }
};

/* ─── ICONS ─────────────────────────────────────────── */
function Icon({ name, size = 20, style: extStyle = {}, className = '' }) {
  const base = { width: size, height: size, strokeWidth: 1.75, fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', display: 'block', flexShrink: 0, ...extStyle };
  const ns = { ...base, strokeWidth: 1.5 };
  const icons = {
    anchor: <svg viewBox="0 0 24 24" style={base} className={className}><circle cx="12" cy="5" r="3" /><line x1="12" y1="8" x2="12" y2="22" /><path d="M5 15H2a10 10 0 0 0 20 0h-3" /><line x1="5" y1="8" x2="19" y2="8" /></svg>,
    home: <svg viewBox="0 0 24 24" style={base} className={className}><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><polyline points="9 21 9 12 15 12 15 21" /></svg>,
    factory: <svg viewBox="0 0 24 24" style={base} className={className}><path d="M2 20h20" /><path d="M2 8l7 4V8l7 4V4l6 4v12H2V8z" /></svg>,
    mapPin: <svg viewBox="0 0 24 24" style={base} className={className}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    phone: <svg viewBox="0 0 24 24" style={base} className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.36 2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    clock: <svg viewBox="0 0 24 24" style={base} className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    globe: <svg viewBox="0 0 24 24" style={base} className={className}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    fb: <svg viewBox="0 0 24 24" style={ns} className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
    ig: <svg viewBox="0 0 24 24" style={ns} className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>,
    chevron: <svg viewBox="0 0 24 24" style={base} className={className}><polyline points="9 18 15 12 9 6" /></svg>,
    star: <svg viewBox="0 0 24 24" style={{ ...base, fill: 'currentColor' }} className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    shield: <svg viewBox="0 0 24 24" style={base} className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    menu: <svg viewBox="0 0 24 24" style={base} className={className}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
    x: <svg viewBox="0 0 24 24" style={base} className={className}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    wa: <svg viewBox="0 0 32 32" style={{ width: size, height: size, display: 'block', flexShrink: 0, ...extStyle }} className={className}><path fill="currentColor" d="M16 3C9.37 3 4 8.37 4 15c0 2.39.67 4.63 1.83 6.54L4 29l7.67-1.8A12.9 12.9 0 0 0 16 28c6.63 0 12-5.37 12-12S22.63 3 16 3zm0 2c5.52 0 10 4.48 10 10S21.52 25 16 25c-1.9 0-3.67-.53-5.18-1.45L10 23.2l-1.38.32.34-1.34-.58-.87A9.94 9.94 0 0 1 6 15c0-5.52 4.48-10 10-10zm-3.06 5.06c-.26 0-.68.1-.94.38-.26.29-1 .98-1 2.38s1.02 2.76 1.16 2.95c.14.19 1.96 3.08 4.82 4.2 2.37.94 2.85.76 3.37.71.52-.05 1.67-.68 1.91-1.34.24-.66.24-1.23.17-1.34-.07-.1-.26-.17-.52-.29-.26-.12-1.53-.76-1.77-.84-.24-.1-.41-.14-.58.14-.17.26-.67.84-.82 1.02-.15.17-.3.19-.55.07-.26-.12-1.09-.4-2.07-1.28-.76-.68-1.28-1.52-1.43-1.78-.14-.26-.01-.4.11-.52.11-.11.26-.29.38-.43.12-.14.17-.24.24-.4.07-.17.04-.31-.02-.43-.07-.12-.58-1.38-.8-1.88-.21-.48-.43-.43-.58-.43h-.5z" /></svg>
  };
  return icons[name] || null;
}

/* ─── HOOKS ─────────────────────────────────────────── */
function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [threshold]);
  return scrolled;
}

function AnimatedStat({ value, suffix = '', label }) {
  const statRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const node = statRef.current;
    if (!node || started) return;

    if (!('IntersectionObserver' in window)) {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.45 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let frameId;
    const duration = 1400;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [started, value]);

  return (
    <div ref={statRef} style={{ textAlign: 'center', padding: '0 16px' }}>
      <p style={{ fontSize: 28, fontWeight: 700, color: '#0A4A6E', margin: 0, lineHeight: 1 }}>{displayValue}{suffix}</p>
      <p style={{ fontSize: 11, color: '#9CA3AF', margin: '5px 0 0', fontWeight: 500 }}>{label}</p>
    </div>);
}

/* ─── NAV ───────────────────────────────────────────── */
function LanguageToggle({ language, onToggle, compact = false }) {
  const nextLabel = language === 'en' ? 'ES' : 'EN';
  return (
    <button
      type="button"
      onClick={onToggle}
      className="focus-ring"
      aria-label={language === 'en' ? 'Switch to Spanish' : 'Cambiar a ingles'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: compact ? 38 : 34,
        padding: compact ? '8px 12px' : '7px 11px',
        borderRadius: 8,
        border: '1px solid rgba(10,74,110,0.22)',
        background: '#E0F2FE',
        color: '#04101E',
        fontSize: compact ? 13 : 12,
        fontWeight: 800,
        letterSpacing: '0.04em',
        cursor: 'pointer'
      }}>
      {nextLabel}
    </button>
  );
}

function Nav({ language, onToggleLanguage, copy }) {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 14, left: 14, right: 14,
        zIndex: 100,
        maxWidth: 1180,
        margin: '0 auto',
        borderRadius: 22,
        background: scrolled
          ? 'rgba(255,255,255,0.72)'
          : 'rgba(8,20,36,0.52)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: scrolled
          ? '1px solid rgba(0,0,0,0.06)'
          : '1px solid rgba(255,255,255,0.12)',
        boxShadow: scrolled
          ? '0 10px 32px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)'
          : '0 12px 40px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
        transition: 'background .35s, border-color .35s, box-shadow .35s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', height: 72, letterSpacing: "0.2px" }}>
          {/* Logo */}
          <img
            src="uploads/logo.webp"
            alt="The Watermaker Store"
            style={{ objectFit: "contain", margin: "0px", height: "54px", width: "auto", maxWidth: 190, display: "block" }} />


          {/* Desktop links */}
          <div className="nav-links" style={{ color: scrolled ? '#374151' : 'rgba(255,255,255,0.90)' }}>
            {copy.nav.map(([href, label]) =>
            <a key={label} href={href} className="focus-ring" style={{
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              color: 'inherit', transition: 'opacity 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.65'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              {label}</a>
            )}
            <LanguageToggle language={language} onToggle={onToggleLanguage} />
          </div>

          {/* Hamburger — visible only on mobile */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
            style={{
              border: 'none', background: 'none', cursor: 'pointer',
              color: scrolled ? '#0C0A09' : '#fff', padding: 4,
              display: 'flex', alignItems: 'center'
            }}>
            
            <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen &&
      <div style={{
        position: 'fixed', top: 96, left: 14, right: 14, zIndex: 99,
        maxWidth: 1180, margin: '0 auto',
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 18,
        padding: '8px 18px 14px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.14)'
      }}>
          {copy.nav.map(([href, label]) =>
        <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{
          display: 'block', padding: '13px 0',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          fontSize: 15, fontWeight: 600, textDecoration: 'none', color: '#0C0A09'
        }}>{label}</a>
        )}
          <div style={{ paddingTop: 12 }}>
            <LanguageToggle language={language} onToggle={onToggleLanguage} compact />
          </div>
        </div>
      }
    </>);

}

/* ─── HERO ───────────────────────────────────────────── */
function Hero({ accent, copy }) {
  return (
    <header style={{ position: 'relative', overflow: 'hidden', minHeight: '100svh', background: '#04101e' }} className="hero-min-h">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="uploads/hf_20260424_054626_d1548f4a-e917-4df5-967b-f9c7851dc9aa.webp"
        aria-hidden="true">
          <source src="uploads/hf_20260424_055119_2771ce86-1ba9-44f0-a6ff-a8ccf8b6f402.webm" type="video/webm" />
      </video>

      {/* Radial vignette for AI-landing depth */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(3,12,24,0.30) 0%, rgba(3,12,24,0.62) 55%, rgba(3,12,24,0.90) 100%)' }} />
      {/* Subtle noise / grid overlay for premium feel */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.6, pointerEvents: 'none' }} />

      <div className="hero-content section-inner" style={{ position: 'relative', zIndex: 1, minHeight: '100svh', padding: '112px 24px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }}>

        {/* H1 */}
        <h1 className="hero-h1" style={{
          fontSize: 40, fontWeight: 700, color: '#fff',
          lineHeight: 1.04,
          margin: '0 0 20px',
          maxWidth: 760,
          letterSpacing: '-0.028em',
          textShadow: '0 2px 28px rgba(0,0,0,0.45)'
        }}>
          {copy.hero.title}
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{
          fontSize: 16, color: 'rgba(255,255,255,0.68)',
          margin: '0 0 38px', fontWeight: 400, lineHeight: 1.55,
          maxWidth: 540
        }}>
          {copy.hero.subtitle}
        </p>

        {/* CTA group */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start', alignItems: 'center' }}>
          {/* Primary contact CTA */}
          <a href="#contacto" className="focus-ring"
            aria-label={copy.hero.contactAria}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 24px', borderRadius: 10,
              background: '#38BDF8', color: '#04101E',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(56,189,248,0.34)',
              transition: 'transform .18s, box-shadow .18s, background .18s',
              minHeight: 50
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(56,189,248,0.48)'; e.currentTarget.style.background = '#7DD3FC'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(56,189,248,0.34)'; e.currentTarget.style.background = '#38BDF8'; }}>
            {copy.hero.contact}
            <Icon name="chevron" size={18} />
          </a>

          {/* Secondary ghost */}
          <a href="#servicios" className="focus-ring"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 22px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.20)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#fff', fontWeight: 600, fontSize: 15,
              textDecoration: 'none',
              transition: 'background .18s, border-color .18s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}>
            {copy.hero.services}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </a>
        </div>

      </div>
    </header>);

}

/* ─── BEFORE / AFTER ───────────────────────────────── */
function BeforeAfter({ copy }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <section style={{ padding: '56px 20px', background: '#fff', borderTop: '1px solid #E7E5E4' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#0A4A6E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{copy.beforeAfter.eyebrow}</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0C0A09', margin: '0 0 10px' }}>
            {revealed ? copy.beforeAfter.afterTitle : copy.beforeAfter.beforeTitle}
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>
            {revealed ? copy.beforeAfter.afterBody : copy.beforeAfter.beforeBody}
          </p>
        </div>

        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto', borderRadius: 14, overflow: 'hidden', boxShadow: '0 6px 28px rgba(0,0,0,0.13)', cursor: revealed ? 'default' : 'pointer', height: 380 }}
        onClick={() => !revealed && setRevealed(true)}>
          
          {/* ANTES */}
          <img
            src="uploads/Imagen de WhatsApp 2024-02-10 a las 12.42.08_915f384d.jpg"
            alt={copy.beforeAfter.beforeAlt}
            className="ba-img"
            loading="lazy"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: revealed ? 0 : 1, transition: 'opacity 0.7s ease' }} />
          
          {/* DESPUÉS */}
          <img
            src="uploads/Imagen de WhatsApp 2024-02-10 a las 14.56.36_511953ba.jpg"
            alt={copy.beforeAfter.afterAlt}
            className="ba-img"
            loading="lazy"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: revealed ? 1 : 0, transition: 'opacity 0.7s ease' }} />
          

          {/* Overlay CTA — visible solo antes de revelar */}
          {!revealed &&
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(4,14,28,0.80) 0%, rgba(4,14,28,0.20) 60%, transparent 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center',
            padding: '28px 20px'
          }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 50, background: '#fff', color: '#0C0A09', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 12px rgba(0,0,0,0.15)', animation: 'pulse-btn 2s ease-in-out infinite' }}>
                {copy.beforeAfter.tap}
              </div>
            </div>
          }

          {/* Badge */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            padding: '4px 10px', borderRadius: 6,
            background: revealed ? '#22c55e' : '#ef4444',
            color: '#fff', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.04em', transition: 'background 0.5s'
          }}>
            {revealed ? copy.beforeAfter.afterBadge : copy.beforeAfter.beforeBadge}
          </div>
        </div>

        {revealed &&
        <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
            onClick={() => setRevealed(false)}
            style={{ background: 'none', border: '1px solid #E7E5E4', borderRadius: 8, padding: '8px 18px', fontSize: 13, color: '#6B7280', cursor: 'pointer' }}>
            {copy.beforeAfter.showBefore}</button>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 12, padding: '9px 18px', borderRadius: 8, background: '#25D366', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
            
              <Icon name="wa" size={16} />
              {copy.beforeAfter.cta}
            </a>
          </div>
        }
      </div>
      <style>{`@keyframes pulse-btn { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </section>);

}

/* ─── BLOG CAROUSEL ─────────────────────────────────── */
/* ─── APP ─────────────────────────────────────────────── */
function ContactSection({ accent, copy }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [siteKey, setSiteKey] = useState('');
  const [configStatus, setConfigStatus] = useState('loading');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formState, setFormState] = useState({ status: 'idle', message: '' });
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/contact-config', { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (cancelled) return;
        if (data?.siteKey) {
          setConfigStatus('ready');
          setSiteKey(data.siteKey);
        } else {
          setConfigStatus('missing');
          setFormState({
            status: 'error',
            message: copy.contact.validationConfig
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setConfigStatus('error');
          setFormState({
            status: 'error',
            message: copy.contact.configError
          });
        }
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return;

    let cancelled = false;

    function renderTurnstile() {
      if (cancelled || !window.turnstile || !turnstileRef.current || widgetIdRef.current !== null) return;

      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          setTurnstileToken(token);
          setFormState((state) => state.status === 'error' ? { status: 'idle', message: '' } : state);
        },
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => {
          setTurnstileToken('');
          setFormState({ status: 'error', message: copy.contact.turnstileError });
        }
      });
    }

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const existingScript = document.querySelector('script[data-turnstile-script="true"]');
      if (existingScript) {
        existingScript.addEventListener('load', renderTurnstile, { once: true });
      } else {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.turnstileScript = 'true';
        script.addEventListener('load', renderTurnstile, { once: true });
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  function resetTurnstile() {
    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
    setTurnstileToken('');
  }

  function validateForm() {
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) return copy.contact.validationEmail;
    if (cleanPhone.length > 40) return copy.contact.validationPhone;
    if (cleanMessage.length < 10) return copy.contact.validationMessageShort;
    if (cleanMessage.length > 1500) return copy.contact.validationMessageLong;
    if (configStatus !== 'ready') return copy.contact.validationConfig;
    if (!turnstileToken) return copy.contact.validationTurnstile;
    return '';
  }

  function clearErrorOnEdit() {
    if (formState.status === 'error') setFormState({ status: 'idle', message: '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormState({ status: 'error', message: validationError });
      return;
    }

    setFormState({ status: 'loading', message: copy.contact.sending });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          turnstileToken
        })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || copy.contact.serverFallback);
      }

      setEmail('');
      setPhone('');
      setMessage('');
      setFormState({ status: 'success', message: copy.contact.success });
      resetTurnstile();
    } catch (err) {
      setFormState({ status: 'error', message: err.message || copy.contact.serverFallback });
      resetTurnstile();
    }
  }

  const isLoading = formState.status === 'loading';
  const helperColor = formState.status === 'success' ? '#166534' : formState.status === 'error' ? '#B91C1C' : '#6B7280';

  return (
    <section id="contacto" style={{ padding: '60px 20px 64px', background: '#F4F7F8', borderTop: '1px solid #DDE7EA' }}>
      <div className="section-inner">
        <div className="contact-grid">
          <div style={{
            background: '#0A4A6E',
            color: '#fff',
            padding: '34px 28px',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 32,
            minHeight: 420
          }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.70)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
                {copy.contact.eyebrow}
              </p>
              <h2 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.12, margin: '0 0 16px', maxWidth: 520 }}>
                {copy.contact.title}
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', margin: 0, maxWidth: 560 }}>
                {copy.contact.body}
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', margin: '18px 0 0', fontWeight: 700 }}>
                {copy.contact.trust}
              </p>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
              <a href="tel:+526121400253" className="focus-ring"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', fontSize: 14 }}>
                <Icon name="phone" size={18} />+52 (612) 140-0253
              </a>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="focus-ring"
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#fff', textDecoration: 'none', fontSize: 14, lineHeight: 1.5 }}>
                <span style={{ marginTop: 2 }}><Icon name="mapPin" size={18} /></span>
                Mariano Abasolo #2865, col. 5 de Febrero<br />La Paz, B.C.S.
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="focus-ring"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 9,
                  width: 'fit-content',
                  padding: '12px 18px',
                  borderRadius: 8,
                  background: '#25D366',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none'
                }}>
                <Icon name="wa" size={18} />WhatsApp
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{
            background: '#fff',
            border: '1px solid #DDE7EA',
            borderRadius: 8,
            padding: '28px',
            boxShadow: '0 18px 50px rgba(10,74,110,0.10)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}>
            <div>
              <label htmlFor="contact-email" style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0C0A09', marginBottom: 8 }}>
                {copy.contact.email}
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); clearErrorOnEdit(); }}
                autoComplete="email"
                required
                disabled={isLoading}
                placeholder={copy.contact.emailPlaceholder}
                style={{
                  width: '100%',
                  minHeight: 48,
                  border: '1px solid #D1D5DB',
                  borderRadius: 8,
                  padding: '12px 14px',
                  font: 'inherit',
                  color: '#0C0A09',
                  outlineColor: accent,
                  background: isLoading ? '#F9FAFB' : '#fff'
                }} />
            </div>

            <div>
              <label htmlFor="contact-phone" style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0C0A09', marginBottom: 8 }}>
                {copy.contact.phone}
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(event) => { setPhone(event.target.value); clearErrorOnEdit(); }}
                autoComplete="tel"
                disabled={isLoading}
                placeholder={copy.contact.phonePlaceholder}
                maxLength={40}
                style={{
                  width: '100%',
                  minHeight: 48,
                  border: '1px solid #D1D5DB',
                  borderRadius: 8,
                  padding: '12px 14px',
                  font: 'inherit',
                  color: '#0C0A09',
                  outlineColor: accent,
                  background: isLoading ? '#F9FAFB' : '#fff'
                }} />
            </div>

            <div>
              <label htmlFor="contact-message" style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0C0A09', marginBottom: 8 }}>
                {copy.contact.message}
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(event) => { setMessage(event.target.value); clearErrorOnEdit(); }}
                required
                disabled={isLoading}
                rows={6}
                maxLength={1500}
                placeholder={copy.contact.messagePlaceholder}
                style={{
                  width: '100%',
                  minHeight: 148,
                  resize: 'vertical',
                  border: '1px solid #D1D5DB',
                  borderRadius: 8,
                  padding: '12px 14px',
                  font: 'inherit',
                  color: '#0C0A09',
                  lineHeight: 1.55,
                  outlineColor: accent,
                  background: isLoading ? '#F9FAFB' : '#fff'
                }} />
              <p style={{ fontSize: 12, color: '#6B7280', margin: '7px 0 0', textAlign: 'right' }}>{message.length}/1500</p>
            </div>

            <div ref={turnstileRef} style={{ minHeight: 65, display: 'flex', alignItems: 'center' }}>
              {configStatus === 'loading' && <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{copy.contact.preparing}</p>}
              {configStatus !== 'loading' && configStatus !== 'ready' &&
                <p style={{ fontSize: 13, color: '#B91C1C', margin: 0 }}>{copy.contact.verificationMissing}</p>
              }
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="focus-ring"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                minHeight: 50,
                border: 'none',
                borderRadius: 8,
                background: isLoading ? '#6B7280' : accent,
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                cursor: isLoading ? 'wait' : 'pointer'
              }}>
              {isLoading ? copy.contact.sending : copy.contact.submit}
            </button>

            {formState.message &&
              <p role="status" style={{ fontSize: 13, lineHeight: 1.5, color: helperColor, margin: 0, fontWeight: 600 }}>
                {formState.message}
              </p>
            }
          </form>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('site-language') === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  });
  const [tweaks, setTweaks] = useState(/*EDITMODE-BEGIN*/{
    "accentColor": "#0A4A6E"
  } /*EDITMODE-END*/);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('site-language', language);
    } catch {
      /* localStorage can be unavailable in restricted contexts. */
    }
    document.documentElement.lang = language;
  }, [language]);

  function setTweak(key, val) {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  }

  const ac = tweaks.accentColor;
  const copy = I18N[language];
  const stats = copy.stats;
  const toggleLanguage = () => setLanguage((current) => current === 'en' ? 'es' : 'en');

  return (
    <div style={{ background: '#FAFAF9', minHeight: '100vh' }}>

      {/* ── NAV ──────────────────────────────────── */}
      <Nav language={language} onToggleLanguage={toggleLanguage} copy={copy} />

      {/* ── HERO ─────────────────────────────────── */}
      <Hero accent={ac} copy={copy} />

      {/* ── STATS STRIP ─────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E7E5E4' }}>
        <div className="section-inner" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', padding: '22px 0', width: '100%', maxWidth: 640, justifyContent: 'space-around', gap: '12px 0' }}>
            {stats.map((stat) =>
            <AnimatedStat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
            )}
          </div>
        </div>
      </div>

      {/* ── LOGO CAROUSEL ────────────────────── */}
      <section style={{ borderTop: '1px solid #E7E5E4', borderBottom: '1px solid #E7E5E4', padding: '28px 0', background: '#fff' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.09em', textAlign: 'center', marginBottom: 20 }}>
          {copy.logoStrip}
        </p>
        <div className="logo-strip">
          <div className="logo-track">
            {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, i) =>
            <div key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 160, height: 60, margin: '0 20px' }}>
                <img
                src={logo.src}
                alt={logo.name}
              loading="lazy"
              decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.6, transition: 'filter 0.2s, opacity 0.2s' }}
                onMouseEnter={(e) => {e.target.style.filter = 'grayscale(0%)';e.target.style.opacity = '1';}}
                onMouseLeave={(e) => {e.target.style.filter = 'grayscale(100%)';e.target.style.opacity = '0.6';}} />
              
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ─────────────────────────── */}
      <section id="servicios" style={{ padding: '48px 20px' }}>
        <div className="section-inner">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0C0A09', marginBottom: 6, textAlign: 'center' }}>
            {copy.services.title}
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24, marginTop: 0 }}>
            {copy.services.subtitle}
          </p>
          <div className="services-grid">
            {copy.services.items.map((s) =>
            <div key={s.title} style={{
              padding: '22px 18px', borderRadius: 12,
              border: '1px solid #E7E5E4', background: '#fff',
              display: 'flex', flexDirection: 'column', gap: 10
            }}>
                <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: ac + '14', color: ac,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                  <Icon name={s.icon} size={20} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0C0A09', margin: 0 }}>{s.title}</p>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── REFACCIONES ─────────────────────────── */}
      <section style={{ background: '#F9FAFB', borderTop: '1px solid #E7E5E4', padding: '56px 20px' }}>
        <div className="section-inner">
          <div className="refacciones-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0A4A6E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{copy.parts.eyebrow}</p>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0C0A09', margin: '0 0 14px', lineHeight: 1.2 }}>
                {copy.parts.title}
              </h2>
              <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.65, margin: '0 0 24px' }}>
                {copy.parts.body}
              </p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 8, background: '#0A4A6E', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#083A56'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0A4A6E'}>
                
                <Icon name="phone" size={16} />
                {copy.parts.cta}
              </a>
            </div>
            <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
              <img
                src="uploads/Imagen de WhatsApp 2024-03-01 a las 13.38.37_be16fee0.jpg"
                alt={copy.parts.imageAlt}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: 320, objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              
            </div>
          </div>
        </div>
      </section>

      {/* ── VAMOS A LA MARINA ───────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 360 }}>
        <img
          src="uploads/hero-residential.webp"
          alt={copy.marine.imageAlt}
          loading="lazy"
          decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,14,28,0.85) 0%, rgba(4,14,28,0.40) 60%, rgba(4,14,28,0.10) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 1, padding: '64px 24px' }}>
          <div style={{ maxWidth: 420 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{copy.marine.eyebrow}</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 14px', lineHeight: 1.2 }}>
              {copy.marine.title}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: '0 0 28px' }}>
              {copy.marine.body}
            </p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 22px', borderRadius: 9, background: 'rgba(37,211,102,0.18)', border: '1.5px solid rgba(37,211,102,0.55)', backdropFilter: 'blur(6px)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'background 0.2s' }}
            onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(37,211,102,0.32)';}}
            onMouseLeave={(e) => {e.currentTarget.style.background = 'rgba(37,211,102,0.18)';}}>
              
              <Icon name="wa" size={20} />
              {copy.marine.cta}
            </a>
          </div>
        </div>
      </section>

      {/* ── ANTES / DESPUÉS ─────────────────────── */}
      <BeforeAfter copy={copy} />


      {/* ── UBICACIÓN ────────────────────────── */}
      <section id="ubicacion" style={{ borderTop: '1px solid #E7E5E4' }}>
        <div className="section-inner">
          <div className="map-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', alignItems: 'stretch' }}>

            {/* Info card */}
            <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0A4A6E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{copy.location.eyebrow}</p>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0C0A09', margin: '0 0 6px' }}>{copy.location.title}</h2>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>{copy.location.note}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#374151', textDecoration: 'none', fontSize: 14, lineHeight: 1.5 }}>
                  <span style={{ marginTop: 2, color: '#0A4A6E', flexShrink: 0 }}><Icon name="mapPin" size={18} /></span>
                  <span>Mariano Abasolo #2865, col. 5 de Febrero<br />23060 La Paz, B.C.S., México</span>
                </a>
                <a href="tel:+526121400253"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#374151', textDecoration: 'none', fontSize: 14 }}>
                  <span style={{ color: '#0A4A6E', flexShrink: 0 }}><Icon name="phone" size={18} /></span>
                  +52 (612) 140-0253
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151' }}>
                  <span style={{ color: '#0A4A6E', flexShrink: 0 }}><Icon name="clock" size={18} /></span>
                  {copy.location.hours}
                </div>
              </div>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 8, background: '#0A4A6E', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', alignSelf: 'flex-start', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='#083A56'}
                onMouseLeave={e => e.currentTarget.style.background='#0A4A6E'}
              >
                <Icon name="mapPin" size={16} />
                {copy.location.mapCta}
              </a>
            </div>

            {/* Map iframe */}
            <div style={{ minHeight: 320, background: '#E7E5E4' }}>
              <iframe
                title={copy.location.iframeTitle}
                src="https://maps.google.com/maps?q=Mariano+Abasolo+2865,+La+Paz,+Baja+California+Sur,+Mexico&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%" height="100%"
                style={{ border: 0, minHeight: 320, display: 'block' }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </section>

            {/* ── BLOG ─────────────────────────────────── */}
      <ContactSection accent={ac} copy={copy} />

      {/* ── FAQ ──────────────────────────────────── */}
      <section id="faq" style={{ padding: '48px 20px 56px', background: '#fff', borderTop: '1px solid #E7E5E4' }}>
        <div className="section-inner" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#0A4A6E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{copy.faq.eyebrow}</p>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0C0A09', margin: 0 }}>{copy.faq.title}</h2>
          </div>

          {copy.faq.items.map((item, i) => (
            <details key={i} className="faq-item">
              <summary>{item.q}</summary>
              <div className="faq-answer">{item.a}</div>
            </details>
          ))}

        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer style={{ padding: '48px 20px 36px', background: "rgb(10, 74, 110)", color: "rgb(255, 255, 255)" }}>
        <div className="section-inner">
          <div className="footer-grid">

            {/* Col 1: branding + contacto */}
            <div>
              <img
                src="uploads/logo.webp"
                alt="The Watermaker Store"
                loading="lazy"
                decoding="async"
                style={{ height: 52, width: 'auto', marginBottom: 20, display: 'block' }} />
              
              <p style={{ fontSize: 13, color: '#fff', marginBottom: 20, marginTop: 0, lineHeight: 1.6 }}>
                {copy.footer.blurb}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="focus-ring"
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#fff', textDecoration: 'none', fontSize: 13, lineHeight: 1.5 }}>
                  <span style={{ marginTop: 1 }}><Icon name="mapPin" size={15} /></span>
                  Mariano Abasolo #2865, col. 5 de Febrero<br />23060 La Paz, B.C.S., México
                </a>
                <a href="tel:+526121400253" className="focus-ring"
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', textDecoration: 'none', fontSize: 13 }}>
                  <Icon name="phone" size={15} />+52 (612) 140-0253
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#fff' }}>
                  <Icon name="clock" size={15} />{copy.location.hours}
                </div>
              </div>
            </div>

            {/* Col 2: servicios */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                {copy.footer.services}
              </p>
              {copy.footer.serviceList.map((s) =>
              <p key={s} style={{ fontSize: 13, color: '#fff', margin: '0 0 8px' }}>{s}</p>
              )}
            </div>

            {/* Col 3: redes + CTA */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                {copy.footer.find}
              </p>
              {[
              { icon: 'fb', label: 'Facebook', href: 'https://www.facebook.com/TheWaterMakerStore' },
              { icon: 'ig', label: 'Instagram', href: 'https://instagram.com/the_watermaker_guys' },
              { icon: 'globe', label: copy.footer.website, href: 'https://www.thewatermakerstore.com.mx/' }].
              map((l) =>
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="focus-ring"
              style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', textDecoration: 'none', fontSize: 13, marginBottom: 12, transition: 'opacity 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                
                  <Icon name={l.icon} size={15} />{l.label}
                </a>
              )}
              <p style={{ fontSize: 12, color: '#fff', marginTop: 10 }}>
                {copy.footer.speaks}
              </p>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="footer-bottom" style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <p style={{ fontSize: 11, color: '#fff', margin: 0 }}>
              © {new Date().getFullYear()} The Watermaker Store. {copy.footer.rights}
            </p>
            <p style={{ fontSize: 11, color: '#fff', margin: 0 }}>{copy.footer.place}</p>
          </div>
        </div>
      </footer>

      {/* ── TWEAKS PANEL ─────────────────────────── */}
      {tweaksVisible &&
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
        background: '#fff', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        border: '1px solid #E7E5E4', padding: '16px', width: 240,
        fontFamily: "'DM Sans', sans-serif", fontSize: 13
      }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 700, color: '#0C0A09' }}>Tweaks</span>
            <button onClick={() => {setTweaksVisible(false);window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');}}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 20, lineHeight: 1 }} aria-label="Cerrar">×</button>
          </div>
          <label style={{ display: 'block', marginBottom: 14 }}>
            <span style={{ display: 'block', fontSize: 11, color: '#6B7280', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color de acento</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="color" value={tweaks.accentColor} onChange={(e) => setTweak('accentColor', e.target.value)}
            style={{ width: 32, height: 28, border: 'none', cursor: 'pointer', borderRadius: 4, padding: 0 }} />
              <span style={{ fontSize: 12, color: '#6B7280' }}>{tweaks.accentColor}</span>
            </div>
          </label>
        </div>
      }

      {/* ── FLOATING WHATSAPP ─────────────────── */}
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
        className="wa-float focus-ring"
        aria-label="Contáctanos por WhatsApp">
        <Icon name="wa" size={30} />
      </a>

    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

