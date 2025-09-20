import Tile from "./element/tile";
import { MAP_LENGTH, MAP_SIZE } from "./config";
import { MAP_DATA } from "./map"
import getElementsWithId from "./utils/getdom"

class Map {
  constructor() {
    document.documentElement.style.setProperty('--map-heigh', MAP_SIZE[0])
    document.documentElement.style.setProperty('--map-width', MAP_SIZE[1])
    this.baseElem = document.getElementById('map')
    this.elem = getElementsWithId(this.baseElem);

    for (let index = 0; index < MAP_LENGTH; index++) {
      let tile = new Tile()
      MAP_DATA.mapObject.push(tile)
      tile.index = index
      this.baseElem.appendChild(tile.html)
    }
  }
  appendEntityChild(e) {
    this.baseElem.appendChild(e.html)
    //console.log('add en',e)
  }
}
let map = new Map()
export default map