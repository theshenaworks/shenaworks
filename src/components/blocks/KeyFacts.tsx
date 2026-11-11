import React from 'react'
import type { KeyFactItem } from '@/types/content'

export interface KeyFactsProps {
  heading?: string
  items: KeyFactItem[]
}

export function KeyFacts({ heading, items }: KeyFactsProps) {
  if (items.length === 0) return null

  return (
    <section className="bg-[var(--white)] py-[4.0rem] lg:py-[5.6rem] border-b border-[var(--grey-300)]">
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14">
          {heading && <h2 className="text-h2 text-[var(--ink-900)] mb-[3.2rem]">{heading}</h2>}
          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[3.2rem]">
            {items.map((item) => (
              <div key={item.term} className="border-t-2 border-[var(--grey-300)] pt-[1.6rem]">
                <dt className="text-overline text-[var(--ink-600)] mb-[0.8rem]">{item.term}</dt>
                <dd className="text-body font-bold text-[var(--ink-900)]">
                  {item.href ? (
                    <a href={item.href} className="text-label text-[var(--ink-900)] no-underline u-draw">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
