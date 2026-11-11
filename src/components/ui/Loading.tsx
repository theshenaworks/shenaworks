import React from 'react'

export interface SpinnerProps {
  size?: 16 | 24 | 32 | 40
  className?: string
  label?: string
}

export function Spinner({ size = 24, className = '', label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin ${className}`}
      style={{
        width: `${size / 10}rem`,
        height: `${size / 10}rem`,
        animationDuration: '800ms',
      }}
    >
      <span className="sr-only">{label}</span>
    </span>
  )
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-[var(--grey-100)] animate-pulse rounded-none ${className}`}
      style={{ animationDuration: '1.2s' }}
      {...props}
    />
  )
}

export interface ProgressBarProps {
  value: number // 0 to 100
  label?: string
  className?: string
}

export function ProgressBar({ value, label = 'Progress', className = '' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full h-[0.2rem] bg-[var(--grey-300)] overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-[var(--accent-500)] transition-[width] duration-200 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export function FullViewLoading({ label = 'Loading content' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,23,23,0.5)] backdrop-blur-sm"
    >
      <div className="w-[4.8rem] h-[4.8rem] bg-[var(--ink-900)] flex items-center justify-center shadow-[var(--shadow-2)]">
        <Spinner size={24} className="text-[var(--white)]" label={label} />
      </div>
    </div>
  )
}
