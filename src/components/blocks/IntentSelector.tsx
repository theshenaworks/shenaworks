import React from 'react'
import Link from 'next/link'
import type { ServiceRecord } from '@/types/content'

/**
 * 2 IntentSelector (AGENTS.md Section 0 & Section 5 Phase B & D)
 * Reference: docs/reference/home/index.html lines 404-415
 */
export interface IntentSelectorProps {
  services?: ServiceRecord[]
  architecturePublished?: boolean
}

export function IntentSelector({ services, ..._props }: IntentSelectorProps = {}) {
  const showInteriors =
    !services ||
    services.length === 0 ||
    services.some((s) => s.slug === 'interior-design' && s._status === 'published')

  return (
    <section className="intent" aria-labelledby="intent-h">
      <div className="wrap">
        <h2 className="sr" id="intent-h">
          What do you need?
        </h2>
        <ul>
          <li>
            <Link href="/services">
              <span className="over">01</span>
              <span className="h4">Build a project</span>
              <p className="sm">Roads, paving, homes and commercial buildings.</p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </li>
          <li>
            <Link href="/equipment">
              <span className="over">02</span>
              <span className="h4">Hire equipment</span>
              <p className="sm">Excavators, graders, rollers and bulldozers with operators.</p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </li>
          {showInteriors && (
            <li>
              <Link href="/services/interior-design">
                <span className="over">03</span>
                <span className="h4">Design and interiors</span>
                <p className="sm">Interior fit-outs for homes, lounges and hotels.</p>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </li>
          )}
          <li>
            <Link href="/contact?type=other">
              <span className="over">04</span>
              <span className="h4">Work with us</span>
              <p className="sm">Suppliers, subcontractors and people looking for work.</p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
