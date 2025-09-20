/**
 * @param {import("./gameState").GameState} gameState
 */
function drawColliders(gameState) {
  const {
    colliders,
    triggers,
    rendering: { ctx, camera },
  } = gameState;

  ctx.strokeStyle = "red";
  for (const c of Object.values(colliders)) {
    // const anchored = changeColliderAnchorToTopLeft(c);
    const sp = camera.worldToScreen(c.pos);
    const ssize = c.size.clone().scale(camera.zoom);
    ctx.strokeRect(sp.x, sp.y, ssize.x, ssize.y);
  }
}

/**
 *
 * @param {import("./gameState").GameState} gameState
 * @returns
 */
function getOserveEnemyPool(gameState) {
  const interval = 1000;
  let lastLog = 0;
  return () => {
    if (gameState.time.currentFrameTime - lastLog >= interval) {
      console.log("enemies pool count:", gameState.entities.enemies.poolSize);
      lastLog = gameState.time.currentFrameTime;
    }
  };
}

export default {
  drawColliders,
  getOserveEnemyPool,
};
