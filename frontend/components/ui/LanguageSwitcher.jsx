'use client'

import { useLocale } from '@/context/LocaleContext'
import { Languages } from 'lucide-react'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ur' : 'en')
  }

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#2a2d3e] bg-[#1a1d27] hover:bg-[#2a2d3e]/50 text-xs font-medium text-[#f0f0f0] transition-colors"
      aria-label={locale === 'en' ? 'Switch to Urdu (اردو)' : 'Switch to English'}
      title={locale === 'en' ? 'اردو میں دیکھیں' : 'View in English'}
    >
      <Languages className="h-3.5 w-3.5 text-[#3b82f6]" />
      <span className={locale === 'ur' ? 'font-semibold text-[#3b82f6]' : ''}>
        {locale === 'en' ? 'اردو' : 'EN'}
      </span>
    </button>
  )
}
