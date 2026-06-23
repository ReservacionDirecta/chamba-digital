export function initMagneticButtons() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    const strength = parseFloat(btn.dataset.magnetic || '0.3')

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      btn.animate(
        [{ transform: `translate(${x * strength}px, ${y * strength}px)` }],
        { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      )
    })

    btn.addEventListener('mouseleave', () => {
      btn.animate(
        [{ transform: 'translate(0px, 0px)' }],
        { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      )
    })
  })
}

export function initTiltCards() {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    const maxTilt = parseFloat(card.dataset.tilt || '6')

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      card.style.transform = `perspective(800px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`
      card.style.transition = 'transform 0.1s ease-out'
    })

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    })
  })
}

export function initRipple() {
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-ripple]') as HTMLElement | null
    if (!target) return

    const rect = target.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const ripple = document.createElement('span')
    Object.assign(ripple.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.12)',
      pointerEvents: 'none',
      transform: 'scale(0)',
    })

    target.style.position = target.style.position || 'relative'
    target.style.overflow = 'hidden'
    target.appendChild(ripple)

    ripple.animate(
      [{ transform: 'scale(0)', opacity: '1' }, { transform: 'scale(1)', opacity: '0' }],
      { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    ).onfinish = () => ripple.remove()
  })
}

export function initSmoothCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]')
  if (!counters.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        const target = parseInt(el.dataset.count || '0')
        const duration = parseInt(el.dataset.countDuration || '1500')
        const prefix = el.dataset.countPrefix || ''
        const suffix = el.dataset.countSuffix || ''

        const start = performance.now()
        const animate = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = Math.round(eased * target)
          el.textContent = `${prefix}${current}${suffix}`
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
        observer.unobserve(el)
      })
    },
    { threshold: 0.5 }
  )

  counters.forEach((el) => observer.observe(el))
}

export function initParallax() {
  const elements = document.querySelectorAll<HTMLElement>('[data-parallax]')
  if (!elements.length) return

  let ticking = false

  window.addEventListener('scroll', () => {
    if (ticking) return
    ticking = true

    requestAnimationFrame(() => {
      const scrollY = window.scrollY
      elements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.3')
        const rect = el.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        const viewportCenter = window.innerHeight / 2
        const offset = (centerY - viewportCenter) * speed

        el.style.transform = `translateY(${offset}px)`
      })
      ticking = false
    })
  })
}

export function initTextShimmer() {
  document.querySelectorAll<HTMLElement>('[data-shimmer]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.animate(
        [
          { backgroundPosition: '200% center' },
          { backgroundPosition: '-200% center' },
        ],
        { duration: 1200, easing: 'linear', iterations: 1 }
      )
    })
  })
}

export function initAllInteractions() {
  initMagneticButtons()
  initTiltCards()
  initRipple()
  initSmoothCounters()
  initParallax()
  initTextShimmer()
}
