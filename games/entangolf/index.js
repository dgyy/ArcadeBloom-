// ignore this file for code analysis in webstorm


import Joystick  from "./joystick.js";
import Wall from "./wall.js";
import Arrow from "./arrow.js";
import WallPoint from "./wall_point.js";
import {calculateSeparation} from "./collision.js";
import {generateLevels} from "./levels/levels.js";
import playerSmall from "./vendor/player-small.js";
import { hitSong, winLevelSong, wallSong, loseLevelSong, winGameSong, inHoleSong } from "./vendor/songs.js";

const BALL_MADE_THRESHOLD = 0.25;
const BALL_STOPPED_THRESHOLD = 0.15
const MIN_WALL_LENGTH = 2;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const INPUT_MODES = {
    hit: 1 << 0,        // 00001
    wall: 1 << 1,       // 00010
    moveHandle: 1 << 2, // 00100
    moveWall: 1 << 3,   // 01000
    bump: 1 << 4,       // 10000 UNUSED
    placeAny: (1 << 1) | (1 << 4),
    watching: 1 << 5,
    moving: (1 << 1) | (1 << 2) | (1 << 4)
};

export let global = {
    stillAt: null,
    selectedWall: null,
    selectedVertex: null,
    inputMode: INPUT_MODES.hit,
    lastInputMode: INPUT_MODES.hit,
    lastUiText: "",
    currentHitAngle: "",
    lastHitAngle: "",
    currentHoleText:"",
    lastMoveLocation: {x: 0, y: 0},
    transitioning: false,
    hints: true,
    songs: {
        hit: null,
        wall: null,
        winGame: null,
        winLevel: null,
        winLevelAt: null,
        loseLevel: null
    }
};
global.ui = document.getElementById("game-ui");
global.holeNumber = document.getElementById("hole-number");
global.canvasContainer = document.getElementById("canvas-container");
global.prevButton = document.getElementById("js-prev");
global.nextButton = document.getElementById("js-next");

document.getElementById("js-hit-ball").addEventListener("click", (e) => {
    e.preventDefault();
    hitBallButtonClickCallback();
});

document.getElementById("js-hints").addEventListener("click", (e) => {
    e.preventDefault();
    global.hints = !global.hints;
    updateHintUi();
});

function updateHintUi() {
    const hints = document.getElementById("js-hints");
    hints.innerText = global.hints ? "Hints On" : "Hints Off";
    if (global.hints) {
        hints.style.boxShadow = `0 2px ${currentLevel.cssButtonShadowColor}`;
        hints.classList.add("active");
    } else {
        hints.style.boxShadow = `0 5px ${currentLevel.cssButtonShadowColor}`;
        hints.classList.remove("active");
    }
}

function generateSong(song, name) {
    var player = new playerSmall();
    player.init(song);

    var done = false;

    let interval = setInterval(function () {
        if (done)
        {
            clearInterval(interval);
            return;
        }

        done = player.generate() >= 1;
        if (done) {
            var wave = player.createWave();
            var audio = document.createElement("audio");
            audio.preload = "auto";
            audio.src = URL.createObjectURL(
                new Blob([wave], { type: "audio/wav" })
            );

            global.songs[name] = audio;
        }
    }, 0);
}

function hitBallButtonClickCallback() {
    const el = document.getElementById("js-hit-ball");
    if (el.classList.contains("disabled")) return;
    global.inputMode = INPUT_MODES.hit;

    el.classList.add("active");

    document.getElementById("js-place-wall").classList.remove("active");
    document.getElementById("js-hit-ball").style.boxShadow = `0 2px ${currentLevel.cssButtonShadowColor}`;
    document.getElementById("js-place-wall").style.boxShadow = `0 5px ${currentLevel.cssButtonShadowColor}`;

}

document.getElementById("js-place-wall").addEventListener("click", (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains("disabled")) return;
    global.inputMode = INPUT_MODES.wall;
    e.currentTarget.classList.add("active");
    document.getElementById("js-hit-ball").classList.remove("active");
    document.getElementById("js-hit-ball").style.boxShadow = `0 5px ${currentLevel.cssButtonShadowColor}`;
    document.getElementById("js-place-wall").style.boxShadow = `0 2px ${currentLevel.cssButtonShadowColor}`;
});

document.getElementById("js-reset").addEventListener("click", (e) => {
    e.preventDefault();
    currentLevelReset();
    globalReset();
});

global.prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains("disabled")) return;
    if (currentLevelIndex === -1) {
        goToLevel(levels.length)
    } else {
        goToLevel(currentLevelIndex);
    }
});

global.nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains("disabled")) return;
    goToLevel(currentLevelIndex + 2);
});

function getCanvasScalingFactor() {
    const widthScale = window.innerWidth / canvas.width;
    const heightScale = window.innerHeight / canvas.height;
    return Math.min(widthScale, heightScale);
}

const preWall = new Wall(0, 0, 0, 0, true, true);
const levels = generateLevels();

