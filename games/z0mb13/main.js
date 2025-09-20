'use strict';
import { vec2, engineInit, cameraScale, rand, hsl, mouseWasPressed, drawTextScreen, mousePos, drawText, setPaused, clearInput} from './libs/littlejs.esm.min.js';
import { generateBiomeMap } from './biomeGenerator.js';
import { Player } from './player.js';
import { Zombie, Boomer, gameState, DeadlyDangler } from './zombie.js';
import { setupBiomeCanvas, adjustCanvasSize, canvasState } from './CanvasUtils.js';
import { handleShopMouseClick, drawShop, isInShop, items } from './shop.js';
import { getCurrency, getScore, setScore, setCurrency } from './bullet.js';
import { sound_lvl_up, sound_combo } from './sound.js';
import { BossZombie } from './boss.js'; // Ensure to import the BossZombie class
import { JoyStick } from './libs/joystick.js';

let mapCanvas = document.getElementById('mapCanvas');
let zombiesSpawned = 0; // Track how many zombies have been spawned
const DANGER_THRESHOLD = 13; // Number of zombies to spawn before allowing Deadly Danglers, bosses and increasing speed
let isWindowFocused = true; // Flag to check if window is focused
// Combo message state
let comboMessage = {
    active: false,
    text: '',
    position: vec2(0, 0),
    displayTime: 0,
    fadeTime: 2.5, // Duration in seconds for which the message stays on screen
};


isWindowFocused = document.hasFocus();
setPaused(!isWindowFocused); // Pause if not focused
// Event listener to resume game when the window gains focus
window.addEventListener('focus', () => {
    isWindowFocused = true;
    setPaused(false);
});

// Event listener to pause game when the window loses focus
window.addEventListener('blur', () => {
    isWindowFocused = false;
    setPaused(true);
});
window.addEventListener('orientationchange', function() {
    location.reload();  // Refresh the page when the device orientation changes
});

export const gameSettings = {
    zombieSpeed: 0.025, // Starting speed
    spawnRate: 1200, // Initial spawn rate in milliseconds
    minSpawnRate: 500, // Minimum spawn rate cap
    spawnRateDecrement: 50, // Decrease spawn rate by 50ms every interval
    speedIncrement: 0.002, // Speed increase per zombie spawn or score threshold, 
    maxZombieSpeed: 0.1, // Maximum zombie speed cap 
    zombies: [],
    bullets: [],
    mapCanvas: document.getElementById('mapCanvas'),
    mapCanvasSize: vec2(mapCanvas.width, mapCanvas.height),
    mapCanvasWidth: mapCanvas.width,
    mapCanvasHeight: mapCanvas.height
};
export let player;
export let spawnInterval;
var joystick2;
var joystick1;

function gameInit() {
    // Create a common style object for joystick containers
    const joystickStyle = {
        width: '25vw',
        height: '25vw',
        position: 'absolute',
        bottom: '4vh'
    };

    // Function to apply the style to a joystick container
    function applyJoystickStyle(container, position) {
        Object.assign(container.style, joystickStyle);
        container.style[position] = '20px'; // Either 'left' or 'right'
    }

    // Initialize the first joystick for movement
    let joystickContainer1 = document.getElementById('jd');
    if (!joystickContainer1) {
        joystickContainer1 = document.createElement('div');
        joystickContainer1.id = 'jd';
        applyJoystickStyle(joystickContainer1, 'left');
        document.body.appendChild(joystickContainer1);
    }


    if ('ontouchstart' in document.documentElement && document.getElementById('jd')) {
        joystick1 = new JoyStick('jd', { title: 'joystick1' }, function () {});
    }

    // Initialize the second joystick for aiming/rotation
    let joystickContainer2 = document.getElementById('jd2');
    if (!joystickContainer2) {
        joystickContainer2 = document.createElement('div');
        joystickContainer2.id = 'jd2';
        applyJoystickStyle(joystickContainer2, 'right');
        document.body.appendChild(joystickContainer2);
    }


    if ('ontouchstart' in document.documentElement && document.getElementById('jd2')) {
        joystick2 = new JoyStick('jd2', { title: 'joystick2' }, function () {});
    }


    setupBiomeCanvas();

    generateBiomeMap(canvasState.biomeCanvas, {
        desertThreshold: -1,
        shallowTerrianThreshold: 0.2,
        deepTerrianThreshold: -0.2,
        mountainThreshold: -0.75,
        snowThreshold: 1.9,
        noiseScale: 8
    });

    player = new Player(vec2(0, 0)); // Initialize the player

    adjustCanvasSize(); // Adjust canvas size
    window.addEventListener('resize', adjustCanvasSize);

    gameSettings.mapCanvas.addEventListener('mousedown', handleShopMouseClick);
}

