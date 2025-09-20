import { ENEMY_ATTACK_TIMEOUT, ENEMY_MOVEMENT_SPEED, ENEMY_SPRITE_SIZE } from "../consts.js";
import { Collider, Vec2, changeColliderAnchorToTopLeft, moveTowards, set, vecLen, vecSub } from "../utils.js";
import { getSprite } from "../sprites.js";
import { EnemySpawnData } from "./EnemySpawnData.js";
import { checkAxisAlignedRectanglesCollision, isColliding } from "../collisions.js";
import slash from "../slash.js";

/** @typedef {import('../gameState').GameState} GameState */

class EnemiesData {
  /** @type {Map<string,number>} */
  hps = new Map();
  poolSize = 0;
  /** key is a time in ms after which the spawn should be instantiated */
  futureSpawns = {
    20000: new Vec2(0, -110),
    50000: new Vec2(0, 110),
    90000: new Vec2(110, 0),
    140000: new Vec2(-110, 0),
  };

  /**
   * @param {{ spawns: Vec2[]}} params
   */
  constructor({ spawns = [] }) {
    this.spawns = spawns.map((p) => new EnemySpawnData(p.x, p.y));
  }
}

/**
 * @param {GameState} gameState
 * @param {Vec2} position
 * @param {Vec2} oldPos
 */
function isCollidingWithTower(gameState, position, oldPos) {
  const towerCollider = gameState.colliders.get("tower-down");
  return isColliding(position, oldPos, towerCollider);
}

/**
 * @param {Vec2} oldPosRef
 * @param {Vec2} newPos
 * @param {Vec2} collision
 */
function updatePositionAfterCollision(oldPosRef, newPos, collision) {
  if (!collision.x) oldPosRef.x = newPos.x;
  if (!collision.y) oldPosRef.y = newPos.y;
}

/**
 * @param {GameState} gameState
 * @param {Vec2} position
 */
function getChosenTarget(gameState, position) {
  const {
    entities: { positions, tower },
  } = gameState;

  let target = new Vec2(0, 0);
  const playerPos = positions.get("player");

  if (tower.isDead()) return playerPos;

  const playerDist = vecLen(vecSub(playerPos, position));

  if (playerDist < 50) target = playerPos;
  return target;
}

/**
 * @param {GameState} gameState
 * @param {number | string} enemyIdx
 * @param {string} target
 */
function attack(gameState, enemyIdx, target) {
  const {
    entities: { positions },
    time: { currentFrameTime },
  } = gameState;

  const enemyKey = `enemy_${enemyIdx}`;
  const lastAttackAt = gameState.entities[enemyKey]?.lastAttackAt;
  if (typeof lastAttackAt === "number" && currentFrameTime - lastAttackAt < ENEMY_ATTACK_TIMEOUT) {
    return false;
  }

  const targetPos = positions.get(target);
  const enemyPos = positions.get(enemyKey);
  const direction = targetPos.direction(enemyPos);
  set(gameState.entities, `${enemyKey}.lastAttackAt`, currentFrameTime);
  slash.perform(gameState, enemyKey, direction);
  return true;
}

/**
 * @param {GameState} gameState
 * @param {Vec2} enemyPos
 * @param {number} enemyIndex
 */
function isDeadByPlayersAttack(gameState, enemyPos, enemyIndex) {
  const {
    entities: {
      performingAttack,
      sprites,
      enemies: { hps },
      tower,
      player,
    },
    time: { currentFrameTime, delta },
  } = gameState;

  const key = `enemy_${enemyIndex}`;
  const hp = hps.get(key);
  const slashSprite = sprites.get("slash");
  const enemySprite = sprites.get("enemy-1_");
  const playerSlash = performingAttack.get("player");
  if (playerSlash && playerSlash.startedAt >= currentFrameTime - delta && !playerSlash.dmgProcessed) {
    const slashPos = playerSlash.position;
    const slashSize = slashSprite.size;
    if (
      checkAxisAlignedRectanglesCollision(
        changeColliderAnchorToTopLeft(new Collider(slashPos.x, slashPos.y, slashSize.x, slashSize.y)),
        changeColliderAnchorToTopLeft(new Collider(enemyPos.x, enemyPos.y, enemySprite.size.x, enemySprite.size.y))
      )
    ) {
      playerSlash.dmgProcessed = true;
      const newhp = hp - 20;
      hps.set(key, newhp);
      if (newhp <= 0) {
        tower.increaseHP(5 + Math.floor(Math.random() * 6));
        player.killed += 1;
        return true;
      }
    }
  }
  return false;
}

