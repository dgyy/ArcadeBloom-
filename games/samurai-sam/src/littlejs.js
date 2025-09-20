/*
    LittleJS - Debug Build
    MIT License - Copyright 2021 Frank Force
*/

/**
 * LittleJS Debug System
 * <br> - Press ~ to show debug overlay with mouse pick
 * <br> - Number keys toggle debug functions
 * <br> - +/- apply time scale
 * <br> - Debug primitive rendering
 * <br> - Save a 2d canvas as an image
 * @namespace Debug
 */

'use strict';

/** True if debug is enabled
 *  @type {Boolean}
 *  @default
 *  @memberof Debug */
const debug = 0;

// Engine internal variables not exposed to documentation
let debugOverlay = 0,
  debugPhysics = 0;

///////////////////////////////////////////////////////////////////////////////
// Debug helper functions

///////////////////////////////////////////////////////////////////////////////
// Engine debug function (called automatically)

/**
 * LittleJS Utility Classes and Functions
 * <br> - General purpose math library
 * <br> - Vector2 - fast, simple, easy 2D vector class
 * <br> - Color - holds a rgba color with some math functions
 * <br> - Timer - tracks time automatically
 * @namespace Utilities
 */

('use strict');

/** A shortcut to get Math.PI
 *  @type {Number}
 *  @default Math.PI
 *  @memberof Utilities */
const PI = Math.PI;

/** Returns absoulte value of value passed in
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const abs = (a) => (a < 0 ? -a : a);

/** Returns lowest of two values passed in
 *  @param {Number} valueA
 *  @param {Number} valueB
 *  @return {Number}
 *  @memberof Utilities */
const min = (a, b) => (a < b ? a : b);

/** Returns highest of two values passed in
 *  @param {Number} valueA
 *  @param {Number} valueB
 *  @return {Number}
 *  @memberof Utilities */
const max = (a, b) => (a > b ? a : b);

/** Returns the sign of value passed in (also returns 1 if 0)
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const sign = (a) => (a < 0 ? -1 : 1);

/** Returns first parm modulo the second param, but adjusted so negative numbers work as expected
 *  @param {Number} dividend
 *  @param {Number} [divisor=1]
 *  @return {Number}
 *  @memberof Utilities */
const mod = (a, b = 1) => ((a % b) + b) % b;

/** Clamps the value beween max and min
 *  @param {Number} value
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const clamp = (v, min = 0, max = 1) => (v < min ? min : v > max ? max : v);

/** Returns what percentage the value is between max and min
 *  @param {Number} value
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const percent = (v, min = 0, max = 1) => (max - min ? clamp((v - min) / (max - min)) : 0);

/** Linearly interpolates the percent value between max and min
 *  @param {Number} percent
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const lerp = (p, min = 0, max = 1) => min + clamp(p) * (max - min);

/** Applies smoothstep function to the percentage value
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const smoothStep = (p) => p * p * (3 - 2 * p);

/** Returns true if two axis aligned bounding boxes are overlapping
 *  @param {Vector2} pointA  - Center of box A
 *  @param {Vector2} sizeA   - Size of box A
 *  @param {Vector2} pointB  - Center of box B
 *  @param {Vector2} [sizeB] - Size of box B
 *  @return {Boolean}        - True if overlapping
 *  @memberof Utilities */
const isOverlapping = (pA, sA, pB, sB) => abs(pA.x - pB.x) * 2 < sA.x + sB.x && abs(pA.y - pB.y) * 2 < sA.y + sB.y;

/** Returns an oscillating wave between 0 and amplitude with frequency of 1 Hz by default
 *  @param {Number} [frequency=1] - Frequency of the wave in Hz
 *  @param {Number} [amplitude=1] - Amplitude (max height) of the wave
 *  @param {Number} [t=time]      - Value to use for time of the wave
 *  @return {Number}              - Value waving between 0 and amplitude
 *  @memberof Utilities */
const wave = (frequency = 1, amplitude = 1, t = time) => (amplitude / 2) * (1 - Math.cos(t * frequency * 2 * PI));

/** Formats seconds to mm:ss style for display purposes
 *  @param {Number} t - time in seconds
 *  @return {String}
 *  @memberof Utilities */
const formatTime = (t) => ((t / 60) | 0) + ':' + (t % 60 < 10 ? '0' : '') + (t % 60 | 0);

///////////////////////////////////////////////////////////////////////////////

/** Random global functions
 *  @namespace Random */

/** Returns a random value between the two values passed in
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
const rand = (a = 1, b = 0) => b + (a - b) * Math.random();

/** Returns a floored random value the two values passed in
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
const randInt = (a = 1, b = 0) => rand(a, b) | 0;

/** Randomly returns either -1 or 1
 *  @return {Number}
 *  @memberof Random */
const randSign = () => randInt(2) * 2 - 1;

/** Returns a random Vector2 within a circular shape
 *  @param {Number} [radius=1]
 *  @param {Number} [minRadius=0]
 *  @return {Vector2}
 *  @memberof Random */
const randInCircle = (radius = 1, minRadius = 0) =>
  radius > 0 ? randVector(radius * rand(minRadius / radius, 1) ** 0.5) : new Vector2();

/** Returns a random Vector2 with the passed in length
 *  @param {Number} [length=1]
 *  @return {Vector2}
 *  @memberof Random */
const randVector = (length = 1) => new Vector2().setAngle(rand(2 * PI), length);

///////////////////////////////////////////////////////////////////////////////

/**
 * Create a 2d vector, can take another Vector2 to copy, 2 scalars, or 1 scalar
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @return {Vector2}
 * @example
 * let a = vec2(0, 1); // vector with coordinates (0, 1)
 * let b = vec2(a);    // copy a into b
 * a = vec2(5);        // set a to (5, 5)
 * b = vec2();         // set b to (0, 0)
 * @memberof Utilities
 */
const vec2 = (x = 0, y) => (x.x == undefined ? new Vector2(x, y == undefined ? x : y) : new Vector2(x.x, x.y));

/**
 * 2D Vector object with vector math library
 * <br> - Functions do not change this so they can be chained together
 * @example
 * let a = new Vector2(2, 3); // vector with coordinates (2, 3)
 * let b = new Vector2;       // vector with coordinates (0, 0)
 * let c = vec2(4, 2);        // use the vec2 function to make a Vector2
 * let d = a.add(b).scale(5); // operators can be chained
 */
class Vector2 {
  /** Create a 2D vector with the x and y passed in, can also be created with vec2()
   *  @param {Number} [x=0] - X axis location
   *  @param {Number} [y=0] - Y axis location */
  constructor(x = 0, y = 0) {
    /** @property {Number} - X axis location */
    this.x = x;
    /** @property {Number} - Y axis location */
    this.y = y;
  }

  /** Returns a new vector that is a copy of this
   *  @return {Vector2} */
  copy() {
    return new Vector2(this.x, this.y);
  }

  /** Returns a copy of this vector plus the vector passed in
   *  @param {Vector2} vector
   *  @return {Vector2} */
  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /** Returns a copy of this vector minus the vector passed in
   *  @param {Vector2} vector
   *  @return {Vector2} */
  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /** Returns a copy of this vector times the vector passed in
   *  @param {Vector2} vector
   *  @return {Vector2} */
  multiply(v) {
    return new Vector2(this.x * v.x, this.y * v.y);
  }

  /** Returns a copy of this vector divided by the vector passed in
   *  @param {Vector2} vector
   *  @return {Vector2} */
  divide(v) {
    return new Vector2(this.x / v.x, this.y / v.y);
  }

  /** Returns a copy of this vector scaled by the vector passed in
   *  @param {Number} scale
   *  @return {Vector2} */
  scale(s) {
    return new Vector2(this.x * s, this.y * s);
  }

  /** Returns the length of this vector
   * @return {Number} */
  length() {
    return this.lengthSquared() ** 0.5;
  }

  /** Returns the length of this vector squared
   * @return {Number} */
  lengthSquared() {
    return this.x ** 2 + this.y ** 2;
  }

  /** Returns the distance from this vector to vector passed in
   * @param {Vector2} vector
   * @return {Number} */
  distance(v) {
    return this.distanceSquared(v) ** 0.5;
  }

  /** Returns the distance squared from this vector to vector passed in
   * @param {Vector2} vector
   * @return {Number} */
  distanceSquared(v) {
    return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
  }