let currentLevelIndex = 0;
let nextLevelIndex = (currentLevelIndex + 1) % levels.length;
let currentLevel = levels[currentLevelIndex];
currentLevel.reset();
let nextLevel = levels[nextLevelIndex];

const arrows = [];
// const joystick = new Joystick(canvas, clickCallback, releaseCallback, moveCallback);
let joystick = null;

let wallPoint = new WallPoint();

function clickCallback() {
    global.lastMoveLocation.x = joystick.currentPos.x;
    global.lastMoveLocation.y = joystick.currentPos.y;
    global.ui.innerHTML = global.currentHoleText;

    if (global.inputMode !== INPUT_MODES.watching) {
        for (let i = 0; i < currentLevel.walls.length; i++) {
            const wall = currentLevel.walls[i];
            if (!wall.player) continue;

            const vertex = wall.pointInHandle(joystick.currentPos.x, joystick.currentPos.y);
            if (wall.pointInCloseButton(joystick.currentPos.x, joystick.currentPos.y)) {
                currentLevel.walls.splice(i, 1);
                return;
            } else if (vertex) {
                global.lastInputMode = global.inputMode;
                global.inputMode = INPUT_MODES.moveHandle;
                global.selectedWall = wall;
                global.selectedVertex = vertex;
                return;
            } else if (wall.isPointInside(joystick.currentPos.x, joystick.currentPos.y)) {
                global.lastInputMode = global.inputMode;
                global.inputMode = INPUT_MODES.moveWall;
                global.selectedWall = wall;
                global.selectedVertex = null;
            }
        }
    }

    // handle clicking on blank space
    if (global.inputMode === INPUT_MODES.hit) {
        hitBallClickCallback();
    } else if (global.inputMode & INPUT_MODES.placeAny) {
        placeWallPointClickCallback();
    }
}

function hitBallClickCallback() {
    arrows.length = 0;
    for (let i = 0; i < currentLevel.balls.length; i++) {
        const ball = currentLevel.balls[i];
        arrows.push(new Arrow(ball.pos.x, ball.pos.y, joystick.normalizedPos.x, joystick.normalizedPos.y));
    }
}

function placeWallPointClickCallback() {
    wallPoint.vertices.push({x: joystick.currentPos.x, y: joystick.currentPos.y});
}

function releaseCallback() {
    if (global.inputMode === INPUT_MODES.hit) {
        hitBallReleaseCallback();
    } else if (global.inputMode & INPUT_MODES.placeAny) {
        placeWallPointReleaseCallback();
    } else if (global.inputMode === INPUT_MODES.moveHandle) {
        global.inputMode = global.lastInputMode;
        global.selectedWall = null;
        global.selectedVertex = null;
    } else if (global.inputMode === INPUT_MODES.moveWall) {
        global.inputMode = global.lastInputMode;
        global.selectedWall = null;
        global.selectedVertex = null;
    }

    global.ui.innerHTML = global.currentHoleText;
}

function translateCanvasContainer(magnitude, angle) {
    const xMultiplier = -Math.cos(angle) * magnitude * .1;
    const yMultiplier = Math.sin(angle) * magnitude * .1;
    global.canvasContainer.style.transform = `translate(${xMultiplier}px, ${yMultiplier}px)`;
}

function hitBallReleaseCallback() {
    if (arrows.length === 0) return;
    playSong("hit");
    for (let i = 0; i < currentLevel.balls.length; i++) {
        const ball = currentLevel.balls[i];
        if (ball.hole) continue;

        const arrow = arrows[i];
        const x = Math.cos(arrow.angle) * arrow.magnitude * .05;
        const y = Math.sin(arrow.angle) * arrow.magnitude * .05;
        ball.vel.x = x;
        ball.vel.y = y;
        ball.hit = true;
    }

    // triggerShake(arrows[0].angle, false, arrows[0].magnitude);
    triggerRelax(arrows[0].angle, arrows[0].magnitude);

    arrows.length = 0;
    currentLevel.hit = true;
    global.inputMode = INPUT_MODES.watching;
    canvas.style.cursor = "not-allowed";
    document.getElementById("js-hit-ball").classList.add("disabled");
    document.getElementById("js-place-wall").classList.add("disabled");
    global.nextButton.classList.add("disabled");
    global.prevButton.classList.add("disabled");
    const resetButton = document.getElementById("js-reset");
    resetButton.classList.remove("disabled");

    Array.from(document.getElementsByClassName("button")).forEach(button => {
        if (button.id === "js-reset" || button.id === "js-hints") return;
        button.style.backgroundColor = null;
        button.style.boxShadow = null;
    });

    resetButton.style.backgroundColor = currentLevel.cssButtonColor;
    resetButton.style.boxShadow = `0 5px ${currentLevel.cssButtonShadowColor}`;
    resetButton.style.color = getTextColorForBackground(...hexToRgb(currentLevel.cssButtonColor));

    global.canvasContainer.style.transform = null;
    global.lastHitAngle = global.currentHitAngle;
}

