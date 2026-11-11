'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { Button } from './Button'
import { trackEvent } from '@/lib/analytics'
import type { EquipmentCategoryRecord, ServiceRecord } from '@/seed/data'

export interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  services: ServiceRecord[]
  equipmentCategories: EquipmentCategoryRecord[]
  hasCredentials: boolean
  hasInsights: boolean
  hasCompanyProfile: boolean
  phoneE164: string
  phoneDisplay: string
  email: string
  whatsappUrl: string
}

type SubMenuKey = null | 'services' | 'equipment' | 'about'

export function MobileDrawer({
  open,
  onClose,
  services,
  equipmentCategories,
  hasCredentials,
  hasInsights,
  hasCompanyProfile,
  phoneE164,
  phoneDisplay,
  email,
  whatsappUrl,
}: MobileDrawerProps) {
  const [subMenu, setSubMenu] = useState<SubMenuKey>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const main = document.getElementById('main-content')
    const footer = document.querySelector('footer')

    if (open) {
      html.setAttribute('data-drawer-open', 'true')
      document.body.style.overflow = 'hidden'
      main?.setAttribute('inert', '')
      footer?.setAttribute('inert', '')
    } else {
      html.removeAttribute('data-drawer-open')
      document.body.style.overflow = ''
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
      setSubMenu(null)
    }

    return () => {
      html.removeAttribute('data-drawer-open')
      document.body.style.overflow = ''
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const topLevelServices = services.filter((s) => !s.parentSlug)
  const cabroService = services.find((s) => s.slug === 'cabro-paving')

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      data-menu-level={subMenu ? '1' : '0'}
      className="fixed inset-x-0 top-[5.2rem] bottom-0 z-[50] flex flex-col justify-between overflow-y-auto bg-[var(--white)] border-t border-[var(--grey-300)] lg:hidden"
    >
      <div className="px-[2.4rem] pt-[1.6rem] pb-[2.4rem]">
        {subMenu === null ? (
          <nav aria-label="Primary mobile">
            <ul className="divide-y divide-[var(--grey-300)] border-b border-[var(--grey-300)]">
              <li className="flex items-center justify-between py-[1.4rem]">
                <a
                  href="/services"
                  onClick={onClose}
                  className="text-h4 text-[var(--ink-900)] no-underline"
                >
                  Services
                </a>
                <button
                  type="button"
                  onClick={() => setSubMenu('services')}
                  aria-label="Open Services submenu"
                  className="inline-flex h-[4.4rem] w-[4.4rem] items-center justify-center text-[var(--ink-900)]"
                >
                  <Icon name="chevron-right" size={18} />
                </button>
              </li>
              <li className="py-[1.4rem]">
                <a
                  href="/projects"
                  onClick={onClose}
                  className="block text-h4 text-[var(--ink-900)] no-underline"
                >
                  Projects
                </a>
              </li>
              <li className="flex items-center justify-between py-[1.4rem]">
                <a
                  href="/equipment"
                  onClick={onClose}
                  className="text-h4 text-[var(--ink-900)] no-underline"
                >
                  Equipment
                </a>
                <button
                  type="button"
                  onClick={() => setSubMenu('equipment')}
                  aria-label="Open Equipment submenu"
                  className="inline-flex h-[4.4rem] w-[4.4rem] items-center justify-center text-[var(--ink-900)]"
                >
                  <Icon name="chevron-right" size={18} />
                </button>
              </li>
              <li className="flex items-center justify-between py-[1.4rem]">
                <a
                  href="/about"
                  onClick={onClose}
                  className="text-h4 text-[var(--ink-900)] no-underline"
                >
                  About
                </a>
                <button
                  type="button"
                  onClick={() => setSubMenu('about')}
                  aria-label="Open About submenu"
                  className="inline-flex h-[4.4rem] w-[4.4rem] items-center justify-center text-[var(--ink-900)]"
                >
                  <Icon name="chevron-right" size={18} />
                </button>
              </li>
              {hasInsights && (
                <li className="py-[1.4rem]">
                  <a
                    href="/insights"
                    onClick={onClose}
                    className="block text-h4 text-[var(--ink-900)] no-underline"
                  >
                    Insights
                  </a>
                </li>
              )}
              <li className="py-[1.4rem]">
                <a
                  href="/contact"
                  onClick={onClose}
                  className="block text-h4 text-[var(--ink-900)] no-underline"
                >
                  Contact
                </a>
              </li>
            </ul>

            <div className="mt-[2.4rem]">
              <Button
                href="/contact?type=project"
                variant="primary"
                className="w-full justify-center"
                onClick={onClose}
              >
                Request a quote
              </Button>
            </div>
          </nav>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setSubMenu(null)}
              className="mb-[1.6rem] inline-flex min-h-[4.4rem] items-center gap-[0.8rem] text-label text-[var(--ink-900)]"
            >
              <Icon name="chevron-left" size={18} />
              <span>Back</span>
            </button>

            {subMenu === 'services' && (
              <ul className="divide-y divide-[var(--grey-300)] border-t border-b border-[var(--grey-300)]">
                <li className="py-[1.4rem]">
                  <a
                    href="/services"
                    onClick={onClose}
                    className="block text-h4 text-[var(--ink-900)] no-underline"
                  >
                    All services
                  </a>
                </li>
                {topLevelServices.map((service) => (
                  <React.Fragment key={service.slug}>
                    <li className="py-[1.4rem]">
                      <a
                        href={`/services/${service.slug}`}
                        onClick={onClose}
                        className="block text-h4 text-[var(--ink-900)] no-underline"
                      >
                        {service.title}
                      </a>
                    </li>
                    {service.slug === 'road-construction-and-earthworks' && cabroService && (
                      <li className="py-[1.2rem] pl-[1.6rem]">
                        <a
                          href="/services/road-construction-and-earthworks/cabro-paving"
                          onClick={onClose}
                          className="block text-body text-[var(--ink-600)] no-underline"
                        >
                          Cabro paving
                        </a>
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            )}

            {subMenu === 'equipment' && (
              <ul className="divide-y divide-[var(--grey-300)] border-t border-b border-[var(--grey-300)]">
                {equipmentCategories.map((cat) => (
                  <li key={cat.slug} className="py-[1.4rem]">
                    <a
                      href={`/equipment/${cat.slug}`}
                      onClick={onClose}
                      className="block text-h4 text-[var(--ink-900)] no-underline"
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
                <li className="py-[1.4rem]">
                  <a
                    href="/equipment"
                    onClick={onClose}
                    className="block text-h4 text-[var(--ink-900)] no-underline"
                  >
                    All equipment
                  </a>
                </li>
                <li className="py-[1.4rem]">
                  <a
                    href="/equipment#how-hire-works"
                    onClick={onClose}
                    className="block text-body text-[var(--ink-600)] no-underline"
                  >
                    How hire works
                  </a>
                </li>
              </ul>
            )}

            {subMenu === 'about' && (
              <ul className="divide-y divide-[var(--grey-300)] border-t border-b border-[var(--grey-300)]">
                <li className="py-[1.4rem]">
                  <a
                    href="/about"
                    onClick={onClose}
                    className="block text-h4 text-[var(--ink-900)] no-underline"
                  >
                    Company
                  </a>
                </li>
                <li className="py-[1.4rem]">
                  <a
                    href="/about/leadership"
                    onClick={onClose}
                    className="block text-h4 text-[var(--ink-900)] no-underline"
                  >
                    Leadership
                  </a>
                </li>
                {hasCredentials && (
                  <li className="py-[1.4rem]">
                    <a
                      href="/about/credentials-and-safety"
                      onClick={onClose}
                      className="block text-h4 text-[var(--ink-900)] no-underline"
                    >
                      Credentials and safety
                    </a>
                  </li>
                )}
                {hasCompanyProfile && (
                  <li className="py-[1.4rem]">
                    <a
                      href="/downloads/company-profile"
                      onClick={() => {
                        trackEvent('file_download', { file_name: 'company-profile' })
                        onClose()
                      }}
                      className="inline-flex items-center gap-[0.8rem] text-h4 text-[var(--ink-900)] no-underline"
                    >
                      <span>Download company profile</span>
                      <Icon name="download" size={18} />
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>

      <div
        data-surface="subtle"
        className="min-h-[12.8rem] border-t border-[var(--grey-300)] bg-[var(--grey-100)] px-[2.4rem] py-[2.0rem]"
      >
        <ul className="space-y-[0.8rem] text-body-sm text-[var(--ink-900)]">
          <li>
            <a
              href={`tel:${phoneE164}`}
              onClick={() => trackEvent('call_click', { location: 'header' })}
              className="inline-flex items-center gap-[0.8rem] font-bold text-[var(--ink-900)] no-underline"
            >
              <Icon name="phone" size={18} />
              <span>Call {phoneDisplay}</span>
            </a>
          </li>
          <li>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { location: 'header' })}
              className="inline-flex items-center gap-[0.8rem] text-[var(--ink-900)] no-underline"
            >
              <Icon name="whatsapp" size={18} />
              <span>WhatsApp us</span>
            </a>
          </li>
          <li>
            <a
              href={`mailto:${email}`}
              onClick={() => trackEvent('email_click', { location: 'header' })}
              className="inline-flex items-center gap-[0.8rem] text-[var(--ink-600)] no-underline"
            >
              <Icon name="mail" size={18} />
              <span>{email}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
