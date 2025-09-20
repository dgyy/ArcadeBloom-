const sound = {
    audioCtx: new AudioContext()
}

sound.loadAudio = async function (path) {
    console.log('Will load ' + path)
    const response = await fetch(path)
    const audioData = await response.arrayBuffer()
    return await this.audioCtx.decodeAudioData(audioData)
}

sound.playAudio = function (buffer) {
    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(this.audioCtx.destination)
    source.start(0)
}
