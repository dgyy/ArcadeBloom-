import Content from './content'
import Graphics from "./graphics"
import Play, { Anim } from "./play"
import i from "./input"
import a from './sound'
import Time, { my_loop } from "./time"
//import { RigidOptions, SteerBehaviors, WeightedBehavior } from './rigid'

const v_accel = 1800
const h_accel = 10
const max_dx = 10
const max_jump_dy = 16
const fall_max_accel_y = 2800
const _G = 9.8


let checkpoint: [number, number] | undefined
let accuracy = 0.2

function lerp(a: number, b: number, t = 0.1) {
    return (1 - t) * a + t * b
}

function appr(v: number, t: number, by = Time.dt) {
    if (v < t) {
        return Math.min(v + by, t)
    } else if (v > t) {
        return Math.max(v - by, t)
    } else {
        return v
    }
}

type XYWH = { x: number, y: number, w: number, h: number }
// @ts-ignore
function collide_rect(a: XYWH, b: XYWH) {
    return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
}


export function SceneManager(g: Graphics) {

    let scene: Scene

    const go = (scene_ctor: { new(x: number, y: number): Scene }) => {
        scene?.song?.()
        scene = new scene_ctor(0, 0)
        scene._set_data({ g, go })
        scene.init()
    }

    go(MyScene)

    my_loop(() => {
        scene.update()

        g.clear()
        g.fr(0, 0, 320, 180, '#fafafa')
        g.fr(1, 1, 318, 178, '#1f1f1f')
        scene.draw(g)
    })
}

class Scene extends Play {
    up_p = false
    song?: () => void



    get data() {
        return this._data as { g: Graphics, go: (_: { new(x: number, y: number): Scene }) => void}
    }

    get g() {
        return this.data.g
    }

    go(_: { new(x: number, y: number): Scene }) {
        this.data.go(_)
    }

    update() {

        if (i('m')) {
            if (!this.up_p) {
                this.up_p = true
                if (this.song) {
                    this.song()
                    this.song = undefined
                } else {
                    this.song = a.play('song', true)
                }
            }
        } else {
            this.up_p = false
        }
        super.update()
    }

}

class MyScene extends Scene {

  _init() {

    Content.load().then(() => {
        this.make(Anim, { name: 'loading', tag: 'audio', duration: 1000 }, 
            320 / 2, 
            180 / 2)

        a.generate().then(() => {
            this.go(AudioLoaded)
            //this.go(Intro)
        })
    })
  }

}

//@ts-ignore
class AudioLoaded extends Scene {

    _init() {

        const init = (e: KeyboardEvent) => {
            e.preventDefault()
            document.removeEventListener('keydown', init)
            this.go(Intro)
        }

        document.addEventListener('keydown', init)

        this.make(Anim, { name: 'loading', tag: 'input', duration: 1000 }, 260, 160)
    }
}


class Intro extends Scene {

    map!: MapLoader

    _init() {
        this.song = a.play('song', true)

        this.map = this.make(MapLoader)
    }


    _update() {
        let p = this.map.one(Player)!

        if (p.die_counter > 3) {

            this.go(Intro)
        }
    }
}

class MapLoader extends Play {

    w!: number
    h!: number
    tiles!: number[][]

    cam_x = 0
    cam_y = 0
    cam_zone_x = 0
    cam_zone_y = 0 
    cam_shake_x = 0
    cam_shake_y = 0

    shake_dx = 0
    shake_dy = 0

    get visible_bounds() {
        let x = Math.max(0, Math.floor((this.cam_x - 80)))
        let y = Math.max(0, Math.floor((this.cam_y - 30)))

        return { x, y, w: 320 + 160, h: 180 + 60 }
    }

    get visible_bound_tiles() {

        let { x, y, w, h } = this.visible_bounds

        x = Math.floor(x / 8)
        y = Math.floor(y / 8)
        let end_x = Math.min(this.w, Math.floor(x + w / 8 + 2))
        let end_y = Math.min(this.h, Math.floor(y + h / 8 + 2))

        return { x, y, end_x, end_y }
    }

