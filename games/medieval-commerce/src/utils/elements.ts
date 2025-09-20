export class Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (...args: any[]) {}
}

export class Entity {
  components: Component[]

  constructor () {
    this.components = []
  }
}

export class System {
  _requiredComponents?: Array<typeof Component>
  _requiredEntities?: Array<typeof Entity>

  components?: Component[]
  entities?: Entity[]

  update (elapsedFrames: number, totalFrames: number, perf: unknown) {}
}
