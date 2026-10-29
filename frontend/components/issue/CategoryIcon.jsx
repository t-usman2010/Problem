'use client'
import { Construction, Lightbulb, Trash2, Droplets, HelpCircle } from 'lucide-react'
import { getCategoryColor, CATEGORIES } from '@/lib/constants'
import { useTranslations } from '@/context/LocaleContext'

const categoryIcons = {
  pothole: Construction,
  streetlight: Lightbulb,
  garbage: Trash2,
  water: Droplets,
  other: HelpCircle
}

export default function CategoryIcon({ category, size = 'sm', showLabel = false }) {
  const t = useTranslations('categories')
  const Icon = categoryIcons[category] || HelpCircle
  const color = getCategoryColor(category)
  const defaultLabel = CATEGORIES.find(c => c.value === category)?.label || 'Other'
  const label = t(category, { defaultValue: defaultLabel })
  const sizeClasses = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <span className="inline-flex items-center gap-1.5">
      <div className="p-1 rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <Icon className={sizeClasses} style={{ color }} />
      </div>
      {showLabel && <span className="text-sm font-medium" style={{ color }}>{label}</span>}
    </span>
  )
}
