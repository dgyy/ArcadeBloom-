import { Vec2, Circle } from './math'

export type RigidOptions = {
    mass: number,
    air_friction: number,
    max_speed: number,
    max_force: number,
    x0: number,
    y0: number
}

/* https://github.com/a327ex/SNKRX/blob/master/engine/math/vector.lua#L202 */
export function truncate(a: number, max: number) {
  let s = (max * max) / (a * a)
  s = (s > 1 && 1) || Math.sqrt(s)
  return a * s
}

class Rigid {

    force: Vec2
    x: Vec2
    x0: Vec2
    vx: Vec2

    m_left: number

    constructor(public opts: RigidOptions) {
        this.force = Vec2.zero
        this.x = Vec2.make(opts.x0, opts.y0)
        this.x0 = this.x
        this.vx = Vec2.zero
        this.m_left = this.opts.max_force
    }


    update(dt: number, dt0: number) {

        let { opts: { air_friction, mass, max_force } } = this

        let { force, x, x0 } = this

        let a = force.scale(1/mass)

        a.x = truncate(a.x, max_force)
        a.y = truncate(a.y, max_force)
        let v0_x = x.sub(x0)
        let new_vx = v0_x.scale(air_friction * dt / dt0).add(a.scale(dt * (dt + dt0) / 2))
        let new_x0 = x,
        new_x = x.add(new_vx)


        this.x0 = new_x0
        this.x = new_x
        this.vx = new_vx


        this.force = Vec2.zero
        this.m_left = max_force
    }


    add_force(v_f: Vec2) {
        let v_i = Math.min(this.m_left, v_f.length)

        this.m_left -= v_i

        v_f = v_f.normalize.scale(v_i)

        this.force = this.force.add(v_f)
    }

    lock_force(v_f: Vec2) {
      this.force = this.force.mul(v_f)
    }

    get position() {
        return this.x
    }

    get velocity() {
        return this.vx
    }

    get heading() {
        let heading = this.velocity.normalize
        return heading.length === 0 ? Vec2.unit: heading
    }

    get side() {
        return this.heading.perpendicular
    }

    get max_speed() {
        return this.opts.max_speed
    }
}


export type Behavior = (body: Rigid) => Vec2
export type WeightedBehavior = [Behavior, number]

export class SteerBehaviors {

    static NoSteer = (_: Rigid) => Vec2.zero
    static OrbitSteer = (target: Vec2) => (body: Rigid) => orbit_steer(body.position, target, body.max_speed)
    static SeparationSteer = (group: Vec2[]) => (body: Rigid) => separation_steer(body.position, group, body.max_speed)
    static AvoidCircleSteer = (target: Circle, zero_angle: number = 0) => (body: Rigid) => avoid_circle_steer(body.position, target, body.max_speed, zero_angle)
    static FleeSteer = (target: Vec2, zero_angle: number = 0, amplitude = 100) => (body: Rigid) => flee_steer(body.position, target, body.max_speed, zero_angle, amplitude)
    static ArriveSteer = (target: Vec2, slowing_distance = 100) => (body: Rigid) => arrive_steer(body.position, target, body.max_speed, slowing_distance)

    get position() {
        return this.body.position
    }

    body: Rigid

    lock_force = Vec2.unit

    get opts() {
      return this.body.opts
    }

    set opts(opts: RigidOptions) {
      this.body.opts = opts
    }

    constructor(opts: RigidOptions, public bs: Array<WeightedBehavior>) {

        this.body = new Rigid(opts)
    }


    update(dt: number, dt0: number) {
        this.bs.forEach(([b, w]) => {
            let desired_vel = b(this.body)
            let steering = desired_vel
            .sub(this.body.velocity)
            .scale(this.opts.max_force / this.opts.max_speed)

            this.body.add_force(steering.scale(w))
        })

        this.body.lock_force(this.lock_force)
        this.body.update(dt, dt0)
    }
}


function orbit_steer(position: Vec2, target: Vec2, max_speed: number) {
  let target_offset = position.sub(target)
  let out = target_offset.scale(target_offset.length < 200 ? 1 : -1).normalize
 return target_offset.perpendicular.normalize.add(out).scale(max_speed / 2)
  

}

function separation_steer(position: Vec2, group: Array<Vec2>, max_speed: number) {
  let res = Vec2.zero
  group.forEach(neighbour => {
    let toAgent = position.sub(neighbour)
    res = res.add(toAgent.normalize.scale(1/(toAgent.length||0.1)))
  })

  return res.scale(max_speed * 15)
}


function avoid_circle_steer(position: Vec2, target: Circle, max_speed: number, zero_angle: number) {
  return flee_steer(position, target.o, max_speed, zero_angle, target.r * 1.2)
}

function flee_steer(position: Vec2, target: Vec2, max_speed: number, zero_angle: number, slowing_distance: number) {
  let target_offset = position.sub(target)
  let distance = target_offset.length
  if (distance > slowing_distance) {
    return Vec2.zero
  }

  if (target_offset.length === 0) {
    target_offset = target_offset.add_angle(zero_angle)
  }
  return target_offset.normalize.scale(max_speed)
}

function arrive_steer(position: Vec2, target: Vec2, max_speed: number, slowing_distance: number) {
  let target_offset = target.sub(position)
  let distance = target_offset.length
  if (distance < 20) {
    return Vec2.zero
  }
  let ramped_speed = max_speed * (distance / slowing_distance)
  let clipped_speed = Math.min(ramped_speed, max_speed)
  let desired_velocity = target_offset.scale(clipped_speed / distance) 
  return desired_velocity
}
