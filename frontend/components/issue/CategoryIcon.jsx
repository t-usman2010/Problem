import { Construction, Lightbulb, Trash2, Droplets, HelpCircle } from 'lucide-react'
import { getCategoryColor, CATEGORIES } from '@/lib/constants'

const categoryIcons = {
  pothole: Construction,
  streetlight: Lightbulb,
  garbage: Trash2,
  water: Droplets,
  other: HelpCircle
}

export default function CategoryIcon({ category, size = 'sm', showLabel = false }) {
  const Icon = categoryIcons[category] || HelpCircle
  const color = getCategoryColor(category)
  const label = CATEGORIES.find(c => c.value === category)?.label || 'Other'
  const sizeClasses = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className={sizeClasses} style={{ color }} />
      {showLabel && <span className="text-sm" style={{ color }}>{label}</span>}
    </span>
  )
}
