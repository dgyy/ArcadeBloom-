import { SCREENW, SCREENH } from "./constants.js";
import { SND_JUMP, SND_DIE } from "./Audio.js";

export class Dot {
  constructor(e, v, a) {
    this.e = e; // Ecom
    this.v = v; // Video
    this.a = a; // Audio
  }
  
  reset() {
    this.x = 0;
    this.y = 0;
    this.gr = 80;
    this.flr = 0; // Wall or ladder from (this.e.wv,ldrv), 1 for screen bottom, 0 if not seated.
    this.flp = 0; // Nonzero if facing right.
    this.clm = 0; // Climbing. Ladder or false.
    this.j = 0; // Jump in progress.
    this.jt = 0; // Jump time remaining.
    this.ded = 0; // Zero if alive, otherwise counts up during fireworks.
    this.af = 0; // Animation frame.
    this.ac = 0; // Animation clock.
  }
  
  setup(x, y) {
    this.x = x;
    this.y = y;
  }
  
  die() {
    if (this.e.wt) return;
    this.e.dc++;
    this.a.snd(SND_DIE);
    this.a.playSong("tts");
    this.ded = 0.001;
  }
  
  jon() {
    if (this.clm || this.flr) {
      this.a.snd(SND_JUMP);
      this.clm = 0;
      this.flr = 0;
      this.j = 1;
      this.jt = 0.375;
    }
  }
  
  joff() {
    this.j = 0;
  }
  
  update(s) {
    if (this.ded) {
      this.ded += s;
      return;
    }
    // If there's extra motion from a platform, Ecom applies it before each update here.
    this.pvy = this.y;
    // Horizontal motion:
    if (this.e.bdx) {
      this.x += this.e.bdx * s * 120; // px/s
      this.flp = this.e.bdx < 0;
      if ((this.ac -= s) <= 0) { // Animate walking.
        this.ac += this.clm ? 0.200 : 0.125;
        if (++this.af >= 4) this.af = 0;
      }
      this.clm = 0;
    } else if (this.e.wt) {
      if ((this.ac -= s) <= 0) {
        this.ac += 0.200;
        if (++this.af >= 2) this.af = 0;
      }
    } else if (!this.clm || this.flr) {
      this.af = 0;
      this.ac = 0;
    }
    // Climb ladders:
    if (this.e.bdy) {
      if (this.clm = this.fldr()) {
        this.y += this.e.bdy * s * 80;
        if (this.y < this.clm.y - 24) this.y = this.clm.y - 24;
        this.x = this.clm.x; // Ladders and Dot both always 16 width.
        this.flr = 0;
        if (!this.e.bdx) if ((this.ac -= s) <= 0) {
          this.ac += 0.200;
          if (++this.af >= 2) this.af = 0;
        }
      }
    }
    // Gravity etc:
    if (this.clm) {
    } else if (this.j && this.jt) {
      this.y -= s * this.jt * 550;
      if ((this.jt -= s) <= 0) {
        this.jt = 0;
      }
    } else if (this.flr === 1) {
      this.y = SCREENH - 24;
    } else if (this.flr) {
      this.y = this.flr.y - 24;
    } else {
      if (this.gr < 160) this.gr += 80 * s;
      this.y += this.gr * s;
    }
    // Resolve collisions and check footing:
    this.collide();
  }
  
