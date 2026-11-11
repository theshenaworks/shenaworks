'use client'

import React from 'react'
import { DataTable, type TableColumn } from '@/components/ui/Table'
import { Icon } from '@/components/ui/Icon'
import { trackEvent } from '@/lib/analytics'
import type { CredentialRecord } from '@/types/content'

export interface CredentialTableProps {
  heading?: string
  credentials: CredentialRecord[]
}

export function CredentialTable({
  heading = 'Registrations and certificates',
  credentials,
}: CredentialTableProps) {
  if (credentials.length === 0) return null

  const columns: TableColumn<CredentialRecord>[] = [
    {
      key: 'name',
      header: 'Credential',
      render: (row) => row.name,
    },
    {
      key: 'issuer',
      header: 'Issued by',
      render: (row) => row.issuer,
    },
    {
      key: 'number',
      header: 'Number',
      render: (row) => row.number,
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => row.category,
    },
    {
      key: 'validUntil',
      header: 'Valid until',
      render: (row) => row.validUntil,
    },
    {
      key: 'certificate',
      header: 'Certificate',
      render: (row) =>
        row.certificateFileUrl ? (
          <a
            href={row.certificateFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('file_download', { file_name: row.name })}
            className="inline-flex items-center gap-[0.6rem] text-label text-[var(--ink-900)] no-underline u-draw"
          >
            <span>View certificate (PDF)</span>
            <Icon name="download" size={16} />
          </a>
        ) : (
          <span className="text-[var(--ink-600)]">On file</span>
        ),
    },
  ]

  return (
    <section className="bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem]">
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14">
          <h2 className="text-h2 text-[var(--ink-900)] mb-[3.2rem]">{heading}</h2>
          <DataTable
            caption="Shena Works Limited registrations and certificates"
            hideCaption
            columns={columns}
            rows={credentials}
            getRowKey={(row) => row.id}
            interactiveRows
          />
        </div>
      </div>
    </section>
  )
}
