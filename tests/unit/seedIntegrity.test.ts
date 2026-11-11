import { describe, expect, it } from 'vitest'
import {
  credentialsSeed,
  legalPagesSeed,
  locationsSeed,
  machinesSeed,
  postsSeed,
  projectsSeed,
  servicesSeed,
  siteSettingsSeed,
  testimonialsSeed,
} from '@/seed/data'

describe('Seed Integrity & Fleet Verification (AUD-20, D-08)', () => {
  it('ensures all machines are in draft status with CONTENT.md placeholders', () => {
    expect(machinesSeed.length).toBe(4)
    for (const machine of machinesSeed) {
      expect(machine._status).toBe('draft')
      expect(machine.make).toContain('[CONFIRM')
      expect(machine.model).toContain('[CONFIRM')
      expect(machine.capacity).toContain('[CONFIRM')
      // No invented brand names or series
      expect(machine.make).not.toBe('Heavy Duty')
      expect(machine.model).not.toBe('200-Series Tracked')
      expect(machine.model).not.toBe('140-Series Articulated')
    }
  })

  it('ensures gated services are unpublished (draft)', () => {
    const arch = servicesSeed.find((s) => s.slug === 'architecture-and-consultancy')
    const boq = servicesSeed.find((s) => s.slug === 'bills-of-quantities-and-estimating')
    expect(arch?._status).toBe('draft')
    expect(boq?._status).toBe('draft')
  })

  it('ensures public official (Kinoti) and Nairobi locations are draft', () => {
    const kinoti = testimonialsSeed.find((t) => t.isPublicOfficial)
    expect(kinoti?._status).toBe('draft')

    const nairobi = locationsSeed.find((l) => l.slug === 'nairobi')
    expect(nairobi?._status).toBe('draft')
  })

  it('ensures credentials and posts are draft', () => {
    for (const cred of credentialsSeed) {
      expect(cred._status).toBe('draft')
    }
    for (const post of postsSeed) {
      expect(post._status).toBe('draft')
    }
  })

  it('ensures proofItems are unverified and responseTimeStatement / companyProfile are null', () => {
    expect(siteSettingsSeed.proofItems.every((p) => p.verified === false)).toBe(true)
    expect(siteSettingsSeed.contact.responseTimeStatement).toBeNull()
    expect(siteSettingsSeed.files.companyProfile).toBeNull()
  })

  it('asserts that no published seed record contains [CONFIRM', () => {
    const allRecords = [
      ...servicesSeed,
      ...projectsSeed,
      ...machinesSeed,
      ...locationsSeed,
      ...credentialsSeed,
      ...testimonialsSeed,
      ...postsSeed,
      ...legalPagesSeed,
    ]

    const publishedConfirmViolations = allRecords.filter((rec) => {
      if (rec._status === 'published') {
        return JSON.stringify(rec).includes('[CONFIRM')
      }
      return false
    })

    expect(publishedConfirmViolations).toEqual([])
  })
})
