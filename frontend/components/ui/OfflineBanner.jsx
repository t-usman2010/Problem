'use client'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null

  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-yellow-400">
        <WifiOff className="h-4 w-4" />
        <span>You&apos;re offline — showing last-loaded data</span>
      </div>
    </div>
  )
}
