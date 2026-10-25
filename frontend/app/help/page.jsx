'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { 
  HelpCircle, 
  MapPin, 
  Camera, 
  Clock, 
  PhoneCall, 
  ChevronDown, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
  FileText,
  UserCheck
} from 'lucide-react'

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const steps = [
    {
      title: 'Pin Exact Location',
      desc: 'Use the "Near Me" button to auto-detect your current GPS coordinates, or drag the interactive marker directly to the hazard on the map.',
      icon: MapPin,
      badge: 'Step 1'
    },
    {
      title: 'Photograph the Hazard',
      desc: 'Take a clear, well-lit photo showing both the issue (e.g. pothole or broken streetlight) and enough surrounding context for repair crews to locate it.',
      icon: Camera,
      badge: 'Step 2'
    },
    {
      title: 'Select Category & Details',
      desc: 'Choose from Potholes, Streetlights, Garbage, Water Issue, or Other. Add a concise title and helpful notes for the municipal department.',
      icon: FileText,
      badge: 'Step 3'
    },
    {
      title: 'Track Live Progress',
      desc: 'Once submitted, your report appears instantly on the public map. Track status updates and community upvotes in your "My Reports" tab.',
      icon: CheckCircle2,
      badge: 'Step 4'
    }
  ]

  const faqs = [
    {
      q: 'Do I need an account to view or submit civic reports?',
      a: 'Anyone can freely browse the interactive map and community reports feed without an account. To submit new reports or access your personal "My Reports" dashboard, creating a quick free account is required to prevent fraudulent reports and verify authentic civic engagement.'
    },
    {
      q: 'How does the interactive map auto-detect my position?',
      a: 'The platform uses the HTML5 Geolocation API with high accuracy GPS triangulation. When you click "Near Me" or open the report form, your browser requests permission to read your coordinates. Your location data is used strictly for civic issue placement.'
    },
    {
      q: 'What do the report statuses (Pending, In Progress, Resolved) mean?',
      a: '• Pending: The issue has been registered and queued for municipal review.\n• In Progress: The assigned department (Roads, Sanitation, Water, Lighting) has dispatched inspection or repair crews.\n• Resolved: The hazard has been repaired, verified, and officially closed.'
    },
    {
      q: 'How does community upvoting work?',
      a: 'Citizens can upvote any reported hazard on the map or in the reports feed. Reports with higher upvote counts signal urgent community concern, helping city administrators prioritize critical repairs first.'
    },
    {
      q: 'Why does "My Reports" require a login?',
      a: 'Your "My Reports" dashboard is private to your authenticated session. It specifically isolates and displays the exact reports you have created, ensuring you can track personal submissions without sorting through citywide feeds.'
    },
    {
      q: 'What should I do if an issue is an immediate life-threatening emergency?',
      a: 'CivicReport is built for municipal infrastructure maintenance and scheduled repairs. For active emergencies (such as severe electrical wire sparking, major gas leaks, collapse, or vehicle collisions), please immediately contact local emergency services (Rescue 1122 or Police 15) using the emergency hotlines listed below.'
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
    <div className="relative min-h-[calc(100vh-64px)] mt-16 px-4 sm:px-6 lg:px-8 py-12 max-w-5xl mx-auto">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/3 w-80 h-80 bg-[#58a6ff]/5 rounded-full blur-3xl" />
        <div className="absolute top-96 right-1/4 w-80 h-80 bg-[#39d2c0]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/20 text-xs font-semibold text-[#58a6ff] uppercase tracking-wider mb-4">
            <HelpCircle className="w-4 h-4" /> Citizen Help Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f0f6fc] tracking-tight mb-3">
            How Can We Help You?
          </h1>
          <p className="text-sm text-[#7d8590] leading-relaxed">
            Everything you need to know about reporting civic hazards, tracking repairs, and using the smart city platform.
          </p>

          {/* Quick Search */}
          <div className="mt-6 relative max-w-lg mx-auto">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d8590]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics or questions..."
              className="w-full ps-11 pe-4 py-3 rounded-2xl bg-[#0d1117] border border-[#21262d] text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]/50 shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            HOW TO REPORT AN ISSUE (STEP BY STEP)
            ═══════════════════════════════════════════ */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#21262d]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#f0f6fc]">
                Reporting in 4 Easy Steps
              </h2>
              <p className="text-xs text-[#7d8590] mt-0.5">Quick guide to lodging effective, geo-accurate complaints</p>
            </div>
            <Link
              href="/report"
              className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Start Report
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st, i) => {
              const Icon = st.icon
              return (
                <div
                  key={st.title}
                  className="p-5 rounded-2xl bg-[#0d1117] border border-[#21262d] glass-card relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#58a6ff]/20 to-[#bc8cff]/20 border border-[#58a6ff]/30 text-[#58a6ff] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#7d8590] font-mono px-2 py-0.5 rounded-md bg-[#161b22] border border-[#21262d]">
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
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#f0f6fc]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#7d8590] mt-0.5">Clear answers to platform features and civic participation</p>
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
                    className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 hover:bg-[#161b22]/40 transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-[#f0f6fc]">
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
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#7d8590] leading-relaxed whitespace-pre-line border-t border-[#21262d]/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {filteredFaqs.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-[#0d1117] border border-[#21262d] text-sm text-[#7d8590]">
                No FAQs matched "{searchQuery}". Try a different keyword or contact support.
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            EMERGENCY NOTICE & HOTLINES
            ═══════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#f85149]/10 via-[#0d1117] to-[#0d1117] border border-[#f85149]/30">
            <div className="flex items-center gap-3 mb-3 text-[#f85149]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-[#f0f6fc]">
                Emergency Protocol Notice
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#7d8590] leading-relaxed mb-6">
              CivicReport is strictly intended for non-emergency public works, sanitation, and municipal maintenance. 
              If you witness an immediate emergency threatening human life, fire, or severe disaster, immediately dial official hotlines:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.number}
                  className="p-3.5 rounded-xl bg-[#161b22] border border-[#21262d] flex items-center justify-between"
                >
                  <div>
                    <span className="block text-xs font-bold text-[#f0f6fc]">{contact.name}</span>
                    <span className="block text-[10px] text-[#7d8590]">{contact.desc}</span>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f85149]/15 text-[#f85149] font-mono font-bold text-xs hover:bg-[#f85149]/25 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" /> {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Navigation CTA */}
        <div className="text-center pt-8 border-t border-[#21262d]">
          <h4 className="text-base font-bold text-[#f0f6fc] mb-2">Ready to explore?</h4>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold">
            <Link href="/" className="text-[#58a6ff] hover:underline flex items-center gap-1">
              Home <ArrowRight className="w-3 h-3" />
            </Link>
            <Link href="/map" className="text-[#58a6ff] hover:underline flex items-center gap-1">
              Live Map <ArrowRight className="w-3 h-3" />
            </Link>
            <Link href="/reports" className="text-[#58a6ff] hover:underline flex items-center gap-1">
              Community Feed <ArrowRight className="w-3 h-3" />
            </Link>
            <Link href="/about" className="text-[#58a6ff] hover:underline flex items-center gap-1">
              UN SDGs & Mission <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
