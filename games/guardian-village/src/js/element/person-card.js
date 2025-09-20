import element from "./element";
import operate from "../operate";
import { ENTITY } from "../config";
import getElementsWithId from "../utils/getdom";
class EntityCard extends element {
    constructor(e, entity) {
        super(`<div class="person-card"><button id="x">x</button><button id="job">job</button><p id="lable"></p><div class="jobs" id="job-bar" style="display:none"><button id="d">doctor 100💰</button><button id="s">soldier 25💰</button><button id="f">worker 10💰</button></div></div>`)
        this.element = getElementsWithId(this.html)
        console.log(this.element)
        this.element.x.addEventListener('click', this.click.bind(this))
        this.element.job.addEventListener('click', this.jobClick.bind(this))
        
        this.entity = e
        this.entityManager = entity
        this.initElem()
    }
    click() {
        if (operate.selectedBuilding) {
            operate.selectedBuilding.deSelect()
        }
        this.select()
    }
    jobClick() {
        this.element.job_bar.style.display = this.element.job_bar.style.display == 'none' ? 'block' : 'none'
    }
    initElem() {
        let selected = this.entityManager.selectedEntity.includes(this.entity)
        let a = selected ? '[selected]' : ''
        this.element.x.innerText = selected ? 'deselect' : 'select'
        this.element.lable.innerText = this.entity.name + a
    }
    select() {
        this.entityManager.selectEntity(this.entity)
    }

}
export default EntityCard


/*
    clip-path: polygon(0 0,8px 0,8px 8px,0 8px);
    object-position: 
    calc(-1 * calc(var(--start-x)*8px))
    calc(-1 * calc(var(--start-y)*8px));
*/