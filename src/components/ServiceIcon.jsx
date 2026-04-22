export default function ServiceIcon({ type, className = 'w-10 h-10' }) {
  if (type === 'detailing') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.25 8.25l.45 1.575a2.5 2.5 0 001.724 1.724L22 12l-1.576.45a2.5 2.5 0 00-1.724 1.724l-.45 1.576-.45-1.576a2.5 2.5 0 00-1.724-1.724L14.5 12l1.576-.451A2.5 2.5 0 0017.8 9.825l.45-1.575z" />
      </svg>
    )
  }

  if (type === 'tinting') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l1.875-5.625A3 3 0 018.471 5.75h7.058a3 3 0 012.846 2.125L20.25 13.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 13.5h13.5a1.5 1.5 0 011.5 1.5v2.25a1 1 0 01-1 1h-1.5a1.75 1.75 0 01-3.5 0h-4.5a1.75 1.75 0 01-3.5 0h-1.5a1 1 0 01-1-1V15a1.5 1.5 0 011.5-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8l1.25 4H6.75L8 8z" />
      </svg>
    )
  }

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m6.364-15.364l-2.121 2.121M7.757 16.243l-2.121 2.121M21 12h-3M6 12H3m15.364 6.364l-2.121-2.121M7.757 7.757L5.636 5.636" />
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 17.25h15M5.25 17.25l1.2-4.5A3 3 0 019.35 10.5h5.3a3 3 0 012.9 2.25l1.2 4.5" />
    </svg>
  )
}
