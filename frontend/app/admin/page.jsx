'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useTranslations } from '@/context/LocaleContext'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import CategoryIcon from '@/components/issue/CategoryIcon'
import StatusBadge from '@/components/issue/StatusBadge'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import {
  Trash2, Search, AlertTriangle, ChevronLeft, ChevronRight, Shield, Activity,
  CheckCircle2, Clock, Loader2, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown,
  Filter, X, MapPin, Heart, ChevronDown, ChevronUp, Eye,
  Zap, TrendingUp, Timer, Users, LayoutGrid, List, Bell,
  Building2, Download, RefreshCw, CheckSquare, Square, Minus
} from 'lucide-react'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'
import ExportButton from '@/components/admin/ExportButton'
import { motion, AnimatePresence } from 'motion/react'

// --- Constants ---
const DEPT_OPTIONS = [
  'Roads & Infrastructure',
  'Street Lighting',
  'Sanitation',
  'Water & Sewerage',
  'General'
]

const DATE_RANGES = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 3 Months', value: '3months' }
]

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Most Upvoted', value: 'upvotes' },
  { label: 'Title A-Z', value: 'title-asc' },
  { label: 'Title Z-A', value: 'title-desc' }
]

const TABS = [
  { key: 'all', label: 'All Issues', icon: LayoutGrid },
  { key: 'attention', label: 'Needs Attention', icon: AlertCircle },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2 }
]

function getPriority(upvoteCount) {
  if (upvoteCount >= 10) return { level: 'critical', label: 'Critical', color: '#f85149', bg: '#f85149' }
  if (upvoteCount >= 5) return { level: 'high', label: 'High', color: '#d29922', bg: '#d29922' }
  if (upvoteCount >= 2) return { level: 'medium', label: 'Medium', color: '#58a6ff', bg: '#58a6ff' }
  return { level: 'low', label: 'Low', color: '#484f58', bg: '#484f58' }
}

