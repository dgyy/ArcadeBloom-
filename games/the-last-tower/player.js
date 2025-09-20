import { checkAxisAlignedRectanglesCollision } from "./collisions.js";
import { PLAYER_AUTOHEAL_TIMEOUT, PLAYER_HEAL_INTERVAL, PLAYER_SPEED } from "./consts.js";
import slash from "./slash.js";
import { Collider, Vec2 } from "./utils.js";

export class PlayerData {
  hp = 100;
  lastAttackedAt = 0;
  lastHealAt = 0;
  killed = 0;

  decreaseHp(x) {
    this.hp = Math.max(this.hp - x, 0);
  }

  increaseHp(x) {
    this.hp = Math.min(this.hp + x, 100);
  }

  isDead() {
    return this.hp === 0;
  }
}

/**
 * @param {import("./gameState").GameState} gameState
 */
function getPlayerCollider(gameState) {
  const {
    entities: { positions, sprites },
  } = gameState;
  const pos = positions.get("player");
  const sprite = sprites.get("player-1");
  return new Collider(pos.x, pos.y, sprite.size.x, sprite.size.y);
}

/**
 * @param {import("./gameState").GameState} gameState
 */
function movement(gameState) {
  const {
    input,
    entities,
    time: { delta, currentFrameTime },
  } = gameState;
  const { positions, sprites, directions, player } = entities;
  const { currentlyPressed: keyboard } = input;
  let xaxis = keyboard.has("KeyA") ? -1 : keyboard.has("KeyD") ? 1 : 0;
  let yaxis = keyboard.has("KeyW") ? 1 : keyboard.has("KeyS") ? -1 : 0;

  if (!xaxis && !yaxis) return;

  if (player.lastSpriteSwitchAt === undefined) {
    player.lastSpriteSwitchAt = currentFrameTime;
  }

  if (player.lastSpriteSwitchAt && currentFrameTime - player.lastSpriteSwitchAt >= 200) {
    player.lastSpriteSwitchAt = currentFrameTime;
    player.currentSpriteIndex = ((player.currentSpriteIndex || 0) + 1) % 2;
  }

  let x = xaxis * PLAYER_SPEED * delta,
    y = yaxis * PLAYER_SPEED * delta;

  if (x && y) {
    x /= 1.41;
    y /= 1.41;
  }

  const pdir = directions.get("player");
  pdir.x = xaxis;
  pdir.y = yaxis;
  directions.set("player", pdir.normalize());

  const posCenter = positions.get("player");

  const tmpx = posCenter.x + x;
  const tmpy = posCenter.y + y;

  let isCollidingx = false;
  let isCollidingy = false;

  // const wallSpriteSize = sprites.get("wall_").size;
  /** @type {Vec2} */
  const playerSpriteSize = sprites.get("player-1").size;
  const psizeHalf = playerSpriteSize.x / 2;

  const colliders = gameState.colliders.values();
  const pcolliderx = new Collider(tmpx - psizeHalf, posCenter.y + psizeHalf, playerSpriteSize.x, playerSpriteSize.y);
  const pcollidery = new Collider(posCenter.x - psizeHalf, tmpy + psizeHalf, playerSpriteSize.x, playerSpriteSize.y);
  for (const collider of colliders) {
    isCollidingx ||= checkAxisAlignedRectanglesCollision(collider, pcolliderx);
    isCollidingy ||= checkAxisAlignedRectanglesCollision(collider, pcollidery);
  }

  if (!isCollidingx) posCenter.x += x;
  if (!isCollidingy) posCenter.y += y;
}

/**
 * @param {import("./gameState").GameState} gameState
 */
function update(gameState) {
  const {
    input: { mousedown, mouse },
    rendering: { camera },
    entities: { positions, player },
    time: { currentFrameTime },
  } = gameState;

  if (
    currentFrameTime - player.lastAttackedAt >= PLAYER_AUTOHEAL_TIMEOUT &&
    player.lastHealAt + PLAYER_HEAL_INTERVAL <= currentFrameTime
  ) {
    player.increaseHp(3);
    player.lastHealAt = currentFrameTime;
  }

  movement(gameState);

  const playerPos = positions.get("player");
  if (mousedown.button == 0) {
    const wmouse = camera.screenToWorld(mouse);
    const direction = new Vec2(wmouse.x, wmouse.y).sub(playerPos).normalize();
    slash.perform(gameState, "player", direction);
  }
}

/**
 * @param {import("./gameState").GameState} gameState
 */
function draw(gameState) {
  const {
    entities: { sprites, positions, player },
    input: { mouse },
    rendering: { ctx, camera },
    time: { currentFrameTime },
  } = gameState;

  const unit = camera.zoom;

  const playerSprites = [sprites.get("player-1"), sprites.get("player-2")];

  const sprite = playerSprites[player.currentSpriteIndex || 0];

  // const sprite = sprites.get("player-1");
  const wmouse = camera.screenToWorld(mouse);
  const playerPos = positions.get("player");
  const splayerPos = camera.worldToScreen(playerPos);
  const dir = playerPos.direction(wmouse);
  ctx.save();
  ctx.translate(splayerPos.x, splayerPos.y);
  ctx.scale(Math.sign(dir.x), 1);
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
  slash.draw(gameState, "player");

  const hpBar = {
    width: sprite?.size.x * camera.zoom * 0.7,
    height: 4,
    yoffset: -6,
  };
  const hpPos = {
    x: splayerPos.x - hpBar.width / 2,
    y: splayerPos.y - (sprite?.size.y * camera.zoom) / 2 - hpBar.height - hpBar.yoffset,
  };

  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.fillRect(hpPos.x, hpPos.y, hpBar.width, hpBar.height);

  const hpFrac = player.hp / 100;

  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.fillRect(hpPos.x, hpPos.y, hpBar.width * hpFrac, hpBar.height);
}

export default {
  getCollider: getPlayerCollider,
  update,
  draw,
};
