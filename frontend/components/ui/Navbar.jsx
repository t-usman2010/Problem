'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useSocket } from '@/context/SocketContext'
import { useTranslations } from '@/context/LocaleContext'
import { motion, AnimatePresence } from 'motion/react'
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
  HelpCircle,
  Menu,
  X,
  Plus
} from 'lucide-react'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { isConnected } = useSocket()
  const pathname = usePathname()
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Auto-close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Manage body scroll lock when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
    <>
      {/* ═════════════════════════════════════════════════
          TOP NAVBAR (DESKTOP & MOBILE HEADER)
          ═════════════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16" aria-label="Main Navigation">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-[#06080d]/85 backdrop-blur-xl border-b border-[#21262d]/80" />
        
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
            <div>
              <span className="text-[15px] font-bold text-[#f0f6fc] tracking-tight">{tCommon('appName', { defaultValue: 'CivicReport' })}</span>
              <span className="hidden sm:block text-[10px] text-[#7d8590] tracking-wider uppercase">
                {tCommon('smartCityPlatform', { defaultValue: 'Smart City Platform' })}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Visible on Large Screens) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[#58a6ff]'
                      : 'text-[#7d8590] hover:text-[#f0f6fc]'
                  }`}
                >
                  {isActive && (
                    <>
                      <div className="absolute inset-0 rounded-xl bg-[#58a6ff]/10 border border-[#58a6ff]/20" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#58a6ff]" />
                    </>
                  )}
                  <Icon className="relative h-4 w-4 shrink-0" />
                  <span className="relative">{label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Report CTA button for tablet & desktop */}
            <Link
              href="/report"
              className="hidden sm:flex btn-gradient items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{tCommon('reportNewIssue', { defaultValue: 'Report Issue' })}</span>
            </Link>

            <ThemeToggle />
            <LanguageSwitcher />
            
            {/* Live socket indicator */}
            {/* <div 
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#161b22] border border-[#21262d]"
              title={isConnected ? 'Connected to live city dispatch' : 'Reconnecting...'}
            >
              <div className={`relative h-2 w-2 rounded-full ${isConnected ? 'bg-[#3fb950]' : 'bg-[#7d8590]'}`}>
                {isConnected && (
                  <div className="absolute inset-0 rounded-full bg-[#3fb950] animate-ping opacity-40" />
                )}
              </div>
              <span className="text-[10px] font-medium text-[#7d8590] uppercase tracking-wider hidden xl:inline">
                {isConnected ? tNav('liveConnected', { defaultValue: 'Live' }) : tNav('reconnecting', { defaultValue: 'Offline' })}
              </span>
            </div> */}
            
            {/* Desktop Auth Section */}
            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d]">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{user.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-[#f0f6fc] font-medium text-start [unicode-bidi:plaintext] user-content" dir="auto">
                    {user.name}
                  </span>
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
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22] transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{tCommon('login', { defaultValue: 'Login' })}</span>
                </Link>
                <Link
                  href="/register"
                  className="btn-gradient flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{tCommon('register', { defaultValue: 'Register' })}</span>
                </Link>
              </div>
            )}

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl bg-[#161b22] border border-[#21262d] text-[#f0f6fc] hover:border-[#58a6ff]/40 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-[#58a6ff]" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ═════════════════════════════════════════════════
          MOBILE & TABLET SLIDE-IN NAVIGATION DRAWER
          ═════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-w-sm h-full bg-[#0d1117] border-s border-[#21262d] flex flex-col shadow-2xl z-10 overflow-y-auto safe-bottom"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#21262d]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#bc8cff]">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#f0f6fc]">{tCommon('appName', { defaultValue: 'CivicReport' })}</span>
                    <span className="block text-[9px] text-[#7d8590] uppercase tracking-wider">{tCommon('navigationMenu', { defaultValue: 'Navigation Menu' })}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Profile Card / Auth Action */}
              <div className="p-4 border-b border-[#21262d] bg-[#06080d]/50">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center shrink-0 shadow-md">
                        <span className="text-sm font-bold text-white">{user.name?.charAt(0)?.toUpperCase()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-[#f0f6fc] truncate text-start [unicode-bidi:plaintext] user-content" dir="auto">
                            {user.name}
                          </span>
                          {isAdmin && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#bc8cff]/15 text-[#bc8cff] border border-[#bc8cff]/20">
                              {tCommon('admin', { defaultValue: 'Admin' })}
                            </span>
                          )}
                        </div>
                        {/* Email cannot be translated: forced left aligned */}
                        <span className="text-xs text-[#7d8590] truncate block untranslated" dir="ltr">{user.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="p-2 rounded-xl text-[#7d8590] hover:text-[#f85149] hover:bg-[#f85149]/10 transition-colors shrink-0"
                      title={tCommon('logout', { defaultValue: 'Log out' })}
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] transition-colors"
                    >
                      <LogIn className="h-3.5 w-3.5 text-[#58a6ff]" />
                      {tCommon('login', { defaultValue: 'Login' })}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-gradient flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-white shadow-md transition-colors"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      {tCommon('register', { defaultValue: 'Register' })}
                    </Link>
                  </div>
                )}
              </div>

              {/* Primary Quick CTA: Report Issue */}
              <div className="p-4 pb-2">
                <Link
                  href="/report"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>{tCommon('reportNewIssue', { defaultValue: 'Report New Issue' })}</span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 px-3 py-2 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7d8590]">
                  {tCommon('navigationMenu', { defaultValue: 'Navigation' })}
                </div>
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30 shadow-sm'
                          : 'text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-[#58a6ff]' : 'text-[#7d8590]'}`} />
                        <span>{label}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]" />
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Bottom Drawer Footer */}
              <div className="p-4 border-t border-[#21262d] bg-[#06080d]/40 flex items-center justify-between text-xs text-[#7d8590]">
                <span>{tCommon('status', { defaultValue: 'Status:' })}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-[#3fb950]' : 'bg-[#7d8590]'}`} />
                  <span className="font-medium text-[#f0f6fc]">
                    {isConnected ? tCommon('cityGridLive', { defaultValue: 'City Grid Live' }) : tCommon('reconnecting', { defaultValue: 'Reconnecting' })}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═════════════════════════════════════════════════
          MOBILE BOTTOM NAVIGATION BAR (SM/MD SCREENS)
          Thumb-zone access on phones
          ═════════════════════════════════════════════════ */}
      <nav 
        className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-[#06080d]/90 backdrop-blur-xl border-t border-[#21262d] safe-bottom"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 h-full py-1 transition-colors ${
              pathname === '/' ? 'text-[#58a6ff]' : 'text-[#7d8590] hover:text-[#f0f6fc]'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">{tNav('home', { defaultValue: 'Home' })}</span>
          </Link>

          {/* 2. Map */}
          <Link
            href="/map"
            className={`flex flex-col items-center justify-center gap-1 h-full py-1 transition-colors ${
              pathname === '/map' ? 'text-[#58a6ff]' : 'text-[#7d8590] hover:text-[#f0f6fc]'
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">{tNav('map', { defaultValue: 'Map' })}</span>
          </Link>

          {/* 3. Center Action: Quick Report (+) */}
          <div className="flex items-center justify-center">
            <Link
              href="/report"
              className="flex h-11 w-11 items-center justify-center rounded-2xl btn-gradient text-white shadow-[0_0_15px_rgba(88,166,255,0.4)] -mt-4 active:scale-90 transition-transform"
              aria-label={tCommon('reportNewIssue', { defaultValue: 'Report Issue' })}
            >
              <Plus className="h-6 w-6 stroke-[2.5]" />
            </Link>
          </div>

          {/* 4. Reports Feed */}
          <Link
            href="/reports"
            className={`flex flex-col items-center justify-center gap-1 h-full py-1 transition-colors ${
              pathname === '/reports' ? 'text-[#58a6ff]' : 'text-[#7d8590] hover:text-[#f0f6fc]'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">{tNav('reports', { defaultValue: 'Reports' })}</span>
          </Link>

          {/* 5. More / Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 h-full py-1 transition-colors ${
              isMobileMenuOpen ? 'text-[#58a6ff]' : 'text-[#7d8590] hover:text-[#f0f6fc]'
            }`}
            aria-label="Open full menu"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">{tNav('about', { defaultValue: 'More' })}</span>
          </button>
        </div>
      </nav>
    </>
  )
}
