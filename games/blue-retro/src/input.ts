type Action = string

type KeyPress = 'down' | 'up'

class ActionListener {
  static make = () => new ActionListener()

  get btnp() {
    return this._btn_pre
  }

  get btn() {
    return this._btn > 0
  }

  _btn_pre = false
  _btn = 0


  act(act: KeyPress) {
    if (act === 'down') {
      this._btn = 1
    } else {
      this._btn = 0
    }
  }

  update() {
    if (this._btn === 1 && !this._btn_pre) {
      this._btn_pre = true
    } else {
      this._btn_pre = false
    }

    if (this._btn === 1) {
      this._btn = 2
    }
  }


}

class Input {
  
  action_map: Record<Action, ActionListener>
  key_map: Record<string, Action>

  constructor() {

    this.action_map = {
      'jump': ActionListener.make(),
      'left': ActionListener.make(),
      'right': ActionListener.make(),
      'down': ActionListener.make(),
      'pickup': ActionListener.make(),
      'music': ActionListener.make()
    }

    this.key_map = {
      'i': 'jump',
      'j': 'left',
      'k': 'down',
      'l': 'right',
      'w': 'jump',
      'a': 'left',
      's': 'down',
      'd': 'right',
      'ArrowUp': 'jump',
      'ArrowLeft': 'left',
      'ArrowDown': 'down',
      'ArrowRight': 'right',
      'x': 'pickup',
      'c': 'pickup',
      ' ': 'pickup',
      'm': 'music'
    }
    document.addEventListener('keydown', e =>
      this.action_map[this.key_map[e.key]]?.act('down')
    )
    document.addEventListener('keyup', e =>
      this.action_map[this.key_map[e.key]]?.act('up')
    )

  }

  btnp(action: Action) {
    return this.action_map[action].btnp
  }

  btn(action: Action) {
    return this.action_map[action].btn
  }

  update() {
    for (let action of Object.keys(this.action_map)) {
      this.action_map[action].update()
    }
  }

}

export default new Input()
