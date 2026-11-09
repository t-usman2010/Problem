'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const miniPinIcon = L.divIcon({
  className: 'custom-mini-marker',
  html: `<div style="
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #3b82f6;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  "><div style="
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  "></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
})

export default function MiniMap({ lat, lng }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return

    // Clean up any stale leaflet ID if leftover on this DOM node
    if (container._leaflet_id != null) {
      container._leaflet_id = null
    }

    const position = [Number(lat), Number(lng)]
    const map = L.map(container, {
      center: position,
      zoom: 15,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      zoomControl: false,
      attributionControl: false
    })
    mapRef.current = map

    L.tileLayer(
      process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19 }
    ).addTo(map)

    L.marker(position, { icon: miniPinIcon }).addTo(map)

    // Ensure map tiles properly layout after mounting
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize()
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      if (container) {
        container._leaflet_id = null
      }
    }
  }, [lat, lng])

  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-[#2a2d3e] relative z-0">
      <div ref={containerRef} className="h-full w-full" style={{ background: '#0f1117' }} />
    </div>
  )
}
