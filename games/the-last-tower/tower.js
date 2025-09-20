import { Collider, changeColliderAnchorToTopLeft, moveAlongDirection, set, vecLen, vecSub } from "./utils.js";
import Enemies from "./enemies/enemies.js";
import {
  ENEMY_SPRITE_SIZE,
  TOWER_PROJECTILE_DAMAGE,
  TOWER_PROJECTILE_INTERVAL,
  TOWER_PROJECTILE_INTERVAL_VARIANCE,
  TOWER_PROJECTILE_SPEED,
} from "./consts.js";
import { checkAxisAlignedRectanglesCollision } from "./collisions.js";
import { drawSprite } from "./sprites.js";

export class TowerData {
  // I could move tower projectiles data into here
  hp = 100;

  /**
   * @param {number} x
   */
  decreaseHP(x) {
    this.hp = Math.max(0, this.hp - x);
  }

  increaseHP(x) {
    this.hp = Math.min(this.hp + x, 100);
  }

  isDead() {
    return this.hp === 0;
  }
}

/**
 * @param {import("./gameState").GameState} gameState
 */
function towerTriggerCollisions(gameState) {
  const { triggers, entities } = gameState;
  const trigger = triggers["upper-tower"];
  const playerSpriteSize = entities.sprites.get("player-1").size;
  const posCenter = entities.positions.get("player");
  const colSize = playerSpriteSize.x / gameState.rendering.camera.zoom;
  const playerCol = changeColliderAnchorToTopLeft(new Collider(posCenter.x, posCenter.y, colSize, colSize));

  const enemyColliders = Enemies.getAliveItems(gameState).positions.map((p) =>
    changeColliderAnchorToTopLeft(new Collider(p.x, p.y, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE))
  );

  for (const c of [...enemyColliders, playerCol]) {
    if (checkAxisAlignedRectanglesCollision(trigger.collider, c)) {
      set(gameState.entities, "tower-up.isTransparent", true);
      break;
    } else {
      set(gameState.entities, "tower-up.isTransparent", false);
    }
  }
}

/**
 * @param {import("./gameState").GameState} gameState
 */
function checkProjectileCollisions(gameState) {
  const { projectiles, enemies, tower } = gameState.entities;

  const projCollider = new Collider(NaN, NaN, PROJECTILE_HIT_BOX_SIZE, PROJECTILE_HIT_BOX_SIZE);
  const enemyCollider = new Collider(NaN, NaN, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE);

  const enemiesPositions = Enemies.getPositions(gameState);
  for (const projectile of projectiles.positions.filter((x) => x.active)) {
    projCollider.pos = projectile.pos;
    for (let i = 0; i < enemiesPositions.length; i++) {
      const hp = enemies.hps.get(`enemy_${i}`);
      if (hp <= 0) continue;
      const enemyPos = enemiesPositions[i];
      enemyCollider.pos = enemyPos;
      const areColliding = checkAxisAlignedRectanglesCollision(projCollider, enemyCollider);

      if (!areColliding) continue;

      enemies.hps.set(`enemy_${i}`, hp - TOWER_PROJECTILE_DAMAGE * Math.max(tower.hp / 100, 0.6));
      projectile.active = false;
    }
  }
}

/**
 * @param {import("./gameState").GameState} gameState
 */
function shootTowerProjectile(gameState) {
  const { projectiles } = gameState.entities;
  projectiles.lastShotAt = gameState.time.currentFrameTime;

  const towerPos = { x: 0, y: 0 };
  const aliveEnemies = Enemies.getAliveItems(gameState).positions;
  let closestEnemy;
  for (const p of aliveEnemies) {
    const dist = vecLen(vecSub(p, towerPos));
    if (!closestEnemy) {
      closestEnemy = { p, dist };
      continue;
    }
    if (dist < closestEnemy.dist) {
      closestEnemy = { p, dist };
    }
  }

  if (!closestEnemy) return;

  const inactive = projectiles.positions.filter((x) => !x.active);

  if (inactive.length) {
    const projectile = inactive[0];
    projectile.pos.x = 0;
    projectile.pos.y = 0;
    projectile.active = true;
    projectile.direction.x = closestEnemy.p.x;
    projectile.direction.y = closestEnemy.p.y;
  } else {
    projectiles.positions.push({
      active: true,
      pos: { x: 0, y: 0 },
      direction: { x: closestEnemy.p.x, y: closestEnemy.p.y },
    });
  }
}

