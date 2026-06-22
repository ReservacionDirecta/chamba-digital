export function initVideoScroll() {
  const video = document.querySelector<HTMLVideoElement>('#hero-video')
  const navbar = document.querySelector<HTMLElement>('.navbar')
  if (!video) return

  let duration = 0
  let targetTime = 0
  let currentSmoothTime = 0
  let animating = false
  let videoReady = false

  const SMOOTH_FACTOR = 0.12
  const SEEK_THRESHOLD = 0.03

  async function preloadVideo() {
    try {
      const response = await fetch(video.src)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      video.src = url
      video.load()
    } catch {
      video.load()
    }
  }

  function onLoadedMetadata() {
    duration = video.duration
    video.currentTime = 0
    video.pause()
  }

  function onCanPlayThrough() {
    videoReady = true
    video.pause()
    startAnimation()
  }

  function startAnimation() {
    if (animating) return
    animating = true
    animate()
  }

  function animate() {
    if (!animating || !videoReady) return

    const diff = targetTime - currentSmoothTime

    if (Math.abs(diff) > SEEK_THRESHOLD) {
      currentSmoothTime += diff * SMOOTH_FACTOR
    } else {
      currentSmoothTime = targetTime
    }

    if (Math.abs(video.currentTime - currentSmoothTime) > SEEK_THRESHOLD) {
      video.currentTime = currentSmoothTime
    }

    requestAnimationFrame(animate)
  }

  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = Math.min(Math.max(scrollTop / docHeight, 0), 1)

    targetTime = scrollPercent * duration

    if (navbar) {
      if (scrollTop > 80) {
        navbar.classList.add('scrolled')
      } else {
        navbar.classList.remove('scrolled')
      }
    }
  }

  video.addEventListener('loadedmetadata', onLoadedMetadata)
  video.addEventListener('canplaythrough', onCanPlayThrough)

  preloadVideo()

  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    animating = false
    video.removeEventListener('loadedmetadata', onLoadedMetadata)
    video.removeEventListener('canplaythrough', onCanPlayThrough)
    window.removeEventListener('scroll', onScroll)
  }
}
