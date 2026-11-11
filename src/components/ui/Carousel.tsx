'use client'

import React, { useState, useRef } from 'react'
import { IconButton } from './IconButton'

export interface CarouselSlide {
  id: string
  content: React.ReactNode
}

export interface CarouselProps {
  id: string
  ariaLabel: string
  slides: CarouselSlide[]
  variant?: 'scroller' | 'fade' | 'full-width'
  loop?: boolean
  className?: string
}

export function Carousel({
  id,
  ariaLabel,
  slides,
  variant = 'scroller',
  loop = false,
  className = '',
}: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const trackRef = useRef<HTMLDivElement | null>(null)

  const total = slides.length
  if (total === 0) return null

  const goTo = (nextIdx: number) => {
    let target = nextIdx
    if (loop) {
      target = (nextIdx + total) % total
    } else {
      target = Math.max(0, Math.min(total - 1, nextIdx))
    }
    if (target === activeIndex) return
    setDirection(target > activeIndex ? 'forward' : 'backward')
    setActiveIndex(target)

    if (variant !== 'fade' && trackRef.current) {
      const slideEls = trackRef.current.querySelectorAll<HTMLElement>('[data-carousel-slide]')
      const targetEl = slideEls[target]
      if (targetEl) {
        const prefersReduced =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        trackRef.current.scrollTo({
          left: targetEl.offsetLeft,
          behavior: prefersReduced ? 'auto' : 'smooth',
        })
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(activeIndex + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(activeIndex - 1)
    }
  }

  return (
    <section
      id={id}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      data-direction={direction}
      className={`relative ${className}`.trim()}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {activeIndex + 1} of {total}
      </div>

      {variant === 'fade' ? (
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`${ariaLabel} slides`}
          className="relative overflow-hidden focus-visible:outline-offset-[-2px]"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${total}`}
                aria-hidden={!isActive}
                data-slide={isActive ? 'active' : idx > activeIndex ? 'next' : 'prev'}
                className={`${isActive ? 'relative z-10 block' : 'hidden'} transition-opacity duration-200`}
              >
                {slide.content}
              </div>
            )
          })}
        </div>
      ) : (
        <div
          ref={trackRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`${ariaLabel} slides`}
          data-drag-scroll
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 focus-visible:outline-offset-[-2px] cursor-grab active:cursor-grabbing"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex
            return (
              <div
                key={slide.id}
                data-carousel-slide
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${total}`}
                data-slide={isActive ? 'active' : idx > activeIndex ? 'next' : 'prev'}
                className={`shrink-0 snap-start ${
                  variant === 'full-width' ? 'w-full' : 'w-[85vw] sm:w-[46vw] md:w-[31%]'
                }`}
              >
                {slide.content}
              </div>
            )
          })}
        </div>
      )}

      {total > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {/* Progress bullets (DESIGN.md 5.13) */}
          <div className="flex items-center gap-4" role="group" aria-label="Choose slide">
            {slides.map((slide, idx) => {
              const isActive = idx === activeIndex
              const num = String(idx + 1).padStart(2, '0')
              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Slide ${num} of ${String(total).padStart(2, '0')}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => goTo(idx)}
                  className="group flex flex-col items-start justify-center min-h-[4.4rem] min-w-[3.2rem] cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className={`t-overline text-[1.4rem] leading-[1.8rem] mb-1.5 transition-opacity duration-200 ${
                      isActive ? 'opacity-100 !text-[var(--fg)]' : 'opacity-0'
                    }`}
                  >
                    {num}
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative block w-8 h-[2px] bg-[var(--grey-300)] group-hover:bg-[var(--accent-500)] transition-colors duration-200"
                  >
                    <span
                      className={`block h-full bg-[var(--accent-500)] origin-left transition-transform duration-200 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </span>
                </button>
              )
            })}
          </div>

          {/* Arrow pair 8px apart (DESIGN.md 5.3) */}
          <div className="flex items-center gap-2">
            <IconButton
              icon="chevron-left"
              ariaLabel="Previous slide"
              aria-controls={id}
              disabled={!loop && activeIndex === 0}
              onClick={() => goTo(activeIndex - 1)}
            />
            <IconButton
              icon="chevron-right"
              ariaLabel="Next slide"
              aria-controls={id}
              disabled={!loop && activeIndex === total - 1}
              onClick={() => goTo(activeIndex + 1)}
            />
          </div>
        </div>
      )}
    </section>
  )
}
