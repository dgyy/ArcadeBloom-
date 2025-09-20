import { setStoreItem, getStoreItem } from '../libs/kontra.js';
import { traversePath, random } from '../utils.js';
import { emit } from '../events.js';
import { SAVE_KEY } from '../constants.js';
import resources, {
  max,
  visible as resourceVisible,
  amount,
  change
} from './resources.js';
import actions, {
  unlocked as actionUnlocked,
  visible as actionVisible,
  clicked,
  disabled as actionDisabled,
  timer as actionTimer
} from './actions.js';
import buildings, {
  unlocked as buildingUnlocked,
  built,
  visible as buildingVisible,
  disabled as buildingDisabled
} from './buildings.js';
import tasks, {
  assignable,
  assigned,
  visible as taskVisible
} from './tasks.js';
import armies, { trained } from './armies.js';
import settlements, {
  cooldown,
  locations,
  playerLocation,
  playerArmy,
  timer as settlementTimer
} from './settlements.js';
import gameData, { randSeed } from './game-data.js';

// indices
export const resource = 0;
export const action = 1;
export const building = 2;
export const task = 3;
export const army = 4;
export const data = 5;
export const settlement = 6;

const state = {
  /**
   * Get the state value.
   * @param {Number[]} path - Path to the state.
   * @param {*} [defaultValue] - Value to return if the state is not set.
   * @return {*}
   */
  get(path, defaultValue) {
    const p = [...path];
    const index = p.pop();
    const obj = traversePath(this._state, p);
    return obj[index] ?? defaultValue;
  },

  /**
   * Add the value to the state making sure to never exceed the maximum value.
   * @param {Number[]} path - Path to the state and the value to add (e.g. [0, 2, 4] will get the state of [0,2] and add 4).
   * @param {Number} [max] - Maximum value of the state.
   * @return {Number} New value of the state.
   */
  add(path, max) {
    const p = [...path];  // clone
    const { obj, value, index } = fromPath(p);
    obj[index] = Math.min(
      (obj[index] ?? 0) + value,
      max ?? Infinity
    );
    emit([...p, index], obj[index], value);
    return obj[index];
  },

  /**
   * Set the value of the state.
   * @param {Number[]} path - Path to the state and the value to set (e.g. [0, 2, 4] will get the state of [0,2] and set it to 4).
   */
  set(path) {
    const p = [...path];  // clone
    const { obj, value, index } = fromPath(p);
    obj[index] = value;
    emit([...p, index], obj[index], value);
  },

  /**
   * Save the current game state.
   */
  save() {
    // limit what props are saved to those only changed by the
    // player during game play
    const saveState = [
      getSaveState(resources, [max, resourceVisible, amount, change]),
      getSaveState(actions, [actionUnlocked, actionVisible, clicked, actionDisabled, actionTimer]),
      getSaveState(buildings, [buildingUnlocked, built, buildingVisible, buildingDisabled]),
      getSaveState(tasks, [assignable, assigned, taskVisible]),
      // TODO: may need to save upgrades
      getSaveState(armies, [trained]),
      gameData,
      // getSaveState(settlements, [])
    ];

    setStoreItem(SAVE_KEY, saveState);
  },

  /**
   * Load a saved game state.
   */
  load(initialState) {
    const saveState = getStoreItem(SAVE_KEY);
    if (!saveState) {
      return initialState;
    }

    saveState.map((stateItem, stateIndex) => {
      stateItem.map((obj, objIndex) => {
        Object.entries(obj).map(([key, value]) => {
          if (initialState[stateIndex]?.[objIndex]) {
            initialState[stateIndex][objIndex][key] = value;
          }
          else {
            console.info('State missing:', stateIndex, objIndex, key)
          }
        });
      });
    });

    return initialState;
  }
};
export default state;
window.state = state;

export function initState() {
  const initialState = [
    resources,
    actions,
    buildings,
    tasks,
    armies,
    gameData,
    settlements
  ];

  state._state = state.load(initialState);
  random.seed(initialState[data][0][randSeed]);
}

function fromPath(path) {
  const value = path.pop();
  const index = path.pop();
  const obj = state.get(path);
  return { obj, value, index };
}

function getSaveState(data, filterIndices) {
  return data.map(item => {
    return item.reduce((obj, value, index) => {
      if (filterIndices.includes(index)) {
        obj[index] = value;
      }

      return obj;
    }, {})
  });
}