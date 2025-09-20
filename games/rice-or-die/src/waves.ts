import { EnemyEntity } from './entities/enemy-entity.ts';

export type EnemyType = 'basicEnemy' | 'fasterEnemy';

export type Wave = {
  // Groups spawn all at once but "delay" can be used to control when groups spawn
  groups: Array<{
    type: EnemyType;
    x: number;
    y: number;
    count: number;
    // How many ticks between spawns
    interval: number;
    // How many ticks to wait until starting to spawn enemies
    delay: number;
  }>;
};

const getLineOfEnemies = (
  y: number,
  fasterCount: number,
  basicCount: number,
  delay: number,
  interval = 2,
): Wave['groups'] => {
  return [
    {
      type: 'fasterEnemy',
      x: 10,
      y,
      count: fasterCount,
      interval,
      delay: delay,
    },
    {
      type: 'basicEnemy',
      x: 10,
      y,
      count: basicCount,
      interval,
      delay: fasterCount * interval + delay,
    },
  ];
};

const enemyCreatorByEnemyType: Record<EnemyType, (x: number, y: number) => EnemyEntity> = {
  basicEnemy: (x: number, y: number) => {
    return {
      name: 'enemy',
      color: 'red',
      type: 'basicEnemy',
      gridX: x,
      gridY: y,
      stats: {
        hp: 10,
        attack: 2,
        speed: 1,
        defence: 2,
      },
      moveCd: 0,
    };
  },
  fasterEnemy: (x: number, y: number) => {
    return {
      name: 'enemy',
      color: 'hotpink',
      type: 'fasterEnemy',
      gridX: x,
      gridY: y,
      stats: {
        hp: 3,
        attack: 1,
        speed: 0,
        defence: 1,
      },
      moveCd: 0,
    };
  },
};

export const wave1: Wave = {
  groups: [
    {
      type: 'fasterEnemy',
      x: 10,
      y: 11,
      count: 5,
      interval: 2,
      delay: 0,
    },
    {
      type: 'fasterEnemy',
      x: 10,
      y: 17,
      count: 5,
      interval: 2,
      delay: 8,
    },
  ],
};

export const wave2: Wave = {
  groups: [
    {
      type: 'fasterEnemy',
      x: 10,
      y: 11,
      count: 9,
      interval: 2,
      delay: 0,
    },
    {
      type: 'fasterEnemy',
      x: 10,
      y: 17,
      count: 9,
      interval: 2,
      delay: 8,
    },
    {
      type: 'basicEnemy',
      x: 10,
      y: 11,
      count: 1,
      interval: 2,
      delay: 20,
    },
    {
      type: 'basicEnemy',
      x: 10,
      y: 17,
      count: 1,
      interval: 2,
      delay: 28,
    },
  ],
};

const wave3: Wave = {
  groups: [...wave2.groups, ...getLineOfEnemies(7, 9, 1, 15)],
};

const wave4: Wave = {
  groups: [
    ...getLineOfEnemies(7, 10, 0, 15),
    ...getLineOfEnemies(7, 0, 3, 0, 4),
    ...getLineOfEnemies(11, 11, 0, 17),
    ...getLineOfEnemies(11, 0, 4, 2, 4),
    ...getLineOfEnemies(17, 10, 0, 15),
    ...getLineOfEnemies(17, 0, 3, 0, 4),
  ],
};

const wave5: Wave = {
  groups: [
    ...getLineOfEnemies(7, 9, 0, 15),
    ...getLineOfEnemies(7, 0, 3, 0, 4),
    ...getLineOfEnemies(11, 9, 0, 17),
    ...getLineOfEnemies(11, 0, 4, 2, 4),
    ...getLineOfEnemies(17, 9, 0, 15),
    ...getLineOfEnemies(17, 0, 4, 0, 4),
    ...getLineOfEnemies(23, 9, 0, 15),
    ...getLineOfEnemies(23, 0, 3, 0, 4),
  ],
};

const wave6: Wave = {
  groups: [
    ...getLineOfEnemies(7, 9, 0, 15),
    ...getLineOfEnemies(7, 0, 6, 0, 4),
    ...getLineOfEnemies(11, 8, 0, 17),
    ...getLineOfEnemies(11, 0, 7, 2, 4),
    ...getLineOfEnemies(17, 8, 0, 15),
    ...getLineOfEnemies(17, 0, 7, 0, 4),
    ...getLineOfEnemies(23, 9, 0, 15),
    ...getLineOfEnemies(23, 0, 6, 0, 4),
  ],
};

