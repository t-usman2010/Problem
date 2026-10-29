import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] mt-16 items-center justify-center px-4 py-8 pb-28 md:pb-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#58a6ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-80 h-72 sm:h-80 bg-[#bc8cff]/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm glass-card p-6 sm:p-8">
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#58a6ff]/30 to-transparent" />
        <LoginForm />
      </div>
    </div>
  )
}
