'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/context/LocaleContext'
import { useToast } from '@/components/ui/Toast'
import api from '@/lib/api'
import IssueCard from '@/components/issue/IssueCard'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/SkeletonLoader'
import { FileText, AlertCircle } from 'lucide-react'

export default function MyReportsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const t = useTranslations('myReports')
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      const reporterId = user._id || user.id
      api.get(`/issues?reporter=${reporterId}`)
        .then(res => {
          setIssues(res.data.issues || res.data)
          setError(null)
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Failed to load your reports'
          setError(msg)
          toast.error(msg)
        })
        .finally(() => setLoading(false))
    }
  }, [user, toast])

  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-56px)] mt-14"><Spinner size="lg" /></div>
  if (!user) return null

  return (
    <div className="min-h-[calc(100vh-56px)] mt-14 px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-[#f0f0f0] mb-6">{t('title', { defaultValue: 'My Reports' })}</h1>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : issues.length === 0 ? (
        <EmptyState
          icon={FileText}
          message={t('noReports', { defaultValue: "You haven't reported any issues yet. Be the first to help your community." })}
          actionLabel="Report an Issue"
          onAction={() => router.push('/report')}
        />
      ) : (
        <div className="space-y-3">
          {issues.map(issue => <IssueCard key={issue._id} issue={issue} />)}
        </div>
      )}
    </div>
  )
}
