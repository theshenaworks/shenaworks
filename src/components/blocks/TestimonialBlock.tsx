'use client'

import React, { useState } from 'react'
import { IconButton } from '@/components/ui/IconButton'
import type { TestimonialRecord } from '@/types/content'

export interface TestimonialBlockProps {
  testimonials: TestimonialRecord[]
}

export function TestimonialBlock({ testimonials }: TestimonialBlockProps) {
  const [index, setIndex] = useState(0)

  if (testimonials.length === 0) return null

  const current = testimonials[index] ?? testimonials[0]!

  return (
    <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem] border-t border-[var(--grey-300)]">
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-4 lg:col-span-10">
          <div aria-hidden="true" className="font-[var(--font-header)] text-[5.6rem] leading-none text-[var(--accent-500)] mb-[0.8rem]">
            &ldquo;
          </div>
          <blockquote className="text-h3 font-normal normal-case font-[var(--font-body)] text-[var(--ink-900)] mb-[2.4rem]">
            {current.quote}
          </blockquote>
          <footer>
            <p className="text-body-sm font-bold text-[var(--ink-900)]">{current.person}</p>
            <p className="text-body-xs text-[var(--ink-600)]">
              {current.title}, {current.organisation}
            </p>
            {current.date && (
              <p className="text-caption text-[var(--ink-600)] mt-[0.4rem]">{current.date}</p>
            )}
          </footer>

          {testimonials.length > 1 && (
            <div className="mt-[2.4rem] flex items-center gap-[1.2rem]">
              <IconButton
                label="Previous testimonial"
                icon="chevron-left"
                variant="outline"
                onClick={() =>
                  setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                }
              />
              <span className="text-body-xs text-[var(--ink-600)]">
                {index + 1} / {testimonials.length}
              </span>
              <IconButton
                label="Next testimonial"
                icon="chevron-right"
                variant="outline"
                onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
