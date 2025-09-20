export function addTarget() {

    const target = new THREE.Group();

    const ringGeo = new THREE.RingGeometry(1.8, 2.2, 32);
    const ringMatl = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x663300), side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMatl);
    ringMesh.rotation.set(90 * (Math.PI / 180), 0, 0);
    target.add(ringMesh);

    const crossGeo = addCross();
    const crossMesh = new THREE.Mesh(crossGeo, ringMatl);
    crossMesh.scale.set(5, 5, 0.01);
    crossMesh.rotateX(Math.PI / 2);
    target.add(crossMesh);

    const arrowGeo = addArrow();
    const arrowMatl = new THREE.MeshStandardMaterial({ color: 'orange' });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMatl);
    arrowMesh.scale.set(0.1, 0.1, 1)
    arrowMesh.rotateZ(Math.PI);
    arrowMesh.position.set(0, 3, 0);
    arrowArr.push(arrowMesh)
    target.add(arrowMesh);

    target.name = 'Target';
    target.position.set(targetOb.position.x, targetOb.position.y, targetOb.position.z,);
    target.scale.set(1.5,1.5,1.5)

    worldGroup.add(target);

    //win box
    targetOb.box.setFromObject(target);
    targetOb.box.translate(new THREE.Vector3(0, -5, 0));
    const boxHelper = new THREE.Box3Helper(targetOb.box, 'green');
    //worldGroup.add(boxHelper);

}