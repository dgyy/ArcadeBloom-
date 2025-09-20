import { on } from './events.js';
import state, { resource, army, data } from './data/state.js';
import resources, {
  name as resourceName,
  icon,
  amount,
  militia,
  infantry,
  archers,
  cavalry
} from './data/resources.js';
import {
  militia as militiaIndex,
  infantry as infantryIndex,
  archers as archersIndex,
  cavalry as cavalryIndex
} from './data/armies.js';
import { upk } from './data/armies.js';
import { randSeed } from './data/game-data.js';

/**
 * Traverse a nested array and return the value at the desired path. Each index of the `path` is the index of the array to traverse down at each level.
 *
 * @example
 * const array = [ [1], [ [2] ] ]
 * traversePath(array, [0, 0]) // 1
 * traversePath(array, [1, 0, 0]) // 2
 *
 * @param {*[]} array - Array to traverse.
 * @param {Number[]} path - Array of indices.
 * @return {*}
 */
export function traversePath(array, path) {
  let curr = array;
  path.map(index => {
    curr[index] = curr[index] ?? [];
    curr = curr[index];
  });
  return curr;
}

/**
 * Show the HTML element when the prerequisites of the element are met.
 *
 * @param {*[]} data - Resource, Building, or Action data.
 * @param {Number} prereqIndex - Prereq index of the data array.
 * @param {HTMLElement} domElm - HTML Element to show.
 * @param {Number} stateIndex - Data index of the state array.
 * @param {Number} index - The current item of the data.
 * @param {Number} visible - The visible index of the current item data.
 */
export function showWhenPrereqMet(data, prereqIndex, domElm, stateIndex, index, visible, callback) {
  const prereqs = (data[prereqIndex] ?? [])
  const prereqsMet = prereqs.map(() => 0);

  prereqs.map((prereq, i) => {
    const path = [...prereq];  // clone
    const neededValue = path.pop();

    on(path, (curValue) => {
      if (curValue >= neededValue) {
        prereqsMet[i] = 1;
        if (prereqsMet.every(value => value)) {
          domElm.hidden = false;
          state.set([stateIndex, index, visible, true]);
          callback && callback();
        }
      }
    });
  });
}

/**
 * Transform a string of HTML into an HTML element.
 *
 * @param {String} str - String of HTML.
 * @return {HTMLElement}
 */
export function html(str) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.children[0];
}

/**
 * Truncate a number to show 1K when over 1000 and 1M when over 1_000_000.
 * @param {Number} value - Value to truncate.
 * @return {Number|String}
 */
export function trucnateNumber(value) {
  return value < 1e3
    ? value | 0
    : value < 1e6
    ? (value / 1e3).toFixed(1) + 'K'
    : (value / 1e6).toFixed(1) + 'M'
}

/**
 * Get the HTML to display a resource cost of icon and value.
 * @param {Number[]} resourceData - Resource data array.
 * @param {Number} value - Cost value.
 * @param {String} [prefix=''] - Cost prefix string.
 * @return {String}
 */
export function displayCost(resourceData, value, prefix = '') {
  return `<span class="${resourceData[resourceName]}"><span class="cost-icon">${resourceData[icon]}</span> ${prefix}${trucnateNumber(value)}</span>`;
}

/**
 * Get the HTML to display an army icon and value.
 * @param {Number[]} armyList - Army array.
 * @return {String}
 */
export function displayArmy(armyList) {
  const armyMap = {
    [militiaIndex]: resources[militia],
    [infantryIndex]: resources[infantry],
    [archersIndex]: resources[archers],
    [cavalryIndex]: resources[cavalry],
  };

  return `
    <div class="cost">
      ${
        armyList.map((value, index) => {
          const resourceData = armyMap[index];
          return `<span class="${resourceData[resourceName]}"><span class="cost-icon">${resourceData[icon]}</span> ${trucnateNumber(value)}</span>`;
        }).join('')
      }
    </div>
  `
}

/**
 * Determine if the costs have been met for either an Action or Building.
 * @param {Number[]} - Cost data array.
 * @return {Boolean}
 */
export function canAfford(costs) {
  return costs.every(([resourceIndex, value]) => {
    return state.get([resource, resourceIndex, amount]) >= value
  });
}

/**
 * Random number generator based on splitmix32
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#splitmix32
 */
let seed;
export const random = {
  rand() {
    seed |= 0; seed = seed + 0x9e3779b9 | 0;
    state.set([data, 0, randSeed, seed]);

    let t = seed ^ seed >>> 16; t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  },
  randInt(min, max, randFn = this.rand) {
    return ((randFn() * (max - min + 1)) | 0) + min;
  },
  getSeed() {
    return seed;
  },
  seed(t = Date.now()) {
    seed = t;
    state.set([data, 0, randSeed, seed]);
  }
};
window.random = random;

/**
 *
 */
export function generateArmy(strength, availableUnits) {
  const armyList = [0,0,0,0];
  while (strength > 0) {
    const unitIndex = availableUnits[
      random.randInt(0, availableUnits.length - 1)
    ];
    const unitUpk = state.get([army, unitIndex, upk]);
    const unitStrength = Math.ceil(strength * unitUpk);

    // use a quadratic curve to generate a random number
    // whose result is more likely to be close to 0.
    // this helps give a more interesting distribution to
    // the armies rather than allowing one high roll to
    // dominate the army composition
    // @see https://gamedev.stackexchange.com/a/116875
    const amount = random.randInt(0, unitStrength, () => random.rand() ** 2);

    armyList[unitIndex] += amount;
    strength -= amount / unitUpk;
  }

  return armyList;
}
window.generateArmy = generateArmy;