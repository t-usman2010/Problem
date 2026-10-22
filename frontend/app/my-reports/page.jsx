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
import { motion } from 'motion/react'

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

  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-64px)] mt-16"><Spinner size="lg" /></div>
  if (!user) return null

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-4 py-10 max-w-2xl mx-auto">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-[#bc8cff]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#bc8cff]/20 to-[#58a6ff]/20 border border-[#bc8cff]/10">
            <FileText className="h-5 w-5 text-[#bc8cff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#f0f6fc]">{t('title', { defaultValue: 'My Reports' })}</h1>
            <p className="text-xs text-[#7d8590]">{issues.length > 0 ? `${issues.length} issue${issues.length !== 1 ? 's' : ''} reported` : 'Your reported issues will appear here'}</p>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#f85149]/20 bg-[#f85149]/5 p-5 text-sm text-[#f85149]">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {issues.map((issue, i) => (
              <motion.div
                key={issue._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <IssueCard issue={issue} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
