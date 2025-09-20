export const CHICKEN_FRAME_COUNT = 2;
export const BLOB_FRAME_COUNT = 7;
export const PLAYER_FRAME_COUNT = 5;
export const CHEST_FRAME_COUNT = 3;

export const CHICKEN_DOWN = 1;
export const CHICKEN_RIGHT = CHICKEN_DOWN + CHICKEN_FRAME_COUNT;
export const CHICKEN_UP = CHICKEN_RIGHT + CHICKEN_FRAME_COUNT;
export const OUTSIDE_TOP_LEFT = CHICKEN_UP + CHICKEN_FRAME_COUNT;
export const OUTSIDE_TOP = OUTSIDE_TOP_LEFT + 1;
export const OUTSIDE_TOP_RIGHT = OUTSIDE_TOP + 1;
export const SHADOW_TOP_LEFT = OUTSIDE_TOP_RIGHT + 1;
export const FLOOR = SHADOW_TOP_LEFT + 1;
export const OUTSIDE_LEFT = FLOOR + 1;
export const WALL = OUTSIDE_LEFT + 1;
export const OUTSIDE_RIGHT = WALL + 1;
export const SHADOW_LEFT = OUTSIDE_RIGHT + 1;
export const SHADOW_TOP = SHADOW_LEFT + 1;
export const SHADOW_TOP_RIGHT = SHADOW_TOP + 1;
export const OUTSIDE_BOTTOM_LEFT = SHADOW_TOP_RIGHT + 1;
export const OUTSIDE_BOTTOM = OUTSIDE_BOTTOM_LEFT + 1;
export const OUTSIDE_BOTTOM_RIGHT = OUTSIDE_BOTTOM + 1;
export const DOOR_CLOSED = OUTSIDE_BOTTOM_RIGHT + 1;
export const DOOR_OPEN = DOOR_CLOSED + 1;
export const OUTSIDE = DOOR_OPEN + 1;
export const BLOB = OUTSIDE + 1;
export const PLAYER_DOWN = BLOB + BLOB_FRAME_COUNT;
export const CART_HORIZONTAL = PLAYER_DOWN + PLAYER_FRAME_COUNT;
export const CART_VERTICAL = CART_HORIZONTAL + 1;
export const CHEST = CART_VERTICAL + 1;

// Tiled does {tile number} bitwise OR with 0x80000000 to signify horizontally flipped tiles;
// The number below is CHICKEN_RIGHT | 0x80000000.
// We hardcode the value because CHICKEN_RIGHT | 0x80000000 causes an overflow in JS.
export const CHICKEN_LEFT = 2147483651;

export const CHICKEN_GO_DOWN = `${CHICKEN_DOWN - 1}..${CHICKEN_DOWN - 1 + CHICKEN_FRAME_COUNT - 1}`;
export const CHICKEN_GO_RIGHT = `${CHICKEN_RIGHT - 1}..${CHICKEN_RIGHT - 1 + CHICKEN_FRAME_COUNT - 1}`;
export const CHICKEN_GO_UP = `${CHICKEN_UP - 1}..${CHICKEN_UP - 1 + CHICKEN_FRAME_COUNT - 1}`;
export const PLAYER_GO_DOWN = `${PLAYER_DOWN - 1}..${PLAYER_DOWN - 1 + PLAYER_FRAME_COUNT - 1}`;
export const BLOB_GO = `${BLOB - 1}..${BLOB - 1 + BLOB_FRAME_COUNT - 1}`;
export const CHEST_OPENING = `${CHEST - 1}..${CHEST - 1 + CHEST_FRAME_COUNT - 1}`;
