import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'accent' | 'dark' | 'error'
  children: React.ReactNode
  size?: 'sm' | 'md'
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: 'bg-[var(--grey-100)] text-[var(--ink-900)] border-[var(--grey-300)]',
    accent: 'bg-[var(--accent-500)] text-[var(--white)] border-[var(--accent-500)]',
    dark: 'bg-[var(--ink-900)] text-[var(--white)] border-[var(--ink-900)]',
    error: 'bg-[var(--error)] text-[var(--white)] border-[var(--error)]',
  }[variant]

  const sizeStyles = {
    sm: 'text-[1.1rem] px-[0.8rem] py-[0.2rem]',
    md: 'text-[1.2rem] px-[1.2rem] py-[0.4rem]',
  }[size]

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-[0.08em] border rounded-none ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
