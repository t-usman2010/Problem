import { SearchX } from 'lucide-react'
import Button from './Button'

export default function EmptyState({ icon: Icon = SearchX, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Icon className="h-16 w-16 text-[#8b8fa8] mb-4" strokeWidth={1} />
      <p className="text-[#8b8fa8] text-sm max-w-xs">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
