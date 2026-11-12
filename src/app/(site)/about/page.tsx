import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LocationsBand } from '@/components/blocks/LocationsBand'
import { CtaBand } from '@/components/blocks/CtaBand'
import {
  getPublishedCredentials,
  getPublishedEquipmentCategories,
  getPublishedLocations,
  getPublishedMachines,
  getSiteSettings,
  getTeamMember,
} from '@/lib/payload'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'About Shena Works | Meru Roads and Building Contractor',
  description:
    'Shena Works Limited is a Meru-based roads and building contractor with its own earthmoving plant, working across Meru, Nairobi and the rest of Kenya.',
  path: '/about',
})

export default async function AboutPage() {
  const [settings, machines, categories, locations, team, credentials] = await Promise.all([
    getSiteSettings(),
    getPublishedMachines(),
    getPublishedEquipmentCategories(),
    getPublishedLocations(),
    getTeamMember(),
    getPublishedCredentials(),
  ])
  const hasCredentials = credentials.length > 0
  const hasCompanyProfile = Boolean(settings.files?.companyProfile?.url)

  const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'About' }]

  const fleetBody =
    machines.length > 0
      ? `${machines.length} machines across ${categories.length} categories, maintained by us and operated by our own trained operators.`
      : 'Excavators, graders, rollers and bulldozers, maintained by us and operated by our own trained operators.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'About Shena Works Limited',
        url: `${SITE_URL}/about`,
        mainEntity: { '@id': ORG_ID },
      },
      buildBreadcrumbJsonLd(breadcrumbs, '/about'),
    ],
  }

  const subNavLinks = (
    <>
      <Link href="/about" aria-current="page">Company</Link>
      <Link href="/about/leadership">Leadership</Link>
      {hasCredentials && (
        <Link href="/about/credentials-and-safety">Credentials and safety</Link>
      )}
      {hasCompanyProfile && (
        <a href="/downloads/company-profile" download>Company profile</a>
      )}
    </>
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero */}
      <section className="hero page" style={{ padding: 0 }} data-surface="photo">
        <div className="ph">
          <Image
            src="https://images.pexels.com/photos/5298215/pexels-photo-5298215.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Crew members in safety gear working on a Shena site"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">About</span>
          </nav>
          <p className="over">About</p>
          <h1 className="h1" style={{ maxWidth: '14em' }}>A Meru contractor for roads and buildings</h1>
        </div>
      </section>

      {/* 2. Mobile subnav */}
      <nav className="sub" aria-label="About">
        {subNavLinks}
      </nav>

      {/* 3. Intro + desktop subnav */}
      <section style={{ paddingBottom: '40px' }} aria-labelledby="who-h">
        <div className="wrap aintro">
          <div className="body">
            <h2 className="h2" id="who-h">Who we are</h2>
            <p className="lead" style={{ marginTop: '24px', fontSize: '20px', lineHeight: '30px' }}>
              Shena Works Limited is a roads and building contractor based in Meru, with an office in Nairobi. We build access and estate roads, lay cabro paving, cut drains and install culverts, and we put up homes, lounges, cottages and commercial premises.
            </p>
            <p>
              We own and operate our earthmoving plant (excavators, graders, rollers and bulldozers), so the machines a job needs are ours to schedule. We also hire them out, with operators, to other contractors, farmers and developers.
            </p>
            <p>
              We work for private developers, hospitality owners and public bodies, mostly in Meru County and Nairobi, and travel for the right job anywhere in Kenya.
            </p>
          </div>
          <aside className="subnav" aria-label="About">
            <span className="over">About</span>
            {subNavLinks}
          </aside>
        </div>
      </section>

      {/* 4. FeatureSplit 1 — Roads and earthworks */}
      <section className="fsec">
        <div className="split">
          <div className="ph">
            <Image
              src="https://images.pexels.com/photos/12267902/pexels-photo-12267902.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="A grader levelling a murram road"
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
            />
          </div>
          <div className="panel subtle">
            <p className="over">Roads and earthworks</p>
            <h3 className="h3">From bush to finished surface</h3>
            <p>Site clearing, cut and fill, grading and compaction, drainage and culverts, then a murram, gravel, cabro or tarmac surface with kerbs and markings.</p>
            <Link className="btn sec" href="/services/road-construction-and-earthworks">
              Road construction and earthworks
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FeatureSplit 2 — Buildings and interiors */}
      <section className="fsec">
        <div className="split r">
          <div className="ph warm">
            <Image
              src="https://images.pexels.com/photos/33719014/pexels-photo-33719014.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="A building under construction with scaffolding"
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
            />
          </div>
          <div className="panel subtle">
            <p className="over">Buildings and interiors</p>
            <h3 className="h3">Built to the drawings, finished inside</h3>
            <p>Foundations, structure, roofing and finishes for homes, lounges, cottages and commercial buildings, with interior fit-outs where the client wants one team to the end.</p>
            <Link className="btn sec" href="/services/general-construction">
              General construction
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FeatureSplit 3 — Our fleet */}
      <section className="fsec">
        <div className="split">
          <div className="ph">
            <Image
              src="https://images.pexels.com/photos/40736607/pexels-photo-40736607.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="People and machines on a Shena road site"
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
            />
          </div>
          <div className="panel" data-surface="dark">
            <p className="over">Our fleet</p>
            <h3 className="h3">Machines we own and run</h3>
            <p>{fleetBody}</p>
            <Link className="btn out" href="/equipment">
              See the fleet
            </Link>
          </div>
        </div>
      </section>

      {/* 7. ProcessSteps — How we work */}
      <section id="how-we-work" aria-labelledby="hw-h">
        <div className="wrap">
          <h2 className="h2" id="hw-h">How we work</h2>
          <ol className="steps" style={{ listStyle: 'none', padding: 0 }}>
            <li className="step">
              <p className="over">Step 1</p>
              <h3 className="h4">Site visit and brief</h3>
              <p className="sm">We visit the site, look at access, soil and drainage, and agree what you need.</p>
            </li>
            <li className="step">
              <p className="over">Step 2</p>
              <h3 className="h4">Estimate and programme</h3>
              <p className="sm">You get a written quotation with the scope, the programme and what is excluded.</p>
            </li>
            <li className="step">
              <p className="over">Step 3</p>
              <h3 className="h4">Build and supervise</h3>
              <p className="sm">Our site manager runs the work day to day and reports progress to you.</p>
            </li>
            <li className="step">
              <p className="over">Step 4</p>
              <h3 className="h4">Handover</h3>
              <p className="sm">We walk the finished work with you, fix any snags and hand over.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* 8. StatementBlock — What we aim for */}
      <section className="statement" aria-labelledby="aim-h">
        <div className="wrap">
          <div className="in">
            <h2 className="h2" id="aim-h">What we aim for</h2>
            <p>Roads and buildings that do their job for years, delivered on the scope, price and programme we agreed with you, by a team that leaves the community better connected.</p>
            <p className="xs">Our motto: {settings.company?.motto || 'Connecting communities. Building the future.'}</p>
          </div>
        </div>
      </section>

      {/* 9. FeatureSplit 4 — Leadership */}
      <section className="fsec" style={{ paddingBottom: '64px' }}>
        <div className="split r q">
          <div className="ph sq grey">
            <Image
              src={team.portrait?.url || 'https://images.pexels.com/photos/17746097/pexels-photo-17746097.jpeg?auto=compress&cs=tinysrgb&w=1200'}
              alt={team.portrait?.alt || 'Portrait of the managing director in a suit'}
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
            />
          </div>
          <div className="panel subtle">
            <p className="over">Leadership</p>
            <h3 className="h3">{team.name || 'Newton Muthee'}, {team.role || 'Managing Director'}</h3>
            <p>{team.summary || 'Newton leads Shena Works. Before that he managed hospitality builds in Meru County and inspected road works for the Kenya Urban Roads Authority.'}</p>
            <Link className="btn sec" href="/about/leadership">
              Read Newton’s profile
            </Link>
          </div>
        </div>
      </section>

      {/* 10. LocationsBand */}
      <LocationsBand heading="Our offices" locations={locations} />

      {/* 11. CtaBand */}
      <CtaBand buttonLabel="Contact us" buttonHref="/contact" />
    </>
  )
}

