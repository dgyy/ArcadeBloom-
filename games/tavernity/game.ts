import { Particle, createParticle } from './particle';
import { Player, createPlayer } from './player';
import {
  Point,
  Timer,
  createAdjacentIterArray,
  isKeyDown,
  playSound,
} from './utils';
import { Room, Tile, createRoom } from './room';
import {
  DrawTextParams,
  drawRect,
  drawSprite,
  drawText,
  getCanvas,
  getCtx,
} from './draw';
import {
  Item,
  ItemName,
  createItem,
  itemNameToLabel,
  itemNameToSprite,
} from './item';
import { getModalText } from './utils';
import { rand } from './zzfx';
import { Actor } from './actor';
import { TileOrchestrator, createTileOrchestrator } from './tileOrchestrator';
import { Patron, createPatron } from './patron';
import {
  ACTION_FILL_LEFT,
  ACTION_FILL_RIGHT,
  ACTION_PICKUP_BUCKET,
  ACTION_PICKUP_LEFT,
  ACTION_PICKUP_RIGHT,
  ACTION_PICKUP_WEAPON,
  ACTION_PUTDOWN_LEFT,
  ACTION_PUTDOWN_RIGHT,
  ACTION_PUTDOWN_WEAPON,
  ACTION_REPAIR,
  getAvailableAction,
} from './action';
import { LEVEL_TIMER_MS, createSpawnOrchestrator } from './spawnOrchestrator';
import { LevelMessages, ON_FIRE, TABLE_HORIZONTAL, TABLE_VERTICAL } from './db';
import {
  LevelOrchestrator,
  createLevelOrchestrator,
} from './levelOrchestrator';

export type AdjItem = [Item, number /* number of items*/, Point];

export interface Game {
  cx: number;
  cy: number;
  scale: number;
  room: Room;
  tileOrch: TileOrchestrator;
  levelOrch: LevelOrchestrator;
  items: Item[];
  patrons: Patron[];
  particles: Particle[];
  fParticles: Particle[];
  setAdjTableOnFire: (pos: Point) => void;
  getPlayer: () => Player;
  getItemAt: (x: number, y: number) => Item | undefined;
  getPatronAt: (x: number, y: number) => Patron | undefined;
  getAdjTile: ([x, y]: Point, tileIds: number[]) => Tile | undefined;
  getAdjItem: (p: Point) => AdjItem | undefined;
  // showWarning: (text: string) => void;
  setup: () => void;
  isPaused: () => boolean;
  update: (fm: number) => void;
  draw: () => void;
}

export const getGame = (): Game => {
  return (window as any).game;
};

