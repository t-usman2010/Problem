'use client'

import Link from 'next/link'
import { Heart, MapPin, Clock, ArrowUpRight } from 'lucide-react'
import StatusBadge from './StatusBadge'
import CategoryIcon from './CategoryIcon'
import { useTranslations } from '@/context/LocaleContext'

function formatTimeAgo(dateString, tTime) {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return tTime ? tTime('justNow') : 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return tTime ? tTime('minutesAgo', { count: minutes }) : `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return tTime ? tTime('hoursAgo', { count: hours }) : `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return tTime ? tTime('daysAgo', { count: days }) : `${days}d ago`
  return date.toLocaleDateString()
}

export default function IssueCard({ issue }) {
  const tTime = useTranslations('time')

  return (
    <Link
      href={`/issue/${issue._id}`}
      className="group block rounded-2xl border border-[#21262d] bg-[#0d1117] p-4 sm:p-5 hover:border-[#58a6ff]/30 hover:bg-[#0d1117]/80 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(88,166,255,0.1)]"
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 sm:mb-2.5 flex-wrap">
            <CategoryIcon category={issue.category} />
            <StatusBadge status={issue.status} />
          </div>
          {/* User-generated title: dir="auto" ensures English sentences are ALWAYS aligned to the left */}
          <h3
            dir="auto"
            className="text-xs sm:text-sm font-semibold text-[#f0f6fc] truncate group-hover:text-[#58a6ff] transition-colors text-start [unicode-bidi:plaintext] user-content"
          >
            {issue.title}
          </h3>
          {issue.description && (
            <p
              dir="auto"
              className="text-[11px] sm:text-xs text-[#7d8590] mt-1.5 line-clamp-2 leading-relaxed text-start [unicode-bidi:plaintext] user-content"
            >
              {issue.description}
            </p>
          )}
          <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-3.5 text-[11px] sm:text-xs text-[#484f58] flex-wrap">
            {issue.address && (
              <span
                dir="auto"
                className="flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-xs text-start [unicode-bidi:plaintext] user-content"
              >
                <MapPin className="h-3 w-3 shrink-0 text-[#7d8590]" />
                <span className="truncate">{issue.address}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 shrink-0">
              <Clock className="h-3 w-3 text-[#7d8590]" />
              {formatTimeAgo(issue.createdAt, tTime)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-[#161b22] border border-[#21262d] text-[#7d8590]">
            <Heart className="h-3.5 w-3.5" />
            <span className="text-xs font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {issue.upvotes || 0}
            </span>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[#30363d] group-hover:text-[#58a6ff] transition-colors" />
        </div>
      </div>
    </Link>
  )
}
