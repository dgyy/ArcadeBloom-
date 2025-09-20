function clamp(v: number, min: number, max: number) {
    return Math.max(Math.min(v, max), min);
}

type Event = string

const EVENT_FOCUS = 'on_focus'
const EVENT_FOCUS_STOP = 'on_focus_stop'


type Wave = (_: number) => number
type SoundData = [string, number, Wave]
type SongData = [Region, [number[], number], number]

const sin = (i: number) => Math.sin(i);
const saw = (i: number) => ((i % 6.28) - 3.14) / 6.28;
const sqr = (i: number) => clamp(Math.sin(i) * 1000, -1, 1);
const noise = () => Math.random()

const cri = (i: number, x: number, y: number) => sqr(i) < 0.5 ? x : y


let audioCtx: AudioContext, sampleRate: number
audioCtx = new AudioContext();
sampleRate = audioCtx.sampleRate;

let songs: SongData[] = [
  ['intro', [[0, 2, 3, 5, 7, 12], 1.3], 0]
]
let sounds: SoundData[] = [
  ['start', 0.737, (i: number) => 
    (i*=-999)&&0.6 * sin(i / (20 + sin(i/900 + sin(i / 440 + sin(i / 222))) - i / 400))],
  ['click', 0.737, (i: number) => 
    (i*=-999)&&0.6 * sin(i / (20 + sin(i/900 + sin(i / 440 + sin(i / 222))) - i / 400))],
  ['open', 0.93, (i: number) => 
    0.555 * sqr(30*sin(3*i)/(30-3*i)*sin(sqr(i))) + 0.455 * saw(2 / saw(3 * saw(4 / sqr(noise() * 3 * sin(0.2*i) +  6 / sin(i)*0.8))))
    ],
  //['nbuzz', 2.321, (i: number) => 
  //  ((sqr(i) < 0.3 * sin(i) ? -13 : 10) * saw(sqr(i/10)<0.5?30*i:50*i) + sin(i*30))]
]

type FxData = string

type Region = string


