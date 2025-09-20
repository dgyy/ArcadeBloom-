import './style.css'
import { Game } from './core/game';
import { getElementById } from './core/resources';

const init = () => {
  const canvas = getElementById("app") as HTMLCanvasElement;
  const game = new Game(canvas);

  for (var i = 0; i < game.ground.width * game.ground.height; i++) {
    game.ground.color[i] = 0xFF007050;
    game.ground.altitude[i] = 0;
  }

  game.ground.load();
  game.view.resize();

  window.onresize = game.view.resize;

  window.onkeydown = game.input.onKeysDown;
  window.onkeyup = game.input.onKeysUp;
  window.onmousedown = game.input.onMouseDown;
  window.onmouseup = game.input.onMouseUp;
  window.onmousemove = game.input.onMouseMove;
  // @ts-ignore it is ok
  window.ontouchstart = game.input.onMouseDown;
  window.ontouchend = game.input.onMouseUp;
  // @ts-ignore it is ok
  window.ontouchmove = game.input.onMouseMove;

  const fpsElement: HTMLElement = getElementById('fps');

  let prevT = 0;

  const step = (t: number) => {
    window.requestAnimationFrame(step);
    const dt = prevT === 0 ? 1 : t - prevT;
    game.update(dt);
    game.draw(dt);
    fpsElement.innerText = (1000.0 / dt).toFixed(1) + " fps";
    prevT = t;
  };

  window.requestAnimationFrame(step);
}

window.addEventListener('load', () => {
  console.log('Loading...');
  init();
  console.log('Loaded.');
}, { once: true });
