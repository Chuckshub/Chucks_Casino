// Casino Video Poker Sound Effects
// Retro 80s/90s casino sounds using Web Audio API

// Global volume setting (controlled by game)
let globalVolume = 0.5;

// CARD DEAL - Shuffle sound of cards being laid out
function playCardDeal() {
    if (globalVolume === 0) return;
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
            
            gainNode.gain.setValueAtTime(0.12 * globalVolume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            noise.start();
            noise.stop(audioContext.currentTime + 0.1);
        }, i * 80);
    }
}

// HOLD CARD - Lower pitched beep when selecting hold
function playCardHold() {
    if (globalVolume === 0) return;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 400;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.15 * globalVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// DRAW - Lower beep for drawing new cards
function playCardDraw() {
    if (globalVolume === 0) return;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.15 * globalVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
}

// SMALL WIN - Classic two-tone casino chime
function playWinChime() {
    if (globalVolume === 0) return;
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
        gainNode.gain.linearRampToValueAtTime(0.25 * globalVolume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
    });
}

// BIG WIN - Ascending arpeggio for bigger payouts (Full House and up)
function playBigWin() {
    if (globalVolume === 0) return;
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
        gainNode.gain.linearRampToValueAtTime(0.2 * globalVolume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
    });
}

// JACKPOT - Crazy celebration sound for Royal Flush, Four Deuces, etc!
function playJackpot() {
    if (globalVolume === 0) return;
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
        gainNode.gain.linearRampToValueAtTime(0.15 * globalVolume, startTime + 0.01);
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
            gainNode.gain.linearRampToValueAtTime(0.25 * globalVolume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
            
            oscillator.start(startTime);
            oscillator.stop(endTime);
        });
    }, 100);
}

// LOSE SOUND - Descending beeps for losses
function playLoseSound() {
    if (globalVolume === 0) return;
    console.log('🔊 Playing lose sound');
    const audioContext = new AudioContext();
    
    const beeps = [
        { freq: 600, start: 0, duration: 0.15 },
        { freq: 450, start: 0.2, duration: 0.15 },
        { freq: 300, start: 0.4, duration: 0.3 },
    ];
    
    beeps.forEach(beep => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = beep.freq;
        oscillator.type = 'square';
        
        const startTime = audioContext.currentTime + beep.start;
        const endTime = startTime + beep.duration;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15 * globalVolume, startTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0.001, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
    });
}

// Export for use in main game
if (typeof window !== 'undefined') {
    window.casinoSounds = {
        cardDeal: playCardDeal,
        cardHold: playCardHold,
        cardDraw: playCardDraw,
        smallWin: playWinChime,
        bigWin: playBigWin,
        jackpot: playJackpot,
        lose: playLoseSound
    };
}

// ============================================================================
// FIREWORKS ANIMATION FOR JACKPOT WINS
// ============================================================================

let fireworksParticles = [];
let fireworksAnimationId = null;

// Pixel particle class
class FireworkParticle {
    constructor(x, y, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.life = 100;
        this.size = 4;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15; // Gravity
        this.life -= 2;
    }

    draw(ctx) {
        if (this.life > 0) {
            ctx.fillStyle = this.color;
            ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
        }
    }
}

// Create firework burst
function createFirework(ctx, x, y, colors, count = 30) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const color = colors[Math.floor(Math.random() * colors.length)];
        fireworksParticles.push(new FireworkParticle(x, y, color, vx, vy));
    }
}

// Animation loop
function animateFireworks(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworksParticles = fireworksParticles.filter(p => p.life > 0);

    fireworksParticles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
    });

    if (fireworksParticles.length > 0) {
        fireworksAnimationId = requestAnimationFrame(() => animateFireworks(canvas, ctx));
    } else {
        fireworksAnimationId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none'; // Hide canvas when done
    }
}

// JACKPOT FIREWORKS - Trigger the visual display
function playJackpotFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Show and resize canvas
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // MASSIVE FIREWORKS DISPLAY!
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFD700', '#FFA500'];
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const x = 100 + Math.random() * (canvas.width - 200);
            const y = 80 + Math.random() * (canvas.height - 160);
            createFirework(ctx, x, y, colors, 50);
        }, i * 100);
    }
    
    if (!fireworksAnimationId) {
        animateFireworks(canvas, ctx);
    }
}

// Update window exports to include fireworks
if (typeof window !== 'undefined') {
    window.playJackpotFireworks = playJackpotFireworks;
}

// Volume setter - called from main game
if (typeof window !== 'undefined') {
    Object.defineProperty(window.casinoSounds, 'volume', {
        set: function(v) {
            globalVolume = v;
            console.log('Volume set to:', v);
        },
        get: function() {
            return globalVolume;
        }
    });
}
