export const MAP_SIZE = [15, 20]
export const MAP_LENGTH = MAP_SIZE[0] * MAP_SIZE[1]

export const CAN_BUILD_TILE = [0]
export const HOUSE = [5,6,7,8,9]
export const TILES = [
    {},
    {
        name: 'soil',
        introduction: 'a natural medium for plant growth',
        c:3
    },
    {
        name: 'river',
        introduction: 'a natural flowing watercourse'
    },
    {
        name: 'tree',
        introduction: 'a tall plant with a trunk and branches',
        hardness: 2,
        result: () => {
            return { 0: 1 }
        }
    },
    {
        name: 'stone',
        hardness: 5,
        introduction: 'a hard, solid mineral material',
        result: () => {
            return { 2: 6 }
        }
    },
    {
        name: "Workers' Home",
        hardness: 4,
        introduction: 'Can accommodate 4 workers',
        material:{ 1: 2,0:3,2:5 },
        result: () => {
            return { 1: 1,2:3 }
        },
        c:4
    },
    {
        name: "Villagers' Home",
        hardness: 4,
        introduction: 'Can accommodate 6 Villagers',
        material:{ 1: 2,0:2,3:2 },
        result: () => {
            return { 1: 1,2:2 }
        },
        c:6
    },
    {
        name: 'Barracks',
        hardness: 4,
        introduction: 'Train Soldiers (Capacity of 10 Soldiers)',
        material:{ 1:3,2:5,0:3 },
        result: () => {
            return { 1:2,2:2,0:2 }
        },
        c:10
    },
    {
        name: 'Hospital',
        hardness: 4,
        introduction: 'Treating the injured',
        material:{ 1:5,2:10,0:6 },
        result: () => {
            return { 1:2,2:2,0:3 }
        }
    },
    {
        name: 'Bartizan',
        hardness: 5,
        introduction: 'Archers shooting from above',
        material:{ 1:5,0:3 },
        result: () => {
            return { 1: 2 }
        },
        c:1
    },
    {
        name: 'Wall',
        hardness: 5,
        introduction: 'a Hard wall',
        material:{ 2:1 },
        result: () => {
            return {2:1}
        }
    },
    {
        name: 'Stable',
        hardness: 2,
        introduction: 'Farmers can raise horses inside',
        material:{ 2:1 },
        result: () => {
            return { 1: 5 }
        }
    }
];
export const ENTITY = [
    'villager',
    'worker',
    'doctor',
    'soldier'
]

export const ENTITY_PRISE = [
    -1,
    10,
    100,
    25
]
export const BUILDINGS = [
    5,6, 7,8,9,10,11
]
export const ITEMS = ['wood', 'leaf', 'stone', 'seed']