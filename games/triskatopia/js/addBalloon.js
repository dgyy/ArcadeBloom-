export function addBalloon() {

  const zeroSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.005, 32, 16),
    new THREE.MeshStandardMaterial()
  );

  vehicle.add(zeroSphere);
  
  zeroSphere.visible = false;

//TODO merge geometries

  //balloon
  const ballGrp = new THREE.Group();
  const bskGrp = new THREE.Group();

  const sphereTopMatl = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xff0066),
    side: THREE.DoubleSide,
    flatShading: true
  });

  const sphereTopGeo = new THREE.SphereGeometry(2.5, 16, 32, 0, 6.283185, 0, Math.PI * 0.5);
  const sphereBtmGeo = new THREE.SphereGeometry(2.5, 16, 32, 0, 6.283185, Math.PI * 0.1, Math.PI * 0.4);
  const sphereTopMesh = new THREE.Mesh(sphereTopGeo, sphereTopMatl);

  ballGrp.add(sphereTopMesh);

  const sphereBtmMesh = new THREE.Mesh(sphereBtmGeo, sphereTopMatl);
  sphereBtmMesh.rotation.set(180 * (Math.PI / 180), 0, 0);
  sphereBtmMesh.scale.set(1, 1.15, 1);

  ballGrp.add(sphereBtmMesh);

  vehicle.add(ballGrp);

  //Basket
  const ringGeo = new THREE.RingGeometry(1, 0.9, 32, 1, 0, THREE.MathUtils.degToRad(330));
  const ringMatl = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x663300), side: THREE.DoubleSide });
  const ringMesh = new THREE.Mesh(ringGeo, ringMatl);  //TODO make instance geometry
  ringMesh.position.set(0, - 1, 0);
  ringMesh.rotation.set(THREE.MathUtils.degToRad(90),0,  THREE.MathUtils.degToRad(-90  + 15));

  for (let i = 0; i < 8; i++) {

    const ringI = ringMesh.clone();
    ringI.position.set(0, (i * -0.1), 0);
    const scaleFac = 1 + (i + 1) * -0.05;
    ringI.scale.set(scaleFac, scaleFac, scaleFac);

    bskGrp.add(ringI);

  }

  vehicle.add(bskGrp);

  //tilt-o-meter
  // const geo = new THREE.CylinderGeometry(0.1, 0.1, 50, 25);
  // const mat = new THREE.MeshStandardMaterial({
  //   color: 'indigo',
  //   flatShading: true,
  // });
  // const mesh = new THREE.Mesh(geo, mat);
  // mesh.position.set(20,0,0);
  // vehicle.add(mesh);

  // const mat2 = new THREE.MeshStandardMaterial({
  //   color: 'white',
  //   flatShading: true,
  // });
  // const mesh2 = new THREE.Mesh(geo, mat2);
  // mesh2.position.set(20,0,0);
  // scene.add(mesh2)


  //aileron
  // const wingGeo = new THREE.CylinderGeometry(0.08, 0.15, 1, 32);
  // const wingMatl = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  // const wingPortMesh = new THREE.Mesh(wingGeo, wingMatl);

  // const aileronGeo = new THREE.CylinderGeometry(0.04, 0.14, 0.9, 3);
  // const aileronMatl = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  // const aileronMesh = new THREE.Mesh(aileronGeo, aileronMatl);
  // aileronMesh.rotation.set(0, -30 * (Math.PI / 180), 0);
  // aileronMesh.position.set(0.09, 0, 0);

  // wingPortMesh.name = "wingPort"
  // wingPortMesh.add(aileronMesh);

  // wingPortMesh.rotation.set(90 * (Math.PI / 180), 0, 90 * (Math.PI / 180));
  // wingPortMesh.position.set(-1.25, -0.9, -0.25) //out, down, central

  // vehicle.add(wingPortMesh);

  // const wingStarMesh = wingPortMesh.clone();
  // wingStarMesh.scale.set(-1, 1, -1);
  // wingStarMesh.rotateZ(3.14)
  // wingStarMesh.position.set(1.25, -0.9, -0.25);

  // wingStarMesh.name = "wingStar"

  // vehicle.add(wingStarMesh);

  ballGrp.translateY(3.5);
  bskGrp.translateY(-0.5);

  vehicle.traverse(function (e) {

    if (e.isMesh) {
      e.castShadow = true;
      e.receiveShadow = true;
    }


  });

  dummyOb.add(vehicle);

}





