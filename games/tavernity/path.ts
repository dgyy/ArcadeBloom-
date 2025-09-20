import { Room } from './room';
import { Point, at, createAdjacentIterArray, pointsEq } from './utils';
import { isWallTile, isWallTileNotIncludingDoors } from './db';
import { Actor } from './actor';

interface PfTile {
  parent?: PfTile;
  p: Point;
}

const pointToKey = ([x, y]: Point) => `${x},${y}`;

export const createPathArray = (room: Room, actors: Actor[]) => {
  const arr: number[] = [];

  const findActorAt = ([x, y]: Point) => {
    return actors.find((a) => a.x === x && a.y === y);
  };

  for (const [id, x, y] of room.tiles) {
    if (isWallTileNotIncludingDoors(id) || findActorAt([x, y])) {
      arr.push(0);
    } else {
      arr.push(1);
    }
  }

  return arr;
};

const checkAddIf = (
  p: Point,
  parent: PfTile,
  pathArray: number[],
  width: number,
  tilesChecked: Record<string, boolean>,
  tilesToCheck: PfTile[]
) => {
  const isTraversable = at(p, pathArray, width) === 1;
  if (isTraversable && !tilesChecked[pointToKey(p)]) {
    tilesToCheck.push({
      p,
      parent,
    });
    tilesChecked[pointToKey(p)] = true;
  }
};

export const findPath = (
  startLoc: Point,
  endLoc: Point,
  pathArray: number[],
  width: number
): Point[] => {
  const path: Point[] = [];

  const tilesToCheck: PfTile[] = [{ p: startLoc }];
  const tilesChecked: Record<string, boolean> = {
    [pointToKey(startLoc)]: true,
  };

  let ctr = 1000;

  while (tilesToCheck.length) {
    const pfTile = tilesToCheck.shift();
    if (!pfTile) {
      return [];
    }

    if (pointsEq(pfTile.p, endLoc)) {
      path.unshift(endLoc);
      let nextParent = pfTile.parent;
      while (nextParent) {
        if (nextParent.parent) {
          path.unshift(nextParent.p);
        }
        nextParent = nextParent.parent;
      }
      break;
    }

    for (const p of createAdjacentIterArray(pfTile.p)) {
      checkAddIf(p, pfTile, pathArray, width, tilesChecked, tilesToCheck);
    }
    ctr--;
    if (ctr <= 0) {
      break;
    }
  }

  return path;
};
