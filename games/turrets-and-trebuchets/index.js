// https://jsfiddle.net/soulwire/UA6H5/

// TODO must click! Should not be allowed to hold down mouse and move around to select a point
// TODO as long as the mouse is held down, the selected click point should remain - not move, and not be "deselected". OR?

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const MIN_CLICK_DISTANCE = 25;
const BALL_RADIUS = 10;

const PlayerState = {
    IDLE: 1,
    HOVERING: 2,
    PULLING: 3,
};

var dimensions = {
    update(w, h) {
        this.w = w;
        this.h = h;
    }
}

let lastTime = Date.now();

createLine = (x1, y1, x2, y2) => {
    return {
        x1 : x1, y1: y1, x2 : x2, y2 : y2, 
        dir : Geo.createVector(x2-x1, y2-y1), 
        normal : Geo.normalize(Geo.createVector(y1-y2, x2-x1))
    }
}

let lines = [];

var speed = 0;
var mouse = { x : 0, y : 0, down : false, goneDown : false, goneUp : false }
var hoveredLineIndex = undefined;
var hoverPoint = undefined;
var dragPoint = undefined;
var dragging = false;
var ball = { x : 200, y : 200, vel : Geo.createVector(0, 3) };
var lineComplete = 0;
var removedAreas = [];
var playerState = PlayerState.IDLE;

let projectedMousePoint = {
    lineIndex : undefined,
    point : undefined
}

player = { x : 450, y : 350 };
currentLineIndex = 1;

setLines = ls => {
    lines = ls;
    // console.log(lines);
} 

setLines([
    createLine(50, 50, 450, 50),
    createLine(450, 50, 450, 450),
    createLine(450, 450, 250, 450),
    createLine(250, 450, 50, 150),
    createLine(50, 150, 50, 50),   
]);

incCurrentLineIndex = () => {
    currentLineIndex = (currentLineIndex + 1) % lines.length;
}

decCurrentLineIndex = () => {
    currentLineIndex = (currentLineIndex + lines.length - 1) % lines.length;
}

currentLine = () => lines[currentLineIndex];

hoveredLine = () => hoveredLineIndex != undefined ? lines[hoveredLineIndex] : undefined;

getProjectedMousePoint = () => {
    var shortestDistance = Number.MAX_VALUE;
    var result = { lineIndex : undefined, point : undefined };
    for (var i = 0; i < lines.length; i++) {
        if (i != currentLineIndex) {
            var l = lines[i];
            var p = Geo.closestPoint(mouse, l);
            var dist = Geo.distanceBetween(mouse, p);
            if (dist < Math.min(MIN_CLICK_DISTANCE, shortestDistance)) {
                shortestDistance = dist;
                result.lineIndex = i;
                result.point = p;
            }
        }
    }
    return result;
}

updatePlayerState = () => {
    switch (playerState) {
        case PlayerState.IDLE:
            if (projectedMousePoint.point != undefined) {
                if (mouse.goneDown) {
                    playerState = PlayerState.PULLING;
                }
                else if (!mouse.down) {
                    playerState = PlayerState.HOVERING;
                }
            }
            break;
        case PlayerState.HOVERING:
            if (projectedMousePoint.point == undefined) {
                playerState = PlayerState.IDLE;
            }
            else if (mouse.goneDown) {
                playerState = PlayerState.PULLING;
            }
            break;
        case PlayerState.PULLING:
            if (projectedMousePoint.point == undefined) {
                playerState = PlayerState.IDLE;
            }
            else if (mouse.goneUp) {
                playerState = PlayerState.HOVERING;
            }
            break;
    }
}

