'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useSocket } from '@/context/SocketContext'
import { useTranslations } from '@/context/LocaleContext'
import { motion, AnimatePresence } from 'motion/react'
import { 
  MapPin, 
  Map, 
  FileText, 
  LayoutDashboard, 
  UserCheck, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Shield, 
  Info, 
  HelpCircle,
  Menu,
  X,
  Plus,
  ChevronDown
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
  const [isExploreOpen, setIsExploreOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const exploreRef = useRef(null)
  const profileRef = useRef(null)

  // Auto-close dropdowns and mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsExploreOpen(false)
    setIsProfileOpen(false)
  }, [pathname])

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setIsExploreOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsExploreOpen(false)
        setIsProfileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  // Secondary explore links housed neatly in dropdown
  const exploreLinks = [
    {
      href: '/about',
      title: tNav('about', { defaultValue: 'About CivicReport' }),
      description: 'Our mission for smart & responsive cities',
      icon: Info,
      color: '#58a6ff'
    },
    {
      href: '/help',
      title: tNav('help', { defaultValue: 'Help & FAQ' }),
      description: 'Guides on reporting & resolving civic issues',
      icon: HelpCircle,
      color: '#bc8cff'
    }
  ]

  const isExploreActive = exploreLinks.some(link => pathname === link.href)

  return (
    <>
      {/* ═════════════════════════════════════════════════
          TOP NAVBAR: MODERN FLOATING-ISLAND DESKTOP ARCHITECTURE
          ═════════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50 h-16" aria-label="Main Navigation">
        {/* Frosted Glass Backdrop */}
        <div className="absolute inset-0 bg-[#06080d]/80 backdrop-blur-xl border-b border-[#21262d]/80" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#58a6ff]/25 to-transparent" />

        <div className="relative flex h-full items-center justify-between px-3 sm:px-6 max-w-7xl mx-auto">
          
          {/* 1. BRANDING ISLAND (LEFT) */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] blur-md opacity-30 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] shadow-md group-hover:scale-105 transition-transform duration-200">
                <MapPin className="h-4.5 w-4.5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#f0f6fc] tracking-tight leading-none group-hover:text-[#58a6ff] transition-colors">
                {tCommon('appName', { defaultValue: 'CivicReport' })}
              </span>
              <span className="hidden sm:inline-block text-[9.5px] font-medium text-[#7d8590] tracking-wider uppercase mt-1">
                Smart City Hub
              </span>
            </div>
          </Link>

          {/* 2. FLOATING CENTER PILL (DESKTOP: ESSENTIALS ONLY) */}
          <nav className="hidden lg:flex items-center p-1 rounded-full bg-[#0d1117]/80 border border-[#21262d] shadow-inner shadow-black/20">
            {/* Map Link */}
            <Link
              href="/map"
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                pathname === '/map'
                  ? 'text-[#f0f6fc]'
                  : 'text-[#7d8590] hover:text-[#f0f6fc]'
              }`}
            >
              {pathname === '/map' && (
                <motion.div
                  layoutId="navbar-pill-active"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#58a6ff]/20 to-[#bc8cff]/15 border border-[#58a6ff]/30 shadow-[0_0_15px_rgba(88,166,255,0.15)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Map className="relative h-3.5 w-3.5" />
              <span className="relative">{tNav('map', { defaultValue: 'Live Map' })}</span>
            </Link>

            {/* Reports Feed */}
            <Link
              href="/reports"
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                pathname === '/reports'
                  ? 'text-[#f0f6fc]'
                  : 'text-[#7d8590] hover:text-[#f0f6fc]'
              }`}
            >
              {pathname === '/reports' && (
                <motion.div
                  layoutId="navbar-pill-active"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#58a6ff]/20 to-[#bc8cff]/15 border border-[#58a6ff]/30 shadow-[0_0_15px_rgba(88,166,255,0.15)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <FileText className="relative h-3.5 w-3.5" />
              <span className="relative">{tNav('reports', { defaultValue: 'Reports' })}</span>
            </Link>

            {/* Explore Dropdown Capsule */}
            <div className="relative" ref={exploreRef}>
              <button
                type="button"
                onClick={() => setIsExploreOpen(prev => !prev)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isExploreActive || isExploreOpen
                    ? 'text-[#f0f6fc]'
                    : 'text-[#7d8590] hover:text-[#f0f6fc]'
                }`}
                aria-expanded={isExploreOpen}
                aria-haspopup="true"
              >
                {isExploreActive && !pathname.startsWith('/map') && !pathname.startsWith('/reports') && (
                  <motion.div
                    layoutId="navbar-pill-active"
                    className="absolute inset-0 rounded-full bg-[#161b22] border border-[#30363d]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">Info</span>
                <ChevronDown className={`relative h-3 w-3 transition-transform duration-200 ${isExploreOpen ? 'rotate-180 text-[#58a6ff]' : ''}`} />
              </button>

              {/* Explore Dropdown Popover */}
              <AnimatePresence>
                {isExploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-2 rounded-2xl bg-[#0d1117]/95 backdrop-blur-2xl border border-[#21262d] shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-50"
                  >
                    <div className="px-3 py-1.5 mb-1 border-b border-[#21262d]/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d8590]">
                        Help & Support
                      </span>
                    </div>

                    <div className="space-y-1">
                      {exploreLinks.map(item => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsExploreOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                              isActive
                                ? 'bg-[#58a6ff]/10 border border-[#58a6ff]/20 text-[#58a6ff]'
                                : 'hover:bg-[#161b22] text-[#f0f6fc]'
                            }`}
                          >
                            <div 
                              className="p-1.5 rounded-lg shrink-0 mt-0.5" 
                              style={{ backgroundColor: `${item.color}15`, color: item.color }}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block text-xs font-semibold leading-tight">{item.title}</span>
                              <span className="block text-[11px] text-[#7d8590] leading-snug truncate mt-0.5">
                                {item.description}
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. ACTION HUB (RIGHT ISLAND) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Primary Action: Report Issue Button */}
            <Link
              href="/report"
              className="btn-gradient hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-[0_0_20px_rgba(88,166,255,0.25)] hover:shadow-[0_0_25px_rgba(88,166,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{tCommon('reportNewIssue', { defaultValue: 'Report Issue' })}</span>
            </Link>

            {/* Quick Utility Switchers (Language + Theme) */}
            <div className="hidden sm:flex items-center gap-1.5">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            {/* USER PROFILE ISLAND (DROPDOWN IF LOGGED IN, OR AUTH BUTTONS) */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  className="hidden lg:flex items-center gap-2 p-1 pe-2.5 rounded-full bg-[#161b22] hover:bg-[#1c2128] border border-[#21262d] hover:border-[#30363d] transition-all duration-200 group"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-label="User Account Menu"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-[#f0f6fc] max-w-[100px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-[#7d8590] group-hover:text-[#f0f6fc] transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Floating Profile Card Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute end-0 mt-3 w-64 p-2 rounded-2xl bg-[#0d1117]/95 backdrop-blur-2xl border border-[#21262d] shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 overflow-hidden"
                    >
                      {/* User Header */}
                      <div className="p-3 bg-[#161b22]/50 rounded-xl border border-[#21262d]/60 mb-2">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-xs font-bold text-[#f0f6fc] truncate">{user.name}</span>
                            <span className="block text-[11px] text-[#7d8590] truncate">{user.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#7c3aed]/20 text-[#bc8cff] border border-[#7c3aed]/30">
                              <Shield className="h-2.5 w-2.5" /> Municipal Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#3fb950]/15 text-[#3fb950] border border-[#3fb950]/25">
                              Verified Citizen
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="space-y-0.5">
                        <Link
                          href="/my-reports"
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            pathname === '/my-reports'
                              ? 'bg-[#58a6ff]/15 text-[#58a6ff]'
                              : 'text-[#f0f6fc] hover:bg-[#161b22]'
                          }`}
                        >
                          <UserCheck className="h-4 w-4 text-[#58a6ff]" />
                          <span>{tNav('myReports', { defaultValue: 'My Reports' })}</span>
                        </Link>

                        {/* Admin Link Highlight */}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              pathname === '/admin'
                                ? 'bg-[#7c3aed]/20 text-[#bc8cff] border border-[#7c3aed]/30'
                                : 'text-[#bc8cff] hover:bg-[#7c3aed]/10'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <LayoutDashboard className="h-4 w-4 text-[#bc8cff]" />
                              <span>Command Center</span>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#7c3aed]/30 font-mono">ADMIN</span>
                          </Link>
                        )}
                      </div>

                      <div className="my-1.5 border-t border-[#21262d]/70" />

                      {/* Log Out */}
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileOpen(false)
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#f85149] hover:bg-[#f85149]/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{tCommon('logout', { defaultValue: 'Sign Out' })}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22] transition-colors"
                >
                  {tCommon('login', { defaultValue: 'Sign In' })}
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:border-[#58a6ff]/40 hover:bg-[#1c2128] transition-all"
                >
                  {tCommon('register', { defaultValue: 'Register' })}
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl bg-[#161b22] border border-[#21262d] text-[#f0f6fc] hover:border-[#58a6ff]/40 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-[#58a6ff]" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════
          MOBILE SLIDE-IN NAVIGATION DRAWER
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-w-sm h-full bg-[#0d1117] border-s border-[#21262d] flex flex-col shadow-2xl z-10 overflow-y-auto safe-bottom"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#21262d]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#58a6ff] to-[#bc8cff]">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-[#f0f6fc]">CivicReport Hub</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User profile section in mobile */}
              <div className="p-4 border-b border-[#21262d] bg-[#06080d]/50">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center font-bold text-white shrink-0">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-[#f0f6fc] truncate">{user.name}</span>
                          {isAdmin && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#bc8cff]/15 text-[#bc8cff] border border-[#bc8cff]/20">
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#7d8590] truncate block">{user.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="p-2 rounded-xl text-[#7d8590] hover:text-[#f85149] hover:bg-[#f85149]/10"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#f0f6fc] bg-[#161b22] border border-[#21262d]"
                    >
                      <LogIn className="h-3.5 w-3.5 text-[#58a6ff]" />
                      <span>{tCommon('login', { defaultValue: 'Login' })}</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-gradient flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>{tCommon('register', { defaultValue: 'Register' })}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile CTA */}
              <div className="p-4 pb-2">
                <Link
                  href="/report"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Report New Issue</span>
                </Link>
              </div>

              {/* Navigation links for mobile */}
              <div className="flex-1 px-3 py-2 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7d8590]">
                  Core Navigation
                </div>
                {[
                  { href: '/map', label: 'Live City Map', icon: Map },
                  { href: '/reports', label: 'Public Reports Feed', icon: FileText },
                  ...(user ? [{ href: '/my-reports', label: 'My Reports', icon: UserCheck }] : []),
                  ...(isAdmin ? [{ href: '/admin', label: 'Admin Command Center', icon: LayoutDashboard }] : []),
                ].map(item => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30'
                          : 'text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#58a6ff]" />}
                    </Link>
                  )
                })}

                <div className="pt-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7d8590]">
                  Support & Info
                </div>
                {exploreLinks.map(item => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30'
                          : 'text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" style={{ color: item.color }} />
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Bottom utilities */}
              <div className="p-4 border-t border-[#21262d] bg-[#06080d]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#7d8590]">
                  <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-[#3fb950]' : 'bg-[#7d8590]'}`} />
                  <span className="text-[11px] font-medium">{isConnected ? 'Live Grid' : 'Offline'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═════════════════════════════════════════════════
          MOBILE BOTTOM THUMB BAR (<MD SCREENS)
          ═════════════════════════════════════════════════ */}
      <nav 
        className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-[#06080d]/90 backdrop-blur-xl border-t border-[#21262d] safe-bottom"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* 1. Map */}
          <Link
            href="/map"
            className={`flex flex-col items-center justify-center gap-1 h-full py-1 transition-colors ${
              pathname === '/map' ? 'text-[#58a6ff]' : 'text-[#7d8590] hover:text-[#f0f6fc]'
            }`}
          >
            <Map className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">{tNav('map', { defaultValue: 'Map' })}</span>
          </Link>

          {/* 2. Reports Feed */}
          <Link
            href="/reports"
            className={`flex flex-col items-center justify-center gap-1 h-full py-1 transition-colors ${
              pathname === '/reports' ? 'text-[#58a6ff]' : 'text-[#7d8590] hover:text-[#f0f6fc]'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">{tNav('reports', { defaultValue: 'Reports' })}</span>
          </Link>

          {/* 3. Center CTA: Quick Report (+) */}
          <div className="flex items-center justify-center">
            <Link
              href="/report"
              className="flex h-11 w-11 items-center justify-center rounded-2xl btn-gradient text-white shadow-[0_0_15px_rgba(88,166,255,0.4)] -mt-4 active:scale-90 transition-transform"
              aria-label={tCommon('reportNewIssue', { defaultValue: 'Report Issue' })}
            >
              <Plus className="h-6 w-6 stroke-[2.5]" />
            </Link>
          </div>

          {/* 4. My Reports */}
          <Link
            href={user ? "/my-reports" : "/about"}
            className={`flex flex-col items-center justify-center gap-1 h-full py-1 transition-colors ${
              (user && pathname === '/my-reports') || (!user && pathname === '/about')
                ? 'text-[#58a6ff]' 
                : 'text-[#7d8590] hover:text-[#f0f6fc]'
            }`}
          >
            {user ? <UserCheck className="h-5 w-5" /> : <Info className="h-5 w-5" />}
            <span className="text-[10px] font-medium leading-none">
              {user ? tNav('myReports', { defaultValue: 'My Reports' }) : 'About'}
            </span>
          </Link>

          {/* 5. Menu / More */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 h-full py-1 transition-colors ${
              isMobileMenuOpen ? 'text-[#58a6ff]' : 'text-[#7d8590] hover:text-[#f0f6fc]'
            }`}
            aria-label="Open full menu"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>
    </>
  )
}
