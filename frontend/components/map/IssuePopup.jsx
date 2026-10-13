'use client'
import { Popup } from 'react-leaflet'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { getCategoryColor, CATEGORIES } from '@/lib/constants'
import StatusBadge from '@/components/issue/StatusBadge'

export default function IssuePopup({ issue }) {
  const color = getCategoryColor(issue.category)
  const categoryLabel = CATEGORIES.find(c => c.value === issue.category)?.label || 'Other'

  return (
    <Popup className="custom-popup">
      <div className="min-w-[220px] max-w-[280px]">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-medium" style={{ color }}>{categoryLabel}</span>
        </div>
        <h3 className="text-sm font-semibold text-[#f0f0f0] mb-2 line-clamp-2">{issue.title}</h3>
        <div className="flex items-center justify-between">
          <StatusBadge status={issue.status} />
          <span className="flex items-center gap-1 text-xs text-[#8b8fa8]">
            <Heart className="h-3 w-3" />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{issue.upvotes || 0}</span>
          </span>
        </div>
        <Link
          href={`/issue/${issue._id}`}
          className="flex items-center justify-center gap-1 mt-3 text-xs font-medium text-[#3b82f6] hover:text-blue-400 transition-colors"
        >
          View details
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </Popup>
  )
}
