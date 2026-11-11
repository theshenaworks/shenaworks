import React from 'react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | 'ellipsis')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis')
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-[0.8rem] my-[3.2rem] ${className}`}
    >
      {currentPage > 1 ? (
        <a
          href={buildHref(currentPage - 1)}
          className="inline-flex items-center justify-center min-h-[4.4rem] min-w-[4.4rem] px-[1.6rem] border border-[var(--grey-300)] text-body font-bold text-[var(--ink-900)] hover:border-[var(--ink-900)] transition-colors duration-200"
          aria-label="Previous page"
        >
          Previous
        </a>
      ) : (
        <span
          className="inline-flex items-center justify-center min-h-[4.4rem] min-w-[4.4rem] px-[1.6rem] border border-[var(--grey-300)] text-body text-[var(--grey-400)] cursor-not-allowed opacity-50"
          aria-disabled="true"
        >
          Previous
        </span>
      )}

      {pages.map((p, idx) => {
        if (p === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex items-center justify-center min-h-[4.4rem] min-w-[4.4rem] text-body text-[var(--ink-600)]"
              aria-hidden="true"
            >
              …
            </span>
          )
        }

        const isCurrent = p === currentPage
        return (
          <a
            key={p}
            href={buildHref(p)}
            aria-current={isCurrent ? 'page' : undefined}
            className={`inline-flex items-center justify-center min-h-[4.4rem] min-w-[4.4rem] px-[1.2rem] border text-body font-bold transition-colors duration-200 ${
              isCurrent
                ? 'bg-[var(--ink-900)] text-[var(--white)] border-[var(--ink-900)]'
                : 'border-[var(--grey-300)] text-[var(--ink-900)] hover:border-[var(--ink-900)] hover:bg-[var(--grey-100)]'
            }`}
          >
            {p}
          </a>
        )
      })}

      {currentPage < totalPages ? (
        <a
          href={buildHref(currentPage + 1)}
          className="inline-flex items-center justify-center min-h-[4.4rem] min-w-[4.4rem] px-[1.6rem] border border-[var(--grey-300)] text-body font-bold text-[var(--ink-900)] hover:border-[var(--ink-900)] transition-colors duration-200"
          aria-label="Next page"
        >
          Next
        </a>
      ) : (
        <span
          className="inline-flex items-center justify-center min-h-[4.4rem] min-w-[4.4rem] px-[1.6rem] border border-[var(--grey-300)] text-body text-[var(--grey-400)] cursor-not-allowed opacity-50"
          aria-disabled="true"
        >
          Next
        </span>
      )}
    </nav>
  )
}
