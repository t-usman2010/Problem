'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'
import { LogIn } from 'lucide-react'

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      router.push('/map')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-[#f0f0f0]">Welcome Back</h1>
        <p className="text-sm text-[#8b8fa8] mt-2">Sign in to report civic issues</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </form>
      <p className="text-sm text-[#8b8fa8] text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#3b82f6] hover:underline">Register</Link>
      </p>
    </div>
  )
}
