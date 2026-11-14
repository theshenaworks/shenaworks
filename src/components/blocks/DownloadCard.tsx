'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { trackEvent } from '@/lib/analytics'

export interface DownloadCardProps {
  title: string
  sizeMb: string
  href: string
}

export function DownloadCard({ title, sizeMb, href }: DownloadCardProps) {
  return (
    <div
      data-surface="subtle"
      className="bg-[var(--grey-100)] p-[3.2rem] lg:p-[4.0rem] flex flex-col justify-between gap-[2.0rem]"
    >
      <div>
        <p className="text-overline text-[var(--ink-600)] mb-[0.8rem]">Download</p>
        <h3 className="text-h4 text-[var(--ink-900)] mb-[0.4rem]">{title}</h3>
        <p className="text-body-xs text-[var(--ink-600)]">PDF, {sizeMb} MB</p>
      </div>
      <div>
        <Button
          href={href}
          variant="secondary"
          iconRight="download"
          onClick={() => trackEvent('file_download', { file_name: title })}
        >
          Download
        </Button>
      </div>
    </div>
  )
}
