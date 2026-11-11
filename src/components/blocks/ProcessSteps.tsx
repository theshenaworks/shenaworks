import React from 'react'
import { Timeline } from '@/components/ui/Timeline'
import type { ProcessStepItem } from '@/seed/data'

export interface ProcessStepsProps {
  id?: string
  heading: string
  steps: ProcessStepItem[]
}

export function ProcessSteps({ id, heading, steps }: ProcessStepsProps) {
  if (steps.length === 0) return null

  const entries = steps.map((step, idx) => ({
    id: `step-${idx + 1}`,
    overline: `Step ${idx + 1}`,
    title: step.title,
    body: step.description,
  }))

  return (
    <section
      id={id}
      data-surface="subtle"
      className="bg-[var(--grey-100)] py-[6.4rem] lg:py-[8.0rem] border-t border-b border-[var(--grey-300)]"
    >
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14">
          <h2 className="text-h2 text-[var(--ink-900)] mb-[4.0rem]">{heading}</h2>
          <Timeline entries={entries} variant="side-by-side" />
        </div>
      </div>
    </section>
  )
}
