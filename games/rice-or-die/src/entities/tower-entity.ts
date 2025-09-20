import { Entity } from './entity.ts';
import { EnemyEntity } from './enemy-entity.ts';
import {
  getEnemiesState,
  getPlayerState,
  getTowersState,
  updateEnemiesState,
  updatePlayerState,
  updateTowersState,
} from '../state.ts';
import { renderUi } from '../ui/main-ui.ts';
import { grid } from '../main.ts';

export type TowerType = 'Peasant' | 'Tower' | 'Rice Farmer' | 'Creeper';
export const units: Readonly<TowerType[]> = ['Peasant', 'Tower', 'Rice Farmer', 'Creeper'] as const;

export const UnitPrices: { [key in TowerType]: number } = {
  ['Rice Farmer']: 900,
  ['Peasant']: 100,
  ['Tower']: 400,
  ['Creeper']: 200,
};

export const AttackPower: { [key in TowerType]: number } = {
  ['Rice Farmer']: 0,
  ['Peasant']: 1,
  ['Tower']: 3,
  ['Creeper']: 2,
};

export const TowerRange: { [key in TowerType]: number } = {
  ['Rice Farmer']: 0,
  ['Peasant']: 1,
  ['Tower']: 6,
  ['Creeper']: 3,
};

export const TowerCd: { [key in TowerType]: number } = {
  ['Rice Farmer']: 20,
  ['Peasant']: 4,
  ['Tower']: 5,
  ['Creeper']: 1,
};

export const UpdatePaths: {
  [key in TowerType]: {
    name: string;
    price: number;
    stats: { attack: number; range: number; cd: number };
  }[];
} = {
  ['Rice Farmer']: [
    { name: 'Rice plantation', price: 800, stats: { attack: 0, range: 0, cd: 20 } },
  ],
  ['Peasant']: [
    { name: 'Samurai', price: 400, stats: { attack: 4, range: 2, cd: 3 } },
    { name: 'Archer', price: 350, stats: { attack: 1, range: 5, cd: 3 } },
  ],
  ['Tower']: [{ name: 'Stone pagoda', price: 600, stats: { attack: 8, range: 7, cd: 3 } }],
  ['Creeper']: [{ name: 'Ninja', price: 350, stats: { attack: 2, range: 4, cd: 0 } }],
};

const sprites = {
  ['Peasant']: `url('./t2.png')`,
  ['Tower']: `url('./t1.png')`,
  ['Rice Farmer']: `url('./t3.png')`,
  ['Creeper']: `url('./t4.png')`,
};

export type TowerEntity = Entity & {
  name: TowerType;
  stats: {
    attack: number;
    range: number;
    cd: number;
  };
  selected: boolean;
  shootCd: number;
  class?: string;
  // Position of target that tower is shooting at
  targetPosition?: { x: number; y: number };
};

export const isTower = (entity: Entity): entity is TowerEntity =>
  units.includes(entity.name as TowerType);

export const renderTower = (entity: TowerEntity, element: HTMLDivElement) => {
  element.style.background = 'transparent';
  element.style.backgroundImage = sprites[entity.name];
  element.style.backgroundSize = 'cover';
  if (entity.selected) element.style.border = '1px solid gold';
};

export const shootTowersTick = () => {
  getTowersState().forEach((tower, index) => {
    shootTargetInRange(tower, index);
  });
};

// Shoots and damages enemy in range (if any).
// Updates entity state of shot enemy and tower.
export const shootTargetInRange = (tower: TowerEntity, towerIndex: number) => {
  const newTowers = getTowersState();
  if (tower.shootCd > 0) {
    newTowers[towerIndex] = { ...tower, shootCd: tower.shootCd - 1 };
    updateTowersState(newTowers);
    return;
  }
  if (tower.name === 'Rice Farmer') {
    // Add rice to player
    const newPlayer = getPlayerState();
    newPlayer.rice += tower.class ? 100 : 50;
    updatePlayerState(newPlayer);
    newTowers[towerIndex] = { ...tower, shootCd: tower.stats.cd };
    updateTowersState(newTowers);
    renderUi(grid);
    return;
  }

  const enemies = getEnemiesState();
  const shotEnemyIndex = enemies.findIndex((enemy) => {
    // Distance is grid distance. Difference of X and Y coordinates added together
    const distance = Math.abs(enemy.gridX - tower.gridX) + Math.abs(enemy.gridY - tower.gridY);
    return distance <= tower.stats.range && enemy.stats.hp > 0;
  });
  const newEnemies = getEnemiesState();
  if (shotEnemyIndex > -1) {
    const shotEnemy = enemies[shotEnemyIndex];
    const newTower: TowerEntity = {
      ...tower,
      targetPosition: { x: shotEnemy.gridX, y: shotEnemy.gridY },
      shootCd: tower.stats.cd,
    };
    newTowers[towerIndex] = newTower;
    const newEnemy: EnemyEntity = {
      ...shotEnemy,
      stats: { ...shotEnemy.stats, hp: shotEnemy.stats.hp - tower.stats.attack },
      takingDamage: true,
    };
    newEnemies[shotEnemyIndex] = newEnemy;
  } else {
    // No target was shot. Set tower as not shooting
    const newTower: TowerEntity = {
      ...tower,
      targetPosition: undefined,
    };
    newTowers[towerIndex] = newTower;
  }
  updateEnemiesState(newEnemies);
  updateTowersState(newTowers);
};

export const makeTower = (x: number, y: number, type: TowerType = 'Tower'): TowerEntity => {
  return {
    color: 'purple',
    gridX: x,
    gridY: y,
    name: type,
    selected: false,
    stats: {
      attack: AttackPower[type],
      range: TowerRange[type],
      cd: TowerCd[type],
    },
    shootCd: 0,
  };
};