/**
 *
 * @param {GameState} gameState
 */
function instantiateNewSpawns(gameState) {
  const {
    entities: {
      enemies: { futureSpawns, spawns },
    },
    time: { currentFrameTime, startTime },
  } = gameState;

  for (const [time, pos] of Object.entries(futureSpawns)) {
    if (currentFrameTime - startTime >= Number(time)) {
      const len = spawns.push(new EnemySpawnData(pos.x, pos.y));
      spawns[len - 1].active = true;
      delete futureSpawns[time];
    }
  }
}

/**
 * @param {GameState} gameState
 */
function update(gameState) {
  const {
    entities: {
      enemies: { hps: enemiesHps, poolSize },
      positions,
      sprites,
      tower,
      player,
    },
    time: { delta, currentFrameTime },
  } = gameState;

  instantiateNewSpawns(gameState);

  const playerPos = positions.get("player");
  const playerSprite = sprites.get("player-1");

  // Iterating through all enemies instead of alive ones, because I need to know the indices.
  // I mght store the indices in the getAliveItems returned object.
  for (let i = 0; i < poolSize; i++) {
    const key = `enemy_${i}`;
    const enemyPos = positions.get(key);
    const hp = enemiesHps.get(key);
    if (hp <= 0) continue;

    const target = getChosenTarget(gameState, enemyPos);
    let newPos = enemyPos.clone();
    const speed = tower.isDead() ? ENEMY_MOVEMENT_SPEED * 1.4 : ENEMY_MOVEMENT_SPEED;
    moveTowards(newPos, target, ENEMY_MOVEMENT_SPEED * delta);

    if (isDeadByPlayersAttack(gameState, newPos, i)) {
      continue;
    }

    const collidingWithPlayer = isColliding(
      newPos,
      enemyPos,
      changeColliderAnchorToTopLeft(new Collider(playerPos.x, playerPos.y, playerSprite.size.x, playerSprite.size.y))
    );

    if (collidingWithPlayer.x || collidingWithPlayer.y) {
      if (attack(gameState, i, "player")) {
        player.decreaseHp(4);
        player.lastAttackedAt = currentFrameTime;
      }
    }

    set(gameState.entities, `${key}.target`, target);

    const colliding = isCollidingWithTower(gameState, newPos, enemyPos);
    if (colliding.x || colliding.y) {
      if (!tower.isDead() && attack(gameState, i, "tower-down")) tower.decreaseHP(1);
    }

    colliding.x = collidingWithPlayer.x || colliding.x;
    colliding.y = collidingWithPlayer.y || colliding.y;

    // check collisiions with other enemies
    for (let j = 0; j < poolSize; j++) {
      if (i == j) continue;
      const jenemyKey = `enemy_${j}`;
      if (enemiesHps.get(jenemyKey) <= 0) {
        continue;
      }
      const otherEnemyPos = positions.get(jenemyKey);
      const collider = changeColliderAnchorToTopLeft(
        new Collider(otherEnemyPos.x, otherEnemyPos.y, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE)
      );
      const otherEnemyCollision = isColliding(newPos, enemyPos, collider);
      colliding.x = otherEnemyCollision.x || colliding.x;
      colliding.y = otherEnemyCollision.y || colliding.y;
      if (colliding.x && colliding.y) break;
    }

    updatePositionAfterCollision(enemyPos, newPos, colliding);
  }
}

/**
 * @param {GameState} gameState
 */
