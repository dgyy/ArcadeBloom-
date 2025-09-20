import state, { resource, action } from '../data/state.js';
import {
  name,
  description,
  cooldown,
  effects,
  prereq,
  cost,
  researchCost,
  unlocked,
  visible,
  clicked,
  disabled,
  timer,
  attackHamlet,
  attackVillage,
  attackIronMine,
  attackCity
} from '../data/actions.js';
import resources, {
  max,
  amount
} from '../data/resources.js';
import { on } from '../events.js';
import {
  html,
  displayCost,
  canAfford
} from '../utils.js';
import UnlockableButton from './unlockable-button.js';
import { generateLocations } from '../combat/attack-settlement.js';
import settlementDialog from './settlement-dialog.js';

/**
 * Display a manual action the player can perform.
 *
 * @param {*[]} data - Action data.
 * @param {Number} index - The current item of the data.
 */
export default function displayAction(data, index) {
  const button = new ActionButton(
    data,
    index,
    action,
    name,
    description,
    cost,
    effects,
    prereq,
    researchCost,
    unlocked,
    visible,
    disabled
  );
  const cooldownSpan = html('<span class="cooldown"></span>');
  const benefitSpan = html(`
    <span class="btn-r">
      ${
        data[effects].map(([resourceIndex, value]) => {
          return displayCost(resources[resourceIndex], value, '+');
        }).join('')
      }
    </span>
  `);

  button.appendChild(cooldownSpan);
  button.appendChild(benefitSpan);

  // update action cooldown timer
  setCooldown(data, cooldownSpan);
  on(['timer-tick'], (dt) => {
    if (data[timer] <= 0) {
      return;
    }

    const value = state.add([action, index, timer, -dt]);
    setCooldown(data, cooldownSpan);

    // re-enable action if timer expires and player can perform action
    if (canPerform(data)) {
      state.set([action, index, disabled, false]);
    }
  });

  // `actG` is a global HTML id from index.html
  actG.appendChild(button);
}

class ActionButton extends UnlockableButton {
  constructor(...args) {
    super(...args);
  }

  whenClicked(data, index) {
    if ([
      attackHamlet,
      attackVillage,
      attackIronMine,
      attackCity
    ].includes(index)) {


      return;
    }


    state.add([action, index, clicked, 1]);
    data[effects].map(([resourceIndex, value]) => {
      state.add(
        [resource, resourceIndex, amount, value],
        state.get([resource, resourceIndex, max])
      );
    });
    state.set([action, index, disabled, true]);
    state.set([action, index, timer, data[cooldown]]);
  }

  canAfford(data) {
    return canPerform(data);
  }

  // re-enable action if resource amount or max changes (but
  // only if timer isn't going)
  enableWhenCanAfford(data, index) {
    data[effects].map(([resourceIndex]) => {
      on([resource, resourceIndex, amount], () => {
        if (!data[visible]) return;

        state.set([action, index, disabled, !canPerform(data)]);
      });

      on([resource, resourceIndex, max], () => {
        if (!data[visible]) return;

        state.set([action, index, disabled, !canPerform(data)]);
      });
    });

    data[cost].map(([resourceIndex]) => {
      on([resource, resourceIndex, amount], () => {
        if (!data[visible]) return;

        state.set([action, index, disabled, !canPerform(data)]);
      });
    });
  }
}

function setCooldown(data, cooldownSpan) {
  const width = data[timer] <= 0
    ? 0
    : data[timer] / data[cooldown] * 100 + '%';
  cooldownSpan.style.width = width;
}

function canPerform(data) {
  return (
    (data[timer] ?? 0) <= 0 &&
    canAfford(data[cost]) &&
    (
      (data[effects] ?? []).length
      ? data[effects].some(([resourceIndex]) => {
          return (
            state.get([resource, resourceIndex, amount], 0) <
            state.get([resource, resourceIndex, max], Infinity)
          );
        })
      : true
    )
  );
}