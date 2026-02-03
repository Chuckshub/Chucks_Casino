// Casino Video Poker Sound Effects
// Retro 80s/90s casino sounds using Web Audio API

// CARD DEAL - Shuffle sound of cards being laid out
function playCardDeal() {
    const audioContext = new AudioContext();
    
    // Multiple quick card sounds to simulate dealing/laying out
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const bufferSize = audioContext.sampleRate * 0.1;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let j = 0; j < bufferSize; j++) {
                data[j] = Math.random() * 2 - 1;
            }
            
            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const filter = audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1800 + Math.random() * 300;
            filter.Q.value = 2;
            
            const gainNode = audioContext.createGain();
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            noise.start();
            noise.stop(audioContext.currentTime + 0.1);
        }, i * 80);
    }
}

// HOLD CARD - Lower pitched beep when selecting hold
function playCardHold() {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 400;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// DRAW - Lower beep for drawing new cards
function playCardDraw() {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
}

// SMALL WIN - Classic two-tone casino chime
function playWinChime() {
    const audioContext = new AudioContext();
    
    // Two notes: classic "ding-ding"
    const notes = [1046.50, 1318.51]; // C6, E6
    
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = audioContext.currentTime + (index * 0.15);
        const endTime = startTime + 0.3;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
    });
}

// BIG WIN - Ascending arpeggio for bigger payouts (Full House and up)
function playBigWin() {
    const audioContext = new AudioContext();
    
    // Fast ascending notes
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'triangle';
        
        const startTime = audioContext.currentTime + (index * 0.08);
        const endTime = startTime + 0.25;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
    });
}

// JACKPOT - Crazy celebration sound for Royal Flush, Four Deuces, etc!
function playJackpot() {
    const audioContext = new AudioContext();
    
    // Rapid alternating high notes
    for (let i = 0; i < 12; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Alternate between two high frequencies
        oscillator.frequency.value = i % 2 === 0 ? 1200 : 1600;
        oscillator.type = i % 3 === 0 ? 'square' : 'triangle';
        
        const startTime = audioContext.currentTime + (i * 0.08);
        const endTime = startTime + 0.15;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
    }
    
    // Add a final ascending flourish
    setTimeout(() => {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1568.00];
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            const startTime = audioContext.currentTime + (index * 0.05);
            const endTime = startTime + 0.3;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
            
            oscillator.start(startTime);
            oscillator.stop(endTime);
        });
    }, 100);
}

// Export for use in main game
if (typeof window !== 'undefined') {
    window.casinoSounds = {
        cardDeal: playCardDeal,
        cardHold: playCardHold,
        cardDraw: playCardDraw,
        smallWin: playWinChime,
        bigWin: playBigWin,
        jackpot: playJackpot
    };
}
