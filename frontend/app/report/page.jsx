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

  if (isLoading) return <div className="flex items-center justify-center min-h-[calc(100vh-56px)] mt-14"><Spinner size="lg" /></div>
  if (!user) return null

  return (
    <div className="min-h-[calc(100vh-56px)] mt-14 px-4 py-8">
      <ReportForm />
    </div>
  )
}
