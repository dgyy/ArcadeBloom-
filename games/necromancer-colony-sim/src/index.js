import init from './init.js';
import loop from './loop.js';
import { on } from './events.js';
import { built, necropolis } from './data/buildings.js';
import { building } from './data/state.js';
import Dialog from './ui/dialog.js';

init();
loop.start();

// game win condition
on([building, necropolis, built], () => {
  const winDialog = new Dialog();
  winDialog.head.innerHTML = '<b class="win">You Win!</b>';
  winDialog.open();
});