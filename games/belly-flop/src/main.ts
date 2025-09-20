const m2f = (midi_note: number) => 440.0 * Math.pow(2, (midi_note - 69) / 12.0)

const C1 = 24

const [C4, G4] = [60, 67]
const [E4, B4] = [64, 71]
const [D4, A4] = [62, 69]

const A3 = 57
const F3 = 53

const ctve_down = 0

let ntes = [C4, G4, A4, E4, C4, F3, E4].map(_ => _ - 12 * ctve_down)
let pttns = ['333333', '21221', '1111', '2221', '33333']

let pttn = [...Array(300).keys()].flatMap(_ => pttns[_%pttns.length].split(''))

class Aa {

  _enable: boolean = false
  set enable(v: boolean) {
    this._enable = v
    if (!this._enable) {
      this._stop_music?.()
    } else {
      if (this._stop_music) {
        this.psfx2()
      }
    }
  }

  get enable() {
    return this._enable
  }

  static init() {

    const _pulse = (cx: AudioContext) => {
      const sqr_curve = new Float32Array(256)
      sqr_curve.fill(-1, 0, 128)
      sqr_curve.fill(1, 128, 256)

      const _cnst_curve = (value: number) => {
        let crve = new Float32Array(2)
        crve[0] = value
        crve[1] = value
        return crve
      }


      let tri = cx.createOscillator()
      tri.type = 'sawtooth'

      let sqr_shaper = cx.createWaveShaper()
      sqr_shaper.curve = sqr_curve

      let cnst_shaper = cx.createWaveShaper()
      cnst_shaper.curve = _cnst_curve(0.5)

      let wdth_param = cx.createGain()

      let gain = cx.createGain()


      tri.connect(cnst_shaper)
      cnst_shaper.connect(wdth_param)
      wdth_param.connect(sqr_shaper)
      tri.connect(sqr_shaper)
      sqr_shaper.connect(gain)

      //gain.connect(cx.destination)

      return {
        gain: gain,
        width: wdth_param.gain,
        osc: tri
      }
    }


    const ch4 = (cx: AudioContext) => {
      const n_curve = new Float32Array(256)
      for (let i = 0; i < 256; i++) {
        let v = Math.random() * i/256 + sigm(Math.random() * i * 256 + Math.sin(i / 256 * pi))
        n_curve.fill(v, i, i + 2)
      }



      let osc = cx.createOscillator()

      let n_shaper = cx.createWaveShaper()
      n_shaper.curve = n_curve

      let gain = cx.createGain()
      osc.connect(n_shaper)
      n_shaper.connect(gain)
      gain.connect(cx.destination)

      let ct = cx.currentTime
      let lfo2 = cx.createOscillator()
      let lfo = cx.createOscillator()
      let lfo_gain = cx.createGain()

      lfo.connect(lfo_gain)
      lfo2.connect(lfo_gain)
      lfo_gain.connect(gain.gain)


      lfo2.start()
      lfo.start()
      osc.start()

      osc.frequency.setValueAtTime(m2f(A3), ct)
      gain.gain.setValueAtTime(0.5, ct)
      lfo_gain.gain.setValueAtTime(1, ct)
      lfo.frequency.setValueAtTime(128, ct)
      lfo2.frequency.setValueAtTime(2, ct)
      lfo.frequency.linearRampToValueAtTime(0, ct + 1.2)
      lfo2.frequency.linearRampToValueAtTime(0, ct + 1.8)
      gain.gain.linearRampToValueAtTime(1, ct + 2.0)
      gain.gain.linearRampToValueAtTime(0, ct + 2.4)

      setTimeout(() => {
        osc.stop()
        lfo.stop()
        lfo2.stop()
        gain.disconnect()
      }, 2800)
    }

    const sfx = (cx: AudioContext) => {
      let ct = cx.currentTime
      let at = 0.06
      let dcy = 0.2
      let sus = 0.01
      let rels = 0.2
      let sst_lvl = 0.2
      let dcy_lvl = 0.18
      let slp = 0.3

      let n = 0.066
      ;[at, dcy, sus, rels] = [at, dcy, sus, rels].map(_ => _ / n)
      rels = Math.max(rels, 0.03 - (at + dcy + sus))

      
      let osc1 = _pulse(cx)
      let osc2 = _pulse(cx)

      osc1.osc.detune.setValueAtTime(0.4, ct)
      osc2.osc.detune.setValueAtTime(+1, ct)

      let lpf = cx.createBiquadFilter()
      lpf.type = 'lowpass'

      let hpf = cx.createBiquadFilter()
      hpf.type = 'highpass'

      let cmprsr = cx.createDynamicsCompressor()
      cmprsr.threshold.setValueAtTime(-30, ct)
      cmprsr.ratio.setValueAtTime(2, ct)
      cmprsr.attack.setValueAtTime(0.5, ct)
      cmprsr.release.setValueAtTime(0.5, ct)


      let gain1 = cx.createGain()
      let gain2 = cx.createGain()

      osc1.gain.connect(lpf)
      osc2.gain.connect(hpf)


      lpf.connect(gain1)
      hpf.connect(gain2)

      let gain = cx.createGain()

      let cmprsr_enabled = true

      if (cmprsr_enabled) {
        gain1.connect(cmprsr)
        gain2.connect(cmprsr)
        cmprsr.connect(gain)
      } else {
        gain1.connect(gain)
        gain2.connect(gain)
      }

      let l_panner = cx.createPanner()
      let r_panner = cx.createPanner()

      gain.connect(l_panner)
      gain.connect(r_panner)
      l_panner.connect(cx.destination)
      r_panner.connect(cx.destination)

      let lfo = cx.createOscillator()
      lfo.type = 'square'
      lfo.frequency.setValueAtTime(70, ct)

      let lfo_gain = cx.createGain()
      lfo_gain.gain.setValueAtTime(0.8, ct)
      lfo.connect(lfo_gain)
      //lfo_gain.connect(lpf.frequency)
      //lfo_gain.connect(osc1.width)
      //lfo_gain.connect(osc2.width)

      let lfo2 = _pulse(cx)
      lfo2.osc.frequency.setValueAtTime(m2f(E4), ct)
      lfo2.width.setValueAtTime(0.25, ct)
      let lfo2_gain = cx.createGain()
      lfo2_gain.gain.setValueAtTime(1, ct)
      lfo2.osc.connect(lfo2_gain)

      lfo2_gain.connect(gain.gain)

      lfo2.osc.start()
      lfo.start()

      osc1.osc.start()
      osc2.osc.start()

      const loop = (et: number) => {

        //let n_et = et + pttn.length * (at + dcy + sus + rels + slp)
        //setTimeout(() => loop(n_et), (n_et - et) * 1000)




        pttn.forEach((p, index) => {

          let t = et + index * (at + dcy + sus + rels + slp)
          
          let note = ntes[index%ntes.length]


          l_panner.positionY.setValueAtTime(-1, t)
          l_panner.positionY.linearRampToValueAtTime(0, t + at + dcy)
          r_panner.positionY.setValueAtTime(0, t)
          r_panner.positionY.setValueAtTime(0, t + at + dcy)
          r_panner.positionY.linearRampToValueAtTime(1, t + at + dcy + sus + rels)

          osc1.osc.frequency.setValueAtTime(m2f(note), t)
          osc2.osc.frequency.setValueAtTime(m2f(note + 3), t)

          osc1.width.setValueAtTime(0.05, t)
          osc2.width.setValueAtTime(0.05, t)
          osc1.width.linearRampToValueAtTime(0.5, t + at)
          osc2.width.linearRampToValueAtTime(0.5, t + at)
          osc1.width.linearRampToValueAtTime(0.2, t + at + dcy + sus)
          osc2.width.linearRampToValueAtTime(0.2, t + at + dcy + sus)

          lpf.Q.value = 1
          lpf.frequency.setValueAtTime(700, t)
          lpf.frequency.linearRampToValueAtTime(250, t + at)
          lpf.frequency.linearRampToValueAtTime(1400, t + at + dcy)
          lpf.frequency.linearRampToValueAtTime(1000, t + at + dcy + sus + rels)

          hpf.Q.value = 1
          hpf.frequency.setValueAtTime(1000, t)
          hpf.frequency.linearRampToValueAtTime(3000, t + at)
          hpf.frequency.linearRampToValueAtTime(8000, t + at + dcy + sus)
          hpf.frequency.linearRampToValueAtTime(1000, t + at + dcy + sus + rels)

          gain1.gain.setValueAtTime(epsi, t)
          gain2.gain.setValueAtTime(epsi, t)

          if (p === '1' || p === '3') {
            gain1.gain.linearRampToValueAtTime(sst_lvl + dcy_lvl, t + at)
            gain1.gain.linearRampToValueAtTime(dcy_lvl, t + at + dcy)
            if (sus > 0) {
              gain1.gain.linearRampToValueAtTime(sst_lvl, t + at + dcy + sus)
            }
            gain1.gain.linearRampToValueAtTime(epsi, t + at + dcy + sus + rels)
            if (slp > 0) {
              gain1.gain.setValueAtTime(epsi, t + at + dcy + sus + rels + slp)
            }
          } 
          if (p === '2' || p === '3') {
            gain2.gain.linearRampToValueAtTime(sst_lvl + dcy_lvl, t + at)
            gain2.gain.exponentialRampToValueAtTime(dcy_lvl, t + at + dcy)
            if (sus > 0) {
              gain2.gain.exponentialRampToValueAtTime(sst_lvl, t + at + dcy + sus)
            }
            gain2.gain.linearRampToValueAtTime(epsi, t + at + dcy + sus + rels)
            if (slp > 0) {
              gain2.gain.setValueAtTime(epsi, t + at + dcy + sus + rels + slp)
            }
          }
        })

      }
      loop(ct)

      return () => {
        osc1.osc.stop()
        osc2.osc.stop()
        l_panner.disconnect()
        r_panner.disconnect()
      }
    }

    let sfx_cx: AudioContext, msc_cx: AudioContext

    const init = () => { 
      sfx_cx = new AudioContext() 
      msc_cx = new AudioContext() 
    }

    let res = new Aa(
      () => init(),
      () => sfx(sfx_cx), 
      () => ch4(msc_cx))

    return res
  }

