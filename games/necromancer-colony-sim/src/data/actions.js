import {
  SHORT_COOLDOWN,
  MEDIUM_COOLDOWN,
  LONG_COOLDOWN,
  XLONG_COOLDOWN
} from '../constants.js';
import { resource, action, building } from './state.js';
import resources, {
  icon,
  amount,
  wood,
  stone,
  corpses,
  planks,
  blocks,
  ironOre,
  iron,
  tools,
  charcoal,
  mana,
  skeletons,
  weapons,
  armor,
  bows,
  militia,
  infantry,
  archers,
  cavalry
} from './resources.js';
import { built, rituralCircle, woodcuttersCamp, laboratory } from './buildings.js';
import { assigned, idle } from './tasks.js';

// indices
export const name = 0;
export const description = 1;
export const cooldown = 2;
export const effects = 3;
export const prereq = 4;
export const cost = 5;
export const researchCost = 6;
export const unlocked = 7;
export const visible = 8;
export const clicked = 9;
export const disabled = 10;
export const timer = 11;

export const chopWood = 0;
export const digStone = 1;
export const stealCorpse = 2;
export const reanimateSkeleton = 3;
export const recoverMana = 4;
export const reanimateMilitia = 5;
export const reanimateArchers = 6;
export const reanimateInfantry = 7;
export const reanimateCavalry = 8;
export const attackHamlet = 9;
export const attackVillage = 10;
export const attackIronMine = 11;
export const attackCity = 12;

const actions = [];
export default actions;

export function initActions() {
  actions.push(
    // 0
    [
      'Chop Wood',
      'Chop wood from a tree',
      SHORT_COOLDOWN,
      [
        // actions always increase a resource amount so we
        // can skip putting that data here
        [wood, 20]
      ]
    ],

    // 1
    [
      'Gather Stones',
      'Gather stones from the ground',
      SHORT_COOLDOWN,
      [
        [stone, 15]
      ],
      [
        [action, chopWood, clicked, 2]
      ]
    ],

    // 2
    [
      'Steal Corpse',
      'Sneak into a graveyard and snatch a corpse for reanimating as a Skeleton',
      MEDIUM_COOLDOWN,
      [
        [corpses, 1]
      ],
      [
        [action, digStone, clicked, 2]
      ]
    ],

    // 3
    [
      'Reanimate Skeleton',
      'Reanimate a corpse as a Skeleton to perform various tasks',
      LONG_COOLDOWN,
      [
        [skeletons, 1]
      ],
      [
        [building, rituralCircle, built, 1]
      ],
      [
        [mana, 5],
        [corpses, 1],
      ]
    ],

    // 4
    [
      'Recover Mana',
      'Meditate on your evil acts',
      XLONG_COOLDOWN,
      [
        [mana, 10]
      ],
      [
        [action, reanimateSkeleton, clicked, 1]
      ]
    ],

    // 5
    [
      'Reanimate Militia',
      'Reanimate a group of corpses to fight for you as unarmed Militia.<br/><br/>Militia are cheap but weak vs Infantry, Archers, and Cavalry',
      LONG_COOLDOWN,
      [
        [militia, 10]
      ],
      [
        [building, laboratory, built, 1]
      ],
      [
        [mana, 50],
        [corpses, 10]
      ],
      30
    ],

    // 6
    [
      'Reanimate Archers',
      'Reanimate a group of corpses to fight for you as Archers.<br/><br/>Archers are strong vs Infantry',
      LONG_COOLDOWN,
      [
        [archers, 6]
      ],
      [
        [building, laboratory, built, 1]
      ],
      [
        [mana, 100],
        [corpses, 6],
        [bows, 6]
      ],
      150
    ],

    // 7
    [
      'Reanimate Infantry',
      'Reanimate a group of corpses to fight for you as armed Infantry.<br/><br/>Infantry are strong vs Cavalry',
      LONG_COOLDOWN,
      [
        [infantry, 5]
      ],
      [
        [building, laboratory, built, 1]
      ],
      [
        [mana, 175],
        [corpses, 5],
        [weapons, 5],
        [armor, 5],
      ],
      300
    ],

    // 8
    [
      'Reanimate Cavalry',
      'Reanimate a group of corpses to fight for you as Cavalry.<br/><br/>Cavalry are strong vs Archers',
      LONG_COOLDOWN,
      [
        [cavalry, 4]
      ],
      [
        [building, laboratory, built, 1]
      ],
      [
        [mana, 250],
        [corpses, 8],
        [weapons, 4],
        [armor, 8]
      ],
      450
    ],

    // // 9
    // [
    //   'Attack Hamlet',
    //   `Send your army to attack a poorly defended hamlet and pillage <span>${resources[wood][icon]}</span> and <span>${resources[stone][icon]}</span>`,
    //   LONG_COOLDOWN,
    //   [],
    //   [
    //     [building, laboratory, built, 1]
    //   ]
    // ],

    // // 10
    // [
    //   'Attack Village',
    //   `Send your army to attack a decently defended village and pillage <span>${resources[planks][icon]}</span> and <span>${resources[blocks][icon]}</span>`,
    //   LONG_COOLDOWN,
    //   [],
    //   [
    //     [building, laboratory, built, 1]
    //   ]
    // ],

    // // 11
    // [
    //   'Attack Iron Mine',
    //   `Send your army to attack a moderately defended Iron Mine and pillage <span>${resources[charcoal][icon]}</span> and <span>${resources[ironOre][icon]}</span>`,
    //   LONG_COOLDOWN,
    //   [],
    //   [
    //     [building, laboratory, built, 1]
    //   ]
    // ],

    // // 12
    // [
    //   'Attack City',
    //   `Send your army to attack a heavily defended city and pillage <span>${resources[iron][icon]}</span> and <span>${resources[tools][icon]}</span>`,
    //   LONG_COOLDOWN,
    //   [],
    //   [
    //     [building, laboratory, built, 1]
    //   ]
    // ]
  );

  // first action is always visible
  actions[0][visible] = true;
}