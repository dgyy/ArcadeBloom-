import { isFloorTile, isVisibleTile } from './db';
import { Point, at, createAdjacentIterArray } from './utils';

type FloodMap = [number[], number[], number];

const isSpaceEmpty = (
  node: Point,
  [originalMap, indexMap, width]: FloodMap
) => {
  return (
    isFloorTile(at(node, originalMap, width)) &&
    at(node, indexMap, width) === -1
  );
};

const createEmptyMap = (tilesWidth: number, v: number) => {
  const indexMap: number[] = [];
  for (let i = 0; i < tilesWidth ** 2; i++) {
    indexMap.push(v);
  }
  return indexMap;
};

const floodFillRecursive = (
  node: Point,
  floodMap: FloodMap,
  indexToFillWith: number
) => {
  const [x, y] = node;
  const [, indexMap, width] = floodMap;
  if (isSpaceEmpty(node, floodMap)) {
    indexMap[x + y * width] = indexToFillWith;
    createAdjacentIterArray([x, y]).forEach((p) => {
      floodFillRecursive(p, floodMap, indexToFillWith);
    });
  }
};

const markRoomTiles = (indexToFillWith: number, floodMap: FloodMap) => {
  const indexMap = floodMap[1] || [];
  const tilesWidth = floodMap[2];
  if (indexMap.length === 0) {
    for (let i = 0; i < tilesWidth ** 2; i++) {
      indexMap.push(-1);
    }
  }

  for (let i = 0; i < tilesWidth ** 2; i++) {
    const node: Point = [i % tilesWidth, Math.floor(i / tilesWidth)];
    if (isSpaceEmpty(node, floodMap)) {
      floodFillRecursive(node, floodMap, indexToFillWith);
      return true;
    }
  }

  return false;
};

const createRoomMap = (
  indexMap: number[],
  tilesMap: number[],
  tilesWidth: number,
  markNumber: number
) => {
  const roomMap = createEmptyMap(tilesWidth, 0);

  const checkAt = (
    p: Point,
    markNumber: number,
    tilesToMark: Point[],
    recurse = true
  ) => {
    if (at(p, indexMap, tilesWidth) === -1) {
      tilesToMark.push([p[0] + p[1] * tilesWidth, markNumber]);

      // allows player to see walls behind things that are marked as walls but should
      // be possible to see over: crates/tables/weapons/kegs
      if (recurse && isVisibleTile(tilesMap[p[0] + p[1] * tilesWidth])) {
        createAdjacentIterArray(p, true).forEach((p) => {
          checkAt(p, markNumber, tilesToMark, false);
        });
      }
    }
  };

  const tilesToMark: Point[] = [];
  for (let y = 0; y < tilesWidth; y++) {
    for (let x = 0; x < tilesWidth; x++) {
      const ind = y * tilesWidth + x;
      if (indexMap[ind] === markNumber) {
        roomMap[ind] = markNumber;
        createAdjacentIterArray([x, y], true).forEach((p) => {
          checkAt(p, markNumber, tilesToMark);
        });
      }
    }
  }

  for (const [ind, value] of tilesToMark) {
    roomMap[ind] = value;
  }

  return roomMap;
};

export const createVisibilityMaps = (
  tiles: number[],
  tilesWidth: number
): number[][] => {
  let ctr = 1;
  const indexMap = createEmptyMap(tilesWidth, -1);

  const floodMap: FloodMap = [tiles, indexMap, tilesWidth];
  while (markRoomTiles(ctr, floodMap)) {
    ctr++;
  }

  const rooms: number[][] = [];

  for (let i = 1; i < ctr; i++) {
    rooms.push(createRoomMap(indexMap, tiles, tilesWidth, i));
  }

  return rooms;
};
