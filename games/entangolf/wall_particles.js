import { WALL_WIDTH } from "./wall.js";

const PARTICLE_LIFE = 100;
const PARTICLE_FADE_LIFE = 75;

export class WallParticles {
    constructor (v1,v2, color) {
        this.v1 = v1;
        this.v2 = v2;
        this.color = color
        this.particles = [];

        this.generateParticles();
    }

    generateParticles () {

        const {v1, v2, color } = this;
        const angle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
        const length = Math.hypot(v2.x - v1.x, v2.y - v1.y);
        for (let i = 0; i < Math.ceil(length/WALL_WIDTH); i++) {
            const x = v1.x + Math.cos(angle) * i * WALL_WIDTH;
            const y = v1.y + Math.sin(angle) * i * WALL_WIDTH;
            this.particles.push(new Particle(x, y, color, angle));
        }
        this.angle = angle;
    }

    reset() {
        this.particles = [];
        this.generateParticles();
    }

    update () {
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].life <= 0) continue;
            this.particles[i].update();
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].life <= 0) continue;
            this.particles[i].draw(ctx);
        }
    }
}

class Particle {
    constructor (x, y, color,angle) {
        this.color = color;
        this.pos = {x, y};
        this.vel = {x: 0, y: 0};
        this.color = color;
        this.life = PARTICLE_LIFE;
        this.angle = angle;
    }

    update () {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.life--;
    }

    draw (ctx) {
        if (this.left < 0) return;

        // ctx.save();
        // ctx.translate(this.pos.x, this.pos.y);
        // ctx.rotate(this.angle);


        if (this.life < PARTICLE_FADE_LIFE) {
            ctx.fillStyle = `rgba(${this.color}, ${this.life/PARTICLE_FADE_LIFE})`;
        } else {
            ctx.fillStyle = `rgba(${this.color}, 1)`;
        }
        ctx.beginPath();
        // ctx.rect(WALL_WIDTH/2, 0, WALL_WIDTH, WALL_WIDTH);
        ctx.rect(this.pos.x - WALL_WIDTH/2, this.pos.y, WALL_WIDTH, WALL_WIDTH);
        ctx.fill();
        ctx.closePath();
        // ctx.restore();
    }
}