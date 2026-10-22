'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] mt-16 text-center px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-2xl bg-[#f85149]/20 blur-2xl" />
        <div className="relative p-5 rounded-2xl bg-[#161b22] border border-[#f85149]/20">
          <AlertTriangle className="h-12 w-12 text-[#f85149]" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-[#f0f6fc] mb-2">Something went wrong</h2>
      <p className="text-sm text-[#7d8590] mb-6 max-w-sm">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  )
}
