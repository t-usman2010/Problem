import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Civic Issue Reporter',
    short_name: 'CivicReport',
    description: 'Report and track civic issues pinned on a real-time interactive map',
    start_url: '/map',
    display: 'standalone',
    background_color: '#0f1117',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    categories: ['government', 'utilities'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
