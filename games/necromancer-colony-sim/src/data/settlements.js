import {
  SHORT_ATTACK_COOLDOWN,
  MEDIUM_ATTACK_COOLDOWN,
  LONG_ATTACK_COOLDOWN,
  XLONG_ATTACK_COOLDOWN
} from '../constants.js';
import {
  wood,
  stone,
  corpses,
  planks,
  blocks,
  charcoal,
  ironOre,
  iron,
  tools
} from './resources.js';
import {
  militia,
  archers,
  infantry,
  cavalry
} from './armies.js';

export const name = 0;
export const description = 1;
export const cooldown = 2;
export const rewards = 3
export const rewardValues = 4;
export const strength = 5;
export const units = 6;
export const locations = 7;
export const playerLocation = 8;
export const playerArmy = 9;
export const timer = 10;

export const hamlet = 0;
export const village = 1;
export const ironMine = 2;
export const city = 3;

const settlements = [];
export default settlements;

export function initSettlements() {
  settlements.push(
    // 0
    [
      'Hamlet',
      '',
      SHORT_ATTACK_COOLDOWN,
      [wood, stone, corpses],
      // the maximum reward amount of resources
      [25, 50],
      // strength is in units per kill (upk) and determines the
      // maximum amount of units that defend a location
      1,
      [militia, archers]
    ],

    // 1
    [
      'Village',
      '',
      MEDIUM_ATTACK_COOLDOWN,
      [planks, blocks, corpses],
      [25, 75],
      2,
      [militia, archers, infantry]
    ],

    // 2
    [
      'Iron Mine',
      '',
      LONG_ATTACK_COOLDOWN,
      [charcoal, ironOre, corpses],
      [50, 100],
      4,
      [archers, infantry]
    ],

    // 3
    [
      'City',
      '',
      XLONG_ATTACK_COOLDOWN,
      [iron, tools, corpses],
      [75, 125],
      8,
      [archers, infantry, cavalry]
    ]
  );
}