function placeWallPointReleaseCallback() {
    if (wallPoint.vertices.length === 0) return; // TODO: not sure i like this fix
    const mag = calculateMagnitude(wallPoint.vertices[0].x, wallPoint.vertices[0].y, joystick.currentPos.x, joystick.currentPos.y);
    if (mag < MIN_WALL_LENGTH && wallPoint.vertices.length === 1) {
        return;
    }

    wallPoint.vertices.push({x: joystick.currentPos.x, y: joystick.currentPos.y});
    if (wallPoint.vertices.length < 2) return;

    currentLevel.walls.push(new Wall(
        wallPoint.vertices[0].x,
        wallPoint.vertices[0].y,
        wallPoint.vertices[1].x,
        wallPoint.vertices[1].y,
        true
    ));

    wallPoint = new WallPoint();
}

function moveCallback() {
    if (global.inputMode === INPUT_MODES.hit) {
        moveHitBallCallback();
    } else if (global.inputMode === INPUT_MODES.moveHandle) {
        moveHandleCallback();
    } else if (global.inputMode === INPUT_MODES.moveWall) {
        moveWallCallback();
    } else if (global.inputMode === INPUT_MODES.wall) {
        if (wallPoint.vertices.length > 0) updateWallAngle(wallPoint);
    }
}

function moveHandleCallback() {
    if (global.selectedVertex) {
        if (global.selectedVertex === global.selectedWall.v1) {
            global.selectedWall.setVertices(
                joystick.currentPos.x,
                joystick.currentPos.y,
                global.selectedWall.v2.x,
                global.selectedWall.v2.y
            );
        } else {
            global.selectedWall.setVertices(
                global.selectedWall.v1.x,
                global.selectedWall.v1.y,
                joystick.currentPos.x,
                joystick.currentPos.y
            );
        }
    }

    updateWallAngle(global.selectedWall);
}

