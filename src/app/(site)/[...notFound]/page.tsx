import { notFound } from 'next/navigation'

/**
 * The app has two root layouts ((site) and (payload)), so there is no
 * app-level not-found boundary. Unmatched public URLs land here and render
 * `(site)/not-found.tsx` inside the site chrome.
 */
export default function CatchAllNotFound() {
  notFound()
}
