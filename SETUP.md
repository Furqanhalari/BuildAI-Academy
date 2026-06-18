# BuildAI Academy — Setup Guide

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `buildai-academy`
3. Disable Google Analytics (not needed) → **Create project**

## 2. Enable Authentication

1. In Firebase Console → **Authentication** → **Get started**
2. Click **Email/Password** → Enable → **Save**

## 3. Enable Firestore

1. **Firestore Database** → **Create database**
2. Choose **Start in test mode** (you'll add rules below)
3. Select a region close to you → **Enable**

## 4. Get your Firebase config

1. **Project Settings** (gear icon) → **Your apps** → click **</>** (Web)
2. Name it `buildai-web` → **Register app**
3. Copy the `firebaseConfig` values into `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 5. Set Firestore security rules

In **Firestore → Rules**, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Teachers can read/write everything else
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }

    // Students can submit their own node progress
    match /studentNodes/{docId} {
      allow write: if request.auth != null &&
        resource == null ||
        resource.data.studentId == request.auth.uid;
    }
  }
}
```

Click **Publish**.

## 6. Run the dev server

```bash
cd buildai-academy
npm run dev
```

Open http://localhost:3000

## 7. First login

- Sign up as a **teacher** first (your account)
- Share the signup link with students — they select **Student**
- Students automatically get Node 1.1 unlocked on signup

## 8. Teacher workflow

1. **Schedule** a class in the Schedule tab
2. Click **Go Live** when class starts — students see the red banner
3. After class, **End class** and go to dashboard to **Release task**
4. Students submit → you review in **student detail page** → Approve or Revision
5. Approval auto-awards XP and unlocks the next node

## Recommended Firestore indexes

Add these composite indexes in Firebase Console → Firestore → Indexes:
- Collection: `studentNodes` | Fields: `studentId` ASC, `status` ASC
- Collection: `liveSessions` | Fields: `scheduledAt` ASC
- Collection: `broadcasts` | Fields: `sentAt` DESC
