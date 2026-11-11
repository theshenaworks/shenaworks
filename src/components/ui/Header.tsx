'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Icon } from './Icon'
import { Button } from './Button'
import { IconButton } from './IconButton'
import { Scrim } from './Scrim'
import { MobileDrawer } from './MobileDrawer'
import { buildWhatsAppUrl, type WhatsAppMessageContext } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'
import type { EquipmentCategoryRecord, LocationRecord, ServiceRecord } from '@/seed/data'

export interface HeaderProps {
  services: ServiceRecord[]
  equipmentCategories: EquipmentCategoryRecord[]
  locations: LocationRecord[]
  hasCredentials: boolean
  hasInsights: boolean
  hasCompanyProfile: boolean
  phoneE164: string
  phoneDisplay: string
  whatsappNumber: string
  email: string
}

type DropdownKey = null | 'services' | 'equipment' | 'about'

function isPhotoHeroPath(pathname: string): boolean {
  if (pathname === '/') return true
  if (pathname === '/about') return true
  if (pathname === '/services' || pathname.startsWith('/services/')) return true
  if (pathname === '/projects') return true
  if (pathname === '/equipment') return true
  if (pathname.startsWith('/locations/')) return true
  // /equipment/[category] is a photo hero, whereas /equipment/[category]/[slug] is white header
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'equipment' && parts.length === 2) return true
  return false
}

function getWhatsAppContextForPathname(pathname: string): WhatsAppMessageContext {
  if (pathname === '/contact') return { type: 'contact' }
  if (pathname === '/locations/meru') return { type: 'location', town: 'Meru' }
  if (pathname === '/locations/nairobi') return { type: 'location', town: 'Nairobi' }
  if (pathname.startsWith('/equipment')) return { type: 'equipment' }
  return { type: 'default' }
}

