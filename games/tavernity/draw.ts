import { Point, getNow } from './utils';

export interface DrawTextParams {
  font?: string;
  color?: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
  strokeColor?: string;
}
const DEFAULT_TEXT_PARAMS = {
  font: 'monospace',
  color: '#fff',
  size: 14,
  align: 'center',
  strokeColor: 'black',
};

const globalScale = 4;

let fm = 1;
export const setFm = (n: number) => {
  fm = n;
};
export const getFm = () => fm;

export const clearScreen = () => {
  const canvas = getCanvas();
  drawRect(0, 0, canvas.width, canvas.height, 'grey');
};

// export const setupDrawing = () => {
//   const ctx = getCtx();
//   ctx.save();
//   ctx.translate(0, 0);
//   ctx.scale(globalScale, globalScale);
// };

// export const finishDrawing = () => {
//   getCtx().restore();
// };

export const setOpacity = (opacity: number, ctx?: CanvasRenderingContext2D) => {
  ctx = ctx || getCtx();
  ctx.globalAlpha = opacity;
};

export const drawSprite = (
  sprite: string | Sprite,
  x: number,
  y: number,
  scale?: number,
  ctx?: CanvasRenderingContext2D
) => {
  scale = scale || 1;
  ctx = ctx || getCtx();
  const spriteObj = typeof sprite === 'string' ? getSprite(sprite) : sprite;
  if (!spriteObj) {
    throw new Error(`No sprite: "${sprite}"`);
  }
  const [image, sprX, sprY, sprW, sprH] = spriteObj;

  ctx.drawImage(
    image,
    sprX,
    sprY,
    sprW,
    sprH,
    x,
    y,
    sprW * scale,
    sprH * scale
  );
};

export const drawRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  stroke?: boolean,
  ctx?: CanvasRenderingContext2D
) => {
  ctx = ctx || getCtx();
  ctx[stroke ? 'strokeStyle' : 'fillStyle'] = color;
  ctx[stroke ? 'strokeRect' : 'fillRect'](x, y, w, h);
};

export const drawText = (
  text: string,
  x: number,
  y: number,
  textParams?: DrawTextParams,
  ctx?: CanvasRenderingContext2D
) => {
  const { font, size, color, align, strokeColor } = {
    ...DEFAULT_TEXT_PARAMS,
    ...(textParams || {}),
  };
  ctx = ctx || getCtx();
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = align as CanvasTextAlign;
  ctx.textBaseline = 'middle';
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 4;
    ctx.strokeText(text, x, y);
  }

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

type ImageCollection = { [key: string]: HTMLImageElement };
type Sprite = [HTMLCanvasElement, number, number, number, number];
type SpriteCollection = { [key: string]: Sprite };
type AnimCollection = { [key: string]: Animation };

let model_canvas: HTMLCanvasElement | null = null;
let model_images: ImageCollection | null = null;
let model_sprites: SpriteCollection | null = null;

const createRotatedImg = (
  inputCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const [canvas, ctx, width, height] = createCanvas(
    inputCanvas.width,
    inputCanvas.height
  );
  const x = width / 2;
  const y = height / 2;
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(inputCanvas, -x, -y);
  return canvas;
};

const createFlippedImg = (
  inputCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const [canvas, ctx, width] = createCanvas(
    inputCanvas.width,
    inputCanvas.height
  );
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(inputCanvas, 0, 0);
  return canvas;
};

const spriteToCanvas = (sprite: Sprite): HTMLCanvasElement => {
  const [, , , spriteWidth, spriteHeight] = sprite;
  const [canvas, ctx] = createCanvas(spriteWidth, spriteHeight);
  drawSprite(sprite, 0, 0, 1, ctx);
  return canvas;
};

const loadSpritesheet = (
  spriteMap: SpriteCollection,
  image: HTMLImageElement,
  spritePrefix: string,
  spriteWidth: number,
  spriteHeight: number
) => {
  const createSprite = (
    name: string,
    image: HTMLImageElement | HTMLCanvasElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const [canvas, ctx] = createCanvas(w, h);
    ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
    return (spriteMap[name] = [canvas, 0, 0, w, h]);
  };

  const numSpritesX = image.width / spriteWidth;
  const numSpritesY = image.height / spriteHeight;
  for (let i = 0; i < numSpritesY; i++) {
    for (let j = 0; j < numSpritesX; j++) {
      const spriteName = `${spritePrefix}_${i * numSpritesX + j}`;
      const s = createSprite(
        spriteName,
        image,
        j * spriteWidth,
        i * spriteHeight,
        spriteWidth,
        spriteHeight
      );
      const flipped = createFlippedImg(spriteToCanvas(s));
      createSprite(`${spriteName}_f`, flipped, 0, 0, spriteWidth, spriteHeight);
    }
  }
};

export const loadImagesAndSprites = async (images: any[]) => {
  getCanvas();
  const imageMap = {};
  const spriteMap = {};
  await Promise.all(
    images.map(([imageName, imagePath, spriteWidth, spriteHeight], i) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageMap[imageName] = img;
          loadSpritesheet(spriteMap, img, 's', spriteWidth, spriteHeight);
          resolve();
        };
        img.src = imagePath;
      });
    })
  );

  model_images = imageMap;
  model_sprites = spriteMap;

  console.log(model_sprites);
};

export const createCanvas = (
  width: number,
  height: number
): [HTMLCanvasElement, CanvasRenderingContext2D, number, number] => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;
  return [canvas, ctx, width, height];
};

export const getCanvas = (): HTMLCanvasElement => {
  if (model_canvas) {
    return model_canvas as HTMLCanvasElement;
  } else {
    // const [canvas, ctx] = createCanvas(512, 512);
    const [canvas, ctx] = createCanvas(576, 576);
    canvas.id = 'canv';
    ctx.lineWidth = 2;
    // canvas.style.transform = 'scale(4)';
    (window as any).canvasDiv.appendChild(canvas);
    // const setCanvasSize = () => {
    //   const [canvas2, ctx2] = createCanvas(canvas.width, canvas.height);
    //   ctx2.drawImage(canvas, 0, 0);
    //   canvas.width = window.innerWidth;
    //   canvas.height = window.innerHeight;
    //   ctx.drawImage(canvas2, 0, 0);
    // };
    // window.addEventListener('resize', setCanvasSize);
    // setCanvasSize();
    model_canvas = canvas;
    return canvas;
  }
};

export const getCtx = (): CanvasRenderingContext2D => {
  return getCanvas().getContext('2d') as CanvasRenderingContext2D;
};

const getImage = (imageName: string): HTMLImageElement =>
  (model_images as ImageCollection)[imageName];
export const getSprite = (spriteName: string): Sprite =>
  (model_sprites as SpriteCollection)[spriteName];
