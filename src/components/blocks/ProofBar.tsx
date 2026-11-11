import React from 'react'

export interface ProofItem {
  value: string
  label: string
  verified: boolean
}

export interface ProofBarProps {
  items: ProofItem[]
}

/**
 * SITE-PLAN.md 5.4 & 8:
 * Hide if fewer than 2 verified items. Never show placeholder or unverified numbers.
 */
export function ProofBar({ items }: ProofBarProps) {
  const verifiedItems = items.filter((item) => item.verified).slice(0, 4)
  if (verifiedItems.length < 2) return null

  return (
    <section data-surface="dark" className="bg-[var(--ink-900)] text-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-2 lg:grid-cols-4 gap-x-[3.2rem] lg:gap-x-[6.4rem] gap-y-[3.2rem]">
          {verifiedItems.map((item) => (
            <div key={item.label}>
              <p className="font-[var(--font-header)] text-h3 lg:text-h2 text-[var(--accent-on-dark)] leading-none mb-[0.8rem]">
                {item.value}
              </p>
              <p className="text-body-sm text-[var(--white)] max-w-[22ch]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
