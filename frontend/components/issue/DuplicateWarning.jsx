'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { AlertTriangle, ThumbsUp, ExternalLink } from 'lucide-react'

export default function DuplicateWarning({ category, latitude, longitude }) {
  const [nearbyIssues, setNearbyIssues] = useState([])

  useEffect(() => {
    if (!category || !latitude || !longitude) {
      setNearbyIssues([])
      return
    }

    const fetchNearby = async () => {
      try {
        const { data } = await api.get('/issues/nearby', {
          params: {
            lat: latitude,
            lng: longitude,
            radius: 100,
            category
          }
        })
        setNearbyIssues(data.issues || data || [])
      } catch (error) {
        console.error('Failed to fetch nearby issues:', error)
      }
    }

    const timer = setTimeout(() => {
      fetchNearby()
    }, 500)

    return () => clearTimeout(timer)
  }, [category, latitude, longitude])

  if (!nearbyIssues || nearbyIssues.length === 0) return null

  return (
    <div className="rounded-2xl border border-[#d29922]/20 bg-[#d29922]/5 p-5 relative overflow-hidden">
      <div className="absolute top-0 start-0 w-1 h-full bg-gradient-to-b from-[#d29922] to-[#d29922]/30"></div>
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-[#d29922]/10 shrink-0 mt-0.5">
          <AlertTriangle className="h-4 w-4 text-[#d29922]" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#f0f6fc]">
              {nearbyIssues.length} similar issue{nearbyIssues.length > 1 ? 's' : ''} reported nearby
            </h3>
            <p className="text-xs text-[#7d8590] mt-1">
              Consider upvoting an existing report instead of creating a duplicate
            </p>
          </div>
          
          <div className="space-y-2">
            {nearbyIssues.map(issue => {
              const issueId = issue._id || issue.id
              const upvoteCount = Array.isArray(issue.upvotes)
                ? issue.upvotes.length
                : (issue.upvotes ?? issue.upvoteCount ?? 0)

              return (
                <Link 
                  key={issueId} 
                  href={`/issue/${issueId}`}
                  target="_blank"
                  className="flex items-center justify-between p-3 rounded-xl border border-[#21262d] bg-[#0d1117]/50 hover:border-[#58a6ff]/30 hover:bg-[#58a6ff]/5 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0 pe-4">
                    <p className="text-sm text-[#f0f6fc] truncate font-medium">{issue.title}</p>
                    <p className="text-xs text-[#484f58]">
                      {issue.distance ? `${Math.round(issue.distance)}m away` : 'Nearby'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#7d8590] px-2 py-1 rounded-lg bg-[#161b22]">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{upvoteCount}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#484f58] group-hover:text-[#58a6ff] transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
