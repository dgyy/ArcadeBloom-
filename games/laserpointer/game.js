/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

'use strict';

let mouse;
let laser;
let cat;
let floor_texture;
let game_over_texture;
let circle_texture;
let cheese;
let level;
let level_i = 0;

let game_state; // "caught" | "active" | "won" | "paused"
let space_holded = false;

function raycast(start, end, solids) {
    let min_d = Infinity;
    let top_candidate = null;
    let candidates = engineObjectsRaycast(start, end, solids);
    for (let candidate of candidates) {
        let corners = candidate.corners;
        let sides = candidate.sides;
        let intersection = null;
        let max_d = 0;
        let operations = [
            [sides.right < start.x, () => (findIntersection(start, end, corners.topright, corners.bottomright))],
            [sides.left > start.x, () => (findIntersection(start, end, corners.topleft, corners.bottomleft))],
            [sides.top < start.y, () => (findIntersection(start, end, corners.topleft, corners.topright))],
            [sides.bottom > start.y, () => (findIntersection(start, end, corners.bottomleft, corners.bottomright))]
        ];
        for (let op of operations) {
            if (op[0]) {
                let i = op[1]();
                if (i != null) {
                    let d = start.distance(i);
                    if (d > max_d) {
                        intersection = i;
                        max_d = d;
                    }
                }
            }
        }
        if (max_d < min_d) {
            top_candidate = intersection;
            min_d = max_d;
        }
    }
    if (top_candidate === null) {
        top_candidate = start.add(end.subtract(start).normalize(10));
    }
    return top_candidate;
}

function findIntersection(p1, p2, p3, p4) { // https://stackoverflow.com/a/51127674/26427793
    let determinant = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(determinant) < 0.00005) {
        return null;
    }
    let px = ((p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) - (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)) / determinant;
    let py = ((p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)) / determinant;
    return vec2(px, py)
}

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
    // textures
    let mouse_texture = new TileInfo(vec2(1, 0), vec2(62, 64));
    let cat_texture = new TileInfo(vec2(64, 0), vec2(64, 64));
    floor_texture = new TileInfo(vec2(128, 0), vec2(63, 63));
    let cheese_texture = new TileInfo(vec2(0, 64), vec2(64, 64));
    game_over_texture = new TileInfo(vec2(64 * 1, 64 * 1), vec2(64, 64));
    circle_texture = new TileInfo(vec2(64 * 2, 64 * 1), vec2(64, 64));
    // characters
    mouse = new Mouse(vec2(0, 0), vec2(1.5, 1.5), mouse_texture);
    cat = new Cat(vec2(0, 0), vec2(1.9, 1.9), cat_texture);
    cheese = new Cheese(vec2(10, 10), cheese_texture);
    laser = new Laser();
    Level.loadWallTextures();
    level = new Level(levels[level_i]);
    //
    game_state = "paused";
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
    changeGameState();
    if (game_state == "active") {
        mouse.velocity = keyDirection().scale(Mouse.speed);
        cat.updateCat(laser, mouse);
    } else if (game_state == "paused") {}
}

function changeGameState() {
    if (keyIsDown("Space")) {
        if (space_holded) {
            return;
        } else {
            // Change game state
            space_holded = true;
            if (game_state == "paused") {
                game_state = "active";
                console.log("Game Active");
            } else if (game_state = "active") {
                game_state = "paused";
                stopAllMovement();
                console.log("Game Paused");
            }
            //
        }
    } else {
        space_holded = false;
    }
}

function stopAllMovement() {
    cat.velocity = vec2(0, 0);
    mouse.velocity = vec2(0, 0);
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
    // called after physics and objects are updated
    // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
    // called before objects are rendered
    // draw any background effects that appear behind objects
    drawFloorTiles();
    if (game_state == "active") {
        let end = mouse.pos.add(mousePos.subtract(mouse.pos).normalize(20))
        let i = raycast(mouse.pos, end, Laser.laserSolids);
        drawLine(mouse.pos, i, 0.1, rgb(1, 0, 0));
        laser.pos = i;
    }
}

function drawFloorTiles() {
    let floor_tile_size = 4;
    for (let x = -10; x < 10; x += floor_tile_size) {
        for (let y = -10; y < 10; y += floor_tile_size) {
            drawTile(vec2(x, y), vec2(floor_tile_size), floor_texture);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // drawTextScreen('Hello World!', mainCanvasSize.scale(.5), 80);
    if (game_state == "caught") {
        let p = mouse.pos.add(cat.pos).scale(0.5);
        drawTile(p, vec2(5, 5), game_over_texture);
        drawTextScreen("Caught", mainCanvasSize.scale(.5), 100);
    }
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);