import React from 'react'
import NextLink from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onPhoto?: boolean
  className?: string
}

export function Breadcrumb({ items, onPhoto = false, className = '' }: BreadcrumbProps) {
  if (!items.length) return null

  return (
    <nav aria-label="Breadcrumb" className={`t-body-xs ${onPhoto ? '!text-white' : ''} ${className}`.trim()}>
      <ol className="flex flex-wrap items-center list-none m-0 p-0 gap-y-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center">
              {idx > 0 && (
                /* Separator slash: 2x17px bar skewed -27.5deg, 12px side margins (DESIGN.md 2.5 & 5.23) */
                <span
                  aria-hidden="true"
                  className={`inline-block w-[2px] h-[1.7rem] mx-3 -skew-x-[27.5deg] ${
                    onPhoto ? 'bg-white/60' : 'bg-[var(--grey-500)]'
                  }`}
                />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current="page"
                  className={onPhoto ? 'text-white font-bold' : 'text-[var(--ink-900)]'}
                >
                  {item.label}
                </span>
              ) : (
                <NextLink
                  href={item.href}
                  className={`u-draw pb-0.5 no-underline ${
                    onPhoto ? 'text-white/90 hover:text-white' : 'text-[var(--ink-600)] hover:text-[var(--ink-900)]'
                  }`}
                >
                  {item.label}
                </NextLink>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
