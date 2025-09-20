import { init, Sprite, GameLoop, track, getCanvas, collides } from 'kontra';
import { gameState } from './gameState';
import { createPause } from './pause';
import { initInputs } from './input';
import { createPointer, pointerToDirection } from './pointer';
import { audio } from './song';
import { saveScore, loadScore } from './storage';
import { createHeart } from './heart';
import { createEnd } from './end';
import { createFrontPlayer, createRightSidePlayer, createLeftSidePlayer } from './player';
import { createMute } from './mute';
import { createScore } from './score';
import { randomObstacle } from './randomObstacle';
import { spawnTimer } from './util';
import { createTexture } from './texture';

(async function () {
    let { canvas } = init();
    ({ clientWidth: canvas.width, clientHeight: canvas.height } = getCanvas() as HTMLCanvasElement);

    let speedScale = 0.002;
    let scale = 5;
    let bestScore = loadScore();

    createPointer(gameState, canvas);
    gameState.speed.x = canvas.width * speedScale;
    gameState.speed.y = canvas.height * speedScale;

    // Top-level await makes asset loading way way less annoying
    let frontPlayer = await createFrontPlayer(canvas);
    let rightSidePlayer = await createRightSidePlayer(canvas);
    let leftSidePlayer = await createLeftSidePlayer(canvas);
    let player = frontPlayer;
    let hearts = await Promise.all(Array.from({ length: gameState.life }, async () => await createHeart(canvas)));
    hearts.forEach((heart, i) => heart.x = canvas.width - (i + 2) * heart.world.width);

    let mute = createMute(canvas, gameState, audio);
    let score = createScore(canvas, gameState, bestScore);
    let ui = [mute, score];
    let obstacles: Sprite[] = [];
    let textures: Sprite[] = [];

    let loop = GameLoop({
        blur: true,
        update: async (dt: number) => {
            pointerToDirection(gameState, player);

            if (gameState.direction === 0) {
                player = frontPlayer;
            }
            else if (gameState.direction < 0) {
                player = leftSidePlayer;
            }
            else {
                player = rightSidePlayer;
            }

            gameState.speed.x = -gameState.direction * canvas.width;
            gameState.speed.y = (Math.abs(gameState.direction) - 3) * canvas.height;
            gameState.speed = gameState.speed.normalize().scale(scale += (dt * 0.1));
            obstacles = obstacles.filter(ob => ob.isAlive());
            textures = textures.filter(texture => texture.isAlive());
            let obj: Sprite | undefined;
            if (obj = obstacles.find(ob => collides(player, ob))) {
                obj.kill = true;
                gameState.life--;
                hearts.pop();
            }

            if (gameState.life <= 0) {
                saveScore(Math.max(score.value, bestScore));
                let end = createEnd(canvas);
                track(end);
                ui.push(end);
                gameState.end = true;
                loop.stop();
            }

            obstacles.forEach(s => s.update());
            textures.forEach(s => s.update());
            ui.forEach(s => s.update());
            player.update();

            // Spawn rates probably shouldn't be tied to framerate,
            // but it's way easier than time-based spawning and pauses correctly
            gameState.spawnCounter -= dt;
            if (gameState.spawnCounter <= 0) {
                obstacles.push(await randomObstacle(canvas, gameState));
                gameState.spawnCounter = spawnTimer(score.value);
            }

            gameState.textureCounter -= dt;
            if (gameState.textureCounter <= 0) {
                textures.push(await createTexture(canvas, gameState));
                gameState.textureCounter = Math.random();
            }
        },
        render: () => {
            obstacles.forEach(s => s.render());
            textures.forEach(s => s.render());
            hearts.forEach(s => s.render());
            ui.forEach(s => s.render());
            player.render();
        }
    });

    let pause = createPause(canvas);
    initInputs(gameState, loop, canvas, pause);

    loop.start();
})();
