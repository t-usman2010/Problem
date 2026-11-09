'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, ArrowUp } from 'lucide-react'
import { useTranslations } from '@/context/LocaleContext'

export default function Footer() {
  const pathname = usePathname()
  const tCommon = useTranslations('common')

  // Do not render footer on the full-screen interactive Leaflet map canvas
  if (pathname === '/map') {
    return null
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const navLinks = [
    { href: '/map', label: 'Live Map' },
    { href: '/reports', label: 'Reports' },
    { href: '/report', label: 'Report Issue' },
    { href: '/about', label: 'About' },
    { href: '/help', label: 'Help & FAQ' }
  ]

  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer"
      className="relative z-10 border-t border-[#21262d]/80 bg-[#06080d]/90 backdrop-blur-md text-[#7d8590]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#21262d]/60">
          
          {/* Brand & Mission Statement */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-start">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] shadow-md group-hover:scale-105 transition-transform duration-200">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-[#f0f6fc] tracking-tight group-hover:text-[#58a6ff] transition-colors">
                {tCommon('appName', { defaultValue: 'CivicReport' })}
              </span>
            </Link>
            <span className="hidden sm:inline text-[#30363d]">•</span>
            <p className="text-xs text-[#7d8590] max-w-sm">
              Empowering communities with transparent civic issue reporting and real-time tracking.
            </p>
          </div>

          {/* Clean Essential Links */}
          <nav className="flex items-center gap-5 sm:gap-6 flex-wrap justify-center text-xs font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#7d8590] hover:text-[#58a6ff] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#484f58] text-center sm:text-start">
            © {new Date().getFullYear()} CivicReport. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d] text-[#7d8590] hover:border-[#30363d] hover:text-[#f0f6fc] transition-all text-xs font-medium cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  )
}
