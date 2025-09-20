export const hsla = (h: number, s = 100, l = 100, a = 1): string =>
    `hsla(${h}, ${s}%, ${l}%, ${a})`

export const rgba = (r: number, g: number, b: number, a = 1): string =>
    `rgba(${r}, ${g}, ${b}, ${a})`