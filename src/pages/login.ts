export function renderLogin(container: HTMLDivElement) {
  // Clear any existing state or notifications
  let errorMessage = ''

  function updateView() {
    container.innerHTML = `
      <nav class="navbar scrolled">
        <div class="container nav-inner">
          <a href="#/" class="logo">chamba<span>.digital</span></a>
          <a href="#/" class="btn btn-ghost btn-sm">← Volver</a>
        </div>
      </nav>

      <section class="booking-page" style="margin-top: 120px; padding-bottom: 80px; display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 120px);">
        <div class="container" style="max-width: 440px; width: 100%;">
          
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px;">Portal de Clientes</h1>
            <p style="color: var(--color-ink-secondary); font-size: 14px; margin: 0; line-height: 1.4;">
              Ingresa tus credenciales para acceder a tu proyecto o panel de control.
            </p>
          </div>

          <div class="sub-form-card" style="border: 1px solid var(--color-border); box-shadow: 0 10px 30px rgba(0,0,0,0.04); background: white; border-radius: 16px; padding: 32px;">
            
            ${errorMessage ? `
              <div style="background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; line-height: 1.4; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>${errorMessage}</span>
              </div>
            ` : ''}

            <form id="login-form" style="display:flex; flex-direction:column; gap: 20px;">
              <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                <label class="input-label" style="font-weight: 600; font-size: 13px; color: var(--color-ink);">Correo electrónico</label>
                <input type="email" id="login-email" class="input" placeholder="correo@ejemplo.com" required style="height: 48px;" />
              </div>
              
              <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
                <label class="input-label" style="font-weight: 600; font-size: 13px; color: var(--color-ink);">Contraseña</label>
                <input type="password" id="login-password" class="input" placeholder="Ingresa tu contraseña" required style="height: 48px;" />
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="margin-top: 8px; width: 100%; height: 48px; font-weight: 600;">
                Iniciar Sesión
              </button>
            </form>

            <div style="margin-top: 24px; text-align: center; border-top: 1px solid var(--color-border); padding-top: 20px;">
              <p style="font-size: 13px; color: var(--color-ink-muted); margin: 0;">
                ¿Aún no tienes suscripción? <a href="#/suscripcion" style="color: var(--color-accent); font-weight: 600; text-decoration: none;">Elige un plan</a>
              </p>
            </div>

            <!-- Demo helper card -->
            <div style="margin-top: 20px; background: var(--color-surface-1); border: 1px solid var(--color-border); padding: 14px; border-radius: 8px; font-size: 12px; line-height: 1.5; color: var(--color-ink-secondary);">
              <span style="font-weight: 700; color: var(--color-ink); display: block; margin-bottom: 4px;">💡 Cuentas de demostración:</span>
              • Super Admin: <code style="background: white; padding: 1px 4px; border-radius: 3px; border: 1px solid var(--color-border);">admin@chamba.digital</code> / <code style="background: white; padding: 1px 4px; border-radius: 3px; border: 1px solid var(--color-border);">admin123</code><br/>
              • Cliente: Registra una cuenta al simular un pago en la sección de planes.
            </div>

          </div>
        </div>
      </section>
    `

    setupEventListeners()
  }

  function setupEventListeners() {
    const form = container.querySelector('#login-form') as HTMLFormElement
    if (!form) return

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = (container.querySelector('#login-email') as HTMLInputElement).value.trim().toLowerCase()
      const password = (container.querySelector('#login-password') as HTMLInputElement).value

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        if (!response.ok) {
          const errData = await response.json()
          errorMessage = errData.error || 'El correo o la contraseña son incorrectos.'
          updateView()
          return
        }

        const data = await response.json()
        localStorage.setItem('logged_in_user', data.email)
        errorMessage = ''
        
        // Redirect based on role
        if (data.role === 'admin') {
          window.location.hash = '#/admin'
        } else {
          window.location.hash = '#/mi-proyecto'
        }
      } catch (err) {
        console.error(err)
        errorMessage = 'Error de conexión con el servidor.'
        updateView()
      }
    })
  }

  updateView()
}
