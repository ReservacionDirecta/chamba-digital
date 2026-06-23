export function renderSubscriptionSuccess(container: HTMLDivElement) {
  // Get active subscription data to auto-fill
  let activeSub = { name: '', email: '', businessName: '', phone: '', plan: 'base' }
  try {
    const rawSub = localStorage.getItem('last_subscription')
    if (rawSub) activeSub = JSON.parse(rawSub)
  } catch {}

  const email = activeSub.email || ''

  container.innerHTML = `
    <nav class="navbar scrolled">
      <div class="container nav-inner">
        <a href="#/" class="logo">chamba<span>.digital</span></a>
      </div>
    </nav>

    <section class="success-page">
      <div class="container">
        <div class="success-card" style="max-width: 500px; margin: 0 auto;">
          <div class="success-icon"><img src="/icons/party.svg" alt="" width="64" height="64" /></div>
          <h1>¡Bienvenido a bordo!</h1>
          <p class="success-sub">Tu suscripción está activa. Registra tus datos de acceso para ingresar al portal.</p>

          <div class="success-timeline">
            <h3>Estado del proceso</h3>
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
              <div class="timeline-item" id="timeline-account-status">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <strong>Creación de cuenta</strong>
                  <span id="account-status-desc">Pendiente de contraseña</span>
                </div>
              </div>
            </div>
          </div>

          <div id="auth-action-area">
            <div style="border-top: 1px solid var(--color-border); margin: 32px 0 24px; padding-top: 24px; text-align: left;">
              <h3 style="font-size: 16px; font-weight: 700; color: var(--color-ink); margin-bottom: 8px;">Crea tu Cuenta de Acceso</h3>
              <p style="font-size: 13px; color: var(--color-ink-secondary); margin-bottom: 20px; line-height: 1.4;">
                Define una contraseña para ingresar a tu panel y configurar tu proyecto web.
              </p>
              
              <form id="create-account-form" style="display: flex; flex-direction: column; gap: 16px;">
                <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                  <label class="input-label" style="font-weight: 600; font-size: 13px; color: var(--color-ink);">Correo electrónico (Usuario)</label>
                  <input type="email" id="reg-email" class="input" value="${email}" placeholder="correo@ejemplo.com" required readonly style="background: #f3f4f6; cursor: not-allowed; opacity: 0.8;" />
                </div>
                <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                  <label class="input-label" style="font-weight: 600; font-size: 13px; color: var(--color-ink);">Contraseña</label>
                  <input type="password" id="reg-password" class="input" placeholder="Mínimo 6 caracteres" required minlength="6" />
                </div>
                <button type="submit" class="btn btn-primary btn-lg" style="margin-top: 8px; width: 100%;">
                  Crear Cuenta y Configurar Web
                </button>
              </form>
            </div>
          </div>

          <div style="margin-top: 16px;">
            <a href="https://wa.me/1234567890?text=Hola%2C%20acabo%20de%20suscribirme%20a%20chamba.digital" target="_blank" class="btn btn-whatsapp" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <img src="/icons/chat.svg" alt="" width="18" height="18" style="filter:brightness(0) invert(1)" /> Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  `

  const form = container.querySelector('#create-account-form') as HTMLFormElement
  const regEmailInput = container.querySelector('#reg-email') as HTMLInputElement
  const regPasswordInput = container.querySelector('#reg-password') as HTMLInputElement
  const authActionArea = container.querySelector('#auth-action-area') as HTMLDivElement
  const timelineItem = container.querySelector('#timeline-account-status') as HTMLDivElement
  const statusDesc = container.querySelector('#account-status-desc') as HTMLSpanElement

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const regEmail = regEmailInput.value.trim().toLowerCase()
    const password = regPasswordInput.value

    if (!regEmail || password.length < 6) return

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, password })
      })

      if (!response.ok) {
        const errData = await response.json()
        alert(errData.error || 'No se pudo crear la cuenta.')
        return
      }

      const data = await response.json()

      // Set logged in session
      localStorage.setItem('logged_in_user', data.email)

      // Update timeline indicator
      timelineItem.classList.add('done')
      statusDesc.textContent = 'Cuenta configurada'

      // Transition form area to success & access button
      authActionArea.innerHTML = `
        <div style="border-top: 1px solid var(--color-border); margin: 32px 0 24px; padding-top: 24px; text-align: center;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #ecfdf5; color: #10b981; border-radius: 50%; margin-bottom: 16px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: var(--color-ink); margin-bottom: 8px;">¡Cuenta configurada con éxito!</h3>
          <p style="font-size: 13px; color: var(--color-ink-secondary); margin-bottom: 20px; line-height: 1.4;">
            Ya puedes ingresar a la configuración técnica de tu motor de reservas.
          </p>
          <a href="#/mi-proyecto" class="btn btn-primary btn-lg" style="width: 100%;">
            Configurar mi Proyecto
          </a>
        </div>
      `
    } catch (err) {
      console.error(err)
      alert('Error de conexión con el servidor.')
    }
  })
}
