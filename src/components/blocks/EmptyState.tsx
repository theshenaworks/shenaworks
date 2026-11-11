import React from 'react'
import { Button } from '@/components/ui/Button'

export interface EmptyStateProps {
  title: string
  body: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  body,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      data-surface="subtle"
      className="bg-[var(--grey-100)] border border-[var(--grey-300)] p-[4.0rem] text-center"
    >
      <h3 className="text-h3 text-[var(--ink-900)] mb-[1.2rem]">{title}</h3>
      <p className="text-body text-[var(--ink-600)] max-w-[48ch] mx-auto mb-[2.4rem]">{body}</p>
      {actionLabel && (actionHref || onAction) && (
        <Button href={actionHref} onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
