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
import { LogIn, MapPin } from 'lucide-react'

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
        <div className="mx-auto mb-5 relative w-fit">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] blur-xl opacity-30" />
          <div className="relative flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-[#58a6ff] to-[#bc8cff]">
            <MapPin className="h-7 w-7 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#f0f6fc]">Welcome Back</h1>
        <p className="text-sm text-[#7d8590] mt-2">Sign in to report civic issues</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
      <p className="text-sm text-[#7d8590] text-center mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors font-medium">Register</Link>
      </p>
    </div>
  )
}
