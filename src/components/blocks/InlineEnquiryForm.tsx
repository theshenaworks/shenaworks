'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { enquirySchema, type EnquiryType } from '@/lib/validation/enquiry'
import { trackEvent } from '@/lib/analytics'

const HIRE_DURATIONS = [
  '1 day',
  '2–6 days',
  '1–2 weeks',
  '2–4 weeks',
  'More than a month',
  'Not sure',
]

const BUDGET_BANDS = [
  'Under KES 1 million',
  'KES 1–5 million',
  'KES 5–20 million',
  'KES 20–50 million',
  'Over KES 50 million',
  'Not sure yet',
]

const TIMELINES = [
  'As soon as possible',
  'Within 3 months',
  '3–6 months',
  'Later than 6 months',
  'Just pricing for now',
]

export interface InlineEnquiryOption {
  value: string
  label: string
}

export interface InlineEnquiryFormProps {
  mode: 'hire' | 'project' | 'consultation'
  sourcePage: string
  defaultService?: string
  fixedService?: string
  serviceOptions?: InlineEnquiryOption[]
  defaultEquipment?: string
  equipmentOptions?: InlineEnquiryOption[]
  locationRequired?: boolean
  showFiles?: boolean
  messageLabel?: string
  messageHelp?: string
  submitLabel?: string
  phoneDisplay?: string
}

