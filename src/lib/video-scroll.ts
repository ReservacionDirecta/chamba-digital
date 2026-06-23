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
  let isMuted = true
  let ticking = false

  function getActiveVideo(): HTMLVideoElement | null {
    if (window.innerWidth <= 768 && mobileVideo) return mobileVideo
    return desktopVideo
  }

  function initVideo(video: HTMLVideoElement) {
    video.muted = true
    video.play().catch(() => {})

    if (video.readyState >= 1) { // HAVE_METADATA or higher
      duration = video.duration
      video.currentTime = 0
    }

    video.addEventListener('loadedmetadata', () => {
      duration = video.duration
      video.currentTime = 0
    })

    video.addEventListener('canplay', () => {
      video.play().catch(() => {})
    })
  }

  function onScroll() {
    if (ticking) return
    ticking = true

    requestAnimationFrame(() => {
      const active = getActiveVideo()
      if (!active) {
        ticking = false
        return
      }

      if (!duration && active.duration) {
        duration = active.duration
      }

      if (!duration) {
        ticking = false
        return
      }

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const stickyContainer = heroScroll!.querySelector('.hero-sticky') as HTMLElement
      const stickyHeight = stickyContainer ? stickyContainer.offsetHeight : window.innerHeight
      const heroHeight = heroScroll!.offsetHeight - stickyHeight
      const heroProgress = Math.min(Math.max(scrollTop / heroHeight, 0), 1)

      if (heroProgress < 0.01) {
        if (active.paused) {
          active.play().catch(() => {})
        }
      } else {
        if (!active.paused) {
          active.pause()
        }
        active.currentTime = heroProgress * duration
      }

      if (overlay) {
        if (heroProgress < 0.5) {
          overlay.style.opacity = '1'
        } else if (heroProgress > 0.9) {
          overlay.style.opacity = '0'
        } else {
          overlay.style.opacity = String(1 - (heroProgress - 0.5) / 0.4)
        }
      }

      if (navbar) {
        if (scrollTop > 80) {
          navbar.classList.add('scrolled')
        } else {
          navbar.classList.remove('scrolled')
        }
      }

      ticking = false
    })
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

  if (audioBtn) audioBtn.addEventListener('click', toggleAudio)

  if (desktopVideo) initVideo(desktopVideo)
  if (mobileVideo) initVideo(mobileVideo)

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  return () => {
    if (audioBtn) audioBtn.removeEventListener('click', toggleAudio)
    window.removeEventListener('scroll', onScroll)
  }
}
