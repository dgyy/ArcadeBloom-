

/**
 * 
 * @author Shauna Lynch 
 * 
**/

//

/////////////////////HTML Stuff/////////////////////////////////////////////////////////////////


document.getElementById("start").addEventListener("click", removeElemFn);
document.getElementById("introButton").addEventListener("click", introClicked);
document.getElementById("aboutButton").addEventListener("click", aboutClicked); 
document.getElementById("close1").addEventListener("click", closeClicked);
document.getElementById("close2").addEventListener("click", closeClicked);

function introClicked() {

    document.getElementById("introID").style.visibility = 'visible';

}

function aboutClicked() {

    document.getElementById("aboutID").style.visibility = 'visible';

}

function closeClicked() {

    document.getElementById("introID").style.visibility = 'hidden';
    document.getElementById("aboutID").style.visibility = 'hidden';

}
 

function removeElemFn() {

    document.getElementById("title").remove();
    document.getElementById("start").remove();
    document.getElementById("introButton").remove();
    document.getElementById("aboutButton").remove();
    document.getElementById("introID").remove();
    document.getElementById("aboutID").remove();
    camera.position.set(-7, 4, 10);
    camera.lookAt(new THREE.Vector3(-2, 3, -5));

}
/////////////////////////////////////////////////////////////////////////////////////////////////

export const testArr = [];

export const clickable_2D = [];
export const clickable_3D = [];

//export const vehicle = new THREE.Object3D();
export const vehicle = new THREE.Group()

export const clock = new THREE.Clock();


export const textureLoader = new THREE.TextureLoader();

  export const particleTexture = textureLoader.load(
    './media/1.png',
     function (texture){console.log(texture)},
     undefined,
     function ( err ) {console.error( 'An error happened.', err )}
    
    );

export const blurTexture = textureLoader.load(
    './media/blurPic.png', 
    function (texture){console.log(texture)},
    undefined,
    function ( err ) {console.error( 'An error happened.', err )}

);


let baseReferenceSpace;

//game objects
export const balloonStats = {

    Altitude: 0,
    Tilt: 0, 
    Level: 1,
    isMoving: false,
    isMmovingInY: false,
    isMmovingRot: false,
    isGoingHome: false,
    isLaunched: false,
    timeRequired: null,
    startingSpot: new THREE.Vector3(0, 0, 0),
    startingTilt: new THREE.Euler(0, 0, 0, 'XYZ'),
   

}

export const world = {

    width: 150,
    height: 75,
    flatZone: 5,
    moveDown: -1.5

}


export const worldGroup = new THREE.Group();

//location of launch target point
export const targetOb = {

    position: new THREE.Vector3(0, 0.5, -40),
    winTime: false,
    box: new THREE.Box3()

}
//target arrow animation
export const arrowArr = [];

export const clashBoxMountain = new THREE.Box3();

//for win Animation - fireworks()
export const mixerArr = [];

//for the other balloons
export const theOthers = [];


//scene basics
export const sizes = {

    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)

}


export const scene = new THREE.Scene();

scene.background = new THREE.Color(0x330033);

export const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(new THREE.Vector3(20, 4, 0));
// camera.position.set(-7, 4, 10);
// camera.lookAt(new THREE.Vector3(0, 3, 0));
scene.add(camera);

// const light2 = new THREE.AmbientLight(0x404040, 3);
// scene.add(light2);

const light = new THREE.HemisphereLight(0xfff0f0, 0x60606, 2);
light.position.set(1, 1, 1);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1)//1.2
dirLight.position.set(15, 25, 15);
dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 1024; // default
dirLight.shadow.mapSize.height = 1024; // default
dirLight.shadow.camera.near = 0.5; // default
dirLight.shadow.camera.far = 1000; // default

dirLight.shadow.camera.left = - 250;
dirLight.shadow.camera.right = 250;
dirLight.shadow.camera.top = 250;
dirLight.shadow.camera.bottom = - 250;

