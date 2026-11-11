'use client'

import React from 'react'

export interface ScrimProps {
  visible?: boolean
  onClick?: () => void
}

export function Scrim({ visible = true, onClick }: ScrimProps) {
  if (!visible) return null
  return <div className="scrim" onClick={onClick} aria-hidden="true" />
}
