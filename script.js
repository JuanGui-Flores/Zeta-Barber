document.addEventListener('DOMContentLoaded', () => {
  // 1. AÑO AUTOMÁTICO EN EL FOOTER
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. CONFIGURACIÓN DE FECHAS MÍNIMAS EN EL FORMULARIO DE RESERVA
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = localDate;
  }

  // 3. ENVÍO DE FORMULARIO A WHATSAPP
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const WHATSAPP_NUMBER = '5492644043349';
    
    bookingForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('name').value.trim();
      const barber = document.getElementById('barber') ? document.getElementById('barber').value : '';
      const service = document.getElementById('service').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      
      const details = [
        `Hola, ZETA BARBER. Soy ${name}.`,
        barber && barber !== 'Sin preferencia' ? `Barbero de preferencia: ${barber}.` : '',
        `Quiero consultar por: ${service}.`,
        date ? `Día preferido: ${date}.` : '',
        time ? `Horario preferido: ${time}.` : '',
        '¿Me pueden informar disponibilidad y precio?'
      ].filter(Boolean).join('\n');
      
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(details)}`, '_blank', 'noopener,noreferrer');
      
      const notice = document.getElementById('formNotice');
      if (notice) {
        notice.textContent = 'Se abrió WhatsApp con tu consulta preparada.';
      }
    });
  }

  // 4. CURSOR CUSTOM PREMIUM (Solo para escritorio con puntero fino)
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, input, select, .service, .hero-art, .lookbook-card, .team-card, .faq-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 5. REVELADO AL HACER SCROLL (INTERSECTION OBSERVER)
  const revealElements = document.querySelectorAll('.hero-copy, .section-head, .service, .strip-item, .statement, .booking-copy, .booking-form, .lookbook-card, .team-card, .faq-item, .map-wrapper');

  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
});

/* 6. FUNCIONES GLOBALES (LOOKBOOK & MODALES LEGALES) */
function selectStyle(serviceName) {
  const serviceSelect = document.getElementById('service');
  if (serviceSelect) {
    serviceSelect.value = serviceName;
  }
}

const legalTexts = {
  privacidad: `
    <h2>Política de Privacidad</h2>
    <p>En <strong>ZETA BARBER</strong> nos tomamos en serio la privacidad de nuestros usuarios y clientes en cumplimiento de la Ley N° 25.326 de Protección de Datos Personales de Argentina.</p>
    <p><strong>1. Recopilación de Datos:</strong> Los datos ingresados voluntariamente en el formulario de consultas (nombre, servicio de interés y preferencia de turno) se utilizan exclusivamente para estructurar la comunicación enviada a través de WhatsApp.</p>
    <p><strong>2. Uso de la Información:</strong> No almacenamos ni vendemos información personal a terceros. La gestión del turno se coordina de manera directa por mensajería.</p>
    <p><strong>3. Derechos del Usuario:</strong> El usuario puede solicitar en cualquier momento la modificación o eliminación de sus datos de contacto en nuestras conversaciones de WhatsApp.</p>
  `,
  terminos: `
    <h2>Términos y Condiciones</h2>
    <p>Bienvenido a la plataforma web de <strong>ZETA BARBER</strong>. Al utilizar nuestro sitio web y formulario de reserva, aceptas las siguientes condiciones:</p>
    <p><strong>1. Solicitud de Turnos:</strong> La reserva enviada mediante el sitio web constituye una consulta previa de disponibilidad. El turno solo quedará confirmado formalmente una vez respondido el mensaje por parte del equipo de ZETA BARBER.</p>
    <p><strong>2. Precios y Servicios:</strong> Los precios informados en el sitio web o por mensajería están sujetos a modificaciones según la complejidad del servicio acordado.</p>
    <p><strong>3. Propiedad Intelectual:</strong> Todo el diseño, marca, contenido y código del sitio son propiedad de ZETA BARBER y están protegidos legalmente.</p>
  `,
  cookies: `
    <h2>Política de Cookies</h2>
    <p>Este sitio web utiliza tecnologías estándar de navegación y almacenamiento local únicamente para mejorar la experiencia del usuario.</p>
    <p><strong>1. Cookies Técnicas:</strong> Permiten la correcta visualización de la interfaz, adaptación responsive a móviles y preferencia de fechas en los formularios.</p>
    <p><strong>2. Cookies de Terceros:</strong> No utilizamos rastreadores publicitarios invasivos ni vendemos datos de navegación a redes de mercadotecnia externa.</p>
    <p>Podés desactivar el uso de cookies en cualquier momento ajustando la configuración de tu navegador web.</p>
  `
};

function openModal(type) {
  const modal = document.getElementById('legalModal');
  const body = document.getElementById('legalModalBody');
  if (legalTexts[type]) {
    body.innerHTML = legalTexts[type];
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeModal() {
  const modal = document.getElementById('legalModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

document.addEventListener('click', function(e) {
  const modal = document.getElementById('legalModal');
  if (modal && e.target === modal) {
    closeModal();
  }
});