const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const pather = new MazePather();
const mazes = [];
for (let i = 3; i < 3 + LEVELS; i++) {
    const maze = new Maze(i, 0, BOTTOM_CENTER, TOP_CENTER);
    do {
        maze.scrambleOffsets();
    } while (pather.solve(maze).length > 0);
    mazes.push(maze);
}
const gameState = {
    currentLevel: 0,
    scene: undefined,
    xr: undefined,
    graphicalMaze: undefined,
    shipManager: undefined,
    timer: LEVEL_TIME,
    timestamp: new Date(),
    timing: false,
    cooling: false,
    lost: false,
    startLevelTimer: function() {
        this.timer = LEVEL_TIME;
        this.timestamp = new Date();
        this.timing = true;
    },
    endLevelTimer: function() {
        this.timing = false;
    },
    startCooldownTimer: function() {
        this.cooling = true;
        this.timer = LEVEL_COOLDOWN;
    },
    endCooldownTimer: function() {
        this.cooling = false;
    },
    endLevel: function() {
        this.endLevelTimer();
        if (!this.lost) {
            if (this.currentLevel === mazes.length - 1) {
                this.xr.baseExperience.exitXRAsync();
                document.getElementById("screenText").innerText = "You have defended Japan!";
            }
            this.currentLevel++;
            gameState.graphicalMaze.destroy();
            this.startCooldownTimer();
            this.shipManager.blowWaveAway();
        }
    },
    startNextLevel: function() {
        this.startLevelTimer();
        gameState.graphicalMaze = new GraphicalMaze(mazes[gameState.currentLevel], this.scene);
        gameState.graphicalMaze.origin.position.y = 1;
        this.shipManager.startWave(LEVEL_TIME, SHIP_SPEED, (1 + this.currentLevel) * 10);
    },
    decrementTimer: function() {
        let prev = this.timestamp;
        this.timestamp = new Date();
        let deltaTimeSeconds = (this.timestamp - prev) / 1000;
        if (this.timing) {
            this.timer -= deltaTimeSeconds;
            if (this.timer <= 0) {
                this.endLevelTimer();
                this.lost = true;
                this.xr.baseExperience.exitXRAsync();
                document.getElementById("screenText").innerText = "The Mongols succeed...";
            }
        } else if (this.cooling) {
            this.timer -= deltaTimeSeconds;
            if (this.timer <= 0) {
                this.endCooldownTimer();
                this.startNextLevel();
            }
        }
    }
}

const createScene = async function () {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(180 / 256, 217 / 256, 239 / 256);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
    scene.fogDensity = 0.02;

    const camera = new BABYLON.UniversalCamera("camera1", 
        new BABYLON.Vector3(0, 0, -.5), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", 
        new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const sea = BABYLON.MeshBuilder.CreateGround("sea", { width: 100, height: 100 });
    const seaMat = new BABYLON.StandardMaterial("seaMat");
    seaMat.diffuseColor = new BABYLON.Color3(0, 0, 1);
    sea.material = seaMat;
    sea.position.y = -0.001;
    sea.position.z = 50;
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 });
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    ground.material = groundMat;
    ground.position.y = 0.01;
    ground.position.z = -50;
    
    gameState.scene = scene;
    gameState.shipManager = new ShipManager(scene, 100, 50);

    scene.registerBeforeRender(() => {
        gameState.decrementTimer();
    });

    const xr = await scene.createDefaultXRExperienceAsync({
        pointerSelectionOptions: {
            preferredHandedness: "right",
            disableSwitchOnClick: true
        },
    });
    gameState.xr = xr;
    xr.baseExperience.onStateChangedObservable.add((state) => {
        switch (state) {
            case BABYLON.WebXRState.IN_XR:
                document.getElementById("screenText").innerText = "";
                gameState.startLevelTimer();
                gameState.shipManager.startWave(LEVEL_TIME, SHIP_SPEED, (1 + gameState.currentLevel) * 10);
                gameState.graphicalMaze = new GraphicalMaze(mazes[gameState.currentLevel], scene);
                gameState.graphicalMaze.origin.position.y = 1;
                break;
            default:
                break;
        }
    })
    const pointerRay = new BABYLON.Ray(new BABYLON.Vector3(), new BABYLON.Vector3());
    xr.input.onControllerAddedObservable.add((input) => {
        if (input.inputSource.handedness === "left") return;
        scene.onPointerObservable.add((pointerInfo) => {
            input.getWorldPointerRayToRef(pointerRay);
            const result = scene.pickWithRay(pointerRay, (mesh) => mesh === gameState.graphicalMaze.pickingPlane);
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if (result.hit) {
                        const radius = BABYLON.Vector3.Distance(result.pickedPoint, gameState.graphicalMaze.origin.position);
                        gameState.graphicalMaze.initRotateLayer(radius, result.pickedPoint)
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    if (gameState.graphicalMaze.isSolved && input.pointer.position.z > gameState.graphicalMaze.origin.position.z) {
                        gameState.endLevel();
                        pather.drawnPath.dispose();
                    }
                    if (result.hit) {
                        if (gameState.graphicalMaze.rotating) {
                            gameState.graphicalMaze.rotateLayer(result.pickedPoint);
                        } else {
                            const radius = BABYLON.Vector3.Distance(result.pickedPoint, gameState.graphicalMaze.origin.position);
                            gameState.graphicalMaze.highlightLayer(radius);
                        }
                    } else {
                        gameState.graphicalMaze.unhightlightLayers();
                        gameState.graphicalMaze.endRotateLayer();
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    if (gameState.cooling) return;
                    gameState.graphicalMaze.endRotateLayer();
                    gameState.graphicalMaze.unhightlightLayers();
                    mazes[gameState.currentLevel].setOffsets(gameState.graphicalMaze.offsets());
                    pather.solveAndShow(mazes[gameState.currentLevel]);
                    if (pather.solution.length > 0) {
                        gameState.graphicalMaze.solved();
                    }
                    break;
            }
        });
    });
    
    return scene;
};
const scene = createScene();
engine.runRenderLoop(async function () {
        (await scene).render();
});
window.addEventListener("resize", function () {
        engine.resize();
});