import {
  doc, getDoc, setDoc, updateDoc, collection,
  query, where, getDocs, orderBy, addDoc,
  serverTimestamp, Timestamp, onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  AppUser, StudentNodeProgress, TaskRelease,
  LiveSession, StudentBadge, Broadcast,
} from './types'

// ── Users ────────────────────────────────────────────────────────────────────

export async function getUser(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as AppUser) : null
}

export async function createUser(uid: string, data: Omit<AppUser, 'id'>): Promise<void> {
  await setDoc(doc(db, 'users', uid), { ...data, id: uid })
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>)
}

export async function getAllStudents(): Promise<AppUser[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'student'))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as AppUser)
}

export async function getLeaderboard(): Promise<AppUser[]> {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'student'),
    where('optInLeaderboard', '==', true),
    orderBy('xp', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as AppUser)
}

// ── Node Progress ─────────────────────────────────────────────────────────────

export function progressId(studentId: string, nodeId: string) {
  return `${studentId}_${nodeId}`
}

export async function getNodeProgress(
  studentId: string, nodeId: string,
): Promise<StudentNodeProgress | null> {
  const snap = await getDoc(doc(db, 'studentNodes', progressId(studentId, nodeId)))
  return snap.exists() ? (snap.data() as StudentNodeProgress) : null
}

export async function getStudentProgress(studentId: string): Promise<StudentNodeProgress[]> {
  const q = query(collection(db, 'studentNodes'), where('studentId', '==', studentId))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as StudentNodeProgress)
}

export async function setNodeProgress(
  studentId: string, nodeId: string, data: Partial<StudentNodeProgress>,
): Promise<void> {
  const id = progressId(studentId, nodeId)
  const existing = await getDoc(doc(db, 'studentNodes', id))
  if (existing.exists()) {
    await updateDoc(doc(db, 'studentNodes', id), data as Record<string, unknown>)
  } else {
    await setDoc(doc(db, 'studentNodes', id), {
      studentId,
      nodeId,
      status: 'locked',
      submissionText: '',
      submissionUrl: '',
      submittedAt: null,
      approvedAt: null,
      xpEarned: 0,
      teacherNote: '',
      ...data,
    })
  }
}

export async function submitNodeTask(
  studentId: string, nodeId: string, submissionText: string, submissionUrl: string,
): Promise<void> {
  await setNodeProgress(studentId, nodeId, {
    status: 'submitted',
    submissionText,
    submissionUrl,
    submittedAt: new Date().toISOString(),
  })
}

export async function approveSubmission(
  studentId: string, nodeId: string, xpEarned: number, nextNodeId: string | null,
): Promise<void> {
  await setNodeProgress(studentId, nodeId, {
    status: 'approved',
    approvedAt: new Date().toISOString(),
    xpEarned,
  })
  const user = await getUser(studentId)
  if (user) {
    await updateUser(studentId, { xp: (user.xp || 0) + xpEarned })
  }
  if (nextNodeId) {
    await setNodeProgress(studentId, nextNodeId, { status: 'active' })
  }
}

export async function sendRevision(
  studentId: string, nodeId: string, teacherNote: string,
): Promise<void> {
  await setNodeProgress(studentId, nodeId, { status: 'needs_revision', teacherNote })
}

export async function unlockNodeManually(
  studentId: string, nodeId: string,
): Promise<void> {
  await setNodeProgress(studentId, nodeId, { status: 'active' })
}

export async function initStudentProgress(studentId: string): Promise<void> {
  await setNodeProgress(studentId, 'node-1-1', { status: 'active' })
}

export async function getAllSubmissions(): Promise<StudentNodeProgress[]> {
  const q = query(
    collection(db, 'studentNodes'),
    where('status', 'in', ['submitted', 'needs_revision']),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as StudentNodeProgress)
}

// ── Task Releases ─────────────────────────────────────────────────────────────

export async function releaseTask(nodeId: string, teacherId: string): Promise<void> {
  await setDoc(doc(db, 'taskReleases', nodeId), {
    nodeId,
    releasedAt: new Date().toISOString(),
    releasedBy: teacherId,
  })
}

export async function getTaskRelease(nodeId: string): Promise<TaskRelease | null> {
  const snap = await getDoc(doc(db, 'taskReleases', nodeId))
  return snap.exists() ? (snap.data() as TaskRelease) : null
}

export function onTaskReleasesChange(cb: (releases: TaskRelease[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'taskReleases'), snap => {
    cb(snap.docs.map(d => d.data() as TaskRelease))
  })
}

// ── Live Sessions ─────────────────────────────────────────────────────────────

export async function getLiveSessions(): Promise<LiveSession[]> {
  const q = query(collection(db, 'liveSessions'), orderBy('scheduledAt', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as LiveSession))
}

export async function createLiveSession(data: Omit<LiveSession, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'liveSessions'), data)
  return ref.id
}

export async function goLive(sessionId: string, joinLink: string): Promise<void> {
  await updateDoc(doc(db, 'liveSessions', sessionId), { isLive: true, joinLink })
}

export async function endLiveSession(sessionId: string): Promise<void> {
  await updateDoc(doc(db, 'liveSessions', sessionId), {
    isLive: false,
    endedAt: new Date().toISOString(),
  })
}

export function onLiveSessionChange(cb: (sessions: LiveSession[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'liveSessions'), orderBy('scheduledAt', 'asc')),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as LiveSession))),
  )
}

// ── Badges ────────────────────────────────────────────────────────────────────

export async function awardBadge(studentId: string, badgeId: string): Promise<void> {
  const id = `${studentId}_${badgeId}`
  const existing = await getDoc(doc(db, 'studentBadges', id))
  if (!existing.exists()) {
    await setDoc(doc(db, 'studentBadges', id), {
      studentId,
      badgeId,
      earnedAt: new Date().toISOString(),
    })
  }
}

export async function getStudentBadges(studentId: string): Promise<StudentBadge[]> {
  const q = query(collection(db, 'studentBadges'), where('studentId', '==', studentId))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as StudentBadge)
}

// ── Broadcasts ────────────────────────────────────────────────────────────────

export async function sendBroadcast(
  message: string, teacherId: string, teacherName: string,
): Promise<void> {
  await addDoc(collection(db, 'broadcasts'), {
    message,
    sentAt: new Date().toISOString(),
    sentBy: teacherId,
    sentByName: teacherName,
  })
}

export async function getBroadcasts(): Promise<Broadcast[]> {
  const q = query(collection(db, 'broadcasts'), orderBy('sentAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Broadcast))
}

export function onBroadcastsChange(cb: (broadcasts: Broadcast[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'broadcasts'), orderBy('sentAt', 'desc')),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Broadcast))),
  )
}