  /** Returns a new vector in same direction as this one with the length passed in
   * @param {Number} [length=1]
   * @return {Vector2} */
  normalize(length = 1) {
    const l = this.length();
    return l ? this.scale(length / l) : new Vector2(0, length);
  }

  /** Returns a new vector clamped to length passed in
   * @param {Number} [length=1]
   * @return {Vector2} */
  clampLength(length = 1) {
    const l = this.length();
    return l > length ? this.scale(length / l) : this;
  }

  /** Returns the dot product of this and the vector passed in
   * @param {Vector2} vector
   * @return {Number} */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /** Returns the cross product of this and the vector passed in
   * @param {Vector2} vector
   * @return {Number} */
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  /** Returns the angle of this vector, up is angle 0
   * @return {Number} */
  angle() {
    return Math.atan2(this.x, this.y);
  }

  /** Sets this vector with angle and length passed in
   * @param {Number} [angle=0]
   * @param {Number} [length=1]
   * @return {Vector2} */
  setAngle(a = 0, length = 1) {
    this.x = length * Math.sin(a);
    this.y = length * Math.cos(a);
    return this;
  }

  /** Returns copy of this vector rotated by the angle passed in
   * @param {Number} angle
   * @return {Vector2} */
  rotate(a) {
    const c = Math.cos(a),
      s = Math.sin(a);
    return new Vector2(this.x * c - this.y * s, this.x * s + this.y * c);
  }

  /** Returns the integer direction of this vector, corrosponding to multiples of 90 degree rotation (0-3)
   * @return {Number} */
  direction() {
    return abs(this.x) > abs(this.y) ? (this.x < 0 ? 3 : 1) : this.y < 0 ? 2 : 0;
  }

  /** Returns a copy of this vector that has been inverted
   * @return {Vector2} */
  invert() {
    return new Vector2(this.y, -this.x);
  }

  /** Returns a copy of this vector with each axis floored
   * @return {Vector2} */
  floor() {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }

  /** Returns the area this vector covers as a rectangle
   * @return {Number} */
  area() {
    return abs(this.x * this.y);
  }

  /** Returns a new vector that is p percent between this and the vector passed in
   * @param {Vector2} vector
   * @param {Number}  percent
   * @return {Vector2} */
  lerp(v, p) {
    return this.add(v.subtract(this).scale(clamp(p)));
  }

  /** Returns true if this vector is within the bounds of an array size passed in
   * @param {Vector2} arraySize
   * @return {Boolean} */
  arrayCheck(arraySize) {
    return this.x >= 0 && this.y >= 0 && this.x < arraySize.x && this.y < arraySize.y;
  }

  /** Returns this vector expressed as a string
   * @param {float} digits - precision to display
   * @return {String} */
  toString(digits = 3) {}
}

///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////

/**
 * Timer object tracks how long has passed since it was set
 * @example
 * let a = new Timer;    // creates a timer that is not set
 * a.set(3);             // sets the timer to 3 seconds
 *
 * let b = new Timer(1); // creates a timer with 1 second left
 * b.unset();            // unsets the timer
 */
class Timer {
  /** Create a timer object set time passed in
   *  @param {Number} [timeLeft] - How much time left before the timer elapses in seconds */
  constructor(timeLeft) {
    this.time = timeLeft == undefined ? undefined : time + timeLeft;
    this.setTime = timeLeft;
  }

  /** Set the timer with seconds passed in
   *  @param {Number} [timeLeft=0] - How much time left before the timer is elapsed in seconds */
  set(timeLeft = 0) {
    this.time = time + timeLeft;
    this.setTime = timeLeft;
  }

  /** Unset the timer */
  unset() {
    this.time = undefined;
  }

  /** Returns true if set
   * @return {Boolean} */
  isSet() {
    return this.time != undefined;
  }

  /** Returns true if set and has not elapsed
   * @return {Boolean} */
  active() {
    return time <= this.time;
  }

  /** Returns true if set and elapsed
   * @return {Boolean} */
  elapsed() {
    return time > this.time;
  }

  /** Get how long since elapsed, returns 0 if not set (returns negative if currently active)
   * @return {Number} */
  get() {
    return this.isSet() ? time - this.time : 0;
  }

  /** Get percentage elapsed based on time it was set to, returns 0 if not set
   * @return {Number} */
  getPercent() {
    return this.isSet() ? percent(this.time - time, this.setTime, 0) : 0;
  }

  /** Returns this timer expressed as a string
   * @return {String} */
  toString() {}

  /** Get how long since elapsed, returns 0 if not set (returns negative if currently active)
   * @return {Number} */
  valueOf() {
    return this.get();
  }
}
/**
 * LittleJS Engine Settings
 * @namespace Settings
 */

('use strict');

///////////////////////////////////////////////////////////////////////////////
// Camera settings

/** Position of camera in world space
 *  @type {Vector2}
 *  @default Vector2()
 *  @memberof Settings */
let cameraPos = vec2();

/** Scale of camera in world space
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let cameraScale = 32;

///////////////////////////////////////////////////////////////////////////////
// Display settings

/** The max size of the canvas, centered if window is larger
 *  @type {Vector2}
 *  @default Vector2(1920,1200)
 *  @memberof Settings */
let canvasMaxSize = vec2(1920, 1200);

/** Fixed size of the canvas, if enabled canvas size never changes
 * - you may also need to set mainCanvasSize if using screen space coords in startup
 *  @type {Vector2}
 *  @default Vector2()
 *  @memberof Settings */
let canvasFixedSize = vec2();

/** Disables anti aliasing for pixel art if true
 *  @type {Boolean}
 *  @default
 *  @memberof Settings */
let cavasPixelated = 1;

/** Default font used for text rendering
 *  @type {String}
 *  @default
 *  @memberof Settings */
let fontDefault = 'arial';

///////////////////////////////////////////////////////////////////////////////
// WebGL settings

///////////////////////////////////////////////////////////////////////////////
// Tile sheet settings

///////////////////////////////////////////////////////////////////////////////
// Object settings

/** Enable physics solver for collisions between objects
 *  @type {Boolean}
 *  @default
 *  @memberof Settings */
let enablePhysicsSolver = 1;

/** Default object mass for collison calcuations (how heavy objects are)
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let objectDefaultMass = 1;

/** How much to slow velocity by each frame (0-1)
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let objectDefaultDamping = 1;

/** How much to slow angular velocity each frame (0-1)
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let objectDefaultAngleDamping = 1;

/** How much to bounce when a collision occurs (0-1)
 *  @type {Number}
 *  @default 0
 *  @memberof Settings */
let objectDefaultElasticity = 0;

/** How much to slow when touching (0-1)
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let objectDefaultFriction = 0.8;

/** Clamp max speed to avoid fast objects missing collisions
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let objectMaxSpeed = 1;

/** How much gravity to apply to objects along the Y axis, negative is down
 *  @type {Number}
 *  @default 0
 *  @memberof Settings */
let gravity = 0;

///////////////////////////////////////////////////////////////////////////////
// Input settings

/** If true the WASD keys are also routed to the direction keys (for better accessability)
 *  @type {Boolean}
 *  @default
 *  @memberof Settings */
let inputWASDEmulateDirection = 1;

///////////////////////////////////////////////////////////////////////////////
// Audio settings

/** All audio code can be disabled and removed from build
 *  @type {Boolean}
 *  @default
 *  @memberof Settings */
let soundEnable = 1;

/** Volume scale to apply to all sound, music and speech
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let soundVolume = 0.5;

/** Default range where sound no longer plays
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let soundDefaultRange = 40;

/** Default range percent to start tapering off sound (0-1)
 *  @type {Number}
 *  @default
 *  @memberof Settings */
let soundDefaultTaper = 0.7;

('use strict');

/**
 * LittleJS Object Base Object Class
 * <br> - Base object class used by the engine
 * <br> - Automatically adds self to object list
 * <br> - Will be updated and rendered each frame
 * <br> - Renders as a sprite from a tilesheet by default
 * <br> - Can have color and addtive color applied
 * <br> - 2d Physics and collision system
 * <br> - Sorted by renderOrder
 * <br> - Objects can have children attached
 * <br> - Parents are updated before children, and set child transform
 * <br> - Call destroy() to get rid of objects
 * <br>
 * <br>The physics system used by objects is simple and fast with some caveats...
 * <br> - Collision uses the axis aligned size, the object's rotation angle is only for rendering
 * <br> - Objects are guaranteed to not intersect tile collision from physics
 * <br> - If an object starts or is moved inside tile collision, it will not collide with that tile
 * <br> - Collision for objects can be set to be solid to block other objects
 * <br> - Objects may get pushed into overlapping other solid objects, if so they will push away
 * <br> - Solid objects are more performance intensive and should be used sparingly
 * @example
 * // create an engine object, normally you would first extend the class with your own
 * const pos = vec2(2,3);
 * const object = new EngineObject(pos);
 */
