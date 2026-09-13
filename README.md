# GT Study Space Tracker

A mobile app for Georgia Tech students to find and track available study spaces on campus in real time.

## Features

- **Browse spots** — search and filter study spaces by name, building, or availability
- **Campus map** — color-coded map markers showing which spots are open vs. full
- **Check in / Check out** — mark yourself at a spot to update live occupancy counts
- **Favorites** — save spots you use often for quick access
- **Profile** — see your current check-in and saved spot count

## Tech Stack

- [Expo](https://expo.dev) (SDK 57) with [Expo Router](https://expo.github.io/router/) for file-based navigation
- React Native 0.86
- Firebase (Firestore for real-time data, Firebase Auth for login)
- TypeScript

## Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- [Expo Go](https://expo.dev/go) app on your phone, or an iOS/Android simulator

## Setup

### 1. Clone the repo

```bash
git clone <repo-url>
cd study-space-tracker
```

### 2. Install dependencies

```bash
npm install
```

> The repo includes an `.npmrc` that sets `legacy-peer-deps=true` automatically, so the install should work without extra flags.

### 3. Configure Firebase

Create a `.env.local` file in the project root with your Firebase project credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Contact a team member to get the values for the shared dev Firebase project.

### 4. Start the dev server

```bash
npm start
```

Scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android emulator.

## Seeding Firestore

On first launch the app auto-seeds the Firestore `spots` collection if it is empty. You can also run the seed script manually:

```bash
npm run seed
```

## Project Structure

```
app/
  (auth)/       # Login screen
  (tabs)/       # Main tab screens (Spots, Map, Saved, Profile)
  spot/[id].tsx # Spot detail + check-in page
components/     # Shared UI components (SpotCard, AvailabilityBadge)
constants/      # Static data (GT campus spots)
firebase/       # Firebase config, auth helpers, Firestore functions
hooks/          # Custom React hooks (useSpots, useAuth)
types/          # TypeScript interfaces
scripts/        # Firestore seed script
```
