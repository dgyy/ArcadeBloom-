import { TILE_WIDTH, SPRITE_WIDTH } from './constants';
import { seed, perlin2 } from "./lib/Perlin";
import { Graph } from "./lib/AStar";
import { createCanvasContext } from './lib/Canvas';
import { Unit } from './units/Unit';
import { Tree } from './env/Tree';
import { Pine } from './env/Pine';
import { Grass } from './env/Grass';
import { Rock } from './env/Rock';
import { DeadTree } from './env/DeadTree';
import { Bush } from './env/Bush';
import { Swordman } from './units/Swordman';

export class Game {
  #entities = [];
  #grid = undefined;
  #map = undefined;
  #env = [];
  #envCanvas = undefined;
  #worldCanvas = undefined;
  #graph = null;

  #isDraging = false;
  #mapOffset = [0, 0];
  #mouseOffset = [0, 0];
  #clipOffset = 400;
  #clipDelta = [400, 400];

  /**
   * Main game class
   * @param {HTMLCanvasElement} canvas
   * @param {number} gridSize
   */
  constructor(canvas) {
    seed(parseInt(Math.random()*100+50, 10));
    // seed(100);
    window.addEventListener('resize', this.resize.bind(this));
    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    canvas.addEventListener('touchstart', this.handleMouseDown.bind(this));
    canvas.addEventListener('touchmove', this.handleMouseMove.bind(this));
    canvas.addEventListener('touchend', this.handleMouseUp.bind(this));
    this.resize();
  }

