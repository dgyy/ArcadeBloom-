export interface Vector {
    x: number;
    y: number;
}

export const ZERO = { x: 0, y: 0 };

export const normalize = (v: Vector): Vector => {
    const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
    if(magnitude == 0) return ZERO;
    return { x: v.x / magnitude, y: v.y / magnitude };
}

export const distance = (a: Vector, b: Vector): number => {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return Math.sqrt(dx * dx + dy * dy);
}

export const lerp = (a: Vector, b: Vector, t: number, easer: (val: number) => number): Vector => {
    const ease = easer(t);
    return {
        x: a.x + ease * (b.x - a.x),
        y: a.y + ease * (b.y - a.y)
    };
}

export const offset = (v: Vector, x: number, y: number): Vector => {
    return {
        x: v.x + x,
        y: v.y + y
    }
}