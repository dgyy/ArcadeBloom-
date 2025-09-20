import Time from './time'
import Color from './color'
import Play, { Anim } from './play'
import Graphics from './graphics'
import { rnd_int } from './random'

/*
   neigbors
   . 1 .
   2 c 3
   . 4 .
   encoded as 1234
   */
function encode_bitmap(n_id: number, c: Cluster) {
  return c << ((4 - n_id) * 8)
}



/* https://chat.openai.com/share/ff6e1910-1ecf-4556-81f4-5b9e084fd962 */
function iterate2DArrayWithNeighbors(array: Tile[][]) {
  const rows = array.length;
  const cols = array[0].length;

  // Iterate through each element in the 2D array
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      let n_mask = 0;

      let neighbors = [
        [x, y - 1],
        [x - 1, y],
        [x + 1, y],
        [x, y + 1]
      ]
      neighbors.forEach(([nx, ny], n_idx) => {
        n_mask |= encode_bitmap(n_idx + 1, array[nx]?.[ny]?.cluster ?? OUT_OF_BOUNDS);
      })

      array[x][y].auto_set(n_mask)
    }
  }
}

const sum = (a: number[]) => a.reduce((a, b) => a + b, 0)

const tile_size = 16

// map  20x13
const solids = [
  [ [0,3,8,12], [3,16,9,12], [16,20,10,12]]
]

const ceils = [
  [[0,10,0,3],[0,5,3,6],[30,40,0,3],[35,40,3,6]],
  []
]

type Cluster = number
// clusters
const OUT_OF_BOUNDS = 0
const AIR = 1
const SOLID = 2
const CEIL = 3


const is_tile_solid: Record<Cluster, boolean> = {
  [OUT_OF_BOUNDS]: true,
  [SOLID]: true
}

function ulrd(up: number, left: number, right: number, down: number) {
  return encode_bitmap(1, up) | 
    encode_bitmap(2, left) | 
    encode_bitmap(3, right) | 
    encode_bitmap(4, down)
}

type NeighborsMask = number
type XY = [number, number]

const solid_auto_tiles: Record<NeighborsMask, XY> = {
  [ulrd(AIR, SOLID, AIR, SOLID)]: [4, 0],
  [ulrd(AIR, SOLID, SOLID, SOLID)]: [1, 0],
  [ulrd(SOLID, SOLID, SOLID, SOLID)]: [3, 2],
  [ulrd(SOLID, OUT_OF_BOUNDS, SOLID, SOLID)]: [0, 2],
  [ulrd(SOLID, SOLID, SOLID, OUT_OF_BOUNDS)]: [3, 2],
  [ulrd(SOLID, OUT_OF_BOUNDS, SOLID, OUT_OF_BOUNDS)]: [3, 2],
}

//console.log(ulrd(AIR, SOLID, SOLID, AIR))

const neighbors_auto_tiles: Record<Cluster, Record<NeighborsMask, XY>> = {
  [SOLID]: solid_auto_tiles,
  [CEIL]: solid_auto_tiles
}

const default_solid_tile: XY = [0, 0]

const default_tile_for_cluster: Record<Cluster, XY> = {
  [SOLID]: default_solid_tile,
  [CEIL]: default_solid_tile,
  [AIR]: [3, 1]
}

class Tile {

  static cluster = (cluster: Cluster) => {
    return new Tile(cluster)
  }

  get sw() {
    return tile_size
  }

  get sh() {
    return tile_size
  }

  get solid() {
    return is_tile_solid[this.cluster]
  }

  sx!: number
  sy!: number

  auto_set(neighbors: NeighborsMask) {
    let [sx, sy] = neighbors_auto_tiles[this.cluster]?.[neighbors] ?? default_tile_for_cluster[this.cluster]
    this.sx = sx * tile_size
    this.sy = sy * tile_size
  }

  constructor(readonly cluster: Cluster) {}
}

export class Collider {

  private constructor(
    readonly x: number,
    readonly y: number,
    readonly w: number,
    readonly h: number,
    readonly cluster: Cluster) {}

}

