'use client'
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info
}

const colors = {
  success: { border: 'border-[#3fb950]/30', bg: 'bg-[#3fb950]/10', icon: 'text-[#3fb950]', glow: 'shadow-[0_0_20px_rgba(63,185,80,0.15)]' },
  error: { border: 'border-[#f85149]/30', bg: 'bg-[#f85149]/10', icon: 'text-[#f85149]', glow: 'shadow-[0_0_20px_rgba(248,81,73,0.15)]' },
  info: { border: 'border-[#58a6ff]/30', bg: 'bg-[#58a6ff]/10', icon: 'text-[#58a6ff]', glow: 'shadow-[0_0_20px_rgba(88,166,255,0.15)]' }
}

function ToastItem({ toast, onDismiss }) {
  const Icon = icons[toast.type]
  const c = colors[toast.type]
  return (
    <div className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${c.border} ${c.bg} bg-[#0d1117]/95 backdrop-blur-xl px-4 py-3 sm:px-5 sm:py-4 ${c.glow} w-full sm:w-auto sm:min-w-[300px] max-w-md shadow-2xl`}>
      <div className={`mt-0.5 p-1 rounded-lg ${c.bg} shrink-0`}>
        <Icon className={`h-4 w-4 ${c.icon}`} />
      </div>
      <p className="text-xs sm:text-sm text-[#f0f6fc] flex-1 font-medium leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-[#7d8590] hover:text-[#f0f6fc] transition-colors p-1 rounded-lg hover:bg-white/5"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const shouldReduceMotion = useReducedMotion()

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.message) {
        addToast(e.detail.message, e.detail.type || 'info')
      }
    }
    window.addEventListener('app-toast', handler)
    return () => window.removeEventListener('app-toast', handler)
  }, [addToast])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useMemo(() => ({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info')
  }), [addToast])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 start-3 end-3 sm:end-auto sm:start-6 z-[100] flex flex-col gap-2.5 pointer-events-none" aria-live="polite">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout={!shouldReduceMotion}
            >
              <ToastItem toast={t} onDismiss={dismiss} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
