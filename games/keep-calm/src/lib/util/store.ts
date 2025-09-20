
export let writable = <T>(initial: T) => {
  let fns: ((update: T) => void)[] = []

  return {
    current: initial,
    set(value: T) {
      this.current = value
      for (let fn of fns) fn(value)
    },
    update(fn: (value: T) => void) {
      fn(this.current)
      for (let fn of fns) fn(this.current)
    },
    subscribe(fn: (update: T) => void) {
      fns.push(fn)
      fn(this.current)
    }
  }
}
