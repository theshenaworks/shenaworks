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

    // ---- Script 4: Equipment Gallery Carousel ----
    const tr = document.getElementById('gt')
    const gc = document.getElementById('gc')
    const gp = document.getElementById('gp')
    const gn = document.getElementById('gn')
    if (tr && gc) {
      const n = tr.children.length
      const cur = () => Math.round(tr.scrollLeft / tr.clientWidth)
      const go = (i: number) => {
        const clamped = Math.max(0, Math.min(n - 1, i))
        tr.scrollTo({ left: clamped * tr.clientWidth, behavior: 'smooth' })
      }
      const onPrev = () => go(cur() - 1)
      const onNext = () => go(cur() + 1)
      const onScrollGal = () => {
        gc.textContent = cur() + 1 + ' / ' + n
      }
      if (gp) {
        gp.addEventListener('click', onPrev)
        cleanups.push(() => gp.removeEventListener('click', onPrev))
      }
      if (gn) {
        gn.addEventListener('click', onNext)
        cleanups.push(() => gn.removeEventListener('click', onNext))
      }
      tr.addEventListener('scroll', onScrollGal, { passive: true })
      cleanups.push(() => tr.removeEventListener('scroll', onScrollGal))
    }

    // ---- Script 5: Projects Filter Bar ----
    document.documentElement.classList.add('js')
    const pCards = Array.from(document.querySelectorAll<HTMLElement>('#pg .pcard'))
    const fs = document.getElementById('fs') as HTMLSelectElement | null
    const fc = document.getElementById('fc') as HTMLSelectElement | null
    const fy = document.getElementById('fy') as HTMLSelectElement | null
    const cnt = document.getElementById('cnt')
    const em = document.getElementById('em')
    const clr = document.getElementById('clr')
    const clr2 = document.getElementById('clr2')
    const fb = document.getElementById('fb')

    if (pCards.length > 0 && fs && fc && fy && cnt && em && clr) {
      const fill = (sel: HTMLSelectElement, attr: 'c' | 'y') => {
        const seen: Record<string, number> = {}
        pCards.forEach((c) => {
          const v = c.dataset[attr]
          if (v && !seen[v]) {
            seen[v] = 1
            const o = document.createElement('option')
            o.value = o.textContent = v
            sel.appendChild(o)
          }
        })
      }
      fill(fc, 'c')
      fill(fy, 'y')

      const q = new URLSearchParams(window.location.search)
      fs.value = q.get('service') || ''
      fc.value = q.get('location') || ''
      fy.value = q.get('year') || ''

      const apply = () => {
        let n = 0
        pCards.forEach((c) => {
          const sMatch = !fs.value || (c.dataset.s || '').split(' ').indexOf(fs.value) > -1
          const cMatch = !fc.value || c.dataset.c === fc.value
          const yMatch = !fy.value || c.dataset.y === fy.value
          const ok = sMatch && cMatch && yMatch
          c.hidden = !ok
          if (ok) n++
        })
        cnt.textContent = 'Showing ' + n + ' of ' + pCards.length + ' projects'
        em.hidden = n > 0
        clr.hidden = !(fs.value || fc.value || fy.value)
        try {
          const p = new URLSearchParams()
          if (fs.value) p.set('service', fs.value)
          if (fc.value) p.set('location', fc.value)
          if (fy.value) p.set('year', fy.value)
          window.history.replaceState(null, '', window.location.pathname + (p.toString() ? '?' + p : ''))
        } catch (_) {}
      }

      const onSelectChange = () => apply()
      fs.addEventListener('change', onSelectChange)
      fc.addEventListener('change', onSelectChange)
      fy.addEventListener('change', onSelectChange)
      cleanups.push(() => {
        fs.removeEventListener('change', onSelectChange)
        fc.removeEventListener('change', onSelectChange)
        fy.removeEventListener('change', onSelectChange)
      })

      const reset = () => {
        fs.value = fc.value = fy.value = ''
        apply()
      }
      clr.addEventListener('click', reset)
      cleanups.push(() => clr.removeEventListener('click', reset))
      if (clr2) {
        clr2.addEventListener('click', reset)
        cleanups.push(() => clr2.removeEventListener('click', reset))
      }

      if (fb) {
        const onFbSubmit = (e: Event) => {
          e.preventDefault()
          apply()
        }
        fb.addEventListener('submit', onFbSubmit)
        cleanups.push(() => fb.removeEventListener('submit', onFbSubmit))
      }

      apply()
    }

    // ---- Script 6: Equipment Hire Form (#hf) ----
    const hf = document.getElementById('hf') as HTMLFormElement | null
    if (hf) {
      const sum = document.getElementById('sum')
      const sl = document.getElementById('sl')
      const st = document.getElementById('start') as HTMLInputElement | null
      if (st) {
        const t = new Date()
        st.min =
          t.getFullYear() +
          '-' +
          String(t.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(t.getDate()).padStart(2, '0')
      }

      type Rule = [string, (v: string) => boolean, string]
      const rules: Rule[] = [
        ['name', (v) => v.trim().length >= 2, 'Enter your name'],
        [
          'phone',
          (v) => {
            const clean = v.replace(/[\s-]/g, '')
            return /^(\+?254|0)[17]\d{8}$/.test(clean) || /^\+\d{8,15}$/.test(clean)
          },
          'Enter a phone number we can call or WhatsApp',
        ],
        ['email', (v) => !v || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), 'Enter a valid email address'],
        ['equipment', (v) => !!v, 'Choose a machine or type'],
        ['location', (v) => v.trim().length >= 2, 'Enter the site location'],
        ['start', (v) => !!v && (st ? v >= st.min : true), 'Choose a start date, today or later'],
        ['dur', (v) => !!v, 'Choose how long you need it'],
      ]

      const chk = (id: string, ok: (v: string) => boolean, msg: string) => {
        const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null
        if (!el) return false
        const old = document.getElementById(id + '-e')
        if (old) old.remove()
        const bad = !ok(el.value)
        el.setAttribute('aria-invalid', String(bad))
        if (bad) {
          const s = document.createElement('span')
          s.className = 'err'
          s.id = id + '-e'
          s.textContent = 'Error: ' + msg
          el.parentNode?.appendChild(s)
        }
        return bad
      }

      rules.forEach((r) => {
        const el = document.getElementById(r[0])
        if (el) {
          const onBlur = () => chk(r[0], r[1], r[2])
          el.addEventListener('blur', onBlur)
          cleanups.push(() => el.removeEventListener('blur', onBlur))
        }
      })

      const onHfSubmit = (e: SubmitEvent) => {
        const errs: Array<[string, string]> = []
        rules.forEach((r) => {
          if (chk(r[0], r[1], r[2])) errs.push([r[0], r[2]])
        })
        const c = document.getElementById('consent') as HTMLInputElement | null
        if (c && !c.checked) {
          errs.push(['consent', 'Tick the box to agree to the privacy notice'])
        }
        if (errs.length > 0 && sum && sl) {
          e.preventDefault()
          sl.innerHTML = ''
          errs.forEach((x) => {
            const li = document.createElement('li')
            const a = document.createElement('a')
            a.href = '#' + x[0]
            a.textContent = x[1]
            li.appendChild(a)
            sl.appendChild(li)
          })
          sum.hidden = false
          sum.focus()
        }
      }
      hf.addEventListener('submit', onHfSubmit)
      cleanups.push(() => hf.removeEventListener('submit', onHfSubmit))
    }

    // ---- Script 7: Contact Form (#cf) ----
    const cf = document.getElementById('cf') as HTMLFormElement | null
    if (cf) {
      const sum = document.getElementById('sum')
      const sl = document.getElementById('sl')
      const sT = document.getElementById('st')
      const sb = document.getElementById('sb')
      const ml = document.getElementById('ml')
      const mh = document.getElementById('mh')
      const dateEl = document.getElementById('start') as HTMLInputElement | null

      const d = new Date()
      const minDate =
        d.getFullYear() +
        '-' +
        String(d.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(d.getDate()).padStart(2, '0')
      if (dateEl) dateEl.min = minDate

      const getType = () => {
        const checked = cf.querySelector<HTMLInputElement>('input[name=type]:checked')
        return checked ? checked.value : 'project'
      }

      const L: Record<string, [string, string]> = {
        project: ['Tell us about the project *', 'Size, what’s there now, and what you want at the end.'],
        hire: ['Anything we should know about the site or work? (optional)', ''],
        consultation: ['What do you need help with? *', ''],
        other: ['Your message *', ''],
      }

      const show = () => {
        const t = getType()
        cf.querySelectorAll<HTMLElement>('[data-t]').forEach((w) => {
          if (w.hasAttribute('data-t-req')) return
          const on = (w.dataset.t || '').split(' ').indexOf(t) > -1
          w.hidden = !on
          w.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
            'input,select,textarea'
          ).forEach((c) => {
            c.disabled = !on
          })
        })
        if (ml) ml.textContent = L[t]?.[0] || 'Your message *'
        if (mh) {
          mh.textContent = L[t]?.[1] || ''
          mh.hidden = !L[t]?.[1]
        }
        if (sb) sb.textContent = t === 'hire' ? 'Send hire request' : 'Send enquiry'
        const req = document.querySelector<HTMLElement>('[data-t-req]')
        if (req) req.hidden = !(t === 'project' || t === 'hire')
      }

      const msgs: Record<string, string> = {
        project: 'Tell us a little about the project',
        consultation: 'Tell us what you need help with',
        other: 'Enter your message',
      }

      const V: Record<string, (v: string, t: string) => string> = {
        name: (v) => (v.trim().length < 2 ? 'Enter your name' : ''),
        phone: (v) => {
          const c = v.replace(/[\s-]/g, '')
          if (!c) return 'Enter a phone number we can reach you on'
          return /^(\+?254|0)[17]\d{8}$/.test(c) || /^\+\d{8,15}$/.test(c)
            ? ''
            : 'Enter a phone number like 0712 345 678 or +254 712 345 678'
        },
        email: (v) =>
          v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
            ? 'Enter an email address like name@example.com'
            : '',
        service: (v) => (v ? '' : 'Choose a service'),
        equipment: (v) => (v ? '' : 'Choose a machine'),
        start: (v) =>
          !v ? 'Choose a start date' : v < minDate ? 'Choose a start date today or later' : '',
        dur: (v) => (v ? '' : 'Choose how long you need it'),
        location: (v, t) =>
          (t === 'project' || t === 'hire') && v.trim().length < 2
            ? 'Enter the site location'
            : '',
        message: (v, t) => (t !== 'hire' && v.trim().length < 10 ? msgs[t] || 'Enter your message' : ''),
      }

      const setErr = (id: string, msg: string) => {
        const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
        if (!el) return msg
        const o = document.getElementById(id + '-e')
        if (o) o.remove()
        el.setAttribute('aria-invalid', String(!!msg))
        if (msg) {
          const s = document.createElement('span')
          s.className = 'err'
          s.id = id + '-e'
          s.textContent = 'Error: ' + msg
          el.parentNode?.appendChild(s)
        }
        return msg
      }

      const fileErr = () => {
        const filesEl = document.getElementById('files') as HTMLInputElement | null
        if (!filesEl) return ''
        const fl = Array.from(filesEl.files || [])
        const o = document.getElementById('files-e')
        if (o) o.remove()
        let m = ''
        if (fl.length > 3) {
          m = 'You can attach up to 3 files'
        } else {
          fl.some((x) => {
            if (!/\.(pdf|jpe?g|png|webp)$/i.test(x.name)) {
              m = x.name + ' must be a PDF, JPG, PNG or WEBP'
              return true
            }
            if (x.size > 10485760) {
              m = x.name + ' is larger than 10 MB'
              return true
            }
            return false
          })
        }
        if (m) {
          const s = document.createElement('span')
          s.className = 'err'
          s.id = 'files-e'
          s.textContent = 'Error: ' + m
          filesEl.parentNode?.appendChild(s)
        }
        return m
      }

      Object.keys(V).forEach((id) => {
        const el = document.getElementById(id) as HTMLInputElement | null
        if (el) {
          const onBlur = () => {
            if (!el.disabled) setErr(id, V[id](el.value, getType()))
          }
          el.addEventListener('blur', onBlur)
          cleanups.push(() => el.removeEventListener('blur', onBlur))
        }
      })

      const filesInput = document.getElementById('files')
      if (filesInput) {
        filesInput.addEventListener('change', fileErr)
        cleanups.push(() => filesInput.removeEventListener('change', fileErr))
      }

      cf.querySelectorAll<HTMLInputElement>('input[name=type]').forEach((r) => {
        r.addEventListener('change', show)
        cleanups.push(() => r.removeEventListener('change', show))
      })

      const onCfSubmit = (e: SubmitEvent) => {
        const t = getType()
        const errs: Array<[string, string]> = []
        Object.keys(V).forEach((id) => {
          const el = document.getElementById(id) as HTMLInputElement | null
          if (!el || el.disabled) return
          const m = setErr(id, V[id](el.value, t))
          if (m) errs.push([id, m])
        })
        const fEl = document.getElementById('files') as HTMLInputElement | null
        if (fEl && !fEl.disabled) {
          const fm = fileErr()
          if (fm) errs.push(['files', fm])
        }
        const cEl = document.getElementById('consent') as HTMLInputElement | null
        if (cEl && !cEl.checked) {
          errs.push(['consent', 'Tick the box to agree to how we use your details'])
        }
        if (errs.length > 0) {
          e.preventDefault()
          if (sT) sT.textContent = 'Please fix ' + errs.length + (errs.length === 1 ? ' thing' : ' things') + ' before sending'
          if (sl) {
            sl.innerHTML = ''
            errs.forEach((x) => {
              const li = document.createElement('li')
              const a = document.createElement('a')
              a.href = '#' + x[0]
              a.textContent = x[1]
              li.appendChild(a)
              sl.appendChild(li)
            })
          }
          if (sum) {
            sum.hidden = false
            sum.focus()
          }
        } else if (sb) {
          sb.setAttribute('aria-busy', 'true')
        }
      }
      cf.addEventListener('submit', onCfSubmit)
      cleanups.push(() => cf.removeEventListener('submit', onCfSubmit))

      const q = new URLSearchParams(window.location.search)
      const pt = q.get('type')
      if (pt) {
        const r = cf.querySelector<HTMLInputElement>('input[name=type][value="' + pt + '"]')
        if (r) r.checked = true
      }
      show()
      if (q.get('service')) {
        const s = document.getElementById('service') as HTMLSelectElement | null
        if (s) s.value = q.get('service')!
      }
      if (q.get('equipment')) {
        const s2 = document.getElementById('equipment') as HTMLSelectElement | null
        if (s2) s2.value = q.get('equipment')!
      }
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
