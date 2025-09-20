import element from "./element";
import operate from "../operate";
import { TILES,ITEMS } from "../config";
import img from '../../img/img.png'

class BuildingCard extends element {
    constructor(buildingType) {
        super(`<div class="building-card"><img class="build-icon image"/><p></p></div>`)
        this.element = {
            img: this.html.querySelector('img'),
            label: this.html.querySelector('p'),
            Building: this.html,
        }
        this.buildingType = buildingType;
        this.initElem()
        this.updateImage()
        this.element.Building.addEventListener('click', this.click.bind(this))
    }
    click() {
        if (operate.selectedBuilding) {
            operate.selectedBuilding.deSelect()
        }
        this.select()
    }
    updateImage() {
        this.element.img.style.setProperty('--start-x', this.buildingType)
    }
    initElem() {
        //console.log(this.html)
        
        this.element.img.src = img
        let s = ''
        let met = TILES[this.buildingType].material
        for (const i in met) {
            s += ITEMS[i] + '*' + met[i] + ','
        }
        s = s.substring(0, s.length - 1);
        this.element.label.innerText = TILES[this.buildingType].name + '\n' + TILES[this.buildingType].introduction + '\n' + s
    }
    select() {
        operate.selectedBuilding = this
        this.element.Building.classList.add('selected-card')
    }
    deSelect() {
        this.element.Building.classList.remove('selected-card')
    }

}
export default BuildingCard


/*
    clip-path: polygon(0 0,8px 0,8px 8px,0 8px);
    object-position: 
    calc(-1 * calc(var(--start-x)*8px))
    calc(-1 * calc(var(--start-y)*8px));
*/