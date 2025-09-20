import Play, { Anim, AnimData } from './play'
import Color from './color'
import Time from './time'
import Input from './input'
import Graphics from './graphics'
import Sound from './sound'
import { cell_size, PhCollider } from './collider'
import { random, arr_rnd } from './random'
import { rect_vs_point } from './rect'
import { Progress } from './code'

function distance(x: number, y: number, a: number, b: number) {
  return Math.abs(Math.sqrt(x * x + y * y) - Math.sqrt(a * a + b * b))
}

function time_format(n: number) {
  function left_pad(n: number) {
    return n < 10 ? `0${n}`:`${n}`
  }

  return `${left_pad(Math.floor(n / 60))}:${left_pad(Math.floor(n%60))}`
}

const l2h_x = (x: number) => x / 320 * 1920
const l2h_y = (y: number) => y / 180 * 1080
const h2l_x = (x: number) => x / 1920 * 320
const h2l_y = (y: number) => y / 1080 * 180


const max_nb = 3
const small_epsilon = 1e-5
const epsilon = 1
const max_dx = 2.58002
const _G = 2.7812
const max_dy = 1.3 * _G
const jump_dy = max_dy
const jump_max_accel_y = 0.044311
const fall_max_accel_y = 0.877
const h_max_accel = 1.7

const h_dist = (x: number, y: number) => Math.sqrt(Math.abs(x * x - y * y))
const fixed = (x: number) => Math.round(x)

abstract class LevelP extends Play {

  world!: PhWorld
  solid!: PhCollider

  init() {

    this.world = this.make(PhWorld)
    this.solid = this.make(PhCollider)


    return super.init()
  }


  _update() {

    let { grid } = this.solid
    let { bodies } = this.world

    // 1 pixel perfect collision detection
    bodies.forEach(body => {

      let nb = max_nb

      for (let i = nb; i >= 1; i--)
      {

        let ni = (i * 2) / (nb * nb)

        {
        }

        let G = _G * body._scale_G
        let decrease_g = 0
        {

          let dy = Math.abs(body.dy)
          let sign = Math.sign(body.dy)

          for (let di = ni; di <= dy; di+= ni) {
            let dyy = 1/2 * sign * di * Math.sqrt(Time.delta)
            if (grid.is_solid_xywh(body, 0, dyy)) {
              body.collide_v = sign
              body.dy = 0
              decrease_g = 0
              break
            } else {
              body.collide_v = 0
              body.y += dyy
              decrease_g = (1 - sign * ((di - ni) / (dy - ni)))

              {

                let dii = jump_max_accel_y * G * Math.sqrt(decrease_g)
                let sign = 1

                body.dy += sign * dii * Time.delta
              }
            }
          }
        }

        let h_fall_accel = 0

        {

          let dy = fall_max_accel_y * G
          let sign = 1

          for (let di = ni; di <= dy; di+= ni) {
            let dyy = 1/2 * sign * di * Math.sqrt(Time.delta)
           if (grid.is_solid_xywh(body, 0, dyy)) {
              body.collide_v = sign
              body.dy = 0
              break
            } else {
              body.collide_v = 0
              body.y += dyy
              
              h_fall_accel = 1
            }
          }
        }

        {
          let dx = Math.abs(body.dx)
          let sign = Math.sign(body.dx)
          let h_accel = Math.pow(2.2 * h_dist(body.dy, 1), -h_dist(body.dy, 1) * 0.18) * 1.8

          for (let di = ni; di <= dx; di += ni) {
            let dxx = 1 / 2 * sign * di * Math.sqrt(Time.delta) * h_accel
            if (grid.is_solid_xywh(body, dxx, 0)) {
              body.collide_h = sign
              body.dx = 0
              break
            } else {
              body.collide_h = 0
              body.x += dxx
            }
          }

        }

      }


      {
      }

    })
  }

}



type PhBodyData = {
  x?: number,
  y?: number,
  w: number,
  h: number,
  scale_G?: number
}

abstract class PhBody extends Play {

  get data() {
    return this._data as PhBodyData
  }


  switch<T extends PhBody>(ctor: { new (): T }, data: any = {}) {
    return this.world?._switch(this, ctor, data)
  }


