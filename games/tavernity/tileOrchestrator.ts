import { Actor } from './actor';
import {
  CRATE,
  TABLE_EMPLOYEE_HORIZONTAL,
  TABLE_EMPLOYEE_VERTICAL,
  TABLE_HORIZONTAL,
  TABLE_VERTICAL,
  isFloorTile,
} from './db';
import { Room, Tile } from './room';
import { Point, pointsEq, randInArr } from './utils';

export type TileOrchestratorType = 'Table' | 'Crate' | 'MoleTable' | 'Exit';

export interface TileOrchestrator {
  restoreTile: (a: Actor, type: TileOrchestratorType) => void;
  getAvailTile: (a: Actor, type: TileOrchestratorType) => Tile | undefined;
  isTileAvailable: (type: TileOrchestratorType) => boolean;
}

type AvailableTileItem = [Tile, Actor | undefined];

export const createTileOrchestrator = (
  room: Room,
  level: number
): TileOrchestrator => {
  const tileIs = (id: number, tiles: number[]) => {
    return tiles.includes(id);
  };

  // a person can stand to the left or right of a table, or below a table.
  const personTiles: AvailableTileItem[] = room.tiles
    .filter((tile) => {
      const [tileId, x, y] = tile;
      if (room.getTileLevel(tile) <= level && isFloorTile(tileId)) {
        const [aboveTileId] = room.getTileAt(x, y - 1);
        const [leftTileId] = room.getTileAt(x - 1, y);
        const [rightTileId] = room.getTileAt(x + 1, y);
        if (
          aboveTileId === TABLE_HORIZONTAL ||
          leftTileId === TABLE_VERTICAL ||
          rightTileId === TABLE_VERTICAL
        ) {
          return true;
        }
      }
    })
    .map((tile) => [tile, undefined]);

  const exitTiles: AvailableTileItem[] = room.tiles
    .filter((tile) => {
      for (const p of room.spawns) {
        if (
          pointsEq(p, tile.slice(1) as Point) &&
          room.getTileLevel(tile) <= level
        ) {
          return true;
        }
      }
    })
    .map((tile) => [tile, undefined]);

  const calculateCrateTiles = (
    existingCrateTiles: AvailableTileItem[] = []
  ) => {
    const crateTiles: AvailableTileItem[] = room.tiles
      .filter((tile) => {
        const [tileId, x, y] = tile;
        if (room.getTileLevel(tile) <= level && isFloorTile(tileId)) {
          const [leftTileId] = room.getTileAt(x - 1, y);
          const [rightTileId] = room.getTileAt(x + 1, y);
          if (leftTileId === CRATE || rightTileId === CRATE) {
            return true;
          }
        }
      })
      .map((tile) => {
        const existingActor = existingCrateTiles.find(
          (t) => t[0] === tile
        )?.[1];
        return [tile, existingActor];
      });
    return crateTiles;
  };

  const calculateMoleTiles = (existingMoleTiles: AvailableTileItem[] = []) => {
    const moleTiles: AvailableTileItem[] = room.tiles
      .filter((tile) => {
        const [tileId, x, y] = tile;
        if (room.getTileLevel(tile) <= level && isFloorTile(tileId)) {
          const [belowTileId] = room.getTileAt(x, y + 1);
          const [aboveTileId] = room.getTileAt(x, y - 1);
          const [leftTileId] = room.getTileAt(x - 1, y);
          const [rightTileId] = room.getTileAt(x + 1, y);
          if (
            tileIs(belowTileId, [
              TABLE_VERTICAL,
              TABLE_HORIZONTAL,
              TABLE_EMPLOYEE_HORIZONTAL,
              TABLE_EMPLOYEE_VERTICAL,
            ]) ||
            tileIs(aboveTileId, [
              TABLE_VERTICAL,
              TABLE_EMPLOYEE_HORIZONTAL,
              TABLE_EMPLOYEE_VERTICAL,
            ]) ||
            tileIs(leftTileId, [
              TABLE_HORIZONTAL,
              TABLE_EMPLOYEE_HORIZONTAL,
              TABLE_EMPLOYEE_VERTICAL,
            ]) ||
            tileIs(rightTileId, [
              TABLE_HORIZONTAL,
              TABLE_EMPLOYEE_HORIZONTAL,
              TABLE_EMPLOYEE_VERTICAL,
            ])
          ) {
            return true;
          }
        }
      })
      .map((tile) => {
        const existingActor = existingMoleTiles.find((t) => t[0] === tile)?.[1];
        return [tile, existingActor];
      });
    return moleTiles;
  };

  let crateTiles: AvailableTileItem[] = calculateCrateTiles();
  let moleTiles: AvailableTileItem[] = calculateMoleTiles();

  const typeToArr = (type: TileOrchestratorType) => {
    const map = {
      Table: personTiles,
      Exit: exitTiles,
      Crate: crateTiles,
      MoleTable: moleTiles,
    };
    return map[type] ?? [];
  };

  const cl: TileOrchestrator = {
    restoreTile: (a: Actor, type: TileOrchestratorType) => {
      const actorTile = typeToArr(type).find((t) => t[1] === a);
      if (actorTile) {
        if (type === 'Crate') {
          crateTiles = calculateCrateTiles(crateTiles);
        }
        if (type === 'MoleTable') {
          moleTiles = calculateMoleTiles(moleTiles);
        }
        actorTile[1] = undefined;
      }
    },
    getAvailTile: (a: Actor, type: TileOrchestratorType) => {
      const actorTile = typeToArr(type).find((t) => t[1] === a);
      if (actorTile) {
        return actorTile[0];
      }

      // if (type === 'Crate') {
      //   moleTiles = calculateMoleTiles(moleTiles);
      // }

      const arr = typeToArr(type).filter(
        (t) => t[1] === undefined || type === 'Exit'
      );
      const newActorTile: AvailableTileItem | undefined = randInArr(arr);
      if (newActorTile) {
        newActorTile[1] = a;
        return newActorTile[0];
      }
    },
    isTileAvailable: (type: TileOrchestratorType) => {
      const arr = typeToArr(type).filter(
        (t) => t[1] === undefined || type === 'Exit'
      );
      return arr?.length > 0;
    },
  };
  return cl;
};
