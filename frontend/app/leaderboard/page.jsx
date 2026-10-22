'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { useTranslations } from '@/context/LocaleContext'
import { Trophy, Award, ThumbsUp, FileText, CheckCircle2, Crown, Medal, Sparkles } from 'lucide-react'
import Spinner from '@/components/ui/Spinner'
import { motion } from 'motion/react'

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const t = useTranslations('leaderboard')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard')
        setLeaders(response.data)
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        setError('Failed to load leaderboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const rankStyles = [
    { bg: 'bg-gradient-to-br from-[#d29922]/20 to-[#d29922]/5', border: 'border-[#d29922]/30', text: 'text-[#d29922]', glow: 'shadow-[0_0_20px_rgba(210,153,34,0.15)]', icon: Crown },
    { bg: 'bg-gradient-to-br from-[#7d8590]/20 to-[#7d8590]/5', border: 'border-[#7d8590]/30', text: 'text-[#c9d1d9]', glow: '', icon: Medal },
    { bg: 'bg-gradient-to-br from-[#da7756]/20 to-[#da7756]/5', border: 'border-[#da7756]/30', text: 'text-[#da7756]', glow: '', icon: Medal }
  ]

  return (
    <main className="relative min-h-[calc(100vh-64px)] mt-16 p-4 md:p-8">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-[#d29922]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-[#58a6ff]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[#d29922]/20 blur-xl" />
            <div className="relative p-3.5 bg-[#0d1117] rounded-2xl border border-[#d29922]/20">
              <Trophy className="h-7 w-7 text-[#d29922]" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f0f6fc]">{t('title', { defaultValue: 'Public Leaderboard' })}</h1>
            <p className="text-[#7d8590] text-sm">{t('subtitle', { defaultValue: 'Top citizen reporters making a difference in the community' })}</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-[#f85149] glass-card p-8">
            {error}
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-16 glass-card flex flex-col items-center p-8">
            <div className="p-4 rounded-2xl bg-[#161b22] border border-[#21262d] mb-4">
              <Award className="h-12 w-12 text-[#7d8590]" />
            </div>
            <h3 className="text-lg font-bold text-[#f0f6fc]">{t('noLeaders', { defaultValue: 'No leaders yet' })}</h3>
            <p className="text-[#7d8590] mt-2">{t('beFirst', { defaultValue: 'Be the first to report an issue and top the leaderboard!' })}</p>
          </div>
        ) : (
          <>
            {/* Top 3 Cards */}
            {leaders.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 0, 2].map((rankIdx, gridIdx) => {
                  const leader = leaders[rankIdx]
                  if (!leader) return null
                  const style = rankStyles[rankIdx]
                  const RankIcon = style.icon
                  const isFirst = rankIdx === 0
                  return (
                    <motion.div
                      key={leader.userId}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gridIdx * 0.15 }}
                      className={`relative rounded-2xl border ${style.border} ${style.bg} p-6 text-center ${style.glow} ${isFirst ? 'md:-mt-4' : ''}`}
                    >
                      {isFirst && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Sparkles className="h-6 w-6 text-[#d29922]" />
                        </div>
                      )}
                      <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${style.bg} border ${style.border}`}>
                        <RankIcon className={`h-7 w-7 ${style.text}`} />
                      </div>
                      <div className={`text-2xl font-black ${style.text} mb-1`}>#{rankIdx + 1}</div>
                      <h3 className="text-sm font-bold text-[#f0f6fc] mb-1 truncate">{leader.name}</h3>
                      <div className="flex items-center justify-center gap-3 mt-3 text-xs text-[#7d8590]">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-[#58a6ff]" />
                          {leader.issuesReported}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-[#d29922]" />
                          {leader.totalUpvotesReceived}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-start text-sm whitespace-nowrap">
                  <thead className="bg-[#06080d]/50 text-[#7d8590] border-b border-[#21262d]">
                    <tr>
                      <th className="px-6 py-4 font-semibold w-24 text-center">{t('rank', { defaultValue: 'Rank' })}</th>
                      <th className="px-6 py-4 font-semibold text-start">{t('reporter', { defaultValue: 'Reporter' })}</th>
                      <th className="px-6 py-4 font-semibold text-center">{t('issuesReported', { defaultValue: 'Issues Reported' })}</th>
                      <th className="px-6 py-4 font-semibold text-center">{t('upvotesReceived', { defaultValue: 'Upvotes Received' })}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#21262d]">
                    {leaders.map((user, index) => {
                      const isVerified = user.issuesReported >= 5 || user.totalUpvotesReceived >= 10
                      const isTop3 = index < 3
                      return (
                        <tr key={user.userId} className="table-row-hover">
                          <td className="px-6 py-4 text-center">
                            {isTop3 ? (
                              <div
                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm`}
                                style={{
                                  backgroundColor: `${rankStyles[index].text.replace('text-[', '').replace(']', '')}20`,
                                  color: rankStyles[index].text.replace('text-[', '').replace(']', '')
                                }}
                              >
                                {index + 1}
                              </div>
                            ) : (
                              <span className="text-[#7d8590] font-medium tabular-nums">{index + 1}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-white">{user.name?.charAt(0)?.toUpperCase()}</span>
                              </div>
                              <span className="font-semibold text-[#f0f6fc]">{user.name}</span>
                              {isVerified && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#3fb950]/10 border border-[#3fb950]/20">
                                  <CheckCircle2 className="h-3 w-3 text-[#3fb950]" />
                                  <span className="text-[9px] font-bold text-[#3fb950] uppercase tracking-wider">Verified</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2 text-[#f0f6fc]">
                              <div className="p-1 rounded-lg bg-[#58a6ff]/10">
                                <FileText className="h-3.5 w-3.5 text-[#58a6ff]" />
                              </div>
                              <span className="tabular-nums font-semibold">{user.issuesReported}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2 text-[#f0f6fc]">
                              <div className="p-1 rounded-lg bg-[#d29922]/10">
                                <ThumbsUp className="h-3.5 w-3.5 text-[#d29922]" />
                              </div>
                              <span className="tabular-nums font-semibold">{user.totalUpvotesReceived}</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  )
}
