initialiseGameOverScene = () => {
    messages = [];
    showMessage("YOU HAVE DIED!", halfWidth, halfHeight, 100);
    showMessage("Press enter to try again!", halfWidth, halfHeight + 100, 50);
}

updateGameOverScene = () => {
    updateMessages();
    if (enter) showScene(playScene(), true);
} 