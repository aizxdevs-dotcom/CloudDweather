"use client"

import React from 'react'

interface Props {
  name?: string
  className?: string
}

// Small set of inline SVGs for weather icons. Keep them simple and dependency-free.
export default function WeatherIcon({ name = 'unknown', className = 'w-6 h-6' }: Props) {
  const size = 20
  switch (name) {
    case 'clear':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      )
    case 'partly-cloudy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 17.5A4.5 4.5 0 0 0 15.5 13h-1A6 6 0 1 0 6 19h9" fill="currentColor" />
        </svg>
      )
    case 'overcast':
    case 'cloud':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 17.5A4.5 4.5 0 0 0 15.5 13h-7A4.5 4.5 0 0 0 4 17.5 4 4 0 0 0 8 21h9a3 3 0 0 0 3-3.5z" fill="currentColor" />
        </svg>
      )
    case 'rain':
    case 'drizzle':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 17.5A4.5 4.5 0 0 0 15.5 13h-7A4.5 4.5 0 0 0 4 17.5" fill="currentColor" />
          <path d="M8 19v3M12 19v3M16 19v3" stroke="currentColor" />
        </svg>
      )
    case 'snow':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 17.5A4.5 4.5 0 0 0 15.5 13h-7A4.5 4.5 0 0 0 4 17.5" fill="currentColor" />
          <path d="M12 16v6M9 18l6 6M9 24l6-6" stroke="currentColor" />
        </svg>
      )
    case 'thunder':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor" />
        </svg>
      )
    case 'fog':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 10h18M4 14h16M2 18h20" stroke="currentColor" />
        </svg>
      )
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="3" stroke="currentColor" />
        </svg>
      )
  }
}
