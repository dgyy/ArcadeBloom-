export function addTerrain(scene) {

  let color1, color2

  if (scene == 'One') {
    color1 = new THREE.Color(0x00cc66); //hill tops
    color2 = new THREE.Color(0x1affb2);
  }

 else if (scene == 'Two') {
    color1 = new THREE.Color(0x200000); //hill tops - city
    color2 = new THREE.Color(0x300000); //303030
  }


  else if (scene == 'Three') {
    color1 = new THREE.Color(0xD2B48C); //hill tops - desert
    color2 = new THREE.Color(0xFFDEAD);
  }

  const geometry = new THREE.PlaneGeometry(world.width, world.width, 15, 15);
  geometry.rotateX(- Math.PI / 2);

  const positions = geometry.attributes.position.array;

  const colors = new Float32Array(positions.length);

  const vertex = new THREE.Vector3();
  const vertex2 = new THREE.Color();

  for (let i = 0; i < positions.length; i += 3) {

    //position
    vertex.fromArray(positions, i);

    vertex.x += Math.random() * 10 - 5;
    vertex.z += Math.random() * 10 - 5;

    const distance = (vertex.distanceTo(worldGroup.position) / 5) - world.flatZone;  //TODO set max hill height?
    vertex.y = Math.random() * Math.max(0, distance * 0.75);

    vertex.toArray(positions, i);

    //color

    vertex2.fromArray(colors, i);

    if (vertex.y > 1.5) {
      vertex2.r = color1.r
      vertex2.g = color1.g
      vertex2.b = color1.b
    }
    else {
      vertex2.r = color2.r
      vertex2.g = color2.g
      vertex2.b = color2.b

    }

    vertex2.toArray(colors, i)


  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    //side: THREE.DoubleSide 

  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'Ground';

  mesh.position.set(0, world.moveDown, 0);
  mesh.receiveShadow = true;
  worldGroup.add(mesh);


}

