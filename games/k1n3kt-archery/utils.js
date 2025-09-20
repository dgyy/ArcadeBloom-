let seedRand = (a, b, c, d) => {
    return function() {
      a |= 0; b |= 0; c |= 0; d |= 0; 
      var t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = c << 21 | c >>> 11;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}


function intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    // x1, y1, x2, y2 are coords for line a
    // x3, y3, x4, y4 are coords for line b
    // returns coords x and y of intersection of line a and line b
    let px = ((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4))
    let py = ((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4))
    return [px, py]
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rotateMat(a, theta) {
    // a is a 2d array 
    // theta is the desired rotation
    // returns a bidimentional array rotated by theta
    let cx = Math.floor(a[0].length/2)
    let cy = Math.floor(a.length/2)

    let r = [
        [Math.cos(theta),-Math.sin(theta)],
        [Math.sin(theta),Math.cos(theta)]
    ]

    return a.map((row, i) => {
        return row.map((col, j) => {
            let res = matrixMultiply([[j-cx, i-cy]], r)
            // console.log(i, j, '->', Math.ceil(res[0][0]+cx), Math.ceil(res[0][1]+cy))
            // console.log(Math.round(res[0][0]+cx))
            let x2 = Math.ceil(res[0][0]+cx)
            let y2 = Math.ceil(res[0][1]+cy)
            
            // dont let it be out of bounds
            x2 = Math.max(0, x2)
            x2 = Math.min(a[0].length-1, x2)
            
            y2 = Math.max(0, y2)
            y2 = Math.min(a.length-1, y2)

            return a[y2][x2]
        })
    })    
}

let getFlatlc = (arr, l, c, w) => arr[l * w + c];
let setFlatlc = (arr, l, c, w, v) => arr[l * w + c] = v;
let setFlatlcRgba = (arr, l, c, w, r, g, b, a) => {
    c = Math.ceil(c)
    l = Math.ceil(l)
    if (a === 0) return
    arr[l * w + c + 0] = r;
    arr[l * w + c + 1] = g;
    arr[l * w + c + 2] = b;
    arr[l * w + c + 3] = a;
}
