import React from 'react'

export interface ProseProps {
  heading?: string
  paragraphs?: string[]
  children?: React.ReactNode
  wide?: boolean
}

export function Prose({ heading, paragraphs = [], children, wide = false }: ProseProps) {
  return (
    <div className={wide ? 'w-full' : 'max-w-[75ch]'}>
      {heading && <h2 className="text-h2 text-[var(--ink-900)] mb-[2.0rem]">{heading}</h2>}
      <div className="space-y-[2.0rem] text-body text-[var(--ink-900)]">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
        {children}
      </div>
    </div>
  )
}
