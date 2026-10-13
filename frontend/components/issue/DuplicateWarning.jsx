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
    <div className="rounded-lg border border-[#eab308]/30 bg-[#1a1d27] p-4 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 start-0 w-1 h-full bg-[#eab308]"></div>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-[#eab308] shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-[#f0f0f0]">
              {nearbyIssues.length} similar issue{nearbyIssues.length > 1 ? 's' : ''} reported nearby
            </h3>
            <p className="text-xs text-[#8b8fa8] mt-1">
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
                  className="flex items-center justify-between p-2 rounded border border-[#2a2d3e] bg-[#0f1117]/50 hover:border-[#3b82f6] transition-colors group"
                >
                  <div className="flex-1 min-w-0 pe-4">
                    <p className="text-sm text-[#f0f0f0] truncate">{issue.title}</p>
                    <p className="text-xs text-[#8b8fa8]">
                      {issue.distance ? `${Math.round(issue.distance)}m away` : 'Nearby'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-[#8b8fa8]">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{upvoteCount}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#8b8fa8] group-hover:text-[#3b82f6]" />
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