    _init() {

        const l = Content.levels[0]
        //const l = proc_gen_level()

        this.w = l.w
        this.h = l.h

        this.tiles = Array(l.h)

        for (let i = 0; i < l.h; i++) {
            this.tiles[i] = Array(l.w)
        }

        for (let i = 0; i < l.te.length; i++) {
            let { px, src } = l.te[i]

            let x = px[0] / 8
            let y = px[1] / 8

            let i_src = (src[1] / 8) * 6 + (src[0] / 8)

            if (i_src === 11) {
                if (checkpoint) {
                    px = checkpoint
                }
                this.make(Player, {}, px[0], px[1])
            } else if (i_src === 17) {
                this.make(PlusChar, {}, px[0], px[1])
            } else if (i_src === 23) {
                this.make(Door, {}, px[0], px[1])
            } else {
                this.tiles[y][x] = i_src
            }
        }

    }

    is_solid_xywh(xywh: XYWH, dx: number, dy: number) {
        return !!this.get_solid_xywh(xywh, dx, dy)
    }

    get_solid_xywh(xywh: XYWH, dx: number, dy: number) {
        let { x, y, w, h } = xywh

        return this.is_solid_rect(x - w / 2 + dx, y - h / 2 + dy, w, h)
    }

    is_solid_rect(x: number, y: number, w = 1, h = 1) {

        let grid_width = this.tiles[0].length
        let grid_height = this.tiles.length

        let grid_x = x / 8
        let grid_y = y / 8
        let grid_end_x = (x + w - 1) / 8
        let grid_end_y = (y + h - 1) / 8

        if (grid_x < 0 || grid_end_x >= grid_width || grid_y < 0 || grid_end_y >= grid_height) {
            return true
        }

        for (x = grid_x; x <= grid_end_x; x++) {
            for (y = grid_y; y <= grid_end_y; y++) {
                x = Math.floor(x)
                y = Math.floor(y)
                if (is_solid_n(this.tiles[y][x])) {
                    return [x * 8, y * 8]
                }
            }
        }
        return undefined
    }



