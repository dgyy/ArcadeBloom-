import 'globals.ts';
import { Grid } from 'grid';
import {
  getEnemiesState,
  getPlayerState,
  getState,
  getSystemState,
  getTowersState,
  resetState,
  updateEnemiesState,
  updatePlayerState,
  updateSystemState,
  updateTowersState,
} from 'state';
import { isEnemy, moveEnemy } from './entities/enemy-entity.ts';
import { renderUi } from './ui/main-ui.ts';
import { makeTower, shootTowersTick } from './entities/tower-entity.ts';
import { getNextSpawns } from './waves.ts';
import { isInsideVillage } from './entities/village.ts';
import { renderEndScreen } from 'ui/end-screen.ts';

export const grid = new Grid();

export const initEntities = () => {
  const towers1 = [...Array(8)].map((_, index) => makeTower(18, 12 + 1 * index));
  const towers2 = [...Array(7)].map((_, index) => makeTower(25, 8 + 1 * index));
  almostSurroundVillageTest();
  updateTowersState([...getTowersState(), ...towers1, ...towers2]);
};

// TODO for testing
export const almostSurroundVillageTest = () => {
  // make towers around village almost surrounding it
  const towers3 = [...Array(8)].map((_, index) => makeTower(37, 10 + 1 * index));
  updateTowersState([...getTowersState(), ...towers3]);
  const towers4 = [...Array(5)].map((_, index) => makeTower(38 + 1 * index, 9));
  updateTowersState([...getTowersState(), ...towers4]);
  const towers5 = [...Array(5)].map((_, index) => makeTower(38 + 1 * index, 19));
  updateTowersState([...getTowersState(), ...towers5]);
};

const sleep = async () => {
  do {
    await new Promise((resolve) => setTimeout(resolve, window.wait));
    // Keep waiting if pause variable is set
  } while (window.pause);
};

/**
 * Run game systems that make up the game logic. I.e. run ticks.
 */
export const runGameSystems = () => {
  if (getPlayerState().life <= 0) {
    resetState();
    grid.genEls();
    renderEndScreen(grid, 'You lost. Your country is ruined and burned!');
    return;
  }

  // Move enemies
  updateEnemiesState(getEnemiesState().map((e) => moveEnemy(e)));
  // Deal damage if enemies reach village
  getEnemiesState().forEach((enemy, enemyIndex) => {
    if (isInsideVillage(enemy.gridX, enemy.gridY)) {
      // Remove the enemy
      updateEnemiesState(getEnemiesState().filter((_, eIndex) => eIndex !== enemyIndex));
      updatePlayerState({ ...getPlayerState(), life: getPlayerState().life - enemy.stats.attack });
      // Render UI so the value actually updates
      renderUi(grid);
    }
  });

  // Spawn enemies
  if (getState().system.waveStarted) {
    const newEnemies = getNextSpawns(getSystemState().wave, getSystemState().timer);
    if (newEnemies.length > 0) {
      updateEnemiesState([...getEnemiesState(), ...newEnemies]);
    }
  }
  // Remove enemies if they die
  updateEnemiesState(
    getEnemiesState().filter((enemy) => {
      if (enemy.stats.hp <= 0) {
        const enemyBounty = enemy.type === 'fasterEnemy' ? 15 : 30;
        updatePlayerState({ ...getPlayerState(), rice: getPlayerState().rice + enemyBounty });
        renderUi(grid);
        return false;
      }
      return true;
    }),
  );
  // Reset enemies as not taking damage
  updateEnemiesState(
    getEnemiesState().map((entity) => {
      return isEnemy(entity) ? { ...entity, takingDamage: false } : entity;
    }),
  );

  // Shoot towers
  shootTowersTick();

  if (
    getEnemiesState().length === 0 &&
    getSystemState().waveStarted &&
    getSystemState().wave < 10
  ) {
    // Wave is over
    updatePlayerState({
      ...getPlayerState(),
      rice: getPlayerState().rice + 100 * getSystemState().wave,
    });
    updateSystemState({ ...getSystemState(), waveStarted: false });
    updateSystemState({ ...getSystemState(), wave: getSystemState().wave + 1 });
    console.log('Wave over');
    renderUi(grid);
  }

  if (
    getEnemiesState().length === 0 &&
    getSystemState().waveStarted &&
    getSystemState().wave >= 10
  ) {
    // game is over logic
    updateSystemState({ ...getSystemState(), waveStarted: false });
    renderEndScreen(grid, 'Invaders chased away! Victory is yours! ');
    return;
  }

  const system = getSystemState();
  // Update timer
  updateSystemState({ ...system, timer: system.timer + 1 });
  // Debug
  window.state = getState();
};

export const runGameLoop = async () => {
  for (;;) {
    runGameSystems();
    if (!getSystemState().showingEndScreen) {
      grid.genEls();
    }
    await sleep();
  }
};

renderUi(grid);
runGameLoop();
