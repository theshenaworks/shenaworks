import React from 'react'
import NextLink from 'next/link'

export interface CardProps {
  title: string
  href: string
  overline?: string
  summary?: string
  meta?: React.ReactNode
  imageSrc?: string
  imageAlt?: string
  aspectRatio?: '4:3' | '16:9'
  dark?: boolean
  signalOverline?: boolean
  className?: string
}

export function Card({
  title,
  href,
  overline,
  summary,
  meta,
  imageSrc,
  imageAlt = '',
  aspectRatio = '4:3',
  dark = false,
  signalOverline = false,
  className = '',
}: CardProps) {
  return (
    <article
      data-surface={dark ? 'dark' : undefined}
      className={`group relative flex flex-col bg-transparent focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--ring)] ${className}`.trim()}
    >
      {imageSrc && (
        <div
          className={`w-full overflow-hidden bg-[var(--grey-100)] mb-4 ${
            aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[4/3]'
          }`}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            width={aspectRatio === '16:9' ? 960 : 800}
            height={aspectRatio === '16:9' ? 540 : 600}
            className="block w-full h-full object-cover"
          />
        </div>
      )}
      {overline && (
        <p
          className={`t-overline mb-2 ${
            signalOverline && !dark ? '!text-[var(--accent-500)]' : ''
          }`.trim()}
        >
          {overline}
        </p>
      )}
      <h4 className="t-h4 mb-3">
        <NextLink
          href={href}
          className="no-underline text-inherit focus:outline-none after:content-[''] after:absolute after:inset-0"
        >
          <span className="u-draw pb-0.5 group-hover:bg-[position:0_100%] group-hover:bg-[size:100%_2px]">
            {title}
          </span>
        </NextLink>
      </h4>
      {summary && <p className="t-body-sm text-[var(--fg)] mb-3">{summary}</p>}
      {meta && <div className="t-body-xs mt-auto pt-1">{meta}</div>}
    </article>
  )
}
