import { WallParticles} from "./wall_particles.js";

export const WALL_WIDTH = 20;
const LEVEL_WALL_COLOR = '0,0,0';
const PLAYER_WALL_COLOR = '255,255,255';
const HANDLE_RADIUS = 4;
const HANDLE_BUMPER = HANDLE_RADIUS / 2;
const CLICK_RADIUS = 15;

export default class Wall {

    constructor(x1, y1, x2, y2, player = true, wall = true) {
        this.width = WALL_WIDTH; // todo remove
        this.pos = {x: 0, y: 0};
        this.v1 = {x: 0, y: 0};
        this.v2 = {x: 0, y: 0};
        this.handle1 = {x: 0, y: 0};
        this.handle2 = {x: 0, y: 0};
        this.broken = false;
        this.player = player;
        if (player) {
            this.color = PLAYER_WALL_COLOR;
        } else {
            this.color = LEVEL_WALL_COLOR;
        }
        this.setVertices(x1, y1, x2, y2);
        this.emitter = new WallParticles(this.v1, this.v2, this.color);
    }

    setVertices(x1, y1, x2, y2) {
        this.v1.x = x1;
        this.v1.y = y1;
        this.v2.x = x2;
        this.v2.y = y2;

        const {v1, v2} = this;
        this.pos.x = (v1.x + v2.x) / 2;
        this.pos.y = (v1.y + v2.y) / 2;
        this.angle = Math.atan2(v2.y - v1.y, v2.x - v1.x) - Math.PI / 2;
        this.vertices = this.generateQuadVertices(v1, v2, this.width);
        this.normals = this.calculateNormals();
        const offsetX = Math.sin(this.angle) * (HANDLE_RADIUS + HANDLE_BUMPER);
        const offsetY = -Math.cos(this.angle) * (HANDLE_RADIUS + HANDLE_BUMPER);
        this.handle1.x = this.v1.x - offsetX;
        this.handle1.y = this.v1.y - offsetY;
        this.handle2.x = this.v2.x + offsetX;
        this.handle2.y = this.v2.y + offsetY;
    }

    update() {
        if (!this.broken) return;
        this.emitter.update();
    }

    rotate(angle, cx, cy) {
        const x1 = this.v1.x;
        const y1 = this.v1.y;
        const x2 = this.v2.x;
        const y2 = this.v2.y;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x1r = cos * (x1 - cx) - sin * (y1 - cy) + cx;
        const y1r = sin * (x1 - cx) + cos * (y1 - cy) + cy;
        const x2r = cos * (x2 - cx) - sin * (y2 - cy) + cx;
        const y2r = sin * (x2 - cx) + cos * (y2 - cy) + cy;
        this.setVertices(x1r, y1r, x2r, y2r);
    }

    setParticles() {
        // this.emitter = new WallParticles(this.v1, this.v2, this.color);
    }

    reset() {
        this.broken = false;
        this.emitter.reset();
    }

    collided(speed) {
        this.broken = true;
        this.emitter = new WallParticles(this.v1, this.v2, this.color);
        this.emitter.particles.forEach(particle => {
            const angle = Math.random() * Math.PI * 2;
            particle.vel.x = speed * (Math.random() * 2 - 1) * Math.cos(angle);
            particle.vel.y = speed * (Math.random() * 2 - 1) * Math.sin(angle);
        });
    }

    generateQuadVertices(p1, p2, width) {
        const h = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
        const cx = width / 2; // Center x
        const cy = h / 2; // Center y
        const rad = this.angle; // Angle in radians

        // Define the vertices of the wall relative to the center, counter clockwise
        let vertices = [
            {x: -cx, y: -cy},
            {x: -cx, y: cy},
            {x: cx, y: cy},
            {x: cx, y: -cy},
        ];

        // Rotate each vertex
        return vertices.map(vertex => {
            return {
                x: this.pos.x + (vertex.x * Math.cos(rad) - vertex.y * Math.sin(rad)),
                y: this.pos.y + (vertex.x * Math.sin(rad) + vertex.y * Math.cos(rad))
            };
        });
    }

