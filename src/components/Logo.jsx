import { useId } from 'react'

export function LogoMark({ size = 36 }) {
  const uid = useId()
  const gradId = `lg${uid.replace(/:/g, '')}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradId} x1="1" y1="27" x2="27" y2="1" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>

      {/* Outer rounded rectangle border */}
      <rect x="1.5" y="1.5" width="25" height="25" rx="5"
        fill="none" stroke={`url(#${gradId})`} strokeWidth="1.8" />

      {/* Bar 1 — shortest */}
      <rect x="5" y="20" width="3.5" height="4" rx="0.8"
        fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" />
      {/* Bar 2 — medium */}
      <rect x="12.25" y="14.5" width="3.5" height="9.5" rx="0.8"
        fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" />
      {/* Bar 3 — tallest */}
      <rect x="19.5" y="9" width="3.5" height="15" rx="0.8"
        fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" />

      {/* Trend line through bar top-centres to arrow tip */}
      <path
        d="M6.75 20 L14 14.5 L21.25 9 L24.5 6"
        stroke={`url(#${gradId})`} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Arrowhead barbs */}
      <path
        d="M24.5 6 L21.5 7 M24.5 6 L23.5 9"
        stroke={`url(#${gradId})`} strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}

export default function Logo({ size = 'md', showText = true }) {
  const config = {
    sm: { markSize: 28, textClass: 'text-base', gap: '8px' },
    md: { markSize: 36, textClass: 'text-lg', gap: '10px' },
    lg: { markSize: 44, textClass: 'text-2xl', gap: '12px' },
    xl: { markSize: 56, textClass: 'text-3xl', gap: '14px' },
  }
  const { markSize, textClass, gap } = config[size] || config.md

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <LogoMark size={markSize} />
      {showText && (
        <span
          className={`font-extrabold tracking-tight leading-none ${textClass}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          <span style={{ color: 'white' }}>Strag</span>
          <span
            style={{
              background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            yx
          </span>
        </span>
      )}
    </div>
  )
}
