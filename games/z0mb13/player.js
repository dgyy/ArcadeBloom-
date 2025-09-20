import { keyIsDown, mouseIsDown, mousePos, vec2, drawRect, drawLine, hsl, cameraScale, isTouchDevice } from './libs/littlejs.esm.min.js';
import { gameSettings } from './main.js';
import { Bullet } from './bullet.js';
import { sound_shoot, sound_reload, sound_swing } from './sound.js';
import { setGameOver, Boomer, gameState } from './zombie.js';
import { isInShop } from './shop.js';
import { makeWalkingDust } from './effects.js';
import { Melee } from './melee.js'; // Import Melee class for melee handling
import { StickStatus, StickStatus2 } from './libs/joystick.js';
// Linear interpolation function
export function lerp(start, end, t) {
    return start + (end - start) * t;
}
export class Player {
    constructor(pos) {
        this.pos = pos;
        this.weapon = 'Bat'; // Default weapon set to Baseball Bat
        this.items = ['Bat']; // Initialize with default item
        this.usingBat = true; // Track whether the player is using the bat
        this.fireAbility = false;
        this.isAutomatic = false; // No automatic fire for melee weapon
        this.lastShootTime = 0; // Last time the player shot
        this.shootDelay = 100;
        this.pistolChamberDelay = 300; // 300ms delay between shots for Pistol
        this.shotgunChamberDelay = 400; // 400ms delay between shots for Shotgun 
        this.machineGunShootDelay = 160; // SMG specific shoot delay
        this.canShoot = true; // Flag to check if the player can shoot again
        this.wasMouseDown = false; // Track if the mouse was down in the previous frame
        this.amN = 6; // Set initial magazine size from config (AmmoN)
        this.currentAmmo = this.amN;
        this.isReloading = false; // Track if the player is currently reloading
        this.reloadTime = 1000; // Total reload time in milliseconds
        this.reloadProgress = 0; // Progress of reload animation (0 to 1)
        this.reloadAnimationDuration = 1; // Duration of the reload animation in seconds
        this.isMoving = false;
        this.isSwinging = false; // Track melee swing
        this.swingDuration = 1000; // Duration of a melee swing in milliseconds
        this.lastSwingTime = 0; // Last time the player performed a swing
        this.swingProgress = 0; // Progress of the current swing
        this.swingDirection = 1; // Swing direction: 1 for right, -1 for left
        this.melee = new Melee(this); // Initialize Melee instance
        this.lastAngle = 0; // Store the last angle
    }