  constructor(
    readonly ccx: () => void,
    readonly sfx2: () => () => void,
    readonly sfx3: () => void) {}

  psfx2() {
    if (!this.enable) {
      return
    }

    this._stop_music = this.sfx2()
  }

  cool_sfx: number = 0
  psfx3() {
    if (!this.enable) {
      return
    }
    if (this.cool_sfx === 0) {
      this.cool_sfx = 3
      this.sfx3()
    }
  }


  _stop_music?: () => void
}


/* https://chat.openai.com/share/1fcd05cf-4e17-47ed-9143-8380d46b818b */
// Create a Proxy around the Graphics instance
const _gProxy = (g: Gg) => new Proxy(g, {
    // @ts-ignore
    drawEnabled: true,
    
    get(target, prop) {
        if (prop === 'if') {
            return (condition: boolean) => {

                // @ts-ignore
                this.drawEnabled = condition;
            };

          } else if (prop === 'else') {

            return () => {
              // @ts-ignore
              this.drawEnabled = !this.drawEnabled
            }
                // @ts-ignore
        } else if (typeof target[prop] === 'function') {
            return (...args: any[]) => {
                // @ts-ignore
                if (this.drawEnabled) {
                    // @ts-ignore
                    return target[prop](...args);
                }
            };
        } else {
            // @ts-ignore
            return target[prop];
        }
    }
});