/**
 * @param {import("./gameState").GameState} gameState
 */
function updateTowerProjectiles(gameState) {
  const { projectiles } = gameState.entities;
  for (const p of projectiles.positions.filter((x) => x.active)) {
    moveAlongDirection(p.pos, p.direction, TOWER_PROJECTILE_SPEED * gameState.time.delta);
    if (!gameState.rendering.camera.isInViewport(p.pos)) {
      p.active = false;
    }
  }
}

function getRandomizedProjectileInterval() {
  return (
    Math.random() * TOWER_PROJECTILE_INTERVAL_VARIANCE * 2 +
    (TOWER_PROJECTILE_INTERVAL - TOWER_PROJECTILE_INTERVAL_VARIANCE / 2)
  );
}

/**
 * @param {import("./gameState").GameState} gameState
 */
function update(gameState) {
  const { projectiles, tower } = gameState.entities;

  if (!projectiles.lastShotAt && !tower.isDead()) {
    shootTowerProjectile(gameState);
    return;
  }

  if (
    gameState.time.currentFrameTime - projectiles.lastShotAt >= getRandomizedProjectileInterval() &&
    !tower.isDead()
  ) {
    shootTowerProjectile(gameState);
  }

  towerTriggerCollisions(gameState);
  updateTowerProjectiles(gameState);
  checkProjectileCollisions(gameState);
}

const PROJECTILE_HIT_BOX_SIZE = 2;

/**
 * @param {import("./gameState").GameState} gameState
 */
function draw(gameState) {
  const { ctx, camera } = gameState.rendering;
  const {
    projectiles: { positions: projectilePositions },
    sprites,
    positions,
    tower,
  } = gameState.entities;

  const towerUp = {
    sprite: sprites.get("tower-up"),
    pos: positions.get("tower-up"),
    entity: gameState.entities["tower-up"],
  };

  drawSprite(sprites.get("tower-down"), positions.get("tower-down"), gameState);

  if (towerUp.entity?.isTransparent) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    drawSprite(towerUp.sprite, towerUp.pos, gameState);
    ctx.restore();
  } else {
    drawSprite(towerUp.sprite, towerUp.pos, gameState);
  }

  ctx.fillStyle = "yellow";

  const wsize = PROJECTILE_HIT_BOX_SIZE;
  const ssize = wsize * camera.zoom;

  const onlyActive = projectilePositions.filter((x) => x.active);

  for (const p of onlyActive) {
    const spos = camera.worldToScreen(p.pos);

    // TODO: draw an arrow sprite
    ctx.beginPath();
    ctx.ellipse(spos.x + wsize / 2, spos.y + wsize / 2, ssize, ssize, 0, 0, 2 * Math.PI);
    ctx.fill();
  }

  const screenTowerUp = camera.worldToScreen(towerUp.pos);
  const screenTowerUpSize = towerUp.sprite.size.clone().scale(camera.zoom);
  const barHeight = 5;
  const yoffset = 5;
  const barWidth = screenTowerUpSize.x * 0.8;
  // hp bar
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.fillRect(
    screenTowerUp.x - barWidth / 2,
    screenTowerUp.y - screenTowerUpSize.y / 2 - barHeight - yoffset,
    barWidth,
    barHeight
  );

  const hpFrac = tower.hp / 100;

  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.fillRect(
    screenTowerUp.x - barWidth / 2,
    screenTowerUp.y - screenTowerUpSize.y / 2 - barHeight - yoffset,
    barWidth * hpFrac,
    barHeight
  );
}

export default {
  update,
  draw,
};