    _update() {

        let p = this.one(Player)!

        let ds = this.many(Door)

        let d = ds.find(d => collide_rect(d.hitbox, p.fubox))

        if (d) {
            if (d.is_open) {
                checkpoint = [d.x - 12, d.y + 8]
            } else {
                p.dx = 0
                p.dy = 0
            }
        }


        if (p.ledge_grab === 0) {
            let down_solid = this.is_solid_xywh(p, 0, 4)
            let r_solid = !this.get_solid_xywh(p, 1, -8) ? this.get_solid_xywh(p, 1, 0) : undefined
            let l_solid = !this.get_solid_xywh(p, -1, -8) ? this.get_solid_xywh(p, -1, 0) : undefined

            // ledge grap
            if (!down_solid) {
                if (p.is_right && Array.isArray(r_solid)) {
                    p.ledge_grab = .4
                    p.x = r_solid[0]
                    p.y = r_solid[1]
                } else if (p.is_left && Array.isArray(l_solid)) {
                    p.ledge_grab = .4
                    p.x = l_solid[0] + 8
                    p.y = l_solid[1]
                }
            }
        }

        if (p.ledge_grab === 0 && p.knoll_climb === 0) {
            let r_knoll = !this.get_solid_xywh(p, 1, -8) ? this.get_solid_xywh(p, 1, 0) : undefined
            let l_knoll = !this.get_solid_xywh(p, -1, -8) ? this.get_solid_xywh(p, -1, 0) : undefined

            if (p.is_right && Array.isArray(r_knoll)) {
                p.knoll_climb = .13
                p.x = r_knoll[0]
                p.y = r_knoll[1] - 1
            } else if (p.is_left && Array.isArray(l_knoll)) {
                p.knoll_climb = -.13
                p.x = l_knoll[0] + 8
                p.y = l_knoll[1] - 1
            }
        }


        let s = this.get_solid_xywh(p, 0, 0) as [number, number]

        if (p.ledge_grab) {
            p.ledge_grab = appr(p.ledge_grab, 0)


            if (p.ledge_grab === 0) {
                p.y = s[1] - 8
                p.dy = 0
            }
        }

        if (p.knoll_climb) {
            p.knoll_climb = appr(p.knoll_climb, 0)

            if (p.knoll_climb === 0) {
                p.y = s[1] - 8
                p.dy = 0
            }
        }

        if (p.shoot_cool > 0) {
            if (this.shake_dx === 0) {
                this.shake_dx = -1
            }
            if (this.shake_dy === 0) {
                this.shake_dy = -.2
            }
        }

        if (this.cam_zone_x < (p.x - 8) - 30) {
            this.cam_zone_x = (p.x - 8) - 30
        }
        if (this.cam_zone_x > (p.x + 8) + 30) {
            this.cam_zone_x = (p.x + 8) + 30
        }
        if (this.cam_zone_y < (p.y - 8) - 30) {
            this.cam_zone_y = (p.y - 8) - 30
        }
        if (this.cam_zone_y > (p.y + 8) + 30) {
            this.cam_zone_y = (p.y + 8) + 30
        }

        let show_more = p.dx < 0 ? -170 : p.dx > 0 ? -150 : -160
        this.cam_x = lerp(this.cam_x, this.cam_zone_x + show_more)
        this.cam_y = lerp(this.cam_y, this.cam_zone_y - 90, 0.5)

        this.cam_x = Math.min(Math.max(0, this.cam_x), this.w * 8 - 320)

        let pp = this.many(HasPosition).filter(_ => collide_rect(_, this.visible_bounds))
        
        pp.forEach(p => {
          {

            if (p.dx === 0) { p.rem_x = 0 }
            if (p.dy === 0) { p.rem_y = 0 }

            let h_damping = p.h_damping
            let sign = Math.sign(p.dx + p.rem_x)
            let dx = Math.abs(p.dx + p.rem_x) * Time.dt * h_accel * h_damping
            p.rem_x = (dx % 1) * sign


            for (let i = 0; i < dx; i++) {
                let dxx = sign
                if (this.is_solid_xywh(p, dxx, 0)) {
                    p.collide_h = sign
                    p.dx = 0
                    break
                } else {
                    p.collide_h = 0
                    p.x += dxx
                }
            }
          }

          {
            let G = _G

            {
                let sign = Math.sign(p.dy + p.rem_y)
                let dy = Math.abs(p.dy + p.rem_y) * 1/2 * Time.dt * Time.dt * v_accel
                p.rem_y = (dy % 1) * sign


                for (let di = 0; di < dy; di += 1) {
                    let dyy = sign
                    if (this.is_solid_xywh(p, 0, dyy)) {
                        p.collide_v = sign
                        p.dy /= 2
                        p.rem_y = 0
                        break
                    } else {
                        p.collide_v = 0
                        p.y += dyy;

                        let v_smooth_damping = p.v_smooth_damping
                        p.dy = appr(p.dy, 0, Time.dt * G * v_smooth_damping)
                    }
                }
            }

            let fall_damping = p.fall_damping
            if (p.dy > -7) {
                let dy = (fall_max_accel_y * G) * fall_damping * 1/2 * Time.dt * Time.dt
                let sign = 1

                for (let di = 0; di < dy; di += 1) {
                    let dyy = sign
                    if (this.is_solid_xywh(p, 0, dyy)) {
                        p.collide_v = sign
                        p.dy = 0
                        break
                    } else {
                        p.collide_v = 0
                        p.y += dyy
                    }
                }
            }
          }
        })

        let ps = this.many(PlusChar)

        ps.forEach(pc => {
            if (pc.has_key && pc.t_sleep > 0) {
                pc.has_key = false
                p.has_key = true
            }
        })

        ps.forEach(pc => {
            if (!p.is_dead) {
                if (!p.t_knock) {
                    if (p.falling && collide_rect(pc.hitbox, p.jumpbox)) {
                        pc.t_jumped = .3

                        p.dy = -max_jump_dy * 1.3
                        a.play('jump0')
                        pc.dy = -max_jump_dy * .3
                    } 


                    if (pc.is_idle) {
                        if (collide_rect(pc.eyebox, p.hitbox)) {
                            pc.t_eye = .3
                        }
                        if (collide_rect(pc.earbox, p.hitbox)) {
                            pc.t_ear = .2
                        }
                    }
                }
            }
        })

        let wgfs = this.many(WGroFire)

        if (!p.is_dead && !p.t_knock) {
            let die = false
            if (Math.floor(p.y) === this.h * 8 - p.h / 2) {
                die = true
            } else {
                wgfs.forEach(wgf => {
                    if (collide_rect(wgf.hitbox, p.hurtbox)) {
                        die = true
                    }
                })
            }
            if (die) {
                a.play('knock')
                Time.t_slow = 2.2
                p.t_knock = 2.2
                p.dy = - max_jump_dy * 0.6
                p.dx = p.facing * -1 * max_dx * 3.2
                this.shake_dx = 8
                this.shake_dy = 8
            }
        }

        let bs = this.many(Bullet)

        ds.filter(_ => !_.is_open).forEach(d => {
            let b = bs.filter(_ => !_.t_hit).find(b => collide_rect(d.hitbox, b.hitbox))
            if (b) {
               b.t_hit = true
               if (b.data.has_key) {
                   a.play('knock')
                   a.play('jump0')
                   a.play('jump1')
                   this.shake_dx = 1
                   this.shake_dy = 8
                   d.is_open = true
                   p.has_key = false
               }
            }
        })

        ps.forEach(pc => {
            let b = bs.filter(_ => !_.t_hit).find(b => collide_rect(pc.hitbox, b.hitbox))
            if (b) {
                if (pc.t_sleep === 0) {
                    pc.t_hit = .2
                    if (pc.t_eye > 0 && pc.wgro_anim === 0) {

                    } else {

                        pc.dx = b.dx * 1.2
                        pc.dy = -max_jump_dy * 0.2
                        a.play('damage' + Math.floor(Math.random() * 3))
                        pc.make(OneTimeAnim, { name: 'bullet', tag: 'damage', duration: .4 })
                    }
                }
                b.t_hit = true
            }
        })




        if (this.shake_dx !== 0) {
            this.cam_shake_x = Math.sin(2 * Math.PI * 2 * this.life) * 2
            this.cam_shake_x += Math.sin(2 * Math.PI * 2 * (this.life + this.shake_dx))
            this.cam_shake_x += Math.random() * 2
        }
         if (this.shake_dy !== 0) {
            this.cam_shake_y = Math.cos(2 * Math.PI * 1 * this.life + 1)
            this.cam_shake_y += Math.random() * 2
        }
        

        this.shake_dx = appr(this.shake_dx, 0, Time.dt * 10)
        this.shake_dy = appr(this.shake_dy, 0, Time.dt * 10)
    }

