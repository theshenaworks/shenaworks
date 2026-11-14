'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { trackEvent } from '@/lib/analytics'
import { formatPostDate } from '@/lib/format'
import type { PostCategoryRecord, PostRecord } from '@/types/content'

export interface InsightsCatalogClientProps {
  posts: PostRecord[]
  categories: PostCategoryRecord[]
  initialQuery?: string
  initialCategory?: string
  basePath?: string
  currentPage?: number
  pageSize?: number
}

export function InsightsCatalogClient({
  posts,
  categories,
  initialQuery = '',
  initialCategory = '',
  basePath = '/insights',
  currentPage = 1,
  pageSize = 12,
}: InsightsCatalogClientProps) {
  const [query, setQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  const catMap = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach((c) => map.set(c.slug, c.name))
    return map
  }, [categories])

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (selectedCategory && post.categorySlug !== selectedCategory) return false
      if (q) {
        const catName = (catMap.get(post.categorySlug) || '').toLowerCase()
        const haystack = `${post.title} ${post.excerpt} ${catName}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [posts, selectedCategory, query, catMap])

  const isFiltered = Boolean(query.trim() || selectedCategory)
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const visiblePosts = isFiltered
    ? filteredPosts
    : filteredPosts.slice((safePage - 1) * pageSize, safePage * pageSize)

  const syncUrl = (nextQuery: string, nextCategory: string) => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams()
    if (nextQuery.trim()) params.set('q', nextQuery.trim())
    if (nextCategory && basePath === '/insights') {
      params.set('category', nextCategory)
    }
    const qs = params.toString()
    const targetBase =
      basePath !== '/insights' && nextCategory !== initialCategory
        ? nextCategory
          ? `/insights/category/${nextCategory}`
          : '/insights'
        : basePath
    window.history.replaceState(null, '', qs ? `${targetBase}?${qs}` : targetBase)
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    syncUrl(value, selectedCategory)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    trackEvent('filter_use', { filter: 'insights_category', value: value || 'all' })
    syncUrl(query, value)
  }

  const handleReset = () => {
    setQuery('')
    setSelectedCategory('')
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/insights')
    }
  }

  const promoInsertIndex = Math.min(5, visiblePosts.length - 1)

  return (
    <div className="wrap">
      <form className="frow" id="ff" method="GET" action="/insights">
        <div>
          <label className="sr" htmlFor="q">
            Search articles
          </label>
          <div className="srch">
            <input
              id="q"
              name="q"
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search articles"
              aria-label="Search articles"
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        <div>
          <label className="sr" htmlFor="cat">
            Category
          </label>
          <div className="csel">
            <select
              id="cat"
              name="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        <button type="submit" className="btn sec js-hide">
          Filter
        </button>
      </form>

      <p className="xs" id="cnt" role="status" aria-live="polite" style={{ marginBottom: '24px' }}>
        {`Showing ${visiblePosts.length} of ${posts.length} article${posts.length === 1 ? '' : 's'}`}
      </p>

      {visiblePosts.length > 0 && (
        <div className="pgrid" id="pg">
          {visiblePosts.map((post, idx) => {
            const isFeatured = idx === 0 && !isFiltered && safePage === 1
            const catLabel = catMap.get(post.categorySlug) || post.categorySlug
            const formattedDate = formatPostDate(post.publishedAt)

            return (
              <React.Fragment key={post.slug}>
                <article className={isFeatured ? 'pc feat' : 'pc'}>
                  <div className="ph r169">
                    <Image
                      src={post.coverImage.url}
                      alt={post.coverImage.alt}
                      fill
                      sizes={
                        isFeatured
                          ? '(min-width: 1024px) 58vw, 100vw'
                          : '(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw'
                      }
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>
                  <div>
                    <p className="over">{catLabel}</p>
                    <h2 className="h4">
                      <Link href={`/insights/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="sm">{post.excerpt}</p>
                    <p className="xs">
                      {formattedDate && (
                        <>
                          <time dateTime={post.publishedAt}>{formattedDate}</time>
                          {' · '}
                        </>
                      )}
                      {`${post.readingTimeMinutes} min read`}
                    </p>
                  </div>
                </article>

                {idx === promoInsertIndex && (
                  <aside className="promo" id="promo" aria-label="Request a project quote">
                    <div>
                      <h2>Planning a road or building job?</h2>
                      <p>
                        Tell us what you are building, where the site is and when you want to start.
                      </p>
                      <Link className="btn pri" href="/contact?type=project">
                        Request a quote
                      </Link>
                    </div>
                  </aside>
                )}
              </React.Fragment>
            )
          })}
        </div>
      )}

      <div className="empty" id="em" hidden={visiblePosts.length > 0}>
        <p className="h3">No articles match</p>
        <p>Try clearing the search or choosing another category.</p>
        <button className="clear" type="button" id="clr" onClick={handleReset}>
          Clear filters
        </button>
      </div>

      {!isFiltered && totalPages > 1 && (
        <nav
          aria-label="Insights pagination"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--g300)',
            paddingTop: '32px',
            paddingBottom: '64px',
          }}
        >
          {safePage > 1 ? (
            <Link className="btn sec" href={`/insights?page=${safePage - 1}`}>
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="xs">{`Page ${safePage} of ${totalPages}`}</span>
          {safePage < totalPages ? (
            <Link className="btn sec" href={`/insights?page=${safePage + 1}`}>
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}
