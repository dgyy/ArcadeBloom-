import {
  KEG_TILES,
  OUTSIDE_WELL,
  RUBBLE,
  TABLE_TILES,
  WEAPON_RACK,
} from './db';
import { Game } from './game';
import { Item } from './item';
import { Tile } from './room';
import { createAdjacentIterArray } from './utils';

type ActionType =
  | 'p-l'
  | 'p-r'
  | 'p-w'
  | 'pd-l'
  | 'pd-r'
  | 'f-l'
  | 'f-r'
  | 'sw'
  | 'pd-w'
  | 'p-b'
  | 'd-b'
  | 'r';

export const ACTION_PICKUP_LEFT = 'p-l';
export const ACTION_PICKUP_RIGHT = 'p-r';
export const ACTION_PICKUP_WEAPON = 'p-w';
export const ACTION_PICKUP_BUCKET = 'p-b';
export const ACTION_PUTDOWN_LEFT = 'pd-l';
export const ACTION_PUTDOWN_RIGHT = 'pd-r';
export const ACTION_FILL_LEFT = 'f-l';
export const ACTION_FILL_RIGHT = 'f-r';
export const ACTION_SWING_WEAPON = 'sw';
export const ACTION_PUTDOWN_WEAPON = 'pd-w';
export const ACTION_DUMP_BUCKET = 'd-b';
export const ACTION_REPAIR = 'r';

interface ActionResult {
  type: ActionType;
  tile?: Tile;
  item?: Item;
}

export const getAvailableAction = (game: Game): ActionResult | undefined => {
  const player = game.getPlayer();
  const adjItemResult = game.getAdjItem([player.x, player.y]);
  let localAdjTile: Tile | undefined;

  if (player.itemLeft?.name === 'sw') {
    localAdjTile = game.getAdjTile([player.x, player.y], [WEAPON_RACK]);
    if (localAdjTile) {
      return {
        type: ACTION_PUTDOWN_WEAPON,
      };
    } else {
      return {
        type: ACTION_SWING_WEAPON,
      };
    }
  }
  if (player.itemLeft?.name === 'buck') {
    localAdjTile = game.getAdjTile([player.x, player.y], [OUTSIDE_WELL]);
    if (localAdjTile) {
      return {
        type: ACTION_PICKUP_BUCKET,
      };
    } else {
      return {
        type: ACTION_DUMP_BUCKET,
      };
    }
  }

  if ((localAdjTile = game.getAdjTile([player.x, player.y], [RUBBLE]))) {
    return {
      type: ACTION_REPAIR,
      tile: localAdjTile,
    };
  } else if (adjItemResult && (!player.itemLeft || !player.itemRight)) {
    const [item, , [x, y]] = adjItemResult;
    // if it's a full mug with an adjacent PersonPatron who is thirsty, then don't allow pickup
    if (adjItemResult[0].name === 'mugF') {
      for (const [_x, _y] of createAdjacentIterArray([x, y])) {
        const patron = game.getPatronAt(_x, _y);
        if (patron?.getState() === 'wfd') {
          return;
        }
      }
    }

    return {
      type: player.itemLeft ? ACTION_PICKUP_RIGHT : ACTION_PICKUP_LEFT,
      item,
    };
  } else if (
    !player.itemLeft &&
    !player.itemRight &&
    (localAdjTile = game.getAdjTile([player.x, player.y], [WEAPON_RACK]))
  ) {
    return {
      type: ACTION_PICKUP_WEAPON,
      tile: localAdjTile,
    };
  } else if (
    !player.itemLeft &&
    !player.itemRight &&
    (localAdjTile = game.getAdjTile([player.x, player.y], [OUTSIDE_WELL]))
  ) {
    return {
      type: ACTION_PICKUP_BUCKET,
      tile: localAdjTile,
    };
  } else if (
    player.itemLeft?.name === 'mugE' &&
    game.getAdjTile([player.x, player.y], KEG_TILES)
  ) {
    return {
      type: ACTION_FILL_LEFT,
      item: player.itemLeft,
    };
  } else if (
    player.itemRight?.name === 'mugE' &&
    game.getAdjTile([player.x, player.y], KEG_TILES)
  ) {
    return {
      type: ACTION_FILL_RIGHT,
      item: player.itemRight,
    };
  } else if (
    player.itemRight &&
    !['sword'].includes(player.itemRight.name) &&
    (localAdjTile = game.getAdjTile([player.x, player.y], TABLE_TILES)) &&
    !game.getItemAt(localAdjTile[1], localAdjTile[2])
  ) {
    return {
      type: ACTION_PUTDOWN_RIGHT,
      tile: localAdjTile,
      item: player.itemRight,
    };
  } else if (
    player.itemLeft &&
    !['sword'].includes(player.itemLeft.name) &&
    (localAdjTile = game.getAdjTile([player.x, player.y], TABLE_TILES)) &&
    !game.getItemAt(localAdjTile[1], localAdjTile[2])
  ) {
    return {
      type: ACTION_PUTDOWN_LEFT,
      tile: localAdjTile,
      item: player.itemLeft,
    };
  }
};