  _scale_G!: number

  variance!: number

  lerp_x?: [number, number, number]
  lerp_y?: [number, number, number]

  public world?: PhWorld

  public collide_v!: number
  public collide_h!: number

  get ceiling() {
    return this.collide_v < 0
  }

  get grounded() {
    return this.collide_v > 0
  }

  get left_wall() {
    return this.collide_h < 0
  }

  get right_wall() {
    return this.collide_h > 0
  }


  private _w!: number
  private _h!: number

  x!: number
  y!: number

  dx!: number
  dy!: number

  get w() {
    return this._w
  }

  get h() {
    return this._h
  }

  init() {
    this.x = this.data.x ?? 0
    this.y = this.data.y ?? 0

    this._w = this.data.w
    this._h = this.data.h

    this.dx = 0
    this.dy = 0

    this._scale_G = this.data.scale_G ?? 1
    this.variance = max_variance

    this.lerp_x = undefined
    this.lerp_y = undefined

    return super.init()
  }


  update() {

    if (this.lerp_x) {
      let [to, dur, left] = this.lerp_x

      if (left <= small_epsilon) {
        this.lerp_x = undefined
      } else {
        this.x = this.x + (to - this.x) * (1 - left / dur)
        this.lerp_x[2] -= Time.delta
      }
    }

    if (this.lerp_y) {
      let [to, dur, left] = this.lerp_y

      if (left <= small_epsilon) {
        this.lerp_y = undefined
      } else {
        this.y = this.y + (to - this.y) * (1 - left / dur)
        this.lerp_y[2] -= Time.delta
      }
    }

    super.update()
  }
}

class PhWorld extends Play {

  get bodies() {
    return this.objects as PhBody[]
  }

  body<T extends PhBody>(ctor: { new (): T }, data: any = {}) {
    let res = this.make(ctor, data)
    res.world = this
    return res
  }



  _switch<T extends PhBody>(old: PhBody, ctor: { new (): T }, data: any = {}) {
    let i =  this.bodies.indexOf(old)
    if (i === -1) {
      progress.track('error')
      throw 'nobody'
    }
    this.bodies.splice(i, 1)
    old.world = undefined

    return this.body(ctor, data)
  }

  filter<T extends PhBody>(ctor: { new (): T }) {
    return this.bodies.filter(_ => _.constructor.name === ctor.name)
  }

}

type PhBodyAnimData = AnimData & PhBodyData

abstract class PhBodyAnim extends PhBody {

  get data() {
    return this._data as PhBodyAnimData
  }

  anim!: Anim

  init() {

    this.anim = this.make(Anim, this.data)

    return super.init()
  }

  update() {
    this.anim.x = this.x
    this.anim.y = this.y

    super.update()
  }
}

const max_variance = 0.6234
let nf_x = 6.222
let nf_y = 6.323

function brown(n: number = 1, variance: number = max_variance) {
  let min = -n
  let max = +n
  return (random() * (max - min) + min) * variance
}

function ubrown(n: number, variance = max_variance) {
  return Math.floor(n / 2 + brown(n / 2, variance) + 1)
}

function ibrown(n: number, variance = max_variance) {
  return n / 2 + brown(n / 2, variance)
}

class Pickable extends PhBodyAnim {

  picked?: Player

  update() {

    let { picked } = this

    if (picked) {
      progress.track('pickup')

      if (Time.on_interval(0.2)) {
        this.pool(Zzz, { x: this.x, y: this.y - 8 })
        this.lerp_x = [picked.x, 0.3, 0.3]
        this.lerp_y = [picked.y, 0.3, 0.3]
      }
    }

    super.update()
  }
}

class Zzz extends PhBody {

  text!: string
  color!: Color
  size!: number

  _init() {
    this.text = ubrown(6) < 3 ? 'z' : 'Z'
    this.color = arr_rnd(Color.all)
    this.size = 52 + ubrown(32)
  }

  _update() {
    this.y -= 1/2 * _G * Math.sqrt(Time.delta)
    this.x += brown(nf_x, 0.1)
  }

  _draw(g: Graphics, t: Graphics) {
    t.str(this.text, l2h_x(this.x), l2h_y(this.y), this.size, this.color)
  }
}