function updateWallAngle(wall) {
    if (wall.vertices.length === 1) {
        const dx = joystick.currentPos.x - wall.vertices[0].x;
        const dy = joystick.currentPos.y - wall.vertices[0].y;
        const angle =  (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
        global.ui.innerText = `${angle.toFixed(0)}°`;
        if (angle === -0) global.ui.innerText = "0";
    } else {
        const dx = wall.vertices[1].x - wall.vertices[0].x;
        const dy = wall.vertices[1].y - wall.vertices[0].y;
        const angle =  (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
        global.ui.innerText = `${angle.toFixed(0)}°`;
        if (angle === -0) global.ui.innerText = "0";
    }
}

function moveWallCallback() {
    if (global.selectedWall) {
        const dx = joystick.currentPos.x - global.lastMoveLocation.x;
        const dy = joystick.currentPos.y - global.lastMoveLocation.y;
        global.selectedWall.setVertices(
            global.selectedWall.v1.x + dx,
            global.selectedWall.v1.y + dy,
            global.selectedWall.v2.x + dx,
            global.selectedWall.v2.y + dy
        )

        global.lastMoveLocation.x = joystick.currentPos.x;
        global.lastMoveLocation.y = joystick.currentPos.y;
    }

    updateWallAngle(global.selectedWall);
}

function moveHitBallCallback() {
    if (arrows.length === 0) return;

    let angleOffset = 1;

    for (let i = 0; i < arrows.length; i++) {
        const arrow = arrows[i];
        const ball = currentLevel.balls[i];
        if (ball.hole) continue;


        angleOffset = ball.startAngle;

        const angle = angleOffset + angleFromJoystick(joystick) * ball.angleDir;

        const magnitude = calculateMagnitude(
            joystick.innerPos.x,
            joystick.innerPos.y,
            joystick.outerPos.x,
            joystick.outerPos.y
        );

        arrow.angle = angle;
        arrow.magnitude = magnitude;
    }

    const arrow = arrows[0];
    global.currentHitAngle = `${(arrow.angle * 180 / Math.PI).toFixed(0)}° | ${arrow.magnitude.toFixed(0)}`;

    let uiString = ""
    if (global.lastHitAngle.length > 0) {
        uiString = `<div class="prev-ui-text">${global.lastHitAngle}</div>`;
    }
    uiString += `<div>${global.currentHitAngle}</div>`;
    global.ui.innerHTML = uiString;

    translateCanvasContainer(arrow.magnitude, arrow.angle);
}


function angleFromJoystick(joystick) {
    return Math.atan2(
        -(joystick.innerPos.y - joystick.outerPos.y),
        -(joystick.innerPos.x - joystick.outerPos.x)
    );
}

function checkEdgeCollisions(ball) {
    if (ball.pos.x + ball.radius < 0) {
        ball.pos.x = canvas.width - ball.radius;
    }

    if (ball.pos.x - ball.radius > canvas.width) {
        ball.pos.x = ball.radius;
    }

    if (ball.pos.y + ball.radius < 0) {
        ball.pos.y = canvas.height - ball.radius;
    }

    if (ball.pos.y - ball.radius > canvas.height) {
        ball.pos.y = ball.radius;
    }
}

function circlesIntersect(circle1, circle2) {
    const dx = circle1.pos.x - circle2.pos.x;
    const dy = circle1.pos.y - circle2.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

function normalizedAmountOfCircleOverlap(circle1, circle2) {
    const dx = circle1.pos.x - circle2.pos.x;
    const dy = circle1.pos.y - circle2.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > (circle1.radius + circle2.radius)) return 0.0;

    const max = circle1.radius + circle2.radius;

    return (max - distance) / max;
}

function resolveBallCollision(ball1, ball2) {
    // Calculate the vector between the ball centers
    const dx = ball2.pos.x - ball1.pos.x;
    const dy = ball2.pos.y - ball1.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the distance is zero (to avoid division by zero)
    if (distance === 0) return; // Balls are exactly on top of each other

    // Calculate the minimum translation distance to push balls apart after intersecting
    const mtvDistance = (ball1.radius + ball2.radius) - distance;
    const normalX = dx / distance;
    const normalY = dy / distance;

    // Apply the mtv only if the balls are overlapping
    if (mtvDistance > 0) {
        ball1.pos.x -= mtvDistance * normalX * (ball2.mass / (ball1.mass + ball2.mass));
        ball1.pos.y -= mtvDistance * normalY * (ball2.mass / (ball1.mass + ball2.mass));
        ball2.pos.x += mtvDistance * normalX * (ball1.mass / (ball1.mass + ball2.mass));
        ball2.pos.y += mtvDistance * normalY * (ball1.mass / (ball1.mass + ball2.mass));
    }

    // Relative velocity in normalized direction
    const relativeVelocity = {
        x: ball2.vel.x - ball1.vel.x,
        y: ball2.vel.y - ball1.vel.y
    };
    const relativeSpeed = relativeVelocity.x * normalX + relativeVelocity.y * normalY;

    // Don't resolve if velocities are separating
    if (relativeSpeed > 0) return;

    // Calculate impulse scalar
    // const e = 0.9; // Coefficient of restitution (0 = perfectly inelastic, 1 = perfectly elastic)
    const e = 1; // Coefficient of restitution (0 = perfectly inelastic, 1 = perfectly elastic)
    const impulse = -(1 + e) * relativeSpeed / (1 / ball1.mass + 1 / ball2.mass);
    // const impulse = (2 * relativeSpeed) / (ball1.mass + ball2.mass);


    // Apply impulse to the velocity of each ball
    ball1.vel.x -= (impulse / ball1.mass * normalX);
    ball1.vel.y -= (impulse / ball1.mass * normalY);
    ball2.vel.x += (impulse / ball2.mass * normalX);
    ball2.vel.y += (impulse / ball2.mass * normalY);

}

function calculateMagnitude(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function drawBall(ball, stroke = true) {
    // draw on both sides if the ball is on the edge of the screen
    if ((ball.pos.x - ball.radius < 0)) {
        drawSingleBall(ball, ball.pos.x + canvas.width, ball.pos.y, stroke);
    }

    if ((ball.pos.x + ball.radius > canvas.width)) {
        drawSingleBall(ball, ball.pos.x - canvas.width, ball.pos.y, stroke);
    }

    if ((ball.pos.y - ball.radius < 0)) {
        drawSingleBall(ball, ball.pos.x, ball.pos.y + canvas.height, stroke);
    }

    if ((ball.pos.y + ball.radius > canvas.height)) {
        drawSingleBall(ball, ball.pos.x, ball.pos.y - canvas.height, stroke);
    }

    drawSingleBall(ball, ball.pos.x, ball.pos.y, stroke);
}

function drawSingleBall(ball, x, y, stroke = true) {
    ctx.beginPath();
    ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${ball.alpha})`;
    const trailColor = `rgba(${ball.trailColor[0]}, ${ball.trailColor[1]}, ${ball.trailColor[2]}, ${ball.alpha})`;
    if (!stroke) ctx.fillStyle = trailColor;

    ctx.strokeStyle = `rgba(0, 0, 0, ${ball.alpha})`;
    ctx.lineWidth = 5;
    ctx.setLineDash([]);
    ctx.closePath();

    if (stroke) ctx.stroke();
    ctx.fill();
}

function drawHole(hole) {
    ctx.beginPath();
    ctx.arc(hole.pos.x, hole.pos.y, hole.radius, 0, Math.PI * 2);
    ctx.fillStyle = hole.color;
    ctx.fill();
    ctx.closePath();
}

function drawLevel(level) {
    global.canvasContainer.style.backgroundColor = level.backgroundColor;
    global.holeNumber.style.color = level.cssBackgroundColor;

    level.draw(ctx);
    for (let i = 0; i < level.holes.length; i++) {
        const hole = level.holes[i];
        drawHole(hole);
    }

    for (let i = 0; i < level.walls.length; i++) {
        const wall = level.walls[i];
        wall.draw(ctx);
    }

    if ((global.inputMode & INPUT_MODES.placeAny) && wallPoint.vertices.length > 0) {
        preWall.setVertices(wallPoint.vertices[0].x, wallPoint.vertices[0].y, joystick.currentPos.x, joystick.currentPos.y);

        preWall.wall = global.inputMode === INPUT_MODES.wall;
        preWall.draw(ctx);
    }

    for (let i = 0; i < level.balls.length; i++) {
        const ball = level.balls[i];

        if (ball.hit) {
            for (let j = 0; j < ball.lastPositions.length; j++) {
                const lastBall = ball.lastPositions[j];
                drawBall(lastBall, false);
            }
        }

        drawBall(ball);
    }
}

function win() {
    global.currentHoleText = "";
    global.holeNumber.innerText = "";
    playSong("winGame");
    location.hash = `#/win`;
    currentLevelIndex = -1;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentLevelIndex === -1) {
        return;
    }

    drawLevel(currentLevel);

    for (let i = 0; i < arrows.length; i++) {
        const arrow = arrows[i];
        const ball = currentLevel.balls[i];
        if (ball.hole) continue;
        drawArrow(arrow);
    }

    for (let i = 0; i < currentLevel.balls.length; i++) {
        const ball = currentLevel.balls[i];
        if (ball.hole) {
            ball.hole.drawParticles(ctx);
        }
    }
}

function drawArrow(arrow) {
    drawSingleArrow(ctx, arrow.startPos.x, arrow.startPos.y, arrow.endPos.x, arrow.endPos.y);

    const xMagnitude = Math.abs(arrow.startPos.x - arrow.endPos.x);
    const yMagnitude = Math.abs(arrow.startPos.y - arrow.endPos.y);

    let mirrorXStart = arrow.startPos.x;
    let mirrorXEnd = arrow.endPos.x;
    let mirrorYStart = arrow.startPos.y;
    let mirrorYEnd = arrow.endPos.y;

    if (arrow.endPos.x < 0) {
        mirrorXStart = arrow.startPos.x + canvas.width;
        mirrorXEnd = mirrorXStart - xMagnitude;
    }

    if (arrow.endPos.x > canvas.width) {
        mirrorXStart = arrow.startPos.x - canvas.width;
        mirrorXEnd = mirrorXStart + xMagnitude;
    }

    if (arrow.endPos.y < 0) {
        mirrorYStart = arrow.startPos.y + canvas.height;
        mirrorYEnd = mirrorYStart - yMagnitude;
    }

    if (arrow.endPos.y > canvas.height) {
        mirrorYStart = arrow.startPos.y - canvas.height;
        mirrorYEnd = mirrorYStart + yMagnitude;
    }

    drawSingleArrow(ctx, mirrorXStart, mirrorYStart, mirrorXEnd, mirrorYEnd);

}

function drawSingleArrow(ctx, fromx, fromy, tox, toy) {
    const magnitude = calculateMagnitude(fromx, fromy, tox, toy);
    var headlen = Math.min(magnitude, 20);  // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;

    // Arrow shaft
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox - headlen / 2 * Math.cos(angle), toy - headlen / 2 * Math.sin(angle));

    ctx.stroke();
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(
        tox - headlen * Math.cos(angle - Math.PI / 6),
        toy - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        tox - headlen * Math.cos(angle + Math.PI / 6),
        toy - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();  // this will draw the last line of the triangle back to the starting point
    ctx.fill();
    // ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Arrow shaft
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox - headlen / 2 * Math.cos(angle), toy - headlen / 2 * Math.sin(angle));

    // ctx.stroke();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // draw small black cirlce at from
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(fromx, fromy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

}

function update(timestep) {
    currentLevel.update();

    if (currentLevel.solved && global.winLevelAt === null) {
        global.winLevelAt = Date.now();
    }

    // for (let i = 0; i < currentLevel.holes.length; i++) {
    //     const hole = currentLevel.holes[i];
    //     hole.emitParticles();
    // }

    for (let i = 0; i < currentLevel.balls.length; i++) {
        const ball = currentLevel.balls[i];
        const arrow = arrows[i];

        ball.update(timestep);

        if (ball.hole) {
            ball.hole.emitParticles();
        }

        for (let j = 0; j < currentLevel.balls.length; j++) {
            if (i === j) continue;
            const otherBall = currentLevel.balls[j];
            if (ball.hole || otherBall.hole || ball.alpha < .5) continue;
            if (circlesIntersect(ball, otherBall)) {
                resolveBallCollision(ball, otherBall);
            }
        }



        if (arrow) {
            arrow.startPos.x = ball.pos.x;
            arrow.startPos.y = ball.pos.y;
        }

        if (global.inputMode === INPUT_MODES.watching) {
            checkEdgeCollisions(ball);
            checkHoleCollisions(ball);
            checkWallCollision(ball);
        }
    }

    const wonForLongEnough = global.winLevelAt !== null && (Date.now() - global.winLevelAt) > 2000;

    if (currentLevel.solved && !global.transitioning && currentLevelIndex !== -1 && wonForLongEnough) {
        playSong("winLevel");
        transitionCanvas();
    }

    if (currentLevel.hit) {
        for (let i = 0; i < currentLevel.balls.length; i++) {
            const ball = currentLevel.balls[i];
            if (ball.hole) continue;
            if (global.stillAt === null) global.stillAt = Date.now();
            if (calculateMagnitude(ball.vel.x, ball.vel.y, 0, 0) < BALL_STOPPED_THRESHOLD) {
                if (global.stillAt === null) global.stillAt = Date.now();
            } else {
                global.stillAt = null;
            }

            if (global.stillAt !== null && Date.now() - global.stillAt > 1000) {
                currentLevelReset();
                globalReset();
                playSong("loseLevel");
            }
        }
    }

    for (let i = 0; i < currentLevel.walls.length; i++) {
        const wall = currentLevel.walls[i];
        if (wall.broken) {
            wall.update();
        }
    }

}

function checkWallCollision(ball) {
    for (let i = 0; i < currentLevel.walls.length; i++) {
        const wall = currentLevel.walls[i];
        if (wall.broken) continue;

        const collision = calculateSeparation(ball, wall);
        if (collision) {
            const speed = Math.hypot(ball.vel.x, ball.vel.y) * .5;
            wall.collided(speed);
            playSong("wall");
            triggerShake(Math.random() * Math.PI * 2, true);
            // bounce ball based on angle of collision.
            ball.pos.x += collision.mtv.x;
            ball.pos.y += collision.mtv.y;

            // Reflect velocity off wall
            const normal = collision.axis;
            const dot = ball.vel.x * normal.x + ball.vel.y * normal.y;

            ball.vel.x -= 2 * dot * normal.x;
            ball.vel.y -= 2 * dot * normal.y;
        }
    }
}

function goToLevel(levelNum) {
    if (levelNum ==="win") {
        document.getElementById("title").style.display = "none";
        document.getElementById("win").style.display = null;
        document.getElementById("win").classList.remove("animated");
        setTimeout(() => document.getElementById("win").classList.add("animated"), 0);

        win();
        globalReset();
        return;
    } else if (levelNum === 1 && !joystick) {
        document.getElementById("win").style.display = "none";
        document.getElementById("title").classList.remove("animated");
        document.getElementById("title").style.display = "none";

        setTimeout(() => {
            document.getElementById("title").style.display = null;
            document.getElementById("title").classList.add("animated")
        }, 0);

    } else {
        document.getElementById("win").style.display = "none";
    }

    if (levelNum === 13) {
        document.getElementById("js-hints").classList.add("disabled");
    } else {
        document.getElementById("js-hints").classList.remove("disabled");
    }

    currentLevelIndex = (levelNum - 1) % levels.length;
    const nextLevelIndex = (currentLevelIndex + 1) % levels.length;
    currentLevel = levels[currentLevelIndex];
    nextLevel = levels[nextLevelIndex]
    currentLevel.reset();
    location.hash = `#/${currentLevelIndex + 1}`;
    global.lastHitAngle = "";
    global.holeNumber.innerText = `${currentLevelIndex + 1}`;

    globalReset();
    currentLevelReset();
}

function globalReset() {
    document.getElementById("js-hit-ball").classList.add("active");
    document.getElementById("js-place-wall").classList.remove("active");
    document.getElementById("js-reset").classList.remove("active");

    document.getElementById("js-hit-ball").classList.remove("disabled");
    document.getElementById("js-place-wall").classList.remove("disabled");
    const jsReset =document.getElementById("js-reset")
    jsReset.classList.add("disabled");

    global.prevButton.classList.remove("disabled");
    global.nextButton.classList.remove("disabled");
    if (currentLevelIndex === 0) {
        global.prevButton.classList.add("disabled");
    }

    if (currentLevelIndex === levels.length - 1 || currentLevelIndex === -1) {
        global.nextButton.classList.add("disabled");
    }

    Array.from(document.getElementsByClassName("button")).forEach(button => {
            let backgroundColor = currentLevel.cssButtonColor;

            let shadowColor = `0 5px ${currentLevel.cssButtonShadowColor}`;

            if (button.classList.contains("active")) {
                shadowColor = `0 2px ${currentLevel.cssButtonShadowColor}`;
            }


            let textColor = getTextColorForBackground(...hexToRgb(currentLevel.cssButtonColor));

            if (!button.classList.contains("disabled")) {
                button.style.backgroundColor = backgroundColor;
                button.style.boxShadow =  shadowColor;
                button.style.color = textColor;
            } else {
                button.style.backgroundColor = null;
                button.style.boxShadow = null;
                button.style.color = null;
            }
    });

    global.stillAt = null;
    global.winLevelAt = null;
    global.selectedWall = null;
    global.selectedVertex = null;
    global.inputMode = INPUT_MODES.hit;
    canvas.style.cursor = "crosshair";
}

function checkHoleCollisions(ball) {
    ball.falling = false;
    for (let i = 0; i < currentLevel.holes.length; i++) {
        const hole = currentLevel.holes[i];
        const dx = hole.pos.x - ball.pos.x;
        const dy = hole.pos.y - ball.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const velocityMagnitude = Math.sqrt(ball.vel.x * ball.vel.x + ball.vel.y * ball.vel.y);

        if (distance <= (hole.radius - ball.radius) && velocityMagnitude < BALL_MADE_THRESHOLD && !ball.hole) {
            ball.hole = hole;
            playSong("inHole");
            ball.falling = true;
        } else if (circlesIntersect(ball, hole)) {
            const gravity = normalizedAmountOfCircleOverlap(ball, hole) * .2;
            const forceX = gravity * dx / distance;
            const forceY = gravity * dy / distance;
            ball.vel.x += forceX;
            ball.vel.y += forceY;
            ball.alpha -= .01;
            ball.alpha = Math.max(ball.alpha, 0.0);
            ball.falling = true;
        }
    }
    if (!ball.falling) ball.alpha = 1.0;
}

window.playSong = playSong;

const FIXED_TIMESTEP = 1000 / 60;  // 60 updates per second
let accumulatedTime = 0;
let lastTime = 0;

function loop(timestamp) {
    const deltaTime = timestamp - lastTime;

    lastTime = timestamp;
    accumulatedTime += deltaTime;

    while (accumulatedTime >= FIXED_TIMESTEP) {
        update(FIXED_TIMESTEP);
        accumulatedTime -= FIXED_TIMESTEP;
    }

    draw();
    requestAnimationFrame(loop);
}

function getLevelFromHash() {
    const hash = window.location.hash.substring(2)
    if (hash === "win") return "win";
    if (hash.length === 0) return 1;
    return parseInt(hash, 10);
}


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return  result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}


