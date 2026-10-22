'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import IssueDetail from '@/components/issue/IssueDetail'
import Spinner from '@/components/ui/Spinner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function IssueDetailPage() {
  const { id } = useParams()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`)
        setIssue(res.data.issue || res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Issue not found')
      } finally {
        setLoading(false)
      }
    }
    fetchIssue()
  }, [id])

  if (loading) return <div className="flex items-center justify-center min-h-[calc(100vh-64px)] mt-16"><Spinner size="lg" /></div>

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] mt-16 text-center px-4">
      <div className="p-4 rounded-2xl bg-[#161b22] border border-[#21262d] mb-4">
        <p className="text-[#7d8590]">{error}</p>
      </div>
      <Link href="/map" className="text-[#58a6ff] hover:text-[#79b8ff] text-sm font-medium transition-colors">Back to map</Link>
    </div>
  )

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-[#58a6ff]/3 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-2xl mx-auto">
        <Link href="/map" className="inline-flex items-center gap-2 text-sm text-[#7d8590] hover:text-[#f0f6fc] transition-all duration-200 mb-8 px-3 py-1.5 rounded-xl hover:bg-[#161b22]">
          <ArrowLeft className="h-4 w-4" />
          Back to map
        </Link>
        {issue && <IssueDetail issue={issue} />}
      </div>
    </div>
  )
}
