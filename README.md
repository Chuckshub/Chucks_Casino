# Casino Video Poker - Deployment Guide

## Features
- **Jacks or Better** video poker
- **Deuces Wild** video poker
- **Blackjack** with split and double down
- **Three Card Poker**
- Firebase stats tracking

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup
3. Create a new Web app in your project

### 2. Get Firebase Configuration
1. In Firebase Console, go to Project Settings > General
2. Scroll down to "Your apps" section
3. Copy the Firebase configuration object

### 3. Configure Firebase
1. Open `firebase-stats.js`
2. Replace the placeholder values in `firebaseConfig`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 4. Enable Firestore Database
1. In Firebase Console, go to Firestore Database
2. Click "Create database"
3. Start in **test mode** (or production mode with rules)
4. Choose a location

### 5. Set Firestore Rules (Optional but Recommended)
Go to Firestore > Rules and use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to write game data
    match /game_sessions/{document} {
      allow create: if true;
      allow read: if false;
    }
    match /game_results/{document} {
      allow create: if true;
      allow read: if false;
    }
    match /hand_types/{document} {
      allow create: if true;
      allow read: if false;
    }
    match /special_actions/{document} {
      allow create: if true;
      allow read: if false;
    }
  }
}
```

## Vercel Deployment

### Option 1: Deploy via CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow prompts (accept defaults)

### Option 2: Deploy via GitHub

1. Push code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" > "Project"
4. Import your GitHub repository
5. Click "Deploy"

### Option 3: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Drag and drop the entire folder
3. Click "Deploy"

## What Gets Tracked

### Game Sessions
- Game type (jacks, deuces, blackjack, threecard)
- Starting bet
- Session ID (unique per browser session)
- Timestamp

### Game Results
- Game type
- Bet amount
- Result message
- Win amount
- Net profit/loss
- Player and dealer hands
- Timestamp
- Session ID

### Hand Types (Video Poker)
- Game type
- Hand type (Royal Flush, Straight, etc.)
- Bet amount
- Payout amount

### Special Actions (Blackjack)
- Action type (split, double)
- Bet amount

## Viewing Your Stats

### Via Firebase Console
1. Go to Firestore Database in Firebase Console
2. Browse collections: `game_sessions`, `game_results`, `hand_types`, `special_actions`

### Via Code (Future Enhancement)
You can add a stats dashboard page that calls:
```javascript
const stats = await window.stats.getStats();
console.log(stats);
```

## Files Structure

```
casino-poker/
├── index.html              # Main game file
├── firebase-stats.js       # Firebase integration
├── package.json           # Dependencies
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

## Environment Variables (Optional)

For added security, you can use Vercel environment variables:

1. In Vercel Dashboard > Project Settings > Environment Variables
2. Add your Firebase config as environment variables
3. Update `firebase-stats.js` to read from environment

## Troubleshooting

### Stats not recording?
1. Check browser console for errors
2. Verify Firebase config is correct
3. Check Firestore rules allow writes
4. Make sure Firebase scripts loaded (check Network tab)

### Deployment failed?
1. Make sure all files are in the root directory
2. Check `vercel.json` syntax
3. Try `vercel --debug` for more info

## Next Steps

1. Add authentication for player accounts
2. Create admin dashboard for viewing stats
3. Add leaderboards
4. Export stats to CSV/Excel
5. Add real-time analytics

## Support

For issues or questions, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
