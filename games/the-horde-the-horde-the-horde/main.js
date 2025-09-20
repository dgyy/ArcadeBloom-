window.addEventListener('load', function () {

    "use strict";
    const CvsWidth = cvs.width;
    const CvsHeight = cvs.height;
    const ctx = cvs.getContext("2d");
    const TopRiverBankAdjustment = 124;
    const PanicDrownDistance = 300;
    const GameOverHordeRadius = 245;
    const GameOverTotalCivilianDeaths = 35;

    const TopRiverBank = {
        x: 0,
        y: 0,
        width: CvsWidth,
        height: 100 + TopRiverBankAdjustment // TODO maths
    };
    const BottomRiverBank = {
        x: 0,
        y: CvsHeight - 100, // TODO maths
        width: CvsWidth,
        height: 100
    };
    const River = {
        x: 0,
        y: TopRiverBank.height,
        width: CvsWidth,
        height: BottomRiverBank.y
    };

    let TopBridge = {
        x: 640 - 200, // TODO maths
        y: TopRiverBank.height,
        width: 80,
        height: 40,
        isConnected: false,
        collision: false
    };

    const TopDock = {
        x: 100,
        y: TopRiverBank.height - 20, // TODO maths
        width: 80,
        height: 20
    };

    let BottomBridge = {
        x: TopDock.x,
        y: BottomRiverBank.y - 40, // TODO maths
        width: 80,
        height: 40,
        isConnected: false,
        collision: false
    };


    // keep this at a 640 width
    // but canvas will actually be wider
    const BottomDock = {
        x: 640 - 200, // TODO maths
        y: BottomRiverBank.y,
        width: 80,
        height: 20,
    };

    let theHorde = null;

    function spawnTheHorde() {
        theHorde = new TheHorde(0, 0);
    };

    function TheHorde(x, y) {

        this.x = x;
        this.y = y;
        this.radius = 1;

        this.update = function (delta, troops) {
            // every update pass in the number of troops that
            // crossed which pushes The Horde back...reduces the Y
            // and/or reduces the radius of the arcs 
            this.radius += 0.05;
        };

        this.attacked = function () {
            this.radius -= 1.5;
            if (this.radius < 0) {
                this.radius = 0;
            }
        };

        this.render = function () {
            ctx.save();
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = 'red';
            // TOP LEFT CORNER SEGMENT
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, this.radius, 0, 0.5 * Math.PI);
            ctx.closePath();
            //ctx.fillRect(this.x, this.y, CvsWidth, this.radius);
            ctx.fill();
            ctx.restore();
        };
    };

    function Enemy(x, y, width, height, radius, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = false;

        if (radius) {
            this.radius = radius;
        } else {
            this.width = width;
            this.height = height;
        }

        this.update = function (delta) {
            if (this.alive) {
                if (this.x + this.width > 0) {
                    this.x -= (this.speed * delta);
                } else {
                    this.alive = false;
                    this.x = cvs.width + this.width;
                    if (enemiesSpawnedCount < 10) {
                        enemySpawnTime = 1000;
                    } else if (enemiesSpawnedCount > 10 && enemiesSpawnedCount < 30) {
                        enemySpawnTime = 500;
                    } else if (enemiesSpawnedCount > 30) {
                        enemySpawnTime = 300;
                    }
                    enemySpawnTimeout = setTimeout(spawnEnemy, enemySpawnTime);
                }
            }
        };

        this.render = function () {
            ctx.drawImage(boatImage, this.x, this.y);
        };
    };

    let enemiesSpawnedCount = 0;
    let enemies = [];

    var spawnEnemy = function () {
        var r = randomInt(0, enemies.length - 1);
        do {
            r = randomInt(0, enemies.length - 1);
        } while (enemies[r].alive === true)
        enemies[r].alive = true;
        enemiesSpawnedCount++;
    };

    function initEnemies() {
        for (var i = 0, ii = 20; i < ii; i++) {
            var y = randomInt(288, 376); // default boat height is 96px
            enemies.push(new Enemy(1024 + randomInt(96, 384), y, 96, 96, null, randomFloat(0.06, 0.09)));
        }
    };


    let currentRescuees = [];
    let civilians = [];

    function Civilian(x, y, radius, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = angle;
        this.reachedTarget = false;
        this.isDead = false;
        this.wasRescued = false;
        this.onBridge = false;
        this.imageIndex = randomInt(0, 7);
        this.speed = randomFloat(0.1, 0.33);
        this.hasPanicked = false;
        this.panicCountdown = 3000;

        this.panic = function () {
            if (!this.hasPanicked) {
                this.hasPanicked = true;
                // big increase in speed
                this.speed = 2;
                let r = randomInt(0, 10);
                this.angle = r % 2 == 0 ? randomFloat(0.55 * Math.PI, 0.9 * Math.PI) : randomFloat(0.2, 0.4 * Math.PI);
            }
        };

        this.update = function (delta) {
            // if panicked make a break for the other side
            if (this.hasPanicked) {
                // apply angle to heading 
                this.x += this.speed * Math.cos(this.angle);
                this.y += this.speed * Math.sin(this.angle);
            } else {
                // when bridge is connected move forwards
                this.y += (this.speed / (this.radius * 0.2)) * delta; // bigger will move slower
            }
        };

        this.render = function () {
            ctx.save();
            ctx.beginPath();
            ctx.drawImage(faces, this.imageIndex * 16, 0, 16, 16, this.x - this.radius, this.y - this.radius, 16, 16);
            ctx.closePath();
            if (this.hasPanicked) {
                ctx.fillStyle = 'red';
                ctx.font = "italic 32px impact";
                ctx.fillText('!!!', this.x, this.y - this.radius);
            }
            ctx.restore();
        };
    };

    function moveCivilianCrowdForward() {
        for (var i = 0, ii = civilians.length; i < ii; i++) {
            // update their y positions
            civilians[i].y += 20;
        }
        // splice off the next 4
        currentRescuees = civilians.splice(0, 4);
    };

    function moveSoldiersForward() {
        for (var i = 0, ii = soldiers.length; i < ii; i++) {
            // update their y positions
            soldiers[i].y -= 20;
            // splice off the next 4
        }
        currentSquad = soldiers.splice(0, 4);
    };

    function spawnCivilians() {
        let startingX = BottomDock.x;
        let startingY = 10;
        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 4; j++) {
                // 10 = largest radius, so if 4 10s are spawned they'll fit
                civilians.push(new Civilian(startingX + 10, TopBridge.y - startingY, randomInt(4, 10), 0));
                startingX += 20;
            }
            startingX = BottomDock.x;
            startingY += 20;
        }

        currentRescuees = civilians.splice(0, 4);
    };


    let currentSquad = [];
    let soldiers = [];

    function Soldier(x, y, radius, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = angle;
        this.reachedTarget = false;
        this.isDead = false;
        this.wasRescued = false;
        this.imageIndex = randomInt(0, 3);
        this.speed = 0.4; // all move at a consistent pace

        this.update = function (delta) {
            // assuming the bridge is connected
            // move straight ahead
            this.y -= (this.speed / (this.radius * 0.2)) * delta; // bigger will move slower
        };

        this.render = function () {
            ctx.save();
            ctx.drawImage(shields, this.imageIndex * 16, 0, 16, 16, this.x - this.radius, this.y - this.radius, 16, 16);
            ctx.restore();
        };
    };

    function spawnSoldiers() {
        let startingX = TopDock.x;
        let startingY = BottomDock.y + (BottomDock.height / 2);
        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 4; j++) {
                soldiers.push(new Soldier(startingX + 10, startingY, 8, 0));
                startingX += 20;
            }
            startingX = TopDock.x;
            startingY += 20;
        }

        currentSquad = soldiers.splice(0, 4);
    };

    let isMouseDown = false;
    let mousePrevX = cvs.width / 2;

    function mouseUp(e) {
        isMouseDown = false;
    };

    function mouseLeave(e) {
        isMouseDown = false;
    };

    let bridgeDebrisCollided = false;

    function mouseDown(e) {
        if (!isGameOver) {
            if (!isTutorial) {
                if (!isPaused) {
                    if (bridgeDebrisCollided) return false;

                    isMouseDown = true;
                }
            }
        }
    };

    let isPaused = false;

    function keyUp(e) {
        switch (state) {
            case "load":
                break;
            case "menu":
                if (e.keyCode === 80) {
                    // P for play
                    state = "game";
                    isNewGame = true;

                    init();
                    isPaused = true;
                } else if (e.keyCode === 84) {
                    // T for tutorial
                    isTutorial = true;
                    state = "game";
                    reset();
                }
                break;
            case "gameover":
                if (e.keyCode === 77) {
                    // M for menu
                    state = "menu";
                }
                break;
            case "game":
                if (!isGameOver) {
                    if (!isTutorial) {
                        if (e.keyCode === 32) { // SPACE bar
                            isPaused = !isPaused;
                            if (isNewGame) {
                                isNewGame = false;
                            }
                        } else if (e.keyCode === 81 && isPaused) { // Q for quit
                            state = "menu";
                            reset();
                        }
                    } else {
                        if (e.keyCode === 80) { // P for Play
                            state = "game";
                            init();
                        } else if (e.keyCode === 77) { // M for menu
                            state = "menu";
                            reset();
                        }
                    }
                } else {
                    if (e.keyCode === 77) { // M for menu
                        state = "menu";
                        reset();
                    }
                }
                break;
        }

    };

    // 1:1 movement is WAY too sensitive
    const MouseMoveScaler = 0.85;
    const BridgeMoveThreshold = 20;

    function mouseMove(e) {
        switch (state) {
            case "load":
                break;
            case "menu":
                break;
            case "gameover":
                break;
            case "game":
                if (!isGameOver) {
                    if (!isTutorial) {
                        if (!isPaused) {
                            let xDelta = mousePrevX - getCvsCoordinates(e).x;
                            let bridgeAdjustment = xDelta;
                            if (!TopBridge.collision) {
                                if (!TopBridge.isConnected) { // cannot move when connected
                                    TopBridge.x -= bridgeAdjustment;
                                    if (TopBridge.x <= 0) {
                                        bridgeAdjustment = 0;
                                        TopBridge.x = bridgeAdjustment;
                                    }
                                    if (TopBridge.x + TopBridge.width >= CvsWidth) {
                                        bridgeAdjustment = CvsWidth - TopBridge.width;
                                        TopBridge.x = bridgeAdjustment;
                                    }

                                    // horizontal collision
                                    if (rectCollision(TopBridge, {
                                            x: BottomBridge.x,
                                            y: BottomBridge.y - BottomBridge.height,
                                            width: BottomBridge.width,
                                            height: BottomBridge.height
                                        })) {
                                        TopBridge.x += bridgeAdjustment;
                                    } else {
                                        // vertical as part of mouseDown
                                        // for any people on the bridge
                                        for (let i = 0, ii = currentRescuees.length; i < ii; i++) {
                                            if (currentRescuees[i].onBridge) {
                                                if (Math.abs(xDelta) <= BridgeMoveThreshold) {
                                                    currentRescuees[i].x -= bridgeAdjustment;
                                                } else {
                                                    currentRescuees[i].onBridge = false;
                                                    currentRescuees[i].isDead = true;
                                                    civiliansKilled++;
                                                }
                                            }
                                        }
                                    }
                                }

                            }

                            bridgeAdjustment = xDelta;
                            if (!BottomBridge.collision) {
                                if (!BottomBridge.isConnected) { // cannot move when connected
                                    BottomBridge.x += bridgeAdjustment;
                                    if (BottomBridge.x <= 0) {
                                        bridgeAdjustment = 0;
                                        BottomBridge.x = bridgeAdjustment;
                                    }
                                    if (BottomBridge.x + BottomBridge.width >= CvsWidth) {
                                        bridgeAdjustment = CvsWidth - BottomBridge.width;
                                        BottomBridge.x = bridgeAdjustment;
                                    }
                                    // for any soldiers on the bridge

                                    // horizontal collision
                                    if (rectCollision(TopBridge, {
                                            x: BottomBridge.x,
                                            y: BottomBridge.y - BottomBridge.height,
                                            width: BottomBridge.width,
                                            height: BottomBridge.height
                                        })) {
                                        BottomBridge.x -= xDelta;
                                    } else {
                                        // vertical as part of mouseDown

                                        for (let i = 0, ii = currentSquad.length; i < ii; i++) {
                                            if (currentSquad[i].onBridge) {
                                                currentSquad[i].x += bridgeAdjustment;
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
                break;
        }

        mousePrevX = getCvsCoordinates(e).x;
    };

    function getCvsCoordinates(e) {
        var rect = cvs.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    function randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    };

    function rectCollision(r1, r2) {
        if (r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.height + r1.y > r2.y) {
            return true;
        }

        return false;
    };

    let enemySpawnTime = 500;
    let enemySpawnTimeout = null;
    let faces = new Image();
    let shields = new Image();
    let bridge = new Image();
    let bottomDockImage = new Image();
    let topDockImage = new Image();
    let pathImage = new Image();
    let boatImage = new Image();
    let tree = new Image();

    // tutorial images
    let tutorialLeftArrows = new Image();
    let tutorialUpArrows = new Image();

    let isGameOver = false;
    let state = "menu";
    let isTutorial = false;
    let isNewGame = true;

    let rescued = 0;
    let civiliansKilled = 0;
    let deployed = 0;
    let soldiersKilled = 0;

    function reset() {
        TopBridge = {
            x: 640 - 200, // TODO maths
            y: TopRiverBank.height,
            width: 80,
            height: 40,
            isConnected: false,
            collision: false
        };

        BottomBridge = {
            x: TopDock.x,
            y: BottomRiverBank.y - 40, // TODO maths
            width: 80,
            height: 40,
            isConnected: false,
            collision: false
        };

        if (enemySpawnTimeout) {
            clearTimeout(enemySpawnTimeout);
        }

        enemiesSpawnedCount = 0;
        enemySpawnTime = 500;
        enemySpawnTimeout = null;

        isPaused = false;
        isGameOver = false;
        enemies = [];
        civilians = [];
        currentRescuees = [];
        soldiers = [];
        currentSquad = [];
        rescued = 0;
        soldiersKilled = 0;
        civiliansKilled = 0;

        if (theHorde) {
            theHorde.radius = 0;
        }

        for (let i = 0; i < 1; i++) {
            spawnCivilians();
            spawnSoldiers();
        }
    };

    function init() {

        // TUTORIAL IMAGES
        tutorialLeftArrows.src = "images/left-arrows.png";
        tutorialUpArrows.src = "images/up-arrows.png";
        faces.src = "images/faces_mono.png";
        shields.src = "images/shields_mono.png";
        tree.src = "images/tree.png";
        bridge.src = "images/bridge-1.png";
        bottomDockImage.src = "images/bottom-dock-and-path.png";
        topDockImage.src = "images/top-dock-and-path.png";
        pathImage.src = "images/top-footpath.png";
        boatImage.src = "images/basic-damaged-boat-filled.png";


        // tutorialLeftArrows.onload = function () {};
        // tutorialUpArrows.onload = function () {};
        // faces.onload = function () {};
        // shields.onload = function () {};
        // tree.onload = function () {};
        // bridge.onload = function () {};
        // bottomDockImage.onload = function () {};
        // topDockImage.onload = function () {};
        // pathImage.onload = function () {};
        // boatImage.onload = function () {};        

        cvs.addEventListener("mousedown", mouseDown, false);
        document.addEventListener("mousemove", mouseMove, false);
        cvs.addEventListener("mouseup", mouseUp, false);
        cvs.addEventListener("mouseleave", mouseLeave, false);
        document.addEventListener("keyup", keyUp, false);

        isGameOver = false;
        isTutorial = false;
        isPaused = false;
        isMouseDown = false;
        enemies = [];
        civilians = [];
        currentRescuees = [];
        soldiers = [];
        currentSquad = [];
        rescued = 0;
        soldiersKilled = 0;
        civiliansKilled = 0;
        enemiesSpawnedCount = 0;
        enemySpawnTime = 500;
        enemySpawnTimeout = null;
        TopBridge = {
            x: 640 - 200, // TODO maths
            y: TopRiverBank.height,
            width: 80,
            height: 40,
            isConnected: false,
            collision: false
        };

        BottomBridge = {
            x: TopDock.x,
            y: BottomRiverBank.y - 40, // TODO maths
            width: 80,
            height: 40,
            isConnected: false,
            collision: false
        };

        if (theHorde) {
            theHorde.radius = 0;
        }

        initEnemies();
        for (let i = 0; i < 1; i++) {
            spawnCivilians();
            spawnSoldiers();
        }
        enemySpawnTimeout = setTimeout(spawnEnemy, 2000);
        spawnTheHorde();

    };

    function update(delta) {
        switch (state) {
            case "load":
                break;
            case "menu":
                break;
            case "game":
                if (!isGameOver) {
                    if (!isTutorial) {
                        if (!isPaused) {
                            if (isMouseDown) {

                                // COLLISION BETWEEN BOTH BRIDGES
                                if (rectCollision(TopBridge, {
                                        x: BottomBridge.x,
                                        y: BottomRiverBank.y - BottomBridge.height,
                                        width: BottomBridge.width,
                                        height: BottomBridge.height
                                    })) {
                                    return;
                                }


                                if (!TopBridge.collision) {

                                    // TOP BRIDGE AND BOTTOM DOCK COLLISION
                                    // TOP BRIDGE CONNECTED
                                    if (rectCollision({
                                            x: (TopBridge.x + TopBridge.width / 2) - 1,
                                            y: TopBridge.y + TopBridge.height,
                                            width: 2,
                                            height: 2
                                        }, {
                                            x: (BottomDock.x + BottomDock.width / 2) - 1,
                                            y: BottomDock.y,
                                            width: 2,
                                            height: 2
                                        })) {
                                        TopBridge.isConnected = true;
                                    } else {
                                        // can't grow beyond the other bank
                                        if (TopBridge.height < 316) {
                                            TopBridge.height += 2;
                                        }

                                        TopBridge.isConnected = false;
                                    }
                                } else {
                                    // RETRACT THE BRIDGE QUICKLY
                                    TopBridge.isConnected = false;
                                    if (TopBridge.height > 40) {
                                        TopBridge.height -= 4;
                                    }
                                }

                                if (!BottomBridge.collision) {
                                    // BOTTOM BRIDGE AND TOP DOCK COLLISION
                                    // BOTTOM BRIDGE CONNECTED
                                    if (rectCollision({
                                            x: (BottomBridge.x + BottomBridge.width / 2) - 1,
                                            y: BottomRiverBank.y - BottomBridge.height,
                                            width: 2,
                                            height: 2
                                        }, {
                                            x: (TopDock.x + TopDock.width / 2) - 1,
                                            y: (TopDock.y + TopDock.height) - 2,
                                            width: 2,
                                            height: 2
                                        })) {
                                        BottomBridge.isConnected = true;
                                    } else {
                                        // can't grow beyond the other bank
                                        if (BottomBridge.height < 318) {
                                            BottomBridge.height += 2;
                                        }

                                        BottomBridge.isConnected = false;
                                    }

                                } else {
                                    BottomBridge.isConnected = false;
                                    if (BottomBridge.height > 40) {
                                        BottomBridge.height -= 4;
                                    }
                                }
                            } else {
                                // MOUSE IS NOT DOWN RETRACT THE BRIDGES

                                // Handle collision scenario vs when user just takes finger off mouse
                                TopBridge.isConnected = false;
                                BottomBridge.isConnected = false;
                                if (TopBridge.height > 40) {
                                    TopBridge.height -= TopBridge.collision ? 4 : 1;
                                }
                                if (BottomBridge.height > 40) {
                                    BottomBridge.height -= BottomBridge.collision ? 4 : 1;
                                }
                            }

                            // ENEMIES COLLIDING WITH BRIDGE(S)
                            for (var i = 0, ii = enemies.length; i < ii; i++) {
                                enemies[i].update(delta);
                                // check for collision
                                if (!TopBridge.collision) {
                                    if (rectCollision(enemies[i], TopBridge)) {

                                        TopBridge.isConnected = false;
                                        TopBridge.height -= randomInt(5, 15);
                                        TopBridge.collision = true;
                                        isMouseDown = false;
                                        setTimeout(function () {
                                            TopBridge.collision = false;
                                        }, 3000);
                                    }
                                }

                                if (!BottomBridge.collision) {
                                    if (rectCollision(enemies[i], {
                                            x: BottomBridge.x,
                                            y: BottomRiverBank.y - BottomBridge.height,
                                            width: BottomBridge.width,
                                            height: BottomBridge.height
                                        })) {

                                        BottomBridge.isConnected = false;
                                        BottomBridge.height -= randomInt(5, 15);
                                        BottomBridge.collision = true;
                                        isMouseDown = false;
                                        setTimeout(function () {
                                            BottomBridge.collision = false;
                                        }, 3000);
                                    }
                                }
                            }

                            // UPDATE RESCUEES
                            if (TopBridge.isConnected) {
                                // Nobody moves until the bridge
                                for (var i = 0, ii = currentRescuees.length; i < ii; i++) {
                                    currentRescuees[i].waitingToCross = false;
                                    if (!currentRescuees[i].isDead) {
                                        if (!currentRescuees[i].wasRescued) {
                                            // turn off any panic
                                            currentRescuees[i].panicCountdown = 3000;
                                            // on the bridge so move
                                            currentRescuees[i].update(delta);
                                            if (
                                                currentRescuees[i].x >= TopBridge.x &&
                                                currentRescuees[i].x <= TopBridge.x + TopBridge.width &&
                                                currentRescuees[i].y >= TopBridge.y &&
                                                currentRescuees[i].y <= TopBridge.y + TopBridge.height
                                            ) {
                                                currentRescuees[i].onBridge = true;
                                            }

                                            if (currentRescuees[i].y > CvsHeight) {
                                                currentRescuees[i].wasRescued = true;
                                                rescued++;
                                            }
                                        }
                                    }
                                }
                            } else {
                                // check for people who moved but the bridge has retracted while they're on it
                                for (var i = 0, ii = currentRescuees.length; i < ii; i++) {
                                    if (!currentRescuees[i].isDead) {
                                        if (!currentRescuees[i].wasRescued) {
                                            if (currentRescuees[i].hasPanicked) {
                                                currentRescuees[i].update(delta);
                                                // check for panickers isn't the same as the bridge check
                                                if (currentRescuees[i].y > PanicDrownDistance) {
                                                    currentRescuees[i].onBridge = false;
                                                    currentRescuees[i].isDead = true;
                                                    civiliansKilled++;
                                                }
                                            } else {
                                                // did not make it *all* the way across
                                                if (currentRescuees[i].y > TopBridge.y + TopBridge.height && currentRescuees[i].y - currentRescuees[i].radius < BottomDock.y + BottomDock.height) {
                                                    currentRescuees[i].onBridge = false;
                                                    currentRescuees[i].isDead = true;
                                                    civiliansKilled++;
                                                }
                                            }
                                        }
                                    }
                                }

                                // introduce some panic
                                for (var i = 0, ii = currentRescuees.length; i < ii; i++) {
                                    if (!currentRescuees[i].isDead) {
                                        if (!currentRescuees[i].wasRescued) {
                                            currentRescuees[i].waitingToCross = true;
                                            if (currentRescuees[i].panicCountdown >= 5) {
                                                currentRescuees[i].panicCountdown -= 5;
                                            } else {
                                                // panic!
                                                currentRescuees[i].panic();
                                            }
                                        }
                                    }
                                }
                            }

                            // UPDATE SOLDIERS
                            if (BottomBridge.isConnected) {
                                for (var i = 0, ii = currentSquad.length; i < ii; i++) {
                                    if (!currentSquad[i].isDead) {
                                        if (!currentSquad[i].wasRescued) {
                                            currentSquad[i].update(delta);

                                            // y = BottomRiverBank.y - BottomBridge.height,
                                            if (currentSquad[i].x >= BottomBridge.x &&
                                                currentSquad[i].x <= BottomBridge.x + BottomBridge.width &&
                                                currentSquad[i].y >= BottomBridge.y - BottomBridge.height
                                            ) {
                                                currentSquad[i].onBridge = true;
                                            } else {
                                                currentSquad[i].onBridge = false;
                                            }

                                            if (currentSquad[i].y <= 105) {
                                                currentSquad[i].wasRescued = true;
                                                deployed++;
                                                theHorde.attacked();
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (var i = 0, ii = currentSquad.length; i < ii; i++) {
                                    if (!currentSquad[i].isDead) {
                                        if (!currentSquad[i].wasRescued) {
                                            if (currentSquad[i].y <= BottomRiverBank.y - BottomBridge.height) {
                                                currentSquad[i].onBridge = false;
                                                currentSquad[i].isDead = true;
                                                soldiersKilled++;
                                            }
                                        }
                                    }
                                }
                            }

                            // CLEAN UP RESCUEES
                            // TODO remove the panicked ones
                            for (var i = currentRescuees.length - 1; i >= 0; --i) {
                                if (currentRescuees[i].isDead || currentRescuees[i].wasRescued) {
                                    currentRescuees.splice(i, 1);
                                }
                            }

                            // CLEAN UP SOLDIERS
                            for (var i = currentSquad.length - 1; i >= 0; --i) {
                                if (currentSquad[i].isDead || currentSquad[i].wasRescued) {
                                    currentSquad.splice(i, 1);
                                }
                            }

                            // TURNED OFF WHILE WORKING ON GRAPHICS
                            theHorde.update(delta, 0);
                            if (currentRescuees.length === 0) {
                                moveCivilianCrowdForward();
                            }

                            if (currentSquad.length === 0) {
                                moveSoldiersForward();
                            }

                            // game over?
                            if (theHorde.radius >= GameOverHordeRadius) {
                                isGameOver = true;
                                if (enemySpawnTimeout) {
                                    clearTimeout(enemySpawnTimeout);
                                }
                            } else if (civiliansKilled > GameOverTotalCivilianDeaths) {
                                isGameOver = true;
                                if (enemySpawnTimeout) {
                                    clearTimeout(enemySpawnTimeout);
                                }
                            }
                        }
                    }
                }
                break;
        }
    };

    function renderPaths() {
        ctx.drawImage(pathImage, BottomDock.x, 0);
        ctx.drawImage(pathImage, TopDock.x, BottomDock.y);
    };

    function renderDocks() {
        ctx.drawImage(topDockImage, TopDock.x - 32, TopDock.y - 44, 144, 64);
        ctx.drawImage(bottomDockImage, BottomDock.x - 32, BottomDock.y, 144, 64);
    };

    function renderTrees() {
        let treeStartY = -10;
        let treeStartX = 220;
        for (let i = 0; i <= 11; i++) {
            if (i % 2 == 0) {
                treeStartY = -10;
            } else {
                treeStartY = 10;
            }
            for (let j = 0; j <= 6; j++) {
                ctx.drawImage(tree, treeStartX, treeStartY);
                treeStartY += 30;
            }
            treeStartX += 18;
        }

        // trees to right of civilians
        treeStartX = 512;
        treeStartY = -10;
        for (let i = 0; i <= 27; i++) {
            if (i % 2 == 0) {
                treeStartY = -10;
            } else {
                treeStartY = 10;
            }
            for (let j = 0; j <= 6; j++) {
                ctx.drawImage(tree, treeStartX, treeStartY);
                treeStartY += 30;
            }
            treeStartX += 18;
        }

        // BOTTOM BANK TREES
        treeStartY = BottomRiverBank.y;
        treeStartX = -16;
        for (let i = 0; i <= 5; i++) {
            if (i % 2 == 0) {
                treeStartY = BottomRiverBank.y;
            } else {
                treeStartY = BottomRiverBank.y + 10;
            }
            for (let j = 0; j <= 4; j++) {
                ctx.drawImage(tree, treeStartX, treeStartY);
                treeStartY += 30;
            }
            treeStartX += 18;
        }

        treeStartY = BottomRiverBank.y;
        treeStartX = 174;
        for (let i = 0; i <= 11; i++) {
            if (i % 2 == 0) {
                treeStartY = BottomRiverBank.y;
            } else {
                treeStartY = BottomRiverBank.y + 10;
            }
            for (let j = 0; j <= 4; j++) {
                ctx.drawImage(tree, treeStartX, treeStartY);
                treeStartY += 30;
            }
            treeStartX += 18;
        }

        treeStartY = BottomRiverBank.y;
        treeStartX = 550;
        for (let i = 0; i <= 25; i++) {
            if (i % 2 == 0) {
                treeStartY = BottomRiverBank.y;
            } else {
                treeStartY = BottomRiverBank.y + 10;
            }
            for (let j = 0; j <= 4; j++) {
                ctx.drawImage(tree, treeStartX, treeStartY);
                treeStartY += 30;
            }
            treeStartX += 18;
        }
    };

    function renderTutorial() {
        // sx, sy, sw, sh, dx, dy, dw, dh

        // red up arrow
        ctx.drawImage(tutorialUpArrows, 40, 0, 40, 108, 120, 360, 40, 108);
        // red left arrow
        ctx.drawImage(tutorialLeftArrows, 48, 0, 48, 48, 180, 570, 48, 48);
        // soldier box
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.roundRect(230, 500, 150, 120, [10]);
        ctx.fill();
        ctx.restore();
        // red border
        ctx.save();
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.strokeStyle = '#e6482e';
        ctx.roundRect(230, 500, 150, 120, [10]);
        ctx.stroke();
        ctx.restore();

        // yellow down arrow
        ctx.drawImage(tutorialUpArrows, 0, 0, 40, 108, 460, 290, 40, 108);
        // yellow left arrow
        ctx.drawImage(tutorialLeftArrows, 0, 0, 48, 48, 524, 90, 48, 48);
        // civilian box
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.roundRect(568, 50, 220, 220, [10]);
        ctx.fill();
        ctx.restore();
        // yellow border
        ctx.save();
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.strokeStyle = '#f4b41b';
        ctx.roundRect(568, 50, 220, 220, [10]);
        ctx.stroke();
        ctx.restore();

        // bridge box
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.roundRect(176, 258, 260, 220, [10]);
        ctx.fill();
        ctx.restore();
        // enemy
        ctx.drawImage(boatImage, 925, 285);
        // enemy box
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.roundRect(800, 380, 210, 150, [10]);
        ctx.fill();
        ctx.restore();
        // the horde box
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.roundRect(48, 16, 160, 120, [10]);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.roundRect(760, 560, 240, 50, [10]);
        ctx.fill();
        ctx.restore();
        // red border
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#e6482e';
        ctx.roundRect(756, 555, 250, 60, [10]);
        ctx.stroke();
        ctx.restore();
        // yellow border
        ctx.save();
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.strokeStyle = '#f4b41b';
        ctx.roundRect(760, 560, 240, 50, [10]);
        ctx.stroke();
        ctx.restore();

        // menu text
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.font = '16px impact';
        ctx.fillText("Press 'M' to return to Main Menu...", 770, 590);
        ctx.restore();

        // the horde text
        ctx.save();
        ctx.font = '16px impact';
        ctx.fillStyle = 'black';
        ctx.fillText('Beware The Horde!', 60, 40);
        ctx.fillText('They are deadly and', 60, 60);
        ctx.fillText('it will take many of', 60, 80);
        ctx.fillText('our mighty troops to', 60, 100);
        ctx.fillText('to defeat them!', 60, 120);
        ctx.restore();

        // enemy text
        ctx.save();
        ctx.font = '16px impact';
        ctx.fillStyle = 'black';
        ctx.fillText('Avoid hitting damaged ships', 814, 408);
        ctx.fillText('set adrift from the attacked', 814, 428);
        ctx.fillText('city up river.', 814, 448);
        ctx.fillText('Moving a bridge too fast can', 814, 478);
        ctx.fillText('make people fall off and', 814, 498);
        ctx.fillText('drown!', 814, 518);
        ctx.restore();
        // civilian text
        ctx.save();
        ctx.font = '16px impact';
        ctx.fillStyle = 'black';
        ctx.fillText('Get our mighty', 250, 525);
        ctx.fillText('troops across as', 250, 545);
        ctx.fillText('fast as you can so', 250, 565);
        ctx.fillText('they can defeat', 250, 585);
        ctx.fillText('the Horde!', 250, 605);
        ctx.restore();
        // bridge text
        ctx.save();
        ctx.font = '16px impact';
        ctx.fillStyle = 'black';
        ctx.fillText('Hold the LEFT mouse button down to', 190, 290);
        ctx.fillText('extend and connect each bridge to', 190, 310);
        ctx.fillText('its opposite dock.', 190, 330);
        ctx.fillText('Citizens and troops automatically', 190, 360);
        ctx.fillText('start to move when their bridge', 190, 380);
        ctx.fillText('connects to their dock.', 190, 400);
        ctx.fillText('Move bridges LEFT or RIGHT by', 190, 430);
        ctx.fillText('moving the mouse LEFT or RIGHT.', 190, 450);
        ctx.restore();
        // soldier text
        ctx.save();
        ctx.font = '16px impact';
        ctx.fillStyle = 'black';
        ctx.fillText('Help fellow citizens escape', 590, 84);
        ctx.fillText('The Horde by getting them', 590, 104);
        ctx.fillText('safely across the river.', 590, 124);
        ctx.fillText('If left waiting too long they', 590, 154);
        ctx.fillText('will start to panic and try to', 590, 174);
        ctx.fillText('cross the river without the', 590, 194);
        ctx.fillText('bridge...and drown!', 590, 214);
        ctx.fillStyle = '#7a444a';
        ctx.fillRect(660, 250, 16, 16);
        ctx.drawImage(faces, 16, 0, 16, 16, 660, 250, 16, 16);
        ctx.fillStyle = 'red';
        ctx.font = "italic 32px impact";
        ctx.fillText('!!!', 656, 248);
        ctx.restore();
    };

    const DEBUG = true;

    function render() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        switch (state) {
            case "load":
                break;
            case "menu":
                ctx.fillStyle = "#3cacd7";
                ctx.fillRect(River.x, River.y, River.width, River.height);
                ctx.fillStyle = "#472d42";
                ctx.fillRect(TopRiverBank.x, TopRiverBank.y, TopRiverBank.width, TopRiverBank.height);
                ctx.fillRect(BottomRiverBank.x, BottomRiverBank.y, BottomRiverBank.width, BottomRiverBank.height);
                ctx.drawImage(bridge, TopBridge.x, TopBridge.y, TopBridge.width, TopBridge.height);
                ctx.drawImage(bridge, BottomBridge.x, BottomRiverBank.y - BottomBridge.height, BottomBridge.width, BottomBridge.height);
                renderDocks();
                renderPaths();
                renderTrees();

                ctx.fillStyle = 'white';
                ctx.roundRect(256, 170, 512, 300, [10]);
                ctx.fill();
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.strokeStyle = '#e6482e';
                ctx.roundRect(251, 165, 522, 310, [10]);
                ctx.stroke();
                ctx.strokeStyle = '#f4b41b';
                ctx.beginPath();
                ctx.roundRect(256, 170, 512, 300, [10]);
                ctx.stroke();
                ctx.restore();
                ctx.fillStyle = 'black';
                ctx.font = "36px impact";
                ctx.fillText('The Horde! The Horde! The Horde!', 268, 210);
                ctx.font = "20px impact";
                ctx.fillText("The Horde have destroyed nearby cities and ports. Our city", 270, 260);
                ctx.fillText("may be next! Help your fellow citizens flee to safety and get", 270, 280);
                ctx.fillText("our mighty soldiers across the river to battle The Horde!", 270, 300);

                ctx.fillText("Alas, a cruel and cunning enemy spy destroyed the existing", 270, 340);
                ctx.fillText("bridges. Fear not! Some highly confident but, not so skilled,", 270, 360);
                ctx.fillText("citizens have built fancy extendable makeshift ones!", 270, 380);
                ctx.fillText("Press 'P' to Play or 'T' for a Tutorial...", 370, 428);
                break;
            case "game":
                ctx.fillStyle = "#3cacd7";
                ctx.fillRect(River.x, River.y, River.width, River.height);
                ctx.fillStyle = "#472d42";
                ctx.fillRect(TopRiverBank.x, TopRiverBank.y, TopRiverBank.width, TopRiverBank.height);
                ctx.fillRect(BottomRiverBank.x, BottomRiverBank.y, BottomRiverBank.width, BottomRiverBank.height);

                for (var i = 0, ii = enemies.length; i < ii; i++) {
                    enemies[i].render();
                }

                ctx.fillStyle = "grey";
                if (TopBridge.collision)
                    ctx.fillStyle = 'red';
                ctx.fillRect(TopBridge.x, TopBridge.y, TopBridge.width, TopBridge.height);
                ctx.drawImage(bridge, TopBridge.x, TopBridge.y, TopBridge.width, TopBridge.height);
                ctx.fillStyle = "grey";
                if (BottomBridge.collision)
                    ctx.fillStyle = 'red';
                ctx.fillRect(BottomBridge.x, BottomRiverBank.y - BottomBridge.height, BottomBridge.width, BottomBridge.height);
                ctx.drawImage(bridge, BottomBridge.x, BottomRiverBank.y - BottomBridge.height, BottomBridge.width, BottomBridge.height);

                renderDocks();
                renderPaths();

                for (var i = 0, ii = civilians.length; i < ii; i++) {
                    civilians[i].render();
                }

                for (var i = 0, ii = currentRescuees.length; i < ii; i++) {
                    currentRescuees[i].render();
                }

                for (var i = 0, ii = soldiers.length; i < ii; i++) {
                    soldiers[i].render();
                }

                for (var i = 0, ii = currentSquad.length; i < ii; i++) {
                    currentSquad[i].render();
                }

                renderTrees();

                theHorde.render();

                ctx.strokeStyle = '#f4b41b'; // yellow
                ctx.strokeRect((TopBridge.x + TopBridge.width / 2) - 1, (TopBridge.y + TopBridge.height) - 2, 2, 2);
                ctx.strokeRect((BottomDock.x + BottomDock.width / 2) - 1, BottomDock.y, 2, 2);
                ctx.strokeStyle = '#e6482e'; // red
                ctx.strokeRect((BottomBridge.x + BottomBridge.width / 2) - 1, BottomRiverBank.y - BottomBridge.height, 2, 2);
                ctx.strokeRect((TopDock.x + TopDock.width / 2) - 1, (TopDock.y + TopDock.height) - 2, 2, 2);
                ctx.restore();

                if (isPaused) {
                    ctx.save();
                    ctx.fillStyle = 'white';
                    ctx.roundRect(380, 255, 300, 200, [10]);
                    ctx.fill();
                    ctx.restore();
                    ctx.save();
                    ctx.lineWidth = 8;
                    ctx.beginPath();
                    ctx.strokeStyle = '#e6482e';
                    ctx.roundRect(375, 250, 310, 210, [10]);
                    ctx.stroke();
                    ctx.strokeStyle = '#f4b41b';
                    ctx.beginPath();
                    ctx.roundRect(380, 255, 300, 200, [10]);
                    ctx.stroke();
                    ctx.restore();

                    ctx.save();
                    ctx.fillStyle = 'black';
                    ctx.font = "36px impact";
                    ctx.fillText('PAUSED', 468, 300);
                    ctx.font = "24px impact";
                    if (isNewGame) {
                        ctx.fillText("Please place your cursor", 408, 338);
                        ctx.fillText("here before starting!", 408, 364);
                        ctx.fillText('SPACE to unpause', 448, 398);
                        ctx.fillText("'Q' to quit", 473, 434);
                    } else {
                        ctx.fillText('SPACE to unpause', 448, 348);
                        ctx.fillText("'Q' to quit", 473, 394);
                    }
                    ctx.restore();
                }

                if (isTutorial) {
                    renderTutorial();
                }

                if (!isTutorial) {
                    ctx.font = "36px impact";
                    ctx.fillStyle = "#472d42"
                    ctx.fillRect(800, CvsHeight - 55, 220, 50)
                    ctx.fillStyle = 'white';
                    ctx.fillText('DROWNED: ' + civiliansKilled, 815, cvs.height - 15);
                }

                if (isGameOver) {
                    ctx.fillStyle = 'white';
                    ctx.roundRect(256, 170, 512, 240, [10]);
                    ctx.fill();
                    ctx.lineWidth = 8;
                    ctx.beginPath();
                    ctx.strokeStyle = '#e6482e';
                    ctx.roundRect(251, 165, 522, 250, [10]);
                    ctx.stroke();
                    ctx.strokeStyle = '#f4b41b';
                    ctx.beginPath();
                    ctx.roundRect(256, 170, 512, 240, [10]);
                    ctx.stroke();
                    ctx.restore();
                    ctx.fillStyle = 'black';
                    ctx.font = "36px impact";
                    ctx.fillText('GAME OVER!', 430, 210);
                    ctx.font = "20px impact";
                    if (theHorde.radius >= GameOverHordeRadius) {
                        ctx.fillText("We are doomed! The Horde have overrun the landing dock!", 274, 260);
                        ctx.fillText("You did not get enough of our mighty troops across to fight", 274, 290);
                        ctx.fillText("them in delicious combat! Did you do it on purpose?", 274, 310)
                        ctx.fillText("ARE YOU SECRETLY ONE OF THE HORDE?!", 274, 340);
                        ctx.fillText("Press 'M' to return to the main menu...", 360, 378);
                    } else if (civiliansKilled >= GameOverTotalCivilianDeaths) {
                        ctx.fillText("WHAT?! " + civiliansKilled + " people died trying to cross the river! You were", 274, 260);
                        ctx.fillText("meant to S-A-V-E your fellow citizens, not K-I-L-L them!", 274, 280);
                        ctx.fillText("Unless you secretly work for The Horde, in which case you", 274, 310);
                        ctx.fillText("probably did a good job. But WE have to execute YOU now!", 274, 330);
                        ctx.fillText("Press 'M' to return to the main menu...", 360, 378);
                    }
                }

                break;
        }
    };

    var now = Date.now();

    function tick() {
        var delta = Date.now() - now;
        update(delta);
        render();
        now = Date.now();
        window.requestAnimationFrame(tick);
    };
    init();
    window.requestAnimationFrame(tick);
}, false);