export function initDragScroll(root: ParentNode = document): () => void {
  const tracks = Array.from(root.querySelectorAll<HTMLElement>('[data-drag-scroll]'))
  const cleanups: Array<() => void> = []

  tracks.forEach((track) => {
    let isDown = false
    let dragged = false
    let startX = 0
    let startScrollLeft = 0

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      isDown = true
      dragged = false
      startX = e.clientX
      startScrollLeft = track.scrollLeft
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 5) {
        dragged = true
        track.style.userSelect = 'none'
        track.scrollLeft = startScrollLeft - dx * 1.5
      }
    }

    const endDrag = () => {
      if (!isDown) return
      isDown = false
      track.style.userSelect = ''
    }

    const onClickCapture = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault()
        e.stopPropagation()
        dragged = false
      }
    }

    track.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    track.addEventListener('pointercancel', endDrag)
    track.addEventListener('pointerleave', endDrag)
    track.addEventListener('click', onClickCapture, true)

    cleanups.push(() => {
      track.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      track.removeEventListener('pointercancel', endDrag)
      track.removeEventListener('pointerleave', endDrag)
      track.removeEventListener('click', onClickCapture, true)
    })
  })

  return () => {
    cleanups.forEach((fn) => fn())
  }
}
