import { getBooking } from '../lib/api.js'

export async function renderPaymentSuccess(container: HTMLDivElement, bookingId: string) {
  container.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="#/" class="logo">chamba<span>.digital</span></a>
      </div>
    </nav>

    <section class="success-page">
      <div class="container">
        <div class="success-card">
          <div class="success-icon">✅</div>
          <h1>¡Pago confirmado!</h1>
          <p class="success-sub">Tu reserva está confirmada. Recibirás un email con todos los detalles.</p>

          <div id="booking-info" class="success-details">
            <div class="loader">Cargando detalles...</div>
          </div>

          <div class="success-timeline">
            <h3>Próximos pasos</h3>
            <div class="timeline">
              <div class="timeline-item done">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <strong>Reserva creada</strong>
                  <span>Tu cita fue registrada correctamente</span>
                </div>
              </div>
              <div class="timeline-item done">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <strong>Pago procesado</strong>
                  <span>El pago fue recibido y confirmado</span>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <strong>Asesoría confirmada</strong>
                  <span>Te esperamos en la fecha y hora acordada</span>
                </div>
              </div>
            </div>
          </div>

          <div class="success-actions">
            <a href="#/" class="btn btn-primary">Volver al inicio</a>
            <a href="https://wa.me/1234567890?text=Hola%2C%20tengo%20una%20reserva%20confirmada%20%23${bookingId.slice(-8).toUpperCase()}" target="_blank" class="btn btn-whatsapp">💬 Contactar por WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  `

  if (bookingId) {
    try {
      const booking = await getBooking(bookingId)
      const infoEl = container.querySelector('#booking-info')
      if (infoEl && booking.serviceId) {
        infoEl.innerHTML = `
          <div class="detail-row"><span>Servicio</span><span>${booking.serviceId.name}</span></div>
          <div class="detail-row"><span>Fecha</span><span>${booking.date}</span></div>
          <div class="detail-row"><span>Hora</span><span>${booking.time}</span></div>
          <div class="detail-row"><span>Referencia</span><span>#${booking._id.slice(-8).toUpperCase()}</span></div>
          <div class="detail-row"><span>Estado</span><span class="status-confirmed">Confirmado</span></div>
        `
      }
    } catch {
      const infoEl = container.querySelector('#booking-info')
      if (infoEl) infoEl.innerHTML = '<p style="color:var(--ink-tertiary);">No se pudieron cargar los detalles.</p>'
    }
  }
}