export function Header({
  services,
  equipmentCategories,
  locations,
  hasCredentials,
  hasInsights,
  hasCompanyProfile,
  phoneE164,
  phoneDisplay,
  whatsappNumber,
  email,
}: HeaderProps) {
  const pathname = usePathname() || '/'
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  const photoHero = isPhotoHeroPath(pathname)
  const isTransparent = photoHero && !isScrolled && openDropdown === null && !drawerOpen

  useEffect(() => {
    setOpenDropdown(null)
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!openDropdown) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openDropdown])

  const clearTimers = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }

  const handleMouseEnter = (key: Exclude<DropdownKey, null>) => {
    clearTimers()
    openTimerRef.current = setTimeout(() => {
      setOpenDropdown(key)
    }, 200)
  }

  const handleMouseLeave = () => {
    clearTimers()
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 180)
  }

  const toggleDropdown = (key: Exclude<DropdownKey, null>) => {
    clearTimers()
    setOpenDropdown((prev) => (prev === key ? null : key))
  }

  const whatsappUrl = buildWhatsAppUrl(getWhatsAppContextForPathname(pathname), whatsappNumber)
  const nairobiLive = locations.some((l) => l.slug === 'nairobi')

  const roadsServices = services.filter((s) => s.group === 'Roads and earthworks')
  const buildingServices = services.filter((s) => s.group === 'Buildings and interiors')
  const planningServices = services.filter((s) => s.group === 'Planning and delivery')

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header
        ref={headerRef}
        data-site-header
        data-header={isTransparent ? 'transparent' : 'solid'}
        className={`fixed inset-x-0 top-0 z-[50] transition-[transform,background-color,color,border-color] duration-300 ${
          isTransparent
            ? 'bg-transparent text-[var(--white)] border-b border-white/20'
            : 'bg-[var(--white)] text-[var(--ink-900)] border-b border-[var(--grey-300)] shadow-[var(--shadow-1)]'
        }`}
      >
        {/* Desktop secondary row (40px, lg and up) */}
        <div
          className={`hidden lg:block h-[4.0rem] border-b ${
            isTransparent ? 'border-white/15' : 'border-[var(--grey-300)]'
          }`}
        >
          <div className="site-grid h-full items-center">
            <div className="col-start-2 col-span-14 flex items-center justify-end gap-[2.4rem] text-body-xs">
              <div className="flex items-center gap-[0.6rem]">
                <a
                  href="/locations/meru"
                  className={`no-underline u-draw ${
                    isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-600)]'
                  }`}
                >
                  {nairobiLive ? 'Meru' : 'Meru, Kenya'}
                </a>
                {nairobiLive && (
                  <>
                    <span aria-hidden="true">·</span>
                    <a
                      href="/locations/nairobi"
                      className={`no-underline u-draw ${
                        isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-600)]'
                      }`}
                    >
                      Nairobi
                    </a>
                  </>
                )}
              </div>

              <a
                href={`tel:${phoneE164}`}
                onClick={() => trackEvent('call_click', { location: 'header' })}
                className={`no-underline u-draw font-bold ${
                  isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'
                }`}
              >
                Call {phoneDisplay}
              </a>

              {hasCompanyProfile && (
                <a
                  href="/downloads/company-profile"
                  onClick={() => trackEvent('file_download', { file_name: 'company-profile' })}
                  className={`inline-flex items-center gap-[0.6rem] no-underline u-draw ${
                    isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'
                  }`}
                >
                  <span>Company profile</span>
                  <Icon name="download" size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Desktop primary row (88px at lg) & Mobile bar (52px below lg) */}
        <div className="h-[5.2rem] lg:h-[8.8rem]">
          <div className="site-grid h-full items-center">
            <div className="col-start-1 col-span-4 lg:col-start-2 lg:col-span-14 flex items-center justify-between h-full">
              {/* Brand logo */}
              <a
                href="/"
                aria-label="Shena Works home"
                className="inline-flex items-center h-[3.2rem] lg:h-[4.0rem] xl:h-[4.8rem] max-w-[16.7rem] shrink-0"
              >
                <img
                  src={isTransparent ? '/brand/logo-white.svg' : '/brand/logo-color.svg'}
                  alt="Shena Works Limited"
                  width={167}
                  height={48}
                  className="h-full w-auto object-contain"
                />
              </a>

              {/* Desktop Primary Nav */}
              <nav aria-label="Primary" className="hidden lg:flex items-center gap-[3.2rem] h-full">
                {/* Services with mega panel */}
                <div
                  className="relative flex items-center h-full"
                  onMouseEnter={() => handleMouseEnter('services')}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href="/services"
                    aria-current={pathname.startsWith('/services') ? 'page' : undefined}
                    className={`text-label no-underline u-draw py-[0.8rem] ${
                      isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'
                    }`}
                  >
                    Services
                  </a>
                  <button
                    type="button"
                    aria-expanded={openDropdown === 'services'}
                    aria-controls="mega-panel-services"
                    aria-label="Toggle Services menu"
                    onClick={() => toggleDropdown('services')}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setOpenDropdown('services')
                      }
                    }}
                    className={`ml-[0.4rem] inline-flex h-[3.2rem] w-[2.8rem] items-center justify-center transition-transform duration-200 ${
                      openDropdown === 'services' ? 'rotate-180' : ''
                    }`}
                  >
                    <Icon name="chevron-down" size={18} />
                  </button>
                </div>

                {/* Projects */}
                <a
                  href="/projects"
                  aria-current={pathname.startsWith('/projects') ? 'page' : undefined}
                  className={`text-label no-underline u-draw py-[0.8rem] ${
                    isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'
                  }`}
                >
                  Projects
                </a>

                {/* Equipment dropdown */}
                <div
                  className="relative flex items-center h-full"
                  onMouseEnter={() => handleMouseEnter('equipment')}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href="/equipment"
                    aria-current={pathname.startsWith('/equipment') ? 'page' : undefined}
                    className={`text-label no-underline u-draw py-[0.8rem] ${
                      isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'
                    }`}
                  >
                    Equipment
                  </a>
                  <button
                    type="button"
                    aria-expanded={openDropdown === 'equipment'}
                    aria-controls="dropdown-equipment"
                    aria-label="Toggle Equipment menu"
                    onClick={() => toggleDropdown('equipment')}
                    className={`ml-[0.4rem] inline-flex h-[3.2rem] w-[2.8rem] items-center justify-center transition-transform duration-200 ${
                      openDropdown === 'equipment' ? 'rotate-180' : ''
                    }`}
                  >
                    <Icon name="chevron-down" size={18} />
                  </button>

                  {openDropdown === 'equipment' && (
                    <div
                      id="dropdown-equipment"
                      className="absolute left-0 top-full w-[28.0rem] bg-[var(--white)] text-[var(--ink-900)] border border-[var(--grey-300)] shadow-[var(--shadow-2)] p-[2.4rem]"
                    >
                      <p className="text-overline text-[var(--ink-600)] mb-[1.2rem]">
                        Equipment hire
                      </p>
                      <ul className="space-y-[1.0rem] border-b border-[var(--grey-300)] pb-[1.6rem] mb-[1.6rem]">
                        {equipmentCategories.map((cat) => (
                          <li key={cat.slug}>
                            <a
                              href={`/equipment/${cat.slug}`}
                              className="text-body-sm font-bold text-[var(--ink-900)] no-underline u-draw"
                            >
                              {cat.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-col gap-[0.8rem]">
                        <a
                          href="/equipment"
                          className="inline-flex items-center gap-[0.6rem] text-label text-[var(--ink-900)] no-underline u-draw"
                        >
                          <span>All equipment</span>
                          <Icon name="arrow-right" size={16} />
                        </a>
                        <a
                          href="/equipment#how-hire-works"
                          className="text-body-xs text-[var(--ink-600)] no-underline u-draw"
                        >
                          How hire works
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* About dropdown */}
                <div
                  className="relative flex items-center h-full"
                  onMouseEnter={() => handleMouseEnter('about')}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href="/about"
                    aria-current={pathname.startsWith('/about') ? 'page' : undefined}
                    className={`text-label no-underline u-draw py-[0.8rem] ${
                      isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'
                    }`}
                  >
                    About
                  </a>
                  <button
                    type="button"
                    aria-expanded={openDropdown === 'about'}
                    aria-controls="dropdown-about"
                    aria-label="Toggle About menu"
                    onClick={() => toggleDropdown('about')}
                    className={`ml-[0.4rem] inline-flex h-[3.2rem] w-[2.8rem] items-center justify-center transition-transform duration-200 ${
                      openDropdown === 'about' ? 'rotate-180' : ''
                    }`}
                  >
                    <Icon name="chevron-down" size={18} />
                  </button>

                  {openDropdown === 'about' && (
                    <div
                      id="dropdown-about"
                      className="absolute left-0 top-full w-[26.0rem] bg-[var(--white)] text-[var(--ink-900)] border border-[var(--grey-300)] shadow-[var(--shadow-2)] p-[2.4rem]"
                    >
                      <p className="text-overline text-[var(--ink-600)] mb-[1.2rem]">
                        About Shena Works
                      </p>
                      <ul className="space-y-[1.0rem]">
                        <li>
                          <a
                            href="/about"
                            className="text-body-sm font-bold text-[var(--ink-900)] no-underline u-draw"
                          >
                            Company
                          </a>
                        </li>
                        <li>
                          <a
                            href="/about/leadership"
                            className="text-body-sm font-bold text-[var(--ink-900)] no-underline u-draw"
                          >
                            Leadership
                          </a>
                        </li>
                        {hasCredentials && (
                          <li>
                            <a
                              href="/about/credentials-and-safety"
                              className="text-body-sm font-bold text-[var(--ink-900)] no-underline u-draw"
                            >
                              Credentials and safety
                            </a>
                          </li>
                        )}
                        {hasCompanyProfile && (
                          <li className="pt-[0.8rem] border-t border-[var(--grey-300)]">
                            <a
                              href="/downloads/company-profile"
                              onClick={() =>
                                trackEvent('file_download', { file_name: 'company-profile' })
                              }
                              className="inline-flex items-center gap-[0.6rem] text-label text-[var(--ink-900)] no-underline u-draw"
                            >
                              <span>Download company profile</span>
                              <Icon name="download" size={16} />
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Insights (conditional per SITE-PLAN.md 8) */}
                {hasInsights && (
                  <a
                    href="/insights"
                    aria-current={pathname.startsWith('/insights') ? 'page' : undefined}
                    className={`text-label no-underline u-draw py-[0.8rem] ${
                      isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'
                    }`}
                  >
                    Insights
                  </a>
                )}

                {/* Contact */}
                <a
                  href="/contact"
                  aria-current={pathname === '/contact' ? 'page' : undefined}
                  className={`text-label no-underline u-draw py-[0.8rem] ${
                    isTransparent ? 'text-[var(--white)]' : 'text-[var(--ink-900)]'
                  }`}
                >
                  Contact
                </a>
              </nav>

              {/* Desktop Right Actions */}
              <div className="hidden lg:flex items-center gap-[1.2rem]">
                <IconButton
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  label="Chat on WhatsApp"
                  icon="whatsapp"
                  size="dense"
                  variant={isTransparent ? 'outline-dark' : 'subtle'}
                  onClick={() => trackEvent('whatsapp_click', { location: 'header' })}
                />
                <Button
                  href="/contact?type=project"
                  variant={pathname === '/contact' ? 'light' : 'primary'}
                  aria-current={pathname === '/contact' ? 'page' : undefined}
                >
                  Request a quote
                </Button>
              </div>

              {/* Mobile Right Actions (below lg) */}
              <div className="flex lg:hidden items-center gap-[0.8rem]">
                <IconButton
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  label="Chat on WhatsApp"
                  icon="whatsapp"
                  size="dense"
                  variant={isTransparent ? 'outline-dark' : 'subtle'}
                  onClick={() => trackEvent('whatsapp_click', { location: 'header' })}
                />
                <IconButton
                  label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  icon={drawerOpen ? 'close' : 'menu'}
                  size="dense"
                  variant={isTransparent ? 'outline-dark' : 'subtle'}
                  aria-expanded={drawerOpen}
                  onClick={() => setDrawerOpen((prev) => !prev)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Services Mega Panel */}
        {openDropdown === 'services' && (
          <div
            id="mega-panel-services"
            onMouseEnter={() => {
              clearTimers()
              setOpenDropdown('services')
            }}
            onMouseLeave={handleMouseLeave}
            className="hidden lg:block w-full bg-[var(--white)] text-[var(--ink-900)] border-t border-b border-[var(--grey-300)] shadow-[var(--shadow-2)] py-[4.0rem]"
          >
            <div className="site-grid">
              {/* Column 1: Roads and earthworks */}
              <div className="col-start-2 col-span-3">
                <p className="text-overline text-[var(--ink-600)] pb-[1.2rem] mb-[1.6rem] border-b border-[var(--grey-300)]">
                  Roads and earthworks
                </p>
                <ul className="space-y-[1.2rem]">
                  {roadsServices.map((s) => (
                    <li key={s.slug}>
                      <a
                        href={
                          s.parentSlug
                            ? `/services/${s.parentSlug}/${s.slug}`
                            : `/services/${s.slug}`
                        }
                        className="text-body font-bold text-[var(--ink-900)] no-underline u-draw"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Buildings and interiors */}
              <div className="col-start-5 col-span-3">
                <p className="text-overline text-[var(--ink-600)] pb-[1.2rem] mb-[1.6rem] border-b border-[var(--grey-300)]">
                  Buildings and interiors
                </p>
                <ul className="space-y-[1.2rem]">
                  {buildingServices.map((s) => (
                    <li key={s.slug}>
                      <a
                        href={`/services/${s.slug}`}
                        className="text-body font-bold text-[var(--ink-900)] no-underline u-draw"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Planning and delivery */}
              <div className="col-start-8 col-span-4">
                <p className="text-overline text-[var(--ink-600)] pb-[1.2rem] mb-[1.6rem] border-b border-[var(--grey-300)]">
                  Planning and delivery
                </p>
                <ul className="space-y-[1.2rem]">
                  {planningServices.map((s) => (
                    <li key={s.slug}>
                      <a
                        href={`/services/${s.slug}`}
                        className="text-body font-bold text-[var(--ink-900)] no-underline u-draw"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-[3.2rem] pt-[1.6rem] border-t border-[var(--grey-300)]">
                  <a
                    href="/services"
                    className="inline-flex items-center gap-[0.8rem] text-label text-[var(--ink-900)] no-underline u-draw"
                  >
                    <span>All services</span>
                    <Icon name="arrow-right" size={18} />
                  </a>
                </div>
              </div>

              {/* Aside: col 13-3 */}
              <div
                data-surface="subtle"
                className="col-start-13 col-span-3 bg-[var(--grey-100)] p-[2.4rem] flex flex-col justify-between"
              >
                <div>
                  <p className="text-overline text-[var(--ink-600)] mb-[0.8rem]">Hire equipment</p>
                  <h4 className="text-h4 text-[var(--ink-900)] mb-[1.6rem]">
                    Excavators, graders, rollers and bulldozers
                  </h4>
                </div>
                <a
                  href="/equipment"
                  className="inline-flex items-center gap-[0.8rem] text-label text-[var(--ink-900)] no-underline u-draw"
                >
                  <span>See the fleet</span>
                  <Icon name="arrow-right" size={18} />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Mega Panel Scrim */}
      <Scrim visible={openDropdown !== null} onClick={() => setOpenDropdown(null)} />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        services={services}
        equipmentCategories={equipmentCategories}
        hasCredentials={hasCredentials}
        hasInsights={hasInsights}
        hasCompanyProfile={hasCompanyProfile}
        phoneE164={phoneE164}
        phoneDisplay={phoneDisplay}
        email={email}
        whatsappUrl={whatsappUrl}
      />
    </>
  )
}
