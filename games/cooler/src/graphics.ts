import Content from './content'
import { Anim } from './play'

type XYWH = { x: number, y: number, w: number, h: number }

export type TextAlign = 'c'

export function make_graphics(width: number, height: number, pixelated = true) {

    let canvas = document.createElement('canvas')
    if (pixelated) {
      canvas.classList.add('pixelated')
    }

    let ctx = canvas.getContext('2d')!
    const on_resize = () => {
      canvas.width = width
      canvas.height = height
      ctx.imageSmoothingEnabled = !pixelated
    }

    document.addEventListener('scroll', on_resize, { capture: true, passive: true })
    window.addEventListener('resize', on_resize, { passive: true })
    on_resize()
 
    return new Graphics(canvas, ctx)
  }



export default class Graphics {

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }

  constructor(readonly canvas: HTMLCanvasElement, 
              readonly ctx: CanvasRenderingContext2D) {}

  clear() {
    let { ctx } = this
    ctx.clearRect(0, 0, this.width, this.height)
  }

  box({ x, y, w, h }: XYWH) {
    this.fr(x, y, w, h, 'red')
  }

  fr(x: number, y: number, w: number, h: number, color: string) {
    let { ctx } = this
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
  }

  push_xy(x: number, y: number) {
    let { ctx } = this
    ctx.save()
    ctx.translate(Math.floor(x), Math.floor(y))
  }

  pop() {
    let { ctx } = this
    ctx.restore()
  }


  tile(n: number, x: number, y: number) {
    let { fx, fy, sx, sy } = Content.tiles

    let dx = x - fx
    let dy = y - fy

    let nx = (n % 6) * 8
    let ny = Math.floor(n / 6) * 8

    this.spr(dx, dy, sx + nx, sy + ny, 8, 8)
  }

  anim(anim: Anim, x: number, y: number, scale_x = 1, scale_y = 1) {
    let {
      fx, fy, sx, sy, sw, sh
    } = anim.current_frame

    let { origin_x, origin_y } = anim

    let dx = x - fx - origin_x
    let dy = y - fy - origin_y

    this.spr(dx, dy, sx, sy, sw, sh, scale_x, scale_y)
  }


  spr(dx: number, dy: number, sx: number, sy: number, sw: number, sh: number,
     scale_x: number = 1, scale_y: number = 1) {

       let { ctx } = this
       let { image } = Content

       ctx.save()

       let sWidth = sw
       let sHeight = sh



       let dWidth = sWidth * Math.abs(scale_x)
       let dHeight = sHeight * Math.abs(scale_y)


       ctx.scale(Number(scale_x.toFixed(2)), Number(scale_y.toFixed(2)))
       if (scale_x < 0) {
         dx *= -1
         dx -= dWidth
       }
       if (scale_y < 0) {
         dy *= -1
         dy -= dHeight
       }

       ctx.drawImage(image, sx, sy, sWidth, sHeight, Math.round(dx), Math.round(dy), Math.round(dWidth), Math.round(dHeight))

       ctx.restore()
  }
}