export const cell_size = 16
export const grid_width = 20 // Math.ceil(320 / cell_size)
export const grid_height = 12 // Math.ceil(180 / cell_size)

type XYWH = { x: number, y: number, w: number, h: number }

export class GridCollider {

  static make = () => {
    let grid: Tile[][] = []
    for (let x = 0; x <= grid_width; x++) {
      grid.push(new Array(grid_height).fill(Tile.cluster(AIR)))
    }


    // TODO
    solids.forEach(xs => {
      xs.forEach(x => {
        let [x1, x2, y1, y2] = x

        while (y1 < y2) {
          let i = x1
          while (i < x2) {
            grid[Math.floor(i)][Math.floor(y1)] = Tile.cluster(SOLID)
            i++;
          }
          y1++;
        }
      })
    })

    //grid[0][10] = Tile.cluster(SOLID)

    let res = new GridCollider(grid)
    res.auto_tiles_set_complete()
    return res
  }

  private constructor(readonly grid: Tile[][]) {}

  auto_tiles_set_complete() {
    iterate2DArrayWithNeighbors(this.grid)
  }

  add_collider(collider: Collider) {

    let x_start = Math.floor(collider.x / cell_size)
    let y_start = Math.floor(collider.y / cell_size)
    let x_end = Math.floor((collider.x + collider.w - 1) / cell_size)
    let y_end = Math.floor((collider.y + collider.h - 1) / cell_size)

    for (let x = x_start; x <= x_end; x++) {
      for (let y = y_start; y <= y_end; y++) {
        this.grid[x][y] = Tile.cluster(collider.cluster)
      }
    }
  }

  is_solid_xywh(xywh: XYWH, dx: number, dy: number) {
    let { x, y, w, h } = xywh

    let hw = w / 2

    try {
    return this.is_solid_rect(x - hw + dx, y - h + dy, w, h)
    } catch (_) {
      return true
    }
  }

  is_solid_rect(x: number, y: number, w = 1, h = 1) {

    let grid_x = (x / cell_size)
    let grid_y = (y / cell_size)
    let grid_end_x = ((x + w - 1) / cell_size)
    let grid_end_y = ((y + h - 1) / cell_size)

    if (grid_x < 0 || grid_end_x >= grid_width || grid_y < 0 || grid_end_y >= grid_height) {
      throw `outbounds ${x} ${y}`
    }

    // overuse x y
    for (x = grid_x; x <= grid_end_x; x++) {
      for (y = grid_y; y <= grid_end_y; y++) {
        x = Math.floor(x)
        y = Math.floor(y)
        if (this.grid[x][y].solid) {
          return true
        }
      }
    }
    return false
  }

  // TODO cache
  get tiles(): [number, number, Tile][] {
    let res = []
    for (let x = 0; x < grid_width; x++) {
      for (let y = 0; y < grid_height; y++) {
        res.push([x * cell_size, y * cell_size, this.grid[x][y]] as [number, number, Tile])
      }
    }
    return res
  }
}

type TilePlayData = {
  x: number,
  y: number,
  tile: Tile
}
class TilePlay extends Play {

  get data() {
    return this._data as TilePlayData
  }

  anim!: Anim

  _init() {
    let { x, y } = this.data
    this.anim = this.make(Anim, {
      x, y, name
    })
  }
}

let d_colors = [Color.red, Color.darkred]
export class PhCollider extends Play {
  grid!: GridCollider

  _anims_by_tile!: Map<Tile, TilePlay>

  debug = false

  _init() {
    this.grid = GridCollider.make()
    this._anims_by_tile = new Map()
  }


  _update() {
    if (Time.on_interval(0.86543)) {
      [d_colors[1], d_colors[0]] = [d_colors[0], d_colors[1]]
    }
  }

  _draw(g: Graphics) {
    this.grid.tiles.forEach(([x, y, tile]) => {
      if (this.debug) {
        if (tile.solid) {
          g.srect(d_colors[(x + y) / cell_size % 2], x, y, cell_size, cell_size)
        }
      } else {
        let dx = x, dy = y
        let { sx, sy, sw, sh } = tile
        g.spr(dx, dy, sx, sy, sw, sh)
      }
    })
  }
}