export function startSpawningZombies() {
    spawnInterval = setInterval(spawnZombie, gameSettings.spawnRate);
}

export function stopSpawningZombies() {
    clearInterval(spawnInterval);
}


function gameUpdate() {
    if (gameState.gameOver) {
 if (mouseWasPressed(0)) {
            resetGame(); // Reset game
        }
        return;
    }

    handleShopMouseClick();
    if (isInShop()) {
        return;
    }


    if (mouseWasPressed(0)) {
        player.shoot(mousePos);
    }

    player.update();
    gameSettings.zombies.forEach(zombie => zombie.update());
    gameSettings.bullets.forEach(bullet => bullet.update());

    gameSettings.bullets = gameSettings.bullets.filter(bullet => bullet.isOnScreen());
    gameSettings.zombies = gameSettings.zombies.filter(zombie => !zombie.isDead || zombie.deathTimer > 0);
}

function gameRender() {
    
    const context = gameSettings.mapCanvas.getContext('2d');

    // Draw the biome map background
    context.drawImage(canvasState.biomeCanvas, 0, 0, gameSettings.mapCanvas.width, gameSettings.mapCanvas.height);

    context.save();

    // Render zombies and bullets
    gameSettings.zombies.forEach(zombie => zombie.render());
    gameSettings.bullets.forEach(bullet => bullet.render());

    // Render the player
    player.render();
    context.restore();



    // Render the shop if in the shop mode
    if (isInShop()) {
        drawShop();
    }

    // Render game over text
    if (gameState.gameOver) {
        const centerX = gameSettings.mapCanvas.width / 2;
        const centerY = gameSettings.mapCanvas.height / 2;
    
        // Common style variables
        const color = hsl(0, 0, 1);
        const outlineColor = hsl(0, 0, 0);
        const outlineWidth = 10;
    
        // Game Over and Final Score
        const texts = [
            { text: 'Game Over', yOffset: 0, size: 50 },
            { text: `Score: ${getScore()}`, yOffset: 60, size: 40 }
        ];
    
       
            texts.push({ text: 'Tap to Restart', yOffset: 180, size: 30 });
    
            // Listen for click or tap to restart
            if (mouseWasPressed(0)) {
                resetGame(); // Reset game on tap
            }

    
        // Loop to draw all the text elements
        texts.forEach(({ text, yOffset, size }) => {
            drawTextScreen(text, vec2(centerX, centerY + yOffset), size, color, outlineWidth, outlineColor);
        });
    }
}



let beepedCurrencyLevels = []; // Array to track currency levels that triggered the beep
const beepThresholds = [10, 35, 60, 100];

function gameRenderPost() {
    if (!gameState.gameOver) {
        const s = getScore(), c = getCurrency(), w = gameSettings.mapCanvas.width, t = vec2(150, 70);
        drawTextScreen('Score: ' + s + '  Currency: ' + c, vec2(w / 2, 70), 40, hsl(0, 0, 1), 6, hsl(0, 0, 0));

        beepThresholds.forEach(threshold => {
            if (c >= threshold && !beepedCurrencyLevels.includes(threshold)) {
                sound_lvl_up.play();
                beepedCurrencyLevels.push(threshold);
            }
        });

        if (!isInShop()) {
            drawTextScreen('Enter Shop', t, 30, hsl(0, 0, 1), 4, hsl(0, 0, 0));

            const a = items.filter(i => c >= i.cost && !i.purchased)[0];
            if (a && c >= a.cost) {
                const flash = Math.floor(performance.now() / 1000) % 2 === 0;
                flash && drawTextScreen('!', vec2(t.x + 90, t.y), 40, hsl(0, 1, 0.5), 4, hsl(0, 0, 0));
            }
        } else {
            drawTextScreen('Exit Shop', t, 30, hsl(0, 1, 0.5), 4, hsl(0, 0, 0));
        }
    }

    if (comboMessage.active) {
        const alpha = Math.max(0, comboMessage.displayTime / comboMessage.fadeTime);
        drawText(comboMessage.text, comboMessage.position, 1, hsl(0.1, 1, 0.5, alpha));
        comboMessage.displayTime -= 1 / 60;
        if (comboMessage.displayTime <= 0) comboMessage.active = false;
    }
}
// Function to show combo messages at specific positions
export function showComboMessage(comboCount, position) {
    const positionVec = position instanceof vec2 ? position : new vec2(Math.floor(position.x), Math.floor(position.y));


    comboMessage.text = `X${comboCount}!`;
    comboMessage.position = positionVec;
    comboMessage.displayTime = comboMessage.fadeTime; // Reset display time
    comboMessage.active = true; // Set combo message active

    // Play combo hit sound when a combo is shown
    sound_combo.play();
}