class Mm {
  static init(c: HTMLCanvasElement) {

    let bounds = c.getBoundingClientRect()

    window.addEventListener('resize', () => {
      bounds = c.getBoundingClientRect()
    })

    const ev_p = (e: MouseEvent | TouchEvent): [number, number] => {
      if (e instanceof MouseEvent) {
        return [e.clientX, e.clientY]
      } else {
        return [e.touches[0].clientX, e.touches[0].clientY]
      }
    }

    const with_b = (p: [number, number]): [number, number] => {
      return [(p[0] - bounds.left) / bounds.width * w, (p[1] - bounds.top) / bounds.height * h]
    }

    let res = new Mm()

    const on_down = (e: MouseEvent | TouchEvent) => {
      res.on_down(with_b(ev_p(e)))
    }
    const on_move = (e: MouseEvent | TouchEvent) => {
      res.on_move(with_b(ev_p(e)))
    }
    const on_up = (e: MouseEvent | TouchEvent) => {
      res.on_up(with_b(ev_p(e)))
    }

    window.addEventListener('mousedown', on_down)
    window.addEventListener('touchstart', on_down)
    window.addEventListener('mousemove', on_move)
    window.addEventListener('touchmove', on_move)
    window.addEventListener('mouseup', on_up)
    window.addEventListener('touchend', on_up)

    return res
  }

  upp(x: number, y: number, d?: number) {
    if (this.up_on(x, y, d)) {
      return this.just_up
    }
  }



  downp(x: number, y: number, d?: number) {
    if (this.down_on(x, y, d)) {
      return this.just_down
    }
  }


  up_on(x: number, y: number, d: number = sml_distance) {
    if (this.last_down_p) {
      return calc_dist(x, y, ...this.last_down_p) <= d
    }
  }

  down_on(x: number, y: number, d: number = sml_distance) {
    if (this.down_p) {
      return calc_dist(x, y, ...this.down_p) <= d
    }
  }

  hovering(x: number, y: number, d: number = sml_distance) {
    if (this.move_p) {
      return calc_dist(x, y, ...this.move_p) <= d
    }
    return false
  }

  move_p?: [number, number]
  down_p?: [number, number]
  last_up_p?: [number, number]
  last_down_p?: [number, number]
  just_down: boolean = false
  just_up: boolean = false

  on_move(e: [number, number]) {
    this.move_p = e
  }

  on_down(e: [number, number]) {
    this.just_down = true
    this.down_p = e
  }

  on_up(e: [number, number]) {
    this.last_up_p = e
    this.last_down_p = this.down_p
    this.down_p = undefined
    this.just_up = true
  }

  clear_frame() {
    this.just_down = false
    this.just_up = false
  }
}

class Gg {
  else() {
  //  throw new Error("Method not implemented.");
  }

  if(_scn1: boolean) {
  //  throw new Error("Method not implemented.");
  }

  static init(e: HTMLElement): [Gg, HTMLCanvasElement] {
    let c = document.createElement('canvas');
    c.width = w
    c.height = h

    let cx = c.getContext('2d')!

    e.appendChild(c)

    return [new Gg(cx), c]
  }

  constructor(readonly cx: CanvasRenderingContext2D) {}

  shk_bg(x: number, y: number, a: number, sx: number, sy: number) {
    this.cx.save()
    this.cx.translate(hw, hh)
    this.cx.translate(x, y)
    this.cx.rotate(a)
    this.cx.scale(sx, sy)
    this.cx.translate(-hw, -hh)
  }

  shk_fi() {
    this.cx.restore()
  }

  sc(c: string) {
    this.cx.strokeStyle = c
  }

  fc(c: string) {
    this.cx.fillStyle = c
  }
  sml3() {
    this.cx.font = '52px Courier New'
  }
  sml2() {
    this.cx.font = '72px Courier New'
  }
  sml() {
    this.cx.font = '96px Courier New'
  }
  lrg() {
    this.cx.font = '148px Courier New'
  }
  str(t: string, x: number, y: number) {
    this.cx.textAlign = 'center'
    this.cx.textBaseline = 'top'
    this.cx.fillText(t, x, y)
  }

  clin(x: number, y: number, w: number) {
    this.cx.moveTo(x - w, y)
    this.cx.lineTo(x + w, y)
  }

  dot(x: number, y: number, r: number = 100) {
    this.cx.arc(x, y, r, 0, pi2)
  }

  bp(w: number = 8) {
    this.cx.lineWidth = w
    this.cx.beginPath()
  }

  sbp() {
    this.cx.lineWidth = 4
    this.cx.beginPath()
  }

  ep() {
    this.cx.stroke()
  }

  m2(x: number, y: number) {
    this.cx.moveTo(x, y)
  }

  l2(x: number, y: number) {
    this.cx.lineTo(x, y)
  }


  fr(x: number, y: number, w: number, h: number) {
    this.cx.fillRect(x, y, w, h)
  }

  fr_c(x: number, y: number, w: number, h: number) {
    this.cx.fillRect(x - w/2, y - h/2, w, h)
  }

  sr(w: number, h: number) {
    this.cx.strokeRect(-w/2, -h/2, w, h)
  }

  save() {
    this.cx.save()
  }

  rsto() {
    this.cx.restore()
  }

  rotate(r: number, w: number = 0, h: number = 0) {
    this.cx.translate(w, h)
    this.cx.rotate(r)
  }

}


const w = 1920
const h = 1080
const hw = w / 2
const hh = h / 2
const h2w = hw / 2
const h2h = hw / 2
const h3w = hw / 3
const h3h = hh / 3
const h4w = hw / 4
const h4h = hh / 4
const h8w = hw / 8
const h8h = hh / 8

const h2p8w = h2w + h8w


const bgn = '#1e1b22'
const red = '#5d1320'
const prpl = '#7431e3'
const lprpl = '#e331da'
const lyllw = '#e3cd31'
const yllw = '#dacf80'
const grn = '#60e331'
const blu = '#319ae3'
const lght = '#d7d9db'
const plp = '#942890'

