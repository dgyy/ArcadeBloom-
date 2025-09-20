const doc = document
const body = doc.body
const hiGraphics = !doc.location.search.match(/[?&]low(=|$)/)
const start = Date.now()
const { PI, sin, cos, abs, min, pow, random } = Math
const turn = 2*PI
const coinBGs = []
const log = console.log
const $ = (sel)=> doc.querySelector(sel)
const $$ = (sel)=> [...doc.querySelectorAll(sel)]
const pieceNames = { // TODO: reverse it!
  pop: 'Pope',
  kin: 'King',
  bis: 'Bishop',
  nob: 'Noble',
  pri: 'Priest',
  kni: 'Knight',
  bou: 'Bourgeois',
  ser: 'Servant',
  pea: 'Peasant',
}
const pieces = [ [], [] ]

const startMsg = [
  'Peasants are in the bottom,',
  'bellow of Servants,',
  'then Bourgeois and Knights,',
  'then Priests and Nobles,',
  'then Bishops and Kings,',
  'all bellow of the Pope.',
  '\nYes, this is improved',
  '            Tic-Tac-Toe.'
]
async function writeStartLine(delay) {
  log('Writing start line at', Date.now()%60_000/1000)
  const el = mkEl('p', { txt: startMsg.shift(), class: 'l'+startMsg.length }, $('header pre'))
  return new Promise(res => setTimeout(res, delay))
}

body.style.setProperty('--em', min(window.screen.height, window.screen.width)/100)

function mkEl(tag, attrs, parent) {
  const NS = tag==='svg' ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/1999/xhtml'
  const el = doc.createElementNS(NS, tag)
  Object.entries(attrs).forEach(([att, val]) => el.setAttribute(att, val))
  el.innerText = attrs.txt || ''
  if (parent) parent.appendChild(el)
  return el
}

// Create places:
const places = [[],[],[]]
for (let y=0; y<3; y++) for (let x=0; x<3; x++) {
  let place = mkEl('p', { style: `--x:${x}; --y:${y}` }, $('#places'))
  place.place = 1
  place.x = x
  place.y = y
  // place.addEventListener('pointerenter', ()=> enterPlace(x, y))
  // place.addEventListener('pointerleave', ()=> leavePlace(x, y))
  places[y][x] = place
}


const canvas = mkEl('canvas', { width: 2400, height: 2400 })
const ctx = canvas.getContext('2d')

// Pseudo random:
const pRnd = (index, mult=1)=> abs((sin(index+start) * 7919.953) % 1) * mult

const svgToDataURL = (id)=>
    'data:image/svg+xml,' +
    $(id).outerHTML
    .replace(/\s+/g, '%20')
    .replace(/#/g, '%23')

log('Loading SVGs...')

//const imgCoinBW = new Image()
const imgCoinGray = new Image()

// imgCoinBW.onload = loadCoinGray
// imgCoinBW.onerror = initError
// imgCoinBW.src = svgToDataURL('#pieces-3')

// function loadCoinGray() {
  imgCoinGray.onload = init
  imgCoinGray.onerror = ()=> alert('Fail to init texture!')
  imgCoinGray.src = svgToDataURL('#pieces-4')
// }

const getPos = (x, y)=> (1200*y + x) * 4

async function init() {
  try {
    log(`INIT Graphics ${hiGraphics ? 'High' : 'Low'}`, new Date(start))
    //await mkCoinIcons()
    await mkCoinTextures()
    createPieces()
    log(`Builded! ${((Date.now()-start)/1000).toFixed(2)} secs.`)
    $('header').className = 'hide'
  } catch(err) {
    log('Fail to build game assets.', err)
    alert(`Fail to build game assets.\n\n${err.message}\n\nTry to reload.`)
  }
}

// async function mkCoinIcons() {
//   ctx.fillStyle = '#FFF'
//   ctx.fillRect(0, 0, 2400, 2400)
//   ctx.drawImage(imgCoinBW, 0, 0, 2400, 2400)
//
//   // Convert light to mask
//   const data = ctx.getImageData(0, 0, 2400, 2400).data
//   data.forEach((val, i)=> {
//     if (i%4===0) {
//       data[i] = data[i+1] = data[i+2] = 255
//       data[i+3] = 255-val
//     }
//   })
//
//   // Apply bg data to canvas:
//   ctx.putImageData(new ImageData(data, 2400, 2400), 0, 0)
//
//   // Create CSS var with icons bg:
//   const url = await new Promise(resolve =>
//     canvas.toBlob(blob=> resolve(URL.createObjectURL(blob)))
//   )
//   body.style.setProperty('--bgBW', `url(${url})`)
// }

async function mkCoinTextures() {
  canvas.width = canvas.height = 1200
  for (let player=0; player<2; player++) for (let lightRevX=0; lightRevX<2; lightRevX++) {

    // Draw coin dots:
    drawCoinDots()
    const coinDotsPix = emboss(ctx.getImageData(0, 0, 1200, 1200).data, lightRevX)

    // Draw coin symbols:
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, 1200, 1200)
    ctx.drawImage(imgCoinGray, 0, 0, 1200, 1200)
    const newPix = emboss(ctx.getImageData(0, 0, 1200, 1200).data, lightRevX)
    await writeStartLine(100)
    if (hiGraphics) {
      // Make some icons more legible:
      contrast(newPix, 0, 0, 400, 400, 1.5) // Pope keys
      contrast(newPix, 400, 0, 800, 400, 1.2) // King and Bishop
      contrast(newPix, 0, 400, 400, 800, 1.8) // the two persons
      contrast(newPix, 400, 400, 400, 400, 1.5) // the Priest cross
      contrast(newPix, 800, 400, 400, 400, 1.25) // the Horse
      contrast(newPix, 400, 800, 800, 400, 1.333) // the two lasts

      // Apply coin dots over coin symbols:
      coinDotsPix.forEach((val, i)=> {
        if (val !== 127) newPix[i] = val
      })

      // Apply gold texture
      for (let idx=0; idx<newPix.length; idx+=4) {
        let r = newPix[idx+0] / 255
        let g = newPix[idx+1] / 255
        let b = newPix[idx+2] / 255
        newPix[idx+0] = 50 + 180*r
        newPix[idx+1] = 220*g
        newPix[idx+2] = 200*pow(b, 4)
        let i = ~~(idx/5)
        if (pRnd(i) < .2) {
          newPix[idx+0] = (55 + 140*r + pRnd(i+1,60)) * (player ? .9 : 1)
          newPix[idx+1] = newPix[idx] * (
            g>.6 ? 1 : .6 + pow(pRnd(i+3,.4), 1.5)
          )
          newPix[idx+2] = pRnd(i+4,100) * b
        }
        if (player) newPix[idx] = newPix[idx+1] = newPix[idx+2] = pow(newPix[idx]/240, 1.4)*255
      }
    }

    // Apply bg data to canvas:
    ctx.putImageData(new ImageData(newPix, 1200, 1200), 0, 0)
    // Clear the top line, resulting of emboss out of limits:
    ctx.fillStyle = player ? '#777' : '#916e0c'
    ctx.fillRect(0,0,1200,2)

    // Save background
    await new Promise(resolve =>
      canvas.toBlob(blob=> {
        coinBGs.push(URL.createObjectURL(blob))
        resolve()
      })
    )
    await writeStartLine(1)
  }
  coinBGs.forEach((url, i)=> {
    body.style.setProperty('--bg'+i, `url(${url})`)
  })
}

