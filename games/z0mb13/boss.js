import { vec2, drawRect, drawLine, hsl } from './libs/littlejs.esm.min.js';
import { Zombie, gameState } from './zombie.js'; // Importing the base Zombie class and game state
import { player, gameSettings } from './main.js'; // Import gameSettings from main.js
import { makeFire, makeBlood } from './effects.js'; // Import fire effect utility
import { lerp } from './player.js'; // Import linear interpolation utility

export class BossZombie extends Zombie {
    constructor(pos) {
        super(pos);
        this.bloodEffectActive = false; // Flag to track blood effect per boss
        this.numLegs = 6;
        this.legLength = 1.5;
        this.legs = [];
        this.legSpeed = 0.09;
        this.bodySize = 1.2;
        this.speed = 0.009;
        this.maxHealth = 100;
        this.finalBloodEmitted = false; // Flag to track the final blood emission
        this.health = this.maxHealth;
        this.healthBarWidth = 1.5;
        this.healthBarHeight = 0.3;
        this.fadeOutTimer = 4;
        this.isFadingOut = false;
        this.onFire = false; // Flag to check if BossZombie is on fire
        this.fireEmitter = null; // To handle the fire effect
        this.fireSpreadTimer = 2; // Timer for fire spread
        this.fireDuration = 5; // Total time the boss will stay on fire (in seconds)
        this.initializeLegs();
    }

    // Override method to handle explosion damage
    takeExplosionDamage() {
        this.takeHit(20); // Instead of dying, the BossZombie takes damage
    }
    // Method to trigger the final blood emission when the boss dies
    triggerFinalBlood() {
        if (!this.finalBloodEmitted) {
            this.finalBloodEmitted = true; // Ensure the final blood is emitted only once
            const finalBloodEmitter = makeBlood(this.pos, 200); // Emit a larger amount of blood for dramatic effect

            // Stop final blood animation after 3 seconds
            setTimeout(() => {
                finalBloodEmitter.emitRate = 0;
            }, 3000);
        }
    }
    initializeLegs() {
        const angleToPlayer = Math.atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
        const totalSpreadAngle = Math.PI; // Total spread angle for all legs around the body (180 degrees)
        const angleBetweenLegs = totalSpreadAngle / (this.numLegs - 1); // Angle between each leg

        for (let i = 0; i < this.numLegs; i++) {
            const legAngle = angleToPlayer - totalSpreadAngle / 2 + i * angleBetweenLegs;

            this.legs.push({
                baseAngle: legAngle, // Start angle for symmetry
                angle: legAngle,
                targetX: this.pos.x + Math.cos(legAngle) * this.legLength,
                targetY: this.pos.y + Math.sin(legAngle) * this.legLength,
                currentLength: this.legLength,
                speed: 0.05, // Random speed for natural movement
                stepProgress: 0,
                stepping: false,
            });
        }
    }

    update() {
        super.update();
        if (this.isDead || gameState.gameOver) return;

        if (this.onFire) {
            this.handleFireState(); // Handle fire logic if the BossZombie is on fire
        } else {
            // Update body position toward the player
            const direction = player.pos.subtract(this.pos).normalize();
            this.pos = this.pos.add(direction.scale(this.speed));
        }

        // Update leg positions for realistic gait
        this.updateLegs();
    }

    takeHit(damage) {
        // Reduce health by the damage amount
        this.health -= damage;

        // Ensure health does not go below zero
        if (this.health < 0) {
            this.health = 0;
        }

        // Check if health falls to zero and handle death logic
        if (this.health === 0 && !this.isDead) {
            this.onDeath(); // Trigger death logic
        } 
    }

    onDeath() {
        // Set the state to dead and trigger any death animations or effects
        this.isDead = true;
        this.triggerFinalBlood(); // Trigger final blood emission on death
        this.isFadingOut = true;

        // Freeze legs positions
        this.legs.forEach(leg => {
            leg.stepping = false; // Stop legs from stepping
        });

        if (this.fireEmitter) {
            this.fireEmitter.emitRate = 0; // Stop fire effects when dead
        }
    }

    catchFire() {
        if (!this.onFire && !this.isDead) { // Only catch fire if not already on fire and not dead
            this.onFire = true;
            this.fireEmitter = makeFire(this.pos); // Start the fire effect immediately
            this.fireSpreadTimer = 2; // Fire spread timer set for 2 seconds
            this.fireDuration = 5; // Reset fire duration timer
        }
    }

    handleFireState() {
        if (this.fireSpreadTimer > 0) {
            this.fireSpreadTimer -= 1 / 60;  // Decrement the fire spread timer each frame
            this.spreadFire(); // Spread fire if the fire spread timer is active
        }

        // Reduce fire duration timer each frame
        if (this.fireDuration > 0) {
            this.fireDuration -= 1 / 60; // Decrease fire duration

            // Take periodic damage while on fire
            if (!this.isDead) {
                this.takeHit(0.09);
            }
        } else {
            // Extinguish the fire when the duration is over
            this.extinguishFire();
        }
    }