function formatTimeAgo(dateString) {
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

function isInDateRange(dateStr, range) {
  if (range === 'all') return true
  const date = new Date(dateStr)
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (range) {
    case 'today': return date >= startOfDay
    case 'week': {
      const weekAgo = new Date(startOfDay)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }
    case 'month': {
      const monthAgo = new Date(startOfDay)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }
    case '3months': {
      const threeMonthsAgo = new Date(startOfDay)
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      return date >= threeMonthsAgo
    }
    default: return true
  }
}

// --- Activity Feed Item ---
function ActivityItem({ event }) {
  const icons = {
    'issue:new': <Zap className="h-3 w-3 text-[#58a6ff]" />,
    'issue:updated': <RefreshCw className="h-3 w-3 text-[#d29922]" />,
    'issue:deleted': <Trash2 className="h-3 w-3 text-[#f85149]" />,
    'issue:upvoted': <Heart className="h-3 w-3 text-[#bc8cff]" />
  }
  const colors = {
    'issue:new': 'border-[#58a6ff]/30',
    'issue:updated': 'border-[#d29922]/30',
    'issue:deleted': 'border-[#f85149]/30',
    'issue:upvoted': 'border-[#bc8cff]/30'
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-2.5 p-2.5 rounded-lg border-l-2 ${colors[event.type] || 'border-[#21262d]'} bg-[#0d1117]/50`}
    >
      <div className="mt-0.5 shrink-0">{icons[event.type] || <Bell className="h-3 w-3 text-[#7d8590]" />}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#c9d1d9] leading-tight truncate">{event.message}</p>
        <p className="text-[10px] text-[#484f58] mt-0.5">{event.time}</p>
      </div>
    </motion.div>
  )
}

// --- Expandable Row Detail ---
function RowDetail({ issue }) {
  return (
    <motion.tr
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <td colSpan={9} className="px-5 py-4 bg-[#06080d]/70 border-b border-[#21262d]/30">
        <div className="flex gap-5">
          {issue.photoUrl && (
            <img
              src={issue.photoUrl.includes('?') ? issue.photoUrl : `${issue.photoUrl}?v=corp`}
              crossOrigin="anonymous"
              alt={issue.title}
              className="w-28 h-28 rounded-xl object-cover border border-[#21262d] shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#7d8590] mb-2 leading-relaxed">
              {issue.description || 'No description provided.'}
            </p>
            <div className="flex flex-wrap gap-3 text-[11px] text-[#484f58]">
              {issue.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {issue.address}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Created {formatTimeAgo(issue.createdAt)}
              </span>
              {issue.resolvedAt && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#3fb950]" /> Resolved {formatTimeAgo(issue.resolvedAt)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> {issue.upvoteCount || issue.upvotes || 0} upvotes
              </span>
              <span className="font-mono text-[10px] text-[#30363d]">ID: {issue._id}</span>
            </div>
          </div>
        </div>
      </td>
    </motion.tr>
  )
}

// =========================
// MAIN ADMIN PAGE
// =========================
export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const toast = useToast()
  const t = useTranslations('admin')

  // Data
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterDateRange, setFilterDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [activeTab, setActiveTab] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // UI state
  const [deleteModal, setDeleteModal] = useState({ open: false, issue: null })
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [bulkAction, setBulkAction] = useState('')
  const [activityFeed, setActivityFeed] = useState([])
  const [showActivity, setShowActivity] = useState(false)
  const pageSize = 12

  const debouncedSearch = useDebounce(search, 300)

  // --- Auth Guard ---
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) router.push('/map')
  }, [user, isAdmin, isLoading, router])

  // --- Load Issues ---
  useEffect(() => {
    if (isAdmin) {
      api.get('/issues')
        .then(res => setIssues(res.data.issues || res.data))
        .catch(() => toast.error(t('loadFailed', { defaultValue: 'Failed to load issues' })))
        .finally(() => setLoading(false))
    }
  }, [isAdmin, toast, t])

  // --- Real-time Socket ---
  useEffect(() => {
    if (!socket) return
    const handleNew = (issue) => {
      setIssues(prev => [issue, ...prev])
      addActivity('issue:new', `New report: "${issue.title}"`)
    }
    const handleUpdated = (updated) => {
      setIssues(prev => prev.map(i => i._id === updated._id ? { ...i, ...updated } : i))
      addActivity('issue:updated', `Updated: "${updated.title || 'Issue'}" → ${updated.status}`)
    }
    const handleDeleted = ({ id }) => {
      setIssues(prev => prev.filter(i => i._id !== id))
      addActivity('issue:deleted', `Issue deleted`)
    }
    const handleUpvoted = (data) => {
      setIssues(prev => prev.map(i => i._id === data.id ? { ...i, upvoteCount: data.upvoteCount } : i))
      addActivity('issue:upvoted', `Issue upvoted (${data.upvoteCount} total)`)
    }

    socket.on('issue:new', handleNew)
    socket.on('issue:updated', handleUpdated)
    socket.on('issue:deleted', handleDeleted)
    socket.on('issue:upvoted', handleUpvoted)
    return () => {
      socket.off('issue:new', handleNew)
      socket.off('issue:updated', handleUpdated)
      socket.off('issue:deleted', handleDeleted)
      socket.off('issue:upvoted', handleUpvoted)
    }
  }, [socket])

  const addActivity = useCallback((type, message) => {
    setActivityFeed(prev => [{
      id: Date.now(),
      type,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }, ...prev].slice(0, 30))
  }, [])

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1) }, [debouncedSearch, filterStatus, filterCategory, filterDateRange, sortBy, activeTab])

  // --- Handlers ---
  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const res = await api.patch(`/issues/${issueId}/status`, { status: newStatus })
      setIssues(prev => prev.map(i => i._id === issueId ? { ...i, ...res.data.issue } : i))
      toast.success(t('statusSuccess', { defaultValue: 'Status updated' }))
    } catch {
      toast.error(t('statusFailed', { defaultValue: 'Failed to update status' }))
    }
  }

  const handleDeptChange = async (issueId, dept) => {
    try {
      await api.patch(`/issues/${issueId}/status`, { assignedDept: dept })
      setIssues(prev => prev.map(i => i._id === issueId ? { ...i, assignedDept: dept } : i))
      toast.success('Department assigned')
    } catch {
      toast.error('Failed to assign department')
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.issue) return
    try {
      await api.delete(`/issues/${deleteModal.issue._id}`)
      setIssues(prev => prev.filter(i => i._id !== deleteModal.issue._id))
      toast.success(t('deleteSuccess', { defaultValue: 'Issue deleted' }))
      setDeleteModal({ open: false, issue: null })
    } catch {
      toast.error(t('deleteFailed', { defaultValue: 'Failed to delete issue' }))
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    if (bulkAction === 'delete') {
      if (!confirm(`Delete ${ids.length} issue(s)? This cannot be undone.`)) return
      let deleted = 0
      for (const id of ids) {
        try {
          await api.delete(`/issues/${id}`)
          deleted++
        } catch { /* skip */ }
      }
      setIssues(prev => prev.filter(i => !selectedIds.has(i._id)))
      setSelectedIds(new Set())
      toast.success(`${deleted} issue(s) deleted`)
    } else {
      let updated = 0
      for (const id of ids) {
        try {
          await api.patch(`/issues/${id}/status`, { status: bulkAction })
          updated++
        } catch { /* skip */ }
      }
      setIssues(prev => prev.map(i => selectedIds.has(i._id) ? { ...i, status: bulkAction } : i))
      setSelectedIds(new Set())
      toast.success(`${updated} issue(s) updated to "${bulkAction}"`)
    }
    setBulkAction('')
  }

  const handleRefresh = () => {
    setLoading(true)
    api.get('/issues')
      .then(res => setIssues(res.data.issues || res.data))
      .catch(() => toast.error('Failed to refresh'))
      .finally(() => setLoading(false))
  }

  // --- Select helpers ---
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = (pageIds) => {
    const allSelected = pageIds.every(id => selectedIds.has(id))
    setSelectedIds(prev => {
      const next = new Set(prev)
      pageIds.forEach(id => allSelected ? next.delete(id) : next.add(id))
      return next
    })
  }

  // --- Guards ---
  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-64px)] mt-16"><Spinner size="lg" /></div>
  if (!user || !isAdmin) return null

  // --- Computed Data ---
  const filtered = issues.filter(i => {
    const matchesSearch = !debouncedSearch || i.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchesStatus = filterStatus === 'all' || i.status === filterStatus
    const matchesCategory = filterCategory === 'all' || i.category === filterCategory
    const matchesDate = isInDateRange(i.createdAt, filterDateRange)
    let matchesTab = true
    if (activeTab === 'attention') matchesTab = i.status === 'pending' || i.status === 'awaiting-confirmation'
    if (activeTab === 'resolved') matchesTab = i.status === 'resolved'
    return matchesSearch && matchesStatus && matchesCategory && matchesDate && matchesTab
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt)
      case 'upvotes': return (b.upvoteCount || 0) - (a.upvoteCount || 0)
      case 'title-asc': return (a.title || '').localeCompare(b.title || '')
      case 'title-desc': return (b.title || '').localeCompare(a.title || '')
      default: return 0
    }
  })

  const totalPages = Math.ceil(sorted.length / pageSize) || 1
  const paginatedIssues = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const pageIds = paginatedIssues.map(i => i._id)
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id))
  const somePageSelected = pageIds.some(id => selectedIds.has(id)) && !allPageSelected

  // Stats
  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    awaitingConfirmation: issues.filter(i => i.status === 'awaiting-confirmation').length,
    resolved: issues.filter(i => i.status === 'resolved').length
  }
  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0

  // Avg resolution time
  const resolvedIssues = issues.filter(i => i.resolvedAt && i.createdAt)
  const avgResolutionHours = resolvedIssues.length > 0
    ? Math.round(resolvedIssues.reduce((sum, i) => {
        const diff = (new Date(i.resolvedAt) - new Date(i.createdAt)) / (1000 * 3600)
        return sum + (isNaN(diff) || diff < 0 ? 0 : diff)
      }, 0) / resolvedIssues.length)
    : 0

  const activeFiltersCount = [filterStatus !== 'all', filterCategory !== 'all', filterDateRange !== 'all'].filter(Boolean).length

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 pb-28 md:pb-12">
      {/* ===== ADMIN HEADER BANNER ===== */}
      <div className="relative overflow-hidden border-b border-[#21262d]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/8 via-[#0d1117] to-[#58a6ff]/8" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#bc8cff]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#58a6ff]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#7c3aed]/30 to-[#bc8cff]/20 border border-[#7c3aed]/20 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
                <Shield className="h-6 w-6 text-[#bc8cff]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#f0f6fc] tracking-tight">
                    {t('title', { defaultValue: 'Admin Command Center' })}
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#7c3aed]/15 text-[#bc8cff] border border-[#7c3aed]/20">
                    <Shield className="h-2.5 w-2.5" /> Admin
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-[#7d8590]">Managing {stats.total} total reports</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-[#3fb950] shadow-[0_0_6px_rgba(63,185,80,0.5)]' : 'bg-[#f85149]'}`} />
                    <span className="text-[10px] text-[#484f58]">{isConnected ? 'Live' : 'Offline'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2.5 rounded-xl bg-[#161b22] border border-[#21262d] text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#30363d] transition-all disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowActivity(prev => !prev)}
                className={`relative p-2.5 rounded-xl transition-all ${
                  showActivity
                    ? 'bg-[#bc8cff]/10 border border-[#bc8cff]/20 text-[#bc8cff]'
                    : 'bg-[#161b22] border border-[#21262d] text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#30363d]'
                }`}
                title="Activity feed"
              >
                <Bell className="h-4 w-4" />
                {activityFeed.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#bc8cff] text-[8px] font-bold text-white flex items-center justify-center">
                    {Math.min(activityFeed.length, 9)}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowAnalytics(prev => !prev)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  showAnalytics
                    ? 'bg-[#58a6ff]/10 border border-[#58a6ff]/20 text-[#58a6ff] shadow-[0_0_20px_rgba(88,166,255,0.1)]'
                    : 'bg-[#161b22] border border-[#21262d] text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#30363d]'
                }`}
              >
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">{t('analytics', { defaultValue: 'Analytics' })}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* ===== MAIN CONTENT ===== */}
          <div className="flex-1 min-w-0">

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-6">
              {[
                { label: 'Total', value: stats.total, color: '#58a6ff', icon: LayoutGrid },
                { label: 'Pending', value: stats.pending, color: '#f85149', icon: Clock },
                { label: 'In Progress', value: stats.inProgress, color: '#d29922', icon: Loader2 },
                { label: 'Awaiting', value: stats.awaitingConfirmation, color: '#f97316', icon: AlertCircle },
                { label: 'Resolved', value: stats.resolved, color: '#3fb950', icon: CheckCircle2 },
                { label: 'Resolution Rate', value: `${resolutionRate}%`, color: '#bc8cff', icon: TrendingUp }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-[#21262d] bg-[#0d1117] p-3 sm:p-4 hover:border-[#30363d] transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] sm:text-[11px] text-[#484f58] font-medium uppercase tracking-wider">{stat.label}</p>
                    <stat.icon className="h-3.5 w-3.5 opacity-40 group-hover:opacity-70 transition-opacity" style={{ color: stat.color }} />
                  </div>
                  <p className="text-xl sm:text-2xl font-black" style={{ color: stat.color, fontVariantNumeric: 'tabular-nums' }}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Avg Resolution Time Banner */}
            {avgResolutionHours > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#161b22] border border-[#21262d] mb-6"
              >
                <Timer className="h-4 w-4 text-[#d29922] shrink-0" />
                <span className="text-xs text-[#7d8590]">
                  Average resolution time: <span className="font-bold text-[#f0f6fc]">{avgResolutionHours}h</span>
                </span>
                <span className="text-[10px] text-[#484f58]">•</span>
                <span className="text-xs text-[#7d8590]">
                  <span className="font-bold text-[#f0f6fc]">{resolvedIssues.length}</span> issues resolved
                </span>
              </motion.div>
            )}

            {/* Analytics Charts (collapsible) */}
            <AnimatePresence>
              {showAnalytics && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <AnalyticsCharts issues={issues} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-4 p-1 rounded-xl bg-[#0d1117] border border-[#21262d] w-fit">
              {TABS.map(tab => {
                const count = tab.key === 'all' ? sorted.length
                  : tab.key === 'attention' ? issues.filter(i => i.status === 'pending' || i.status === 'awaiting-confirmation').length
                  : stats.resolved
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab.key
                        ? 'bg-[#161b22] text-[#f0f6fc] shadow-sm border border-[#21262d]'
                        : 'text-[#484f58] hover:text-[#7d8590]'
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      activeTab === tab.key ? 'bg-[#21262d] text-[#f0f6fc]' : 'bg-[#0d1117] text-[#484f58]'
                    }`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Search + Filters Bar */}
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#484f58]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title..."
                    className="w-full rounded-xl border border-[#21262d] bg-[#0d1117] ps-10 pe-4 py-2.5 text-xs sm:text-sm text-[#f0f6fc] placeholder-[#484f58] focus:border-[#58a6ff]/50 focus:outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowFilters(prev => !prev)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      showFilters || activeFiltersCount > 0
                        ? 'bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#bc8cff]'
                        : 'bg-[#161b22] border border-[#21262d] text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#30363d]'
                    }`}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#7c3aed]/20 text-[10px] font-bold">{activeFiltersCount}</span>
                    )}
                  </button>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="rounded-xl border border-[#21262d] bg-[#0d1117] px-3 py-2.5 text-xs text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none transition-colors"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ExportButton issues={sorted} />
                </div>
              </div>

              {/* Expandable Filter Row */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#0d1117] border border-[#21262d]">
                      <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-lg border border-[#21262d] bg-[#161b22] px-3 py-2 text-xs text-[#f0f6fc] focus:outline-none">
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="awaiting-confirmation">Awaiting Confirmation</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="rounded-lg border border-[#21262d] bg-[#161b22] px-3 py-2 text-xs text-[#f0f6fc] focus:outline-none">
                        <option value="all">All Categories</option>
                        <option value="pothole">Pothole</option>
                        <option value="streetlight">Streetlight</option>
                        <option value="garbage">Garbage</option>
                        <option value="water">Water Issue</option>
                        <option value="other">Other</option>
                      </select>
                      <select value={filterDateRange} onChange={e => setFilterDateRange(e.target.value)} className="rounded-lg border border-[#21262d] bg-[#161b22] px-3 py-2 text-xs text-[#f0f6fc] focus:outline-none">
                        {DATE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={() => { setFilterStatus('all'); setFilterCategory('all'); setFilterDateRange('all') }}
                          className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-semibold text-[#f85149] hover:bg-[#f85149]/10 transition-colors"
                        >
                          <X className="h-3 w-3" /> Clear
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-[#7c3aed]/8 border border-[#7c3aed]/20"
                >
                  <CheckSquare className="h-4 w-4 text-[#bc8cff] shrink-0" />
                  <span className="text-xs font-semibold text-[#bc8cff]">{selectedIds.size} selected</span>
                  <select
                    value={bulkAction}
                    onChange={e => setBulkAction(e.target.value)}
                    className="rounded-lg border border-[#21262d] bg-[#0d1117] px-3 py-1.5 text-xs text-[#f0f6fc] focus:outline-none"
                  >
                    <option value="">Bulk action...</option>
                    <option value="pending">Set Pending</option>
                    <option value="in-progress">Set In Progress</option>
                    <option value="resolved">Set Resolved</option>
                    <option value="delete">Delete Selected</option>
                  </select>
                  <Button size="sm" variant={bulkAction === 'delete' ? 'danger' : 'primary'} onClick={handleBulkAction} disabled={!bulkAction}>
                    Apply
                  </Button>
                  <button onClick={() => setSelectedIds(new Set())} className="text-xs text-[#484f58] hover:text-[#7d8590] transition-colors ml-auto">
                    Deselect all
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Issues Table / Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-[#21262d] bg-[#0d1117] overflow-hidden"
              >
                {/* ===== MOBILE CARDS (<md) ===== */}
                <div className="block md:hidden divide-y divide-[#21262d]/60">
                  {paginatedIssues.map(issue => {
                    const upvotes = issue.upvoteCount ?? issue.upvotes ?? 0
                    const priority = getPriority(upvotes)
                    return (
                      <div key={issue._id} className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <button onClick={() => toggleSelect(issue._id)} className="mt-1 shrink-0">
                            {selectedIds.has(issue._id)
                              ? <CheckSquare className="h-4 w-4 text-[#bc8cff]" />
                              : <Square className="h-4 w-4 text-[#30363d]" />
                            }
                          </button>
                          <div className="flex-1 min-w-0">
                            <a href={`/issue/${issue._id}`} className="text-sm font-semibold text-[#f0f6fc] hover:text-[#58a6ff] transition-colors leading-snug">
                              {issue.title}
                            </a>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <StatusBadge status={issue.status} />
                              <CategoryIcon category={issue.category} showLabel />
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ backgroundColor: `${priority.bg}15`, color: priority.color, border: `1px solid ${priority.color}25` }}>
                                {priority.label}
                              </span>
                            </div>
                          </div>
                          <button onClick={() => setDeleteModal({ open: true, issue })} className="p-1.5 rounded-lg text-[#484f58] hover:text-[#f85149] hover:bg-[#f85149]/10 transition-colors shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pl-7">
                          <select value={issue.status} onChange={e => handleStatusChange(issue._id, e.target.value)} className="rounded-lg border border-[#21262d] bg-[#06080d] px-2.5 py-1.5 text-[11px] text-[#f0f6fc] focus:outline-none font-medium">
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="awaiting-confirmation">Awaiting Confirmation</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          <select value={issue.assignedDept || ''} onChange={e => handleDeptChange(issue._id, e.target.value)} className="rounded-lg border border-[#21262d] bg-[#06080d] px-2.5 py-1.5 text-[11px] text-[#f0f6fc] focus:outline-none">
                            <option value="">Assign Dept...</option>
                            {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#484f58] pl-7">
                          <span>{issue.reporter?.name || 'Anonymous'}</span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {upvotes}</span>
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* ===== DESKTOP TABLE (>=md) ===== */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#21262d] bg-[#06080d]/70">
                        <th className="text-center w-10 px-3 py-3.5">
                          <button onClick={() => toggleSelectAll(pageIds)} className="text-[#484f58] hover:text-[#7d8590]">
                            {allPageSelected ? <CheckSquare className="h-4 w-4 text-[#bc8cff]" /> : somePageSelected ? <Minus className="h-4 w-4 text-[#7d8590]" /> : <Square className="h-4 w-4" />}
                          </button>
                        </th>
                        <th className="text-start text-[11px] font-semibold text-[#484f58] px-4 py-3.5 uppercase tracking-wider">Title</th>
                        <th className="text-start text-[11px] font-semibold text-[#484f58] px-4 py-3.5 uppercase tracking-wider">Category</th>
                        <th className="text-start text-[11px] font-semibold text-[#484f58] px-4 py-3.5 uppercase tracking-wider">Status</th>
                        <th className="text-start text-[11px] font-semibold text-[#484f58] px-4 py-3.5 uppercase tracking-wider">Department</th>
                        <th className="text-start text-[11px] font-semibold text-[#484f58] px-4 py-3.5 uppercase tracking-wider">Priority</th>
                        <th className="text-start text-[11px] font-semibold text-[#484f58] px-4 py-3.5 uppercase tracking-wider">Reporter</th>
                        <th className="text-start text-[11px] font-semibold text-[#484f58] px-4 py-3.5 uppercase tracking-wider">Date</th>
                        <th className="text-center text-[11px] font-semibold text-[#484f58] px-4 py-3.5 uppercase tracking-wider w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedIssues.map(issue => {
                        const upvotes = issue.upvoteCount ?? issue.upvotes ?? 0
                        const priority = getPriority(upvotes)
                        const isExpanded = expandedRow === issue._id
                        return (
                          <>
                            <tr
                              key={issue._id}
                              className={`border-b border-[#21262d]/30 transition-colors ${selectedIds.has(issue._id) ? 'bg-[#7c3aed]/5' : 'hover:bg-[#161b22]/50'}`}
                            >
                              <td className="text-center px-3 py-3">
                                <button onClick={() => toggleSelect(issue._id)}>
                                  {selectedIds.has(issue._id) ? <CheckSquare className="h-4 w-4 text-[#bc8cff]" /> : <Square className="h-4 w-4 text-[#30363d] hover:text-[#484f58]" />}
                                </button>
                              </td>
                              <td className="px-4 py-3 max-w-[220px]">
                                <a href={`/issue/${issue._id}`} className="text-sm text-[#f0f6fc] hover:text-[#58a6ff] font-medium transition-colors truncate block">
                                  {issue.title}
                                </a>
                                {issue.address && (
                                  <p className="text-[10px] text-[#30363d] mt-0.5 truncate flex items-center gap-1"><MapPin className="h-2.5 w-2.5 shrink-0" /> {issue.address}</p>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <CategoryIcon category={issue.category} showLabel />
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={issue.status}
                                  onChange={e => handleStatusChange(issue._id, e.target.value)}
                                  className="rounded-lg border border-[#21262d] bg-[#06080d] px-2.5 py-1.5 text-[11px] text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none font-medium"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="awaiting-confirmation">Awaiting</option>
                                  <option value="resolved">Resolved</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={issue.assignedDept || ''}
                                  onChange={e => handleDeptChange(issue._id, e.target.value)}
                                  className="rounded-lg border border-[#21262d] bg-[#06080d] px-2.5 py-1.5 text-[11px] text-[#f0f6fc] focus:outline-none"
                                >
                                  <option value="">Unassigned</option>
                                  {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${priority.bg}15`, color: priority.color, border: `1px solid ${priority.color}25` }}>
                                    {priority.label}
                                  </span>
                                  <span className="text-[10px] text-[#484f58] flex items-center gap-0.5">
                                    <Heart className="h-2.5 w-2.5" /> {upvotes}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center shrink-0">
                                    <span className="text-[8px] font-bold text-white">{(issue.reporter?.name || 'A').charAt(0).toUpperCase()}</span>
                                  </div>
                                  <span className="text-xs text-[#7d8590] truncate max-w-[100px]">{issue.reporter?.name || 'Anonymous'}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-[11px] text-[#484f58] font-mono whitespace-nowrap">
                                {formatTimeAgo(issue.createdAt)}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => setExpandedRow(isExpanded ? null : issue._id)}
                                    className="rounded-lg p-1.5 text-[#484f58] hover:text-[#58a6ff] hover:bg-[#58a6ff]/10 transition-all"
                                    title="View details"
                                  >
                                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                  </button>
                                  <button
                                    onClick={() => setDeleteModal({ open: true, issue })}
                                    className="rounded-lg p-1.5 text-[#484f58] hover:text-[#f85149] hover:bg-[#f85149]/10 transition-all"
                                    title="Delete issue"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <AnimatePresence>
                              {isExpanded && <RowDetail key={`detail-${issue._id}`} issue={issue} />}
                            </AnimatePresence>
                          </>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination / Empty */}
                {sorted.length === 0 ? (
                  <div className="py-16 text-center">
                    <Search className="h-8 w-8 text-[#21262d] mx-auto mb-3" />
                    <p className="text-sm text-[#484f58]">{t('noIssues', { defaultValue: 'No issues found' })}</p>
                    <p className="text-xs text-[#30363d] mt-1">Try adjusting your filters or search query</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#21262d] bg-[#06080d]/30 px-4 sm:px-5 py-3 text-xs text-[#7d8590]">
                    <div>
                      Showing <span className="font-semibold text-[#f0f6fc]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                      <span className="font-semibold text-[#f0f6fc]">{Math.min(currentPage * pageSize, sorted.length)}</span> of{' '}
                      <span className="font-semibold text-[#f0f6fc]">{sorted.length}</span> issues
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage <= 1}
                        className="rounded-lg border border-[#21262d] bg-[#0d1117] p-2 hover:border-[#30363d] hover:bg-[#161b22] disabled:opacity-30 transition-all"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page
                        if (totalPages <= 5) page = i + 1
                        else if (currentPage <= 3) page = i + 1
                        else if (currentPage >= totalPages - 2) page = totalPages - 4 + i
                        else page = currentPage - 2 + i
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-all ${
                              currentPage === page
                                ? 'bg-[#7c3aed]/15 border border-[#7c3aed]/30 text-[#bc8cff]'
                                : 'border border-[#21262d] bg-[#0d1117] text-[#484f58] hover:text-[#7d8590] hover:border-[#30363d]'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages}
                        className="rounded-lg border border-[#21262d] bg-[#0d1117] p-2 hover:border-[#30363d] hover:bg-[#161b22] disabled:opacity-30 transition-all"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* ===== ACTIVITY FEED SIDEBAR (Desktop) ===== */}
          <AnimatePresence>
            {showActivity && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 280 }}
                exit={{ opacity: 0, width: 0 }}
                className="hidden lg:block shrink-0 overflow-hidden"
              >
                <div className="w-[280px] rounded-2xl border border-[#21262d] bg-[#0d1117] p-4 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[#bc8cff]" />
                      <h3 className="text-sm font-bold text-[#f0f6fc]">Live Activity</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#3fb950] animate-pulse" />
                      <span className="text-[10px] text-[#484f58]">Real-time</span>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin">
                    {activityFeed.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-6 w-6 text-[#21262d] mx-auto mb-2" />
                        <p className="text-[11px] text-[#484f58]">Activity will appear here as events happen in real-time</p>
                      </div>
                    ) : (
                      activityFeed.map(event => (
                        <ActivityItem key={event.id} event={event} />
                      ))
                    )}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, issue: null })}
        title={t('deleteIssue', { defaultValue: 'Delete Issue' })}
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#f85149]/5 border border-[#f85149]/10">
            <AlertTriangle className="h-5 w-5 text-[#f85149] shrink-0 mt-0.5" />
            <p className="text-sm text-[#7d8590]">
              Are you sure you want to delete &ldquo;{deleteModal.issue?.title}&rdquo;? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, issue: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