/* https://chat.openai.com/share/f4ff1e1b-f9e4-468f-8b7d-1c05ddd20dde */
function adjustSaturation(originalColorHex: string, saturationChange: number) {
    // Convert the original color to an RGBA format
    const r = parseInt(originalColorHex.substring(1, 3), 16);
    const g = parseInt(originalColorHex.substring(3, 5), 16);
    const b = parseInt(originalColorHex.substring(5, 7), 16);
    const a = 1; // Alpha channel (fully opaque)

    // Calculate the adjusted color by shifting the RGB values
    const adjustedR = Math.min(255, Math.max(0, Math.round(r + (r * saturationChange))));
    const adjustedG = Math.min(255, Math.max(0, Math.round(g + (g * saturationChange))));
    const adjustedB = Math.min(255, Math.max(0, Math.round(b + (b * saturationChange))));

    // Create the adjusted color in RGBA format
    const adjustedColor = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${a})`;

    return adjustedColor;
}

const _sat = (c: string) => adjustSaturation(c, 0.8)
const _l_sat = (c: string) => adjustSaturation(c, -0.8)

const l_bgn = _l_sat(bgn)
const l_red = _l_sat(red)
const l_prpl = _l_sat(prpl)
const l_lprpl = _l_sat(lprpl)
const l_lyllw = _l_sat(lyllw)
const l_yllw = _l_sat(yllw)
const l_grn = _l_sat(grn)
const l_blu = _l_sat(blu)
const l_lght = _l_sat(lght)
const l_plp = _l_sat(plp)

const m_bgn = _sat(bgn)
const m_red = _sat(red)
const m_prpl = _sat(prpl)
const m_lprpl = _sat(lprpl)
const m_lyllw = _sat(lyllw)
const m_yllw = _sat(yllw)
const m_grn = _sat(grn)
const m_blu = _sat(blu)
const m_lght = _sat(lght)
const m_plp = _sat(plp)



const gor = 1.61803;
const epsi = 1e-4;

const pi = Math.PI
const pi2 = pi * 2
const hp = pi / 2
const h3p = pi / 3
const hhp = pi / 4
const h8p = pi / 8
const h16p = pi / 16
const h64p = pi / 64


let dt = 16 
let life = dt

function app(e: HTMLElement) {

  let [_g, c] = Gg.init(e)
  let m = Mm.init(c)
  let g = _gProxy(_g)
  let adio = Aa.init()
  let ss = Ss.init()

  let last_t: number | undefined;
  window.requestAnimationFrame(step)
  function step(t: number) {
    loop(m, g, adio, ss)


    dt = Math.min(16, t - (last_t ?? (t - 16)))
    last_t = t
    life += dt
    window.requestAnimationFrame(step)
  }
}

function sum(a: number[]) {
  return a.reduce((a, b) => a + b, 0)
}

const juicyNoise = (x: number) => {
    const sinValue = Math.sin(x * 10);
    const cosValue = Math.cos(x * 20);
    return (sinValue + cosValue) / 2;
};


const sigm = (z: number) => 1 / (1 + Math.exp(-z))
const lin = (x: number) => x
const sin = (x: number) => Math.sin(x)
const cos = (x: number) => Math.cos(x)
const sqr = (x: number) => x < 0.5 ? 0 : 1
const saw = (x: number) => x % 0.5

const _mod_13 = (f: (x: number) => number) => (x: number) => f(x % 13 / 13)

const e_lin = _mod_13((x: number) => x)
const e_sin = _mod_13((x: number) => sin(x * pi2))
const e_cos = _mod_13((x: number) => cos(x * pi2))
const e_sqr = _mod_13((x: number) => sqr(x))
const e_saw = _mod_13((x: number) => saw(x))


const hi = false
const lo = false
const hi_lo = <A>(h: A, m: A, l: A) => hi ? h : lo ? l : m

const rnd19 = () => Math.random() * 19

const _rnd_13 = <A>(f: (v: number) => A) => f(rnd19() % 13 / 13)

const fls = <A>(h: A, l: A) => _rnd_13((v: number) => (life * 0.000003 % v) / (v * 1.2) < 0.5 ? h : l)
const ffls = <A>(h: A, l: A) => _rnd_13((v: number) => (life * 0.0003 % v) / (v * 1.2) < 0.5 ? h : l)


const e_sex = _mod_13((x: number) => fls(x, x * 2) * 0.1 + e_sin(x) * 0.3 + 0.7 * e_sin(x * x * pi2 * pi2))

const e_nine = _mod_13((x: number) => fls(x, x * 2) * 0.1 + e_sin(x) * 0.3 + 0.7 * e_sin(x * x * pi2 * pi2))
const e_brz = _mod_13((x: number) => _rnd_13((v: number) => 
Math.abs(
  sin(cos(x * 0.2) * 20 % 13 + 
  sin(v * 0.002) * 13 % 7))))

const e = 2.718281

type PpC = {
  A: number,
  ω: number,
  φ: number,
  B: number,
  C: number,
  R: number
}

/* https://chat.openai.com/share/6df1d294-cc36-4d67-a20f-07ad49593226 */
class Pp {

  pp: number = 0

  constructor(public cfg: PpC) {}

  P = (t: number) => {
    let { A, ω, φ, B, C, R } = this.cfg

    return A * cos(ω*t + φ) + B * t + C * e^(R*t)
  }
}

const PpP = new Pp({
  A: epsi * 4,
  ω: pi,
  φ: 0,
  B: epsi,
  C: 1,
  R: epsi * 6,
})

const _one = () => {
  let on = true
  return (x: number) => {
    if (x <= epsi) {
      on = false
    }

    return on
  }
}

const _cap1 = () => {
  let capped = false
  return (x: number) => {
    if (x > 1 - epsi) {
      capped = true
    }

    return (capped && 1) || x
  }
}

const caps_1 = [...Array(20).keys()].map(_ => _cap1())

const p_nt_lod = _one()

const _tr = (dur: number = 1000) => {
  let e = 0
  return (b: number) => {
    e += dt

    let t = Math.min(1, e / dur)
    return lerp(b, t)
  }
}


const lerp = (b: number, t: number) => {
  return b * t
}

const _capa = (f: number) => {
  let t = 0;

  return (v: boolean) => {
    if (v) {
      t = t == 0 ? f : t
    } else {
      t = Math.max(0, t-1)
    }
    return t > 0
  }
}

const s_capa = _capa(13 * 16)
const o_capa = _capa(1)

const sh_capa = _capa(13 * 2.5)

const ud_capa = _capa(13 * 6)

const dest = [0.001, 0.001, 0.001, 0.001, 0.001]

const o_fns = [
  () => Math.abs(e_sex(life * sigm(dest[0]))) < sigm(dest[0]) * 0.001,
  () => Math.abs(e_lin(life * sigm(dest[1]))) < sigm(dest[1]) * 0.001,
  () => Math.abs(e_sin(life * sigm(dest[2]))) < sigm(dest[2]) * 0.001,
  () => Math.abs(e_nine(life * sigm(dest[3]))) < sigm(dest[3]) * 0.001,
  () => Math.abs(e_cos(life * sigm(dest[4]))) < sigm(dest[4]) * 0.0001
]


const o_h_capas = [
  _capa(1),
  _capa(1),
  _capa(1),
  _capa(1),
  _capa(1),
  _capa(1),
  _capa(1),
  _capa(1),
]


const tr_ = _tr()

let scn = 'ntr'

let first_update = false
let first_interaction = false

let first_welcome = 1
let first_in_play = false

// DEBUG
if (false)
{
  scn = 'play'
  first_interaction = true
  first_welcome = 0
}

if (false)
{
  scn = 'fin'
  first_interaction = true
  first_welcome = 0
}


const pom = `
Have A ponderful day in the middle east, in the middle ages.

