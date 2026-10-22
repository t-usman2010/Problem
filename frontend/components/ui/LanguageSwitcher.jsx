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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#21262d] bg-[#161b22] hover:bg-[#1c2128] hover:border-[#30363d] text-xs font-medium text-[#f0f6fc] transition-all duration-200"
      aria-label={locale === 'en' ? 'Switch to Urdu (اردو)' : 'Switch to English'}
      title={locale === 'en' ? 'اردو میں دیکھیں' : 'View in English'}
    >
      <Languages className="h-3.5 w-3.5 text-[#58a6ff]" />
      <span className={locale === 'ur' ? 'font-semibold text-[#58a6ff]' : ''}>
        {locale === 'en' ? 'اردو' : 'EN'}
      </span>
    </button>
  )
}
