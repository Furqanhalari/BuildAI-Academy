'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { sendBroadcast, onBroadcastsChange } from '@/lib/firestore'
import type { Broadcast } from '@/lib/types'

export default function BroadcastPage() {
  const { appUser } = useAuth()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])

  useEffect(() => {
    const unsub = onBroadcastsChange(setBroadcasts)
    return unsub
  }, [])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!appUser || !message.trim()) return
    setSending(true)
    try {
      await sendBroadcast(message.trim(), appUser.id, appUser.name)
      setMessage('')
      toast.success('Message sent to all students 📢')
    } catch {
      toast.error('Failed to send broadcast')
    } finally {
      setSending(false)
    }
  }

  const quickMessages = [
    'Class is in 30 minutes! Get ready 🎯',
    'Don\'t forget to submit your task before our next session!',
    'Great work this week everyone! Keep the streak going 🔥',
    'New resource shared in WhatsApp group — check it out!',
    'Reminder: Submit before Sunday to earn the speed-run bonus ⚡',
  ]

  return (
    <div className="space-y-6 fade-in max-w-4xl">
      <div
        className="relative rounded-2xl p-6 overflow-hidden hero-navy card-accent-top"
      >
        <h1 className="text-2xl font-bold text-white mb-1">📢 Broadcast</h1>
        <p className="text-sm text-white/80">
          Send a message that all students will see on their dashboard
        </p>
      </div>

      {/* Compose */}
      <div className="rounded-2xl p-5 card-shadow" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-xs tracking-widest font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
          COMPOSE MESSAGE
        </p>
        <form onSubmit={handleSend} className="space-y-4">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write your message to all students…"
            rows={4}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', color: 'var(--text)' }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{message.length} chars</span>
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 cursor-pointer"
            >
              {sending ? 'Sending…' : '📢 Send to all students'}
            </button>
          </div>
        </form>

        {/* Quick messages */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs mb-2 font-bold" style={{ color: 'var(--text-muted)' }}>Quick messages</p>
          <div className="flex flex-wrap gap-2">
            {quickMessages.map((msg, i) => (
              <button
                key={i}
                onClick={() => setMessage(msg)}
                className="text-xs px-2.5 py-1 rounded-lg transition hover:border-indigo-500/40 cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                {msg.slice(0, 35)}…
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <div>
        <p className="text-xs tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>
          SENT MESSAGES
        </p>
        {broadcasts.length === 0 ? (
          <div className="rounded-2xl p-6 text-center card-shadow" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No broadcasts sent yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {broadcasts.map(b => (
              <div
                key={b.id}
                className="p-4 rounded-2xl card-shadow"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>{b.message}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {new Date(b.sentAt).toLocaleString('en-US', {
                    month: 'short', day: 'numeric',
                    hour: 'numeric', minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
