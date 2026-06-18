'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import NavBar from '@/components/ui/NavBar'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !appUser) router.replace('/login')
    if (!loading && appUser?.role === 'teacher') router.replace('/teacher/dashboard')
  }, [appUser, loading, router])

  if (loading || !appUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      <NavBar />
      <main className="flex-1 pb-20 md:pb-6 md:ml-16 p-4 md:p-6 w-full min-h-screen">{children}</main>
    </div>
  )
}
