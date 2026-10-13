import { Clock, Loader, CheckCircle } from 'lucide-react'
import { getStatusColor } from '@/lib/constants'

const statusIcons = {
  'pending': Clock,
  'in-progress': Loader,
  'resolved': CheckCircle
}

const statusLabels = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'resolved': 'Resolved'
}

export default function StatusBadge({ status, size = 'sm' }) {
  const Icon = statusIcons[status] || Clock
  const color = getStatusColor(status)
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses}`}
      style={{ backgroundColor: `${color}20`, color }}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {statusLabels[status] || status}
    </span>
  )
}
