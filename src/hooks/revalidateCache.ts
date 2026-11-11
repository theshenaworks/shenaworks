import { revalidatePath } from 'next/cache'

export async function revalidateSiteCache({
  collection,
  doc,
}: {
  collection?: { slug: string }
  doc?: Record<string, any>
}) {
  try {
    revalidatePath('/', 'layout')
    if (collection?.slug && doc?.slug) {
      revalidatePath(`/${collection.slug}/${doc.slug}`)
    }
  } catch {
    // No-op when running outside Next.js request context (e.g. CLI seed script)
  }
  return doc
}