type DistanceGoalData = AnimData & PhBodyData & {
  goal_x: number
  goal_y: number
}
class DistanceGoalPickup extends Pickable {

  get data() {
    return this._data as DistanceGoalData
  }

  d!: number

  d_bar!: RectPlay

  init() {

    this.d = 0

    let w = 100
    let h = 8
    this.d_bar = this.make(RectPlay, { color: Color.darkred, x: 3, y: 2, w, h })

    return super.init()
  }

  update() {

    let { x, y } = this
    let { goal_x, goal_y } = this.data

    this.d = Math.floor(distance(goal_x, goal_y, x, y))

    this.d_bar.data.x = l2h_x(x)
    this.d_bar.data.y = l2h_y(y - 24)

    super.update()
  }
}

class Fly extends DistanceGoalPickup {

  _update() {

    if (this.picked) {
      return
    }

    let { variance } = this

    if (Time.on_interval(0.1764)) {
      let nx = brown(nf_x, variance)
      this.lerp_x = [this.x + nx, 0.2, 0.2]
    }

    if (Time.on_interval(0.242)) {
      let ny = brown(nf_y, variance)
      this.lerp_y = [this.y + ny, 0.2, 0.2]
    }

  }

}

class Dust extends PhBodyAnim {}
class Ghoul extends DistanceGoalPickup {}

class PickupLine extends Play {

  x!: number
  y!: number
  x2!: number
  y2!: number

  _draw(g: Graphics) {
    let { x, y, x2, y2 } = this
    g.line(Color.light, x, y, x2, y2)
  }
}

function ps_on_line(x: number, y: number, x2: number, y2: number) {
  return [...Array(10).keys()].map(i => {
    let t = i / 10
    let X = x + t * (x2 - x)
    let Y = y + t * (y2 - y)

    return [X, Y]
  })
}

class Player extends PhBodyAnim {

  _prepickup?: Pickable
  _pickup?: Pickable
  _pre_grounded = false

  pickup_line!: PickupLine

  message!: string

  get facing() {
    return this.anim.scale_x
  }

  _sudden_slow!: number

  _init() {
    this._sudden_slow = 0.5

    this.pickup_line = this.make(PickupLine);

    this.message = progress.next_message
  }

  dusty(off_x: number) {
    this.pool(BounceP, {
      x: this.x - 8 * this.facing + off_x,
      y: this.y - 8
    }, 4)
  }

  _update() {
    
    if (this.grounded && !this._pre_grounded) {
      progress.track('jump')

      this.dusty(0)
      this.sched(0.1, () => this.grounded && this.dusty(-9))
      this.sched(0.1, () => this.grounded && this.dusty(+9))
      this.sched(0.2, () => this.grounded && this.dusty(-19))
      this.sched(0.2, () => this.grounded && this.dusty(+19))
    }

    if (Time.on_interval(brown(3))) {
      this.message = progress.next_message
    }

    this._pre_grounded = this.grounded

    if (Input.btn('left')) {
      progress.track('left')
      this.anim.scale_x = -1
      this.dx = -max_dx
    } else if (Input.btn('right')) {
      progress.track('right')
      this.anim.scale_x = 1
      this.dx = max_dx
    } else {
      this.dx = 0
    }

    if (Input.btn('jump')) {
      if (this.grounded) {
        this.dy = -jump_dy
      } else {
        progress.track('fly')
      }
    }

    if (Time.on_interval(brown(1))) {
      if (!this._pickup) {
        this._prepickup = this.find_pickup(Ghoul) || this.find_pickup(Fly) 
      }
    }

    if (this._prepickup) {
      this.pickup_line.x = this.x
      this.pickup_line.y = this.y
      this.pickup_line.x2 = this._prepickup.x
      this.pickup_line.y2 = this._prepickup.y
    } else {
      this.pickup_line.x = -100
      this.pickup_line.y = -100
      this.pickup_line.x2 = -10
      this.pickup_line.y2 = -10
    }


    if (this._prepickup) {
      if (Time.on_interval(0.2 + brown(0.2))) {
        ps_on_line(this.x, this.y, this._prepickup.x, this._prepickup.y)
        .slice(0, brown(10))
        .forEach(([x, y]) => {
          this.pool(Text, { color: Color.darkgreen,  x: l2h_x(x), y: l2h_y(y), size: brown(8) * 24 + brown(4) * brown(56), text: this.message[ubrown(this.message.length)], align: 'c' })
        })
      }
    }


    if (Input.btnp('pickup')) {
      if (this._pickup) {
        this._pickup.picked = undefined
        this._pickup = undefined
        this._prepickup = undefined
      } else {
        this._pickup = this._prepickup;
        if (this._pickup) {
          Sound.fx('open')
          this._pickup.picked = this
          progress.time_begin = true
          this._sudden_slow = 0.6
        }
      }
    }

    if (this._sudden_slow > 0) {
      this._sudden_slow -= Time.delta
      if (this._sudden_slow < 0) { this._sudden_slow = 0 }
      this.dx *= Math.pow(2, -h_dist(this._sudden_slow, 0.5))
    }
  }

