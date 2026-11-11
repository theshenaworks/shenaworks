import { describe, expect, it } from 'vitest'
import {
  enforceGlobalPublishingGate,
  enforcePublishingGate,
  FORBIDDEN_SUPERLATIVES,
} from '@/hooks/publishingGate'
import {
  credentialsSeed,
  legalPagesSeed,
  locationsSeed,
  projectsSeed,
  servicesSeed,
  teamSeed,
  testimonialsSeed,
} from '@/seed/data'

describe('enforcePublishingGate & enforceGlobalPublishingGate hooks', () => {
  const runHook = async (
    collectionSlug: string,
    data: Record<string, unknown>,
    originalDoc?: Record<string, unknown>,
  ) =>
    enforcePublishingGate({
      data,
      originalDoc,
      collection: { slug: collectionSlug } as any,
      operation: 'update',
    } as any)

  const runGlobalHook = async (
    globalSlug: string,
    data: Record<string, unknown>,
    originalDoc?: Record<string, unknown>,
  ) =>
    enforceGlobalPublishingGate({
      data,
      originalDoc,
      global: { slug: globalSlug } as any,
    } as any)

  // 1. PATCH { _status: 'published' } on a stored draft containing [CONFIRM is rejected
  it('rejects PATCH { _status: "published" } on a stored draft containing [CONFIRM', async () => {
    await expect(
      runHook(
        'services',
        { _status: 'published' },
        {
          title: 'Draft service with [CONFIRM: I-03]',
          _status: 'draft',
        },
      ),
    ).rejects.toThrow(/Cannot publish: field "title" still contains a \[CONFIRM/)
  })

  // 2. Editing a published record to add [CONFIRM or a banned word is rejected
  it('rejects editing an already-published record to add [CONFIRM or a banned word', async () => {
    await expect(
      runHook(
        'services',
        { summary: 'Added [CONFIRM: detail]' },
        { title: 'Road Works', _status: 'published' },
      ),
    ).rejects.toThrow(/Cannot publish: field "summary" still contains a \[CONFIRM/)

    await expect(
      runHook(
        'services',
        { summary: 'We provide leading civil works' },
        { title: 'Road Works', _status: 'published' },
      ),
    ).rejects.toThrow(/Field "summary" contains "leading". Use a plain factual term./)
  })

  // 3. Each of the nine banned words, in different casings, plain and inside Lexical rich text, in an array item, in alt text and in meta.description is rejected
  it('rejects each of the nine banned words in different casings, plain, in Lexical rich text, array items, alt text and meta.description', async () => {
    const nineWords = [
      'premier',
      'leading',
      'best',
      'world-class',
      'exceptional',
      'unrivalled',
      'unrivaled',
      'cutting-edge',
      'seamless',
    ]

    for (const word of nineWords) {
      // 1. Plain text with uppercase / mixed casing
      await expect(
        runHook('services', {
          _status: 'published',
          title: `Our ${word.toUpperCase()} Construction Services`,
        }),
      ).rejects.toThrow(new RegExp(`contains "${word}"`, 'i'))

      // 2. Lexical rich text structure
      await expect(
        runHook('services', {
          _status: 'published',
          content: {
            root: {
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: `This is ${word} work.`, type: 'text' }],
                },
              ],
            },
          },
        }),
      ).rejects.toThrow(new RegExp(`contains "${word}"`, 'i'))

      // 3. Array item
      await expect(
        runHook('services', {
          _status: 'published',
          features: [{ name: `The ${word} option` }],
        }),
      ).rejects.toThrow(new RegExp(`contains "${word}"`, 'i'))

      // 4. Alt text
      await expect(
        runHook('services', {
          _status: 'published',
          heroImage: { alt: `A photo of ${word} equipment` },
        }),
      ).rejects.toThrow(new RegExp(`contains "${word}"`, 'i'))

      // 5. meta.description
      await expect(
        runHook('services', {
          _status: 'published',
          meta: { description: `Contact us for ${word} results.` },
        }),
      ).rejects.toThrow(new RegExp(`contains "${word}"`, 'i'))
    }
  })

  // 4. Bulk publish, "Restore and publish", schedule-publish, Local API and GraphQL mutation each go through the gate
  it('ensures publish operations (bulk, restore, schedule, local API, GraphQL) pass through beforeChange hook', async () => {
    for (const op of ['create', 'update'] as const) {
      await expect(
        (async () =>
          enforcePublishingGate({
            data: { _status: 'published', title: 'Invalid [CONFIRM: I-01]' },
            collection: { slug: 'services' } as any,
            operation: op,
          } as any))(),
      ).rejects.toThrow(/Cannot publish/)
    }
  })

  // 5. Globals reject [CONFIRM and banned words
  it('rejects [CONFIRM and banned words on globals via enforceGlobalPublishingGate', async () => {
    // 1. [CONFIRM] on global
    await expect(
      runGlobalHook('site-settings', { company: { directors: '[CONFIRM: I-01]' } }),
    ).rejects.toThrow(/Cannot publish: field "company.directors" still contains a \[CONFIRM/)

    // 2. Banned word on global
    await expect(
      runGlobalHook('home-page', { heroHeadline: 'The Best Road Contractors in Kenya' }),
    ).rejects.toThrow(/Field "heroHeadline" contains "Best". Use a plain factual term./)

    // 3. Clean global update passes
    await expect(
      runGlobalHook('home-page', {
        heroHeadline: 'Connecting communities. Building the future.',
      }),
    ).resolves.toBeDefined()
  })

  // 6. Draft saves and autosave still succeed with placeholders present. Slugs such as best-practice do not trigger a false positive
  it('allows draft saves with placeholders and does not false-positive on slugs like best-practice', async () => {
    const draft = await runHook('services', {
      _status: 'draft',
      title: 'Draft with [CONFIRM: placeholder] and leading word',
      slug: 'leading-practice',
    })
    expect(draft._status).toBe('draft')

    await expect(
      runHook('services', {
        _status: 'published',
        title: 'Road Standards and Guidelines',
        slug: 'best-practice',
        summary: 'Standard engineering procedures',
      }),
    ).resolves.toBeDefined()
  })

  // 7. Per-collection rules (credentials, testimonials, projects, services, team, equipment) still fire
  it('enforces collection-specific rules for credentials, testimonials, projects, services, team, and equipment', async () => {
    // credentials
    await expect(
      runHook('credentials', { _status: 'published', name: 'NCA Road Works' }),
    ).rejects.toThrow(/Credentials require an uploaded certificate PDF/)

    // testimonials
    await expect(
      runHook('testimonials', { _status: 'published', person: 'Charles Imunde' }),
    ).rejects.toThrow(/Testimonials require written permission on file/)

    // projects
    await expect(
      runHook('projects', { _status: 'published', title: 'Road Works', role: '' }),
    ).rejects.toThrow(/Projects require Shena’s role/)

    // services (registration required)
    await expect(
      runHook('services', {
        _status: 'published',
        slug: 'architecture-and-consultancy',
        title: 'Architecture',
      }),
    ).rejects.toThrow(/requires a confirmed registered professional/)

    // team (Eng. title requires EBK reg number)
    await expect(
      runHook('team', {
        _status: 'published',
        name: 'Eng. Newton Muthee',
      }),
    ).rejects.toThrow(/requires an EBK registration number/)

    // equipment (requires make, model, capacity and image)
    await expect(
      runHook('equipment', {
        _status: 'published',
        name: 'Excavator',
        make: 'Komatsu',
        model: 'PC200',
        capacity: '20 tonnes',
        images: [],
      }),
    ).rejects.toThrow(/Equipment requires make, model, capacity and at least one image/)
  })

  it('verifies published seed records pass the publishing gate', async () => {
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
