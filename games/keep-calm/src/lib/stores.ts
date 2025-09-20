import { writable } from './util/store'

type States = 'screen' | 'intro' | 'tutorial' | 'game'

let initialState = (localStorage.getItem('state') ?? 'screen') as States

export let state = writable<States>(initialState)

export let castleHealth = writable(100)

export let firingLaser = writable<boolean>(false)
export let firingBomb = writable<boolean>(false)

export let laserEndPosition = writable<THREE.Vector3>(new THREE.Vector3())
export let laserIntersection = writable<THREE.Vector3>(new THREE.Vector3())
