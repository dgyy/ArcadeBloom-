export const clamp = (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
}

export const clamp01 = (num: number): number => {
    return clamp(num, 0, 1);
}

export const moveTowards = (num: number, target: number, max: number): number => {
    return num + (target > num ? Math.min((target - num), max) : Math.max((target - num), -max));
}