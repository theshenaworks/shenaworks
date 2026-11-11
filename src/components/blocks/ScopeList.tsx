import React from 'react'
import type { ScopeItem } from '@/types/content'

export interface ScopeListProps {
  heading?: string
  items: ScopeItem[]
}

export function ScopeList({ heading = 'What we do', items }: ScopeListProps) {
  if (items.length === 0) return null

  return (
    <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14">
          <h2 className="text-h2 text-[var(--ink-900)] mb-[4.0rem]">{heading}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-[3.2rem]">
            {items.map((item) => (
              <li
                key={item.title}
                className="border-t-2 border-[var(--grey-300)] pt-[2.4rem]"
              >
                <h3 className="text-h4 text-[var(--ink-900)] mb-[0.8rem]">{item.title}</h3>
                <p className="text-body-sm text-[var(--ink-600)]">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
