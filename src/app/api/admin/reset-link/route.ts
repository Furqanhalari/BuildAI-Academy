import { NextResponse } from 'next/server'
import admin from 'firebase-admin'

function initAdmin() {
  if (admin.apps && admin.apps.length) return admin
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (!b64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set')
  }
  const sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
  admin.initializeApp({ credential: admin.credential.cert(sa) })
  return admin
}

export async function POST(req: Request) {
  const adminSecret = process.env.ADMIN_SECRET
  const header = req.headers.get('x-admin-secret')
  
  if (!header || header !== adminSecret) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { studentEmail } = body
  
  if (!studentEmail) {
    return new NextResponse('Missing studentEmail', { status: 400 })
  }

  const adminApp = initAdmin()

  try {
    // Generate a password reset link
    const resetLink = await adminApp.auth().generatePasswordResetLink(studentEmail)

    return NextResponse.json({
      success: true,
      studentEmail,
      resetLink,
      message: 'Copy the reset link below and share it with the student',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate reset link'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