function calculateBrightness(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getTextColorForBackground(r, g, b) {
    const brightness = calculateBrightness(r, g, b);
    return brightness > 128 ? 'black' : 'white';
}

function playSong(name) {
    if (global.songs[name]) {
        global.songs[name].currentTime = 0;
        global.songs[name].play();

    }
}

loop(0);
document.addEventListener('DOMContentLoaded', () => {
    const hash = getLevelFromHash();
        goToLevel(hash);

    hitBallButtonClickCallback();
    generateSong(hitSong, "hit");
    generateSong(winLevelSong, "winLevel");
    generateSong(wallSong, "wall");
    generateSong(loseLevelSong, "loseLevel");
    generateSong(winGameSong, "winGame");
    generateSong(inHoleSong, "inHole");
    updateHintUi();
});

window.addEventListener("hashchange", () => {
    const val = getLevelFromHash()
    if (val !== "win") goToLevel(getLevelFromHash());
});

document.body.addEventListener("click", () => {
    document.getElementById("title").classList.add("hide");
    document.getElementById("title").style.opacity = 0;

    if (!joystick) {
        playSong("winGame");
        joystick = new Joystick(canvas, clickCallback, releaseCallback, moveCallback);
    }
});

document.body.addEventListener("touchstart", () => {
    document.getElementById("title").classList.add("hide");

});

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();

    let pointer = "crosshair";

    for (let i = 0; i < currentLevel.walls.length; i++) {
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        const wall = currentLevel.walls[i];

        x /= getCanvasScalingFactor();
        y /= getCanvasScalingFactor();

        if (wall.pointInCloseButton(x, y)) {
            pointer = "pointer";
        } else if (wall.pointInHandle(x, y)) {
            pointer = "grab";
        } else if (wall.isPointInside(x, y)) {
            pointer = "grab";
        }
    }

    if (global.inputMode === INPUT_MODES.watching) {
        pointer = "not-allowed";
    }

    canvas.style.cursor = pointer;
});

