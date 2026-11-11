'use client'

import React, { useEffect, useState } from 'react'

export interface SectionNavItem {
  id: string
  label: string
}

export interface SectionNavProps {
  items: SectionNavItem[]
  ariaLabel?: string
  className?: string
}

export function SectionNav({
  items,
  ariaLabel = 'Page sections',
  className = '',
}: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '')

  useEffect(() => {
    if (items.length === 0 || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      },
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav
      aria-label={ariaLabel}
      className={`sticky top-[5.2rem] lg:top-[6.4rem] z-30 bg-[var(--white)] border-b border-[var(--grey-300)] shadow-[var(--shadow-1)] ${className}`}
    >
      <div className="site-container">
        <ul className="flex items-center gap-[2.4rem] overflow-x-auto no-scrollbar py-[1.2rem]">
          {items.map((item) => {
            const isActive = activeId === item.id
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  className={`text-label transition-colors duration-200 pb-[0.4rem] ${
                    isActive
                      ? 'text-[var(--ink-900)] border-b-2 border-[var(--accent-500)]'
                      : 'text-[var(--ink-600)] hover:text-[var(--ink-900)]'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
