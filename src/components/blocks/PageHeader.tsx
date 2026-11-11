import React from 'react'
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/Breadcrumb'

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  overline: string
  headline: string
  lead?: string
  meta?: string
}

export function PageHeader({ breadcrumbs, overline, headline, lead, meta }: PageHeaderProps) {
  return (
    <section className="bg-[var(--white)] pt-[9.2rem] lg:pt-[20.8rem] pb-[4.0rem] lg:pb-[5.6rem] border-b border-[var(--grey-300)]">
      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-10">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-[1.6rem]">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
          <p className="text-overline text-[var(--ink-600)] mb-[1.2rem]">{overline}</p>
          <h1 className="text-h1 text-[var(--ink-900)]">{headline}</h1>
          {lead && (
            <p className="text-lead text-[var(--ink-600)] mt-[2.0rem] max-w-[62ch]">{lead}</p>
          )}
          {meta && <p className="text-body-xs text-[var(--ink-600)] mt-[1.6rem]">{meta}</p>}
        </div>
      </div>
    </section>
  )
}
