export function initVideoScroll() {
  const heroScroll = document.getElementById('hero-scroll')
  const desktopVideo = document.querySelector<HTMLVideoElement>('#hero-video')
  const mobileVideo = document.querySelector<HTMLVideoElement>('#hero-video-mobile')
  const overlay = document.getElementById('hero-overlay')
  const navbar = document.querySelector<HTMLElement>('.navbar')
  const audioBtn = document.getElementById('audio-toggle')
  const audioOnIcon = document.getElementById('audio-on')
  const audioOffIcon = document.getElementById('audio-off')
  if (!heroScroll) return

  let duration = 0
  let targetTime = 0
  let currentSmoothTime = 0
  let animating = false
  let videoReady = false
  let isMuted = true

  const SMOOTH_FACTOR = 0.12
  const SEEK_THRESHOLD = 0.03

  function getActiveVideo(): HTMLVideoElement | null {
    if (window.innerWidth <= 768 && mobileVideo) return mobileVideo
    return desktopVideo
  }

  async function preloadVideo(video: HTMLVideoElement) {
    video.muted = true
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
    }
  }

  function onCanPlayThrough() {
    videoReady = true
    const active = getActiveVideo()
    if (active) {
      active.muted = true
      active.play().catch(() => {})
    }
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

    requestAnimationFrame(animate)
  }

  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const heroRect = heroScroll!.getBoundingClientRect()
    const heroHeight = heroScroll!.offsetHeight - window.innerHeight

    const heroProgress = Math.min(Math.max(-heroRect.top / heroHeight, 0), 1)

    targetTime = heroProgress * duration

    if (overlay) {
      const fadeStart = 0.5
      const fadeEnd = 0.9
      if (heroProgress < fadeStart) {
        overlay.style.opacity = '1'
      } else if (heroProgress > fadeEnd) {
        overlay.style.opacity = '0'
      } else {
        overlay.style.opacity = String(1 - (heroProgress - fadeStart) / (fadeEnd - fadeStart))
      }
    }

    if (navbar) {
      if (scrollTop > 80) {
        navbar.classList.add('scrolled')
      } else {
        navbar.classList.remove('scrolled')
      }
    }
  }

  function toggleAudio() {
    isMuted = !isMuted
    const active = getActiveVideo()
    if (active) active.muted = isMuted

    if (audioOnIcon && audioOffIcon) {
      audioOnIcon.style.display = isMuted ? 'none' : 'block'
      audioOffIcon.style.display = isMuted ? 'block' : 'none'
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio)
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
    if (audioBtn) audioBtn.removeEventListener('click', toggleAudio)
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
