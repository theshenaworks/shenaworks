'use client'

import React, { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

export interface ShareBarProps {
  title: string
  slug: string
}

export function ShareBar({ title, slug }: ShareBarProps) {
  const [statusMessage, setStatusMessage] = useState('')

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/insights/${slug}`
      : `https://shenaworksltd.com/insights/${slug}`

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl,
  )}`

  const showStatus = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(''), 3000)
  }

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        showStatus('Link copied')
        trackEvent('share', { method: 'copy_link', content_type: 'article', item_id: slug })
        return
      }
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand('copy')
      textarea.remove()
      showStatus(copied ? 'Link copied' : 'Copy failed')
      if (copied) {
        trackEvent('share', { method: 'copy_link', content_type: 'article', item_id: slug })
      }
    } catch {
      showStatus('Copy failed')
    }
  }

  return (
    <div className="share" id="share">
      <p className="xs">Share</p>
      <a
        id="wa"
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent('share', { method: 'whatsapp', content_type: 'article', item_id: slug })
        }
      >
        WhatsApp
      </a>
      <a
        id="li"
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent('share', { method: 'linkedin', content_type: 'article', item_id: slug })
        }
      >
        LinkedIn
      </a>
      <button type="button" id="cp" onClick={handleCopy}>
        Copy link
      </button>
      <span className="st" id="cs" role="status" aria-live="polite">
        {statusMessage}
      </span>
    </div>
  )
}
