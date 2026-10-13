import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] mt-14 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-[#2a2d3e] bg-[#1a1d27] p-8">
        <LoginForm />
      </div>
    </div>
  )
}