  collide() {
    let nflr=0, lc=0, rc=0, uc=0, dc=0;
    // Unceremoniously clamp into screen boundaries:
    if (this.x < 0) {
      this.x = 0;
      lc++;
    } else if (this.x > SCREENW - 16) {
      this.x = SCREENW - 16;
      rc++;
    }
    if (this.y < 0) {
      this.y = 0;
      uc++;
    } else if (this.y >= SCREENH - 24) {
      nflr = 1;
      this.y = SCREENH - 24;
      dc++;
    }
    // Check all walls:
    const pltv = [];
    for (const wl of this.e.wv) {
      const le = wl.x + wl.w - this.x; if (le <= 0) continue;
      const ue = wl.y + wl.h - this.y; if (ue <= 0) continue;
      const re = this.x + 16 - wl.x; if (re <= 0) continue;
      const de = this.y + 24 - wl.y; if (de < 0) continue; // Important: Down edge is < not <=
      if (wl.dx || wl.dy) pltv.push(wl);
      if ((le <= re) && (le <= ue) && (le <= de)) {
        this.x = wl.x + wl.w;
        lc++;
        this.clm = 0;
      } else if ((re <= ue) && (re <= de)) {
        this.x = wl.x - 16;
        rc++;
        this.clm = 0;
      } else if (ue <= de) {
        this.y = wl.y + wl.h;
        uc++;
      } else {
        this.y = wl.y - 24;
        nflr = wl;
        dc++;
      }
    }
    // Ladder top edges also behave like platforms, when we're not climbing.
    if (!this.clm) {
      for (const ldr of this.e.ldrv) {
        if (this.x >= ldr.x + 16) continue;
        if (this.x + 16 <= ldr.x) continue;
        if (this.pvy + 24 > ldr.y) continue;
        if (this.y + 24 < ldr.y) continue;
        this.y = ldr.y - 24;
        nflr = ldr;
        dc++;
      }
    }
    // If we collided from opposite edges, it must be that a platform is bumping us.
    // Reverse direction of all platforms involved in our collision, and push them back a little.
    if ((lc && rc) || (uc && dc)) {
      for (const plt of pltv) {
        plt.dx *= -1;
        plt.dy *= -1;
        plt.x += plt.dx * 0.020;
        plt.y += plt.dy * 0.020;
      }
    }
    // Reset gravity etc when floor changes:
    if (nflr !== this.flr) {
      this.flr = nflr;
      this.gr = 80;
    }
  }
  
  // Find ladder.
  fldr() {
    for (const ldr of this.e.ldrv) {
      if (this.x + 8 < ldr.x) continue;
      if (this.y + 24 < ldr.y) continue; // sic < not <=, important
      if (this.x + 8 >= ldr.x + 16) continue;
      if (this.y > ldr.y + ldr.h) continue;
      return ldr;
    }
    return 0;
  }
  
  render() {
  
    if (this.ded) {
      const mx = this.x + 8;
      const my = this.y + 12;
      const r = this.ded * 80;
      let fr = Math.floor(this.ded * 10) & 3;
      for (let i=0, t=0; i<7; i++, t+=(Math.PI*2)/7) {
        const dx = Math.floor(mx + Math.cos(t) * r - 3.5);
        const dy = Math.floor(my + Math.sin(t) * r - 3.5);
        this.v.blit(dx, dy, fr * 7, 0, 7, 7);
        if (++fr >= 4) fr = 0;
      }
      return;
    }
    
    const dx = Math.round(this.x);
    const dy = Math.round(this.y);
    let srcx = 0;
    let srcy = 7;
    
    if (this.e.wt) {
      srcy += 24;
      if (this.af) srcx += 16;
      if (this.flp) this.v.flop(dx, dy, srcx, srcy, 16, 24);
      else this.v.blit(dx, dy, srcx, srcy, 16, 24);
    } else if (this.clm && !this.flr && (this.y + 24 > this.clm.y)) {
      srcx = 48;
      srcy = 7;
      if (this.af & 1) this.v.blit(dx, dy, srcx, srcy, 16, 24);
      else this.v.flop(dx, dy, srcx, srcy, 16, 24);
    } else {
      if (!this.clm) switch (this.af) {
        case 1: srcx += 16; break;
        case 3: srcx += 32; break;
      }
      if (this.flp) this.v.flop(dx, dy, srcx, srcy, 16, 24);
      else this.v.blit(dx, dy, srcx, srcy, 16, 24);
    }
  }
}
