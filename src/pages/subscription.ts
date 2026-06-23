export function renderSubscription(container: HTMLDivElement) {
  container.innerHTML = `
    <nav class="navbar scrolled">
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

      if (!res.ok) {
        const errData = await res.json()
        alert(errData.error || 'Error al procesar la suscripción. Intenta de nuevo.')
        return
      }

      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else if (data.isDemo) {
        // Trigger the premium simulated credit card sheet
        openPaymentSimulator(data.subscriptionId)
      } else {
        window.location.hash = '#/suscripcion-exitosa'
      }
    } catch {
      alert('Error al procesar. Intenta de nuevo.')
    }
  })

  function openPaymentSimulator(subscriptionId: string) {
    const modal = document.createElement('div')
    modal.id = 'payment-simulator-modal'
    modal.innerHTML = `
      <div id="payment-simulator-backdrop" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.45); backdrop-filter:blur(6px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;">
        <div style="background:white; border-radius:16px; border:1px solid var(--color-border-strong); width:100%; max-width:420px; box-shadow:0 24px 64px rgba(0,0,0,0.18); padding:32px; display:flex; flex-direction:column; gap:24px;">
          
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-border); padding-bottom:16px;">
            <div>
              <h3 style="margin:0; font-size:17px; font-weight:800; letter-spacing:-0.02em;">Pago Seguro (Simulador)</h3>
              <span style="font-size:12px; color:var(--color-ink-muted);">Modo de demostración local</span>
            </div>
            <button id="close-sim-btn" style="border:none; background:transparent; font-size:24px; color:var(--color-ink-secondary); cursor:pointer; padding:0 8px;">&times;</button>
          </div>

          <div style="background:var(--color-surface-2); border:1px solid var(--color-border); border-radius:8px; padding:14px; display:flex; flex-direction:column; gap:6px;">
            <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--color-ink-secondary);">
              <span>Suscripción:</span>
              <strong style="color:var(--color-ink);">${chosenPlan === 'base' ? 'Plan Base' : 'Plan Dedicado'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--color-ink-secondary);">
              <span>Monto Mensual:</span>
              <strong style="color:var(--color-ink);">${chosenPlan === 'base' ? '$30.00' : '$99.00'} USD</strong>
            </div>
          </div>

          <form id="sim-payment-form" style="display:flex; flex-direction:column; gap:16px;">
            <div class="form-group">
              <label class="input-label" style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Número de Tarjeta</label>
              <input type="text" id="sim-card-num" class="input" style="height:42px; font-size:14px; letter-spacing:2px;" placeholder="4000 1234 5678 9010" required />
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div class="form-group">
                <label class="input-label" style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Expira (MM/AA)</label>
                <input type="text" id="sim-card-exp" class="input" style="height:42px; font-size:14px;" placeholder="12/29" required />
              </div>
              <div class="form-group">
                <label class="input-label" style="font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">CVC</label>
                <input type="password" id="sim-card-cvc" class="input" style="height:42px; font-size:14px;" placeholder="***" required />
              </div>
            </div>

            <button type="submit" id="sim-submit-btn" class="btn btn-primary btn-block btn-lg" style="box-shadow:none; height:46px; border-radius:8px; margin-top:8px; font-weight:700;">
              Pagar $${chosenPlan === 'base' ? '30.00' : '99.00'} USD
            </button>
          </form>

        </div>
      </div>
    `

    document.body.appendChild(modal)

    const closeBtn = modal.querySelector('#close-sim-btn')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.remove()
      })
    }

    const backdrop = modal.querySelector('#payment-simulator-backdrop')
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          modal.remove()
        }
      })
    }

    // Auto format card number spacing
    const cardInput = modal.querySelector('#sim-card-num') as HTMLInputElement
    if (cardInput) {
      cardInput.addEventListener('input', () => {
        let val = cardInput.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        let matches = val.match(/\d{4,16}/g)
        let match = (matches && matches[0]) || ''
        let parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
          parts.push(match.substring(i, i + 4))
        }
        if (parts.length > 0) {
          cardInput.value = parts.join(' ')
        } else {
          cardInput.value = val
        }
      })
    }

    // Auto format card expiration date
    const expInput = modal.querySelector('#sim-card-exp') as HTMLInputElement
    if (expInput) {
      expInput.addEventListener('input', () => {
        let val = expInput.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (val.length >= 2) {
          expInput.value = val.substring(0, 2) + '/' + val.substring(2, 4)
        } else {
          expInput.value = val
        }
      })
    }

    const simForm = modal.querySelector('#sim-payment-form') as HTMLFormElement
    simForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const submitBtn = modal.querySelector('#sim-submit-btn') as HTMLButtonElement
      submitBtn.disabled = true
      submitBtn.textContent = 'Procesando pago seguro...'
      submitBtn.style.opacity = '0.75'

      setTimeout(() => {
        submitBtn.textContent = '¡Pago Aprobado! ✓'
        submitBtn.style.background = 'var(--color-success)'
        submitBtn.style.borderColor = 'var(--color-success)'

        setTimeout(() => {
          modal.remove()
          window.location.hash = `#/suscripcion-exitosa?subscriptionId=${subscriptionId}`
        }, 1000)
      }, 1500)
    })
  }
}
