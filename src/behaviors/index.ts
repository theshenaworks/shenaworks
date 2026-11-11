'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initScrollState } from './scrollState'
import { initReveal } from './reveal'
import { initDragScroll } from './dragScroll'
import { initDisclosure } from './disclosure'

export { lockScroll } from './scrollLock'
export { initDisclosure } from './disclosure'
export { initScrollState } from './scrollState'
export { initReveal } from './reveal'
export { initDragScroll } from './dragScroll'

export function BehaviorProvider() {
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.setAttribute('data-js', '')
    const cleanups: Array<() => void> = []

    const modules: Array<[string, () => () => void]> = [
      ['scrollState', () => initScrollState()],
      ['reveal', () => initReveal(document)],
      ['dragScroll', () => initDragScroll(document)],
      ['disclosure', () => initDisclosure(document)],
    ]

    for (const [name, run] of modules) {
      try {
        cleanups.push(run())
      } catch (err) {
        console.error(`[behavior:${name}]`, err)
      }
    }

    return () => {
      for (const cleanup of cleanups) {
        try {
          cleanup()
        } catch (err) {
          console.error('[behavior:teardown]', err)
        }
      }
    }
  }, [pathname])

  return null
}
