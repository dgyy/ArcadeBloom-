import { Text, Sprite, track } from 'kontra'
import { Background } from '../entities/bg'
import { GEM_TYPES, ITEM_TYPES, LEVELS } from '../constants'
import { playSound } from '../utils'

const yt = 70
const yt2 = 20
const xt = 50
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
export const ShopScene = ({ canvas, data, onNext }) => {
  const { width, height } = canvas
  const background = Background({ canvas, getSpeed: () => 0.1 })
  let market = {}
  const keys = shuffleArray(Object.keys(GEM_TYPES))
  const keys2 = shuffleArray(Object.keys(ITEM_TYPES)).filter(
    (t) => t !== 'empty',
  )
  let shopItems = []
  keys2.forEach((k) => {
    const t = k.match(/axe|ingot|rock/)
    const max = t ? 12 : 3
    const min = t ? 5 : 0
    const n = Math.floor(Math.random() * max) + min
    for (let i = 0; i < n; i++) shopItems.push(k)
  })
  for (let i = 0; i < 6; i++) {
    const key = keys[i]
    market[key] = i < 3 ? 0.2 : 1.8
  }
  const sw = width / 2 - xt * 1.5
  const sh = height - yt * 2
  const x2 = width / 2 + xt / 2
  const bg2 = Sprite({
    x: xt,
    y: yt,
    width: sw,
    height: sh,
    color: '#000000aa',
  })
  const bg3 = Sprite({
    x: x2,
    y: yt,
    width: sw,
    height: sh,
    color: '#000000aa',
  })
  const buttons: any[] = [bg2, bg3]
  const shopItemLabels: any[] = []
  const playerItemLabels: any[] = []
  let selectedItemId = ''

  playSound('nextLevel')
  const onClickNext = () => {
    playSound('click')
    onNext()
  }

  const getSelected = () => {
    const side = selectedItemId.split(':')[0]
    const index = +selectedItemId.split(':')[1]
    return ITEM_TYPES[
      side !== 'shop'
        ? data.items[index + playerPage * 10]
        : shopItems[index + shopPage * 10]
    ]
  }

  const onBuySell = () => {
    const index = +selectedItemId.split(':')[1]
    const item = getSelected()
    if (!item) return
    playSound('click')
    if (selectedItemId.includes('player')) {
      const _i = index + playerPage * 10
      shopItems.push(data.items[_i])
      data.items = data.items.filter((d, i) => i !== _i)
      data.gold += item.value * market[item.name] || 1
    } else if (data.gold >= item.value) {
      const _i = index + shopPage * 10
      data.items.push(shopItems[_i])
      shopItems = shopItems.filter((d, i) => i !== _i)
      data.gold -= item.value * market[item.name] || 1
    }
    updateShop()
  }

  const renderShopItem = (i, side) => {
    const item = new ShopItem(canvas, side, i, () => {
      const allItems = [...playerItemLabels, ...shopItemLabels]
      allItems.find((l) => l.id === selectedItemId)?.toggleSelect()
      selectedItemId = item.id
      playerItemLabels.forEach((i) => (i.color = '#fff'))
      shopItemLabels.forEach((i) => (i.color = '#fff'))
      buySell.text = side === 0 ? 'Sell' : 'Buy'

      // check if can afford and disable buy button
      item.toggleSelect()
      playSound('click')
      updateShop()
    })

    if (side === 0) playerItemLabels.push(item)
    if (side === 1) shopItemLabels.push(item)
  }

  let PAGE_SIZE = 10
  let playerPage = 0
  let shopPage = 0
  const playerPageCount = Math.ceil(data.items.length / PAGE_SIZE)
  const shopPageCount = Math.ceil(shopItems.length / PAGE_SIZE)
  const changePlayerPage = (n) => {
    playerPage = Math.max(0, Math.min(playerPageCount - 1, playerPage + n))
    playerItemLabels.forEach((l) => l.setItem())
    updateShop()
  }
  const changeShopPage = (n) => {
    shopPage = Math.max(0, Math.min(shopPageCount - 1, shopPage + n))
    shopItemLabels.forEach((l) => l.setItem())
    updateShop()
  }
  const updateShop = () => {
    const side = selectedItemId.split(':')[0]

    playerItemLabels.forEach((i) => i.setItem())
    shopItemLabels.forEach((i) => i.setItem())
    pCount.text = `${playerPage + 1}/${playerPageCount}`
    sCount.text = `${shopPage + 1}/${shopPageCount}`
    data.items
      .filter((i) => i !== 'empty')
      .slice(playerPage * PAGE_SIZE, (playerPage + 1) * PAGE_SIZE)
      .forEach((l, i) => playerItemLabels[i].setItem(l, market))
    shopItems
      .slice(shopPage * PAGE_SIZE, (shopPage + 1) * PAGE_SIZE)
      .forEach((l, i) => shopItemLabels[i].setItem(l, market))
    gold.text = `Gold: ${data.gold}`
    const item = getSelected()
    buySell.color = `rgba(255,255,255,${
      !item || (side === 'shop' && data.gold < item.value) ? 0.5 : 1
    })`
  }

  new Array(PAGE_SIZE).fill('').forEach((_, i) => renderShopItem(i, 0))
  new Array(PAGE_SIZE).fill('').forEach((_, i) => renderShopItem(i, 1))

  buttons.push(
    Text({
      x: xt + xt / 2,
      y: yt2 + 58,
      text: 'Name                     Weight      Damage      Value',
      color: '#fff',
      font: 'bold 22px sans-serif',
      anchor: { x: 0, y: 0 },
    }),
  )
  buttons.push(
    Text({
      x: width / 2 - xt / 2 + xt + xt / 2,
      y: yt2 + 58,
      text: 'Name                     Weight      Damage      Value',
      color: '#fff',
      font: 'bold 22px sans-serif',
      anchor: { x: 0, y: 0 },
    }),
  )
  const pNext = Text({
    x: xt + (width / 2 - xt * 2) - 10,
    y: height - yt - 30,
    text: '>',
    color: '#fff',
    font: 'bold 22px sans-serif',
    anchor: { x: 0, y: 0 },
    onDown: () => changePlayerPage(1),
  })
  buttons.push(pNext)
  const pCount = Text({
    x: width / 4 + xt / 4,
    y: height - yt - 30,
    text: `1/${playerPageCount}`,
    color: '#fff',
    font: 'bold 22px sans-serif',
    anchor: { x: 0.5, y: 0 },
  })
  buttons.push(pCount)
  const sCount = Text({
    x: width / 2 + (width / 4 - xt / 4),
    y: height - yt - 30,
    text: `1/${shopPageCount}`,
    color: '#fff',
    font: 'bold 22px sans-serif',
    anchor: { x: 0.5, y: 0 },
  })
  buttons.push(sCount)
  const pPrev = Text({
    x: xt + 20,
    y: height - yt - 30,
    text: '<',
    color: '#fff',
    font: 'bold 22px sans-serif',
    anchor: { x: 0, y: 0 },
    onDown: () => changePlayerPage(-1),
  })
  buttons.push(pPrev)
  const sNext = Text({
    x: width - (xt + 30),
    y: height - yt - 30,
    text: '>',
    color: '#fff',
    font: 'bold 22px sans-serif',
    anchor: { x: 0, y: 0 },
    onDown: () => changeShopPage(1),
  })
  buttons.push(sNext)
  const sPrev = Text({
    x: xt + 20 + (width / 2 - xt / 2),
    y: height - yt - 30,
    text: '<',
    color: '#fff',
    font: 'bold 22px sans-serif',
    anchor: { x: 0, y: 0 },
    onDown: () => changeShopPage(-1),
  })
  buttons.push(sPrev)

  buttons.push(
    Text({
      x: width / 4,
      y: yt2,
      text: 'Player',
      color: '#fff',
      font: '28px sans-serif',
      anchor: { x: 0.5, y: 0 },
    }),
  )

  buttons.push(
    Text({
      x: width / 2,
      y: yt2,
      text: LEVELS[data.levelIndex].name,
      color: '#fff',
      font: 'bold 32px sans-serif',
      anchor: { x: 0.5, y: 0 },
    }),
  )

  buttons.push(
    Text({
      x: width / 2 + width / 4 - 5,
      y: yt2,
      text: 'Shop',
      color: '#fff',
      font: '28px sans-serif',
      anchor: { x: 0.5, y: 0 },
    }),
  )

  const gold = Text({
    x: width / 2,
    y: height - yt2,
    text: `Gold: ${data.gold}`,
    color: '#fff',
    font: '28px sans-serif',
    anchor: { x: 0.5, y: 1 },
  })
  buttons.push(gold)

  const buySell = Text({
    x: width - xt,
    y: height - yt2,
    text: 'Buy',
    color: '#fff',
    font: '28px sans-serif',
    anchor: { x: 1, y: 1 },
    onDown: onBuySell,
  })
  buttons.push(buySell)
  track(buySell)

  const start = Text({
    x: xt,
    y: height - yt2,
    text: 'Next',
    color: '#fff',
    font: '28px sans-serif',
    anchor: { x: 0, y: 1 },
    onDown: onClickNext,
  })
  track(start)
  track(pNext)
  track(sNext)
  track(pPrev)
  track(sPrev)
  buttons.push(start)

  updateShop()
  return {
    shutdown() {},
    update() {
      background.update()
    },
    render() {
      background.render()
      buttons.forEach((b) => b.render())
      playerItemLabels.forEach((b) => b.render())
      shopItemLabels.forEach((b) => b.render())
    },
  }
}

