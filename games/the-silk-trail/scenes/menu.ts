import { Background } from '../entities/bg'
import { Text, track } from 'kontra'
import { playSound } from '../utils'

export const MenuScene = ({ canvas, heading, description, button1 }: any) => {
  const width = canvas.width
  const height = canvas.height
  const background = Background({ canvas, getSpeed: () => 3 })
  let i = 0
  const x = width / 2
  const y = height / 2
  let text = getText(x, y - 175, heading, 64, '#eee', 'center')
  const _description = description
  let text2 = getText(x, y - 100, _description, 28, '#ddd', 'center')
  let button = Text({
    x,
    y: y + 170,
    text: 'Start',
    color: '#fff',
    font: '52px sans-serif',
    anchor: { x: 0.5, y: 0.5 },
    onDown: () => {
      playSound('click')
      button1()
    },
  })

  track(button)

  return {
    shutdown() {},
    update() {
      background.update()
    },
    render() {
      background.render()
      text.render()
      text2.render()
      button.render()
    },
  }
}

const getText = (
  x: number,
  y: number,
  text: string,
  size: number,
  color: string,
  textAlign = 'left',
) =>
  Text({
    x,
    y,
    text,
    color,
    font: `${size}px sans-serif`,
    textAlign,
  })
