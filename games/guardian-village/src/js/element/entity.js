import img from '../../img/img.png'
import element from './element'
import findPath from '../utils/path-finder'
import { MAP_LENGTH, MAP_SIZE, HOUSE } from '../config'
import { MAP_DATA } from '../map'
import wait from '../utils/wait'

class Entity extends element {
    constructor(entityManager) {
        super(`<div class="move"><img class="entity clip"/></div>`)
        this.element = {
            img: this.html.querySelector('img'),
            entity: this.html,
        }
        this.entityManager = entityManager
        this.tileX = 0;
        this.tileY = 0;
        this.offsetX = 0//Math.random() * 20
        this.offsetY = 0//Math.random() * 20
        this.moveSpeed = 0
        this.canSelect = true
        this.initElem()
        this.moveToTile(0, 0)
        this.setEntitysOnTile(true)
        this.setOffset()
        this.moveToTile(0, 0)

        this.element.entity.addEventListener('click', () => { this.entityManager.selectEntity(this) })

    }
    setOffset() {
        this.offsetX = (Math.max(this.entityManager.entitysOnTile[this.getIndex()].indexOf(this), 0)) * 10
        this.moveTo(this.x, this.y)
    }
    initElem() {
        this.element.img.src = img
    }
    getIndex() {
        return this.tileX + this.tileY * MAP_SIZE[1]
    }
    select() {
        this.element.entity.classList.add('selected-entity')
    }
    deSelect() {
        this.element.entity.classList.remove('selected-entity')
    }
    setEntitysOnTile(d) {

        let l = this.entityManager.entitysOnTile[this.getIndex()]
        if (d) {
            l.push(this)
        } else {
            l.splice(l.indexOf(this), 1)
        }
    }
    async findPathAndMove(end) {
        this.setEntitysOnTile(false)
        const isWall = (index) => {
            return index != end && MAP_DATA.mapData[index + MAP_LENGTH] != -1 || MAP_DATA.mapData[index] != 1;
        };
        const move = async (paths, callback) => {
            if (paths.length > 0) {
                for (const path of paths) {
                    let x = path % MAP_SIZE[1]
                    let y = Math.floor(path / MAP_SIZE[1])
                    await this.moveToTileTwen(x, y)
                }
                this.setEntitysOnTile(true)
                this.setOffset()
                callback()
            }
        }
        let path = await findPath(this.getIndex(), end, MAP_SIZE[1], MAP_SIZE[0], isWall)
        return { path, move: move.bind(this) }
    }
    async moveToTileTwen(x, y) {
        if (this.tileX == x && this.tileY == y) return;
        this.tileX = x;
        this.tileY = y;
        this.startx = this.x;
        this.starty = this.y;
        const a = async (i) => {
            this.moveTo(this.startx + (x * 40 - this.startx) * i, this.starty + (y * 40 - this.starty) * i);
        };
        await wait(60, this.moveSpeed, a.bind(this));
        this.moveToTile(x, y);
    }
    moveToTile(x, y) {
        this.element.entity.style.display = HOUSE.includes(MAP_DATA.mapData[this.getIndex() + MAP_LENGTH]) ? 'none' : 'block'
        this.tileX = x;
        this.tileY = y;
        this.moveTo(x * 40, y * 40);
    }
    moveTo(x, y) {
        x = Math.floor(x)
        y = Math.floor(y)
        this.x = x
        this.y = y
        this.element.entity.style.setProperty('--x', x + this.offsetX + 'px')
        this.element.entity.style.setProperty('--y', y + this.offsetY + 'px')
    }
    setClip(v) {
        let as = ['--start-x', '--start-y', '--width', '--height']
        for (let a in as) {
            this.element.img.style.setProperty(as[a], v[a] + 'px')
        }
    }
}

export default Entity