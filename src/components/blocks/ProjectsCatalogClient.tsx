'use client'

import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { ProjectGrid } from './ProjectGrid'
import { EmptyState } from './EmptyState'
import { trackEvent } from '@/lib/analytics'
import type { ProjectRecord, ServiceRecord } from '@/seed/data'

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
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(9)

  const distinctLocations = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => set.add(p.location.county))
    return Array.from(set).sort()
  }, [projects])

  const distinctYears = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => set.add(p.year))
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

  const handleFilterChange = (
    key: 'service' | 'location' | 'year',
    value: string,
  ) => {
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

  const shownProjects = filteredProjects.slice(0, visibleCount)

  return (
    <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
      <div className="site-grid mb-[3.2rem]">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14">
          <div className="flex items-center justify-between gap-[1.6rem] mb-[2.4rem]">
            <h2 className="text-h2 text-[var(--ink-900)]">All projects</h2>
            <div className="lg:hidden">
              <Button
                variant="subtle"
                iconRight="filter"
                onClick={() => setMobileDialogOpen(true)}
              >
                {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
              </Button>
            </div>
          </div>

          {/* Desktop & Progressive Enhancement GET Form */}
          <form
            action="/projects"
            method="GET"
            className="hidden lg:flex flex-wrap items-end gap-[2.4rem] pb-[2.4rem] border-b border-[var(--grey-300)]"
          >
            <div className="min-w-[22.0rem]">
              <label
                htmlFor="filter-service"
                className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
              >
                Service
              </label>
              <select
                id="filter-service"
                name="service"
                value={selectedService}
                onChange={(e) => handleFilterChange('service', e.target.value)}
                className="field-input"
              >
                <option value="">All services</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[20.0rem]">
              <label
                htmlFor="filter-location"
                className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
              >
                Location
              </label>
              <select
                id="filter-location"
                name="location"
                value={selectedLocation}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="field-input"
              >
                <option value="">All locations</option>
                {distinctLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[16.0rem]">
              <label
                htmlFor="filter-year"
                className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
              >
                Year
              </label>
              <select
                id="filter-year"
                name="year"
                value={selectedYear}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="field-input"
              >
                <option value="">Any year</option>
                {distinctYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <noscript>
              <Button type="submit" variant="secondary">
                Apply
              </Button>
            </noscript>

            {activeFilterCount > 0 && (
              <div className="pb-[0.8rem]">
                <Button variant="link" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </form>

          <p aria-live="polite" className="text-body-xs text-[var(--ink-600)] mt-[1.6rem]">
            Showing {shownProjects.length} of {filteredProjects.length} projects
          </p>
        </div>
      </div>

      {/* Mobile Filter Sheet Dialog */}
      <Dialog
        id="projects-filter-dialog"
        title="Filter projects"
        open={mobileDialogOpen}
        onClose={() => setMobileDialogOpen(false)}
        actions={
          <>
            <Button variant="primary" onClick={() => setMobileDialogOpen(false)}>
              Apply
            </Button>
            <Button
              variant="link"
              onClick={() => {
                clearFilters()
                setMobileDialogOpen(false)
              }}
            >
              Clear
            </Button>
          </>
        }
      >
        <div className="space-y-[2.0rem]">
          <div>
            <label
              htmlFor="mobile-filter-service"
              className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
            >
              Service
            </label>
            <select
              id="mobile-filter-service"
              value={selectedService}
              onChange={(e) => handleFilterChange('service', e.target.value)}
              className="field-input"
            >
              <option value="">All services</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="mobile-filter-location"
              className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
            >
              Location
            </label>
            <select
              id="mobile-filter-location"
              value={selectedLocation}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="field-input"
            >
              <option value="">All locations</option>
              {distinctLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="mobile-filter-year"
              className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
            >
              Year
            </label>
            <select
              id="mobile-filter-year"
              value={selectedYear}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="field-input"
            >
              <option value="">Any year</option>
              {distinctYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Dialog>

      {shownProjects.length > 0 ? (
        <>
          <ProjectGrid variant="index" projects={shownProjects} services={services} />
          {visibleCount < filteredProjects.length && (
            <div className="mt-[4.8rem] flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setVisibleCount((prev) => prev + 9)}
              >
                Load more projects
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14">
            <EmptyState
              title="No projects match these filters"
              body="Try a different service or location, or clear the filters."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          </div>
        </div>
      )}
    </section>
  )
}
