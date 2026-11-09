'use client'
import { useRef, useEffect, useCallback, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerCluster from './MarkerCluster'
import IssueMarker from './IssueMarker'
import HeatmapLayer from './HeatmapLayer'
import { MAP_DEFAULTS } from '@/lib/constants'
import 'leaflet/dist/leaflet.css'

const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_527g_1_43c67470bfbedd5c224408ac'

const TILE_PROVIDERS = {
  voyager: {
    url: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_KEY}`,
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  dark: {
    url: `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_KEY}`,
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
}

export default function MapView({ issues = [], onMapReady, showHeatmap = false, mapStyle = 'voyager' }) {
  const mapRef = useRef(null)
  const prevIssueIdsRef = useRef(new Set())
  const [newIssueIds, setNewIssueIds] = useState(new Set())

  const activeTile = TILE_PROVIDERS[mapStyle] || TILE_PROVIDERS.voyager

  useEffect(() => {
    const currentIds = new Set(issues.map(i => i._id))
    const prevIds = prevIssueIdsRef.current
    const freshIds = new Set()
    currentIds.forEach(id => {
      if (!prevIds.has(id)) freshIds.add(id)
    })
    // Only animate when items arrive via socket (prevIds already populated)
    if (freshIds.size > 0 && prevIds.size > 0) {
      setNewIssueIds(freshIds)
      const timer = setTimeout(() => setNewIssueIds(new Set()), 400)
      prevIssueIdsRef.current = currentIds
      return () => clearTimeout(timer)
    }
    prevIssueIdsRef.current = currentIds
  }, [issues])

  const handleMapReady = useCallback(() => {
    if (onMapReady && mapRef.current) {
      onMapReady(mapRef.current)
    }
  }, [onMapReady])

  return (
    <MapContainer
      center={MAP_DEFAULTS.center}
      zoom={MAP_DEFAULTS.zoom}
      className="h-full w-full"
      ref={mapRef}
      whenReady={handleMapReady}
      zoomControl={true}
      style={{ background: 'var(--color-bg-base, #06080d)' }}
    >
      <TileLayer
        key={mapStyle}
        attribution={activeTile.attribution}
        url={activeTile.url}
      />
      {showHeatmap ? (
        <HeatmapLayer issues={issues} />
      ) : (
        <MarkerCluster>
          {issues.map(issue => (
            <IssueMarker key={issue._id} issue={issue} isNew={newIssueIds.has(issue._id)} />
          ))}
        </MarkerCluster>
      )}
    </MapContainer>
  )
}
