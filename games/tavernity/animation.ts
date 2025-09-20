import { getNow } from './utils';

export interface AnimSprite {
  n: string;
  d: number;
  durationUpToNow: number;
  timestampBegin?: number;
  timestampEnd?: number;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
}

export type Animation = ReturnType<typeof createAnimation>;

export function createAnimation([animLoop, animName, animSprites]: [
  loop: boolean,
  name: string,
  sprites: Partial<AnimSprite>[]
]) {
  // const name: string = animName;
  const loop: boolean = animLoop || false;
  let sprites: AnimSprite[] = [];
  let done: boolean;
  let totalDurationMs: number;
  let currentSpriteIndex: number;
  let timestampStart: number;

  sprites = [];
  done = false;
  totalDurationMs = 0;
  currentSpriteIndex = 0;
  timestampStart = 0;

  const addSprite = ({
    n,
    d,
    offsetX,
    offsetY,
    opacity,
  }: Partial<AnimSprite>) => {
    sprites.push({
      n: n || '',
      timestampBegin: totalDurationMs,
      timestampEnd: totalDurationMs + (d ?? 0),
      d: d ?? 0,
      durationUpToNow: totalDurationMs,
      offsetX: offsetX || 0,
      offsetY: offsetY || 0,
      opacity,
    });
    totalDurationMs += d ?? 0;
  };

  const getAnimIndex = (timestampNow: number) => {
    let lastIndex = 0;
    let leftI = currentSpriteIndex;
    let rightI = sprites.length - 1;
    while (leftI <= rightI) {
      const midI = leftI + Math.floor((rightI - leftI) / 2);
      lastIndex = midI;
      const { timestampEnd, timestampBegin } = sprites[midI];

      const beginTime = (timestampBegin || 0) + timestampStart;
      const endTime = (timestampEnd || 0) + timestampStart;

      if (timestampNow < endTime && timestampNow > beginTime) {
        return midI;
      }

      if (timestampNow >= endTime) {
        leftI = midI + 1;
      } else {
        rightI = midI - 1;
      }
    }
    return lastIndex;
  };

  animSprites.forEach(addSprite);

  const cl = {
    reset(): void {
      done = false;
      currentSpriteIndex = 0;
      cl.start();
    },

    start(): void {
      timestampStart = getNow();
    },

    update(): void {
      const now = getNow();
      if (currentSpriteIndex === sprites.length - 1) {
        if (loop && now - timestampStart > totalDurationMs) {
          const newStart = timestampStart + totalDurationMs;
          cl.reset();
          cl.start();
          if (now - newStart < totalDurationMs) {
            timestampStart = newStart;
          }
        }
      }
      currentSpriteIndex = getAnimIndex(now);
      if (!loop) {
        if (now - timestampStart >= totalDurationMs) {
          done = true;
        }
      }
    },

    getSprite(): string {
      return sprites[currentSpriteIndex]?.n;
    },
  };
  return cl;
}
