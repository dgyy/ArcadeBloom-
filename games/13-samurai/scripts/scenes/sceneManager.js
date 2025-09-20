
var isInTransition = false,
    transitionCounter = 0,
    sceneToShow = null;

showScene = (scene, withTransition) => {
    if (isInTransition) return;
    if (withTransition) {
        sceneToShow = scene;
        transitionCounter = 0;
        isInTransition = true;
    }
    else
        currentScene = scene;
}


updateTransition = () => {
    transitionCounter += 1;
    let opacity = transitionCounter <= 50 ? transitionCounter * 2 / 100 : 1 - ((transitionCounter) / 100)
    context.fillStyle = `rgba(0,0,0,${Math.max(opacity, 0)})`;
    context.fillRect(0, 0, width, height);

    if (transitionCounter == 50) { currentScene = sceneToShow; currentScene.initialise() }

    if (transitionCounter > 100) isInTransition = false;
}

menuScene = () => ({ initialise: initialiseMenuScene, update: updateMenuScene })
playScene = () => ({ initialise: initialisePlayScene, update: updatePlayScene })
gameOverScene = () => ({ initialise: initialiseGameOverScene, update: updateGameOverScene })