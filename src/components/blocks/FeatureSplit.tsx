import React from 'react'
import { Button } from '@/components/ui/Button'
import type { MediaItem } from '@/types/content'

export interface FeatureSplitProps {
  imagePosition?: 'left' | 'right'
  panelSurface?: 'subtle' | 'dark'
  overline?: string
  heading: string
  body: string
  buttonLabel: string
  buttonHref: string
  buttonPrimary?: boolean
  image: MediaItem
  aspectRatio?: '4:3' | '1:1'
}

export function FeatureSplit({
  imagePosition = 'left',
  panelSurface = 'subtle',
  overline,
  heading,
  body,
  buttonLabel,
  buttonHref,
  buttonPrimary = false,
  image,
  aspectRatio = '4:3',
}: FeatureSplitProps) {
  const isDark = panelSurface === 'dark'
  const isLeft = imagePosition === 'left'

  return (
    <section data-reveal className="bg-[var(--white)] py-[4.8rem] lg:py-[6.4rem]">
      <div className="site-grid items-center">
        {/* Image block */}
        <figure
          className={`col-span-4 ${
            isLeft
              ? 'lg:col-start-1 lg:col-span-9 lg:row-start-1'
              : 'lg:col-start-8 lg:col-span-9 lg:row-start-1'
          }`}
        >
          <div
            className={`overflow-hidden bg-[var(--grey-100)] ${
              aspectRatio === '1:1' ? 'aspect-square max-w-[48.0rem] mx-auto lg:mx-0' : 'aspect-[4/3]'
            }`}
          >
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

        {/* Overlapping Panel */}
        <div
          data-surface={panelSurface}
          className={`col-span-4 z-10 p-[2.4rem] lg:p-[5.6rem] ${
            isLeft
              ? 'lg:col-start-9 lg:col-span-7 lg:row-start-1 lg:mt-[6.4rem]'
              : 'lg:col-start-2 lg:col-span-7 lg:row-start-1 lg:mt-[6.4rem]'
          } ${
            isDark
              ? 'bg-[var(--ink-900)] text-[var(--white)]'
              : 'bg-[var(--grey-100)] text-[var(--ink-900)]'
          }`}
        >
          {overline && (
            <p
              className={`text-overline mb-[1.2rem] ${
                isDark ? 'text-[var(--grey-500)]' : 'text-[var(--ink-600)]'
              }`}
            >
              {overline}
            </p>
          )}
          <h3 className={`text-h3 mb-[1.6rem] ${isDark ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'}`}>
            {heading}
          </h3>
          <p
            className={`text-body mb-[2.4rem] ${
              isDark ? 'text-[var(--grey-300)]' : 'text-[var(--ink-600)]'
            }`}
          >
            {body}
          </p>
          <Button
            href={buttonHref}
            variant={isDark ? 'outline-dark' : buttonPrimary ? 'primary' : 'secondary'}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
