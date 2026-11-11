import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title =
    searchParams.get('title') ||
    'Roads, Earthworks & Buildings, Built With Our Own Machines'
  const subtitle = searchParams.get('subtitle') || 'Meru & Nairobi, Kenya'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#2e2a25',
          color: '#ffffff',
          padding: '64px 80px',
          borderLeft: '8px solid #c14a12',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ff8f50',
              fontWeight: 700,
            }}
          >
            SHENA WORKS LIMITED
          </span>
          <span style={{ fontSize: '20px', color: '#d7d6d6' }}>{subtitle}</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '960px',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '2px solid #65615d',
            paddingTop: '24px',
            fontSize: '20px',
            color: '#d7d6d6',
          }}
        >
          <span>shenaworksltd.com</span>
          <span>Call / WhatsApp +254 718 971 896</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
