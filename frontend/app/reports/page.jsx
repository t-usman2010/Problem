'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { useIssues } from '@/hooks/useIssues'
import IssueCard from '@/components/issue/IssueCard'
import EmptyState from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/SkeletonLoader'
import { CATEGORIES, STATUSES } from '@/lib/constants'
import { 
  FileText, 
  Search, 
  Filter, 
  MapPin, 
  Plus, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Sparkles 
} from 'lucide-react'

export default function ReportsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'upvotes'

  const { issues, loading } = useIssues({
    category: selectedCategory,
    status: selectedStatus
  })

  // Filter & sort
  const filteredIssues = useMemo(() => {
    let list = [...issues]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(i => 
        i.title?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.address?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'upvotes') {
      list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return list
  }, [issues, searchQuery, sortBy])

  // Stats calculation
  const totalReports = issues.length
  const pendingCount = issues.filter(i => i.status === 'pending').length
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length
  const resolvedCount = issues.filter(i => i.status === 'resolved').length

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-4 sm:px-6 py-10 max-w-5xl mx-auto">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#58a6ff]/5 rounded-full blur-3xl" />
        <div className="absolute top-60 right-1/4 w-96 h-96 bg-[#bc8cff]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/20 text-xs font-semibold text-[#58a6ff] mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Citywide Civic Feed
            </div>
            <h1 className="text-3xl font-extrabold text-[#f0f6fc] tracking-tight">
              Community Reports
            </h1>
            <p className="text-sm text-[#7d8590] mt-1.5 max-w-xl">
              Explore civic issues reported by citizens across the municipality. Track real-time progress and upvote urgent matters.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/map"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] hover:border-[#30363d] transition-all flex items-center gap-2 shadow-sm"
            >
              <MapPin className="w-4 h-4 text-[#58a6ff]" /> View on Map
            </Link>
            <Link
              href="/report"
              className="btn-gradient px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Report Issue
            </Link>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
          <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#21262d]">
            <span className="text-xs font-medium text-[#7d8590] block mb-1">Total Reports</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#f0f6fc]">{totalReports}</span>
              <span className="text-[10px] text-[#3fb950] font-semibold">Live</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#21262d]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#7d8590] mb-1">
              <Clock className="w-3.5 h-3.5 text-[#ef4444]" /> Pending
            </div>
            <span className="text-2xl font-bold text-[#f0f6fc]">{pendingCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#21262d]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#7d8590] mb-1">
              <Loader2 className="w-3.5 h-3.5 text-[#eab308]" /> In Progress
            </div>
            <span className="text-2xl font-bold text-[#f0f6fc]">{inProgressCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#21262d]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#7d8590] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> Resolved
            </div>
            <span className="text-2xl font-bold text-[#f0f6fc]">{resolvedCount}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#21262d] mb-8 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7d8590]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, location or keywords..."
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#161b22] border border-[#21262d] text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]/50 transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[#7d8590] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[#161b22] border border-[#21262d] text-xs font-medium text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
              >
                <option value="newest">Newest First</option>
                <option value="upvotes">Most Upvoted</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#21262d]/60">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium text-[#7d8590] me-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#58a6ff] text-white shadow-sm'
                    : 'bg-[#161b22] text-[#7d8590] hover:text-[#f0f6fc] border border-[#21262d]'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-[#58a6ff] text-white shadow-sm'
                      : 'bg-[#161b22] text-[#7d8590] hover:text-[#f0f6fc] border border-[#21262d]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium text-[#7d8590] me-1">Status:</span>
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                  selectedStatus === 'all'
                    ? 'bg-[#58a6ff] text-white'
                    : 'bg-[#161b22] text-[#7d8590] hover:text-[#f0f6fc] border border-[#21262d]'
                }`}
              >
                All
              </button>
              {STATUSES.map(st => (
                <button
                  key={st.value}
                  onClick={() => setSelectedStatus(st.value)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    selectedStatus === st.value
                      ? 'bg-[#58a6ff] text-white'
                      : 'bg-[#161b22] text-[#7d8590] hover:text-[#f0f6fc] border border-[#21262d]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Issues Feed */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filteredIssues.length === 0 ? (
          <EmptyState
            icon={FileText}
            message="No civic reports match your filter criteria. Try adjusting filters or be the first to report!"
            actionLabel="Submit a Report"
            onAction={() => router.push('/report')}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredIssues.map((issue, idx) => (
              <motion.div
                key={issue._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
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
