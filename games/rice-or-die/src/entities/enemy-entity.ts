import { Entity, Stats } from 'entities/entity';
import { getState } from 'state.ts';
import { pathfind } from 'pathfinding';
import { getVillageCoordinates } from './village.ts';

export type EnemyEntity = Entity & {
  name: 'enemy';
  stats: Stats;
  type: string;
  // Is it taking damage this tick
  takingDamage?: boolean;
  // Cooldown on moving. If it's 0 the unit can move. It's set to 'speed' value after moving
  moveCd: number;
};

export const isEnemy = (entity: Entity): entity is EnemyEntity => entity.name === 'enemy';

export const renderEnemy = (entity: EnemyEntity, element: HTMLDivElement) => {
  element.style.background = 'transparent';
  element.style.backgroundImage =
    entity.type === 'fasterEnemy' ? `url('./e1.png')` : `url('./e2.png')`;
  element.style.backgroundSize = 'cover';
  if (entity.takingDamage) {
    element.style.backgroundColor = 'orange';
  }
  if (entity.stats.hp <= 0) {
    element.style.backgroundColor = 'black';
  }
};

/**
 * Moves entity if it's enemy
 */
export const moveEnemy = (enemy: EnemyEntity): EnemyEntity => {
  if (enemy.stats.hp <= 0) {
    return enemy;
  }
  if (enemy.moveCd > 0) {
    return { ...enemy, moveCd: enemy.moveCd - 1 };
  }
  const path = pathfind({ x: enemy.gridX, y: enemy.gridY }, getVillageCoordinates(), getState());
  if (!path) {
    console.error("Enemy couldn't find any path to village and is mighty confused!");
    return enemy;
  }
  if (path.length === 1) {
    // Were at the goal
    console.log('Enemy reached the goal');
    return enemy;
  }
  return {
    ...enemy,
    // Next step is the second element of path
    gridX: path[1].x,
    gridY: path[1].y,
    moveCd: enemy.stats.speed,
  };
};
