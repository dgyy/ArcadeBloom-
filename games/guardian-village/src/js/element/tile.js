import element from "./element";
import { MAP_DATA } from "../map";
import operate from "../operate";
import { MAP_LENGTH, TILES } from "../config"
import img from '../../img/img.png'
import wait from "../utils/wait";
import { increaseStep } from "../utils/wait";
class tile extends element {
    constructor() {
        super(`<div class="tile"><img class="tile-image image"/><img class="tile-image image"/></div>`)
        this.element = {
            img: this.html.querySelectorAll('img'),
            tile: this.html,
        }
        this.imageIndexs = [-1, -1]
        this.initImage()
        this.updateImage()
        this.element.tile.addEventListener('click', this.click.bind(this));
    }
    updateImage() {
        for (const i in this.imageIndexs) {
            this.element.img[i].style.setProperty('--show', this.imageIndexs[i] == -1 ? 'none' : 'block')
            this.element.img[i].style.setProperty('--start-x', this.imageIndexs[i])
        }
    }
    initImage() {

        for (let index = 0; index < 2; index++) {
            this.element.img[index].src = img
        }

    }
    setImage(value, layer) {
        this.imageIndexs[layer] = value
        this.updateImage()
    }
    click() {
        if (!MAP_DATA.disableSelect) {
            if (MAP_DATA.select) {
                MAP_DATA.select.deSelect()
            }
            this.select()
        }

    }
    select() {
        MAP_DATA.select = this
        operate.selectTile(MAP_DATA.select)
        this.element.tile.classList.add('selected-tile')
    }
    deSelect() {
        this.element.tile.classList.remove('selected-tile')
    }
    getIndex() {
        return this.imageIndexs[this.imageIndexs[1] == -1 ? 0 : 1]
    }
    removeData() {
        this.element.tile.style.setProperty('--r', 0)
        MAP_DATA.mapData[this.index + MAP_LENGTH] = -1
    }
    changeing(i) {
        this.element.tile.style.setProperty('--r', i)
    }
    async remove(obtain, callback) {
        this.speed = 0
        MAP_DATA.disableSelect = true
        /* await wait(100, TILES[this.getIndex()].hardness / this.speed,
             this.changeing.bind(this)
         )*/

        const end = () => {
            this.removeData()
            callback()
            MAP_DATA.disableSelect = false
            //operate.selectTile(null)
        }
        
        this.timer = increaseStep(0, TILES[this.getIndex()].hardness, this.changeing.bind(this), end)
        this.timer.start();
    }
    async addSpeed(speed = 0.1) {
        this.timer.addSpeed(speed)
    }
    buildData(buidling) {
        this.element.tile.style.setProperty('--r', 0)

        operate.selectTile(null)
        MAP_DATA.mapData[this.index + MAP_LENGTH] = buidling
    }
    async build(buidling, callback) {
        this.speed = 0
        MAP_DATA.disableSelect = true
        const end = () => {
            this.buildData(buidling)
            callback()
            MAP_DATA.disableSelect = false
        }
        this.timer = increaseStep(0, 5, this.changeing.bind(this), end)
        this.timer.start();
    }
}
export default tile


/*
    clip-path: polygon(0 0,8px 0,8px 8px,0 8px);
    object-position: 
    calc(-1 * calc(var(--start-x)*8px))
    calc(-1 * calc(var(--start-y)*8px));
*/