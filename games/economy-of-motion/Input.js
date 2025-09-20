/* Input.js
 * This example input manager is suitable for one-player games with (Dpad,A,B,Start) and no mouse or touch.
 * If you need remapping, multiplayer, more buttons, or alternate devices, this might still be an OK place to start.
 */

export const BTN_LEFT = 1,
  BTN_RIGHT = 2,
  BTN_UP = 4,
  BTN_DOWN = 8,
  BTN_A = 16,
  BTN_B = 32,
  BTN_START = 64;
  
const KMap = {
  ArrowLeft: BTN_LEFT,
  KeyA: BTN_LEFT,
  ArrowRight: BTN_RIGHT,
  KeyD: BTN_RIGHT,
  ArrowUp: BTN_UP,
  KeyW: BTN_UP,
  ArrowDown: BTN_DOWN,
  KeyS: BTN_DOWN,
  Space: BTN_A,
  KeyZ: BTN_A,
  Comma: BTN_B,
  KeyX: BTN_B,
  Enter: BTN_START,
//  Numpad4: BTN_LEFT,
//  Numpad6: BTN_RIGHT,
//  Numpad8: BTN_UP,
//  Numpad5: BTN_DOWN,
//  Numpad2: BTN_DOWN,
//  Numpad0: BTN_A,
//  NumpadEnter: BTN_B,
//  NumpadAdd: BTN_START,
};

export class Input {
  constructor() {
    this.state = 0;
    this.gp = [];
    this.kh = {}; // "Key Handlers": key eg "KeyA", value: function. Hard-mapped keys don't participate.
    this.kl = evt => this.onKey(evt);
    window.addEventListener("keydown", this.kl);
    window.addEventListener("keyup", this.kl);
    // Not going to listen for gamepadconnected and gamepaddisconnected -- We'll leak a little when gamepads get disconnected.
  }
  
  end() {
    if (this.kl) {
      window.removeEventListener("keydown", this.kl);
      window.removeEventListener("keyup", this.kl);
      this.kl = null;
    }
    this.gp = [];
    this.state = 0;
  }
  
  update() {
    this.ugp();
    return this.state;
  }
  
  onKey(e) {
    if (e.repeat) {
      if (KMap[e.code]) {
        e.stopPropagation();
        e.preventDefault();
      }
      return;
    }
    if (e.ctrlKey || e.altKey) return;
    e.stopPropagation();
    e.preventDefault();
    const value = e.type === "keydown";
    const bi = KMap[e.code];
    if (bi) return this.setState(bi, value);
    if (!value) return;
    this.kh[e.code]?.();
  }
  
  ugp() {
    for (const src of navigator?.getGamepads?.() || []) {
      if (!src) continue;
      let gamepad = this.gp[src.index];
      if (!gamepad) {
        gamepad = this.gp[src.index] = {
          axes: src.axes.map(v => 0),
          buttons: src.buttons.map(v => 0),
          state: 0,
        };
      }
      
      /* We'll assume standard mapping in all cases, no matter what the device is actually doing.
       * We are not allowing for dynamic remapping.
       */
      const thr = 0.25;
      const cka = (ix, idl, idh) => {
        const nv = (src.axes[ix] > thr) ? 1 : (src.axes[ix] < -thr) ? -1 : 0;
        if (nv === gamepad.axes[ix]) return;
             if (gamepad.axes[ix] < 0) this.setState(idl, 0, gamepad);
        else if (gamepad.axes[ix] > 0) this.setState(idh, 0, gamepad);
        gamepad.axes[ix] = nv;
             if (gamepad.axes[ix] < 0) this.setState(idl, 1, gamepad);
        else if (gamepad.axes[ix] > 0) this.setState(idh, 1, gamepad);
      };
      cka(0, BTN_LEFT, BTN_RIGHT);
      cka(1, BTN_UP, BTN_DOWN);
      const ckb = (ix, id) => {
        if (src.buttons[ix].value) {
          if (gamepad.buttons[ix]) return;
          gamepad.buttons[ix] = 1;
          this.setState(id, 1, gamepad);
        } else {
          if (!gamepad.buttons[ix]) return;
          gamepad.buttons[ix] = 0;
          this.setState(id, 0, gamepad);
        }
      };
      ckb(0, BTN_A); // South
      ckb(1, BTN_B); // East
      ckb(2, BTN_B); // West
      ckb(8, BTN_START); // Select
      ckb(9, BTN_START); // Start
      ckb(12, BTN_UP);
      ckb(13, BTN_DOWN);
      ckb(14, BTN_LEFT);
      ckb(15, BTN_RIGHT);
    }
  }
  
  setState(btnid, value, gamepad) {
    if (gamepad) {
      if (value) {
        if (gamepad.state & btnid) return;
        gamepad.state |= btnid;
      } else {
        if (!(gamepad.state & btnid)) return;
        gamepad.state &= ~btnid;
      }
    }
    if (value) {
      if (this.state & btnid) return;
      this.state |= btnid;
    } else {
      if (!(this.state & btnid)) return;
      this.state &= ~btnid;
    }
  }
}
