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
import { UserPlus } from 'lucide-react'

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
    <div className="flex min-h-[calc(100vh-56px)] mt-14 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-[#2a2d3e] bg-[#1a1d27] p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#f0f0f0]">Create Account</h1>
          <p className="text-sm text-[#8b8fa8] mt-2">Join to report and track civic issues</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <p className="text-sm text-[#8b8fa8] text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#3b82f6] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
