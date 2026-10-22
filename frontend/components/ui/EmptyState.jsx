import { SearchX, Sparkles } from 'lucide-react'
import Button from './Button'

export default function EmptyState({ icon: Icon = SearchX, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#58a6ff]/20 to-[#bc8cff]/20 blur-2xl" />
        <div className="relative p-5 rounded-2xl bg-[#161b22] border border-[#21262d]">
          <Icon className="h-12 w-12 text-[#7d8590]" strokeWidth={1.5} />
        </div>
      </div>
      <p className="text-[#7d8590] text-sm max-w-xs leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" className="mt-6" onClick={onAction}>
          <Sparkles className="h-3.5 w-3.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
