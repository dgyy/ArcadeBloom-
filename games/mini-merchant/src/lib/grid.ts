import { tileSizeUpscaled } from '@/params/pixels'

export const getGridPointInPixels = (x: number, y:number): [number, number] => {
  return [
    x * tileSizeUpscaled,
    y * tileSizeUpscaled
  ]
}

export const getGridPointFromPixels = (x: number, y:number): [number, number] => {
  return [
    Math.floor(x / tileSizeUpscaled),
    Math.floor(y / tileSizeUpscaled)
  ]
}
