'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import {
  getAllStudents, getAllSubmissions, releaseTask,
  endLiveSession, getLiveSessions, onLiveSessionChange,
} from '@/lib/firestore'
import { ALL_NODES, getNode } from '@/lib/courseData'
import type { AppUser, StudentNodeProgress, LiveSession } from '@/lib/types'

export default function TeacherDashboard() {
  const { appUser } = useAuth()
  const [students, setStudents]     = useState<AppUser[]>([])
  const [submissions, setSubmissions] = useState<StudentNodeProgress[]>([])
  const [sessions, setSessions]     = useState<LiveSession[]>([])
  const [loading, setLoading]       = useState(true)
  const [releasing, setReleasing]   = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [s, sub, sess] = await Promise.all([
        getAllStudents(), getAllSubmissions(), getLiveSessions(),
      ])
      setStudents(s); setSubmissions(sub); setSessions(sess)
      setLoading(false)
    }
    load()
    const unsub = onLiveSessionChange(setSessions)
    return unsub
  }, [])

  const pendingSubmissions = submissions.filter(
    s => s.status === 'submitted' || s.status === 'needs_revision'
  )
  const liveSession = sessions.find(s => s.isLive)

  async function handleRelease(nodeId: string) {
    if (!appUser) return
    setReleasing(nodeId)
    try {
      await releaseTask(nodeId, appUser.id)
      toast.success(`Task released for ${getNode(nodeId)?.title}`)
    } catch { toast.error('Failed to release task') }
    finally { setReleasing(null) }
  }

  async function handleEndLive() {
    if (!liveSession) return
    await endLiveSession(liveSession.id)
    toast.success('Class ended')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-36 rounded-2xl shimmer" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 rounded-2xl shimmer" />)}
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Students',   value: students.length,                                                   icon: '👥', cardClass: 'stat-indigo', textColor: '#0B1739' },
    { label: 'Pending Review',   value: pendingSubmissions.length,                                         icon: '📬', cardClass: 'stat-amber',  textColor: '#92400e' },
    { label: 'Live Now',         value: sessions.filter(s => s.isLive).length,                             icon: '🔴', cardClass: 'stat-amber',  textColor: '#92400e' },
    { label: 'Upcoming Classes', value: sessions.filter(s => !s.isLive && new Date(s.scheduledAt) > new Date()).length, icon: '📅', cardClass: 'stat-indigo', textColor: '#0B1739' },
  ]

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
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest font-semibold mb-1 text-white opacity-70">TEACHER DASHBOARD</p>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {appUser?.name?.split(' ')[0]} 👨‍🏫
            </h1>
            <p className="text-sm text-white opacity-70">
              {students.length} students enrolled · {pendingSubmissions.length} awaiting review
            </p>
          </div>
          <div className="flex gap-3">
            {liveSession ? (
              <button
                onClick={handleEndLive}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ background: 'rgba(239,68,68,0.9)', color: '#fff', boxShadow: '0 4px 14px rgba(239,68,68,0.4)' }}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> End class
              </button>
            ) : (
              <Link
                href="/teacher/schedule"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
              >
                📅 Schedule class
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Live banner ───────────────────────────────────────── */}
      {liveSession && (
        <div
          className="flex items-center justify-between p-4 rounded-2xl"
          style={{ background: '#fff1f2', border: '1px solid #fda4af', boxShadow: '0 4px 16px rgba(220,38,38,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🔴</span>
            <div>
              <p className="font-semibold" style={{ color: '#9f1239' }}>{liveSession.title} — Class is LIVE</p>
              <p className="text-sm" style={{ color: '#e11d48' }}>{liveSession.joinLink}</p>
            </div>
          </div>
          <button
            onClick={handleEndLive}
            className="text-xs px-4 py-1.5 rounded-full font-semibold"
            style={{ background: '#fee2e2', color: '#9f1239', border: '1px solid #fca5a5' }}
          >
            End + release task
          </button>
        </div>
      )}

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`rounded-2xl p-5 card-shadow ${s.cardClass}`} style={{ border: '1px solid transparent' }}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-3xl font-bold mt-3" style={{ color: s.textColor }}>{s.value}</p>
            <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Pending submissions ───────────────────────────────── */}
      {pendingSubmissions.length > 0 && (
        <div>
          <p className="text-xs tracking-widest font-bold mb-3" style={{ color: '#92400e' }}>
            📬 &nbsp;PENDING REVIEW ({pendingSubmissions.length})
          </p>
          <div className="space-y-2">
            {pendingSubmissions.map(sub => {
              const student = students.find(s => s.id === sub.studentId)
              const node    = getNode(sub.nodeId)
              const isRev   = sub.status === 'needs_revision'
              return (
                <Link
                  key={`${sub.studentId}_${sub.nodeId}`}
                  href={`/teacher/student/${sub.studentId}?nodeId=${sub.nodeId}`}
                  className="flex items-center justify-between p-4 rounded-2xl card-shadow card-hover"
                  style={{ background: '#fff', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b5bdb)', color: '#fff' }}>
                      {student?.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{student?.name ?? 'Unknown'}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{node?.taskTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1 rounded-full font-semibold"
                      style={{
                        background: isRev ? '#fff7ed' : '#eff6ff',
                        color: isRev ? '#c2410c' : '#1d4ed8',
                        border: `1px solid ${isRev ? '#fed7aa' : '#bfdbfe'}`,
                      }}>
                      {isRev ? 'Needs revision' : 'Submitted'}
                    </span>
                    <span style={{ color: 'var(--accent)', fontSize: 14 }}>→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Student grid ──────────────────────────────────────── */}
      <div>
        <p className="text-xs tracking-widest font-bold mb-3" style={{ color: 'var(--navy)' }}>
          👥 &nbsp;ALL STUDENTS ({students.length})
        </p>
        {students.length === 0 ? (
          <div className="rounded-2xl p-10 text-center card-shadow" style={{ background: '#fff', border: '1px solid var(--border)' }}>
            <p className="text-4xl mb-3">👥</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No students enrolled yet. Create accounts from the admin console and share access credentials securely.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {students.map(student => {
              const sub = submissions.find(s => s.studentId === student.id && (s.status === 'submitted' || s.status === 'needs_revision'))
              return (
                <Link
                  key={student.id}
                  href={`/teacher/student/${student.id}`}
                  className="block rounded-2xl p-4 card-shadow card-hover"
                  style={{ background: '#fff', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b5bdb)', color: '#fff' }}>
                        {student.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{student.name}</p>
                        <p className="text-xs font-medium" style={{ color: '#d97706' }}>{student.xp} XP · 🔥 {student.streak}</p>
                      </div>
                    </div>
                    {sub && (
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                        style={{ background: '#f59e0b', boxShadow: '0 0 6px rgba(245,158,11,0.5)' }} />
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Last active: {new Date(student.lastActive).toLocaleDateString()}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Quick release tasks ───────────────────────────────── */}
      <div>
        <p className="text-xs tracking-widest font-bold mb-3" style={{ color: '#065f46' }}>
          ▶ &nbsp;RELEASE TASKS
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {ALL_NODES.slice(0, 8).map(node => (
            <button
              key={node.id}
              onClick={() => handleRelease(node.id)}
              disabled={releasing === node.id}
              className="text-left p-3.5 rounded-xl card-shadow card-hover disabled:opacity-50"
              style={{ background: '#fff', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-semibold mb-1 truncate" style={{ color: 'var(--text)' }}>{node.title}</p>
              <p className="text-xs font-semibold" style={{ color: releasing === node.id ? '#d97706' : '#059669' }}>
                {releasing === node.id ? '⏳ Releasing…' : '▶ Release'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