function currentLevelReset() {
    global.currentHitAngle = ""
    // global.lastUiText = global.currentHitAngle;
    global.currentHoleText = `${currentLevelIndex + 1} / ${levels.length}`;
    global.ui.innerHTML = global.currentHoleText;
    global.ui.style.color = getTextColorForBackground(...hexToRgb(currentLevel.cssButtonColor));
    global.ui.style.backgroundColor = currentLevel.cssButtonColor;
    currentLevel.reset();
}

function createRelaxAnimation(angleInRadians, magnitude) {
    const styleSheet = document.styleSheets[0];
    const keyframeName = 'shake-animation';
    const shakeClassName = 'shake';
    const multiplier = .1 * magnitude;
    const duration = .75;


    // Remove existing keyframes (if any)
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].name === keyframeName) {
            styleSheet.deleteRule(i);
            break;
        }
    }

    // Calculate the x and y multipliers based on the angle (in radians)
    const xMultiplier = -Math.cos(angleInRadians) * multiplier;
    const yMultiplier = Math.sin(angleInRadians) * multiplier;

    const keyframes = `
    @keyframes ${keyframeName} {
      0% { transform: translate(${xMultiplier}px, ${yMultiplier}px); }
      60% { transform: translate(${xMultiplier * -0.3}px, ${yMultiplier * -0.3}px); }
      100% { transform: translate(0, 0); }
    }
  `;

    // Insert new keyframes rule
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);


    // Update or add the shake class rule to apply the animation with the specified duration
    let shakeRuleIndex = -1;
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].selectorText === `.${shakeClassName}`) {
            shakeRuleIndex = i;
            break;
        }
    }

    const shakeRule = `
    .${shakeClassName} {
      animation: ${keyframeName} ${duration}s ease-out;
    }
  `;

    if (shakeRuleIndex >= 0) {
        styleSheet.deleteRule(shakeRuleIndex);
        styleSheet.insertRule(shakeRule, shakeRuleIndex);
    } else {
        styleSheet.insertRule(shakeRule, styleSheet.cssRules.length);
    }
}

