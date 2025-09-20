import state, { settlement } from '../data/state.js';
import Dialog from './dialog.js';
import { generateLocations } from '../combat/attack-settlement.js';
import { name } from '../data/settlements.js';
import { icon } from '../data/resources.js';

class SettlementDialog extends Dialog {
  constructor() {
    super({
      cancel: 'Cancel'
    });
  }

  open(data, callback) {
    const locations = generateLocations(data);
    this.head.innerHTML = `Select a ${data[name]} to attack`;
    this.body.innerHTML = `
      <div>Enemy Army</div>
      <div>Reward</div>
      <div></div>
      ${
        locations.map(location => {
          return `
            <div>
              ${
                location
                  .map((amount, unitIndex) => {
                    return amount
                      ? `<div class="unit">${amount}</div>`
                      : ''
                  }).join('')
              }
            </div>
            <div></div>
            <button class="ok">Attack</button>
          `;
        }).join('')
      }
    `;

    super.open();
  }
}

const settlementDialog = new SettlementDialog();
window.settlementDialog = settlementDialog;
export default settlementDialog;