update = () => {
    projectedMousePoint = getProjectedMousePoint();
    updatePlayerState();

    console.log(playerState);

    hoverPoint = undefined;
    hoveredLineIndex = undefined;
    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (l != currentLine()) {
            var p = Geo.closestPoint(mouse, l);
            if (Geo.distanceBetween(mouse, p) < MIN_CLICK_DISTANCE) {
                hoverPoint = p;
                hoveredLineIndex = i;
            }
        }
        if (Geo.isPointClose(ball, l, BALL_RADIUS)) {
            ball.vel = reflect(ball.vel, l.normal);
        }

    }

    if (dragPoint == undefined && hoverPoint != undefined && mouse.goneDown) {
        dragPoint = hoverPoint;
        var lineAngle = Geo.polarAngle(Geo.toVector(currentLine()));
        var pullAngle = Geo.polarAngle(Geo.createVector(dragPoint.x - player.x, dragPoint.y - player.y));
        var relativeAngle = pullAngle - lineAngle;
        speed = Math.cos(relativeAngle) * 5;
        //lineComplete++;
    }
    else if (dragPoint != undefined && mouse.down) {
        lineComplete++;
    }
    else {
        dragPoint = undefined;
        lineComplete = 0;
        if (Math.abs(speed) > 0.5) {
            speed *= 0.99;
        }
        else {
            speed = 0;
        }
    }

    var deltaX = Geo.dx(currentLine()) / Geo.len(currentLine()) * speed;
    var deltaY = Geo.dy(currentLine()) / Geo.len(currentLine()) * speed;
    player.x += deltaX;
    player.y += deltaY;

    var cl = currentLine();
    if (!Geo.isPointInBox(player, cl)) {
        if (speed > 0) {
            incCurrentLineIndex();
            player.x = currentLine().x1;
            player.y = currentLine().y1;
            // console.log(`inc - pos = ${player.x},${player.y}`);
        }
        else {
            decCurrentLineIndex();
            player.x = currentLine().x2;
            player.y = currentLine().y2;
            // console.log(`dec - pos = ${player.x},${player.y}`);
        }
    }

    if (dragPoint && mouse.down && Geo.isPointClose(ball, { x1 : dragPoint.x, y1 : dragPoint.y, x2 : player.x, y2 : player.y }, BALL_RADIUS)) {
        let x = FAIL(); //TODO
    }

    if (dragPoint && mouse.down && lineComplete >= 100) {
        introduceNewLine();
        lineComplete = 0;
    }

    ball.x += ball.vel.x;
    ball.y += ball.vel.y;
}

introduceNewLine = () => {
    var newLines1 = [];
    newLines1.push(createLine(player.x, player.y, dragPoint.x, dragPoint.y));
    newLines1.push(createLine(dragPoint.x, dragPoint.y, hoveredLine().x2, hoveredLine().y2));
    getIndices(hoveredLineIndex+1, currentLineIndex-1, lines.length).forEach(i => newLines1.push(lines[i]));
    newLines1.push(createLine(currentLine().x1, currentLine().y1, player.x, player.y));

    var newLines2 = [];
    newLines2.push(createLine(dragPoint.x, dragPoint.y, player.x, player.y));
    newLines2.push(createLine(player.x, player.y, currentLine().x2, currentLine().y2));
    getIndices(currentLineIndex+1, hoveredLineIndex-1, lines.length).forEach(i => newLines2.push(lines[i]));
    newLines2.push(createLine(hoveredLine().x1, hoveredLine().y1, dragPoint.x, dragPoint.y));

    var removedArea;
    var poly1 = Geo.toPolygon(newLines1);
    var poly2 = Geo.toPolygon(newLines2);
    if (Geo.area(poly1) > Geo.area(poly2)) {
        setLines(newLines1);
        removedArea = poly2;
    }
    else {
        setLines(newLines2);
        removedArea = poly1;
    }
    removedAreas.push(removedArea);

    if (Geo.isPointInPolygon(ball, removedArea)) {
        var x = SUCCESS(); // TODO 
    }
    
    // TODO look at all lines and find the closest point. Now set player to that point, and currentLineIndex accordingly.
    var newIndex = 0;
    var newPoint = Geo.closestPoint(player, lines[0]);
    for (var i = 1; i < lines.length; i++) {
        var p = Geo.closestPoint(player, lines[1]);
        if (Geo.distanceBetween(player, p) < Geo.distanceBetween(player, newPoint)) {
            newIndex = i;
            newPoint = p;
        }
    }
    currentLineIndex = newIndex;
    player = newPoint;
    speed = 0;
}

