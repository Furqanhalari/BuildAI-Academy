'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { getNodeProgress, submitNodeTask } from '@/lib/firestore'
import { getNode, getLevel } from '@/lib/courseData'
import type { StudentNodeProgress } from '@/lib/types'

export default function NodeDetailPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = use(params)
  const { appUser } = useAuth()
  const router = useRouter()
  const node = getNode(nodeId)
  const level = node ? getLevel(node.levelId) : null

  const [progress, setProgress] = useState<StudentNodeProgress | null>(null)
  const [submissionText, setSubmissionText] = useState('')
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [checkedItems, setCheckedItems] = useState<boolean[]>([])

  useEffect(() => {
    if (!appUser || !node) return
    getNodeProgress(appUser.id, node.id).then(p => {
      setProgress(p)
      if (p?.submissionText) setSubmissionText(p.submissionText)
      if (p?.submissionUrl) setSubmissionUrl(p.submissionUrl)
    })
    setCheckedItems(new Array(node.preClassBrief.length).fill(false))
  }, [appUser, node])

  if (!node || !level) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
        Node not found.{' '}
        <Link href="/student/dashboard" className="text-indigo-400">Back to dashboard</Link>
      </div>
    )
  }

  const status = progress?.status ?? 'locked'
  const canSubmit = status === 'active' || status === 'needs_revision'
  const isApproved = status === 'approved'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!appUser) return
    if (!submissionText.trim() && !submissionUrl.trim()) {
      toast.error('Add a description or link before submitting')
      return
    }
    setSubmitting(true)
    try {
      await submitNodeTask(appUser.id, node!.id, submissionText.trim(), submissionUrl.trim())
      setProgress(prev => prev ? { ...prev, status: 'submitted' } : prev)
      toast.success('Submitted! Your teacher will review it soon 🎉')
    } catch {
      toast.error('Submission failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    locked:         { bg: 'rgba(107,107,138,0.12)', text: '#4b5563', label: '🔒 Locked' },
    active:         { bg: 'rgba(45,71,199,0.12)',   text: '#1e3a8a', label: '▶️ Active — task released' },
    submitted:      { bg: 'rgba(3b,91,219,0.12)',   text: '#1d4ed8', label: '📬 Submitted — awaiting review' },
    needs_revision: { bg: 'rgba(217,119,6,0.12)',   text: '#c2410c', label: '✏️ Needs revision' },
    approved:       { bg: 'rgba(5,150,105,0.12)',   text: '#047857', label: '✅ Approved' },
  }
  const sc = statusConfig[status] ?? statusConfig.locked

  return (
    <div className="space-y-6 fade-in max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <Link href="/student/dashboard" className="hover:text-indigo-600 transition">← Dashboard</Link>
        <span>/</span>
        <span>Level {level.order} — {level.title}</span>
        <span>/</span>
        <span className="font-semibold" style={{ color: 'var(--text)' }}>Node {node.order}</span>
      </div>

      {/* Node header */}
      <div className="flex items-start justify-between">
        <div>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: sc.bg, color: sc.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.text }} />
            {sc.label}
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{node.title}</h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Node {node.order} · Level {level.order} — {level.title}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>On approval</p>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.2)' }}>
            <span className="text-amber-600 text-base">⚡</span>
            <span className="text-lg font-bold text-amber-700">+{node.taskXp} XP</span>
          </div>
        </div>
      </div>

      {/* Pre-class brief */}
      <div
        className="rounded-2xl p-4 card-shadow"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">📖</span>
          <p className="text-xs tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
            WHAT WE COVER IN CLASS
          </p>
        </div>
        <ul className="space-y-3">
          {node.preClassBrief.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <button
                onClick={() => {
                  const updated = [...checkedItems]
                  updated[i] = !updated[i]
                  setCheckedItems(updated)
                }}
                className="mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition border"
                style={{
                  background: checkedItems[i] ? 'var(--accent)' : 'var(--surface-2)',
                  borderColor: checkedItems[i] ? 'var(--accent)' : 'var(--border-2)',
                }}
              >
                {checkedItems[i] && <span className="text-white text-[10px]">✓</span>}
              </button>
              <span
                className="text-sm"
                style={{
                  color: checkedItems[i] ? 'var(--text-muted)' : 'var(--text)',
                  textDecoration: checkedItems[i] ? 'line-through' : 'none',
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Class content */}
      <div
        className="rounded-2xl p-4 card-shadow"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🎯</span>
          <p className="text-xs tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
            WHAT WE BUILD IN CLASS
          </p>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{node.classContent}</p>
      </div>

      {/* Task */}
      <div
        className="rounded-2xl p-4 card-shadow"
        style={{
          background: isApproved ? 'rgba(5,150,105,0.06)' : 'var(--surface)',
          border: `1px solid ${isApproved ? 'rgba(5,150,105,0.3)' : 'var(--border)'}`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{node.isBossTask ? '🏆' : '📝'}</span>
            <p className="text-xs tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
              {node.isBossTask ? 'BOSS TASK' : 'YOUR TASK'}
            </p>
          </div>
          {isApproved && <span className="text-xs font-bold text-emerald-700">+{node.taskXp} XP earned ✓</span>}
        </div>
        <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>{node.taskTitle}</h3>
        <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {node.taskDescription}
        </p>

        {/* Revision note */}
        {status === 'needs_revision' && progress?.teacherNote && (
          <div
            className="mb-4 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)', color: '#c2410c' }}
          >
            <p className="font-bold mb-0.5">Teacher note:</p>
            <p>{progress.teacherNote}</p>
          </div>
        )}

        {/* Submission form */}
        {!isApproved && status !== 'locked' && status !== 'submitted' && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={submissionText}
              onChange={e => setSubmissionText(e.target.value)}
              placeholder="Describe what you built — what it does, what you learned, any challenges you faced…"
              rows={4}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', color: 'var(--text)' }}
            />
            <input
              type="url"
              value={submissionUrl}
              onChange={e => setSubmissionUrl(e.target.value)}
              placeholder="Link to code, screenshot, or screen recording"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', color: 'var(--text)' }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting…' : '🚀 Submit task'}
            </button>
          </form>
        )}

        {status === 'submitted' && (
          <div
            className="p-3 rounded-xl text-sm text-center font-semibold"
            style={{ background: 'rgba(45,71,199,0.08)', border: '1px solid rgba(45,71,199,0.2)', color: 'var(--accent)' }}
          >
            ✅ Submitted! Your teacher will review it soon.
          </div>
        )}

        {status === 'locked' && (
          <div
            className="p-3 rounded-xl text-sm text-center font-medium"
            style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
          >
            🔒 Complete the previous node to unlock this task.
          </div>
        )}
      </div>
    </div>
  )
}
