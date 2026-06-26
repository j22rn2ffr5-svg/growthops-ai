export function LogoMark({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect width="48" height="48" rx="24" fill="#0c1530" />
      <circle cx="16" cy="32" r="3" fill="#3b82f6" />
      <circle cx="24" cy="16" r="3" fill="#60a5fa" />
      <circle cx="34" cy="26" r="3" fill="#2dd4bf" />
      <path d="M16 32 L24 16 L34 26" stroke="#4d7fd4" strokeWidth="1.5" fill="none" />
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
          <span style={{ color: 'white' }}>strag</span>
          <span style={{ color: '#2dd4bf' }}>yx</span>
        </span>
      )}
    </div>
  )
}
