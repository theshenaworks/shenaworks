'use client'

import React from 'react'
import { Carousel } from '@/components/ui/Carousel'
import type { MediaItem } from '@/types/content'

export interface GalleryProps {
  id?: string
  title?: string
  images: MediaItem[]
  aspectRatio?: '16:9' | '4:3'
}

/**
 * SITE-PLAN.md 5.19 & 8:
 * Minimum 3 images for carousel; with 1–2 images render them as stacked figures instead.
 */
export function Gallery({
  id = 'gallery',
  title = 'Project gallery',
  images,
  aspectRatio = '16:9',
}: GalleryProps) {
  if (images.length === 0) return null

  const ratioClass = aspectRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-video'

  if (images.length < 3) {
    return (
      <div className="space-y-[3.2rem]">
        {images.map((img, idx) => (
          <figure key={`${img.url}-${idx}`}>
            <div className={`${ratioClass} overflow-hidden bg-[var(--grey-100)]`}>
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            {img.caption && (
              <figcaption className="text-figcaption text-[var(--ink-600)] mt-[0.8rem]">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    )
  }

  const slides = images.map((img, idx) => ({
    id: `${id}-slide-${idx}`,
    content: (
      <figure className="m-0">
        <div className={`${ratioClass} overflow-hidden bg-[var(--grey-100)]`}>
          <img
            src={img.url}
            alt={img.alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        {img.caption && (
          <figcaption className="text-figcaption text-[var(--ink-600)] mt-[0.8rem]">
            {img.caption}
          </figcaption>
        )}
      </figure>
    ),
  }))

  return <Carousel id={id} ariaLabel={title} slides={slides} variant="full-width" />
}
