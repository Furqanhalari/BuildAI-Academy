export type Role = 'student' | 'teacher'

export interface AppUser {
  id: string
  name: string
  email: string
  role: Role
  xp: number
  streak: number
  lastActive: string // ISO date string
  optInLeaderboard: boolean
  enrolledAt: string
}

export type NodeStatus = 'locked' | 'active' | 'submitted' | 'needs_revision' | 'approved'

export interface CourseNode {
  id: string
  levelId: string
  order: number
  title: string
  subtitle: string
  preClassBrief: string[]
  classContent: string
  taskTitle: string
  taskDescription: string
  taskXp: number
  isBossTask: boolean
}

export interface CourseLevel {
  id: string
  order: number
  title: string
  tagline: string
  color: string // tailwind color name
  nodes: CourseNode[]
}

export interface StudentNodeProgress {
  studentId: string
  nodeId: string
  status: NodeStatus
  submissionText: string
  submissionUrl: string
  submittedAt: string | null
  approvedAt: string | null
  xpEarned: number
  teacherNote: string
}

export interface TaskRelease {
  nodeId: string
  releasedAt: string
  releasedBy: string
}

export interface LiveSession {
  id: string
  nodeId: string
  title: string
  scheduledAt: string
  joinLink: string
  isLive: boolean
  endedAt: string | null
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

export interface StudentBadge {
  studentId: string
  badgeId: string
  earnedAt: string
}

export interface Broadcast {
  id: string
  message: string
  sentAt: string
  sentBy: string
  sentByName: string
}

export interface LeaderboardEntry {
  userId: string
  name: string
  xp: number
  streak: number
  currentNode: string
}
