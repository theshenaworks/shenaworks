'use client'

import React from 'react'
import Link from 'next/link'
import { useNavigation } from './NavigationContext'

export interface MobileDrawerClientProps {
  phoneDisplay: string
  phoneE164: string
  whatsappNumber: string
  email: string
  publishedServices: Array<{ slug: string; parentSlug?: string | null; title: string }>
  hasServices: boolean
  equipmentCategories: Array<{ slug: string; name: string }>
  hasCategories: boolean
  hasCredentials: boolean
  hasCompanyProfile: boolean
  hasInsights: boolean
}

export function MobileDrawerClient({
  phoneDisplay,
  phoneE164,
  whatsappNumber,
  email,
  publishedServices,
  hasServices,
  equipmentCategories,
  hasCategories,
  hasCredentials,
  hasCompanyProfile,
  hasInsights,
}: MobileDrawerClientProps) {
  const { isDrawerOpen, closeDrawer } = useNavigation()

  return (
    <div
      className={`drawer ${isDrawerOpen ? 'open' : ''}`}
      id="dr"
      role="dialog"
      aria-label="Site navigation"
      aria-modal="true"
      aria-hidden={!isDrawerOpen}
    >
      <details>
        <summary>
          Services
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul>
          <li>
            <Link href="/services" onClick={closeDrawer}>
              All services
            </Link>
          </li>
          {hasServices ? (
            publishedServices.map((s) => (
              <li key={s.slug} className={s.parentSlug ? 'in' : undefined}>
                <Link
                  href={
                    s.parentSlug
                      ? `/services/${s.parentSlug}/${s.slug}`
                      : `/services/${s.slug}`
                  }
                  onClick={closeDrawer}
                >
                  {s.title}
                </Link>
              </li>
            ))
          ) : (
            <>
              <li>
                <Link href="/services/road-construction-and-earthworks" onClick={closeDrawer}>
                  Road construction and earthworks
                </Link>
              </li>
              <li className="in">
                <Link href="/services/road-construction-and-earthworks/cabro-paving" onClick={closeDrawer}>
                  Cabro paving
                </Link>
              </li>
              <li>
                <Link href="/services/general-construction" onClick={closeDrawer}>
                  General construction
                </Link>
              </li>
              <li>
                <Link href="/services/interior-design" onClick={closeDrawer}>
                  Interior design
                </Link>
              </li>
              <li>
                <Link href="/services/project-management" onClick={closeDrawer}>
                  Project management
                </Link>
              </li>
            </>
          )}
        </ul>
      </details>

      <details>
        <summary>
          Equipment
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul>
          <li>
            <Link href="/equipment" onClick={closeDrawer}>
              All equipment
            </Link>
          </li>
          {hasCategories ? (
            equipmentCategories.map((c) => (
              <li key={c.slug}>
                <Link href={`/equipment/${c.slug}`} onClick={closeDrawer}>
                  {c.name}
                </Link>
              </li>
            ))
          ) : (
            <>
              <li>
                <Link href="/equipment/excavators" onClick={closeDrawer}>
                  Excavators
                </Link>
              </li>
              <li>
                <Link href="/equipment/graders" onClick={closeDrawer}>
                  Motor graders
                </Link>
              </li>
              <li>
                <Link href="/equipment/rollers" onClick={closeDrawer}>
                  Rollers and compactors
                </Link>
              </li>
              <li>
                <Link href="/equipment/bulldozers" onClick={closeDrawer}>
                  Bulldozers
                </Link>
              </li>
            </>
          )}
          <li>
            <Link href="/equipment#how-hire-works" onClick={closeDrawer}>
              How hire works
            </Link>
          </li>
        </ul>
      </details>

      <details>
        <summary>
          About
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul>
          <li>
            <Link href="/about" onClick={closeDrawer}>
              Company
            </Link>
          </li>
          <li>
            <Link href="/about/leadership" onClick={closeDrawer}>
              Leadership
            </Link>
          </li>
          {hasCredentials && (
            <li>
              <Link href="/about/credentials-and-safety" onClick={closeDrawer}>
                Credentials and safety
              </Link>
            </li>
          )}
          {hasCompanyProfile && (
            <li>
              <Link href="/downloads/company-profile" onClick={closeDrawer}>
                Company profile
              </Link>
            </li>
          )}
        </ul>
      </details>

      <ul>
        <li>
          <Link href="/projects" onClick={closeDrawer}>
            Projects
          </Link>
        </li>
        {hasInsights && (
          <li>
            <Link href="/insights" onClick={closeDrawer}>
              Insights
            </Link>
          </li>
        )}
        <li>
          <Link href="/contact" onClick={closeDrawer}>
            Contact
          </Link>
        </li>
      </ul>

      <div className="meta">
        <div>
          <span>Direct line</span>
          <a href={`tel:${phoneE164}`}>Call {phoneDisplay}</a>
        </div>
        <div>
          <span>WhatsApp</span>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        </div>
        <div>
          <span>Office email</span>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>
    </div>
  )
}
