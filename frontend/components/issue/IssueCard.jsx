import Link from 'next/link'
import { Heart, MapPin, Clock } from 'lucide-react'
import StatusBadge from './StatusBadge'
import CategoryIcon from './CategoryIcon'

function timeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

export default function IssueCard({ issue }) {
  return (
    <Link
      href={`/issue/${issue._id}`}
      className="block rounded-lg border border-[#2a2d3e] bg-[#1a1d27] p-4 hover:border-[#3b82f6]/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <CategoryIcon category={issue.category} />
            <StatusBadge status={issue.status} />
          </div>
          <h3 className="text-sm font-semibold text-[#f0f0f0] truncate">{issue.title}</h3>
          {issue.description && (
            <p className="text-xs text-[#8b8fa8] mt-1 line-clamp-2">{issue.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3 text-xs text-[#8b8fa8]">
            {issue.address && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                {issue.address}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(issue.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#8b8fa8] shrink-0">
          <Heart className="h-4 w-4" />
          <span className="text-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>{issue.upvotes || 0}</span>
        </div>
      </div>
    </Link>
  )
}
