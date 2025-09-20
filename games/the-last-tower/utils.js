export class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  /**
   * @param {number} multiplier
   */
  scale(multiplier) {
    this.x *= multiplier;
    this.y *= multiplier;
    return this;
  }

  normalize() {
    const len = vecLen(this);
    this.x /= len;
    this.y /= len;
    return this;
  }

  /**
   * @param {Vec2} v
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /** @param {Vec2} v  */
  dotProduct(v) {
    return this.x * v.x + this.y * v.y;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * @param {Vec2} to
   */
  direction(to) {
    return new Vec2(this.x, this.y).sub(to).normalize();
  }
}

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @returns
 */
export function angleBetweenVectors(a, b) {
  return Math.acos(a.dotProduct(b) / (a.length * b.length));
}

export class Collider {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  constructor(x, y, w, h, isTrigger = false) {
    this.pos = new Vec2(x, y);
    this.size = new Vec2(w, h);
    this.isTrigger = isTrigger;
  }
}

export function debounce(fn, time) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), time);
  };
}

/**
 * @param {NumVec2} vec
 */
export function vecLen(vec) {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

/**
 * @param {NumVec2} a
 * @param {NumVec2} b
 */
export function vecSub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function vecNorm(v) {
  const len = vecLen(v);
  return { x: v.x / len, y: v.y / len };
}

/**
 * @param {import("./utils.js").NumVec2} pos - this param is mutated
 * @param {import("./utils.js").NumVec2} target
 * @param {number} speed
 */
export function moveTowards(pos, target, speed) {
  const vec = vecSub(target, pos);
  const len = vecLen(vec);
  const moveByVecPercent = speed / len;
  pos.x += moveByVecPercent * vec.x;
  pos.y += moveByVecPercent * vec.y;
  return pos;
}

/**
 * @param {Vec2} pos - this param is mutated
 * @param {Vec2} target
 * @param {number} speed
 */
export function moveAlongDirection(pos, target, speed) {
  const dir = vecNorm(target);
  pos.x = pos.x + speed * dir.x;
  pos.y = pos.y + speed * dir.y;
  return pos;
}

export function set(obj, path, value) {
  const segments = path.split(".");
  const lastKey = segments.pop();
  let beforeLastRef = obj;
  for (const s of segments) {
    if (!beforeLastRef[s]) {
      beforeLastRef[s] = {};
    }
    beforeLastRef = beforeLastRef[s];
  }
  beforeLastRef[lastKey] = value;
}

/**
 * @param {Collider} c
 */
export function changeColliderAnchorToTopLeft(c) {
  return new Collider(c.pos.x - c.size.x / 2, c.pos.y + c.size.y / 2, c.size.x, c.size.y, c.isTrigger);
}
