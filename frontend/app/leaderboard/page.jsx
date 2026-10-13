'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { useTranslations } from '@/context/LocaleContext'
import { Trophy, Award, ThumbsUp, FileText, CheckCircle2 } from 'lucide-react'
import Spinner from '@/components/ui/Spinner'

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

  return (
    <main className="min-h-[calc(100vh-56px)] mt-14 bg-[#0f1117] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-[#1a1d27] rounded-xl border border-[#2a2d3e]">
            <Trophy className="h-6 w-6 text-[#eab308]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f0f0f0]">{t('title', { defaultValue: 'Public Leaderboard' })}</h1>
            <p className="text-[#8b8fa8]">{t('subtitle', { defaultValue: 'Top citizen reporters making a difference in the community' })}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-[#ef4444] bg-[#1a1d27] rounded-xl border border-[#2a2d3e]">
            {error}
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-12 bg-[#1a1d27] rounded-xl border border-[#2a2d3e] flex flex-col items-center">
            <Award className="h-12 w-12 text-[#8b8fa8] mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[#f0f0f0]">{t('noLeaders', { defaultValue: 'No leaders yet' })}</h3>
            <p className="text-[#8b8fa8]">{t('beFirst', { defaultValue: 'Be the first to report an issue and top the leaderboard!' })}</p>
          </div>
        ) : (
          <div className="bg-[#1a1d27] rounded-xl border border-[#2a2d3e] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm whitespace-nowrap">
                <thead className="bg-[#0f1117]/50 text-[#8b8fa8] border-b border-[#2a2d3e]">
                  <tr>
                    <th className="px-6 py-4 font-medium w-24 text-center">{t('rank', { defaultValue: 'Rank' })}</th>
                    <th className="px-6 py-4 font-medium text-start">{t('reporter', { defaultValue: 'Reporter' })}</th>
                    <th className="px-6 py-4 font-medium text-center">{t('issuesReported', { defaultValue: 'Issues Reported' })}</th>
                    <th className="px-6 py-4 font-medium text-center">{t('upvotesReceived', { defaultValue: 'Upvotes Received' })}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2d3e]">
                  {leaders.map((user, index) => {
                    const isVerified = user.issuesReported >= 5 || user.totalUpvotesReceived >= 10
                    return (
                      <tr key={user.userId} className="hover:bg-[#0f1117]/30 transition-colors">
                        <td className="px-6 py-4 text-center">
                          {index === 0 ? (
                            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#eab308]/20 text-[#eab308] font-bold">
                              1
                            </div>
                          ) : index === 1 ? (
                            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-300/20 text-slate-300 font-bold">
                              2
                            </div>
                          ) : index === 2 ? (
                            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-amber-600/20 text-amber-600 font-bold">
                              3
                            </div>
                          ) : (
                            <span className="text-[#8b8fa8] font-medium tabular-nums">{index + 1}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#f0f0f0]">{user.name}</span>
                            {isVerified && (
                              <div
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20"
                                title="Community Verified"
                              >
                                <CheckCircle2 className="h-3 w-3 text-[#22c55e]" />
                                <span className="text-[10px] font-medium text-[#22c55e] uppercase tracking-wider">Verified</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5 text-[#f0f0f0]">
                            <FileText className="h-4 w-4 text-[#3b82f6]" />
                            <span className="tabular-nums font-medium">{user.issuesReported}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5 text-[#f0f0f0]">
                            <ThumbsUp className="h-4 w-4 text-[#eab308]" />
                            <span className="tabular-nums font-medium">{user.totalUpvotesReceived}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
