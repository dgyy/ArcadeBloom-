import state, { resource, action, building, task, data } from '../data/state.js';
import displayResource from './display-resource.js';
import displayBuilding from './display-building.js';
import displayAction from './display-action.js';
import displayTask from './display-task.js';
import { attackTimer, attackArmy } from '../data/game-data.js';
import { displayArmy } from '../utils.js';
import { on } from '../events.js';

export default function initUI() {
  state.get([resource]).map(displayResource);
  state.get([action]).map(displayAction);
  state.get([building]).map(displayBuilding);
  state.get([task]).map(displayTask);

  // display attacking army info
  const attackingArmy = state.get([data, 0, attackArmy]);
  if (attackingArmy?.length) {
    // `atkArmy` is a global HTML id from index.html
    atkArmy.innerHTML = displayArmy(attackingArmy);
  }

  // bind attack timer visibility
  on([data, 0, attackTimer], value => {
    // `atk` is a global HTML id from index.html
    atk.hidden = value < 0;
    if (value < 0) {
      return;
    }

    const mins = value / 60 | 0;
    const secs = value - mins * 60 | 0;
    atkTimer.innerHTML = `${mins}:${(''+secs).padStart(2, 0)}`;
  });

  // bind attack army to tooltip
  on([data, 0, attackArmy], value => {
    atkArmy.innerHTML = displayArmy(value);
  });
}