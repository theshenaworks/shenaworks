import React from 'react'
import { Icon, type IconName } from './Icon'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  ariaLabel?: string
  label?: string
  dense?: boolean
  size?: 'default' | 'dense'
  onDark?: boolean
  variant?: 'subtle' | 'outline' | 'outline-dark'
  href?: string
  external?: boolean
  target?: string
  rel?: string
}

export function IconButton({
  icon,
  ariaLabel,
  label,
  dense = false,
  size,
  onDark = false,
  variant,
  href,
  external = false,
  target,
  rel,
  className = '',
  disabled,
  ...rest
}: IconButtonProps) {
  const isDense = dense || size === 'dense'
  const isDark = onDark || variant === 'outline-dark'
  const accessibleLabel = ariaLabel || label || icon
  const classes = `icon-button swipe ${isDense ? 'icon-button--dense' : ''} ${
    isDark ? 'icon-button--on-dark' : ''
  } ${className}`.trim()

  if (href) {
    return (
      <a
        href={href}
        aria-label={accessibleLabel}
        className={classes}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
      >
        <Icon name={icon} size={24} />
      </a>
    )
  }

  return (
    <button
      type="button"
      aria-label={accessibleLabel}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      <Icon name={icon} size={24} />
    </button>
  )
}
