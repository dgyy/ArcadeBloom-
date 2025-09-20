const Mesh = (vertices, indices, colors, position = vector3(), rotation = vector3(), scale = vector3(1, 1, 1)) => {
    let finalColors = [];
    for (let color of colors) for (let i = 0; i < color[1]; i++) finalColors.push(...hexToRgbArray(color[0]));
    return ({ geometry: Geometry(vertices.map(v => v / 100), indices, finalColors), position, rotation, scale });
},

    hexToRgbArray = hex => [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255],

    larchTree = position => {
        meshes.push(Mesh(trunk.v.randomise(.1), trunk.i, makeColors(trunk, '#cc7Fb3'), position, vector3(0, 0, 0), vector3(1, 1, 1)));
        for (let i = 0; i < 30; i++) meshes.push(Mesh(leaf.v, leaf.i, makeColors(leaf, '#01796f'), add(position, vector3(0, 10 - i / 5, 0)), vector3(0, i, 0), vector3((1 - 1 / i) ** 2, (1 - 1 / i) ** 2, (1 - 1 / i) ** 2)))
    },

    hazelTree = position => {
        meshes.push(Mesh(circleTree.v.randomise(.2), circleTree.i, makeColors(circleTree, '#cc7Fb3'), add(position, vector3(0, .5, 0)), vector3(0, 0, 0)));
        for (let i = 0; i < 6; i++) meshes.push(Mesh(ball.v, ball.i, makeColors(ball, '#01796f'), add(vector3(3 - random() * 6, 6 + 2.4 + random(), 2 - random() * 4), position), vector3(Math.PI - Math.PI * 2 * random(), Math.PI - Math.PI * 2 * random(), Math.PI - Math.PI * 2 * random()), vector3(2.4 + random() * 3, 2.4 + random() * 3, 2.4 + random() * 3)))

    },

    rocks = position => {
        for (let i = 0; i < 6; i++) meshes.push(Mesh(ball.v, ball.i, makeColors(ball, '#6f6786'), add(position, vector3(1.5 - random() * 3, .5 - random() * 1, 1.5 - random() * 3)), vector3(random() * 2 * Math.PI, random() * 2 * Math.PI, random() * 2 * Math.PI), vector3(.5 + random(), .5 + random(), .5 + random())));
    },

    grassBunch = position => {
        for (let i = 0; i < 5; i++) {
            let g = Mesh(grass.v, grass.i, makeColors(grass, '#32cd32'), add(position, vector3(.2 - random(.4), 0, .2 - random(.4))), vector3(0, Math.PI * 2 * random(), 0), vector3(1, .5 + random(.5), 1));
            meshes.push(g);
            grassBunches.push(g);
        }
    },
    SpawnPotionGlass = position => { let potionMesh = Mesh(potion.v, potion.i, potion.c, position); meshes.push(potionMesh), potions.push(potionMesh) },

    makeColors = (geometryData, hex) => [[hex, geometryData.i.length]];

Array.prototype.randomise = function (plusminus) { return this.map(v => v + (random() * plusminus - random() * 2 * plusminus)); };

const levelMeshes = [-1, 0, 0, 0, 0, -12, 0, 52, 0, -8, 0, 32, 0, -5, 0, 24, 0, -6, 0, 49, 0, 4, 0, 47, 0, 7, 0, 30, 0, 10, 0, 8, 0, 9, 0, 77, 0, 1, 0, 75, 0, 16, 0, -1, 0, -10, 0, -11, 0, -2, 0, -16, 0, 30, 0, -30, 0, 24, 0, -65, 0, -23, 0, -60, 0, -28, 0, -48, 0, -30, 0, -24, 1, 28, 0, -25, 1, -14, 0, 74, 1, -8, 0, 80, 1, 30, 0, -28, 1, 32, 0, -60, 1, -7, 0, -70, 1, -17, 0, -60, 1, -11, 0, 48, 1, 2, 0, 45, 1, -12, 0, 5, 2, 18, 0, -3, 2, 19, 0, -2, 2, 18, 0, -1, 2, 10, 0, 53, 2, 11, 0, 55, 2, 10, 0, 56, 2, 4, 0, -27, 2, 5, 0, -27, 2, 3, 0, -27, 2, 4, 0, 35, 2, 7, 0, 76, 2, 8, 0, 77, 3, -25, 0, -43, 3, - 9, 0, -5, 3, 19, 0, -10, 3, 24, 0, -41, 3, 15, 0, -53, 3, 5, 0, 20, 3, - 3, 0, 32, 3, - 1, 0, 46, 3, - 6, 0, 53, 3, - 2, 0, 64, 3, 0, 0, 38, 3, 0, 0, 20, 3, -7, 0, 78];

loadLevelMeshes = (meshesTypes) => {
    for (let i = 0; i < meshesTypes.length; i += 4) {
        let position = vector3(meshesTypes[i + 1], meshesTypes[i + 2], meshesTypes[i + 3]);
        switch (meshesTypes[i]) {
            case -1: meshes.push(Mesh(island.v, island.i, island.c));
            case 0: larchTree(position); break;
            case 1: hazelTree(position); break;
            case 2: rocks(position); break;
            case 3: let npc = Npc([samuraiBody, leftArm, rightArm, leftFoot, rightFoot], position); npcs.push(npc); break;
            default: break;
        }
    }
}