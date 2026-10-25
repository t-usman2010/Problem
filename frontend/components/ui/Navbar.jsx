'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useSocket } from '@/context/SocketContext'
import { useTranslations } from '@/context/LocaleContext'
import { 
  Home, 
  MapPin, 
  LayoutDashboard, 
  FileText, 
  UserCheck, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Shield, 
  Info, 
  HelpCircle 
} from 'lucide-react'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { isConnected } = useSocket()
  const pathname = usePathname()
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')

  const navLinks = [
    { href: '/', label: tNav('home', { defaultValue: 'Home' }), icon: Home },
    { href: '/map', label: tNav('map', { defaultValue: 'Map' }), icon: MapPin },
    { href: '/reports', label: tNav('reports', { defaultValue: 'Reports' }), icon: FileText },
    ...(user ? [{ href: '/my-reports', label: tNav('myReports', { defaultValue: 'My Reports' }), icon: UserCheck }] : []),
    { href: '/about', label: tNav('about', { defaultValue: 'About' }), icon: Info },
    { href: '/help', label: tNav('help', { defaultValue: 'Help' }), icon: HelpCircle },
    ...(isAdmin ? [{ href: '/admin', label: tNav('dashboard', { defaultValue: 'Dashboard' }), icon: LayoutDashboard }] : []),
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-[#06080d]/80 backdrop-blur-xl border-b border-[#21262d]/80" />
      
      {/* Gradient line at top */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#58a6ff]/30 to-transparent" />
      
      <div className="relative flex h-full items-center justify-between px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#bc8cff]">
              <MapPin className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-[15px] font-bold text-[#f0f6fc] tracking-tight">CivicReport</span>
            <span className="block text-[10px] text-[#7d8590] tracking-wider uppercase">Smart City Platform</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#58a6ff]'
                    : 'text-[#7d8590] hover:text-[#f0f6fc]'
                }`}
              >
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-[#58a6ff]/10 border border-[#58a6ff]/20" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 sm:w-6 h-[2px] rounded-full bg-[#58a6ff]" />
                  </>
                )}
                <Icon className="relative h-4 w-4 shrink-0" />
                <span className="relative hidden lg:inline">{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <ThemeToggle />
          <LanguageSwitcher />
          
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-[#161b22] border border-[#21262d]">
            <div className={`relative h-2 w-2 rounded-full ${isConnected ? 'bg-[#3fb950]' : 'bg-[#7d8590]'}`}>
              {isConnected && (
                <div className="absolute inset-0 rounded-full bg-[#3fb950] animate-ping opacity-40" />
              )}
            </div>
            <span className="text-[10px] font-medium text-[#7d8590] uppercase tracking-wider hidden xl:inline">
              {isConnected ? tNav('liveConnected', { defaultValue: 'Live' }) : tNav('reconnecting', { defaultValue: 'Offline' })}
            </span>
          </div>
          
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d]">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{user.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <span className="text-sm text-[#f0f6fc] hidden md:inline font-medium">{user.name}</span>
                {isAdmin && <Shield className="h-3.5 w-3.5 text-[#bc8cff]" />}
              </div>
              <button
                onClick={logout}
                className="rounded-xl p-2 text-[#7d8590] hover:text-[#f85149] hover:bg-[#f85149]/10 transition-all duration-200"
                aria-label={tCommon('logout', { defaultValue: 'Log out' })}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-medium text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22] transition-all duration-200"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{tCommon('login', { defaultValue: 'Login' })}</span>
              </Link>
              <Link
                href="/register"
                className="btn-gradient flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">{tCommon('register', { defaultValue: 'Register' })}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
