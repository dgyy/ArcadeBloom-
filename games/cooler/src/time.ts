const Time = {
    dt0: 16,
    dt: 16,
    time: 0,
    t_slow: 0,
    on_interval(interval: number, offset = 0) {
      let { dt, time } = this

      let last = Math.floor((time - offset - dt) / interval)
      let next = Math.floor((time - offset) / interval)
      return last < next
    }
}

export function my_loop(cb: () => void) {

  let last_t: number
  const step = (t: number) => {
    Time.dt0 = Time.dt
    Time.dt = Math.min(20, Math.max(16, last_t ? t - last_t : 16)) / 1000
    if (Time.t_slow > 0) {
      Time.t_slow -= Time.dt
      Time.dt *= .5
    }
    last_t = t
    Time.time += Time.dt

    cb()
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}


export default Time