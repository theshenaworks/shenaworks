'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { enquirySchema, type EnquiryType } from '@/lib/validation/enquiry'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'

const DEFAULT_SERVICES = [
  { slug: 'road-construction-and-earthworks', title: 'Road construction and earthworks' },
  { slug: 'cabro-paving', title: 'Cabro paving' },
  { slug: 'general-construction', title: 'General construction' },
  { slug: 'interior-design', title: 'Interior design' },
  { slug: 'project-management', title: 'Project management' },
]

const DEFAULT_CATEGORIES = [
  { slug: 'excavators', singular: 'excavator' },
  { slug: 'graders', singular: 'motor grader' },
  { slug: 'rollers', singular: 'roller' },
  { slug: 'bulldozers', singular: 'bulldozer' },
]

const DEFAULT_MACHINES: Array<{ slug: string; name: string; make?: string; model?: string }> = [
  { slug: 'crawler-excavator', name: 'Crawler Excavator' },
  { slug: 'motor-grader', name: 'Motor Grader' },
  { slug: 'vibratory-roller', name: 'Single-Drum Vibratory Roller' },
  { slug: 'crawler-bulldozer', name: 'Crawler Bulldozer' },
]

const DEFAULT_CONTACT = {
  phoneE164: '+254718971896',
  phoneDisplay: '+254 718 971 896',
  whatsappNumber: '254718971896',
  officeHours: 'Monday – Friday 8:00 am – 5:00 pm, Saturday 8:00 am – 1:00 pm',
  responseTimeStatement: 'We respond to all verified enquiries within one business day.',
}

export interface EnquiryFormProps {
  id?: string
  overline?: string
  heading?: string
  body?: string
  defaultType?: EnquiryType
  defaultService?: string
  defaultEquipment?: string
  showSectionIntro?: boolean
  surface?: 'subtle' | 'white'
  showOfficesInAside?: boolean
  services?: { slug: string; title: string }[]
  categories?: { slug: string; singular: string }[]
  machines?: { slug: string; name: string; make: string; model: string }[]
  locations?: { slug: string; town: string; address: string; directionsUrl: string }[]
  contact?: {
    phoneE164: string
    phoneDisplay: string
    whatsappNumber: string
    officeHours?: string
    responseTimeStatement?: string | null
  }
}

