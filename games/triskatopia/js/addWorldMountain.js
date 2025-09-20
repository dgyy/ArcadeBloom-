export function addMountain() {

  const geometry = new THREE.IcosahedronGeometry(6, 0);//6,0

  const material = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    transmission: 0.7,
    thickness: 0.5,

  });


  const material2 = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    transparent: true,
    opacity: 0.1,
    alphaTest: false//TODO required?
  });


  const rock1 = new THREE.Mesh(geometry, material);
  rock1.receiveShadow = true;
  rock1.position.set(0, 0, -15);//0,0,-15
  rock1.rotateX(- Math.PI / 2);


  //for shadow
  const shadowRock = new THREE.Mesh(geometry, material2);
  shadowRock.castShadow = true;

  rock1.add(shadowRock);
  rock1.name ='Rock';


  const rock2 = rock1.clone();
  rock2.translateX(-6);
  rock2.translateZ(-2);
  rock2.rotateY(Math.PI/2);
  rock2.name ='Rock2';

  const rock3 = rock1.clone();
   rock3.translateX(8);
   rock3.translateZ(-1.5);
   rock3.rotateY(-Math.PI/2);
   rock3.name ='Rock3';

  worldGroup.add(rock1, rock2,  rock3);

  //clash box
  clashBoxMountain.setFromObject(rock1);
  clashBoxMountain.expandByScalar(-1.2);
  clashBoxMountain.translate(new THREE.Vector3(0, 1, 0));
  const boxHelper = new THREE.Box3Helper(clashBoxMountain, 'red');
 // worldGroup.add(boxHelper);


}

export function addBuildings(){
 const buildGeo = new THREE.CylinderGeometry(5, 5, 20, 5);
 const buildMatl = new THREE.MeshStandardMaterial({
    color: 'indigo',
    flatShading: true,
    transparent: true,
    opacity: 0.5,
    alphaTest: false//TODO required?
  });

  const buildMesh = new THREE.Mesh(buildGeo, buildMatl);
  buildMesh.receiveShadow = true;
  buildMesh.position.set(0, 0, -15);//0,0,-15
  buildMesh.name = "Building"
  worldGroup.add(buildMesh);

  clashBoxMountain.setFromObject(buildMesh);

}

export function addCactusMountain(){
const cacGeo = addCactus();
const cacMatl = new THREE.MeshStandardMaterial({
  color: 'lightgreen',
  flatShading: true,
  transparent: true,
  opacity: 0.5,
  alphaTest: false//TODO required?
});

const cactusMesh = new THREE.Mesh(cacGeo, cacMatl);
cactusMesh.receiveShadow = true;
cactusMesh.position.set(0, 5, -15);//0,0,-15
cactusMesh.scale.set(3,3,3)
cactusMesh.name = "Cactus"
worldGroup.add(cactusMesh);

clashBoxMountain.setFromObject(cactusMesh);

}

