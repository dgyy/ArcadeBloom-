import state, { resource, task } from '../data/state.js';
import {
  name,
  effects,
  prereq,
  assigned,
  assignable,
  visible,
  idle
} from '../data/tasks.js';
import resources, { icon, amount, max, change, skeletons } from '../data/resources.js';
import { on } from '../events.js';
import { RESOURCE_TICK } from '../constants.js';
import { html, showWhenPrereqMet } from '../utils.js';

/**
 * Display an automated task performed by skeletons.
 *
 * @param {*[]} data - task data.
 * @param {Number} index - The current item of the data.
 */
export default function displayTask(data, index) {
  const taskName = html(`
    <div class="tipC" ${!data[visible] ? 'hidden' : ''}>
      ${data[name]}
      ${index !== idle ? `<span class="tip">${getTip(data, data[assigned] ?? 0)}</span>` : ``}
    </div>
  `);

  // `tskG` is a global HTML id from index.html
  tskG.appendChild(taskName);

  const div = html(`
    <div class="tipC">
      <input type="number" min="0" max="0" value="${data[assigned] ?? 0}">
      <div class="max"></div>
      ${index !== idle ? `<span class="tip">${getTip(data, data[assigned] ?? 0)}</span>` : ``}
    </div>
  `);
  const input = div.querySelector('input');
  const maxDiv = div.querySelector('.max');
  div.hidden = !data[visible];
  showWhenPrereqMet(data, prereq, div, task, index, visible);

  // show tasks heading when first task is shown
  if (index === 0) {
    // tskP`, `tskT`, and `tskInpT` are global HTML ids from index.html
    tskP.hidden = tskT.hidden = tskInpT.hidden = !data[visible]

    on([task, 0, visible], (value) => {
      tskP.hidden = tskT.hidden = tskInpT.hidden = !value;
    });
  }

  // bind hidden state to the task name
  on([task, index, visible], (value) => {
    taskName.hidden = !value;
  });

  // prevent user from typing into the input
  input.addEventListener('keydown', (e) => e.preventDefault());

  // special auto task that user cannot change
  if (index === idle) {
    input.setAttribute('readonly', true);
    input.setAttribute('type', 'text');

    // bind skeletons resource to idle skeletons value
    on([resource, skeletons, amount], (value, diff) => {
      state.add([task, index, assigned, diff])
    });

    // bind the assigned idle value to the input value
    on([task, index, assigned], (value) => {
      input.value = value;
    });
  }
  else {
    // bind the max assignable value to the max attribute
    setMaxAssignable(data, input);
    on([task, idle, assigned], () => {
      setMaxAssignable(data, input);
    });
    on([task, index, assignable], (value) => {
      setMaxAssignable(data, input);
    });

    // bind assignable to max
    maxDiv.textContent = '/ ' + data[assignable];
    on([task, index, assignable], (value) => {
      maxDiv.textContent = '/ ' + value;
    });

    // bind assigned value to the title
    on([task, index, assigned], (value, diff) => {
      if (index !== idle) {
        const tip = getTip(data, value);
        taskName.querySelector('.tip').innerHTML = tip;
        div.querySelector('.tip').innerHTML = tip;
      }

      // keep track of the change in resource state to display
      // either a positive or negative change in the resource
      data[effects].map(([resourceIndex, resourceValue]) => {
        state.add([resource, resourceIndex, change, diff * resourceValue]);
      });
    });

    // add or subtract assigned skeletons
    input.addEventListener('change', (e) => {
      const numAssigned = data[assigned] ?? 0;
      const value = +input.value;
      const diff = value - numAssigned;

      state.add([task, index, assigned, diff])
      state.add([task, idle, assigned, -diff])
    });
  }

  // `tskInpG` is a global HTML id from index.html
  tskInpG.appendChild(div);
}

function getTip(data, value) {
  return data[effects].map(([resourceIndex, resourceValue]) => {
    return `
      <div>
        <span>${resources[resourceIndex][icon]}</span>
        <span>
          ${
            resourceValue > 0
              ? '+'
              // show -0
              : value === 0
                ? '-'
                : ''
          }${value * resourceValue} per ${RESOURCE_TICK / 60}s
        </span>
      </div>`;
  }).join('');
}

function setMaxAssignable(data, input) {
  input.setAttribute('max', Math.min(
    state.get([task, idle, assigned], 0) + (data[assigned] ?? 0),
    (data[assignable] ?? 0)
  ));
}

// function setResourceChange(data, value) {
//   data[effects].map(([resourceIndex, resourceValue]) => {
//     state.add([resource, resourceIndex, change, value * resourceValue]);
//   });
// }