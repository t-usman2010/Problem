'use client'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null

  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-[#d29922]/10 backdrop-blur-xl border-b border-[#d29922]/20 px-4 py-2.5 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-[#d29922] font-medium">
        <div className="p-1 rounded-lg bg-[#d29922]/10">
          <WifiOff className="h-3.5 w-3.5" />
        </div>
        <span>You&apos;re offline — showing last-loaded data</span>
      </div>
    </div>
  )
}
