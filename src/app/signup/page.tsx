'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import type { Role } from '@/lib/types'

export default function SignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password, name, role)
      router.replace('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      toast.error(message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm fade-in">
          <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4 text-2xl">
            🤖
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Join BuildAI Academy</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 space-y-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Full name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ahmed Hassan"
              className="w-full rounded-lg px-3 py-2.5 text-sm placeholder-[#4a4a6a] outline-none focus:ring-2 focus:ring-indigo-500 transition"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm placeholder-[#4a4a6a] outline-none focus:ring-2 focus:ring-indigo-500 transition"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#4a4a6a] outline-none focus:ring-2 focus:ring-indigo-500 transition"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>I am a…</label>
            <div className="grid grid-cols-2 gap-2">
              {(['student', 'teacher'] as Role[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="py-2.5 rounded-lg text-sm font-medium transition border capitalize"
                  style={{
                    background: role === r ? 'rgba(99,102,241,0.2)' : 'var(--surface-2)',
                    borderColor: role === r ? '#6366f1' : 'var(--border)',
                    color: role === r ? '#a5b4fc' : 'var(--text-muted)',
                  }}
                >
                  {r === 'student' ? '📚 Student' : '👨‍🏫 Teacher'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