class EngineObject {
  /** Create an engine object and adds it to the list of objects
   *  @param {Vector2} [position=Vector2()]        - World space position of the object
   *  @param {Vector2} [size=Vector2(1,1)]         - World space size of the object
   *  @param {Number}  [tileIndex=-1]              - Tile to use to render object (-1 is untextured)
   *  @param {Vector2} [tileSize=1]  - Size of tile in source pixels
   *  @param {Number}  [angle=0]                   - Angle the object is rotated by
   *  @param {Number}  [renderOrder=0]             - Objects sorted by renderOrder before being rendered
   */
  constructor(pos = vec2(), size = vec2(1), tileIndex = -1, tileSize = 1, angle = 0, color, renderOrder = 0) {
    // set passed in params

    /** @property {Vector2} - World space position of the object */
    this.pos = pos.copy();
    /** @property {Vector2} - World space width and height of the object */
    this.size = size;
    /** @property {Vector2} - Size of object used for drawing, uses size if not set */
    this.drawSize;
    /** @property {Number}  - Tile to use to render object (-1 is untextured) */
    this.tileIndex = tileIndex;
    /** @property {Vector2} - Size of tile in source pixels */
    this.tileSize = tileSize;
    /** @property {Number}  - Angle to rotate the object */
    this.angle = angle;
    /** @property {Color}   - Color to apply when rendered */
    this.color = color;
    /** @property {Color}   - Additive color to apply when rendered */
    this.additiveColor;

    // set object defaults
    /** @property {Number} [mass=objectDefaultMass]                 - How heavy the object is, static if 0 */
    this.mass = objectDefaultMass;
    /** @property {Number} [damping=objectDefaultDamping]           - How much to slow down velocity each frame (0-1) */
    this.damping = objectDefaultDamping;
    /** @property {Number} [angleDamping=objectDefaultAngleDamping] - How much to slow down rotation each frame (0-1) */
    this.angleDamping = objectDefaultAngleDamping;
    /** @property {Number} [elasticity=objectDefaultElasticity]     - How bouncy the object is when colliding (0-1) */
    this.elasticity = objectDefaultElasticity;
    /** @property {Number} [friction=objectDefaultFriction]         - How much friction to apply when sliding (0-1) */
    this.friction = objectDefaultFriction;
    /** @property {Number} [gravityScale=1]                         - How much to scale gravity by for this object */
    this.gravityScale = 1;
    /** @property {Number} [renderOrder=0]                          - Objects are sorted by render order */
    this.renderOrder = renderOrder;
    /** @property {Vector2} [velocity=Vector2()]                    - Velocity of the object */
    this.velocity = new Vector2();
    /** @property {Number} [angleVelocity=0]                        - Angular velocity of the object */
    this.angleVelocity = 0;

    // init other internal object stuff
    this.spawnTime = time;
    this.children = [];
    this.collideTiles = 1;

    // add to list of objects
    engineObjects.push(this);
  }

  /** Update the object transform and physics, called automatically by engine once each frame */
  update() {
    const parent = this.parent;
    if (parent) {
      // copy parent pos/angle
      this.pos = this.localPos.multiply(vec2(parent.getMirrorSign(), 1)).rotate(-parent.angle).add(parent.pos);
      this.angle = parent.getMirrorSign() * this.localAngle + parent.angle;
      return;
    }

    // limit max speed to prevent missing collisions
    this.velocity.x = clamp(this.velocity.x, -objectMaxSpeed, objectMaxSpeed);
    this.velocity.y = clamp(this.velocity.y, -objectMaxSpeed, objectMaxSpeed);

    // apply physics
    const oldPos = this.pos.copy();
    this.velocity.y += gravity * this.gravityScale;
    this.pos.x += this.velocity.x *= this.damping;
    this.pos.y += this.velocity.y *= this.damping;
    this.angle += this.angleVelocity *= this.angleDamping;

    // physics sanity checks

    if (!enablePhysicsSolver || !this.mass)
      // do not update collision for fixed objects
      return;

    const wasMovingDown = this.velocity.y < 0;
    if (this.groundObject) {
      // apply friction in local space of ground object
      const groundSpeed = this.groundObject.velocity ? this.groundObject.velocity.x : 0;
      this.velocity.x = groundSpeed + (this.velocity.x - groundSpeed) * this.friction;
      this.groundObject = 0;
      //debugOverlay && debugPhysics && debugPoint(this.pos.subtract(vec2(0,this.size.y/2)), '#0f0');
    }

    if (this.collideSolidObjects) {
      // check collisions against solid objects
      const epsilon = 0.001; // necessary to push slightly outside of the collision
      for (const o of engineObjectsCollide) {
        // non solid objects don't collide with eachother
        if (!this.isSolid & !o.isSolid || o.destroyed || o.parent || o == this) continue;

        // check collision
        if (!isOverlapping(this.pos, this.size, o.pos, o.size)) continue;

        // pass collision to objects
        if (!this.collideWithObject(o) | !o.collideWithObject(this)) continue;

        if (isOverlapping(oldPos, this.size, o.pos, o.size)) {
          // if already was touching, try to push away
          const deltaPos = oldPos.subtract(o.pos);
          const length = deltaPos.length();
          const pushAwayAccel = 0.001; // push away if already overlapping
          const velocity = length < 0.01 ? randVector(pushAwayAccel) : deltaPos.scale(pushAwayAccel / length);
          this.velocity = this.velocity.add(velocity);
          if (o.mass)
            // push away if not fixed
            o.velocity = o.velocity.subtract(velocity);

          debugOverlay && debugPhysics && debugAABB(this.pos, this.size, o.pos, o.size, '#f00');
          continue;
        }

        // check for collision
        const sizeBoth = this.size.add(o.size);
        const smallStepUp = (oldPos.y - o.pos.y) * 2 > sizeBoth.y + gravity; // prefer to push up if small delta
        const isBlockedX = abs(oldPos.y - o.pos.y) * 2 < sizeBoth.y;
        const isBlockedY = abs(oldPos.x - o.pos.x) * 2 < sizeBoth.x;
        const elasticity = max(this.elasticity, o.elasticity);

        if (smallStepUp | isBlockedY | !isBlockedX) {
          // resolve y collision
          // push outside object collision
          this.pos.y = o.pos.y + (sizeBoth.y / 2 + epsilon) * sign(oldPos.y - o.pos.y);
          if ((o.groundObject && wasMovingDown) || !o.mass) {
            // set ground object if landed on something
            if (wasMovingDown) this.groundObject = o;

            // bounce if other object is fixed or grounded
            this.velocity.y *= -elasticity;
          } else if (o.mass) {
            // inelastic collision
            const inelastic = (this.mass * this.velocity.y + o.mass * o.velocity.y) / (this.mass + o.mass);

            // elastic collision
            const elastic0 =
              (this.velocity.y * (this.mass - o.mass)) / (this.mass + o.mass) +
              (o.velocity.y * 2 * o.mass) / (this.mass + o.mass);
            const elastic1 =
              (o.velocity.y * (o.mass - this.mass)) / (this.mass + o.mass) +
              (this.velocity.y * 2 * this.mass) / (this.mass + o.mass);

            // lerp betwen elastic or inelastic based on elasticity
            this.velocity.y = lerp(elasticity, inelastic, elastic0);
            o.velocity.y = lerp(elasticity, inelastic, elastic1);
          }
        }
        if (!smallStepUp & isBlockedX) {
          // resolve x collision
          // push outside collision
          this.pos.x = o.pos.x + (sizeBoth.x / 2 + epsilon) * sign(oldPos.x - o.pos.x);
          if (o.mass) {
            // inelastic collision
            const inelastic = (this.mass * this.velocity.x + o.mass * o.velocity.x) / (this.mass + o.mass);

            // elastic collision
            const elastic0 =
              (this.velocity.x * (this.mass - o.mass)) / (this.mass + o.mass) +
              (o.velocity.x * 2 * o.mass) / (this.mass + o.mass);
            const elastic1 =
              (o.velocity.x * (o.mass - this.mass)) / (this.mass + o.mass) +
              (this.velocity.x * 2 * this.mass) / (this.mass + o.mass);

            // lerp betwen elastic or inelastic based on elasticity
            this.velocity.x = lerp(elasticity, inelastic, elastic0);
            o.velocity.x = lerp(elasticity, inelastic, elastic1);
          } // bounce if other object is fixed
          else this.velocity.x *= -elasticity;
        }
        debugOverlay && debugPhysics && debugAABB(this.pos, this.size, o.pos, o.size, '#f0f');
      }
    }
  }