dirLight.name = 'Light'

scene.add(dirLight)

export const renderer = new THREE.WebGLRenderer({

    antialias: true,


});

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.xr.enabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

//Orbit Controls
//const orbitControls = new OrbitControls(camera, renderer.domElement);
// //orbitControls.enableDamping = true;
// orbitControls.target.set(0, 0, -5);
// orbitControls.update();

const ctr1 = renderer.xr.getController(0) //for vr contrller
const ctr2 = renderer.xr.getController(1) //for vr controller

XRSuppQry();

const carrotGeo = new THREE.ConeGeometry(0.005, 0.025, 8);
const carrotMatl = new THREE.MeshStandardMaterial({ color: 'orange' })
export const carrot = new THREE.Mesh(carrotGeo, carrotMatl);

carrot.rotation.set(0, 0, 0);//Math.PI * 1.5, 0, 0
carrot.visible = false
carrot.name = 'Carrot';
scene.add(carrot);

export const carrotBox = new THREE.Box3();

export const dummyOb = new THREE.Object3D();

scene.add(dummyOb);


addSkySphere();
addTerrain('One');
addTrees('One');
addClouds();
addMountain();
scene.add(worldGroup);

addBalloon();
addBalloonOther();
addTarget();



let alpha = 0;

let destinationSpot = new THREE.Vector3();
let lerper = new THREE.Object3D();

let ogQuat = new THREE.Quaternion();
let destinationQuat = new THREE.Quaternion();
let slerper = new THREE.Object3D();

let offsetPosition = new THREE.Vector3();
let offsetRotation = new THREE.Quaternion();

//otherBalloon animation
let blnFrq = 0.005;
let blnHt = 0.0002;

//https://hofk.de/main/discourse.threejs/2021/MovementOnCurve/MovementOnCurve.html
let p = new THREE.Vector3();
let line2, curve2;


export function moveIt(a, b) {

    const transform = new XRRigidTransform(a, b);

    const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace(transform);

    renderer.xr.setReferenceSpace(teleportSpaceOffset);

}


function addCalcCurve() {

    if (line2) {   scene.remove(line2);    }

    const somePoints = [

        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -2.66, -13.39),
        new THREE.Vector3(0, -10.25, -24.75),
        new THREE.Vector3(0, -21.61, -32.34),
        new THREE.Vector3(0, -35, -35),
        new THREE.Vector3(0, -80, -35)

    ];

    const newPoints = []

    somePoints.forEach(e => {

        let point3d = new THREE.Vector3(e.x, e.y, e.z).applyMatrix4(dummyOb.matrixWorld);
        newPoints.push(new THREE.Vector3(point3d.x, point3d.y, point3d.z));

    });

    curve2 = new THREE.CatmullRomCurve3(newPoints);
    curve2.closed = false;

    const points = curve2.getPoints(7);


    line2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xffccff }));
    line2.name = "line";


    scene.add(line2);


}

function yhryd(string) {

    console.log(`you have reached your destination;   ${string}`)

    balloonStats.timeRequired = null;
    balloonStats.isMoving = false;
    balloonStats.isMmovingInY = false;
    balloonStats.isMmovingRot = false;
    balloonStats.isGoingHome = false;
    alpha = 0;

    upDateHuds(balloonStats);

    addCalcCurve();
    
}


function animate() {

    renderer.setAnimationLoop(render);

}

