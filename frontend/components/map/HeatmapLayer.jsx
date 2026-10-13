'use client'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

export default function HeatmapLayer({ issues = [] }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const points = issues
      .map(issue => {
        const lat = issue.latitude || issue.location?.coordinates?.[1]
        const lng = issue.longitude || issue.location?.coordinates?.[0]
        if (lat && lng) {
          return [lat, lng, 1] // [lat, lng, intensity]
        }
        return null
      })
      .filter(Boolean)

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.4: '#3b82f6',
        0.6: '#22c55e',
        0.8: '#eab308',
        1.0: '#ef4444'
      }
    }).addTo(map)

    return () => {
      map.removeLayer(heatLayer)
    }
  }, [map, issues])

  return null
}
