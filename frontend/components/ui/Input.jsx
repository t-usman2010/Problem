'use client'
import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, id, type = 'text', className = '', ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const errorId = `${inputId}-error`

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[#f0f0f0]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-lg border border-[#2a2d3e] bg-[#1a1d27] px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#8b8fa8] transition-colors focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 disabled:opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