    _pre_draw(g: Graphics) {
        g.push_xy(-this.cam_x + this.cam_shake_x, -this.cam_y + this.cam_shake_y)
    }

    _post_draw(g: Graphics) {
        g.pop()
    }

    _draw(g: Graphics) {


        let { x, y, end_x, end_y } = this.visible_bound_tiles


        for (let i = x; i < end_x; i++) {
            for (let j = y; j < end_y; j++) {
                let tile = this.tiles[j][i]
                g.tile(tile, i * 8, j * 8)
            }
        }

        //g.box(this.one(PlusChar)!.earbox)
        //this.many(Door).forEach(_ => g.box(_.hitbox))
    }
}

class HasPosition extends Play {

    anim!: Anim
    w = 16
    h = 16

    dx = 0
    dy = 0
    rem_x = 0
    rem_y = 0

    collide_h = 0
    collide_v = 0

    facing: number = 1

    get h_damping() {
        return 1
    }

    get fall_damping() {
        return 1
    }

    get v_smooth_damping() {
        return 1
    }

    get hitbox() {
        let { x, y, w, h } = this
        return { x: x - w / 2, y: y - h/ 2, w, h }
    }

    _pre_draw(g: Graphics) {
        g.push_xy(this.x, this.y)
    }

    _post_draw(g: Graphics) {
        g.pop()
    }

    update() {
        if (this.dx !== 0) {
           this.facing = Math.sign(this.dx)
        }


        super.update()

    }
}


class Door extends HasPosition {

    is_open = false

    get hitbox() {
        let { x, y, w, h } = super.hitbox

        return { x: x + 4, y: y + 16, w, h }
    }

    w = 8
    h = 32

