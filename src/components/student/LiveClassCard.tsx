'use client'

import { useEffect, useState } from 'react'
import type { LiveSession } from '@/lib/types'

interface Props { session: LiveSession | null }

function formatCountdown(targetDate: string): string {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return 'Starting soon'
  const days = Math.floor(diff / 86400000)
  const hrs  = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  if (days > 0) return `${days}d ${hrs}h away`
  if (hrs > 0)  return `${hrs}h ${mins}m away`
  return `${mins}m away`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export default function LiveClassCard({ session }: Props) {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!session || session.isLive) return
    setCountdown(formatCountdown(session.scheduledAt))
    const id = setInterval(() => setCountdown(formatCountdown(session.scheduledAt)), 60000)
    return () => clearInterval(id)
  }, [session])

  if (!session) {
    return (
      <div
        className="rounded-2xl p-5 card-shadow"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>
          NEXT LIVE CLASS
        </p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No upcoming sessions scheduled yet.</p>
      </div>
    )
  }

  if (session.isLive) {
    return (
      <a
        href={session.joinLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl p-5 transition card-shadow card-hover"
        style={{ background: '#fff1f2', border: '1px solid #fda4af' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <p className="text-xs tracking-widest font-bold text-red-700">LIVE NOW</p>
        </div>
        <p className="text-base font-bold text-red-950 mb-1">{session.title}</p>
        <p className="text-xs font-semibold text-red-600">Click to join the class now →</p>
      </a>
    )
  }

  return (
    <div
      className="rounded-2xl p-5 card-shadow"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-500">🎥</span>
        <p className="text-xs tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>NEXT LIVE CLASS</p>
      </div>
      <p className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>{session.title}</p>
      <p className="text-xs font-semibold mb-3.5" style={{ color: 'var(--text-muted)' }}>{formatDate(session.scheduledAt)}</p>
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border"
        style={{ background: 'rgba(217,119,6,0.06)', borderColor: 'rgba(217,119,6,0.15)' }}
      >
        <span className="text-amber-600 text-xs">⏱</span>
        <span className="text-xs font-bold text-amber-700">{countdown}</span>
      </div>
    </div>
  )
}
