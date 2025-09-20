const increment = 2;//altitude increment meters
const tiltIncrDeg = 2//Math.PI / 90; //2 deg
const tiltIncr = THREE.MathUtils.degToRad(tiltIncrDeg);

export function clickedOn(arr) {

    if (arr.length == 0) {

        return

    }

    if (balloonStats.isMoving == true || balloonStats.isLaunched == true) { return }

    switch (arr[0].object.name) {

        case 'enterVR':

            startSession('immersive-vr');

            removeOb('enterVR', scene);

            sleep(5).then(() => { sound(soundEnterVR) });

            break;


        case 'exitVR':

            console.log('exit VR text clicked ');

            const session = renderer.xr.getSession()

            shutdownXR(session);

            break;

        case 'home':

            if (renderer.xr.isPresenting != true) { return }

            console.log('home clicked');

            sound(soundHome);

            balloonStats.startingSpot.y = balloonStats.Altitude;

            balloonStats.Altitude = 0;
            balloonStats.Tilt = 0;

            balloonStats.isMoving = true;
            balloonStats.isMmovingInY = true;
            balloonStats.isMmovingRot = true;

            balloonStats.isGoingHome = true;

            balloonStats.timeRequired = 3;

            updateCarrotSpace();

            clock.start();


            break;


        case 'altUp':

            if (renderer.xr.isPresenting != true) { return }

            else if (dummyOb.position.y > (world.height - 2)) {//too high

                sound(soundError);
                return
            }

            sound(soundAltUp)

            balloonStats.startingSpot.y = balloonStats.Altitude; //capture current Y value
            balloonStats.Altitude += increment; //new destination Y value

            balloonStats.isMoving = true;
            balloonStats.isMmovingInY = true;

            balloonStats.timeRequired = 1.5;

            updateCarrotSpace();

            clock.start();

            break;


        case 'altDown':

            if (renderer.xr.isPresenting != true) { return }

            else if (dummyOb.position.y < (0.9)) {//too low

                sound(soundError);
                return

            }

            sound(soundAltDown)

            balloonStats.startingSpot.y = balloonStats.Altitude;
            balloonStats.Altitude -= increment;

            balloonStats.isMoving = true;
            balloonStats.isMmovingInY = true;

            balloonStats.timeRequired = 1.5;

            updateCarrotSpace();

            clock.start();

            break;


        case 'tiltUp':

            if (renderer.xr.isPresenting != true) { return }

            else if (dummyOb.position.y < (2.9)) {//too low - huds digs into ground

                sound(soundError);
                return

            }

            sound(soundTilt);

            balloonStats.startingTilt.x = balloonStats.Tilt;

            balloonStats.Tilt += tiltIncr;

            balloonStats.isMoving = true;
            balloonStats.isMmovingRot = true;
            balloonStats.timeRequired = 3;

            updateCarrotSpace();

            clock.start();


            break;


        case 'tiltDown':

            if (renderer.xr.isPresenting != true) { return }

            else if (dummyOb.position.y < (2.9)) {//too low - huds digs into ground

                sound(soundError);
                return

            }

            sound(soundTilt);

            balloonStats.startingTilt.x = balloonStats.Tilt;

            balloonStats.Tilt -= tiltIncr;

            balloonStats.isMoving = true;
            balloonStats.isMmovingRot = true;
            balloonStats.timeRequired = 3;

            updateCarrotSpace();

            clock.start();

            break;

        case 'Launch':

            if (renderer.xr.isPresenting != true) { return }

            console.log("LAUNCHED");
            sound(soundLaunch);
            balloonStats.isMoving = true;
            balloonStats.timeRequired = 5;
            balloonStats.isLaunched = true


            break;


        default:

            console.log(`switch default .....`);

    }


}



async function shutdownXR(session) {
    if (session) {

        await session.end();

    }
}

export function updateCarrotSpace() {

    carrot.rotation.set(balloonStats.Tilt, 0, 0);
    carrot.position.set(0, balloonStats.Altitude, 0);

    carrotBox.setFromObject(carrot);
    carrotBox.expandByVector(new THREE.Vector3(5, 0.05, 5));

    const boxHelper = new THREE.Box3Helper(carrotBox, 0xffff00);
  //  scene.add(boxHelper);

}