import { Actor, createActor } from './actor';
import { drawSprite } from './draw';

export interface Item extends Actor {
  name: ItemName;
  drawAt: (x: number, y: number, flipped?: boolean) => void;
}

export type ItemName =
  | 'mugE'
  | 'mugF'
  | 'sw'
  // | 'buoy'
  // | 'hammer'
  | 'buck';

export const itemNameToLabel = (itemName: ItemName): string => {
  const labels: Record<ItemName, string> = {
    mugE: 'Mug',
    mugF: 'Mug',
    sw: 'Sword',
    // buoy: 'Buoy',
    // hammer: 'Hammer',
    buck: 'Bucket',
  };
  return labels[itemName] ?? 'Item';
};

export const itemNameToSprite = (itemName: ItemName) => {
  return (
    (() => {
      switch (itemName) {
        case 'mugE':
          return 's_30';
        case 'mugF':
          return 's_29';
        case 'sw':
          return 's_31';
        // case 'buoy':
        //   return 's_32';
        case 'buck':
          return 's_34';
      }
    })() ?? 's_0'
  );
};

export const createItem = (itemName: ItemName, x: number, y: number) => {
  const actor = createActor();
  const cl: Item = {
    ...actor,
    name: itemName,
    x,
    y,
    draw() {
      if (cl.remv) {
        return;
      }
      const sprite = itemNameToSprite(cl.name);
      drawSprite(sprite, cl.x * 16, cl.y * 16);
    },
    drawAt(x, y, flipped?: boolean) {
      const sprite = itemNameToSprite(cl.name);
      drawSprite(sprite + (flipped ? '_f' : ''), x, y);
    },
  };

  return cl;
};
