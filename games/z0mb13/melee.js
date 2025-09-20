export class Melee {
    constructor(player) {
        this.player = player;
        this.swingRange = 1.5;
        this.swingDamage = 1;
        this.swingDuration = 1500;
        this.swingCooldown = 500;
        this.lastSwingTime = 0;
        this.isSwinging = false;
    }

    attack() {
        if (this.isSwinging || performance.now() - this.lastSwingTime < this.swingCooldown) return;
        this.isSwinging = true;
        this.lastSwingTime = performance.now();
        setTimeout(() => this.isSwinging = false, this.swingDuration);
    }

    getSwingState() {
        return this.isSwinging;
    }
}