import React from 'react'
import { Icon } from '@/components/ui/Icon'

export interface SubNavLink {
  label: string
  href: string
  current?: boolean
  download?: boolean
}

export interface SubNavPanelProps {
  overline?: string
  links: SubNavLink[]
}

export function SubNavPanel({ overline = 'About', links }: SubNavPanelProps) {
  return (
    <>
      {/* Mobile horizontal scroller below lg */}
      <nav
        aria-label={`${overline} section`}
        className="lg:hidden flex items-center gap-[0.8rem] overflow-x-auto pb-[0.8rem] mb-[3.2rem]"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={link.current ? 'page' : undefined}
            className={`button button--subtle shrink-0 no-underline ${
              link.current
                ? 'bg-[var(--ink-900)] text-[var(--white)] border-[var(--ink-900)]'
                : ''
            }`}
          >
            <span>{link.label}</span>
            {link.download && <Icon name="download" size={16} />}
          </a>
        ))}
      </nav>

      {/* Desktop dark right-hand panel at lg */}
      <aside
        data-surface="dark"
        aria-label={`${overline} section`}
        className="hidden lg:block bg-[var(--ink-900)] text-[var(--white)] p-[4.0rem]"
      >
        <p className="text-overline text-[var(--grey-500)] pb-[1.2rem] mb-[2.0rem] border-b border-[var(--ink-600)]">
          {overline}
        </p>
        <ul className="space-y-[1.4rem]">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className={`inline-flex items-center gap-[0.8rem] text-label no-underline u-draw ${
                  link.current ? 'text-[var(--accent-on-dark)]' : 'text-[var(--white)]'
                }`}
              >
                <span>{link.label}</span>
                {link.download && <Icon name="download" size={16} />}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
