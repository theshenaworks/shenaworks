import React from 'react'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/payload'

/**
 * Footer (AGENTS.md Section 0 & Section 5 Phase A & D)
 * Server Component emitting reference DOM with dynamic Payload data and reference fallbacks.
 */
export async function Footer() {
  const settings = await getSiteSettings().catch(() => null)

  const phoneDisplay = settings?.contact?.phoneDisplay || '+254 718 971 896'
  const phoneE164 = settings?.contact?.phoneE164 || '+254718971896'
  const whatsappNumber = settings?.contact?.whatsappNumber || '254718971896'
  const email = settings?.contact?.email || 'shenaworksltd@gmail.com'
  const legalName = settings?.company?.legalName || 'Shena Works Limited'

  return (
    <footer>
      <div className="f-top">
        <div className="f-left">
          <Link className="logo" href="/" aria-label="Shena Works home">
            <svg viewBox="0 0 2172 724" aria-hidden="true" focusable="false">
              <use href="#shena-logo" />
            </svg>
          </Link>
          <p className="sm">Connecting communities. Building the future.</p>
          <nav aria-label="Footer">
            <ul className="f-nav">
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/equipment">Equipment</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="f-right">
          <Link className="f-cta" href="/contact?type=project">
            Request a quote{' '}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
          </Link>
          <nav aria-label="Contact">
            <ul className="f-small">
              <li>
                <a href={`tel:${phoneE164}`}>{phoneDisplay}</a>
              </li>{' '}
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    'Hello Shena Works, I found you on your website and would like to talk about a project.'
                  )}`}
                  target="_blank"
                  rel="noopener"
                >
                  WhatsApp us
                </a>
              </li>{' '}
              <li>
                <a href={`mailto:${email}`}>Email us</a>
              </li>{' '}
              <li>
                <Link href="/locations/meru">Meru office</Link>
              </li>{' '}
              <li>
                <Link href="/locations/nairobi">Nairobi office</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="f-bot">
        <nav aria-label="Legal">
          <ul>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/cookies">Cookies</Link>
            </li>
            <li>
              <Link href="/sitemap.xml">Sitemap</Link>
            </li>
          </ul>
        </nav>
        <p>© 2026 {legalName}. All rights reserved.</p>
      </div>
    </footer>
  )
}