function spawnBossZombie(position) {
    const bodycolor = hsl(0.6, 1, 0.5); // Set the body color for the BossZombie to a dark red
    // Create a new BossZombie instance
    const bossZombie = new BossZombie(position, bodycolor);

    // Add the BossZombie to the zombies array in gameSettings
    gameSettings.zombies.push(bossZombie);

}

function spawnZombie() {
    if (!isWindowFocused || isInShop() || gameState.gameOver) return;

    const halfCanvasWidth = gameSettings.mapCanvas.width / 2 / cameraScale;
    const halfCanvasHeight = gameSettings.mapCanvas.height / 2 / cameraScale;
    const spawnMargin = 2;
    const edges = [
        vec2(rand(-halfCanvasWidth, halfCanvasWidth), halfCanvasHeight + spawnMargin),
        vec2(halfCanvasWidth + spawnMargin, rand(-halfCanvasHeight, halfCanvasHeight)),
        vec2(rand(-halfCanvasWidth, halfCanvasWidth), -halfCanvasHeight - spawnMargin),
        vec2(-halfCanvasWidth - spawnMargin, rand(-halfCanvasHeight, halfCanvasHeight))
    ];

    const pos = edges[Math.floor(Math.random() * 4)];
    if (Math.random() < 0.08 && zombiesSpawned >= DANGER_THRESHOLD * 2 && player.weapon !== 'Bat') { // Spawn a boss zombie with a 7% chance after DANGER_THRESHOLD zombies spawned and zpmbiesSpawned >= 26 AND player does not have the bat
        spawnBossZombie(pos);
    }

    const zombieType = Math.random() < 0.15 // 15% chance to spawn a Boomer
        ? Boomer
        : (Math.random() < 0.2 && zombiesSpawned >= DANGER_THRESHOLD)
            ? DeadlyDangler
            : Zombie;

    // Adjust zombie speed and spawn rate every 3 zombies
    if (zombiesSpawned % 4 === 0) {
        console.log('Speed and spawn rate adjusted');
        gameSettings.zombieSpeed = Math.min(gameSettings.zombieSpeed + gameSettings.speedIncrement, gameSettings.maxZombieSpeed);
        gameSettings.spawnRate = Math.max(gameSettings.spawnRate - gameSettings.spawnRateDecrement, gameSettings.minSpawnRate);
    }

    const newZombie = new zombieType(pos);
    newZombie.speed = gameSettings.zombieSpeed;
    gameSettings.zombies.push(newZombie);
    zombiesSpawned++;
}
function gameUpdatePost() {
    // If needed for any post-update operations
}







// Reset the game state
function resetGame() {
    clearInput();
    gameState.gameOver = false;
    setScore(0); // Reset score
    setCurrency(0); // Reset currency
    zombiesSpawned = 0; // Reset zombies spawned count
    gameSettings.zombies = [];
    gameSettings.bullets = [];
    gameSettings.zombieSpeed = 0.020;
    gameSettings.spawnRate = 1200;
    player = new Player(vec2(0, 0)); // Reset player position and state
    beepedCurrencyLevels = []; // Reset the beeped currency levels

}

// Start the game
startSpawningZombies();
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);