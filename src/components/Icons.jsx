const base = 'shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] stroke-2'

export function DesktopIcon({ className = 'size-[18px]' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`${base} ${className}`}>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

export function MobileIcon({ className = 'size-[18px]' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`${base} ${className}`}>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  )
}

export function CheckIcon({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function DeviceIcon({ dev, className }) {
  if (dev === 'desktop') return <DesktopIcon className={className} />
  if (dev === 'mobile') return <MobileIcon className={className} />
  return (
    <>
      <DesktopIcon className={className} />
      <MobileIcon className={className} />
    </>
  )
}
