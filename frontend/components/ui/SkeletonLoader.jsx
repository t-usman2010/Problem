export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-[#2a2d3e] ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-[#2a2d3e] bg-[#1a1d27] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  )
}

export function MapSkeleton() {
  return (
    <div className="relative h-full w-full animate-pulse bg-[#1a1d27] rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2a2d3e]/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      <div className="absolute top-4 start-4 flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    </div>
  )
}
