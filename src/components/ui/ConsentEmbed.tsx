'use client'

import React, { useState } from 'react'

export interface ConsentEmbedProps {
  title: string
  embedUrl?: string
  fallbackAddress?: string
  directionsUrl?: string
  className?: string
}

export function ConsentEmbed({
  title,
  embedUrl,
  fallbackAddress,
  directionsUrl,
  className = '',
}: ConsentEmbedProps) {
  const [allowed, setAllowed] = useState(false)

  return (
    <div
      data-consent={allowed ? 'allowed' : 'blocked'}
      className={`relative w-full aspect-video bg-[var(--grey-300)] flex items-center justify-center overflow-hidden ${className}`.trim()}
    >
      {allowed && embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
        />
      ) : (
        <div className="max-w-[36em] p-6 text-center flex flex-col items-center gap-4">
          <p className="t-body-xs !text-[var(--ink-800)]">
            This map is provided by Google and may set cookies when loaded.
          </p>
          {fallbackAddress && (
            <p className="t-body-sm font-bold text-[var(--ink-900)]">{fallbackAddress}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {embedUrl && (
              <button
                type="button"
                onClick={() => setAllowed(true)}
                className="t-label cursor-pointer bg-[linear-gradient(var(--accent-500),var(--accent-500))] bg-[position:0_100%] bg-[size:100%_2px] bg-no-repeat pb-1 transition-[background-size] duration-200 hover:bg-[position:100%_100%] hover:bg-[size:0_2px]"
              >
                Load map
              </button>
            )}
            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label u-draw pb-1 text-[var(--ink-900)] no-underline"
              >
                Open in Google Maps (opens in a new tab)
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