const TYPE_OPTIONS: { value: EnquiryType; label: string }[] = [
  { value: 'project', label: 'Build or renovate a project' },
  { value: 'hire', label: 'Hire equipment' },
  { value: 'consultation', label: 'Design, estimate or consultation' },
  { value: 'other', label: 'Something else (suppliers, subcontractors, jobs)' },
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

const HIRE_DURATIONS = [
  '1 day',
  '2–6 days',
  '1–2 weeks',
  '2–4 weeks',
  'More than a month',
  'Not sure',
]

export function EnquiryForm({
  id = 'cf',
  defaultType = 'project',
  defaultService = '',
  defaultEquipment = '',
  services,
  categories,
  machines,
  locations,
  contact,
}: EnquiryFormProps) {
  const [type, setType] = useState<EnquiryType>(defaultType)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [service, setService] = useState(defaultService)
  const [equipment, setEquipment] = useState(defaultEquipment)
  const [hireStart, setHireStart] = useState('')
  const [hireDuration, setHireDuration] = useState('')
  const [location, setLocation] = useState('')
  const [budgetBand, setBudgetBand] = useState('')
  const [timeline, setTimeline] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string>('')

  const activeContact = contact || DEFAULT_CONTACT
  const { phoneE164, phoneDisplay, whatsappNumber } = activeContact
  const contactEmail = 'shenaworksltd@gmail.com'

  const summaryRef = useRef<HTMLDivElement>(null)
  const startedAtRef = useRef<number>(Date.now())
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey || typeof window === 'undefined') return

    const renderWidget = () => {
      // @ts-expect-error Cloudflare Turnstile global
      if (window.turnstile && turnstileContainerRef.current) {
        try {
          // @ts-expect-error Cloudflare Turnstile global
          window.turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              setTurnstileToken(token)
            },
            'expired-callback': () => {
              setTurnstileToken('')
            },
            theme: 'light',
          })
        } catch {
          // ignore if already rendered
        }
      }
    }

    // @ts-expect-error Cloudflare Turnstile global
    if (window.turnstile) {
      renderWidget()
    } else {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.onload = renderWidget
      document.head.appendChild(script)
    }

    if (
      !turnstileToken &&
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '')
    ) {
      setTurnstileToken('managed-pass')
    }
  }, [siteKey, turnstileToken])

  const publishedServices = useMemo(() => services || DEFAULT_SERVICES, [services])
  const equipmentCategories = useMemo(() => categories || DEFAULT_CATEGORIES, [categories])
  const publishedMachines = useMemo(
    () => (machines && machines.length > 0 ? machines : DEFAULT_MACHINES),
    [machines],
  )
  const publishedLocations = useMemo(() => locations || [], [locations])

  const handleFirstInteraction = () => {
    if (!started) {
      setStarted(true)
      trackEvent('form_start', { form_preset: defaultType })
    }
  }

  const getFormPayload = () => ({
    type,
    name,
    phone,
    email,
    organisation,
    service: type === 'project' || type === 'consultation' ? service : '',
    equipment: type === 'hire' ? equipment : '',
    hireStart: type === 'hire' ? hireStart : '',
    hireDuration: type === 'hire' ? hireDuration : '',
    location: type !== 'other' ? location : '',
    budgetBand: type === 'project' || type === 'consultation' ? budgetBand : '',
    timeline: type === 'project' || type === 'consultation' ? timeline : '',
    message,
    consent: consent ? (true as const) : (false as unknown as true),
    company_website: '',
  })

  const validateSingleField = (fieldName: string) => {
    const parsed = enquirySchema.safeParse(getFormPayload())
    if (parsed.success) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[fieldName]
        return next
      })
      return
    }
    const issue = parsed.error.issues.find((i) => i.path[0] === fieldName)
    setErrors((prev) => {
      const next = { ...prev }
      if (issue) {
        next[fieldName] = issue.message
      } else {
        delete next[fieldName]
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError(null)

    const payload = getFormPayload()
    const parsed = enquirySchema.safeParse(payload)
    const nextErrors: Record<string, string> = {}

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const fieldKey = String(issue.path[0] ?? 'form')
        if (!nextErrors[fieldKey]) {
          nextErrors[fieldKey] = issue.message
        }
      }
    }

    if ((type === 'project' || type === 'consultation') && !payload.service) {
      nextErrors.service = 'Choose a service'
    }
    if (type === 'hire' && !payload.equipment) {
      nextErrors.equipment = 'Choose a machine'
    }
    if (type === 'hire' && !payload.hireStart) {
      nextErrors.hireStart = 'Choose a start date'
    }
    if (type === 'hire' && !payload.hireDuration) {
      nextErrors.hireDuration = 'Choose how long you need the machine'
    }
    if ((type === 'project' || type === 'hire') && !payload.location) {
      nextErrors.location = 'Enter the site location'
    }
    if (type !== 'hire' && !payload.message) {
      nextErrors.message = 'Tell us a little about the project'
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
      const formEl = e.currentTarget
      const formData = new FormData(formEl)
      formData.set('type', type)
      formData.set('consent', consent ? 'true' : 'false')
      formData.set('startedAt', String(startedAtRef.current))
      if (turnstileToken) {
        formData.set('cf-turnstile-response', turnstileToken)
      }
      if (typeof window !== 'undefined') {
        formData.set('sourcePage', window.location.pathname)
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
            `Your enquiry didn't send because of a problem on our side. Your details are still in the form. Please try again, or call ${phoneDisplay}.`,
        )
        setSubmitting(false)
        setTimeout(() => summaryRef.current?.focus(), 20)
        return
      }

      trackEvent(type === 'hire' ? 'hire_submit' : 'quote_submit', {
        enquiry_type: type,
        reference: data?.reference,
        service: service || undefined,
        equipment: equipment || undefined,
      })

      window.location.assign(data?.redirectUrl || `/thank-you?type=${type}`)
    } catch {
      setServerError(
        `Your enquiry didn't send because of a problem on our side. Your details are still in the form. Please try again, or call ${phoneDisplay}.`,
      )
      setSubmitting(false)
      setTimeout(() => summaryRef.current?.focus(), 20)
    }
  }

  const errorEntries = Object.entries(errors)
  const hasBanner = errorEntries.length > 0 || Boolean(serverError)
  const whatsappUrl = buildWhatsAppUrl({ type: 'contact' }, whatsappNumber)

  const messageLabel =
    type === 'project'
      ? 'Tell us about the project *'
      : type === 'hire'
        ? 'Anything we should know about the site or work?'
        : type === 'consultation'
          ? 'What do you need help with? *'
          : 'Your message *'

  const todayIso = new Date().toISOString().slice(0, 10)
  const isProjectOrConsultation = type === 'project' || type === 'consultation'
  const isHire = type === 'hire'
  const isOther = type === 'other'

  return (
    <div className="wrap cwrap">
      <form
        className="f"
        id={id}
        method="post"
        action="/api/enquiries"
        encType="multipart/form-data"
        noValidate
        aria-label="Enquiry form"
        onSubmit={handleSubmit}
        onFocus={handleFirstInteraction}
      >
        <div
          className="sum"
          id="sum"
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          hidden={!hasBanner}
        >
          <h2 id="st">
            {serverError
              ? 'We could not send your enquiry'
              : errorEntries.length > 0
                ? `Please fix ${errorEntries.length} ${
                    errorEntries.length === 1 ? 'thing' : 'things'
                  } before sending`
                : ''}
          </h2>
          {serverError ? (
            <p className="sm">{serverError}</p>
          ) : (
            <ul id="sl">
              {errorEntries.map(([fieldKey, msg]) => (
                <li key={fieldKey}>
                  <a href={`#field-${fieldKey}`}>{msg}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="help" style={{ margin: 0 }}>
          * required
        </p>

        <fieldset>
          <legend>What can we help with? *</legend>
          <div className="rcs">
            {TYPE_OPTIONS.map((opt) => (
              <label key={opt.value} className="rc">
                <input
                  type="radio"
                  name="type"
                  value={opt.value}
                  checked={type === opt.value}
                  onChange={() => {
                    setType(opt.value)
                    setErrors({})
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="hp" aria-hidden="true">
          <label>
            Company website
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <input type="hidden" name="sourcePage" value="/contact" />
        <input type="hidden" name="startedAt" value={String(startedAtRef.current)} />

        <div className="row2">
          <div className="fw">
            <label htmlFor="field-name">Your name *</label>
            <input
              id="field-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => validateSingleField('name')}
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'error-name' : undefined}
            />
            {errors.name && (
              <span className="err" id="error-name">
                {errors.name}
              </span>
            )}
          </div>
          <div className="fw">
            <label htmlFor="field-phone">Phone number *</label>
            <input
              id="field-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => validateSingleField('phone')}
              aria-invalid={errors.phone ? 'true' : undefined}
              aria-describedby={errors.phone ? 'phh error-phone' : 'phh'}
            />
            <p className="help" id="phh">
              We&apos;ll call or WhatsApp you on this number.
            </p>
            {errors.phone && (
              <span className="err" id="error-phone">
                {errors.phone}
              </span>
            )}
          </div>
        </div>

        <div className="row2">
          <div className="fw">
            <label htmlFor="field-email">Email (optional)</label>
            <input
              id="field-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateSingleField('email')}
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'error-email' : undefined}
            />
            {errors.email && (
              <span className="err" id="error-email">
                {errors.email}
              </span>
            )}
          </div>
          <div className="fw">
            <label htmlFor="field-organisation">Company or organisation (optional)</label>
            <input
              id="field-organisation"
              name="organisation"
              type="text"
              autoComplete="organization"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
            />
          </div>
        </div>

        <div className="row2" hidden={isOther}>
          <div className="fw" data-t="project consultation" hidden={!isProjectOrConsultation}>
            <label htmlFor="field-service">Service *</label>
            <select
              id="field-service"
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              onBlur={() => validateSingleField('service')}
              aria-invalid={errors.service ? 'true' : undefined}
              aria-describedby={errors.service ? 'error-service' : undefined}
            >
              <option value="">Choose a service</option>
              {publishedServices.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
              <option value="not-sure">Not sure yet</option>
            </select>
            {errors.service && (
              <span className="err" id="error-service">
                {errors.service}
              </span>
            )}
          </div>

          <div className="fw" data-t="hire" hidden={!isHire}>
            <label htmlFor="field-equipment">Machine *</label>
            <select
              id="field-equipment"
              name="equipment"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              onBlur={() => validateSingleField('equipment')}
              aria-invalid={errors.equipment ? 'true' : undefined}
              aria-describedby={errors.equipment ? 'error-equipment' : undefined}
            >
              <option value="">Choose a machine or type</option>
              {equipmentCategories.map((c) => {
                const singularLabel =
                  c.singular.toLowerCase().includes('grader')
                    ? 'motor grader'
                    : c.singular.toLowerCase().replace(/^a\s+|^an\s+/i, '')
                const anyValue =
                  c.slug === 'excavators'
                    ? 'any-excavator'
                    : c.slug === 'graders'
                      ? 'any-grader'
                      : c.slug === 'rollers'
                        ? 'any-roller'
                        : c.slug === 'bulldozers'
                          ? 'any-bulldozer'
                          : `any-${c.slug}`
                return (
                  <option key={anyValue} value={anyValue}>
                    Any {singularLabel}
                  </option>
                )
              })}
              {publishedMachines.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
            {errors.equipment && (
              <span className="err" id="error-equipment">
                {errors.equipment}
              </span>
            )}
          </div>

          <div className="fw" data-t="project hire consultation" hidden={isOther}>
            <label htmlFor="field-location">
              Site location {!isProjectOrConsultation || type === 'project' ? '*' : ''}
            </label>
            <input
              id="field-location"
              name="location"
              type="text"
              autoComplete="address-level2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => validateSingleField('location')}
              aria-invalid={errors.location ? 'true' : undefined}
              aria-describedby={errors.location ? 'lch error-location' : 'lch'}
            />
            <p className="help" id="lch">
              Town, area or road, e.g. Makutano, Meru.
            </p>
            {errors.location && (
              <span className="err" id="error-location">
                {errors.location}
              </span>
            )}
          </div>
        </div>

        <div className="row2" data-t="hire" hidden={!isHire}>
          <div className="fw">
            <label htmlFor="field-hireStart">Start date *</label>
            <input
              id="field-hireStart"
              name="hireStart"
              type="date"
              min={todayIso}
              value={hireStart}
              onChange={(e) => setHireStart(e.target.value)}
              onBlur={() => validateSingleField('hireStart')}
              aria-invalid={errors.hireStart ? 'true' : undefined}
              aria-describedby={errors.hireStart ? 'error-hireStart' : undefined}
            />
            {errors.hireStart && (
              <span className="err" id="error-hireStart">
                {errors.hireStart}
              </span>
            )}
          </div>
          <div className="fw">
            <label htmlFor="field-hireDuration">How long do you need it? *</label>
            <select
              id="field-hireDuration"
              name="hireDuration"
              value={hireDuration}
              onChange={(e) => setHireDuration(e.target.value)}
              onBlur={() => validateSingleField('hireDuration')}
              aria-invalid={errors.hireDuration ? 'true' : undefined}
              aria-describedby={errors.hireDuration ? 'error-hireDuration' : undefined}
            >
              <option value="">Choose a duration</option>
              {HIRE_DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.hireDuration && (
              <span className="err" id="error-hireDuration">
                {errors.hireDuration}
              </span>
            )}
          </div>
        </div>

        <div className="row2" data-t="project consultation" hidden={!isProjectOrConsultation}>
          <div className="fw">
            <label htmlFor="field-budgetBand">Budget</label>
            <select
              id="field-budgetBand"
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
          <div className="fw">
            <label htmlFor="field-timeline">When do you want to start?</label>
            <select
              id="field-timeline"
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

        <div className="fw">
          <label htmlFor="field-message" id="ml">
            {messageLabel}
          </label>
          <textarea
            id="field-message"
            name="message"
            maxLength={3000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => validateSingleField('message')}
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={errors.message ? 'mh error-message' : 'mh'}
          />
          <p className="help" id="mh">
            {type === 'hire'
              ? 'Access, ground conditions, wet or dry hire preference.'
              : 'Size, what’s there now, and what you want at the end.'}
          </p>
          {errors.message && (
            <span className="err" id="error-message">
              {errors.message}
            </span>
          )}
        </div>

        <div className="fw" data-t="project consultation other" hidden={isHire}>
          <label htmlFor="field-files">Attach drawings, BoQ or photos (optional)</label>
          <input
            id="field-files"
            name="files"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp"
          />
          <p className="help">Up to 3 files, 10 MB each. PDF, JPG, PNG or WEBP.</p>
        </div>

        <div>
          <div className="chk">
            <input
              type="checkbox"
              id="field-consent"
              name="consent"
              className="rounded-none"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked)
                if (e.target.checked) {
                  setErrors((prev) => {
                    const next = { ...prev }
                    delete next.consent
                    return next
                  })
                }
              }}
              aria-invalid={errors.consent ? 'true' : undefined}
              aria-describedby={errors.consent ? 'error-consent' : undefined}
            />
            <label htmlFor="field-consent">
              I agree that Shena Works may use these details to respond to my enquiry, as described
              in the <Link href="/privacy">privacy notice</Link>. *
            </label>
          </div>
          {errors.consent && (
            <span className="err" id="error-consent">
              {errors.consent}
            </span>
          )}
        </div>

        <noscript>
          <p className="help" style={{ border: '2px solid var(--g300)', padding: '12px 16px' }}>
            This form needs JavaScript to check you are not a robot. You can still call or WhatsApp{' '}
            {phoneDisplay} or email {contactEmail}.
          </p>
        </noscript>

        {siteKey && <div ref={turnstileContainerRef} />}

        <div>
          <button className="btn pri" type="submit" id="sb" aria-busy={submitting || undefined}>
            {submitting ? 'Sending...' : 'Send enquiry'}
          </button>
        </div>
      </form>

      <aside className="cside" aria-labelledby="pt-h">
        <h2 className="h4" id="pt-h">
          Prefer to talk?
        </h2>
        <a
          className="btn sec"
          href={`tel:${phoneE164}`}
          onClick={() => trackEvent('call_click', { location: 'contact_aside' })}
        >
          Call {phoneDisplay}
        </a>
        <a
          className="btn outl"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { location: 'contact_aside' })}
        >
          WhatsApp us
        </a>
        <a className="em" href={`mailto:${contactEmail}`}>
          {contactEmail}
        </a>
        <hr />
        <h2 className="h4">Offices</h2>
        {publishedLocations.length > 0 ? (
          publishedLocations.map((loc) => (
            <React.Fragment key={loc.slug}>
              <span className="lbl">{loc.town}</span>
              <p className="sm" style={{ marginBottom: '12px' }}>
                {loc.address || 'Headquarters and plant yard'}
              </p>
            </React.Fragment>
          ))
        ) : (
          <>
            <span className="lbl">Meru</span>
            <p className="sm">Headquarters and plant yard</p>
          </>
        )}
      </aside>
    </div>
  )
}
