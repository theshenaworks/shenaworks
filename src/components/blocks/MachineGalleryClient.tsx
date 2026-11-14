'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { MediaItem } from '@/types/content'

export interface MachineGalleryClientProps {
  machineName: string
  images: MediaItem[]
}

export function MachineGalleryClient({ machineName, images }: MachineGalleryClientProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const count = images.length

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count === 0) return
      const normalized = ((nextIndex % count) + count) % count
      setIndex(normalized)
      const track = trackRef.current
      if (track) {
        track.scrollTo({
          left: normalized * track.clientWidth,
          behavior: 'smooth',
        })
      }
    },
    [count],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track || count <= 1) return

    const handleScroll = () => {
      const width = track.clientWidth || 1
      const current = Math.round(track.scrollLeft / width)
      setIndex(Math.min(Math.max(current, 0), count - 1))
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => track.removeEventListener('scroll', handleScroll)
  }, [count])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (count <= 1) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(index + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(index - 1)
    }
  }

  return (
    <div
      aria-label="Machine gallery"
      aria-roledescription="carousel"
      className="gal"
      id="gal"
      role="region"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="gtrack" id="gt" ref={trackRef}>
        {images.map((img, idx) => (
          <div
            key={idx}
            aria-label={`${machineName}, image ${idx + 1} of ${count}`}
            className="ph warm"
            role="img"
          >
            <Image
              src={img.url}
              alt={img.alt || `${machineName} photo ${idx + 1}`}
              fill
              priority={idx === 0}
              loading={idx === 0 ? undefined : 'lazy'}
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </div>
        ))}
      </div>
      {count > 1 && (
        <div className="gctl">
          <button
            aria-label="Previous image"
            id="gp"
            type="button"
            onClick={() => goTo(index - 1)}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
          <span aria-live="polite" className="ct" id="gc">
            {`${index + 1} / ${count}`}
          </span>
          <button
            aria-label="Next image"
            id="gn"
            type="button"
            onClick={() => goTo(index + 1)}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
