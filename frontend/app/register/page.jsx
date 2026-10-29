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
import { useTranslations } from '@/context/LocaleContext'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const t = useTranslations('auth')
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await registerUser(data.name, data.email, data.password)
      toast.success(t('accountCreated', { defaultValue: 'Account created! Welcome!' }))
      router.push('/map')
    } catch (err) {
      toast.error(err.response?.data?.message || t('registrationFailed', { defaultValue: 'Registration failed' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] mt-16 items-center justify-center px-4 py-8 pb-28 md:pb-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-80 sm:w-96 h-80 sm:h-96 bg-[#bc8cff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-72 sm:w-80 h-72 sm:h-80 bg-[#39d2c0]/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm glass-card p-6 sm:p-8">
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#bc8cff]/30 to-transparent" />
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto mb-4 sm:mb-5 relative w-fit">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#bc8cff] to-[#39d2c0] blur-xl opacity-30" />
            <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-[#bc8cff] to-[#39d2c0]">
              <UserPlus className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f0f6fc]">{t('registerTitle')}</h1>
          <p className="text-xs sm:text-sm text-[#7d8590] mt-1.5 sm:mt-2">{t('registerSubtitle')}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          <Input
            label={t('name')}
            placeholder="Your name"
            dir="auto"
            className="text-start [unicode-bidi:plaintext]"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label={t('email')}
            type="email"
            placeholder="you@example.com"
            dir="ltr"
            className="text-start untranslated"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label={t('password')}
            type="password"
            placeholder="••••••••"
            dir="ltr"
            className="text-start untranslated"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" loading={loading}>
            <UserPlus className="h-4 w-4" />
            {t('registerButton')}
          </Button>
        </form>
        <p className="text-xs sm:text-sm text-[#7d8590] text-center mt-6 sm:mt-8">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors font-medium">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}
