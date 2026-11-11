import React from 'react'
import { Accordion } from '@/components/ui/Accordion'
import type { FaqItem } from '@/seed/data'

export interface FaqAccordionProps {
  heading?: string
  items: FaqItem[]
}

export function FaqAccordion({ heading = "Questions we're asked", items }: FaqAccordionProps) {
  if (items.length === 0) return null

  const accordionItems = items.map((item, idx) => ({
    id: `faq-${idx}`,
    title: item.question,
    content: <p className="text-body text-[var(--ink-600)]">{item.answer}</p>,
  }))

  return (
    <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-10">
          <h2 className="text-h2 text-[var(--ink-900)] mb-[3.2rem]">{heading}</h2>
          <Accordion items={accordionItems} single={false} />
        </div>
      </div>
    </section>
  )
}
