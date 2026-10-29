'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Spinner from '@/components/ui/Spinner'
import ReportForm from '@/components/forms/ReportForm'

export default function ReportPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-64px)] mt-16"><Spinner size="lg" /></div>
  if (!user) return null

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-3 sm:px-6 py-6 sm:py-10 pb-28 md:pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 sm:w-80 h-72 sm:h-80 bg-[#58a6ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-60 sm:w-64 h-60 sm:h-64 bg-[#bc8cff]/5 rounded-full blur-3xl" />
      </div>
      <div className="relative">
        <ReportForm />
      </div>
    </div>
  )
}
