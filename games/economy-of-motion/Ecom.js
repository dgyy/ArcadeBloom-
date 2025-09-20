/* Ecom.js
 * Starting point for non-generic things. The real game.
 */
 
import { SCREENW, SCREENH } from "./constants.js";
import { BTN_LEFT, BTN_RIGHT, BTN_UP, BTN_DOWN, BTN_A, BTN_B, BTN_START } from "./Input.js";
import { Dot } from "./Dot.js";
 
export class Ecom {
  constructor(g, v, a, i) {
    this.g = g; // Game
    this.v = v; // Video
    this.a = a; // Audio
    this.i = i; // Input
    // Digested button state:
    this.bdx = 0;
    this.bdy = 0;
    this.bj = 0;
    this.bc = 0; // Stroke count since start of level.
    this.pvs = 0;
    // Model state:
    this.dot = new Dot(this, v, a);
    this.wv = []; // {x,y,w,h,dx,dy,c}, walls and platforms
    this.ldrv = []; // {x,y,h}, ladders. Width always 16.
    this.tkv = []; // {x,y,y0,dx,n,t}, tickets, the little "1", "2", "3" for each keystroke.
    this.wz = { x:0, y:0, w:0, h:0 }; // Win zone.
    this.wt = 0; // Win time. Counts up after winning stage.
    this.dt = 0; // Dead time. Counts up.
    this.fin = 0; // Counts up during final menu.
    this.tt = 0; // Total play time.
    this.sc = 0; // Total step count.
    this.dc = 0; // Total death count.
    this.scr = 0; // Score, only populated when (fin).
  }
  
  reset(st) {
    this.st = st;
    this.bdx = 0;
    this.bdy = 0;
    this.bj = 0;
    this.bc = 0;
    this.dot.reset();
    this.wv = [];
    this.ldrv = [];
    this.tkv = [];
    this.wz = { x:0, y:0, w:0, h:0 };
    this.a.playSong("sm");
    const b65 = (s) => {
      s = s.charCodeAt(0);
      if ((s >= 0x41) && (s <= 0x5a)) return s - 0x41;
      if ((s >= 0x61) && (s <= 0x7a)) return s - 0x61 + 26;
      if ((s >= 0x30) && (s <= 0x39)) return s - 0x30 + 52;
      if (s === 0x2b) return 62;
      if (s === 0x2f) return 63;
      if (s === 0x3f) return 64;
      return 0;
    };
    for (let i=0; i<st.length; ) {
      const op = st[i++];
      switch (op) {
      
        case "w": {
            const x = b65(st[i++]) << 2;
            const y = b65(st[i++]) << 2;
            const w = b65(st[i++]) << 2;
            const h = b65(st[i++]) << 2;
            this.wv.push({ x, y, w, h, c: "#040" });
          } break;
          
        case "h": {
            const x = (b65(st[i++]) << 2) - 8;
            const y = (b65(st[i++]) << 2) - 24;
            this.dot.setup(x, y);
          } break;
      
        case "p": {
            const x = b65(st[i++]) << 2;
            const y = b65(st[i++]) << 2;
            const w = b65(st[i++]) << 2;
            const dx = (b65(st[i++]) << 2) - 128;
            const dy = (b65(st[i++]) << 2) - 128;
            this.wv.push({ x, y, w, h:8, dx, dy, hold:0 });
          } break;
      
        case "l": {
            const x = b65(st[i++]) << 2;
            const y = b65(st[i++]) << 2;
            const h = b65(st[i++]) << 2;
            this.ldrv.push({ x, y, h });
          } break;
      
        case "e": {
            const x = b65(st[i++]) << 2;
            const y = b65(st[i++]) << 2;
            const w = b65(st[i++]) << 2;
            const h = b65(st[i++]) << 2;
            this.wz = { x, y, w, h };
          } break;
      }
    }
    this.rbg();
  }
  
  win() {
    if (this.dot.ded) return;
    this.a.playSong("taf", 1);
    this.wt = 0.01;
  }
  
