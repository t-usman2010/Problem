'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { 
  Globe2, 
  Building2, 
  Droplets, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  Radio, 
  Target, 
  Award, 
  Share2,
  Lock,
  Layers,
  Database
} from 'lucide-react'

export default function AboutPage() {
  const sdgs = [
    {
      number: '11',
      title: 'Sustainable Cities and Communities',
      subtitle: 'Make cities inclusive, safe, resilient, and sustainable',
      color: '#F99D26', // Official SDG 11 color
      bgLight: 'rgba(249, 157, 38, 0.1)',
      border: 'rgba(249, 157, 38, 0.3)',
      icon: Building2,
      targets: [
        'Target 11.2: Safe, affordable, and accessible transport systems by fixing hazardous road damage and potholes.',
        'Target 11.3: Inclusive and sustainable urbanization through participatory citizen-driven civic planning.',
        'Target 11.6: Reduce environmental impact of cities by rapidly reporting and clearing municipal garbage heaps.'
      ],
      impact: 'CivicReport provides a transparent bridge between urban residents and municipal administrators, turning passive bystanders into active contributors to their local neighborhood.'
    },
    {
      number: '9',
      title: 'Industry, Innovation and Infrastructure',
      subtitle: 'Build resilient infrastructure and foster sustainable innovation',
      color: '#F36D25', // Official SDG 9 color
      bgLight: 'rgba(243, 109, 37, 0.1)',
      border: 'rgba(243, 109, 37, 0.3)',
      icon: Cpu,
      targets: [
        'Target 9.1: Develop quality, reliable, sustainable, and resilient infrastructure to support economic development.',
        'Target 9.c: Significantly increase access to information and communications technology via progressive web applications.'
      ],
      impact: 'Utilizes modern geospatial GIS technology, WebSockets, and real-time mapping to identify critical infrastructure failure points before they lead to severe accidents.'
    },
    {
      number: '6',
      title: 'Clean Water and Sanitation',
      subtitle: 'Ensure availability and sustainable management of water and sanitation',
      color: '#26BDE2', // Official SDG 6 color
      bgLight: 'rgba(38, 189, 226, 0.1)',
      border: 'rgba(38, 189, 226, 0.3)',
      icon: Droplets,
      targets: [
        'Target 6.3: Improve water quality by eliminating dumping and hazardous waste near municipal water conduits.',
        'Target 6.4: Increase water-use efficiency by rapidly flagging broken public supply lines and preventing clean water waste.'
      ],
      impact: 'Pipeline bursts and open sewage leaks can be immediately geo-tagged by citizens, allowing water authorities to dispatch repair crews and safeguard community hygiene.'
    },
    {
      number: '16',
      title: 'Peace, Justice and Strong Institutions',
      subtitle: 'Build effective, accountable, and inclusive institutions at all levels',
      color: '#00689D', // Official SDG 16 color
      bgLight: 'rgba(0, 104, 157, 0.1)',
      border: 'rgba(0, 104, 157, 0.3)',
      icon: ShieldCheck,
      targets: [
        'Target 16.6: Develop effective, accountable, and transparent municipal institutions through open public tracking.',
        'Target 16.7: Ensure responsive, inclusive, and representative decision-making at all community levels.'
      ],
      impact: 'Every reported issue has a public status timeline. Municipalities cannot bury complaints, fostering public trust and institutional integrity.'
    }
  ]

  const comparisons = [
    {
      legacy: 'Manual paper forms, lost phone calls, and unaccountable complaint boxes.',
      modern: 'Real-time WebSocket alerts with sub-meter GPS accuracy on an interactive GIS map.'
    },
    {
      legacy: 'Zero transparency: citizens never know if an issue is being investigated.',
      modern: 'Public status lifecycle: Pending → In Progress → Resolved, visible to the whole city.'
    },
    {
      legacy: 'No prioritization: urgent safety hazards sit in the same queue as minor cosmetic issues.',
      modern: 'Crowdsourced community upvoting automatically surfaces the most critical hazards.'
    },
    {
      legacy: 'Duplicate reports clutter staff databases and create administrative logjams.',
      modern: 'Proximity detection and clustered map markers prevent repetitive reports.'
    }
  ]

  const techStack = [
    { name: 'Next.js 16 & React 19', role: 'Fullstack App Router, Server Components & Hydration', icon: Layers },
    { name: 'Leaflet & OpenStreetMap', role: 'Interactive Geospatial GIS, Clusters & Heatmaps', icon: MapPin },
    { name: 'Socket.io WebSockets', role: 'Sub-100ms bidirectional real-time event broadcasting', icon: Radio },
    { name: 'Node.js & MongoDB GridFS', role: 'Resilient REST API with chunked image binary storage', icon: Database },
    { name: 'Tailwind CSS v4 Engine', role: 'Adaptive light/dark dual themes and device detection', icon: Sparkles },
    { name: 'Role-Based Security', role: 'Citizen authentication & administrative verification', icon: Lock }
  ]

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-4 sm:px-6 lg:px-8 py-12 max-w-6xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#58a6ff]/5 rounded-full blur-3xl" />
        <div className="absolute top-80 right-1/4 w-96 h-96 bg-[#bc8cff]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#58a6ff]/15 to-[#39d2c0]/15 border border-[#58a6ff]/30 text-xs font-semibold text-[#58a6ff] uppercase tracking-wider mb-4"
          >
            <Globe2 className="w-4 h-4" /> Global Goals & Smart City Vision
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#f0f6fc] tracking-tight mb-4"
          >
            Architecting Sustainable,{' '}
            <span className="gradient-text">Citizen-Powered Cities</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[#7d8590] leading-relaxed"
          >
            CivicReport is an open civic technology platform developed for the Smart City Exhibition 2026. 
            It is designed to accelerate the United Nations Sustainable Development Goals by giving every resident a direct, accountable voice in their city’s infrastructure.
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════
            SPECIAL SECTION: UN SUSTAINABLE DEVELOPMENT GOALS
            ═══════════════════════════════════════════ */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#21262d]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#f99d26] uppercase tracking-widest mb-1">
                <Target className="w-4 h-4" /> United Nations Alignment
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc]">
                Commitment to the 2030 Agenda
              </h2>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#161b22] border border-[#21262d] text-xs font-semibold text-[#7d8590] self-start sm:self-auto">
              UN SDGs 11 • 9 • 6 • 16
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sdgs.map((sdg, idx) => {
              const Icon = sdg.icon
              return (
                <motion.div
                  key={sdg.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl p-7 bg-[#0d1117] border relative overflow-hidden glass-card flex flex-col justify-between"
                  style={{ borderColor: sdg.border }}
                >
                  <div>
                    {/* Top Tag & Number */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md shrink-0"
                          style={{ backgroundColor: sdg.color }}
                        >
                          {sdg.number}
                        </div>
                        <div>
                          <span
                            className="text-[11px] font-bold uppercase tracking-wider block"
                            style={{ color: sdg.color }}
                          >
                            SDG Goal {sdg.number}
                          </span>
                          <h3 className="text-lg font-bold text-[#f0f6fc] leading-snug">
                            {sdg.title}
                          </h3>
                        </div>
                      </div>
                      <Icon className="w-5 h-5 shrink-0 opacity-40 text-[#7d8590]" />
                    </div>

                    <p className="text-xs text-[#7d8590] italic mb-4">
                      "{sdg.subtitle}"
                    </p>

                    {/* Targets */}
                    <div className="space-y-2 mb-5">
                      {sdg.targets.map((tgt, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-2 text-xs text-[#f0f6fc]">
                          <CheckCircle2
                            className="w-3.5 h-3.5 mt-0.5 shrink-0"
                            style={{ color: sdg.color }}
                          />
                          <span>{tgt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact Summary Box */}
                  <div
                    className="p-3.5 rounded-2xl text-xs leading-relaxed"
                    style={{ backgroundColor: sdg.bgLight, border: `1px solid ${sdg.border}` }}
                  >
                    <span className="font-semibold block mb-0.5" style={{ color: sdg.color }}>
                      How CivicReport Contributes:
                    </span>
                    <span className="text-[#f0f6fc]/90">{sdg.impact}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            THE CIVIC PROBLEM VS OUR SOLUTION
            ═══════════════════════════════════════════ */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#58a6ff] mb-1">
              Urban Governance Evolution
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc]">
              Replacing Legacy Bureaucracy with Real-Time Action
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisons.map((c, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#0d1117] border border-[#21262d] space-y-4">
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#f85149]/15 text-[#f85149] text-[10px] font-bold uppercase">
                    Traditional
                  </span>
                  <p className="text-xs text-[#7d8590] leading-relaxed">{c.legacy}</p>
                </div>
                <div className="flex items-start gap-3 pt-3 border-t border-[#21262d]/60">
                  <span className="px-2 py-0.5 rounded-md bg-[#3fb950]/15 text-[#3fb950] text-[10px] font-bold uppercase">
                    CivicReport
                  </span>
                  <p className="text-xs font-medium text-[#f0f6fc] leading-relaxed">{c.modern}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TECHNICAL ARCHITECTURE & EXCELLENCE
            ═══════════════════════════════════════════ */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#21262d]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#58a6ff] uppercase tracking-widest mb-1">
                <Cpu className="w-4 h-4" /> Technical Blueprint
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc]">
                High-Performance Fullstack Architecture
              </h2>
            </div>
            <span className="text-xs text-[#7d8590]">Production Ready • Sub-100ms Sync</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon
              return (
                <div
                  key={tech.name}
                  className="p-5 rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#21262d] text-[#58a6ff] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#f0f6fc] mb-1">{tech.name}</h4>
                  <p className="text-xs text-[#7d8590] leading-relaxed">{tech.role}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CALL TO ACTION BANNER
            ═══════════════════════════════════════════ */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#58a6ff]/30 text-center relative overflow-hidden shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc] mb-3">
            Be Part of Your City's Sustainable Future
          </h3>
          <p className="text-xs sm:text-sm text-[#7d8590] max-w-xl mx-auto mb-6">
            Test the live platform during the exhibition. Pin an issue on the live map, inspect ongoing city repairs, or file your first report.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/map"
              className="btn-gradient px-6 py-3 rounded-xl font-bold text-white text-sm shadow-lg flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Open City Map
            </Link>
            <Link
              href="/reports"
              className="px-6 py-3 rounded-xl font-semibold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] text-sm"
            >
              View Community Feed
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
