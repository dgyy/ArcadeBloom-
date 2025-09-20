import { tileSize } from '@/params/pixels'
import { memoize } from './utils'

export const getTile = memoize(
  (tilemap: HTMLImageElement, x: number, y: number, x2?: number, y2?: number) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    // FIXME Remove when size limit hits
    if (!context) {
      throw new Error('Could not get context from canvas')
    }
    context.imageSmoothingEnabled = false
    canvas.width = tileSize
    canvas.height = tileSize

    context.clearRect(0, 0, tileSize, tileSize)
    // if (angle !== 0) {
    //   context.save()
    //   // move to the center of the canvas
    //   context.translate(canvas.width / 2, canvas.height / 2)
    //   // rotate the canvas to the specified degrees
    //   context.rotate(angle * Math.PI / 180)
    //   context.translate(-canvas.width * 0.5, -canvas.height * 0.5)
    // }
    context.drawImage(
      tilemap,
      x * tileSize,
      y * tileSize,
      tileSize,
      tileSize,
      0,
      0,
      tileSize,
      tileSize
    )

    // if (angle !== 0) {
    //   context.restore()
    // }
    // hack to draw 2 tiles in one (for food)
    if (x2 !== undefined && y2 !== undefined) {
      context.drawImage(
        tilemap,
        x2 * tileSize,
        y2 * tileSize,
        tileSize,
        tileSize,
        tileSize / 4,
        0,
        tileSize / 2,
        tileSize / 2
      )
    }

    return context.canvas
  }
)
