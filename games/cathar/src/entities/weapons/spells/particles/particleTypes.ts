class ParticleType{
    color: string
    speed: number
    damage: number
    lifetime: number
    constructor(color: string, speed: number, damage: number, lifetime: number) {
        this.color = color;
        this.speed = speed;
        this.damage = damage;
        this.lifetime = lifetime;
    }
}

const blueParticleType = new ParticleType("#b5dedd", 0.4, 4, 90);
const yellowParticleType = new ParticleType("#ffffcc", 1.0, 5, 150);

const orangeParticleType = new ParticleType("#ecb653", 0.6, 2, 130);

const redParticleType = new ParticleType("#dd2222", 0.7, 10, 60);

const spawnParticleType = new ParticleType("#55ff55", 0, 0, 90);

export {ParticleType, yellowParticleType, blueParticleType, spawnParticleType, orangeParticleType, redParticleType}