  find_pickup<T extends Pickable>(ctor: { new (): T }) {
    let { x, y } = this

    let res = this.world?.filter(ctor)
    .map<[Pickable, number]>(_ => [_ as Pickable, distance(_.x, _.y, x, y)])
    .sort((a, b) => a[1] - b[1])[0]

    if (res && res[1] < 32) {
      return res[0]
    }

  }
}

type RectPlayData = {
  x: number,
  y: number,
  w: number,
  h: number,
  color: Color
}

class SRectPlay extends Play {

  get data() {
    return this._data as RectPlayData
  }

  _draw(g: Graphics) {
    let { color, x, y, w, h } = this.data

    g.srect(color, x, y, w, h)
  }
}

class RectPlay extends Play {

  get data() {
    return this._data as RectPlayData
  }


  _lerp_to?: Color
  _lerp_t = 0


  lerp(c: Color, duration = 0.142) {
    this._lerp_to = c
    this._lerp_t = duration
  }

  _update() {
    if (this._lerp_t > 0) {
      let t = 1 - this._lerp_t / 0.2
      this.data.color = Color.lerp(this.data.color, this._lerp_to!, t)

      this._lerp_t -= Time.delta

      if (this._lerp_t < 0) {
        this._lerp_t = 0
      }
    }
  }

  _draw(g: Graphics) {
    let { color, x, y, w, h } = this.data

    g.rect(color, x, y, w, h)
  }
}

type ButtonData = {
  x: number,
  y: number,
  text: string
}

class Button extends Play {

  get data() {
    return this._data as ButtonData
  }

  hovering = false
  click_t = 0

  readonly w = 60
  readonly h = 22

  get x() {
    return this.data.x
  }

  get y() {
    return this.data.y
  }

  bg!: RectPlay

  _init() {

    let { w, h } = this

    this.bg = this.make(RectPlay, { color: Color.darkblue, x: 3, y: 2, w, h })
    this.make(SRectPlay, { color: Color.lightblue, x: 3, y: 2, w, h })


    this.make(Text, { x: l2h_x(w / 2 - 2), y: l2h_y(h / 2 + 2), size: 74, text: this.data.text, align: 'c' })

    let self = this
    this.add_mouse(this.x, this.y, this.w, this.h, {
      on_click() {
        Sound.fx('click')
        self.click_t = 0.073454
        self.bg.lerp(Color.red, self.click_t)
      },

      on_hover_begin() {
        self.bg.lerp(Color.lightblue)
      },
      on_hover_end() {
        self.bg.lerp(Color.darkblue)
      }
    })

  }

  _update() {

    if (this.click_t > 0) {
      this.click_t -= Time.delta

      if (this.click_t <= 0) {
        this.click_t = 0

        this.bg.lerp(Color.lightblue, 0.345)
      }
    }

  }

  _pre_draw(g: Graphics, t: Graphics) {
    g.push_xy(this.data.x, this.data.y)
    t.push_xy(l2h_x(this.data.x), l2h_y(this.data.y))
  }

  _draw(g: Graphics, t: Graphics) {
    g.pop()
    t.pop()
  }
}

type PosPlay = Play & { x: number, y: number, width: number, height: number }

