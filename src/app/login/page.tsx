'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      router.replace('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      toast.error(message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
      style={{ background: '#eef1fa' }}
    >
      {/* ── Decorative blobs ─────────────────────────── */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.20) 0%, rgba(47,95,255,0.10) 55%, transparent 100%)' }}
      />
      <div className="absolute top-5 left-5 w-28 h-28 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #2F5FFF 1.2px, transparent 1.2px)', backgroundSize: '12px 12px' }}
      />
      <div className="absolute -bottom-10 -left-10 w-80 h-64 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(47,95,255,0.28) 0%, rgba(124,58,237,0.15) 55%, transparent 100%)', borderRadius: '0 55% 35% 0 / 0 45% 55% 0' }}
      />
      <div className="absolute bottom-16 -right-4 w-48 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(47,95,255,0.08) 70%, transparent 100%)', borderRadius: '50% 0 0 50%' }}
      />

      {/* ── Content ─────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-sm fade-in flex flex-col items-center">

        {/* Logo — mix-blend-mode:multiply removes the white bg */}
        <Image
          src="/BuildAI_Academy_Logo.png"
          alt="BuildAI Academy"
          width={260}
          height={80}
          priority
          className="object-contain mb-1"
          style={{
            width: 'clamp(180px, 55vw, 240px)',
            height: 'auto',
            mixBlendMode: 'multiply',   /* white bg disappears on #eef1fa */
          }}
        />

        {/* Tagline */}
        <p className="text-xs font-semibold tracking-widest mb-7 text-center"
          style={{ color: '#2F5FFF', letterSpacing: '0.20em' }}
        >
          Learn.&nbsp;<span style={{ color: '#0B1739' }}>Build.</span>&nbsp;Achieve.
        </p>

        {/* ── Card ─────────────────────────────────── */}
        <div
          className="w-full rounded-2xl px-7 pt-7 pb-6"
          style={{
            background: '#ffffff',
            boxShadow: '0 8px 40px rgba(47,95,255,0.13), 0 1px 8px rgba(0,0,0,0.05)',
          }}
        >
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: '#eef1fa', border: '1.5px solid rgba(47,95,255,0.18)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F5FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-center text-xl font-bold mb-0.5" style={{ color: '#0B1739' }}>
            Welcome Back!
          </h1>
          <p className="text-center text-xs mb-1" style={{ color: '#6b78b0' }}>
            Sign in to your account
          </p>
          <div className="flex justify-center mb-5">
            <div className="h-0.5 w-8 rounded-full" style={{ background: '#2F5FFF' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0B1739' }}>Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b78b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                  </svg>
                </span>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="you@example.com"
                  className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none transition"
                  style={{ background: '#f5f7ff', border: '1.5px solid #dde3f5', color: '#0B1739' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#2F5FFF'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,95,255,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#dde3f5'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0B1739' }}>Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b78b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none transition"
                  style={{ background: '#f5f7ff', border: '1.5px solid #dde3f5', color: '#0B1739' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#2F5FFF'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,95,255,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#dde3f5'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #2F5FFF 0%, #4f46e5 100%)', boxShadow: '0 4px 18px rgba(47,95,255,0.36)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.08)' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Secure */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b78b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="text-xs" style={{ color: '#6b78b0' }}>Secure</span>
          </div>
        </div>

        {/* Bottom note */}
        <div className="flex flex-col items-center mt-5 gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b78b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p className="text-center text-xs leading-relaxed" style={{ color: '#6b78b0', maxWidth: '240px' }}>
            Accounts are created by your teacher or admin.<br/>Please contact them for access.
          </p>
        </div>
      </div>
    </div>
  )
}
