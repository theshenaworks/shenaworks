/**
 * Disclosure behavior (DESIGN.md 6.5)
 * Handles aria-expanded and keyboard events on disclosures and accordions.
 */

export function initDisclosure(root: ParentNode = document): () => void {
  if (typeof document === 'undefined') return () => {}

  const triggers = Array.from(
    root.querySelectorAll<HTMLElement>('[data-disclosure-trigger]'),
  )

  const handleToggle = (e: Event) => {
    const trigger = e.currentTarget as HTMLElement
    const targetId = trigger.getAttribute('aria-controls')
    if (!targetId) return

    const panel = document.getElementById(targetId)
    if (!panel) return

    const isExpanded = trigger.getAttribute('aria-expanded') === 'true'
    trigger.setAttribute('aria-expanded', String(!isExpanded))
    panel.hidden = isExpanded
  }

  for (const trigger of triggers) {
    trigger.addEventListener('click', handleToggle)
  }

  return () => {
    for (const trigger of triggers) {
      trigger.removeEventListener('click', handleToggle)
    }
  }
}
