import { spawnDynamicBonus } from '../bonus-logic';
import { GameState, LevelConfig, BonusType, Position } from '../gameplay-types';
import {
  createMonster,
  createObstacle,
  createPlayer,
  createBonus,
  generateBaseState,
  generateBaseConfig,
} from '../level-generator';

const GRID_SIZE = 18;
const MIN_DISTANCE_FROM_PLAYER = 5;
const REQUIRED_MONSTER_COUNT = 13;

function getRandomPosition(): Position {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
}

function distanceBetween(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

function isPositionValid(pos: Position, state: GameState): boolean {
  return (
    !state.obstacles.some((obs) => obs.position.x === pos.x && obs.position.y === pos.y) &&
    !state.monsters.some((monster) => monster.position.x === pos.x && monster.position.y === pos.y) &&
    !state.bonuses.some((bonus) => bonus.position.x === pos.x && bonus.position.y === pos.y) &&
    pos.x !== state.player.position.x &&
    pos.y !== state.player.position.y
  );
}

function createPredefinedObstacles(): Position[] {
  return [
    { x: 4, y: 4 },
    { x: 4, y: 5 },
    { x: 5, y: 4 },
    { x: 13, y: 13 },
    { x: 13, y: 14 },
    { x: 14, y: 13 },
    { x: 4, y: 13 },
    { x: 5, y: 13 },
    { x: 4, y: 14 },
    { x: 13, y: 4 },
    { x: 14, y: 4 },
    { x: 13, y: 5 },
    { x: 8, y: 8 },
    { x: 9, y: 9 },
    { x: 10, y: 10 },
  ];
}

function createPredefinedBonuses(): { position: Position; type: BonusType }[] {
  return [
    { position: { x: 2, y: 2 }, type: BonusType.CapOfInvisibility },
    { position: { x: 15, y: 15 }, type: BonusType.Blaster },
    { position: { x: 2, y: 15 }, type: BonusType.TimeBomb },
    { position: { x: 15, y: 2 }, type: BonusType.Crusher },
    { position: { x: 9, y: 0 }, type: BonusType.Teleport },
    { position: { x: 0, y: 9 }, type: BonusType.Teleport },
    { position: { x: 17, y: 9 }, type: BonusType.Slide },
    { position: { x: 9, y: 17 }, type: BonusType.LandMine },
  ];
}

export const generateLevel = (): [GameState, LevelConfig, string] => {
  const state = generateBaseState();
  delete state.goal;
  const config = generateBaseConfig(GRID_SIZE, 13, 'The Chaos Nexus', updateDynamicLevel);

  state.player = createPlayer(0, 0);

  // Add predefined obstacles
  createPredefinedObstacles().forEach((pos) => {
    state.obstacles.push(createObstacle(pos.x, pos.y));
  });

  // Add predefined bonuses
  createPredefinedBonuses().forEach((bonus) => {
    state.bonuses.push(createBonus(bonus.position.x, bonus.position.y, bonus.type));
  });

  return [
    state,
    config,
    'Welcome to the Chaos Nexus! The path forward is shrouded in mystery. ' +
      'As chaos grows, so does the chance of escape. ' +
      'Remember, in this realm, 13 is not just an unlucky number - it might be your salvation. ' +
      'Can you decipher the true nature of this challenge and find your way out?',
  ];
};

const updateDynamicLevel = (state: GameState, levelConfig: LevelConfig): void => {
  // Spawn a new monster every 13 steps
  if (state.steps % 13 === 0 && state.spawnedMonsterCount < REQUIRED_MONSTER_COUNT) {
    let pos;
    do {
      pos = getRandomPosition();
    } while (!isPositionValid(pos, state) || distanceBetween(pos, state.player.position) < MIN_DISTANCE_FROM_PLAYER);
    state.monsters.push(createMonster(pos.x, pos.y));

    // Spawn a new bonus alongside the monster
    spawnDynamicBonus(state, levelConfig);
    spawnDynamicBonus(state, levelConfig);

    // Update spawn count and set a new hint
    state.spawnedMonsterCount++;
  }

  // Check if we have reached 13 monsters and reveal the exit if so
  if (state.spawnedMonsterCount >= REQUIRED_MONSTER_COUNT && !state.goal) {
    let exitPos;
    do {
      exitPos = getRandomPosition();
    } while (
      !isPositionValid(exitPos, state) ||
      distanceBetween(exitPos, state.player.position) < MIN_DISTANCE_FROM_PLAYER
    );
    state.goal = exitPos;
    state.activeBonuses.push({
      type: BonusType.Hint,
      tooltip: 'A path to victory has emerged!',
      tooltipPosition: exitPos,
    });
  }
};
