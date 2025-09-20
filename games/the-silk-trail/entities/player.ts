import { emit, off, on, onPointer, offPointer } from 'kontra'
import { playSound } from '../utils'
import * as constants from '../constants'
import { BODY_PATH, FACE_PATH } from './enemies'
import { Sprite } from './sprite'
import { Trajectory } from './Trajectory'

export const Player = ({ canvas, data, bullets }) => {
  let sprite = new PlayerSprite({
    x: canvas.width - 60,
    y: constants.GROUND_Y - constants.SIZE / 3,
    color: '#fff',
    width: constants.SIZE,
    height: constants.SIZE,
    health: constants.MAX_HP,
    maxHealth: constants.MAX_HP,
  })
  let angle = 0
  let speed = 0
  let canBlock = true
  const catchItem = (item) => {
    playSound('catch')
    data.items.unshift(item.name)
    onSwap()
  }
  on('player-catch-item', catchItem)
  sprite.progress = 0
  sprite.data = data
  const _x = () => sprite.x - constants.SIZE * 0.5
  const _y = () => sprite.y - constants.SIZE * 1.2
  let item
  let swapItem
  let updateTrajectory = (_angle, _speed) => {
    angle = _angle
    speed = _speed
    trajectory.angle = _angle

    const _item = constants.ITEM_TYPES[item.name]
    trajectory.speed = _speed * (1 / _item.weight)
  }
  let trajectory = new Trajectory({
    x: _x(),
    y: _y(),
    angle: 0,
    speed: 0,
  })

  const getItem = () => {
    let index = 0
    if (swapItem) {
      swapItem.x = _x()
      swapItem.y = _y()
      swapItem.small = false
      item = swapItem
      index = 1
    } else {
      const itemKey = data.items[0]
      item = bullets.spawn(_x(), _y(), itemKey)
    }
    data.items = data.items.slice(1)
    swapItem = bullets.spawn(_x() + 90, _y() + 30, data.items[index])
    if (swapItem) swapItem.small = true
  }
  getItem()

  const onThrow = () => {
    if (data.items.length === 0) return
    if (trajectory.stage === 0) {
      playSound('click')
      updateTrajectory(constants.MIN_ANGLE, constants.MIN_SPEED)
    } else if (trajectory.stage === 1) {
      playSound('click')
    } else if (trajectory.stage === 2) {
      playSound('catch')
      bullets.shoot(
        item,
        trajectory.speed,
        trajectory.speed,
        angle,
        constants.GRAVITY,
      )
      getItem()
    }
    trajectory.stage++
    if (trajectory.stage === 3) {
      trajectory.stage = 0
    }
  }

  const onBlock = () => {
    if (trajectory.stage !== 0 || !canBlock) return
    playSound('swap')
    sprite.block = true
    canBlock = false
    emit('delay', 'block', 20, () => {
      sprite.block = false
      emit('delay', 'allow-block', 60, () => {
        canBlock = true
      })
    })
  }

  const onSwap = () => {
    if (!item?.name) return

    playSound('swap')
    if (trajectory.stage !== 0) trajectory.stage = 0
    if (item) {
      data.items.push(item.name)
      item.ttl = 0
    }
    getItem()
  }

  const onLeft = () => {
    if (item.type === 'empty') {
      onBlock()
    } else {
      onThrow()
    }
  }

  const onClick = (e) => {
    if (e.clientX / canvas.clientWidth > 0.88) {
      onSwap()
    } else {
      onLeft()
    }
  }
  onPointer('down', onClick)

  let direction = -1
  return {
    sprite,
    trajectory,
    update() {
      sprite.update()
      trajectory.update()
      sprite.progress += constants.BASE_MOVEMENT_SPEED * sprite.speed
      if (sprite.progress >= constants.LEVELS[data.levelIndex].len)
        emit('level-end')
      const totalWeight = data.items
        .map((k) => constants.ITEM_TYPES[k].weight)
        .reduce((sum, n) => sum + n, 0)

      const ratio = 1 - totalWeight / constants.MAX_WEIGHT
      sprite.speed = constants.MAX_WAGON_SPEED * ratio

      if (trajectory.stage === 0) return

      if (trajectory.stage === 1) {
        if (angle > constants.MAX_ANGLE || angle < constants.MIN_ANGLE) {
          direction = direction === -1 ? 1 : -1
        }
        updateTrajectory(angle + direction * constants.BASE_ANGLE_CHANGE, speed)
      } else if (trajectory.stage === 2) {
        if (speed > constants.MAX_SPEED || speed < constants.MIN_SPEED) {
          direction = direction === -1 ? 1 : -1
        }

        updateTrajectory(angle, speed + direction * constants.BASE_SPEED_CHANGE)
      }
    },
    shutdown() {
      offPointer('down')
      off('player-catch-item', catchItem)
    },
  }
}

class PlayerSprite extends Sprite {
  progress: number
  speed: number
  block: boolean
  constructor(properties) {
    super({ ...properties })
    this.block = false
    this.progress = 0
    this.speed = 4.5
  }

  die() {
    super.die()
    emit('player-dead')
  }

  draw() {
    if (this.opacity === 0) return

    const s = constants.SIZE / 2
    this.context.translate(s, s * 2)
    this.context.scale(-1, 1)
    this.context.rotate(0.2)
    this.context.translate(0, this.block ? -30 : 0)
    this.svg(BODY_PATH, '#B6AC88', this.color, 1, -150, -150)
    this.svg(FACE_PATH, '#B6AC88', '#DEA248', 1, -150, -150)
    this.context.translate(-0, this.block ? 30 : 0)
    this.context.rotate(-0.2)
    this.context.scale(1, 1)
    this.context.translate(5, -20)
    this.context.rotate((this._frame / -10) * (this.speed / 4))
    this.svg(
      'M16 16L85 85M85 16L16 85M51 2V99M99 50H2',
      '#501502',
      '#7D1F01',
      6,
      -s,
      -s,
    )
    this.context.rotate((this._frame / 10) * (this.speed / 4))

    this.context.beginPath()
    this.context.arc(0, 0, 50, 0, Math.PI * 2)
    this.context.closePath()
    this.context.stroke()

    this.context.translate(-5, 20)
    this.context.translate(-s, -(s * 2))

    this.svg('M19 67H142L158 1H1L19 67Z', '#000', '#7D1F01', 2, -30, 25)
    this.context.translate(s, s * 2)
    this.context.rotate((this._frame / -10) * (this.speed / 4))
    this.svg(
      'M16 16L85 85M85 16L16 85M51 2V99M99 50H2',
      '#501502',
      '#7D1F01',
      6,
      -s,
      -s,
    )
    this.context.rotate((this._frame / 10) * (this.speed / 4))

    this.context.beginPath()
    this.context.arc(0, 0, 50, 0, Math.PI * 2)
    this.context.closePath()
    this.context.stroke()

    this.context.translate(-s, -(s * 2))

    this.drawDebug()
  }
}
