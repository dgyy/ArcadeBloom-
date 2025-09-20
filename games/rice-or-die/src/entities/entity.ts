import { isEnemy, renderEnemy } from './enemy-entity.ts';
import { isTower, renderTower } from './tower-entity.ts';

export type Stats = {
  hp: number;
  attack: number;
  defence: number;
  // Speed is delay between moves. Lower is faster. 0 means entity moves every tick
  speed: number;
};

export type Entity = {
  gridY: number;
  gridX: number;
  color: string;
  name?: string;
};

export const renderEntity = (entity: Entity, parent: HTMLDivElement) => {
  const element = document.createElement('div');
  element.style.backgroundColor = entity.color;
  element.style.gridArea = `${entity.gridY}/${entity.gridX}`;
  element.style.width = '30px';
  element.style.height = '30px';
  element.style.justifySelf = 'center';
  element.style.alignSelf = 'center';
  parent.appendChild(element);
  if (isEnemy(entity)) {
    renderEnemy(entity, element);
  }
  if (isTower(entity)) {
    renderTower(entity, element);
  }
  return element;
};
