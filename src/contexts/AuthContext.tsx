'use client'

import {
  createContext, useContext, useEffect, useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  type User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUser, createUser, updateUser, initStudentProgress } from '@/lib/firestore'
import type { AppUser, Role } from '@/lib/types'

interface AuthContextValue {
  firebaseUser: User | null
  appUser: AppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, role: Role) => Promise<void>
  logOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadAppUser(user: User) {
    const data = await getUser(user.uid)
    setAppUser(data)
    if (data) {
      const today = new Date().toDateString()
      const lastActive = data.lastActive ? new Date(data.lastActive).toDateString() : ''
      if (lastActive !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const streak = lastActive === yesterday.toDateString()
          ? (data.streak || 0) + 1
          : 1
        await updateUser(user.uid, { lastActive: new Date().toISOString(), streak })
        setAppUser(prev => prev ? { ...prev, streak, lastActive: new Date().toISOString() } : prev)
      }
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      setFirebaseUser(user)
      if (user) {
        await loadAppUser(user)
      } else {
        setAppUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    await loadAppUser(cred.user)
  }

  async function signUp(email: string, password: string, name: string, role: Role) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const userData: Omit<AppUser, 'id'> = {
      name,
      email,
      role,
      xp: 0,
      streak: 1,
      lastActive: new Date().toISOString(),
      optInLeaderboard: false,
      enrolledAt: new Date().toISOString(),
    }
    await createUser(cred.user.uid, userData)
    if (role === 'student') {
      await initStudentProgress(cred.user.uid)
    }
    setAppUser({ id: cred.user.uid, ...userData })
  }

  async function logOut() {
    await signOut(auth)
    setFirebaseUser(null)
    setAppUser(null)
  }

  async function refreshUser() {
    if (firebaseUser) await loadAppUser(firebaseUser)
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, loading, signIn, signUp, logOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