Dark windy shadows /bc no sun or numbers.
Oh numbers /w there don't get me /w
..
Numbers just d/t add up.

So stop looking at /m numbers,
And start looking at my shadow.


Wind fell through cracks.
/T dice /vs /T plop
Yes, and yes they fought.
Wind get's to dice\\y sometimes.
Sometime\s it plop\\s though.


Here\ have a plant, it's root based.
The root's span acroos \\t display.
The root's are old \\a wise.
Yes, and yes it takes a \\l \\t \\t \\e.
For a A looong looooooong time.
A very looong time. ok.
That's why they called the root\\s

Good, have a \\root now.
\\a always be planking.
maybe you can overrule the shadows.

            /The shizwhiz. ///


`

const txts = pom.split('\n')


let hack_t = 0

function loop(m: Mm, g: Gg, adio: Aa, ss: Ss) {

  let a = 38, a3 = a * 3, a8 = a * 8


  let u_angle = sin(life * 0.003) * h64p
  let u_s_f40 = sin(life * 0.02) * h64p
  let w_angle = sin(life * 0.003) * hp


  if (!first_update) {
    first_update = true

  }

  if (!first_interaction) {
    if (m.down_p) {
      adio.ccx()
      first_interaction = true
      adio.enable = true
      first_welcome = -3

      adio.psfx3()
    }
  } else {
    if (adio) {
      let d_audio = m.downp(0, 0, 360)
      if (d_audio) {
        adio.enable = !adio.enable
      }
  
      adio.cool_sfx = Math.max(0, adio.cool_sfx - dt / 1000)
    }
  }

  if (scn === 'ntr' && first_welcome == 0) {

    let click = m.downp(0, 0, 1920)

    if (click) {
      life = dt
      scn = 'play'

      adio.psfx2()
    }

  }
  if (first_welcome < 0) {
    first_welcome = Math.min(0, first_welcome + dt / 1000)
  }

  let strc = false, c_strc = false, o_strc = false


  let [btn_x, btn_y] = [hw - h2w - h4w, hh + 2 * h3h]
  let hovering2 = m.hovering(btn_x, btn_y, 360)
  let hovering = m.hovering(btn_x, btn_y, 120)
  let color = hovering ? red : yllw

  let down_on = m.down_on(btn_x, btn_y, 120)
  let upp = ud_capa(!!m.upp(btn_x, btn_y, 120))



if (scn === 'play') {



  let x = ss.mdl.findIndex(_ => _ === 1)
  if (x !== -1) {
    dest[x] += Math.min(...dest)
  }

  let luck = 8 - Math.abs(Math.sin(life * 0.001)) * 3
  let dtroy = dest.reduce((a, b) => a + b)

  if (dtroy > luck) {
    dest[dest.indexOf(Math.max(...dest))] = 0.00001
    PpP.pp =  Math.sqrt(Math.sqrt(PpP.pp))
    life = Math.sqrt(Math.sqrt(life))
  } else {
    dest[dest.indexOf(Math.min(...dest))] += 0.000001
  }

  let ppp = PpP.P(life + 30)

  PpP.pp = PpP.P(life)

  strc = Math.abs(ppp - PpP.pp) > 6
  if (ppp > 80) {

    strc = true
  }




  c_strc = s_capa(strc)
  o_strc = o_capa(strc)

  if (o_strc) {
    adio?.psfx3()
  }




  for (let x of ss.xs) {
    x[2] += e_lin(life * 0.002) * 10 + e_sex(life * 0.002) * 5
  }
  ss.xs = ss.xs.filter(_ => _[2] < h)

  if (ss.ps.length > PpP.pp) {
    if (ss.idps.length > 0) {
      let xx = ss.ps.splice(ss.idps.pop()!, 1)

      ss.xs.push(...xx)
      ss.xs.sort((a, b) => a[1] - b[1])
    }
  }

  if (ss.ps.length < PpP.pp) {
    ss.ps.push([0, a8 + a3 * 2 + e_sex(life) * hw, a3 + a3 * 2 + e_sin(life * 0.02) * 100])
  }

  if (ss.idps.length < PpP.pp / 2) {
    if (ss.ps.length > 0) {
      ss.idps.push(Math.floor(e_sex(life * 0.2) * ss.ps.length))
    }
  }

  if (down_on) {
    for (let i = 0; i < e_lin(life * 0.002) * 6; i++) {
      ss.mdl[i] = Math.abs(Math.ceil(e_sex(life * 0.002 + i * e_sin(i * life * 0.003) * 0.3) * 9))
    }
    hack_t = 0

  } else if (upp) {
    hack_t += dt / 1000
    for (let i = 0; i < e_lin(hack_t * 0.02) * 6000; i++) {
      ss.mdl[i] = Math.abs(Math.ceil(e_sex(hack_t * 0.02 + i) * 9))
    }
  } else {
    if (Math.abs(e_sin(life * 0.02) + e_sin(life * 0.01)) < 10 * Math.sin(u_angle) ) {
      let i = ss.mdl.findIndex(_ => e_lin(life * 100) < 0.1 && _ === 0)
      if (i !== -1) {
        ss.mdl[i] = (Math.floor(Math.abs(e_sin(life * 0.3)) * 7) % 3) + 2
      }
      ss.mdl.reverse()
    }

    if (e_sin(life * 0.02) + e_sin(life * 0.01) < 0.05) {
      let r = ss.mdl.findIndex(_ => _ === 1)
      let i = ss.mdl.findIndex(_ => e_lin(life * 7) < 0.1 && _ > 1)
      if (i !== -1) {
        ss.mdl[r] = 0
        ss.mdl[i] = 1
      }
    }
  }



  /* hands */

  for (let i = 0; i < 5; i++) {
    if (o_h_capas[i](o_fns[i]())) {

      ss.hnd[i] = (ss.hnd[i] + 1) % 5
    }
  }

}

  let str_shake = sh_capa(strc)
  g.if(str_shake)
  g.shk_bg(e_sin(life * 0.02) * 5, e_cos(life * 0.002) * 3, 
           e_sex(life * 0.001) * h64p - e_brz(u_angle * 10) * h64p, 
           1 + e_saw(life * e_lin(life * 0.18)) * 0.2, 1 + e_saw(life * e_lin(life * 0.24)) * 0.2)
  g.if(true)

  /* Background */

 g.if(true) /* bg always */

  g.fc(bgn)
  g.fr(0, 0, w, h)


  /* wind bg */
  g.sc(l_grn)
  g.bp()
  for (let i = 0; i < 80; i+=7 - e_lin(life * 0.002) * 5) {
    let [x, y] = [e_lin(life * 0.01) * w + e_lin(life * 0.002 * e_sin(i)) * w, e_sin(i / 80 * life * 0.0002) * hh + e_sex(life * 0.02 * i/ 80) * e_brz(life * 0.02 * i/ 80) * a + (i / 80)  * hh]

    g.m2(x, y)
    g.l2(x + a, y)

  }
  g.ep()

  if (scn == 'play') {

  let i = Math.floor(e_lin(life * 0.0002) * txts.length)
  g.fc(m_bgn)
  g.fr(0, hh - a, w, a3)
  g.fc(l_blu)
  g.fr(0, hh - a, (i / txts.length) * w, a3)
  g.fc(m_yllw)
  g.sml3()
  g.str(txts[i], hw, hh)
  
  if (i + 1 >= txts.length) {
    scn = 'fin'
    life = dt
  }
  }

  if (scn == 'fin') {

    g.fc(m_lght)
    g.sml3()
    for (let i = 0; i < txts.length; i++) {
      g.str(txts[i], hw, e_sin(pi2 + life * 0.0001) * h * 2 + hh + i * 80)
    }
  }

  let h_audio = m.hovering(0, 0, 360)

  g.fc(h_audio ? m_red : l_bgn)
  g.sml3()
  g.if(!adio?.enable)
  g.str("audio off", a3 * 2, a)
  g.else()
  g.str("audio on", a3 * 2, a)
  g.if(true)

  g.sc(yllw)
  g.bp()
  g.dot(hw + a8 - a3, a3, 60)
  g.m2(hw + a8 - a3, a3)
  g.ep()

  for (let j = 0; j < 10; j++) {
    g.if(e_sin(j * life) * 0.002 < j * 0.002)
    g.save()
    g.bp()
    g.sc(m_lyllw)
    g.rotate(-hp * 0.5 + j * 100, hw + a8 - a3, a3)
    g.m2(0, 0)
    for (let i = 0; i < e_lin(life * 0.008) * 13; i++) {
      g.l2(sin(life * 0.002 + (i / 13) * pi2) * sin(life * 0.002 + (i / 13) * pi) * 50 - j * 2,
       lin((i / 13) * pi) * 100 + ((8 - j) * 20))
    }
    g.ep()
    g.rsto()
  }




  let r = 40
  g.sc(l_lyllw)
  g.bp(4)
  for (let i = 0; i < 14; i++) {
    g.dot(500 + e_sin(i+u_angle * u_angle * 3000) * r, 600 + e_cos(-i/2) * r * 2, 10)
  }
  g.ep()



  g.sc(l_blu)
  g.bp(4)
  for (let i = 0; i < 14; i++) {
    g.dot(hw + e_cos(i) * e_cos(u_angle * 10) * r, hh + e_sin(i) * u_angle * 10 * r * 2, 10)
  }
  g.ep()



 if (first_interaction && first_welcome === 0) {
  if (scn === 'ntr') {
    g.if(true)
    g.sml()
    g.fc(yllw)
    g.if(fls(true, false))
    g.str('goo;d click to start', hw, hh * 1.5)
    g.else()
    g.str('good; click to start', hw, hh * 1.5)
  }
 } else {
   g.lrg()
   g.fc(ffls(m_red, l_red))
   g.str('lower your volume', hw, hh)
 }


if (scn == 'ntr') {
  let ld = e_lin(life * 0.007)
  g.sc(bgn)
  g.bp(2)
  g.fc(l_bgn)
  g.fr_c(hw, hh, 100 + ld * 1920, 30)
  g.m2(hw, hh)
  g.l2(hw + 100, hh)
  g.ep()
}
    

if (scn === 'play') {


  g.if(true)
  g.sc(_l_sat('#cdcddc'))
  g.bp(3)
  for (let i = 1; i < 13; i++) {
    g.dot(100 + e_sqr(i + life * 0.003) * 100, 0 + e_lin(i) * 1080, 8)
  }
  g.ep()

  g.sc(_l_sat('#cdcddc'))
  g.bp(3)
  for (let i = 1; i < 13; i++) {
    g.dot(w - a8 - a3 + e_sex(i + life * 0.003) * 100, 0 + e_lin(i) * 1080, 8)
  }
  g.ep()

  g.sc(_l_sat('#cdcddc'))
  g.bp(3)
  for (let i = 1; i < 13; i++) {
    g.dot(hw - a3 + e_nine(- i + life * 0.003) * 100, 0 + e_lin(i) * 1080, 8)
  }
  g.ep()


  g.if(true)
  g.sc(l_bgn)
  g.bp()
  for (let i = 0; i < ss.xs.length; i++) {
    let [_r, px, py] = ss.xs[i]
    if (i == 0) {
      g.m2(px, py)
    } else {
      g.l2(px, py)
    }
  }
  g.ep()




  /* Foreground */

  g.if(true)
  const hi_lo_red = hi_lo(m_red, red, l_red)

  g.sc(hi_lo_red)
  g.bp()


  g.m2(a, a)
  g.l2(w - a8, a)
  g.l2(w - a8, hh + a3)
  g.l2(a, hh + a3)
  g.l2(a, a)

  g.m2(a, hh + a3)
  g.l2(a, h - a)
  g.l2(w - a8, h - a)
  g.l2(w - a8, hh + a3)

  g.ep()


  /* dice button */

  g.sml2()
  g.fc(yllw)
  g.sc(color)
  g.save()
  g.rotate(h8p + u_angle, btn_x, btn_y)
  g.sr(300, 100)
  if (hovering) {
    if (upp) {
      g.fc(m_red)
      g.str('D', -70 + e_sex(life) * 10, ffls(e_sin(life), -e_lin(life) * 2) * e * 3 + -22)
      g.fc(fls(m_red, l_red))
      g.str('I', -20 + e_nine(life) * 10, e_sin(life) * e * 4 + -14)
      g.fc(m_red)
      g.str('C', 20 + e_sex(life) * 10, ffls(e_sin(life), -e_lin(life) * 2) * e * 2 + -24)
      g.fc(fls(l_red, m_red))
      g.str('E', 50 + e_nine(life) * 10, e_sin(life) * e * 3 + -12)
    } else if (down_on) {
      g.fc(l_red)
      g.str('d', -70 + u_s_f40 * 10, -22)
      g.str('i', -20 + u_s_f40 * 10, -14)
      g.str('c', 20 + u_s_f40 * 10, -24)
      g.str('e', 50 + u_s_f40 * 10, -12)
    } else {
    g.str('d', -140 + u_s_f40 * 40, -30)
    g.str('i', -50 + u_s_f40 * 40, -30)
    g.str('c', 50 + u_s_f40 * 40, -30)
    g.str('e', 140 + u_s_f40 * 40, -30)
    }
  } else if (hovering2) {
    g.fc(m_yllw)
    g.str('dice', 0, 0)
  } else {
    g.str('dice', 0, -30)
  }
  g.rsto()

  g.fc(l_yllw)
  g.sc(fls(l_yllw, yllw))
  g.save()
  g.rotate(-h8p + u_angle, hw + h3w + h8w, hh + 2 * h3h)
  g.sr(300, 100)
  g.str('plow', 0, 0)
  g.rsto()


  g.fc(bgn)
  g.save()
  g.rotate(0, hw - a8 - a3, hh + a)
  g.fr(0, 0, 600, 100)
  g.rsto()


  g.sc(l_grn)
  g.save()
  g.rotate(0, hw - a3, hh + a3)
  g.sr(513, 178)
  g.rsto()


  g.lrg()
  for (let i = 0; i < ss.hnd.length; i++) {
    g.if(ss.mdl[i] === 1)
      g.bp()
      g.fc(m_grn)
      g.sc(m_grn)
      g.str(`${ss.hnd[i]}`, hw - a3 * (3 - i), hh + 30)
      g.clin(    hw - a3 * (3 - i), hh + 30 + 150, 20)
      g.ep()
    g.if(ss.mdl[i] == 0)
      g.bp()
      g.fc(l_grn)
      g.sc(e_nine(life) < 0.8 ? l_grn : yllw)
      g.str(`${ss.hnd[i]}`, hw - a3 * (3 - i), hh + 30 + e_saw(life) * Math.abs(20 * e_sex(w_angle))* Math.abs(e_sin(w_angle)) * 50)
      g.clin(    hw - a3 * (3 - i), hh + 30 + 150, 20)
      g.ep()
    g.if(ss.mdl[i] > 1)
      g.fc(red)
      g.sc(red)
      g.str(`${ss.mdl[i]}`, hw - a3 * (3 - i), hh + 30 + e_saw(life) * Math.abs(20 * e_sex(w_angle))* Math.abs(e_sin(w_angle)) * 50)
  }
  g.if(true)

  /* wind fg */

  g.sc(m_lght)
  g.bp()
  for (let i = 0; i < 80; i+=1 + e_lin(life * 0.002) * 5) {
    let [x, y] = [e_lin(life * 0.01) * w + e_lin(life * 0.002 * e_sin(i)) * w, e_sin(i / 80 * life * 0.0002) * hh + e_sex(life * 0.02 * i/ 80) * e_brz(life * 0.02 * i/ 80) * a + (i / 80)  * hh]

    g.m2(x, y)
    g.l2(x + a, y)

  }
  g.ep()


  /* plants */

  for (let i = 0; i < ss.ps.length; i++) {
    let [r, px, py] = ss.ps[i]

    let [c1, c2, c3] = [grn, prpl, lprpl]

    if (ss.idps.includes(i)) {
      r += e_sin(u_angle + life * 0.002)
      c1 = l_grn
      c2 = lprpl
      c3 = l_lprpl
    }

    g.save()
    g.rotate(r + pi + -u_angle * 20 * 0.25, a + 100 + px, a + py)

    g.sc(c1)
    g.bp()
    for (let i = 0; i < 10; i++) {
      let angl = (i / 10) * pi2
      let dr = 6 + Math.sin(angl * 0.1 + u_angle) * (100 + u_angle)
      let ix = 0 + dr * Math.cos(angl)
      let iy = 0 + dr * Math.sin(angl)
      if (i == 0) {
        g.m2(ix, iy)
      } else {
        g.l2(ix, iy)
      }
    }
    g.ep()

    g.sc(c2)

    g.bp()
    g.m2(0, 0)
    g.l2(0, 130)
    g.ep()


    g.sc(c3)
    g.bp()
    g.dot(0, 130, 13)
    g.ep()

    g.rsto()

  }

  /* light */
  g.if(c_strc)
  g.save()
  g.bp()
  g.sc(lght)
  g.rotate(-hp * 0.5, a + 100, a)
  g.m2(0, 0)
  for (let i = 0; i < - Math.min(10, -e_nine(life * 0.008) * 8 - Math.abs(e_sin(life * 0.003) * 7)); i++) {
    g.l2(e_saw(i * 250) * 130 + e_nine((i/13) * 200 + life * 0.0001) * 10, e_sin(i * 0.3) * 540)
  }
  g.ep()
  g.rsto()


  g.if(true) /* always */

  g.fc(m_blu)
  g.lrg()
  g.str('belly basket', hw, 0)

  let tm = 0.5
  let lm = 1.2
  let sp = 1.3

  let fs = ss.hnd
  let ccs = [m_blu, m_yllw, m_grn, m_prpl, prpl]
  for (let i = 0; i < 5; i++) {
    g.fc(ccs[i])
    g.fr(w - a8 + 5, a * 2 + a3 * 1.25 * i, e * 13, (fs[i] / 5) * (a3 * 1.25))
  }

  g.fc(blu)
  g.sml()
  g.str('wind', w - a3 * lm, a3 * sp - a3 * tm)
  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp - a3 * tm - 20, a8 - 15, 5)
  g.fr(w - a8 + 5, a3 * sp - a3 * tm + a3, a8 - 15, 5)

  g.fr(w - a8 + 5 + a8 - 15, a3 * sp - a3 * tm - 20, 5, a3 * 8 - 32)

  g.fc(yllw)
  g.sml()
  g.str('sun', w - a3 * lm, a3 * sp * 2 - a3 * tm)

  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 2 - a3 * tm + a3, a8 - 15, 5)

  g.fc(grn)
  g.sml2()
  g.str('plant', w - a3 * lm, a3 * sp * 3 - a3 * tm)


  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 3 - a3 * tm + a3, a8 - 15, 5)

  g.fc(plp)
  g.sml()
  g.str('seed', w - a3 * lm, a3 * sp * 4 - a3 * tm)


  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 4 - a3 * tm + a3, a8 - 15, 5)

  g.fc(prpl)
  g.str('root', w - a3 * lm, a3 * sp * 5 - a3 * tm)


  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 5 - a3 * tm + a3, a8 - 15, 5)

  g.fc(lght)
  g.str('ch4', w - a3 * lm, a3 * sp * 6 - a3 * tm)


  g.fc(l_prpl)
  g.fr(w - a8 + 5, a3 * sp * 6 - a3 * tm + a3, a8 - 15, 5)



  let x_hw = m.move_p?.[0] ?? 0
  let x_hh = m.move_p?.[1] ?? 0

  x_hw += e_sin(life * 0.017 + x_hw * 0.02) * a
  x_hh += e_cos(life * 0.014 + x_hh * 0.02) * a

  x_hw += e_sin((e_sin(life) * 0.008 + u_angle + x_hw % h3p) * 0.1) * a3
  x_hh += e_sex((-e_sex(life) * 0.0002 + u_angle + x_hh % h3p) * 0.1) * a3

  x_hw = Math.min(Math.max(a3, x_hw), w - a8)
  x_hh = Math.min(Math.max(a3, x_hh), h - a8)

  g.save()
  g.sc(blu)
  g.bp()
  g.rotate(u_angle * pi, x_hw, x_hh)
  for (let i = 0; i < 5; i++) {
    g.rotate(u_angle * i * pi * 2, 0, 0)
    g.m2(0, 0)
    i % 2 === 1 && g.l2(r, r)
    g.m2(0, 0)
    i % 3 === 0 && g.l2(-r, -r)
  }
  g.ep()
  g.rsto()

}

  g.if(str_shake)
  g.shk_fi()
  g.if(true)


  m.clear_frame()
}




function calc_dist(x: number, y: number, x2: number, y2: number) {
  let dx = x - x2
  let dy = y - y2

  return Math.sqrt(dx * dx + dy * dy)
}

const sml_distance = 100
const lrg_distance = 300


const WND = 0
const SN = 1
const PT = 2
const SE = 3
const RO = 4
const SNS = [WND, SN, PT, SE, RO]

class Ss {


  idps!: number[]
  ps!: [number, number, number][]

  hnd!: [number, number, number, number, number]
  mdl!: [number, number, number, number, number]
  xs!: [number, number, number][]

  static init(): Ss {
    let res = new Ss()

    res.xs = []

    res.ps = [[0, 50, 130], [pi, 300, 300]]

    res.hnd = [1, 1, 0, 0, 0]

    res.mdl = [1, 1, 0, 0, 0]

    res.idps = []

    return res
  }
}



app(document.getElementById('app')!)