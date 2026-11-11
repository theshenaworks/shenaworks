/**
/**
 * Scroll lock behavior (DESIGN.md 6.4)
 * Locks body scroll when drawers or dialogs are open without page shift.
 */

let lockCount = 0
let previousBodyOverflow = ''
let previousBodyPaddingRight = ''

export function lockScroll(): () => void {
  if (typeof document === 'undefined') return () => {}

  if (lockCount === 0) {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    previousBodyOverflow = document.body.style.overflow
    previousBodyPaddingRight = document.body.style.paddingRight

    document.body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }
    document.documentElement.setAttribute('data-scroll-locked', '')
  }
  lockCount += 1

  let released = false
  return () => {
    if (released) return
    released = true
    lockCount = Math.max(0, lockCount - 1)
    if (lockCount === 0) {
      document.body.style.overflow = previousBodyOverflow
      document.body.style.paddingRight = previousBodyPaddingRight
      document.documentElement.removeAttribute('data-scroll-locked')
    }
  }
}
