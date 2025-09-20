import { getColPos } from './ecs/systems/collide'
import { GRASS, I_COIN } from '@/tiles'
import { getTile } from '@/lib/graphics'
import { colorBlack, colorWhite, transparentBlack } from '@/lib/colors'
import { getGridPointInPixels } from '@/lib/grid'
import { pixelScale, tileSize, tileSizeUpscaled } from '@/params/pixels'

const tileMapW = 8
// find x,y in tilemap by tile number
export const getTileXY = (tile: number | [number, number]) => {
  if (Array.isArray(tile)) {
    return tile.reduce((acc, t) => {
      const x = t % tileMapW
      const y = Math.floor(t / tileMapW)
      // @ts-ignore
      return acc.concat([x, y])
    }, [])
  } else {
    const x = tile % tileMapW
    const y = Math.floor(tile / tileMapW)
    return [x, y]
  }
}

class DrawEngine {
  context: CanvasRenderingContext2D
  tilemap = new Image()
  ready = false

  constructor () {
    // c2d - id of canvas element
    this.context = c2d.getContext('2d')
    // needed for pixel art
    this.context.imageSmoothingEnabled = false

    this.tilemap.src = 'tilemap_13k_23.png'
    this.tilemap.onload = () => {
      this.ready = true
    }
  }

  get wInTiles () {
    return this.w / tileSizeUpscaled
  }

  get hInTiles () {
    return this.h / tileSizeUpscaled
  }

  get w () {
    return this.context.canvas.width
  }

  get h () {
    return this.context.canvas.height
  }

  // not sure if we need this
  drawText (
    text: string,
    fontSize: number,
    x: number,
    y: number,
    color = colorWhite,
    textAlign: 'center' | 'left' | 'right' = 'center'
  ) {
    const context = this.context

    context.font = `${fontSize}px monospace`
    context.textAlign = textAlign
    context.strokeStyle = colorBlack
    context.lineWidth = 1
    context.strokeText(text, x, y)
    context.fillStyle = color
    context.fillText(text, x, y)
  }

  drawBg () {
    for (let x = 0; x < this.wInTiles; x++) {
      for (let y = 0; y < this.hInTiles; y++) {
        const point = getGridPointInPixels(x, y)
        this.context.drawImage(
          // @ts-ignore
          getTile(this.tilemap, ...getTileXY(GRASS))!,
          0,
          0,
          tileSize,
          tileSize,
          point[0],
          point[1],
          tileSize * pixelScale,
          tileSize * pixelScale
        )
      }
    }
  }

  drawEntity (pos: { x: number; y: number }, sprite: number | [number, number]) {
    const s = getTileXY(sprite)
    this.context.drawImage(
      // @ts-ignore
      getTile(this.tilemap, ...s)!,
      0,
      0,
      tileSize,
      tileSize,
      Math.round(pos.x), // draw on pixel grid
      Math.round(pos.y),
      tileSizeUpscaled,
      tileSizeUpscaled
    )
  }

  drawCarry (pos: { x: number; y: number }, sprite: number) {
    const s = getTileXY(sprite)
    this.context.drawImage(
      // @ts-ignore
      getTile(this.tilemap, ...s)!,
      0,
      0,
      tileSize,
      tileSize,
      Math.round(pos.x),
      Math.round(pos.y) + tileSizeUpscaled / 4,
      tileSizeUpscaled / 2,
      tileSizeUpscaled / 2
    )
  }

  drawIcon (x: number, y: number, sprite: number | [number, number], big?:boolean) {
    const s = getTileXY(sprite)
    this.context.drawImage(
      // @ts-ignore
      getTile(this.tilemap, ...s)!,
      0,
      0,
      tileSize,
      tileSize,
      Math.round(x),
      Math.round(y),
      // FIXME pixelScale makes icons shacky
      Math.round(tileSizeUpscaled / (big ? 1 : 1.4)),
      Math.round(tileSizeUpscaled / (big ? 1 : 1.4))
    )
  }

  drawUIMoney (money: number) {
    const m = money.toString()
    // drop box
    this.drawBox(0, 0, 22 + m.length * 10 + 10, 23)

    this.drawText(
      m,
      24,
      2,
      19,
      'gold',
      'left'
    )
    this.drawIcon(
      16 + m.length * 10,
      -5,
      I_COIN,
      true
    )
  }

