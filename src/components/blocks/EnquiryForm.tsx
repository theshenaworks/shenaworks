'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { MessageBanner } from '@/components/ui/MessageBanner'
import { Icon } from '@/components/ui/Icon'
import { SectionIntro } from './SectionIntro'
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

const DEFAULT_LOCATIONS = [
  {
    slug: 'meru',
    town: 'Meru',
    address: 'Meru Town Yard, Meru County',
    directionsUrl: 'https://maps.google.com/?q=0.0463,37.6559',
  },
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
  id = 'enquiry',
  overline = 'Request a quote',
  heading = 'Tell us about your project',
  body,
  defaultType = 'project',
  defaultService = '',
  defaultEquipment = '',
  showSectionIntro = true,
  surface = 'subtle',
  showOfficesInAside = false,
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
  const { phoneE164, phoneDisplay, whatsappNumber, officeHours, responseTimeStatement } =
    activeContact
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

  const publishedServices = useMemo(
    () => services || DEFAULT_SERVICES,
    [services],
  )
  const equipmentCategories = useMemo(
    () => categories || DEFAULT_CATEGORIES,
    [categories],
  )
  const publishedMachines = useMemo(
    () => machines || [],
    [machines],
  )
  const publishedLocations = useMemo(
    () => locations || DEFAULT_LOCATIONS,
    [locations],
  )

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
    }
  }

  const errorEntries = Object.entries(errors)
  const whatsappUrl = buildWhatsAppUrl({ type: 'contact' }, whatsappNumber)

  const messageLabel =
    type === 'project'
      ? 'Tell us about the project'
      : type === 'hire'
        ? 'Anything we should know about the site or work?'
        : type === 'consultation'
          ? 'What do you need help with?'
          : 'Your message'

  const todayIso = new Date().toISOString().slice(0, 10)

  return (
    <section
      id={id}
      data-surface={surface === 'subtle' ? 'subtle' : undefined}
      className={`${
        surface === 'subtle' ? 'bg-[var(--grey-100)] border-t border-[var(--grey-300)]' : 'bg-[var(--white)]'
      } py-[6.4rem] lg:py-[8.0rem]`}
    >
      {showSectionIntro && (
        <SectionIntro overline={overline} heading={heading} body={body} />
      )}

      <div className="site-grid items-start">
        {/* Form column (col 2-9 at lg) */}
        <div className="col-span-4 lg:col-start-2 lg:col-span-9">
          {errorEntries.length > 0 && (
            <div ref={summaryRef} tabIndex={-1} className="mb-[3.2rem] outline-none">
              <MessageBanner
                variant="error"
                title={`Please fix ${errorEntries.length} ${
                  errorEntries.length === 1 ? 'thing' : 'things'
                } before sending`}
              >
                <ul className="mt-[0.8rem] list-disc pl-[2.0rem] space-y-[0.4rem]">
                  {errorEntries.map(([fieldKey, msg]) => (
                    <li key={fieldKey}>
                      <a
                        href={`#field-${fieldKey}`}
                        className="font-bold text-[var(--ink-900)] underline"
                      >
                        {msg}
                      </a>
                    </li>
                  ))}
                </ul>
              </MessageBanner>
            </div>
          )}

          {serverError && (
            <div className="mb-[3.2rem]">
              <MessageBanner variant="error" title="Unable to send enquiry">
                <p>{serverError}</p>
              </MessageBanner>
            </div>
          )}

          <form
            action="/api/enquiries"
            method="POST"
            encType="multipart/form-data"
            noValidate
            onFocus={handleFirstInteraction}
            onSubmit={handleSubmit}
            className="space-y-[2.4rem]"
          >
            <p className="text-body-xs text-[var(--ink-600)]">* required</p>

            {/* 1. Enquiry type radio group */}
            <fieldset className="border-0 p-0 m-0">
              <legend className="text-label text-[var(--ink-900)] mb-[1.2rem]">
                What can we help with? *
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.2rem]">
                {TYPE_OPTIONS.map((opt) => {
                  const checked = type === opt.value
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-[1.2rem] p-[1.6rem] border cursor-pointer transition-colors duration-200 ${
                        checked
                          ? 'bg-[var(--white)] border-2 border-[var(--ink-900)]'
                          : 'bg-[var(--white)] border-[var(--grey-500)] hover:border-[var(--ink-900)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={opt.value}
                        checked={checked}
                        onChange={() => setType(opt.value)}
                        className="mt-[0.3rem] h-[2.0rem] w-[2.0rem] accent-[var(--ink-900)] rounded-full shrink-0"
                      />
                      <span className="text-body-sm font-bold text-[var(--ink-900)]">
                        {opt.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {/* Row: Name & Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2.4rem]">
              <div>
                <label
                  htmlFor="field-name"
                  className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                >
                  Your name *
                </label>
                <input
                  id="field-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => validateSingleField('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  className="field-input"
                />
                {errors.name && (
                  <p id="error-name" className="mt-[0.6rem] text-body-xs text-[var(--error)]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-phone"
                  className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                >
                  Phone number *
                </label>
                <input
                  id="field-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => validateSingleField('phone')}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'error-phone help-phone' : 'help-phone'}
                  className="field-input"
                />
                <p id="help-phone" className="mt-[0.6rem] text-body-xs text-[var(--ink-600)]">
                  We&apos;ll call or WhatsApp you on this number.
                </p>
                {errors.phone && (
                  <p id="error-phone" className="mt-[0.4rem] text-body-xs text-[var(--error)]">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Row: Email & Organisation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2.4rem]">
              <div>
                <label
                  htmlFor="field-email"
                  className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                >
                  Email (optional)
                </label>
                <input
                  id="field-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateSingleField('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  className="field-input"
                />
                {errors.email && (
                  <p id="error-email" className="mt-[0.6rem] text-body-xs text-[var(--error)]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-organisation"
                  className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                >
                  Company or organisation (optional)
                </label>
                <input
                  id="field-organisation"
                  name="organisation"
                  type="text"
                  autoComplete="organization"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  className="field-input"
                />
              </div>
            </div>

            {/* Row: Service/Machine & Location */}
            {type !== 'other' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2.4rem]">
                {(type === 'project' || type === 'consultation') && (
                  <div>
                    <label
                      htmlFor="field-service"
                      className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                    >
                      Service *
                    </label>
                    <select
                      id="field-service"
                      name="service"
                      required
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      onBlur={() => validateSingleField('service')}
                      aria-invalid={Boolean(errors.service)}
                      aria-describedby={errors.service ? 'error-service' : undefined}
                      className="field-input"
                    >
                      <option value="">Choose a service</option>
                      {publishedServices.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.title}
                        </option>
                      ))}
                      <option value="tender-documents">Tender and procurement documents</option>
                      <option value="not-sure">Not sure yet</option>
                    </select>
                    {errors.service && (
                      <p id="error-service" className="mt-[0.6rem] text-body-xs text-[var(--error)]">
                        {errors.service}
                      </p>
                    )}
                  </div>
                )}

                {type === 'hire' && (
                  <div>
                    <label
                      htmlFor="field-equipment"
                      className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                    >
                      Machine *
                    </label>
                    <select
                      id="field-equipment"
                      name="equipment"
                      required
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      onBlur={() => validateSingleField('equipment')}
                      aria-invalid={Boolean(errors.equipment)}
                      aria-describedby={errors.equipment ? 'error-equipment' : undefined}
                      className="field-input"
                    >
                      <option value="">Choose a machine or type</option>
                      {equipmentCategories.map((cat) => (
                        <option key={`any-${cat.slug}`} value={`any-${cat.slug}`}>
                          Any {cat.singular}
                        </option>
                      ))}
                      {publishedMachines.map((m) => (
                        <option key={m.slug} value={m.slug}>
                          {m.name} ({m.make} {m.model})
                        </option>
                      ))}
                    </select>
                    {errors.equipment && (
                      <p
                        id="error-equipment"
                        className="mt-[0.6rem] text-body-xs text-[var(--error)]"
                      >
                        {errors.equipment}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="field-location"
                    className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                  >
                    Site location {type === 'project' || type === 'hire' ? '*' : '(optional)'}
                  </label>
                  <input
                    id="field-location"
                    name="location"
                    type="text"
                    required={type === 'project' || type === 'hire'}
                    autoComplete="address-level2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onBlur={() => validateSingleField('location')}
                    aria-invalid={Boolean(errors.location)}
                    aria-describedby={
                      errors.location ? 'error-location help-location' : 'help-location'
                    }
                    className="field-input"
                  />
                  <p id="help-location" className="mt-[0.6rem] text-body-xs text-[var(--ink-600)]">
                    Town, area or road, e.g. Makutano, Meru.
                  </p>
                  {errors.location && (
                    <p
                      id="error-location"
                      className="mt-[0.4rem] text-body-xs text-[var(--error)]"
                    >
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Row: Hire Start & Duration (only for hire) */}
            {type === 'hire' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2.4rem]">
                <div>
                  <label
                    htmlFor="field-hireStart"
                    className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                  >
                    Start date *
                  </label>
                  <input
                    id="field-hireStart"
                    name="hireStart"
                    type="date"
                    min={todayIso}
                    required
                    value={hireStart}
                    onChange={(e) => setHireStart(e.target.value)}
                    onBlur={() => validateSingleField('hireStart')}
                    aria-invalid={Boolean(errors.hireStart)}
                    aria-describedby={errors.hireStart ? 'error-hireStart' : undefined}
                    className="field-input"
                  />
                  {errors.hireStart && (
                    <p
                      id="error-hireStart"
                      className="mt-[0.6rem] text-body-xs text-[var(--error)]"
                    >
                      {errors.hireStart}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="field-hireDuration"
                    className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                  >
                    How long do you need it? *
                  </label>
                  <select
                    id="field-hireDuration"
                    name="hireDuration"
                    required
                    value={hireDuration}
                    onChange={(e) => setHireDuration(e.target.value)}
                    onBlur={() => validateSingleField('hireDuration')}
                    aria-invalid={Boolean(errors.hireDuration)}
                    aria-describedby={errors.hireDuration ? 'error-hireDuration' : undefined}
                    className="field-input"
                  >
                    <option value="">Choose duration</option>
                    {HIRE_DURATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {errors.hireDuration && (
                    <p
                      id="error-hireDuration"
                      className="mt-[0.6rem] text-body-xs text-[var(--error)]"
                    >
                      {errors.hireDuration}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Row: Budget & Timeline (only for project / consultation) */}
            {(type === 'project' || type === 'consultation') && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2.4rem]">
                <div>
                  <label
                    htmlFor="field-budgetBand"
                    className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                  >
                    Budget (optional)
                  </label>
                  <select
                    id="field-budgetBand"
                    name="budgetBand"
                    value={budgetBand}
                    onChange={(e) => setBudgetBand(e.target.value)}
                    className="field-input"
                  >
                    <option value="">Select budget band</option>
                    {BUDGET_BANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="field-timeline"
                    className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                  >
                    When do you want to start? (optional)
                  </label>
                  <select
                    id="field-timeline"
                    name="timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="field-input"
                  >
                    <option value="">Select timeline</option>
                    {TIMELINES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label
                htmlFor="field-message"
                className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
              >
                {messageLabel} {type !== 'hire' ? '*' : '(optional)'}
              </label>
              <textarea
                id="field-message"
                name="message"
                rows={4}
                required={type !== 'hire'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => validateSingleField('message')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'error-message help-message' : 'help-message'}
                className="field-input py-[1.2rem] min-h-[12.0rem]"
              />
              {type === 'project' && (
                <p id="help-message" className="mt-[0.6rem] text-body-xs text-[var(--ink-600)]">
                  Size, what&apos;s there now, and what you want at the end.
                </p>
              )}
              {errors.message && (
                <p id="error-message" className="mt-[0.4rem] text-body-xs text-[var(--error)]">
                  {errors.message}
                </p>
              )}
            </div>

            {/* File Attachments (for project, consultation, other) */}
            {type !== 'hire' && (
              <div>
                <label
                  htmlFor="field-files"
                  className="block text-label text-[var(--ink-900)] mb-[0.8rem]"
                >
                  Attach drawings, BoQ or photos (optional)
                </label>
                <input
                  id="field-files"
                  name="files"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  aria-describedby="help-files"
                  className="block w-full text-body-sm text-[var(--ink-900)] file:mr-[1.6rem] file:py-[1.0rem] file:px-[2.0rem] file:border file:border-[var(--ink-900)] file:bg-[var(--white)] file:text-label file:text-[var(--ink-900)] file:cursor-pointer"
                />
                <p id="help-files" className="mt-[0.6rem] text-body-xs text-[var(--ink-600)]">
                  Up to 3 files, 10 MB each. PDF, JPG, PNG or WEBP.
                </p>
              </div>
            )}

            {/* Consent Checkbox */}
            <div>
              <label
                htmlFor="field-consent"
                className="flex items-start gap-[1.2rem] cursor-pointer"
              >
                <input
                  id="field-consent"
                  name="consent"
                  type="checkbox"
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
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'error-consent' : undefined}
                  className="mt-[0.3rem] h-[2.0rem] w-[2.0rem] accent-[var(--ink-900)] rounded-none shrink-0"
                />
                <span className="text-body-sm text-[var(--ink-900)]">
                  I agree that Shena Works may use these details to respond to my enquiry, as
                  described in the{' '}
                  <a href="/privacy" className="font-bold underline">
                    privacy notice
                  </a>
                  . *
                </span>
              </label>
              {errors.consent && (
                <p id="error-consent" className="mt-[0.6rem] text-body-xs text-[var(--error)]">
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Honeypot field (hidden from assistive tech & users) */}
            <div aria-hidden="true" className="sr-only">
              <label htmlFor="field-company-website">Company website</label>
              <input
                id="field-company-website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            {/* Cloudflare Turnstile token */}
            {siteKey ? (
              <div className="my-[1.6rem]">
                <div ref={turnstileContainerRef} id="turnstile-widget" />
                <input
                  type="hidden"
                  name="cf-turnstile-response"
                  value={turnstileToken}
                />
                <noscript>
                  <div className="p-[1.6rem] bg-[var(--surface-warm)] border border-[var(--grey-300)] text-body">
                    <p className="font-bold text-[var(--ink-900)] mb-[0.8rem]">Security challenge requires JavaScript</p>
                    <p className="text-[var(--ink-700)] mb-[1.2rem]">
                      To send an enquiry online, please enable JavaScript, or reach our team directly:
                    </p>
                    <div className="flex flex-wrap gap-[1.2rem]">
                      <a href={`tel:${phoneE164}`} className="font-bold text-[var(--accent-500)] underline">
                        Call {phoneDisplay}
                      </a>
                      <a href={`https://wa.me/${whatsappNumber}`} className="font-bold text-[var(--accent-500)] underline">
                        Message on WhatsApp
                      </a>
                    </div>
                  </div>
                </noscript>
              </div>
            ) : (
              <input type="hidden" name="cf-turnstile-response" value="managed-pass" />
            )}

            <div>
              <Button type="submit" variant="primary" loading={submitting}>
                {type === 'hire' ? 'Send hire request' : 'Send enquiry'}
              </Button>
            </div>
          </form>
        </div>

        {/* Aside column (col 11-5 at lg) */}
        <aside
          data-surface="subtle"
          className="col-span-4 lg:col-start-11 lg:col-span-5 mt-[4.8rem] lg:mt-0 bg-[var(--grey-100)] border border-[var(--grey-300)] p-[3.2rem] lg:p-[4.0rem]"
        >
          <h3 className="text-h4 text-[var(--ink-900)] mb-[1.6rem]">Prefer to talk?</h3>
          <div className="flex flex-col gap-[1.2rem] mb-[2.4rem]">
            <Button
              href={`tel:${phoneE164}`}
              variant="secondary"
              className="w-full justify-center"
              onClick={() => trackEvent('call_click', { location: 'contact' })}
            >
              Call {phoneDisplay}
            </Button>
            <Button
              href={whatsappUrl}
              external
              variant="outline"
              className="w-full justify-center"
              onClick={() => trackEvent('whatsapp_click', { location: 'contact' })}
            >
              WhatsApp us
            </Button>
          </div>

          <p className="text-body mb-[0.8rem]">
            <a
              href={`mailto:${contactEmail}`}
              onClick={() => trackEvent('email_click', { location: 'contact' })}
              className="font-bold text-[var(--ink-900)] no-underline u-draw"
            >
              {contactEmail}
            </a>
          </p>

          {officeHours && (
            <p className="text-body-xs text-[var(--ink-600)] mb-[0.8rem]">{officeHours}</p>
          )}
          {responseTimeStatement && (
            <p className="text-body-xs text-[var(--ink-600)]">{responseTimeStatement}</p>
          )}

          {showOfficesInAside && publishedLocations.length > 0 && (
            <div className="mt-[2.4rem] pt-[2.4rem] border-t border-[var(--grey-300)]">
              <h4 className="text-h4 text-[var(--ink-900)] mb-[1.6rem]">Offices</h4>
              <div className="space-y-[1.6rem]">
                {publishedLocations.map((loc) => (
                  <div key={loc.slug}>
                    <p className="text-label text-[var(--ink-900)]">{loc.town}</p>
                    <p className="text-body-sm text-[var(--ink-600)] mb-[0.4rem]">{loc.address}</p>
                    <a
                      href={loc.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-[0.4rem] text-label text-[var(--ink-900)] no-underline u-draw"
                    >
                      <span>Get directions</span>
                      <Icon name="external-link" size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
