import React from 'react'
import { Button } from '@/components/ui/Button'

export interface StatementBlockProps {
  heading: string
  body: string
  caption?: string
  buttonLabel?: string
  buttonHref?: string
}

export function StatementBlock({
  heading,
  body,
  caption,
  buttonLabel,
  buttonHref,
}: StatementBlockProps) {
  return (
    <section className="bg-[var(--white)] py-[8.0rem] lg:py-[12.0rem] border-t border-b border-[var(--grey-300)]">
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-4 lg:col-span-10 text-center">
          <h2 className="text-h2 text-[var(--ink-900)] mb-[2.0rem]">{heading}</h2>
          <p className="text-body text-[var(--ink-600)] max-w-[60ch] mx-auto">{body}</p>
          {caption && (
            <p className="text-caption text-[var(--ink-600)] mt-[1.6rem]">{caption}</p>
          )}
          {buttonLabel && buttonHref && (
            <div className="mt-[3.2rem] flex justify-center">
              <Button href={buttonHref} variant="primary">
                {buttonLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
