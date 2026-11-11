'use client'

import React, { useState } from 'react'
import { Icon } from './Icon'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  defaultOpen?: boolean
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  single?: boolean
  mobileOnly?: boolean
  headingLevel?: 'h3' | 'h4'
  triggerStyle?: 'h4' | 'label'
  className?: string
}

export function Accordion({
  items,
  single = false,
  mobileOnly = false,
  headingLevel = 'h3',
  triggerStyle = 'h4',
  className = '',
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items.filter((item) => item.defaultOpen).map((item) => item.id),
  )

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id)
      if (isOpen) {
        return prev.filter((item) => item !== id)
      }
      return single ? [id] : [...prev, id]
    })
  }

  const HeadingTag = headingLevel

  return (
    <div
      data-accordion
      data-accordion-single={single ? 'true' : undefined}
      data-accordion-mobile-only={mobileOnly ? 'true' : undefined}
      className={`divide-y-2 divide-[var(--rule)] border-b-2 border-[var(--rule)] ${className}`.trim()}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        const panelId = `accordion-panel-${item.id}`
        const triggerId = `accordion-trigger-${item.id}`

        return (
          <div key={item.id} className="py-5">
            <HeadingTag className="m-0">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-disabled={item.disabled ? 'true' : undefined}
                disabled={item.disabled}
                onClick={() => !item.disabled && toggle(item.id)}
                className={`w-full flex items-center justify-between gap-4 text-left py-2 cursor-pointer group focus-visible:outline-offset-[-2px] ${
                  item.disabled ? 'text-[var(--grey-500)] cursor-not-allowed' : ''
                }`}
              >
                <span className={`${triggerStyle === 'label' ? 't-label' : 't-h4'} u-draw pb-0.5`}>
                  {item.title}
                </span>
                <span
                  className={`transition-transform duration-200 ease-[var(--ease-out-cubic)] ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  } ${mobileOnly ? 'lg:hidden' : ''}`}
                >
                  <Icon name="chevron-down" size={24} />
                </span>
              </button>
            </HeadingTag>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={`pt-4 t-body text-[var(--fg)] ${mobileOnly ? 'lg:!block' : ''}`}
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
