'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * SiteBehaviors (AGENTS.md Section 0 Rule 5)
 * Ports reference inline scripts to a client component running via useEffect.
 * Manages mega panels, header scroll state, mobile drawer, pinned statement wipe,
 * and project filters with clean unbind and re-initialization on route changes.
 */
export function SiteBehaviors() {
  const pathname = usePathname()

  useEffect(() => {
    const hd = document.getElementById('hd')
    const has = Array.from(document.querySelectorAll<HTMLElement>('.nav .has'))
    const sc = document.getElementById('sc')
    const mb = document.getElementById('mb')
    const dr = document.getElementById('dr')
    const mi = document.getElementById('mi')

    function closePanels() {
      has.forEach((h) => {
        h.classList.remove('open')
        h.firstElementChild?.setAttribute('aria-expanded', 'false')
      })
      hd?.classList.remove('open')
      document.body.classList.remove('mm')
    }

    function closeDrawer() {
      dr?.classList.remove('open')
      mb?.setAttribute('aria-expanded', 'false')
      mb?.setAttribute('aria-label', 'Open menu')
      mi?.setAttribute('d', 'M3 7h18M3 12h18M3 17h18')
    }

    // Reset on pathname change (Condition 3)
    closePanels()
    closeDrawer()
    document.body.classList.remove('lock')
    document.body.style.overflow = ''

    // Pages without photo hero use solid white header (body.hw)
    const hero = document.querySelector<HTMLElement>('.hero')
    if (!hero) {
      document.body.classList.add('hw')
    } else {
      document.body.classList.remove('hw')
    }

    const cleanups: Array<() => void> = [
      () => document.body.classList.remove('hw'),
    ]

    // ---- Script 1: Desktop Mega Panels & Scrim ----
    if (hd && has.length > 0) {
      let t: ReturnType<typeof setTimeout> | undefined
      const mq = window.matchMedia('(min-width: 1024px)')

      function setPanel(h: HTMLElement, o: boolean) {
        h.classList.toggle('open', o)
        h.firstElementChild?.setAttribute('aria-expanded', String(o))
      }

      function closeAll() {
        has.forEach((h) => setPanel(h, false))
        hd?.classList.remove('open')
        document.body.classList.remove('mm')
      }

      function openPanel(h: HTMLElement) {
        has.forEach((x) => setPanel(x, x === h))
        hd?.classList.add('open')
        document.body.classList.add('mm')
      }

      has.forEach((h) => {
        const a = h.firstElementChild as HTMLElement | null
        const onMouseEnter = () => {
          if (t) clearTimeout(t)
          if (mq.matches) openPanel(h)
        }
        const onMouseLeave = () => {
          t = setTimeout(closeAll, 200)
        }
        const onFocusOut = (e: FocusEvent) => {
          if (e.relatedTarget && !h.contains(e.relatedTarget as Node)) {
            closeAll()
          }
        }
        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            openPanel(h)
            h.querySelector<HTMLElement>('.pan a')?.focus()
          }
        }
        const onPanelKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            closeAll()
            a?.focus()
          }
        }

        h.addEventListener('mouseenter', onMouseEnter)
        h.addEventListener('mouseleave', onMouseLeave)
        h.addEventListener('focusout', onFocusOut)
        a?.addEventListener('keydown', onKeyDown)
        h.addEventListener('keydown', onPanelKeyDown)

        cleanups.push(() => {
          h.removeEventListener('mouseenter', onMouseEnter)
          h.removeEventListener('mouseleave', onMouseLeave)
          h.removeEventListener('focusout', onFocusOut)
          a?.removeEventListener('keydown', onKeyDown)
          h.removeEventListener('keydown', onPanelKeyDown)
        })
      })

      const navDirectLinks = Array.from(document.querySelectorAll<HTMLElement>('.nav > a'))
      navDirectLinks.forEach((a) => {
        a.addEventListener('mouseenter', closeAll)
        cleanups.push(() => a.removeEventListener('mouseenter', closeAll))
      })

      if (sc) {
        sc.addEventListener('click', closeAll)
        cleanups.push(() => sc.removeEventListener('click', closeAll))
      }

      const onScrollClose = () => {
        if (hd.classList.contains('open')) closeAll()
      }
      window.addEventListener('scroll', onScrollClose, { passive: true })
      cleanups.push(() => window.removeEventListener('scroll', onScrollClose))
    }

    // ---- Script 2: Header Scroll Hide/Solid & Mobile Drawer ----
    if (hd) {
      let last = 0
      const hero = document.querySelector<HTMLElement>('.hero')

      const onScroll = () => {
        const y = window.scrollY
        const limit = hero ? hero.offsetHeight - 140 : 200
        if (y > last && y > 160) {
          hd.classList.add('hide')
        } else {
          hd.classList.remove('hide')
        }
        if (y > limit || (y < last && y > 160)) {
          hd.classList.add('solid')
        }
        if (y <= 60 || (y < limit && y <= last && y < 160)) {
          hd.classList.remove('solid')
        }
        if (y <= limit && y <= 60) {
          hd.classList.remove('solid')
        }
        last = y
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      cleanups.push(() => window.removeEventListener('scroll', onScroll))

      if (mb && dr && mi) {
        const onMenuClick = () => {
          const o = dr.classList.toggle('open')
          mb.setAttribute('aria-expanded', String(o))
          mb.setAttribute('aria-label', o ? 'Close menu' : 'Open menu')
          document.body.classList.toggle('lock', o)
          document.body.style.overflow = o ? 'hidden' : ''
          hd.classList.toggle('solid', o || window.scrollY > 140)
          mi.setAttribute('d', o ? 'M5 5l14 14M19 5 5 19' : 'M3 7h18M3 12h18M3 17h18')
        }
        mb.addEventListener('click', onMenuClick)
        cleanups.push(() => mb.removeEventListener('click', onMenuClick))
      }
    }

    // ---- Script 3: Pinned Statement & Project Filter Chips (Null-Guarded) ----
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const run = document.querySelector<HTMLElement>('.stmt-run')
    const l2 = document.querySelector<HTMLElement>('.stmt-layer.l2')

    if (run && l2 && !rm) {
      const stmt = () => {
        const r = run.getBoundingClientRect()
        const t = -r.top / Math.max(1, r.height - window.innerHeight)
        l2.style.setProperty('--p', String(Math.min(1, Math.max(0, (t - 0.3) / 0.3))))
      }
      window.addEventListener('scroll', stmt, { passive: true })
      window.addEventListener('resize', stmt, { passive: true })
      stmt()
      cleanups.push(() => {
        window.removeEventListener('scroll', stmt)
        window.removeEventListener('resize', stmt)
      })
    }

    const chips = Array.from(document.querySelectorAll<HTMLElement>('.chip'))
    const cards = Array.from(document.querySelectorAll<HTMLElement>('#pgrid .card'))
    const pc = document.getElementById('pcount')

    if (chips.length > 0 && cards.length > 0) {
      chips.forEach((c) => {
        const f = c.dataset.f
        if (f !== 'all' && !document.querySelector('#pgrid [data-t~="' + f + '"]')) {
          c.hidden = true
        }
        const onChipClick = (e: MouseEvent) => {
          e.preventDefault()
          chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)))
          let n = 0
          cards.forEach((k) => {
            const tags = (k.dataset.t || '').split(' ')
            const show = f === 'all' || tags.indexOf(f!) > -1
            k.hidden = !show
            if (show) n++
          })
          if (pc) {
            pc.textContent = n + ' project' + (n === 1 ? '' : 's') + ' shown'
          }
        }
        c.addEventListener('click', onChipClick)
        cleanups.push(() => c.removeEventListener('click', onChipClick))
      })
    }

    return () => {
      cleanups.forEach((fn) => fn())
      closePanels()
      closeDrawer()
      document.body.classList.remove('lock')
      document.body.style.overflow = ''
    }
  }, [pathname])

  return null
}
