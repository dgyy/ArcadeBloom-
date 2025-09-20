import Ball from "../ball.js";
import Hole from "../hole.js";
import Wall, {WALL_WIDTH} from "../wall.js";
import { global } from "../index.js";

export class Level {
    balls = [];
    walls = [];
    holes = [];
    number=0;
    transitioningAway = false;
    backgroundColor = "red";
    cssBackgroundColor = "red";
    cssButtonColor = "red";
    cssButtonShadowColor = "red";
    width = 500;
    height = 500;
    hit = false;

    reset() {
        this.hit = false;
        this.transitioningAway = false;
        this.balls.forEach(ball => {
            ball.reset()
            ball.trailColor = hexToRgb(this.cssBackgroundColor);
            ball.lastPositions.forEach(b2 => {
                b2.trailColor = ball.trailColor;
            })
        });

        this.walls.forEach(wall => {
            wall.reset();
        });

        document.getElementById("js-place-wall").classList.remove('disabled');
        document.getElementById("js-place-wall").setAttribute('disabled', false);

        document.body.style.backgroundColor = this.cssBackgroundColor;

        const wallEl = document.getElementById("js-place-wall");
        wallEl.style.display = "block";
        // remove jiggle class from wallEl
        wallEl.classList.remove('jiggle');

        if (this.number < 5) {
            wallEl.style.display = "none";
        } else if(this.number === 5) {
            wallEl.classList.add('jiggle');
        }
    }

    get solved() {
        for (let i = 0; i < this.balls.length; i++) {
            if (!this.balls[i].hole) {
                return false;
            }
        }

        return true;
    }

    update() {
    }

    draw(ctx) {
    }
}

class Level01 extends Level {
    backgroundColor = "#B4E7CE";
    cssBackgroundColor = "#59A96A";
    cssButtonColor = "#9BDEAC";
    cssButtonShadowColor = "#474A2C";
    number = 1;

    constructor() {
        super();
        this.holes = [new Hole(400, 250)];
        this.balls = [new Ball(250, 250)];
    }

    draw(ctx) {
        if (global.hints) {
            drawArrow(ctx, 250, 250, 325, 250);
        }
    }

}

class Level02 extends Level {
    backgroundColor = "#BB8A89";
    cssBackgroundColor = "#977390";
    cssButtonColor = "#AC7B7D";
    cssButtonShadowColor = "#785589";
    number= 2;

    constructor() {
        super();
        this.holes = [new Hole(400, 125), new Hole(400, 375)];
        this.balls = [new Ball(250, 125), new Ball(250, 375)];
    }

    draw(ctx) {
        if (!global.hints) return;
        drawArrow(ctx, 250, 125, 325, 125);
    }
}

class Level03 extends Level {
    backgroundColor = "#F4F4F9";
    cssBackgroundColor = "#586F7C";
    cssButtonColor = "#B8DBD9";
    cssButtonShadowColor = "#2F4550";
    number= 3;

    constructor() {
        super();
        this.holes = [new Hole(100, 125), new Hole(400, 375)];
        this.balls = [new Ball(250, 125), new Ball(250, 375, 0)];
    }

    draw(ctx) {
        if (!global.hints) return;
        drawArrow(ctx, 250, 125, 175, 125);
    }
}


class Level04 extends Level {
    backgroundColor = "#AFB3F7";
    cssBackgroundColor = "#7A93AC";
    cssButtonColor = "#92BCEA";
    cssButtonShadowColor = "#617073";
    number= 4;

    constructor() {
        super();
        this.holes = [new Hole(300, 125), new Hole(400, 375)];
        this.balls = [new Ball(50, 125), new Ball(150, 375, 0)];
        this.walls = [new Wall(100, 50, 100, 200, false)];
    }

    draw(ctx) {
        if (global.hints) {
            drawArrow(ctx, 50, 125, -50, 125);
        }
    }
}

class Level05 extends Level {
    backgroundColor = "#FEC0AA";
    cssBackgroundColor = "#84732B";
    cssButtonColor = "#EC4E20";
    cssButtonShadowColor = "#574F2A";
    number=5;

    constructor() {
        super();
        this.holes = [new Hole(400, 125), new Hole(350, 375)];
        this.balls = [new Ball(200, 125), new Ball(250, 375, 0)];
        this.walls = [
            new Wall(25, 0, 25, 500, false),
            new Wall(475, 0, 475, 500, false)
        ];
    }

