import React from 'react'
import NextLink from 'next/link'
import { Icon } from './Icon'

export interface AppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: 'prose' | 'nav' | 'utility' | 'footer' | 'label-arrow'
  external?: boolean
  current?: boolean
  children: React.ReactNode
}

export function AppLink({
  href,
  variant = 'nav',
  external = false,
  current = false,
  className = '',
  children,
  ...rest
}: AppLinkProps) {
  const isExternalUrl = external || /^https?:\/\//i.test(href)

  const variantClasses: Record<NonNullable<AppLinkProps['variant']>, string> = {
    prose:
      'font-bold no-underline bg-[linear-gradient(var(--underline),var(--underline))] bg-[position:0_100%] bg-[size:100%_2px] bg-no-repeat transition-[background-size] duration-200 hover:bg-[position:100%_100%] hover:bg-[size:0_2px] focus-visible:bg-[position:100%_100%] focus-visible:bg-[size:0_2px]',
    nav: 't-label u-draw pb-1 inline-flex items-center gap-2 no-underline',
    utility: 't-body-xs u-draw pb-1 inline-flex items-center gap-1.5 no-underline',
    footer: 't-body-sm u-draw pb-1 inline-flex items-center gap-1.5 text-white no-underline',
    'label-arrow': 't-label u-draw pb-1 inline-flex items-center gap-2 no-underline',
  }

  const classes = `${variantClasses[variant]} ${className}`.trim()

  if (isExternalUrl || href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        className={classes}
        aria-current={current ? 'page' : undefined}
        target={isExternalUrl ? '_blank' : undefined}
        rel={isExternalUrl ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        <span>{children}</span>
        {variant === 'label-arrow' && !isExternalUrl && <Icon name="arrow-right" size={18} />}
        {isExternalUrl && (
          <>
            <Icon name="external-link" size={16} />
            <span className="sr-only"> (opens in a new tab)</span>
          </>
        )}
      </a>
    )
  }

  return (
    <NextLink
      href={href}
      className={classes}
      aria-current={current ? 'page' : undefined}
      {...rest}
    >
      <span>{children}</span>
      {variant === 'label-arrow' && <Icon name="arrow-right" size={18} />}
    </NextLink>
  )
}
