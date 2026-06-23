'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getStudentBadges, getStudentProgress, updateUser } from '@/lib/firestore'
import { BADGES, LEVELS } from '@/lib/courseData'
import type { StudentBadge, StudentNodeProgress } from '@/lib/types'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { appUser, refreshUser, resetPassword } = useAuth()
  const [studentBadges, setStudentBadges] = useState<StudentBadge[]>([])
  const [progress, setProgress] = useState<StudentNodeProgress[]>([])
  const [optIn, setOptIn] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [resetLink, setResetLink] = useState<string | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)

  useEffect(() => {
    if (!appUser) return
    setOptIn(appUser.optInLeaderboard)
    Promise.all([
      getStudentBadges(appUser.id),
      getStudentProgress(appUser.id),
    ]).then(([b, p]) => {
      setStudentBadges(b)
      setProgress(p)
    })
  }, [appUser])

  async function toggleLeaderboard() {
    if (!appUser) return
    setSaving(true)
    const next = !optIn
    await updateUser(appUser.id, { optInLeaderboard: next })
    setOptIn(next)
    await refreshUser()
    toast.success(next ? "You're on the leaderboard!" : 'Removed from leaderboard')
    setSaving(false)
  }

  async function handleChangePassword() {
    if (!appUser) return
    setChangingPassword(true)
    try {
      const res = await fetch('/api/admin/reset-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '',
        },
        body: JSON.stringify({ studentEmail: appUser.email }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to generate reset link')
      }
      
      const data = await res.json()
      setResetLink(data.resetLink)
      setShowResetModal(true)
      toast.success('Reset link generated!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to generate reset link'
      toast.error(message)
    } finally {
      setChangingPassword(false)
    }
  }

  const earnedBadgeIds = new Set(studentBadges.map(b => b.badgeId))
  const approvedCount = progress.filter(p => p.status === 'approved').length
  const totalNodes = LEVELS.flatMap(l => l.nodes).length
  const progressPct = totalNodes > 0 ? Math.round((approvedCount / totalNodes) * 100) : 0

  const stats = [
    { label: 'XP',         value: appUser?.xp ?? 0,          color: '#fcd34d', grad: '', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.15)' },
    { label: 'Streak',     value: `🔥 ${appUser?.streak ?? 0}`, color: '#ffedd5', grad: '', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.15)' },
    { label: 'Nodes done', value: approvedCount,               color: '#a7f3d0', grad: '', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.15)' },
    { label: 'Badges',     value: earnedBadgeIds.size,         color: '#e0e7ff', grad: '', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.15)' },
  ]

  return (
    <div className="space-y-6 fade-in max-w-4xl">

      {/* ── Profile header ───────────────────────────────────────── */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden hero-navy card-accent-top card-shadow"
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />

        <div className="relative flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              color: '#fff',
            }}
          >
            {appUser?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{appUser?.name}</h1>
            <p className="text-sm mt-0.5 text-white/70">{appUser?.email}</p>
            <p className="text-xs mt-0.5 text-white/60">
              Joined {new Date(appUser?.enrolledAt ?? '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {stats.map(s => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <p className="text-xl font-black text-white">
                {s.value}
              </p>
              <p className="text-xs mt-0.5 font-semibold text-white/70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5 font-semibold">
            <span className="text-white/70">Course progress</span>
            <span className="text-white/95">{approvedCount} / {totalNodes} nodes</span>
          </div>
          <div className="h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                boxShadow: '0 0 8px rgba(96,165,250,0.5)',
              }}
            />
          </div>
        </div>

        {/* ── Change password action ────────────────────────────────── */}
        <div className="mt-6 rounded-2xl p-4 bg-slate-950/90 border border-slate-800 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">Password reset</p>
              <p className="text-xs mt-1 text-slate-300">Send a password reset email to your account.</p>
            </div>
            <button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                color: '#ffffff',
                boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
              }}
            >
              {changingPassword ? 'Sending...' : 'Reset password'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Leaderboard toggle ────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 flex items-center justify-between card-shadow"
        style={{
          background: optIn
            ? 'rgba(45, 71, 199, 0.06)'
            : 'var(--surface)',
          border: `1px solid ${optIn ? 'rgba(45, 71, 199, 0.25)' : 'var(--border)'}`,
          transition: 'all 0.3s',
        }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Show on leaderboard</p>
          <p className="text-xs mt-0.5 font-semibold" style={{ color: 'var(--text-muted)' }}>
            Let others see your rank and XP
          </p>
        </div>
        <button
          onClick={toggleLeaderboard}
          disabled={saving}
          className="relative w-12 h-6 rounded-full transition-all cursor-pointer"
          style={{
            background: optIn
              ? 'linear-gradient(135deg, #1e3a8a, #3b5bdb)'
              : 'var(--border-2)',
            boxShadow: optIn ? '0 0 12px rgba(30,58,138,0.3)' : 'none',
          }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all"
            style={{ left: optIn ? 'calc(100% - 22px)' : '2px' }}
          />
        </button>
      </div>

      {/* ── Badges ────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>
          🏅 &nbsp;BADGES
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {BADGES.map(badge => {
            const earned = earnedBadgeIds.has(badge.id)
            const earnedAt = earned ? studentBadges.find(sb => sb.badgeId === badge.id) : null
            return (
              <div
                key={badge.id}
                className="rounded-2xl p-4 flex items-center gap-3 transition card-shadow"
                style={{
                  background: earned ? 'var(--surface)' : 'var(--surface-2)',
                  border: `1px solid ${earned ? 'rgba(45, 71, 199, 0.2)' : 'var(--border)'}`,
                  opacity: earned ? 1 : 0.5,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: earned
                      ? 'linear-gradient(135deg, rgba(45, 71, 199, 0.12), rgba(124, 58, 237, 0.08))'
                      : 'var(--border)',
                  }}
                >
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: earned ? 'var(--text)' : '#9ca3af' }}>
                    {badge.title}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {badge.description}
                  </p>
                  {earnedAt && (
                    <p className="text-[10px] mt-0.5 font-bold" style={{ color: 'var(--accent)' }}>
                      Earned {new Date(earnedAt.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Reset link modal ────────────────────────────────────────── */}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 max-w-md w-full card-shadow" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Password Reset Link</h2>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-2xl font-bold"
                style={{ color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Share this link with your teacher or admin:</p>
              <p className="text-xs font-mono break-all" style={{ color: 'var(--text)' }}>
                {resetLink}
              </p>
            </div>

            <button
              onClick={() => {
                if (resetLink) {
                  navigator.clipboard.writeText(resetLink)
                  toast.success('Link copied to clipboard!')
                  setShowResetModal(false)
                }
              }}
              className="w-full py-2 rounded-lg text-sm font-semibold transition"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                color: '#ffffff',
                boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
              }}
            >
              Copy link
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