    update() {
        if (setGameOver(false) || isInShop()) return;
    
        const currentTime = performance.now();
        const moveSpeed = 0.1;
        let moved = false;
    
        // First joystick controls movement (StickStatus)
        const joystickX = StickStatus.x / 100;  // Normalize joystick value (-1 to 1)
        const joystickY = StickStatus.y / 100;  // Normalize joystick value (-1 to 1)
    
        if (Math.abs(joystickX) > 0.1 || Math.abs(joystickY) > 0.1) {  // Threshold to avoid minor movements
            this.pos.x += joystickX * moveSpeed;
            this.pos.y += joystickY * moveSpeed; 
            moved = true;
        }
    
        // Keyboard controls for movement (optional)
        if (keyIsDown('ArrowLeft')) {
            this.pos.x -= moveSpeed;
            moved = true;
        }
        if (keyIsDown('ArrowRight')) {
            this.pos.x += moveSpeed;
            moved = true;
        }
        if (keyIsDown('ArrowUp')) {
            this.pos.y += moveSpeed;
            moved = true;
        }
        if (keyIsDown('ArrowDown')) {
            this.pos.y -= moveSpeed;
            moved = true;
        }
    
        this.isMoving = moved;
    
        // Handle melee attack
        if (this.weapon === 'Bat' && !this.isSwinging) {
            if (isTouchDevice) {
                const rightStickMoved = parseFloat(StickStatus2.x) !== 0 || parseFloat(StickStatus2.y) !== 0;
                if (rightStickMoved) {
                    this.meleeAttack();
                    setTimeout(() => { sound_swing.play(this.pos); }, 700);
                }
            } else {
                if (mouseIsDown(0)) {
                    this.meleeAttack();
                    setTimeout(() => { sound_swing.play(this.pos); }, 700);
                }
            }
        }
    
        // Handle swinging state and duration
        if (this.isSwinging) {
            this.swingProgress = (currentTime - this.lastSwingTime) / this.swingDuration;
            if (this.swingProgress >= 1) {
                this.isSwinging = false;
                this.swingProgress = 0;
            }
        }

    
        if (this.isReloading) {
            this.reloadProgress += 1000 / 60 / this.reloadTime;
            if (this.reloadProgress >= 1) {
                this.reloadProgress = 0;
                this.isReloading = false;
                this.currentAmmo = this.amN;
            }
        }
    
        // Fire logic for touch devices with joystick
        const rightStickMoved = parseFloat(StickStatus2.x) !== 0 || parseFloat(StickStatus2.y) !== 0;
        if (rightStickMoved && !this.isReloading && this.canShoot) {
            if (this.weapon === 'SMG' && currentTime - this.lastShootTime >= this.machineGunShootDelay) {

                this.shoot(); // Fire for SMG
                this.lastShootTime = currentTime;
            } else if (this.weapon === 'Shotgun' && currentTime - this.lastShootTime >= this.shotgunChamberDelay) {
                this.shoot(); // Fire for Shotgun
                this.lastShootTime = currentTime;
            } else if (this.weapon === 'Pistol' && currentTime - this.lastShootTime >= this.pistolChamberDelay) {
                this.shoot(); // Fire for Pistol
                this.lastShootTime = currentTime;
            }
        }
    
        // Fire logic for non-touch devices
        if (!isTouchDevice && mouseIsDown(0)) {
            if (this.weapon === 'SMG') {
                
                // Automatic firing for the SMG
                if (currentTime - this.lastShootTime >= this.machineGunShootDelay) {
                    this.shoot(); // Fire for SMG
                    this.lastShootTime = currentTime;
                }
            } else if (this.weapon === 'Shotgun') {
                // Shotgun fires once per mouse click
                if (!this.wasMouseDown && currentTime - this.lastShootTime >= this.shotgunChamberDelay) {
                    this.shoot(); // Fire for Shotgun
                    this.lastShootTime = currentTime;
                }
            } else if (this.weapon === 'Pistol') {
                // Pistol fires once per mouse click
                if (!this.wasMouseDown && currentTime - this.lastShootTime >= this.pistolChamberDelay) {
                    this.shoot(); // Fire for Pistol
                    this.lastShootTime = currentTime;
                }
            }
        }
    
        // Reset shooting flag when the mouse is released
        if (!mouseIsDown(0)) {
            this.canShoot = true; // Reset shooting state when mouse is released
        }
    
        // Track whether the mouse was down in the last frame
        this.wasMouseDown = mouseIsDown(0);
    
        // Constrain player within the window size
        const canvasWidth = gameSettings.mapCanvas.width;
        const canvasHeight = gameSettings.mapCanvas.height;
        const halfVisibleWidth = (canvasWidth / 2) / cameraScale;
        const halfVisibleHeight = (canvasHeight / 2) / cameraScale;
        this.pos.x = Math.max(-halfVisibleWidth, Math.min(this.pos.x, halfVisibleWidth));
        this.pos.y = Math.max(-halfVisibleHeight, Math.min(this.pos.y, halfVisibleHeight));
    
        // Collision detection with zombies
        gameSettings.zombies.forEach(zombie => {
            if (!zombie.isDead && this.pos.distance(zombie.pos) < 1) {
                if (!zombie.onFire || (zombie.onFire && zombie.fireSpreadTimer > 0)) {
                    this.isMoving = false;
                    setGameOver(true);
                }
            }
        });
    
        const moveDirection = vec2(0, 0); // Initialize the move direction
        if (this.isMoving) {
            const offsetDistance = 0.4; // Distance to offset the particles behind the player
            const normalizedDirection = moveDirection.normalize().scale(-offsetDistance); // Calculate the offset position behind the player
            const particlePos = this.pos.add(normalizedDirection); // Calculate the position to emit particles
            setTimeout(() => {
                makeWalkingDust(particlePos); // Emit particles at the calculated position
            }, 100);
    
            this.lastMoveDirection = moveDirection; // Update last move direction
        }
    }



