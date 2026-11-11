import React from 'react'
import { Icon } from '@/components/ui/Icon'

export interface IntentTile {
  number: string
  title: string
  description: string
  href: string
}

export interface IntentSelectorProps {
  architecturePublished?: boolean
}

export function IntentSelector({ architecturePublished = false }: IntentSelectorProps) {
  const tiles: IntentTile[] = [
    {
      number: '01',
      title: 'Build a project',
      description: 'Roads, paving, homes and commercial buildings.',
      href: '/services',
    },
    {
      number: '02',
      title: 'Hire equipment',
      description: 'Excavators, graders, rollers and bulldozers with operators.',
      href: '/equipment',
    },
    {
      number: '03',
      title: 'Design and interiors',
      description: architecturePublished
        ? 'Drawings, interiors and fit-outs.'
        : 'Interior fit-outs for homes, lounges and hotels.',
      href: architecturePublished
        ? '/services#planning-and-delivery'
        : '/services/interior-design',
    },
    {
      number: '04',
      title: 'Work with us',
      description: 'Suppliers, subcontractors and people looking for work.',
      href: '/contact?type=other',
    },
  ]

  return (
    <section aria-labelledby="intent-selector-heading" className="bg-[var(--white)] py-[4.8rem] lg:py-[6.4rem]">
      <h2 id="intent-selector-heading" className="sr-only">
        What do you need?
      </h2>
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-[1.6rem] md:gap-[3.2rem]">
          {tiles.map((tile) => (
            <article
              key={tile.number}
              className="group relative flex flex-col justify-between pt-[2.0rem] pb-[1.6rem] u-draw-top focus-within:outline-2 focus-within:outline-[var(--ink-900)] focus-within:outline-offset-4"
            >
              <div>
                <p className="text-overline text-[var(--ink-600)] mb-[0.8rem]">{tile.number}</p>
                <h3 className="text-h4 text-[var(--ink-900)] mb-[0.8rem]">
                  <a
                    href={tile.href}
                    className="no-underline text-[var(--ink-900)] after:absolute after:inset-0"
                  >
                    {tile.title}
                  </a>
                </h3>
                <p className="text-body-sm text-[var(--ink-600)] mb-[1.6rem]">{tile.description}</p>
              </div>
              <div className="flex justify-end text-[var(--ink-900)] transition-transform duration-200 group-hover:translate-x-[0.4rem]">
                <Icon name="arrow-right" size={24} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
