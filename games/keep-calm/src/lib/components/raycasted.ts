import type { ComponentDefinition, Entity } from 'aframe'
import { data, element, component, on } from '../util/helpers'
import { t } from '../util/three'

type Data = {
  raycaster: Entity | undefined
  lastPoint: THREE.Vector3
}

component('raycasted', {
  init() {
    let d = data<Data>(this)
    d.lastPoint = new t.Vector3(-9999)
    on(this, 'raycaster-intersected', event => d.raycaster = event.detail.el as Entity)
    on(this, 'raycaster-intersected-cleared', () => d.raycaster = undefined)
  },
  tick() {
    let d = data<Data>(this)
    let { lastPoint } = d
    let el = element(this)
    let intersection = d.raycaster?.components.raycaster.getIntersection(el) as THREE.Intersection | undefined

    if (!intersection) return

    let { point } = intersection

    if (
      point.x === lastPoint.x &&
      point.y === lastPoint.y &&
      point.z === lastPoint.z
    ) return

    console.log()

    el.emit('intersection', {
      ...intersection,
      hand: d.raycaster?.components['laser-controls']?.data.hand,
    })
    d.lastPoint = point
  }
} satisfies ComponentDefinition)
