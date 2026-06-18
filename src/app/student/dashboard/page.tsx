'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getStudentProgress, getLiveSessions, getBroadcasts, onLiveSessionChange } from '@/lib/firestore'
import { LEVELS, ALL_NODES } from '@/lib/courseData'
import type { StudentNodeProgress, LiveSession, Broadcast } from '@/lib/types'
import Roadmap from '@/components/student/Roadmap'
import TaskCard from '@/components/student/TaskCard'
import LiveClassCard from '@/components/student/LiveClassCard'

export default function StudentDashboard() {
  const { appUser } = useAuth()
  const [progress, setProgress] = useState<StudentNodeProgress[]>([])
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!appUser) return
    const [p, s, b] = await Promise.all([
      getStudentProgress(appUser.id),
      getLiveSessions(),
      getBroadcasts(),
    ])
    setProgress(p)
    setSessions(s)
    setBroadcasts(b)
    setLoading(false)
  }, [appUser])

  useEffect(() => {
    load()
    const unsub = onLiveSessionChange(setSessions)
    return unsub
  }, [load])

  const progressMap: Record<string, StudentNodeProgress> = {}
  for (const p of progress) progressMap[p.nodeId] = p

  const activeProgress = progress.find(p => p.status === 'active' || p.status === 'submitted' || p.status === 'needs_revision')
  const activeNode = activeProgress ? ALL_NODES.find(n => n.id === activeProgress.nodeId) : null

  const liveSession = sessions.find(s => s.isLive)
  const nextSession = sessions.find(s => !s.isLive && new Date(s.scheduledAt) > new Date())
  const latestBroadcast = broadcasts[0]

  const approvedCount = progress.filter(p => p.status === 'approved').length
  const totalNodes = ALL_NODES.length
  const progressPct = totalNodes > 0 ? Math.round((approvedCount / totalNodes) * 100) : 0

  if (loading) {
    return (
      <div className="space-y-5 p-2">
        <div className="h-36 rounded-2xl shimmer" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl shimmer" />)}
        </div>
        <div className="h-64 rounded-2xl shimmer" />
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in max-w-7xl">

      {/* ── Hero Header ──────────────────────────────────────── */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2d47c7 55%, #3b5bdb 100%)',
          boxShadow: '0 8px 32px rgba(30,58,138,0.3)',
        }}
      >
        {/* Background orb */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest font-semibold mb-1 opacity-70 text-white">
              BUILDAI ACADEMY
            </p>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {appUser?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm opacity-70 text-white">
              Keep your streak alive and keep building!
            </p>
          </div>

          {/* Stats cluster */}
          <div className="flex items-center gap-3">
            <div className="text-center px-5 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
              <p className="text-2xl font-bold text-white">{appUser?.xp ?? 0}</p>
              <p className="text-xs font-medium opacity-70 text-white">XP</p>
            </div>
            <div className="text-center px-5 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
              <p className="text-2xl font-bold text-white">🔥 {appUser?.streak ?? 0}</p>
              <p className="text-xs font-medium opacity-70 text-white">Streak</p>
            </div>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold text-white"
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
            >
              {appUser?.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mt-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white opacity-60">Course progress</span>
            <span className="text-white opacity-80">{approvedCount} / {totalNodes} nodes complete</span>
          </div>
          <div className="h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                boxShadow: '0 0 10px rgba(96,165,250,0.6)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Live banner ───────────────────────────────────────── */}
      {liveSession && (
        <a
          href={liveSession.joinLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 rounded-2xl text-white transition hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
          }}
        >
          <span className="text-2xl animate-pulse">🔴</span>
          <div className="flex-1">
            <p className="font-semibold">{liveSession.title} is LIVE now!</p>
            <p className="text-sm opacity-70">Click to join the class →</p>
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-red-600">JOIN NOW</span>
        </a>
      )}

      {/* ── Broadcast ─────────────────────────────────────────── */}
      {latestBroadcast && (
        <div
          className="p-4 rounded-xl text-sm flex items-start gap-3 card-shadow"
          style={{
            background: '#eff2ff',
            border: '1px solid #c5d0ff',
          }}
        >
          <span className="text-lg flex-shrink-0">📢</span>
          <div>
            <span className="font-semibold" style={{ color: '#1e3a8a' }}>{latestBroadcast.sentByName}: </span>
            <span style={{ color: 'var(--text-muted)' }}>{latestBroadcast.message}</span>
          </div>
        </div>
      )}

      {/* ── Roadmap ───────────────────────────────────────────── */}
      <div>
        <p className="text-xs tracking-widest font-bold mb-3" style={{ color: 'var(--navy)' }}>
          🗺️ &nbsp;AI LEARNING ROADMAP
        </p>
        <Roadmap levels={LEVELS} progressMap={progressMap} />
      </div>

      {/* ── Task + Live class cards ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TaskCard node={activeNode ?? null} progress={activeProgress ?? null} />
        <LiveClassCard session={nextSession ?? liveSession ?? null} />
      </div>
    </div>
  )
}
