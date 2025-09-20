/*
 *  Copyright 2023 Sami Heikkinen, Tero Jäntti
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { initializeControls, waitForEnter } from './controls';
import {
    CROSS_IMAGE_HEIGHT,
    CROSS_IMAGE_WIDTH,
    canvas,
    context,
    crossImage,
    playerNorthStandImage,
} from './graphics';
import { Level, State } from './level';

import {
    initialize,
    playTune,
    SFX_START,
    SFX_MAIN,
    SFX_FINISHED,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
} from './sfx/sfx.js';

const TIME_STEP = 1000 / 60;
const MAX_FRAME = TIME_STEP * 5;

const ITEM_FLASHING_TIME_MS = 2000;
const FLASHING_INTERVAL_MS = 400;

let spawns = 0;
let successes = 0;

const maxRadius = Math.max(screen.width, screen.height) / 1.5;

enum GameState {
    Init,
    Ready,
    Running,
    GameOver,
    GameFinished,
}

let gameState: GameState = GameState.Init;

// For drawing start- and game over screens.
let radius = 0;

let lastTime = 0;
let level: Level = new Level(spawns);

const setState = (state: GameState): void => {
    gameState = state;

    switch (state) {
        case GameState.Ready:
            level = new Level(spawns);
            radius = maxRadius;
            playTune(SFX_START);
            break;
        case GameState.Running:
            playTune(SFX_MAIN);
            break;
        case GameState.GameOver:
            radius = 1;
            playTune(SFX_FINISHED);
            break;
        case GameState.GameFinished:
            successes++;
            spawns = spawns + 5; // Make it harder this time
            radius = 1;
            break;
        default:
            break;
    }
};

const gameLoop = (t: number): void => {
    requestAnimationFrame(gameLoop);

    const dt = Math.min(t - lastTime, MAX_FRAME);
    lastTime = t;

    update(dt);
    draw();
};

const update = (dt: number): void => {
    switch (gameState) {
        case GameState.Running: {
            level.update(dt);
            if (level.state === State.GAME_OVER) {
                setState(GameState.GameOver);
            } else if (level.state === State.FINISHED) {
                setState(GameState.GameFinished);
            }
            break;
        }
        default:
            break;
    }
};

const centerText = (
    text: string,
    fontSize: number,
    fontName: string,
    alpha = 1,
    yAdjust = 0,
) => {
    context.globalAlpha = alpha > 0 ? alpha : 0;
    context.fillStyle = 'white';
    context.font = fontSize + 'px ' + fontName;
    const textWidth = context.measureText(text).width;
    context.fillText(
        text,
        (canvas.width - textWidth) / 2,
        canvas.height / 2 + yAdjust,
    );
    context.globalAlpha = 1;
};

const flashing = (now: number): boolean => {
    return Math.floor(now / FLASHING_INTERVAL_MS) % 2 === 0;
};

const drawCollectedItems = (now: number): void => {
    const crossTimeLeft = level.playerHasCross(now);

    if (crossTimeLeft != null) {
        if (crossTimeLeft > ITEM_FLASHING_TIME_MS || flashing(now)) {
            context.drawImage(
                crossImage,
                10,
                10,
                CROSS_IMAGE_WIDTH / 2,
                CROSS_IMAGE_HEIGHT / 2,
            );
        }
    }
};

const draw = (): void => {
    const now = performance.now();

    level.draw(now);
    drawCollectedItems(now);

    switch (gameState) {
        case GameState.Ready: {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            if (radius <= 0) {
                setState(GameState.Running);
            } else {
                context.beginPath();
                context.arc(centerX, centerY, radius, 0, Math.PI * 2);
                context.fillStyle = '#105000';
                context.fill();
                centerText(
                    'Run, hide and find the exit!',
                    64,
                    'Brush Script MT',
                    radius / maxRadius,
                );
                radius -= 10;
            }
            break;
        }
        case GameState.GameOver: {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, Math.PI * 2);
            context.fillStyle = '#802010';
            context.fill();
            centerText(
                'CAUGHT BY YOUR PREDECESSORS!',
                64,
                'Brush Script MT',
                radius / maxRadius,
            );
            centerText(
                'Press enter as you were given that change.',
                24,
                'Sans-serif',
                1,
                80,
            );

            if (radius >= maxRadius) {
                waitForEnter().then(() => setState(GameState.Ready));
            } else {
                radius += 10;
            }
            break;
        }
        case GameState.GameFinished: {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, Math.PI * 2);
            context.fillStyle = '#CCCC40';
            context.fill();

            centerText('THIS TIME YOU ESCAPED', 48, 'Brush Script MT', 1, -20);
            centerText(
                'YOUR PREDECESSORS ' +
                    successes +
                    (successes > 1 ? ' TIMES!' : ' TIME!'),
                48,
                'Brush Script MT',
                1,
                30,
            );
            centerText(
                'Press enter to take your changes again.',
                32,
                'Sans-serif',
                24,
                100,
            );
            centerText(
                '... But they are waiting for you now!',
                32,
                'Sans-serif',
                24,
                150,
            );

            if (radius >= maxRadius) {
                waitForEnter().then(() => setState(GameState.Ready));
            } else {
                radius += 10;
            }
            break;
        }
        default:
            break;
    }
};

const drawInitialScreen = (text: string): void => {
    context.save();
    context.fillStyle = 'rgb(20, 50, 50)';
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();

    context.filter = 'grayscale()';
    context.globalAlpha = 0.5;
    context.drawImage(
        playerNorthStandImage,
        canvas.width / 2 - 400,
        canvas.height / 2 - 200,
        100,
        260,
    );
    context.drawImage(
        playerNorthStandImage,
        canvas.width / 2 + 200,
        canvas.height / 2 + 100,
        100,
        260,
    );
    context.filter = 'grayscale(0)';
    context.restore();

    context.globalAlpha = 1;
    context.drawImage(
        crossImage,
        canvas.width / 2 - 100,
        canvas.height / 2 + 100,
        100,
        260,
    );
    centerText('PREDECESSORS', 64, 'Brush Script MT', 1, -20);
    centerText('From the 13th century', 24, 'Brush Script MT', 1, 20);
    centerText(text, 24, 'Sans-serif', 1, 80);
    context.restore();
};

export const start = async (): Promise<void> => {
    initializeControls();
    drawInitialScreen('Loading...');
    await initialize();

    drawInitialScreen('Press enter key to start your escape!');
    await waitForEnter();

    setState(GameState.Ready);
    window.requestAnimationFrame(gameLoop);
};
