import { createAnimation, Animation } from './animation';

export const initDb = () => {
  initDbAnims();
  initDbSounds();
};

const dbAnims: Record<string, string> = {};
const dbSounds: Record<string, (number | undefined)[]> = {};

export const initDbAnims = () => {
  const addAnim = (name: string, args: string) => {
    dbAnims[name] = args;
  };

  type IntermediateType = [string, string[]];
  const lrAnims: IntermediateType[] = [
    ['mole', ['s_9', 's_10']],
    // ['pl_0', ['s_0']],
    // ['pl_1', ['s_1']],
    // ['pl_2', ['s_2']],
    ['p_walk', ['s_3']],
    ['p_wait', ['s_3', 's_4']],
    ['p2_wait', ['s_5', 's_6']],
    ['p_angry', ['s_7', 's_8']],
    ['part_+1', ['s_39']],
    ['water', ['s_40']],
    ['bloodf', ['s_36']],
    ['blood', ['s_35']],
  ];

  for (const [name, sprites] of lrAnims) {
    addAnim(name + '_l', 't 300 ' + sprites.join(' '));
    addAnim(name + '_r', 't 300 ' + sprites.map((s) => s + '_f').join(' '));
  }

  addAnim('fire', 't 150 s_14 s_15');

  console.log('dbAnims', dbAnims);
};

export const initDbSounds = () => {
  // prettier-ignore
  dbSounds.item = [,0,976,,,0,2,.15,-0.4,,-547,.01,,,9.8,.1,,,.06,.03];
  // prettier-ignore
  dbSounds.itemPlace = [,0,104,,.15,.03,2,.38,,-61,,,.15,,,,,,.02,.36];
  // prettier-ignore
  dbSounds.doorOpen = [1.75,,151,.03,.01,.19,2,1.33,-9,,,,,.1,,,,.19,.01];
  // prettier-ignore
  dbSounds.doorClose = [1.24,,339,.12,.05,0,1,.42,-24,.1,,,.08,,-19,.6,,,,.79];
  // prettier-ignore
  // dbSounds.step = [1.07,,309,.01,.03,.03,4,.72,,60,60,.04,,,-16,,.06,.09];
  // prettier-ignore
  dbSounds.fill = [1.09,,0,.19,,.02,,2.31,92,-25,927,,,,-1.4,.9,,.5,.09];
  // prettier-ignore
  dbSounds.moleDead = [2.1,,1360,.06,.09,.2,2,1.63,,,,,,.9,-0.4,.1,.03,.57,,.01];
  // prettier-ignore
  dbSounds.moleAlert = [,,169,,.13,,2,2.18,.1,-7,,,.11,.6,,,,,.18,.05];
  // prettier-ignore
  dbSounds.plusOne = [1.12,,73,.02,.18,.06,2,.87,,,-190,.11,,,,,,.82,.01,.29];
  // prettier-ignore
  dbSounds.drawSword = [,,455,,.09,.01,2,2.31,,,-758,.01,.02,,,,,,.2,.59]
  // dbSounds.drawSword = [,,1149,,,.01,4,.15,19,.4,,,,.5,,,,,.1];
  // prettier-ignore
  dbSounds.swingSword = [,,232,.07,.02,0,4,.27,29,75,,,,.1,,,,,,.02];
  // prettier-ignore
  dbSounds.patronAngry = [1.29,,322,.03,.17,0,,.55,,-89,-843,.15,.09,.3,-234,,.02,,.09];
  // prettier-ignore
  dbSounds.dumpBucket = [1.99,,246,,.07,.03,4,.66,47,32,,,,,-0.4,,.25,,.13,.83];
  // prettier-ignore
  dbSounds.hitSomething = [1.04,,772,,.07,.06,2,.31,90,-15,590,.02,,,,.3,,.47,.03];
  // prettier-ignore
  dbSounds.personHit = [,,495,.05,.19,0,3,.15,.1,,,,,,.4,,,,.03,.02];
  // dbSounds.moleSpawn = [2.09,,326,.08,,0,4,.02,,4,,,.11,,28,,.1,.01,.22,.67];
  // prettier-ignore
  // dbSounds.repair = [1.04,,610,.04,.18,.04,,.79,33,,,,,.2,85,.1,,.27];
  // prettier-ignore
  dbSounds.fire = [1.06,,1028,.11,.14,.03,4,.15,-4.8,,-690,.18,,.1,,.4,.07,.99,.15];
  // prettier-ignore
  dbSounds.destroyCrate = [,,80,.04,.03,.2,4,.34,-0.3,,,,,,-9.9,,,,.18];
  // prettier-ignore
  dbSounds.levelDone = [1.04,,3,.06,.09,.09,1,.84,,14,,,,,5.2,,,.43,.13];
  // prettier-ignore
  dbSounds.levelScreen = [1.85,,123,.15,.15,.01,2,1.15,,-54,,,.26,,.3,,.06,.7,.03,.04];
  // prettier-ignore
  dbSounds.startLevel = [1.05,,0,.01,.17,.17,1,1.56,,73,225,.01,.09,,-0.1,,,.43];
  // prettier-ignore
  dbSounds.gameOver = [1.7,,146,.22,.07,.18,4,2.48,,82,,,,,253,,.21,,,.01];
  // prettier-ignore
  dbSounds.timerTick = [,,1091,.18,.02,.17,4,.91,,-42,,,,,167,,,,.02];

  // dbSounds.moleSpawn = [2.09,,326,.08,,0,4,.02,,4,,,.11,,28,,.1,.01,.22,.67];
};

