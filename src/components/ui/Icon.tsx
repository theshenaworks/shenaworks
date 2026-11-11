import React from 'react'

export type IconName =
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-right'
  | 'arrow-left'
  | 'close'
  | 'plus'
  | 'minus'
  | 'check'
  | 'search'
  | 'menu'
  | 'external-link'
  | 'play'
  | 'pause'
  | 'alert'
  | 'info'
  | 'success'
  | 'phone'
  | 'mail'
  | 'download'
  | 'filter'
  | 'whatsapp'
  | 'linkedin'
  | 'facebook'

export interface IconProps {
  name: IconName
  size?: 16 | 18 | 24 | 32 | 40
  className?: string
  ariaLabel?: string
}

export function Icon({ name, size = 24, className = '', ariaLabel }: IconProps) {
  const isBrandOrPlay = name === 'play' || name === 'whatsapp' || name === 'linkedin' || name === 'facebook'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={isBrandOrPlay ? 'currentColor' : 'none'}
      stroke={isBrandOrPlay ? 'none' : 'currentColor'}
      strokeWidth={isBrandOrPlay ? 0 : 2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden={ariaLabel ? undefined : 'true'}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      className={`shrink-0 ${className}`.trim()}
    >
      {name === 'chevron-down' && <polyline points="6 9 12 15 18 9" />}
      {name === 'chevron-up' && <polyline points="18 15 12 9 6 15" />}
      {name === 'chevron-left' && <polyline points="15 18 9 12 15 6" />}
      {name === 'chevron-right' && <polyline points="9 18 15 12 9 6" />}
      {name === 'arrow-right' && (
        <>
          <line x1="4" y1="12" x2="19" y2="12" />
          <polyline points="13 6 19 12 13 18" />
        </>
      )}
      {name === 'arrow-left' && (
        <>
          <line x1="20" y1="12" x2="5" y2="12" />
          <polyline points="11 18 5 12 11 6" />
        </>
      )}
      {name === 'close' && (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </>
      )}
      {name === 'plus' && (
        <>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </>
      )}
      {name === 'minus' && <line x1="5" y1="12" x2="19" y2="12" />}
      {name === 'check' && <polyline points="4 12 9 17 20 6" />}
      {name === 'search' && (
        <>
          <circle cx="11" cy="11" r="7" />
          <line x1="20" y1="20" x2="16.2" y2="16.2" />
        </>
      )}
      {name === 'menu' && (
        <>
          <line x1="3" y1="8" x2="21" y2="8" />
          <line x1="3" y1="16" x2="21" y2="16" />
        </>
      )}
      {name === 'external-link' && (
        <>
          <polyline points="15 4 20 4 20 9" />
          <line x1="10" y1="14" x2="20" y2="4" />
          <polyline points="18 14 18 20 4 20 4 6 10 6" />
        </>
      )}
      {name === 'play' && <polygon points="7 4 20 12 7 20 7 4" />}
      {name === 'pause' && (
        <>
          <line x1="9" y1="5" x2="9" y2="19" />
          <line x1="15" y1="5" x2="15" y2="19" />
        </>
      )}
      {name === 'alert' && (
        <>
          <polygon points="12 3 22 20 2 20 12 3" />
          <line x1="12" y1="10" x2="12" y2="14" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </>
      )}
      {name === 'info' && (
        <>
          <rect x="3" y="3" width="18" height="18" />
          <line x1="12" y1="11" x2="12" y2="16" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </>
      )}
      {name === 'success' && (
        <>
          <rect x="3" y="3" width="18" height="18" />
          <polyline points="7.5 12.5 10.5 15.5 16.5 9.5" />
        </>
      )}
      {name === 'phone' && (
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
      )}
      {name === 'mail' && (
        <>
          <rect x="3" y="5" width="18" height="14" />
          <polyline points="3 7 12 13 21 7" />
        </>
      )}
      {name === 'download' && (
        <>
          <line x1="12" y1="4" x2="12" y2="15" />
          <polyline points="7 11 12 16 17 11" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </>
      )}
      {name === 'filter' && (
        <>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </>
      )}
      {name === 'whatsapp' && (
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 14.01c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.83-.11-.42-.14-.97-.32-1.66-.62-2.92-1.26-4.83-4.21-4.97-4.4-.15-.2-1.19-1.58-1.19-3.02 0-1.44.75-2.14 1.02-2.43.27-.29.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.32.02.51-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.35 1.45.29.15.46.12.63-.07.17-.2.73-.85.93-1.15.2-.29.39-.24.66-.15.27.1 1.71.81 2 .95.29.15.49.22.56.34.08.13.08.71-.16 1.39z" />
      )}
      {name === 'linkedin' && (
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 18H6V10h2.5v8zM7.25 8.88a1.45 1.45 0 1 1 0-2.9 1.45 1.45 0 0 1 0 2.9zM18 18h-2.5v-4.1c0-.98-.02-2.24-1.36-2.24-1.36 0-1.57 1.06-1.57 2.17V18H10V10h2.4v1.1h.03c.33-.63 1.15-1.3 2.37-1.3 2.53 0 3.2 1.67 3.2 3.84V18z" />
      )}
      {name === 'facebook' && (
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7v-6.5h-2V12h2V9.8c0-2 1.2-3.1 3-3.1.87 0 1.8.15 1.8.15v2h-1c-1 0-1.3.62-1.3 1.25V12h2.2l-.35 2.5H14.5V21H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
      )}
    </svg>
  )
}
