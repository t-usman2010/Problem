'use client'

import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useTranslations } from '@/context/LocaleContext'

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, mounted } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const tCommon = useTranslations('common')

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const options = [
    {
      id: 'system',
      label: tCommon('themeSystem', { defaultValue: 'System' }),
      description: tCommon('themeSystemDesc', { defaultValue: 'Follow device preference' }),
      icon: Monitor
    },
    {
      id: 'light',
      label: tCommon('themeLight', { defaultValue: 'Light' }),
      description: tCommon('themeLightDesc', { defaultValue: 'Crisp white theme' }),
      icon: Sun
    },
    {
      id: 'dark',
      label: tCommon('themeDark', { defaultValue: 'Dark' }),
      description: tCommon('themeDarkDesc', { defaultValue: 'Deep obsidian theme' }),
      icon: Moon
    }
  ]

  // If not yet mounted on client, render placeholder with same dimensions to avoid layout shift
  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-[#21262d] bg-[#161b22] opacity-60" aria-hidden="true" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={
          isDark
            ? tCommon('switchToLight', { defaultValue: 'Switch theme (currently Dark)' })
            : tCommon('switchToDark', { defaultValue: 'Switch theme (currently Light)' })
        }
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="relative flex h-9 items-center gap-1.5 px-2.5 rounded-xl border border-[#21262d] bg-[#161b22] hover:bg-[#1c2128] hover:border-[#30363d] text-[#f0f6fc] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
      >
        <div className="relative flex items-center justify-center">
          {isDark ? (
            <Moon className="h-4 w-4 text-[#58a6ff] transition-transform duration-300 hover:rotate-12" />
          ) : (
            <Sun className="h-4 w-4 text-[#d97706] transition-transform duration-300 hover:rotate-45" />
          )}

          {/* Tiny indicator dot if following system */}
          {theme === 'system' && (
            <span
              className="absolute -top-1 -end-1 h-1.5 w-1.5 rounded-full bg-[#39d2c0] ring-1 ring-[#06080d]"
              title="Following device theme"
            />
          )}
        </div>

        <span className="text-xs font-medium text-[#7d8590] hidden md:inline capitalize">
          {theme === 'system' ? 'Auto' : theme}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute end-0 mt-2 w-48 rounded-2xl border border-[#21262d] bg-[#0d1117]/95 backdrop-blur-xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 border-b border-[#21262d]/60 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7d8590]">
              Theme Preference
            </span>
          </div>

          {options.map(({ id, label, description, icon: Icon }) => {
            const isSelected = theme === id
            return (
              <button
                key={id}
                role="menuitem"
                type="button"
                onClick={() => {
                  setTheme(id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#58a6ff]/15 text-[#58a6ff]'
                    : 'text-[#f0f6fc] hover:bg-[#161b22] hover:text-[#f0f6fc]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`p-1 rounded-lg ${
                      isSelected
                        ? 'bg-[#58a6ff]/20 text-[#58a6ff]'
                        : 'bg-[#161b22] text-[#7d8590]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <div className="text-start truncate">
                    <span className="block font-medium">{label}</span>
                    <span className="block text-[10px] text-[#7d8590] truncate font-normal">
                      {description}
                    </span>
                  </div>
                </div>

                {isSelected && <Check className="h-3.5 w-3.5 text-[#58a6ff] shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
