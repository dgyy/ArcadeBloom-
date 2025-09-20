import state, { resource, task, data, army } from './data/state.js';
import { on } from './events.js';
import resources, {
  amount,
  skeletons,
  corpses,
  mana,
  research,
  militia as militiaResource,
  infantry as infantryResource,
  archers as archerResource,
  cavalry as cavalryResource
} from './data/resources.js';
import {
  capacity,
  militia as militiaIndex,
  infantry as infantryIndex,
  archers as archersIndex,
  cavalry as cavalryIndex
} from './data/armies.js';
import {
  lastAttackTimer,
  lastAttackPop,
  attackTimer,
  attackNumber,
  attackArmy
} from './data/game-data.js'
import { assigned, idle } from './data/tasks.js';
import { ATTACK_TICK } from './constants.js';
import Dialog from './ui/dialog.js';
import { displayArmy, displayCost } from './utils.js';
import resolveBattle from './combat/resolve-battle.js';

let attackDialog;

/**
 * Check for an attack every resource tick. An attack will happen every 25 skeleton pop (including army) or every 5 minute (which ever occurs first).
 */
export default function attackTick(dt) {
  // workaround for circular import of Dialog > loop >
  // attack-tick > Dialog
  if (!attackDialog) {
    attackDialog = new Dialog({
      confirm: 'OK'
    });
  }
  attackDialog.onClose = function(how) {
    attackDialog.dialog.classList.add('to-tr');
    attackDialog.dialog.addEventListener('animationend', (e) => {
      if (e.animationName == 'to-tr') {
        return state.set([data, 0, attackTimer, 60]);
      }

      attackDialog.dialog.classList.remove('to-tr');
      attackDialog.close(how);
    });
  }

  const timer = state.add([data, 0, lastAttackTimer, dt]);

  // keep track of the last population when the attack occurred
  // so if population is lost due to the attack the player can
  // rebuild up to the prior population before another attack
  // based on population occurs
  const lastPop = state.get([data, 0, lastAttackPop], 0);
  const totalPop = [
    skeletons,
    militiaResource,
    infantryResource,
    archerResource,
    cavalryResource
  ].reduce((total, resourceIndex) => {
    return total += state.get([resource, resourceIndex, amount], 0);
  }, 0)

  if (
    // use a maximum attack timer so players cannot just sit on
    // their population and not get attacked
    timer < ATTACK_TICK
    // && totalPop < lastPop + 25
  ) {
    return
  }

  state.set([data, 0, lastAttackTimer, 0]);
  state.set([data, 0, lastAttackPop, totalPop]);

  // start at 2 as 1 to the power of anything is 1
  const attackNum = state.add([data, 0, attackNumber, 1]);
  // subtract 2 so the first attack is around strength 0.2
  const strength = (attackNum ** 1.25) - 2.17;

  const armyList = [militiaIndex];
  if (strength >= 2) {
    armyList.push(archersIndex)
  }
  if (strength >= 4) {
    armyList.push(infantryIndex)
  }
  if (strength >= 8) {
    armyList.push(cavalryIndex)
  }
  const army = generateArmy(strength, armyList);

  state.set([data, 0, attackArmy, army])

  attackDialog.head.innerHTML = '<b>🎯 Attack Incoming</b>';
  attackDialog.body.innerHTML = `<p>The local population does not like you taking the bodies of their loved ones. They are gathering an army to attack you.<p><p>${displayArmy(army)}</p>`;

  attackDialog.open();
}

// countdown attack timer
on(['timer-tick'], dt => {
  const timer = state.add([data, 0, attackTimer, -dt]);
  const attackingArmy = state.get([data, 0, attackArmy]);

  if (attackingArmy?.length && timer < 0) {
    const playerArmy = [
      militiaResource,
      infantryResource,
      archerResource,
      cavalryResource
    ].map(resourceIndex => {
      return state.get([resource, resourceIndex, amount], 0)
    });

    const { attackers, defenders } = resolveBattle(attackingArmy, playerArmy);
    state.set([data, 0, attackArmy, []]);
    const armyMap = {
      [militiaIndex]: militiaResource,
      [infantryIndex]: infantryResource,
      [archersIndex]: archerResource,
      [cavalryIndex]: cavalryResource,
    };

    const resourcesLost = [];
    defenders.map((value, index) => {
      const lost = state.get([resource, armyMap[index], amount], 0) - value;
      state.set([resource, armyMap[index], amount, value]);

      if (lost > 0) {
        resourcesLost.push([
          armyMap[index],
          lost
        ]);
      }
    });

    attackDialog.head.innerHTML = '<b>Battle Results</b>';
    attackDialog.body.innerHTML = `
      <p>You were successfully able to repel the enemy army. You lost the following troops.</p>
      <span class="cost">${
        resourcesLost.map(([resourceIndex, value]) => {
          return displayCost(resources[resourceIndex], value);
        }).join('')
      }</span>
    `;
    attackDialog.onClose = function(how) {
      attackDialog.close(how);
    }

    // if player loses all units and defender has unis left
    // destroy all player idle skeletons then lose resources
    // up to unit capacity total
    // @see https://ogame.fandom.com/wiki/Combat#Outcomes_and_its_consequences
    if (
      defenders.every(amount => !amount) &&
      attackers.some(amount => amount)
    ) {
      state.set([task, idle, assigned, 0]);

      const pillageableResources = resources.map((res, index) => {
        return [
          corpses,
          mana,
          skeletons,
          research,
          militiaResource,
          archerResource,
          infantryResource,
          cavalryResource
        ].includes(index)
          ? undefined
          : res;
      })
      let armyCapacity = attackers.reduce((total, value, index) => {
        return total + value * state.get([army, index, capacity])
      }, 0);

      const pillaged = [];
      for (let i = 0; i < pillageableResources.length && armyCapacity > 0; i++) {
        if (!pillageableResources[i]) continue;

        const resAmount = state.get([resource, i, amount]);

        if (!resAmount) continue;

        // can only pillage up to half of the resource
        const lost = Math.min(armyCapacity, resAmount / 2) | 0;
        pillaged.push([i, lost]);
        armyCapacity -= lost;
        state.set([resource, i, amount, resAmount - lost]);
      }

      attackDialog.body.innerHTML = `
        <p>You failed to repel the invaders. You lost all your army, all Idle Skeletons, and the following resources were pillaged:</p>
        <span class="cost">${
          pillaged.map(([resourceIndex, value]) => {
            return displayCost(resources[resourceIndex], value);
          }).join('')
        }</span>
      `;
    }

    attackDialog.open();
  }
});