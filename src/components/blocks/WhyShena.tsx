import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { HomePageRecord } from '@/types/content'

/**
 * 7 WhyShena (AGENTS.md Section 0 & Section 5 Phase B & D)
 * Reference: docs/reference/home/index.html lines 494-509
 * Conditional rule (SITE-PLAN 8): point marked verified; point hidden if not verified; block hidden if 0.
 */
export interface WhyShenaProps {
  whyShena?: HomePageRecord['whyShena']
  overline?: string
  heading?: string
}

const DEFAULT_POINTS = [
  {
    number: '01',
    title: 'Our own machines',
    description:
      'Our excavators, graders and rollers are on your job when the programme says, not when a hire yard can spare them.',
  },
  {
    number: '02',
    title: 'Roads and buildings, one contractor',
    description:
      'Earthworks, drainage, paving and the building itself are planned and supervised by one team.',
  },
  {
    number: '03',
    title: 'Led from the site',
    description:
      'Our managing director has supervised county road works and inspected urban roads, and still visits every site.',
  },
]

export function WhyShena({ whyShena, overline, heading }: WhyShenaProps = {}) {
  // Filter points marked verified per SITE-PLAN 8
  const verifiedPoints =
    whyShena?.points && whyShena.points.length > 0
      ? whyShena.points.filter((p) => p.verified !== false)
      : DEFAULT_POINTS

  if (verifiedPoints.length === 0) return null

  const headingText = heading || whyShena?.heading || 'We own the plant and we run the site'
  const overlineText = overline || whyShena?.overline || 'Why Shena Works'
  const imgSrc =
    (whyShena?.image?.url?.startsWith('http') ? whyShena.image.url : null) ||
    'https://images.pexels.com/photos/5298215/pexels-photo-5298215.jpeg?auto=compress&cs=tinysrgb&w=1200'
  const imgAlt =
    whyShena?.image?.alt || 'Crew members in safety gear working on a Shena site'

  return (
    <section className="why" style={{ paddingTop: '80px' }} aria-labelledby="why-h">
      <div className="split">
        <div className="ph grey">
          <Image
            src={imgSrc}
            alt={imgAlt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
        </div>
        <div className="panel" data-surface="dark">
          <p className="over">{overlineText}</p>
          <h2 className="h3" id="why-h">
            {headingText}
          </h2>
          <ol>
            {verifiedPoints.map((p, idx) => (
              <li key={p.number || idx}>
                <b>{p.number || `0${idx + 1}`}</b>
                <strong>{p.title}</strong>
                <span className="sm">{p.description}</span>
              </li>
            ))}
          </ol>
          <Link className="btn out" href="/about/leadership">
            Meet our managing director
          </Link>
        </div>
      </div>
    </section>
  )
}
