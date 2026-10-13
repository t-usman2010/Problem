'use client'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
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
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null

  const position = [Number(lat), Number(lng)]

  return (
    <div className="h-48 w-full rounded-lg overflow-hidden border border-[#2a2d3e] relative z-0">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        className="h-full w-full"
        style={{ background: '#0f1117' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
        />
        <Marker position={position} icon={miniPinIcon} />
      </MapContainer>
    </div>
  )
}