function emboss(origPix, lightRevX) {
  const newPix = new Uint8ClampedArray(origPix.length)
  const kernel = [ // Emboss convolution matrix
    [  0, +1, +1, +1, +.5 ],
    [ +1, +1, +1, +.5, -1 ],
    [ +1, +1, 0.0, -1, -1 ],
    [ +1, -.5, -1, -1, -1 ],
    [ -.5, -1, -1, -1,  0 ],
  ]
  for (let y=0; y<1200; y++) for (let x=0; x<1200; x++) {
    let light = 0
    for (let ky=0; ky<5; ky++) for (let kx=0; kx<5; kx++) {
      let rkx = lightRevX ? 4-kx : kx
      light += (origPix[getPos(x+kx-2, y+ky-2)] / 255) * kernel[ky][rkx] || 0
    }
    let i = getPos(x, y)
    newPix[i+0] = newPix[i+1] = newPix[i+2] = 127 + (light*127/9)
    newPix[i+3] = 255
    if (y%200===0 && x%200===0) {
      newPix[i+0] = 255
      newPix[i+1] = newPix[i+2] = 0
    }
  }
  return newPix
}

// function initError(err) {
//   console.error('Fail to init:', err)
//   alert('Fail to init!\n\n'+err.message)
// }

function drawCoinDots() {
  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, 0, 1200, 1200)
  for (let coin=0; coin<9; coin++) {
    let coinX = 200 + 400 * (coin % 3)
    let coinY = 200 + 400 * ~~(coin / 3)
    let coinR = 180 - coin*10
    let dots = 20 + (9-coin)*3
    ctx.fillStyle = '#000'
    for (let i=0; i<dots; i++) {
      let a = turn * i/dots
      ctx.beginPath()
      ctx.arc(coinX + sin(a)*coinR, coinY + cos(a)*coinR, 5, 0, turn)
      ctx.fill()
    }
  }
}

function contrast(data, xLeft, yTop, w, h, mult) {
  for (let y=yTop; y<yTop+h; y++) for (let x=xLeft; x<xLeft+w; x++) {
    let i = getPos(x, y)
    data[i+0] = data[i+1] = data[i+2] = data[i]*mult + 127*(1-mult)
    //data[i+0] = 127*mult
  }
}

function createPieces() {
  for (let player=0; player<2; player++) {
    Object.entries(pieceNames).forEach(([code, name], i) => {
      log(`Building ${player ? 'silver' : 'gold'} `+name)
      // <div class="coin pop"><b></b><i></i></div>
      const el = mkEl('div', { class: `coin ${code} player-${player}` }, table)
      mkEl('b', {}, el)
      mkEl('i', {}, el)
      el.player = player
      el.roleIdx = 9-i // TODO: make it 0..8 after reverse the pieceNames
      el.dataset.name = name
      pieces[player][el.roleIdx] = el
      el.style.setProperty('--idx', el.roleIdx)
      el.style.setProperty('--pos', 1 - pow( 1 - i/8, 1.1))
      el.addEventListener('pointerenter', ()=> mouseIn(el))
      el.addEventListener('pointerleave', ()=> mouseOut(el))
      el.addEventListener('pointerdown', grabCoin)
      setTimeout(()=> el.classList.add('created'), 500+1000*i)
      setTimeout(()=> el.classList.add('waiting'), 3000+1000*i)
    })
  }
}

function mouseIn(coin) {
  if (!coin.classList.contains('waiting')) return;
  for (let i=-2; i<2; i++) {
    let neighbor = pieces[coin.player][(coin.roleIdx)+i]
    if (i!==0 && neighbor && !neighbor.placed) {
      neighbor.classList.add(`mv-${i<0 ? 'pos' : 'pre'}-${abs(i)}`)
    }
  }
}

function mouseOut(coin) {
  for (let i=1; i<=9; i++) {
    let neighbor = pieces[coin.player][i]
    neighbor.classList.remove('mv-pre-1', 'mv-pos-1', 'mv-pos-2')
  }
}
