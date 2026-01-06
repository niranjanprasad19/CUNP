# CUNP - Campus Unified Notifications Platform

This is the MVP for the Campus Unified Notifications Platform, built for HackNova.

## Tech Stack
- **Frontend**: React (Vite), Vanilla CSS (Custom Glassmorphism Design), Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting), Google Cloud Functions

## Prerequisites
1. Node.js installed.
2. A Firebase project created on the [Firebase Console](https://console.firebase.google.com/).
3. Enable **Authentication** (Email/Password, Google).
4. Enable **Firestore Database**.
5. Enable **Storage**.
6. Enable **Blaze Plan** (Pay as you go) on Firebase if you want to deploy Cloud Functions (required for external network access usually, but staying within free tier limits is possible for internal triggers). Note: Spark plan supports some functions but mostly requires Blaze now for Node.js 10+.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   cd functions
   npm install
   cd ..
   ```

2. **Configure Firebase**
   - Open `src/firebase.js`.
   - Replace the `firebaseConfig` object with your project's credentials.

3. **Run Locally**
   ```bash
   npm run dev
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## Features Implemented
- **Authentication**: Login with Email/Password or Google. Sign up includes Roll Number and ID Card upload skeleton.
- **Dashboard**: Role-based view (Student view default).
- **Aesthetics**: Custom "Cyber-Glass" design system with animations.
- **Backend Logic**: Cloud Functions for validating ID card uploads and sending notifications (in `functions/index.js`).

## Design
We prioritized a unique, high-contrast aesthetic using CSS variables, abandoning generic library styles for a bespoke look.
