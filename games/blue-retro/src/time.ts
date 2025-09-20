const modf = (x: number, m: number) => {
  return x - Math.floor(x / m) * m
}

export class Time {


  ticks_per_second: number = 1000
  ticks: number = 0
  seconds: number = 0
  delta: number = 0
  previous_ticks: number = 0
  previous_seconds: number = 0
  pause_timer: number = 0

  pause_for(duration: number) {
    if (duration >= this.pause_timer) {
      this.pause_timer = duration
    }
  }

  on_interval(interval: number, offset: number = 0) {

    let time = this.seconds
    let delta = this.delta

    let last = Math.floor((time - offset - delta) / interval)
    let next = Math.floor((time - offset) / interval)
    return last < next
  }

  on_time(time: number, timestamp: number) {
    let c = Math.floor(time) - this.delta
    return time >= timestamp && c < timestamp
  }


  between_interval(interval: number, offset: number = 0) {
    let time = this.seconds

    return modf(time - offset, interval * 2) >= interval
  }
}

export default new Time()