  /** Render the object, draws a tile by default, automatically called each frame, sorted by renderOrder */
  render() {
    // default object render
  }

  /** Destroy this object, destroy it's children, detach it's parent, and mark it for removal */
  destroy() {
    if (this.destroyed) return;

    // disconnect from parent and destroy chidren
    this.destroyed = 1;
    this.parent && this.parent.removeChild(this);
    for (const child of this.children) child.destroy((child.parent = 0));
  }

  /** Called to check if a object collision should be resolved
   *  @param {EngineObject} object - the object to test against
   *  @return {Boolean}            - true if the collision should be resolved
   */
  collideWithObject(o) {
    return 1;
  }

  /** How long since the object was created
   *  @return {Number} */
  getAliveTime() {
    return time - this.spawnTime;
  }

  /** Apply acceleration to this object (adjust velocity, not affected by mass)
   *  @param {Vector2} acceleration */
  applyAcceleration(a) {
    if (this.mass) this.velocity = this.velocity.add(a);
  }

  /** Apply force to this object (adjust velocity, affected by mass)
   *  @param {Vector2} force */
  applyForce(force) {
    this.applyAcceleration(force.scale(1 / this.mass));
  }

  /** Get the direction of the mirror
   *  @return {Number} -1 if this.mirror is true, or 1 if not mirrored */
  getMirrorSign() {
    return this.mirror ? -1 : 1;
  }

  /** Attaches a child to this with a given local transform
   *  @param {EngineObject} child
   *  @param {Vector2}      [localPos=Vector2()]
   *  @param {Number}       [localAngle=0] */
  addChild(child, localPos = vec2(), localAngle = 0) {
    this.children.push(child);
    child.parent = this;
    child.localPos = localPos.copy();
    child.localAngle = localAngle;
  }

  /** Removes a child from this one
   *  @param {EngineObject} child */
  removeChild(child) {
    this.children.splice(this.children.indexOf(child), 1);
    child.parent = 0;
  }

  /** Returns string containg info about this object for debugging
   *  @return {String} */
  toString() {}
}

('use strict');

/** The primary 2D canvas visible to the user
 *  @type {HTMLCanvasElement}
 *  @memberof Draw */
let mainCanvas;

/** 2d context for mainCanvas
 *  @type {CanvasRenderingContext2D}
 *  @memberof Draw */
let mainContext;

/** A canvas that appears on top of everything the same size as mainCanvas
 *  @type {HTMLCanvasElement}
 *  @memberof Draw */
let overlayCanvas;

/** 2d context for overlayCanvas
 *  @type {CanvasRenderingContext2D}
 *  @memberof Draw */
let overlayContext;

/** The size of the main canvas (and other secondary canvases)
 *  @type {Vector2}
 *  @memberof Draw */
let mainCanvasSize = vec2();

/** Convert from screen to world space coordinates
 *  - if calling outside of render, you may need to manually set mainCanvasSize
 *  @param {Vector2} screenPos
 *  @return {Vector2}
 *  @memberof Draw */
const screenToWorld = (screenPos) => {
  return screenPos
    .add(vec2(0.5))
    .subtract(mainCanvasSize.scale(0.5))
    .multiply(vec2(1 / cameraScale, -1 / cameraScale))
    .add(cameraPos);
};

/** Convert from world to screen space coordinates
 *  - if calling outside of render, you may need to manually set mainCanvasSize
 *  @param {Vector2} worldPos
 *  @return {Vector2}
 *  @memberof Draw */
const worldToScreen = (worldPos) => {
  return worldPos
    .subtract(cameraPos)
    .multiply(vec2(cameraScale, -cameraScale))
    .add(mainCanvasSize.scale(0.5))
    .subtract(vec2(0.5));
};

/** Draw directly to a 2d canvas context in world space
 *  @param {Vector2}  pos
 *  @param {Vector2}  size
 *  @param {Number}   angle
 *  @param {Boolean}  mirror
 *  @param {Function} drawFunction
 *  @param {CanvasRenderingContext2D} [context=mainContext]
 *  @memberof Draw */
function drawCanvas2D(pos, size, angle, mirror, drawFunction, context = mainContext) {
  // create canvas transform from world space to screen space
  pos = worldToScreen(pos);
  size = size.scale(cameraScale);
  context.save();
  context.translate((pos.x + 0.5) | 0, (pos.y + 0.5) | 0);
  context.rotate(angle);
  context.scale(mirror ? -size.x : size.x, size.y);
  drawFunction(context);
  context.restore();
}
// Fullscreen mode

/** Returns true if fullscreen mode is active
 *  @return {Boolean}
 *  @memberof Draw */
const isFullscreen = () => document.fullscreenElement;

/** Toggle fullsceen mode
 *  @memberof Draw */
function toggleFullscreen() {
  if (isFullscreen()) {
    if (document.exitFullscreen) document.exitFullscreen();
  } else if (document.body.requestFullscreen) document.body.requestFullscreen();
}

/**
 * LittleJS Input System
 * <br> - Tracks key down, pressed, and released
 * <br> - Also tracks mouse buttons, position, and wheel
 * <br> - Supports multiple gamepads
 * <br> - Virtual gamepad for touch devices with touchGamepadSize
 * @namespace Input
 */

('use strict');

/** Returns true if device key is down
 *  @param {Number} key
 *  @param {Number} [device=0]
 *  @return {Boolean}
 *  @memberof Input */
const keyIsDown = (key, device = 0) => inputData[device] && inputData[device][key] & 1;

/** Returns true if device key was pressed this frame
 *  @param {Number} key
 *  @param {Number} [device=0]
 *  @return {Boolean}
 *  @memberof Input */
const keyWasPressed = (key, device = 0) => (inputData[device] && inputData[device][key] & 2 ? 1 : 0);

/** Returns true if device key was released this frame
 *  @param {Number} key
 *  @param {Number} [device=0]
 *  @return {Boolean}
 *  @memberof Input */
const keyWasReleased = (key, device = 0) => (inputData[device] && inputData[device][key] & 4 ? 1 : 0);

/** Clears all input
 *  @memberof Input */
const clearInput = () => (inputData = [[]]);

/** Returns true if mouse button is down
 *  @function
 *  @param {Number} button
 *  @return {Boolean}
 *  @memberof Input */
const mouseIsDown = keyIsDown;

/** Returns true if mouse button was pressed
 *  @function
 *  @param {Number} button
 *  @return {Boolean}
 *  @memberof Input */
const mouseWasPressed = keyWasPressed;

/** Returns true if mouse button was released
 *  @function
 *  @param {Number} button
 *  @return {Boolean}
 *  @memberof Input */
const mouseWasReleased = keyWasReleased;

/** Mouse pos in world space
 *  @type {Vector2}
 *  @memberof Input */
let mousePos = vec2();

/** Mouse pos in screen space
 *  @type {Vector2}
 *  @memberof Input */
let mousePosScreen = vec2();

/** Mouse wheel delta this frame
 *  @type {Number}
 *  @memberof Input */
let mouseWheel = 0;

/** Prevents input continuing to the default browser handling (false by default)
 *  @type {Boolean}
 *  @memberof Input */
let preventDefaultInput = 0;

///////////////////////////////////////////////////////////////////////////////
// Input update called by engine

// store input as a bit field for each key: 1 = isDown, 2 = wasPressed, 4 = wasReleased
// mouse and keyboard are stored together in device 0, gamepads are in devices > 0
let inputData = [[]];

function inputUpdate() {
  // clear input when lost focus (prevent stuck keys)
  isTouchDevice || document.hasFocus() || clearInput();

  // update mouse world space position
  mousePos = screenToWorld(mousePosScreen);
}

function inputUpdatePost() {
  // clear input to prepare for next frame
  for (const deviceInputData of inputData) for (const i in deviceInputData) deviceInputData[i] &= 1;
  mouseWheel = 0;
}

