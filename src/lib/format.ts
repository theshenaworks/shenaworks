export function formatPostDate(dateInput?: string | null): string {
  if (!dateInput) return ''
  const isoDay = dateInput.split('T')[0]
  const parsed = new Date(`${isoDay}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return isoDay
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}