  resize() {
    const width = parseInt(window.innerWidth, 10);
    const height = parseInt(window.innerHeight, 10);

    canvas.style.width = width;
    canvas.style.height = height;
    canvas.style.cursor = 'crosshair';

    const { context } = createCanvasContext(width, height, canvas);
    this.renderer = context;

    if(Math.abs(this.#mapOffset[0]) > this.#clipDelta[0])
      this.#clipDelta[0] = this.#clipDelta[0] + this.#clipOffset;

    if(Math.abs(this.#mapOffset[1]) > this.#clipDelta[1])
      this.#clipDelta[1] = this.#clipDelta[1] + this.#clipOffset;
      
    this.#prepareMap(width + this.#clipDelta[0], height + this.#clipDelta[1]);      

    // Draw cached world
    const { canvas: worldCanvas, context: worldContext } = createCanvasContext(width + this.#clipDelta[0], height + this.#clipDelta[1], this.#worldCanvas);
    this.#worldCanvas = worldCanvas;
    this.#drawWorld(worldContext);


    const { canvas: envCanvas, context: envContext } = createCanvasContext(width + this.#clipDelta[0], height + this.#clipDelta[1], this.#envCanvas);
    this.#envCanvas = envCanvas;
    this.#drawEnvironment(envContext);
  }

  handleMouseDown(e) {
    const pageX = e.pageX ?? e.changedTouches[0].pageX;
    const pageY = e.pageY ?? e.changedTouches[0].pageY;
    this.mouseX = Math.floor(pageX / SPRITE_WIDTH);
    this.mouseY = Math.floor(pageY / SPRITE_WIDTH);
    this.#isDraging = true;
    this.#mouseOffset = [pageX - this.#mapOffset[0], pageY - this.#mapOffset[1]];
  }

  handleMouseUp() {
    this.#isDraging = false;

    if (Math.abs(this.#mapOffset[0]) > this.#clipDelta[0] || Math.abs(this.#mapOffset[1]) > this.#clipDelta[1])
      this.resize();

    this.handleClickEvent();
  }

  /**
   * Handle mouse move
   * @param {MouseEvent | TouchEvent} e 
   */
  handleMouseMove(e) {
    const pageX = e.pageX ?? e.changedTouches[0].pageX;
    const pageY = e.pageY ?? e.changedTouches[0].pageY;

    this.mouseX = Math.floor(pageX / SPRITE_WIDTH);
    this.mouseY = Math.floor(pageY / SPRITE_WIDTH);

    if (this.#isDraging) {
      this.#mapOffset = [pageX - this.#mouseOffset[0], pageY - this.#mouseOffset[1]]
      if (this.#mapOffset[0] >= 0) this.#mapOffset[0] = 0;
      if (this.#mapOffset[1] >= 0) this.#mapOffset[1] = 0;
    }

    /* if (DEBUG) {
      const offsetX = Math.floor(Math.abs(this.#mapOffset[0]/SPRITE_WIDTH)) + this.mouseX;
      const offsetY = Math.floor(Math.abs(this.#mapOffset[1]/SPRITE_WIDTH)) + this.mouseY;
      document.getElementById('debug').innerHTML = `[${this.mouseX},${this.mouseY}] [${offsetX},${offsetY}] (${this.#grid?.[this.mouseY]?.[this.mouseX]}, ${this.#map?.[this.mouseY*4]?.[this.mouseX*4]})`;
    } */
  }

  /**
   * Handle user click
   */
  handleClickEvent() {
    const allied = this.#entities.filter((entity) => entity.type === 'ally');

    const offsetX = Math.floor(Math.abs(this.#mapOffset[0]/SPRITE_WIDTH)) + this.mouseX;
    const offsetY = Math.floor(Math.abs(this.#mapOffset[1]/SPRITE_WIDTH)) + this.mouseY;

    const targets = this.#findTargetRegion(offsetX, offsetY, allied.length, this.#grid);
    
    for (const entity of allied) {
      const [x, y] = targets.shift();
      entity.move(x, y);
    }
  }

  createMatrix(height, width, fill, matrix) {
    if (!matrix) {
      const expandedMatrix =Array.from(Array(height), () => new Array(width).fill(fill));
      return expandedMatrix;
    }

    const initY = matrix.length;
    const diffY = height - initY;
    
    const initX = matrix[0].length;
    const diffX = width - initX

    for (let y=0; y<initY; y++) {
      for (let x=initX; x<initX + diffX; x++) {
        if (!matrix[y]) matrix[y] = [];
        matrix[y][x] = fill;
      }
    }

    for (let y=initY; y<initY + diffY; y++) {
      for (let x=0; x<initX; x++) {
        if (!matrix[y]) matrix[y] = [];
        matrix[y][x] = fill;
      }
    }

    for (let y=initY; y<initY + diffY; y++) {
      for (let x=initX; x<initX + diffX; x++) {
        if (!matrix[y]) matrix[y] = [];
        matrix[y][x] = fill;
      }
    }
  
    return matrix;
  }

  #prepareMap(width, height) {
    const initX = this.#map?.[0]?.length ?? 0;
    const initY = this.#map?.length ?? 0;

    this.#grid = this.createMatrix(Math.floor(height / SPRITE_WIDTH), Math.floor(width / SPRITE_WIDTH), 1, this.#grid);
    this.#map = this.createMatrix(Math.ceil(height / TILE_WIDTH), Math.ceil(width / TILE_WIDTH), 0, this.#map);

    const getPerlinValue = (x, y) => (perlin2(x / 40, y / 40) * 100) + 10; 

    const w = Math.ceil(width / TILE_WIDTH);
    const h = Math.ceil(height / TILE_WIDTH);
    const diffX = w - initX;
    const diffY = h - initY;
    
    for (let y=0; y<initY; y++) {
      for (let x=initX; x<initX + diffX; x++) {
        const perlinValue = getPerlinValue(x, y);
        this.#map[y][x] = perlinValue;
        this.#spawn(x, y, perlinValue);
      }
    }

    for (let y=initY; y<initY + diffY; y++) {
      for (let x=0; x<initX; x++) {
        const perlinValue = getPerlinValue(x, y);
        this.#map[y][x] = perlinValue;
        this.#spawn(x, y, perlinValue);
      }
    }

    for (let y=initY; y<initY + diffY; y++) {
      for (let x=initX; x<initX + diffX; x++) {
        const perlinValue = getPerlinValue(x, y);
        this.#map[y][x] = perlinValue;
        this.#spawn(x, y, perlinValue);
      }
    }

    this.#graph = new Graph(this.#grid, { diagonal: true });
    for(const entity of this.#entities) 
      entity.bind(this.#graph, this.#entities);
  }

  #spawn(x, y, perlinValue) {
    const gradY = Math.floor(y/TILE_WIDTH);
    const gradX = Math.floor(x/TILE_WIDTH);
    if (gradY < this.#grid.length && gradX < this.#grid[0].length) {
      if (perlinValue < -40) {
        this.#grid[gradY][gradX] = 0;
      }
      if (perlinValue > 40) {
        this.#grid[gradY][gradX] = perlinValue;
      }      
      
      if(perlinValue >= 20 && perlinValue <= 20.4) {
        this.#env.push(new Grass(gradX, gradY, 'light'));
      }
      if(perlinValue <= -15 && perlinValue >= -15.5) {
        this.#env.push(new Grass(gradX, gradY));
      }
      if(perlinValue >= 39 && perlinValue <= 39.05) {
        this.#env.push(new Rock(gradX, gradY));
      }
      if(perlinValue >= 11 && perlinValue <= 11.05) {
        this.#grid[gradY][gradX] = 0;
        this.#env.push(new DeadTree(gradX, gradY));
      }
      if(perlinValue >= 20 && perlinValue <= 20.05) {
        this.#grid[gradY][gradX] = 0;
        this.#env.push(new Bush(gradX, gradY));
      }
      if((perlinValue <= -15 && perlinValue >= -15.05) || (perlinValue <= -33 && perlinValue >= -33.08)) {
        this.#grid[gradY][gradX] = 0;
        this.#env.push(new Pine(gradX, gradY));
      }
      if((perlinValue <= -24 && perlinValue >= -24.05) || (perlinValue >= 0 && perlinValue <= 0.08)) {
        this.#grid[gradY][gradX] = 0;
        this.#env.push(new Tree(gradX, gradY));
      }

      if (
        (perlinValue >= 1 && perlinValue <= 1.002) ||
        (perlinValue >= 1.1 && perlinValue <= 1.12)
        ) {
        this.#spawnEnemy(gradX, gradY);
      }
    }
  }

  get grid() {
    return this.#grid;
  }

  addObstacle(x, y) {
    this.#grid[y][x] = 0;
  }

  add(entity) {
    if (entity instanceof Unit) {
      this.#entities.push(entity);
      entity.bind(this.#graph, this.#entities);
    }
  }

  #spawnEnemy(x, y) {
    const rand = () => Math.floor(Math.random() * 10);
    const generate = (n, gridLen) => ((grad) => (grad >= gridLen) ? gridLen - 1 : grad )(rand() + n)

    const gridLenX = this.#grid[0].length;
    const gridLenY = this.#grid.length;
    const paths = Array(rand() + 2).fill(null).map(() => [generate(x, gridLenX), generate(y, gridLenY)]);

    const enemy = new Swordman(x, y, 'enemy');
    enemy.patrol(...paths);

    this.#entities.push(enemy);
  }

  #drawCursor(x, y) {
    this.renderer.beginPath();
    this.renderer.ellipse(x * SPRITE_WIDTH + SPRITE_WIDTH / 2, y * SPRITE_WIDTH + SPRITE_WIDTH / 2, SPRITE_WIDTH / 2, SPRITE_WIDTH / 2, 0, 0, 2 * Math.PI);
    this.renderer.fillStyle = 'rgba(255, 255, 255, .5)';
    this.renderer.fill();
    this.renderer.strokeStyle = 'rgba(0, 0, 0, .5)';
    this.renderer.stroke();
    this.renderer.closePath();
  }

  /**
   * Main loop
   * @param {number} timestamp 
   */
  loop(timestamp) {
    this.renderer.clearRect(0, 0, this.renderer.canvas.clientWidth, this.renderer.canvas.clientHeight); 
    this.renderer.drawImage(this.#worldCanvas, -this.#mapOffset[0] * 2, -this.#mapOffset[1] * 2, 2 * this.renderer.canvas.clientWidth, 2 * this.renderer.canvas.clientHeight, 0, 0, this.renderer.canvas.clientWidth, this.renderer.canvas.clientHeight);
    this.renderer.drawImage(this.#envCanvas, -this.#mapOffset[0] * 2, -this.#mapOffset[1] * 2, 2 * this.renderer.canvas.clientWidth, 2 * this.renderer.canvas.clientHeight, 0, 0, this.renderer.canvas.clientWidth, this.renderer.canvas.clientHeight);
    // this.#drawCollisions(this.renderer);
    for(const entity of this.#entities) {
      if (entity.step) entity.step(timestamp);
      if (entity.draw) entity.draw(this.renderer, this.#mapOffset);
    }
    this.#drawCursor(this.mouseX, this.mouseY);
    window.requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Draw world
   * @param {CanvasRenderingContext2D} ctx 
   */
  #drawWorld(ctx) {
    const gridHeight = this.#map.length;
    const gridWidth = this.#map[0].length;
    const color = (value) => {
      if (value <= -60) return '#0b1660';
      if (value > -60 && value <= -50) return '#16247f';
      if (value > -50 && value <= -40) return '#2e40b2';
      if (value > -40 && value <= -25) return '#0b753e';
      if (value >- 25 && value <= 0) return '#15913c';
      if (value > 0 && value <= 30) return '#7b9b36';
      if (value > 30 && value <= 50) return '#9ca092';
      if (value > 50 && value <= 60) return '#c0c9ad';
      if (value > 60 && value <= 70) return '#FFFFFF';
      return '#FFFFFF';
    }
    for (let y=0; y<gridHeight; y++) {
      for (let x=0; x<gridWidth; x++) {
        ctx.fillStyle = color(this.#map[y][x]);
        ctx.fillRect(x*TILE_WIDTH, y*TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
      }
    }
  }

  #drawEnvironment(ctx) {
    const len = this.#env.length;
    for (let i=0; i<len; i++) {
      this.#env[i].draw(ctx)
    }
  }

  /**
   * Draw game collisions
   * @param {CanvasRenderingContext2D} ctx 
   */
  #drawCollisions(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    for (let y=0; y<this.#grid.length; y++) {
      for (let x=0; x<this.#grid[0].length; x++) {
        if (this.#grid[y][x] === 0) {
          ctx.fillRect(this.#mapOffset[0]+x*SPRITE_WIDTH, this.#mapOffset[1]+y*SPRITE_WIDTH, SPRITE_WIDTH, SPRITE_WIDTH);
        }
      }
    }
  }

  #findTargetRegion(x, y, entitiesLength, grid) {
    const spiralDirections = [
      [0, 1],  // right
      [1, 0],  // down
      [0, -1], // left
      [-1, 0]  // up
    ];
  
    let currentRow = y;
    let currentCol = x;
    let directionIndex = 0;
    let stepsCount = 1;
    let stepsTaken = 0;
    
    const selectedNodes = [];
  
    while (selectedNodes.length < entitiesLength) {
      if (currentRow >= 0 && currentCol >= 0 && currentRow < grid.length && currentCol < grid[0].length && grid[currentRow][currentCol] > 0) {
        selectedNodes.push([currentCol, currentRow]);
      }
  
      currentRow += spiralDirections[directionIndex][0];
      currentCol += spiralDirections[directionIndex][1];
      stepsTaken++;
  
      if (stepsTaken === stepsCount) {
        stepsTaken = 0;
        directionIndex = (directionIndex + 1) % 4;
        if (directionIndex % 2 === 0) {
          stepsCount++;
        }
      }
    }
  
    return selectedNodes;    
  }
}