type Align = {
  margin?: number,
  h?: PosPlay[],
  v?: PosPlay[]
}

type HudData = {
  on_credits: () => void
}

class Hud extends Play {

  get data() {
    return this._data as HudData
  }

  align!: Align[]

  blue_text!: Text
  retro_text!: Text

  music_text!: Text
  music_ontext!: Text

  time_text!: CText

  _init() {

    this.align = []

    this.make(RectPlay, { color: Color.darkblue, x: 3, y: 2, w: 84, h: 42 })
    this.make(SRectPlay, { color: Color.lightblue, x: 3, y: 2, w: 84, h: 42 })
    this.make(SRectPlay, { color: Color.red, x: 2, y: 1, w: 86, h: 44 })


    this.blue_text = 
      this.make(Text, { x: 50, y: 100, size: 74, text: 'blue' })
    this.retro_text = 
      this.make(Text, { x: 150, y: 100, size: 74, text: 'retro' })

    let self = this
    this.add_mouse(h2l_x(50), h2l_y(100 - 74), h2l_x(500), h2l_y(74), {
      on_click() {
        self.data.on_credits()
      },
      on_hover_begin() {
        self.blue_text.color = Color.lightblue
        self.retro_text.color = Color.purple
      },
      on_hover_end() {
        self.blue_text.color = Color.light
        self.retro_text.color = Color.light
      }
    })

    this.align.push({
      margin: 89,
      h: [this.blue_text, this.retro_text]
    })

    this.make(Text, { x: 50, y: 170, size: 54, text: 'time' })

    this.time_text =
      this.make(CText, { x: 280, y: 170, size: 54, text: '02:00' })

    this.music_text = this.make(Text, { x: 50, y: 228, size: 54, text: 'music' })
    this.music_ontext = this.make(Text, { x: 280, y: 228, size: 54, text: 'on' })

    this.add_mouse(h2l_x(50), h2l_y(228-54), h2l_x(280), h2l_y(54), {
      on_click() {
        Sound.music_onoff = !Sound.music_onoff
        self.update_sound_text()
      },
      on_hover_begin() {
        self.music_ontext.color = Color.red
      },
      on_hover_end() {
        self.music_ontext.color = Color.light
      }
    })

    this.make(Button, { x: 250, y: 4, text: 'Right' })
    this.make(Button, { x: 180, y: 4, text: 'Left' })
    this.make(Button, { x: 220, y: 30, text: 'Jump' })

    self.update_sound_text()
  }

  update_sound_text() {
    if (Sound.music_onoff) {
      progress.track('music on')
      this.music_ontext.text = 'on'
    } else {
      progress.track('music off')
      this.music_ontext.text = 'off'
    }
  }

  _update() {

    if (progress.last_ten) {
      
    }

    this.time_text.text = time_format(progress.time_left)

    if (Input.btnp('music')) {
      progress.track('key m')
      Sound.music_onoff = !Sound.music_onoff
      this.update_sound_text()
    }

    this.align.forEach(align => {
      let margin = align.margin ?? 0

      align.h?.reduce((pre, next) => {
        next.x = pre.x + pre.width + margin
        return next
      })
    })
  }
}



abstract class Scene extends Play {


  parent?: Scene

  add_scene<T extends Scene>(ctor: { new (): T }, data: any = {}) {
    let scene = this.make(ctor, data)
    scene.parent = this
    return scene
  }


  switch_scene<T extends Scene>(ctor: { new (): T }, data: any = {}) {
    this.parent?.remove(this)
    this.parent?.add_scene(ctor, data)
  }
}

class GamePlayScene extends Scene {

  _countdown!: number

  _init() {
    this._countdown = 0

    Sound.music('intro')

    this.make(Level1)
    let self = this
    this.make(Hud, {
      on_credits() {
        self.switch_scene(CreditsScene)

        progress.track('credits link')
      }
    })
  }

  _update() {
    progress.update()
    if (progress.times_up) {
      progress.track('game end')
      this.make(GamePlayEndNotification)
      if (this._countdown === 0) {
        this._countdown = 5.432
      }
    }
    if (this._countdown > 0) {

      this._countdown-= Time.delta
      if (this._countdown <= 0) {
        this.switch_scene(CreditsScene)
        progress.track('countdown credits')
      }
    }
  }
}

