'use client'
import { CATEGORIES, STATUSES } from '@/lib/constants'
import { Locate, Sparkles } from 'lucide-react'
import { useTranslations } from '@/context/LocaleContext'

export default function FilterBar({ activeCategory, activeStatus, onCategoryChange, onStatusChange, onNearMe, nearMeLoading }) {
  const tMap = useTranslations('map')
  const tCategories = useTranslations('categories')
  const tStatuses = useTranslations('statuses')

  return (
    <div className="flex gap-4 ps-4 pe-4 py-3 overflow-x-auto scrollbar-hide border-b border-[#21262d]/60 bg-[#06080d]/90 backdrop-blur-xl">
      {/* Category filters */}
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => onCategoryChange('all')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-[#58a6ff] text-white shadow-[0_0_15px_rgba(88,166,255,0.3)]'
              : 'border border-[#21262d] text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#30363d] hover:bg-[#161b22]'
          }`}
        >
          {tMap('filterAll', { defaultValue: 'All' })}
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
              activeCategory === cat.value
                ? 'text-white'
                : 'border border-[#21262d] text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#30363d] hover:bg-[#161b22]'
            }`}
            style={activeCategory === cat.value ? { backgroundColor: cat.color, boxShadow: `0 0 15px ${cat.color}40` } : {}}
          >
            {tCategories(cat.value, { defaultValue: cat.label })}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px bg-gradient-to-b from-transparent via-[#21262d] to-transparent shrink-0" />

      {/* Status filters */}
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => onStatusChange('all')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
            activeStatus === 'all'
              ? 'bg-[#58a6ff] text-white shadow-[0_0_15px_rgba(88,166,255,0.3)]'
              : 'border border-[#21262d] text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#30363d] hover:bg-[#161b22]'
          }`}
        >
          {tMap('filterAll', { defaultValue: 'All' })}
        </button>
        {STATUSES.map(s => {
          const statusKey = s.value === 'in-progress' ? 'inProgress' : s.value
          return (
            <button
              key={s.value}
              onClick={() => onStatusChange(s.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                activeStatus === s.value
                  ? 'text-white'
                  : 'border border-[#21262d] text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#30363d] hover:bg-[#161b22]'
              }`}
              style={activeStatus === s.value ? { backgroundColor: s.color, boxShadow: `0 0 15px ${s.color}40` } : {}}
            >
              {tStatuses(statusKey, { defaultValue: s.label })}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="w-px bg-gradient-to-b from-transparent via-[#21262d] to-transparent shrink-0" />

      {/* Near Me */}
      <button
        onClick={onNearMe}
        disabled={nearMeLoading}
        className="flex items-center gap-1.5 rounded-full border border-[#21262d] px-4 py-1.5 text-xs font-semibold text-[#7d8590] hover:text-[#58a6ff] hover:border-[#58a6ff]/30 hover:bg-[#58a6ff]/5 transition-all duration-200 whitespace-nowrap disabled:opacity-50 shrink-0"
      >
        <Locate className={`h-3.5 w-3.5 ${nearMeLoading ? 'animate-pulse' : ''}`} />
        {tMap('nearMe', { defaultValue: 'Near Me' })}
      </button>
    </div>
  )
}
