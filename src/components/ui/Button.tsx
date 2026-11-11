import React from 'react'
import NextLink from 'next/link'
import { Icon, type IconName } from './Icon'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'dark'
  | 'light'
  | 'subtle'
  | 'outline'
  | 'outline-dark'
  | 'link'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  href?: string
  iconLeft?: IconName
  iconRight?: IconName
  loading?: boolean
  wrap?: boolean
  pressed?: boolean
  external?: boolean
}

export function Button({
  variant = 'primary',
  href,
  iconLeft,
  iconRight,
  loading = false,
  wrap = false,
  pressed,
  external = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const variantClass = variant === 'link' ? 'button button--link u-draw' : `button swipe button--${variant}`
  const wrapClass = wrap ? 'button--wrap' : ''
  const classes = `${variantClass} ${wrapClass} ${className}`.trim()

  const content = (
    <>
      {loading ? <span className="spinner" aria-hidden="true" /> : iconLeft ? <Icon name={iconLeft} size={18} /> : null}
      <span>{children}</span>
      {iconRight && !loading ? <Icon name={iconRight} size={18} /> : null}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  )

  if (href) {
    const isExt = external || /^https?:\/\//i.test(href) || href.startsWith('tel:') || href.startsWith('mailto:')
    if (isExt) {
      return (
        <a
          href={href}
          className={classes}
          target={external || /^https?:\/\//i.test(href) ? '_blank' : undefined}
          rel={external || /^https?:\/\//i.test(href) ? 'noopener noreferrer' : undefined}
          aria-disabled={disabled ? 'true' : undefined}
        >
          {content}
        </a>
      )
    }
    return (
      <NextLink href={href} className={classes} aria-disabled={disabled ? 'true' : undefined}>
        {content}
      </NextLink>
    )
  }

  return (
    <button
      type={rest.type ?? 'button'}
      className={classes}
      disabled={disabled}
      aria-busy={loading ? 'true' : undefined}
      aria-pressed={pressed}
      {...rest}
    >
      {content}
    </button>
  )
}