///////////////////////////////////////////////////////////////////////////////
// Keyboard event handlers

onkeydown = (e) => {
  e.repeat || (inputData[0][remapKey(e.which)] = 3);
  preventDefaultInput && e.preventDefault();
};
onkeyup = (e) => {
  inputData[0][remapKey(e.which)] = 4;
};
const remapKey = (c) =>
  inputWASDEmulateDirection ? (c == 87 ? 38 : c == 83 ? 40 : c == 65 ? 37 : c == 68 ? 39 : c) : c;

///////////////////////////////////////////////////////////////////////////////
// Mouse event handlers

onmousedown = (e) => {
  inputData[0][e.button] = 3;
  onmousemove(e);
  e.button && e.preventDefault();
};
onmouseup = (e) => (inputData[0][e.button] = (inputData[0][e.button] & 2) | 4);
onmousemove = (e) => (mousePosScreen = mouseToScreen(e));
onwheel = (e) => e.ctrlKey || (mouseWheel = sign(e.deltaY));
oncontextmenu = (e) => !1; // prevent right click menu

// convert a mouse or touch event position to screen space
const mouseToScreen = (mousePos) => {
  if (!mainCanvas) return vec2(); // fix bug that can occur if user clicks before page loads

  const rect = mainCanvas.getBoundingClientRect();
  return vec2(mainCanvas.width, mainCanvas.height).multiply(
    vec2(percent(mousePos.x, rect.left, rect.right), percent(mousePos.y, rect.top, rect.bottom))
  );
};

///////////////////////////////////////////////////////////////////////////////
// Touch input

/** True if a touch device has been detected
 *  @memberof Input */
const isTouchDevice = window.ontouchstart !== undefined;

// try to enable touch mouse
if (isTouchDevice) {
  // override mouse events
  let wasTouching,
    mouseDown = onmousedown,
    mouseUp = onmouseup;
  onmousedown = onmouseup = () => 0;

  // setup touch input
  ontouchstart = (e) => {
    // fix mobile audio, force it to play a sound on first touch
    zzfx(0);

    // handle all touch events the same way
    ontouchstart =
      ontouchmove =
      ontouchend =
        (e) => {
          e.button = 0; // all touches are left click

          // check if touching and pass to mouse events
          const touching = e.touches.length;
          if (touching) {
            // set event pos and pass it along
            e.x = e.touches[0].clientX;
            e.y = e.touches[0].clientY;
            wasTouching ? onmousemove(e) : mouseDown(e);
          } else if (wasTouching) mouseUp(e);

          // set was touching
          wasTouching = touching;

          // must return true so the document will get focus
          return true;
        };

    return ontouchstart(e);
  };
}

/**
 * LittleJS Audio System
 * <br> - <a href=https://killedbyapixel.github.io/ZzFX/>ZzFX Sound Effects</a>
 * <br> - <a href=https://keithclark.github.io/ZzFXM/>ZzFXM Music</a>
 * <br> - Caches sounds and music for fast playback
 * <br> - Can attenuate and apply stereo panning to sounds
 * <br> - Ability to play mp3, ogg, and wave files
 * <br> - Speech synthesis wrapper functions
 */

('use strict');

/**
 * Sound Object - Stores a zzfx sound for later use and can be played positionally
 * <br>
 * <br><b><a href=https://killedbyapixel.github.io/ZzFX/>Create sounds using the ZzFX Sound Designer.</a></b>
 * @example
 * // create a sound
 * const sound_example = new Sound([.5,.5]);
 *
 * // play the sound
 * sound_example.play();
 */
class Sound {
  /** Create a sound object and cache the zzfx samples for later use
   *  @param {Array}  zzfxSound - Array of zzfx parameters, ex. [.5,.5]
   *  @param {Number} [range=soundDefaultRange] - World space max range of sound, will not play if camera is farther away
   *  @param {Number} [taper=soundDefaultTaper] - At what percentage of range should it start tapering off
   */
  constructor(zzfxSound, range = soundDefaultRange, taper = soundDefaultTaper) {
    if (!soundEnable) return;

    /** @property {Number} - World space max range of sound, will not play if camera is farther away */
    this.range = range;

    /** @property {Number} - At what percentage of range should it start tapering off */
    this.taper = taper;

    // get randomness from sound parameters
    this.randomness = zzfxSound[1] || 0;
    zzfxSound[1] = 0;

    // generate sound now for fast playback
    this.cachedSamples = zzfxG(...zzfxSound);
  }

  /** Play the sound
   *  @param {Vector2} [pos] - World space position to play the sound, sound is not attenuated if null
   *  @param {Number}  [volume=1] - How much to scale volume by (in addition to range fade)
   *  @param {Number}  [pitch=1] - How much to scale pitch by (also adjusted by this.randomness)
   *  @param {Number}  [randomnessScale=1] - How much to scale randomness
   *  @return {AudioBufferSourceNode} - The audio, can be used to stop sound later
   */
  play(pos, volume = 1, pitch = 1, randomnessScale = 1) {
    if (!soundEnable) return;

    let pan;
    if (pos) {
      const range = this.range;
      if (range) {
        // apply range based fade
        const lengthSquared = cameraPos.distanceSquared(pos);
        if (lengthSquared > range * range) return; // out of range

        // attenuate volume by distance
        volume *= percent(lengthSquared ** 0.5, range, range * this.taper);
      }

      // get pan from screen space coords
      pan = (worldToScreen(pos).x * 2) / mainCanvas.width - 1;
    }

    // play the sound
    const playbackRate = pitch + pitch * this.randomness * randomnessScale * rand(-1, 1);
    return playSamples([this.cachedSamples], volume, playbackRate, pan);
  }

  /** Play the sound as a note with a semitone offset
   *  @param {Number}  semitoneOffset - How many semitones to offset pitch
   *  @param {Vector2} [pos] - World space position to play the sound, sound is not attenuated if null
   *  @param {Number}  [volume=1] - How much to scale volume by (in addition to range fade)
   *  @return {AudioBufferSourceNode} - The audio, can be used to stop sound later
   */
  playNote(semitoneOffset, pos, volume) {
    if (!soundEnable) return;

    return this.play(pos, volume, 2 ** (semitoneOffset / 12), 0);
  }
}

/**
 * Music Object - Stores a zzfx music track for later use
 * <br>
 * <br><b><a href=https://keithclark.github.io/ZzFXM/>Create music with the ZzFXM tracker.</a></b>
 * @example
 * // create some music
 * const music_example = new Music(
 * [
 *     [                         // instruments
 *       [,0,400]                // simple note
 *     ],
 *     [                         // patterns
 *         [                     // pattern 1
 *             [                 // channel 0
 *                 0, -1,        // instrument 0, left speaker
 *                 1, 0, 9, 1    // channel notes
 *             ],
 *             [                 // channel 1
 *                 0, 1,         // instrument 1, right speaker
 *                 0, 12, 17, -1 // channel notes
 *             ]
 *         ],
 *     ],
 *     [0, 0, 0, 0], // sequence, play pattern 0 four times
 *     90            // BPM
 * ]);
 *
 * // play the music
 * music_example.play();
 */
class Music {
  /** Create a music object and cache the zzfx music samples for later use
   *  @param {Array} zzfxMusic - Array of zzfx music parameters
   */
  constructor(zzfxMusic) {
    if (!soundEnable) return;

    this.cachedSamples = zzfxM(...zzfxMusic);
  }

  /** Play the music
   *  @param {Number}  [volume=1] - How much to scale volume by
   *  @param {Boolean} [loop=1] - True if the music should loop when it reaches the end
   *  @return {AudioBufferSourceNode} - The audio node, can be used to stop sound later
   */
  play(volume, loop = 1) {
    if (!soundEnable) return;

    return (this.source = playSamples(this.cachedSamples, volume, 1, 0, loop));
  }

  /** Stop the music */
  stop() {
    if (this.source) this.source.stop();
    this.source = 0;
  }

  /** Check if music is playing
   *  @return {Boolean}
   */
  isPlaying() {
    return this.source;
  }
}

/** Play an mp3 or wav audio from a local file or url
 *  @param {String}  url - Location of sound file to play
 *  @param {Number}  [volume=1] - How much to scale volume by
 *  @param {Boolean} [loop=1] - True if the music should loop when it reaches the end
 *  @return {HTMLAudioElement} - The audio element for this sound
 *  @memberof Audio */
