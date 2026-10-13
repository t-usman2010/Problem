'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import enMessages from '@/messages/en.json'
import urMessages from '@/messages/ur.json'

const messagesMap = {
  en: enMessages,
  ur: urMessages
}

const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('civic_locale')
    const initial = saved === 'ur' ? 'ur' : (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en')
    setLocaleState(initial)
    const dir = initial === 'ur' ? 'rtl' : 'ltr'
    document.documentElement.lang = initial
    document.documentElement.dir = dir
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale) => {
    const target = newLocale === 'ur' ? 'ur' : 'en'
    setLocaleState(target)
    localStorage.setItem('civic_locale', target)
    document.documentElement.lang = target
    document.documentElement.dir = target === 'ur' ? 'rtl' : 'ltr'
  }, [])

  const t = useCallback((path, params = {}) => {
    const dict = messagesMap[locale] || messagesMap.en
    const keys = path.split('.')
    let val = dict

    for (const key of keys) {
      if (val && typeof val === 'object' && key in val) {
        val = val[key]
      } else {
        // Fallback to English
        let fallbackVal = messagesMap.en
        for (const fKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fKey in fallbackVal) {
            fallbackVal = fallbackVal[fKey]
          } else {
            fallbackVal = path
            break
          }
        }
        val = fallbackVal
        break
      }
    }

    if (typeof val === 'string') {
      let result = val
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal))
      }
      return result
    }

    return path
  }, [locale])

  const dir = locale === 'ur' ? 'rtl' : 'ltr'
  const isRTL = dir === 'rtl'

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dir, isRTL, t, mounted }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

export function useTranslations(namespace) {
  const { t } = useLocale()
  return useCallback((key, params) => {
    return t(namespace ? `${namespace}.${key}` : key, params)
  }, [t, namespace])
}
