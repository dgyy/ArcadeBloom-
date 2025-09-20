import { getGame } from './game';
import { createPatron } from './patron';
import { Point, Timer, playSound, pointsEq, randInArr } from './utils';

export interface SpawnOrchestrator {
  lvlTimer: Timer;
  start: (level: number, totalLevel: number) => void;
  stop: () => void;
  isDone: () => boolean;
  getRemaining: () => number;
  getMaxTime: () => number;
  update: () => void;
}

export const LEVEL_TIMER_MS = 60000 + 40000;

export const createSpawnOrchestrator = (): SpawnOrchestrator => {
  const personSpawnTimer1 = new Timer(1);
  const moleSpawnTimer1 = new Timer(1);
  let enabled = false;
  let level = 1;
  let spawned = 0;
  let totalToSpawn = 0;

  let moleSpawned = 0;
  let totalMoleToSpawn = 0;
  let spawnTimerOffset = 0;

  const calcSpawnRate = () =>
    1 +
    Math.random() *
      Math.min(
        7000,
        (((LEVEL_TIMER_MS + spawnTimerOffset) / 1.5 - 5000) *
          (1 - cl.lvlTimer.pct())) /
          2
      );

  const getSpawnTiles = () => {
    const game = getGame();

    return game.room.tiles.filter((tile) => {
      for (const p of game.room.spawns) {
        if (
          pointsEq(p, tile.slice(1) as Point) &&
          game.room.getTileLevel(tile) <= level
        ) {
          return true;
        }
      }
    });
  };

  const spawn = (type: 'person' | 'mole') => {
    const game = getGame();
    const spawnTiles = getSpawnTiles();

    let tile = randInArr(spawnTiles);
    let tx: number, ty: number;
    do {
      tx = tile[1];
      ty = tile[2];
      if (!game.getPatronAt(tx, ty)) {
        break;
      }
      const ind = spawnTiles.indexOf(tile);
      if (ind > -1) {
        spawnTiles.splice(spawnTiles.indexOf(tile), 1);
      }
      tile = randInArr(spawnTiles);
    } while (tile && spawnTiles.length > 0);

    if (!tile) {
      console.log('suppress person spawn no tile available');
      return false;
    }

    // don't spawn a person unless there is a table available for them
    if (type === 'person' && !game.tileOrch.isTileAvailable('Table')) {
      console.log('suppress person spawn no table available');
      return false;
    }

    const patron = createPatron(type, tx, ty);
    game.patrons.push(patron);
    return true;
  };

  const cl: SpawnOrchestrator = {
    lvlTimer: new Timer(LEVEL_TIMER_MS + spawnTimerOffset),
    // lvlTimer: new Timer(5000),
    start: (l: number, totalLevel: number) => {
      enabled = true;
      personSpawnTimer1.ms = 5000 + Math.random() * 5000;
      personSpawnTimer1.start();

      if (totalLevel > 5) {
        spawnTimerOffset += 1000;
      }

      cl.lvlTimer.ms = LEVEL_TIMER_MS + spawnTimerOffset;
      cl.lvlTimer.start();

      spawned = 0;
      totalToSpawn = 5 + Math.floor(totalLevel * 1.75);
      // totalToSpawn = totalLevel < 4 ? 1 : 5 + Math.floor(totalLevel * 1.75);
      totalMoleToSpawn = (() => {
        switch (true) {
          case [5, 7].includes(totalLevel):
            return 1;
          // case [6, 7].includes(totalLevel):
          //   return 2;
          case [9].includes(totalLevel):
            return 2;
          case totalLevel > 9:
            return 3;
          // case [1, 2].includes(totalLevel):
          default:
            return 0;
        }
      })();
      moleSpawnTimer1.ms =
        (LEVEL_TIMER_MS + spawnTimerOffset - 10000) /
        2 /
        (totalMoleToSpawn + 1);
      moleSpawnTimer1.start();
      moleSpawned = 0;
      level = l;
    },
    stop() {
      enabled = false;
    },
    isDone() {
      return spawned >= totalToSpawn;
    },
    getRemaining() {
      return totalToSpawn - spawned;
    },
    getMaxTime() {
      return cl.lvlTimer.ms;
    },
    update() {
      if (!enabled) {
        return;
      }
      if (this.isDone()) {
        return;
      }

      if (personSpawnTimer1.isDone()) {
        personSpawnTimer1.ms = calcSpawnRate();
        // personSpawnTimer1.ms = 500;
        personSpawnTimer1.start();
        if (spawn('person')) {
          spawned++;
        }
      }
      if (moleSpawnTimer1.isDone() && moleSpawned < totalMoleToSpawn) {
        // moleSpawnTimer1.ms = 15000;
        moleSpawnTimer1.start();
        if (spawn('mole')) {
          playSound('moleAlert');
          moleSpawned++;
        }
      }
    },
  };

  return cl;
};
