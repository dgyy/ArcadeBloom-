class Mouse {

  bounds!: ClientRect
  _click?: [number, number]

  _click_clear = true

  _move?: [number, number]
  _move_clear = true

  get click() {
    return this._click
  }

  get move() {
    return this._move
  }

  on_move(p: [number, number]) {
    this._move_clear = false
    this._move = p
  }

  on_click(p: [number, number]) {
    this._click_clear = false
    this._click = p
  }

  listen(element: HTMLElement) {
    const ep = (e: MouseEvent) => {
      let p = [e.clientX, e.clientY] as [number, number]
      let { bounds } = this
      p[0] -= bounds.left
      p[1] -= bounds.top
      p[0] /= bounds.width
      p[1] /= bounds.height

      return p
    }

    element.addEventListener('click', e => this.on_click(ep(e)))

    element.addEventListener('mousemove', e => this.on_move(ep(e)))

    const on_resize = () => {
      this.bounds = element.getBoundingClientRect()
    }

    document.addEventListener('scroll', on_resize)
    window.addEventListener('resize', on_resize)
    on_resize()
  }

  update() {
    if (this._click_clear) {
      if (this._click) {
        this._click_clear = false
        this._click = undefined
      }
    } else {
      if (this._click) {
        this._click_clear = true
      }
    }

    if (this._move_clear) {
      if (this._move) {
        this._move_clear = false
        this._move = undefined
      }
    } else {
      if (this._move) {
        this._move_clear = true
      }
    }
  }
}

export default new Mouse()