getIndices = (from, to, count) => {
    var result = [];
    var i = from;
    result.push(i % count);
    while (i % count != to) {
        i++;
        result.push(i % count);
    }
    return result;    
}

// https://gamedev.stackexchange.com/questions/23672/determine-resulting-angle-of-wall-collision
reflect = (vector, normal) => {
    var dotProduct = vector.x * normal.x + vector.y * normal.y;
    var scale = 2 * dotProduct;
    return Geo.createVector(vector.x - scale * normal.x, vector.y - scale * normal.y);
}

drawBall = () => {
    context.fillStyle = "yellow";
    context.beginPath();
    context.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI*2);
    context.stroke();
    context.fill();
}

draw = () => {
    context.fillStyle = "black";
    context.fillRect(0, 0, dimensions.w, dimensions.h);

    context.strokeStyle = "white";

    context.beginPath();
    lines.forEach(l => {
        context.moveTo(l.x1, l.y1);
        context.lineTo(l.x2, l.y2);
    });
    context.stroke();

    context.fillStyle = "gray";
    removedAreas.forEach(area => {
        context.beginPath();
        context.moveTo(area[0].x, area[0].y);
        for(var i = 1; i < area.length-1; i++ ) { 
            context.lineTo(area[i].x, area[i].y) 
        }
    });
    context.closePath();
    context.fill();

    // DRAW NORMAL VECTORS
    context.strokeStyle = "blue";
    context.beginPath();
    lines.forEach(l => {
        context.moveTo(l.x1 + l.dir.x / 2, l.y1 + l.dir.y / 2);
        context.lineTo(l.x1 + l.dir.x / 2 + l.normal.x, l.y1 + l.dir.y / 2 + l.normal.y);
    });
    context.stroke();

    context.strokeStyle = "white";

    if (hoveredLine()){
        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(hoveredLine().x1, hoveredLine().y1);
        context.lineTo(hoveredLine().x2, hoveredLine().y2);
        context.stroke();

        if (mouse.down) {
            if (lineComplete >= 100) {
                context.strokeStyle = "white";
            }
            context.beginPath();
            context.moveTo(hoverPoint.x, hoverPoint.y);
            context.lineTo(player.x, player.y);
            context.stroke();
        }

        context.strokeStyle = "red";
        context.beginPath();
        context.arc(hoverPoint.x, hoverPoint.y, 5, 0, Math.PI*2);
        context.stroke();
        context.fill();
    }

    context.beginPath();
    context.arc(player.x, player.y, 5, 0, Math.PI*2);
    context.stroke();
    context.fill();

    drawBall();
    context.fillStyle = "white";
    context.fillText(`(player at: ${currentLineIndex}, click at: ${hoveredLineIndex})`, 50, 20);
}

gameLoop = () => {
    var now = Date.now();

    update(now - lastTime);
    mouse.goneDown = false;
    mouse.goneUp = false;
    
    draw();

    requestAnimationFrame(gameLoop);
    lastTime = now;
}

// Set-up

handleResize = (w, h) => {
    canvas.width = w;
    canvas.height = h;
    var cw = canvas.clientWidth;
    var ch = canvas.clientHeight;
    dimensions.update(cw, ch);
}

window.addEventListener('mousemove', e => { mouse.x = e.offsetX; mouse.y = e.offsetY; });

window.addEventListener('mousedown', () => { mouse.down = true; mouse.goneDown = true; });

window.addEventListener('mouseup', () => { mouse.down = false; mouse.goneUp = true; });

window.addEventListener('load', () => {
    window.addEventListener('resize', () => {
        handleResize(window.innerWidth, window.innerHeight);
    });
    handleResize(window.innerWidth, window.innerHeight);
    gameLoop();
});
