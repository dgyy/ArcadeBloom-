const
    // vector3
    vector3 = (x = 0.0, y = 0.0, z = 0.0) => ({ x, y, z }),
    set = (v, x, y, z) => { v.x = x; v.y = y; v.z = z },
    clone = (v) => vector3(v.x, v.y, v.z),
    copy = (v) => vector3(v.x, v.y, v.z),
    add = (a, b) => vector3(a.x + b.x, a.y + b.y, a.z + b.z),
    substract = (a, b) => vector3(a.x - b.x, a.y - b.y, a.z - b.z),
    multiplyBy = (v, f) => vector3(v.x * f, v.y * f, v.z * f),
    divide = (v, f) => vector3(v.x / f, v.y / f, v.z / f),
    length = (v) => Math.hypot(v.x, v.y, v.z),
    cross = (a, b) => vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x),
    dot = (a, b) => (a.x * b.x + a.y * b.y + a.z * b.z),
    normalize = (v) => divide(v, length(v)),
    rotX = (v, a) => vector3(v.x, v.y * Math.cos(a) - v.z * Math.sin(a), v.y * Math.sin(a) + v.z * Math.cos(a)),
    rotY = (v, a) => vector3(v.x * Math.cos(a) - v.z * Math.sin(a), v.y, v.x * Math.sin(a) + v.z * Math.cos(a)),
    rotZ = (v, a) => vector3(v.x * Math.cos(a) - v.y * Math.sin(a), v.x * Math.sin(a) + v.y * Math.cos(a), v.z),
    distanceTo = (a, b) => length(substract(a, b)),

    // matrix4 
    translate = (v) => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v.x, v.y, v.z, 1]),
    scale = (v) => new Float32Array([v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1]),
    rotateX = (rad) => { const s = Math.sin(rad), c = Math.cos(rad); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]) },
    rotateY = (rad) => { const s = Math.sin(rad), c = Math.cos(rad); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]) },
    rotateZ = (rad) => { const s = Math.sin(rad), c = Math.cos(rad); return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) },
    perspective = (fovy, aspect, near, far) => { const f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far); return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]); },
    lookAt = (eye, target, up) => { const z = normalize(substract(eye, target)), x = normalize(cross(up, z)), y = cross(z, x); return new Float32Array([x.x, y.x, z.x, 0, x.y, y.y, z.y, 0, x.z, y.z, z.z, 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]) },
    multiply = (a, b) => { const result = new Float32Array(16); for (let i = 0; i < 4; i++) { for (let j = 0; j < 4; j++) { let sum = 0; for (let k = 0; k < 4; k++) { sum += a[i * 4 + k] * b[k * 4 + j]; } result[i * 4 + j] = sum; } } return result; },
    transform = (position, rotation, transformScale) => multiply(multiply(scale(transformScale), multiply(multiply(rotateX(rotation.x), rotateY(rotation.y)), rotateZ(rotation.z))), translate(position)),

    //utils
    lerp = (a, b, t) => a + (b - a) * t,
    random = (v = 1) => Math.random() * v,
    randomBetween = v => v - Math.random() * v * 2,
    lerpColors = (a, b, t) => Color(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t),
    easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    angleBetween = (a, b) => Math.atan2(a.x - b.x, a.z - b.z);
