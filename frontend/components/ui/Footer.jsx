'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { useTranslations } from '@/context/LocaleContext'
import { useSocket } from '@/context/SocketContext'
import { useToast } from '@/components/ui/Toast'
import {
  MapPin,
  Activity,
  PhoneCall,
  ArrowUp,
  Globe,
  Mail,
  CheckCircle2,
  Radio,
  Sparkles,
  Send,
  Shield,
  Heart,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react'

// Clean SVG brand icons
function GithubIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  )
}

function TwitterXIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function DiscordIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export default function Footer() {
  const pathname = usePathname()
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')
  const { isConnected } = useSocket()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  // Do not render full footer on the full-screen interactive Leaflet map canvas
  if (pathname === '/map') {
    return null
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error(t('invalidEmail', { defaultValue: 'Please enter a valid email address' }))
      return
    }

    setSubscribing(true)
    setTimeout(() => {
      setSubscribing(false)
      setSubscribed(true)
      toast.success(t('subscribed', { defaultValue: 'Subscribed to City Alerts!' }))
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }, 700)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const emergencyHotlines = [
    { name: t('rescueHotline', { defaultValue: 'Rescue 1122' }), number: '1122', badge: '1122', color: 'from-red-500/20 to-red-600/10 text-red-400 border-red-500/30' },
    { name: t('policeHotline', { defaultValue: 'Police 15' }), number: '15', badge: '15', color: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30' },
    { name: t('fireHotline', { defaultValue: 'Fire Brigade 16' }), number: '16', badge: '16', color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30' },
    { name: t('waterHotline', { defaultValue: 'Water Board 1334' }), number: '1334', badge: '1334', color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30' },
    { name: t('electricHotline', { defaultValue: 'Power Utility 118' }), number: '118', badge: '118', color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30' },
  ]

  const platformLinks = [
    { href: '/', label: t('navHome', { defaultValue: 'Home Overview' }) },
    { href: '/map', label: t('navMap', { defaultValue: 'Live GIS Map' }) },
    { href: '/reports', label: t('navReports', { defaultValue: 'Public Reports Feed' }) },
    { href: '/report', label: t('navReportIssue', { defaultValue: 'Report an Issue' }) },
    { href: '/my-reports', label: t('navMyReports', { defaultValue: 'Citizen Dashboard' }) },
    { href: '/leaderboard', label: t('navLeaderboard', { defaultValue: 'Civic Champions' }) },
    { href: '/transparency', label: t('navTransparency', { defaultValue: 'Transparency & Metrics' }) },
  ]

  const categoryLinks = [
    { href: '/reports?category=pothole', label: t('catPothole', { defaultValue: 'Potholes & Roads' }) },
    { href: '/reports?category=streetlight', label: t('catStreetlight', { defaultValue: 'Streetlights & Lighting' }) },
    { href: '/reports?category=water_leakage', label: t('catWater', { defaultValue: 'Water Leaks & Drainage' }) },
    { href: '/reports?category=garbage', label: t('catGarbage', { defaultValue: 'Sanitation & Waste' }) },
    { href: '/reports?category=traffic_hazard', label: t('catTraffic', { defaultValue: 'Traffic & Obstructions' }) },
    { href: '/reports?category=other', label: t('catOther', { defaultValue: 'Parks & Public Spaces' }) },
  ]

  const resourceLinks = [
    { href: '/about', label: t('resAbout', { defaultValue: 'About CivicReport' }) },
    { href: '/about#how-it-works', label: t('resHowItWorks', { defaultValue: 'How It Works' }) },
    { href: '/help', label: t('resHelp', { defaultValue: 'Help & FAQs' }) },
    { href: '/help#emergency', label: t('resEmergency', { defaultValue: 'Emergency Protocols' }) },
    { href: '/admin', label: t('resAdmin', { defaultValue: 'Municipal Dashboard' }) },
    { href: '/transparency', label: t('resApi', { defaultValue: 'Open Geo-Data & API' }) },
  ]

  return (
    <footer
      role="contentinfo"
      aria-label="CivicReport Site Footer"
      className="relative z-10 border-t border-[#21262d]/80 bg-[#06080d]/95 backdrop-blur-2xl text-[#7d8590] overflow-hidden transition-colors duration-200"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#58a6ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#bc8cff]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#39d2c0]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Radiant Top Border Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#58a6ff]/40 via-[#bc8cff]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pb-12 relative z-10">
        
        {/* ═══════════════════════════════════════════
            TOP CALLOUT: NEWSLETTER & EMERGENCY HOTLINES
            ═══════════════════════════════════════════ */}
        <section
          aria-labelledby="footer-broadcast-heading"
          className="relative rounded-3xl p-6 sm:p-8 mb-12 border border-[#21262d] bg-[#0d1117]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl overflow-hidden"
        >
          {/* Subtle accent line on top edge */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-[#58a6ff]/40 via-[#bc8cff]/40 to-[#39d2c0]/40" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Newsletter Dispatch Signup */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#58a6ff]/10 border border-[#58a6ff]/30 text-[#58a6ff]">
                  <Radio className="h-4 w-4 animate-pulse" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#58a6ff]">
                  {t('exhibitionBadge', { defaultValue: 'Smart City Exhibition 2026' })}
                </span>
              </div>
              <h3 id="footer-broadcast-heading" className="text-lg sm:text-xl font-bold text-[#f0f6fc] tracking-tight">
                {t('newsletterTitle', { defaultValue: 'Stay Connected with City Dispatch' })}
              </h3>
              <p className="text-xs sm:text-sm text-[#7d8590] mt-1.5 max-w-xl leading-relaxed">
                {t('newsletterDesc', { defaultValue: 'Subscribe for weekly municipal repair summaries, critical civic announcements, and neighborhood infrastructure updates.' })}
              </p>

              {/* Input Form */}
              <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7d8590] pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder', { defaultValue: 'Enter your email for city updates...' })}
                    disabled={subscribing || subscribed}
                    className="w-full h-11 ps-10 pe-4 rounded-xl bg-[#161b22] border border-[#30363d] text-xs sm:text-sm text-[#f0f6fc] placeholder-[#7d8590] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all disabled:opacity-60"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={subscribing || subscribed}
                  className={`h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shrink-0 ${
                    subscribed
                      ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                      : 'btn-gradient text-white shadow-[0_0_20px_rgba(88,166,255,0.25)] hover:shadow-[0_0_25px_rgba(88,166,255,0.4)]'
                  }`}
                >
                  {subscribed ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{t('subscribed', { defaultValue: 'Subscribed!' })}</span>
                    </>
                  ) : subscribing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('subscribing', { defaultValue: 'Joining...' })}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 rtl:rotate-180" />
                      <span>{t('subscribe', { defaultValue: 'Subscribe' })}</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Right: Emergency Hotline Strip */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-s border-[#21262d] pt-6 lg:pt-0 lg:ps-8">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-[#d29922]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#f0f6fc]">
                  {t('emergencyTitle', { defaultValue: 'Municipal Emergency Hotlines' })}
                </h4>
              </div>
              <p className="text-xs text-[#7d8590] mb-3 leading-relaxed">
                {t('emergencyDesc', { defaultValue: 'For life-threatening or urgent crises, contact municipal response teams directly:' })}
              </p>

              <div className="flex flex-wrap gap-2">
                {emergencyHotlines.map((hotline) => (
                  <a
                    key={hotline.number}
                    href={`tel:${hotline.number}`}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-gradient-to-r ${hotline.color} hover:brightness-125 transition-all text-xs font-semibold`}
                    aria-label={`Call ${hotline.name}`}
                  >
                    <PhoneCall className="h-3 w-3 group-hover:scale-110 transition-transform" />
                    <span>{hotline.name}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            MAIN FOOTER NAVIGATION COLUMNS
            ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
          
          {/* Column 1: Brand & Mission (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] shadow-md">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-lg font-bold text-[#f0f6fc] tracking-tight block">
                    {tCommon('appName', { defaultValue: 'CivicReport' })}
                  </span>
                  <span className="text-[11px] text-[#7d8590] tracking-wider uppercase block">
                    {tCommon('smartCityPlatform', { defaultValue: 'Smart City Platform' })}
                  </span>
                </div>
              </Link>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-[#7d8590] leading-relaxed max-w-sm">
                {t('description', { defaultValue: 'CivicReport bridges citizens and municipal authorities with live GIS issue tracking, instant dispatch, crowdsourced validation, and transparent accountability.' })}
              </p>

              {/* Real-time System Status Pill */}
              <div className="mt-5 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#161b22] border border-[#30363d] text-xs">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                </span>
                <span className="text-[#f0f6fc] font-medium">
                  {isConnected 
                    ? t('systemLive', { defaultValue: 'City Grid Synchronized' })
                    : t('systemOffline', { defaultValue: 'Reconnecting to Grid...' })
                  }
                </span>
                <span className="text-[#30363d]">•</span>
                <span className="text-[#7d8590]">{t('systemUptime', { defaultValue: '99.98% Uptime' })}</span>
              </div>
            </div>

            {/* Social & Community Links */}
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="h-9 w-9 rounded-xl bg-[#161b22] border border-[#21262d] hover:border-[#58a6ff]/50 hover:bg-[#58a6ff]/10 text-[#7d8590] hover:text-[#58a6ff] flex items-center justify-center transition-all"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X Platform"
                className="h-9 w-9 rounded-xl bg-[#161b22] border border-[#21262d] hover:border-[#58a6ff]/50 hover:bg-[#58a6ff]/10 text-[#7d8590] hover:text-[#58a6ff] flex items-center justify-center transition-all"
              >
                <TwitterXIcon className="h-4 w-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord Community"
                className="h-9 w-9 rounded-xl bg-[#161b22] border border-[#21262d] hover:border-[#bc8cff]/50 hover:bg-[#bc8cff]/10 text-[#7d8590] hover:text-[#bc8cff] flex items-center justify-center transition-all"
              >
                <DiscordIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:contact@civicreport.org"
                aria-label="Contact Municipal Tech Support"
                className="h-9 w-9 rounded-xl bg-[#161b22] border border-[#21262d] hover:border-[#39d2c0]/50 hover:bg-[#39d2c0]/10 text-[#7d8590] hover:text-[#39d2c0] flex items-center justify-center transition-all"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f0f6fc] mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]" />
              {t('platform', { defaultValue: 'Platform' })}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 hover:text-[#58a6ff] transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 text-[#30363d] group-hover:text-[#58a6ff] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Civic Categories (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f0f6fc] mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bc8cff]" />
              {t('categories', { defaultValue: 'Issue Categories' })}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {categoryLinks.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="group inline-flex items-center gap-1.5 hover:text-[#bc8cff] transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 text-[#30363d] group-hover:text-[#bc8cff] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all" />
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Civic Resources & Governance (3 cols on lg) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#f0f6fc] mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39d2c0]" />
                {t('resources', { defaultValue: 'Civic Resources' })}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {resourceLinks.map((res) => (
                  <li key={res.href}>
                    <Link
                      href={res.href}
                      className="group inline-flex items-center gap-1.5 hover:text-[#39d2c0] transition-colors"
                    >
                      <ChevronRight className="h-3 w-3 text-[#30363d] group-hover:text-[#39d2c0] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all" />
                      <span>{res.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Report CTA Mini-Card */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#21262d] relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-[#f0f6fc] mb-1">
                <Sparkles className="h-3.5 w-3.5 text-[#58a6ff]" />
                <span>{t('fastDispatch', { defaultValue: 'Rapid Response Dispatch' })}</span>
              </div>
              <p className="text-[11px] text-[#7d8590] mb-3">
                {t('subMeterGis', { defaultValue: 'Sub-Meter GIS Precision with Real-Time Upvoting' })}
              </p>
              <Link
                href="/report"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl btn-gradient text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <span>{t('reportCta', { defaultValue: 'Report Issue Now' })}</span>
                <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>

        </div>

        {/* ═══════════════════════════════════════════
            BOTTOM LEGAL & METRIC SUB-BAR
            ═══════════════════════════════════════════ */}
        <div className="pt-8 border-t border-[#21262d]/70 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Copyright & Mission Note */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-start">
            <span className="text-[#f0f6fc] font-medium">
              © {new Date().getFullYear()} {tCommon('appName', { defaultValue: 'CivicReport' })}. {t('allRightsReserved', { defaultValue: 'All rights reserved.' })}
            </span>
            <span className="hidden sm:inline text-[#30363d]">•</span>
            <span className="text-[#7d8590]">
              {t('builtWith', { defaultValue: 'Built for citizen empowerment & transparent urban governance.' })}
            </span>
          </div>

          {/* Legal Links & Back to Top */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <Link href="/about" className="hover:text-[#f0f6fc] transition-colors">
              {t('privacyPolicy', { defaultValue: 'Privacy Policy' })}
            </Link>
            <Link href="/help" className="hover:text-[#f0f6fc] transition-colors">
              {t('termsOfService', { defaultValue: 'Terms of Service' })}
            </Link>
            <Link href="/transparency" className="hover:text-[#f0f6fc] transition-colors">
              {t('openDataLicense', { defaultValue: 'Open Data (ODbL)' })}
            </Link>

            {/* Back to Top Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161b22] border border-[#30363d] text-[#f0f6fc] hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all text-xs font-medium cursor-pointer"
              aria-label={t('backToTop', { defaultValue: 'Back to Top' })}
            >
              <span>{t('backToTop', { defaultValue: 'Back to Top' })}</span>
              <ArrowUp className="h-3 w-3" />
            </motion.button>
          </div>

        </div>

      </div>
    </footer>
  )
}