const wave7: Wave = {
  groups: [
    ...getLineOfEnemies(4, 10, 0, 15),
    ...getLineOfEnemies(4, 0, 4, 0, 4),
    ...getLineOfEnemies(7, 10, 0, 15),
    ...getLineOfEnemies(7, 0, 4, 0, 4),
    ...getLineOfEnemies(11, 10, 0, 17),
    ...getLineOfEnemies(11, 0, 4, 2, 4),
    ...getLineOfEnemies(17, 10, 0, 15),
    ...getLineOfEnemies(17, 0, 4, 0, 4),
    ...getLineOfEnemies(23, 10, 0, 15),
    ...getLineOfEnemies(23, 0, 4, 0, 4),
  ],
};

const wave8: Wave = {
  groups: [
    ...getLineOfEnemies(4, 10, 0, 15),
    ...getLineOfEnemies(4, 0, 6, 0, 4),
    ...getLineOfEnemies(7, 10, 0, 15),
    ...getLineOfEnemies(7, 0, 6, 0, 4),
    ...getLineOfEnemies(11, 10, 0, 17),
    ...getLineOfEnemies(11, 0, 6, 2, 4),
    ...getLineOfEnemies(17, 10, 0, 15),
    ...getLineOfEnemies(17, 0, 6, 0, 4),
    ...getLineOfEnemies(23, 10, 0, 15),
    ...getLineOfEnemies(23, 0, 6, 0, 4),
  ],
};

const wave9: Wave = {
  groups: [
    ...getLineOfEnemies(4, 11, 0, 15),
    ...getLineOfEnemies(4, 0, 4, 0, 4),
    ...getLineOfEnemies(7, 11, 0, 15),
    ...getLineOfEnemies(7, 0, 4, 0, 4),
    ...getLineOfEnemies(11, 11, 0, 17),
    ...getLineOfEnemies(11, 0, 4, 2, 4),
    ...getLineOfEnemies(17, 11, 0, 15),
    ...getLineOfEnemies(17, 0, 4, 0, 4),
    ...getLineOfEnemies(20, 11, 0, 15),
    ...getLineOfEnemies(20, 0, 4, 0, 4),
    ...getLineOfEnemies(23, 11, 0, 15),
    ...getLineOfEnemies(23, 0, 4, 0, 4),
  ],
};

const wave10: Wave = {
  groups: [
    ...getLineOfEnemies(4, 0, 16, 0, 4),
    ...getLineOfEnemies(7, 0, 17, 0, 4),
    ...getLineOfEnemies(11, 0, 17, 2, 4),
    ...getLineOfEnemies(17, 0, 17, 0, 4),
    ...getLineOfEnemies(20, 0, 17, 0, 4),
    ...getLineOfEnemies(23, 0, 16, 0, 4),
  ],
};

export const waves = [wave1, wave2, wave3, wave4, wave5, wave6, wave7, wave8, wave9, wave10];

/**
 * Returns the new enemies that are spawned on this tick
 * @param waveNumber
 * @param originalWaveTick Ticks since start of wave (start at 0)
 */
export const getNextSpawns = (waveNumber: number, originalWaveTick: number): EnemyEntity[] => {
  if (waveNumber > waves.length) {
    console.log('No more waves remaining. You win, I guess.');
    return [];
  }
  const shouldSpawnEnemy = (spawn: Wave['groups'][number]) => {
    // Subtract delay from original tick value
    const tick = originalWaveTick - spawn.delay;
    return (
      tick >= 0 && // has passed delay
      tick % spawn.interval === 0 && // it's time to spawn
      spawn.count > tick / spawn.interval // there is still enemies to spawn
    );
  };
  const wave = waves[waveNumber - 1];
  const spawns = wave.groups.filter(shouldSpawnEnemy);
  const enemies = spawns.map((group) => {
    const createEnemyFn = enemyCreatorByEnemyType[group.type];
    return createEnemyFn(group.x, group.y);
  });

  return enemies;
};
