export function renderSubscriptionSuccess(container: HTMLDivElement) {
  container.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="#/" class="logo">chamba<span>.digital</span></a>
      </div>
    </nav>

    <section class="success-page">
      <div class="container">
        <div class="success-card">
          <div class="success-icon"><img src="/icons/party.svg" alt="" width="64" height="64" /></div>
          <h1>¡Bienvenido a bordo!</h1>
          <p class="success-sub">Tu suscripción está activa. Tu web está siendo configurada.</p>

          <div class="success-timeline">
            <h3>Lo que sigue</h3>
            <div class="timeline">
              <div class="timeline-item done">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <strong>Suscripción activada</strong>
                  <span>Tu plan ya está funcionando</span>
                </div>
              </div>
              <div class="timeline-item done">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <strong>Pago procesado</strong>
                  <span>Cobro instantáneo completado</span>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <strong>Web configurada</strong>
                  <span>Te contactamos en 24-48 horas con los pasos</span>
                </div>
              </div>
            </div>
          </div>

          <div class="success-actions">
            <a href="#/" class="btn btn-primary">Volver al inicio</a>
            <a href="https://wa.me/1234567890?text=Hola%2C%20acabo%20de%20suscribirme%20a%20chamba.digital" target="_blank" class="btn btn-whatsapp"><img src="/icons/chat.svg" alt="" width="18" height="18" style="filter:brightness(0) invert(1)" /> Contactar por WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  `
}
