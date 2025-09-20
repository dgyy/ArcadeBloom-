const hexColors = [
    "#B4E7CE",  // Level 01 backgroundColor
    "#59A96A",  // Level 01 cssBackgroundColor
    "#9BDEAC",  // Level 01 cssButtonColor
    "#474A2C",  // Level 01 cssButtonShadowColor
    "#BB8A89",  // Level 02 backgroundColor
    "#977390",  // Level 02 cssBackgroundColor
    "#AC7B7D",  // Level 02 cssButtonColor
    "#785589",  // Level 02 cssButtonShadowColor
    "#F4F4F9",  // Level 03 backgroundColor
    "#586F7C",  // Level 03 cssBackgroundColor
    "#B8DBD9",  // Level 03 cssButtonColor
    "#2F4550",  // Level 03 cssButtonShadowColor
    "#AFB3F7",  // Level 04 backgroundColor
    "#7A93AC",  // Level 04 cssBackgroundColor
    "#92BCEA",  // Level 04 cssButtonColor
    "#617073",  // Level 04 cssButtonShadowColor
    "#FEC0AA",  // Level 05 backgroundColor
    "#84732B",  // Level 05 cssBackgroundColor
    "#EC4E20",  // Level 05 cssButtonColor
    "#574F2A",  // Level 05 cssButtonShadowColor
    "#F2F6D0",  // Level 06 backgroundColor
    "#D9D2B6",  // Level 06 cssBackgroundColor
    "#D0E1D4",  // Level 06 cssButtonColor
    "#71697A",  // Level 06 cssButtonShadowColor
    "#FAA275",  // Level 07 backgroundColor
    "#CE6A85",  // Level 07 cssBackgroundColor
    "#FF8C61",  // Level 07 cssButtonColor
    "#985277",  // Level 07 cssButtonShadowColor
    "#BEEF9E",  // Level 08 backgroundColor
    "#828C51",  // Level 08 cssBackgroundColor
    "#A6C36F",  // Level 08 cssButtonColor
    "#335145",  // Level 08 cssButtonShadowColor
    "#CF9893",  // Level 09 backgroundColor
    "#A96DA3",  // Level 09 cssBackgroundColor
    "#BC7C9C",  // Level 09 cssButtonColor
    "#3B3B58",  // Level 09 cssButtonShadowColor
    "#FFA9E7",  // Level 10 backgroundColor
    "#7F2CCB",  // Level 10 cssBackgroundColor
    "#FF84E8",  // Level 10 cssButtonColor
    "#414361",  // Level 10 cssButtonShadowColor
    "#93B5C6",  // Level 11 backgroundColor
    "#F0CF65",  // Level 11 cssBackgroundColor
    "#D7816A",  // Level 11 cssButtonColor
    "#BD4F6C",  // Level 11 cssButtonShadowColor
    "#524948",  // Level 12 backgroundColor
    "#7CB4B8",  // Level 12 cssBackgroundColor
    "#70F8BA",  // Level 12 cssButtonColor
    "#57467B",  // Level 12 cssButtonShadowColor
    "#6A8D73",  // Level 13 backgroundColor
    "#E4FFE1",  // Level 13 cssBackgroundColor
    "#FFE8C2",  // Level 13 cssButtonColor
    "#F0A868"   // Level 13 cssButtonShadowColor
];


class confettiParticle {
    constructor(x, y, radius, color, velx,vely) {
        this.pos = {x, y};
        this.vel = {x: velx, y: vely};
        this.radius = radius;
        this.color = color;
        this.tick = 0;
    }

}

const NUM_CONFETTI_PARTICLES = 100;
const CONFETTI_LIFETIME = 100
const CONFETTI_MAX_VELOCITY = 5;

export default class Hole {
    hole = null;

    constructor(x, y, radius = 15, color = "black") {
        this.pos = {x, y};
        this.radius = radius;
        this.color = color;
        this.particles = [];
        for (let i = 0; i < NUM_CONFETTI_PARTICLES; i++) {
            const velocity = Math.floor(Math.random() * CONFETTI_MAX_VELOCITY + 1) - CONFETTI_MAX_VELOCITY;
            const particleColor = hexColors[Math.floor(Math.random() * hexColors.length)];
            const particle = new confettiParticle(x, y, 5, particleColor, velocity * Math.cos(Math.random() * Math.PI * 2),
            velocity * Math.sin(Math.random() * Math.PI * 2));
            particle.tick = Math.floor(Math.random() * CONFETTI_LIFETIME);
            this.particles.push(particle);
        }
    }

    emitParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.pos.x += particle.vel.x;
            particle.pos.y += particle.vel.y;
            particle.vel.y += 0.1;
            particle.tick++;

            if (particle.tick > CONFETTI_LIFETIME) {
                particle.pos.x = this.pos.x;
                particle.pos.y = this.pos.y;
                particle.tick = 0;
                const velocity = Math.floor(Math.random() * CONFETTI_MAX_VELOCITY + 1) - CONFETTI_MAX_VELOCITY;
                particle.vel.x = velocity * Math.cos(Math.random() * Math.PI * 2);
                particle.vel.y = velocity * Math.sin(Math.random() * Math.PI * 2);
            }
        }
    }

    drawParticles(ctx) {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            ctx.beginPath();
            ctx.arc(particle.pos.x, particle.pos.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        }
    }
}

