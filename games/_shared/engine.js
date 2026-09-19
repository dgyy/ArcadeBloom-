export function seeded(seed) {
    let state = 2166136261;
    for (const c of seed) state = Math.imul(state ^ c.charCodeAt(0), 16777619);
    return () => {
        state += 0x6D2B79F5;
        let n = Math.imul(state ^ state >>> 15, 1 | state);
        n ^= n + Math.imul(n ^ n >>> 7, 61 | n);
        return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
}

export function challenge(search) {
    const params = new URLSearchParams(search);
    const seed = params.get('seed');
    if (!seed || !/^(?:d-\d{4}-\d{2}-\d{2}|p-[a-z0-9]{1,16})$/.test(seed)) return null;
    if (seed.startsWith('d-')) {
        const time = Date.parse(seed.slice(2));
        if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== seed.slice(2)) return null;
    }
    const raw = params.get('score');
    const score = raw !== null && /^\d{1,5}$/.test(raw) ? Number(raw) : null;
    return { seed, score: score !== null && score <= 20000 ? score : null };
}

export function lockResult(angle, target, width) {
    const error = Math.abs(((angle - target + 540) % 360) - 180);
    const hit = error <= width / 2;
    const perfect = hit && error <= width / 6;
    return { hit, perfect, error, points: hit ? Math.round(100 + 200 * (1 - error / (width / 2))) : 0 };
}

export function lockRound(random, round) {
    return { target: random() * 360, start: random() * 360,
        width: Math.max(14, 74 - round * 3), speed: 78 + round * 12,
        direction: random() > .5 ? 1 : -1, feint: round >= 8 && random() > .35 };
}

export function echoRound(random, round) {
    const length = Math.min(9, 3 + Math.floor(round * .65));
    const sequence = [];
    while (sequence.length < length) {
        const cell = Math.floor(random() * 9);
        if (cell !== sequence.at(-1)) sequence.push(cell);
    }
    const reverse = round >= 3 && round % 3 === 0;
    const mirror = round >= 5 && round % 4 === 1;
    return { sequence, reverse, mirror, duration: Math.max(270, 680 - round * 38) };
}

export function echoInput(sequence, rule) {
    let result = rule.reverse ? [...sequence].reverse() : [...sequence];
    if (rule.mirror) result = result.map(cell => cell % 3 === 0 ? cell + 2 : cell % 3 === 2 ? cell - 2 : cell);
    return result;
}

export function echoPoints(length, errors, replayed) {
    return Math.max(0, length * 100 - errors * 75 - (replayed ? 100 : 0));
}
