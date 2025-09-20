type CollisionTest = {
  entity1MaxX: number;
  entity1MaxY: number;
  entity2MaxX: number;
  entity2MaxY: number;
  collide: boolean;
};

export const testAABBCollision = (
  entity1pos: { x: number; y: number },
  entity1wh: { w: number; h: number },
  entity2pos: { x: number; y: number },
  entity2wh: { w: number; h: number }
) => {
  const test: CollisionTest = {
    entity1MaxX: entity1pos.x + entity1wh.w,
    entity1MaxY: entity1pos.y + entity1wh.h,
    entity2MaxX: entity2pos.x + entity2wh.w,
    entity2MaxY: entity2pos.y + entity2wh.h,
    collide: false
  }

  test.collide =
    entity1pos.x < test.entity2MaxX &&
    test.entity1MaxX > entity2pos.x &&
    entity1pos.y < test.entity2MaxY &&
    test.entity1MaxY > entity2pos.y

  return test
}

// entity1 collided into entity2
export const correctAABBCollision = (
  entity1: { pos: { x: number; y: number }; mov: { dx: number; dy: number }, col: { wh: { w: number; h: number } } },
  entity2: { pos: { x: number; y: number }; mov?: { dx: number; dy: number }, col: { wh: { w: number; h: number } } },
  test: CollisionTest // used for correction
) => {
  if (!entity1.mov) {
    return
  }
  // this is correction
  // const { entity1MaxX, entity1MaxY, entity2MaxX, entity2MaxY } = test;

  // const deltaMaxX = entity1MaxX - entity2.pos.x;
  // const deltaMaxY = entity1MaxY - entity2.pos.y;
  // const deltaMinX = entity2MaxX - entity1.pos.x;
  // const deltaMinY = entity2MaxY - entity1.pos.y;

  // AABB collision response (homegrown wall sliding, not physically correct
  // because just pushing along one axis by the distance overlapped)

  // entity1 moving down/right
  // if (entity1.mov.dx > 0 && entity1.mov.dy > 0) {
  //   if (deltaMaxX < deltaMaxY) {
  //     // collided right side first
  //     entity1.pos.x -= deltaMaxX;
  //   } else {
  //     // collided top side first
  //     entity1.pos.y -= deltaMaxY;
  //   }
  // }
  // // entity1 moving up/right
  // else if (entity1.mov.dx > 0 && entity1.mov.dy < 0) {
  //   if (deltaMaxX < deltaMinY) {
  //     // collided right side first
  //     entity1.pos.x -= deltaMaxX;
  //   } else {
  //     // collided bottom side first
  //     entity1.pos.y += deltaMinY;
  //   }
  // }
  // // entity1 moving right
  // else if (entity1.mov.dx > 0) {
  //   entity1.pos.x -= deltaMaxX;
  // }
  // // entity1 moving down/left
  // else if (entity1.mov.dx < 0 && entity1.mov.dy > 0) {
  //   if (deltaMinX < deltaMaxY) {
  //     // collided left side first
  //     entity1.pos.x += deltaMinX;
  //   } else {
  //     // collided top side first
  //     entity1.pos.y -= deltaMaxY;
  //   }
  // }
  // // entity1 moving up/left
  // else if (entity1.mov.dx < 0 && entity1.mov.dy < 0) {
  //   if (deltaMinX < deltaMinY) {
  //     // collided left side first
  //     entity1.pos.x += deltaMinX;
  //   } else {
  //     // collided bottom side first
  //     entity1.pos.y += deltaMinY;
  //   }
  // }
  // // entity1 moving left
  // else if (entity1.mov.dx < 0) {
  //   entity1.pos.x += deltaMinX;
  // }
  // // entity1 moving down
  // else if (entity1.mov.dy > 0) {
  //   entity1.pos.y -= deltaMaxY;
  // }
  // // entity1 moving up
  // else if (entity1.mov.dy < 0) {
  //   entity1.pos.y += deltaMinY;
  // }

  // this is bounce

  // Reverse the entity1's velocity component that is heading towards the entity2
  if (entity1.mov!.dx > 0 && entity1.pos.x < entity2.pos.x) {
    entity1.mov!.dx *= -1
    if (entity2.mov) {
      entity2.mov.dx = -entity1.mov!.dx * 0.5 // mass?
    }
  }
  if (
    entity1.mov!.dx < 0 &&
    entity1.pos.x + entity1.col.wh.w > entity2.pos.x + entity2.col.wh.w
  ) {
    entity1.mov!.dx *= -1
    if (entity2.mov) {
      entity2.mov.dx = -entity1.mov!.dx * 0.5 // mass?
    }
  }
  if (entity1.mov!.dy > 0 && entity1.pos.y < entity2.pos.y) {
    entity1.mov!.dy *= -1
    if (entity2.mov) {
      entity2.mov.dy = -entity1.mov!.dy * 0.5 // mass ?
    }
  }
  if (
    entity1.mov!.dy < 0 &&
    entity1.pos.y + entity1.col.wh.h > entity2.pos.y + entity2.col.wh.h
  ) {
    entity1.mov!.dy *= -1
    if (entity2.mov) {
      entity2.mov.dy = -entity1.mov!.dy * 0.5 // mass ?
    }
  }
}

export const isPointerIn = (
  pointer: {x: number, y: number},
  { x, y, w, h }: { x: number; y: number; w: number; h: number }
) => pointer.x > x && pointer.x < x + w && pointer.y > y && pointer.y < y + h
