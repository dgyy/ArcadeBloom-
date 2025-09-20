import { CRATE } from './db';
import { Game, getGame } from './game';
import { Room } from './room';
import { SpawnOrchestrator } from './spawnOrchestrator';
import { Timer } from './utils';

export interface LevelOrchestrator {
  level: number;
  reset(): void;
  incScore(): void;
  incLevel(): void;
  addCrateBonus(): void;
  getScore(): [number, number, number];
  getTotalLevel(): number;
  isLevelComplete(game: Game, spawnOrch: SpawnOrchestrator): boolean;
}

export const createLevelOrchestrator = (): LevelOrchestrator => {
  let totalScore = 0;
  let scoreThisRound = 0;
  let subLevel = 0;
  let totalLevel = 0;
  // const levelTimer = new Timer(LEVEL_TIMER_MS);

  const countCrates = () => {
    const room = getGame().room;
    return room.tiles.reduce((total, tile) => {
      if (tile[0] === CRATE && room.getTileLevel(tile) <= totalLevel) {
        return total + 1;
      }
      return total;
    }, 0);
  };

  const cl: LevelOrchestrator = {
    level: 1,
    reset() {
      totalScore = 0;
      scoreThisRound = 0;
      cl.level = 1;
      subLevel = 0;
      totalLevel = 1;
    },
    incScore() {
      scoreThisRound++;
      totalScore++;
    },
    incLevel() {
      const level = cl.level;
      if ((subLevel === 0 && level >= 2 && level <= 6) || cl.level > 6) {
        subLevel++;
      } else {
        subLevel = 0;
        cl.level++;
      }
      totalLevel++;
      scoreThisRound = 0;
      // levelTimer.start();
    },
    addCrateBonus() {
      totalScore += countCrates();
    },
    getScore() {
      return [scoreThisRound, countCrates(), totalScore];
    },
    getTotalLevel() {
      return totalLevel;
    },
    isLevelComplete(game: Game, spawnOrch: SpawnOrchestrator) {
      return (
        spawnOrch.isDone() && !game.patrons.find((p) => p.type === 'person')
      );
    },
  };

  return cl;
};
