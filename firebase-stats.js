// Firebase Configuration and Stats Tracking
// Replace these with your actual Firebase config values from Firebase Console

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Import Firebase SDK (using CDN in HTML)
let db = null;

// Initialize Firebase
function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      console.log('Firebase initialized successfully');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Stats tracking functions
const stats = {
  // Track game start
  gameStarted: function(gameType, bet) {
    if (!db) return;
    
    db.collection('game_sessions').add({
      gameType: gameType,
      startBet: bet,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      sessionId: generateSessionId()
    }).catch(err => console.error('Error logging game start:', err));
  },

  // Track game result
  gameResult: function(gameType, bet, result, winAmount, playerHand, dealerHand) {
    if (!db) return;
    
    db.collection('game_results').add({
      gameType: gameType,
      bet: bet,
      result: result,
      winAmount: winAmount || 0,
      netAmount: (winAmount || 0) - bet,
      playerHand: playerHand ? playerHand.map(c => c.rank + c.suit) : [],
      dealerHand: dealerHand ? dealerHand.map(c => c.rank + c.suit) : [],
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      sessionId: generateSessionId()
    }).catch(err => console.error('Error logging result:', err));
  },

  // Track hand types (for video poker)
  handPlayed: function(gameType, handType, bet, payout) {
    if (!db) return;
    
    db.collection('hand_types').add({
      gameType: gameType,
      handType: handType,
      bet: bet,
      payout: payout,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => console.error('Error logging hand:', err));
  },

  // Track special actions (split, double, etc.)
  specialAction: function(gameType, action, bet) {
    if (!db) return;
    
    db.collection('special_actions').add({
      gameType: gameType,
      action: action,
      bet: bet,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => console.error('Error logging action:', err));
  },

  // Get player statistics
  getStats: async function() {
    if (!db) return null;
    
    try {
      const snapshot = await db.collection('game_results')
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();
      
      const results = [];
      snapshot.forEach(doc => {
        results.push(doc.data());
      });
      
      return {
        totalGames: results.length,
        totalWagered: results.reduce((sum, r) => sum + r.bet, 0),
        totalWon: results.reduce((sum, r) => sum + r.winAmount, 0),
        netProfit: results.reduce((sum, r) => sum + r.netAmount, 0),
        byGame: groupByGame(results)
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  }
};

// Helper functions
function generateSessionId() {
  if (!window.sessionId) {
    window.sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  return window.sessionId;
}

function groupByGame(results) {
  const byGame = {};
  results.forEach(r => {
    if (!byGame[r.gameType]) {
      byGame[r.gameType] = {
        games: 0,
        wagered: 0,
        won: 0,
        net: 0
      };
    }
    byGame[r.gameType].games++;
    byGame[r.gameType].wagered += r.bet;
    byGame[r.gameType].won += r.winAmount;
    byGame[r.gameType].net += r.netAmount;
  });
  return byGame;
}

// Export for use in HTML
window.stats = stats;
window.initFirebase = initFirebase;