    draw(ctx) {
        if (global.hints) {
            drawRect(ctx, 100, 75, 20, 100);
            drawArrow(ctx, 200, 125, 55, 125);
        }
    }
}

function drawRect(ctx, x, y, width, height, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.rect(0, 0, width, height);
    ctx.stroke();
    ctx.restore();
}

class Level06 extends Level {
    backgroundColor = "#F2F6D0";
    cssBackgroundColor = "#D9D2B6";
    cssButtonColor = "#D0E1D4";
    cssButtonShadowColor = "#71697A";
    number= 6;

    constructor() {
        super();
        const centerX = 250;
        const centerY = 250;
        const radius = 200;

        // Calculate holes (equilateral triangle pointing upwards)
        this.holes = [
            new Hole(centerX, centerY - radius), // Top vertex
            new Hole(centerX - radius * Math.cos(Math.PI / 6), centerY + radius * Math.sin(Math.PI / 6)), // Bottom left vertex
            new Hole(centerX + radius * Math.cos(Math.PI / 6), centerY + radius * Math.sin(Math.PI / 6))  // Bottom right vertex
        ];

        // Calculate balls (equilateral triangle pointing downwards)
        const ballPos = [
            {x: centerX, y: centerY + radius}, // Bottom vertex
            {x: centerX - radius * Math.cos(Math.PI / 6), y: centerY - radius * Math.sin(Math.PI / 6)}, // Top left vertex
            {x: centerX + radius * Math.cos(Math.PI / 6), y: centerY - radius * Math.sin(Math.PI / 6)},  // Top right vertex

        ];

        // Calculate the centroid of the triangle formed by the holes
        const centroidX = (ballPos[0].x + ballPos[1].x + ballPos[2].x) / 3;
        const centroidY = (ballPos[0].y + ballPos[1].y + ballPos[2].y) / 3;

        // Calculate the angles for the balls to point towards the centroid
        const angleToCentroid = (ballX, ballY) => {
            return Math.atan2(centroidY - ballY, centroidX - ballX);
        };

        this.balls = [
            new Ball(ballPos[0].x, ballPos[0].y, angleToCentroid(ballPos[0].x, ballPos[0].y) - Math.PI/2),
            new Ball(ballPos[1].x,ballPos[1].y, angleToCentroid(ballPos[1].x, ballPos[1].y) - Math.PI/2),
            new Ball(ballPos[2].x, ballPos[2].y, angleToCentroid(ballPos[2].x, ballPos[2].y) - Math.PI/2),

        ];

        this.walls = [
        ];
    }

    draw(ctx) {
        if (global.hints) {
            drawRect(ctx, this.balls[0].originalPos.x - 50 - WALL_WIDTH, 150, 20, 100, 0);
            drawRect(ctx, this.balls[0].originalPos.x + 50, 150, 20, 100, 0);
            drawArrow(ctx, this.balls[0].originalPos.x, this.balls[0].originalPos.y, this.balls[0].originalPos.x, 275);
        }
    }
}

class Level07 extends Level {
    backgroundColor = "#FAA275";
    cssBackgroundColor = "#CE6A85";
    cssButtonColor = "#FF8C61";
    cssButtonShadowColor = "#985277";
    number=7;

    constructor() {
        super();
        this.holes = [new Hole(150, 400), new Hole(250, 400), new Hole(350, 400)];
        this.balls = [new Ball(150, 150), new Ball(250, 200), new Ball(350, 250)];
        this.walls = [];
    }

    draw(ctx) {
        if (!global.hints) return;
        drawArrow(ctx, 150, 150, 150, 265);
        drawRect(ctx, 215, 440, 70, 20, 0);
        drawRect(ctx, 315, 460, 70, 20, 0);
    }
}

class Level08 extends Level {
    backgroundColor = "#BEEF9E";
    cssBackgroundColor = "#828C51";
    cssButtonColor = "#A6C36F";
    cssButtonShadowColor = "#335145";
    number= 8;

    constructor() {
        super();
        this.holes = [new Hole(250, 250, 25)];
        const d = 150;
        this.balls = [
            new Ball(250 + d, 250, 0),
            new Ball(250 + d * Math.cos(Math.PI), 250 + d * Math.sin(Math.PI), Math.PI),
        ];
    }

