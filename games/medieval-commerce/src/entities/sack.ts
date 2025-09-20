import { Entity } from '@/utils/elements'

import { Tile } from '../components'
import { Layers } from '@/utils/layers'
import { Tiles } from '@/utils/tiles'

export class Sack extends Entity {
  constructor () {
    super()

    this.components.push(
      new Tile(8, 7, Layers.Objects, Tiles.I_SACK_SALT)
    )
  }
}