  stk() {
    if (this.bc >= 13) return;
    this.tkv.push({
      x: this.dot.x + 8 - 3.5,
      y: this.dot.y - 8,
      y0: this.dot.y - 8,
      dx: (this.bdx < 0) ? 1 : (this.bdx > 0) ? -1 : this.dot.flp ? 1 : -1,
      t: 0,
      n: this.bc,
    });
    this.sc++;
    if (++this.bc >= 13) {
      this.dot.die();
    }
  }
  
  /* Ecom.victory time= 88.91100000000128 steps= 72 deaths=0 score=0 -- nearly perfect
   * Ecom.victory time=142.38899999999757 steps=163 deaths=4 score=0 -- deliberately screwing around
   * Death is a single bonus, all or nothing.
   * Time and steps should be an open-ended bonus. Be generous.
   * They happen to line up well enough to use 169 as the threshold, cool. (that's 13 squared).
   * Don't cap the time or step scores individually because who knows maybe somebody finds a path I didn't.
   * But do enforce a total cap.
   * Include pity points too, a bonus just for finishing, so you'll never actually see a zero score.
   */
  victory() {
    this.fin = 0.001;
    this.cscr = 13;
    this.ttscr = Math.round(Math.max(0, 170 - this.tt));
    this.scscr = Math.max(0, 170 - this.sc);
    this.dscr = (this.dc ? 0 : 50);
    this.scr = this.cscr + this.ttscr + this.scscr + this.dscr;
  }
  
  restart() {
    this.fin = 0;
    this.tt = 0;
    this.sc = 0;
    this.dc = 0;
    this.scr = 0;
    this.reset(this.g.nextStage());
  }
  
  update(s, state) {
  
    if (this.wt > 0) {
      this.wt += s;
      this.bdx = 0;
      this.bdy = 0;
    }
    if (this.dot.ded) {
      this.dt += s;
    }
    if (this.fin > 0) {
      this.fin += s;
      if (state !== this.pvs) {
        if ((state & BTN_A) && (!(this.pvs & BTN_A)) && (this.fin > 0.5)) {
          this.restart();
        }
        this.pvs = state;
      }
      return;
    }
    if (!this.wt && !this.dot.ded) this.tt += s;
  
    /* Digest input state, track keystrokes.
     */
    if (state !== this.pvs) {
      const kd = (n) => {
        switch (n) {
          case BTN_LEFT: case BTN_UP: return -1;
          case BTN_RIGHT: case BTN_DOWN: return 1;
        }
        return 0;
      };
      if (!this.wt) {
        const ndx = kd(state & (BTN_LEFT | BTN_RIGHT));
        const ndy = kd(state & (BTN_UP | BTN_DOWN));
        if (ndx !== this.bdx) {
          if (this.bdx = ndx) this.stk();
        }
        if (ndy !== this.bdy) {
          if ((this.bdy = ndy) && this.dot.fldr()) this.stk();
        }
      }
      if (state & BTN_A) {
        if (!this.bj) {
          this.bj = 1;
          if (this.wt) {
            this.wt = 0;
            const st = this.g.nextStage();
            if (st) {
              this.reset(st);
            } else {
              this.victory();
              return;
            }
          } else if (this.dot.ded > 0.5) {
            this.reset(this.st);
          } else if (this.dot.ded > 0.0) {
            // Hold
          } else if (!this.wt) {
            this.stk();
            this.dot.jon();
          }
        }
      } else if (this.bj) {
        this.bj = 0;
        this.dot.joff();
      }
      this.pvs = state;
    }
    
    /* Update model.
     */
    for (const wl of this.wv) {
      if (!wl.dx && !wl.dy) continue;
      const dx = wl.dx * s;
      const dy = wl.dy * s;
      wl.x += dx;
      wl.y += dy;
      if (!this.dot.ded && !this.wt && (this.dot.flr === wl)) {
        this.dot.x += dx;
        this.dot.y += dy;
      }
      if (wl.hold > 0) {
        wl.hold -= s;
      } else if (this.ckwl(wl)) {
        wl.x -= dx;
        wl.y -= dy;
      }
    }
    for (let i=this.tkv.length; i-->0; ) {
      const tk = this.tkv[i];
      tk.t += s;
      tk.x += tk.dx * s * 10;
      tk.y = tk.y0 + (tk.t - 0.250) ** 2 * 100;
      if (tk.y > SCREENH) this.tkv.splice(i, 1);
    }
    this.dot.update(s);
    
    /* Check win.
     */
    if (!this.dot.ded && !this.wt) {
      const x = this.dot.x + 8;
      const y = this.dot.y + 12;
      if ((x >= this.wz.x) && (y >= this.wz.y) && (x < this.wz.x + this.wz.w) && (y < this.wz.y + this.wz.h)) {
        this.win();
      }
    }
  }
  
