import { createCanvas, drawRect, drawSprite } from './draw';
import { createPatron } from './patron';
import { getGame } from './game';
import { createItem } from './item';
import { Point, Timer, at, getModalText, printArr } from './utils';
import { rand } from './zzfx';
import { createVisibilityMaps } from './flood';
import { Actor, createActor } from './actor';
import { CLOSED_DOOR, ON_FIRE, roomNumberToLevel } from './db';

export interface Room extends Actor {
  w: number;
  h: number;
  tiles: Tile[];
  visMaps: number[][];
  spawns: Point[];
  reset: (level: number) => void;
  getTileAt: (x: number, y: number, orig?: boolean) => Tile;
  setTileAt: (x: number, y: number, tileId: number) => void;
  getTileLevel: (t: Tile, max?: boolean) => number;
  isTileVisible(x: number, y: number, visMapInds?: number[]): boolean;
}

export type Tile = [number /*id*/, number /*tileX*/, number /*tileY*/];

export const createRoom = (
  tiles: number[],
  roomWidth: number,
  spawns: Point[] = []
): Room => {
  const fireTimer = new Timer(100);
  let fireSpriteOffset = false;

  const calculateVisMapInds = () => {
    const game = getGame();
    const player = game.getPlayer();
    const playerPos = player.getPos();

    const visMapInds: number[] = [];

    for (let visMapInd = 0; visMapInd < cl.visMaps.length; visMapInd++) {
      const visMap = cl.visMaps[visMapInd];
      const n = at(playerPos, visMap, roomWidth);
      if (n > 0) {
        visMapInds.push(visMapInd);
      }
    }

    return visMapInds;
  };

  let visMapInds: number[] = [];

  const originalTiles: Tile[] = tiles.map((tileId, i) => [
    tileId,
    i % roomWidth,
    Math.floor(i / roomWidth),
  ]);

  const cl: Room = {
    ...createActor(),
    w: roomWidth,
    h: roomWidth,
    spawns,
    visMaps: createVisibilityMaps(tiles, roomWidth),
    tiles: originalTiles,
    reset: (level: number) => {
      const tiles = structuredClone(originalTiles);
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const maxLevel = cl.getTileLevel(tile, true);
        // console.log('check maxlevel vs level', tile, maxLevel, level);
        if (tile[0] === CLOSED_DOOR && maxLevel > level) {
          tile[0]--;
        }
      }
      cl.tiles = tiles;
    },
    getTileAt: (tx: number, ty: number, orig?: boolean) => {
      const tiles = orig ? originalTiles : cl.tiles;
      const tile = tiles[ty * roomWidth + tx];
      return tile ?? [0];
    },
    setTileAt: (tx: number, ty: number, tileId: number) => {
      const t = cl.tiles[ty * roomWidth + tx];
      if (t) {
        t[0] = tileId;
      }
    },
    getTileLevel: (t: Tile, max?: boolean) => {
      const [tileId, tx, ty] = t;
      if (tileId === 0) {
        return 0;
      }
      let maxRoomLevel = 0;
      for (const visMap of cl.visMaps) {
        const roomNumber = visMap[ty * roomWidth + tx];
        if (roomNumber) {
          const level = roomNumberToLevel(roomNumber);
          if (level > maxRoomLevel) {
            maxRoomLevel = level;
            if (!max) {
              return maxRoomLevel;
            }
          }
        }
      }
      return maxRoomLevel;
    },
    isTileVisible: (tx: number, ty: number) => {
      const isVisible = visMapInds.reduce(
        (prev, curr) => prev || at([tx, ty], cl.visMaps[curr], roomWidth) > 0,
        false
      );
      return isVisible;
    },
    update: () => {
      visMapInds = calculateVisMapInds();

      if (fireTimer.isDone()) {
        fireTimer.start();
        fireSpriteOffset = !fireSpriteOffset;
      }
    },
    draw: () => {
      for (let i = 0; i < roomWidth; i++) {
        for (let j = 0; j < roomWidth; j++) {
          let [tileId] = cl.tiles[j + i * roomWidth];
          const isVisible = cl.isTileVisible(j, i, visMapInds);
          if (tileId && isVisible) {
            if (tileId === ON_FIRE) {
              tileId += fireSpriteOffset ? 1 : 0;
            }
            drawSprite('s_' + (tileId - 1), j * 16, i * 16);
          } else {
            drawRect(j * 16, i * 16, 16, 16, '#000');
          }
        }
      }
    },
  };

  // for (const visMap of cl.visMaps) {
  //   printArr(visMap, roomWidth);
  // }

  return cl;
};
