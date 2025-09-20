import Enemies from "./enemies.js";

/** @typedef {import('../gameState').GameState} GameState */

/**
 * @param {GameState} gameState
 */
function update(gameState) {
  const { spawns } = gameState.entities.enemies;
  const { currentFrameTime } = gameState.time;

  for (const spawn of spawns) {
    if (!spawn.active) continue;

    if (spawn.lastSpawnAt === undefined || currentFrameTime - spawn.lastSpawnAt >= spawn.interval) {
      Enemies.createNew(gameState, spawn.position);
      spawn.lastSpawnAt = currentFrameTime;
    }
  }
}

export default {
  update,
};