  drawResList (pos: { x: number; y: number }, res: [number|[number, number], number][]) {
    let { x, y } = pos
    y += tileSizeUpscaled - 2
    const pad = 3
    const ress = res.filter(([_, count]) => count > 0)

    this.drawBox(
      Math.round(x),
      Math.round(y),
      tileSizeUpscaled,
      ress.length * tileSize + pad * 2
    )

    ress.forEach(([sprite, count], i) => {
      // @ts-ignore
      const s = getTileXY(sprite)
      this.context.drawImage(
        // @ts-ignore
        getTile(this.tilemap, ...s)!,
        0,
        0,
        tileSize,
        tileSize,
        Math.round(x) + pad,
        Math.round(y) + pad + i * tileSize,
        tileSize,
        tileSize
      )
      this.drawText(
        count.toString(),
        10,
        Math.round(x) + pad * 3 + tileSize,
        Math.round(y) + pad + i * tileSize + tileSize / 2 + 4,
        'white',
        'left'
      )
    })
  }

  drawHelpText (text: string) {
    // draw text on the bottom
    this.drawBox(
      this.w / 2 - 410,
      this.h - 65,
      820,
      65
    )
    text.split('\n').forEach((t, i) => {
      this.drawText(
        t,
        16,
        this.w / 2,
        this.h - 45 + i * 20,
        'white',
        'center'
      )
    })
  }

  drawRope ({ x, y }: {x: number; y: number}, { mx, my }: {mx: number; my: number}) {
    mx = mx + tileSizeUpscaled / 3
    my = my + tileSizeUpscaled / 3

    // brown
    this.context.strokeStyle = '#8b4513'
    this.context.lineWidth = 2
    this.context.setLineDash([])

    this.context.beginPath()
    this.context.moveTo(
      Math.round(x) + tileSizeUpscaled / 2,
      Math.round(y) + tileSizeUpscaled / 2
    )
    this.context.lineTo(
      Math.round(mx),
      Math.round(my)
    )
    this.context.stroke()
    this.context.closePath()

    this.context.strokeStyle = transparentBlack(0.8)
    this.context.lineWidth = 2

    this.context.beginPath()
    this.context.setLineDash([3, 4])
    this.context.moveTo(
      Math.round(x) + tileSizeUpscaled / 2,
      Math.round(y) + tileSizeUpscaled / 2
    )
    this.context.lineTo(
      Math.round(mx),
      Math.round(my)
    )
    this.context.stroke()
    this.context.closePath()
  }

  drawOverlay (pos: { x: number; y: number }, { w, h }: { w: number; h: number }) {
    // draw dashed box around the object
    this.context.strokeStyle = 'rgba(0,0,0,0.8)'
    this.context.lineWidth = 2

    this.context.beginPath()
    this.context.setLineDash([4, 4])
    this.context.rect(
      Math.round(pos.x) - 2,
      Math.round(pos.y) - 2,
      w + 4,
      h + 4
    )
    this.context.stroke()
    this.context.closePath()
  }

  drawProgress (pos: { x: number; y: number }, nextIn: number, interval: number) {
    const progress = 1 - (nextIn / interval)
    const x = Math.round(pos.x) + 2
    const y = Math.round(pos.y) + tileSizeUpscaled / 4 * 3
    this.context.fillStyle = colorBlack
    this.context.fillRect(
      x,
      y,
      tileSizeUpscaled - 4,
      4
    )
    this.context.fillStyle = colorWhite
    this.context.fillRect(
      x, y,
      progress * (tileSizeUpscaled - 4),
      4
    )
  }

  drawParticle (pos: { x: number; y: number }, color: string, size = 1, sprite?: number) {
    if (sprite !== undefined) {
      const s = getTileXY(sprite)
      // Ignore size for sprite
      this.context.drawImage(
        // @ts-ignore
        getTile(this.tilemap, ...s)!,
        0,
        0,
        tileSize,
        tileSize,
        Math.round(pos.x),
        Math.round(pos.y),
        tileSize,
        tileSize
      )
    } else {
      this.context.fillStyle = color
      this.context.fillRect(
        Math.round(pos.x),
        Math.round(pos.y),
        size,
        size
      )
    }
  }

  // draw 00:00 format
  drawTimer (timeLeftMs: number) {
    // draw back
    this.drawBox(
      this.w - 220,
      0,
      225,
      25
    )
    const timeLeft = Math.floor(timeLeftMs / 1000)
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    this.drawText(
      `Time left ${minutes.toString().padStart(1)}:${seconds.toString().padStart(2, '0')}`,
      24,
      this.w - 5,
      19,
      'white',
      'right'
    )
  }

  drawDebugRect (pos: { x: number; y: number }, w: number, h: number) {
    const newPos = getColPos(pos, { w, h })
    this.context.strokeStyle = 'red'
    this.context.lineWidth = 1
    this.context.strokeRect(
      newPos.x,
      newPos.y,
      w,
      h
    )
  }

  drawBox (x: number, y: number, w: number, h: number, isTransparent: boolean = true) {
    this.context.fillStyle = isTransparent ? transparentBlack(0.4) : transparentBlack(0.8)
    this.context.fillRect(
      x,
      y,
      w,
      h
    )
  }
}

export const drawEngine = new DrawEngine()
