export function renderHome(container: HTMLDivElement) {
  container.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="#/" class="logo">chamba<span>.digital</span></a>
        <div class="nav-links">
          <a href="#features">Cómo funciona</a>
          <a href="#pricing">Planes</a>
          <a href="#/suscripcion" class="btn btn-primary btn-sm" data-ripple>Comenzar</a>
        </div>
      </div>
    </nav>

    <section class="hero">
      <div class="container">
        <div class="hero-badge">🚀 Web + Motor de Reservas + WhatsApp</div>
        <h1>Tu negocio,<br/><span class="gradient">reservas automáticas</span></h1>
        <p class="hero-sub">Por solo $30/mes te entregamos una web profesional con motor de reservas y WhatsApp conectado. Peluquerías, consultorios, inmobiliarias, spas, academias... cualquier negocio que agende citas es nuestro cliente.</p>
        <div class="hero-actions">
          <a href="#/suscripcion" class="btn btn-primary btn-lg" data-ripple data-magnetic="0.2">Empezar ahora</a>
          <a href="#/reservar" class="btn btn-outline btn-lg" data-ripple>Ver demo</a>
        </div>
        <div class="hero-preview">
          <img src="/images/hero-booking.svg" alt="Motor de reservas — calendario con horarios disponibles y confirmación de cita" class="hero-image" width="720" height="450" loading="eager" />
        </div>
      </div>
    </section>

    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title" data-reveal="fade-up">Infraestructura de ventas<br/>que crece con tu negocio</h2>
        <p class="section-sub" data-reveal="fade-up" data-reveal-delay="100">No vendemos productos. Vendemos un servicio de crecimiento constante.</p>
        <div class="features-grid">
          <div class="feature-card" data-reveal="fade-up" data-reveal-delay="100">
            <div class="feature-icon">📅</div>
            <h3>Motor de reservas integrado</h3>
            <p>Tus clientes agendan servicios 24/7. Calendario inteligente que bloquea horarios ocupados y solo muestra disponibilidad real.</p>
          </div>
          <div class="feature-card" data-reveal="fade-up" data-reveal-delay="200">
            <div class="feature-icon">💳</div>
            <h3>Pagos online con Polar.sh</h3>
            <p>Los clientes pagan al reservar. Tú recibes el dinero directamente. Sin intermediarios, sin comisiones ocultas.</p>
          </div>
          <div class="feature-card" data-reveal="fade-up" data-reveal-delay="300">
            <div class="feature-icon">💬</div>
            <h3>Botón de WhatsApp</h3>
            <p>Botón flotante para que tus clientes te contacten directo por WhatsApp con un mensaje predefinido. Cero fricción.</p>
          </div>
          <div class="feature-card" data-reveal="fade-up" data-reveal-delay="400">
            <div class="feature-icon">⚡</div>
            <h3>Confirmación instantánea</h3>
            <p>Reserva → Pago → Confirmación automática. Sin emails perdidos, sin llamadas innecesarias. Todo fluye solo.</p>
          </div>
          <div class="feature-card" data-reveal="fade-up" data-reveal-delay="500">
            <div class="feature-icon">📱</div>
            <h3>100% responsive</h3>
            <p>Tu web funciona perfecto en celular, tablet y escritorio. Tus clientes reservan desde donde sea.</p>
          </div>
          <div class="feature-card" data-reveal="fade-up" data-reveal-delay="600">
            <div class="feature-icon">🔧</div>
            <h3>Tu web es un organismo vivo</h3>
            <p>No es un producto cerrado. Tu web se pulsa mes a mes según los datos de tus clientes reales. Progreso, no perfección al día uno.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title" data-reveal="fade-up">¿Cómo funciona?</h2>
        <p class="section-sub" data-reveal="fade-up" data-reveal-delay="100">Tres pasos simples para tener tu web funcionando</p>
        <img src="/images/confirmation-flow.svg" alt="Flujo de confirmación — email, pago y WhatsApp conectados" class="section-image" data-reveal="scale-in" width="600" height="400" loading="lazy" />
        <div class="features-grid" style="max-width: 900px; margin: 0 auto; grid-template-columns: repeat(3, 1fr);">
          <div class="feature-card" style="text-align: center;" data-reveal="fade-up" data-reveal-delay="150">
            <div style="font-size: 48px; font-weight: 800; color: var(--color-accent); margin-bottom: 16px;">1</div>
            <h3>Eliges tu plan</h3>
            <p>El plan base por $30/mes o el plan dedicado por $99/mes con nuestro 6% alineado.</p>
          </div>
          <div class="feature-card" style="text-align: center;" data-reveal="fade-up" data-reveal-delay="250">
            <div style="font-size: 48px; font-weight: 800; color: var(--color-accent); margin-bottom: 16px;">2</div>
            <h3>Nosotros construimos</h3>
            <p>Tu web, motor de reservas, WhatsApp y pagos configurados en 48-72 horas.</p>
          </div>
          <div class="feature-card" style="text-align: center;" data-reveal="fade-up" data-reveal-delay="350">
            <div style="font-size: 48px; font-weight: 800; color: var(--color-accent); margin-bottom: 16px;">3</div>
            <h3>Tú pones la gasolina</h3>
            <p>Atiende bien el WhatsApp, lleva tráfico a la web. Nosotros optimizamos el embudo mes a mes.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="business-types">
      <div class="container">
        <h2 class="section-title" data-reveal="fade-up">Sirve para cualquier negocio de servicios</h2>
        <p class="section-sub" data-reveal="fade-up" data-reveal-delay="100">Si tu negocio agenda citas, nuestro motor de reservas es para ti</p>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; max-width: 1100px; margin: 0 auto;">
          ${[
            ['✂️', 'Peluquerías'],
            ['🏥', 'Consultorios'],
            ['💆', 'Spas & Estética'],
            ['🏋️', 'Gimnasios'],
            ['🏠', 'Inmobiliarias & Realtors'],
            ['🔧', 'Talleres mecánicos'],
            ['🎓', 'Clases particulares'],
            ['📸', 'Estudios fotográficos'],
            ['🐾', 'Veterinarias'],
            ['🏗️', 'Arquitectos & Diseñadores'],
          ].map(([icon, name], i) => `
            <div class="feature-card" style="text-align: center; padding: 28px 16px;" data-reveal="scale-in" data-reveal-delay="${100 + i * 60}">
              <div style="font-size: 32px; margin-bottom: 10px;">${icon}</div>
              <h3 style="font-size: 14px; font-weight: 600;">${name}</h3>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="pricing" class="pricing">
      <div class="container">
        <h2 class="section-title" data-reveal="fade-up">Planes simples, sin sorpresas</h2>
        <p class="section-sub" data-reveal="fade-up" data-reveal-delay="100">Sin costos de setup, sin contratos largos. Cancelas cuando quieras.</p>
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
              <li>Web de alta conversión (1-3 secciones)</li>
              <li>Motor de reservas integrado</li>
              <li>Botón inteligente de WhatsApp</li>
              <li>Hosting premium + SSL incluido</li>
              <li>Actualizaciones técnicas constantes</li>
              <li>SEO orgánico base</li>
              <li>Cambios ilimitados* (regla de oro)</li>
            </ul>
            <a href="#/suscripcion" class="btn btn-outline btn-block" data-ripple>Elegir plan base</a>
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
              <li>Todo del Plan Base incluido</li>
              <li>Integramos con cualquier herramienta que uses</li>
              <li>Automatizaciones con IA</li>
              <li>Embudo de conversión optimizado</li>
              <li>Departamento de sistemas dedicado</li>
              <li>Comisión alineada: si tú ganas, ganamos</li>
            </ul>
            <a href="#/suscripcion" class="btn btn-primary btn-block" data-ripple data-magnetic="0.15">Asociarme</a>
          </div>
        </div>
        <p style="text-align: center; margin-top: 28px; font-size: 13px; color: var(--color-ink-muted);">
          *Cambios ilimitados sujetos a la regla de oro: solicitud organizada, procesamiento en 48-72h hábiles.
        </p>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2 data-reveal="fade-up">¿Tu negocio agenda citas?<br/>Entonces somos para ti</h2>
        <p data-reveal="fade-up" data-reveal-delay="100">Peluquerías, consultorios, inmobiliarias, agentes inmobiliarios, spas, academias, talleres... cualquier servicio que necesite reservas. Por $30/mes, tu web profesional está lista.</p>
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
  `
}