function draw(gameState) {
  const {
    time: { currentFrameTime },
  } = gameState;
  const { enemies, positions } = gameState.entities;
  const { hps, poolSize } = enemies;
  const { camera, ctx } = gameState.rendering;

  const sEnemySize = ENEMY_SPRITE_SIZE * camera.zoom;
  const unit = camera.zoom;

  for (let i = 0; i < poolSize; i++) {
    const key = `enemy_${i}`;
    const hp = hps.get(key);
    if (hp <= 0) continue;
    const position = positions.get(key);
    const sposition = camera.worldToScreen(position);

    const sprites = [getSprite("enemy-1_", gameState), getSprite("enemy-2_", gameState)];
    if (enemies[`enemy_${i}`]?.lastSpriteSwitchAt === undefined) {
      set(enemies, `enemy_${i}.lastSpriteSwitchAt`, currentFrameTime);
    }

    if (
      enemies[`enemy_${i}`]?.lastSpriteSwitchAt &&
      currentFrameTime - enemies[`enemy_${i}`]?.lastSpriteSwitchAt >= 200
    ) {
      set(enemies, `enemy_${i}.lastSpriteSwitchAt`, currentFrameTime);
      set(enemies, `enemy_${i}.currentSpriteIndex`, ((enemies[`enemy_${i}`]?.currentSpriteIndex || 0) + 1) % 2);
    }
    const sprite = sprites[enemies[`enemy_${i}`]?.currentSpriteIndex || 0];

    const dir = position.direction(gameState.entities[key]?.target || new Vec2(0, 0));
    ctx.save();
    ctx.translate(sposition.x, sposition.y);
    ctx.scale(Math.sign(dir.x) || 1, 1);
    ctx.drawImage(
      sprite.data,
      0,
      0,
      sprite.data.naturalWidth,
      sprite.data.naturalHeight,
      (-sprite.size.x * unit) / 2,
      (-sprite.size.y * unit) / 2,
      sprite.size.x * unit,
      sprite.size.y * unit
    );
    ctx.restore();
    // drawSprite(sprite, position, gameState);

    const spos = camera.worldToScreen(position);

    // debug
    // {
    //   ctx.fillStyle = "white";
    //   ctx.fillText(`enemy_${i}`, spos.x, spos.y - sEnemySize / 2 - hpBarHeight - 1);
    // }

    const hpBar = {
      width: sEnemySize * 0.7,
      height: 4,
      yoffset: 5,
    };

    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(
      spos.x - hpBar.width / 2,
      spos.y - sEnemySize / 2 - hpBar.height - hpBar.yoffset,
      hpBar.width,
      hpBar.height
    );

    const hpFrac = hp / 100;

    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(
      spos.x - hpBar.width / 2,
      spos.y - sEnemySize / 2 - hpBar.height - hpBar.yoffset,
      hpBar.width * hpFrac,
      hpBar.height
    );

    slash.draw(gameState, `enemy_${i}`);
  }
}

/**
 * @param {GameState} gameState
 */
function getAliveItems(gameState) {
  const {
    enemies: { hps, poolSize },
    positions,
  } = gameState.entities;

  let result = {
    positions: [],
    hps: [],
  };

  for (let i = 0; i < poolSize; i++) {
    const key = `enemy_${i}`;
    const hp = hps.get(key);
    if (hp <= 0) continue;

    result.positions.push(positions.get(key));
    result.hps.push(hp);
  }

  return result;
}

/**
 * @param {GameState} gameState
 * @param {Vec2} position
 */
function createNew(gameState, position) {
  const { enemies, positions } = gameState.entities;

  let foundKey = -1;
  for (const [k, hp] of enemies.hps) {
    if (hp <= 0) {
      foundKey = k;
      break;
    }
  }

  if (foundKey === -1) {
    enemies.poolSize += 1;
    const key = `enemy_${enemies.poolSize - 1}`;
    positions.set(key, position.clone());
    enemies.hps.set(key, 100);
    return;
  }

  positions.set(foundKey, position.clone());
  enemies.hps.set(foundKey, 100);
}

/**
 * @param {GameState} gameState
 */
function getPositions(gameState) {
  const {
    entities: { positions },
  } = gameState;

  return [...positions.entries()].filter(([k]) => k.startsWith("enemy_")).map(([, v]) => v);
}

export default {
  draw,
  getAliveItems,
  createNew,
  update,
  getPositions,
};

export { EnemiesData };
