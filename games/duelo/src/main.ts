import { backgroundInit } from './background';
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH, gameInit } from './game';
import { glProgramCreate, glSetViewport } from './gl';
import { menuStart } from './menu';
import html from '../game.html';
import { inventoryInit } from './inventory';

declare const canvas: HTMLCanvasElement;

const main = async () => {
    document.body.innerHTML = html;
    const program = glProgramCreate(canvas, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    const updateViewport = () => {
        const vMinPx = Math.min(document.body.clientWidth / VIRTUAL_WIDTH, document.body.clientHeight / VIRTUAL_HEIGHT);
        const pixelSize = 1 / devicePixelRatio;

        canvas.width = (VIRTUAL_WIDTH * vMinPx) / pixelSize;
        canvas.height = (VIRTUAL_HEIGHT * vMinPx) / pixelSize;

        glSetViewport(program, 0, 0, canvas.width, canvas.height);

        document.body.style.setProperty('--scale', `${vMinPx}`);
        document.body.style.setProperty('--virtual-width', `${VIRTUAL_WIDTH}px`);
        document.body.style.setProperty('--virtual-height', `${VIRTUAL_HEIGHT}px`);
    };
    addEventListener('resize', updateViewport);
    updateViewport();
    backgroundInit();
    inventoryInit();
    gameInit();

    menuStart(program);
};

window.onload = main;
