import { ImageResponse } from 'next/og'
import { siteConfig } from '@/content/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const domain = new URL(siteConfig.url).hostname

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          fontFamily: '"IBM Plex Mono", monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #00ff41 0%, #00ff41 60%, transparent 100%)',
            flexShrink: 0,
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px)',
            display: 'flex',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            padding: '60px 80px',
            gap: '0px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
            }}
          >
            <span
              style={{
                fontSize: '56px',
                color: '#00ff41',
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              &gt;
            </span>
            <span
              style={{
                fontSize: '56px',
                color: '#ededed',
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: '-1px',
              }}
            >
              {siteConfig.name}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: '20px',
            }}
          >
            <span
              style={{
                fontSize: '32px',
                color: '#00ff41',
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {siteConfig.tagline}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: '24px',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                color: '#888888',
                fontWeight: 400,
                lineHeight: 1.4,
                letterSpacing: '0.5px',
              }}
            >
              {siteConfig.subtitle}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 80px 40px 80px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '18px',
              color: '#555555',
              fontWeight: 400,
              letterSpacing: '1px',
            }}
          >
            {domain}
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
