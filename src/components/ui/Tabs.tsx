'use client'

import React, { useState, useRef } from 'react'

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  ariaLabel: string
  defaultTabId?: string
  className?: string
}

export function Tabs({ items, ariaLabel, defaultTabId, className = '' }: TabsProps) {
  const [activeId, setActiveId] = useState<string>(defaultTabId ?? items[0]?.id ?? '')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabledIndices = items
      .map((item, idx) => (item.disabled ? -1 : idx))
      .filter((idx) => idx !== -1)
    const currentPos = enabledIndices.indexOf(index)
    if (currentPos === -1) return

    let nextIndex = -1
    if (e.key === 'ArrowRight') {
      nextIndex = enabledIndices[(currentPos + 1) % enabledIndices.length]
    } else if (e.key === 'ArrowLeft') {
      nextIndex = enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length]
    } else if (e.key === 'Home') {
      nextIndex = enabledIndices[0]
    } else if (e.key === 'End') {
      nextIndex = enabledIndices[enabledIndices.length - 1]
    }

    if (nextIndex !== -1) {
      e.preventDefault()
      const nextTab = items[nextIndex]
      setActiveId(nextTab.id)
      tabRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex flex-wrap border-b-2 border-[var(--grey-300)] gap-2"
      >
        {items.map((item, index) => {
          const isSelected = item.id === activeId
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              id={`tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={`tabpanel-${item.id}`}
              aria-disabled={item.disabled ? 'true' : undefined}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !item.disabled && setActiveId(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`t-label px-4 py-3 min-h-[4.4rem] -mb-[2px] cursor-pointer transition-colors duration-200 focus-visible:outline-offset-[-2px] u-draw ${
                isSelected
                  ? 'text-[var(--ink-900)] border-b-2 border-[var(--accent-500)]'
                  : item.disabled
                    ? 'text-[var(--grey-500)] cursor-not-allowed'
                    : 'text-[var(--ink-600)] hover:text-[var(--ink-900)]'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {items.map((item) => {
        const isSelected = item.id === activeId
        return (
          <div
            key={item.id}
            id={`tabpanel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            hidden={!isSelected}
            tabIndex={0}
            className="pt-8 transition-opacity duration-200"
          >
            {item.content}
          </div>
        )
      })}
    </div>
  )
}
