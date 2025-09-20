export function weightedRandNumber(weights: Map<number, number>): number | undefined {
    let total = 0
    for (const value of weights.values()) {
        total += value;
    }

    let sum = 0
    const r = Math.random()
    for (const key of weights.keys()) {
        const weight = weights.get(key)
        if (weight) {
            sum += weight
            if (r <= sum / total)
                return key as number;

        }
    }
}