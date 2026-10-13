'use client'
import { useState, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Navigation, Loader2 } from 'lucide-react'
import { MAP_DEFAULTS } from '@/lib/constants'
import 'leaflet/dist/leaflet.css'

const pinIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #3b82f6;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  "><div style="
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  "></div></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
})

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

function MapRecenter({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] != null && center[1] != null) {
      map.setView(center, Math.max(map.getZoom(), 15))
    }
  }, [center, map])
  return null
}

export default function LocationPicker({ onLocationSelect, initialLat, initialLng }) {
  const [position, setPosition] = useState(() => (
    initialLat != null && initialLng != null ? [Number(initialLat), Number(initialLng)] : null
  ))
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (initialLat != null && initialLng != null) {
      setPosition([Number(initialLat), Number(initialLng)])
    }
  }, [initialLat, initialLng])

  const handleSelect = useCallback((lat, lng) => {
    setPosition([lat, lng])
    onLocationSelect(lat, lng)
  }, [onLocationSelect])

  const handleUseGPS = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        handleSelect(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => {
        setLocating(false)
        alert(err.code === 1 ? 'Location access denied. Please allow location permissions.' : 'Unable to determine your location')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const initialCenter = position || MAP_DEFAULTS.center

  return (
    <div className="relative h-full w-full">
      <button
        type="button"
        onClick={handleUseGPS}
        disabled={locating}
        className="absolute top-3 end-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-[#1a1d27]/90 hover:bg-[#1a1d27] border border-[#2a2d3e] text-xs font-medium text-[#f0f0f0] px-2.5 py-1.5 shadow-md backdrop-blur transition-colors disabled:opacity-50"
      >
        {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3b82f6]" /> : <Navigation className="h-3.5 w-3.5 text-[#3b82f6]" />}
        <span>{locating ? 'Locating...' : 'Use GPS'}</span>
      </button>

      <MapContainer
        center={initialCenter}
        zoom={position ? 15 : MAP_DEFAULTS.zoom}
        className="h-full w-full"
        style={{ background: '#0f1117' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
        />
        <LocationSelector onSelect={handleSelect} />
        {position && <MapRecenter center={position} />}
        {position && <Marker position={position} icon={pinIcon} />}
      </MapContainer>
    </div>
  )
}
