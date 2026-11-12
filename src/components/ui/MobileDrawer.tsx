import React from 'react'
import Link from 'next/link'
import {
  getSiteSettings,
  getPublishedServices,
  getPublishedEquipmentCategories,
  getPublishedCredentials,
} from '@/lib/payload'

/**
 * MobileDrawer (AGENTS.md Section 0 & Section 5 Phase A & D)
 * Server Component emitting reference DOM with dynamic Payload data and reference fallbacks.
 * Toggle state, lockScroll and drawer behaviour are handled by SiteBehaviors via DOM classes.
 */
export async function MobileDrawer() {
  const [settings, services, equipmentCategories, credentials] = await Promise.all([
    getSiteSettings().catch(() => null),
    getPublishedServices().catch(() => []),
    getPublishedEquipmentCategories().catch(() => []),
    getPublishedCredentials().catch(() => []),
  ])

  const phoneDisplay = settings?.contact?.phoneDisplay || '+254 718 971 896'
  const phoneE164 = settings?.contact?.phoneE164 || '+254718971896'
  const whatsappNumber = settings?.contact?.whatsappNumber || '254718971896'
  const email = settings?.contact?.email || 'shenaworksltd@gmail.com'
  const hasCredentials = credentials.length > 0
  const hasCompanyProfile = Boolean(settings?.files?.companyProfile?.url)

  const publishedServices = services.filter((s) => s._status === 'published')
  const hasServices = publishedServices.length > 0
  const hasCategories = equipmentCategories.length > 0

  return (
    <div className="drawer" id="dr">
      <details>
        <summary>
          Services
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul>
          <li>
            <Link href="/services">All services</Link>
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
                >
                  {s.title}
                </Link>
              </li>
            ))
          ) : (
            <>
              <li>
                <Link href="/services/road-construction-and-earthworks">
                  Road construction and earthworks
                </Link>
              </li>
              <li className="in">
                <Link href="/services/road-construction-and-earthworks/cabro-paving">Cabro paving</Link>
              </li>
              <li>
                <Link href="/services/general-construction">General construction</Link>
              </li>
              <li>
                <Link href="/services/interior-design">Interior design</Link>
              </li>
              <li>
                <Link href="/services/project-management">Project management</Link>
              </li>
            </>
          )}
        </ul>
      </details>
      <Link className="row" href="/projects">
        Projects
      </Link>
      <details>
        <summary>
          Equipment
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul>
          {hasCategories ? (
            equipmentCategories.map((c) => (
              <li key={c.slug}>
                <Link href={`/equipment/${c.slug}`}>{c.name}</Link>
              </li>
            ))
          ) : (
            <>
              <li>
                <Link href="/equipment/excavators">Excavators</Link>
              </li>
              <li>
                <Link href="/equipment/graders">Motor graders</Link>
              </li>
              <li>
                <Link href="/equipment/rollers">Rollers and compactors</Link>
              </li>
              <li>
                <Link href="/equipment/bulldozers">Bulldozers</Link>
              </li>
            </>
          )}
          <li>
            <Link href="/equipment">All equipment</Link>
          </li>
          <li>
            <Link href="/equipment#how-hire-works">How hire works</Link>
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
            <Link href="/about">Company</Link>
          </li>
          <li>
            <Link href="/about/leadership">Leadership</Link>
          </li>
          {hasCredentials && (
            <li>
              <Link href="/about/credentials-and-safety">Credentials and safety</Link>
            </li>
          )}
          {hasCompanyProfile && (
            <li>
              <Link href="/downloads/company-profile">Company profile</Link>
            </li>
          )}
        </ul>
      </details>
      <Link className="row" href="/contact">
        Contact
      </Link>
      <Link className="btn pri" href="/contact?type=project">
        Request a quote
      </Link>
      <p>
        <a href={`tel:${phoneE164}`}>Call {phoneDisplay}</a>
      </p>
      <p>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            'Hello Shena Works, I found you on your website and would like to talk about a project.'
          )}`}
          target="_blank"
          rel="noopener"
        >
          WhatsApp us
        </a>
      </p>
      <p>
        <a href={`mailto:${email}`}>Email us</a>
      </p>
    </div>
  )
}
