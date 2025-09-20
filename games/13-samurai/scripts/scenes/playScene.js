var meshes, swordAngle, playerHealth, playerTargetHealth, canHit, potions, katanaIsShown, katanaIsFound, katanaSword, grassBunches, playSceneCounter;

const initialisePlayScene = () => {
    messages = [];
    meshes = [];
    npcs = [];
    potions = [];
    grassBunches = [];
    loadLevelMeshes(levelMeshes);
    playerHealth = 100;
    playerTargetHealth = 100;
    swordAngle = 2;
    playSceneCounter = 0;
    canHit = true;
    katanaIsShown = false;
    katanaIsFound = false;
    playerHitFx();
    for (let i = 0; i < 1000; i++) {
        let position = vector3(-63 + random(137), 0, -147 + random(311))
        if (pointIsOnMap(position.x, position.z)) grassBunch(position);
    }


    showMessage("Kill all 13 samurai!", halfWidth, halfHeight, 50, 180, 60);

    camera = { position: vector3(-12, 15, -66), direction: vector3(0, 0, 1), forwardSpeed: 1, yaw: 0, target: vector3(0, 0, 0), yaw: 0, fov: Math.PI / 2, aspect: width / height, near: .1, far: 200, up: vector3(0, 1, 0) };

}

updatePlayScene = (deltaTime) => {
    playSceneCounter++;

    if (camera.position.y > 1) camera.position.y -= camera.position.y * .1;


    processInputPlayScene(deltaTime);

    updateNpcs(deltaTime);
    updatePotions();

    render(meshes, camera);

    context.globalAlpha = .4;
    context.drawImage(glCanvas, 0, 0);
    context.globalAlpha = 1;

    updateMessages();

    swordAngle = Math.min(swordAngle + .2, Math.PI);
    context.save();
    context.rotate(swordAngle);
    context.fillStyle = `rgba(128,128,128,.5)`;
    context.translate(width, height);
    context.fillRect(-width * .5, -height * .5, 200 - 200 * swordAngle, 1200)
    context.restore();

    playerTargetHealth = Math.min(playerTargetHealth, 100);
    if (playerTargetHealth != playerHealth)
        playerHealth = Math.max(playerHealth * .95 + playerTargetHealth * .05, 0);

    context.fillStyle = 'red';
    context.fillRect(width / 3, 20, width / 3 * playerHealth / 100, 20);

    drawMap(context, camera,);

    if (katanaIsShown) {
        katanaSword.position.y += Math.cos(timeStamp * .005) * .01;
        katanaSword.rotation.y += .03;
        if (!katanaIsFound && distanceTo(camera.position, katanaSword.position) < 1) {
            katanaIsFound = true;
            katanaFoundFx();
            meshes.splice(meshes.indexOf(katanaSword, 1));
            showMessage('Now you are the master of Yoshindo sword!', halfWidth, halfHeight, 30, 300, 0);
            showMessage('You won this game! Congrats! Go play other games from js13k!', halfWidth, halfHeight, 30, 300, 300);
        }
    }

    if (npcs.length == 0 && !katanaIsShown) {
        katanaFoundFx();
        showMessage('Now you can find the Yoshindo sword!', halfWidth, halfHeight, 30, 300, 0);
        katanaSword = Mesh(katana.v, katana.i, katana.c, vector3(-12, .5, -66));
        meshes.push(katanaSword);
        katanaIsShown = true;
    }

    let grassCos = Math.cos(timeStamp * .005) * .007;
    grassBunches.forEach(grassBunch => { grassBunch.rotation.z += grassCos + randomBetween(.005); })
    
    if (playerHealth < 30 && playSceneCounter % 30 == 0) dangerFx();

    if (playerHealth <= 0) showScene(gameOverScene(), true);

}

updatePotions = () => {
    potions.forEach(potion => {
        if (potion.position.y > .3) potion.position.y -= potion.position.y * .1;
        potion.position.y += Math.cos(timeStamp * .005) * .01;
        potion.rotation.y += .03;

        if (distanceTo(potion.position, camera.position) < 1.2) {
            pickupFx();
            meshes.splice(meshes.indexOf(potion), 1);
            potions.splice(potions.indexOf(potion), 1);
            playerTargetHealth += 50;
        }
    });
}

const processInputPlayScene = (deltaTime) => {
    if (left) camera.yaw -= .15 * deltaTime;
    if (right) camera.yaw += .15 * deltaTime;
    if (up) {
        let cameraPosition = add(camera.position, multiplyBy(camera.direction, camera.forwardSpeed * deltaTime));
        if (pointIsOnMap(cameraPosition.x, cameraPosition.z)) camera.position = cameraPosition;
    }
    if (down) {
        let cameraPosition = add(camera.position, multiplyBy(camera.direction, -camera.forwardSpeed * deltaTime));
        if (pointIsOnMap(cameraPosition.x, cameraPosition.z)) camera.position = cameraPosition;
    }
    if (space && canHit) {
        atackFx();
        swordAngle = -1;
        npcs.forEach(npc => {
            let damage = 0;
            const angle = angleBetween(camera.position, npc.position);
            if (distanceTo(camera.position, npc.position) < 2) {
                damage = 2 - distanceTo(camera.position, npc.position) * 50 * deltaTime * (random() + .2);
                npc.position = add(npc.position, rotY(vector3(-.3, 0, -.3), angle));
                showMessage(damage | 0, halfWidth + randomBetween(100), halfHeight + randomBetween(100), 40, 90);
            }
            npc.health += damage;
        });
    }
    canHit = !space;

    camera.direction = rotY(vector3(0, 0, 1), camera.yaw)
    camera.target = add(camera.position, camera.direction);
}


