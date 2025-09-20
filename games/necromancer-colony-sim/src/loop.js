import { GameLoop } from './libs/kontra.js';
import { RESOURCE_TICK, SAVE_TICK } from './constants.js';
import { emit } from './events.js';
import state from './data/state.js';
import taskTick from './task-tick.js';
import attackTick from './attack-tick.js';

let resourceTimer = 0;
let saveTimer = 0;
const loop = GameLoop({
  clearCanvas: false,
  blur: true,
  update(dt) {
    emit(['timer-tick'], dt);

    if (++resourceTimer >= RESOURCE_TICK) {
      resourceTimer = 0;
      taskTick();
      attackTick(RESOURCE_TICK);
    }

    if (++saveTimer >= SAVE_TICK) {
      saveTimer = 0;
      state.save();
      console.log('saved');
      // `saved` is a global HTML id from index.html
      saved.classList.remove('hide');
      setTimeout(() => saved.classList.add('hide'));
    }
  },
  render() {}
});
export default loop;