    meleeAttack() {
        this.isSwinging = true;
        this.lastSwingTime = performance.now();
        this.swingDirection = Math.random() > 0.5 ? 1 : -1; // Randomly choose swing direction

        // Check for zombies within range
        gameSettings.zombies.forEach(zombie => {
            const distanceToZombie = this.pos.distance(zombie.pos);
            if (distanceToZombie < this.melee.swingRange) { // Use swingRange from Melee class
                if (zombie instanceof Boomer) {
                    //console.log("Boomer hit by melee!"); // Debug message
                } else {
                    //console.log("Zombie hit by melee!"); // Debug message
                    zombie.deathTimer = 3;
                    zombie.kill(); // Generic kill for other zombie types
                    
                }
            }
        });

    }


    shoot() {
        if (isInShop() || this.isReloading || this.weapon == 'Bat' || (isTouchDevice && StickStatus2.x == 0 && StickStatus2.y == 0)) return;
    
        const currentTime = performance.now();
        const weaponDelay = this.getWeaponDelay();
    
        if (currentTime - this.lastShootTime < weaponDelay || this.currentAmmo === 0) {
            if (this.currentAmmo === 0) this.reload();
            return;
        }
    
        const { direction, barrelTip, muzzlePos } = this.getShootingInfo();
        const { numBullets, spread } = this.getWeaponSettings();
    
        for (let i = 0; i < numBullets; i++) {
            const spreadDirection = direction.rotate((Math.random() - 0.5) * spread);
            gameSettings.bullets.push(new Bullet(barrelTip, spreadDirection, this.fireAbility));
        }
    
        this.handlePostShoot(currentTime);
    }
    
    // Get delay based on the weapon type
    getWeaponDelay() {
        switch (this.weapon) {
            case 'Pistol': return this.pistolChamberDelay;
            case 'Shotgun': return this.shotgunChamberDelay;
            default: return this.shootDelay;
        }
    }
    
    // Get shooting direction, barrel tip position, and muzzle position
    getShootingInfo() {
        const direction = isTouchDevice
            ? vec2(StickStatus2.x / 100, StickStatus2.y / 100).normalize()
            : mousePos.subtract(this.pos).normalize();
    
        const barrelTip = this.pos.add(direction.scale(1.2));
        const muzzlePos = barrelTip.add(direction.scale(0.3));
    
        return { direction, barrelTip, muzzlePos };
    }
    
    // Get number of bullets and spread based on weapon type
    getWeaponSettings() {
        return this.weapon === 'Shotgun' ? { numBullets: 5, spread: 0.2 } : { numBullets: 1, spread: 0 };
    }
    
    
    // Handle the effects after shooting
    handlePostShoot(currentTime) {
        this.currentAmmo--;
        sound_shoot.play(this.pos);
    
        if (this.currentAmmo === 0) {
            this.reload();
        }
    
        this.lastShootTime = currentTime;
    }