/* https://github.com/arikwex/infernal-sigil/blob/master/src/audio.js */
const make_fx = async (on_progress: (_: number) => void) => {

  async function _yield() {
    return new Promise((r) => setTimeout(r, 0));
  }

  function setProgress(p: number) {
    //emit('load-progress', p);
    on_progress(p)
  }

  const bus_on = (event: Event, fn: (_: any) => void) => {
  }

  let buffer_map: Record<string, AudioBuffer> = {}


  let activeMusicSource: AudioBufferSourceNode
  let musicFocusBuffer: AudioBuffer
  let musicRegionBuffers: Record<Region, AudioBuffer> = {}

  let musicDrumBuffer: AudioBuffer, drumBuffer: Float32Array
  let gainNodeA: GainNode, gainNodeB: GainNode
  let focusNode: AudioBufferSourceNode

  let usingA = true


  async function generate(duration: number, fn: (_: number) => number) {
    let audioBuffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
    let buffer = audioBuffer.getChannelData(0);
    let N = audioBuffer.length;
    for (let i = 0; i < N; i++) {
      buffer[i] = fn(i * 44100 / sampleRate) * (1 - i/N);
    }
    await _yield();
    return audioBuffer;
  }


  async function init() {

    let total = sounds.length + songs.length + 1

    for (let i in sounds) {
      let [name, duration, fn] = sounds[i]
      let samples = await generate(duration, fn);
      setProgress((Number(i) + 1) / total)
      buffer_map[name] = samples
    }


    musicDrumBuffer = audioCtx.createBuffer(1, sampleRate, sampleRate);
    drumBuffer = musicDrumBuffer.getChannelData(0);
    const W = 0.1 * sampleRate;
    for (let j = 0; j < W; j++) {
      drumBuffer[j] += 0.01 * (sin(j/(70 + j/300)) + Math.random() / 3) * (1 - j / W);
      drumBuffer[Math.floor(0.5 * sampleRate) + j] += 0.01 * Math.random() * (1 - j / W);
    }
    await _yield();

    musicFocusBuffer = audioCtx.createBuffer(1, sampleRate*3, sampleRate);
    const focusBuffer = musicFocusBuffer.getChannelData(0);
    for (let j = 0; j < sampleRate*3; j++) {
      const p = j / sampleRate;
      focusBuffer[j] = clamp(Math.sin(j/120) * (10 + sin(j/10000+p*p*p*4) * 10), -1, 1) * p / 50;
    }
    await _yield();
    //setProgress(0.35);

    for (let i in songs) {
      let [name, melody, seed] = songs[i]
      let res = await genericSongBuilder(melody, seed);
      setProgress((sounds.length + (Number(i) + 1)) / total)

      musicRegionBuffers[name] = res
    }

    bus_on(EVENT_FOCUS, () => {
      focusNode = audioCtx.createBufferSource();
      focusNode.buffer = musicFocusBuffer;
      focusNode.connect(audioCtx.destination);
      focusNode.start();
    });
    bus_on(EVENT_FOCUS_STOP, () => focusNode.stop());

    // crossfade gain nodes
    gainNodeA = new GainNode(audioCtx);
    gainNodeA.connect(audioCtx.destination);
    gainNodeB = new GainNode(audioCtx);
    gainNodeB.connect(audioCtx.destination);
  }


  async function genericSongBuilder([melodySignature, beat]: any, seed: number) {
    // Song builder
    const song = [];
    const drums = [];
    const noteLength = [4,2,0.5,3,4][seed];
    const noteSpace = [1,0.5,0.25,2,2][seed++];
    const bassNotes = [-15, -20, -19, -12];
    drums.push(
      [((seed * seed * 3) * 0.5) % 2, (seed) % 2],
      [((seed * seed * 3 + seed * 9) * 0.5) % 2, (seed+1) % 2],
      [((seed * seed * 2 + seed * 11) * 0.5) % 2, (seed+1) % 2],
    );
    //setProgress(prog1);
    for (let i = 0; i < 3; i++) {
      const o = i * 8;
      const q = [0,3,-5][i];
      for (let j = 0; j < 8; j++) {
        song.push([bassNotes[(seed*7+i*2+(j>>1)+j*j*3) % 4]+q, j+o, 6, 1]);
      }
      for (let j = 0; j < 8/noteSpace; j++) {
        if ((j + j*j + i+seed*3) % 7 < 4) {
          song.push([-3+q+melodySignature[(j + j*j*2 + i*i*2+seed) % melodySignature.length], j * noteSpace + o, noteLength, 2]);
        }
      }
    }

    // Song buffer writer
    const targetBuffer = audioCtx.createBuffer(1, sampleRate * 8 * 3 * beat, sampleRate);
    const buffer = targetBuffer.getChannelData(0);
    for (let i = 0; i < song.length; i++) {
      let note, start, duration, amp;
      [note, start, duration, amp] = song[i];

      // Write note
      const baseIdx = Math.floor(start * beat * sampleRate);
      const dur = duration * beat * sampleRate;
      for (let i = 0; i < dur; i++) {
        let v = 0;
        const envelope = i / dur;
        v+= (amp == 1) ?
          clamp(sin(i / (6*(2**(-note/12))*2 * 2) + sin(i/8000))*(Math.exp(-envelope*23) * 44 + 1),-1,1) * 2 :
          saw(i / (4.03 * 6*(2**(-note/12))*2)) * 7;
        buffer[baseIdx + i] += v * Math.min(envelope * Math.exp(-envelope * (10 + amp * 7)) * 100, 1) / 500;
      }
      await _yield();
      //setProgress(prog1 + (prog2 - prog1) * (i/song.length) * 0.8);
    }
    for (let q = 0; q < 44; q+=2) {
      for (let j = 0; j < drums.length; j++) {
        let type: number, drumStart: number;
        [drumStart, type] = drums[j];
        const noteOffset = Math.floor(0.5 * sampleRate * type);
        const startOffset = Math.floor((drumStart + q) * sampleRate * beat);
        for (let k = 0; k < sampleRate * 0.1; k++) {
          buffer[k + startOffset] += drumBuffer[k + noteOffset];
        }
      }
      await _yield();
      //setProgress(prog1 + (prog2 - prog1) * (0.8 + 0.2 * (q/44)));
    }
    return targetBuffer;
  }

  function play(audioBuffer: AudioBuffer) {
    let source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  };

  function onRegion(regionId?: Region) {
    if (!regionId) {
      music()
      return
    }
    let res = musicRegionBuffers[regionId]
    if (!res) {
      throw `nomusic ${regionId}`
    }
    music(musicRegionBuffers[regionId]);
  }

  function music(musicBuffer?: AudioBuffer) {
    let audioToStop = activeMusicSource;

    if (musicBuffer) {
      activeMusicSource = audioCtx.createBufferSource();
      activeMusicSource.buffer = musicBuffer;
      activeMusicSource.loop = true;
      activeMusicSource.connect(usingA ? gainNodeA : gainNodeB);
      activeMusicSource.start();
    }

    setTimeout(() => { audioToStop?.stop() }, 700);
    gainNodeA.gain.setTargetAtTime(usingA ? 1 : 0, audioCtx.currentTime, 0.5);
    gainNodeB.gain.setTargetAtTime(usingA ? 0 : 1, audioCtx.currentTime, 0.5);
    usingA = !usingA;
  }

  await init()

  return [
    (name: string) => play(buffer_map[name]),
    (region?: Region) => onRegion(region)
  ] as [(name: string) => void, (region?: Region) => void]

}


class Sound {

  static make = () => {
    let res = new Sound()
    return res
  }

  _loaded = false
  _fx?: (name: string) => void
  _music?: (region?: Region) => void

  get loaded() {
    return this._loaded
  }

  async load(on_progress: (p: number) => void) {
    if (this.loaded) {
      return
    }
    [this._fx, this._music] = await make_fx(on_progress)
    this._loaded = true
    on_progress(1)
  }

  _music_onoff = true
  _last_music?: Region

  get music_onoff() {
    return this._music_onoff
  }

  set music_onoff(v: boolean) {
    this._music_onoff = v
    if (!this._music_onoff) {
      this._music?.()
    } else {
      this._music?.(this._last_music)
    }
  }

  fx(name: string) {
    this._fx?.(name)
  }

  music(region: Region) {
    this._last_music = region
    if (!this.music_onoff) {
      return
    }
    this._music?.(region)
  }
}

export default Sound.make()