class GamePlayEndNotification extends Play {

  _init() {
    this.make(Text, { x: 1920/2, y: 1080/2, size: 123, text: 'good game ὄ'})
    this.make(Text, { x: 1920/2, y: 1080/2 + 72, size: 43, text: 'every thing just never asks'})
    this.make(Text, { x: 1920/2, y: 1080/2 + 102, size: 43, text: '.', color: Color.darkpurple })
  }

}

let progress = Progress.make()

class CreditsScene extends Scene {

  texts!: Text[]
  sub_texts!: Text[]
  end_message_texts!: Text[]

  code_text!: Text
  end_message_text!: Text
  info_text!: Text

  last_progress!: Progress

  _init() {

    this.last_progress = progress
    progress = Progress.make()

    Sound.music_onoff = false

    this.make(RectPlay, { color: Color.green, x: 0, y: 0, w: 320, h: 180 })

    this.make(Text, { color: Color.lightpurple, x: -1070, y: 1020, size: 9000, text: 'E' })


    this.info_text = this.make(Text, { color: Color.darkblue, x: 0, y: 1000, size: 38, text: 'press jump or pickup to pause' })

    let x = 1920 / 4

    this.end_message_texts = [ 
      this.make(Text, { color: Color.white, x, y: 100, size: 40, text: `you\'ve invested "${this.last_progress.time_elapsed}" knucles back to your future.` }),
      this.make(Text, { color: Color.white, x, y: 100, size: 40, text: `don't ever` }),
      this.make(Text, { color: Color.white, x, y: 100, size: 40, text: `for any reason` }),
      this.make(Text, { color: Color.white, x, y: 100, size: 40, text: `no matter what you're doing` }),
      this.make(Text, { color: Color.white, x, y: 100, size: 40, text: `or where you are` }),
      this.make(Text, { color: Color.white, x, y: 100, size: 40, text: `or who you've been with` }),
      this.make(Text, { color: Color.white, x, y: 100, size: 40, text: `for any reason` }),
      this.make(Text, { color: Color.white, x, y: 100, size: 40, text: `no matter whatsoever` }),
    ]

    this.code_text = 
      this.make(Text, { color: Color.darkpurple, x, y: 100, size: 40, text: 'please send your secret code wait_x2_not in the end to me;' }),

    this.sub_texts = [
      this.make(Text, { color: Color.red, x, y: 100, size: 70, text: 'watermelon or an exotic pomengrate' }),
      this.end_message_texts[0],
      this.make(Text, { color: Color.white, x, y: 100, size: 70, text: 'watermelon or an exotic pomengrate' }),
      this.end_message_texts[1],
      this.make(Text, { color: Color.darkblue, x, y: 100, size: 70, text: 'watermelon or an exotic pomengrate' }),
      this.end_message_texts[2],
      this.make(Text, { color: Color.darkblue, x, y: 100, size: 70, text: 'watermelon or an exotic pomengrate' }),
      this.end_message_texts[3],
      this.make(Text, { color: Color.darkblue, x, y: 100, size: 70, text: 'watermelon or an exotic pomengrate' }),
      this.end_message_texts[4],
      this.end_message_texts[5],
      this.end_message_texts[6],
    ]

    this.texts = [
      this.make(Text, { color: Color.darkpurple, x, y: 100, size: 90, text: 'thanks for playing' }),

      this.code_text,

      this.make(Text, { color: Color.darkpurple, x, y: 1000, size: 90, text: 'art twitter.com/_V3X3D' }),
      this.make(Text, { color: Color.darkpurple, x, y: 1000, size: 90, text: 'music github.com/arikwex' }),
      this.make(Text, { color: Color.darkpurple, x, y: 1000, size: 90, text: 'author twitter.com/eguneys' }),
      this.make(Text, { color: Color.darkpurple, x, y: 1000, size: 120, text: 'Mucho Gracias <3' }),
      this.make(Text, { color: Color.darkpurple, x, y: 1000, size: 80, text: 'Check out my PostMortem too!' }),
      this.make(Text, { color: Color.darkpurple, x, y: 1000, size: 120, text: 'bb' }),
    ]

    let self = this
    this.add_mouse(0, 0, 320, 180, {
      on_click() {
        if (self.life > 2) {
          progress.track('reset')
          self.switch_scene(StartScene1)
        }
      }
    })
  }

