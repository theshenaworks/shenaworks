import { describe, expect, it } from 'vitest'
import { enforcePublishingGate } from '@/hooks/publishingGate'
import {
  legalPagesSeed,
  locationsSeed,
  machinesSeed,
  projectsSeed,
  servicesSeed,
  teamSeed,
} from '@/seed/data'

describe('enforcePublishingGate hook', () => {
  const runHook = (collectionSlug: string, data: Record<string, unknown>) =>
    enforcePublishingGate({
      data,
      collection: { slug: collectionSlug },
      operation: 'update',
    })

  it('allows drafts to contain [CONFIRM: ...] placeholders', async () => {
    const result = await runHook('services', {
      _status: 'draft',
      slug: 'architecture-and-consultancy',
      title: 'Architecture [CONFIRM: I-03]',
    })
    expect(result._status).toBe('draft')
  })

  it('blocks publishing when any field contains [CONFIRM', async () => {
    await expect(
      runHook('services', {
        _status: 'published',
        slug: 'general-construction',
        title: 'General construction',
        summary: 'Built in [CONFIRM: year]',
      }),
    ).rejects.toThrow(/Cannot publish while a field still contains a \[CONFIRM/)
  })

  it('blocks publishing when any field contains banned superlatives', async () => {
    const bannedWords = [
      'premier',
      'leading',
      'best',
      'world-class',
      'exceptional',
      'unrivalled',
      'cutting-edge',
      'seamless',
    ]

    for (const word of bannedWords) {
      await expect(
        runHook('services', {
          _status: 'published',
          slug: 'general-construction',
          title: 'General construction',
          summary: `We offer ${word} construction services in Kenya.`,
        }),
      ).rejects.toThrow(/Copy contains a disallowed superlative/)
    }
  })

  it('blocks publishing gated services without BORAQS/EBK registration', async () => {
    await expect(
      runHook('services', {
        _status: 'published',
        slug: 'architecture-and-consultancy',
        title: 'Architecture and consultancy',
      }),
    ).rejects.toThrow(/requires a confirmed registered professional/)

    await expect(
      runHook('services', {
        _status: 'published',
        slug: 'bills-of-quantities-and-estimating',
        title: 'Bills of quantities and estimating',
      }),
    ).rejects.toThrow(/requires a confirmed registered professional/)

    // Passes when both registration fields are present
    await expect(
      runHook('services', {
        _status: 'published',
        slug: 'architecture-and-consultancy',
        title: 'Architecture and consultancy',
        registeredProfessionalName: 'Jane Mwangi',
        boraqsOrEbkRegNumber: 'BORAQS-A1234',
      }),
    ).resolves.toBeDefined()
  })

  it('blocks publishing projects without role or deliveringCompany', async () => {
    await expect(
      runHook('projects', {
        _status: 'published',
        title: 'The Black Perch Lounge',
        role: '',
        deliveringCompany: 'Shena Works Limited',
        verificationEvidenceNote: 'On file',
        gallery: [{ url: '1' }, { url: '2' }, { url: '3' }],
      }),
    ).rejects.toThrow(/Projects require Shena’s role, the delivering company/)
  })

  it('blocks publishing credentials without certificateFile and validUntil', async () => {
    await expect(
      runHook('credentials', {
        _status: 'published',
        name: 'NCA Road Works',
        validUntil: '2027-12-31',
      }),
    ).rejects.toThrow(/Credentials require an uploaded certificate PDF/)
  })

  it('blocks publishing testimonials without permissionFile and date', async () => {
    await expect(
      runHook('testimonials', {
        _status: 'published',
        person: 'Charles Imunde',
        title: 'Director',
        date: '2024-10',
      }),
    ).rejects.toThrow(/Testimonials require written permission on file/)
  })

  it('verifies all published seed records in src/seed/data.ts pass the publishing gate', async () => {
    for (const s of servicesSeed.filter((x) => x._status === 'published')) {
      await expect(
        runHook('services', s as unknown as Record<string, unknown>),
      ).resolves.toBeDefined()
    }
    for (const p of projectsSeed.filter((x) => x._status === 'published')) {
      await expect(
        runHook('projects', p as unknown as Record<string, unknown>),
      ).resolves.toBeDefined()
    }
    for (const m of machinesSeed.filter((x) => x._status === 'published')) {
      await expect(
        runHook('equipment', m as unknown as Record<string, unknown>),
      ).resolves.toBeDefined()
    }
    for (const l of locationsSeed.filter((x) => x._status === 'published')) {
      await expect(
        runHook('locations', l as unknown as Record<string, unknown>),
      ).resolves.toBeDefined()
    }
    for (const lp of legalPagesSeed) {
      await expect(
        runHook('legal-pages', { ...lp, _status: 'published' } as unknown as Record<string, unknown>),
      ).resolves.toBeDefined()
    }
    await expect(
      runHook('team', { ...teamSeed, _status: 'published' } as unknown as Record<string, unknown>),
    ).resolves.toBeDefined()
  })
})