    reload() {
        this.isReloading = true;
        sound_reload.play(this.pos);
        this.reloadProgress = 0;
    }


    
    render() {
        let angle;
        let angleDifference = 0;
        const smoothingFactor = 0.1; // Adjust this value to control the smoothness
        
        // Aiming logic
        const dx = isTouchDevice ? StickStatus2.x / 100 : mousePos.x - this.pos.x;
        const dy = isTouchDevice ? StickStatus2.y / 100 : mousePos.y - this.pos.y;
        
        if (!gameState.gameOver && !isInShop(true)) {
            if (!isTouchDevice) {
                angle = Math.atan2(dy, dx);
            } else {
                const joystickX2 = StickStatus2.x / 100;
                const joystickY2 = StickStatus2.y / 100;
    
                if (Math.abs(joystickX2) > 0.1 || Math.abs(joystickY2) > 0.1) {
                    const targetAngle = Math.atan2(joystickY2, joystickX2);
                    angle = lerp(this.lastAngle, targetAngle, smoothingFactor); // Smooth angle change
                } else {
                    angle = this.lastAngle; // Maintain previous angle if no input
                }
            }
    
            // Calculate angle difference for aiming adjustments
            angleDifference = angle - this.lastAngle;
            angleDifference = ((angleDifference + Math.PI) % (2 * Math.PI)) - Math.PI; // Normalize angle difference
    
            // Store the smoothed angle as the last angle
            this.lastAngle = angle;
        } else {
            // If the game is over, maintain the last angle
            angle = this.lastAngle;
        }


        // Arm length and positions
        const armTipLength = 1.5; // Normal distance from player to gun tip
        let weaponLength, weaponColor;

        // Determine weapon length and color based on the current weapon
        if (this.weapon === 'Pistol') {
            weaponLength = 0.6;
            weaponColor = hsl(0, 0, 0.5); // Grey color for Pistol
        } else if (this.weapon === 'Shotgun') {
            this.amN = 5;
            weaponLength = 0.8;
            weaponColor = hsl(0.08, 0.6, 0.4); // Brown color for Shotgun
            this.renderShotgunPump(angle); // Use the fancy shotgun pump logic
            return; // Return early since shotgun rendering is handled separately
        } else if (this.weapon === 'SMG') {

                this.amN = 14;
    

            weaponLength = 1.0;
            weaponColor = hsl(0, 0, 0); // Black color for SMG
        } else if (this.weapon === 'Bat') {
            this.renderBaseballBat(angle, angleDifference);
            return; // Return early since baseball bat rendering is separate
        }



        // Calculate the position of the right arm base (anchored at the player's shoulder)
        const armBaseOffset = vec2(Math.cos(angle + Math.PI / 2) * 0.7, Math.sin(angle + Math.PI / 2) * 0.7);
        const leftArmBase = this.pos.add(armBaseOffset);
        const rightArmBase = this.pos.subtract(armBaseOffset);

        // Position of the right arm tip (fixed to the weapon)
        const rightArmTip = this.pos.add(vec2(Math.cos(angle) * armTipLength, Math.sin(angle) * armTipLength));

        // Calculate reload animation effect for the left arm (only the left arm moves during reload)
        let leftArmTip = rightArmTip; // Start at the same position as the weapon tip
        let currentArmTipLength = armTipLength; // Default arm length

        if (this.isReloading) {
            const reloadAngleOffset = this.reloadProgress * Math.PI * 0.35; // Swing effect during reload

            // Calculate shortening effect: reduce length up to 30% during reload
            const minArmLengthFactor = 0.8; // 80% of the original length
            const reloadLengthFactor = minArmLengthFactor + (1 - minArmLengthFactor) * (1 - Math.min(1, Math.sin(this.reloadProgress * Math.PI)));
            currentArmTipLength = armTipLength * reloadLengthFactor;

            // Update left arm tip position with the shortened length during reload
            leftArmTip = leftArmBase.add(vec2(
                Math.cos(angle - Math.PI / 2 + reloadAngleOffset) * currentArmTipLength,
                Math.sin(angle - Math.PI / 2 + reloadAngleOffset) * currentArmTipLength
            ));
        }

        // Draw the player
        drawRect(this.pos, vec2(1, 1), hsl(0.58, 0.8, 0.5)); // Player body representation

        // Draw the arms: Right arm remains fixed to the weapon, left arm moves and shortens during reload
        drawLine(leftArmBase, leftArmTip, 0.18, hsl(0, 0, 0)); // Outline left arm
        drawLine(rightArmBase, rightArmTip, 0.18, hsl(0, 0, 0)); // Outline right arm
        drawLine(leftArmBase, leftArmTip, 0.13, hsl(0.58, 0.8, 0.5)); // Left arm with reload effect
        drawLine(rightArmBase, rightArmTip, 0.13, hsl(0.58, 0.8, 0.5)); // Right arm fixed

        // Draw the weapon
        const weaponTip = rightArmTip.add(vec2(Math.cos(angle) * weaponLength, Math.sin(angle) * weaponLength));
        drawLine(rightArmTip, weaponTip, 0.18, hsl(0, 0, 0)); // Weapon outline
        drawLine(rightArmTip, weaponTip, 0.16, weaponColor); // Weapon details
    }


