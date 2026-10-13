'use client'
import { memo } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { getCategoryColor, getStatusOpacity } from '@/lib/constants'
import IssuePopup from './IssuePopup'

function IssueMarker({ issue, isNew = false }) {
  const color = getCategoryColor(issue.category)
  const opacity = getStatusOpacity(issue.status)
  const isDashed = issue.status === 'in-progress'

  const icon = L.divIcon({
    className: `custom-marker${isNew ? ' marker-animate-in' : ''}`,
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${color};
        opacity: ${opacity};
        border: 3px solid ${isDashed ? 'transparent' : color};
        ${isDashed ? `border: 3px dashed ${color};` : ''}
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        cursor: pointer;
      ">
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  })

  return (
    <Marker
      position={[issue.latitude || issue.location?.coordinates?.[1], issue.longitude || issue.location?.coordinates?.[0]]}
      icon={icon}
    >
      <IssuePopup issue={issue} />
    </Marker>
  )
}

export default memo(IssueMarker)