    _init() {
        this.anim = this.make(Anim, { name: 'door', s_origin: 'tl' }, -8, 0)
    }

    _update() {
        if (this.is_open) {
            this.anim.play_tag('open')
            this.anim.loop = false
        }
    }
}

class PlusChar extends HasPosition {

    has_key = true

    t_sleep = 0
    t_jumped = 0
    t_hit = 0
    t_eye = 0
    t_ear = 0
    t_speed = 0

    damage = 4

    wgro_cool = .6
    wgro_anim = 0

    get earbox() {
        let w = 50
        let h = 4
        let x = this.facing < 0 ? this.x + 8 : this.x - w - 8
        let y = this.y
        return { x, y, w, h }
    }

    get eyebox() {

        let w = 70
        let h = 4
        let x = this.facing < 0 ? this.x - w - 8 : this.x + 8
        let y = this.y

        return { x, y, w, h }
    }

    get is_idle() {

        return (this.t_hit + this.t_jumped + this.t_eye + this.t_ear) === 0
    }

    _init() {
        this.anim = this.make(Anim, {name: 'plus_char'})
    }

    _update() {

        if (this.t_jumped) {
            this.t_jumped = appr(this.t_jumped, 0)
        }

       
        if (this.t_sleep) {
            this.t_sleep = appr(this.t_sleep, 0)
            this.dx = 0

            this.anim.play_tag('sleep')
        } else if (this.t_hit) {
            this.t_hit = appr(this.t_hit, 0)

            if (this.t_eye > 0 && this.wgro_anim === 0) {
                this.dx = appr(this.dx, 0, Time.dt * 200)
                this.anim.play_tag('cover_hit')

                this.anim.x = this.t_hit * this.facing * -1 * 12
            } else {

                this.dx = appr(this.dx, (this.damage < 1 ? this.facing : -this.facing) * max_dx * 0.58, Time.dt * 200)

                this.anim.play_tag('damage')
                this.anim.scale_y = appr(this.anim.scale_y, 1.2, Time.dt * 2)
                this.anim.scale_x = appr(this.anim.scale_x, 0.8 * Math.sign(this.anim.scale_x), Time.dt * 2)

                if (this.t_hit === 0) {
                    this.damage -= 1

                    if (this.damage < 0) {
                        this.damage = 4
                        this.t_sleep = 10
                    }
                }
            }
        } else if (this.t_jumped) {
            this.anim.scale_y = appr(this.anim.scale_y, 0.9, Time.dt * 1.8)
            this.anim.scale_x = appr(this.anim.scale_x, 1.1 * Math.sign(this.anim.scale_x), Time.dt * 1.6)
            this.anim.play_tag('jumped')
        } else if (this.t_eye) {
            this.t_eye = appr(this.t_eye, 0)

            this.dx = appr(this.dx, 0, Time.dt * 8)

            if (this.wgro_cool > 0) {
                this.wgro_cool = appr(this.wgro_cool, 0)
            } else {
                this.wgro_anim = 1
                this.wgro_cool = 1.6 + Math.random()
                let _ = this.parent.make(WGro, { }, this.x, this.y)
                _.dx = this.facing
            } 

            if (this.wgro_anim) {
                this.wgro_anim = appr(this.wgro_anim, 0)
                this.anim.play_tag('wgro')
            } else {
              this.anim.play_tag('cover')
            }
        } else if (this.t_ear) {
            this.t_ear = appr(this.t_ear, 0)


            this.dx = appr(this.dx, 0, Time.dt * 8)

            this.anim.play_tag('ear')


            if (this.t_ear === 0) {
                this.facing = this.facing * -1
            }
        } else if (this.t_speed) { 
            this.t_speed = appr(this.t_speed, 0)
        } else {
        if (this.collide_h) {
            this.facing = this.facing * -1
        }


            this.dx = this.facing * max_dx * .58
 
            this.anim.play_tag('idle')
        }

        if (!this.t_hit || !this.t_jumped) {
            this.anim.scale_x = appr(this.anim.scale_x, Math.sign(this.anim.scale_x))
            this.anim.scale_y = appr(this.anim.scale_y, 1)
        }

        if (this.anim.scale_x * this.facing === -1) {
            this.anim.scale_x *= -1
        }
        //console.log(this.t_sleep, this.t_hit, this.t_eye, this.t_ear, this.t_jumped)
    }
}


