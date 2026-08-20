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
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-10 overflow-hidden"
      style={{ background: '#eef1fa' }}
    >
      {/* ── Decorative blobs ─────────────────────────── */}
      {/* Top-right circle */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, rgba(47,95,255,0.12) 55%, transparent 100%)',
        }}
      />
      {/* Top-left dots grid */}
      <div
        className="absolute top-6 left-6 w-32 h-32 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle, #2F5FFF 1.2px, transparent 1.2px)',
          backgroundSize: '12px 12px',
        }}
      />
      {/* Bottom-left wave blob */}
      <div
        className="absolute -bottom-12 -left-12 w-96 h-72 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(47,95,255,0.30) 0%, rgba(124,58,237,0.18) 55%, transparent 100%)',
          borderRadius: '0 55% 35% 0 / 0 45% 55% 0',
          filter: 'blur(1px)',
        }}
      />
      {/* Bottom-right small blob */}
      <div
        className="absolute bottom-20 -right-6 w-52 h-44 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.20) 0%, rgba(47,95,255,0.10) 70%, transparent 100%)',
          borderRadius: '50% 0 0 50%',
        }}
      />

      {/* ── Main content ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md fade-in flex flex-col items-center">

        {/* Logo — no box, no border, just the image */}
        <div className="mb-2 flex justify-center w-full">
          <Image
            src="/BuildAI_Academy_Logo.png"
            alt="BuildAI Academy"
            width={340}
            height={108}
            priority
            className="object-contain w-64 sm:w-80 h-auto"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(47,95,255,0.10))' }}
          />
        </div>

        {/* Tagline */}
        <p
          className="text-sm sm:text-base font-semibold mb-8 tracking-widest text-center"
          style={{ color: '#2F5FFF', letterSpacing: '0.18em' }}
        >
          Learn.&nbsp;<span style={{ color: '#0B1739' }}>Build.</span>&nbsp;Achieve.
        </p>

        {/* ── White card ───────────────────────────── */}
        <div
          className="w-full rounded-3xl px-8 sm:px-10 py-9"
          style={{
            background: '#ffffff',
            boxShadow: '0 12px 60px rgba(47,95,255,0.16), 0 2px 16px rgba(0,0,0,0.06)',
            border: '1px solid rgba(47,95,255,0.08)',
          }}
        >
          {/* Avatar icon */}
          <div className="flex justify-center mb-5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: '#eef1fa', border: '2px solid rgba(47,95,255,0.15)' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2F5FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-center text-2xl font-bold mb-1" style={{ color: '#0B1739' }}>
            Welcome Back!
          </h1>
          <p className="text-center text-sm mb-1" style={{ color: '#6b78b0' }}>
            Sign in to your account
          </p>
          {/* Blue underline accent */}
          <div className="flex justify-center mb-6">
            <div className="h-0.5 w-10 rounded-full" style={{ background: '#2F5FFF' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1739' }}>
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b78b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m2 7 10 7 10-7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition"
                  style={{
                    background: '#f8f9ff',
                    border: '1.5px solid #dde3f5',
                    color: '#0B1739',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#2F5FFF'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,95,255,0.12)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#dde3f5'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#0B1739' }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b78b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition"
                  style={{
                    background: '#f8f9ff',
                    border: '1.5px solid #dde3f5',
                    color: '#0B1739',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#2F5FFF'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,95,255,0.12)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#dde3f5'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #2F5FFF 0%, #4f46e5 100%)',
                boxShadow: '0 6px 22px rgba(47,95,255,0.40)',
                letterSpacing: '0.03em',
                marginTop: '4px',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.10)' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Secure badge */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b78b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="text-xs font-medium" style={{ color: '#6b78b0' }}>Secure</span>
          </div>
        </div>

        {/* Bottom note */}
        <div className="flex flex-col items-center mt-7 gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b78b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p className="text-center text-xs leading-relaxed" style={{ color: '#6b78b0', maxWidth: '260px' }}>
            Accounts are created by your teacher or admin.<br />Please contact them for access.
          </p>
        </div>
      </div>
    </div>
  )
}
