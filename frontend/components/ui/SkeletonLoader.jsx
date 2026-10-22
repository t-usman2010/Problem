export function Skeleton({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-[#161b22] ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#21262d]/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#21262d] bg-[#0d1117] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-xl" />
        <Skeleton className="h-5 w-24 rounded-lg" />
      </div>
      <Skeleton className="h-5 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-lg" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-lg" />
      </div>
    </div>
  )
}

export function MapSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0d1117] rounded-xl">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#21262d]/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      <div className="absolute top-4 start-4 flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#58a6ff]/10 blur-xl animate-pulse" style={{ width: '100px', height: '100px' }} />
          <Skeleton className="h-16 w-16 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
