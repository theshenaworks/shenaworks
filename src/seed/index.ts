if (!process.env.DATABASE_URI) {
  try {
    process.loadEnvFile?.('.env.local')
  } catch {
    try {
      process.loadEnvFile?.('.env')
    } catch {}
  }
}

import { getPayload } from 'payload'
import {
  credentialsSeed,
  defaultHireTerms,
  equipmentCategoriesSeed,
  equipmentIndexSeed,
  homePageSeed,
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

async function upsertBySlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  collection: string,
  slug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
): Promise<number | string> {
  process.stdout.write(`[seed] ${collection} > ${slug}... `)
  let existingDoc = (
    await payload.find({
      collection,
      where: { slug: { equals: slug } },
      draft: true,
      limit: 1,
    })
  ).docs[0]

  if (!existingDoc) {
    existingDoc = (
      await payload.find({
        collection,
        where: { slug: { equals: slug } },
        limit: 1,
      })
    ).docs[0]
  }

  if (existingDoc) {
    const updated = await payload.update({
      collection,
      id: existingDoc.id,
      data,
      draft: data._status === 'draft',
    })
    console.log(`updated (${updated.id})`)
    return updated.id
  }
  const created = await payload.create({
    collection,
    data,
    draft: data._status === 'draft',
  })
  console.log(`created (${created.id})`)
  return created.id
}

