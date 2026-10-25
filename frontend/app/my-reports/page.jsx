'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/context/LocaleContext'
import { useToast } from '@/components/ui/Toast'
import api from '@/lib/api'
import IssueCard from '@/components/issue/IssueCard'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/SkeletonLoader'
import { FileText, AlertCircle, Plus, Lock, LogIn, CheckCircle2, Clock, Loader2 } from 'lucide-react'
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
    if (user) {
      const reporterId = user._id || user.id
      setLoading(true)
      api.get(`/issues?reporter=${reporterId}&limit=100`)
        .then(res => {
          const raw = res.data.issues || res.data || []
          // Strict client-side guarantee: ONLY show issues matching the logged in user
          const myIssues = raw.filter(issue => {
            const repId = issue.reportedBy?._id || issue.reportedBy?.id || issue.reportedBy || issue.reporter?._id || issue.reporter?.id || issue.reporter
            return String(repId) === String(reporterId)
          })
          setIssues(myIssues)
          setError(null)
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Failed to load your reports'
          setError(msg)
          toast.error(msg)
        })
        .finally(() => setLoading(false))
    } else if (!isLoading) {
      setLoading(false)
    }
  }, [user, isLoading, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] mt-16">
        <Spinner size="lg" />
      </div>
    )
  }

  // If user is not logged in, show lock/login prompt
  if (!user) {
    return (
      <div className="relative min-h-[calc(100vh-64px)] mt-16 px-4 py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl glass-card text-center border border-[#21262d] relative overflow-hidden"
        >
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#58a6ff]/20 to-[#bc8cff]/20 border border-[#58a6ff]/30 mb-6 text-[#58a6ff]">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#f0f6fc] mb-3">Login to Access My Reports</h2>
          <p className="text-sm text-[#7d8590] mb-8 leading-relaxed">
            Your personal reports dashboard is private and only available to you. Sign in to view and track all the issues you have reported.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto btn-gradient px-6 py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
            >
              <LogIn className="w-4 h-4" /> Login Now
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const pendingCount = issues.filter(i => i.status === 'pending').length
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length
  const resolvedCount = issues.filter(i => i.status === 'resolved').length

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-4 py-10 max-w-3xl mx-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#58a6ff]/5 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/4 w-80 h-80 bg-[#bc8cff]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#58a6ff]/20 to-[#bc8cff]/20 border border-[#58a6ff]/30 text-[#58a6ff]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f0f6fc] tracking-tight">
                {t('title', { defaultValue: 'My Reports' })}
              </h1>
              <p className="text-xs text-[#7d8590] mt-0.5">
                Exclusively showing reports submitted by {user.name} ({user.email})
              </p>
            </div>
          </div>

          <Link
            href="/report"
            className="btn-gradient inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shrink-0 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Report New Issue
          </Link>
        </motion.div>

        {/* User Summary Stats */}
        {issues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#21262d] text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#7d8590] mb-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#ef4444]" /> Pending
              </div>
              <span className="text-2xl font-bold text-[#f0f6fc]">{pendingCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#21262d] text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#7d8590] mb-1 font-medium">
                <Loader2 className="w-3.5 h-3.5 text-[#eab308]" /> In Progress
              </div>
              <span className="text-2xl font-bold text-[#f0f6fc]">{inProgressCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#21262d] text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#7d8590] mb-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> Resolved
              </div>
              <span className="text-2xl font-bold text-[#f0f6fc]">{resolvedCount}</span>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#f85149]/20 bg-[#f85149]/10 p-4 text-sm text-[#f85149]">
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
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
