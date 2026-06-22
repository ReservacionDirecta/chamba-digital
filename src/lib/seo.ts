interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  jsonLd?: object
}

const SITE = 'https://chamba.digital'
const DEFAULT_IMAGE = `${SITE}/og-image.png`

const pages: Record<string, SEOConfig> = {
  '/': {
    title: 'chamba.digital — Web con Motor de Reservas para Negocios de Servicios | $30/mes',
    description: 'Creamos tu web profesional con motor de reservas y WhatsApp por solo $30/mes. Peluquerías, consultorios, inmobiliarias, spas, gimnasios... cualquier negocio que agende citas.',
    keywords: 'motor de reservas, booking engine, web para negocios, reserva de citas, agendamiento online, WhatsApp business, chamba digital',
    canonical: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'chamba.digital',
      url: SITE,
      description: 'Motor de reservas universal para negocios de servicios',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  '/reservar': {
    title: 'Reserva tu Asesoría — chamba.digital',
    description: 'Agenda tu asesoría en línea. Selecciona el servicio, fecha y hora, y confirma tu reserva con pago seguro.',
    canonical: '/#/reservar',
    ogType: 'website',
  },
  '/suscripcion': {
    title: 'Suscripción — chamba.digital | Planes desde $30/mes',
    description: 'Elige tu plan y empieza a recibir reservas automáticas. Plan Base $30/mes o Plan Dedicado $99/mes + 6%. Sin contratos.',
    canonical: '/#/suscripcion',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'chamba.digital — Plan de Suscripción',
      description: 'Suscripción WaaS para web con motor de reservas',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '30',
        highPrice: '99',
        priceCurrency: 'USD',
        offerCount: 2,
      },
    },
  },
  '/pago-pendiente': {
    title: 'Pago Pendiente — chamba.digital',
    description: 'Tu reserva está registrada. Confirma tu pago por el método que elegiste.',
    canonical: '/#/pago-pendiente',
  },
  '/pago-exitoso': {
    title: '¡Pago Confirmado! — chamba.digital',
    description: 'Tu reserva está confirmada. Recibirás un email con todos los detalles de tu asesoría.',
    canonical: '/#/pago-exitoso',
  },
  '/admin': {
    title: 'Panel de Administración — chamba.digital',
    description: 'Gestiona tus servicios, reservas y configuración.',
    canonical: '/#/admin',
  },
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setJsonLd(data: object) {
  const existing = document.querySelector('script[data-seo-jsonld]')
  if (existing) existing.remove()

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.dataset.seoJsonld = '1'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export function updateSEO(path: string) {
  const basePath = '/' + (path.split('?')[0].split('#')[0] || '')
  const config = pages[basePath] || pages['/']

  document.title = config.title

  setMeta('description', config.description)
  setMeta('keywords', config.keywords || 'chamba.digital, motor de reservas, booking engine')
  setMeta('robots', 'index, follow')

  setMeta('og:title', config.title, true)
  setMeta('og:description', config.description, true)
  setMeta('og:type', config.ogType || 'website', true)
  setMeta('og:url', `${SITE}${config.canonical || ''}`, true)
  setMeta('og:image', DEFAULT_IMAGE, true)
  setMeta('og:site_name', 'chamba.digital', true)

  setMeta('twitter:title', config.title)
  setMeta('twitter:description', config.description)
  setMeta('twitter:image', DEFAULT_IMAGE)
  setMeta('twitter:card', 'summary_large_image')

  const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (canonical) {
    canonical.href = `${SITE}${config.canonical || ''}`
  }

  if (config.jsonLd) {
    setJsonLd(config.jsonLd)
  }
}
