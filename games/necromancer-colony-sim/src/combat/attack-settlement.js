import { random } from '../utils.js';
import settlements, {
  cooldown,
  rewards,
  rewardValues,
  strength,
  units,
  locations,
  playerLocation,
  playerArmy,
  timer,
  hamlet,
  village,
  ironMine,
  city
} from '../data/settlements.js';
import state, { army, settlement } from '../data/state.js';
import armies, { upk } from '../data/armies.js';

window.generateLocations = generateLocations;
export function generateLocations(data) {
  let generated = data[locations];

  if (generated) {
    return generated;
  }

  const settlementLocations = [];
  for (let i = 0; i < 4; i++) {
    const locationArmy = [0,0,0,0];
    const availableUnits = data[units];

    // using a square root curve to generate a random number
    // whose result is more likely to be close to 1
    // @see https://gamedev.stackexchange.com/a/116875
    let locationStrength = (random.rand() ** 0.5) * data[strength];
    const rewardValue = locationStrength / data[strength];

    while (locationStrength > 0) {
      const unitIndex = availableUnits[
        random.randInt(0, availableUnits.length - 1)
      ];
      const unitUpk = state.get([army, unitIndex, upk]);
      const unitStrength = Math.ceil(locationStrength * unitUpk);
      const amount = random.randInt(0, unitStrength);

      locationArmy[unitIndex] += amount;
      locationStrength -= amount / unitUpk;
    }

    settlementLocations.push(locationArmy);
  }

  return settlementLocations;
  // state.set([settlement, settlementIndex, locations, settlementLocations]);
}