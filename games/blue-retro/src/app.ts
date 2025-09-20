import Time from './time'

type Config = {
  on_update: () => void,
  on_render: () => void
}

class App {

  app_time_last?: number
  app_time_accumulator: number = 0

  run(config: Config) {

    const on_update = () => {
      config.on_update()
    }

    const on_render = () => {
      config.on_render()
    }

    const _step = () => {
      on_update()
    }

    const step = (ticks_curr: number) => {
      let ticks_diff = Math.min(
        25,
        ticks_curr - (this.app_time_last ?? ticks_curr)
      )
      this.app_time_last = ticks_curr
      this.app_time_accumulator += ticks_diff

      Time.delta = ticks_diff / Time.ticks_per_second

      if (Time.pause_timer > 0) {
        Time.pause_timer -= Time.delta
      } else {
        Time.previous_ticks = Time.ticks
        Time.ticks += ticks_diff
        Time.previous_seconds = Time.seconds
        Time.seconds += Time.delta

        _step()
      }

      on_render()

      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }
}

export default new App()
