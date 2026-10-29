'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { 
  HelpCircle, 
  MapPin, 
  Camera, 
  PhoneCall, 
  ChevronDown, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  FileText
} from 'lucide-react'
import { useTranslations } from '@/context/LocaleContext'

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const t = useTranslations('help')
  const tNav = useTranslations('nav')

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const steps = [
    {
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: MapPin,
      badge: t('step1Badge')
    },
    {
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: Camera,
      badge: t('step2Badge')
    },
    {
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: FileText,
      badge: t('step3Badge')
    },
    {
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: CheckCircle2,
      badge: t('step4Badge')
    }
  ]

  const faqs = [
    {
      q: t('faq1Q'),
      a: t('faq1A')
    },
    {
      q: t('faq2Q'),
      a: t('faq2A')
    },
    {
      q: t('faq3Q'),
      a: t('faq3A')
    },
    {
      q: t('faq4Q'),
      a: t('faq4A')
    },
    {
      q: t('faq5Q'),
      a: t('faq5A')
    },
    {
      q: t('faq6Q'),
      a: t('faq6A')
    }
  ]

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const emergencyContacts = [
    { name: 'Rescue & Medical Emergency', number: '1122', desc: 'Ambulance & Fire Rescue' },
    { name: 'Police Helpline', number: '15', desc: 'Emergency Law Enforcement' },
    { name: 'Disaster Management (NDMA/PDMA)', number: '1129', desc: 'Flash floods & heavy storm damage' },
    { name: 'Electricity Emergency Complaints', number: '118', desc: 'Fallen live wires & power grid hazard' }
  ]

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-3 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 md:pb-16 max-w-5xl mx-auto">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/3 w-72 sm:w-80 h-72 sm:h-80 bg-[#58a6ff]/5 rounded-full blur-3xl" />
        <div className="absolute top-96 right-1/4 w-72 sm:w-80 h-72 sm:h-80 bg-[#39d2c0]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f0f6fc] tracking-tight mb-2 sm:mb-3">
            {t('title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#7d8590] leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Quick Search */}
          <div className="mt-5 sm:mt-6 relative max-w-lg mx-auto">
            <Search className="absolute start-3.5 sm:start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d8590]" />
            <input
              type="text"
              dir="auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full ps-10 sm:ps-11 pe-4 py-2.5 sm:py-3 rounded-2xl bg-[#0d1117] border border-[#21262d] text-xs sm:text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]/50 shadow-sm transition-colors text-start [unicode-bidi:plaintext]"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            HOW TO REPORT AN ISSUE (STEP BY STEP)
            ═══════════════════════════════════════════ */}
        <section className="mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-[#21262d]">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#f0f6fc]">
                {t('stepsHeading')}
              </h2>
              <p className="text-xs text-[#7d8590] mt-0.5">{t('stepsSubtitle')}</p>
            </div>
            <Link
              href="/report"
              className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" /> {t('startReport')}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {steps.map((st) => {
              const Icon = st.icon
              return (
                <div
                  key={st.title}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0d1117] border border-[#21262d] glass-card relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#58a6ff]/20 to-[#bc8cff]/20 border border-[#58a6ff]/30 text-[#58a6ff] flex items-center justify-center">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#7d8590] px-2 py-0.5 rounded-md bg-[#161b22] border border-[#21262d]">
                        {st.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#f0f6fc] mb-1.5">{st.title}</h3>
                    <p className="text-xs text-[#7d8590] leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
            ═══════════════════════════════════════════ */}
        <section className="mb-12 sm:mb-16">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#f0f6fc]">
              {t('faqHeading')}
            </h2>
            <p className="text-xs text-[#7d8590] mt-0.5">{t('faqSubtitle')}</p>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#0d1117] border border-[#21262d] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-3 hover:bg-[#161b22]/40 transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs sm:text-sm font-semibold text-[#f0f6fc] leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7d8590] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#58a6ff]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-[#7d8590] leading-relaxed whitespace-pre-line border-t border-[#21262d]/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {filteredFaqs.length === 0 && (
              <div className="p-6 sm:p-8 text-center rounded-2xl bg-[#0d1117] border border-[#21262d] text-xs sm:text-sm text-[#7d8590]">
                {t('noFaqs', { query: searchQuery })}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            EMERGENCY NOTICE & HOTLINES
            ═══════════════════════════════════════════ */}
        <section className="mb-12 sm:mb-14">
          <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-[#f85149]/10 via-[#0d1117] to-[#0d1117] border border-[#f85149]/30">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3 text-[#f85149]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-[#f0f6fc]">
                {t('emergencyBadge')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#7d8590] leading-relaxed mb-5 sm:mb-6">
              {t('emergencyDesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.number}
                  className="p-3 sm:p-3.5 rounded-xl bg-[#161b22] border border-[#21262d] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-[#f0f6fc] truncate untranslated" dir="ltr">{contact.name}</span>
                    <span className="block text-[10px] text-[#7d8590] truncate untranslated" dir="ltr">{contact.desc}</span>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f85149]/15 text-[#f85149] font-mono font-bold text-xs hover:bg-[#f85149]/25 transition-colors shrink-0 untranslated"
                    dir="ltr"
                  >
                    <PhoneCall className="w-3 h-3" /> {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Navigation CTA */}
        <div className="text-center pt-6 sm:pt-8 border-t border-[#21262d]">
          <h4 className="text-sm sm:text-base font-bold text-[#f0f6fc] mb-3">{t('readyToExplore')}</h4>
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs font-semibold flex-wrap">
            <Link href="/" className="text-[#58a6ff] hover:underline flex items-center gap-1">
              {tNav('home')} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </Link>
            <Link href="/map" className="text-[#58a6ff] hover:underline flex items-center gap-1">
              {tNav('map')} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </Link>
            <Link href="/reports" className="text-[#58a6ff] hover:underline flex items-center gap-1">
              {tNav('reports')} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </Link>
            <Link href="/about" className="text-[#58a6ff] hover:underline flex items-center gap-1">
              {tNav('about')} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
