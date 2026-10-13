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
import { Plus, List, Map as MapIcon, Flame } from 'lucide-react'
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
    <div className="flex flex-col h-[calc(100vh-56px)] mt-14">
      <FilterBar
        activeCategory={category}
        activeStatus={status}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onNearMe={handleNearMe}
        nearMeLoading={geoLoading}
      />

      {/* List/Map toggle */}
      <div className="flex items-center justify-end px-4 py-1.5 bg-[#0f1117] border-b border-[#2a2d3e] gap-4">
        {!showListView && (
           <button
             onClick={() => setShowHeatmap(!showHeatmap)}
             className={`flex items-center gap-1 text-xs transition-colors ${showHeatmap ? 'text-[#3b82f6]' : 'text-[#8b8fa8] hover:text-[#f0f0f0]'}`}
             aria-label={showHeatmap ? 'Hide heatmap' : 'Show heatmap'}
           >
             <Flame className="h-3.5 w-3.5" /> {t('heatmapView', { defaultValue: 'Heatmap' })}
           </button>
         )}
         <button
           onClick={() => setShowListView(!showListView)}
           className="flex items-center gap-1 text-xs text-[#8b8fa8] hover:text-[#f0f0f0] transition-colors"
           aria-label={showListView ? t('switchToMap', { defaultValue: 'Switch to map view' }) : t('switchToList', { defaultValue: 'Switch to list view' })}
         >
           {showListView ? (
             <><MapIcon className="h-3.5 w-3.5" /> {t('mapView', { defaultValue: 'Map View' })}</>
           ) : (
             <><List className="h-3.5 w-3.5" /> {t('listView', { defaultValue: 'List View' })}</>
           )}
         </button>
       </div>

       {/* Content */}
       <div className="flex-1 relative">
         {showListView ? (
           <div className="h-full overflow-y-auto p-4 space-y-3">
             {loading ? (
               <div className="flex items-center justify-center h-full">
                 <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2a2d3e] border-t-[#3b82f6]" />
               </div>
             ) : issues.length === 0 ? (
               <EmptyState message={t('noIssuesFilter', { defaultValue: 'No issues match these filters' })} />
             ) : (
               issues.map(issue => <IssueCard key={issue._id} issue={issue} />)
             )}
           </div>
         ) : (
           <div className="h-full">
             {loading && issues.length === 0 ? (
               <MapSkeleton />
             ) : (
               <MapView issues={issues} showHeatmap={showHeatmap} />
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

       {/* FAB */}
       <motion.button
         whileTap={{ scale: 0.97 }}
         transition={{ duration: 0.15 }}
         onClick={handleFABClick}
         className="fixed bottom-6 end-6 z-[500] h-14 w-14 rounded-full bg-[#3b82f6] text-white shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
         aria-label={t('reportNew', { defaultValue: 'Report new issue' })}
       >
         <Plus className="h-6 w-6" />
       </motion.button>
    </div>
  )
}
