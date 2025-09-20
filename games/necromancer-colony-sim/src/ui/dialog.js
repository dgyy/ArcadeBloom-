import { html } from '../utils.js';
import loop from '../loop.js';

export default class Dialog {
  constructor({
    confirm,
    cancel
  } = {}) {
    const dialog = this.dialog = html(`
      <dialog>
        <div class="head"></div>
        <div class="body"></div>
        <div class="foot"></div>
      </dialog>
    `);
    const footer = dialog.querySelector('.foot');
    this.head = dialog.querySelector('.head');
    this.body = dialog.querySelector('.body');

    if (cancel) {
      const cancelButton = html(`<button>${cancel}</button>`);
      cancelButton.addEventListener('click', () => this.onClose(0));
      footer.appendChild(cancelButton);
    }

    if (confirm) {
      const confirmButton = html(`<button class="ok">${confirm}</button>`);
      confirmButton.addEventListener('click', () => this.onClose(1));
      footer.appendChild(confirmButton);
    }

    document.body.appendChild(dialog);
  }

  open(text, callback) {
    loop.stop();
    this.prevElm = document.activeElement;

    if (text) {
      this.body.innerHTML = `<p>${text}</p>`;
    }

    this.dialog.showModal();
    this._callback = callback;
  }

  close(how) {
    loop.start();
    this.dialog.close();
    this.prevElm.focus();

    if (how) {
      this._callback?.();
    }
  }

  onClose(how) {
    this.close(how);
  }
}
window.Dialog = Dialog;