'use client'

import React from 'react'
import { useNavigation } from './NavigationContext'

export function Scrim() {
  const { closePanels, closeDrawer } = useNavigation()

  const handleClick = () => {
    closePanels()
    closeDrawer()
  }

  return <div className="scrim" id="sc" onClick={handleClick} aria-hidden="true" />
}
