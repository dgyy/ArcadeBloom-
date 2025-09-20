import { random } from '../utils.js';
import armies, {
  health,
  defense,
  attack,
  advantage
} from '../data/armies.js';

const unitType = 0;
const hp = 1;
const def = 2;
const atk = 3;

/**
 * Resolve a battle between two armies. Modeled after OGame battle resolution.
 * @see https://ogame.fandom.com/wiki/Combat
 * @param {number[]} attackers - Amount of each unit type for the attackers
 * @param {number[]} defenders - Amount of each unit type for the defenders.
 */
window.resolveBattle = resolveBattle;
export default function resolveBattle(attackers, defenders) {
  attackers = convertToArmyStats(attackers);
  defenders = convertToArmyStats(defenders);

  // battles occur in 6 rounds or until one side is eliminated
  for (
    let i = 0;
    i < 6 &&
    attackers.length &&
    defenders.length;
    i++
  ) {
    // const style = 'background-color: darkblue; color: white; font-style: italic; border: 5px solid hotpink; font-size: 2em;'
    // console.log('%cround %i', style, i+1);

    // reset army values at start of each round
    resetStats(attackers);
    resetStats(defenders);

    // attackers and defenders attack at the same time
    armyAttack(attackers, defenders);
    armyAttack(defenders, attackers);

    // remove dead units
    attackers = attackers.filter(unit => unit[hp] > 0);
    defenders = defenders.filter(unit => unit[hp] > 0);
  }

  // undo conversion back into amount of each type
  const endAttackers = [0,0,0,0];
  const endDefenders = [0,0,0,0];

  attackers.map(([unitType]) => {
    endAttackers[unitType]++;
  });
  defenders.map(([unitType]) => {
    endDefenders[unitType]++;
  });

  return { attackers: endAttackers, defenders: endDefenders };
}

/**
 * Turn the amount of each type into a array of each units stats (health, defense, attack)
 * @param {number[]} army - Amount of each unit type
 * @return {number[][]}
 */
function convertToArmyStats(army) {
  return army
    .map((armyAmount, armyIndex) => {
      const stats = [];
      for (let i = 0; i < armyAmount; i++) {
        stats.push([
          // TODO: this works without upgrades, will need to
          // figure out how to handle player / ai upgrades if
          // i add that
          armyIndex,
          armies[armyIndex][health],
          armies[armyIndex][defense],
          armies[armyIndex][attack]
        ]);
      }

      return stats;
    })
    .flat();
}

/**
 * Reset each unit's defense values back to their initial value.
 * @return {number[][]} army - Army stats
 */
function resetStats(army) {
  /*
    in the beginning of each round, every unit starts with
    its Attack (with value A) and Defense (with value D) at
    its initial value (specific of each unit plus technology
    upgrades). The Health (with value H) has the value of
    previous round (initial value of the unit if it is the
    first round).

    this "simulates" battles where there are breaks or that
    would last multiple days and give time for armies to
    regroup, recover, and rearm
  */
  army.map(unit => {
    unit[def] = armies[ unit[unitType] ][defense];
  });
}

/**
 * Resolve an attack of one army against another.
 * @param {number[][]} attackers - Army stats for the attacker
 * @param {number[][]} defenders - Army stats for the defender
 */
function armyAttack(attackers, defenders) {
  // TODO: atkI and defI are not needed and only used for
  // debug purposes, can remove
  attackers.map((attacker, atkI) => {
    // const style = 'font-weight: bold;'
    // console.log('%cnext attack', style);
    // each unit picks a random unit to attack
    const defI = random.randInt(0, defenders.length - 1);
    let defender = defenders[defI];
    unitAttack(attacker, defender, atkI, defI);

    /*
      if the attacking unit has advantage (with value r)
      against the target unit, it has a chance of (r-1)/r of
      choosing another target at random, and repeating the
      above steps for that new target.
    */
    // console.log('unit has advantage', armies[ attacker[unitType] ][advantage][ defender[unitType] ]);
    let percent;
    while (
      (percent = armies[ attacker[unitType] ][advantage][ defender[unitType] ])
    ) {
      const rand = random.rand();

      // console.log(`chance to attack again. needed ${percent} rolled`, rand);
      if (rand >= percent) return;

      // console.log('advantage attack');
      const defI = random.randInt(0, defenders.length - 1);
      defender = defenders[defI];
      unitAttack(attacker, defender, atkI, defI);
    }
  });
}

/**
 * Resolve the attack of one unit against another.
 * @param {Number[]} attacker - Stats of the attacking unit
 */
function unitAttack(attacker, defender, atkI, defI) {
  // console.log('\nattacker', atkI, attacker, 'attacking defender', defI, defender);

  /*
   the Attack is lower than the Defense, the armor absorbs the
   attack, and the unit does not lose any Health: D = D - A.
  */
  if (attacker[atk] <= defender[def]) {
    // console.log('absorbed.', defender[def], '-', attacker[atk], ' =', defender[def] - attacker[atk]);
    defender[def] = defender[def] - attacker[atk];
    return;
  }

  /*
   the Attack is sufficiently strong, i.e. A > D. Then the
   armor only absorbs part of the attack and the rest is dealt
   to the Health: H = H - (A - D) and D = 0.
  */
  // console.log('damaged delt:', attacker[atk] - defender[def], 'hp:', defender[hp] - (attacker[atk] - defender[def]));
  defender[hp] -= attacker[atk] - defender[def];
  defender[def] = 0;

  /*
    if the Health is less than 70% of the initial Health (H_i)
    of the unit (initial of the combat), then the unit has a
    probability of 1 - H/H_i of dying instantly. If it
    does, the Health is set to zero: H = 0. (but it can still
    be attacked by the other units on this round, because they
    already target it.)
  */
  const initialHealth = armies[ defender[unitType] ][health];
  if (defender[hp] / initialHealth < 0.7) {
    const target = 1 - defender[hp] / initialHealth;
    const rand = random.rand();
    // console.log('chance to die instantly. needed', target, 'rolled', rand);
    if (rand < target) {
      // console.log('died instantly');
      defender[hp] = 0;
    }
  }
}