class WGro extends HasPosition {
    
    f_x = 0
    t_cool = .16

    _update() {
        if (this.t_cool > 0) {
            this.t_cool = appr(this.t_cool, 0)
        }
        if (this.t_cool === 0) {
            this.t_cool = .16

            let _ = this.parent.make(WGroFire, {}, this.x + this.f_x, this.y - 16)
            _.dy = -max_jump_dy * .18

            this.f_x += 8 * this.facing
        }

        if (this.life > 2.1) {
            this.remove()
        }
    }
}

class WGroFire extends HasPosition {

    _init() {
        this.anim = this.make(Anim, { name: 'wgrofire', duration: .7 })
    }


    _update() { 

        if (this.life > .7) {
            this.remove()
        }
    }
}

type OneTimeAnimData = {
    name: string,
    tag?: string,
    duration?: number,
    scale?: number,
    on_end?: () => void
    end_make?: [new(x: number, y: number) => Play, any]
}

class OneTimeAnim extends HasPosition {

    get h_damping() {
        return 0
    }

    get fall_damping() {
        return 0
    }

    get data() {
        return this._data as OneTimeAnimData
    }

    get duration() {
        return this.data.duration ?? 1
    }

    _init() {
        let { name, tag } = this.data
        this.anim = this.make(Anim, { name, tag, duration: this.duration })
        this.anim.scale_x = this.data.scale ?? 1
    }

    _update() {

        if (this.life >= this.duration) {
            this.data.on_end?.()
            if (this.data.end_make) {
                let [ctor, data] = this.data.end_make
                this.parent!.make(ctor, data, this.x, this.y)
            }
            this.remove()
        }
    }
}

class Player extends HasPosition {

    has_key = true

    get fubox() {
        let { x, y, w, h } = this.hitbox

        return { x: x + this.dx + this.rem_x, y: y + this.dy + this.rem_y, w, h }
    }

    is_right = false
    is_left = false

    ledge_grab = 0
    knoll_climb = 0

    t_knock = 0
    

    die_counter = -1
    _up_counter?: number
    _ground_counter?: number

    _double_jump_left = 2

    shoot_cool = 0

    damage = 0

    pre_grounded = this.grounded
    pre_y = this.y

    get jumpbox() {
        return { x: this.hitbox.x, y: this.hitbox.y, w: this.w * 1.2, h: this.h }
    }
    get hurtbox() {
        return { x: this.hitbox.x, y: this.hitbox.y, w: this.w * 0.8, h: this.h * 0.7 }
    }

    get jumping() {
        return this.pre_y > this.y
    }

    get falling() {
        return this.pre_y < this.y
    }

    get h_damping() {
        let v_damping = this.dy === 0 ? 1 : 0.8
        let s_damping = this.shoot_cool > 0 ? 0.66 : 1
        let k_damping = this.t_knock ? 1.2 : 1

        return v_damping * s_damping * k_damping
    }


    get fall_damping() {
        let shoot_damping = this.shoot_cool > 0 ? 0.36 : 1
        let knock_damping = this.t_knock ? .4 : 1
        return shoot_damping * knock_damping
    }


    get grounded() {
        return this.collide_v > 0
    }

    get is_dead() {
        return this.die_counter >= 0
    }

    _init() {
        this.anim = this.make(Anim, { name: 'main_char' })
    }

