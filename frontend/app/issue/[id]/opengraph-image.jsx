import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'Civic Issue Report'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }) {
  const { id } = await params
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  let issue = {
    title: 'Issue not found',
    category: 'other',
    status: 'unknown',
    location: '',
    upvotes: 0,
  }

  try {
    const res = await fetch(`${apiUrl}/issues/${id}`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      issue = data.issue || data
    }
  } catch (error) {
    console.error('Error fetching issue for OG image:', error)
  }

  const displayAddress = issue.address || (typeof issue.location === 'object' ? issue.location?.address : issue.location) || 'Islamabad, PK'
  const displayUpvotes = issue.upvoteCount ?? (Array.isArray(issue.upvotes) ? issue.upvotes.length : (issue.upvotes || 0))
  
  // Category color mapping
  const categoryColors = {
    pothole: '#ef4444',
    streetlight: '#eab308', 
    garbage: '#22c55e',
    water: '#3b82f6',
    other: '#6b7280'
  }
  
  const categoryColor = categoryColors[issue.category?.toLowerCase()] || '#6b7280'
  const titleText = issue.title.length > 80 ? issue.title.substring(0, 80) + '...' : issue.title
  
  // Generate the image using JSX (Satori)
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f1117',
          color: '#f0f0f0',
          flexDirection: 'row',
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            display: 'flex',
            width: '16px',
            height: '100%',
            backgroundColor: categoryColor,
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '80px',
            width: '1184px',
            height: '100%',
          }}
        >
          {/* Top: App name */}
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              color: '#8b8fa8',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 600,
            }}
          >
            Civic Issue Reporter
          </div>
          
          {/* Center: Title and Badges */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '72px',
                fontWeight: 700,
                color: '#f0f0f0',
                lineHeight: 1.2,
              }}
            >
              {titleText}
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              {/* Category Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  backgroundColor: '#1a1d27',
                  border: '2px solid #2a2d3e',
                  borderRadius: '32px',
                  fontSize: '24px',
                  fontWeight: 500,
                  color: '#f0f0f0',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    backgroundColor: categoryColor,
                  }}
                />
                <span style={{ display: 'flex' }}>
                  {issue.category ? issue.category.charAt(0).toUpperCase() + issue.category.slice(1) : 'Unknown'}
                </span>
              </div>
              
              {/* Status Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  backgroundColor: '#1a1d27',
                  border: '2px solid #2a2d3e',
                  borderRadius: '32px',
                  fontSize: '24px',
                  fontWeight: 500,
                  color: '#f0f0f0',
                }}
              >
                {issue.status ? issue.status.charAt(0).toUpperCase() + issue.status.slice(1) : 'Unknown'}
              </div>
            </div>
          </div>
          
          {/* Bottom section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              borderTop: '2px solid #2a2d3e',
              paddingTop: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              {/* Location */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#8b8fa8',
                  fontSize: '28px',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{ display: 'flex' }}>{displayAddress}</span>
              </div>
              
              {/* Upvotes */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#8b8fa8',
                  fontSize: '28px',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                <span style={{ display: 'flex' }}>{displayUpvotes} Upvotes</span>
              </div>
            </div>
            
            {/* CTA */}
            <div
              style={{
                display: 'flex',
                color: '#3b82f6',
                fontSize: '32px',
                fontWeight: 600,
                alignItems: 'center',
              }}
            >
              View & Upvote →
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
