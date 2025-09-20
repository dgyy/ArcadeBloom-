import { Game } from "./game";
import { initialiseCanvas } from './canvas';

initialiseCanvas();

const game = new Game();

window.addEventListener('load', () => {
    let lastUpdate = Date.now();

    game.start();

    function tick() {
        requestAnimationFrame(tick);

        const now = Date.now();
        const dt = now - lastUpdate;
        lastUpdate = now;

        game.update(dt);
        game.draw();
    }

    tick();
});
