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
import { Heart, MapPin, Calendar, User, Send, MessageCircle } from 'lucide-react'

const MiniMap = dynamic(() => import('@/components/map/MiniMap'), { ssr: false })

function formatTimeAgo(dateString, tTime) {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return tTime ? tTime('justNow') : 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return tTime ? tTime('minutesAgo', { count: minutes }) : `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return tTime ? tTime('hoursAgo', { count: hours }) : `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return tTime ? tTime('daysAgo', { count: days }) : `${days}d ago`
  return date.toLocaleDateString()
}

export default function IssueDetail({ issue: initialIssue }) {
  const normalizedInitial = initialIssue?.issue || initialIssue
  const [issue, setIssue] = useState(normalizedInitial)
  const { user, isAdmin } = useAuth()
  const toast = useToast()
  const t = useTranslations('issue')
  const tTime = useTranslations('time')
  const tStatuses = useTranslations('statuses')

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

  useEffect(() => {
    if (!normalizedInitial?._id) return

    let active = true
    api.get(`/issues/${normalizedInitial._id}/comments`)
      .then((res) => {
        if (!active) return
        const comments = (res.data.comments || []).map(item => ({
          ...item,
          _id: item._id || item.id
        }))
        setIssue(prev => ({ ...prev, comments }))
      })
      .catch(() => {
        if (active) {
          toast.error(t('commentsFailed', { defaultValue: 'Failed to load comments' }))
        }
      })

    return () => {
      active = false
    }
  }, [normalizedInitial?._id, t, toast])

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
      hasUpvoted: !prevHasUpvoted
    }))
    setHasUpvoted(!prevHasUpvoted)

    try {
      const res = await api.post(`/issues/${issue._id}/upvote`)
      const updatedCount = res.data?.upvotes ?? res.data?.issue?.upvotes ?? nextCount
      const updatedHasUpvoted = res.data?.hasUpvoted ?? !prevHasUpvoted
      setIssue(prev => ({
        ...prev,
        upvotes: updatedCount,
        upvoteCount: updatedCount,
        hasUpvoted: updatedHasUpvoted
      }))
      setHasUpvoted(updatedHasUpvoted)
    } catch {
      setIssue(prev => ({
        ...prev,
        upvotes: prevUpvotes,
        upvoteCount: prevUpvoteCount,
        hasUpvoted: prevHasUpvoted
      }))
      setHasUpvoted(prevHasUpvoted)
      toast.error(t('upvoteFailed', { defaultValue: 'Failed to update upvote' }))
    }
  }

  // Comment submission
  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    const tempComment = {
      _id: `temp-${Date.now()}`,
      text: comment,
      user: { name: user.name },
      createdAt: new Date().toISOString()
    }
    setIssue(prev => ({
      ...prev,
      comments: [...(prev.comments || []), tempComment]
    }))
    const commentText = comment
    setComment('')
    setSubmittingComment(true)

    try {
      const res = await api.post(`/issues/${issue._id}/comments`, { text: commentText })
      const createdComment = res.data?.comment || {
        ...tempComment,
        _id: res.data?._id || tempComment._id
      }
      setIssue(prev => ({
        ...prev,
        comments: (prev.comments || []).map(c => c._id === tempComment._id ? createdComment : c)
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
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="space-y-2 sm:space-y-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <CategoryIcon category={issue.category} showLabel />
            <StatusBadge status={issue.status} />
          </div>
          {/* Title: dir="auto" ensures English sentences are ALWAYS aligned to the left */}
          <h1
            dir="auto"
            className="text-xl sm:text-2xl font-bold text-[#f0f6fc] leading-tight break-words text-start [unicode-bidi:plaintext] user-content"
          >
            {issue.title}
          </h1>
        </div>
        <button
          onClick={handleUpvote}
          className={`flex flex-col items-center gap-1 rounded-2xl p-2.5 sm:p-3 shrink-0 transition-all duration-200 ${
            hasUpvoted
              ? 'text-[#f85149] bg-[#f85149]/10 border border-[#f85149]/20 shadow-[0_0_20px_rgba(248,81,73,0.1)]'
              : 'text-[#7d8590] bg-[#161b22] border border-[#21262d] hover:text-[#f85149] hover:bg-[#f85149]/10 hover:border-[#f85149]/20'
          }`}
          aria-label={hasUpvoted ? t('removeUpvote', { defaultValue: 'Remove upvote' }) : t('upvote', { defaultValue: 'Upvote this issue' })}
        >
          <Heart className="h-5 w-5 sm:h-6 sm:w-6" fill={hasUpvoted ? 'currentColor' : 'none'} />
          <span className="text-xs font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {typeof issue.upvotes === 'number' ? issue.upvotes : (issue.upvoteCount ?? (Array.isArray(issue.upvotes) ? issue.upvotes.length : 0))}
          </span>
        </button>
      </div>

      {/* Description */}
      {issue.description && (
        <div className="rounded-2xl bg-[#0d1117] border border-[#21262d] p-4 sm:p-5">
          <p
            dir="auto"
            className="text-xs sm:text-sm text-[#7d8590] leading-relaxed text-start [unicode-bidi:plaintext] user-content"
          >
            {issue.description}
          </p>
        </div>
      )}

      {/* Mini-map */}
      {issueLat != null && issueLng != null && (
        <div className="rounded-2xl overflow-hidden border border-[#21262d] h-[220px] sm:h-[260px]">
          <MiniMap lat={issueLat} lng={issueLng} />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#7d8590] pb-6 border-b border-[#21262d]">
        {issue.address && (
          <span
            dir="auto"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d] truncate max-w-full text-start [unicode-bidi:plaintext] user-content"
          >
            <MapPin className="h-3.5 w-3.5 text-[#58a6ff] shrink-0" />
            <span className="truncate">{issue.address}</span>
          </span>
        )}
        <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d] shrink-0">
          <Calendar className="h-3.5 w-3.5 text-[#bc8cff] shrink-0" />
          {formatTimeAgo(issue.createdAt, tTime)}
        </span>
        <span
          dir="auto"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d] truncate max-w-[200px] text-start [unicode-bidi:plaintext] user-content"
        >
          <User className="h-3.5 w-3.5 text-[#39d2c0] shrink-0" />
          <span className="truncate">{issue.reportedBy?.name || t('anonymous', { defaultValue: 'Anonymous' })}</span>
        </span>
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <div className="rounded-2xl border border-[#bc8cff]/30 bg-[#bc8cff]/5 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-[#bc8cff]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#f0f6fc]">Admin Controls</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm text-[#7d8590] shrink-0">Status:</label>
              <select
                value={issue.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="flex-1 rounded-xl border border-[#21262d] bg-[#0d1117] px-3 py-2 text-xs sm:text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none transition-colors"
              >
                <option value="pending">{tStatuses('pending', { defaultValue: 'Pending' })}</option>
                <option value="in-progress">{tStatuses('inProgress', { defaultValue: 'In Progress' })}</option>
                <option value="resolved">{tStatuses('resolved', { defaultValue: 'Resolved' })}</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm text-[#7d8590] shrink-0">Dept:</label>
              <select
                value={issue.assignedDept || ''}
                onChange={(e) => handleDeptUpdate(e.target.value || null)}
                className="flex-1 rounded-xl border border-[#21262d] bg-[#0d1117] px-3 py-2 text-xs sm:text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none transition-colors"
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
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
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
            <div key={c._id} className="rounded-2xl bg-[#0d1117] border border-[#21262d] p-3.5 sm:p-4 hover:border-[#30363d] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#39d2c0] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-white">{(c.user?.name || 'A').charAt(0).toUpperCase()}</span>
                  </div>
                  <span
                    dir="auto"
                    className="text-xs sm:text-sm font-semibold text-[#f0f6fc] truncate text-start [unicode-bidi:plaintext] user-content"
                  >
                    {c.user?.name || t('anonymous', { defaultValue: 'Anonymous' })}
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-[#484f58] shrink-0">{formatTimeAgo(c.createdAt, tTime)}</span>
              </div>
              <p
                dir="auto"
                className="text-xs sm:text-sm text-[#7d8590] ps-8 leading-relaxed break-words text-start [unicode-bidi:plaintext] user-content"
              >
                {c.text}
              </p>
            </div>
          ))}
          {(!issue.comments || issue.comments.length === 0) && (
            <p className="text-xs sm:text-sm text-[#484f58] text-center py-8">{t('noComments', { defaultValue: 'No comments yet. Be the first to comment.' })}</p>
          )}
        </div>

        {user && (
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('writeComment', { defaultValue: 'Write a comment...' })}
              className="flex-1 min-w-0 rounded-xl border border-[#21262d] bg-[#0d1117] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#f0f6fc] placeholder-[#484f58] input-glow focus:border-[#58a6ff]/50 focus:outline-none transition-all"
            />
            <Button type="submit" size="md" loading={submittingComment} disabled={!comment.trim()} className="shrink-0">
              <Send className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
