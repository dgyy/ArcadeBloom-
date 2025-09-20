class GraphicalMaze {
    constructor(maze, scene) {
        this.maze = maze;
        this.origin = new BABYLON.TransformNode("maze origin", scene);
        this.pickingPlane = BABYLON.MeshBuilder.CreateDisc("picking disc plane", { radius: INNER_RADIUS + (maze.grid.length - 1) * CELL_HEIGHT }, scene);
        const pickingPlaneMat = new BABYLON.StandardMaterial("picking plane mat", scene);
        pickingPlaneMat.alpha = .2;
        this.pickingPlane.material = pickingPlaneMat;
        this.pickingPlane.setParent(this.origin);
        this.pickingPlaneNormal = BABYLON.Vector3.Forward();
        this.rotationLayers = initGraphicalMaze(maze, scene, this.origin);
        this.rotating = false;
        this.rotatingLayer = 0;
        this.initialRotatingVector = new BABYLON.Vector3();
        this.currPickVector = new BABYLON.Vector3();
        this.timestamp = new Date();
        this.isSolved = false;
        scene.registerBeforeRender(() => {
            let prev = this.timestamp;
            this.timestamp = new Date();
            let deltaTimeSeconds = (this.timestamp - prev) / 1000;
            this.update(deltaTimeSeconds);
        });
    }
    update(deltaTime) {
        for (let layer of this.rotationLayers) {
            layer.update(deltaTime);
        }
    }
    setRotationX(angle) {
        this.origin.rotation.x = angle;
        this.pickingPlaneNormal.y = Math.sin(angle);
        this.pickingPlaneNormal.z = Math.cos(angle);
    }
    unhightlightLayers() {
        if (this.isSolved) return;
        for (let layer of this.rotationLayers) {
            layer.setWallColor(BABYLON.Color3.Black());
        }
    }
    highlightLayer(radius) {
        if (this.isSolved) return;
        this.unhightlightLayers();
        let chosen = Math.floor((radius - INNER_RADIUS) / CELL_HEIGHT) + 1;
        if (0 < chosen && chosen < this.maze.grid.length - 1) {
            this.rotationLayers[chosen].setWallColor(BABYLON.Color3.Red());
        }
    }
    initRotateLayer(radius, pickPoint) {
        let chosen = Math.floor((radius - INNER_RADIUS) / CELL_HEIGHT) + 1;
        if (0 < chosen && chosen < this.maze.grid.length - 1) {
            this.rotating = true;
            this.rotatingLayer = chosen;
            pickPoint.subtractToRef(this.origin.position, this.initialRotatingVector);

        }
    }
    rotateLayer(pickPoint) {
        pickPoint.subtractToRef(this.origin.position, this.currPickVector);
        const angle = BABYLON.Vector3.GetAngleBetweenVectorsOnPlane(this.initialRotatingVector, this.currPickVector, this.pickingPlaneNormal);
        this.rotationLayers[this.rotatingLayer].rotate(angle);
    }
    endRotateLayer() {
        if (this.rotating) {
            this.rotating = false;
            this.rotationLayers[this.rotatingLayer].endRotate();
        }
    }
    offsets() {
        let offsets = [];
        for (let layer of this.rotationLayers) {
            offsets.push(layer.offset);
        }
        return offsets;
    }
    solved() {
        this.isSolved = true;
        for (let layer of this.rotationLayers) {
            layer.setWallColor(new BABYLON.Color3(255 / 256, 215 / 256, 0));
        }
    }
    destroy() {
        this.origin.dispose();
        this.isSolved = false;
    }
}