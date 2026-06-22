import { getBooking } from '../lib/api.js'

export async function renderPaymentPending(container: HTMLDivElement, bookingId: string) {
  container.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="#/" class="logo">chamba<span>.digital</span></a>
      </div>
    </nav>

    <section class="pending-page">
      <div class="container">
        <div class="pending-card">
          <div class="pending-icon">⏳</div>
          <h1>Pago pendiente</h1>
          <p class="pending-sub">Tu reserva está registrada. Confirma tu pago por el método que elegiste.</p>

          <div id="booking-info" class="pending-details">
            <div class="loader">Cargando detalles...</div>
          </div>

          <div class="payment-instructions">
            <h3>Instrucciones de pago</h3>
            <div class="instruction-cards">
              <div class="instruction-card">
                <div class="inst-icon">💳</div>
                <div class="inst-text">
                  <strong>Tarjeta</strong>
                  <p>Paga en línea de forma segura. Recibirás confirmación automática.</p>
                </div>
              </div>
              <div class="instruction-card">
                <div class="inst-icon">💬</div>
                <div class="inst-text">
                  <strong>WhatsApp</strong>
                  <p>Envía tu comprobante de transferencia a nuestro número con tu referencia.</p>
                </div>
              </div>
              <div class="instruction-card">
                <div class="inst-icon">📧</div>
                <div class="inst-text">
                  <strong>Correo</strong>
                  <p>Responde el email de confirmación con tu comprobante adjunto.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="pending-actions">
            <a href="#/" class="btn btn-ghost">Volver al inicio</a>
            <a href="https://wa.me/1234567890?text=Hola%2C%20quiero%20confirmar%20mi%20pago%20referencia%20%23${bookingId.slice(-8).toUpperCase()}" target="_blank" class="btn btn-whatsapp">💬 Confirmar por WhatsApp</a>
          </div>

          <div class="realtime-indicator">
            <span class="pulse"></span>
            Esperando confirmación de pago en tiempo real...
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
          <div class="detail-row"><span>Estado</span><span class="status-${booking.paymentStatus}">${booking.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}</span></div>
        `
      }
    } catch {
      const infoEl = container.querySelector('#booking-info')
      if (infoEl) infoEl.innerHTML = '<p style="color:var(--ink-tertiary);">No se pudieron cargar los detalles.</p>'
    }
  }

  let polling = true
  async function poll() {
    if (!polling) return
    try {
      const booking = await getBooking(bookingId)
      if (booking.paymentStatus === 'paid' || booking.status === 'confirmed') {
        polling = false
        window.location.hash = `#/pago-exitoso?bookingId=${bookingId}`
        return
      }
    } catch {}
    setTimeout(poll, 5000)
  }
  poll()

  window.addEventListener('hashchange', () => { polling = false }, { once: true })
}
