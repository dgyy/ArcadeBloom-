let audioCtx: AudioContext = null;
let ready = false;
let cannonBuffer:AudioBuffer,
    hitPlayerBuffer: AudioBuffer,
    hitEnemyBuffer: AudioBuffer,
    coinPickupBuffer: AudioBuffer,
    fanfareBuffer: AudioBuffer,
    sadFanfareBuffer: AudioBuffer,
    enemyDeathBuffer: AudioBuffer;
export function createAudioContext() {
    if (ready) return;
    audioCtx = new (window.AudioContext ? window.AudioContext : window.webkitAudioContext)();

    cannonBuffer = generateCannonBallSoundBuffer();
    hitPlayerBuffer = generatePlayerHitSoundBuffer();
    hitEnemyBuffer = generateEnemyHitSoundBuffer();
    coinPickupBuffer = generateCoinPickupSoundBuffer();
    fanfareBuffer = generateFanfareSoundBuffer();
    sadFanfareBuffer = generateSadFanfareSoundBuffer();
    enemyDeathBuffer = generateEnemyDeathSoundBuffer();
    ready = true;
}

const SOUNDS = {
    CANNON_SHOOT: 0,
    PLAYER_HIT: 1,
    CANNON_BALL_HIT: 2,
    COIN_PICKUP: 3,
};

const COOLDOWNS = [100, 200, 300, 0];
const lastPlayed = [0, 0, 0, 0];


function generateCannonBallSoundBuffer(): AudioBuffer {
    const duration = 0.1;  // Very brief duration.
    const frameCount = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, frameCount, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
        const time = i / audioCtx.sampleRate;
        const amplitude = Math.exp(-15 * time);  // Rapid fade-out for a soft "pluck" sound.
        data[i] = amplitude * Math.sin(75 * Math.PI * 2 * time); // Slightly higher frequency for a light sound.
    }

    return buffer;
}

function generateEnemyHitSoundBuffer(): AudioBuffer {
    const duration = 0.15;  // Slightly longer than the cannonball sound, but still brief.
    const frameCount = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, frameCount, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
        const time = i / audioCtx.sampleRate;
        const amplitude = Math.exp(-10 * time);  // Dampening for the "thud" effect.
        data[i] = amplitude * Math.sin(100 * Math.PI * 2 * time);  // Lower frequency for a deeper sound.
    }

    return buffer;
}

function generateEnemyDeathSoundBuffer(): AudioBuffer {
    const duration = 0.5;  // Longer duration for a more dramatic effect.
    const frameCount = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, frameCount, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
        const time = i / audioCtx.sampleRate;
        const amplitude = Math.exp(-3 * time);  // Slow decay for a dramatic end.
        const frequency = 800 - 600 * time;  // Descending pitch to add a feeling of falling or ending.
        data[i] = amplitude * Math.sin(frequency * Math.PI * 2 * time);
    }

    return buffer;
}


function generatePlayerHitSoundBuffer(): AudioBuffer {
    const duration = 0.3;
    const frameCount = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, frameCount, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    const freq = 120;

    for (let i = 0; i < frameCount; i++) {
        const time = i / audioCtx.sampleRate;
        const amplitude = Math.exp(-1.5 * time);
        data[i] = amplitude * (Math.sin(freq * Math.PI * 2 * time) * (1 - time));  // Modulating the sound to taper off.
    }

    return buffer;
}

function generateCoinPickupSoundBuffer(): AudioBuffer {
    const duration = 0.3;
    const frameCount = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, frameCount, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    const frequencies = [130.81, 164.81, 196, 261.63, 329.63, 392, 523.25, 659.25];
    const speed = 40; // notes per second

    for (let i = 0; i < frameCount; i++) {
        const time = i / audioCtx.sampleRate;
        const amplitude = Math.exp(-0.5 * time);
        const freq = frequencies[Math.floor(time * speed) % frequencies.length];
        data[i] = amplitude * Math.sin(freq * Math.PI * 2 * time);
    }

    return buffer;
}

function generateFanfareSoundBuffer(): AudioBuffer {
    const duration = 1.2; // total duration of the sound
    const frameCount = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, frameCount, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    const frequencies = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77]; // C5, D5, E5, F5, G5, A5, B5
    const noteDurations = [0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6]; // durations of each note

    let currentTime = 0;
    let currentNote = 0;

    for (let i = 0; i < frameCount; i++) {
        const time = i / audioCtx.sampleRate;
        if (time > currentTime + noteDurations[currentNote]) {
            currentTime += noteDurations[currentNote];
            currentNote = (currentNote + 1) % frequencies.length;
        }

        const amplitude = Math.exp(-0.5 * (time - currentTime));
        const freq = frequencies[currentNote];
        data[i] = amplitude * Math.sin(freq * Math.PI * 2 * (time - currentTime));
    }

    return buffer;
}

function generateSadFanfareSoundBuffer(): AudioBuffer {
    const duration = 1.2; // total duration of the sound
    const frameCount = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, frameCount, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    const frequencies = [523.25, 493.88, 466.16, 440.00, 415.30, 391.99, 369.99]; // C5, B4, A#4, A4, G#4, G4, F#4
    const noteDurations = [0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6]; // durations of each note

    let currentTime = 0;
    let currentNote = 0;

    for (let i = 0; i < frameCount; i++) {
        const time = i / audioCtx.sampleRate;
        if (time > currentTime + noteDurations[currentNote]) {
            currentTime += noteDurations[currentNote];
            currentNote = (currentNote + 1) % frequencies.length;
        }

        const amplitude = Math.exp(-0.5 * (time - currentTime));
        const freq = frequencies[currentNote];
        data[i] = amplitude * Math.sin(freq * Math.PI * 2 * (time - currentTime));
    }

    return buffer;
}



function canPlaySound(soundId) {
    const now = performance.now();
    if (now - lastPlayed[soundId] > COOLDOWNS[soundId]) {
        lastPlayed[soundId] = now;
        return true;
    }
    return false;
}

function playBuffer(buffer, soundId) {
    if (!ready) return;
    if (canPlaySound(soundId)) {
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
    }
}
export function playCannonSound() {
    playBuffer(cannonBuffer, SOUNDS.CANNON_SHOOT);
}

export function playHitPlayerSound() {
    playBuffer(hitPlayerBuffer, SOUNDS.PLAYER_HIT);
}
export function playCannonballHitEnemySound() {
    playBuffer(hitEnemyBuffer, SOUNDS.CANNON_BALL_HIT);
}

export function playCoinPickupSound() {
    playBuffer(coinPickupBuffer, SOUNDS.COIN_PICKUP);
}

export function playFanfareSound() {
    playBuffer(fanfareBuffer, SOUNDS.COIN_PICKUP);
}

export function playSadFanfareSound() {
    playBuffer(sadFanfareBuffer, SOUNDS.COIN_PICKUP);
}

export function playEnemyDeathSound() {
    playBuffer(enemyDeathBuffer, SOUNDS.COIN_PICKUP);
}