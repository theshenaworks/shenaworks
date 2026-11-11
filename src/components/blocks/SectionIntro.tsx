import React from 'react'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'

export interface SectionIntroProps {
  overline?: string
  heading: string
  body?: string
  actionLabel?: string
  actionHref?: string
  actionVariant?: 'link' | 'secondary' | 'outline-dark'
  dark?: boolean
}

export function SectionIntro({
  overline,
  heading,
  body,
  actionLabel,
  actionHref,
  actionVariant = 'link',
  dark = false,
}: SectionIntroProps) {
  return (
    <div className="site-grid items-end mb-[4.0rem] lg:mb-[4.8rem]">
      <div className="col-span-4 lg:col-start-2 lg:col-span-9">
        {overline && (
          <p
            className={`text-overline mb-[1.2rem] ${
              dark ? 'text-[var(--grey-500)]' : 'text-[var(--ink-600)]'
            }`}
          >
            {overline}
          </p>
        )}
        <h2 className={`text-h2 ${dark ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'}`}>
          {heading}
        </h2>
        {body && (
          <p
            className={`text-body mt-[1.6rem] max-w-[62ch] ${
              dark ? 'text-[var(--grey-300)]' : 'text-[var(--ink-600)]'
            }`}
          >
            {body}
          </p>
        )}
      </div>

      {actionLabel && actionHref && (
        <div className="col-span-4 lg:col-start-12 lg:col-span-4 mt-[2.4rem] lg:mt-0 lg:flex lg:justify-end">
          {actionVariant === 'link' ? (
            <a
              href={actionHref}
              className={`inline-flex items-center gap-[0.8rem] text-label no-underline u-draw ${
                dark ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'
              }`}
            >
              <span>{actionLabel}</span>
              <Icon name="arrow-right" size={18} />
            </a>
          ) : (
            <Button href={actionHref} variant={actionVariant}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
