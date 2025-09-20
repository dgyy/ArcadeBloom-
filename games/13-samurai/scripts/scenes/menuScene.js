
const initialiseMenuScene = () => {
    messages = [];
    meshes = [];
    npcs = [];

    camera = { position: vector3(-12, 15, -100), direction: vector3(0, 0, 1), forwardSpeed: 1, yaw: 0, target: vector3(0, 0, 0), yaw: 0, fov: Math.PI / 2, aspect: width / height, near: .1, far: 200, up: vector3(0, 1, 0) };
    initialiseWebGl();
    loadLevelMeshes(levelMeshes);

    showMessage("13 SAMURAI", halfWidth, halfHeight - 100, 100, 100000, 30);
    showMessage('The Yoshindo sword is on this island!', halfWidth, halfHeight, 30, 300, 60);
    showMessage('But 13 of the best samurai are protecting it.', halfWidth, halfHeight, 30, 300, 360);
    showMessage('The sword will apear if some conditions are meet.', halfWidth, halfHeight, 30, 300, 660);

    showMessage('Use wasd to move and space to attack!', halfWidth, halfHeight, 30, 100000, 960);
    showMessage('Press enter to play. ', halfWidth, halfHeight + 50, 30, 100000, 1000);
    showMessage("a js13k submission", halfWidth, halfHeight + 180, 20)
    showMessage('made by Retro-pigeon', halfWidth, halfHeight + 200, 20);
}

const updateMenuScene = (deltaTime) => {
    //if (camera.position.z < 100) camera.position.z += .2;
    camera.position.x = Math.cos(timeStamp * .0001) * 30
    camera.position.z = Math.sin(timeStamp * .0001) * 100

    updateNpcs(deltaTime);
    render(meshes, camera);
    context.drawImage(glCanvas, 0, 0);
    updateMessages();
    if (enter) {
        setInterval(e => zzfxP(...backgroundMusic), 7000)
        showScene(playScene(), true);
    }

};