function playAudioFile(url, volume = 1, loop = 1) {
  if (!soundEnable) return;

  const audio = new Audio(url);
  audio.volume = soundVolume * volume;
  audio.loop = loop;
  audio.play();
  return audio;
}

/** Speak text with passed in settings
 *  @param {String} text - The text to speak
 *  @param {String} [language] - The language/accent to use (examples: en, it, ru, ja, zh)
 *  @param {Number} [volume=1] - How much to scale volume by
 *  @param {Number} [rate=1] - How quickly to speak
 *  @param {Number} [pitch=1] - How much to change the pitch by
 *  @return {SpeechSynthesisUtterance} - The utterance that was spoken
 *  @memberof Audio */
function speak(text, language = '', volume = 1, rate = 1, pitch = 1) {
  if (!soundEnable || !speechSynthesis) return;

  // common languages (not supported by all browsers)
  // en - english,  it - italian, fr - french,  de - german, es - spanish
  // ja - japanese, ru - russian, zh - chinese, hi - hindi,  ko - korean

  // build utterance and speak
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.volume = 2 * volume * soundVolume;
  utterance.rate = rate;
  utterance.pitch = pitch;
  speechSynthesis.speak(utterance);
  return utterance;
}

/** Stop all queued speech
 *  @memberof Audio */
const speakStop = () => speechSynthesis && speechSynthesis.cancel();

/** Get frequency of a note on a musical scale
 *  @param {Number} semitoneOffset - How many semitones away from the root note
 *  @param {Number} [rootNoteFrequency=220] - Frequency at semitone offset 0
 *  @return {Number} - The frequency of the note
 *  @memberof Audio */
const getNoteFrequency = (semitoneOffset, rootFrequency = 220) => rootFrequency * 2 ** (semitoneOffset / 12);

///////////////////////////////////////////////////////////////////////////////

/** Audio context used by the engine
 *  @memberof Audio */
let audioContext;

/** Play cached audio samples with given settings
 *  @param {Array}   sampleChannels - Array of arrays of samples to play (for stereo playback)
 *  @param {Number}  [volume=1] - How much to scale volume by
 *  @param {Number}  [rate=1] - The playback rate to use
 *  @param {Number}  [pan=0] - How much to apply stereo panning
 *  @param {Boolean} [loop=0] - True if the sound should loop when it reaches the end
 *  @return {AudioBufferSourceNode} - The audio node of the sound played
 *  @memberof Audio */
function playSamples(sampleChannels, volume = 1, rate = 1, pan = 0, loop = 0) {
  if (!soundEnable) return;

  // create audio context
  if (!audioContext) audioContext = new AudioContext();

  // fix stalled audio
  audioContext.resume();

  // prevent sounds from building up if they can't be played
  if (audioContext.state != 'running') return;

  // create buffer and source
  const buffer = audioContext.createBuffer(sampleChannels.length, sampleChannels[0].length, zzfxR),
    source = audioContext.createBufferSource();

  // copy samples to buffer and setup source
  sampleChannels.forEach((c, i) => buffer.getChannelData(i).set(c));
  source.buffer = buffer;
  source.playbackRate.value = rate;
  source.loop = loop;

  // create and connect gain node (createGain is more widely spported then GainNode construtor)
  const gainNode = audioContext.createGain();
  gainNode.gain.value = soundVolume * volume;
  gainNode.connect(audioContext.destination);

  // connect source to stereo panner and gain
  source.connect(new StereoPannerNode(audioContext, { pan: clamp(pan, -1, 1) })).connect(gainNode);

  // play and return sound
  source.start();
  return source;
}

///////////////////////////////////////////////////////////////////////////////
// ZzFXMicro - Zuper Zmall Zound Zynth - v1.2.0 by Frank Force

/** Generate and play a ZzFX sound
 *  <br>
 *  <br><b><a href=https://killedbyapixel.github.io/ZzFX/>Create sounds using the ZzFX Sound Designer.</a></b>
 *  @param {Array} zzfxSound - Array of ZzFX parameters, ex. [.5,.5]
 *  @return {Array} - Array of audio samples
 *  @memberof Audio */
const zzfx = (...zzfxSound) => playSamples([zzfxG(...zzfxSound)]);

/** Sample rate used for all ZzFX sounds
 *  @default 44100
 *  @memberof Audio */
const zzfxR = 44100;

/** Generate samples for a ZzFX sound
 *  @memberof Audio */
function zzfxG(
  // parameters
  volume = 1,
  randomness = 0.05,
  frequency = 220,
  attack = 0,
  sustain = 0,
  release = 0.1,
  shape = 0,
  shapeCurve = 1,
  slide = 0,
  deltaSlide = 0,
  pitchJump = 0,
  pitchJumpTime = 0,
  repeatTime = 0,
  noise = 0,
  modulation = 0,
  bitCrush = 0,
  delay = 0,
  sustainVolume = 1,
  decay = 0,
  tremolo = 0
) {
  // locals
  let PI2 = PI * 2,
    startSlide = (slide *= (500 * PI2) / zzfxR / zzfxR),
    b = [],
    startFrequency = (frequency *= ((1 + randomness * rand(-1, 1)) * PI2) / zzfxR),
    t = 0,
    tm = 0,
    i = 0,
    j = 1,
    r = 0,
    c = 0,
    s = 0,
    f,
    length;

  // scale by sample rate
  attack = attack * zzfxR + 9; // minimum attack to prevent pop
  decay *= zzfxR;
  sustain *= zzfxR;
  release *= zzfxR;
  delay *= zzfxR;
  deltaSlide *= (500 * PI2) / zzfxR ** 3;
  modulation *= PI2 / zzfxR;
  pitchJump *= PI2 / zzfxR;
  pitchJumpTime *= zzfxR;
  repeatTime = (repeatTime * zzfxR) | 0;

  // generate waveform
  for (length = (attack + decay + sustain + release + delay) | 0; i < length; b[i++] = s) {
    if (!(++c % ((bitCrush * 100) | 0))) {
      // bit crush
      s = shape
        ? shape > 1
          ? shape > 2
            ? shape > 3 // wave shape
              ? Math.sin((t % PI2) ** 3) // 4 noise
              : max(min(Math.tan(t), 1), -1) // 3 tan
            : 1 - (((((2 * t) / PI2) % 2) + 2) % 2) // 2 saw
          : 1 - 4 * abs(Math.round(t / PI2) - t / PI2) // 1 triangle
        : Math.sin(t); // 0 sin

      s =
        (repeatTime
          ? 1 - tremolo + tremolo * Math.sin((PI2 * i) / repeatTime) // tremolo
          : 1) *
        sign(s) *
        abs(s) ** shapeCurve * // curve 0=square, 2=pointy
        volume *
        soundVolume * // envelope
        (i < attack
          ? i / attack // attack
          : i < attack + decay // decay
          ? 1 - ((i - attack) / decay) * (1 - sustainVolume) // decay falloff
          : i < attack + decay + sustain // sustain
          ? sustainVolume // sustain volume
          : i < length - delay // release
          ? ((length - i - delay) / release) * // release falloff
            sustainVolume // release volume
          : 0); // post release

      s = delay
        ? s / 2 +
          (delay > i
            ? 0 // delay
            : ((i < length - delay ? 1 : (length - i) / delay) * // release delay
                b[(i - delay) | 0]) /
              2)
        : s; // sample delay
    }

    f =
      (frequency += slide += deltaSlide) * // frequency
      Math.cos(modulation * tm++); // modulation
    t += f - f * noise * (1 - (((Math.sin(i) + 1) * 1e9) % 2)); // noise

    if (j && ++j > pitchJumpTime) {
      // pitch jump
      frequency += pitchJump; // apply pitch jump
      startFrequency += pitchJump; // also apply to start
      j = 0; // reset pitch jump time
    }

    if (repeatTime && !(++r % repeatTime)) {
      // repeat
      frequency = startFrequency; // reset frequency
      slide = startSlide; // reset slide
      j ||= 1; // reset pitch jump time
    }
  }

  return b;
}

///////////////////////////////////////////////////////////////////////////////
// ZzFX Music Renderer v2.0.3 by Keith Clark and Frank Force

/** Generate samples for a ZzFM song with given parameters
 *  @param {Array} instruments - Array of ZzFX sound paramaters
 *  @param {Array} patterns - Array of pattern data
 *  @param {Array} sequence - Array of pattern indexes
 *  @param {Number} [BPM=125] - Playback speed of the song in BPM
 *  @returns {Array} - Left and right channel sample data
 *  @memberof Audio */
