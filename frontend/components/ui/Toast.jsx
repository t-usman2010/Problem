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
  success: 'border-green-500/30',
  error: 'border-red-500/30',
  info: 'border-blue-500/30'
}

const iconColors = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-blue-400'
}

function ToastItem({ toast, onDismiss }) {
  const Icon = icons[toast.type]
  return (
    <div className={`flex items-start gap-3 rounded-lg border ${colors[toast.type]} bg-[#1a1d27] px-4 py-3 shadow-lg min-w-[320px] max-w-[420px]`}>
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
      <p className="text-sm text-[#f0f0f0] flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-[#8b8fa8] hover:text-[#f0f0f0] transition-colors"
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
    }, 3000)
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
      <div className="fixed bottom-4 start-4 z-[100] flex flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, transition: { duration: 0.2, ease: "easeIn" } }}
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