  _hold = false

  _update() {

    if (Input.btnp('jump') || Input.btnp('pickup')) {
      this._hold = !this._hold
      if (!this._hold) {
        this.info_text.color = Color.grey
        this.info_text.size -= 10
      }
    }
    if (this._hold) {

      this.info_text.o_x = 7 + Math.cos(this.life * 3) * 10
      this.info_text.o_y = 3 + Math.sin(this.life * 7) * 10
      return
    }
    this.info_text.o_x = 0
    this.info_text.o_y = 0


    this.sub_texts[0].y += Time.delta * 180
    if (this.sub_texts[0].y > this.sub_texts.length * 1080 - 100) {
      this.code_text.text = this.code_text.text.replace('wait_x2_not', this.last_progress.code)
    }
    this.sub_texts[0].y %= this.sub_texts.length * 1080 - 100
    this.sub_texts.reduce((pre, next) => { 
      next.y = pre.y - pre.height - 777
      return next
    })

    this.texts[0].y += Time.delta * 200
    if (this.texts[0].y > this.texts.length * 1080 - 100) {
      this.code_text.text = this.code_text.text.replace('wait_x2_not', this.last_progress.code)
    }
    this.texts[0].y %= this.texts.length * 1080 - 100
    this.texts.reduce((pre, next) => { 
      next.y = pre.y - pre.height - 777
      return next
    })
  }

}

class StartScene1 extends Scene {

  begin_text1!: Text
  begin_text2!: Text

  _first_update() {
    console.log('here')
    //this.switch_scene(CreditsScene)
    //this.switch_scene(GamePlayScene)
    //this.switch_scene(CreditsScene)
  }

  _init() {


    this.make(RectPlay, { color: Color.darkblue, x: 0, y: 0, w: 320, h: 180 })

    this.make(Text, { color: Color.lightblue, x: -250, y: 1020, size: 6000, text: 'V' })

    this.make(Text, { x: 50, y: 170, size: 112, text: '2 minute ssir..', color: Color.light })
    this.make(Text, { x: 1920/2, y: 1080/2, size: 112, text: 'blue', color: Color.light })
    this.make(Text, { x: 1920/2 + 320, y: 1080/2, size: 112, text: 'retro', color: Color.light })
    this.make(Text, { x: 1920/3, y: 900, size: 112, text: 'by', color: Color.light })
    this.make(CText, { x: 1920/3 + 200, y: 900, size: 112, text: 'eguneys', color: Color.light })
    this.begin_text1 = this.make(Text, { x: 0, y: 1030, size: 62, text: 'click to begin', color: Color.light })
    this.begin_text2 = this.make(Text, { x: 0, y: 1030, size: 62, text: 'click to begin', color: Color.light })

    Sound.load(p => { 
      let text = p === 1 ? `click to begin` : `loading sounds ${Math.floor(p * 100)}%`
      this.begin_text1.text = text
      this.begin_text2.text = text
      console.log(text)
      progress.track('sound')
    })

    let self = this
    this.add_mouse(0, 0, 320, 180, {
      on_click() {
        if (Sound.loaded) {
          self.switch_scene(GamePlayScene)
          progress.track('load game')
        }
      }
    })
  }

  _update() {

    let dt = 300
    this.begin_text1.x += dt * Time.delta
    this.begin_text2.x += dt * Time.delta
    if (this.begin_text1.x + this.begin_text1.width > 1920) {
      this.begin_text2.x = this.begin_text1.x - 1920
    }
    if (this.begin_text2.x + this.begin_text2.width > 1920) {
      this.begin_text1.x = this.begin_text2.x - 1920
    }
  }
}

export default class Scene1 extends Scene {
  static make = () => {
    return new Scene1().init()
  }

  _init() {
    this.add_scene(StartScene1)
  }

  _pre_draw(g: Graphics, t: Graphics) {
    g.clear()
    t.clear()
  }
}

