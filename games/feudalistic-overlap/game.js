let grabedCoin = null
let grabStart = {}
// let grabAdjust = {}
let curPlace = null
let curPlayer = null

function grabCoin(ev) {
  grabedCoin = ev.target
  grabedCoin.classList.add('grabed')
  body.classList.add('grabbing')
  grabStart = {
    x: ev.pageX + grabedCoin.clientWidth/2 - ev.layerX,
    y: ev.pageY + grabedCoin.clientHeight/2 - ev.layerY
  }
  // grabAdjust = { x: grabedCoin.clientWidth/2 - ev.layerX, y: grabedCoin.clientHeight/2 - ev.layerY }
  log('Grab', grabedCoin.player, grabedCoin.dataset.name, grabStart, ev)
  for (let y=0; y<3; y++) for (let x=0; x<3; x++) {
    places[y][x].style.setProperty(
      '--color', placeAcceptCoin({x, y}, grabedCoin) ? '#0AF' : '#F00'
    )
  }
}

body.addEventListener('pointerup', (ev)=> {
  $$('.hover').map(el => el.classList.remove('hover')) // hemove any place highlight
  body.classList.remove('grabbing')
  if (grabedCoin) {
    log('Release', grabedCoin.player, grabedCoin.dataset.name)
    grabedCoin.classList.remove('grabed')
    //if (!(curPlace && placeCoin(grabedCoin, curPlace))) grabedCoin.style.transform = '' //'translate(0,0)'
    if (curPlace) placeCoin(grabedCoin, curPlace)
    grabedCoin.style.transform = ''
    grabStart = { }
    grabedCoin = null
  }
  for (let y=0; y<3; y++) for (let x=0; x<3; x++) {
    places[y][x].style.setProperty('--color', 'transparent')
  }
})

body.addEventListener('pointermove', (ev)=> {
  if (grabedCoin) {
    const target = document.elementFromPoint(ev.pageX, ev.pageY);
    $$('.hover').map(el => el.classList.remove('hover')) // hemove any place highlight
    curPlace = null // leave any place
    if (target.place) {
      curPlace = target
      target.classList.add('hover')
    }
    //log('Move', ev.pageX, ev.pageY, ev.target) //grabStart, ev)
    grabedCoin.style.transform = `translate(${ev.pageX-grabStart.x}px, ${ev.pageY-grabStart.y}px)`
  }
})

// function enterPlace(x, y) {
//   curPlace = {x, y}
//   log('Enter', curPlace)
// }

// function leavePlace(x, y) {
//   log('Leave', curPlace)
//   curPlace = null
// }

function placeAcceptCoin(place, coin) {
  const curCoin = getCoinAt(place)
  log(
    'placeAcceptCoin', place,
    coin.dataset.name, coin.roleIdx,
    curCoin?.dataset.name, (curCoin?.roleIdx||0)
  )
  return !curCoin || ( (curCoin?.roleIdx||0) < coin.roleIdx )
}

function placeCoin(coin, place) {
  if (!placeAcceptCoin(place, coin)) return false
  coin.classList.remove('waiting')
  coin.classList.add('placed')
  const oldCoin = getCoinAt(place)
  places[place.y][place.x].coin = coin

  setCurPlayer(~coin.player + 2)

  grabedCoin.style.transform = null
  grabedCoin.style.setProperty('--placeX', place.x-1)
  grabedCoin.style.setProperty('--placeY', place.y-1)

  // Tell the user:
  const at = (place.x==1 && place.y==1) ? 'center'
           : ['left', 'middle', 'right'][place.x] +' '+ ['top', 'middle', 'bottom'][place.y]
  if (oldCoin) tts(`${oldCoin.dataset.name} was replaced by ${coin.dataset.name} at ${at} square.`)
  else tts(`${coin.dataset.name} was placed at ${at} square.`)

  testEndGame()

  return true
}

function getCoinAt(place) {
  return places[place.y][place.x].coin
}

function setCurPlayer(player) {
  curPlayer = player
  body.classList.remove('cur-player-' + (~player + 2))
  body.classList.add('cur-player-' + player)
}

function testEndGame() {
  // Test Horizontals
  for (let y=0; y<3; y++) {
    let sum = 0
    let line = []
    for (let x=0; x<3; x++) {
      let coin = places[y][x].coin
      if (coin) sum += coin.player || -1
      line.push(coin)
    }
    if (abs(sum) == 3) return win(line)
  }
  // Test verticals
  for (let x=0; x<3; x++) {
    let sum = 0
    let line = []
    for (let y=0; y<3; y++) {
      let coin = places[y][x].coin
      if (coin) sum += coin.player || -1
      line.push(coin)
    }
    if (abs(sum) == 3) return win(line)
  }
  // Test diagonals
  for (let d=0; d<2; d++) {
    let sum = 0
    let line = []
    for (let i=0; i<3; i++) {
      let coin = places[i][d ? 2-i : i].coin
      if (coin) sum += coin.player || -1
      line.push(coin)
    }
    if (abs(sum) == 3) return win(line)
  }
  if (idDraw()) draw()
}

function idDraw() {
  log('PLACED:', placedCoins().map(c => c.player +' '+ c.dataset.name))
  const lowerPlaced = placedCoins().map(c => c.roleIdx).sort()[0] || 0
  const biggerWaiting = waitingCoinsLen(curPlayer).map(c => c.roleIdx).sort().reverse()[0] || 0
  const hasEmptyPlace = placedCoins().length < 9
  log('is Draw?', lowerPlaced, biggerWaiting, lowerPlaced > biggerWaiting, hasEmptyPlace?'tem':'full')
  return !hasEmptyPlace && (lowerPlaced >= biggerWaiting)
}

function win(line) {
  log('WIN!', line.map(c => c.player +' '+ c.dataset.name))
  const p = line[0].player
  //body.classList.add('winner-'+p)
  body.classList.add('over')
  line.forEach(coin => coin.classList.add('win'))
  setTimeout(tts, 3000, (p ? 'silver' : 'gold')+' coins win!')
}

function draw() {
  body.classList.add('draw')
  setTimeout(tts, 3000, 'this is a draw')
}

function placedCoins() {
  // const placed = []
  // for (let y=0; y<3; y++) for (let x=0; x<3; x++) {
  //   if (places[y][x]) placed.push(places[y][x].coin)
  // }
  // return placed.filter(c => c)
  return places.flat().map(p => p.coin).filter(c => c)
}

function waitingCoinsLen(player) {
  return pieces[player].filter(c => c && c.classList.contains('waiting'))
}
