import React from 'react'
import { Card } from '@/components/ui/Card'
import { SectionIntro } from './SectionIntro'
import { formatPostDate } from '@/lib/format'
import type { PostCategoryRecord, PostRecord } from '@/types/content'

export interface InsightsRowProps {
  posts: PostRecord[]
  categories?: PostCategoryRecord[]
}

/**
 * SITE-PLAN.md 5.13 & 8:
 * Hide if fewer than 3 published posts.
 */
export function InsightsRow({ posts, categories = [] }: InsightsRowProps) {
  if (posts.length < 3) return null

  const categoryMap = new Map<string, string>()
  categories.forEach((c) => categoryMap.set(c.slug, c.name))

  return (
    <section className="insights-row bg-[var(--white)] py-[6.4rem] lg:py-[8.0rem] border-t border-[var(--grey-300)]">
      <SectionIntro
        overline="Insights"
        heading="Notes from site"
        actionLabel="All insights"
        actionHref="/insights"
      />

      <div className="site-grid">
        <div className="col-span-4 lg:col-start-2 lg:col-span-14 grid grid-cols-1 md:grid-cols-3 gap-[3.2rem]">
          {posts.slice(0, 3).map((post) => {
            const formattedDate = formatPostDate(post.publishedAt)
            return (
              <Card
                key={post.slug}
                href={`/insights/${post.slug}`}
                imageSrc={post.coverImage.url}
                imageAlt={post.coverImage.alt}
                aspectRatio="16:9"
                overline={categoryMap.get(post.categorySlug) || post.categorySlug}
                title={post.title}
                meta={
                  formattedDate
                    ? `${formattedDate} · ${post.readingTimeMinutes} min read`
                    : `${post.readingTimeMinutes} min read`
                }
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
