'use client'
import { Clock, Loader, CheckCircle } from 'lucide-react'
import { getStatusColor } from '@/lib/constants'
import { useTranslations } from '@/context/LocaleContext'

const statusIcons = {
  'pending': Clock,
  'in-progress': Loader,
  'resolved': CheckCircle
}

const statusDefaultLabels = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'resolved': 'Resolved'
}

export default function StatusBadge({ status, size = 'sm' }) {
  const t = useTranslations('statuses')
  const Icon = statusIcons[status] || Clock
  const color = getStatusColor(status)
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2.5 py-1' : 'text-xs px-3.5 py-1.5'

  const statusKey = status === 'in-progress' ? 'inProgress' : status
  const label = t(statusKey, { defaultValue: statusDefaultLabels[status] || status })

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider badge-glow ${sizeClasses}`}
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}25` }}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {label}
    </span>
  )
}
