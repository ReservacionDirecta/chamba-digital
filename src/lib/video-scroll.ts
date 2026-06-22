export function initVideoScroll() {
  const desktopVideo = document.querySelector<HTMLVideoElement>('#hero-video')
  const mobileVideo = document.querySelector<HTMLVideoElement>('#hero-video-mobile')
  const navbar = document.querySelector<HTMLElement>('.navbar')

  let duration = 0
  let targetTime = 0
  let currentSmoothTime = 0
  let animating = false
  let videoReady = false

  const SMOOTH_FACTOR = 0.12
  const SEEK_THRESHOLD = 0.03

  function getActiveVideo(): HTMLVideoElement | null {
    if (window.innerWidth <= 768 && mobileVideo) return mobileVideo
    return desktopVideo
  }

  function getOtherVideo(): HTMLVideoElement | null {
    if (window.innerWidth <= 768 && desktopVideo) return desktopVideo
    return mobileVideo
  }

  async function preloadVideo(video: HTMLVideoElement) {
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
    const active = getActiveVideo()
    if (active) {
      duration = active.duration
      active.currentTime = 0
      active.pause()
    }
  }

  function onCanPlayThrough() {
    videoReady = true
    const active = getActiveVideo()
    if (active) active.pause()
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

    const active = getActiveVideo()
    if (active && Math.abs(active.currentTime - currentSmoothTime) > SEEK_THRESHOLD) {
      active.currentTime = currentSmoothTime
    }

    const other = getOtherVideo()
    if (other && Math.abs(other.currentTime - currentSmoothTime) > SEEK_THRESHOLD) {
      other.currentTime = currentSmoothTime
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

  if (desktopVideo) {
    desktopVideo.addEventListener('loadedmetadata', onLoadedMetadata)
    desktopVideo.addEventListener('canplaythrough', onCanPlayThrough)
    preloadVideo(desktopVideo)
  }

  if (mobileVideo) {
    mobileVideo.addEventListener('loadedmetadata', onLoadedMetadata)
    mobileVideo.addEventListener('canplaythrough', onCanPlayThrough)
    preloadVideo(mobileVideo)
  }

  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    animating = false
    if (desktopVideo) {
      desktopVideo.removeEventListener('loadedmetadata', onLoadedMetadata)
      desktopVideo.removeEventListener('canplaythrough', onCanPlayThrough)
    }
    if (mobileVideo) {
      mobileVideo.removeEventListener('loadedmetadata', onLoadedMetadata)
      mobileVideo.removeEventListener('canplaythrough', onCanPlayThrough)
    }
    window.removeEventListener('scroll', onScroll)
  }
}
