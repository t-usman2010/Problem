'use client'
import { Popup } from 'react-leaflet'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { getCategoryColor, CATEGORIES } from '@/lib/constants'
import StatusBadge from '@/components/issue/StatusBadge'
import { useTranslations } from '@/context/LocaleContext'

export default function IssuePopup({ issue }) {
  const tCat = useTranslations('categories')
  const tIssue = useTranslations('issue')
  const color = getCategoryColor(issue.category)
  const defaultLabel = CATEGORIES.find(c => c.value === issue.category)?.label || 'Other'
  const categoryLabel = tCat(issue.category, { defaultValue: defaultLabel })

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
        <h3
          dir="auto"
          className="text-sm font-bold text-[#f0f6fc] mb-2.5 line-clamp-2 text-start [unicode-bidi:plaintext] user-content"
        >
          {issue.title}
        </h3>
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
          {tIssue('viewDetails', { defaultValue: 'View details' })}
          <ArrowRight className="h-3 w-3 rtl:rotate-180" />
        </Link>
      </div>
    </Popup>
  )
}
