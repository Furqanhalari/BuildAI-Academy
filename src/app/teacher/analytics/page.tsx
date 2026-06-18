'use client'

import { useEffect, useState } from 'react'
import { getAllStudents, getAllSubmissions, getStudentProgress } from '@/lib/firestore'
import { LEVELS, ALL_NODES } from '@/lib/courseData'
import type { AppUser, StudentNodeProgress } from '@/lib/types'

interface NodeStat { nodeId: string; title: string; levelTitle: string; approved: number; submitted: number; stuck: number }

export default function AnalyticsPage() {
  const [students, setStudents] = useState<AppUser[]>([])
  const [allProgress, setAllProgress] = useState<StudentNodeProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const s = await getAllStudents()
      setStudents(s)
      const progArrays = await Promise.all(s.map(st => getStudentProgress(st.id)))
      setAllProgress(progArrays.flat())
      setLoading(false)
    }
    load()
  }, [])

  const totalStudents = students.length

  const nodeStats: NodeStat[] = ALL_NODES.map(node => {
    const level = LEVELS.find(l => l.id === node.levelId)!
    const progs = allProgress.filter(p => p.nodeId === node.id)
    return {
      nodeId: node.id,
      title: node.title,
      levelTitle: `L${level.order}`,
      approved: progs.filter(p => p.status === 'approved').length,
      submitted: progs.filter(p => p.status === 'submitted').length,
      stuck: progs.filter(p => p.status === 'needs_revision').length,
    }
  })

  const avgXp = totalStudents > 0
    ? Math.round(students.reduce((sum, s) => sum + s.xp, 0) / totalStudents)
    : 0

  const avgStreak = totalStudents > 0
    ? Math.round(students.reduce((sum, s) => sum + s.streak, 0) / totalStudents)
    : 0

  const completionRate = totalStudents > 0
    ? Math.round((allProgress.filter(p => p.status === 'approved').length / (totalStudents * ALL_NODES.length)) * 100)
    : 0

  if (loading) {
    return <div className="h-64 rounded-2xl shimmer" />
  }

  const overviewStats = [
    { label: 'Total students',  value: totalStudents,       icon: '👥', cardClass: 'stat-indigo',  textColor: '#1e3a8a' },
    { label: 'Avg XP',         value: avgXp,               icon: '⚡', cardClass: 'stat-amber',   textColor: '#b45309' },
    { label: 'Avg streak',     value: `${avgStreak}d`,     icon: '🔥', cardClass: 'stat-rose',    textColor: '#b91c1c' },
    { label: 'Completion',     value: `${completionRate}%`,icon: '✅', cardClass: 'stat-emerald', textColor: '#047857' },
  ]

  return (
    <div className="space-y-6 fade-in max-w-7xl">
      <div
        className="relative rounded-2xl p-6 overflow-hidden hero-navy card-accent-top card-shadow"
      >
        <h1 className="text-2xl font-bold text-white mb-1">📊 Analytics</h1>
        <p className="text-sm text-white/80">See where students are and where they slow down</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map(stat => (
          <div key={stat.label} className={`rounded-2xl p-5 card-shadow ${stat.cardClass}`} style={{ border: '1px solid transparent' }}>
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-3xl font-black mt-3" style={{ color: stat.textColor }}>{stat.value}</p>
            <p className="text-xs mt-1 font-bold" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Node completion chart */}
      <div className="rounded-2xl p-5 card-shadow" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-xs tracking-widest font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
          COMPLETION BY NODE (where students drop off)
        </p>
        <div className="space-y-2">
          {nodeStats.map(stat => {
            const maxVal = totalStudents || 1
            const pct = Math.round((stat.approved / maxVal) * 100)
            return (
              <div key={stat.nodeId} className="flex items-center gap-3">
                <span className="text-xs w-6 text-center font-bold" style={{ color: 'var(--text-muted)' }}>{stat.levelTitle}</span>
                <span className="text-xs w-36 truncate font-semibold" style={{ color: 'var(--text)' }}>{stat.title}</span>
                <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                  <div
                    className="h-full rounded-lg transition-all flex items-center px-2"
                    style={{ width: `${pct}%`, background: pct === 0 ? 'transparent' : 'rgba(45, 71, 199, 0.4)', minWidth: pct > 0 ? 24 : 0 }}
                  >
                    {pct > 15 && <span className="text-[10px] text-white font-bold">{pct}%</span>}
                  </div>
                </div>
                <div className="flex gap-2 text-xs font-semibold flex-shrink-0">
                  <span className="text-emerald-700">{stat.approved}✅</span>
                  <span className="text-blue-700">{stat.submitted}📬</span>
                  {stat.stuck > 0 && <span className="text-orange-700">{stat.stuck}✏️</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top students */}
      <div className="rounded-2xl p-5 card-shadow" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-xs tracking-widest font-bold mb-4" style={{ color: 'var(--text-muted)' }}>TOP STUDENTS BY XP</p>
        <div className="space-y-2">
          {[...students].sort((a, b) => b.xp - a.xp).slice(0, 5).map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span className="text-sm w-5">{['🥇','🥈','🥉','4.','5.'][i]}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(45, 71, 199, 0.12)', color: 'var(--accent)' }}>
                {s.name.slice(0,2).toUpperCase()}
              </div>
              <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.name}</span>
              <span className="text-sm font-bold text-amber-600">{s.xp} XP</span>
              <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>🔥 {s.streak}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inactive students */}
      {(() => {
        const twoDaysAgo = Date.now() - 48 * 3600 * 1000
        const inactive = students.filter(s => new Date(s.lastActive).getTime() < twoDaysAgo)
        if (inactive.length === 0) return null
        return (
          <div className="rounded-2xl p-5 card-shadow" style={{ background: '#fff1f2', border: '1px solid #fca5a5' }}>
            <p className="text-xs tracking-widest font-bold mb-3 text-red-700">INACTIVE 48H+ ({inactive.length})</p>
            <div className="space-y-1.5">
              {inactive.map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-red-950">{s.name}</span>
                  <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Last active: {new Date(s.lastActive).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
