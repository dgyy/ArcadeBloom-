import { Game, gameCreate, gameRender, gameStart, gameStep } from './game';
import { Program, glIncreaseTime } from './gl';
import { storageGetLevel } from './storage';
import { uiAlert } from './ui';

declare const menuui: HTMLDivElement;
declare const start: HTMLButtonElement;
declare const menutut: HTMLButtonElement;

export const menuStart = (program: Program, previousGame: Game = null) => {
    start.dataset.text = storageGetLevel() > 0 ? 'CONTINUE' : 'START';
    menuui.classList.remove('hidden');

    const game = previousGame || gameCreate();
    let started = false;
    let previousTime = 0;
    const loop = (time: number) => {
        const deltaTime = time - previousTime;
        previousTime = time;
        if (previousGame) {
            gameStep(game, deltaTime * 0.8);
        }
        glIncreaseTime(program, deltaTime);
        gameRender(game, program);

        if (!started) {
            requestAnimationFrame(loop);
        }
    };
    requestAnimationFrame((time: number) => loop((previousTime = time)));

    gameRender(gameCreate(), program);

    start.onclick = () => {
        menuui.classList.add('hidden');
        gameStart(gameCreate(), program);
        started = true;
        start.onclick = null;
    };

    menutut.onclick = () =>
        uiAlert(
            'Arrow left/right to move\nSpace to attack\nArrow up to defend\nDouble arrow left/rigth to move faster'
        );
};
