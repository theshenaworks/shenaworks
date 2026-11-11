import React from 'react'

export interface TimelineEntry {
  id: string
  overline: string
  title: string
  subtitle?: string
  body: string
}

export interface TimelineProps {
  entries: TimelineEntry[]
  variant?: 'centered' | 'side-by-side'
  className?: string
}

export function Timeline({ entries, variant = 'side-by-side', className = '' }: TimelineProps) {
  return (
    <div
      data-timeline={variant}
      className={`relative pl-8 lg:pl-0 ${className}`.trim()}
    >
      {/* 2px center/left track with scroll-linked fill (DESIGN.md 3.3 I & 5.15) */}
      <div
        aria-hidden="true"
        className="absolute left-1.5 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-[var(--grey-300)]"
      >
        <div
          data-timeline-fill
          className="w-full bg-[var(--accent-500)] h-full origin-top"
        />
      </div>

      <ol className="space-y-12 lg:space-y-16 list-none m-0 p-0">
        {entries.map((entry, idx) => {
          const isLeft = variant === 'side-by-side' && idx % 2 === 0
          return (
            <li
              key={entry.id}
              data-reveal="hidden"
              className={`relative lg:grid lg:grid-cols-12 lg:gap-8 items-start`}
            >
              {/* 12x12 square dot in accent-500 (DESIGN.md 5.15) */}
              <span
                aria-hidden="true"
                className="
                  absolute -left-[2.6rem] lg:left-1/2 lg:-translate-x-1/2 top-1.5
                  w-3 h-3 bg-[var(--accent-500)] ring-4 ring-white
                "
              />
              <div
                className={
                  variant === 'centered'
                    ? 'lg:col-start-4 lg:col-span-6 lg:bg-white lg:pt-6'
                    : isLeft
                      ? 'lg:col-start-1 lg:col-span-5 lg:text-right lg:pr-8'
                      : 'lg:col-start-8 lg:col-span-5 lg:pl-8'
                }
              >
                <p className="t-overline !text-[var(--accent-600)] mb-1">{entry.overline}</p>
                <h4 className="t-h4 text-[var(--ink-900)] mb-1">{entry.title}</h4>
                {entry.subtitle && (
                  <p className="t-body-xs font-bold text-[var(--ink-900)] mb-2">{entry.subtitle}</p>
                )}
                <p className="t-body-sm text-[var(--ink-600)]">{entry.body}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
