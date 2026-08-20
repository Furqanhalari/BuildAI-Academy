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
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-8 overflow-hidden select-none"
      style={{ background: '#eef1fa' }}
    >
      {/* ── Background Wave Decor (Bottom Left / Bottom Right) ─────── */}
      <div
        className="absolute -bottom-16 -left-16 w-96 h-80 pointer-events-none opacity-80"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(47,95,255,0.45) 0%, rgba(99,102,241,0.25) 45%, transparent 75%)',
          filter: 'blur(24px)',
        }}
      />
      <div
        className="absolute -bottom-24 -right-20 w-[420px] h-[320px] pointer-events-none opacity-70"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(99,102,241,0.40) 0%, rgba(47,95,255,0.20) 50%, transparent 75%)',
          filter: 'blur(30px)',
        }}
      />
      {/* Wave SVG shape overlay at bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full h-36 pointer-events-none opacity-30"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          fill="#2F5FFF"
          fillOpacity="0.35"
          d="M0,224L60,202.7C120,181,240,139,360,138.7C480,139,600,181,720,197.3C840,213,960,203,1080,176C1200,149,1320,107,1380,85.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>

      {/* Top Right Radial Glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(147,197,253,0.5) 0%, rgba(199,210,254,0.25) 50%, transparent 75%)',
          filter: 'blur(25px)',
        }}
      />

      {/* Top Left Dot Grid */}
      <div
        className="absolute top-6 left-6 w-32 h-32 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle, #2F5FFF 1.2px, transparent 1.2px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* ── Main Container ───────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[370px] sm:max-w-[400px] fade-in flex flex-col items-center">

        {/* Brand Logo Header — Floating seamlessly */}
        <div className="mb-2 flex justify-center items-center w-full">
          <Image
            src="/BuildAI_Academy_Logo.png"
            alt="BuildAI Academy"
            width={240}
            height={74}
            priority
            className="w-48 sm:w-56 h-auto object-contain block"
          />
        </div>

        {/* Slogan Tagline */}
        <p className="text-xs sm:text-sm font-medium tracking-wide mb-6 text-center" style={{ color: '#0B1739' }}>
          Learn. <span className="font-semibold text-indigo-600">Build.</span> Achieve.
        </p>

        {/* ── Login Form Card ────────────────────────────────── */}
        <div
          className="w-full rounded-3xl p-6 sm:p-7"
          style={{
            background: '#ffffff',
            boxShadow: '0 10px 35px -5px rgba(47, 95, 255, 0.12), 0 4px 15px -3px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        >
          {/* Top User Icon Circle */}
          <div className="flex justify-center mb-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(47, 95, 255, 0.08)', color: '#2F5FFF' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-center text-xl font-bold mb-0.5 tracking-tight" style={{ color: '#0B1739' }}>
            Welcome Back!
          </h1>
          <p className="text-center text-xs mb-2" style={{ color: '#6b78b0' }}>
            Sign in to your account
          </p>

          {/* Blue underline accent */}
          <div className="flex justify-center mb-5">
            <div className="h-0.5 w-7 rounded-full bg-indigo-600" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#334155' }}>
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500/70 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  className="w-full rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all duration-200"
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#2F5FFF'
                    e.currentTarget.style.background = '#ffffff'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47, 95, 255, 0.12)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.background = '#f8fafc'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#334155' }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500/70 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  className="w-full rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm outline-none transition-all duration-200"
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#2F5FFF'
                    e.currentTarget.style.background = '#ffffff'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47, 95, 255, 0.12)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.background = '#f8fafc'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Sign in Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.92' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Secure Divider */}
          <div className="relative flex items-center justify-center mt-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative bg-white px-3 flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <span>Secure</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Contact Note */}
        <div className="flex flex-col items-center mt-4 gap-1.5">
          <div className="w-6 h-6 rounded-full bg-indigo-50/80 flex items-center justify-center text-indigo-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <p className="text-center text-[11px] leading-normal text-slate-400 max-w-[250px]">
            Accounts are created by your teacher or admin. Please contact them for access.
          </p>
        </div>

      </div>
    </div>
  )
}
