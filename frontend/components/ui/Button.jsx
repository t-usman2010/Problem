'use client'
import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'btn-gradient text-white shadow-lg hover:shadow-[0_0_30px_rgba(88,166,255,0.2)]',
  secondary: 'bg-[#161b22] border border-[#21262d] hover:border-[#30363d] hover:bg-[#1c2128] text-[#f0f6fc]',
  danger: 'bg-[#f85149]/10 border border-[#f85149]/20 text-[#f85149] hover:bg-[#f85149]/20',
  ghost: 'hover:bg-[#161b22] text-[#7d8590] hover:text-[#f0f6fc]',
  success: 'bg-[#3fb950]/10 border border-[#3fb950]/20 text-[#3fb950] hover:bg-[#3fb950]/20'
}

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base'
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled = false, children, className = '', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40 focus:ring-offset-2 focus:ring-offset-[#06080d] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})

export default Button
