import React from 'react'
import { Icon, type IconName } from './Icon'
import { IconButton } from './IconButton'

export type MessageVariant = 'error' | 'success' | 'warning' | 'info'

export interface MessageBannerProps {
  variant?: MessageVariant
  title?: string
  children: React.ReactNode
  onDismiss?: () => void
  className?: string
  id?: string
  tabIndex?: number
}

export function MessageBanner({
  variant = 'info',
  title,
  children,
  onDismiss,
  className = '',
  id,
  tabIndex,
}: MessageBannerProps) {
  const config: Record<
    MessageVariant,
    { role: 'alert' | 'status'; icon: IconName; styles: string; iconColor: string }
  > = {
    error: {
      role: 'alert',
      icon: 'alert',
      styles: 'bg-[var(--error-tint)] border-l-4 border-[var(--error)] text-[var(--ink-900)]',
      iconColor: 'text-[var(--error)]',
    },
    success: {
      role: 'status',
      icon: 'check',
      styles: 'bg-[var(--success-tint)] border-l-4 border-[var(--success)] text-[var(--ink-900)]',
      iconColor: 'text-[var(--success)]',
    },
    warning: {
      role: 'status',
      icon: 'alert',
      styles: 'bg-[var(--warning-tint)] border-l-4 border-[var(--warning)] text-[var(--ink-900)]',
      iconColor: 'text-[var(--warning)]',
    },
    info: {
      role: 'status',
      icon: 'info',
      styles: 'bg-[var(--grey-100)] border-l-4 border-[var(--ink-900)] text-[var(--ink-900)]',
      iconColor: 'text-[var(--ink-900)]',
    },
  }

  const current = config[variant]

  return (
    <div
      id={id}
      role={current.role}
      tabIndex={tabIndex}
      className={`p-4 lg:py-4 lg:px-6 flex items-start gap-4 transition-opacity duration-200 ${current.styles} ${className}`.trim()}
    >
      <span className={`mt-0.5 ${current.iconColor}`}>
        <Icon name={current.icon} size={24} />
      </span>
      <div className="flex-1 t-body">
        {title && <p className="font-bold mb-1">{title}</p>}
        <div>{children}</div>
      </div>
      {onDismiss && (
        <IconButton
          icon="close"
          ariaLabel="Dismiss message"
          dense
          onClick={onDismiss}
          className="shrink-0"
        />
      )}
    </div>
  )
}
