export const CELL_SIZE = 8;

const mapSpriteSheetURL = new URL(
  "../images/map-sprite-sheet.png",
  import.meta.url
).href;
const smokeAndFireSpriteSheetURL = new URL(
  "../images/smoke-and-fire-sprite-sheet.png",
  import.meta.url
).href;
const bittyBudSpriteSheetURL = new URL(
  "../images/bitty-bud-sprite-sheet.png",
  import.meta.url
).href;
const bittyBudHottSpriteSheetURL = new URL(
  "../images/bitty-bud-hott-sprite-sheet.png",
  import.meta.url
).href;
const bldgPostSpriteSheetURL = new URL(
  "../images/bldg-post-sprite-sheet.png",
  import.meta.url
).href;
const dragonSpriteSheetURL = new URL(
  "../images/dragon-shade-sprite-sheet.png",
  import.meta.url
).href;

export const SPRITES = {
  GRASS_1: {
    spriteSheet: mapSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 0,
  },
  WATER_1: {
    spriteSheet: mapSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 1,
  },
  WATER_2: {
    spriteSheet: mapSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 1,
  },
  ROCK_1: {
    spriteSheet: mapSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 2,
  },
  SMOKE_1: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 0,
    sheetY: 0,
  },
  SMOKE_2: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 1,
    sheetY: 0,
  },
  SMOKE_3: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 2,
    sheetY: 0,
  },
  SMOKE_4: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 3,
    sheetY: 0,
  },
  SMOKE_5: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 0,
    sheetY: 1,
  },
  SMOKE_6: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 1,
    sheetY: 1,
  },
  SMOKE_7: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 2,
    sheetY: 1,
  },
  SMOKE_8: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 3,
    sheetY: 1,
  },
  FIRE_1: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 0,
    sheetY: 2,
  },
  FIRE_2: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 1,
    sheetY: 2,
  },
  FIRE_3: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 2,
    sheetY: 2,
  },
  FIRE_4: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 3,
    sheetY: 2,
  },
  FIRE_5: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 0,
    sheetY: 3,
  },
  FIRE_6: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 1,
    sheetY: 3,
  },
  FIRE_7: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 2,
    sheetY: 3,
  },
  FIRE_8: {
    spriteSheet: smokeAndFireSpriteSheetURL,
    size: 16,
    sheetX: 3,
    sheetY: 3,
  },
  BITTY_BUD_IDLE_1: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 5,
  },
  BITTY_BUD_IDLE_2: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 5,
  },
  BITTY_BUD_WAVE_1: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 4,
  },
  BITTY_BUD_WAVE_2: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 4,
  },
  BITTY_BUD_WAVE_3: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 2,
    sheetY: 4,
  },
  BITTY_BUD_WAVE_4: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 4,
  },
  BITTY_BUD_DOWN_WALK_1: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 0,
  },
  BITTY_BUD_DOWN_WALK_2: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 0,
  },
  BITTY_BUD_DOWN_WALK_3: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 0,
  },
  BITTY_BUD_UP_WALK_1: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 1,
  },
  BITTY_BUD_UP_WALK_2: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 1,
  },
  BITTY_BUD_UP_WALK_3: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 1,
  },
  BITTY_BUD_LEFT_WALK_1: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 2,
  },
  BITTY_BUD_LEFT_WALK_2: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 2,
  },
  BITTY_BUD_LEFT_WALK_3: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 2,
  },
  BITTY_BUD_RIGHT_WALK_1: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 3,
  },
  BITTY_BUD_RIGHT_WALK_2: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 3,
  },
  BITTY_BUD_RIGHT_WALK_3: {
    spriteSheet: bittyBudSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 3,
  },
  BITTY_BUD_HOTT_IDLE_1: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 5,
  },
  BITTY_BUD_HOTT_IDLE_2: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 5,
  },
  BITTY_BUD_HOTT_WAVE_1: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 4,
  },
  BITTY_BUD_HOTT_WAVE_2: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 4,
  },
  BITTY_BUD_HOTT_WAVE_3: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 2,
    sheetY: 4,
  },
  BITTY_BUD_HOTT_WAVE_4: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 4,
  },
  BITTY_BUD_HOTT_DOWN_WALK_1: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 0,
  },
  BITTY_BUD_HOTT_DOWN_WALK_2: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 0,
  },
  BITTY_BUD_HOTT_DOWN_WALK_3: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 0,
  },
  BITTY_BUD_HOTT_UP_WALK_1: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 1,
  },
  BITTY_BUD_HOTT_UP_WALK_2: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 1,
  },
  BITTY_BUD_HOTT_UP_WALK_3: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 1,
  },
  BITTY_BUD_HOTT_LEFT_WALK_1: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 2,
  },
  BITTY_BUD_HOTT_LEFT_WALK_2: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 2,
  },
  BITTY_BUD_HOTT_LEFT_WALK_3: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 2,
  },
  BITTY_BUD_HOTT_RIGHT_WALK_1: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 3,
  },
  BITTY_BUD_HOTT_RIGHT_WALK_2: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 3,
  },
  BITTY_BUD_HOTT_RIGHT_WALK_3: {
    spriteSheet: bittyBudHottSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 3,
  },
  BLDG_POST_TOP_LEFT: {
    spriteSheet: bldgPostSpriteSheetURL,
    size: 8,
    sheetX: 0,
    sheetY: 0,
  },
  BLDG_POST_TOP_RIGHT: {
    spriteSheet: bldgPostSpriteSheetURL,
    size: 8,
    sheetX: 1,
    sheetY: 0,
  },
  BLDG_POST_BOTTOM_LEFT: {
    spriteSheet: bldgPostSpriteSheetURL,
    size: 8,
    sheetX: 2,
    sheetY: 0,
  },
  BLDG_POST_BOTTOM_RIGHT: {
    spriteSheet: bldgPostSpriteSheetURL,
    size: 8,
    sheetX: 3,
    sheetY: 0,
  },
  DRAGON_TOP_LEFT: {
    spriteSheet: dragonSpriteSheetURL,
    size: 16,
    sheetX: 0,
    sheetY: 0,
  },
  DRAGON_TOP_RIGHT: {
    spriteSheet: dragonSpriteSheetURL,
    size: 16,
    sheetX: 1,
    sheetY: 0,
  },
  DRAGON_BOTTOM_LEFT: {
    spriteSheet: dragonSpriteSheetURL,
    size: 16,
    sheetX: 0,
    sheetY: 1,
  },
  DRAGON_BOTTOM_RIGHT: {
    spriteSheet: dragonSpriteSheetURL,
    size: 16,
    sheetX: 1,
    sheetY: 1,
  }
};
