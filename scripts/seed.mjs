/**
 * Firestore seed script — run ONCE after setting up Firebase.
 *
 * Usage:
 *   1. Add your Firebase service account credentials to scripts/serviceAccount.json
 *      (Download from Firebase Console → Project Settings → Service Accounts → Generate new private key)
 *   2. Run:  node scripts/seed.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
let serviceAccount
try {
  serviceAccount = require('./serviceAccount.json')
} catch {
  console.error('❌  Missing scripts/serviceAccount.json — download from Firebase Console → Service Accounts')
  process.exit(1)
}

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const LEVELS = [
  { id: 'level-1', order: 1, title: 'Python Kickstart', tagline: 'Make Python talk, think, and remember', color: 'green' },
  { id: 'level-2', order: 2, title: 'AI Foundations', tagline: 'Understand what AI really is', color: 'blue' },
  { id: 'level-3', order: 3, title: 'Build Chatbots', tagline: 'Create bots that actually work', color: 'purple' },
  { id: 'level-4', order: 4, title: 'Automation & Apps', tagline: 'Build tools that solve real problems', color: 'orange' },
  { id: 'level-5', order: 5, title: 'Earn Online', tagline: 'Turn your skills into real income', color: 'yellow' },
]

const BADGES = [
  { id: 'first-code',   title: 'First Code',   description: 'Completed your very first node',             icon: '💻', color: 'text-emerald-400' },
  { id: 'bug-slayer',   title: 'Bug Slayer',   description: 'Submitted after fixing an error',            icon: '🐛', color: 'text-red-400' },
  { id: 'speed-run',    title: 'Speed Run',    description: 'Submitted within 12 hours of task release',  icon: '⚡', color: 'text-yellow-400' },
  { id: 'on-a-roll',    title: 'On a Roll',    description: 'Maintained a 5-day streak',                 icon: '🔥', color: 'text-orange-400' },
  { id: 'ai-whisperer', title: 'AI Whisperer', description: 'Completed Level 2 — AI Foundations',        icon: '🤖', color: 'text-blue-400' },
  { id: 'bot-builder',  title: 'Bot Builder',  description: 'Completed Level 3 — Build Chatbots',        icon: '🤝', color: 'text-purple-400' },
  { id: 'open-source',  title: 'Open Source',  description: 'Pushed first project to GitHub',            icon: '🐙', color: 'text-gray-300' },
  { id: 'level-1-done', title: 'Pythonista',   description: 'Completed Level 1 — Python Kickstart',      icon: '🐍', color: 'text-emerald-400' },
  { id: 'level-4-done', title: 'Automator',    description: 'Completed Level 4 — Automation & Apps',     icon: '⚙️', color: 'text-orange-400' },
  { id: 'course-done',  title: 'BuildAI Grad', description: 'Completed the entire BuildAI Academy course',icon: '🎓', color: 'text-amber-400' },
]

async function seed() {
  console.log('🌱  Seeding Firestore…')
  const batch = db.batch()

  for (const level of LEVELS) {
    batch.set(db.collection('levels').doc(level.id), level)
    console.log(`  ✅  Level: ${level.title}`)
  }

  for (const badge of BADGES) {
    batch.set(db.collection('badges').doc(badge.id), badge)
    console.log(`  🏅  Badge: ${badge.title}`)
  }

  await batch.commit()
  console.log('\n✅  Seed complete! Levels and badges are in Firestore.')
  console.log('\nNext steps:')
  console.log('  1. Go to Firebase Console → Firestore → Rules')
  console.log('  2. Set rules (see README for recommended rules)')
  console.log('  3. Run: npm run dev')
}

seed().catch(err => { console.error(err); process.exit(1) })
