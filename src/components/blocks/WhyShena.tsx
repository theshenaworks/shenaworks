import React from 'react'
import { Button } from '@/components/ui/Button'
import type { MediaItem } from '@/seed/data'

export interface WhyShenaPoint {
  number: string
  title: string
  description: string
  verified: boolean
}

export interface WhyShenaProps {
  overline?: string
  heading: string
  image: MediaItem
  points: WhyShenaPoint[]
}

export function WhyShena({
  overline = 'Why Shena Works',
  heading,
  image,
  points,
}: WhyShenaProps) {
  const verifiedPoints = points.filter((p) => p.verified)
  if (verifiedPoints.length === 0) return null

  return (
    <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
      <div className="site-grid items-center">
        <figure className="col-span-4 lg:col-start-1 lg:col-span-9 lg:row-start-1">
          <div className="aspect-[4/3] overflow-hidden bg-[var(--grey-100)]">
            <img
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          {image.caption && (
            <figcaption className="text-figcaption text-[var(--ink-600)] mt-[0.8rem] px-[1.6rem] lg:px-0">
              {image.caption}
            </figcaption>
          )}
        </figure>

        <div
          data-surface="dark"
          className="col-span-4 lg:col-start-9 lg:col-span-7 lg:row-start-1 lg:mt-[6.4rem] z-10 bg-[var(--ink-900)] text-[var(--white)] p-[2.4rem] lg:p-[5.6rem]"
        >
          <p className="text-overline text-[var(--grey-500)] mb-[1.2rem]">{overline}</p>
          <h2 className="text-h3 text-[var(--white)] mb-[2.4rem]">{heading}</h2>

          <ol className="space-y-[2.0rem] mb-[3.2rem]">
            {verifiedPoints.map((point) => (
              <li key={point.number} className="border-t border-[var(--ink-600)] pt-[1.6rem]">
                <p className="text-label text-[var(--white)] mb-[0.4rem]">
                  <span className="text-[var(--accent-on-dark)] mr-[0.8rem]">{point.number}</span>
                  {point.title}
                </p>
                <p className="text-body-sm text-[var(--grey-300)]">{point.description}</p>
              </li>
            ))}
          </ol>

          <Button href="/about/leadership" variant="outline-dark">
            Meet our managing director
          </Button>
        </div>
      </div>
    </section>
  )
}
