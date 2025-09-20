
export type RectKey = string

export const rect_vs_point = (x: number, y: number, w: number, h: number, ax: number, ay: number) => {
  return x <= ax && ax <= x + w && y <= ay && ay <= y + h
}

export const rect2key = (x: number, y: number, w: number, h: number) => [x, y, w, h].join('r')
export const key2rect = (key: string) => key.split('r').map(_ => parseFloat(_)) as [number, number, number, number]


