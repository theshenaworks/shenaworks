import React from 'react'
import { PageHeader } from '@/components/blocks/PageHeader'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export default function NotFoundPage() {
  const links = [
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'Equipment hire', href: '/equipment' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <div className="bg-[var(--white)] min-h-[70vh]">
      <PageHeader
        overline="Error 404"
        headline="We can't find that page"
        lead="It may have moved when we rebuilt the site. Try one of these instead."
      />
      <section className="py-[4.8rem] lg:py-[6.4rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-10">
            <ul className="space-y-[1.2rem] mb-[3.2rem]">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-flex items-center gap-[0.8rem] text-label text-[var(--ink-900)] no-underline u-draw"
                  >
                    <span>{l.label}</span>
                    <Icon name="arrow-right" size={16} />
                  </a>
                </li>
              ))}
            </ul>
            <Button href="/" variant="primary">
              Go to the home page
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
