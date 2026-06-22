const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

const presets = {
  'fade-up': {
    from: { opacity: '0', transform: 'translateY(32px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'fade-down': {
    from: { opacity: '0', transform: 'translateY(-24px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'fade-left': {
    from: { opacity: '0', transform: 'translateX(32px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  'fade-right': {
    from: { opacity: '0', transform: 'translateX(-32px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  'scale-in': {
    from: { opacity: '0', transform: 'scale(0.92)' },
    to: { opacity: '1', transform: 'scale(1)' },
  },
  'blur-in': {
    from: { opacity: '0', filter: 'blur(12px)' },
    to: { opacity: '1', filter: 'blur(0px)' },
  },
  'slide-up': {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  },
} as const

type Preset = keyof typeof presets

interface RevealOptions {
  preset?: Preset
  delay?: number
  duration?: number
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function initScrollReveal() {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (!elements.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        const el = entry.target as HTMLElement
        const preset = (el.dataset.reveal as Preset) || 'fade-up'
        const delay = parseInt(el.dataset.revealDelay || '0')
        const duration = parseInt(el.dataset.revealDuration || '600')

        const animation = presets[preset] || presets['fade-up']

        el.animate([animation.from, animation.to], {
          duration,
          delay,
          easing: EASING,
          fill: 'forwards',
        })

        el.style.opacity = '1'
        observer.unobserve(el)
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  )

  elements.forEach((el) => {
    const preset = (el.dataset.reveal as Preset) || 'fade-up'
    const initial = presets[preset]?.from || presets['fade-up'].from
    Object.assign(el.style, initial)
    el.style.willChange = 'opacity, transform'
    observer.observe(el)
  })
}

export function staggerReveal(container: HTMLElement, selector: string, opts?: RevealOptions) {
  const items = container.querySelectorAll<HTMLElement>(selector)
  const baseDelay = opts?.delay || 0
  const stagger = 80

  items.forEach((el, i) => {
    el.dataset.reveal = opts?.preset || 'fade-up'
    el.dataset.revealDelay = String(baseDelay + i * stagger)
    el.dataset.revealDuration = String(opts?.duration || 600)
  })

  initScrollReveal()
}
