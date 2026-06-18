import Link from 'next/link'
import type { CourseNode, StudentNodeProgress } from '@/lib/types'

interface Props {
  node: CourseNode | null
  progress: StudentNodeProgress | null
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:         { label: 'Not started',    color: '#1e3a8a', bg: 'rgba(30,58,138,0.08)',  border: 'rgba(30,58,138,0.2)' },
  submitted:      { label: 'Submitted ✓',    color: '#047857', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)' },
  needs_revision: { label: 'Needs revision', color: '#c2410c', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.2)' },
}

export default function TaskCard({ node, progress }: Props) {
  if (!node || !progress) {
    return (
      <div
        className="rounded-2xl p-5 card-shadow"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-indigo-600">📋</span>
          <p className="text-xs tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>CURRENT TASK</p>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No active task right now.</p>
      </div>
    )
  }

  const status = statusConfig[progress.status] ?? { label: progress.status, color: '#4b5563', bg: 'rgba(75,85,99,0.08)', border: 'rgba(75,85,99,0.2)' }

  return (
    <Link
      href={`/student/node/${node.id}`}
      className="block rounded-2xl p-5 card-shadow card-hover"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-indigo-600 text-lg">📋</span>
        <p className="text-xs tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>CURRENT TASK</p>
      </div>
      <p className="text-base font-bold mb-1.5" style={{ color: 'var(--text)' }}>{node.taskTitle}</p>
      <p className="text-xs mb-4 line-clamp-2 font-medium" style={{ color: 'var(--text-muted)' }}>
        {node.taskDescription}
      </p>
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
        >
          {status.label}
        </span>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: 'rgba(217,119,6,0.08)', color: '#b45309', border: '1px solid rgba(217,119,6,0.2)' }}
        >
          +{node.taskXp} XP
        </span>
      </div>
    </Link>
  )
}
