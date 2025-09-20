import Player from "./element/entitys/player"
import map from './display'
import { MAP_LENGTH } from "./config"
import getElementsWithId from "./utils/getdom"
import EntityCard from "./element/person-card"
import operate from "./operate"

class EntityManager {
    constructor() {
        this.entityPool = []
        this.selectedEntity = []
        this.entitysOnTile = Array.from({ length: MAP_LENGTH }, () => [])
        this.baseElem = document.getElementById('entity-bar')
        this.elem = getElementsWithId(this.baseElem)
    }
    setList(d,l){
        d.innerHTML = ''
        for (const e of l) {
            let card = new EntityCard(e,this)
            d.appendChild(card.html)
        }
    }
    updateSelected() {
        this.setList(this.elem.select_entity_list,this.selectedEntity)
        if (operate.selectedTile) {
            this.updateTileEntity(operate.selectedTile.index)
        }
        
    }
    updateTileEntity(t){
        this.setList(this.elem.tile_entity_list,this.entitysOnTile[t])
    }
    setOffset(){
        for (const e of this.selectedEntity) {
            e.setOffset()
        }
    }
    addEntity() {
        let e = new Player(this)
        this.entityPool.push(e)
        map.appendEntityChild(e)
    }
    cleanSelect() {
        this.selectEntity.forEach(element => {
            element.deSelect()
        });
        this.selectedEntity = []
        this.updateSelected()
    }
    selectEntity(t) {
        if (this.selectedEntity.includes(t)) {
            t.deSelect()
            this.selectedEntity.splice(this.selectedEntity.indexOf(t),1)
            this.updateSelected()
            return false
        } else {
            t.select()
            this.selectedEntity.push(t)
            this.updateSelected()
            return true
        }

    }
}

let entityManager = new EntityManager()
export default entityManager