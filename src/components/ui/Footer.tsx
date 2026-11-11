'use client'

import React, { useState } from 'react'
import { Icon } from './Icon'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'
import type { EquipmentCategoryRecord, LocationRecord, ServiceRecord } from '@/seed/data'

export interface FooterProps {
  services: ServiceRecord[]
  equipmentCategories: EquipmentCategoryRecord[]
  locations: LocationRecord[]
  hasCredentials: boolean
  hasInsights: boolean
  hasCompanyProfile: boolean
  motto: string
  phoneE164: string
  phoneDisplay: string
  whatsappNumber: string
  email: string
  officeHours?: string
  linkedinUrl?: string | null
  facebookUrl?: string | null
  regNumber?: string | null
}

type MobileSectionKey = 'services' | 'company' | 'equipment' | 'contact'

export function Footer({
  services,
  equipmentCategories,
  locations,
  hasCredentials,
  hasInsights,
  hasCompanyProfile,
  motto,
  phoneE164,
  phoneDisplay,
  whatsappNumber,
  email,
  officeHours,
  linkedinUrl,
  facebookUrl,
  regNumber,
}: FooterProps) {
  const [openSections, setOpenSections] = useState<Record<MobileSectionKey, boolean>>({
    services: false,
    company: false,
    equipment: false,
    contact: true, // Contact expanded by default per SITE-PLAN.md 4.5
  })

  const toggleSection = (key: MobileSectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const openCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shena:open-cookie-banner'))
    }
  }

  const whatsappUrl = buildWhatsAppUrl({ type: 'default' }, whatsappNumber)

  return (
    <footer
      data-surface="dark"
      className="bg-[var(--ink-900)] text-[var(--white)] pt-[6.4rem] pb-[4.8rem] lg:pt-[8.0rem] lg:pb-[5.6rem]"
    >
      <div className="site-grid">
        {/* Brand column (col 2-4 at lg) */}
        <div className="col-span-4 lg:col-start-2 lg:col-span-4 mb-[4.0rem] lg:mb-0">
          <a href="/" aria-label="Shena Works home" className="inline-block h-[4.8rem] mb-[1.6rem]">
            <img
              src="/brand/logo-white.svg"
              alt="Shena Works Limited"
              width={167}
              height={48}
              className="h-full w-auto object-contain"
            />
          </a>
          <p className="text-body-sm text-[var(--grey-500)] max-w-[28ch]">{motto}</p>

          {(linkedinUrl || facebookUrl) && (
            <div className="mt-[2.4rem] flex items-center gap-[1.6rem]">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Shena Works on LinkedIn"
                  className="text-[var(--white)] hover:text-[var(--accent-on-dark)]"
                >
                  <Icon name="linkedin" size={24} />
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Shena Works on Facebook"
                  className="text-[var(--white)] hover:text-[var(--accent-on-dark)]"
                >
                  <Icon name="facebook" size={24} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Services column (col 6-2 at lg) */}
        <div className="col-span-4 lg:col-start-6 lg:col-span-2 border-t border-[var(--ink-600)] lg:border-t-0">
          <button
            type="button"
            onClick={() => toggleSection('services')}
            aria-expanded={openSections.services}
            className="flex w-full items-center justify-between py-[1.6rem] text-overline text-[var(--grey-500)] lg:hidden"
          >
            <span>Services</span>
            <Icon name={openSections.services ? 'minus' : 'plus'} size={18} />
          </button>
          <p className="hidden lg:block text-overline text-[var(--grey-500)] mb-[1.6rem]">
            Services
          </p>
          <ul
            className={`space-y-[1.0rem] pb-[2.0rem] lg:pb-0 ${
              openSections.services ? 'block' : 'hidden lg:block'
            }`}
          >
            {services.map((s) => (
              <li key={s.slug}>
                <a
                  href={
                    s.parentSlug ? `/services/${s.parentSlug}/${s.slug}` : `/services/${s.slug}`
                  }
                  className="text-body-sm text-[var(--white)] no-underline u-draw"
                >
                  {s.shortTitle}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company column (col 8-2 at lg) */}
        <div className="col-span-4 lg:col-start-8 lg:col-span-2 border-t border-[var(--ink-600)] lg:border-t-0">
          <button
            type="button"
            onClick={() => toggleSection('company')}
            aria-expanded={openSections.company}
            className="flex w-full items-center justify-between py-[1.6rem] text-overline text-[var(--grey-500)] lg:hidden"
          >
            <span>Company</span>
            <Icon name={openSections.company ? 'minus' : 'plus'} size={18} />
          </button>
          <p className="hidden lg:block text-overline text-[var(--grey-500)] mb-[1.6rem]">
            Company
          </p>
          <ul
            className={`space-y-[1.0rem] pb-[2.0rem] lg:pb-0 ${
              openSections.company ? 'block' : 'hidden lg:block'
            }`}
          >
            <li>
              <a href="/about" className="text-body-sm text-[var(--white)] no-underline u-draw">
                About Shena Works
              </a>
            </li>
            <li>
              <a
                href="/about/leadership"
                className="text-body-sm text-[var(--white)] no-underline u-draw"
              >
                Leadership
              </a>
            </li>
            {hasCredentials && (
              <li>
                <a
                  href="/about/credentials-and-safety"
                  className="text-body-sm text-[var(--white)] no-underline u-draw"
                >
                  Credentials & safety
                </a>
              </li>
            )}
            <li>
              <a href="/projects" className="text-body-sm text-[var(--white)] no-underline u-draw">
                Projects
              </a>
            </li>
            {hasInsights && (
              <li>
                <a
                  href="/insights"
                  className="text-body-sm text-[var(--white)] no-underline u-draw"
                >
                  Insights
                </a>
              </li>
            )}
            {hasCompanyProfile && (
              <li>
                <a
                  href="/downloads/company-profile"
                  onClick={() => trackEvent('file_download', { file_name: 'company-profile' })}
                  className="inline-flex items-center gap-[0.6rem] text-body-sm text-[var(--white)] no-underline u-draw"
                >
                  <span>Company profile</span>
                  <Icon name="download" size={16} />
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Equipment column (col 10-2 at lg) */}
        <div className="col-span-4 lg:col-start-10 lg:col-span-2 border-t border-[var(--ink-600)] lg:border-t-0">
          <button
            type="button"
            onClick={() => toggleSection('equipment')}
            aria-expanded={openSections.equipment}
            className="flex w-full items-center justify-between py-[1.6rem] text-overline text-[var(--grey-500)] lg:hidden"
          >
            <span>Equipment</span>
            <Icon name={openSections.equipment ? 'minus' : 'plus'} size={18} />
          </button>
          <p className="hidden lg:block text-overline text-[var(--grey-500)] mb-[1.6rem]">
            Equipment
          </p>
          <ul
            className={`space-y-[1.0rem] pb-[2.0rem] lg:pb-0 ${
              openSections.equipment ? 'block' : 'hidden lg:block'
            }`}
          >
            {equipmentCategories.map((cat) => (
              <li key={cat.slug}>
                <a
                  href={`/equipment/${cat.slug}`}
                  className="text-body-sm text-[var(--white)] no-underline u-draw"
                >
                  {cat.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/equipment#how-hire-works"
                className="text-body-sm text-[var(--white)] no-underline u-draw"
              >
                How hire works
              </a>
            </li>
          </ul>
        </div>

        {/* Contact column (col 12-4 at lg) */}
        <div className="col-span-4 lg:col-start-12 lg:col-span-4 border-t border-[var(--ink-600)] lg:border-t-0">
          <button
            type="button"
            onClick={() => toggleSection('contact')}
            aria-expanded={openSections.contact}
            className="flex w-full items-center justify-between py-[1.6rem] text-overline text-[var(--grey-500)] lg:hidden"
          >
            <span>Contact</span>
            <Icon name={openSections.contact ? 'minus' : 'plus'} size={18} />
          </button>
          <p className="hidden lg:block text-overline text-[var(--grey-500)] mb-[1.6rem]">
            Contact
          </p>
          <ul
            className={`space-y-[1.0rem] pb-[2.0rem] lg:pb-0 text-body-sm ${
              openSections.contact ? 'block' : 'hidden lg:block'
            }`}
          >
            <li>
              <a
                href={`tel:${phoneE164}`}
                onClick={() => trackEvent('call_click', { location: 'footer' })}
                className="font-bold text-[var(--white)] no-underline u-draw"
              >
                {phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { location: 'footer' })}
                className="text-[var(--white)] no-underline u-draw"
              >
                WhatsApp us
              </a>
            </li>
            <li>
              <a
                href={`mailto:${email}`}
                onClick={() => trackEvent('email_click', { location: 'footer' })}
                className="text-[var(--white)] no-underline u-draw"
              >
                {email}
              </a>
            </li>
            {locations.map((loc) => (
              <li key={loc.slug}>
                <a
                  href={`/locations/${loc.slug}`}
                  className="text-[var(--grey-500)] hover:text-[var(--white)] no-underline u-draw"
                >
                  {loc.town} office: {loc.address}
                </a>
              </li>
            ))}
            {officeHours && <li className="text-[var(--grey-500)]">{officeHours}</li>}
          </ul>
        </div>

        {/* Credentials line (only if verified regNumber exists) */}
        {regNumber && (
          <div className="col-span-4 lg:col-start-8 lg:col-span-8 mt-[3.2rem] lg:text-right">
            <p className="text-caption text-[var(--grey-500)]">Company Reg. No. {regNumber}</p>
          </div>
        )}

        {/* Legal bottom bar */}
        <div className="col-span-4 lg:col-start-2 lg:col-span-14 mt-[4.0rem] pt-[2.4rem] border-t border-[var(--ink-600)] flex flex-col md:flex-row md:items-center md:justify-between gap-[1.6rem] text-caption text-[var(--grey-500)]">
          <p>© {new Date().getFullYear()} Shena Works Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-[1.6rem]">
            <a href="/privacy" className="text-[var(--grey-500)] hover:text-[var(--white)] no-underline u-draw">
              Privacy
            </a>
            <a href="/cookies" className="text-[var(--grey-500)] hover:text-[var(--white)] no-underline u-draw">
              Cookies
            </a>
            <button
              type="button"
              onClick={openCookieSettings}
              className="text-caption text-[var(--grey-500)] hover:text-[var(--white)] u-draw cursor-pointer"
            >
              Cookie settings
            </button>
            <a
              href="/sitemap.xml"
              className="text-[var(--grey-500)] hover:text-[var(--white)] no-underline u-draw"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
