'use client'
import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'motion/react'
import { useAuth } from '@/context/AuthContext'
import { useIssues } from '@/hooks/useIssues'
import { useDebounce } from '@/hooks/useDebounce'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useToast } from '@/components/ui/Toast'
import { useTranslations } from '@/context/LocaleContext'
import FilterBar from '@/components/map/FilterBar'
import IssueCard from '@/components/issue/IssueCard'
import EmptyState from '@/components/ui/EmptyState'
import { MapSkeleton } from '@/components/ui/SkeletonLoader'
import { Plus, List, Map as MapIcon, Flame, Layers } from 'lucide-react'
import { useRouter } from 'next/navigation'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <MapSkeleton />
})

export default function MapPage() {
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [showListView, setShowListView] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [mapStyle, setMapStyle] = useState('voyager')
  const { user } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const t = useTranslations('map')
  const { position, loading: geoLoading, error: geoError, getPosition } = useGeolocation()

  useEffect(() => {
    if (geoError) {
      toast.error(geoError)
    }
  }, [geoError, toast])

  const debouncedCategory = useDebounce(category)
  const debouncedStatus = useDebounce(status)

  const filters = {
    category: debouncedCategory,
    status: debouncedStatus,
    ...(position ? { lat: position.lat, lng: position.lng, radius: 2000 } : {})
  }

  const { issues, loading } = useIssues(filters)

  const handleNearMe = useCallback(() => {
    getPosition()
  }, [getPosition])

  const handleFABClick = () => {
    if (user) {
      router.push('/report')
    } else {
      toast.info(t('loginToReport', { defaultValue: 'Please login to report an issue' }))
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-128px)] md:h-[calc(100dvh-64px)] mt-16">
      <FilterBar
        activeCategory={category}
        activeStatus={status}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onNearMe={handleNearMe}
        nearMeLoading={geoLoading}
      />

      {/* Sub-Header: Layer Switcher & View Toggles */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#06080d]/90 backdrop-blur-sm border-b border-[#21262d]/60 gap-3">
        {/* Map GIS Layer Picker */}
        {!showListView ? (
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#7d8590]">
              <Layers className="h-3.5 w-3.5 text-[#58a6ff]" /> GIS:
            </span>
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#161b22] border border-[#21262d]">
              <button
                type="button"
                onClick={() => setMapStyle('voyager')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  mapStyle === 'voyager' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 shadow-sm' : 'text-[#7d8590] hover:text-[#f0f6fc]'
                }`}
              >
                Voyager
              </button>
              <button
                type="button"
                onClick={() => setMapStyle('dark')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  mapStyle === 'dark' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 shadow-sm' : 'text-[#7d8590] hover:text-[#f0f6fc]'
                }`}
              >
                Dark GIS
              </button>
              <button
                type="button"
                onClick={() => setMapStyle('satellite')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  mapStyle === 'satellite' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 shadow-sm' : 'text-[#7d8590] hover:text-[#f0f6fc]'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>
        ) : <div />}

        <div className="flex items-center gap-3">
          {!showListView && (
            <button
              type="button"
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                showHeatmap
                  ? 'text-[#d29922] bg-[#d29922]/10 border border-[#d29922]/20'
                  : 'text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22]'
              }`}
              aria-label={showHeatmap ? 'Hide heatmap' : 'Show heatmap'}
            >
              <Flame className="h-3.5 w-3.5" /> {t('heatmapView', { defaultValue: 'Heatmap' })}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowListView(!showListView)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#161b22] transition-all duration-200"
            aria-label={showListView ? t('switchToMap', { defaultValue: 'Switch to map view' }) : t('switchToList', { defaultValue: 'Switch to list view' })}
          >
            {showListView ? (
              <><MapIcon className="h-3.5 w-3.5" /> {t('mapView', { defaultValue: 'Map View' })}</>
            ) : (
              <><List className="h-3.5 w-3.5" /> {t('listView', { defaultValue: 'List View' })}</>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative min-h-0">
        {showListView ? (
          <div className="h-full overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#58a6ff]/20 blur-xl animate-pulse" />
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#21262d] border-t-[#58a6ff] border-r-[#bc8cff]" />
                </div>
              </div>
            ) : issues.length === 0 ? (
              <EmptyState message={t('noIssuesFilter', { defaultValue: 'No issues match these filters' })} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 max-w-2xl mx-auto"
              >
                {issues.map((issue, i) => (
                  <motion.div
                    key={issue._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <IssueCard issue={issue} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0">
            {loading && issues.length === 0 ? (
              <MapSkeleton />
            ) : (
              <MapView issues={issues} showHeatmap={showHeatmap} mapStyle={mapStyle} />
            )}
            {!loading && issues.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
                <div className="pointer-events-auto">
                  <EmptyState message={t('noIssuesYet', { defaultValue: 'No issues reported here yet — be the first!' })} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB - Floating Action Button with glow */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleFABClick}
        className="fixed bottom-20 md:bottom-6 end-6 z-[400] flex h-14 w-14 items-center justify-center rounded-2xl btn-gradient text-white shadow-[0_0_30px_rgba(88,166,255,0.4)]"
        aria-label={t('reportIssue', { defaultValue: 'Report an issue' })}
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  )
}
