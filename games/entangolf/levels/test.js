import Level from "../level";
import Ball from "../ball";
import Wall, {wallFromWidthHeight} from "../wall";
import Hole from "../hole";

export default class extends Level {
    constructor(width, height) {
        super();

        let angle = 0;
        const numHoles = 5;
        let angleIncrement = Math.PI * 2 / numHoles;
        const levelCenter = {x: width / 2, y: height / 2};
        const holeDistance = width / 3;
        for (let i = 0; i < numHoles; i++) {
            const x = levelCenter.x + holeDistance * Math.cos(angle);
            const y = levelCenter.y + holeDistance * Math.sin(angle);
            angle += angleIncrement;
            this.holes.push(new Hole(x, y, 15));
        }

        const numBalls = 1;
        const ballDistance = width / 4;
        angle = 0;
        for (let i = 0; i < numBalls; i++) {
            const x = levelCenter.x + ballDistance * Math.cos(angle);
            const y = levelCenter.y + ballDistance * Math.sin(angle);
            angle += angleIncrement;
            this.balls.push(new Ball());
        }

        const numWalls = 10;
        const angleOffset = Math.PI / numWalls * 2;
        const wallDistance = 100;
        angle = 0
        for (let i = 0; i < numWalls; i++) {

            const wall = wallFromWidthHeight(
                levelCenter.x + Math.cos(angle) * wallDistance,
                levelCenter.y + Math.sin(angle) * wallDistance,
                25,
                10,
                angle
            );

            this.walls.push(wall);
            angle += angleOffset;
        }
    }
}