'use client'

import React, { useEffect, useRef } from 'react'

export interface MegaPanelProps {
  id: string
  open: boolean
  labelledBy?: string
  onClose?: () => void
  children: React.ReactNode
  className?: string
}

export function MegaPanel({
  id,
  open,
  labelledBy,
  onClose,
  children,
  className = '',
}: MegaPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <div
      id={id}
      ref={panelRef}
      role="region"
      aria-labelledby={labelledBy}
      aria-hidden={!open}
      className={`absolute inset-x-0 top-full bg-[var(--white)] text-[var(--ink-900)] border-b border-[var(--grey-300)] shadow-[var(--shadow-1)] transition-opacity duration-200 ${
        open
          ? 'opacity-100 pointer-events-auto visible'
          : 'opacity-0 pointer-events-none invisible'
      } ${className}`}
    >
      <div className="site-grid py-[4.0rem]">
        <div className="col-start-2 col-span-14">{children}</div>
      </div>
    </div>
  )
}
