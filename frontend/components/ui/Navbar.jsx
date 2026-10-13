'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useSocket } from '@/context/SocketContext'
import { useTranslations } from '@/context/LocaleContext'
import { MapPin, LayoutDashboard, FileText, LogOut, LogIn, UserPlus, Shield, Eye, Trophy } from 'lucide-react'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { isConnected } = useSocket()
  const pathname = usePathname()
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')

  const navLinks = [
    { href: '/map', label: tNav('map', { defaultValue: 'Map' }), icon: MapPin },
    ...(user && !isAdmin ? [{ href: '/my-reports', label: tNav('myReports', { defaultValue: 'My Reports' }), icon: FileText }] : []),
    ...(isAdmin ? [{ href: '/admin', label: tNav('dashboard', { defaultValue: 'Dashboard' }), icon: LayoutDashboard }] : []),
    { href: '/transparency', label: tNav('transparency', { defaultValue: 'Transparency' }), icon: Eye },
    { href: '/leaderboard', label: tNav('leaderboard', { defaultValue: 'Leaderboard' }), icon: Trophy },
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-14 border-b border-[#2a2d3e] bg-[#0f1117]/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4 max-w-7xl mx-auto">
        <Link href="/map" className="flex items-center gap-2 text-[#f0f0f0] font-semibold">
          <MapPin className="h-5 w-5 text-[#3b82f6]" />
          <span className="hidden sm:inline">CivicReport</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                pathname === href
                  ? 'bg-[#1a1d27] text-[#f0f0f0]'
                  : 'text-[#8b8fa8] hover:text-[#f0f0f0] hover:bg-[#1a1d27]/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div
            className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-[#8b8fa8]'}`}
            title={isConnected ? tNav('liveConnected', { defaultValue: 'Live connected' }) : tNav('reconnecting', { defaultValue: 'Reconnecting...' })}
            aria-label={isConnected ? 'Live connected' : 'Reconnecting'}
          />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#8b8fa8] hidden sm:inline">{user.name}</span>
              {isAdmin && <Shield className="h-4 w-4 text-[#3b82f6]" />}
              <button
                onClick={logout}
                className="rounded-lg p-1.5 text-[#8b8fa8] hover:bg-[#1a1d27] hover:text-[#f0f0f0] transition-colors"
                aria-label={tCommon('logout', { defaultValue: 'Log out' })}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                href="/login"
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-[#8b8fa8] hover:text-[#f0f0f0] hover:bg-[#1a1d27]/50 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{tCommon('login', { defaultValue: 'Login' })}</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1 rounded-lg bg-[#3b82f6] px-3 py-1.5 text-sm text-white hover:bg-blue-600 transition-colors"
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
