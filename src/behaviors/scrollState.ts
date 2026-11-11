export function initScrollState(): () => void {
  const html = document.documentElement
  let lastY = Math.max(0, window.scrollY)
  let anchorY = lastY
  let ticking = false

  const update = () => {
    ticking = false
    const y = Math.max(0, window.scrollY)

    if (y > 8) {
      if (!html.hasAttribute('data-scrolled')) html.setAttribute('data-scrolled', '')
    } else {
      if (html.hasAttribute('data-scrolled')) html.removeAttribute('data-scrolled')
    }

    // Do not update scroll direction while a lock is active (DESIGN.md 6.1)
    if (!html.hasAttribute('data-lock')) {
      const delta = y - anchorY
      if (delta >= 8) {
        if (html.getAttribute('data-scroll-dir') !== 'down') {
          html.setAttribute('data-scroll-dir', 'down')
        }
        anchorY = y
      } else if (delta <= -8) {
        if (html.getAttribute('data-scroll-dir') !== 'up') {
          html.setAttribute('data-scroll-dir', 'up')
        }
        anchorY = y
      }
    }

    lastY = y
  }

  const onScroll = () => {
    if (!ticking) {
      ticking = true
      window.requestAnimationFrame(update)
    }
  }

  update()
  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', onScroll)
  }
}
