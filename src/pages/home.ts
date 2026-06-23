export function renderHome(container: HTMLDivElement) {
  container.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="#/" class="logo">chamba<span>.digital</span></a>
        <div class="nav-links">
          <a href="#features">Cómo funciona</a>
          <a href="#pricing">Planes</a>
          <a href="#/login" class="btn btn-ghost btn-sm" style="color: var(--color-ink); margin-right: 8px;">Iniciar sesión</a>
          <a href="#/suscripcion" class="btn btn-primary btn-sm" data-ripple>Comenzar</a>
        </div>
      </div>
    </nav>

    <section class="hero-scroll" id="hero-scroll">
      <div class="hero-sticky">
        <video id="hero-video" class="hero-video hero-video-desktop" src="/hero.mp4" muted playsinline preload="auto" loop></video>
        <video id="hero-video-mobile" class="hero-video hero-video-mobile" src="/hero-vertical.mp4" muted playsinline preload="auto" loop></video>
        <div class="hero-overlay" id="hero-overlay"></div>
        <button id="audio-toggle" class="audio-btn" aria-label="Toggle audio">
          <svg id="audio-on" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
          <svg id="audio-off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        </button>
        <div class="hero-content">
          <div class="hero-badge"><img src="/icons/rocket.svg" alt="" width="18" height="18" /> Tu Web + Calendario de Reservas + WhatsApp</div>
          <h1>Tu negocio en<br/><span class="gradient">piloto automático</span></h1>
          <p class="hero-sub">Crea una web profesional por solo $30 USD al mes. Tus clientes podrán ver tus horarios disponibles, agendar y pagar en segundos sin que tengas que atender llamadas o mensajes.</p>
          <div class="hero-actions">
            <a href="#/suscripcion" class="btn btn-primary btn-lg" data-ripple>Empezar ahora</a>
            <a href="#/reservar" class="btn btn-light btn-lg" data-ripple>Ver demo</a>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section">

      <section id="features" class="features">
        <div class="container">
          <h2 class="section-title" data-reveal="fade-up">Todo lo que necesitas<br/>para recibir clientes por internet</h2>
          <p class="section-sub" data-reveal="fade-up" data-reveal-delay="100">Nosotros nos encargamos de toda la tecnología. Tú solo te concentras en dar el mejor servicio.</p>
          <div class="features-grid">
            <div class="feature-card" data-reveal="fade-up" data-reveal-delay="100">
              <img src="/icons/calendar.svg" alt="" width="36" height="36" class="feature-icon" />
              <h3>Calendario Inteligente 24/7</h3>
              <p>Tus clientes agendan sus propias citas a cualquier hora del día o de la noche. El sistema bloquea automáticamente los horarios ocupados.</p>
            </div>
            <div class="feature-card" data-reveal="fade-up" data-reveal-delay="200">
              <img src="/icons/card.svg" alt="" width="36" height="36" class="feature-icon" />
              <h3>Cobros Seguros con Tarjeta</h3>
              <p>Cobra el servicio completo o un anticipo al reservar. Recibe el dinero directo en tu cuenta bancaria y olvídate de las cancelaciones a última hora.</p>
            </div>
            <div class="feature-card" data-reveal="fade-up" data-reveal-delay="300">
              <img src="/icons/chat.svg" alt="" width="36" height="36" class="feature-icon" />
              <h3>Contacto directo por WhatsApp</h3>
              <p>Tus clientes pueden contactarte por WhatsApp con un solo clic. El mensaje viene listo con los detalles para facilitar la conversación.</p>
            </div>
            <div class="feature-card" data-reveal="fade-up" data-reveal-delay="400">
              <img src="/icons/bolt.svg" alt="" width="36" height="36" class="feature-icon" />
              <h3>Avisos automáticos al instante</h3>
              <p>Confirmaciones de cita inmediatas por correo. Se acabaron las llamadas para confirmar o las citas anotadas por error.</p>
            </div>
            <div class="feature-card" data-reveal="fade-up" data-reveal-delay="500">
              <img src="/icons/responsive.svg" alt="" width="36" height="36" class="feature-icon" />
              <h3>Diseño adaptado para celulares</h3>
              <p>Más del 80% de tus clientes reservará desde su teléfono. Tu página se verá y funcionará de forma impecable en cualquier pantalla.</p>
            </div>
            <div class="feature-card" data-reveal="fade-up" data-reveal-delay="600">
              <img src="/icons/settings.svg" alt="" width="36" height="36" class="feature-icon" />
              <h3>Cambios ilimitados incluidos</h3>
              <p>¿Cambiaste de precios? ¿Tienes nuevos servicios? Solo pídelo y nosotros actualizamos tu página sin costos adicionales.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="how-it-works">
        <div class="container">
          <h2 class="section-title" data-reveal="fade-up">¿Cómo empezamos?</h2>
          <p class="section-sub" data-reveal="fade-up" data-reveal-delay="100">Tu nueva web estará lista para agendar citas en tres sencillos pasos</p>
          <img src="/images/confirmation-flow.svg" alt="Flujo de confirmación" class="section-image" data-reveal="scale-in" width="520" height="350" loading="lazy" />
          <div class="how-steps">
            <div class="how-step" data-reveal="fade-up" data-reveal-delay="150">
              <div class="how-step-num">1</div>
              <h3>Eliges tu Plan</h3>
              <p>Selecciona el plan que mejor se adapte a ti: el Plan Base de $30 USD/mes o el Plan Dedicado si buscas integraciones a medida.</p>
            </div>
            <div class="how-step" data-reveal="fade-up" data-reveal-delay="250">
              <div class="how-step-num">2</div>
              <h3>Nos encargamos de todo</h3>
              <p>Diseñamos tu página, configuramos el calendario y activamos los pagos seguros con tarjeta en un plazo de 48 a 72 horas.</p>
            </div>
            <div class="how-step" data-reveal="fade-up" data-reveal-delay="350">
              <div class="how-step-num">3</div>
              <h3>Recibes clientes</h3>
              <p>Comparte el enlace de tu web en tus redes sociales y tu perfil de WhatsApp. ¡Tu agenda empezará a llenarse sola!</p>
            </div>
          </div>
        </div>
      </section>

      <section class="business-types">
        <div class="container">
          <h2 class="section-title" data-reveal="fade-up">Perfecto para cualquier negocio que agende citas</h2>
          <p class="section-sub" data-reveal="fade-up" data-reveal-delay="100">Adaptamos el calendario a las necesidades y horarios específicos de tu sector</p>
          <div class="business-grid">
            ${[
              ['/icons/peluqueria.svg', 'Peluquerías'],
              ['/icons/consultorio.svg', 'Consultorios'],
              ['/icons/spa.svg', 'Spas & Estética'],
              ['/icons/gimnasio.svg', 'Gimnasios'],
              ['/icons/inmobiliaria.svg', 'Inmobiliarias & Realtors'],
              ['/icons/taller.svg', 'Talleres mecánicos'],
              ['/icons/clases.svg', 'Clases particulares'],
              ['/icons/fotografia.svg', 'Estudios fotográficos'],
              ['/icons/veterinaria.svg', 'Veterinarias'],
              ['/icons/arquitectos.svg', 'Arquitectos & Diseñadores'],
            ].map(([icon, name], i) => `
              <div class="feature-card" style="text-align: center; padding: 28px 16px;" data-reveal="scale-in" data-reveal-delay="${100 + i * 60}">
                <img src="${icon}" alt="${name}" width="48" height="48" style="margin: 0 auto 12px; display: block;" loading="lazy" />
                <h3 style="font-size: 14px; font-weight: 600;">${name}</h3>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section id="pricing" class="pricing">
        <div class="container">
          <h2 class="section-title" data-reveal="fade-up">Planes claros, sin trucos ni sorpresas</h2>
          <p class="section-sub" data-reveal="fade-up" data-reveal-delay="100">Sin costos de activación ni contratos de permanencia. Puedes cancelar cuando quieras.</p>
          <div class="pricing-grid">
            <div class="price-card" data-reveal="fade-left" data-reveal-delay="150">
              <div class="price-header">
                <h3>Plan Base</h3>
                <div class="price">
                  <span class="amount">$30</span>
                  <span class="period">USD/mes</span>
                </div>
              </div>
              <ul class="price-features">
                <li>Página web profesional a tu medida</li>
                <li>Calendario de reservas automático</li>
                <li>Botón de WhatsApp configurado</li>
                <li>Alojamiento web y seguridad SSL incluidos</li>
                <li>Mantenimiento técnico permanente</li>
                <li>Optimización para aparecer en Google</li>
                <li>Cambios de contenido gratis e ilimitados*</li>
              </ul>
              <a href="#/suscripcion" class="btn btn-outline btn-block" data-ripple>Elegir Plan Base</a>
            </div>
            <div class="price-card featured" data-reveal="fade-right" data-reveal-delay="250">
              <div class="price-badge">Socio Estratégico</div>
              <div class="price-header">
                <h3>Plan Dedicado</h3>
                <div class="price">
                  <span class="amount">$99</span>
                  <span class="period">USD/mes + 6% ventas</span>
                </div>
              </div>
              <ul class="price-features">
                <li>Todo lo del Plan Base incluido</li>
                <li>Integración con tus sistemas de administración</li>
                <li>Automatizaciones inteligentes</li>
                <li>Optimización para mejorar tus ventas</li>
                <li>Soporte técnico prioritario 24/7</li>
                <li>Comisión compartida: crecemos junto a ti</li>
              </ul>
              <a href="#/suscripcion" class="btn btn-primary btn-block" data-ripple data-magnetic="0.15">Elegir Plan Dedicado</a>
            </div>
          </div>
          <p style="text-align: center; margin-top: 28px; font-size: 13px; color: var(--color-ink-muted);">
            *Los cambios ilimitados se realizan en un plazo de 48 a 72 horas hábiles tras enviarnos tu solicitud.
          </p>
        </div>
      </section>

      <section class="cta-section">
        <div class="container">
          <h2 data-reveal="fade-up">¿Listo para llenar tu agenda<br/>en piloto automático?</h2>
          <p data-reveal="fade-up" data-reveal-delay="100">Únete a decenas de peluquerías, consultorios, spas y centros de servicio que ya ahorran horas de trabajo al día. Por solo $30 USD al mes, tu web estará lista.</p>
          <div data-reveal="fade-up" data-reveal-delay="200">
            <a href="#/suscripcion" class="btn btn-primary btn-lg" data-ripple data-magnetic="0.2">Empezar ahora</a>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <a href="#/" class="logo">chamba<span>.digital</span></a>
            <p>Infraestructura de ventas que crece con tu negocio.</p>
          </div>
          <div class="footer-links">
            <a href="#features">Cómo funciona</a>
            <a href="#pricing">Planes</a>
            <a href="https://wa.me/1234567890?text=Hola%2C%20quiero%20información%20sobre%20chamba.digital" target="_blank">WhatsApp</a>
          </div>
          <div class="footer-copy">
            &copy; 2026 chamba.digital. Todos los derechos reservados.
          </div>
        </div>
      </footer>

    </section>
  `
}
