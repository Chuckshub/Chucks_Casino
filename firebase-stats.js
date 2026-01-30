// Firebase Configuration and Stats Tracking
// Config is fetched from Vercel environment variables via API

// Import Firebase SDK (using CDN in HTML)
let db = null;
let firebaseInitialized = false;
let firebaseConfig = null;

// Initialize Firebase by fetching config from Vercel API
async function initFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK not loaded');
      return false;
    }
    
    // Fetch Firebase config from serverless function
    const response = await fetch('/api/firebase-config');
    const result = await response.json();
    
    if (!result.configured) {
      console.warn('Firebase not configured in Vercel environment variables');
      return false;
    }
    
    firebaseConfig = result.config;
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    firebaseInitialized = true;
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}

// Helper function to log to Firebase via serverless function
async function logToFirebase(collection, data) {
  try {
    const response = await fetch('/api/log-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ collection, data })
    });
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error logging to Firebase:', error);
    return false;
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
  gameResult: async function(gameType, bet, result, winAmount, playerHand, dealerHand) {
    const data = {
      gameType: gameType,
      bet: bet,
      result: result,
      winAmount: winAmount || 0,
      netAmount: (winAmount || 0) - bet,
      playerHand: playerHand ? playerHand.map(c => c.rank + c.suit) : [],
      dealerHand: dealerHand ? dealerHand.map(c => c.rank + c.suit) : [],
      sessionId: generateSessionId()
    };
    
    await logToFirebase('game_results', data);
  },

  // Track hand types (for video poker)
  handPlayed: async function(gameType, handType, bet, payout) {
    const data = {
      gameType: gameType,
      handType: handType,
      bet: bet,
      payout: payout
    };
    
    await logToFirebase('hand_types', data);
  },

  // Track special actions (split, double, etc.)
  specialAction: async function(gameType, action, bet) {
    const data = {
      gameType: gameType,
      action: action,
      bet: bet
    };
    
    await logToFirebase('special_actions', data);
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
window.isFirebaseConfigured = () => firebaseInitialized;
