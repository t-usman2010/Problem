'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useTranslations } from '@/context/LocaleContext'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import CategoryIcon from '@/components/issue/CategoryIcon'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { Trash2, Search, BarChart3, AlertTriangle, ChevronLeft, ChevronRight, Shield, Activity } from 'lucide-react'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'
import ExportButton from '@/components/admin/ExportButton'
import { motion } from 'motion/react'

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const { socket } = useSocket()
  const toast = useToast()
  const t = useTranslations('admin')

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteModal, setDeleteModal] = useState({ open: false, issue: null })
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) router.push('/map')
  }, [user, isAdmin, isLoading, router])

  useEffect(() => {
    if (isAdmin) {
      api.get('/issues')
        .then(res => setIssues(res.data.issues || res.data))
        .catch(() => toast.error(t('loadFailed', { defaultValue: 'Failed to load issues' })))
        .finally(() => setLoading(false))
    }
  }, [isAdmin, toast, t])

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return
    const handleNew = (issue) => setIssues(prev => [issue, ...prev])
    const handleUpdated = (updated) => setIssues(prev => prev.map(i => i._id === updated._id ? { ...i, ...updated } : i))
    const handleDeleted = ({ id }) => setIssues(prev => prev.filter(i => i._id !== id))

    socket.on('issue:new', handleNew)
    socket.on('issue:updated', handleUpdated)
    socket.on('issue:deleted', handleDeleted)
    return () => {
      socket.off('issue:new', handleNew)
      socket.off('issue:updated', handleUpdated)
      socket.off('issue:deleted', handleDeleted)
    }
  }, [socket])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, filterStatus])

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await api.patch(`/issues/${issueId}/status`, { status: newStatus })
      setIssues(prev => prev.map(i => i._id === issueId ? { ...i, status: newStatus } : i))
      toast.success(t('statusSuccess', { defaultValue: 'Status updated' }))
    } catch {
      toast.error(t('statusFailed', { defaultValue: 'Failed to update status' }))
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

  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-64px)] mt-16"><Spinner size="lg" /></div>
  if (!user || !isAdmin) return null

  const filtered = issues.filter(i => {
    const matchesSearch = !debouncedSearch || i.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchesStatus = filterStatus === 'all' || i.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginatedIssues = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length
  }

  const statCards = [
    { label: t('totalIssues', { defaultValue: 'Total Issues' }), value: stats.total, color: '#58a6ff', gradient: 'from-[#58a6ff]/15 to-transparent' },
    { label: 'Pending', value: stats.pending, color: '#f85149', gradient: 'from-[#f85149]/15 to-transparent' },
    { label: 'In Progress', value: stats.inProgress, color: '#d29922', gradient: 'from-[#d29922]/15 to-transparent' },
    { label: 'Resolved', value: stats.resolved, color: '#3fb950', gradient: 'from-[#3fb950]/15 to-transparent' }
  ]

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-4 py-8 max-w-6xl mx-auto">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#bc8cff]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-[#58a6ff]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#bc8cff]/20 to-[#58a6ff]/20 border border-[#bc8cff]/10">
              <Shield className="h-5 w-5 text-[#bc8cff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#f0f6fc]">{t('title', { defaultValue: 'Admin Dashboard' })}</h1>
              <p className="text-xs text-[#7d8590]">Manage and monitor all reported issues</p>
            </div>
          </div>
          <button
            onClick={() => setShowAnalytics(prev => !prev)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              showAnalytics
                ? 'bg-[#58a6ff]/10 border border-[#58a6ff]/20 text-[#58a6ff] shadow-[0_0_20px_rgba(88,166,255,0.1)]'
                : 'bg-[#161b22] border border-[#21262d] text-[#7d8590] hover:text-[#f0f6fc] hover:border-[#30363d]'
            }`}
            aria-label={showAnalytics ? 'Hide analytics' : 'Show analytics'}
          >
            <Activity className="h-4 w-4" />
            {t('analytics', { defaultValue: 'Analytics' })}
          </button>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`stat-card rounded-2xl border border-[#21262d] bg-gradient-to-br ${stat.gradient} bg-[#0d1117] p-5`}
              style={{ '--stat-color': stat.color }}
            >
              <p className="text-xs text-[#7d8590] mb-2 font-medium">{stat.label}</p>
              <p className="text-3xl font-black" style={{ color: stat.color, fontVariantNumeric: 'tabular-nums' }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Analytics Charts (collapsible) */}
        {showAnalytics && <AnalyticsCharts issues={issues} />}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#484f58]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchIssues', { defaultValue: 'Search issues...' })}
              className="w-full rounded-xl border border-[#21262d] bg-[#0d1117] ps-11 pe-4 py-3 text-sm text-[#f0f6fc] placeholder-[#484f58] input-glow focus:border-[#58a6ff]/50 focus:outline-none transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-[#21262d] bg-[#0d1117] px-4 py-3 text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <ExportButton issues={filtered} />
        </div>

        {/* Table */}
        {loading ? (
          <Spinner className="py-16" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#21262d] bg-[#06080d]/50">
                    <th className="text-start text-xs font-semibold text-[#7d8590] px-5 py-4">Title</th>
                    <th className="text-start text-xs font-semibold text-[#7d8590] px-5 py-4">Category</th>
                    <th className="text-start text-xs font-semibold text-[#7d8590] px-5 py-4">Status</th>
                    <th className="text-start text-xs font-semibold text-[#7d8590] px-5 py-4">Reporter</th>
                    <th className="text-start text-xs font-semibold text-[#7d8590] px-5 py-4">Date</th>
                    <th className="text-start text-xs font-semibold text-[#7d8590] px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedIssues.map(issue => (
                    <tr key={issue._id} className="border-b border-[#21262d]/50 table-row-hover">
                      <td className="px-5 py-4">
                        <a href={`/issue/${issue._id}`} className="text-sm text-[#f0f6fc] hover:text-[#58a6ff] font-medium transition-colors">
                          {issue.title}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <CategoryIcon category={issue.category} showLabel />
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                          className="rounded-xl border border-[#21262d] bg-[#06080d] px-3 py-1.5 text-xs text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none transition-colors font-medium"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white">{(issue.reporter?.name || 'A').charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="text-sm text-[#7d8590]">{issue.reporter?.name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#484f58] font-mono">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setDeleteModal({ open: true, issue })}
                          className="rounded-xl p-2 text-[#484f58] hover:text-[#f85149] hover:bg-[#f85149]/10 transition-all duration-200"
                          aria-label="Delete issue"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-[#484f58]">{t('noIssues', { defaultValue: 'No issues found' })}</div>
            ) : (
              <div className="flex items-center justify-between border-t border-[#21262d] bg-[#06080d]/30 px-5 py-4 text-xs text-[#7d8590]">
                <div>
                  Showing <span className="font-semibold text-[#f0f6fc]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-semibold text-[#f0f6fc]">{Math.min(currentPage * pageSize, filtered.length)}</span> of{' '}
                  <span className="font-semibold text-[#f0f6fc]">{filtered.length}</span> issues
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                    className="rounded-xl border border-[#21262d] bg-[#0d1117] p-2 hover:border-[#30363d] hover:bg-[#161b22] disabled:opacity-30 transition-all"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1 rounded-lg bg-[#161b22] border border-[#21262d] font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                    className="rounded-xl border border-[#21262d] bg-[#0d1117] p-2 hover:border-[#30363d] hover:bg-[#161b22] disabled:opacity-30 transition-all"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

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
    </div>
  )
}