    renderShotgunPump(playerAngle) {
        const armLength = 1.4; // Length of the arm
        const shotgunLength = 1.1; // Total length of the shotgun
        const pumpHandleOffset = shotgunLength * 0.25; // The pump handle is 1/4 of the way down the shotgun
        const pumpDuration = 500; // Duration of the pump action in milliseconds
        let pumpProgress = (performance.now() - this.lastShootTime) / pumpDuration;

        // Apply pump effect: Move the left arm outward and down, then back up
        let pumpOffset = 0;
        if (pumpProgress < 1) {
            pumpOffset = Math.sin(pumpProgress * Math.PI) * (shotgunLength * 0.45); // Move along 45% of the shotgun length
        }

        // Calculate arm base positions based on player angle (to simulate shoulder position)
        const armBaseOffset = vec2(Math.cos(playerAngle + Math.PI / 2) * 0.5, Math.sin(playerAngle + Math.PI / 2) * 0.5);
        const leftArmBase = this.pos.add(armBaseOffset); // Left arm base position (from shoulder)
        const rightArmBase = this.pos.subtract(armBaseOffset); // Right arm base position (from shoulder)

        // Adjust the right arm to angle inward slightly (for a more natural hold)
        const rightArmTip = rightArmBase.add(vec2(
            Math.cos(playerAngle + Math.PI / 10) * (armLength * 0.5), // Adjust for inward bend (positive angle)
            Math.sin(playerAngle + Math.PI / 10) * (armLength * 0.5)
        ));

        // Calculate left arm tip starting at the pump handle, then moving backward for the pump action
        const leftArmTip = rightArmTip.add(vec2(
            Math.cos(playerAngle) * (pumpHandleOffset - pumpOffset + 0.5), // Moving the pump handle
            Math.sin(playerAngle) * (pumpHandleOffset - pumpOffset + 0.5)
        ));

        // Shotgun points straight from the right arm tip position
        const shotgunTip = rightArmTip.add(vec2(Math.cos(playerAngle) * shotgunLength, Math.sin(playerAngle) * shotgunLength));
        const shotgunOutlineTip = rightArmTip.add(vec2(Math.cos(playerAngle) * (shotgunLength + 0.03), Math.sin(playerAngle) * (shotgunLength + 0.03)));

        // Draw the player
        drawRect(this.pos, vec2(1, 1), hsl(0.58, 0.8, 0.5)); // Player body representation

        // Draw the arms with the pump handle offset for the left arm
        drawLine(leftArmBase, leftArmTip, 0.18, hsl(0, 0, 0)); // Outline left arm
        drawLine(rightArmBase, rightArmTip, 0.18, hsl(0, 0, 0)); // Outline right arm
        drawLine(leftArmBase, leftArmTip, 0.13, hsl(0.58, 0.8, 0.5)); // Left arm
        drawLine(rightArmBase, rightArmTip, 0.13, hsl(0.58, 0.8, 0.5)); // Right arm

        // Draw the shotgun
        drawLine(leftArmTip, shotgunTip, 0.12, hsl(0.58, 0.8, 0.5)); // Pump handle connection
        drawLine(rightArmTip, shotgunOutlineTip, 0.20, hsl(0, 0, 0)); // Shotgun outline
        drawLine(rightArmTip, shotgunTip, 0.14, hsl(0.08, 1, 0.3)); // Shotgun body
    }



    renderBaseballBat(playerAngle, angleDifference) {
        const armLength = 1.4;
        const batLength = 0.9;
        const offsets = { left: 0.5, right: 0.8 }; // Arm grip offsets
        const colors = { bat: hsl(0.1, 1, 0.3), grip: hsl(0, 0, 0.7), outline: hsl(0, 0, 0), arm: hsl(0.58, 0.8, 0.5) };
    
        const {  adjustedAngle } = this.calculateSwingAngle(playerAngle, angleDifference);
    
        const [leftArmGripPos, rightArmGripPos] = this.calculateArmGripPositions(adjustedAngle, armLength, offsets);
    
        const batTip = rightArmGripPos.add(vec2(Math.cos(adjustedAngle) * batLength, Math.sin(adjustedAngle) * batLength));
        const batOutlineTip = batTip.add(vec2(Math.cos(adjustedAngle) * 0.03, Math.sin(adjustedAngle) * 0.03));
    
        // Draw player, arms, and bat
        drawRect(this.pos, vec2(1, 1), colors.arm); // Player body
        this.drawArms(leftArmGripPos, rightArmGripPos, colors); // Arms
        this.drawBat(leftArmGripPos, rightArmGripPos, batTip, batOutlineTip, colors); // Bat
    }
    
