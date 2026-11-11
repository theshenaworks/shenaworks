'use client'

import React, { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SectionIntro } from './SectionIntro'
import type { ProjectRecord, ServiceRecord } from '@/seed/data'

export interface ProjectGridProps {
  variant?: 'home' | 'index' | 'related'
  overline?: string
  heading?: string
  body?: string
  actionLabel?: string
  actionHref?: string
  projects: ProjectRecord[]
  services?: ServiceRecord[]
}

const HOME_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'roads', label: 'Roads and paving' },
  { id: 'buildings', label: 'Buildings' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'interiors', label: 'Interiors' },
] as const

type HomeChipId = (typeof HOME_CHIPS)[number]['id']

function matchesHomeChip(project: ProjectRecord, chipId: HomeChipId): boolean {
  switch (chipId) {
    case 'all':
      return true
    case 'roads':
      return (
        project.serviceSlugs.includes('road-construction-and-earthworks') ||
        project.serviceSlugs.includes('cabro-paving')
      )
    case 'buildings':
      return project.serviceSlugs.includes('general-construction')
    case 'hospitality':
      return project.clientType.toLowerCase().includes('hospitality')
    case 'interiors':
      return project.serviceSlugs.includes('interior-design')
  }
}

export function ProjectGrid({
  variant = 'home',
  overline = 'Projects',
  heading = 'Recent work',
  body,
  actionLabel,
  actionHref,
  projects,
  services = [],
}: ProjectGridProps) {
  const [activeChip, setActiveChip] = useState<HomeChipId>('all')

  const serviceTitleMap = useMemo(() => {
    const map = new Map<string, string>()
    services.forEach((s) => map.set(s.slug, s.shortTitle))
    return map
  }, [services])

  const availableChips = useMemo(() => {
    return HOME_CHIPS.filter((chip) => projects.some((p) => matchesHomeChip(p, chip.id)))
  }, [projects])

  const visibleProjects = useMemo(() => {
    if (variant !== 'home') return projects
    return projects.filter((p) => matchesHomeChip(p, activeChip)).slice(0, 6)
  }, [projects, variant, activeChip])

  if (projects.length === 0) return null

  return (
    <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
      {variant !== 'index' && (
        <SectionIntro
          overline={overline}
          heading={heading}
          body={body}
          actionLabel={actionLabel}
          actionHref={actionHref}
        />
      )}

      {variant === 'home' && projects.length > 2 && availableChips.length > 1 && (
        <div className="site-grid mb-[3.2rem]">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14">
            <div
              role="group"
              aria-label="Filter projects by category"
              className="flex items-center gap-[0.8rem] overflow-x-auto pb-[0.8rem]"
            >
              {availableChips.map((chip) => {
                const pressed = activeChip === chip.id
                return (
                  <button
                    key={chip.id}
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => setActiveChip(chip.id)}
                    className={`button button--subtle shrink-0 ${
                      pressed
                        ? 'bg-[var(--ink-900)] text-[var(--white)] border-[var(--ink-900)]'
                        : ''
                    }`}
                  >
                    <span>{chip.label}</span>
                  </button>
                )
              })}
            </div>
            <p aria-live="polite" className="sr-only">
              {visibleProjects.length} projects shown
            </p>
          </div>
        </div>
      )}

      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[3.2rem] gap-y-[5.6rem]">
          {visibleProjects.map((project) => {
            const overlineText = project.serviceSlugs
              .map((slug) => serviceTitleMap.get(slug) || slug.replace(/-/g, ' '))
              .slice(0, 2)
              .join(', ')

            return (
              <Card
                key={project.slug}
                href={`/projects/${project.slug}`}
                imageSrc={project.heroImage.url}
                imageAlt={project.heroImage.alt}
                aspectRatio="4:3"
                overline={overlineText}
                title={project.title}
                meta={`${project.location.town}, ${project.location.county} · ${project.year}`}
              />
            )
          })}
        </div>
      </div>

      {variant === 'home' && (
        <div className="mt-[4.8rem] flex justify-center">
          <Button href="/projects" variant="secondary">
            All projects
          </Button>
        </div>
      )}
    </section>
  )
}
