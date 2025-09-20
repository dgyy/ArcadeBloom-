const speechSynthesis = window.speechSynthesis
let voiceEN
let audioCtx

function tts(text) {
  log('TTS', text, voiceEN)
  if (voiceEN) {
    const speak = new SpeechSynthesisUtterance(text)
    speak.voice = voiceEN
    speak.rate = .8
    speechSynthesis.speak(speak)
  }
}

body.addEventListener('pointerdown', ()=> {
  if (!audioCtx) {
    voiceEN = speechSynthesis && speechSynthesis.getVoices().find(v=>v.lang=='en-US')
    audioCtx = new AudioContext()//({sampleRate: 8000})
  }
})
