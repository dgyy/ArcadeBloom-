export function addBalloonOther(){

 const count = 15;

  const points = [
    new THREE.Vector2(0.00 , 0.00 ),
    new THREE.Vector2(1.00 , 0.00 ),
    new THREE.Vector2(1.50 , 1.00 ),
    new THREE.Vector2(0.10 , 1.00 ),
    new THREE.Vector2(0.10 , 2.00 ),
    new THREE.Vector2(2.00 , 2.00 ),
    new THREE.Vector2(6.81 , 9.80 ),
    new THREE.Vector2(7.69 , 11.80 ),
    new THREE.Vector2(7.99 , 13.80 ),
    new THREE.Vector2(7.79 , 15.80 ),
    new THREE.Vector2(7.04 , 17.80 ),
    new THREE.Vector2(5.51 , 19.80 ),
    new THREE.Vector2(1.77 , 21.80 ),
    new THREE.Vector2(0.00 , 21.80 )
  ];

const geometry = new THREE.LatheGeometry( points );

const material = new THREE.MeshStandardMaterial({  side: THREE.DoubleSide,  flatShading: true });

const matrix = new THREE.Matrix4();
const mesh = new THREE.InstancedMesh(geometry, material, count);

for (let i = 0; i < count; i++) {

  randomizeMatrix_bo(matrix,i);
  mesh.setMatrixAt(i, matrix);

  const color = new THREE.Color().setHSL(Math.random(), 1, 0.6);
  mesh.setColorAt(i, color);  

}

scene.add(mesh);
theOthers.push(mesh)

const mesh2 = mesh.clone();
mesh2.scale.set(-1,1,1);
mesh2.rotation.set(0,3.14/2,0);
mesh.position.set(0,10,0)
scene.add(mesh2);
theOthers.push(mesh2);

}

const position = new THREE.Vector3();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3();
let scaleFactor = (Math.random()+0.1) * 10;

const randomizeMatrix_bo = function () {

  return function (matrix , i) {

    //if i is even
    if (i % 2 == 0){
      position.x = (Math.random() * 80 - 40) + 45;
    
    }

    //if i is odd
    else{

      position.x = (-1*(Math.random() * 80 - 40)) - 45;

    }

      position.y = Math.random() * 20 + 15 ;
      position.z = Math.random() * 80 - 40;

      //quaternion.random();

      scaleFactor = (Math.random()+0.1) * 10;

      let rescd = remap(scaleFactor , 1 , 10, 3, 5 ) /20

      scale.x = scale.y = scale.z = rescd  ;

      matrix.compose(position, quaternion, scale);

  };

}();
