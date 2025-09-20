import { Camera } from "./camera.js";
import { ENEMY_SPRITE_SIZE } from "./consts.js";
import { EnemiesData } from "./enemies/enemies.js";
import { PlayerData } from "./player.js";
import { TowerData } from "./tower.js";
import { Collider, Vec2 } from "./utils.js";

/** @typedef {{size: Vec2; data: HTMLImageElement}} Sprite */

/** @type {HTMLImageElement} */
const wallSprite = document.querySelector("#sprite-wall");
/** @type {HTMLImageElement} */
const knightSprite = document.querySelector("#sprite-knight-1");
/** @type {HTMLImageElement} */
const enemySprite = document.querySelector("#sprite-enemy-1");

/**
 * @param {HTMLCanvasElement} canvas
 */
export function getGameState(canvas) {
  return {
    meta: {
      /** @type {'game' | 'main-menu' | 'pause' | 'defeat'} */
      stage: "main-menu",
    },
    time: {
      delta: 0,
      currentFrameTime: 0,
      startTime: -1,
    },
    input: {
      currentlyPressed: new Set(),
      /** @type {Map<string, {time: number}>} */
      wasPressedAt: new Map(),
      mouse: { x: 0, y: 0 },
      clicks: [],
      /** @type {{button: number | null}} */
      mousedown: { button: null },
    },
    rendering: {
      canvas,
      ctx: canvas.getContext("2d"),
      camera: new Camera(canvas),
    },
    entities: {
      positions: new Map([
        ["player", new Vec2(20, 20)],
        ["tower-down", new Vec2(0, -12)],
        ["tower-up", new Vec2(0, 12)],
      ]),
      enemies: new EnemiesData({
        spawns: [
          { x: -100, y: 100 },
          { x: 100, y: 100 },
          { x: -100, y: -100 },
          { x: 100, y: -100 },
        ],
      }),
      directions: new Map([["player", new Vec2(0, 0)]]),
      /** @type {Map<string, { startedAt: number; direction: Vec2; position: Vec2 }>} */
      performingAttack: new Map(),
      sprites: new Map([
        [
          "wall_",
          {
            data: wallSprite,
            size: new Vec2(8, 8),
          },
        ],
        [
          "enemy-1_",
          {
            data: enemySprite,
            size: new Vec2(ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE),
          },
        ],
        [
          "enemy-2_",
          {
            data: document.querySelector("#sprite-enemy-2"),
            size: new Vec2(ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE),
          },
        ],
        [
          "tower-down",
          {
            data: document.querySelector("#sprite-tower-down"),
            size: new Vec2(32, 24),
          },
        ],
        [
          "tower-up",
          {
            data: document.querySelector("#sprite-tower-up"),
            size: new Vec2(32, 24),
          },
        ],
        [
          "player-1",
          {
            data: knightSprite,
            size: new Vec2(ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE),
          },
        ],
        [
          "player-2",
          {
            data: document.querySelector("#sprite-knight-2"),
            size: new Vec2(ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE),
          },
        ],
        [
          "slash",
          {
            data: document.querySelector("#sprite-slash"),
            size: new Vec2(ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE),
          },
        ],
      ]),
      projectiles: {
        lastShotAt: null,
        /** @type {{pos: Vec2; direction: Vec2[]; active: boolean}[]} */
        positions: [],
      },
      tower: new TowerData(),
      player: new PlayerData(),
    },
    colliders: new Map([["tower-down", new Collider(-16, 0, 32, 24)]]),
    triggers: {
      "upper-tower": {
        collider: new Collider(-16, 24, 32, 24),
      },
    },
  };
}

/** @typedef {ReturnType<typeof getGameState>} GameState */
