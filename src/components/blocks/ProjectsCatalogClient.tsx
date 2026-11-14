'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import type { ProjectRecord, ServiceRecord } from '@/types/content'

export interface ProjectsCatalogClientProps {
  projects: ProjectRecord[]
  services: ServiceRecord[]
  initialService?: string
  initialLocation?: string
  initialYear?: string
}

export function ProjectsCatalogClient({
  projects,
  services,
  initialService = '',
  initialLocation = '',
  initialYear = '',
}: ProjectsCatalogClientProps) {
  const [selectedService, setSelectedService] = useState(initialService)
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [selectedYear, setSelectedYear] = useState(initialYear)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const serviceNameBySlug = useMemo(() => {
    const map = new Map<string, string>()
    services.forEach((s) => {
      map.set(s.slug, s.shortTitle || s.title)
    })
    return map
  }, [services])

  const distinctLocations = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.location?.county) set.add(p.location.county)
    })
    return Array.from(set).sort()
  }, [projects])

  const distinctYears = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.year) set.add(p.year)
    })
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedService && !p.serviceSlugs.includes(selectedService)) return false
      if (
        selectedLocation &&
        p.location.county.toLowerCase() !== selectedLocation.toLowerCase() &&
        p.location.town.toLowerCase() !== selectedLocation.toLowerCase()
      ) {
        return false
      }
      if (selectedYear && p.year !== selectedYear) return false
      return true
    })
  }, [projects, selectedService, selectedLocation, selectedYear])

  const syncUrl = (nextService: string, nextLocation: string, nextYear: string) => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams()
    if (nextService) params.set('service', nextService)
    if (nextLocation) params.set('location', nextLocation)
    if (nextYear) params.set('year', nextYear)
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `/projects?${qs}` : '/projects')
  }

  const handleFilterChange = (key: 'service' | 'location' | 'year', value: string) => {
    const nextService = key === 'service' ? value : selectedService
    const nextLocation = key === 'location' ? value : selectedLocation
    const nextYear = key === 'year' ? value : selectedYear

    if (key === 'service') setSelectedService(value)
    if (key === 'location') setSelectedLocation(value)
    if (key === 'year') setSelectedYear(value)

    trackEvent('filter_use', { filter: key, value: value || 'all' })
    syncUrl(nextService, nextLocation, nextYear)
  }

  const clearFilters = () => {
    setSelectedService('')
    setSelectedLocation('')
    setSelectedYear('')
    syncUrl('', '', '')
  }

  const activeFilterCount =
    (selectedService ? 1 : 0) + (selectedLocation ? 1 : 0) + (selectedYear ? 1 : 0)

  const countLabel =
    filteredProjects.length === projects.length
      ? `Showing all ${projects.length} projects`
      : `Showing ${filteredProjects.length} of ${projects.length} projects`

  return (
    <section style={{ paddingBottom: '64px' }} aria-labelledby="ap-h">
      <div className="wrap">
        <h2 className="h2" id="ap-h">
          All projects
        </h2>
        <form className="fbar" id="fb" method="get" action="/projects">
          <div className="fld">
            <label htmlFor="fs">Service</label>
            <select
              id="fs"
              name="service"
              value={selectedService}
              onChange={(e) => handleFilterChange('service', e.target.value)}
            >
              <option value="">All services</option>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.shortTitle || service.title}
                </option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label htmlFor="fc">Location</label>
            <select
              id="fc"
              name="location"
              value={selectedLocation}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">All locations</option>
              {distinctLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label htmlFor="fy">Year</label>
            <select
              id="fy"
              name="year"
              value={selectedYear}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">Any year</option>
              {distinctYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className="btn sec apply" type="submit" hidden={mounted}>
              Apply
            </button>
            <button
              className="clear"
              type="button"
              id="clr"
              hidden={activeFilterCount === 0}
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </form>

        <p className="xs count" id="cnt" role="status" aria-live="polite">
          {filteredProjects.length > 0 ? countLabel : '0 matching projects'}
        </p>

        <div className="grid c3" id="pg" hidden={filteredProjects.length === 0}>
          {filteredProjects.map((project) => {
            const overline = project.serviceSlugs
              .map((s) => serviceNameBySlug.get(s) || s.replace(/-/g, ' '))
              .join(', ')
            const locationText = project.location?.town || project.location?.county || 'Meru County'
            const metaText = project.year ? `${locationText} · ${project.year}` : locationText
            const isThirdParty =
              project.deliveringCompany && project.deliveringCompany !== 'Shena Works Limited'

            return (
              <article
                className="card pcard"
                key={project.slug}
                data-s={project.serviceSlugs.join(' ')}
                data-c={project.location?.county || ''}
                data-y={project.year || ''}
              >
                <div className="ph r43">
                  <Image
                    src={project.heroImage?.url || '/media/project-black-perch.jpg'}
                    alt={project.heroImage?.alt || project.title}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <p className="over">{overline || 'Project'}</p>
                <h3 className="h4">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h3>
                <p className="meta">{metaText}</p>
                {isThirdParty && (
                  <p className="by">
                    Delivered by {project.deliveringCompany}, where Newton Muthee was{' '}
                    {project.role || 'Site Project Manager'}.
                  </p>
                )}
              </article>
            )
          })}
        </div>

        <div className="empty" id="em" hidden={filteredProjects.length > 0}>
          <h3 className="h3">No projects match these filters</h3>
          <p>Try a different service or location, or clear the filters.</p>
          <button className="btn sec" type="button" id="clr2" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </div>
    </section>
  )
}
