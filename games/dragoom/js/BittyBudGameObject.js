export default class BittyBudGameObject {
  #game;
  #cellX;
  #cellY;
  #gameObjectID;
  #isMoving = false;
  #movingDirection;
  #movingProgress = 0;
  #spriteID;

  #isIgnited = false;
  #dieAfterFrames;
  #aliveFrames = 1;

  #tickBetweenMovesInterval = 60;
  #ticksUntilNextMove;

  #currentAnimation;
  #currentAnimationFrame;

  // Only animate every 6 frames
  #animationFrameProgress;
  #animationFrameLimit = 4;

  #animations = {
    IDLE: [
      "BITTY_BUD_IDLE_1",
      "BITTY_BUD_IDLE_2",
      "BITTY_BUD_IDLE_1",
      "BITTY_BUD_IDLE_1",
      "BITTY_BUD_IDLE_1",
      "BITTY_BUD_IDLE_1",
      "BITTY_BUD_IDLE_1",
      "BITTY_BUD_IDLE_1",
      "BITTY_BUD_IDLE_1",
      "BITTY_BUD_IDLE_1",
    ],
    IDLE_HOTT: ["BITTY_BUD_IDLE_1", "BITTY_BUD_IDLE_2"],
    IDLE_DOWN: ["BITTY_BUD_DOWN_WALK_1"],
    IDLE_UP: ["BITTY_BUD_UP_WALK_1"],
    IDLE_LEFT: ["BITTY_BUD_LEFT_WALK_1"],
    IDLE_RIGHT: ["BITTY_BUD_RIGHT_WALK_1"],
    WAVE: [
      "BITTY_BUD_WAVE_1",
      "BITTY_BUD_WAVE_2",
      "BITTY_BUD_WAVE_3",
      "BITTY_BUD_WAVE_4",
    ],
    WALK_DOWN: [
      "BITTY_BUD_DOWN_WALK_1",
      "BITTY_BUD_DOWN_WALK_2",
      "BITTY_BUD_DOWN_WALK_1",
      "BITTY_BUD_DOWN_WALK_3",
    ],
    WALK_UP: [
      "BITTY_BUD_UP_WALK_1",
      "BITTY_BUD_UP_WALK_2",
      "BITTY_BUD_UP_WALK_1",
      "BITTY_BUD_UP_WALK_3",
    ],
    WALK_LEFT: [
      "BITTY_BUD_LEFT_WALK_1",
      "BITTY_BUD_LEFT_WALK_2",
      "BITTY_BUD_LEFT_WALK_1",
      "BITTY_BUD_LEFT_WALK_3",
    ],
    WALK_RIGHT: [
      "BITTY_BUD_RIGHT_WALK_1",
      "BITTY_BUD_RIGHT_WALK_2",
      "BITTY_BUD_RIGHT_WALK_1",
      "BITTY_BUD_RIGHT_WALK_3",
    ],
  };

  constructor(game, cellX, cellY) {
    this.#game = game;
    this.#cellX = cellX;
    this.#cellY = cellY;
    this.#gameObjectID = Math.random().toString(36).substring(7);

    this.#ticksUntilNextMove = this.#tickBetweenMovesInterval;
    this.#setAnimation("IDLE");
  }

  get gameObjectID() {
    return this.#gameObjectID;
  }

  isBlocking() {
    return true;
  }

  isGameOver() {
    return true;
  }

  isAt(cellX, cellY) {
    return this.#cellX === cellX && this.#cellY === cellY;
  }

  ignite({ dieAfterFrames = 90 } = {}) {
    this.#isIgnited = true;
    this.#ticksUntilNextMove = 0;
    this.#dieAfterFrames = dieAfterFrames;
    this.#aliveFrames = 1;
  }

  isIgnited() {
    return this.#isIgnited;
  }

  extinguish() {
    this.#isIgnited = false;
    this.#ticksUntilNextMove = 0;
  }

  getRenderState() {
    const s = [
      {
        position: [this.#cellX, this.#cellY],
        moving: this.#isMoving ? this.#movingDirection : null,
        movingProgress: this.#isMoving ? this.#movingProgress : null,
        zIndex: this.#cellY * this.#game.zIndexSize + 1,
        offsetY: -3,
        spriteID: this.#spriteID,
      },
    ];

    this.#updateAnimationProgress();

    return s;
  }

  update() {
    if (
      this.#isIgnited &&
      ++this.#aliveFrames > this.#dieAfterFrames &&
      !this.#isMoving
    ) {
      this.#game.removeGameObject(this.gameObjectID, [
        this.#cellX,
        this.#cellY,
      ]);
    }

    if (this.#isMoving) {
      this.#movingProgress += this.#isIgnited ? 0.1 : 0.05;

      if (this.#movingProgress >= 1) {
        // Done moving
        this.#movingProgress = 0;
        this.#isMoving = false;
        if (this.#movingDirection === "LEFT") {
          this.#cellX -= 1;
        } else if (this.#movingDirection === "RIGHT") {
          this.#cellX += 1;
        } else if (this.#movingDirection === "UP") {
          this.#cellY -= 1;
        } else if (this.#movingDirection === "DOWN") {
          this.#cellY += 1;
        }
        this.#setAnimation(`IDLE_${this.#movingDirection}`);
      }
    } else {
      this.#tickAIMove();
    }

    this.#spriteID =
      this.#animations[this.#currentAnimation][this.#currentAnimationFrame];

    if (this.#isIgnited) {
      this.#spriteID = this.#spriteID.replace("BITTY_BUD", "BITTY_BUD_HOTT");
    }
  }

  #tickAIMove() {
    if (this.#ticksUntilNextMove > 0) {
      this.#ticksUntilNextMove -= 1;
      return;
    }

    // Randomly decide to move or wave or be idle and do nothing
    const actions = [
      "MOVE",
      "MOVE",
      "MOVE",
      "MOVE",
      "MOVE",
      "IDLE",
      "IDLE",
      "IDLE",
      "IDLE",
      "WAVE",
    ];
    const action = actions[Math.floor(Math.random() * actions.length)];

    if (action === "MOVE") {
      this.#handleAIMove();
    } else if (action === "WAVE") {
      this.#setAnimation("WAVE");
    } else if (action === "IDLE") {
      this.#setAnimation("IDLE");
    }

    this.#ticksUntilNextMove = this.#isIgnited
      ? this.#tickBetweenMovesInterval / 3
      : this.#tickBetweenMovesInterval;
  }

  #setAnimation(animation) {
    if (this.#currentAnimation === animation) {
      return;
    }

    // Super Hacky, but I like the hott ones to just flicker when idle
    // so this will change IDLE_{DIRECTION} to IDLE_HOTT
    if (this.#isIgnited && animation.startsWith("IDLE")) {
      animation = "IDLE_HOTT";
    }

    this.#currentAnimation = animation;
    this.#currentAnimationFrame = 0;
    this.#animationFrameProgress = this.#animationFrameLimit;
  }

  #updateAnimationProgress() {
    if (this.#animationFrameProgress > 0) {
      this.#animationFrameProgress -= this.#isIgnited ? 1.5 : 1;
      return;
    }

    this.#animationFrameProgress = this.#animationFrameLimit;
    this.#currentAnimationFrame += 1;
    if (
      this.#currentAnimationFrame >=
      this.#animations[this.#currentAnimation].length
    ) {
      this.#currentAnimationFrame = 0;
    }
  }

  #handleAIMove() {
    // get a random direction
    const directions = ["LEFT", "RIGHT", "UP", "DOWN"];
    const direction = directions[Math.floor(Math.random() * directions.length)];

    // simulate if moving that direction is out of bound / possible
    let cellX = this.#cellX;
    let cellY = this.#cellY;
    if (direction === "LEFT") {
      cellX -= 1;
    } else if (direction === "RIGHT") {
      cellX += 1;
    } else if (direction === "UP") {
      cellY -= 1;
    } else if (direction === "DOWN") {
      cellY += 1;
    }

    if (this.#game.isCellBlocked(cellX, cellY)) {
      return;
    }

    // Start moving, twice as fast if you on fire 🔥
    this.#isMoving = true;
    this.#movingDirection = direction;
    this.#movingProgress = 0;
    this.#setAnimation(`WALK_${direction}`);
  }
}
