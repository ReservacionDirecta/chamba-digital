import './style.css'
import { renderHome } from './pages/home.js'
import { renderBooking } from './pages/booking.js'
import { renderPaymentPending } from './pages/payment-pending.js'
import { renderPaymentSuccess } from './pages/payment-success.js'
import { renderAdmin } from './pages/admin.js'
import { renderSubscription } from './pages/subscription.js'
import { renderSubscriptionSuccess } from './pages/subscription-success.js'
import { renderMyProject } from './pages/my-project.js'
import { initScrollReveal } from './lib/animations.js'
import { initAllInteractions } from './lib/interactions.js'
import { updateSEO } from './lib/seo.js'
import { initVideoScroll } from './lib/video-scroll.js'

const app = document.querySelector<HTMLDivElement>('#app')!
let cleanupVideo: (() => void) | undefined

function router() {
  const hash = window.location.hash || '#/'
  const [path, query] = hash.slice(1).split('?')
  const params = new URLSearchParams(query)

  if (cleanupVideo) {
    cleanupVideo()
    cleanupVideo = undefined
  }

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
    case '/mi-proyecto':
      renderMyProject(app)
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
    if (path === '/' || path === '') {
      cleanupVideo = initVideoScroll() || undefined
    }
  })
}

window.addEventListener('hashchange', router)
window.addEventListener('DOMContentLoaded', router)
