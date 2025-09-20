const count = 500;

export function addFireworks() {

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);


  blurTexture.minFilter = THREE.NearestFilter;
  blurTexture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshStandardMaterial({

    side: THREE.DoubleSide,
    map: blurTexture,

  }
  );

  const matrix = new THREE.Matrix4();
  const mesh = new THREE.InstancedMesh(geometry, material, count);

  for (let i = 0; i < count; i++) {

    randomizeMatrix_OG(matrix);
    mesh.setMatrixAt(i, matrix);

  }
  mesh.position.copy(targetOb.position);
  mesh.name = 'Fireworks'
  scene.add(mesh);


  
  const mixer = new THREE.AnimationMixer(mesh);
  mixerArr.push(mixer);

  //scale keyframe
  const scaleKF = new THREE.VectorKeyframeTrack('.scale', [0, 1, 2, 3, 4, 5, 6], [
    0.2, 0.2, 0.2,
    1.0, 1.0, 1.0,
    0.1, 0.1, 0.1,
    5.0, 5.0, 5.0,
    0.2, 0.2, 0.2,
    8.0, 8.0, 8.0,
    0.2, 0.2, 0.2
  ]);

  const clip = new THREE.AnimationClip('Action', 2, [scaleKF]);
  const ca = mixer.clipAction(clip);
  ca.setLoop(0,2)
  ca.play();


  sleep(5000).then(() => {

    targetOb.winTime = true;
    sound(soundWin);
  }

  );

  sleep(15000).then(() => {

    targetOb.winTime = false;
    scene.remove(mesh);
    mesh.dispose();
    geometry.dispose()
    material.dispose();

  }

  );


}
