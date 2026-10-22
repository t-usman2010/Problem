'use client'
import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, id, type = 'text', className = '', ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${inputId}-error`

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[#f0f6fc]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-xl border border-[#21262d] bg-[#0d1117] px-4 py-3 text-sm text-[#f0f6fc] placeholder-[#484f58] transition-all duration-200 input-glow focus:border-[#58a6ff]/50 focus:outline-none disabled:opacity-50 ${error ? 'border-[#f85149]/50 focus:border-[#f85149] focus:shadow-[0_0_0_3px_rgba(248,81,73,0.1)]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-[#f85149] flex items-center gap-1" role="alert">
          <span className="h-1 w-1 rounded-full bg-[#f85149] shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
