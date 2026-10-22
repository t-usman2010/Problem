'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import { useTranslations } from '@/context/LocaleContext'
import { BarChart3, CheckCircle, Clock, TrendingUp, AlertCircle, Activity } from 'lucide-react'
import { motion } from 'motion/react'

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

  if (loading) return <div className="flex items-center justify-center min-h-[calc(100vh-64px)] mt-16"><Spinner size="lg" /></div>

  const statCards = [
    { label: t('totalReported', { defaultValue: 'Total Reported' }), value: stats?.totalIssues || 0, icon: BarChart3, color: '#58a6ff', gradient: 'from-[#58a6ff]/20 to-[#58a6ff]/5' },
    { label: t('resolved', { defaultValue: 'Resolved' }), value: stats?.resolvedIssues || 0, icon: CheckCircle, color: '#3fb950', gradient: 'from-[#3fb950]/20 to-[#3fb950]/5' },
    { label: t('resolutionRate', { defaultValue: 'Resolution Rate' }), value: `${stats?.resolutionRate || 0}%`, icon: TrendingUp, color: '#d29922', gradient: 'from-[#d29922]/20 to-[#d29922]/5' },
    { label: t('avgResponseTime', { defaultValue: 'Avg. Response Time' }), value: stats?.avgResponseTime || 'N/A', icon: Clock, color: '#f85149', gradient: 'from-[#f85149]/20 to-[#f85149]/5' }
  ]

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-4 py-12 max-w-4xl mx-auto">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#58a6ff]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-[#3fb950]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="mx-auto mb-5 relative w-fit">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#58a6ff] to-[#3fb950] blur-xl opacity-20" />
            <div className="relative flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-[#58a6ff] to-[#3fb950]">
              <Activity className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black gradient-text">{t('title', { defaultValue: 'Public Transparency' })}</h1>
          <p className="text-sm text-[#7d8590] mt-3 max-w-lg mx-auto leading-relaxed">
            {t('subtitle', { defaultValue: 'Real-time accountability. See how reported civic issues are being addressed in your community.' })}
          </p>
        </motion.div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-[#f85149]/20 bg-[#f85149]/5 p-5 text-sm text-[#f85149]">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`stat-card rounded-2xl border border-[#21262d] bg-gradient-to-br ${stat.gradient} p-6 text-center hover:border-opacity-50 transition-all duration-300`}
              style={{ '--stat-color': stat.color }}
            >
              <div className="p-2.5 rounded-xl mx-auto mb-3 w-fit" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
              </div>
              <p className="text-3xl font-black text-[#f0f6fc] mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {stat.value}
              </p>
              <p className="text-xs text-[#7d8590] font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Category breakdown */}
        {stats?.categoryBreakdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-7"
          >
            <h2 className="text-lg font-bold text-[#f0f6fc] mb-6">{t('byCategory', { defaultValue: 'Issues by Category' })}</h2>
            <div className="space-y-4">
              {stats.categoryBreakdown.map(cat => (
                <div key={cat.category} className="flex items-center gap-4">
                  <span className="text-sm text-[#7d8590] w-28 shrink-0 font-medium">{cat.category}</span>
                  <div className="flex-1 h-3 rounded-full bg-[#0d1117] overflow-hidden border border-[#21262d]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.count / stats.totalIssues) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: cat.color || '#58a6ff',
                        boxShadow: `0 0 10px ${cat.color || '#58a6ff'}40`
                      }}
                    />
                  </div>
                  <span className="text-sm text-[#f0f6fc] w-10 text-right font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
