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

  if (loading) return <div className="flex items-center justify-center min-h-[calc(100vh-56px)] mt-14"><Spinner size="lg" /></div>

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] mt-14 text-center px-4">
      <p className="text-[#8b8fa8] mb-4">{error}</p>
      <Link href="/map" className="text-[#3b82f6] hover:underline text-sm">Back to map</Link>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-56px)] mt-14 px-4 py-8">
      <Link href="/map" className="inline-flex items-center gap-1 text-sm text-[#8b8fa8] hover:text-[#f0f0f0] transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to map
      </Link>
      {issue && <IssueDetail issue={issue} />}
    </div>
  )
}
