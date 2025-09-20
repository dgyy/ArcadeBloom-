export type HEX = number;

export const RED = 0xFF0000FF;
export const GREEN = 0xFF00FF00;
export const BLUE = 0xFFFF0000;

export const LIGHT_BLUE = 0xFFFFFF00;
export const YELLOW = 0xFF00FFFF;
export const PURPLE = 0xFFFF00FF;
export const BLACK = 0xFF000000;
export const WHITE = 0xFFFFFFFF;
export const FLAMINGO = 0xFFAC8ECF;

export const isColor = (target: HEX) => (color: HEX): boolean => {
  const r1 = target & 0xff;
  const g1 = (target >> 8) & 0xff;
  const b1 = (target >> 16) & 0xff;
  const r2 = color & 0xff;
  const g2 = (color >> 8) & 0xff;
  const b2 = (color >> 16) & 0xff;
  return r2 !== 0 && r1 === r2 && g1 === g2 && b1 === b2;
};

export const isGray = (color: HEX): boolean => {
  const r = color & 0xff;
  const g = (color >> 8) & 0xff;
  const b = (color >> 16) & 0xff;
  return r !== 0 && r === g && g === b;
};

export const returnFalse = () => false;

export const getElementById = (id: string): HTMLElement => {
  const el = document.getElementById(id);

  if (el === null) {
    throw new Error(`No #${id} element found`);
  }

  return el;
}