class ShopItem {
  nlab: Text
  clickLabel: Text
  wlab: Text
  dlab: Text
  vlab: Text
  id: string
  sel: boolean
  constructor(canvas, side, index, onDown) {
    const { width, height } = canvas

    const startX = side === 0 ? 0 : width / 2 - xt / 2
    const _x = startX + xt + xt / 2
    const _y = yt + xt / 2 + 32 * index + 15
    this.id = `${side === 0 ? 'player' : 'shop'}:${index}`
    const color = '#fff'
    const text = ''
    this.sel = false
    const font = '24px sans-serif'
    const anchor = { x: 0.5, y: 0 }

    this.clickLabel = Text({
      x: _x,
      y: _y,
      text: '',
      width: 500,
      color,
      font,
      anchor: { x: 0, y: 0 },
      onDown,
    })

    this.nlab = Text({
      x: _x,
      y: _y,
      text,
      color,
      font,
      anchor: { x: 0, y: 0 },
    })

    this.wlab = Text({
      x: _x + 225,
      y: _y,
      text,
      color,
      font,
      anchor,
    })

    this.dlab = Text({
      x: _x + 340,
      y: _y,
      text,
      color,
      font,
      anchor,
    })

    this.vlab = Text({
      x: _x + 450,
      y: _y,
      text,
      color,
      font,
      anchor,
    })
    track(this.clickLabel)
  }

  setItem(i: any, market: any) {
    const item = ITEM_TYPES[i]
    const _v = market?.[item?.name] || 1
    this.nlab.text = item?.name || ''
    this.wlab.text = item?.weight || ''
    this.vlab.text = item?.value ? `${item?.value * _v}` : ''
    this.dlab.text = item?.damage || ''
    this.toggleColor('#fff')
    if (_v < 0.8) this.toggleColor('#f66')
    if (_v > 1.2) this.toggleColor('#6f6')
  }

  toggleSelect() {
    this.sel = !this.sel
    this.nlab.font = this.sel ? 'bold 24px sans-serif' : '24px sans-serif'
  }

  toggleColor(color: string) {
    this.nlab.color = color
    this.wlab.color = color
    this.vlab.color = color
    this.dlab.color = color
  }

  render() {
    this.nlab.render()
    this.clickLabel.render()
    this.wlab.render()
    this.dlab.render()
    this.vlab.render()
  }
}
