import { gameStateMachine } from '@/game-state-machine'
import { menuState } from '@/game-states/menu.state'

import {
  createFloor,
  createFreight,
  createObstacle,
  createAlwaysOnTop,
  createSellPoint,
  createTree,
  createWell,
  createCrop,
  createMovingObstacle,
  createSign,
  createCyclopDoor,
  createGymDoor,
  createFactoryPoint
} from '@/core/ecs/helpers'

import { Component, ECS } from '@/lib/ecs'
import { State } from '@/core/state-machine'
import { ANVIL, WAGON, getMap } from '@/tiles'
import { Layers, RenderSystem } from '@/core/ecs/systems/render'
import { CollideSystem } from '@/core/ecs/systems/collide'
import { SoundSystem } from '@/core/ecs/systems/sound'
import { ParticleSystem } from '@/core/ecs/systems/particles'
import { PointSystem } from '@/core/ecs/systems/point'
import { DragSystem, MoveSystem, PhysicsSystem } from '@/core/ecs/systems/move'
import { ClickSystem } from '@/core/ecs/systems/click'
import { GameDataSystem, SellSystem } from '@/core/ecs/systems/gameplay'
import { Events } from '@/core/ecs/events'
import { Obstacles, Resource } from '@/core/ecs/component'
import { AISystem } from '@/core/ecs/systems/ai'
import { HELP_COUNTER, HELP_CYCLOPS, HELP_FACTORY_BARREL, HELP_FACTORY_BOX, HELP_GYM, HELP_RESOURCES } from '@/params/text'
import { ResourceFactorySystem } from '@/core/ecs/systems/factory'
import { getGridPointInPixels } from '@/lib/grid'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils'

const createMap = () => {
  const ec: Component[][] = []
  const startX = 0
  const startY = 0
  const map = getMap()
  for (const layer in map) {
    // @ts-ignore
    const tiles = map[layer]

    // @ts-ignore
    tiles.forEach(([sprite, x, y]) => {
      const point = getGridPointInPixels(x + startX, y + startY)
      const components: Component[] = []
      if (sprite === -1) {
        return
      }

      switch (Number(layer)) {
        case Layers.Floor:
          components.push(...createFloor(point, sprite))
          break
        case Layers.Objects:
          components.push(...createObstacle(point, sprite))
          break
        case Layers.AlwaysOnTop:
          components.push(...createAlwaysOnTop(point, sprite))
          break
      }

      ec.push(components)
    })
  }

  return ec
}

class GameState implements State {
  ecs: ECS
  stop = false

  constructor () {
    this.ecs = new ECS()
    this.ecs.addSystem(new ClickSystem())
    this.ecs.addSystem(new DragSystem())
    this.ecs.addSystem(new AISystem())
    this.ecs.addSystem(new CollideSystem())
    this.ecs.addSystem(new PhysicsSystem())
    this.ecs.addSystem(new ParticleSystem())
    this.ecs.addSystem(new MoveSystem())
    this.ecs.addSystem(new PointSystem())
    this.ecs.addSystem(new ResourceFactorySystem())
    this.ecs.addSystem(new SellSystem())
    this.ecs.addSystem(new RenderSystem())
    this.ecs.addSystem(new SoundSystem())
    this.ecs.addSystem(new GameDataSystem())

    this.ecs.ee.on(Events.gameOver, (score: Number) => {
      this.stop = true
      // eslint-disable-next-line
      let save = loadFromLocalStorage('gameData')
      if (!save) {
        save = { maxScore: 0, games: 0 }
      }

      let highText = ''
      if (save?.maxScore !== undefined && save?.maxScore < score) {
        highText = ' New high score!'
        save.maxScore = score
      }

      alert(`Game over! Your score is ${score}.${highText} Share it on twitter with #js13k!`)

      save.games += 1
      saveToLocalStorage('gameData', save)

      gameStateMachine.setState(menuState)
    })
  }

