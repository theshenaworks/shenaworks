'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { SHENA_LOGO_VIEWBOX } from '@/lib/brand'
import { useNavigation } from './NavigationContext'

export interface HeaderClientProps {
  phoneDisplay: string
  phoneE164: string
  whatsappNumber?: string
  roadsServices: Array<{ slug: string; parentSlug?: string | null; title: string }>
  buildServices: Array<{ slug: string; parentSlug?: string | null; title: string }>
  planServices: Array<{ slug: string; parentSlug?: string | null; title: string }>
  hasServices: boolean
  equipmentCategories: Array<{ slug: string; name: string }>
  hasCategories: boolean
  hasCredentials: boolean
  hasCompanyProfile: boolean
  hasInsights: boolean
}

export function HeaderClient({
  phoneDisplay,
  phoneE164,
  whatsappNumber = '254718971896',
  roadsServices,
  buildServices,
  planServices,
  hasServices,
  equipmentCategories,
  hasCategories,
  hasCredentials,
  hasCompanyProfile,
  hasInsights,
}: HeaderClientProps) {
  const {
    isDrawerOpen,
    toggleDrawer,
    openPanel,
    setOpenPanel,
    closePanels,
    isScrolled,
    isHidden,
  } = useNavigation()

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHoverTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleMouseEnter = (panel: string) => {
    clearHoverTimeout()
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setOpenPanel(panel)
    }
  }

  const handleMouseLeave = () => {
    clearHoverTimeout()
    timeoutRef.current = setTimeout(() => {
      closePanels()
    }, 200)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) {
      closePanels()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, panel: string, panelId: string) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpenPanel(panel)
      const firstLink = document.querySelector<HTMLAnchorElement>(`#${panelId} a`)
      firstLink?.focus()
    } else if (e.key === 'Escape') {
      closePanels()
    }
  }

  const headerClasses = [
    isScrolled ? 'solid' : '',
    isHidden ? 'hide' : '',
    openPanel ? 'open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header
      id="hd"
      className={headerClasses || undefined}
      data-header={isScrolled ? 'solid' : 'transparent'}
    >
      <div className="wrap">
        <nav className="top" aria-label="Secondary">
          <Link href="/locations/meru">Meru, Kenya</Link>
          <a href={`tel:${phoneE164}`}>Call {phoneDisplay}</a>
          {hasCompanyProfile && (
            <a href="/downloads/company-profile">
              Company profile
            </a>
          )}
        </nav>
        <div className="bar">
          <Link className="logo" href="/" aria-label="Shena Works home">
            <svg viewBox={SHENA_LOGO_VIEWBOX} aria-hidden="true" focusable="false">
              <use href="#shena-logo" />
            </svg>
          </Link>
          <nav className="nav" aria-label="Primary">
            {/* Services Mega Panel */}
            <div
              className={`has ${openPanel === 'services' ? 'open' : ''}`}
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
              onBlur={handleBlur}
            >
              <Link
                className="l"
                href="/services"
                aria-haspopup="true"
                aria-expanded={openPanel === 'services'}
                aria-controls="p-sv"
                onKeyDown={(e) => handleKeyDown(e, 'services', 'p-sv')}
              >
                Services
              </Link>
              <div className="pan" id="p-sv" onKeyDown={(e) => e.key === 'Escape' && closePanels()}>
                <div className="pa">
                  <div className="pt">Services</div>
                  <p>One contractor for the road in, the ground it sits on and the building at the end of it.</p>
                  <Link className="btn sec" href="/services" onClick={closePanels}>
                    All services
                  </Link>
                </div>
                <div className="pl">
                  <div>
                    <span className="over">Roads and earthworks</span>
                    <ul>
                      {hasServices && roadsServices.length > 0 ? (
                        roadsServices.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={
                                s.parentSlug
                                  ? `/services/${s.parentSlug}/${s.slug}`
                                  : `/services/${s.slug}`
                              }
                              onClick={closePanels}
                            >
                              {s.title}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <>
                          <li>
                            <Link href="/services/road-construction-and-earthworks" onClick={closePanels}>
                              Road construction and earthworks
                            </Link>
                          </li>
                          <li>
                            <Link href="/services/road-construction-and-earthworks/cabro-paving" onClick={closePanels}>
                              Cabro paving
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <span className="over">Buildings and interiors</span>
                    <ul>
                      {hasServices && buildServices.length > 0 ? (
                        buildServices.map((s) => (
                          <li key={s.slug}>
                            <Link href={`/services/${s.slug}`} onClick={closePanels}>
                              {s.title}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <>
                          <li>
                            <Link href="/services/general-construction" onClick={closePanels}>
                              General construction
                            </Link>
                          </li>
                          <li>
                            <Link href="/services/interior-design" onClick={closePanels}>
                              Interior design
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <span className="over">Planning and delivery</span>
                    <ul>
                      {hasServices && planServices.length > 0 ? (
                        planServices.map((s) => (
                          <li key={s.slug}>
                            <Link href={`/services/${s.slug}`} onClick={closePanels}>
                              {s.title}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <Link href="/services/project-management" onClick={closePanels}>
                            Project management
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Link className="l" href="/projects" onMouseEnter={closePanels}>
              Projects
            </Link>

            {/* Equipment Mega Panel */}
            <div
              className={`has ${openPanel === 'equipment' ? 'open' : ''}`}
              onMouseEnter={() => handleMouseEnter('equipment')}
              onMouseLeave={handleMouseLeave}
              onBlur={handleBlur}
            >
              <Link
                className="l"
                href="/equipment"
                aria-haspopup="true"
                aria-expanded={openPanel === 'equipment'}
                aria-controls="p-eq"
                onKeyDown={(e) => handleKeyDown(e, 'equipment', 'p-eq')}
              >
                Equipment
              </Link>
              <div className="pan" id="p-eq" onKeyDown={(e) => e.key === 'Escape' && closePanels()}>
                <div className="pa">
                  <div className="pt">Equipment</div>
                  <p>
                    Hire an excavator, grader, roller or bulldozer for your site. We quote for the machine,
                    operator and transport, and confirm dates before we move.
                  </p>
                  <Link className="btn sec" href="/equipment" onClick={closePanels}>
                    See the fleet
                  </Link>
                </div>
                <div className="pl">
                  <ul className="pg">
                    {hasCategories ? (
                      equipmentCategories.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/equipment/${c.slug}`} onClick={closePanels}>
                            {c.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <>
                        <li>
                          <Link href="/equipment/excavators" onClick={closePanels}>
                            Excavators
                          </Link>
                        </li>
                        <li>
                          <Link href="/equipment/graders" onClick={closePanels}>
                            Motor graders
                          </Link>
                        </li>
                        <li>
                          <Link href="/equipment/rollers" onClick={closePanels}>
                            Rollers and compactors
                          </Link>
                        </li>
                        <li>
                          <Link href="/equipment/bulldozers" onClick={closePanels}>
                            Bulldozers
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <Link href="/equipment" onClick={closePanels}>
                        All equipment
                      </Link>
                    </li>
                    <li>
                      <Link href="/equipment#how-hire-works" onClick={closePanels}>
                        How hire works
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* About Mega Panel */}
            <div
              className={`has ${openPanel === 'about' ? 'open' : ''}`}
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
              onBlur={handleBlur}
            >
              <Link
                className="l"
                href="/about"
                aria-haspopup="true"
                aria-expanded={openPanel === 'about'}
                aria-controls="p-ab"
                onKeyDown={(e) => handleKeyDown(e, 'about', 'p-ab')}
              >
                About
              </Link>
              <div className="pan" id="p-ab" onKeyDown={(e) => e.key === 'Escape' && closePanels()}>
                <div className="pa">
                  <div className="pt">About</div>
                  <p>
                    Shena Works is a Meru-based roads and building contractor that owns its earthmoving
                    plant and works across Meru, Nairobi and the rest of Kenya.
                  </p>
                  <Link className="btn sec" href="/about" onClick={closePanels}>
                    About Shena Works
                  </Link>
                </div>
                <div className="pl">
                  <ul className="pg">
                    <li>
                      <Link href="/about" onClick={closePanels}>
                        Company
                      </Link>
                    </li>
                    <li>
                      <Link href="/about/leadership" onClick={closePanels}>
                        Leadership
                      </Link>
                    </li>
                    {hasCredentials && (
                      <li>
                        <Link href="/about/credentials-and-safety" onClick={closePanels}>
                          Credentials and safety
                        </Link>
                      </li>
                    )}
                    {hasCompanyProfile && (
                      <li>
                        <Link href="/downloads/company-profile" onClick={closePanels}>
                          Company profile
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {hasInsights && (
              <Link className="l" href="/insights" onMouseEnter={closePanels}>
                Insights
              </Link>
            )}

            <Link className="l" href="/contact" onMouseEnter={closePanels}>
              Contact
            </Link>
            <Link className="btn pri" href="/contact?type=project" onMouseEnter={closePanels}>
              Request a quote
            </Link>
          </nav>

          {/* Mobile Actions: WhatsApp + Menu Button */}
          <div className="flex items-center gap-[0.8rem] lg:hidden">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Hello Shena Works, I found you on your website and would like to talk about a project.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Shena Works"
              className="p-[0.8rem] text-[#25d366] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--accent-500)]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[2.4rem] h-[2.4rem]" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1.1c.2-.2.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
              </svg>
            </a>
            <button
              className="menu-btn"
              id="mb"
              aria-expanded={isDrawerOpen}
              aria-controls="dr"
              aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
              onClick={toggleDrawer}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path
                  id="mi"
                  d={isDrawerOpen ? 'M5 5l14 14M19 5 5 19' : 'M3 7h18M3 12h18M3 17h18'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
