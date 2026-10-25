'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'civic_theme'

export function ThemeProvider({ children }) {
  // 'system' | 'light' | 'dark'
  const [theme, setThemeState] = useState('system')
  const [resolvedTheme, setResolvedTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  // Apply theme to DOM
  const applyTheme = useCallback((targetTheme) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const isDark =
      targetTheme === 'dark' ||
      (targetTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    const resolved = isDark ? 'dark' : 'light'
    setResolvedTheme(resolved)

    if (isDark) {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    }

    // Keep meta color-scheme in sync
    const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]')
    if (colorSchemeMeta) {
      colorSchemeMeta.content = targetTheme === 'system' ? 'light dark' : resolved
    }

    // Update theme-color meta tag for mobile browsers (status bar, etc.)
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.content = isDark ? '#06080d' : '#f8fafc'
    }
  }, [])

  // Initial load & system preference listener
  useEffect(() => {
    let saved = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      // In case localStorage is blocked
    }

    const initial = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
    setThemeState(initial)
    applyTheme(initial)
    setMounted(true)

    // Listen to OS/device color scheme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = () => {
      // If user is using system mode, re-apply
      const currentStored = localStorage.getItem(STORAGE_KEY)
      if (!currentStored || currentStored === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)

    // Sync across browser tabs
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        const newTheme = e.newValue || 'system'
        setThemeState(newTheme)
        applyTheme(newTheme)
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [applyTheme])

  const setTheme = useCallback((newTheme) => {
    const validTheme = ['light', 'dark', 'system'].includes(newTheme) ? newTheme : 'system'
    setThemeState(validTheme)
    try {
      localStorage.setItem(STORAGE_KEY, validTheme)
    } catch {
      // localStorage error fallback
    }
    applyTheme(validTheme)
  }, [applyTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        isDark: resolvedTheme === 'dark',
        setTheme,
        mounted
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
