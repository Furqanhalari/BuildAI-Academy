'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Medal,
  Trophy,
  Users,
  Calendar,
  BarChart3,
  Megaphone,
  LogOut,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface NavLink { href: string; label: string; icon: LucideIcon }

const STUDENT_LINKS: NavLink[] = [
  { href: '/student/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/student/profile',     label: 'Profile',     icon: Medal },
  { href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
]

const TEACHER_LINKS: NavLink[] = [
  { href: '/teacher/dashboard',  label: 'Students',   icon: Users },
  { href: '/teacher/schedule',   label: 'Schedule',   icon: Calendar },
  { href: '/teacher/analytics',  label: 'Analytics',  icon: BarChart3 },
  { href: '/teacher/broadcast',  label: 'Broadcast',  icon: Megaphone },
]

function NavTooltip({ label }: { label: string }) {
  return (
    <span
      className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[60] hidden md:block"
      style={{
        background: 'rgba(255,255,255,0.96)',
        color: '#0B1739',
        boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
      }}
      role="tooltip"
    >
      {label}
    </span>
  )
}

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
      className="fixed bottom-0 left-0 w-full h-16 md:bottom-auto md:top-0 md:h-full md:w-16 flex flex-row md:flex-col items-center py-2 px-3 md:py-5 md:px-0 z-50 md:overflow-visible"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e2d6b 100%)',
        boxShadow: '0 -3px 20px rgba(30,58,138,0.15), 3px 0 20px rgba(30,58,138,0.25)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="hidden md:flex mb-8 w-11 h-11 rounded-xl items-center justify-center transition hover:scale-110"
        title="BuildAI Academy"
        style={{
          background: '#ffffff',
          border: '2px solid rgba(47,95,255,0.5)',
          boxShadow: '0 0 0 3px rgba(47,95,255,0.18), 0 4px 16px rgba(0,0,0,0.22)',
        }}
      >
        <Image
          src="/BuildAI_Academy_Icon.png"
          alt="BuildAI Academy"
          width={30}
          height={30}
          className="w-8 h-8 object-contain"
        />
      </Link>

      {/* Nav links */}
      <div className="flex flex-row md:flex-col gap-4 md:gap-2 flex-1 justify-center md:justify-start">
        {links.map(link => {
          const active = pathname.startsWith(link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className="group relative flex flex-col md:flex-row items-center justify-center min-w-[52px] md:w-10 md:h-10 py-1 md:py-0 rounded-xl transition"
              style={{
                background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                boxShadow: active ? '0 0 0 1px rgba(255,255,255,0.35), 0 4px 12px rgba(0,0,0,0.15)' : 'none',
                transform: active ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <Icon
                size={20}
                strokeWidth={2}
                className="text-white shrink-0"
                aria-hidden="true"
              />
              <span className="md:hidden text-[10px] font-medium text-white/85 leading-tight mt-0.5">
                {link.label}
              </span>
              <NavTooltip label={link.label} />
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
        className="group relative flex flex-col md:flex-row items-center justify-center gap-0 md:gap-0 min-w-[52px] md:w-10 md:h-10 py-1 md:py-0 px-2 md:px-0 rounded-xl text-sm font-semibold transition cursor-pointer"
        style={{ color: 'rgba(255,255,255,0.95)', background: 'rgba(255,255,255,0.08)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      >
        <LogOut size={20} strokeWidth={2} className="shrink-0" aria-hidden="true" />
        <span className="md:hidden text-[10px] font-medium text-white/85 leading-tight mt-0.5">
          Log out
        </span>
        <NavTooltip label="Log out" />
      </button>
    </nav>
  )
}
