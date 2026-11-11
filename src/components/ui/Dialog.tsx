'use client'

import React, { useEffect, useRef } from 'react'
import { IconButton } from './IconButton'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  id: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Dialog({ open, onClose, title, id, children, actions }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    openerRef.current = document.activeElement as HTMLElement | null
    const html = document.documentElement
    html.setAttribute('data-lock', 'page')

    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focusables && focusables.length > 0) {
      focusables[0].focus()
    } else {
      dialogRef.current?.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Tab' && dialogRef.current) {
        const nodes = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
        if (nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      html.removeAttribute('data-lock')
      openerRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[var(--z-dialog)] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-[var(--scrim)] transition-opacity duration-500"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        tabIndex={-1}
        className="relative z-10 bg-white text-[var(--ink-900)] w-full h-dvh md:h-auto md:max-w-[min(72rem,calc(100vw-4.8rem))] md:max-h-[calc(100dvh-9.6rem)] p-6 md:p-14 overflow-y-auto [filter:var(--shadow-2)] transition-[transform,opacity] duration-200 ease-[var(--ease-out-cubic)]"
      >
        <div className="absolute top-2 right-2">
          <IconButton icon="close" ariaLabel="Close dialog" dense onClick={onClose} />
        </div>
        <h3 id={`${id}-title`} className="t-h3 pr-12 mb-6">
          {title}
        </h3>
        <div className="t-body">{children}</div>
        {actions && (
          <div className="mt-8 flex flex-col md:flex-row md:justify-end gap-3">{actions}</div>
        )}
      </div>
    </div>
  )
}
