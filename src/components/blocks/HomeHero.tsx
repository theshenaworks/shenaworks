import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { HomePageRecord } from '@/types/content'

/**
 * 1 HomeHero (AGENTS.md Section 0 & Section 5 Phase B & D)
 * Reference: docs/reference/home/index.html lines 392-402
 * Section 0 Rule 6: Image uses fill, priority, sizes="100vw".
 */
export interface HomeHeroProps {
  hero?: HomePageRecord | null
  overline?: string
  headline?: string
  lead?: string
  heroImage?: any
}

export function HomeHero({ hero, ..._props }: HomeHeroProps = {}) {
  const imgSrc =
    (typeof _props.heroImage === 'string'
      ? _props.heroImage
      : _props.heroImage?.url) ||
    (hero?.heroImage?.url ? hero.heroImage.url : null) ||
    '/media/hero-roads.jpg'

  const imgAlt =
    (typeof _props.heroImage === 'object' && _props.heroImage?.alt) ||
    hero?.heroImage?.alt ||
    'Road construction crew and equipment working on a road'

  return (
    <section className="hero" style={{ padding: 0 }} data-surface="photo">
      <div className="ph">
        <Image
          src={imgSrc}
          alt={imgAlt}
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="wrap">
        <h1 className="d">
          <span className="sr">Road and building contractors in Meru and Nairobi: </span>
          Roads, earthworks and buildings, <strong>built with our own machines.</strong>
        </h1>
        <div className="btns">
          <Link className="btn pri" href="/contact?type=project">
            Request a quote
          </Link>
          <Link className="btn out" href="/equipment">
            Hire equipment
          </Link>
        </div>
      </div>
    </section>
  )
}
