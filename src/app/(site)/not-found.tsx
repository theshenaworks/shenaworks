import React from 'react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <>
      <div className="ph-head">
        <div className="wrap">
          <p className="over">Error 404</p>
          <h1 className="h1">We can’t find that page</h1>
          <p className="lead">It may have moved when we rebuilt the site. Try one of these instead.</p>
        </div>
      </div>

      <section style={{ padding: '0 0 96px' }}>
        <div className="wrap">
          <ul className="links">
            <li>
              <Link href="/services">
                Services
                <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/projects">
                Projects
                <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/equipment">
                Equipment hire
                <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 12h16m-6-6 6 6-6 6"></path>
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                Contact
                <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </li>
          </ul>

          <Link className="btn pri" href="/">
            Go to the home page
          </Link>
        </div>
      </section>
    </>
  )
}
