'use client'
import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { useTranslations } from '@/context/LocaleContext'
import api from '@/lib/api'
import StatusBadge from './StatusBadge'
import CategoryIcon from './CategoryIcon'
import Button from '@/components/ui/Button'
import { Heart, MapPin, Calendar, User, Send, Building2, MessageCircle } from 'lucide-react'

const MiniMap = dynamic(() => import('@/components/map/MiniMap'), { ssr: false })

function timeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

export default function IssueDetail({ issue: initialIssue }) {
  const normalizedInitial = initialIssue?.issue || initialIssue
  const [issue, setIssue] = useState(normalizedInitial)
  const { user, isAdmin } = useAuth()
  const toast = useToast()
  const t = useTranslations('issue')

  const checkHasUpvoted = useCallback((currentIssue, currentUser) => {
    if (!currentIssue) return false
    if (typeof currentIssue.hasUpvoted === 'boolean') {
      return currentIssue.hasUpvoted
    }
    if (currentUser && Array.isArray(currentIssue.upvotes)) {
      const currentId = currentUser._id || currentUser.id
      return currentIssue.upvotes.some(id => (id?._id || id)?.toString() === currentId?.toString())
    }
    return false
  }, [])

  const [hasUpvoted, setHasUpvoted] = useState(() => checkHasUpvoted(normalizedInitial, user))

  useEffect(() => {
    const nextIssue = initialIssue?.issue || initialIssue
    setIssue(nextIssue)
    setHasUpvoted(checkHasUpvoted(nextIssue, user))
  }, [initialIssue, user, checkHasUpvoted])

  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  // Optimistic upvote
  const handleUpvote = async () => {
    if (!user) {
      toast.error(t('loginToUpvote', { defaultValue: 'Please login to upvote' }))
      return
    }
    const currentUpvotes = typeof issue.upvotes === 'number'
      ? issue.upvotes
      : (issue.upvoteCount ?? (Array.isArray(issue.upvotes) ? issue.upvotes.length : 0))
    const prevUpvotes = issue.upvotes
    const prevUpvoteCount = issue.upvoteCount
    const prevHasUpvoted = hasUpvoted
    const nextCount = hasUpvoted ? Math.max(0, currentUpvotes - 1) : currentUpvotes + 1

    setIssue(prev => ({
      ...prev,
      upvotes: nextCount,
      upvoteCount: nextCount,
      hasUpvoted: !hasUpvoted
    }))
    setHasUpvoted(!hasUpvoted)

    try {
      await api.post(`/issues/${issue._id || issue.id}/upvote`)
    } catch {
      setIssue(prev => ({
        ...prev,
        upvotes: prevUpvotes,
        upvoteCount: prevUpvoteCount,
        hasUpvoted: prevHasUpvoted
      }))
      setHasUpvoted(prevHasUpvoted)
      toast.error(t('upvoteFailed', { defaultValue: 'Failed to upvote' }))
    }
  }

  // Add comment
  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmittingComment(true)
    const tempComment = {
      _id: `temp-${Date.now()}`,
      text: comment,
      user: { name: user?.name || 'You' },
      createdAt: new Date().toISOString()
    }
    setIssue(prev => ({ ...prev, comments: [...(prev.comments || []), tempComment] }))
    setComment('')

    try {
      const res = await api.post(`/issues/${issue._id}/comments`, { text: comment })
      setIssue(prev => ({
        ...prev,
        comments: prev.comments.map(c => c._id === tempComment._id ? res.data : c)
      }))
    } catch {
      setIssue(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== tempComment._id)
      }))
      toast.error(t('commentFailed', { defaultValue: 'Failed to add comment' }))
    } finally {
      setSubmittingComment(false)
    }
  }

  // Admin status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/issues/${issue._id}/status`, { status: newStatus })
      setIssue(prev => ({ ...prev, status: newStatus }))
      toast.success(t('statusUpdated', { status: newStatus, defaultValue: `Status updated to ${newStatus}` }))
    } catch {
      toast.error(t('statusFailed', { defaultValue: 'Failed to update status' }))
    }
  }

  // Admin department update
  const handleDeptUpdate = async (newDept) => {
    try {
      await api.patch(`/issues/${issue._id}/status`, {
        status: issue.status,
        assignedDept: newDept || null
      })
      setIssue(prev => ({ ...prev, assignedDept: newDept || null }))
      toast.success('Department updated')
    } catch {
      toast.error('Failed to update department')
    }
  }

  const issueLat = issue.latitude ?? (issue.location?.coordinates ? issue.location.coordinates[1] : null)
  const issueLng = issue.longitude ?? (issue.location?.coordinates ? issue.location.coordinates[0] : null)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Photo */}
      {issue.photo && (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#21262d] group">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${issue.photo}`}
            alt={t('photoAlt', { category: issue.category, defaultValue: `Photo of reported ${issue.category} issue` })}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080d]/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <CategoryIcon category={issue.category} showLabel />
            <StatusBadge status={issue.status} />
          </div>
          <h1 className="text-2xl font-bold text-[#f0f6fc] leading-tight">{issue.title}</h1>
        </div>
        <button
          onClick={handleUpvote}
          className={`flex flex-col items-center gap-1 rounded-2xl p-3 transition-all duration-200 ${
            hasUpvoted
              ? 'text-[#f85149] bg-[#f85149]/10 border border-[#f85149]/20 shadow-[0_0_20px_rgba(248,81,73,0.1)]'
              : 'text-[#7d8590] bg-[#161b22] border border-[#21262d] hover:text-[#f85149] hover:bg-[#f85149]/10 hover:border-[#f85149]/20'
          }`}
          aria-label={hasUpvoted ? t('removeUpvote', { defaultValue: 'Remove upvote' }) : t('upvote', { defaultValue: 'Upvote this issue' })}
        >
          <Heart className="h-6 w-6" fill={hasUpvoted ? 'currentColor' : 'none'} />
          <span className="text-xs font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {typeof issue.upvotes === 'number' ? issue.upvotes : (issue.upvoteCount ?? (Array.isArray(issue.upvotes) ? issue.upvotes.length : 0))}
          </span>
        </button>
      </div>

      {/* Description */}
      {issue.description && (
        <div className="rounded-2xl bg-[#0d1117] border border-[#21262d] p-5">
          <p className="text-sm text-[#7d8590] leading-relaxed">{issue.description}</p>
        </div>
      )}

      {/* Mini-map */}
      {issueLat != null && issueLng != null && (
        <div className="rounded-2xl overflow-hidden border border-[#21262d]">
          <MiniMap lat={issueLat} lng={issueLng} />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-[#7d8590] pb-6 border-b border-[#21262d]">
        {issue.address && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d]">
            <MapPin className="h-3.5 w-3.5 text-[#58a6ff]" />
            {issue.address}
          </span>
        )}
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d]">
          <User className="h-3.5 w-3.5 text-[#bc8cff]" />
          {issue.reporter?.name || 'Anonymous'}
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d]">
          <Calendar className="h-3.5 w-3.5 text-[#39d2c0]" />
          {timeAgo(issue.createdAt)}
        </span>
        {issue.assignedDept && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#58a6ff]/10 border border-[#58a6ff]/20 text-[#58a6ff]">
            <Building2 className="h-3.5 w-3.5" />
            {issue.assignedDept}
          </span>
        )}
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <div className="p-5 rounded-2xl border border-[#bc8cff]/20 bg-[#bc8cff]/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-[#bc8cff]" />
            <h3 className="text-sm font-bold text-[#f0f6fc]">Admin Controls</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#7d8590] shrink-0">Status:</label>
              <select
                value={issue.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="flex-1 rounded-xl border border-[#21262d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#7d8590] shrink-0">Dept:</label>
              <select
                value={issue.assignedDept || ''}
                onChange={(e) => handleDeptUpdate(e.target.value || null)}
                className="flex-1 rounded-xl border border-[#21262d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none transition-colors"
              >
                <option value="">Unassigned</option>
                <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                <option value="Street Lighting">Street Lighting</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Water & Sewerage">Water & Sewerage</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Comments */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle className="h-4 w-4 text-[#58a6ff]" />
          <h3 className="text-sm font-bold text-[#f0f6fc]">
            {t('comments', { defaultValue: 'Comments' })}
          </h3>
          <span className="text-xs font-medium text-[#7d8590] px-2 py-0.5 rounded-full bg-[#161b22] border border-[#21262d]">
            {issue.comments?.length || 0}
          </span>
        </div>

        <div className="space-y-3 mb-5">
          {(issue.comments || []).map((c) => (
            <div key={c._id} className="rounded-2xl bg-[#0d1117] border border-[#21262d] p-4 hover:border-[#30363d] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#39d2c0] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{(c.user?.name || 'A').charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#f0f6fc]">{c.user?.name || 'Anonymous'}</span>
                </div>
                <span className="text-xs text-[#484f58]">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-[#7d8590] ps-8">{c.text}</p>
            </div>
          ))}
          {(!issue.comments || issue.comments.length === 0) && (
            <p className="text-sm text-[#484f58] text-center py-8">{t('noComments', { defaultValue: 'No comments yet. Be the first to comment.' })}</p>
          )}
        </div>

        {user && (
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('writeComment', { defaultValue: 'Write a comment...' })}
              className="flex-1 rounded-xl border border-[#21262d] bg-[#0d1117] px-4 py-3 text-sm text-[#f0f6fc] placeholder-[#484f58] input-glow focus:border-[#58a6ff]/50 focus:outline-none transition-all"
            />
            <Button type="submit" size="md" loading={submittingComment} disabled={!comment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
