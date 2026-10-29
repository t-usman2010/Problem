'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { 
  Globe2, 
  Building2, 
  Droplets, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  MapPin, 
  CheckCircle2, 
  Radio, 
  Target, 
  Lock,
  Layers,
  Database
} from 'lucide-react'
import { useTranslations } from '@/context/LocaleContext'

export default function AboutPage() {
  const t = useTranslations('about')

  const sdgs = [
    {
      number: '11',
      title: t('sdg11Title'),
      subtitle: t('sdg11Subtitle'),
      color: '#F99D26', // Official SDG 11 color
      bgLight: 'rgba(249, 157, 38, 0.1)',
      border: 'rgba(249, 157, 38, 0.3)',
      icon: Building2,
      targets: [
        'Target 11.2: Safe, affordable, and accessible transport systems by fixing hazardous road damage and potholes.',
        'Target 11.3: Inclusive and sustainable urbanization through participatory citizen-driven civic planning.',
        'Target 11.6: Reduce environmental impact of cities by rapidly reporting and clearing municipal garbage heaps.'
      ],
      impact: t('sdg11Impact')
    },
    {
      number: '9',
      title: t('sdg9Title'),
      subtitle: t('sdg9Subtitle'),
      color: '#F36D25', // Official SDG 9 color
      bgLight: 'rgba(243, 109, 37, 0.1)',
      border: 'rgba(243, 109, 37, 0.3)',
      icon: Cpu,
      targets: [
        'Target 9.1: Develop quality, reliable, sustainable, and resilient infrastructure to support economic development.',
        'Target 9.c: Significantly increase access to information and communications technology via progressive web applications.'
      ],
      impact: t('sdg9Impact')
    },
    {
      number: '6',
      title: t('sdg6Title'),
      subtitle: t('sdg6Subtitle'),
      color: '#26BDE2', // Official SDG 6 color
      bgLight: 'rgba(38, 189, 226, 0.1)',
      border: 'rgba(38, 189, 226, 0.3)',
      icon: Droplets,
      targets: [
        'Target 6.3: Improve water quality by eliminating dumping and hazardous waste near municipal water conduits.',
        'Target 6.4: Increase water-use efficiency by rapidly flagging broken public supply lines and preventing clean water waste.'
      ],
      impact: t('sdg6Impact')
    },
    {
      number: '16',
      title: t('sdg16Title'),
      subtitle: t('sdg16Subtitle'),
      color: '#00689D', // Official SDG 16 color
      bgLight: 'rgba(0, 104, 157, 0.1)',
      border: 'rgba(0, 104, 157, 0.3)',
      icon: ShieldCheck,
      targets: [
        'Target 16.6: Develop effective, accountable, and transparent municipal institutions through open public tracking.',
        'Target 16.7: Ensure responsive, inclusive, and representative decision-making at all community levels.'
      ],
      impact: t('sdg16Impact')
    }
  ]

  const comparisons = [
    {
      legacy: t('comp1Legacy'),
      modern: t('comp1Modern')
    },
    {
      legacy: t('comp2Legacy'),
      modern: t('comp2Modern')
    },
    {
      legacy: t('comp3Legacy'),
      modern: t('comp3Modern')
    },
    {
      legacy: t('comp4Legacy'),
      modern: t('comp4Modern')
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
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-3 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 md:pb-16 max-w-6xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#58a6ff]/5 rounded-full blur-3xl" />
        <div className="absolute top-80 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#bc8cff]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f0f6fc] tracking-tight mb-3 sm:mb-4 leading-tight"
          >
            {t('title')}{' '}
            <span className="gradient-text">{t('titleGradient')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-base md:text-lg text-[#7d8590] leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════
            SPECIAL SECTION: UN SUSTAINABLE DEVELOPMENT GOALS
            ═══════════════════════════════════════════ */}
        <section className="mb-14 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-[#21262d]">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f99d26] uppercase tracking-widest mb-1">
                <Target className="w-4 h-4" /> {t('sdgBadge')}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#f0f6fc]">
                {t('sdgHeading')}
              </h2>
            </div>
            {/* Monospace untranslated badge */}
            <span className="px-3 py-1 rounded-xl bg-[#161b22] border border-[#21262d] text-xs font-semibold text-[#7d8590] self-start sm:self-auto untranslated" dir="ltr">
              {t('sdgGoalsTag')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {sdgs.map((sdg, idx) => {
              const Icon = sdg.icon
              return (
                <motion.div
                  key={sdg.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl p-5 sm:p-7 bg-[#0d1117] border relative overflow-hidden glass-card flex flex-col justify-between"
                  style={{ borderColor: sdg.border }}
                >
                  <div>
                    {/* Top Tag & Number */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl text-white shadow-md shrink-0 untranslated"
                          dir="ltr"
                          style={{ backgroundColor: sdg.color }}
                        >
                          {sdg.number}
                        </div>
                        <div>
                          <span
                            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block"
                            style={{ color: sdg.color }}
                          >
                            {t('sdgGoalLabel', { number: sdg.number })}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#f0f6fc] leading-snug">
                            {sdg.title}
                          </h3>
                        </div>
                      </div>
                      <Icon className="w-5 h-5 shrink-0 opacity-40 text-[#7d8590]" />
                    </div>

                    <p className="text-xs text-[#7d8590] italic mb-3 sm:mb-4">
                      &ldquo;{sdg.subtitle}&rdquo;
                    </p>

                    {/* Targets: UN Target text in English is aligned to the left */}
                    <div className="space-y-2 mb-4 sm:mb-5">
                      {sdg.targets.map((tgt, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-2 text-xs text-[#f0f6fc]">
                          <CheckCircle2
                            className="w-3.5 h-3.5 mt-0.5 shrink-0"
                            style={{ color: sdg.color }}
                          />
                          <span className="leading-relaxed text-start [unicode-bidi:plaintext] user-content" dir="auto">
                            {tgt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact Summary Box */}
                  <div
                    className="p-3 sm:p-3.5 rounded-2xl text-xs leading-relaxed mt-2"
                    style={{ backgroundColor: sdg.bgLight, border: `1px solid ${sdg.border}` }}
                  >
                    <span className="font-semibold block mb-0.5" style={{ color: sdg.color }}>
                      {t('howContributes')}
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
        <section className="mb-14 sm:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#58a6ff] mb-1">
              {t('evolutionBadge')}
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#f0f6fc]">
              {t('evolutionTitle')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {comparisons.map((c, i) => (
              <div key={i} className="p-4 sm:p-6 rounded-2xl bg-[#0d1117] border border-[#21262d] space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#f85149]/15 text-[#f85149] text-[10px] font-bold uppercase shrink-0">
                    {t('traditional')}
                  </span>
                  <p className="text-xs text-[#7d8590] leading-relaxed">{c.legacy}</p>
                </div>
                <div className="flex items-start gap-2.5 sm:gap-3 pt-3 border-t border-[#21262d]/60">
                  <span className="px-2 py-0.5 rounded-md bg-[#3fb950]/15 text-[#3fb950] text-[10px] font-bold uppercase shrink-0">
                    {t('civicReport')}
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
        <section className="mb-14 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-[#21262d]">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#58a6ff] uppercase tracking-widest mb-1">
                <Cpu className="w-4 h-4" /> {t('blueprintBadge')}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#f0f6fc]">
                {t('blueprintTitle')}
              </h2>
            </div>
            <span className="text-xs text-[#7d8590]">{t('blueprintSync')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon
              return (
                <div
                  key={tech.name}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#21262d] text-[#58a6ff] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Tech stack names and roles are technical English: forced LTR left-aligned */}
                  <h4 className="text-sm font-bold text-[#f0f6fc] mb-1 untranslated" dir="ltr">{tech.name}</h4>
                  <p className="text-xs text-[#7d8590] leading-relaxed untranslated" dir="ltr">{tech.role}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CALL TO ACTION BANNER
            ═══════════════════════════════════════════ */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#58a6ff]/30 text-center relative overflow-hidden shadow-2xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#f0f6fc] mb-2 sm:mb-3">
            {t('ctaHeading')}
          </h3>
          <p className="text-xs sm:text-sm text-[#7d8590] max-w-xl mx-auto mb-6 leading-relaxed">
            {t('ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/map"
              className="btn-gradient w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" /> {t('openMap')}
            </Link>
            <Link
              href="/reports"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-[#f0f6fc] bg-[#161b22] border border-[#21262d] hover:bg-[#1c2128] text-xs sm:text-sm text-center"
            >
              {t('viewFeed')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
