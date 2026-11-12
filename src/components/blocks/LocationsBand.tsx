import React from 'react'
import Link from 'next/link'
import type { LocationRecord } from '@/types/content'

/**
 * 10 LocationsBand (AGENTS.md Section 0 & Section 5 Phase B & D)
 * Reference: docs/reference/home/index.html lines 513-532
 */
export interface LocationsBandProps {
  heading?: string
  locations?: LocationRecord[]
}

export function LocationsBand({ heading = 'Where to find us', locations }: LocationsBandProps = {}) {
  const meruLocation = locations?.find((l) => l.slug === 'meru')
  const nairobiLocation = locations?.find((l) => l.slug === 'nairobi')

  return (
    <section className="loc" data-surface="subtle" aria-labelledby="loc-h">
      <div className="wrap">
        <h2 className="h2" id="loc-h">
          {heading}
        </h2>
        <div className="cols" style={{ marginTop: '32px' }}>
          <div>
            <p className="over">Headquarters and plant yard</p>
            <h3 className="h3">Meru</h3>
            <p className="sm">
              {(meruLocation as any)?.homeSummary ||
                'Our yard, team and heavy plant are based here, so we can visit your plot quickly and keep mobilisation costs down across Meru County and Mount Kenya East.'}
            </p>
            <div className="links">
              <Link className="arrow" href="/locations/meru">
                Meru contractors{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
          <div>
            <p className="over">Branch office</p>
            <h3 className="h3">Nairobi</h3>
            <p className="sm">
              {nairobiLocation?.heroLead ||
                'We handle building, paving and interior fit-outs across Nairobi, Kiambu, Machakos and Kajiado, and meet clients who are building in Meru.'}
            </p>
            <div className="links">
              <Link className="arrow" href="/locations/nairobi">
                Nairobi contractors{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
