
export let meshStandardMat = (args: THREE.MeshStandardMaterialParameters) =>
  new THREE.MeshStandardMaterial(args)

export let instancedMesh = (...args: ConstructorParameters<typeof THREE.InstancedMesh>) =>
  new THREE.InstancedMesh(...args)

export let mesh = (...args: ConstructorParameters<typeof THREE.Mesh>) =>
  new THREE.Mesh(...args)

export let plane = (width = 0, height = 0, args: THREE.MeshStandardMaterialParameters) => mesh(
  new THREE.PlaneGeometry(width, height),
  meshStandardMat(args),
)

export let getObjectByName = (object: THREE.Object3D, name: string) =>
  object.getObjectByName(name)

export let setPosition = (object: THREE.Object3D, x: number, y: number, z: number) =>
  object.position.set(x, y, z)

export let t = THREE
