import React from 'react'
import Link from 'next/link'
import {
  getSiteSettings,
  getPublishedServices,
  getPublishedEquipmentCategories,
  getPublishedCredentials,
} from '@/lib/payload'

/**
 * Header (AGENTS.md Section 0 & Section 5 Phase A & D)
 * Server Component emitting reference DOM with dynamic Payload CMS data and reference fallbacks.
 * Conditional rules (SITE-PLAN 8):
 * - Credentials in About dropdown only when >= 1 published credential exists.
 * - Company profile in About dropdown only when uploaded.
 * - Gated services hidden.
 * Interactions are managed entirely by SiteBehaviors via the DOM.
 */
export async function Header() {
  const [settings, services, equipmentCategories, credentials] = await Promise.all([
    getSiteSettings().catch(() => null),
    getPublishedServices().catch(() => []),
    getPublishedEquipmentCategories().catch(() => []),
    getPublishedCredentials().catch(() => []),
  ])

  const phoneDisplay = settings?.contact?.phoneDisplay || '+254 718 971 896'
  const phoneE164 = settings?.contact?.phoneE164 || '+254718971896'
  const hasCredentials = credentials.length > 0
  const hasCompanyProfile = Boolean(settings?.files?.companyProfile?.url)

  // Group published services, excluding gated services in draft
  const roadsServices = services.filter(
    (s) => s.group === 'Roads and earthworks' && s._status === 'published'
  )
  const buildServices = services.filter(
    (s) => s.group === 'Buildings and interiors' && s._status === 'published'
  )
  const planServices = services.filter(
    (s) => s.group === 'Planning and delivery' && s._status === 'published'
  )

  const hasServices = roadsServices.length > 0 || buildServices.length > 0 || planServices.length > 0
  const hasCategories = equipmentCategories.length > 0

  return (
    <header id="hd" data-header="transparent">
      <div className="wrap">
        <nav className="top" aria-label="Secondary">
          <Link href="/locations/meru">Meru, Kenya</Link>
          <a href={`tel:${phoneE164}`}>Call {phoneDisplay}</a>
        </nav>
        <div className="bar">
          <Link className="logo" href="/" aria-label="Shena Works home">
            <svg viewBox="0 0 2172 724" aria-hidden="true" focusable="false">
              <use href="#shena-logo" />
            </svg>
          </Link>
          <nav className="nav" aria-label="Primary">
            <div className="has">
              <Link
                className="l"
                href="/services"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="p-sv"
              >
                Services
              </Link>
              <div className="pan" id="p-sv">
                <div className="pa">
                  <div className="pt">Services</div>
                  <p>One contractor for the road in, the ground it sits on and the building at the end of it.</p>
                  <Link className="btn sec" href="/services">
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
                          <li>
                            <Link href="/services/road-construction-and-earthworks/cabro-paving">
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
                            <Link href={`/services/${s.slug}`}>{s.title}</Link>
                          </li>
                        ))
                      ) : (
                        <>
                          <li>
                            <Link href="/services/general-construction">General construction</Link>
                          </li>
                          <li>
                            <Link href="/services/interior-design">Interior design</Link>
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
                            <Link href={`/services/${s.slug}`}>{s.title}</Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <Link href="/services/project-management">Project management</Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <Link className="l" href="/projects">
              Projects
            </Link>
            <div className="has">
              <Link
                className="l"
                href="/equipment"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="p-eq"
              >
                Equipment
              </Link>
              <div className="pan" id="p-eq">
                <div className="pa">
                  <div className="pt">Equipment</div>
                  <p>
                    Hire an excavator, grader, roller or bulldozer for your site. We quote for the machine,
                    operator and transport, and confirm dates before we move.
                  </p>
                  <Link className="btn sec" href="/equipment">
                    See the fleet
                  </Link>
                </div>
                <div className="pl">
                  <ul className="pg">
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
                </div>
              </div>
            </div>
            <div className="has">
              <Link
                className="l"
                href="/about"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="p-ab"
              >
                About
              </Link>
              <div className="pan" id="p-ab">
                <div className="pa">
                  <div className="pt">About</div>
                  <p>
                    Shena Works is a Meru-based roads and building contractor that owns its earthmoving
                    plant and works across Meru, Nairobi and the rest of Kenya.
                  </p>
                  <Link className="btn sec" href="/about">
                    About Shena Works
                  </Link>
                </div>
                <div className="pl">
                  <ul className="pg">
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
                </div>
              </div>
            </div>
            <Link className="l" href="/contact">
              Contact
            </Link>
            <Link className="btn pri" href="/contact?type=project">
              Request a quote
            </Link>
          </nav>
          <button className="menu-btn" id="mb" aria-expanded="false" aria-controls="dr" aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path id="mi" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
