import React from 'react'
import { Card } from '@/components/ui/Card'
import { SectionIntro } from './SectionIntro'
import type { EquipmentCategoryRecord, MachineRecord } from '@/seed/data'

export interface EquipmentTeaserProps {
  overline?: string
  heading?: string
  body?: string
  machines: MachineRecord[]
  categories?: EquipmentCategoryRecord[]
  compact?: boolean
}

export function EquipmentTeaser({
  overline = 'Equipment hire',
  heading = 'Our machines, with our operators',
  body,
  machines,
  categories = [],
  compact = false,
}: EquipmentTeaserProps) {
  if (machines.length === 0) return null

  const categoryNameMap = new Map<string, string>()
  categories.forEach((c) => categoryNameMap.set(c.slug, c.singular))

  return (
    <section
      data-surface="dark"
      className="bg-[var(--ink-900)] text-[var(--white)] py-[8.0rem] lg:py-[12.0rem]"
    >
      <SectionIntro
        overline={overline}
        heading={heading}
        body={compact ? undefined : body}
        actionLabel="See the fleet"
        actionHref="/equipment"
        actionVariant="outline-dark"
        dark
      />

      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3.2rem]">
          {machines.slice(0, 3).map((machine) => {
            const catLabel =
              categoryNameMap.get(machine.categorySlug) || machine.categorySlug
            return (
              <Card
                key={machine.slug}
                href={`/equipment/${machine.categorySlug}/${machine.slug}`}
                imageSrc={machine.heroImage.url}
                imageAlt={machine.heroImage.alt}
                aspectRatio="4:3"
                overline={catLabel}
                title={machine.name}
                meta={`${machine.make} ${machine.model} · ${machine.capacity}`}
                dark
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