    calculateSwingAngle(playerAngle, angleDifference) {
        const windUpDuration = 0.3;
        const windUpAngle = this.swingDirection * Math.PI / 7;
        const overshootAmount = Math.PI / 14;
        let swingAngle = 0;
    
        if (this.isSwinging) {
            if (this.swingProgress < windUpDuration) {
                swingAngle = windUpAngle * (this.swingProgress / windUpDuration);
            } else {
                const swingProgress = (this.swingProgress - windUpDuration) / (1 - windUpDuration);
                if (swingProgress < 0.5) {
                    swingAngle = windUpAngle - Math.sin(swingProgress * Math.PI) * (Math.PI / 3) * this.swingDirection;
                } else {
                    this.detectHits(playerAngle + swingAngle);
                    const overshootProgress = (swingProgress - 0.5) * 2;
                    swingAngle = (Math.PI / 3 + overshootAmount) * Math.sin(overshootProgress * Math.PI) - overshootAmount;
                    swingAngle *= this.swingDirection;
                }
            }
            swingAngle += angleDifference;
        }
    
        return { swingAngle, adjustedAngle: playerAngle + swingAngle };
    }
    
    calculateArmGripPositions(angle, armLength, offsets) {
        const leftArmGripPos = this.pos.add(vec2(Math.cos(angle) * armLength * offsets.left, Math.sin(angle) * armLength * offsets.left));
        const rightArmGripPos = this.pos.add(vec2(Math.cos(angle) * armLength * offsets.right, Math.sin(angle) * armLength * offsets.right));
    
        return [leftArmGripPos, rightArmGripPos];
    }
    
    drawArms(leftArmGripPos, rightArmGripPos, colors) {
        const armBaseOffset = vec2(Math.cos(this.lastAngle + Math.PI / 2) * 0.5, Math.sin(this.lastAngle + Math.PI / 2) * 0.5);
        const leftArmBase = this.pos.add(armBaseOffset);
        const rightArmBase = this.pos.subtract(armBaseOffset);
    
        drawLine(leftArmBase, leftArmGripPos, 0.18, colors.outline);
        drawLine(rightArmBase, rightArmGripPos, 0.18, colors.outline);
        drawLine(leftArmBase, leftArmGripPos, 0.13, colors.arm);
        drawLine(rightArmBase, rightArmGripPos, 0.13, colors.arm);
    }
    
    drawBat(leftArmGripPos, rightArmGripPos, batTip, batOutlineTip, colors) {
        drawLine(leftArmGripPos, batTip, 0.12, colors.grip); // Grip
        drawLine(rightArmGripPos, batOutlineTip, 0.20, colors.outline); // Bat outline
        drawLine(rightArmGripPos, batTip, 0.14, colors.bat); // Bat body
    }

    detectHits(swingAngle) {
        const batTip = this.pos.add(vec2(Math.cos(swingAngle) * 1.4, Math.sin(swingAngle) * 1.4)); // Calculate bat tip position
        const hitRadius = 0.84; // Radius within which a hit is detected much large than actual bat radius

        // Draw a debug rectangle to visualize the hitbox
        //rawRect(batTip, vec2(hitRadius * 2, hitRadius * 2), hsl(0, 1, 0.5, 0.5)); 


        // Check for zombies within range of the bat's tip
        gameSettings.zombies.forEach(zombie => {
            if (!zombie.isDead) {
                const distanceToZombie = batTip.distance(zombie.pos);
                if (distanceToZombie < hitRadius) {
                    // Check if the zombie is a Boomer
                    if (zombie instanceof Boomer) {
                        zombie.boomerHitByBat();// Boomer-specific reaction to being hit
                    } else {
                        zombie.deathTimer = 3; // Set death timer to 3 seconds. important for on death fade out logic
                        zombie.kill(); // Generic kill for other zombie types
                    }
                }
            }
        });
    }

    addItem(itemName) {
        if (!this.items.includes(itemName)) {
            this.items.push(itemName);
        }
    

    }


}