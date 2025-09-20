export function winnerTime() {

    sound(soundWin);
    targetOb.winTime = true;
    balloonStats.isMoving = false;
    balloonStats.isLaunched = false;
 
    let a = sgobn('Target');
    a.visible = false;

    addFireworks()
    targetOb.winTime = true;
    sleep(7500).then(() => {
        removeOb('Fireworks', scene)
    });


    sleep(8000).then(() => {

        if (balloonStats.Level == 1) {

            l1tol2();
            targetOb.winTime = false;
            reset();
            return


        }

        else if (balloonStats.Level == 2) {

            l2tol3();
            targetOb.winTime = false;
            reset();

        }

        else if (balloonStats.Level == 3) {

            let a = sgobn("license");
            a.visible = true;

        }

    });

}

export function looserTime() {

    sound(soundLoose);

    balloonStats.isMoving = false;
    balloonStats.isLaunched = false;
   

    const crossGeo = addCross();
    const crossMatl = new THREE.MeshStandardMaterial({
        color: 'red',
        flatShading: true,
    });

    const crossMesh = new THREE.Mesh(crossGeo, crossMatl);
    crossMesh.scale.set(2.5, 2.5, 0.01);
    crossMesh.position.set(0, 0, -2)
    crossMesh.name = "Crosx"
    camera.add(crossMesh);


    sleep(3000).then(() => {

        removeOb("Crosx", camera)
        reset();

    });
}

export function reset() {

    console.log('reset');


    dummyOb.rotation.set(0, 0, 0);
    dummyOb.position.set(0, 0, 0);

    let offsetPosition = {

        x: 0,
        y: 0,
        z: 0,
        w: 1

    }

    let offsetRotation = new THREE.Quaternion();

    moveIt(offsetPosition, offsetRotation);

    balloonStats.startingSpot = new THREE.Vector3(0, 0, 0);
    balloonStats.startingTilt = new THREE.Euler(0, 0, 0, 'XYZ');

    balloonStats.Altitude = 0;
    balloonStats.Tilt = 0;
    upDateHuds();

    let a = sgobn('Target');
    a.visible = true;

}
