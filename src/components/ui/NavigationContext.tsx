'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationContextValue {
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void
  closeDrawer: () => void
  openPanel: string | null
  setOpenPanel: (panel: string | null) => void
  closePanels: () => void
  isScrolled: boolean
  isHidden: boolean
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return ctx
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [openPanel, setOpenPanel] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const lastYRef = useRef(0)
  const isDrawerOpenRef = useRef(isDrawerOpen)
  const openPanelRef = useRef(openPanel)
  isDrawerOpenRef.current = isDrawerOpen
  openPanelRef.current = openPanel

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), [])
  const closePanels = useCallback(() => setOpenPanel(null), [])

  // Auto-close drawer and mega-panels on route change
  useEffect(() => {
    setIsDrawerOpen(false)
    setOpenPanel(null)
  }, [pathname])

  // Handle body scroll locking when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('lock')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.classList.remove('lock')
      document.body.style.overflow = ''
    }
    return () => {
      document.body.classList.remove('lock')
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  // Handle body class 'mm' and 'open' header state when desktop mega panel is open
  useEffect(() => {
    if (openPanel) {
      document.body.classList.add('mm')
    } else {
      document.body.classList.remove('mm')
    }
    return () => {
      document.body.classList.remove('mm')
    }
  }, [openPanel])

  // Header scroll detection: consistently transparent at top until scroll (or drawer open)
  useEffect(() => {
    lastYRef.current = window.scrollY

    const syncHeaderState = (fromScrollEvent: boolean) => {
      const y = window.scrollY

      if (fromScrollEvent && openPanelRef.current) {
        setOpenPanel(null)
      }

      if (y > 10 || isDrawerOpenRef.current) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      if (y > lastYRef.current && y > 160 && !isDrawerOpenRef.current && !openPanelRef.current) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }

      lastYRef.current = y
    }

    const onScroll = () => syncHeaderState(true)
    window.addEventListener('scroll', onScroll, { passive: true })
    syncHeaderState(false)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [pathname])

  // Re-sync solid/hidden state cleanly when drawer or mega-panel toggles without resetting scroll baseline
  useEffect(() => {
    const y = window.scrollY
    setIsScrolled(y > 10 || isDrawerOpen)
    if (isDrawerOpen || openPanel) {
      setIsHidden(false)
    }
  }, [isDrawerOpen, openPanel])

  // Global keydown (Escape closes panels and drawer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openPanel) setOpenPanel(null)
        if (isDrawerOpen) setIsDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openPanel, isDrawerOpen])

  // Header white flag for pages without hero
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero')
    if (!hero) {
      document.body.classList.add('hw')
    } else {
      document.body.classList.remove('hw')
    }
    return () => {
      document.body.classList.remove('hw')
    }
  }, [pathname])

  return (
    <NavigationContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        closeDrawer,
        openPanel,
        setOpenPanel,
        closePanels,
        isScrolled,
        isHidden,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
