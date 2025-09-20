import { Enemies } from '../entities/enemies'
import { Player } from '../entities/player'
import { Bullets } from '../entities/bullets'
import { checkCollisions, playSound } from '../utils'
import { Particles } from '../entities/particles'
import { emit, off, on, Text } from 'kontra'
import { LEVELS } from '../constants'
import { Background, Circle } from '../entities/bg'

export const RoadScene = ({ canvas, data, onNext, onWin, onLose }) => {
  const timers = {}

  const onPlayerDamaged = () => (hpText.text = `HP: ${player.sprite.health}`)

  const onDelay = (name: string, delay: number, fn: any) => {
    timers[name] = { fn, delay }
  }
  on('delay', onDelay)
  on('player-damaged', onPlayerDamaged)
  on('player-dead', onLose)
  on('level-end', onNext)
  const levelIndex = data.levelIndex
  const level = LEVELS[levelIndex]

  let map = new Circle({ x: 0, y: 20, size: 10, color: '#fff' })

  let particles = Particles()
  let bullets = Bullets({ particles })
  let player = Player({ canvas, data, bullets })
  let enemies = Enemies({ canvas, data, player, particles, bullets })
  const background = Background({
    canvas,
    getSpeed: () => player.sprite.speed * 3,
  })

  const hpText = Text({
    x: canvas.width - 70,
    y: canvas.height / 2 - 20,
    text: `HP: ${player.sprite.health}`,
    color: '#fff',
    font: 'bold 24px sans-serif',
    anchor: { x: 0.5, y: 0.5 },
  })

  const bulletPlayerCollide = (b, p) => {
    b.hurt(b.health)
    if (p.block) return emit('player-catch-item', b)
    p.hurt(1)
    emit('player-damaged')
    playSound('playerHit')
  }

  const bulletEnemyCollide = (b, e) => {
    b.hurt(b.health)
    e.hurt(b.damage, true)
    playSound('playerHit')
  }

  return {
    shutdown() {
      off('delay', onDelay)
      off('player-damaged', onPlayerDamaged)
      off('player-dead', onLose)
      off('level-end', onNext)
      enemies.pool.clear()
      bullets.pool.clear()
      player.shutdown()
    },
    update() {
      player.update()
      // map.update()
      background.update()
      enemies.update()
      enemies.pool.update()
      bullets.pool.update()
      particles.pool.update()

      Object.keys(timers).forEach((key) => {
        if (timers[key].delay-- === 0) timers[key].fn()
      })

      checkCollisions(
        bullets.pool.getAliveObjects().filter((b: any) => !b.isEnemyBullet),
        enemies.pool.getAliveObjects(),
        bulletEnemyCollide,
      )
      checkCollisions(
        bullets.pool.getAliveObjects().filter((b: any) => b.isEnemyBullet),
        [player.sprite],
        bulletPlayerCollide,
      )
      const width = canvas.width
      map.x = width * (player.sprite.progress / LEVELS[data.levelIndex].len)
    },
    render() {
      background.render()
      player.sprite.render()
      map.render()
      enemies.pool.render()
      particles.pool.render()
      bullets.pool.render()
      player.trajectory.render()
      hpText.render()
    },
  }
}