    extinguishFire() {
        if (this.onFire) {
            this.onFire = false; // Turn off fire state
            if (this.fireEmitter) {
                this.fireEmitter.emitRate = 0; // Stop the fire effect
            }
        }
    }

    spreadFire() {
        // Spread fire to nearby zombies if they are close enough
        gameSettings.zombies.forEach(otherZombie => {
            if (otherZombie !== this && !otherZombie.isDead && !otherZombie.onFire) {
                if (this.pos.distance(otherZombie.pos) < 1) { // Check proximity
                    otherZombie.catchFire(); // Set nearby zombie on fire
                }
            }
        });
    }

    updateLegs() {
        if (this.isDead) return;
    
        const angleToPlayer = Math.atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
        const totalSpreadAngle = Math.PI;
        const angleBetweenLegs = totalSpreadAngle / (this.numLegs - 1);
    
        this.legs.forEach((leg, i) => {
            leg.baseAngle = angleToPlayer - totalSpreadAngle / 2 + i * angleBetweenLegs;
    
            if (!leg.stepping) {
                const [dx, dy] = [leg.targetX - (this.pos.x + Math.cos(leg.angle) * leg.currentLength), leg.targetY - (this.pos.y + Math.sin(leg.angle) * leg.currentLength)];
                if (Math.hypot(dx, dy) > this.legLength / 2) {
                    leg.stepping = true;
                    leg.stepProgress = 0;
                }
            }
    
            if (leg.stepping) {
                leg.stepProgress = Math.min(1, leg.stepProgress + 0.1);
                if (leg.stepProgress === 1) leg.stepping = false;
    
                const stepX = this.pos.x + Math.cos(leg.baseAngle) * this.legLength;
                const stepY = this.pos.y + Math.sin(leg.baseAngle) * this.legLength;
                const stepHeight = 0.2;
                leg.targetX = lerp(leg.targetX, stepX, leg.stepProgress);
                leg.targetY = lerp(leg.targetY, stepY - Math.sin(leg.stepProgress * Math.PI) * stepHeight, leg.stepProgress);
            }
    
            const [dx, dy] = [leg.targetX - this.pos.x, leg.targetY - this.pos.y];
            leg.currentLength = Math.min(this.legLength, Math.hypot(dx, dy));
            leg.angle = Math.atan2(dy, dx);
        });
    }

    render() {
        if (this.isDead && this.fadeOutTimer <= 0) {
            return; // Stop rendering if the zombie is dead and fully faded out
        }
        let bodyColor = hsl(0.6, 1, 0.5); // Normal color when alive
        let legColor = hsl(0.6, 1, 0.5); // Normal leg color
        let opacity = 1;

        if (this.isDead) {
            bodyColor = hsl(0, 0, 0.2, opacity);
            legColor = hsl(0, 0, 0.2, opacity);

            if (this.isFadingOut) {
                opacity = this.fadeOutTimer / 4;
                bodyColor = hsl(0, 0, 0.2, opacity);
                legColor = hsl(0, 0, 0.2, opacity);
                this.fadeOutTimer -= 1 / 60;

                if (this.fadeOutTimer <= 0) {
                    opacity = 0;
                    this.isFadingOut = false;
                }
            }
        } else if (this.onFire) {
            bodyColor = hsl(0.1, 1, 0.5, opacity); // Burning color
            legColor = hsl(0.1, 1, 0.5, opacity); // Burning color for legs
        }

        drawRect(this.pos, vec2(this.bodySize), bodyColor);

        if (!this.isDead) {
            this.renderHealthBar();
        }

        this.legs.forEach(leg => {
            const endX = this.pos.x + Math.cos(leg.angle) * leg.currentLength;
            const endY = this.pos.y + Math.sin(leg.angle) * leg.currentLength;
            drawLine(this.pos, vec2(endX, endY), 0.1, legColor);
        });
    }

    renderHealthBar() {
        const healthBarPos = this.pos.add(vec2(-this.healthBarWidth / 2 + .72, this.bodySize));
        const healthPercent = this.health / this.maxHealth;

        drawRect(
            healthBarPos,
            vec2(this.healthBarWidth, this.healthBarHeight),
            hsl(0, 1, 0.5) // Red color for lost health
        );

        const greenWidth = this.healthBarWidth * healthPercent;
        const greenPos = healthBarPos.add(vec2(greenWidth / 2 - this.healthBarWidth / 2, 0));

        drawRect(
            greenPos,
            vec2(greenWidth, this.healthBarHeight),
            hsl(0.3, 1, 0.5) // Green color for current health
        );
    }
}