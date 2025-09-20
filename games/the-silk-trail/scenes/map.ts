import { Text, track } from 'kontra'
import { LEVELS } from '../constants'
import { Circle, Path, Rect } from '../entities/bg'
import { playSound } from '../utils'

export const MapScene = ({ canvas, data, onNext }) => {
  const { width, height } = canvas
  const dots: any[] = []

  LEVELS.forEach((_, i) => {
    const y = _.y - 40
    const dot = new Circle({
      x: _.x,
      y: y,
      size: 22,
      color:
        data.levelIndex === i
          ? '#000'
          : data.levelIndex + 1 === i
          ? '#f00'
          : data.levelIndex > i
          ? '#000'
          : '#0003',
      anchor: { x: 0.5, y: 0.5 },
    })

    const a = _.name.match(/ISK|MASH|KA/)
    const b = _.name.match(/ISK|TEH|MASH/)
    const text = Text({
      x: _.x,
      y: y + (a ? -20 : 20),
      text: _.name,
      color: '#000',
      font: 'bold 28px sans-serif',
      anchor: { x: b ? 0 : 0.5, y: a ? 1 : 0 },
    })
    dots.push(dot)
    dots.push(text)
  })

  const onNextLevel = () => {
    playSound('nextLevel')
    setTimeout(() => onNext(), 50)
  }

  const start = Text({
    x: width - 20,
    y: height - 20,
    text: 'Next',
    color: '#000',
    font: 'bold 42px sans-serif',
    anchor: { x: 1, y: 1 },
    onDown: onNextLevel,
  })
  track(start)

  const path = new Path()
  path.levelIndex = data.levelIndex

  const sky = new Rect(0, 0, canvas.width, canvas.height, [
    '#B68E72',
    '#B68E72',
  ])

  return {
    shutdown() {},
    update() {},
    render() {
      sky.render()
      path.render()
      dots.forEach((b) => b.render())
      start.render()
    },
  }
}
