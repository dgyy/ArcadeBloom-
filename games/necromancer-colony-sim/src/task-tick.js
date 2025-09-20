import state, { resource } from './data/state.js';
import {
  max,
  amount
} from './data/resources.js';
import tasks, {
  effects,
  assigned
} from './data/tasks.js';

/**
 * Have each task produce their resource.
 */
export default function taskTick() {
  const canProduce = tasks.map((taskData) => taskData[assigned]);
  let produced;

  // continue trying to produce resources until no task produces
  // resources. otherwise if we did this in only 1 loop a player
  // with wood produces but is full on wood and needed to produce
  // coal would lose wood instead of remaining at max
  do {
    produced = false;

    tasks.map((taskData, index) => {
      const workers = canProduce[index];
      const effectsData = taskData[effects];

      if (!workers) {
        return;
      }

      const costs = effectsData.filter(([, value]) => value < 0);
      const gains = effectsData.filter(([, value]) => value > 0);

      // ensure player has all the costs before fulfilling
      // task. if player can only afford to make less than the
      // assigned number of skeletons then make only as much
      // as they can afford
      let canAfford = workers;
      if (!costs.every(([resourceIndex, value]) => {
        // tasks use resources per assigned skeleton
        const perValue = -value * workers;
        canAfford = (
          Math.min(
            perValue + (state.get([resource, resourceIndex, amount]) - perValue),
            perValue,
            canAfford * -value
          ) / -value
        ) | 0;

        return canAfford > 0;
      })) {
        return;
      }

      // don't spend resources making more than player has room
      // for
      if (!gains.every(([resourceIndex, value]) => {
        const perValue = value * canAfford;
        canAfford = Math.ceil(
          Math.min(
            state.get([resource, resourceIndex, max], Infinity) - state.get([resource, resourceIndex, amount], 0),
            canAfford
          ) / value
        )

        return canAfford > 0;
      })) {
        return;
      }

      // player has the resources need for the task and can
      // produce at least one resource
      effectsData.map(([resourceIndex, value]) => {
        const resourceMax = state.get([resource, resourceIndex, max]);

        // don't set resource if at max already
        if (
          value > 0 &&
          state.get([resource, resourceIndex, amount]) >= resourceMax
        ) {
          return;
        }

        state.add(
          [resource, resourceIndex, amount, value * canAfford],
          resourceMax
        );
        produced = true;
        canProduce[index] = workers - canAfford;
      });
    });
  } while (produced);
}