export function InlineEnquiryForm({
  mode,
  sourcePage,
  defaultService = '',
  fixedService,
  serviceOptions = [],
  defaultEquipment = '',
  equipmentOptions = [],
  locationRequired = mode !== 'consultation',
  showFiles = mode !== 'hire',
  messageLabel = mode === 'hire'
    ? 'Anything we should know about the site or work? (optional)'
    : mode === 'consultation'
      ? 'What do you need help with? *'
      : 'Tell us about the project *',
  messageHelp,
  submitLabel = mode === 'hire' ? 'Request hire' : 'Send enquiry',
  phoneDisplay = '+254 718 971 896',
}: InlineEnquiryFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [service, setService] = useState(fixedService || defaultService)
  const [equipment, setEquipment] = useState(defaultEquipment)
  const [location, setLocation] = useState('')
  const [hireStart, setHireStart] = useState('')
  const [hireDuration, setHireDuration] = useState('')
  const [budgetBand, setBudgetBand] = useState('')
  const [timeline, setTimeline] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const summaryRef = useRef<HTMLDivElement>(null)
  const startedAtRef = useRef<number>(Date.now())
  const todayIso = new Date().toISOString().slice(0, 10)
  const enquiryType: EnquiryType = mode

  const validateAndSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError(null)

    const payload = {
      type: enquiryType,
      name,
      phone,
      email,
      organisation,
      service: mode === 'hire' ? '' : fixedService || service,
      equipment: mode === 'hire' ? equipment : '',
      hireStart: mode === 'hire' ? hireStart : '',
      hireDuration: mode === 'hire' ? hireDuration : '',
      location,
      budgetBand: mode === 'hire' ? '' : budgetBand,
      timeline: mode === 'hire' ? '' : timeline,
      message,
      consent: consent ? (true as const) : (false as unknown as true),
      company_website: '',
    }

    const parsed = enquirySchema.safeParse(payload)
    const nextErrors: Record<string, string> = {}

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form')
        if (!nextErrors[key]) {
          nextErrors[key] = issue.message
        }
      }
    }

    if (mode !== 'hire' && !fixedService && !payload.service) {
      nextErrors.service = 'Choose a service'
    }
    if (mode === 'hire' && !payload.equipment) {
      nextErrors.equipment = 'Choose a machine'
    }
    if (mode === 'hire' && !payload.hireStart) {
      nextErrors.hireStart = 'Choose a start date'
    }
    if (mode === 'hire' && !payload.hireDuration) {
      nextErrors.hireDuration = 'Choose how long you need it'
    }
    if (locationRequired && !payload.location) {
      nextErrors.location = 'Enter the site location'
    }
    if (mode !== 'hire' && !payload.message) {
      nextErrors.message = 'Tell us what you need help with'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      trackEvent('form_error', {
        error_count: Object.keys(nextErrors).length,
        fields: Object.keys(nextErrors).join(','),
      })
      setTimeout(() => summaryRef.current?.focus(), 20)
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set('type', enquiryType)
      formData.set('consent', consent ? 'true' : 'false')
      formData.set('startedAt', String(startedAtRef.current))
      if (fixedService) {
        formData.set('service', fixedService)
      }

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setServerError(
          data?.error ||
            `Your enquiry didn't send. Your details are still in the form — please try again, or call ${phoneDisplay}.`,
        )
        setSubmitting(false)
        setTimeout(() => summaryRef.current?.focus(), 20)
        return
      }

      trackEvent(mode === 'hire' ? 'hire_submit' : 'quote_submit', {
        enquiry_type: enquiryType,
        reference: data?.reference,
        service: payload.service || undefined,
        equipment: payload.equipment || undefined,
      })

      window.location.assign(data?.redirectUrl || `/thank-you?type=${enquiryType}`)
    } catch {
      setServerError(
        `Your enquiry didn't send. Your details are still in the form — please try again, or call ${phoneDisplay}.`,
      )
      setSubmitting(false)
      setTimeout(() => summaryRef.current?.focus(), 20)
    }
  }

  const errorEntries = Object.entries(errors)
  const hasErrors = errorEntries.length > 0 || Boolean(serverError)

  return (
    <form
      className={mode === 'hire' ? 'form f' : 'f'}
      id={mode === 'hire' ? 'hf' : 'cf'}
      method="post"
      action="/api/enquiries"
      encType={showFiles ? 'multipart/form-data' : undefined}
      noValidate
      onSubmit={validateAndSubmit}
    >
      <div
        className="sum"
        id="sum"
        ref={summaryRef}
        role="alert"
        tabIndex={-1}
        hidden={!hasErrors}
      >
        <h3 id="st">
          {serverError ? 'Could not send enquiry' : 'Please fix these before sending'}
        </h3>
        {serverError ? (
          <p className="sm">{serverError}</p>
        ) : (
          <ul id="sl">
            {errorEntries.map(([fieldKey, msg]) => {
              const targetId =
                fieldKey === 'hireStart'
                  ? 'start'
                  : fieldKey === 'hireDuration'
                    ? 'dur'
                    : fieldKey === 'organisation'
                      ? 'org'
                      : fieldKey
              return (
                <li key={fieldKey}>
                  <a href={`#${targetId}`}>{msg}</a>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <p className="help" style={{ margin: 0 }}>
        * required
      </p>

      <input type="hidden" name="type" value={enquiryType} />
      {fixedService && <input type="hidden" name="service" value={fixedService} />}
      <input type="hidden" name="sourcePage" value={sourcePage} />

      <div className="hp" aria-hidden="true">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="row2">
        <div>
          <label htmlFor="name">Your name *</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? 'true' : undefined}
          />
          {errors.name && <span className="err">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="phone">Phone number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            aria-describedby="phh"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={errors.phone ? 'true' : undefined}
          />
          <p className="help" id="phh">
            We&apos;ll call or WhatsApp you on this number.
          </p>
          {errors.phone && <span className="err">{errors.phone}</span>}
        </div>
      </div>

      <div className="row2">
        <div>
          <label htmlFor="email">Email (optional)</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          {errors.email && <span className="err">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="org">Company or organisation (optional)</label>
          <input
            id="org"
            name="organisation"
            type="text"
            autoComplete="organization"
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
          />
        </div>
      </div>

      {mode === 'hire' ? (
        <>
          <div className="row2">
            <div>
              <label htmlFor="equipment">Machine *</label>
              <select
                id="equipment"
                name="equipment"
                required
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                aria-invalid={errors.equipment ? 'true' : undefined}
              >
                <option value="">Choose a machine or type</option>
                {equipmentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.equipment && <span className="err">{errors.equipment}</span>}
            </div>
            <div>
              <label htmlFor="location">Site location *</label>
              <input
                id="location"
                name="location"
                type="text"
                autoComplete="address-level2"
                required
                aria-describedby="lc-h"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-invalid={errors.location ? 'true' : undefined}
              />
              <p className="help" id="lc-h">
                Town, area or road, e.g. Makutano, Meru.
              </p>
              {errors.location && <span className="err">{errors.location}</span>}
            </div>
          </div>

          <div className="row2">
            <div>
              <label htmlFor="start">Start date *</label>
              <input
                id="start"
                name="hireStart"
                type="date"
                min={todayIso}
                required
                value={hireStart}
                onChange={(e) => setHireStart(e.target.value)}
                aria-invalid={errors.hireStart ? 'true' : undefined}
              />
              {errors.hireStart && <span className="err">{errors.hireStart}</span>}
            </div>
            <div>
              <label htmlFor="dur">How long do you need it? *</label>
              <select
                id="dur"
                name="hireDuration"
                required
                value={hireDuration}
                onChange={(e) => setHireDuration(e.target.value)}
                aria-invalid={errors.hireDuration ? 'true' : undefined}
              >
                <option value="">Choose a duration</option>
                {HIRE_DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.hireDuration && <span className="err">{errors.hireDuration}</span>}
            </div>
          </div>
        </>
      ) : (
        <>
          {fixedService ? (
            <div>
              <label htmlFor="location">Site location{locationRequired ? ' *' : ''}</label>
              <input
                id="location"
                name="location"
                type="text"
                autoComplete="address-level2"
                aria-describedby="lch"
                required={locationRequired}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-invalid={errors.location ? 'true' : undefined}
              />
              <p className="help" id="lch">
                Town, area or road, e.g. Makutano, Meru.
              </p>
              {errors.location && <span className="err">{errors.location}</span>}
            </div>
          ) : (
            <div className="row2">
              <div>
                <label htmlFor="service">Service *</label>
                <select
                  id="service"
                  name="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  aria-invalid={errors.service ? 'true' : undefined}
                >
                  <option value="">Choose a service</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.service && <span className="err">{errors.service}</span>}
              </div>
              <div>
                <label htmlFor="location">Site location{locationRequired ? ' *' : ''}</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  aria-invalid={errors.location ? 'true' : undefined}
                />
                {errors.location && <span className="err">{errors.location}</span>}
              </div>
            </div>
          )}

          <div className="row2">
            <div>
              <label htmlFor="budget">Budget</label>
              <select
                id="budget"
                name="budgetBand"
                value={budgetBand}
                onChange={(e) => setBudgetBand(e.target.value)}
              >
                <option value="">Choose a range</option>
                {BUDGET_BANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="timeline">When do you want to start?</label>
              <select
                id="timeline"
                name="timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              >
                <option value="">Choose a time</option>
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <div>
        <label htmlFor="message">{messageLabel}</label>
        <textarea
          id="message"
          name="message"
          maxLength={3000}
          aria-describedby={messageHelp ? 'mh' : undefined}
          required={mode !== 'hire'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={errors.message ? 'true' : undefined}
        />
        {messageHelp && (
          <p className="help" id="mh">
            {messageHelp}
          </p>
        )}
        {errors.message && <span className="err">{errors.message}</span>}
      </div>

      {showFiles && (
        <div>
          <label htmlFor="files">Attach drawings, BoQ or photos (optional)</label>
          <input
            id="files"
            name="files"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp"
          />
          <p className="help">Up to 3 files, 10 MB each. PDF, JPG, PNG or WEBP.</p>
        </div>
      )}

      <div>
        <div className="chk">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={errors.consent ? 'true' : undefined}
          />
          <label htmlFor="consent">
            I agree that Shena Works may use these details to respond to my enquiry, as described in
            the <Link href="/privacy">privacy notice</Link>. *
          </label>
        </div>
        {errors.consent && <span className="err">{errors.consent}</span>}
      </div>

      <div>
        <button className="btn pri" type="submit" id="sb" aria-busy={submitting || undefined}>
          {submitting ? 'Sending...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
