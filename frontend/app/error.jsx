'use client'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('App error boundary caught error:', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-56px)] mt-14 flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-red-500/10 p-4 mb-4 text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold text-[#f0f0f0] mb-2">Something went wrong!</h2>
      <p className="text-sm text-[#8b8fa8] max-w-md mb-6">
        An unexpected error occurred while loading this page. You can try refreshing or returning to the map.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" onClick={() => reset()}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Button variant="secondary" onClick={() => window.location.href = '/map'}>
          Back to Map
        </Button>
      </div>
    </div>
  )
}
