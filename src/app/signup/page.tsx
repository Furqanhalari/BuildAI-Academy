'use client'

import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4 text-2xl">🤖</div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Sign up is disabled</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            New accounts are created by your teacher or admin only. Please contact them to get access.
          </p>
        </div>
        <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            If you already have an account,{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">sign in</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