    _update() {
        
        if (Time.on_interval(1)) {
            accuracy = Math.min(1, accuracy + 1 / 100)
        }


        if (this.t_knock) {
            this.t_knock = appr(this.t_knock, 0)

            if (this.t_knock === 0) {
                if (this.damage === 0) {
                    this.die_counter = 0
                }
            }
        }
        if (this.die_counter >= 0) {
            this.die_counter += Time.dt
        }

        let is_left = i('ArrowLeft') || i('a')
        let is_right = i('ArrowRight') || i('d')
        let is_jump = i('ArrowUp') || i('w')
        let is_shoot = i(' ') || i('x')

        if (this.is_dead || (this.t_knock && (this.damage === 0 || this.t_knock > 1.8))) {
            is_left = false
            is_right = false
            is_jump = false
            is_shoot = false
        }

        this.is_left = is_left
        this.is_right = is_right


        if ((is_left && is_right) || (!is_left && !is_right)) {
            this.dx = appr(this.dx, 0, Time.dt * 70)
        } else if (is_left) {
            if (this.anim._tag !== 'skid' && this.dx > 0 && this.dx < max_dx * 0.6) {
                this.dx = 0
            }
            let accel = this.dx > 0 ? 40: 30
            this.dx = appr(this.dx, -max_dx, Time.dt * accel)
        } else if (is_right) {
            if (this.anim._tag !== 'skid' && this.dx < 0 && this.dx > -max_dx * 0.6) {
                this.dx = 0
                this.rem_x = 0
            }
            let accel = this.dx < 0 ? 40: 30
            this.dx = appr(this.dx, max_dx, Time.dt * accel)
        } else {
        }

        if (is_jump) {
            if (this._up_counter !== undefined) {
                this._up_counter += Time.dt
            }
        } else {
            if (this._up_counter === undefined) {
                this._up_counter = 0
            } else if (this._up_counter > 0) {
                this._up_counter = -0.16
            }
        }


        if (this._up_counter !== undefined) {
            if (this._up_counter < 0) {
                this._up_counter += Time.dt
                if (this._up_counter >= 0) {
                    this._up_counter = undefined
                }
            }
        }

        if (this.grounded) {
            this._ground_counter = 0
        } else {
            if (this._ground_counter !== -1) {
                if (this.pre_grounded) {
                    this._ground_counter = .16
                }
            }
        }

        if (this._up_counter !== undefined) {
            if (this._up_counter > 0) {
                if (this._ground_counter !== undefined && this._ground_counter >= 0) {
                    this.dy = -max_jump_dy
                    this._up_counter = undefined
                    this._ground_counter = -1
                    this._double_jump_left = 1
                    a.play('jump0')
                } else if (this._double_jump_left > 0) {
                    this.dy = -max_jump_dy * .8
                    this._up_counter = undefined
                    this._double_jump_left = 0

                    a.play('jump' + (Math.random() < 0.3 ? '1' : '2'))
                    this.parent.make(OneTimeAnim, { name: 'fx', tag: 'djump', duration: .3 }, this.x, this.y + 5)
                }
            }
        }

        //console.log(this.grounded, this._ground_counter, this.dy, this.y)

        if (this._ground_counter !== undefined) {
            if (this._ground_counter > 0) {
                this._ground_counter = appr(this._ground_counter, 0)
                if (this._ground_counter === 0) {
                    this._ground_counter = undefined
                }
            }
        }

        if (this.is_dead) {
            this.anim.play_tag('dead')
        } else if (this.t_knock) {
            if (this.damage === 0) {
                this.anim.play_tag('die')
            } else {
                this.anim.play_tag('knock')
                this.visible = this.t_knock % .26 < .1
            }
        } else if (this.ledge_grab) {
            this.anim.play_tag('ledge')
        } else if (this.grounded) {
            if (this.dx !== 0) {
                if (Math.abs(this.dx) > max_dx * 0.2 && ((this.facing < 0 && is_right) || (this.facing > 0 && is_left))) {
                    this.anim.play_tag('skid')
                } else {
                    this.anim.play_tag('run')
                }
                this.anim.scale_x = this.facing
            } else {
                this.anim.play_tag('idle')
            }
        } else {
            if (this.jumping) {
               this.anim.play_tag('jump')
            } else {
                this.anim.play_tag('fall')
            }
        }

        if (Math.sign(this.anim.scale_x) !== this.facing) {
            this.anim.scale_x *= -1
        }

        if (this.jumping) {
            this.anim.scale_x = appr(this.anim.scale_x, this.facing * 0.8, Time.dt * 0.9)
            this.anim.scale_y = appr(this.anim.scale_y, 1.16, Time.dt * 0.9)
        } else {
            this.anim.scale_x = appr(this.anim.scale_x, this.facing)
            this.anim.scale_y = appr(this.anim.scale_y, 1)
        }

        if (!this.ledge_grab && !this.knoll_climb && is_shoot && this.shoot_cool === 0) {

            let f = this.parent!.make(OneTimeAnim, { name: 'bullet', tag: 'flash' + (Math.random() < 0.4 ? '2': ''), duration: .16 })
            f.x = this.x + this.dx
            f.y = this.y - Math.random() * 8
            f.anim.scale_x = this.facing

            let _ = this.parent!.make(Bullet, { has_key: this.has_key }, this.x, f.y)
            _.dx = this.facing * max_dx * 2.5
            _.anim.scale_x = Math.sign(_.dx)
            _.base_x = _.x
            _.distance_long = (this.dx === 0 ? 60 : 110) + Math.random() * 30
            this.shoot_cool = .2
        }
        this.shoot_cool = appr(this.shoot_cool, 0)

        this.pre_grounded = this.grounded
        this.pre_y = this.y

        this.anim.x = - this.shoot_cool * this.facing * 12
    }
}

