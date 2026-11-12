import React from 'react'
import Image from 'next/image'

/**
 * StatementBlock (AGENTS.md Section 0 & Section 5 Phase B)
 * Reference: docs/reference/home/index.html lines 420-425
 */
export interface StatementBlockProps {
  heading?: string
  body?: string
  caption?: string
  buttonLabel?: string
  buttonHref?: string
}

export function StatementBlock(_props: StatementBlockProps = {}) {
  return (
    <section className="stmt" aria-label="How we work">
      <div className="stmt-run">
        <div className="stmt-stick">
          <div className="stmt-layer l1">
            <div className="ph">
              <Image
                src="https://images.pexels.com/photos/8809466/pexels-photo-8809466.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Crew standing beside a road roller on a murram road"
                fill
                sizes="100vw"
              />
            </div>
            <p className="d">
              Show us the site. <strong>We’ll bring the machines.</strong>
            </p>
          </div>
          <div className="stmt-layer l2">
            <div className="ph warm">
              <Image
                src="https://images.pexels.com/photos/34188582/pexels-photo-34188582.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="A finished modern building handed over to the client"
                fill
                sizes="100vw"
              />
            </div>
            <p className="d">
              Give us the drawings. <strong>We’ll hand over the keys.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