    calculateNormals() {
        const normals = [];
        const vertices = this.vertices;
        const length = vertices.length;
        for (let i = 0; i < length; i++) {
            const nextIndex = (i + 1) % length;
            const dx = vertices[nextIndex].x - vertices[i].x;
            const dy = vertices[nextIndex].y - vertices[i].y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const normal = {
                x: -dy / len,
                y: dx / len,
            };

            normals.push(normal);
        }

        return normals;

    };

    project(axis) {
        let min = Number.POSITIVE_INFINITY;
        let max = -Number.POSITIVE_INFINITY;

        for (let i = 0; i < this.vertices.length; i++) {
            let projection = this.vertices[i].x * axis.x + this.vertices[i].y * axis.y;
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }

        return {min, max};
    }

    isPointInsideCircle(x, y, px, py, radius) {
        const dx = x - px;
        const dy = y - py;
        const distanceSquared = dx * dx + dy * dy;
        return distanceSquared <= radius * radius;
    }

    isPointInside(x, y) {
        // if (!this.player) return false;
        return this.isPointInsidePolygon(x, y);
    }

    isPointInsidePolygon(x, y) {
        let inside = false;
        const vertices = this.vertices;
        const length = vertices.length;
        for (let i = 0, j = length - 1; i < length; j = i++) {
            const xi = vertices[i].x;
            const yi = vertices[i].y;
            const xj = vertices[j].x;
            const yj = vertices[j].y;
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    pointInHandle(x, y) {
        if (this.pointInHandle1(x, y)) {
            return this.v1;
        } else if (this.pointInHandle2(x, y)) {
            return this.v2;
        } else {
            return null;
        }
    }

    pointInHandle1(x, y) {
        return this.isPointInsideCircle(x, y, this.handle1.x, this.handle1.y, CLICK_RADIUS);
    }

    pointInHandle2(x, y) {
        return this.isPointInsideCircle(x, y, this.handle2.x, this.handle2.y, CLICK_RADIUS);
    }

    pointInCloseButton(x, y) {
        if (!this.player) return null;
        return this.isPointInsideCircle(x, y, this.pos.x, this.pos.y, CLICK_RADIUS);
    }

    draw(ctx) {
        if (this.broken) {
            this.emitter.draw(ctx);
        } else {
            this.drawWall(ctx);
        }
    }

    drawWall(ctx) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(${this.color}, 1.0)`;
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2;

        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath(); // Complete the path by drawing a line to the starting point
        ctx.fill(); // Fill the path with the current fillStyle
        ctx.stroke();

        if (this.color === PLAYER_WALL_COLOR) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.moveTo(this.pos.x - 5, this.pos.y - 5);
            ctx.lineTo(this.pos.x + 5, this.pos.y + 5);
            ctx.moveTo(this.pos.x - 5, this.pos.y + 5);
            ctx.lineTo(this.pos.x + 5, this.pos.y - 5);
            ctx.stroke();
            ctx.closePath();

            // draw circles at the top and the bottom of the wall
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 0, 0, 1.0)';

            ctx.arc(this.handle1.x, this.handle1.y, HANDLE_RADIUS, 0, 2 * Math.PI);
            ctx.arc(this.handle2.x, this.handle2.y, HANDLE_RADIUS, 0, 2 * Math.PI);

            ctx.fill();
        }
    }
}

export function wallFromWidthHeight(x, y, width, height, angle) {
    const v1 = {
        x: x - Math.cos(angle) * height / 2,
        y: y - Math.sin(angle) * height / 2
    }

    const v2 = {
        x: x + Math.cos(angle) * height / 2,
        y: y + Math.sin(angle) * height / 2
    }


    return new Wall(v1, v2);
}
