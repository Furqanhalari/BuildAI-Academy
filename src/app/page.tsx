'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function RootPage() {
  const { appUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!appUser) {
      router.replace('/login')
    } else if (appUser.role === 'teacher') {
      router.replace('/teacher/dashboard')
    } else {
      router.replace('/student/dashboard')
    }
  }, [appUser, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading BuildAI Academy…</p>
      </div>
    </div>
  )
}
