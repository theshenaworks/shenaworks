import React from 'react'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/blocks/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getSiteSettings } from '@/lib/content'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Thank You | Shena Works',
  description: 'We have received your enquiry.',
  path: '/thank-you',
  noIndex: true,
})

const COPY_BY_TYPE: Record<string, { headline: string; getLead: (phone: string) => string }> = {
  project: {
    headline: 'Thank you, we have your enquiry',
    getLead: (phone) =>
      `We'll look at the details and call or email you soon. If it's urgent, call us on ${phone}.`,
  },
  hire: {
    headline: "Thank you, we're checking availability",
    getLead: (phone) =>
      `We'll confirm whether the machine is free for your dates and send a price. For urgent hire, call ${phone}.`,
  },
  consultation: {
    headline: "Thank you, we'll be in touch to arrange a time",
    getLead: () => "We'll contact you to agree a time to talk through the project.",
  },
  other: {
    headline: 'Thank you for getting in touch',
    getLead: () => "We've received your message and will reply by email or phone.",
  },
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const cookieStore = await cookies()
  const reference = cookieStore.get('sw_enquiry_ref')?.value

  const settings = getSiteSettings()
  const typeKey = params.type && COPY_BY_TYPE[params.type] ? params.type : 'project'
  const copy = COPY_BY_TYPE[typeKey]!
  const whatsappUrl = buildWhatsAppUrl({ type: 'default' }, settings.contact.whatsappNumber)

  return (
    <div className="bg-[var(--white)]">
      <PageHeader
        overline="Enquiry received"
        headline={copy.headline}
        lead={copy.getLead(settings.contact.phoneDisplay)}
        meta={reference ? `Your reference: ${reference}` : undefined}
      />

      <section className="py-[6.4rem] lg:py-[8.0rem]">
        <div className="site-grid gap-y-[4.8rem]">
          <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-3 gap-[3.2rem]">
            <Card
              href="/projects"
              imageSrc="/media/project-black-perch-lounge.svg"
              imageAlt="Completed projects by Shena Works"
              aspectRatio="4:3"
              overline="Projects"
              title="See our recent work"
              summary="Lounges, cottages, villas, paved compounds and roads in Meru County."
            />
            <Card
              href="/equipment"
              imageSrc="/media/equipment-crawler-excavator.svg"
              imageAlt="Heavy equipment hire fleet"
              aspectRatio="4:3"
              overline="Equipment hire"
              title="Explore the plant fleet"
              summary="Excavators, motor graders, vibratory rollers and bulldozers with operators."
            />
            <Card
              href="/services"
              imageSrc="/media/service-road-construction.svg"
              imageAlt="Construction services"
              aspectRatio="4:3"
              overline="Services"
              title="All construction services"
              summary="Road construction, cabro paving, general building and project management."
            />
          </div>

          <div
            data-surface="subtle"
            className="col-span-4 lg:col-start-2 lg:col-span-8 bg-[var(--grey-100)] border border-[var(--grey-300)] p-[3.2rem] lg:p-[4.0rem]"
          >
            <p className="text-overline text-[var(--ink-600)] mb-[0.8rem]">Talk to us</p>
            <h2 className="text-h4 text-[var(--ink-900)] mb-[1.2rem]">Call or WhatsApp</h2>
            <p className="text-body font-bold text-[var(--ink-900)] mb-[2.0rem]">
              {settings.contact.phoneDisplay}
            </p>
            <div className="flex flex-wrap items-center gap-[1.2rem]">
              <Button href={`tel:${settings.contact.phoneE164}`} variant="secondary">
                Call
              </Button>
              <Button href={whatsappUrl} external variant="outline">
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