function createShakeAnimation(angleInRadians) {
    const styleSheet = document.styleSheets[0];
    const keyframeName = 'shake-animation';
    const shakeClassName = 'shake';
    const multiplier = 1
    const duration =1;


    // Remove existing keyframes (if any)
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].name === keyframeName) {
            styleSheet.deleteRule(i);
            break;
        }
    }

    // Calculate the x and y multipliers based on the angle (in radians)
    const xMultiplier = Math.cos(angleInRadians) * multiplier;
    const yMultiplier = -Math.sin(angleInRadians) * multiplier;

    // Create new keyframes
    let keyframes = `
    @keyframes ${keyframeName} {
      0% { transform: translate(0, 0); }
      10% { transform: translate(${xMultiplier * -10}px, ${yMultiplier * 10}px); }
      20% { transform: translate(${xMultiplier * 10}px, ${yMultiplier * -10}px); }
      30% { transform: translate(${xMultiplier * -8}px, ${yMultiplier * 8}px); }
      40% { transform: translate(${xMultiplier * 8}px, ${yMultiplier * -8}px); }
      50% { transform: translate(${xMultiplier * -5}px, ${yMultiplier * 5}px); }
      60% { transform: translate(${xMultiplier * 5}px, ${yMultiplier * -5}px); }
      70% { transform: translate(${xMultiplier * -3}px, ${yMultiplier * 3}px); }
      80% { transform: translate(${xMultiplier * 3}px, ${yMultiplier * -3}px); }
      90% { transform: translate(${xMultiplier * -1}px, ${yMultiplier}px); }
      100% { transform: translate(0, 0); }
    }
  `;

    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);


    // Update or add the shake class rule to apply the animation with the specified duration
    let shakeRuleIndex = -1;
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].selectorText === `.${shakeClassName}`) {
            shakeRuleIndex = i;
            break;
        }
    }

    const shakeRule = `
    .${shakeClassName} {
      animation: ${keyframeName} ${duration}s ease-out;
    }
  `;

    if (shakeRuleIndex >= 0) {
        styleSheet.deleteRule(shakeRuleIndex);
        styleSheet.insertRule(shakeRule, shakeRuleIndex);
    } else {
        styleSheet.insertRule(shakeRule, styleSheet.cssRules.length);
    }
}