  addEntities (...entitiesComponents: Component[][]) {
    for (const ec of entitiesComponents) {
      const entity = this.ecs.addEntity()
      for (const c of ec) {
        this.ecs.addComponent(entity, c)
      }
    }
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter () {
    this.addEntities(
      createFreight(getGridPointInPixels(25, 9), Resource.wood),
      createFreight(getGridPointInPixels(25, 8), Resource.wood),
      createFreight(getGridPointInPixels(21, 3), Resource.barrel),
      createFreight(getGridPointInPixels(14, 6), Resource.box),
      createFreight(getGridPointInPixels(25, 5), Resource.food),
      createFreight(getGridPointInPixels(25, 6), Resource.food),
      createFreight(getGridPointInPixels(22, 5), Resource.water),
      createFreight(getGridPointInPixels(22, 6), Resource.water),
      // createFreight(getGridPointInPixels(20, 10), WAGON, 'freight', tileSizeUpscaled - 2, tileSizeUpscaled - 2, 0, { mass: 100, friction: 0.1 }),
      createSellPoint(getGridPointInPixels(20, 12)),
      createSellPoint(getGridPointInPixels(19, 12)),

      // trees
      createTree(getGridPointInPixels(9, 15)),
      createTree(getGridPointInPixels(35, 5)),
      createTree(getGridPointInPixels(18, 1)),
      createTree(getGridPointInPixels(21, 1)),
      // well
      createWell(getGridPointInPixels(28, 8)),

      // crops
      createCrop(getGridPointInPixels(1, 7)),
      createCrop(getGridPointInPixels(2, 7)),
      createCrop(getGridPointInPixels(27, 16)),
      createCrop(getGridPointInPixels(28, 16)),
      createCrop(getGridPointInPixels(11, 0)),

      // factories
      createFactoryPoint(getGridPointInPixels(38, 12), Resource.barrel, {
        [Resource.wood]: 1,
        [Resource.water]: 1,
        [Resource.food]: 1
      }),

      createFactoryPoint(getGridPointInPixels(2, 15), Resource.box, {
        [Resource.wood]: 1,
        [Resource.food]: 1
      }),

      // Obstacles
      createMovingObstacle(getGridPointInPixels(20, 9), WAGON, Obstacles.wagon),
      createMovingObstacle(getGridPointInPixels(17, 5), WAGON, Obstacles.wagon),
      createMovingObstacle(getGridPointInPixels(24, 11), ANVIL, Obstacles.anvil),
      createMovingObstacle(getGridPointInPixels(19, 13), ANVIL, Obstacles.anvil),
      createMovingObstacle(getGridPointInPixels(28, 3), ANVIL, Obstacles.anvil),

      // FIXME TEST
      // createAI(getGridPointInPixels(10, 10), true),
      // createAI(getGridPointInPixels(20, 10), true),
      // createAI(getGridPointInPixels(21, 10), true),
      // createAI(getGridPointInPixels(22, 10), true),

      // signs
      createSign(getGridPointInPixels(21, 13), HELP_COUNTER),
      createSign(getGridPointInPixels(14, 15), HELP_CYCLOPS),
      createSign(getGridPointInPixels(31, 2), HELP_GYM),
      createSign(getGridPointInPixels(36, 12), HELP_FACTORY_BARREL),
      createSign(getGridPointInPixels(4, 15), HELP_FACTORY_BOX),
      createSign(getGridPointInPixels(23, 16), HELP_RESOURCES),

      createCyclopDoor(getGridPointInPixels(15, 14)),
      createGymDoor(getGridPointInPixels(30, 1))
    )

    // this.addEntity(createSellPoint(getGridPointInPixels(new DOMPoint(10, 4))))

    // this.addEntity(
    //   createSpawnPoint(getGridPointInPixels(new DOMPoint(10, 14)))
    // )

    this.addEntities(...createMap())
  }

  onUpdate (deltaTime: number) {
    if (this.stop) {
      return
    }
    this.ecs.currentDelta = deltaTime
    this.ecs.update()

    //   // check for collisions
    //   for (const other of this.entities) {
    //     if (other.id === entity.id || !entity.physics) {
    //       continue;
    //     }

    //     // modified floor
    //     const isModifiedFloor = !!other.physicsModifiers;

    //     // no collision
    //     if (!other.physics && !isModifiedFloor) {
    //       continue;
    //     }
    //   }
    // }

    // if (controls.isEscape) {
    //   gameStateMachine.setState(menuState)
    // }
  }
}

export const getGameState = () => new GameState()
