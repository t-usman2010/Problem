'use client'
import { useRef, useEffect, useCallback, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerCluster from './MarkerCluster'
import IssueMarker from './IssueMarker'
import HeatmapLayer from './HeatmapLayer'
import { MAP_DEFAULTS } from '@/lib/constants'
import 'leaflet/dist/leaflet.css'

export default function MapView({ issues = [], onMapReady, showHeatmap = false }) {
  const mapRef = useRef(null)
  const prevIssueIdsRef = useRef(new Set())
  const [newIssueIds, setNewIssueIds] = useState(new Set())

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
      style={{ background: '#0f1117' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
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