export function createGame(tiles: number[], mapWidth: number, spawns: Point[]) {
  const PLAYER_START = [0, 0];

  const room: Room = createRoom(tiles, mapWidth, spawns);
  const spawnOrch = createSpawnOrchestrator();
  const levelOrch = createLevelOrchestrator();
  const menuTimer = new Timer(1000);
  const endLevelTimer = new Timer(3000);
  let endLevel = false;
  let menuBlink = false;
  let levelMessageText = '';
  let lastSecondsRemaining = 0;
  let lastScore = 0;

  const keyInfo = document.getElementById('key-info') as HTMLDivElement;
  const pickUpNotif = keyInfo.children[0] as HTMLDivElement;
  // const warnNotif = keyInfo.children[1] as HTMLDivElement;
  let lastLabel = '';

  const player = ((window as any).player = createPlayer());

  let menu = true;
  let endOfLevelScreen = false;
  let levelMessageScreen = false;
  let gameOverScreen = false;

  const warningTimer = new Timer(2000);

  window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      setTimeout(() => {
        if (menu) {
          playSound('itemPlace');
          hideMenu();
          showLevelMessageScreen();
        } else if (endOfLevelScreen) {
          playSound('itemPlace');
          hideEndOfLevelScreen();
        } else if (levelMessageScreen) {
          playSound('startLevel');
          hideLevelMessageScreen();
        } else if (gameOverScreen) {
          playSound('itemPlace');
          hideGameOverScreen();
        }
      }, 1);
    }
  });

  const getNumRemainingPatrons = () =>
    cl.patrons.reduce(
      (sum, p) => (!['wfd', 'f', 'r'].includes(p.getState()) ? sum : sum + 1),
      0
    );

  const showMenu = () => {
    menu = true;
    cl.setup();
  };
  const hideMenu = () => {
    cl.setup();
    menu = false;
  };
  const showEndOfLevelScreen = () => {
    if (!endOfLevelScreen) {
      pickUpNotif.style.opacity = '0';
      endOfLevelScreen = true;
      player.x = PLAYER_START[0];
      player.y = PLAYER_START[1];
      playSound('levelScreen');
      levelOrch.addCrateBonus();
    }
  };
  const hideEndOfLevelScreen = () => {
    endOfLevelScreen = false;
    endLevel = false;
    levelOrch.incLevel();
    // setupNextLevel();
    showLevelMessageScreen();
  };

  const showLevelMessageScreen = () => {
    setupNextLevel();
    cl.update(1);
    levelMessageText =
      LevelMessages[cl.levelOrch.getTotalLevel()] ??
      'And they just keep coming...';
    levelMessageScreen = true;
  };

  const hideLevelMessageScreen = () => {
    setupNextLevel();
    levelMessageScreen = false;
    endLevel = false;
  };

  const showGameOverScreen = () => {
    gameOverScreen = true;
    pickUpNotif.style.opacity = '0';
    // warnNotif.style.opacity = '0';
    lastScore = levelOrch.getScore()[2];
  };
  const hideGameOverScreen = () => {
    gameOverScreen = false;
    showMenu();
  };

  const updateActorArray = (arr: Actor[]) => {
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      a.update();
      if (a.remv) {
        arr.splice(i, 1);
        i--;
      }
    }
  };

  const drawActorArray = (arr: Actor[]) => {
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      if (cl.room.isTileVisible(a.x, a.y)) {
        a.draw();
      }
    }
  };

  const drawMenu = () => {
    if (menuTimer.isDone()) {
      menuBlink = !menuBlink;
      menuTimer.start();
    }

    const ctx = getCtx();
    const { width, height } = ctx.canvas;
    const scale = cl.scale;
    drawRect(0, 0, width, height, '#000');

    const drawWalls = (offset: number, scale: number, vertical?: boolean) => {
      for (let i = 0; i < 9; i++) {
        if (vertical) {
          drawSprite('s_24', offset, i * 16 * scale, scale);
        } else {
          drawSprite('s_24', i * 16 * scale, offset, scale);
        }
      }
    };

    drawWalls(0, scale);
    drawWalls(height - 16 * scale, scale);
    drawWalls(0, cl.scale, true);
    drawWalls(width - 16 * scale, scale, true);

    pickUpNotif.style.opacity = '0';
    // warnNotif.style.opacity = '0';

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        drawSprite(
          's_11',
          scale * 16 + j * 16 * scale,
          scale * 16 + i * 16 * scale,
          scale
        );
      }
    }

    drawSprite(
      's_17',
      width / 2 - (scale * 16) / 2,
      height / 2 - (scale * 16) / 2,
      scale
    );

    drawSprite(
      's_18',
      width / 2 - (scale * 16) / 2 - 16 * scale,
      height / 2 - (scale * 16) / 2,
      scale
    );
    drawSprite(
      menuBlink ? 's_29' : 's_30',
      width / 2 - (scale * 16) / 2 - 16 * scale,
      height / 2 - (scale * 16) / 2,
      scale
    );
    drawSprite(
      's_18',
      width / 2 - (scale * 16) / 2 + 16 * scale,
      height / 2 - (scale * 16) / 2,
      scale
    );
    drawSprite(
      menuBlink ? 's_30' : 's_29',
      width / 2 - (scale * 16) / 2 + 16 * scale,
      height / 2 - (scale * 16) / 2,
      scale
    );

    drawText('TAVERNITY', width / 2, height / 2 - 2 * 16 * scale, {
      size: 42,
      align: 'center',
    });
    drawText(
      '"Serve me quick, barkeep,\nbefore I get angry."',
      width / 2,
      height / 2 - 1 * 16 * scale,
      {
        size: 16,
        align: 'center',
      }
    );
    drawText('Last Score: ' + lastScore, width / 2, height / 2 + 16 * scale, {
      size: 24,
      align: 'center',
    });
    drawText(
      'Press (SPACE) to continue.',
      width / 2,
      height / 2 + 2 * 16 * scale + 16,
      {
        size: 24,
        align: 'center',
      }
    );
  };

  const drawEndOfLevelScreen = () => {
    const ctx = getCtx();
    const { width, height } = ctx.canvas;
    const scale = cl.scale;
    drawRect(0, 0, width, height, '#000');

    const [score, crateBonus, totalScore] = levelOrch.getScore();

    const subTextParams: DrawTextParams = {
      size: 24,
      align: 'center',
    };

    drawText(
      `Level ${levelOrch.getTotalLevel()} Complete`,
      width / 2,
      height / 2 - 2 * 16 * scale,
      {
        size: 42,
        align: 'center',
      }
    );
    drawText(`Round Score: ${score}`, width / 2, height / 2 + 12 * scale, {
      size: 24,
      align: 'center',
    });
    drawText(
      `Crate Bonus: ${crateBonus}`,
      width / 2,
      height / 2 + 2 * 12 * scale,
      subTextParams
    );
    drawText(
      `Total Score: ${totalScore}`,
      width / 2,
      height / 2 + 3 * 12 * scale,
      subTextParams
    );
    drawText(
      'Press (SPACE) to start',
      width / 2,
      height / 2 + 4 * 12 * scale + 16,
      subTextParams
    );
  };

  const drawLevelMessageScreen = () => {
    const messages = levelMessageText.split('\n');
    const messagesLen = messages.length;
    const ctx = getCtx();
    const { width, height } = ctx.canvas;
    const scale = cl.scale;
    const offset = messagesLen === 1 ? 0 : -(12 * scale + 16 * messagesLen) / 2;

    const totalHeight = messagesLen * 12 * scale + 16;
    drawRect(0, height / 2 + offset - 16, width, totalHeight, '#000');

    for (let i = 0; i < messagesLen; i++) {
      drawText(
        messages[i],
        width / 2,
        height / 2 + i * 12 * scale + 16 + offset,
        {
          size: 24,
          align: 'center',
        }
      );
    }
  };

  const drawGameOverScreen = () => {
    const ctx = getCtx();
    const { width, height } = ctx.canvas;
    const [, , totalScore] = levelOrch.getScore();
    const scale = cl.scale;

    drawRect(0, 0, width, height, '#000');

    drawText(`GAME OVER`, width / 2, height / 2 - 2 * 16 * scale, {
      size: 42,
      align: 'center',
    });

    drawText(
      `Total Score: ${totalScore}`,
      width / 2,
      height / 2 + 3 * 12 * scale,
      {
        size: 24,
        align: 'center',
      }
    );

    drawText(
      'Press (SPACE) to start',
      width / 2,
      height / 2 + 4 * 12 * scale + 16,
      {
        size: 24,
        align: 'center',
      }
    );
  };

  const drawUi = () => {
    const ctx = getCtx();
    const { width, height } = ctx.canvas;
    const numWaitingPatrons = getNumRemainingPatrons();

    drawText(`${spawnOrch.getRemaining() + numWaitingPatrons}`, 64, 32, {
      size: 24,
      align: 'left',
    });
    drawRect(4, 4, 16 * 3, 16 * 3 + 4, 'rgba(255, 255, 255, 0.5)');
    drawSprite('s_3', 4, 4, 3);

    // drawText(`Patrons To Spawn: ${spawnOrch.getRemaining()}`, 16, 40, {
    //   size: 24,
    //   align: 'left',
    // });

    drawText(`Level: ${levelOrch.getTotalLevel()}`, 16, height - 16, {
      size: 24,
      align: 'left',
    });

    if (endLevel) {
      drawText(`Level ending soon...`, width / 2, 128, {
        size: 24,
        align: 'center',
      });
    } else if (
      !levelMessageScreen &&
      !(spawnOrch.isDone() && numWaitingPatrons === 0)
    ) {
      const secondsRemaining = Math.floor(
        ((1 - spawnOrch.lvlTimer.pct()) * spawnOrch.getMaxTime()) / 1000
      );
      drawText(
        `Time: ${Math.floor(secondsRemaining)}`,
        width - (secondsRemaining <= 10 ? 1 * 16 : 1 * 24),
        16,
        {
          size: secondsRemaining <= 10 ? 32 : 24,
          align: 'right',
        }
      );

      if (lastSecondsRemaining !== secondsRemaining) {
        lastSecondsRemaining = secondsRemaining;
        if (secondsRemaining <= 10) {
          playSound('timerTick');
        }
      }
    }
  };

  const setupNextLevel = () => {
    // cl.items = [];
    cl.patrons = [];
    cl.particles = [];
    cl.fParticles = [];
    cl.tileOrch = createTileOrchestrator(room, levelOrch.level);
    const totalLevel = levelOrch.getTotalLevel();

    if (cl.items.length === 0) {
      for (const [x, y] of [
        [5, 11],
        [5, 12],
        [8, 10],
        [4, 15],
        [21, 9],
        [21, 10],
        [17, 13],
        [15, 3],
        [21, 3],
      ]) {
        cl.items.push(createItem('mugE', x, y));
      }
    }

    if (totalLevel === 1) {
      cl.patrons.push(createPatron('person', 11, 14));
    }

    // cl.patrons.push(createPatron('person', 12, 4));

    player.x = 10;
    player.y = 12;

    spawnOrch.start(levelOrch.level, totalLevel);
    if (cl.room) {
      cl.room.reset(levelOrch.level);
    }
    player.reset();

    lastSecondsRemaining = 0;
  };

  const cl: Game = {
    cx: 0,
    cy: 0,
    scale: 4,
    room,
    tileOrch: createTileOrchestrator(room, 1),
    levelOrch,
    items: [],
    patrons: [],
    particles: [],
    fParticles: [],
    setup() {
      console.log('setup');
      levelOrch.reset();
      cl.items = [];
      setupNextLevel();
      player.itemLeft = undefined;
      player.itemRight = undefined;
      endLevel = false;
    },
    isPaused() {
      return menu || endOfLevelScreen || levelMessageScreen || gameOverScreen;
    },
    setAdjTableOnFire(pos: Point) {
      const tile = cl.getAdjTile(pos, [TABLE_HORIZONTAL, TABLE_VERTICAL]);
      if (tile && tile[0] !== ON_FIRE) {
        const [, x, y] = tile;
        cl.room.setTileAt(x, y, ON_FIRE);
        const item = cl.getItemAt(x, y);
        playSound('fire');
        if (item && item.name === 'mugF') {
          item.name = 'mugE';
        }
      }
    },
    getPlayer() {
      return player;
    },
    getItemAt(x: number, y: number) {
      return cl.items.find((i) => i.x === x && i.y === y);
    },
    getPatronAt(x: number, y: number) {
      return cl.patrons.find((p) => p.x === x && p.y === y);
    },
    getAdjTile([x, y]: Point, tileIds: number[]) {
      for (const tileId of tileIds) {
        for (const [_x, _y] of createAdjacentIterArray([x, y]).concat([
          [x, y],
        ])) {
          const tile = cl.room.getTileAt(_x, _y);
          if (tile && tile[0] === tileId) {
            return tile;
          }
        }
      }
    },
    getAdjItem([x, y]: Point) {
      let ctr = 0;
      let lastItem: Item | undefined;
      let lastPoint: Point | undefined;
      const adjArray = createAdjacentIterArray([x, y]).concat([[x, y]]);
      for (const item of cl.items) {
        for (const [_x, _y] of adjArray) {
          if (item.x === _x && item.y === _y) {
            if (!lastItem || lastItem.name === item.name) {
              ctr++;
              lastItem = item;
              lastPoint = [_x, _y];
            }
          }
        }
      }
      if (lastItem && lastPoint) {
        return [lastItem, ctr, lastPoint];
      }
    },
    // showWarning(text: string) {
    //   warnNotif.style.opacity = '1';
    //   warnNotif.innerHTML = text;
    //   warningTimer.start();
    // },
    update(fm: number) {
      if (cl.isPaused()) {
        return;
      }

      spawnOrch.update();

      room.update();
      updateActorArray(cl.patrons);
      player.update();
      updateActorArray(cl.particles);
      updateActorArray(cl.fParticles);
      updateActorArray(cl.items);

      const canvas = getCanvas();
      cl.cx = player.x * 16 * cl.scale - canvas.width / 2 + 8 * cl.scale;
      cl.cy = player.y * 16 * cl.scale - canvas.height / 2 + 8 * cl.scale;

      if (levelOrch.isLevelComplete(cl, spawnOrch) && !endOfLevelScreen) {
        if (endLevel) {
          if (endLevelTimer.isDone()) {
            endLevel = false;
            showEndOfLevelScreen();
          }
        } else {
          playSound('levelDone');
          endLevel = true;
          endLevelTimer.start();
        }
      }
      if (getNumRemainingPatrons() > 0 && spawnOrch.lvlTimer.isDone()) {
        // console.log('GAME OVER');
        playSound('gameOver');
        showGameOverScreen();
      }
      // if (!isPaused() && !endLevel
    },
    draw() {
      const ctx = getCtx();

      if (menu) {
        drawMenu();
        return;
      }

      if (endOfLevelScreen) {
        drawEndOfLevelScreen();
        return;
      }

      if (gameOverScreen) {
        drawGameOverScreen();
        return;
      }

      ctx.save();
      ctx.translate(-cl.cx, -cl.cy);
      ctx.scale(cl.scale, cl.scale);

      cl.room.draw();
      drawActorArray(cl.fParticles);
      drawActorArray(cl.items);
      drawActorArray(cl.patrons);
      player.draw();
      drawActorArray(cl.particles);

      const action = getAvailableAction(cl);
      if (!action) {
        pickUpNotif.style.opacity = '0';
        lastLabel = '';
      } else {
        const { type, item } = action;

        let nextLabel = '';

        const keypress = '(SPACE)';

        switch (type) {
          case ACTION_PICKUP_LEFT:
          case ACTION_PICKUP_RIGHT:
            nextLabel = `Pick up ${itemNameToLabel(
              (item as Item).name
            )} ${keypress}`;
            break;
          case ACTION_PICKUP_WEAPON:
            nextLabel = `Pick up Sword ${keypress}`;
            break;
          case ACTION_PICKUP_BUCKET:
            nextLabel = `Pick up Water Bucket ${keypress}`;
            break;
          case ACTION_PUTDOWN_LEFT:
          case ACTION_PUTDOWN_RIGHT:
            nextLabel = `Place ${itemNameToLabel(
              (item as Item).name
            )} ${keypress}`;
            break;
          case ACTION_FILL_LEFT:
          case ACTION_FILL_RIGHT:
            nextLabel = `Fill Mug ${keypress}`;
            break;
          case ACTION_PUTDOWN_WEAPON:
            nextLabel = `Put away Sword ${keypress}`;
            break;
          case ACTION_REPAIR:
            nextLabel = `Repair ${keypress}`;
            break;
        }

        if (lastLabel !== nextLabel || lastLabel === '') {
          pickUpNotif.style.opacity = nextLabel === '' ? '0' : '1';
          pickUpNotif.innerHTML = nextLabel;
          lastLabel = nextLabel;
        }
      }

      // if (warningTimer.isDone()) {
      //   warnNotif.style.opacity = '0';
      // }

      ctx.restore();

      drawUi();

      if (levelMessageScreen) {
        drawLevelMessageScreen();
        // return;
      }
    },
  };

  (window as any).game = cl;

  cl.setup();

  return cl;
}
