'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

/**
 * StatementBlock (Next.js 16 Self-Contained Client Component)
 * Emits McCarthy-style statement block with self-contained scroll-driven wipe choreography.
 * Respects prefers-reduced-motion.
 */
export interface StatementBlockProps {
  heading?: string
  body?: string
  caption?: string
  buttonLabel?: string
  buttonHref?: string
}

export function StatementBlock(_props: StatementBlockProps = {}) {
  const runRef = useRef<HTMLDivElement>(null)
  const l2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const run = runRef.current
    const l2 = l2Ref.current
    if (!run || !l2) return

    const handleScroll = () => {
      const r = run.getBoundingClientRect()
      const t = -r.top / Math.max(1, r.height - window.innerHeight)
      l2.style.setProperty('--p', String(Math.min(1, Math.max(0, (t - 0.3) / 0.3))))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <section className="stmt" aria-label="How we work">
      <div className="stmt-run" ref={runRef}>
        <div className="stmt-stick">
          <div className="stmt-layer l1">
            <div className="ph">
              <Image
                src="/media/statement-machines.jpg"
                alt="Crew standing beside a road roller on a murram road"
                fill
                sizes="100vw"
              />
            </div>
            <p className="d">
              Show us the site. <strong>We’ll bring the machines.</strong>
            </p>
          </div>
          <div className="stmt-layer l2" ref={l2Ref}>
            <div className="ph warm">
              <Image
                src="/media/statement-keys.jpg"
                alt="A finished modern building handed over to the client"
                fill
                sizes="100vw"
              />
            </div>
            <p className="d">
              Give us the drawings. <strong>We’ll hand over the keys.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
