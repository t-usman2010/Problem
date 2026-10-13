'use client'
import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
      modalRef.current?.focus()
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={`relative z-10 w-full ${maxWidth} rounded-lg border border-[#2a2d3e] bg-[#1a1d27] p-6 shadow-xl focus:outline-none`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#f0f0f0]">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-[#8b8fa8] hover:bg-[#2a2d3e] hover:text-[#f0f0f0] transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
