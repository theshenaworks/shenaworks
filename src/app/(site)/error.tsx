'use client'

import React from 'react'
import { PageHeader } from '@/components/blocks/PageHeader'
import { Button } from '@/components/ui/Button'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const phoneE164 = '+254718971896'
  const phoneDisplay = '+254 718 971 896'

  return (
    <div className="bg-[var(--white)] min-h-[70vh]">
      <PageHeader
        overline="Error"
        headline="Something went wrong on our side"
        lead={`Please try again in a minute. If you were sending an enquiry, call or WhatsApp us on ${phoneDisplay} so it isn't lost.`}
      />
      <section className="py-[4.8rem] lg:py-[6.4rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-10 flex flex-wrap items-center gap-[1.2rem]">
            <Button variant="secondary" onClick={() => reset()}>
              Try again
            </Button>
            <Button href={`tel:${phoneE164}`} variant="outline">
              Call us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
