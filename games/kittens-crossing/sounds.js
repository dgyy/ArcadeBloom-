function encodeWAV(audioData, sampleRate) {
  const buffer = new ArrayBuffer(44 + audioData.length * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + audioData.length * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 = PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channels * bits per sample / 8)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, audioData.length * 2, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < audioData.length; i++, offset += 2) {
    const sample = Math.max(-1, Math.min(1, audioData[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
  }

  return 'data:audio/wav;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}

/**
 * Helper function to write a string to a DataView.
 */
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function generateEngineSound() {
  const sampleRate = 44100;
  const duration = 0.5; // seconds
  const frequency = 20; // Hz
  const numSamples = sampleRate * duration;
  const audioData = new Float32Array(numSamples);
  const amplitude = 1;

  // Sine wave generation using a standard formula
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    audioData[i] = 0.4**0 * Math.sin( 2 * Math.PI * frequency * t) + 
                   0.4**1 * Math.sin( 4 * Math.PI * frequency * t) + 
                   0.4**2 * Math.sin( 8 * Math.PI * frequency * t) + 
                   0.4**3 * Math.sin(16 * Math.PI * frequency * t);
  }

  return encodeWAV(audioData, sampleRate);
}

function generateHonkSound() {
  const sampleRate = 44100;
  const duration = 0.5; // seconds
  const frequency = 200; // Hz
  const numSamples = sampleRate * duration;
  const audioData = new Float32Array(numSamples);
  const amplitude = 1;

  // Sine wave generation using a standard formula
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    audioData[i] = ((audioData[i-1] ?? 0)*24 + (i>sampleRate*duration*0.25 && i<sampleRate*duration*0.50?0:1)*Math.abs(Math.sin(Math.PI * frequency * t)))/25;
  }

  return encodeWAV(audioData, sampleRate);
}




SVOX.sounds = SVOX.sounds ?? {};
SVOX.sounds.Engine = generateEngineSound();
SVOX.sounds.Death = generateHonkSound();