import { initDb } from './db';
import { clearScreen, getCanvas, loadImagesAndSprites, setFm } from './draw';
import { Game, createGame } from './game';
import { normalize } from './utils';
import { setVolume } from './zzfx';

window.addEventListener('load', () => {
  start();
  // setVolume(0);
});

const EXPECTED_FS = 10;
export const start = async () => {
  load();
};

const load = async () => {
  console.log('loading...');
  await loadImagesAndSprites([['sprite', 'res/sprite.png', 16, 16]]);
  const map = await (await fetch('res/map.json')).json();
  console.log('loaded', map);
  initDb();

  const cWidth = Number(localStorage.getItem('js13k2023_tavernity_width'));
  if (!isNaN(cWidth) && cWidth > 0) {
    const canvas = getCanvas();
    canvas.style.width = cWidth + 'px';
  }

  loop(createGame(map.tiles, map.width, map.spawns));
};

const loop = (game: Game) => {
  const startTime = performance.now();
  let prevNow = startTime;

  const msPerUpdate = 22;
  const targetMult = normalize(msPerUpdate, 16, 30, 1, 2);

  const _loop = () => {
    const now = performance.now();
    let frameTime = now - prevNow;
    let prevFrameTime = Math.floor(frameTime);
    prevNow = now;

    if (frameTime > 4) {
      frameTime = 4;
    }
    const deltaTime = frameTime;
    frameTime -= deltaTime;
    const fm = (deltaTime * targetMult) / EXPECTED_FS;
    setFm(fm);
    game.update(fm);

    // draw.drawText('FS: ' + prevFrameTime, draw.width - 100, 50, {
    //   align: 'left',
    // });
  };

  const _loopRender = () => {
    clearScreen();
    game.draw();
    requestAnimationFrame(_loopRender);
  };

  setInterval(_loop, msPerUpdate);
  _loopRender();
};

(window as any).vol = (input: HTMLInputElement) => {
  const v = (Number(input.value) * 0.3) / 100;
  setVolume(v);
  console.log('SET VOL', v)
};
