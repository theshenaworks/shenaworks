import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { KeyFacts } from '@/components/blocks/KeyFacts'
import { ContactAside } from '@/components/blocks/ContactAside'
import { TestimonialBlock } from '@/components/blocks/TestimonialBlock'
import { Gallery } from '@/components/blocks/Gallery'
import { ProjectGrid } from '@/components/blocks/ProjectGrid'
import { CtaBand } from '@/components/blocks/CtaBand'
import {
  getMachinesBySlugs,
  getPublishedProjectBySlug,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTestimonials,
} from '@/lib/payload'
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from '@/lib/seo/jsonld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { KeyFactItem } from '@/types/content'

export async function generateStaticParams() {
  const projects = await getPublishedProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) return {}
  return buildPageMetadata({
    title: project.metaTitle,
    description: project.metaDescription,
    path: `/projects/${project.slug}`,
    ogSubtitle: `${project.location.town}, ${project.location.county}`,
  })
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) notFound()

  const [allServices, linkedMachines, testimonials, allProjects] = await Promise.all([
    getPublishedServices(),
    getMachinesBySlugs(project.equipmentSlugs),
    getPublishedTestimonials({ projectSlug: project.slug }),
    getPublishedProjects(),
  ])
  const linkedServices = allServices.filter((s) => project.serviceSlugs.includes(s.slug))

  const relatedProjects = allProjects
    .filter(
      (p) =>
        p.slug !== project.slug &&
        p.serviceSlugs.some((s) => project.serviceSlugs.includes(s)),
    )
    .slice(0, 3)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: project.title },
  ]

  const keyFactItems: KeyFactItem[] = [
    { term: 'Client type', value: project.clientType },
    { term: 'Status', value: project.status },
    { term: 'Year', value: project.year },
    { term: "Shena's role", value: project.role },
    { term: 'Delivered by', value: project.deliveringCompany },
    ...(linkedServices.length > 0
      ? [
          {
            term: 'Services',
            value: linkedServices.map((s) => s.shortTitle).join(', '),
          },
        ]
      : []),
  ]

  const primaryServiceSlug = project.serviceSlugs[0] || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: project.title,
        description: project.metaDescription,
        url: `${SITE_URL}/projects/${project.slug}`,
        primaryImageOfPage: `${SITE_URL}${project.heroImage.url}`,
        about: { '@id': ORG_ID },
      },
      buildBreadcrumbJsonLd(breadcrumbs, `/projects/${project.slug}`),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Full-bleed Hero Image (header white on this page per SITE-PLAN.md 6.8) */}
      <div className="pt-[5.2rem] lg:pt-[12.8rem] bg-[var(--white)]">
        <div className="aspect-square md:aspect-video w-full overflow-hidden bg-[var(--grey-100)]">
          <img
            src={project.heroImage.url}
            alt={project.heroImage.alt}
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* 2. Title Block */}
      <section className="bg-[var(--white)] pt-[4.0rem] lg:pt-[5.6rem] pb-[2.4rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14">
            <div className="mb-[1.6rem]">
              <Breadcrumb items={breadcrumbs} />
            </div>
            <p className="text-overline text-[var(--ink-600)] mb-[0.8rem]">Projects</p>
            <h1 className="text-h1 text-[var(--ink-900)] mb-[1.2rem]">{project.title}</h1>
            <p className="text-label text-[var(--accent-500)]">
              {project.location.town}, {project.location.county}
            </p>
            {project.heroImage.caption && (
              <p className="text-figcaption text-[var(--ink-600)] mt-[1.6rem]">
                {project.heroImage.caption}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. KeyFacts */}
      <KeyFacts items={keyFactItems} />

      {/* 4. Body (subtle surface: Prose col 2-9 + ContactAside col 12-4) */}
      <section
        data-surface="subtle"
        className="bg-[var(--grey-100)] py-[6.4rem] lg:py-[8.0rem] border-b border-[var(--grey-300)]"
      >
        <div className="site-grid items-start gap-y-[4.8rem]">
          <div className="col-span-4 lg:col-start-2 lg:col-span-9 space-y-[4.0rem]">
            <div>
              <h2 className="text-h2 text-[var(--ink-900)] mb-[1.6rem]">The brief</h2>
              <p className="text-body text-[var(--ink-900)]">{project.brief}</p>
            </div>
            <div>
              <h2 className="text-h2 text-[var(--ink-900)] mb-[1.6rem]">The work</h2>
              <p className="text-body text-[var(--ink-900)]">{project.work}</p>
            </div>
            <div>
              <h2 className="text-h2 text-[var(--ink-900)] mb-[1.6rem]">The result</h2>
              <p className="text-body text-[var(--ink-900)]">{project.result}</p>
            </div>
          </div>

          <div className="col-span-4 lg:col-start-12 lg:col-span-4">
            <ContactAside
              waContext={{ type: 'project', projectTitle: project.title }}
            />
          </div>
        </div>
      </section>

      {/* 5. TestimonialBlock (if permitted) */}
      <TestimonialBlock testimonials={testimonials} />

      {/* 6. Stat Row (keyFigures) */}
      {project.keyFigures.length > 0 && (
        <section className="bg-[var(--white)] py-[5.6rem] lg:py-[6.4rem] border-b border-[var(--grey-300)]">
          <div className="site-grid">
            <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-3 gap-[3.2rem]">
              {project.keyFigures.map((fig) => (
                <div key={fig.label}>
                  <p className="font-[var(--font-header)] text-h2 text-[var(--accent-500)] leading-none mb-[0.8rem]">
                    {fig.value}
                  </p>
                  <p className="text-body-sm text-[var(--ink-600)]">{fig.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Gallery */}
      <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14">
            <h2 className="text-h2 text-[var(--ink-900)] mb-[3.2rem]">Project gallery</h2>
            <Gallery
              id={`gallery-${project.slug}`}
              title={`${project.title} photos`}
              images={project.gallery}
            />
          </div>
        </div>
      </section>

      {/* 8. Credits (Equipment used & Related services) */}
      <section className="bg-[var(--white)] pb-[6.4rem] border-b border-[var(--grey-300)]">
        <div className="site-grid">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-2 gap-[3.2rem]">
            {linkedMachines.length > 0 && (
              <div className="border-t-2 border-[var(--grey-300)] pt-[1.6rem]">
                <p className="text-overline text-[var(--ink-600)] mb-[1.2rem]">Equipment used</p>
                <div className="flex flex-wrap gap-[1.6rem]">
                  {linkedMachines.map((m) => (
                    <a
                      key={m.slug}
                      href={`/equipment/${m.categorySlug}/${m.slug}`}
                      className="text-label text-[var(--ink-900)] no-underline u-draw"
                    >
                      {m.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {linkedServices.length > 0 && (
              <div className="border-t-2 border-[var(--grey-300)] pt-[1.6rem]">
                <p className="text-overline text-[var(--ink-600)] mb-[1.2rem]">Related services</p>
                <div className="flex flex-wrap gap-[1.6rem]">
                  {linkedServices.map((s) => (
                    <a
                      key={s.slug}
                      href={
                        s.parentSlug ? `/services/${s.parentSlug}/${s.slug}` : `/services/${s.slug}`
                      }
                      className="text-label text-[var(--ink-900)] no-underline u-draw"
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. Related Projects */}
      <ProjectGrid
        variant="related"
        overline="Projects"
        heading="More projects"
        actionLabel="All projects"
        actionHref="/projects"
        projects={relatedProjects}
        services={allServices}
      />

      {/* 10. CtaBand */}
      <CtaBand
        headlineLine1="Planning something"
        headlineLine2="similar?"
        buttonLabel="Request a quote"
        buttonHref={
          primaryServiceSlug
            ? `/contact?type=project&service=${primaryServiceSlug}`
            : '/contact?type=project'
        }
      />
    </>
  )
}
