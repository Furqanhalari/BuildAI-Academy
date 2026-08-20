'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { CourseLevel, StudentNodeProgress } from '@/lib/types'
import { getLevelColor } from '@/lib/courseData'

interface Props {
  levels: CourseLevel[]
  progressMap: Record<string, StudentNodeProgress>
}

function nodeStatus(nodeId: string, progressMap: Record<string, StudentNodeProgress>) {
  return progressMap[nodeId]?.status ?? 'locked'
}

function NodeDot({ nodeId, title, status, href }: {
  nodeId: string; title: string; status: string; href: string
}) {
  const isActive   = status === 'active' || status === 'submitted' || status === 'needs_revision'
  const isApproved = status === 'approved'
  const isLocked   = status === 'locked'

  if (isLocked) {
    return (
      <div className="flex flex-col items-center gap-1.5 cursor-not-allowed select-none" style={{ width: 64 }}>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm transition card-shadow"
          style={{
            background: '#e2e8f0',
            border: '1.5px solid #cbd5e1',
            color: '#94a3b8',
            opacity: 0.65,
          }}
          title="🔒 Locked — Complete previous node to unlock"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <p
          className="text-center leading-tight font-bold text-slate-400"
          style={{ fontSize: 9.5, maxWidth: 60 }}
        >
          {title}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1.5" style={{ width: 64 }}>
      <Link href={href} className="relative block group">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition hover:scale-110 card-shadow
            ${isActive ? 'ring-4 ring-indigo-500/30' : ''}
            ${isApproved ? 'ring-4 ring-emerald-500/25' : ''}
          `}
          style={{
            background: isApproved
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #2F5FFF 0%, #3b5bdb 100%)',
            boxShadow: isApproved
              ? '0 4px 12px rgba(16, 185, 129, 0.3)'
              : '0 4px 12px rgba(47, 95, 255, 0.3)',
          }}
          title={isApproved ? `✅ Completed — ${title}` : `▶ Current Task — ${title}`}
        >
          {isApproved ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </div>
        {isActive && (
          <span
            className="absolute -inset-1 rounded-full border-2 border-indigo-500 opacity-60 animate-ping pointer-events-none"
            style={{ animationDuration: '2s' }}
          />
        )}
      </Link>
      <p
        className="text-center leading-tight font-bold"
        style={{
          fontSize: 9.5,
          color: isApproved ? '#047857' : 'var(--accent)',
          maxWidth: 60,
        }}
      >
        {title}
      </p>
    </div>
  )
}

export default function Roadmap({ levels, progressMap }: Props) {
  const [expandedLevel, setExpandedLevel] = useState<string | null>(
    levels.find(l => l.nodes.some(n => ['active', 'submitted', 'needs_revision'].includes(progressMap[n.id]?.status ?? 'locked')))?.id ?? levels[0].id
  )

  return (
    <div className="space-y-3">
      {levels.map((level, li) => {
        const colors = getLevelColor(level.color)
        const approvedCount = level.nodes.filter(n => progressMap[n.id]?.status === 'approved').length
        const totalCount = level.nodes.length
        const pct = Math.round((approvedCount / totalCount) * 100)
        const isExpanded = expandedLevel === level.id
        const isLocked = level.nodes.every(n => (progressMap[n.id]?.status ?? 'locked') === 'locked')

        return (
          <div
            key={level.id}
            className="rounded-2xl overflow-hidden transition card-shadow"
            style={{
              border: '1px solid var(--border)',
              opacity: isLocked && li > 0 ? 0.5 - li * 0.07 : 1,
            }}
          >
            {/* Level header */}
            <button
              className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer"
              style={{ background: 'var(--surface)' }}
              onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: colors.bg }}>
                  {['🐍','🤖','💬','⚙️','💰'][li]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Level {level.order} — {level.title}</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {isLocked ? 'Unlocks after previous level boss' : `${approvedCount} of ${totalCount} nodes complete`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isLocked && (
                  <>
                    <div className="w-16 h-1.5 rounded-full" style={{ background: 'var(--border-2)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: colors.text }}
                      />
                    </div>
                    <span className="text-xs font-bold" style={{ color: colors.text }}>{pct}%</span>
                  </>
                )}
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{isExpanded ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Nodes row */}
            {isExpanded && (
              <div
                className="px-4 py-4 flex items-center overflow-x-auto"
                style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}
              >
                {level.nodes.map((node, ni) => (
                  <div key={node.id} className="flex items-center">
                    <NodeDot
                      nodeId={node.id}
                      title={node.title}
                      status={nodeStatus(node.id, progressMap)}
                      href={`/student/node/${node.id}`}
                    />
                    {ni < level.nodes.length - 1 && (
                      <div
                        className="h-px w-8 mx-1 flex-shrink-0"
                        style={{
                          borderTop: progressMap[node.id]?.status === 'approved'
                            ? '2px solid #059669'
                            : '2px dashed var(--border-2)',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
