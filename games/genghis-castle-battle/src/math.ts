export const isEven = (n: number): boolean => n % 2 === 0

export const clamp = (n: number, min: number, max: number): number =>
    Math.min(Math.max(n, min), max)