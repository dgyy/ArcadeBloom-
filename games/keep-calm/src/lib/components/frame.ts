import type { ComponentDefinition } from 'aframe'
import { component } from '../util/helpers'

type Callback = (time: number, delta: number) => void

let fns: Callback[] = []

export let useFrame = (fn: Callback) => fns.push(fn)

component('frame', {
  tick(time, timeDelta) {
    for (let fn of fns) fn(time, timeDelta)
  }
} satisfies ComponentDefinition)
