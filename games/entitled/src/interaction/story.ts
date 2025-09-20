import { BLACK, FLAMINGO, LIGHT_BLUE, RED } from "../core/resources";
import { Vec3 } from "../core/vec3";
import { CameraState } from "../view/camera";
import { Weapon } from "./weapons";

type Delay = number;
type Units = number;

export class Wave {
  attacks: [Units, Delay][];
  phrase: string;
  newWeapon: Weapon;

  constructor(attacks, phrase, weapon) {
    this.attacks = attacks;
    this.phrase = phrase;
    this.newWeapon = weapon;
  }
}

export class Story {
  public royaltyView: CameraState;
  public flyPath: CameraState[];
  public fightPos: CameraState;
  public waves: Wave[];
  public waveIndex = 0;

  public reset() {
    this.waveIndex = 0;
  }
}

export const story = new Story();

story.royaltyView = {
  angle: -4.339305820702128,
  distance: 800,
  horizon: -65.0189757964443,
  position: new Vec3(588.982421875, 469.964111328125, 273.84217834472656),
};

story.waves = [
  new Wave(
    [[3, 1500], [5, 10000], [4, 10000], [1, 10000]],
    "The peasants have gotten tired of eating dirt! I need to invent new weapon...",
    ['Empty promises', LIGHT_BLUE, 1, 1, 20]
  ),
  new Wave(
    [[10, 1500], [5, 10000], [4, 10000], [1, 10000]],
    "I convinced some peasants to stay in dirt and wear red but others keep coming. Luckily I invented a new weapon...",
    ['Patriarchy', FLAMINGO, 5, 2, 20],
  ),
  new Wave(
    [[4, 1500], [10, 15000], [20, 15000], [1, 10000]],
    "If the peasants have no bread, let them eat cake! Haha... I need a new weapon...",
    ['Religion', BLACK, 10, 3, 20],
  ),
  new Wave(
    [[5, 1500], [20, 20000], [20, 10000], [1, 10000]],
    "The peasants will fall to their knees when I release...",
    ['Prejudice', RED, 20, 4, 20],
  ),
  new Wave(
    [[10, 1500], [10, 20000], [30, 15000], [1, 10000]],
    "I will fall don't they see that I have god given right! Lets try... ",
    ['Patriotism', BLACK, 30, 5, 20],
  ),
];

story.fightPos = {
  angle: -4.150429608133125,
  distance: 800,
  horizon: -201.90282802547313,
  position: new Vec3(634.6865234375, 321.7402648925781, 598.1404418945312),
};

story.flyPath = [
  {
    angle: -2.9437311127542665,
    distance: 800,
    horizon: 215.74858161965486,
    position: new Vec3(415.08856201171875, 199.0737762451172, 240.19976806640625),
  }, {
    angle: -3.119694499075897,
    distance: 800,
    horizon: 329.01558762511377,
    position: new Vec3(511.4964599609375, 420.7003479003906, 177.53883361816406),
  }, {
    angle: -4.4944084547135885,
    distance: 800,
    horizon: 317.26144567789015,
    position: new Vec3(569.4714965820312, 509.56884765625, 128.94207763671875),
  }, {
    angle: -6.1943404547136085,
    distance: 800,
    horizon: 179.99679999999645,
    position: new Vec3(492.73663330078125, 641.3016357421875, 140),
  }, {
    angle: -8.147667041005946,
    distance: 800,
    horizon: 37.21565059144677,
    position: new Vec3(331.5606689453125, 425.4092712402344, 264.7362060546875),
  }
];