function zzfxM(instruments, patterns, sequence, BPM = 125) {
  let i, j, k;
  let instrumentParameters;
  let note;
  let sample;
  let patternChannel;
  let notFirstBeat;
  let stop;
  let instrument;
  let attenuation;
  let outSampleOffset;
  let isSequenceEnd;
  let sampleOffset = 0;
  let nextSampleOffset;
  let sampleBuffer = [];
  let leftChannelBuffer = [];
  let rightChannelBuffer = [];
  let channelIndex = 0;
  let panning = 0;
  let hasMore = 1;
  let sampleCache = {};
  let beatLength = ((zzfxR / BPM) * 60) >> 2;

  // for each channel in order until there are no more
  for (; hasMore; channelIndex++) {
    // reset current values
    sampleBuffer = [(hasMore = notFirstBeat = outSampleOffset = 0)];

    // for each pattern in sequence
    sequence.forEach((patternIndex, sequenceIndex) => {
      // get pattern for current channel, use empty 1 note pattern if none found
      patternChannel = patterns[patternIndex][channelIndex] || [0, 0, 0];

      // check if there are more channels
      hasMore |= !!patterns[patternIndex][channelIndex];

      // get next offset, use the length of first channel
      nextSampleOffset = outSampleOffset + (patterns[patternIndex][0].length - 2 - !notFirstBeat) * beatLength;
      // for each beat in pattern, plus one extra if end of sequence
      isSequenceEnd = sequenceIndex == sequence.length - 1;
      for (i = 2, k = outSampleOffset; i < patternChannel.length + isSequenceEnd; notFirstBeat = ++i) {
        // <channel-note>
        note = patternChannel[i];

        // stop if end, different instrument or new note
        stop =
          (i == patternChannel.length + isSequenceEnd - 1 && isSequenceEnd) ||
          (instrument != (patternChannel[0] || 0)) | note | 0;

        // fill buffer with samples for previous beat, most cpu intensive part
        for (
          j = 0;
          j < beatLength && notFirstBeat;
          // fade off attenuation at end of beat if stopping note, prevents clicking
          j++ > beatLength - 99 && stop ? (attenuation += (attenuation < 1) / 99) : 0
        ) {
          // copy sample to stereo buffers with panning
          sample = ((1 - attenuation) * sampleBuffer[sampleOffset++]) / 2 || 0;
          leftChannelBuffer[k] = (leftChannelBuffer[k] || 0) - sample * panning + sample;
          rightChannelBuffer[k] = (rightChannelBuffer[k++] || 0) + sample * panning + sample;
        }

        // set up for next note
        if (note) {
          // set attenuation
          attenuation = note % 1;
          panning = patternChannel[1] || 0;
          if ((note |= 0)) {
            // get cached sample
            sampleBuffer = sampleCache[[(instrument = patternChannel[(sampleOffset = 0)] || 0), note]] =
              sampleCache[[instrument, note]] ||
              // add sample to cache
              ((instrumentParameters = [...instruments[instrument]]),
              (instrumentParameters[2] *= 2 ** ((note - 12) / 12)),
              // allow negative values to stop notes
              note > 0 ? zzfxG(...instrumentParameters) : []);
          }
        }
      }

      // update the sample offset
      outSampleOffset = nextSampleOffset;
    });
  }

  return [leftChannelBuffer, rightChannelBuffer];
}

/**
 * LittleJS Engine Globals
 * @namespace Engine
 */

('use strict');

/** Name of engine
 *  @type {String}
 *  @default
 *  @memberof Engine */
const engineName = 'LittleJS';

/** Version of engine
 *  @type {String}
 *  @default
 *  @memberof Engine */
const engineVersion = '1.6.4';

/** Frames per second to update objects
 *  @type {Number}
 *  @default
 *  @memberof Engine */
const frameRate = 60;

/** How many seconds each frame lasts, engine uses a fixed time step
 *  @type {Number}
 *  @default 1/60
 *  @memberof Engine */
const timeDelta = 1 / frameRate;

/** Array containing all engine objects
 *  @type {Array}
 *  @memberof Engine */
let engineObjects = [];

/** Array containing only objects that are set to collide with other objects this frame (for optimization)
 *  @type {Array}
 *  @memberof Engine */
let engineObjectsCollide = [];

/** Current update frame, used to calculate time
 *  @type {Number}
 *  @memberof Engine */
let frame = 0;

/** Current engine time since start in seconds, derived from frame
 *  @type {Number}
 *  @memberof Engine */
let time = 0;

/** Actual clock time since start in seconds (not affected by pause or frame rate clamping)
 *  @type {Number}
 *  @memberof Engine */
let timeReal = 0;

/** Is the game paused? Causes time and objects to not be updated
 *  @type {Boolean}
 *  @default 0
 *  @memberof Engine */
let paused = 0;

/** Set if game is paused
 *  @param {Boolean} paused
 *  @memberof Engine */
function setPaused(_paused) {
  paused = _paused;
}

let timeSpeedScale = 1;
function getTimeSpeedScale() {
  return timeSpeedScale;
}
function setTimeSpeedScale(value) {
  timeSpeedScale = value;
}
///////////////////////////////////////////////////////////////////////////////

/** Start up LittleJS engine with your callback functions
 *  @param {Function} gameInit        - Called once after the engine starts up, setup the game
 *  @param {Function} gameUpdate      - Called every frame at 60 frames per second, handle input and update the game state
 *  @param {Function} gameUpdatePost  - Called after physics and objects are updated, setup camera and prepare for render
 *  @param {Function} gameRender      - Called before objects are rendered, draw any background effects that appear behind objects
 *  @param {Function} gameRenderPost  - Called after objects are rendered, draw effects or hud that appear above all objects
 *  @memberof Engine */
function engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost) {
  // init engine when tiles load or fail to load

  // setup html
  const styleBody =
    'margin:0;overflow:hidden;background:#000' + // fill the window
    ';touch-action:none' + // prevent mobile pinch to resize
    ';user-select:none' + // prevent mobile hold to select
    ';-webkit-user-select:none'; // compatibility for ios
  document.body.style = styleBody;
  document.body.appendChild((mainCanvas = document.createElement('canvas')));
  mainContext = mainCanvas.getContext('2d');

  // init stuff and start engine
  // create overlay canvas for hud to appear above gl canvas
  document.body.appendChild((overlayCanvas = document.createElement('canvas')));
  overlayContext = overlayCanvas.getContext('2d');

  // set canvas style to fill the window
  const styleCanvas = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)';
  mainCanvas.style = mainCanvas.style = overlayCanvas.style = styleCanvas;

  // frame time tracking
  let frameTimeLastMS = 0,
    frameTimeBufferMS;
  gameInit();
  engineUpdate();

  // main update loop
  function engineUpdate(frameTimeMS = 0) {
    // update time keeping
    let frameTimeDeltaMS = frameTimeMS - frameTimeLastMS;
    frameTimeLastMS = frameTimeMS;

    // +/- to speed/slow time
    timeReal += frameTimeDeltaMS / 1e3;
    frameTimeBufferMS += !paused * frameTimeDeltaMS;
    frameTimeBufferMS = min(frameTimeBufferMS, 50); // clamp incase of slow framerate

    if (canvasFixedSize.x) {
      // clear canvas and set fixed size
      mainCanvas.width = canvasFixedSize.x;
      mainCanvas.height = canvasFixedSize.y;

      // fit to window by adding space on top or bottom if necessary
      const aspect = innerWidth / innerHeight;
      const fixedAspect = mainCanvas.width / mainCanvas.height;
      mainCanvas.style.width = mainCanvas.style.width = overlayCanvas.style.width = aspect < fixedAspect ? '100%' : '';
      mainCanvas.style.height =
        mainCanvas.style.height =
        overlayCanvas.style.height =
          aspect < fixedAspect ? '' : '100%';
    } else {
      // clear canvas and set size to same as window
      mainCanvas.width = min(innerWidth, canvasMaxSize.x);
      mainCanvas.height = min(innerHeight, canvasMaxSize.y);
    }

    // clear overlay canvas and set size
    overlayCanvas.width = mainCanvas.width;
    overlayCanvas.height = mainCanvas.height;

    // save canvas size
    mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);

    if (paused) {
      // do post update even when paused
      inputUpdate();
      gameUpdatePost();
      inputUpdatePost();
    } else {
      // apply time delta smoothing, improves smoothness of framerate in some browsers
      let deltaSmooth = 0;
      if (frameTimeBufferMS < 0 && frameTimeBufferMS > -9) {
        // force an update each frame if time is close enough (not just a fast refresh rate)
        deltaSmooth = frameTimeBufferMS;
        frameTimeBufferMS = 0;
      }

      // update multiple frames if necessary in case of slow framerate
      for (; frameTimeBufferMS >= 0; frameTimeBufferMS -= 1e3 / frameRate) {
        // update game and objects
        inputUpdate();
        gameUpdate();
        engineObjectsUpdate();

        // do post update
        gameUpdatePost();
        inputUpdatePost();
      }

      // add the time smoothing back in
      frameTimeBufferMS += deltaSmooth;
    }

    // render sort then render while removing destroyed objects
    enginePreRender();
    gameRender();
    engineObjects.sort((a, b) => a.renderOrder - b.renderOrder);
    for (const o of engineObjects) o.destroyed || o.render();
    gameRenderPost();

    requestAnimationFrame(engineUpdate);
  }
}

