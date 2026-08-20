'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getLiveSessions, createLiveSession, goLive, endLiveSession,
  onLiveSessionChange,
} from '@/lib/firestore'
import { ALL_NODES } from '@/lib/courseData'
import type { LiveSession } from '@/lib/types'

export default function SchedulePage() {
  const { appUser } = useAuth()
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState('')
  const [nodeId, setNodeId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [joinLink, setJoinLink] = useState('')
  const [working, setWorking] = useState(false)

  useEffect(() => {
    getLiveSessions().then(s => { setSessions(s); setLoading(false) })
    const unsub = onLiveSessionChange(setSessions)
    return unsub
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!appUser) return
    setWorking(true)
    try {
      await createLiveSession({
        nodeId,
        title,
        scheduledAt: new Date(scheduledAt).toISOString(),
        joinLink,
        isLive: false,
        endedAt: null,
      })
      setShowForm(false)
      setTitle(''); setNodeId(''); setScheduledAt(''); setJoinLink('')
      toast.success('Session scheduled!')
    } catch {
      toast.error('Failed to create session')
    } finally {
      setWorking(false)
    }
  }

  async function handleGoLive(session: LiveSession) {
    setWorking(true)
    try {
      await goLive(session.id, session.joinLink || joinLink)
      toast.success('Class is now LIVE! Students can see the banner.')
    } catch {
      toast.error('Failed to go live')
    } finally {
      setWorking(false)
    }
  }

  async function handleEndSession(session: LiveSession) {
    setWorking(true)
    try {
      await endLiveSession(session.id)
      toast.success('Class ended')
    } catch {
      toast.error('Failed to end session')
    } finally {
      setWorking(false)
    }
  }

  const upcoming = sessions.filter(s => !s.isLive && !s.endedAt && new Date(s.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
  const live = sessions.filter(s => s.isLive)
  const past = sessions.filter(s => s.endedAt || new Date(s.scheduledAt) < new Date())
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Class Schedule</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage live sessions and class timing</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
        >
          {showForm ? '✕ Cancel' : '+ Schedule class'}
        </button>
      </div>

      {/* Create session form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl p-5 space-y-4 card-shadow"
          style={{ background: 'var(--surface)', border: '1px solid var(--accent)' }}
        >
          <p className="text-xs tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>NEW SESSION</p>
          <input
            value={title} onChange={e => setTitle(e.target.value)} required
            placeholder="Session title e.g. Node 1.4 — If/else logic"
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', color: 'var(--text)' }}
          />
          <select
            value={nodeId} onChange={e => setNodeId(e.target.value)} required
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', color: 'var(--text)' }}
          >
            <option value="" style={{ color: 'var(--text-muted)' }}>Select node being taught…</option>
            {ALL_NODES.map(n => (
              <option key={n.id} value={n.id} style={{ color: 'var(--text)' }}>{n.id.replace('node-', 'Node ').replace('-', '.')} — {n.title}</option>
            ))}
          </select>
          <input
            type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} required
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', color: 'var(--text)' }}
          />
          <input
            value={joinLink} onChange={e => setJoinLink(e.target.value)}
            placeholder="Zoom / Google Meet link (optional now, add before going live)"
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', color: 'var(--text)' }}
          />
          <button
            type="submit" disabled={working}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 cursor-pointer"
          >
            {working ? 'Scheduling…' : 'Schedule session'}
          </button>
        </form>
      )}

      {/* Live now */}
      {live.length > 0 && (
        <div>
          <p className="text-xs tracking-widest font-bold mb-3 text-red-600">LIVE NOW</p>
          {live.map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl card-shadow" style={{ background: '#fff1f2', border: '1px solid #fda4af' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl animate-pulse">🔴</span>
                <div>
                  <p className="font-bold text-red-950">{s.title}</p>
                  {s.joinLink && <p className="text-xs font-semibold text-red-700">{s.joinLink}</p>}
                </div>
              </div>
              <button onClick={() => handleEndSession(s)} disabled={working} className="text-xs px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white transition disabled:opacity-50 cursor-pointer font-semibold">
                End class
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming */}
      <div>
        <p className="text-xs tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>
          UPCOMING ({upcoming.length})
        </p>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl p-6 text-center card-shadow flex items-center justify-center gap-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Calendar size={16} className="shrink-0" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No upcoming sessions. Schedule one above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map(s => (
              <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl card-shadow" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{s.title}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {new Date(s.scheduledAt).toLocaleString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric',
                      hour: 'numeric', minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleGoLive(s)}
                  disabled={working}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition disabled:opacity-50 cursor-pointer"
                >
                  🔴 Go Live
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past sessions */}
      {past.length > 0 && (
        <div>
          <p className="text-xs tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>RECENT SESSIONS</p>
          <div className="space-y-2">
            {past.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3.5 rounded-xl opacity-60 card-shadow" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{s.title}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {new Date(s.scheduledAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
