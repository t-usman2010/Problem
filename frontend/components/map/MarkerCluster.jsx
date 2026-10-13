'use client'
import React from 'react'
import BaseMarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'

export const defaultClusterIcon = (cluster) => {
  const count = cluster.getChildCount()
  let size = 36
  let borderColor = '#3b82f6'

  if (count > 50) {
    size = 48
    borderColor = '#ef4444'
  } else if (count > 15) {
    size = 42
    borderColor = '#eab308'
  }

  return L.divIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: #1a1d27;
      border: 2px solid ${borderColor};
      color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${size > 40 ? '13px' : '12px'};
      font-weight: 600;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    ">${count}</div>`,
    className: 'custom-cluster',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  })
}

export default function MarkerCluster({
  children,
  chunkedLoading = true,
  maxClusterRadius = 60,
  iconCreateFunction = defaultClusterIcon,
  ...props
}) {
  return (
    <BaseMarkerClusterGroup
      chunkedLoading={chunkedLoading}
      maxClusterRadius={maxClusterRadius}
      iconCreateFunction={iconCreateFunction}
      {...props}
    >
      {children}
    </BaseMarkerClusterGroup>
  )
}