// Called automatically by engine to setup render system
function enginePreRender() {
  // save canvas size
  mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);

  // disable smoothing for pixel art
  mainContext.imageSmoothingEnabled = !cavasPixelated;
}

/** Update each engine object, remove destroyed objects, and update time
 *  @memberof Engine */
function engineObjectsUpdate() {
  // get list of solid objects for physics optimzation
  engineObjectsCollide = engineObjects.filter((o) => o.collideSolidObjects);

  // recursive object update
  const updateObject = (o) => {
    if (!o.destroyed) {
      o.update();
      for (const child of o.children) updateObject(child);
    }
  };
  for (const o of engineObjects) o.parent || updateObject(o);

  // remove destroyed objects
  engineObjects = engineObjects.filter((o) => !o.destroyed);

  // increment frame and update time
  time = ++frame / frameRate;
}

/** Destroy and remove all objects
 *  @memberof Engine */
function engineObjectsDestroy() {
  for (const o of engineObjects) o.parent || o.destroy();
  engineObjects = engineObjects.filter((o) => !o.destroyed);
}

/**
 * LittleJS Module Export
 * <br> - Export engine as a module with extra functions where necessary
 */

// Setters for all variables that devs will need to modify

/** Set position of camera in world space
 *  @param {Vector2} pos
 *  @memberof Settings */
const setCameraPos = (pos) => (cameraPos = pos);

/** Set scale of camera in world space
 *  @param {Number} scale
 *  @memberof Settings */
const setCameraScale = (scale) => (cameraScale = scale);

/** Set max size of the canvas
 *  @param {Vector2} size
 *  @memberof Settings */
const setCanvasMaxSize = (size) => (canvasMaxSize = size);

/** Set fixed size of the canvas
 *  @param {Vector2} size
 *  @memberof Settings */
const setCanvasFixedSize = (size) => (canvasFixedSize = size);

/** Disables anti aliasing for pixel art if true
 *  @param {Boolean} pixelated
 *  @memberof Settings */
const setCavasPixelated = (pixelated) => (cavasPixelated = pixelated);

/** Set default font used for text rendering
 *  @param {String} font
 *  @memberof Settings */
const setFontDefault = (font) => (fontDefault = font);

/** Set if collisions between objects are enabled
 *  @param {Boolean} enable
 *  @memberof Settings */
const setEnablePhysicsSolver = (enable) => (enablePhysicsSolver = enable);

/** Set default object mass for collison calcuations
 *  @param {Number} mass
 *  @memberof Settings */
const setObjectDefaultMass = (mass) => (objectDefaultMass = mass);

/** Set how much to slow velocity by each frame
 *  @param {Number} damping
 *  @memberof Settings */
const setObjectDefaultDamping = (damp) => (objectDefaultDamping = damp);

/** Set how much to slow angular velocity each frame
 *  @param {Number} damping
 *  @memberof Settings */
const setObjectDefaultAngleDamping = (damp) => (objectDefaultAngleDamping = damp);

/** Set how much to bounce when a collision occur
 *  @param {Number} elasticity
 *  @memberof Settings */
const setObjectDefaultElasticity = (elasticity) => (objectDefaultElasticity = elasticity);

/** Set how much to slow when touching
 *  @param {Number} friction
 *  @memberof Settings */
const setObjectDefaultFriction = (friction) => (objectDefaultFriction = friction);

/** Set max speed to avoid fast objects missing collisions
 *  @param {Number} speed
 *  @memberof Settings */
const setObjectMaxSpeed = (speed) => (objectMaxSpeed = speed);

/** Set how much gravity to apply to objects along the Y axis
 *  @param {Number} gravity
 *  @memberof Settings */
const setGravity = (g) => (gravity = g);

/** Set if true the WASD keys are also routed to the direction keys
 *  @param {Boolean} enable
 *  @memberof Settings */
const setInputWASDEmulateDirection = (enable) => (inputWASDEmulateDirection = enable);

/** Set to disable all audio code
 *  @param {Boolean} enable
 *  @memberof Settings */
const setSoundEnable = (enable) => (soundEnable = enable);

/** Set volume scale to apply to all sound, music and speech
 *  @param {Number} volume
 *  @memberof Settings */
const setSoundVolume = (volume) => (soundVolume = volume);

/** Set default range where sound no longer plays
 *  @param {Number} range
 *  @memberof Settings */
const setSoundDefaultRange = (range) => (soundDefaultRange = range);

/** Set default range percent to start tapering off sound
 *  @param {Number} taper
 *  @memberof Settings */
const setSoundDefaultTaper = (taper) => (soundDefaultTaper = taper);

export {
  // Setters for global variables
  setCameraPos,
  setCameraScale,
  setCanvasMaxSize,
  setCanvasFixedSize,
  setCavasPixelated,
  setFontDefault,
  setEnablePhysicsSolver,
  setObjectDefaultMass,
  setObjectDefaultDamping,
  setObjectDefaultAngleDamping,
  setObjectDefaultElasticity,
  setObjectDefaultFriction,
  setObjectMaxSpeed,
  setGravity,
  setInputWASDEmulateDirection,
  setSoundEnable,
  setSoundVolume,
  setSoundDefaultRange,
  setSoundDefaultTaper,

  // Settings
  canvasMaxSize,
  canvasFixedSize,
  cavasPixelated,
  fontDefault,
  enablePhysicsSolver,
  objectDefaultMass,
  objectDefaultDamping,
  objectDefaultAngleDamping,
  objectDefaultElasticity,
  objectDefaultFriction,
  objectMaxSpeed,
  gravity,
  cameraPos,
  cameraScale,
  inputWASDEmulateDirection,
  soundEnable,
  soundVolume,
  soundDefaultRange,
  soundDefaultTaper,

  // Globals
  debug,

  // Utilities
  PI,
  abs,
  min,
  max,
  sign,
  mod,
  clamp,
  percent,
  lerp,
  smoothStep,
  isOverlapping,
  wave,
  formatTime,

  // Random
  rand,
  randInt,
  randSign,
  randInCircle,
  randVector,

  // Utility Classes
  Vector2,
  Timer,
  vec2,

  // Base
  EngineObject,

  // Draw
  mainCanvas,
  mainContext,
  overlayCanvas,
  overlayContext,
  mainCanvasSize,
  screenToWorld,
  worldToScreen,
  drawCanvas2D,
  isFullscreen,
  toggleFullscreen,

  // Input
  keyIsDown,
  keyWasPressed,
  keyWasReleased,
  clearInput,
  mouseIsDown,
  mouseWasPressed,
  mouseWasReleased,
  mousePos,
  mousePosScreen,
  mouseWheel,
  preventDefaultInput,
  mouseToScreen,
  isTouchDevice,

  // Audio
  Sound,
  Music,
  playAudioFile,
  speak,
  speakStop,
  getNoteFrequency,
  audioContext,
  playSamples,
  zzfx,

  // Engine
  engineName,
  engineVersion,
  frameRate,
  timeDelta,
  engineObjects,
  frame,
  time,
  timeReal,
  paused,
  setPaused,
  engineInit,
  engineObjectsUpdate,
  engineObjectsDestroy,

  // Custom john stuff
  getTimeSpeedScale,
  setTimeSpeedScale,
};
