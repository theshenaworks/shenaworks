import React from 'react'
import { Icon, type IconName } from './Icon'
import { Button } from './Button'

export interface EmptyStateProps {
  icon?: IconName
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`max-w-[48.0rem] mx-auto text-center py-[6.4rem] px-[2.4rem] ${className}`}
    >
      {icon && (
        <div className="flex justify-center mb-[1.6rem] text-[var(--grey-600)]">
          <Icon name={icon} size={40} aria-hidden="true" />
        </div>
      )}
      <h4 tabIndex={-1} className="text-h4 text-[var(--ink-900)] mb-[0.8rem] outline-none">
        {title}
      </h4>
      <p className="text-body text-[var(--ink-600)] mb-[2.4rem]">{description}</p>
      {actionLabel && (
        <div>
          {actionHref ? (
            <Button variant="secondary" href={actionHref}>
              {actionLabel}
            </Button>
          ) : (
            <Button variant="secondary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
