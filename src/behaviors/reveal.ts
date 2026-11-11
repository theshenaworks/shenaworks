export function initReveal(root: ParentNode = document): () => void {
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
  if (targets.length === 0) return () => {}

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced || typeof IntersectionObserver === 'undefined') {
    targets.forEach((el) => el.setAttribute('data-reveal', 'visible'))
    return () => {}
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleBatch = entries.filter((entry) => entry.isIntersecting)
      visibleBatch.forEach((entry, index) => {
        const el = entry.target as HTMLElement
        const stagger = Math.min(index, 4) * 100
        if (stagger > 0) {
          el.style.setProperty('--reveal-delay', `${stagger}ms`)
        }
        el.setAttribute('data-reveal', 'visible')
        observer.unobserve(el)
      })
    },
    {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.05,
    },
  )

  targets.forEach((el) => {
    if (el.getAttribute('data-reveal') !== 'visible') {
      el.setAttribute('data-reveal', 'hidden')
      observer.observe(el)
    }
  })

  // 3.5s failsafe (DESIGN.md 6.9)
  const failsafeTimer = window.setTimeout(() => {
    const fold = window.innerHeight + 200
    targets.forEach((el) => {
      if (el.getAttribute('data-reveal') === 'hidden') {
        const rect = el.getBoundingClientRect()
        if (rect.top <= fold) {
          el.setAttribute('data-reveal', 'visible')
          observer.unobserve(el)
        }
      }
    })
  }, 3500)

  return () => {
    window.clearTimeout(failsafeTimer)
    observer.disconnect()
  }
}
