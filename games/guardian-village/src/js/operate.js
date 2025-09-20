import { TILES, CAN_BUILD_TILE, BUILDINGS, MAP_SIZE, MAP_LENGTH } from "./config"
import { BAG_ITEM, delItem, addItem } from "./bag"
import { MAP_DATA } from "./map"
import Building from "./element/building-card"
import getElementsWithId from "./utils/getdom"
import entityManager from "./entity-manager"

class Operate {
    constructor() {
        this.elem = {}
        this.selectedTile = null
        this.selectedBuilding = null
        this.coin = 100
        this.day = 0
        this.elem = getElementsWithId(document.getElementById('info-bar'))
        this.botbarelem = getElementsWithId(document.getElementById('bot-bar'))
        this.elem.btn_remove.disabled = true
        this.elem.btn_build.disabled = true
        this.elem.btn_move.disabled = true
        this.elem.btn_remove.addEventListener('click', this.removeClick)
        this.elem.btn_build.addEventListener('click', this.buildClick)
        this.elem.btn_move.addEventListener('click', this.moveClick)
        this.botbarelem.next_day.addEventListener('click', this.nextDay.bind(this))
        this.updateBotBar()
        this.initBuilding()
    }
    nextDay(){
        MAP_DATA.mapData.forEach(element => {
            if (BUILDINGS.includes(element)) {
                this.coin += 10
            }
        });
        this.day += 1
        this.updateBotBar()
    }
    updateBotBar() {
        this.botbarelem.text.innerText = `Day ${this.day} | coin💰:${this.coin}`
    }

    initBuilding = () => {
        for (let index of BUILDINGS) {
            let b = new Building(index)
            this.elem.building_list.appendChild(b.html)
        }
    }
    setInfo = (i) => {
        this.elem.info_name.innerText = TILES[i].info_name
        this.elem.info_intro.innerText = TILES[i].introduction
    }
    selectTile = (tile) => {
        if (!tile) {
            this.elem.btn_remove.disabled = true
            this.elem.btn_build.disabled = true
            this.elem.btn_move.disabled = true

            this.elem.info_name.innerText = '...'
            this.elem.info_intro.innerText = '...'
            //this.tileDeSelect()
            return;
        }
        this.selectedTile = tile
        let selectedTileIndex = tile.getIndex()
        let canBuild = CAN_BUILD_TILE.includes(selectedTileIndex)
        this.setInfo(selectedTileIndex)
        this.elem.btn_remove.disabled = canBuild || tile.imageIndexs[1] == -1
        this.elem.btn_build.disabled = canBuild && tile.imageIndexs[1] == -1
        this.elem.btn_move.disabled = canBuild && tile.imageIndexs[1] == -1
        entityManager.updateTileEntity(tile.index)
    }
    moveClick = async () => {
        this.elem.obtg.style.display = 'none'
        await this.move(MAP_DATA.select.index)
        this.elem.obtg.style.display = 'block'
    }
    async move(i, callback = () => { }) {
        let a = entityManager.entitysOnTile[i].length
        let b = TILES[MAP_DATA.mapData[i]].c
        if (MAP_DATA.mapData[i + MAP_LENGTH] != -1) {
            b = TILES[MAP_DATA.mapData[i + MAP_LENGTH]].c
        }
        let c = [...entityManager.selectedEntity.filter(e => e.getIndex() !== i)];
        if (a + c.length > b) {
            alert(`This tile can only accommodate ${b} person`)
            return;
        }
        c = entityManager.selectedEntity
        let paths = []

        for (const e of c) {
            if (e.getIndex() !== i) {
                let n = await e.findPathAndMove(i)
                paths.push(n)

                if (n.path.length == 0) {
                    alert('Unable to reach the destination')
                    return false;
                }
            } else {
                paths.push(null)
            }

        }

        for (const p of paths) {
            if (p == null) {
                callback()
            } else {
                p.move(p.path, callback)

            }
        }
        return true
    }
    removeClick = async () => {
        let index = MAP_DATA.select.getIndex()



        this.selectedTile.remove(true, () => {
            //entityManager.setOffset()
            addItem(TILES[index].result())
            //entityManager.setOffset()

            entityManager.entitysOnTile[this.selectedTile.index].forEach(element => {

                element.moveToTile(element.tileX, element.tileY)
            });
        })
        if (!await this.move(MAP_DATA.select.index, () => {
            this.selectedTile.addSpeed()
        })) return
    }
    buildClick = async () => {
        let met = TILES[this.selectedBuilding.buildingType].material
        for (const iteminfo_name in met) {
            if (BAG_ITEM[iteminfo_name] < met[iteminfo_name]) {
                alert('Insufficient materials')
                this.tileDeSelect()
                return;
            }
        }
        this.selectedTile.build(this.selectedBuilding.buildingType, () => {
            //entityManager.setOffset()
            delItem(met)
            entityManager.selectedEntity.forEach(element => {
                element.moveToTile(element.tileX, element.tileY)
            });
            //entityManager.setOffset()
        })
        if (!await this.move(MAP_DATA.select.index, () => {
            this.selectedTile.addSpeed()
        })) return


        /*
        this.elem.obtg.style.display = 'none'
        if (await this.move(MAP_DATA.select.index)) {
            this.selectedTile.build(this.selectedBuilding.buildingType, () => {
                delItem(met)
                this.tileDeSelect()
                this.elem.obtg.style.display = 'block'
            })
        } else {
            this.elem.obtg.style.display = 'block'
        }*/
    }
    tileDeSelect = () => {
        if (MAP_DATA.select) {
            MAP_DATA.select.deSelect()
        }
    }
}


let operate = new Operate()
export default operate


/*
const this.buildingData = {
}
export { initOperate, selectTile, this.buildingData }
*/