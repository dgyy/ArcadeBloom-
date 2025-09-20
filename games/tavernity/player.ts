import { drawSprite, getCanvas, getSprite } from './draw';
import { Animation, createAnimation } from './animation';
import { AdjItem, getGame } from './game';
import { createParticle } from './particle';
import {
  Direction,
  Point,
  Timer,
  createAdjacentIterArray,
  dirToOffsets,
  getModalText,
  isKeyDown,
  timeoutPromise,
} from './utils';
import { playSound } from './utils';
import { Item, ItemName, createItem } from './item';
import {
  KEG_TILES,
  ON_FIRE,
  RUBBLE,
  TABLE_TILES,
  createAnimationFromDb,
  isClosedDoorTile,
  isWallTile,
} from './db';
import { Actor, createActor } from './actor';
import { Tile } from './room';
import {
  ACTION_DUMP_BUCKET,
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
  ACTION_SWING_WEAPON,
  getAvailableAction,
} from './action';

export const handleWallsAndDoors = (
  cl: Actor,
  [prevX, prevY]: Point,
  onDoorCb: (tileId: number) => void
) => {
  const game = getGame();
  const prevTileId = game.room.getTileAt(prevX, prevY)?.[0];
  const tileId = game.room.getTileAt(cl.x, cl.y)?.[0];
  const patronAt = game.getPatronAt(cl.x, cl.y);
  if (isWallTile(tileId) || (patronAt && patronAt !== cl)) {
    if (isClosedDoorTile(tileId)) {
      onDoorCb(tileId);
    }
    cl.x = prevX;
    cl.y = prevY;
  } else {
    if (isClosedDoorTile(prevTileId - 1)) {
      playSound('doorClose');
      if (!game.getPatronAt(prevX, prevY)) {
        game.room.setTileAt(prevX, prevY, prevTileId - 1);
      }
    }
  }
};

