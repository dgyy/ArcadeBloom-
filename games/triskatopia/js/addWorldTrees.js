export function addTrees(scene) {

  let treeGeo, treeMatl, count;

  if (scene == 'One') {

    treeGeo = new THREE.ConeGeometry(0.5, 2, 8);
    treeMatl = new THREE.MeshStandardMaterial({
      color: 'seagreen',
      flatShading: true,
    });
    count = 2000;

  }

  if (scene == 'Two') {

    treeGeo = new THREE.CylinderGeometry(2.5, 2.5, 10, 5);
    treeMatl = new THREE.MeshStandardMaterial({
      color: 'indigo',
      flatShading: true,
    });

    count = 700;

  }


  if (scene == 'Three') {

    treeGeo = addCactus();
    treeMatl = new THREE.MeshStandardMaterial({
      color: 'seagreen',
      flatShading: true,
    });

    count = 100;

  }

  const tree = new THREE.Mesh(treeGeo, treeMatl);

  const matrix = new THREE.Matrix4();
  const mesh = new THREE.InstancedMesh(tree.geometry, tree.material, count);
  mesh.castShadow = true;

  for (let i = 0; i < count; i++) {

    randomizeMatrix(matrix);
    mesh.setMatrixAt(i, matrix);


    if (scene == 'Three') {
      mesh.rotateY(Math.random() * THREE.MathUtils.degToRad(i * 10));
    }

  }

  mesh.name = 'Trees';
  worldGroup.add(mesh);

}

export const randomizeMatrix = function () {

  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  return function (matrix) {


    position.x = ((Math.sin(Math.random() * 360)) * world.width / 2);

    position.y = (Math.random() * 4 - 2) + 1;

    position.z = ((Math.cos(Math.random() * 360)) * world.width / 2);

    const distance = Math.sqrt(Math.abs((position.x * position.x) + Math.abs((position.z * position.z))));


    if (distance < world.flatZone * 5) {

      position.x = position.x * 10 + 3;
      position.z = position.z * 10 + 3;

    }

    quaternion.y = Math.random();

    scale.x = scale.y = scale.z = Math.random();

    matrix.compose(position, quaternion, scale);

  };

}();