  /* Check moving wall that just moved.
   * If it collides with any other wall, reverse direction and return true.
   */
  ckwl(wl) {
    if ((wl.x < 0) || (wl.x + wl.w >= SCREENW) || (wl.y < 0) || (wl.y + wl.h >= SCREENH)) {
      wl.dx *= -1;
      wl.dy *= -1;
      wl.hold = 0.250;
      return 1;
    }
    for (const o of this.wv) {
      if (o === wl) continue;
      if (o.x >= wl.x + wl.w) continue;
      if (o.y >= wl.y + wl.h) continue;
      if (o.x + o.w <= wl.x) continue;
      if (o.y + o.h <= wl.y) continue;
      wl.dx *= -1;
      wl.dy *= -1;
      wl.hold = 0.250;
      return 1;
    }
    return 0;
  }
  
  rfin() {
    this.v.rect(0, 0, SCREENW, SCREENH, "#466");
    this.v.blit( 80, 40, 32, 31, 37, 5);                                     this.v.decint(160, 40, this.cscr, 3);
    this.v.blit(100, 47, 32, 36, 17, 5); this.v.decint(120, 47, this.tt, 5); this.v.decint(160, 47, this.ttscr, 3);
    this.v.blit( 93, 54, 32, 41, 24, 5); this.v.decint(120, 54, this.sc, 5); this.v.decint(160, 54, this.scscr, 3);
    this.v.blit( 93, 61, 32, 46, 24, 5); this.v.decint(120, 61, this.dc, 5); this.v.decint(160, 61, this.dscr, 3);
    this.v.decint(160, 70, this.scr, 3);
    this.v.rect(160, 68, 17, 1, "#888");
    this.v.blit(60, 60, ((this.fin * 5) & 1) ? 16 : 0, 31, 16, 24);
  }
  
  render() {
    if (this.fin) return this.rfin();
    this.v.bg();
    for (const wl of this.wv) {
      if (wl.c) continue;
      let x = Math.round(wl.x);
      let y = Math.round(wl.y);
      for (let subx=x+8, i=Math.floor(wl.w/8)-2; i-->0; subx+=8) {
        this.v.blit(subx, y, 88, 7, 8, 8);
      }
      this.v.blit(x, y, 80, 7, 8, 8);
      this.v.flop(x + wl.w - 8, y, 79, 7, 8, 8);
    }
    this.dot.render();
    for (const tk of this.tkv) {
      this.v.blit(Math.floor(tk.x), Math.floor(tk.y), 28 + tk.n * 7, 0, 7, 7);
    }
    this.v.blit(1, SCREENH - 6, 88 + Math.floor(this.bc / 10) * 3, 15, 3, 5);
    this.v.blit(5, SCREENH - 6, 88 + (this.bc % 10) * 3, 15, 3, 5);
    if (this.wt) {
      this.v.rect(99, 137, 58, 6, ((this.wt * 2) & 1) ? "#000" : "#084");
      this.v.blit(100, 138, 64, 23, 56, 4);
    } else if (this.dot.ded) {
      this.v.rect(99, 137, 64, 6, ((this.dt * 2) & 1) ? "#000" : "#408");
      this.v.blit(100, 138, 64, 27, 62, 4);
    }
  }
  
