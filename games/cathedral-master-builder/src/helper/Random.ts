class Random {

    constructor() {

    }

    // generates a random number with a uniform distribution
    generateUniform(minMax: number[]): number {

        return Math.random() * (minMax[1] - minMax[0]) + minMax[0];

    }

}

export default new Random();