export const createAnimationFromDb = (animName: string): Animation => {
  const animStr = dbAnims[animName];
  if (!animStr) {
    throw new Error('No anim: ' + animName);
  }
  const [, msStr, ...sprites] = animStr.split(' ');
  const ms = parseInt(msStr);
  const anim = createAnimation([
    // loop === 't',
    true,
    animName,
    sprites.map((s) => {
      return {
        n: s,
        d: ms,
      };
    }),
  ]);
  return anim;
};

export const getSound = (soundName: string) => {
  const s = dbSounds[soundName];
  if (!s) {
    throw new Error('No sound: ' + soundName);
  }
  return s;
};

export const FLOOR_TILES = [12, 14, 27, 28, 29, 39];
export const TABLE_TILES = [19, 20, 21, 22];
export const KEG_TILES = [18];
export const TABLE_VERTICAL = 20;
export const TABLE_HORIZONTAL = 19;
export const TABLE_EMPLOYEE_VERTICAL = 22;
export const TABLE_EMPLOYEE_HORIZONTAL = 21;
export const WEAPON_RACK = 13;
export const CLOSED_DOOR = 26;
export const OUTSIDE_WELL = 24;
export const RUBBLE = 14;
export const ON_FIRE = 15;
export const CRATE = 17;

export const LevelMessages = [
  '',
  '"Hey, barkeep!\nFill a mug and set it down\nhere in front of me."',
  "Looks like it's busy today.\nPatrons are overflowing to the side room.",
  'In Case of Fire:\nFETCH BUCKET OF WATER\nFROM WELL OUTSIDE',
  'We need more tables!\nOpen up the other side room!',
  "We're attracting moles now!\nGrab a weapon when you see 'em!\nThat's why we have a weapons rack!",
  'Business is booming!\nWe have a whole new taproom now!',
  'A bigger tavern always\nattracts more moles.',
  'We need to expand again!\nTheres even more space\nin the back.',
  'A bouncer would be nice\nto remove of all these moles!',
  'We can squeeze a few more\n in the private taproom.',
];

const roomOrder = [4, 2, 6, 5, 1, 3];
// export const levelToRoomNumber = (level: number) => {
//   return roomOrder[level - 1] || 3;
// };
export const roomNumberToLevel = (roomNumber: number) => {
  return roomOrder.indexOf(roomNumber) + 1;
};

export const isFloorTile = (tileId: number) => {
  return FLOOR_TILES.includes(tileId);
};

export const isVisibleTile = (tileId: number) => {
  return [13, 17, 18, 18, 20, 21, 22].concat(FLOOR_TILES).includes(tileId);
};

export const isWallTile = (tileId: number) => {
  return !isFloorTile(tileId);
};

export const isWallTileNotIncludingDoors = (tileId: number) => {
  return !isFloorTile(tileId) && !isClosedDoorTile(tileId);
};

export const isClosedDoorTile = (tileId: number) => {
  return tileId === CLOSED_DOOR;
};
