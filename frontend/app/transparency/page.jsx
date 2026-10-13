'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import { useTranslations } from '@/context/LocaleContext'
import { BarChart3, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react'

export default function TransparencyPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const t = useTranslations('transparency')

  useEffect(() => {
    api.get('/stats/summary')
      .then(res => {
        setStats(res.data)
        setError(null)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load public transparency statistics')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-[calc(100vh-56px)] mt-14"><Spinner size="lg" /></div>

  return (
    <div className="min-h-[calc(100vh-56px)] mt-14 px-4 py-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#f0f0f0]">{t('title', { defaultValue: 'Public Transparency' })}</h1>
        <p className="text-sm text-[#8b8fa8] mt-2 max-w-lg mx-auto">
          {t('subtitle', { defaultValue: 'Real-time accountability. See how reported civic issues are being addressed in your community.' })}
        </p>
      </div>

      {error && (
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: t('totalReported', { defaultValue: 'Total Reported' }), value: stats?.totalIssues || 0, icon: BarChart3, color: '#3b82f6' },
          { label: t('resolved', { defaultValue: 'Resolved' }), value: stats?.resolvedIssues || 0, icon: CheckCircle, color: '#22c55e' },
          { label: t('resolutionRate', { defaultValue: 'Resolution Rate' }), value: `${stats?.resolutionRate || 0}%`, icon: TrendingUp, color: '#eab308' },
          { label: t('avgResponseTime', { defaultValue: 'Avg. Response Time' }), value: stats?.avgResponseTime || 'N/A', icon: Clock, color: '#ef4444' }
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-[#2a2d3e] bg-[#1a1d27] p-6 text-center">
            <stat.icon className="h-8 w-8 mx-auto mb-3" style={{ color: stat.color }} />
            <p className="text-3xl font-semibold text-[#f0f0f0] mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {stat.value}
            </p>
            <p className="text-xs text-[#8b8fa8]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {stats?.categoryBreakdown && (
        <div className="rounded-lg border border-[#2a2d3e] bg-[#1a1d27] p-6">
          <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4">{t('byCategory', { defaultValue: 'Issues by Category' })}</h2>
          <div className="space-y-3">
            {stats.categoryBreakdown.map(cat => (
              <div key={cat.category} className="flex items-center gap-3">
                <span className="text-sm text-[#8b8fa8] w-24">{cat.category}</span>
                <div className="flex-1 h-3 rounded-full bg-[#0f1117] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(cat.count / stats.totalIssues) * 100}%`,
                      backgroundColor: cat.color || '#3b82f6'
                    }}
                  />
                </div>
                <span className="text-sm text-[#f0f0f0] w-8 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
