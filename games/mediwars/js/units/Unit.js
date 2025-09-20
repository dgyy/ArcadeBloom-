import { SPRITE_WIDTH } from "../constants";
import { astar } from "../lib/AStar";
import { createCanvasContext } from '../lib/Canvas';

/**
 * @typedef { 'ally' | 'enemy' } UnitType
 */

export class Unit {
  /** @type {UnitType} */
  type = null;
  name = null;

  #path = [];
  #stepCount = 0;
  shiftEvery = 8;

  #patrol = [];
  #patrolIndex = 0;

  health = 5;
  opponent = undefined;
  turn = undefined;
  hold = false;

  sprite = {};
  #step = 0;
  #cached = [];
  get colors() {};

  /**
   * 
   * @param {number} x initial X position 
   * @param {number} y initial Y postion
   * @param {UnitType} type initial unit type
   */
  constructor(x, y, type = 'ally') {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  bind(graph, entities) {
    this.graph = graph;
    this.entities = entities;
  }

  move(x, y) {
    this.#stepCount = 0;
    this.#path = astar.search(this.graph, this.graph.getNode(Math.ceil(this.x), Math.ceil(this.y)), this.graph.getNode(x, y));
  }

  /**
   * Frame update
   */
  step() {
    // Collisions
    const enemyHit = this.collideWithEnemy(Math.round(this.x), Math.round(this.y));
    if (enemyHit) {
      enemyHit.hold = true;
      enemyHit.opponent = this;
      this.hold = true;
      this.opponent = enemyHit;
    }

    // Fight
    if (this.opponent) {
      const hit = Math.round(Math.random()*10) > 6
      if (hit) {
        this.opponent.health--;
        if (this.opponent.health <= 0) {
          this.opponent.opponent = undefined;
          this.opponent.hold = false;
          this.hold = false;

          // Converts into an ally
          if (this.opponent.type === 'enemy' && Math.floor(Math.random()*10) > 5) {
            this.opponent.stop();
            this.opponent.shiftEvery = this.shiftEvery;
            this.opponent.type = 'ally';

            if (this.opponent.clearCache) 
              this.opponent.clearCache();

          // Dead
          } else {
            const index = this.entities.findIndex((e) => e === this.opponent);
            this.entities.splice(index, 1);
          }
          
          if (this.opponent.name === 'King') {
            document.getElementById('gameover').showModal();
            return;
          }

          this.opponent = undefined;
        }
      }
    }

    // Move
    if (this.#path.length && !this.hold) {
      this.x = this.x + ((this.#path[0].x - this.x) / this.shiftEvery) * this.#stepCount;
      this.y = this.y + ((this.#path[0].y - this.y) / this.shiftEvery) * this.#stepCount;

      this.#stepCount++;
      if (this.#stepCount % this.shiftEvery === 0) {
        this.#path.shift();
      }
      if (this.#stepCount >= this.shiftEvery) {
        this.#stepCount = 0;
      }

      return;
    }

    // Patrol
    if (this.#patrol.length && !this.hold) {
      const [x, y] = this.#patrol[this.#patrolIndex];
      this.move(x, y);
      this.#patrolIndex++;

      if (this.#patrolIndex >= this.#patrol.length) {
        this.#patrolIndex = 0;
      }
    }
  }

  patrol(...positions) {
    this.shiftEvery = 12;
    this.#patrol = [[this.x, this.y], ...positions];
  }
  
  stop() {
    this.#patrol = [];
    if (this.#path.length) {
      this.#stepCount = 7;
      this.#path = [this.#path[0]];
    }
  }

  collideWithEnemy(x, y) {
    return this.entities.find((enemy) => {
      const enemyX = Math.round(enemy.x);
      const enemyY = Math.round(enemy.y)
      return this.type !== enemy.type &&
        (this.opponent === undefined && enemy.opponent === undefined) &&
        (
          (x + 1 === enemyX && y === enemyY) ||
          (x - 1 === enemyX && y === enemyY) ||
          (x === enemyX && y + 1 === enemyY) ||
          (x === enemyX && y - 1 === enemyY)
        );
    });
  }
  
  /**
   * Draw on game world
   * @param {CanvasRenderingContext2D} ctx canvas context
   * @param {number[]} offset camera offset
   */
  draw(ctx, offset) {
    this.#step++;
    const state = Math.floor(this.#step/40) % this.sprite.idle.length;
    if (this.#step >= 80) this.#step = 0;

    if (this.#cached[state]) {
      ctx.drawImage(this.#cached[state], 0, 0, SPRITE_WIDTH * 2, SPRITE_WIDTH * 2, this.x * SPRITE_WIDTH + offset[0], this.y * SPRITE_WIDTH + offset[1], SPRITE_WIDTH, SPRITE_WIDTH);
      return;
    }
    
    const { canvas, context } = createCanvasContext(SPRITE_WIDTH, SPRITE_WIDTH);
    const len = this.sprite.idle[state].length;
    for (let y=0; y<len; y++) {
      for (let x=0; x<len; x++) {
        context.fillStyle = this.colors[this.sprite.idle[state][y][x]];
        context.fillRect(x, y, 1, 1);
      }
    }

    this.#cached[state] = canvas;    
  }

  /**
   * Repaint this sprite
   * Usefull for an enemy converting into ally
   */
  clearCache() {
    this.#cached = [];
  }
}