function triggerRelax(angleInRadians, magnitude) {
    createRelaxAnimation(angleInRadians, magnitude);
    document.getElementById("canvas-container").classList.add('shake');
    setTimeout(() => {
        document.getElementById("canvas-container").classList.remove('shake');
    }, 1000);
}

function triggerShake(angleInRadians) {
    createShakeAnimation(angleInRadians);
    document.getElementById("canvas-container").classList.add('shake');
    setTimeout(() => {
        document.getElementById("canvas-container").classList.remove('shake');
    }, 1000);
}

function transitionCanvas() {
    const c = global.canvasContainer;
    global.transitioning = true;
    c.classList.add('offscreen-right');
    c.style.transition = 'transform 1s ease-in-out';
    const curr = currentLevelIndex;

    setTimeout(() => {
        const levelNum = curr + 2 > levels.length ? "win" : curr + 2;
        goToLevel(levelNum); // +2 because it's 0-indexed
        c.classList.remove('offscreen-right');
        c.classList.add('offscreen-left');
        c.style.transition = 'none';

        setTimeout(() => {
            c.style.transition = 'transform 1s ease-in-out';
            c.classList.remove('offscreen-left');
            c.classList.add('onscreen');
            setTimeout(() => {
                c.style.transition = 'none';
                global.transitioning = false;
                c.classList.remove('onscreen');
            }, 1000);
        }, 50); // A slight delay to ensure the left-to-right transition is visible
    }, 1000); // Match the duration of the transition (1 second)
}
