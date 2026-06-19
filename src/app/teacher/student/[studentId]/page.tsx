'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { getUser, getStudentProgress, approveSubmission, sendRevision, unlockNodeManually } from '@/lib/firestore'
import { ALL_NODES, LEVELS, getNode } from '@/lib/courseData'
import type { AppUser, StudentNodeProgress } from '@/lib/types'

export default function StudentDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params)
  const searchParams = useSearchParams()
  const focusNodeId = searchParams.get('nodeId')

  const [student, setStudent] = useState<AppUser | null>(null)
  const [progress, setProgress] = useState<StudentNodeProgress[]>([])
  const [selectedSub, setSelectedSub] = useState<StudentNodeProgress | null>(null)
  const [revisionNote, setRevisionNote] = useState('')
  const [working, setWorking] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    const [s, p] = await Promise.all([
      getUser(studentId),
      getStudentProgress(studentId),
    ])
    setStudent(s)
    setProgress(p)
    if (focusNodeId) {
      const sub = p.find(x => x.nodeId === focusNodeId)
      if (sub) setSelectedSub(sub)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [studentId])

  const progressMap: Record<string, StudentNodeProgress> = {}
  for (const p of progress) progressMap[p.nodeId] = p

  async function handleApprove() {
    if (!selectedSub) return
    setWorking(true)
    const node = getNode(selectedSub.nodeId)
    const level = LEVELS.find(l => l.id === node?.levelId)
    const nodeIndex = level?.nodes.findIndex(n => n.id === selectedSub.nodeId) ?? -1
    const nextNode = level?.nodes[nodeIndex + 1] ?? null
    try {
      await approveSubmission(studentId, selectedSub.nodeId, node?.taskXp ?? 50, nextNode?.id ?? null)
      toast.success(`Approved! +${node?.taskXp} XP awarded`)
      setSelectedSub(null)
      await load()
    } catch {
      toast.error('Failed to approve')
    } finally {
      setWorking(false)
    }
  }

  async function handleRevision() {
    if (!selectedSub || !revisionNote.trim()) {
      toast.error('Write a revision note first')
      return
    }
    setWorking(true)
    try {
      await sendRevision(studentId, selectedSub.nodeId, revisionNote.trim())
      toast.success('Revision note sent')
      setSelectedSub(null)
      setRevisionNote('')
      await load()
    } catch {
      toast.error('Failed to send revision')
    } finally {
      setWorking(false)
    }
  }

  async function handleManualUnlock(nodeId: string) {
    setWorking(true)
    try {
      await unlockNodeManually(studentId, nodeId)
      toast.success('Node unlocked manually')
      await load()
    } catch {
      toast.error('Failed to unlock')
    } finally {
      setWorking(false)
    }
  }

  if (loading) {
    return <div className="h-64 rounded-2xl shimmer" />
  }

  if (!student) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
        Student not found.{' '}
        <Link href="/teacher/dashboard" className="text-indigo-400">Back</Link>
      </div>
    )
  }

  const pendingSubs = progress.filter(p => p.status === 'submitted' || p.status === 'needs_revision')

  return (
    <div className="space-y-6 fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <Link href="/teacher/dashboard" className="hover:text-indigo-600 transition">← Dashboard</Link>
        <span>/</span>
        <span className="font-semibold" style={{ color: 'var(--text)' }}>{student.name}</span>
      </div>

      {/* Student card */}
      <div className="flex items-center gap-4 p-5 rounded-2xl card-shadow" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: 'rgba(45,71,199,0.12)', color: 'var(--accent)' }}>
          {student.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{student.name}</p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{student.email}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-lg font-bold text-amber-600">{student.xp}</p><p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>XP</p></div>
          <div><p className="text-lg font-bold text-orange-600">🔥 {student.streak}</p><p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Streak</p></div>
          <div><p className="text-lg font-bold text-emerald-600">{progress.filter(p => p.status === 'approved').length}</p><p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Approved</p></div>
        </div>
      </div>

      {/* Submission review panel */}
      {selectedSub && (
        <div className="rounded-2xl p-5 space-y-4 card-shadow" style={{ background: 'var(--surface)', border: '1px solid var(--accent)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest font-bold mb-1" style={{ color: 'var(--text-muted)' }}>REVIEWING SUBMISSION</p>
              <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{getNode(selectedSub.nodeId)?.taskTitle}</p>
            </div>
            <button onClick={() => setSelectedSub(null)} className="cursor-pointer" style={{ color: 'var(--text-muted)' }}>✕</button>
          </div>

          {(selectedSub.submissionText1 || selectedSub.submissionUrl1) && (
            <div className="rounded-2xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">1️⃣</span>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Task 1 submission</p>
              </div>
              {selectedSub.submissionText1 && (
                <div className="p-3 rounded-xl mb-3" style={{ background: 'var(--surface)', color: 'var(--text)' }}>
                  <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</p>
                  <p className="leading-relaxed">{selectedSub.submissionText1}</p>
                </div>
              )}
              {selectedSub.submissionUrl1 && (
                <a
                  href={selectedSub.submissionUrl1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition"
                  style={{ background: 'rgba(45,71,199,0.08)', border: '1px solid rgba(45,71,199,0.2)' }}
                >
                  🔗 View Task 1 link →
                </a>
              )}
            </div>
          )}

          {(selectedSub.submissionText2 || selectedSub.submissionUrl2) && (
            <div className="rounded-2xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">2️⃣</span>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Task 2 submission</p>
              </div>
              {selectedSub.submissionText2 && (
                <div className="p-3 rounded-xl mb-3" style={{ background: 'var(--surface)', color: 'var(--text)' }}>
                  <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</p>
                  <p className="leading-relaxed">{selectedSub.submissionText2}</p>
                </div>
              )}
              {selectedSub.submissionUrl2 && (
                <a
                  href={selectedSub.submissionUrl2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition"
                  style={{ background: 'rgba(45,71,199,0.08)', border: '1px solid rgba(45,71,199,0.2)' }}
                >
                  🔗 View Task 2 link →
                </a>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleApprove}
              disabled={working}
              className="py-2.5 rounded-xl text-sm font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition disabled:opacity-50 cursor-pointer"
            >
              ✅ Approve (+{getNode(selectedSub.nodeId)?.taskXp} XP)
            </button>
            <div className="space-y-2">
              <textarea
                value={revisionNote}
                onChange={e => setRevisionNote(e.target.value)}
                placeholder="Write revision note…"
                rows={2}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', color: 'var(--text)' }}
              />
              <button
                onClick={handleRevision}
                disabled={working}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-orange-700 hover:bg-orange-600 text-white transition disabled:opacity-50 cursor-pointer"
              >
                ✏️ Send revision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending submissions */}
      {pendingSubs.length > 0 && (
        <div>
          <p className="text-xs tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>PENDING REVIEW</p>
          <div className="space-y-2">
            {pendingSubs.map(sub => (
              <button
                key={sub.nodeId}
                onClick={() => setSelectedSub(sub)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl text-left transition hover:border-indigo-500/40 card-shadow cursor-pointer"
                style={{ background: selectedSub?.nodeId === sub.nodeId ? 'rgba(45,71,199,0.08)' : 'var(--surface)', border: `1px solid ${selectedSub?.nodeId === sub.nodeId ? 'var(--accent)' : 'var(--border)'}` }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{getNode(sub.nodeId)?.taskTitle}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {sub.submittedAt ? `Submitted ${new Date(sub.submittedAt).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${sub.status === 'needs_revision' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                  {sub.status === 'needs_revision' ? 'Needs revision' : 'Submitted'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All nodes overview */}
      <div>
        <p className="text-xs tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>ALL NODES</p>
        <div className="space-y-4">
          {LEVELS.map(level => (
            <div key={level.id} className="rounded-2xl overflow-hidden card-shadow" style={{ border: '1px solid var(--border)' }}>
              <div className="p-3 flex items-center justify-between" style={{ background: 'var(--surface)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Level {level.order} — {level.title}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {level.nodes.filter(n => progressMap[n.id]?.status === 'approved').length} / {level.nodes.length}
                </p>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {level.nodes.map(node => {
                  const p = progressMap[node.id]
                  const status = p?.status ?? 'locked'
                  const canUnlock = status === 'locked'
                  const statusColors: Record<string, string> = {
                    locked: 'text-gray-500', active: 'text-indigo-600',
                    submitted: 'text-blue-600', needs_revision: 'text-orange-600', approved: 'text-emerald-700',
                  }
                  return (
                    <div key={node.id} className="flex items-center justify-between px-3.5 py-2.5" style={{ background: 'var(--surface-2)' }}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">
                          {status === 'approved' ? '✅' : status === 'submitted' ? '📬' : status === 'needs_revision' ? '✏️' : status === 'active' ? '▶️' : '🔒'}
                        </span>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{node.title}</p>
                          <p className="text-xs font-bold capitalize" style={{ color: statusColors[status] }}>
                            {status.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(status === 'submitted' || status === 'needs_revision') && (
                          <button
                            onClick={() => setSelectedSub(p!)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer font-semibold"
                          >
                            Review
                          </button>
                        )}
                        {canUnlock && (
                          <button
                            onClick={() => handleManualUnlock(node.id)}
                            disabled={working}
                            className="text-xs px-2.5 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer font-semibold"
                            style={{ background: 'var(--border-2)', color: 'var(--text)' }}
                          >
                            Unlock
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
