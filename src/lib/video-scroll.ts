export function initVideoScroll() {
  const video = document.querySelector<HTMLVideoElement>('#hero-video')
  const navbar = document.querySelector<HTMLElement>('.navbar')

  let duration = 0
  let ticking = false

  function onLoadedMetadata() {
    duration = video!.duration
    video!.currentTime = 0
    video!.pause()
  }

  function onScroll() {
    if (ticking) return
    ticking = true

    requestAnimationFrame(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.min(Math.max(scrollTop / docHeight, 0), 1)

      if (video && duration) {
        video.currentTime = scrollPercent * duration
      }

      if (navbar) {
        if (scrollTop > 80) {
          navbar.classList.add('scrolled')
          navbar.style.color = ''
        } else {
          navbar.classList.remove('scrolled')
        }
      }

      ticking = false
    })
  }

  function updateNavTextColor() {
    if (!navbar) return
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    if (scrollTop <= 80) {
      navbar.querySelectorAll('a').forEach(a => {
        a.style.color = ''
      })
    }
  }

  if (video) {
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    if (video.readyState >= 1) {
      onLoadedMetadata()
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  updateNavTextColor()

  return () => {
    if (video) video.removeEventListener('loadedmetadata', onLoadedMetadata)
    window.removeEventListener('scroll', onScroll)
  }
}
