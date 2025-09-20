import type { ComponentDefinition, SystemDefinition } from 'aframe';

type Element = Required<ComponentDefinition>['el']

export const eventObject = (event: { target: { object3D: THREE.Object3D } }) =>
  event.target.object3D

export const element = <T = Element>(component: ComponentDefinition) =>
  component.el as T

export const object = <T = THREE.Object3D>(component: ComponentDefinition) =>
  element(component).object3D as T

export const position = (component: ComponentDefinition) =>
  object(component).position

export const data = <T = unknown>(component: ComponentDefinition) =>
  component.data as T

export const on = (component: ComponentDefinition, event: string, fn: (event: Event) => void) =>
  element(component).addEventListener(event, fn)

export const component = (name: string, definition: ComponentDefinition) =>
  AFRAME.registerComponent(name, {
    ...definition,
    init() {
      // @ts-expect-error Exists
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.system?.register(this.el)
      definition.init?.call(this)
    },
    // @ts-expect-error Exists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    remove() { this.system?.deregister(this.el) },
  })

export const system = (name: string, definition: SystemDefinition) =>
  AFRAME.registerSystem(name, {
    ...definition,
    entities: [] as Element[],
    register(element: Element) { this.entities.push(element) },
    deregister(element: Element) { this.entities.splice(this.entities.indexOf(element), 1) }
  })

