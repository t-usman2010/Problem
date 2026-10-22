'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/validation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'
import { UserPlus, MapPin } from 'lucide-react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await registerUser(data.name, data.email, data.password)
      toast.success('Account created! Welcome!')
      router.push('/map')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] mt-16 items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-[#bc8cff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[#39d2c0]/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm glass-card p-8">
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#bc8cff]/30 to-transparent" />
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 relative w-fit">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#bc8cff] to-[#39d2c0] blur-xl opacity-30" />
            <div className="relative flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-[#bc8cff] to-[#39d2c0]">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#f0f6fc]">Create Account</h1>
          <p className="text-sm text-[#7d8590] mt-2">Join to report and track civic issues</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" loading={loading}>
            <UserPlus className="h-4 w-4" />
            Create Account
          </Button>
        </form>
        <p className="text-sm text-[#7d8590] text-center mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
