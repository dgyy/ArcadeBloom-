import { GAME_PREFIX } from '@/params/main'

export const memoize = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map<string, ReturnType<T>>()
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

export const EventEmitter = () => {
  const events: { [key: string|number]: Function[] } = {}
  return {
    on: (event: string| number, fn: Function) => {
      if (!events[event]) {
        events[event] = []
      }
      events[event].push(fn)
    },
    off: (event: string|number, fn: Function) => {
      if (!events[event]) {
        return
      }
      events[event] = events[event].filter(f => f !== fn)
    },
    emit: (event: string|number, ...args: any[]) => {
      if (!events[event]) {
        return
      }
      events[event].forEach(f => f(...args))
    }
  }
}

export const randomFromList = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)]
}

export const nthRoot = (x: number, n: number) => {
  // if x is negative function returns NaN
  if (x < 0) {
    return -Math.exp((1 / n) * Math.log(x * -1))
  }
  return Math.exp((1 / n) * Math.log(x))
}

export const create2DArray = <T>(rows: number, cols: number, defaultValue: T): T[][] => {
  const arr: T[][] = []
  for (let i = 0; i < rows; i++) {
    arr[i] = []
    for (let j = 0; j < cols; j++) {
      arr[i][j] = defaultValue
    }
  }
  return arr
}
class PathNode {
  // g cost
  g: number = 0
  // h gost
  h: number = 0
  parent: PathNode | null = null

  // eslint-disable-next-line no-useless-constructor
  constructor (public x: number, public y: number) {
  }

  // f cost
  get f (): number {
    return this.g + this.h
  }
}

export const aStar = (start: [number, number], end: [number, number], grid: number[][]): [number, number][] | null => {
  const numRows = grid.length
  const numCols = grid[0].length
  const openSet: PathNode[] = []
  const closedSet: PathNode[] = []
  const startNode = new PathNode(start[0], start[1])
  const endNode = new PathNode(end[0], end[1])
  openSet.push(startNode)

  while (openSet.length > 0) {
    let currentNode = openSet[0]
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < currentNode.f || (openSet[i].f === currentNode.f && openSet[i].h < currentNode.h)) {
        currentNode = openSet[i]
      }
    }

    openSet.splice(openSet.indexOf(currentNode), 1)
    closedSet.push(currentNode)

    if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
      const path: [number, number][] = []
      let current = currentNode
      while (current !== null) {
        path.unshift([current.x, current.y])
        current = current.parent!
      }
      return path
    }

    const neighbors: PathNode[] = []
    const directions = [
      [0, -1], // Up
      [0, 1], // Down
      [-1, 0], // Left
      [1, 0] // Right
    ]

    for (const direction of directions) {
      const neighborX = currentNode.x + direction[0]
      const neighborY = currentNode.y + direction[1]

      if (neighborX >= 0 && neighborX < numRows && neighborY >= 0 && neighborY < numCols && grid[neighborX][neighborY] === 0) {
        const neighbor = new PathNode(neighborX, neighborY)
        neighbors.push(neighbor)
      }
    }

    for (const neighbor of neighbors) {
      if (closedSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)) continue

      const tentativeGCost = currentNode.g + 1

      if (!openSet.some((node) => node.x === neighbor.x && node.y === neighbor.y) || tentativeGCost < neighbor.g) {
        neighbor.g = tentativeGCost
        neighbor.h = manhattanDistance([neighbor.x, neighbor.y], [endNode.x, endNode.y])
        neighbor.parent = currentNode

        if (!openSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
          openSet.push(neighbor)
        }
      }
    }
  }

  return null
}

export const manhattanDistance = (nodeAPos: [number, number], nodeBPos: [number, number]) => {
  return Math.abs(nodeAPos[0] - nodeBPos[0]) + Math.abs(nodeAPos[1] - nodeBPos[1])
}

export const weightedRandom = (weights: number[]): number => {
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const random = Math.random() * totalWeight
  let weightSum = 0
  for (let i = 0; i < weights.length; i++) {
    weightSum += weights[i]
    if (random < weightSum) {
      return i
    }
  }
  return 0
}

export const saveToLocalStorage = (key: string, value: any, prefix = GAME_PREFIX) => {
  window.localStorage.setItem(`${prefix}_${key}`, JSON.stringify(value))
}

export const loadFromLocalStorage = (key: string, prefix = GAME_PREFIX) => {
  const value = window.localStorage.getItem(`${prefix}_${key}`)
  return value ? JSON.parse(value) : null
}
