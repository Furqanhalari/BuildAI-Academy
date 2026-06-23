#!/usr/bin/env node
import admin from 'firebase-admin'

function initAdmin() {
  if (admin.apps && admin.apps.length) return admin
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (!b64) {
    console.error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set')
    process.exit(1)
  }
  const sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
  admin.initializeApp({ credential: admin.credential.cert(sa) })
  return admin
}

function parseArgs() {
  const args = {}
  for (const a of process.argv.slice(2)) {
    const [k, v] = a.split('=')
    const key = k.replace(/^--/, '')
    args[key] = v ?? true
  }
  return args
}

async function main() {
  const args = parseArgs()
  const { email, name, studentId, batch, parentNumber, password } = args
  if (!email || !name) {
    console.error('Usage: node scripts/create-user.mjs --email=... --name="Full Name" [--studentId=...] [--batch=...] [--parentNumber=...] [--password=...]')
    process.exit(1)
  }

  const adminApp = initAdmin()
  const pwd = password || (Math.random().toString(36).slice(2, 10) + 'A1!')

  try {
    const user = await adminApp.auth().createUser({
      email,
      password: pwd,
      displayName: name,
    })

    await adminApp.auth().setCustomUserClaims(user.uid, { role: 'student' })

    const profile = {
      studentId: studentId || null,
      name,
      parentNumber: parentNumber || null,
      email,
      batch: batch || null,
      xp: 0,
      currentNode: 'node-1-1',
      paymentStatus: 'unpaid',
      lastLogin: null,
      createdAt: adminApp.firestore.FieldValue.serverTimestamp(),
    }

    await adminApp.firestore().collection('users').doc(user.uid).set(profile)

    const resetLink = await adminApp.auth().generatePasswordResetLink(email)

    console.log('Created user:', user.uid)
    console.log('Temporary password (if any):', pwd)
    console.log('Password reset link (share with user):', resetLink)
  } catch (err) {
    console.error('Error creating user:', err)
    process.exit(1)
  }
}

main()
