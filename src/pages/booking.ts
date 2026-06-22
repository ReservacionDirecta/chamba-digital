import { fetchServices, createBooking } from '../lib/api.js'

const SLOTS = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00']
const TAKEN_SLOTS = [1, 3, 5]

export async function renderBooking(container: HTMLDivElement, serviceId: string) {
  container.innerHTML = `<div class="loader">Cargando servicios...</div>`

  let services: any[] = []
  try { services = await fetchServices() } catch { services = [] }

  const selected = services.find((s: any) => s._id === serviceId) || services[0]
  let step = 1
  let pickedDate = ''
  let pickedTime = ''

  function render() {
    container.innerHTML = `
      <nav class="navbar">
        <div class="container nav-inner">
          <a href="#/" class="logo">chamba<span>.digital</span></a>
          <a href="#/" class="btn btn-ghost btn-sm">← Volver</a>
        </div>
      </nav>

      <section class="booking-page">
        <div class="container">
          <div class="booking-header">
            <h1>Reserva tu asesoría</h1>
            <p class="section-sub" style="margin-bottom:0;">Flujo completo en 4 pasos</p>
          </div>

          <div class="booking-steps">
            <div class="step ${step >= 1 ? 'active' : ''}">1. Servicio</div>
            <div class="step-line ${step >= 2 ? 'filled' : ''}"></div>
            <div class="step ${step >= 2 ? 'active' : ''}">2. Fecha y hora</div>
            <div class="step-line ${step >= 3 ? 'filled' : ''}"></div>
            <div class="step ${step >= 3 ? 'active' : ''}">3. Tus datos</div>
            <div class="step-line ${step >= 4 ? 'filled' : ''}"></div>
            <div class="step ${step >= 4 ? 'active' : ''}">4. Pago</div>
          </div>

          <div class="booking-content">

            ${step === 1 ? `
              <div class="step-section">
                <h2 class="step-title">Selecciona tu servicio</h2>
                <p class="step-desc">Elige la asesoría que mejor se adapte a lo que necesitas.</p>
                <div class="services-grid">
                  ${services.map((s: any) => `
                    <div class="service-card ${selected?._id === s._id ? 'selected' : ''}" data-id="${s._id}">
                      <div class="service-card-body">
                        <h3>${s.name}</h3>
                        <p>${s.description}</p>
                        <div class="service-meta">
                          <span class="service-duration"><img src="/icons/timer.svg" alt="" width="14" height="14" style="vertical-align:-2px" /> ${s.duration} min</span>
                          <span class="service-price">$${s.price} USD</span>
                        </div>
                      </div>
                      <div class="service-card-check">${selected?._id === s._id ? '✓' : ''}</div>
                    </div>
                  `).join('')}
                  ${services.length === 0 ? `
                    <div class="empty-state">
                      <p>No hay servicios disponibles.</p>
                      <a href="#/admin" class="btn btn-primary btn-sm">Agregar servicio</a>
                    </div>
                  ` : ''}
                </div>
                <div class="step-actions">
                  <button class="btn btn-primary btn-lg" id="btn-step1" ${!selected ? 'disabled' : ''}>Continuar</button>
                </div>
              </div>
            ` : ''}

            ${step === 2 ? `
              <div class="step-section">
                <h2 class="step-title">Elige fecha y hora</h2>
                <p class="step-desc">Selecciona el día y horario disponible para tu asesoría.</p>
                <div class="datetime-grid">
                  <div class="date-picker">
                    <label class="input-label">Fecha</label>
                    <input type="date" id="booking-date" class="input" min="${new Date().toISOString().split('T')[0]}" value="${pickedDate}" />
                  </div>
                  <div class="time-picker">
                    <label class="input-label">Horario disponible</label>
                    <div id="time-slots" class="time-slots">
                      ${SLOTS.map((h, i) => `
                        <button type="button" class="time-slot ${TAKEN_SLOTS.includes(i) ? 'taken' : ''} ${pickedTime === h ? 'selected' : ''}" data-time="${h}" ${TAKEN_SLOTS.includes(i) ? 'disabled' : ''}>${h}</button>
                      `).join('')}
                    </div>
                  </div>
                </div>
                <div class="step-actions">
                  <button class="btn btn-ghost" id="btn-back2">← Atrás</button>
                  <button class="btn btn-primary btn-lg" id="btn-step2" ${!pickedDate || !pickedTime ? 'disabled' : ''}>Continuar</button>
                </div>
              </div>
            ` : ''}

            ${step === 3 ? `
              <div class="step-section">
                <h2 class="step-title">Tus datos de contacto</h2>
                <p class="step-desc">Necesitamos estos datos para enviarte la confirmación y las instrucciones de pago.</p>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="input-label">Nombre completo</label>
                    <input type="text" id="client-name" class="input" placeholder="Juan Pérez" required />
                  </div>
                  <div class="form-group">
                    <label class="input-label">Correo electrónico</label>
                    <input type="email" id="client-email" class="input" placeholder="juan@empresa.com" required />
                  </div>
                  <div class="form-group">
                    <label class="input-label">Teléfono / WhatsApp</label>
                    <input type="tel" id="client-phone" class="input" placeholder="+52 123 456 7890" required />
                  </div>
                </div>
                <div class="step-actions">
                  <button class="btn btn-ghost" id="btn-back3">← Atrás</button>
                  <button class="btn btn-primary btn-lg" id="btn-step3">Revisar y pagar</button>
                </div>
              </div>
            ` : ''}

            ${step === 4 ? `
              <div class="step-section">
                <h2 class="step-title">Confirma tu reserva</h2>
                <p class="step-desc">Revisa los detalles y elige cómo quieres pagar.</p>
                <div class="review-card">
                  <div class="review-row"><span class="review-label">Servicio</span><span class="review-value">${selected?.name || ''}</span></div>
                  <div class="review-row"><span class="review-label">Duración</span><span class="review-value">${selected?.duration || 0} minutos</span></div>
                  <div class="review-row"><span class="review-label">Fecha</span><span class="review-value">${pickedDate}</span></div>
                  <div class="review-row"><span class="review-label">Hora</span><span class="review-value">${pickedTime}</span></div>
                  <div class="review-row"><span class="review-label">Nombre</span><span class="review-value" id="rev-name"></span></div>
                  <div class="review-row"><span class="review-label">Email</span><span class="review-value" id="rev-email"></span></div>
                  <div class="review-row"><span class="review-label">Teléfono</span><span class="review-value" id="rev-phone"></span></div>
                  <div class="review-total">
                    <span>Total a pagar</span>
                    <span class="review-amount">$${selected?.price || 0} USD</span>
                  </div>
                </div>
                <div class="payment-methods">
                  <h3 class="payment-methods-title">Método de pago</h3>
                  <button class="payment-method-card" id="btn-polar">
                    <div class="pm-icon"><img src="/icons/card.svg" alt="" width="28" height="28" /></div>
                    <div class="pm-info">
                      <strong>Tarjeta de crédito / débito</strong>
                      <span>Pago seguro vía Polar.sh</span>
                    </div>
                    <div class="pm-arrow">→</div>
                  </button>
                  <button class="payment-method-card" id="btn-whatsapp-pay">
                    <div class="pm-icon"><img src="/icons/chat.svg" alt="" width="28" height="28" /></div>
                    <div class="pm-info">
                      <strong>WhatsApp</strong>
                      <span>Confirma tu pago por mensaje</span>
                    </div>
                    <div class="pm-arrow">→</div>
                  </button>
                  <button class="payment-method-card" id="btn-email-pay">
                    <div class="pm-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><rect x="2" y="5" width="24" height="18" rx="2"/><path d="M2 9l12 6 12-6"/></svg></div>
                    <div class="pm-info">
                      <strong>Correo electrónico</strong>
                      <span>Recibe instrucciones por email</span>
                    </div>
                    <div class="pm-arrow">→</div>
                  </button>
                </div>
                <div class="step-actions">
                  <button class="btn btn-ghost" id="btn-back4">← Atrás</button>
                </div>
              </div>
            ` : ''}

          </div>
        </div>
      </section>
    `
    bindEvents()
  }

  function bindEvents() {
    if (step === 1) {
      container.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id')!
          const s = services.find((x: any) => x._id === id)
          if (s) {
            (window as any).__selectedService = s
            render()
          }
        })
      })
      const btn = container.querySelector('#btn-step1')
      if (btn) btn.addEventListener('click', () => { step = 2; render() })
    }

    if (step === 2) {
      const dateInput = container.querySelector('#booking-date') as HTMLInputElement
      if (dateInput) {
        dateInput.addEventListener('change', () => {
          pickedDate = dateInput.value
          render()
        })
      }
      container.querySelectorAll('.time-slot:not(.taken)').forEach(btn => {
        btn.addEventListener('click', () => {
          pickedTime = btn.getAttribute('data-time') || ''
          render()
        })
      })
      const back = container.querySelector('#btn-back2')
      if (back) back.addEventListener('click', () => { step = 1; render() })
      const next = container.querySelector('#btn-step2')
      if (next) next.addEventListener('click', () => { step = 3; render() })
    }

    if (step === 3) {
      const back = container.querySelector('#btn-back3')
      if (back) back.addEventListener('click', () => { step = 2; render() })
      const next = container.querySelector('#btn-step3')
      if (next) next.addEventListener('click', () => {
        const name = (container.querySelector('#client-name') as HTMLInputElement).value
        const email = (container.querySelector('#client-email') as HTMLInputElement).value
        const phone = (container.querySelector('#client-phone') as HTMLInputElement).value
        if (!name || !email || !phone) { alert('Completa todos los campos'); return }
        ;(window as any).__clientData = { clientName: name, clientEmail: email, clientPhone: phone }
        step = 4
        render()
      })
    }

    if (step === 4) {
      const cd = (window as any).__clientData || {}
      const revName = container.querySelector('#rev-name')
      const revEmail = container.querySelector('#rev-email')
      const revPhone = container.querySelector('#rev-phone')
      if (revName) revName.textContent = cd.clientName || ''
      if (revEmail) revEmail.textContent = cd.clientEmail || ''
      if (revPhone) revPhone.textContent = cd.clientPhone || ''

      const back = container.querySelector('#btn-back4')
      if (back) back.addEventListener('click', () => { step = 3; render() })

      const polarBtn = container.querySelector('#btn-polar')
      if (polarBtn) polarBtn.addEventListener('click', () => handlePayment('polar'))

      const waBtn = container.querySelector('#btn-whatsapp-pay')
      if (waBtn) waBtn.addEventListener('click', () => handlePayment('whatsapp'))

      const emailBtn = container.querySelector('#btn-email-pay')
      if (emailBtn) emailBtn.addEventListener('click', () => handlePayment('email'))
    }
  }

  async function handlePayment(method: string) {
    const s = (window as any).__selectedService || selected
    const cd = (window as any).__clientData || {}

    if (!s || !cd.clientName) { alert('Error: faltan datos'); return }

    try {
      if (method === 'polar') {
        const res = await createBooking({
          serviceId: s._id,
          clientName: cd.clientName,
          clientEmail: cd.clientEmail,
          clientPhone: cd.clientPhone,
          date: pickedDate,
          time: pickedTime,
        })
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl
        } else {
          window.location.hash = `#/pago-exitoso?bookingId=${res.bookingId}`
        }
      } else if (method === 'whatsapp') {
        const res = await createBooking({
          serviceId: s._id,
          clientName: cd.clientName,
          clientEmail: cd.clientEmail,
          clientPhone: cd.clientPhone,
          date: pickedDate,
          time: pickedTime,
        })
        const msg = encodeURIComponent(`Hola, quiero confirmar mi reserva:\n\nServicio: ${s.name}\nFecha: ${pickedDate}\nHora: ${pickedTime}\nReferencia: #${res.bookingId?.slice(-8).toUpperCase() || 'N/A'}\n\nAdjunto comprobante de pago.`)
        window.open(`https://wa.me/1234567890?text=${msg}`, '_blank')
        window.location.hash = `#/pago-pendiente?bookingId=${res.bookingId}`
      } else {
        const res = await createBooking({
          serviceId: s._id,
          clientName: cd.clientName,
          clientEmail: cd.clientEmail,
          clientPhone: cd.clientPhone,
          date: pickedDate,
          time: pickedTime,
        })
        window.location.hash = `#/pago-pendiente?bookingId=${res.bookingId}`
      }
    } catch (err) {
      alert('Error al procesar. Intenta de nuevo.')
    }
  }

  ;(window as any).__selectedService = selected
  render()
}