    draw(ctx) {
        if (!global.hints) return;
        const from = 250 + 150 * Math.cos(Math.PI);
        drawArrow(ctx, from, 250, from+60, 250);
    }
}

class Level09 extends Level {
    backgroundColor = "#CF9893";
    cssBackgroundColor = "#A96DA3";
    cssButtonColor = "#BC7C9C";
    cssButtonShadowColor = "#3B3B58";
    number= 9;

    constructor() {
        super();
        this.holes = [
            new Hole(250, 300),
            new Hole(200, 250)
        ];
        this.balls = [
            new Ball(250, 200, -Math.PI),
            new Ball(300, 250, -Math.PI/2),
        ];
        this.walls = [
            new Wall(200, 200, 300, 300, false),
            new Wall(300, 200, 200, 300, false),
        ];
    }

    draw(ctx) {
        if (!global.hints) return;
        drawRect(ctx, 260, 120, 100, 20, Math.PI/4);
        drawArrow(ctx, 250, 200, 200, 250);
        drawRect(ctx, 250 + 75, 225, 20, 75, 0);
        drawRect(ctx, 250 + 75/2, 325, 20, 75, Math.PI/2);
    }
}

class Level10 extends Level {
    backgroundColor = "#FFA9E7";
    cssBackgroundColor = "#7F2CCB";
    cssButtonColor = "#FF84E8";
    cssButtonShadowColor = "#414361";
    number= 10;

    constructor() {
        super();
        this.holes = [
            new Hole(200, 200),
            new Hole(400, 400)
        ];
        this.balls = [
            new Ball(250, 250, -Math.PI),
            new Ball(300, 300, -Math.PI/2),
        ];
        this.walls = [
            new Wall(100, 200, 200, 100, false),
        ];
    }

    draw(ctx) {
        if (!global.hints) return;
        drawArrow(ctx, 250, 250, 130, 130);
        drawRect(ctx, 310, 230, 20, 100, Math.PI/4);
        drawRect(ctx, 340, 200, 20, 100, -Math.PI/4);
        drawRect(ctx, 240, 325, 20, 100, 0);
        drawRect(ctx, 300, 440, 100, 20, 0);
    }
}

class Level11 extends Level {
    backgroundColor = "#93B5C6";
    cssBackgroundColor = "#F0CF65";
    cssButtonColor = "#D7816A";
    cssButtonShadowColor = "#BD4F6C";
    number = 11;

    constructor() {
        super();
        this.holes = [
            new Hole(100, 100),
            new Hole(250, 100),
            new Hole(400, 100)
        ];
        this.balls = [
            new Ball(250, 200, Math.PI),
            new Ball(175, 325, Math.PI/4),
            new Ball(325, 325, -Math.PI/4),

        ];
        this.walls = [
        ];
    }

    draw(ctx) {
        if (!global.hints) return;
        drawArrow(ctx, 250, 200, 250, 375);
        drawRect(ctx, 250 - 25 - WALL_WIDTH, 200, 20, 200, 0);
        drawRect(ctx, 250 + 25, 200, 20, 200, 0);

        drawRect(ctx, 450, 150, 20, 100, 0);
        drawRect(ctx, 400, 10, 20, 100, Math.PI/4);

        drawRect(ctx, 50 - WALL_WIDTH, 150, 20, 100, 0);
        drawRect(ctx, 100 - WALL_WIDTH, 10, 20, 100, -Math.PI/4);
    }
}

class Level12 extends Level {
    backgroundColor = "#524948";
    cssBackgroundColor = "#7CB4B8";
    cssButtonColor = "#70F8BA";
    cssButtonShadowColor = "#57467B";
    number = 12;

    constructor() {
        super();
        this.holes = [
            new Hole(200, 200),
            new Hole(300, 200),
        ];

        // const angle = Math.atan2(250 - 200, 400 - 300);
        this.balls = [
            new Ball(100, 250, Math.PI),
            new Ball(400, 250, 0, 8, true, -1),
        ];
        this.walls = [
            new Wall(125, 125, 175, 300, false),
            new Wall(375, 125, 325, 300, false),
            new Wall(125, 125, 175, 150, false),
            new Wall(375, 125, 325, 150, false),
            new Wall(175, 150, 325, 150,false),
            new Wall(175, 300, 325, 300,false),
            // now the cat smile
            new Wall(200, 250, 200, 275, false),
            new Wall(300, 250, 300, 275, false),
            new Wall(200, 275, 300, 275, false),

        ];
    }

