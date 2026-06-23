export function renderSubscription(container: HTMLDivElement) {
  container.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="#/" class="logo">chamba<span>.digital</span></a>
        <a href="#/" class="btn btn-ghost btn-sm">← Volver</a>
      </div>
    </nav>

    <section class="subscription-page">
      <div class="container">
        <div class="sub-header">
          <h1>Empieza con chamba.digital</h1>
          <p class="section-sub" style="margin-bottom:0;">Elige tu plan y completa tu registro en 2 minutos.</p>
        </div>

        <div class="sub-plans">
          <div class="sub-plan-card" data-plan="base">
            <div class="sub-plan-header">
              <h3>Plan Base</h3>
              <div class="sub-price"><span class="sub-amount">$30</span><span class="sub-period">/mes</span></div>
            </div>
            <ul class="sub-features">
              <li>Web de alta conversión</li>
              <li>Motor de reservas integrado</li>
              <li>Botón de WhatsApp</li>
              <li>Hosting + SSL incluido</li>
              <li>SEO orgánico base</li>
              <li>Cambios ilimitados*</li>
            </ul>
            <button class="btn btn-outline btn-block btn-select-plan" data-plan="base">Seleccionar</button>
          </div>

          <div class="sub-plan-card featured" data-plan="dedicado">
            <div class="sub-plan-badge">Socio Estratégico</div>
            <div class="sub-plan-header">
              <h3>Plan Dedicado</h3>
              <div class="sub-price"><span class="sub-amount">$99</span><span class="sub-period">/mes + 6% ventas</span></div>
            </div>
            <ul class="sub-features">
              <li>Todo del Plan Base</li>
              <li>Integramos cualquier herramienta</li>
              <li>Automatizaciones con IA</li>
              <li>Embudo optimizado</li>
              <li>Sistemas dedicados</li>
              <li>Comisión alineada</li>
            </ul>
            <button class="btn btn-primary btn-block btn-select-plan" data-plan="dedicado">Seleccionar</button>
          </div>
        </div>

        <div id="sub-form-section" class="sub-form-section" style="display:none;">
          <div class="sub-form-card">
            <h2>Completa tu registro</h2>
            <p class="step-desc">Datos mínimos para crear tu cuenta. Cobro instantáneo.</p>
            <div class="form-grid">
              <div class="form-group">
                <label class="input-label">Nombre completo</label>
                <input type="text" id="sub-name" class="input" placeholder="Tu nombre" required />
              </div>
              <div class="form-group">
                <label class="input-label">Correo electrónico</label>
                <input type="email" id="sub-email" class="input" placeholder="tu@email.com" required />
              </div>
              <div class="form-group">
                <label class="input-label">Nombre del negocio</label>
                <input type="text" id="sub-business" class="input" placeholder="Mi Negocio" required />
              </div>
              <div class="form-group">
                <label class="input-label">Teléfono / WhatsApp</label>
                <input type="tel" id="sub-phone" class="input" placeholder="+52 123 456 7890" />
              </div>
            </div>
            <div class="sub-summary">
              <div class="review-row"><span>Plan seleccionado</span><span id="sub-plan-label">Plan Base</span></div>
              <div class="review-row"><span>Monto mensual</span><span id="sub-plan-price">$30 USD</span></div>
              <div class="review-row"><span>Cobro</span><span>Instantáneo vía tarjeta</span></div>
            </div>
            <div class="step-actions">
              <button class="btn btn-ghost" id="sub-back">← Cambiar plan</button>
              <button class="btn btn-primary btn-lg" id="sub-pay"><img src="/icons/card.svg" alt="" width="18" height="18" style="vertical-align:-3px" /> Pagar y activar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `

  let chosenPlan = ''

  container.querySelectorAll('.btn-select-plan').forEach(btn => {
    btn.addEventListener('click', () => {
      chosenPlan = btn.getAttribute('data-plan') || 'base'
      const formSection = container.querySelector('#sub-form-section') as HTMLElement
      if (formSection) formSection.style.display = 'block'

      const planLabel = container.querySelector('#sub-plan-label')
      const planPrice = container.querySelector('#sub-plan-price')
      if (planLabel) planLabel.textContent = chosenPlan === 'base' ? 'Plan Base' : 'Plan Dedicado'
      if (planPrice) planPrice.textContent = chosenPlan === 'base' ? '$30 USD' : '$99 USD + 6%'

      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  const backBtn = container.querySelector('#sub-back')
  if (backBtn) backBtn.addEventListener('click', () => {
    const formSection = container.querySelector('#sub-form-section') as HTMLElement
    if (formSection) formSection.style.display = 'none'
    chosenPlan = ''
  })

  const payBtn = container.querySelector('#sub-pay')
  if (payBtn) payBtn.addEventListener('click', async () => {
    const name = (container.querySelector('#sub-name') as HTMLInputElement).value
    const email = (container.querySelector('#sub-email') as HTMLInputElement).value
    const businessName = (container.querySelector('#sub-business') as HTMLInputElement).value
    const phone = (container.querySelector('#sub-phone') as HTMLInputElement).value

    if (!name || !email || !businessName) {
      alert('Completa nombre, email y nombre del negocio')
      return
    }

    // Save metadata for the onboarding wizard
    localStorage.setItem('last_subscription', JSON.stringify({ name, email, businessName, phone, plan: chosenPlan }))

    try {
      const res = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, businessName, phone, plan: chosenPlan }),
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        window.location.hash = '#/suscripcion-exitosa'
      }
    } catch {
      alert('Error al procesar. Intenta de nuevo.')
    }
  })
}