type TextAlign = 'c'

type TextData = {
  x: number,
  y: number,
  size: number,
  color: Color,
  text: string,
  align?: TextAlign
}



class CText extends Play {

  get data() {
    return this._data as TextData
  }

  _width = 0

  get width() {
    return this._width
  }

  get height() {
    return this.size
  }

  x!: number
  y!: number
  size!: number
  text!: string
  color!: Color

  lc!: [string, Color][]

  _init() {
    this.text = this.data.text
    this.x = this.data.x
    this.y = this.data.y
    this.size = this.data.size ?? 64
    this.color = this.data.color ?? Color.light

    this.lc = []
  }

  _update() {
    if (Time.on_interval(0.2)) {
      this.lc = this.text.split('').map(_ => [_, arr_rnd(Color.all)])
    }
  }

  _draw(_: Graphics, t: Graphics) {
    this._width = 0
    this.lc.map(([letter, color]) => {
      let w = t.str(letter, this.x + this._width, this.y, this.size, color)
      this._width += w
    })
  }
}

class Text extends Play {

  get data() {
    return this._data as TextData
  }

  _width = 0

  get width() {
    return this._width
  }

  get height() {
    return this.size
  }

  o_x!: number
  o_y!: number
  x!: number
  y!: number
  size!: number
  text!: string
  color!: Color

  _init() {
    this.text = this.data.text
    this.x = this.data.x
    this.y = this.data.y
    this.size = this.data.size ?? 64
    this.color = this.data.color ?? Color.light

    this.o_x = 0
    this.o_y = 0
  }

  _draw(_: Graphics, t: Graphics) {
    this._width = t.str(this.text, this.o_x + this.x, this.o_y + this.y, this.size, this.color, this.data.align)
  }
}

type BouncePData = {
  x: number,
  y: number
}
class BounceP extends Play {

  get data() {
    return this._data as BouncePData
  }


  _init() {
    let _ = this.make(Anim, {
      name: 'bounce',
      tag: `${5 + Math.floor(brown(4))}`
    })
    _.xy(this.data.x, this.data.y)
  }

}




class AutoGenDecoration extends Play {

  _init() {
    for (let i = 0; i < 16 + brown(8); i++) {
      let d = this.make(Anim, {
        name: 'dust',
        tag: 's'
      })
      d.xy(90 + brown(320), brown(180))
    }
  }

}


function gen_pickup() {
  return arr_rnd([
    [Fly, {
      goal_x: 0,
      goal_y : 0,
      name: `fly`,
      x: 60 + ubrown(190),
      y: 30 + ubrown(60),
      w: 16,
      h: 16,
      scale_G: 0.03 + ibrown(0.3),
      s_origin: 'bc'
    }], [Ghoul, {
      goal_x: 320,
      goal_y: 180,
      name: `ghoul`,
      x: ubrown(320),
      y: 130,
      w: 16,
      h: 16,
      scale_G: 0.03 + ibrown(0.3),
      s_origin: 'bc'

    }]
  ])
}

type GenPickupsData = {
  world: PhWorld
}

class AutoGenPickups extends Play {

  get data() {
    return this._data as GenPickupsData
  }
  
  world!: PhWorld

  ones!: Pickable[]

  _init() {

    this.world = this.data.world

    this.ones = []
  }

  _update() {

    if (Time.on_interval(ubrown(ubrown(3.2) + 1))) {
      let [ctor, data]: any = gen_pickup()

      if (this.ones.length < 2 || this.ones.length < ubrown(2 + ubrown(6))) {
        this.ones.push(this.world.body(ctor, {...data }))
      } else {
        let o = this.ones.shift()!
        if (o) {
          if (o.picked) {
          } else {
            this.ones.push(o.switch(ctor, { ...data })!)
          }
        }
      }
    }
  }

}

class Level1 extends LevelP {

  _init() {


    this.make(AutoGenDecoration)
    this.make(AutoGenPickups, { world: this.world })

    let p1 = this.world.body(Player, {
      name: `player`,
      x: 8,
      y: 80,
      w: 16,
      h: 16,
      s_origin: 'bc'
    })



  }

}