    draw(ctx) {
        if (!global.hints) return;
        drawArrow(ctx, 100, 250, 200, 200);
        drawRect(ctx, 50, 200, 100, 20, 1.35);
        drawRect(ctx, 430, 300, 100, 20, -1.35);
    }
}

class Level13 extends Level {
    backgroundColor = "#6A8D73";
    cssBackgroundColor = "#E4FFE1";
    cssButtonColor = "#FFE8C2";
    cssButtonShadowColor = "#F0A868";
    number = 13;

    constructor() {
        super();
        this.holes = [
            new Hole(250, 250),
        ];
        this.balls = [
            new Ball(250, 100, Math.PI),
        ];

        let leftWallX1 = 175;
        let leftWallY1 = 150;
        let leftWallX2 = 175;
        let leftWallY2 = 350;
        let rightWallX1 = 325;
        let rightWallY1 = 150;
        let rightWallX2 = 325;
        let rightWallY2 = 350;
        let topWallX1 = 185;
        let topWallY1 = 160;
        let topWallX2 = 315;
        let topWallY2 = 160;
        let bottomWallX1 = 185;
        let bottomWallY1 = 340;
        let bottomWallX2 = 315;
        let bottomWallY2 = 340;

        const w1= new Wall(leftWallX1, leftWallY1, leftWallX2, leftWallY2, false);
        const w2= new Wall(rightWallX1, rightWallY1, rightWallX2, rightWallY2, false);
        const w3= new Wall(topWallX1, topWallY1, topWallX2, topWallY2, false);
        const w4 = new Wall(bottomWallX1, bottomWallY1, bottomWallX2, bottomWallY2, false);

        // this.walls = [];
        // this.levelWalls = [];
        this.walls = [w1, w2, w3, w4];
        this.levelWalls = [w1, w2, w3, w4];
    }

    update() {
        super.update();
        for (let i = 0; i < this.levelWalls.length; i++) {
            const wall = this.levelWalls[i];
            wall.rotate(.01, 250, 250);
        }
    }

}

export const generateLevels = () => [
    new Level01(),
    new Level02(),
    new Level03(),
    new Level04(),
    new Level05(),
    new Level06(),
    new Level07(),
    new Level08(),
    new Level09(),
    new Level10(),
    new Level11(),
    new Level12(),
    new Level13()
];


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return  result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

const CANVAS_WIDTH = 500;
function drawArrow(ctx, fromx, fromy, tox, toy) {
    drawSingleArrow(ctx, fromx, fromy, tox, toy);

    const xMagnitude = Math.abs(fromx - tox);
    const yMagnitude = Math.abs(fromy - toy);

    let mirrorXStart = fromx;
    let mirrorXEnd = tox;
    let mirrorYStart = fromy;
    let mirrorYEnd = toy;

    if (tox < 0) {
        mirrorXStart = fromx + CANVAS_WIDTH;
        mirrorXEnd = mirrorXStart - xMagnitude;
    }

    if (tox > CANVAS_WIDTH) {
        mirrorXStart = fromx - CANVAS_WIDTH;
        mirrorXEnd = mirrorXStart + xMagnitude;
    }

    if (toy < 0) {
        mirrorYStart = fromy + CANVAS_WIDTH;
        mirrorYEnd = mirrorYStart - yMagnitude;
    }

    if (toy > CANVAS_WIDTH) {
        mirrorYStart = fromy - CANVAS_WIDTH;
        mirrorYEnd = mirrorYStart + yMagnitude;
    }

    drawSingleArrow(ctx, mirrorXStart, mirrorYStart, mirrorXEnd, mirrorYEnd);

}

function drawSingleArrow(ctx, fromx, fromy, tox, toy) {
    const magnitude = Math.sqrt(Math.pow(tox - fromx, 2) + Math.pow(toy - fromy, 2));
    var headlen = Math.min(magnitude, 20);  // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);

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
    ctx.closePath();
    ctx.stroke();

    // Arrow shaft
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    // let x = tox - headlen / 2 * Math.cos(angle) - headlen * Math.cos(angle - Math.PI / 6) / 2
    let x = tox - headlen * Math.cos(angle);
    let y = toy - headlen * Math.sin(angle)

    // subtract off overshoot from arrowhead
    ctx.lineTo(x, y);


    ctx.stroke();


}