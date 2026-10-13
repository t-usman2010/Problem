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
import { Trash2, Search, BarChart3, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'
import ExportButton from '@/components/admin/ExportButton'

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

  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-56px)] mt-14"><Spinner size="lg" /></div>
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

  return (
    <div className="min-h-[calc(100vh-56px)] mt-14 px-4 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#f0f0f0]">{t('title', { defaultValue: 'Admin Dashboard' })}</h1>
        <button
          onClick={() => setShowAnalytics(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            showAnalytics
              ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]'
              : 'border-[#2a2d3e] bg-[#1a1d27] text-[#8b8fa8] hover:text-[#f0f0f0]'
          }`}
          aria-label={showAnalytics ? 'Hide analytics' : 'Show analytics'}
        >
          <BarChart3 className="h-4 w-4" />
          {t('analytics', { defaultValue: 'Analytics' })}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: t('totalIssues', { defaultValue: 'Total Issues' }), value: stats.total, color: '#3b82f6' },
          { label: 'Pending', value: stats.pending, color: '#ef4444' },
          { label: 'In Progress', value: stats.inProgress, color: '#eab308' },
          { label: 'Resolved', value: stats.resolved, color: '#22c55e' }
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-[#2a2d3e] bg-[#1a1d27] p-4">
            <p className="text-xs text-[#8b8fa8] mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold" style={{ color: stat.color, fontVariantNumeric: 'tabular-nums' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics Charts (collapsible) */}
      {showAnalytics && <AnalyticsCharts issues={issues} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b8fa8]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchIssues', { defaultValue: 'Search issues...' })}
            className="w-full rounded-lg border border-[#2a2d3e] bg-[#1a1d27] ps-10 pe-4 py-2 text-sm text-[#f0f0f0] placeholder-[#8b8fa8] focus:border-[#3b82f6] focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-[#2a2d3e] bg-[#1a1d27] px-4 py-2 text-sm text-[#f0f0f0] focus:border-[#3b82f6] focus:outline-none"
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
        <div className="rounded-lg border border-[#2a2d3e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2d3e] bg-[#1a1d27]">
                  <th className="text-start text-xs font-medium text-[#8b8fa8] px-4 py-3">Title</th>
                  <th className="text-start text-xs font-medium text-[#8b8fa8] px-4 py-3">Category</th>
                  <th className="text-start text-xs font-medium text-[#8b8fa8] px-4 py-3">Status</th>
                  <th className="text-start text-xs font-medium text-[#8b8fa8] px-4 py-3">Reporter</th>
                  <th className="text-start text-xs font-medium text-[#8b8fa8] px-4 py-3">Date</th>
                  <th className="text-start text-xs font-medium text-[#8b8fa8] px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIssues.map(issue => (
                  <tr key={issue._id} className="border-b border-[#2a2d3e] hover:bg-[#1a1d27]/50">
                    <td className="px-4 py-3">
                      <a href={`/issue/${issue._id}`} className="text-sm text-[#f0f0f0] hover:text-[#3b82f6]">
                        {issue.title}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryIcon category={issue.category} showLabel />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                        className="rounded-lg border border-[#2a2d3e] bg-[#0f1117] px-2 py-1 text-xs text-[#f0f0f0] focus:border-[#3b82f6] focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8b8fa8]">
                      {issue.reporter?.name || 'Anonymous'}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8b8fa8]">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteModal({ open: true, issue })}
                        className="rounded-lg p-1.5 text-[#8b8fa8] hover:text-red-400 hover:bg-red-400/10 transition-colors"
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
            <div className="py-12 text-center text-sm text-[#8b8fa8]">{t('noIssues', { defaultValue: 'No issues found' })}</div>
          ) : (
            <div className="flex items-center justify-between border-t border-[#2a2d3e] bg-[#1a1d27] px-4 py-3 text-xs text-[#8b8fa8]">
              <div>
                Showing <span className="font-medium text-[#f0f0f0]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium text-[#f0f0f0]">{Math.min(currentPage * pageSize, filtered.length)}</span> of{' '}
                <span className="font-medium text-[#f0f0f0]">{filtered.length}</span> issues
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage <= 1}
                  className="rounded-md border border-[#2a2d3e] bg-[#0f1117] p-1.5 hover:border-[#8b8fa8] disabled:opacity-40 disabled:hover:border-[#2a2d3e] transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="rounded-md border border-[#2a2d3e] bg-[#0f1117] p-1.5 hover:border-[#8b8fa8] disabled:opacity-40 disabled:hover:border-[#2a2d3e] transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, issue: null })}
        title={t('deleteIssue', { defaultValue: 'Delete Issue' })}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-[#8b8fa8]">
              Are you sure you want to delete &ldquo;{deleteModal.issue?.title}&rdquo;? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, issue: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
