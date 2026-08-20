'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm fade-in">
        {/* Logo Hero */}
        <div className="text-center mb-10">
          {/* Glowing logo ring */}
          <div className="relative inline-block mb-5">
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #2F5FFF 0%, #7c3aed 100%)',
                filter: 'blur(28px)',
                opacity: 0.35,
                transform: 'scale(1.2)',
              }}
            />
            <div
              className="relative rounded-3xl p-3"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)',
                boxShadow: '0 8px 40px rgba(47,95,255,0.28), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                border: '1.5px solid rgba(47,95,255,0.18)',
              }}
            >
              <Image
                src="/BuildAI_Academy_Logo.png"
                alt="BuildAI Academy"
                width={340}
                height={108}
                priority
                className="h-24 w-auto object-contain block"
              />
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-base font-semibold tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 space-y-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm placeholder-[#4a4a6a] outline-none focus:ring-2 focus:ring-indigo-500 transition"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-lg px-3 py-2.5 text-sm placeholder-[#4a4a6a] outline-none focus:ring-2 focus:ring-indigo-500 transition"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          Accounts are created by your teacher or admin. Please contact them for access.
        </p>
      </div>
    </div>
  )
}
