'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getLeaderboard } from '@/lib/firestore'
import type { AppUser } from '@/lib/types'

export default function LeaderboardPage() {
  const { appUser } = useAuth()
  const [entries, setEntries] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [indexError, setIndexError] = useState(false)

  useEffect(() => {
    getLeaderboard()
      .then(data => {
        setEntries(data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : ''
        if (msg.includes('index') || msg.includes('Index')) {
          setIndexError(true)
        }
        setLoading(false)
      })
  }, [])

  const medals = ['🥇', '🥈', '🥉']
  const podiumColors = [
    { bg: '#fef3c7', border: '#f59e0b', text: '#b45309', avatarBg: 'linear-gradient(135deg, #fbbf24, #d97706)' }, // #1 Gold
    { bg: '#f1f5f9', border: '#94a3b8', text: '#334155', avatarBg: 'linear-gradient(135deg, #cbd5e1, #64748b)' }, // #2 Silver
    { bg: '#ffedd5', border: '#fdba74', text: '#c2410c', avatarBg: 'linear-gradient(135deg, #f97316, #ea580c)' }, // #3 Bronze
  ]

  return (
    <div className="space-y-6 fade-in max-w-4xl">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden hero-navy card-accent-top card-shadow"
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🏆</span>
            <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-sm text-white/80">
            Top students by XP — opt in on your profile to appear here
          </p>
        </div>
      </div>

      {/* ── Index Error State ────────────────────────────────────── */}
      {indexError && (
        <div
          className="rounded-2xl p-6 card-shadow"
          style={{ background: '#fff1f2', border: '1px solid #fda4af' }}
        >
          <p className="text-sm font-bold text-red-950 mb-1">⚠️ Leaderboard is updates-pending</p>
          <p className="text-sm text-red-800">
            The leaderboard database index is currently being created or updated by Firebase. Rankings will display automatically once completed (usually takes 1-2 minutes). Please refresh shortly!
          </p>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl shimmer" />
          ))}
        </div>
      ) : !indexError && entries.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center card-shadow"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-5xl mb-4">🏆</p>
          <p className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>No rankings yet</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Be the first! Enable leaderboard visibility in your Profile settings.
          </p>
        </div>
      ) : !indexError ? (
        <div className="space-y-2">
          {entries.map((user, i) => {
            const isMe = user.id === appUser?.id
            const podium = podiumColors[i] // undefined for rank 4+ (i >= 3)

            return (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-2xl transition card-shadow card-hover"
                style={{
                  background: isMe
                    ? 'rgba(45, 71, 199, 0.06)'
                    : podium
                      ? podium.bg
                      : 'var(--surface)',
                  border: `1px solid ${isMe ? 'var(--accent)' : podium ? podium.border : 'var(--border)'}`,
                  boxShadow: isMe
                    ? '0 0 16px rgba(45, 71, 199, 0.12)'
                    : 'none',
                }}
              >
                {/* Rank Position — Gold for #1, Silver for #2, Bronze for #3, plain #N for #4+ */}
                <div className="w-8 text-center flex-shrink-0">
                  {i < 3 ? (
                    <span className="text-2xl" title={`Rank ${i + 1}`}>{medals[i]}</span>
                  ) : (
                    <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>#{i + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: isMe
                      ? 'linear-gradient(135deg, #1e3a8a, #3b5bdb)'
                      : podium
                        ? podium.avatarBg
                        : 'rgba(45, 71, 199, 0.12)',
                    color: isMe || podium ? '#fff' : 'var(--accent)',
                  }}
                >
                  {user.name.slice(0, 2).toUpperCase()}
                </div>

                {/* Name + streak */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
                    {user.name}{' '}
                    {isMe && <span className="text-xs font-normal" style={{ color: 'var(--accent)' }}>(you)</span>}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    🔥 {user.streak} day streak
                  </p>
                </div>

                {/* XP */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black text-amber-600">{user.xp}</p>
                  <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>XP</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
