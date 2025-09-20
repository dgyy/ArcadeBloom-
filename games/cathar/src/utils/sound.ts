//@ts-ignore
import {zzfx} from "ZzFX";

const HOP = [.3,,90,.02,.01,.01,1,.87,-8,,,,.01,1.9,,,,.4,.02,.03];
const STAB = [0.4,,41,.1,.02,0,1,1.6,,-11,-150,.07,,,,,,.63,.01];
const TAKE_DAMAGE = [0.2,,351,.01,.05,.07,2,1.6,-3.9,.7,,,.05,1.1,,.1,,.51,.04];

const POWERUP = [0.2,.1,500,.02,.04,,2,.32,,,136,.04,,,,,,.45,.04,.08];

const playSound = (sound: (number | undefined)[]) => zzfx(...sound);

export {HOP, STAB, TAKE_DAMAGE, POWERUP, playSound}
