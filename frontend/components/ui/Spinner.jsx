export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-2 border-[#21262d]`} />
        <div className={`absolute inset-0 ${sizes[size]} animate-spin rounded-full border-2 border-transparent border-t-[#58a6ff] border-r-[#bc8cff]`} />
      </div>
    </div>
  )
}