async function runSeed() {
  if (!process.env.DATABASE_URI) {
    try {
      process.loadEnvFile?.('.env.local')
    } catch {
      try {
        process.loadEnvFile?.('.env')
      } catch {}
    }
  }

  if (!process.env.DATABASE_URI) {
    throw new Error('[seed] DATABASE_URI is not set. Cannot seed database.')
  }

  const config = (await import('../../payload.config')).default
  const payload = await getPayload({ config })
  console.log('[seed] Connected to Payload + NeonDB. Seeding globals and collections idempotently...')

  // 1. Globals
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      company: {
        legalName: siteSettingsSeed.company.legalName,
        tradingName: siteSettingsSeed.company.tradingName,
        tagline: siteSettingsSeed.company.tagline,
        motto: siteSettingsSeed.company.motto,
        regNumber: siteSettingsSeed.company.regNumber ?? '',
        incorporationDate: siteSettingsSeed.company.incorporationDate ?? '',
        kraPin: siteSettingsSeed.company.kraPin ?? '',
        directors: siteSettingsSeed.company.directors,
      },
      contact: siteSettingsSeed.contact,
      social: {
        linkedinUrl: siteSettingsSeed.social.linkedinUrl ?? '',
        facebookUrl: siteSettingsSeed.social.facebookUrl ?? '',
      },
      proofItems: siteSettingsSeed.proofItems,
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      heroOverline: homePageSeed.heroOverline,
      heroHeadline: homePageSeed.heroHeadline,
      heroLead: homePageSeed.heroLead,
    },
  })

  await payload.updateGlobal({
    slug: 'equipment-index',
    data: {
      hireTerms: {
        operator: 'Included — machine is hired only with a Shena-trained operator',
        fuel: 'Dry rate (client supplies diesel on site) or wet rate option stated on quote',
        transport:
          'Low-loader mobilisation and demobilisation quoted from Meru or Nairobi yard to your site',
        minimumHire: '1 full day (8 machine working hours)',
        serviceArea:
          'Meru, Isiolo, Laikipia, Tharaka-Nithi, Nyeri, Embu, Kirinyaga, Nairobi and nationwide for longer hires',
      },
    },
  })

  // 2. Services
  const serviceIdBySlug = new Map<string, number | string>()
  for (const service of servicesSeed) {
    const id = await upsertBySlug(payload, 'services', service.slug, {
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
      intro: service.intro.join('\n\n'),
      keyFacts: service.keyFacts,
      scope: service.scope,
      process: service.process,
      faqs: service.faqs,
      formHeading: service.formHeading,
      formIntro: service.formIntro,
      registeredProfessionalName: service.registeredProfessionalName ?? '',
      boraqsOrEbkRegNumber: service.boraqsOrEbkRegNumber ?? '',
      _status: service._status,
    })
    serviceIdBySlug.set(service.slug, id)
  }

  // Link parent service relationships (e.g., cabro-paving -> road-construction-and-earthworks)
  for (const service of servicesSeed) {
    if (service.parentSlug) {
      const id = serviceIdBySlug.get(service.slug)
      const parentId = serviceIdBySlug.get(service.parentSlug)
      if (id && parentId) {
        await payload.update({
          collection: 'services',
          id: Number(id),
          data: { parent: Number(parentId) },
        })
      }
    }
  }

  // 3. Equipment Categories
  const equipCatIdBySlug = new Map<string, number | string>()
  for (const [idx, cat] of equipmentCategoriesSeed.entries()) {
    const id = await upsertBySlug(payload, 'equipment-categories', cat.slug, {
      name: cat.name,
      singular: cat.singular,
      article: cat.article,
      slug: cat.slug,
      order: idx + 1,
      heroHeadline: cat.heroHeadline,
      heroLead: cat.heroLead,
      summary: cat.summary,
      intro: cat.intro.join('\n\n'),
      uses: cat.uses,
      faqs: cat.faqs,
      primaryKeyword: cat.primaryKeyword,
      _status: 'published',
    })
    equipCatIdBySlug.set(cat.slug, id)
  }

  // 4. Equipment Machines
  for (const machine of machinesSeed) {
    const categoryId = equipCatIdBySlug.get(machine.categorySlug)
    if (!categoryId) continue
    await upsertBySlug(payload, 'equipment', machine.slug, {
      name: machine.name,
      slug: machine.slug,
      category: categoryId,
      featured: machine.featured,
      make: machine.make,
      model: machine.model,
      capacity: machine.capacity,
      specs: [
        ...(machine.operatingWeight
          ? [{ label: 'Operating weight', value: machine.operatingWeight }]
          : []),
        ...(machine.attachmentSize
          ? [{ label: 'Bucket / blade / drum', value: machine.attachmentSize }]
          : []),
        ...(machine.enginePower ? [{ label: 'Engine power', value: machine.enginePower }] : []),
      ],
      owningEntity: 'Shena Works Limited',
      uses: machine.uses,
      hireTerms: machine.hireTerms,
      availability: machine.availability,
      _status: machine._status,
    })
  }

  // 5. Projects
  const projectIdBySlug = new Map<string, number | string>()
  for (const proj of projectsSeed) {
    const serviceIds = proj.serviceSlugs
      .map((s) => serviceIdBySlug.get(s))
      .filter((v): v is number | string => Boolean(v))

    const clientTypeMap: Record<string, string> = {
      'Civil & Roads': 'Public / Roads',
    }

    const id = await upsertBySlug(payload, 'projects', proj.slug, {
      title: proj.title,
      slug: proj.slug,
      featured: proj.featured,
      services: serviceIds,
      location: proj.location,
      clientType: clientTypeMap[proj.clientType] || proj.clientType,
      year: proj.year,
      status: proj.status,
      role: proj.role,
      deliveringCompany: proj.deliveringCompany,
      verificationEvidenceNote: proj.verificationEvidenceNote,
      brief: proj.brief,
      work: proj.work,
      result: proj.result,
      keyFigures: proj.keyFigures,
      gallery: proj.gallery ? proj.gallery.map((g) => ({ caption: g.caption })) : [],
      metaTitle: proj.metaTitle,
      metaDescription: proj.metaDescription,
      _status: proj._status,
    })
    projectIdBySlug.set(proj.slug, id)
  }

  // 6. Team (Newton Muthee)
  const teamId = await upsertBySlug(payload, 'team', teamSeed.slug, {
    name: teamSeed.name,
    slug: teamSeed.slug,
    role: teamSeed.role,
    summary: teamSeed.summary,
    bio: teamSeed.bio.join('\n\n'),
    experience: teamSeed.experience,
    areasOfWork: teamSeed.areasOfWork.map((a) => ({ term: a.term, value: a.value })),
    phone: teamSeed.phone ?? siteSettingsSeed.contact.phoneDisplay,
    email: teamSeed.email,
    linkedinUrl: teamSeed.linkedinUrl ?? '',
    _status: 'published',
  })

  // 7. Credentials (stored as draft until verified certificates are uploaded)
  for (const cred of credentialsSeed) {
    const existing = await payload.find({
      collection: 'credentials',
      where: { name: { equals: cred.name } },
      draft: true,
      limit: 1,
    })
    const credData = {
      name: cred.name,
      issuer: cred.issuer,
      number: cred.number,
      category: cred.category,
      holder: cred.holderSlug === teamSeed.slug ? Number(teamId) : undefined,
      order: cred.order,
      _status: 'draft' as const,
    }
    if (existing.docs[0]) {
      await payload.update({
        collection: 'credentials',
        id: existing.docs[0].id,
        data: credData,
        draft: true,
      })
    } else {
      await payload.create({
        collection: 'credentials',
        data: credData,
        draft: true,
      })
    }
  }

  // 8. Testimonials (stored as draft until written permission is uploaded)
  for (const test of testimonialsSeed) {
    const existing = await payload.find({
      collection: 'testimonials',
      where: { person: { equals: test.person } },
      draft: true,
      limit: 1,
    })
    const testData = {
      quote: test.quote,
      person: test.person,
      title: test.title,
      organisation: test.organisation,
      project:
        test.projectSlug && projectIdBySlug.has(test.projectSlug)
          ? Number(projectIdBySlug.get(test.projectSlug))
          : undefined,
      services: test.serviceSlugs
        .map((s) => Number(serviceIdBySlug.get(s)))
        .filter((v) => !isNaN(v)),
      isPublicOfficial: test.isPublicOfficial,
      _status: 'draft' as const,
    }
    if (existing.docs[0]) {
      await payload.update({
        collection: 'testimonials',
        id: existing.docs[0].id,
        data: testData,
        draft: true,
      })
    } else {
      await payload.create({
        collection: 'testimonials',
        data: testData,
        draft: true,
      })
    }
  }

  // 9. Locations (Meru published; Nairobi draft)
  for (const loc of locationsSeed) {
    await upsertBySlug(payload, 'locations', loc.slug, {
      town: loc.town,
      county: loc.county,
      slug: loc.slug,
      heroHeadline: loc.heroHeadline,
      heroLead: loc.heroLead,
      address: loc.address,
      phone: loc.phone,
      email: loc.email,
      hours: loc.hours || siteSettingsSeed.contact.officeHours,
      directionsUrl: loc.directionsUrl,
      mapEmbedUrl: loc.mapEmbedUrl ?? '',
      intro: loc.intro.join('\n\n'),
      faqs: loc.faqs,
      _status: loc._status,
    })
  }

  // 10. Post Categories & Posts
  const postCatIdBySlug = new Map<string, number | string>()
  for (const pc of postCategoriesSeed) {
    const id = await upsertBySlug(payload, 'post-categories', pc.slug, {
      name: pc.name,
      slug: pc.slug,
    })
    postCatIdBySlug.set(pc.slug, id)
  }

  for (const post of postsSeed) {
    const catId = postCatIdBySlug.get(post.categorySlug)
    if (!catId) continue
    await upsertBySlug(payload, 'posts', post.slug, {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt.slice(0, 160),
      category: Number(catId),
      author: Number(teamId),
      publishedDate: post.publishedAt,
      readingTimeMinutes: post.readingTimeMinutes,
      body: post.sections.map((s) => `## ${s.heading}\n\n${s.paragraphs.join('\n\n')}`).join('\n\n'),
      relatedService: serviceIdBySlug.get(post.relatedServiceSlug)
        ? Number(serviceIdBySlug.get(post.relatedServiceSlug))
        : undefined,
      _status: post._status,
    })
  }

  // 11. Legal Pages (Privacy & Cookies)
  for (const legal of legalPagesSeed) {
    await upsertBySlug(payload, 'legal-pages', legal.slug, {
      title: legal.title,
      slug: legal.slug,
      lastUpdated: legal.lastUpdated,
      body: legal.sections
        .map((s) => `## ${s.heading}\n\n${s.paragraphs.join('\n\n')}`)
        .join('\n\n'),
    })
  }

  console.log(
    `[seed] Seeded ${servicesSeed.length} services, ${projectsSeed.length} projects, ${equipmentCategoriesSeed.length} equipment categories, ${machinesSeed.length} machines, 1 team profile (${teamSeed.name}), ${credentialsSeed.length} credentials, ${testimonialsSeed.length} testimonials, ${locationsSeed.length} locations, ${postCategoriesSeed.length} post categories, ${postsSeed.length} posts, and ${legalPagesSeed.length} legal pages into NeonDB.`,
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