function render() {

    const elapsedTime = clock.getElapsedTime();

    arrowArr[0].rotation.y += 0.01;

    if (theOthers.length == 2) {

        theOthers[0].rotation.y += 0.0001;
        theOthers[0].position.y += Math.sin(elapsedTime * blnFrq) * blnHt;

        theOthers[1].rotation.y -= 0.0002;
        theOthers[1].position.y -= Math.sin(elapsedTime * blnFrq) * blnHt;
    }


    if (renderer.xr.isPresenting == true) {

        //selecting
        cleanIntersected();

        intersectObjects(ctr1);
        intersectObjects(ctr2);


        //Movement
        if (balloonStats.isMoving == true) {

            alpha = alpha + (elapsedTime / balloonStats.timeRequired) * 0.1;
          


            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (balloonStats.isMmovingInY == true) {

                destinationSpot.copy(carrot.position);

                lerper.position.lerp(destinationSpot, alpha);

                offsetPosition = {

                    x: -lerper.position.x,
                    y: -lerper.position.y,
                    z: -lerper.position.z,
                    w: 1

                }

                dummyOb.position.set(-offsetPosition.x, -offsetPosition.y, -offsetPosition.z, -offsetPosition.w);

                if (alpha > 1) { yhryd('pos') }


            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (balloonStats.isMmovingRot == true) {

                ogQuat.setFromEuler(balloonStats.startingTilt)
                destinationQuat.setFromEuler(carrot.rotation)
                slerper.quaternion.slerpQuaternions(ogQuat, destinationQuat, alpha);

                // offsetRotation = {

                //     x: - slerper.quaternion.x,
                //     y: -slerper.quaternion.y,
                //     z: -slerper.quaternion.z,
                //     w: -slerper.quaternion.w

                // }TODO rotates base reference space around world origin, not a local origin???

                dummyOb.quaternion.set(

                    -slerper.quaternion.x,
                    -slerper.quaternion.y,
                    -slerper.quaternion.z,
                    -slerper.quaternion.w


                );

                if (alpha > 1) { yhryd('rot') }


            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


            if (balloonStats.isLaunched == true && dummyOb.position.y > 1) {

                p = curve2.getPoint(alpha * 0.1);

                dummyOb.position.set(p.x, p.y - 0.1, p.z);

                offsetPosition = {

                    x: -p.x,
                    y: -p.y - 0.1,
                    z: -p.z,
                    w: 1

                }

                //loose check for mountain clash
                if (clashBoxMountain.containsPoint(dummyOb.position) == true) {

                    balloonStats.isLaunched = false;

                    console.log('looser time clash mountin');
                    looserTime();
                    alpha = 0;
                    scene.remove(line2);


                }

            }


            //landed
            if (balloonStats.isLaunched == true && dummyOb.position.y < 1) {

                balloonStats.isLaunched = false;

                if (targetOb.box.containsPoint(dummyOb.position) == true) {

                    //win
                    console.log('winner time')
                    winnerTime();
                    alpha = 0;
                    scene.remove(line2);

                }

                else {

                    console.log('looser time, missed target')
                    looserTime();
                    alpha = 0;
                    scene.remove(line2);

                }

            }

            moveIt(offsetPosition, offsetRotation);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    }


    if (targetOb.winTime == true) {

        mixerArr.forEach(e => e.update(elapsedTime * 0.005))

    }

    renderer.render(scene, camera);


}




animate();






/****************************************************************
 * Event Listeners
*****************************************************************
 
 
 
/****************************************************************
 * Resize
*****************************************************************/

window.addEventListener('resize', resizeMe);

function resizeMe() {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)


}


/****************************************************************
 * Mouse
*****************************************************************/

document.addEventListener('pointermove', mouseHover);
document.addEventListener('click', mouseDown);//'pointerdown doesn't work as a activation event

//mouse
let INTERSECTED; //pointermove event listener hovering
let intersects;
const mouse = new THREE.Vector2();
const raycaster2D = new THREE.Raycaster();

function mouseHover(event) {

    intersects = getPointerInts(event);

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);

        }

    } else {

        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;

    }


}

function mouseDown(event) {

    intersects = getPointerInts(event);

    clickedOn(intersects)

}

function getPointerInts(event) {

    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;

    raycaster2D.setFromCamera(mouse, camera)

    const intersection = raycaster2D.intersectObjects(clickable_2D);
    return intersection

}

