import { ENEMY_SPRITE_SIZE } from "./consts.js";
import { Collider, Vec2, changeColliderAnchorToTopLeft } from "./utils.js";

/**
 * @param {import('./utils').Collider} a
 * @param {import('./utils').Collider} b
 */
export function checkAxisAlignedRectanglesCollision(a, b) {
  // Two rectangles A and B DO NOT overlap, when:
  // - A.right < B.left
  // - and A.bottom > B.top
  // in cartesian system
  if (a.pos.x + a.size.x < b.pos.x || a.pos.y - a.size.y > b.pos.y) return false;

  // do a check with A and B swapped
  if (b.pos.x + b.size.x < a.pos.x || b.pos.y - b.size.y > a.pos.y) return false;

  return true;
}

/**
 * @param {Vec2} newPos
 * @param {Vec2} oldPos
 * @param {Collider} collider
 */
export function isColliding(newPos, oldPos, collider) {
  const colliderx = changeColliderAnchorToTopLeft(
    new Collider(newPos.x, oldPos.y, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE)
  );
  const collidery = changeColliderAnchorToTopLeft(
    new Collider(oldPos.x, newPos.y, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE)
  );
  const collidesx = checkAxisAlignedRectanglesCollision(collider, colliderx);
  const collidesy = checkAxisAlignedRectanglesCollision(collider, collidery);

  return { x: collidesx, y: collidesy };
}