  rbg() {
    const gx = this.wz.x + (this.wz.w>>1), gy = this.wz.y + (this.wz.h>>1);
    const grd = this.v.bc.createRadialGradient(gx, gy, 1, gx, gy, SCREENW);
    grd.addColorStop(0, "#ace");
    grd.addColorStop(1, "#46a");
    this.v.bc.fillStyle = grd;
    this.v.bc.fillRect(0, 0, SCREENW, SCREENH);
    
    /* Walls.
     * First generate a bitmap representing 4x4-pixel tiles, the smallest unit we draw. (wall positions and sizes must be multiples of 4).
     * Include a border, which is all ON. So we don't have to check bounds.
     */
    const colc = (SCREENW >> 2) + 2;
    const rowc = (SCREENH >> 2) + 2;
    const bm = new Uint8Array(colc * rowc);
    for (let x=0; x<colc; x++) bm[x] = bm[colc*rowc-x] = 1;
    for (let y=0; y<rowc; y++) bm[y*colc] = bm[(y+1)*colc-1] = 1;
    for (const wl of this.wv) {
      if (!wl.c) continue;
      const x=(wl.x>>2)+1, y=(wl.y>>2)+1, w=wl.w>>2, h=wl.h>>2;
      let rp = y*colc+x;
      for (let yi=h; yi-->0; rp+=colc) {
        for (let xp=rp, xi=w; xi-->0; xp++) bm[xp] = 1;
      }
    }
    
    /* Now ignore the wall objects and draw it from the bitmap.
     * Neighbor detection is a snap.
     */
    for (let y=0, rp=colc+1, yi=SCREENH>>2; yi-->0; rp+=colc, y+=4) {
      for (let x=0, xp=rp, xi=SCREENW>>2; xi-->0; xp++, x+=4) {
        if (!bm[xp]) continue;
        const nw=bm[xp-colc-1], n=bm[xp-colc], ne=bm[xp-colc+1],
              w=bm[xp-1], e=bm[xp+1],
              sw=bm[xp+colc-1], s=bm[xp+colc], se=bm[xp+colc+1];
        if (n && w && e && s) {
          if (nw && ne && sw && se) { // All neighbors present.
            this.v.bblit(x, y, 120, 7, 4, 4);
          } else if (!nw) { // It's not possible for more than one corner to be missing.
            this.v.bblit(x, y, 108, 11, 4, 4);
          } else if (!ne) {
            this.v.bblit(x, y, 104, 11, 4, 4);
          } else if (!sw) {
            this.v.bblit(x, y, 108, 7, 4, 4);
          } else {
            this.v.bblit(x, y, 104, 7, 4, 4);
          }
        } else if (n && w && e) { // 3 cardinals: flat edge.
          this.v.bblit(x, y, 112, 7, 4, 4);
        } else if (n && w && s) {
          this.v.bblit(x, y, 116, 11, 4, 4);
        } else if (n && e && s) {
          this.v.bblit(x, y, 112, 11, 4, 4);
        } else if (w && e && s) {
          this.v.bblit(x, y, 116, 7, 4, 4);
        } else if (n && w) { // 2 cardinals: corner.
          this.v.bblit(x, y, 100, 11, 4, 4);
        } else if (n && e) {
          this.v.bblit(x, y, 96, 11, 4, 4);
        } else if (w && s) {
          this.v.bblit(x, y, 100, 7, 4, 4);
        } else if (e && s) {
          this.v.bblit(x, y, 96, 7, 4, 4);
        } else { // Nothing else should be possible. But we do have a singleton tile just in case.
          this.v.bblit(x, y, 124, 11, 4, 4);
        }
      }
    }
    
    // Ladders.
    for (const ldr of this.ldrv) {
      const x = Math.round(ldr.x);
      let y = Math.round(ldr.y + ldr.h); // Bottom.
      while (y > ldr.y) {
        y -= 6;
        this.v.bblit(x, y, 64, 7, 16, 6);
      }
    }
    
    // Overlay checkered flag just below the win zone.
    let x = this.wz.x + 8;
    const y = this.wz.y + this.wz.h;
    let i = (this.wz.w - 16) / 8;
    for (; i-->0; x+=8) this.v.bblit(x, y, 72, 15, 8, 8);
    this.v.bblit(this.wz.x, y, 64, 15, 8, 8);
    this.v.bblit(this.wz.x + this.wz.w - 8, y, 80, 15, 8, 8);
  }
}
