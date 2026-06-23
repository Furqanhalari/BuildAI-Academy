'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface NavLink { href: string; label: string; icon: string }

const STUDENT_LINKS: NavLink[] = [
  { href: '/student/dashboard',   label: 'Dashboard',   icon: '🗺️' },
  { href: '/student/profile',     label: 'Profile',     icon: '🏅' },
  { href: '/student/leaderboard', label: 'Leaderboard', icon: '🏆' },
]

const TEACHER_LINKS: NavLink[] = [
  { href: '/teacher/dashboard',  label: 'Students',   icon: '👥' },
  { href: '/teacher/schedule',   label: 'Schedule',   icon: '📅' },
  { href: '/teacher/analytics',  label: 'Analytics',  icon: '📊' },
  { href: '/teacher/broadcast',  label: 'Broadcast',  icon: '📢' },
]

export default function NavBar() {
  const { appUser, logOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const links = appUser?.role === 'teacher' ? TEACHER_LINKS : STUDENT_LINKS

  async function handleLogOut() {
    await logOut()
    router.replace('/login')
    toast.success('Logged out')
  }

  return (
    <nav
      className="fixed bottom-0 left-0 w-full h-14 md:bottom-auto md:top-0 md:h-full md:w-28 flex flex-row md:flex-col items-center py-2 px-4 md:py-5 md:px-3 z-50"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e2d6b 100%)',
        boxShadow: '0 -3px 20px rgba(30,58,138,0.15), 3px 0 20px rgba(30,58,138,0.25)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="hidden md:flex mb-8 w-10 h-10 rounded-xl items-center justify-center text-xl transition hover:scale-110"
        title="BuildAI Academy"
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        🤖
      </Link>

      {/* Nav links */}
      <div className="flex flex-row md:flex-col gap-6 md:gap-2 flex-1 justify-center md:justify-start">
        {links.map(link => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-lg transition"
              style={{
                background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                boxShadow: active ? '0 0 0 1px rgba(255,255,255,0.35), 0 4px 12px rgba(0,0,0,0.15)' : 'none',
                transform: active ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {link.icon}
            </Link>
          )
        })}
      </div>

      {/* XP pill (student only) */}
      {appUser?.role === 'student' && (
        <div className="md:mb-3 flex flex-row md:flex-col items-center gap-1 md:gap-0.5 px-2">
          <span className="text-xs font-bold text-amber-400">{appUser.xp}</span>
          <span className="text-[10px] text-white/50">XP</span>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={handleLogOut}
        title="Log out"
        className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-full text-sm font-semibold transition cursor-pointer"
        style={{ color: 'rgba(255,255,255,0.95)', background: 'rgba(255,255,255,0.08)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      >
        <span className="text-lg">🚪</span>
        <span className="hidden md:inline">Log out</span>
      </button>
    </nav>
  )
}
