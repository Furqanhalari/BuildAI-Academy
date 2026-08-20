'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminResetLinks() {
  const router = useRouter()
  const [studentEmail, setStudentEmail] = useState('')
  const [resetLink, setResetLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [adminSecret, setAdminSecret] = useState('')

  function handleLogin() {
    if (adminSecret === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setAuthenticated(true)
      toast.success('Authenticated!')
    } else {
      toast.error('Invalid admin secret')
    }
  }

  async function generateResetLink() {
    if (!studentEmail) {
      toast.error('Enter a student email')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/reset-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '',
        },
        body: JSON.stringify({ studentEmail }),
      })

      // Safely handle empty or non-JSON responses
      const text = await res.text()
      let data: any = null
      try {
        data = text ? JSON.parse(text) : null
      } catch (e) {
        data = { error: text }
      }

      if (!res.ok) {
        const message = data?.error || `Request failed: ${res.status}`
        throw new Error(message)
      }

      setResetLink(data?.resetLink ?? null)
      toast.success('Reset link generated!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error generating reset link'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'var(--background)' }}
      >
        <div
          className="rounded-2xl p-8 max-w-md w-full"
          style={{ background: 'var(--surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
        >
          <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
            Admin Console
          </h1>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Admin Secret
            </label>
            <input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin secret"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-2 rounded-lg font-semibold transition"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
            }}
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{ background: 'var(--background)' }}
    >
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
            Student Password Reset Links
          </h1>
          <button
            onClick={() => {
              setAuthenticated(false)
              setResetLink(null)
              setStudentEmail('')
              toast.success('Logged out')
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
          >
            Logout
          </button>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Student Email
            </label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateResetLink()}
              placeholder="student@example.com"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>
          <button
            onClick={generateResetLink}
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold transition disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
            }}
          >
            {loading ? 'Generating...' : 'Generate Reset Link'}
          </button>
        </div>

        {resetLink && (
          <div
            className="rounded-2xl p-6"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                Reset Link for {studentEmail}
              </h2>
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                Share this link with the student. It will expire in 1 hour.
              </p>
            </div>

            <div
              className="p-3 rounded-lg mb-4 break-all"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
              }}
            >
              <code
                className="text-xs font-mono"
                style={{ color: 'var(--text)' }}
              >
                {resetLink}
              </code>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resetLink)
                  toast.success('Link copied to clipboard!')
                }}
                className="flex-1 py-2 rounded-lg font-semibold transition"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                  color: '#ffffff',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
                }}
              >
                Copy Link
              </button>
              <button
                onClick={() => window.open(resetLink, '_blank')}
                className="flex-1 py-2 rounded-lg font-semibold transition"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--accent)',
                  border: '2px solid var(--accent)',
                }}
              >
                Open in Browser
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
