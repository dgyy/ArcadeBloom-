import { MAP_SIZE, MAP_LENGTH } from "./config";
const generateMap = () => {
    const ground = (index) => {
        let x = index % MAP_SIZE[1]
        if (x > MAP_SIZE[0] / 2 && x < MAP_SIZE[0] / 2 + 2 && Math.floor(index / MAP_SIZE[1])!=5) {
            return 2
        }
        return 1
    }
    const building = (index) => {
        if (MAP_DATA.mapData[index - MAP_LENGTH] == 2) {
            return -1
        }
        return Math.random() < 0.05 ? 3 : (Math.random() < 0.1 ? 4 : -1);
    }
    MAP_DATA.mapData = new Array(MAP_LENGTH * 2).fill(-1)
    MAP_DATA.mapData = new Proxy(MAP_DATA.mapData, mapHandler)

    for (const index in MAP_DATA.mapData) {
        MAP_DATA.mapData[index] = index >= MAP_LENGTH ? building(index) : ground(index);
    }
}
const mapHandler = {
    set(target, property, value) {
        let objectIndex = property % MAP_LENGTH
        MAP_DATA.mapObject[objectIndex].setImage(value, Math.floor(property / MAP_LENGTH))
        return Reflect.set(target, property, value);
    }
};

const MAP_DATA = { mapObject: [], mapData: [], select: null, disableSelect: false }
export {
    generateMap,
    MAP_DATA,
}