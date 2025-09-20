import { resource } from '../data/state.js';
import {
  name,
  icon,
  prereq,
  amount,
  max,
  visible,
  change,
  wood,
  stone,
  skeletons,
  planks,
  research,
  blocks,
  charcoal,
  ironOre,
  iron,
  tools,
  weapons,
  armor,
  bows,
  militia,
  infantry,
  archers,
  cavalry
} from '../data/resources.js';
import armies, {
  militia as militiaIndex,
  infantry as infantryIndex,
  archers as archersIndex,
  cavalry as cavalryIndex,
  health,
  defense,
  attack
} from '../data/armies.js';
import { on } from '../events.js';
import { RESOURCE_TICK } from '../constants.js';
import { html, showWhenPrereqMet, trucnateNumber } from '../utils.js';

/**
 * Display the amount of a resource the player has.
 *
 * @param {*[]} data - Resource data.
 * @param {Number} index - The current item of the data.
 */
export default function displayResource(data, index) {
  const div = html(`<div class="tipC"></div>`);
  setText(div, data, index);
  div.hidden = !data[visible];
  showWhenPrereqMet(data, prereq, div, resource, index, visible);

  // bind resource state to the display value
  on([resource, index, amount], () => {
    setText(div, data, index);
  });
  on([resource, index, max], () => {
    setText(div, data, index);
  });
  on([resource, index, change], () => {
    setText(div, data, index);
  });

  // `wG`, `sG`, `iG`, `tG`, `aG`, `pop`, and `mG` are global
  // HTML ids from index.html
  (
    [wood, planks].includes(index)
      ? wG
      : [stone, blocks].includes(index)
      ? sG
      : [charcoal, ironOre, iron].includes(index)
      ? iG
      : [tools, weapons, armor, bows].includes(index)
      ? tG
      : [militia, infantry, archers, cavalry].includes(index)
      ? aG
      : index == skeletons
      ? pop
      : mG
  ).appendChild(div);
}

function setText(div, data, index) {
  const armyMap = {
    [militia]: armies[militiaIndex],
    [infantry]: armies[infantryIndex],
    [archers]: armies[archersIndex],
    [cavalry]: armies[cavalryIndex],
  };
  const isUnit = [militia, infantry, archers, cavalry].includes(index);

  let text = `
    <span class="icon ${data[name]}">${data[icon]}</span>
    <span class="amount">
      ${trucnateNumber(data[amount] ?? 0)}${!data[max] ? '' : `/${trucnateNumber(data[max])}`}
    </span>
    ${index !== skeletons
      ? `
        <span class="tip res b${isUnit ? '  unit' : ''}${index == skeletons ? ' r' : ''}">
          <b>${data[name]}</b>${
            !isUnit
              ? `: ${data[change] > 0 ? '+' : ''}${data[change] ?? 0} per ${RESOURCE_TICK / 60}s`
              : ''
          }
          ${
            [militia, infantry, archers, cavalry].includes(index)
              ? displayArmyStats(armyMap[index])
              : ''
          }
        </span>`
      : ''
    }
  `;

  div.innerHTML = text;
}

function displayArmyStats(unit) {
  return `
    <span>${unit[health]} HP</span>
    <span>${unit[defense]} DEF</span>
    <span>${unit[attack]} ATK</span>
  `;
}