export function addClouds() {

  const cloudGroup = new THREE.Group();

  const cloudGeo = addCloud();
  cloudGeo.rotateY(Math.PI / 2);

  const cloudMatl = new THREE.MeshStandardMaterial({
    color: 'lavender',
    flatShading: true,
    transparent: true,
    opacity: 0.35,
    roughness: 0.5,
    metalness: 0.4
  });

  let mesh;

  for (let i = 0; i < 12; i++) {

    mesh = new THREE.Mesh(cloudGeo, cloudMatl);

    mesh.rotation.set(0, i * 0.5, 0);

    mesh.translateX(50);
    mesh.translateY(Math.max(12, Math.random() * 60));
    mesh.scale.set(5, 5, Math.max(6, Math.random() * 15));

    cloudGroup.add(mesh);

  }

  worldGroup.add(cloudGroup);

}










