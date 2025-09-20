import { vec2, mainCanvas, drawRect, hsl, cameraScale } from './libs/littlejs.esm.min.js';
import { gameSettings } from './main.js';
import { sound_hit, sound_fire } from './sound.js';
import { makeBlood } from './effects.js';
import { setGameOver } from './zombie.js';
import { BossZombie } from './boss.js';

let scorecnt = 0; // Private variable for score

// Getter for score
export function getScore() {
    return scorecnt;
}

// Setter for score
export function setScore(value) {
    scorecnt = value;
}

// Function to increment score
export function incrementScore() {
    setScore(getScore() + 1 * 5); // Increment score by 1 * 5
}

let currency = 0; // Use a private variable to store the currency

export function getCurrency() {
    return currency;
}

export function setCurrency(value) {
    currency = value;
}

// Increment currency but never allow the cursed number for some reason
export function addCurrency(amount) {
    const currentCurrency = getCurrency();
    const newCurrency = currentCurrency + amount;
    setCurrency(newCurrency);
}

export class Bullet {
    constructor(pos, direction, fireAbility) {
        this.pos = pos;
        this.direction = direction.normalize(); // Normalize the direction to ensure it's a unit vector
        this.speed = 0.5;
        this.fireAbility = fireAbility;
    }

    update() {
        if (setGameOver(false)) return; // Assuming setGameOver() also returns the current gameOver state


        // Move bullet in the calculated direction
        this.pos = this.pos.add(this.direction.scale(this.speed));

        // Check collision with zombies
        for (let i = 0; i < gameSettings.zombies.length; i++) {
            const zombie = gameSettings.zombies[i];

            // Allow hits to register on BossZombie even when it is on fire
            if (zombie instanceof BossZombie) {
                if (!zombie.isDead && this.pos.distance(zombie.pos) < 1) {
                    if (this.fireAbility && !zombie.onFire) {
                        zombie.catchFire(); // Set zombie on fire and play fire effect
                        sound_fire.play(this.pos);
                    } else {
                        zombie.takeHit(10); // Apply damage (e.g., 10 points of damage)

                        if (zombie.isDead) {
                            // If BossZombie's health reaches zero after the hit
                            incrementScore(); // Increment score when the BossZombie dies
                            addCurrency(5); // Increase currency using the setter when the BossZombie dies
                        }
                    }

                    zombie.deathTimer = 3; // Set death timer to 3 seconds

                    // Play hit sound
                    sound_hit.play(this.pos);

                    // Create blood effect only if it's not already active for this specific boss
                    if (!zombie.bloodEffectActive) {
                        zombie.bloodEffectActive = true;
                        const bloodEmitter = makeBlood(this.pos);

                        // Stop blood animation after 3 seconds and reset flag for this boss
                        setTimeout(() => {
                            bloodEmitter.emitRate = 0;
                            zombie.bloodEffectActive = false; // Allow new blood effects after the current one finishes
                        }, 3000);
                    }

                    // Remove bullet
                    gameSettings.bullets.splice(gameSettings.bullets.indexOf(this), 1);
                    return;
                }
            } else if (!zombie.isDead && !zombie.onFire && this.pos.distance(zombie.pos) < 1) {
                // For regular zombies, check if they are not on fire and handle hits
                if (this.fireAbility) {
                    zombie.catchFire(); // Set zombie on fire and play fire effect
                    sound_fire.play(this.pos);
                } else {
                    zombie.isDead = true;
                    incrementScore(); // Increment the score using the function
                    addCurrency(1); // Increase currency using the setter
                }

                zombie.deathTimer = 3; // Set death timer to 3 seconds

                // Play hit sound
                sound_hit.play(this.pos);

                // Create blood effect for normal zombies without any special conditions
                const bloodEmitter = makeBlood(this.pos);

                // Stop blood animation after 3 seconds
                setTimeout(() => {
                    bloodEmitter.emitRate = 0;
                }, 3000);

                // Remove bullet
                gameSettings.bullets.splice(gameSettings.bullets.indexOf(this), 1);
                return;
            }
        }

        // Remove bullet if it goes off-screen
        if (!this.isOnScreen()) {
            gameSettings.bullets.splice(gameSettings.bullets.indexOf(this), 1);
        }
    }

    isOnScreen() {
        const halfCanvasWidth = (mainCanvas.width / 2) / cameraScale;
        const halfCanvasHeight = (mainCanvas.height / 2) / cameraScale;

        return this.pos.x >= -halfCanvasWidth && this.pos.x <= halfCanvasWidth &&
            this.pos.y >= -halfCanvasHeight && this.pos.y <= halfCanvasHeight;
    }

    render() {
        // Adjust bullet color based on abilities
        let bulletColor;
        if (this.fireAbility) {
            bulletColor = hsl(0, 1, 0.5); // Red color for fire bullets
        } else {
            bulletColor = hsl(0.05, 0.8, 0.4); // Red-brown color for normal bullets
        }

        drawRect(this.pos, vec2(0.5, 0.5), bulletColor);
    }
}