export interface Player extends Actor {
  dir: Direction;
  ctrlEnabled: boolean;
  itemLeft: Item | undefined;
  itemRight: Item | undefined;
  reset: () => void;
}
export const createPlayer = () => {
  const keyPressTimer1 = new Timer(300);
  const keyPressTimer2 = new Timer(80);
  const weaponTimer = new Timer(150);
  let firstKeyPressed = false;

  const handlePickupItem = (item: Item) => {
    item.remv = true;
    if (cl.itemLeft === undefined) {
      playSound('item');
      cl.itemLeft = item;
    } else if (cl.itemRight === undefined) {
      playSound('item');
      cl.itemRight = item;
    } else {
      // getGame().showWarning('Your hands are full!');
    }
  };

  const handlePickupItemBothHands = (itemName: ItemName) => {
    const item = createItem(itemName, cl.x, cl.y);
    item.remv = true;
    playSound('drawSword');
    cl.itemLeft = item;
    cl.itemRight = item;
  };

  const handlePutDownItemOnTable = (hand: 'Right' | 'Left', tile: Tile) => {
    const game = getGame();
    const itemKey = 'item' + hand;
    const item = cl[itemKey];
    playSound('itemPlace');
    item.remv = false;
    item.x = tile[1];
    item.y = tile[2];
    game.items.push(item);
    cl[itemKey] = undefined;
  };

  const handleFillMug = (mugItem: Item) => {
    playSound('fill');
    mugItem.name = 'mugF';
  };

  const handleSwingWeapon = () => {
    const game = getGame();
    if (weaponTimer.isDone()) {
      weaponTimer.start();
      playSound('swingSword');
      for (const [x, y] of createAdjacentIterArray([cl.x, cl.y])) {
        const patron = game.getPatronAt(x, y);
        if (patron?.getState() === 'r' || patron?.type === 'mole') {
          const tileBeneath = game.room.getTileAt(x, y);
          if (tileBeneath[0] !== RUBBLE) {
            game.fParticles.push(createParticle('bloodf_l', Infinity, x, y));
          }
          game.particles.push(createParticle('blood_l', 300, x, y));
          patron.remv = true;
          playSound('hitSomething');
          setTimeout(() => {
            if (patron?.type === 'mole') {
              playSound('moleDead');
            } else {
              playSound('personHit');
            }
          }, 300);
          break;
        }
      }
    }
  };

  const handlePutdownWeapon = () => {
    cl.itemLeft = cl.itemRight = undefined;
    playSound('itemPlace');
  };

  const handleDumpBucket = () => {
    cl.itemLeft = undefined;
    cl.itemRight = undefined;
    playSound('dumpBucket');
    const game = getGame();
    for (const [x, y] of createAdjacentIterArray([cl.x, cl.y], true)) {
      const [id] = game.room.getTileAt(x, y);
      if (id === ON_FIRE) {
        game.room.setTileAt(x, y, RUBBLE);
        for (const [x2, y2] of createAdjacentIterArray([x, y])) {
          const patron = game.getPatronAt(x2, y2);
          if (patron?.getState() === 'r') {
            patron.setPersonState('wfd');
          }
        }
      }
      game.particles.push(createParticle('water_l', 300, x, y));
    }
  };

  const handleRepair = (tile: Tile) => {
    const game = getGame();
    const [, x, y] = tile;
    const origTile = game.room.getTileAt(x, y, true);
    const [origId] = origTile;
    tile[0] = origId;
    playSound('fill');
  };

  const areKeysDown = (keys: string[]) => {
    return keys.reduce((prev, curr) => prev || isKeyDown(curr), false);
  };

  const handleKeyUpdate = () => {
    if (cl.ctrlEnabled) {
      if (keyPressTimer1.isDone() && keyPressTimer2.isDone()) {
        const { x, y } = cl;
        let moved = false;
        if (areKeysDown(['ArrowUp', '8', '7', '9', 'Home', 'PageUp'])) {
          cl.y--;
          moved = true;
        }
        if (areKeysDown(['ArrowDown', '2', '1', '3', 'End', 'PageDown'])) {
          cl.y++;
          moved = true;
        }

        if (areKeysDown(['ArrowLeft', '7', '4', '1', 'Home', 'End'])) {
          cl.x--;
          moved = true;
        }
        if (areKeysDown(['ArrowRight', '9', '6', '3', 'PageUp', 'PageDown'])) {
          cl.x++;
          moved = true;
        }

        if (moved) {
          handleWallsAndDoors(cl, [x, y], (tileId) => {
            const game = getGame();
            playSound('doorOpen');
            game.room.setTileAt(cl.x, cl.y, tileId + 1);
            keyPressTimer1.start();
            firstKeyPressed = true;
          });
        }

        if (cl.x !== x || cl.y !== y) {
          if (firstKeyPressed) {
            keyPressTimer2.start();
          } else {
            keyPressTimer1.start();
            keyPressTimer2.start();
            firstKeyPressed = true;
          }
        }
      }
    }
  };

  window.addEventListener('keydown', (e) => {
    const game = getGame();

    if (game.isPaused()) {
      return;
    }

    // console.log('keydown', e.key);
    if (e.key === ' ') {
      const action = getAvailableAction(game);
      if (!action) {
        return;
      }

      const { type, tile, item } = action;

      const actions = {
        [ACTION_PICKUP_LEFT]: () => {
          handlePickupItem(item as Item);
        },
        [ACTION_PICKUP_RIGHT]: () => {
          handlePickupItem(item as Item);
        },
        [ACTION_PICKUP_WEAPON]: () => {
          handlePickupItemBothHands('sw');
        },
        [ACTION_PICKUP_BUCKET]: () => {
          handlePickupItemBothHands('buck');
        },
        [ACTION_PUTDOWN_LEFT]: () => {
          handlePutDownItemOnTable('Left', tile as Tile);
        },
        [ACTION_PUTDOWN_RIGHT]: () => {
          if (cl.itemLeft?.name === 'mugF') {
            handlePutDownItemOnTable('Left', tile as Tile);
            cl.itemLeft = cl.itemRight;
            cl.itemRight = undefined;
          } else {
            handlePutDownItemOnTable('Right', tile as Tile);
          }
        },
        [ACTION_FILL_LEFT]: () => {
          handleFillMug(cl.itemLeft as Item);
        },
        [ACTION_FILL_RIGHT]: () => {
          handleFillMug(cl.itemRight as Item);
        },
        [ACTION_SWING_WEAPON]: () => {
          handleSwingWeapon();
        },
        [ACTION_PUTDOWN_WEAPON]: () => {
          handlePutdownWeapon();
        },
        [ACTION_DUMP_BUCKET]: () => {
          handleDumpBucket();
        },
        [ACTION_REPAIR]: () => {
          handleRepair(tile as Tile);
        },
      };
      actions[type]?.();
    }
  });

  window.addEventListener('keyup', (e) => {
    firstKeyPressed = false;
    keyPressTimer1.complete();
  });

  const cl: Player = Object.assign(createActor(), {
    dir: 'l' as Direction,
    x: 0,
    y: 0,
    itemLeft: undefined,
    itemRight: undefined,
    ctrlEnabled: true,
    reset() {
      // cl.itemLeft = undefined;
      // cl.itemRight = undefined;
    },
    update() {
      handleKeyUpdate();
    },
    draw() {
      let sprOffset = 0;
      if (cl.itemLeft) {
        sprOffset++;
      }
      if (cl.itemRight) {
        sprOffset++;
      }
      const isItemInBothHands =
        cl.itemLeft !== undefined && cl.itemLeft === cl.itemRight;
      if (isItemInBothHands) {
        sprOffset--;
        if (!weaponTimer.isDone()) {
          sprOffset--;
        }
      }

      drawSprite('s_' + sprOffset, cl.x * 16, cl.y * 16);
      if (isItemInBothHands) {
        let yOffset = -4;
        if (!weaponTimer.isDone()) {
          yOffset = 2;
        }
        (cl.itemLeft as Item).drawAt(cl.x * 16 - 6, cl.y * 16 + yOffset, true);
      } else {
        if (cl.itemLeft) {
          cl.itemLeft.drawAt(cl.x * 16 - 8, cl.y * 16 - 5, true);
        }
        if (cl.itemRight) {
          cl.itemRight.drawAt(cl.x * 16 + 8, cl.y * 16 - 5);
        }
      }
    },
  });

  return cl;
};
