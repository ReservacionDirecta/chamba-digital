import './style.css'
import { renderHome } from './pages/home.js'
import { renderBooking } from './pages/booking.js'
import { renderPaymentPending } from './pages/payment-pending.js'
import { renderPaymentSuccess } from './pages/payment-success.js'
import { renderAdmin } from './pages/admin.js'
import { renderSubscription } from './pages/subscription.js'
import { renderSubscriptionSuccess } from './pages/subscription-success.js'
import { initScrollReveal } from './lib/animations.js'
import { initAllInteractions } from './lib/interactions.js'
import { updateSEO } from './lib/seo.js'

const app = document.querySelector<HTMLDivElement>('#app')!

function router() {
  const hash = window.location.hash || '#/'
  const [path, query] = hash.slice(1).split('?')
  const params = new URLSearchParams(query)

  window.scrollTo({ top: 0, behavior: 'instant' })

  switch (path) {
    case '/reservar':
      renderBooking(app, params.get('serviceId') || '')
      break
    case '/pago-pendiente':
      renderPaymentPending(app, params.get('bookingId') || '')
      break
    case '/pago-exitoso':
      renderPaymentSuccess(app, params.get('bookingId') || '')
      break
    case '/suscripcion':
      renderSubscription(app)
      break
    case '/suscripcion-exitosa':
      renderSubscriptionSuccess(app)
      break
    case '/admin':
      renderAdmin(app)
      break
    default:
      renderHome(app)
  }

  updateSEO(path)

  requestAnimationFrame(() => {
    initScrollReveal()
    initAllInteractions()
  })
}

window.addEventListener('hashchange', router)
window.addEventListener('DOMContentLoaded', router)
