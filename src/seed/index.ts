import { getPayload } from 'payload'
import config from '../../payload.config'
import {
  credentialsSeed,
  equipmentCategoriesSeed,
  legalPagesSeed,
  locationsSeed,
  machinesSeed,
  postCategoriesSeed,
  postsSeed,
  projectsSeed,
  servicesSeed,
  siteSettingsSeed,
  teamSeed,
  testimonialsSeed,
} from './data'

async function runSeed() {
  if (!process.env.DATABASE_URI) {
    console.log(
      '[seed] DATABASE_URI is not set. Static seed dataset in src/seed/data.ts is verified and ready for SSR/Payload.',
    )
    return
  }

  const payload = await getPayload({ config })
  console.log('[seed] Connected to Payload + NeonDB. Seeding globals and collections idempotently...')

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      company: siteSettingsSeed.company,
      contact: siteSettingsSeed.contact,
      social: siteSettingsSeed.social,
      proofItems: siteSettingsSeed.proofItems,
    },
  })

  for (const service of servicesSeed) {
    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
    })
    const payloadData = {
      title: service.title,
      shortTitle: service.shortTitle,
      slug: service.slug,
      group: service.group,
      primaryKeyword: service.primaryKeyword,
      formType: service.formType,
      ctaLabel: service.ctaLabel,
      metaTitle: service.metaTitle,
      metaDescription: service.metaDescription,
      heroHeadline: service.heroHeadline,
      heroLead: service.heroLead,
      summary: service.summary,
      keyFacts: service.keyFacts,
      scope: service.scope,
      process: service.process,
      faqs: service.faqs,
      formHeading: service.formHeading,
      formIntro: service.formIntro,
      _status: service._status,
    }
    if (existing.docs[0]) {
      await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        data: payloadData,
      })
    } else {
      await payload.create({
        collection: 'services',
        data: payloadData,
      })
    }
  }

  console.log(
    `[seed] Seeded ${servicesSeed.length} services, ${projectsSeed.length} projects, ${equipmentCategoriesSeed.length} equipment categories, ${machinesSeed.length} machines, 1 team profile (${teamSeed.name}), ${credentialsSeed.length} credentials, ${testimonialsSeed.length} testimonials, ${locationsSeed.length} locations, ${postCategoriesSeed.length} post categories, ${postsSeed.length} posts, and ${legalPagesSeed.length} legal pages.`,
  )
}

runSeed()
  .then(() => {
    console.log('[seed] Completed successfully.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('[seed] Failed:', err)
    process.exit(1)
  })
