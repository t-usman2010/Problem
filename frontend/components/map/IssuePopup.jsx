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
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
          />
          <span className="text-xs font-semibold" style={{ color }}>{categoryLabel}</span>
        </div>
        <h3 className="text-sm font-bold text-[#f0f6fc] mb-2.5 line-clamp-2">{issue.title}</h3>
        <div className="flex items-center justify-between">
          <StatusBadge status={issue.status} />
          <span className="flex items-center gap-1.5 text-xs text-[#7d8590] px-2 py-1 rounded-lg bg-[#161b22]">
            <Heart className="h-3 w-3" />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{issue.upvotes || 0}</span>
          </span>
        </div>
        <Link
          href={`/issue/${issue._id}`}
          className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-[#21262d] text-xs font-semibold text-[#58a6ff] hover:text-[#79b8ff] transition-colors"
        >
          View details
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </Popup>
  )
}
