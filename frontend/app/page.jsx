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

export default function HomePage() {
  const stats = [
    { label: 'Real-Time Sync', value: '< 100ms', desc: 'WebSocket powered live updates', icon: Zap },
    { label: 'GIS Geo-Tagging', value: '100% GPS', desc: 'Sub-meter pinpoint coordinates', icon: MapPin },
    { label: 'Public Transparency', value: 'Open Access', desc: 'Real-time municipal dispatch', icon: Eye },
    { label: 'Citizen Engagement', value: 'Community Driven', desc: 'Crowdsourced issue upvoting', icon: Users },
  ]

  const steps = [
    {
      num: '01',
      title: 'Pin & Snap',
      desc: 'Spot a municipal issue (pothole, dark streetlight, garbage heap, water leak). Take a photo and let GPS auto-detect your exact coordinates.',
      icon: MapPin,
      badge: 'Citizen Action',
      color: 'from-[#58a6ff] to-[#39d2c0]'
    },
    {
      num: '02',
      title: 'Real-Time Broadcast',
      desc: 'Your report is broadcast instantly via WebSockets to the interactive city map and routed directly to the designated municipal department.',
      icon: Radio,
      badge: 'Live Dispatch',
      color: 'from-[#bc8cff] to-[#58a6ff]'
    },
    {
      num: '03',
      title: 'Track to Resolution',
      desc: 'Watch the status change from Pending to In-Progress to Resolved. The community upvotes urgent issues to prioritize repairs.',
      icon: CheckCircle2,
      badge: 'Accountability',
      color: 'from-[#3fb950] to-[#39d2c0]'
    }
  ]

  const pillars = [
    {
      title: 'Interactive City GIS Map',
      desc: 'Explore urban infrastructure health with high-density marker clustering, dynamic heatmap layers, and neighborhood radius filters.',
      href: '/map',
      cta: 'Explore City Map',
      icon: MapIcon,
      accent: 'border-[#58a6ff]/30 text-[#58a6ff]'
    },
    {
      title: 'Public Community Reports',
      desc: 'Browse, search, and upvote reported hazards citywide. Full transparency into municipal progress and verified repairs.',
      href: '/reports',
      cta: 'Browse Reports Feed',
      icon: FileText,
      accent: 'border-[#bc8cff]/30 text-[#bc8cff]'
    },
    {
      title: 'Private Citizen Portal',
      desc: 'Login to unlock your personal "My Reports" dashboard. Track the exact resolution lifecycle of every report you submit.',
      href: '/my-reports',
      cta: 'View My Reports',
      icon: ShieldCheck,
      accent: 'border-[#3fb950]/30 text-[#3fb950]'
    }
  ]

  const categories = [
    { label: 'Potholes & Roads', icon: '🛣️', color: 'border-red-500/20 bg-red-500/5' },
    { label: 'Street Lighting', icon: '💡', color: 'border-amber-500/20 bg-amber-500/5' },
    { label: 'Waste & Sanitation', icon: '♻️', color: 'border-emerald-500/20 bg-emerald-500/5' },
    { label: 'Water & Sewerage', icon: '💧', color: 'border-blue-500/20 bg-blue-500/5' },
    { label: 'Public Safety', icon: '🛡️', color: 'border-purple-500/20 bg-purple-500/5' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Exhibition Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#58a6ff]/15 via-[#bc8cff]/15 to-[#39d2c0]/15 border border-[#58a6ff]/30 shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#58a6ff] animate-pulse" />
            <span className="text-xs font-semibold text-[#f0f6fc] tracking-wide uppercase">
              Smart City Exhibition 2026 • Real-Time Civic Technology
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#f0f6fc] tracking-tight leading-[1.1] mb-6"
          >
            Empowering Citizens.{' '}
            <span className="gradient-text block mt-1">
              Transforming Cities in Real Time.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-[#7d8590] max-w-2xl mx-auto leading-relaxed mb-10"
          >
            CivicReport is an open smart city infrastructure platform connecting citizens with municipal authorities through live GIS mapping, instant dispatch, and transparent accountability.
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/map"
              className="btn-gradient px-7 py-3.5 rounded-2xl font-bold text-white text-base shadow-xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all"
            >
              <MapPin className="w-5 h-5" /> Explore Live Map
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/reports"
              className="px-7 py-3.5 rounded-2xl font-bold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] hover:border-[#30363d] text-base transition-all flex items-center gap-2.5 shadow-md hover:scale-105 active:scale-95"
            >
              <FileText className="w-5 h-5 text-[#58a6ff]" /> Browse Reports
            </Link>

            <Link
              href="/report"
              className="px-6 py-3.5 rounded-2xl font-semibold text-[#bc8cff] bg-[#bc8cff]/10 border border-[#bc8cff]/20 hover:bg-[#bc8cff]/20 text-base transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" /> Report Issue
            </Link>
          </motion.div>
        </div>

        {/* Hero Presentation Mockup / Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 relative max-w-5xl mx-auto rounded-3xl border border-[#21262d] bg-[#0d1117] p-4 sm:p-6 shadow-2xl glass-card overflow-hidden"
        >
          {/* Top Bar simulating platform window */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#21262d]/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f85149]" />
              <span className="w-3 h-3 rounded-full bg-[#d29922]" />
              <span className="w-3 h-3 rounded-full bg-[#3fb950]" />
              <span className="text-xs font-mono text-[#7d8590] ms-2">live.civicreport.smartcity/map</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3fb950]/15 text-[#3fb950] text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-ping" /> Live Connected
              </span>
            </div>
          </div>

          {/* Interactive preview teaser */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#06080d] to-[#161b22] border border-[#21262d] p-6 sm:p-8 overflow-hidden text-center">
            <div className="relative z-10 max-w-xl mx-auto">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#58a6ff]/10 text-[#58a6ff] mb-4">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#f0f6fc] mb-2">
                Real-Time GIS Interactive Map
              </h3>
              <p className="text-xs sm:text-sm text-[#7d8590] mb-6">
                Interactive Leaflet viewport with dynamic marker clustering, OSM geo-data, heatmaps, and instant socket notifications.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/map"
                  className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" /> Launch Map View
                </Link>
                <Link
                  href="/reports"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128]"
                >
                  View Public Feed
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
      <section className="py-12 border-y border-[#21262d]/80 bg-[#0d1117]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ label, value, desc, icon: Icon }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-[#161b22]/50 border border-[#21262d] relative overflow-hidden group hover:border-[#58a6ff]/40 transition-colors"
              >
                <Icon className="w-5 h-5 text-[#58a6ff] mb-2 opacity-80 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-black text-[#f0f6fc] tracking-tight">{value}</div>
                <div className="text-xs font-semibold text-[#58a6ff] uppercase tracking-wider mt-0.5">{label}</div>
                <p className="text-[11px] text-[#7d8590] mt-1">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CORE PILLARS (MAP, REPORTS, MY REPORTS)
          ═══════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#58a6ff] mb-2">Platform Structure</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#f0f6fc] tracking-tight">
            Designed for Citizens and City Leadership
          </h3>
          <p className="text-sm text-[#7d8590] mt-2">
            Seamless navigation across three primary operational tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col justify-between p-7 rounded-3xl bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/40 transition-all hover:-translate-y-1 glass-card"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-[#161b22] border flex items-center justify-center mb-5 ${pillar.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-[#f0f6fc] mb-2.5">{pillar.title}</h4>
                  <p className="text-sm text-[#7d8590] leading-relaxed mb-6">{pillar.desc}</p>
                </div>

                <Link
                  href={pillar.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#58a6ff] hover:text-[#79b8ff] transition-colors"
                >
                  {pillar.cta} <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS (3-STEP WORKFLOW)
          ═══════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#21262d]/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#39d2c0]/10 text-[#39d2c0] text-xs font-semibold uppercase tracking-wider mb-3">
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#f0f6fc] tracking-tight">
            How CivicReport Works
          </h2>
          <p className="text-sm text-[#7d8590] mt-2">
            From reporting an issue to watching it get fixed — completely transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative p-8 rounded-3xl bg-[#0d1117] border border-[#21262d] glass-card"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-[#7d8590]/30 font-mono">{step.num}</span>
                  <span className="px-3 py-1 rounded-full bg-[#161b22] border border-[#21262d] text-xs font-semibold text-[#58a6ff]">
                    {step.badge}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#58a6ff]/20 to-[#bc8cff]/20 border border-[#58a6ff]/30 flex items-center justify-center text-[#58a6ff] mb-5">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-[#f0f6fc] mb-2.5">{step.title}</h3>
                <p className="text-sm text-[#7d8590] leading-relaxed">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MUNICIPAL HAZARD CATEGORIES
          ═══════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#21262d]/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[#f0f6fc]">Supported Civic Categories</h3>
            <p className="text-xs text-[#7d8590] mt-1">Classified and routed automatically to municipal response teams</p>
          </div>
          <Link
            href="/report"
            className="text-xs font-semibold text-[#58a6ff] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Submit an Issue Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categories.map((c) => (
            <div
              key={c.label}
              className={`p-4 rounded-2xl border ${c.color} flex flex-col items-center text-center justify-center gap-2`}
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-xs font-semibold text-[#f0f6fc]">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EXHIBITION CTA BANNER
          ═══════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-br from-[#161b22] via-[#0d1117] to-[#161b22] border border-[#58a6ff]/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f0f6fc] tracking-tight mb-4">
              Experience the Future of Smart Cities
            </h2>
            <p className="text-sm sm:text-base text-[#7d8590] mb-8 leading-relaxed">
              CivicReport brings real-time citizen-government collaboration to life. Test out the interactive map, inspect community reports, or file a live hazard report right now.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/map"
                className="btn-gradient px-8 py-3.5 rounded-2xl font-bold text-white shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <MapPin className="w-5 h-5" /> Launch Live Map
              </Link>
              <Link
                href="/reports"
                className="px-8 py-3.5 rounded-2xl font-bold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] transition-colors"
              >
                Explore Reports
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
      <footer className="border-t border-[#21262d] py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#7d8590]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center text-white text-[10px] font-bold">
              CR
            </div>
            <span className="font-semibold text-[#f0f6fc]">CivicReport Smart City Platform</span>
          </div>

          <div className="flex items-center gap-5 sm:gap-6 flex-wrap justify-center">
            <Link href="/" className="hover:text-[#f0f6fc] transition-colors">Home</Link>
            <Link href="/map" className="hover:text-[#f0f6fc] transition-colors">Map</Link>
            <Link href="/reports" className="hover:text-[#f0f6fc] transition-colors">Reports</Link>
            <Link href="/my-reports" className="hover:text-[#f0f6fc] transition-colors">My Reports</Link>
            <Link href="/about" className="hover:text-[#f0f6fc] transition-colors">About & SDGs</Link>
            <Link href="/help" className="hover:text-[#f0f6fc] transition-colors">Help</Link>
          </div>

          <p>© 2026 CivicReport. Presented for Smart City Exhibition.</p>
        </div>
      </footer>
    </div>
  )
}