type BulletData = {
    has_key: boolean
}

class Bullet extends HasPosition {

    get data() {
        return this._data as BulletData
    }

    w = 12
    h = 12
    base_x = 0
    distance_long = 120

    t_hit = false

    get distance() {
        return Math.abs(this.x - this.base_x)
    }

    get fall_damping() {
        return 0
    }

    get v_smooth_damping() {
        return 0.1
    }

    _init() {
        this.anim = this.make(Anim, { name: 'bullet', tag: this.data.has_key ? 'key': 'idle', duration: .1 })

        let r = (0.5 - Math.random()) * 2

        this.dy = (1 - accuracy) * r * (-max_jump_dy * 0.076)

        a.play('bullet' + (Math.abs(r) > 0.5 ? '0' : '1'))

    }


    _update() {

        //this.anim.y += this.dy * Time.dt

        if (this.distance > this.distance_long || this.collide_h !== 0) {
            this.t_hit = true
        }

        if (this.t_hit) {
            this.parent!.make(OneTimeAnim, { name: 'bullet', tag: 'hit', duration: .4, scale: this.anim.scale_x }, this.x + this.anim.x, this.y + this.anim.y)
            this.remove()
        }
    }
}

const solid_tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 24, 25, 26, 27]
const is_solid_n = (n: number) => solid_tiles.includes(n)

/*

const i_random = (max: number) => Math.floor(Math.random() * max)
const arr_random = <T>(arr: Array<T>) => arr[i_random(arr.length)]



function proc_gen_level() {
    let grid = Array(4)
    for (let i = 0; i < 4; i++) {
        grid[i] = Array(4).fill(0)
    }

    let j = 0
    let i = i_random(4)
    let t = 5

    grid[j][i] = t

    let ii = 0, jj = 0
    while (true) {
        if (t === 2) {
            t = i_random(2) + 2
        } else {
            t = i_random(2) + 1
        }

        let u = i_random(5) + 1
        if (u === 1 || u === 2) {
            ii = 1
            jj = 0
        } else if (u === 3 || u === 4) {
            ii = -1
            jj = 0
        } else if (u === 5) {
            ii = 0
            jj = 1
        }
        if (i + ii < 0 || i + ii > 3 || j + jj < 0 || j + jj > 3) {
            ii = 0
            jj = 1
        }

        if (jj === 1) {

            if (j === 3) {
                grid[j][i] = 7
                break
            }

            if (grid[j][i] === 5) {
                grid[j][i] = 6
            } else if (grid[j][i] !== 4) {
                grid[j][i] = 2
            }
        }

        i = i + ii
        j = j + jj


        if (j > 0) {
            let u = grid[j - 1][i]
            if (u === 2 || 4 || 6) {
                t = 4
            }
        }
        if (grid[j][i] === 5 || grid[j][i] === 6) {
            continue;
        }

        grid[j][i] = t
    }

    let te = []

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let t = grid[j][i]
            let l = arr_random(Content.get_levels_of_type(t))

            te.push(...l.te.map((_: {px: [number, number], src: [number, number]}) => ({ px: [_.px[0] + i * 128, _.px[1] + j * 128], src: _.src })))

        }
    }
    console.log(grid, te)

    return {
        w: 64,
        h: 64,
        te
    }
}
    */