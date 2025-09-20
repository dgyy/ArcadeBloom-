const { abs } = Math;

export class Vec3 extends Float32Array {
  constructor(x: number = 0., y: number = 0., z: number = 0.) {
    super(3);
    this[0] = x;
    this[1] = y;
    this[2] = z;
  }

  dot(v: Vec3): number {
    return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
  }

  clone(): Vec3 {
    return new Vec3(this[0], this[1], this[2]);
  }

  manhattanDistXY(v: Vec3): number {
    return abs(v.x - this.x) + abs(v.y - this.y);
  }

  angleXY(v: Vec3): number {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }

  /**
   * Cross Product of two vectors a x b
   *
   * [
   *  a1 * b2 - a2 * b1,
   *  a2 * b0 - a0 * b2,
   *  a0 * b1 - a1 * b0
   * ]
   *
   * source: https://mathjs.org/docs/reference/functions/cross.html
  */
  cross(v: Vec3, out: Vec3) {
    out[0] = this[1] * v[2] - this[2] * v[1];
    out[1] = this[2] * v[0] - this[0] * v[2];
    out[2] = this[0] * v[1] - this[1] * v[0];
  }

  magnitude(): number {
    return Math.sqrt(this[0]**2 + this[1]**2 + this[2]**2)
  }

  /// Rotations from https://stackoverflow.com/a/14609567
  //   | cos θ   −sin θ   0 | | x |   | x cos θ − y sin θ |   | x'|
  //   | sin θ    cos θ   0 | | y | = | x sin θ + y cos θ | = | y'|
  //   | 0            0   1 | | z |   | z |   | z'|
  // around the Y - axis would be
  rotateZ(angle: number, out: Vec3) {
    const [x, y, z] = this;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    out[0] = x * cosA - y * sinA;
    out[1] = x * sinA + y * cosA;
    out[2] = z;
  }

  //   | cos θ    0   sin θ | | x |   | x cos θ + z sin θ |   | x'|
  //   |     0    1       0 | | y | = | y | = | y'|
  //   |−sin θ    0   cos θ | | z |   |−x sin θ + z cos θ |   | z'|
  // around the X - axis would be
  rotateY(angle: number, out: Vec3) {
    const [x, y, z] = this;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    out[0] = x * cosA + z * sinA;
    out[1] = y;
    out[2] = -x * sinA + z * cosA;
  }

  //   | 1     0           0 | | x |   | x |   | x'|
  //   | 0   cos θ    −sin θ | | y | = | y cos θ − z sin θ | = | y'|
  //   | 0   sin θ     cos θ | | z |   | y sin θ + z cos θ |   | z'|
  rotateX(angle: number, out: Vec3) {
    const [x, y, z] = this;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    out[0] = x;
    out[1] = y * cosA - z * sinA;
    out[2] = y * sinA + z * cosA;
  }

  subtract(v: Vec3, out: Vec3) {
    out[0] = this[0] - v[0];
    out[1] = this[1] - v[1];
    out[2] = this[2] - v[2];
  }

  get x(): number {
    return this[0];
  }

  get y(): number {
    return this[1];
  }

  get z(): number {
    return this[2];
  }

  set x(x: number) {
    this[0] = x;
  }

  set y(y: number) {
    this[1] = y;
  }

  set z(z: number) {
    this[2] = z;
  }
}
