export const shadows = (root: THREE.Object3D) => root.traverse((child) => {
  const object = child as THREE.Mesh & THREE.Light & THREE.AmbientLight & THREE.RectAreaLight
  object.castShadow = object.isMesh || (object.isLight && !object.isAmbientLight && !object.isRectAreaLight)
  object.receiveShadow = object.isMesh
})