/****************************************************************
 * XRSession
*****************************************************************/

//controller helper
const geometryLine = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);
export const line = new THREE.Line(geometryLine);
line.name = 'line';
line.scale.z = 5;

renderer.xr.addEventListener('sessionstart', () => {

    //add controllers and controller helpers
    scene.add(ctr1);
    scene.add(ctr2);

    ctr1.add(line.clone());
    ctr2.add(line.clone());

    addXR_UI();
    addLicense();

    baseReferenceSpace = renderer.xr.getReferenceSpace();

    //remove 2D pointer eventlisteners
    document.removeEventListener('pointermove', mouseHover);
    document.removeEventListener('click', mouseDown);

    window.removeEventListener('resize', resizeMe);

})


renderer.xr.addEventListener('sessionend', () => {

    //add 2D pointer eventlisteners
    document.addEventListener('pointermove', mouseHover);
    document.addEventListener('click', mouseDown);

    window.addEventListener('resize', resizeMe);


});


/****************************************************************
 * XRControllers
*****************************************************************/

//vr controllers
const raycasterXR = new THREE.Raycaster();
const intersectedXR = [];

//hand model
const geometryKnot = new THREE.TorusKnotGeometry(0.05, 0.01, 100, 16);
const materialKnot = new THREE.MeshStandardMaterial();
const torusKnot = new THREE.Mesh(geometryKnot, materialKnot);
scene.add(torusKnot);


ctr1.addEventListener('selectstart', onSelectStart);
ctr1.addEventListener('selectend', onSelectEnd);
ctr1.addEventListener('connected', (e) => {

    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(torusKnot);
    scene.add(controllerGrip1);

});

ctr1.addEventListener('disconnected', () => {

    //TODO
    //this.remove(this.children[0])

});

if (ctr2) {

    ctr2.addEventListener('selectstart', onSelectStart)
    ctr2.addEventListener('selectend', onSelectEnd)
    ctr2.addEventListener('connected', () => {

        const controllerGrip2 = renderer.xr.getControllerGrip(1);
        controllerGrip2.add(torusKnot);
        scene.add(controllerGrip2);

    });

    ctr2.addEventListener('disconnected', () => {

        //TODO
        // this.remove(this.children[0])

    });

}


function onSelectStart(event) {

    const controller = event.target;

    const intersections = getIntersections(controller);

    clickedOn(intersections);

    if (intersections.length > 0) {

        const intersection = intersections[0];

        const object = intersection.object;
        object.material.emissive.b = 1;

        controller.userData.selected = object;

    }

    controller.userData.targetRayMode = event.data.targetRayMode;

}

function onSelectEnd(event) {

    const controller = event.target;

    if (controller.userData.selected !== undefined) {

        const object = controller.userData.selected;
        object.material.emissive.b = 0;

        controller.userData.selected = undefined;

    }

}

function getIntersections(controller) {

    controller.updateMatrixWorld();

    raycasterXR.setFromXRController(controller);

    return raycasterXR.intersectObjects(clickable_3D);

}

function intersectObjects(controller) {

    // Do not highlight in mobile-ar

    if (controller.userData.targetRayMode === 'screen') return;

    // Do not highlight when already selected

    if (controller.userData.selected !== undefined) return;

    //const line = controller.getObjectByName( 'line' );
    const intersectionsXR = getIntersections(controller);

    if (intersectionsXR.length > 0) {

        const intersection = intersectionsXR[0];

        const object = intersection.object;
        object.material.emissive.r = 1;
        intersectedXR.push(object);

        line.scale.z = intersection.distance;

    } else {

        line.scale.z = 5;

    }

}

function cleanIntersected() {

    while (intersectedXR.length) {

        const object = intersectedXR.pop();
        object.material.emissive.r = 0;

    }

}


