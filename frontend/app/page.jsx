'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { 
  MapPin, 
  FileText, 
  PlusCircle, 
  ShieldCheck, 
  Zap, 
  Radio, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Eye, 
  ChevronRight,
  Map as MapIcon
} from 'lucide-react'
import { useTranslations } from '@/context/LocaleContext'

export default function HomePage() {
  const t = useTranslations('home')
  const tNav = useTranslations('nav')
  const tCat = useTranslations('categories')

  const stats = [
    { label: t('statRealTime'), value: '< 100ms', desc: t('statRealTimeDesc'), icon: Zap, valueLtr: true },
    { label: t('statGIS'), value: '100% GPS', desc: t('statGISDesc'), icon: MapPin, valueLtr: true },
    { label: t('statTransparency'), value: 'Open Access', desc: t('statTransparencyDesc'), icon: Eye, valueLtr: false },
    { label: t('statEngagement'), value: 'Community Driven', desc: t('statEngagementDesc'), icon: Users, valueLtr: false },
  ]

  const steps = [
    {
      num: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: MapPin,
      badge: t('step1Badge'),
      color: 'from-[#58a6ff] to-[#39d2c0]'
    },
    {
      num: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: Radio,
      badge: t('step2Badge'),
      color: 'from-[#bc8cff] to-[#58a6ff]'
    },
    {
      num: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: CheckCircle2,
      badge: t('step3Badge'),
      color: 'from-[#3fb950] to-[#39d2c0]'
    }
  ]

  const pillars = [
    {
      title: t('pillar1Title'),
      desc: t('pillar1Desc'),
      href: '/map',
      cta: t('pillar1Cta'),
      icon: MapIcon,
      accent: 'border-[#58a6ff]/30 text-[#58a6ff]'
    },
    {
      title: t('pillar2Title'),
      desc: t('pillar2Desc'),
      href: '/reports',
      cta: t('pillar2Cta'),
      icon: FileText,
      accent: 'border-[#bc8cff]/30 text-[#bc8cff]'
    },
    {
      title: t('pillar3Title'),
      desc: t('pillar3Desc'),
      href: '/my-reports',
      cta: t('pillar3Cta'),
      icon: ShieldCheck,
      accent: 'border-[#3fb950]/30 text-[#3fb950]'
    }
  ]

  const categories = [
    { key: 'pothole', icon: '🛣️', color: 'border-red-500/20 bg-red-500/5' },
    { key: 'streetlight', icon: '💡', color: 'border-amber-500/20 bg-amber-500/5' },
    { key: 'garbage', icon: '♻️', color: 'border-emerald-500/20 bg-emerald-500/5' },
    { key: 'water', icon: '💧', color: 'border-blue-500/20 bg-blue-500/5' },
    { key: 'other', icon: '🛡️', color: 'border-purple-500/20 bg-purple-500/5' },
  ]

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-24 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Exhibition Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#58a6ff]/15 via-[#bc8cff]/15 to-[#39d2c0]/15 border border-[#58a6ff]/30 shadow-sm mb-5 sm:mb-6 max-w-full"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#58a6ff] animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold text-[#f0f6fc] tracking-wide uppercase truncate">
              {t('badge')}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#f0f6fc] tracking-tight leading-[1.25] mb-5 sm:mb-6"
          >
            {t('heroTitle')}{' '}
            <span className="gradient-text block mt-1">
              {t('heroGradient')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl text-[#7d8590] max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto"
          >
            <Link
              href="/map"
              className="btn-gradient w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-2xl font-bold text-white text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" /> {t('exploreMap')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>

            <Link
              href="/reports"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-2xl font-bold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] hover:border-[#30363d] text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#58a6ff]" /> {t('browseReports')}
            </Link>

            <Link
              href="/report"
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 rounded-2xl font-semibold text-[#bc8cff] bg-[#bc8cff]/10 border border-[#bc8cff]/20 hover:bg-[#bc8cff]/20 text-sm sm:text-base transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" /> {t('reportIssue')}
            </Link>
          </motion.div>
        </div>

        {/* Hero Presentation Mockup / Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-14 relative max-w-5xl mx-auto rounded-3xl border border-[#21262d] bg-[#0d1117] p-3 sm:p-6 shadow-2xl glass-card overflow-hidden"
        >
          {/* Top Bar simulating platform window */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-[#21262d]/60">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#f85149]" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#d29922]" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#3fb950]" />
              {/* URL address cannot be translated: forced LTR left-aligned */}
              <span className="text-[11px] sm:text-xs font-mono text-[#7d8590] ms-2 truncate max-w-[130px] sm:max-w-none untranslated" dir="ltr">
                live.civicreport.smartcity/map
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-[#3fb950]/15 text-[#3fb950] text-[10px] sm:text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#3fb950] animate-ping" /> {t('liveConnected')}
              </span>
            </div>
          </div>

          {/* Interactive preview teaser */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#06080d] to-[#161b22] border border-[#21262d] p-5 sm:p-8 overflow-hidden text-center">
            <div className="relative z-10 max-w-xl mx-auto">
              <div className="inline-flex items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-[#58a6ff]/10 text-[#58a6ff] mb-3 sm:mb-4">
                <Layers className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-[#f0f6fc] mb-2">
                {t('gisPreviewTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-[#7d8590] mb-5 sm:mb-6 leading-relaxed">
                {t('gisPreviewDesc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                <Link
                  href="/map"
                  className="btn-gradient w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" /> {t('launchMap')}
                </Link>
                <Link
                  href="/reports"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] text-center"
                >
                  {t('viewPublicFeed')}
                </Link>
              </div>
            </div>

            {/* Decorative background grid */}
            <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          EXHIBITION STATS BAR
          ═══════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 border-y border-[#21262d]/80 bg-[#0d1117]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {stats.map(({ label, value, desc, icon: Icon, valueLtr }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-3.5 sm:p-5 rounded-2xl bg-[#161b22]/50 border border-[#21262d] relative overflow-hidden group hover:border-[#58a6ff]/40 transition-colors"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#58a6ff] mb-1.5 sm:mb-2 opacity-80 group-hover:scale-110 transition-transform" />
                <div
                  dir={valueLtr ? 'ltr' : 'auto'}
                  className={`text-lg sm:text-2xl font-black text-[#f0f6fc] tracking-tight ${valueLtr ? 'untranslated' : 'text-start'}`}
                >
                  {value}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-[#58a6ff] uppercase tracking-wider mt-0.5">{label}</div>
                <p className="text-[10px] sm:text-[11px] text-[#7d8590] mt-1 line-clamp-2">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CORE PILLARS (MAP, REPORTS, MY REPORTS)
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#58a6ff] mb-2">{t('pillarsStructure')}</h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f0f6fc] tracking-tight">
            {t('pillarsHeading')}
          </h3>
          <p className="text-xs sm:text-sm text-[#7d8590] mt-2">
            {t('pillarsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col justify-between p-5 sm:p-7 rounded-3xl bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/40 transition-all hover:-translate-y-1 glass-card"
              >
                <div>
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#161b22] border flex items-center justify-center mb-4 sm:mb-5 ${pillar.accent}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#f0f6fc] mb-2">{pillar.title}</h4>
                  <p className="text-xs sm:text-sm text-[#7d8590] leading-relaxed mb-5 sm:mb-6">{pillar.desc}</p>
                </div>

                <Link
                  href={pillar.href}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#58a6ff] hover:text-[#79b8ff] transition-colors"
                >
                  {pillar.cta} <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS (3-STEP WORKFLOW)
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#21262d]/60">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#39d2c0]/10 text-[#39d2c0] text-xs font-semibold uppercase tracking-wider mb-3">
            {t('processBadge')}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#f0f6fc] tracking-tight">
            {t('processHeading')}
          </h2>
          <p className="text-xs sm:text-sm text-[#7d8590] mt-2">
            {t('processSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-[#21262d] glass-card"
              >
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  {/* Step numbers are untranslated monospace digits */}
                  <span className="text-3xl sm:text-4xl font-black text-[#7d8590]/30 font-mono untranslated" dir="ltr">
                    {step.num}
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#161b22] border border-[#21262d] text-xs font-semibold text-[#58a6ff]">
                    {step.badge}
                  </span>
                </div>

                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#58a6ff]/20 to-[#bc8cff]/20 border border-[#58a6ff]/30 flex items-center justify-center text-[#58a6ff] mb-4 sm:mb-5">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#f0f6fc] mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[#7d8590] leading-relaxed">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MUNICIPAL HAZARD CATEGORIES
          ═══════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#21262d]/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f0f6fc]">{t('categoriesHeading')}</h3>
            <p className="text-xs text-[#7d8590] mt-1">{t('categoriesSubtitle')}</p>
          </div>
          <Link
            href="/report"
            className="text-xs font-semibold text-[#58a6ff] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            {t('submitIssueNow')} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
          {categories.map((c) => (
            <div
              key={c.key}
              className={`p-3.5 sm:p-4 rounded-2xl border ${c.color} flex flex-col items-center text-center justify-center gap-2`}
            >
              <span className="text-2xl sm:text-3xl">{c.icon}</span>
              <span className="text-xs font-semibold text-[#f0f6fc]">{tCat(c.key)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EXHIBITION CTA BANNER
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-br from-[#161b22] via-[#0d1117] to-[#161b22] border border-[#58a6ff]/30 p-6 sm:p-12 text-center overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f0f6fc] tracking-tight mb-3 sm:mb-4">
              {t('ctaHeading')}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#7d8590] mb-6 sm:mb-8 leading-relaxed">
              {t('ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto">
              <Link
                href="/map"
                className="btn-gradient w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                <MapPin className="w-5 h-5" /> {t('exploreMap')}
              </Link>
              <Link
                href="/reports"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] transition-colors text-center"
              >
                {t('browseReports')}
              </Link>
            </div>
          </div>

          {/* Background Ambient Aura */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#58a6ff]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#bc8cff]/10 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-[#21262d] py-10 pb-28 md:pb-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#7d8590]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center text-white text-[10px] font-bold">
              CR
            </div>
            <span className="font-semibold text-[#f0f6fc]">{t('footerPlatform')}</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <Link href="/" className="hover:text-[#f0f6fc] transition-colors">{tNav('home')}</Link>
            <Link href="/map" className="hover:text-[#f0f6fc] transition-colors">{tNav('map')}</Link>
            <Link href="/reports" className="hover:text-[#f0f6fc] transition-colors">{tNav('reports')}</Link>
            <Link href="/my-reports" className="hover:text-[#f0f6fc] transition-colors">{tNav('myReports')}</Link>
            <Link href="/about" className="hover:text-[#f0f6fc] transition-colors">{tNav('about')}</Link>
            <Link href="/help" className="hover:text-[#f0f6fc] transition-colors">{tNav('help')}</Link>
          </div>

          <p>{t('footerExhibition')}</p>
        </div>
      </footer>
    </div>
  )
}
