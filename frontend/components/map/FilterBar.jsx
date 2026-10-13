'use client'
import { CATEGORIES, STATUSES } from '@/lib/constants'
import { Locate } from 'lucide-react'
import { useTranslations } from '@/context/LocaleContext'

export default function FilterBar({ activeCategory, activeStatus, onCategoryChange, onStatusChange, onNearMe, nearMeLoading }) {
  const tMap = useTranslations('map')
  const tCategories = useTranslations('categories')
  const tStatuses = useTranslations('statuses')

  return (
    <div className="flex gap-4 ps-4 pe-4 py-2 overflow-x-auto scrollbar-hide border-b border-[#2a2d3e] bg-[#0f1117]/95 backdrop-blur-sm">
      {/* Category filters */}
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => onCategoryChange('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-[#3b82f6] text-white'
              : 'border border-[#2a2d3e] text-[#8b8fa8] hover:text-[#f0f0f0] hover:border-[#8b8fa8]'
          }`}
        >
          {tMap('filterAll', { defaultValue: 'All' })}
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat.value
                ? 'text-white'
                : 'border border-[#2a2d3e] text-[#8b8fa8] hover:text-[#f0f0f0] hover:border-[#8b8fa8]'
            }`}
            style={activeCategory === cat.value ? { backgroundColor: cat.color } : {}}
          >
            {tCategories(cat.value, { defaultValue: cat.label })}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px bg-[#2a2d3e] shrink-0" />

      {/* Status filters */}
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => onStatusChange('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
            activeStatus === 'all'
              ? 'bg-[#3b82f6] text-white'
              : 'border border-[#2a2d3e] text-[#8b8fa8] hover:text-[#f0f0f0] hover:border-[#8b8fa8]'
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
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                activeStatus === s.value
                  ? 'text-white'
                  : 'border border-[#2a2d3e] text-[#8b8fa8] hover:text-[#f0f0f0] hover:border-[#8b8fa8]'
              }`}
              style={activeStatus === s.value ? { backgroundColor: s.color } : {}}
            >
              {tStatuses(statusKey, { defaultValue: s.label })}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="w-px bg-[#2a2d3e] shrink-0" />

      {/* Near Me */}
      <button
        onClick={onNearMe}
        disabled={nearMeLoading}
        className="flex items-center gap-1 rounded-full border border-[#2a2d3e] px-3 py-1 text-xs font-medium text-[#8b8fa8] hover:text-[#f0f0f0] hover:border-[#8b8fa8] transition-colors whitespace-nowrap disabled:opacity-50 shrink-0"
      >
        <Locate className={`h-3 w-3 ${nearMeLoading ? 'animate-pulse' : ''}`} />
        {tMap('nearMe', { defaultValue: 'Near Me' })}
      </button>
    </div>
  )
}
