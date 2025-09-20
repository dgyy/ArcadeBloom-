import Entity from "../Entity";
class Player extends Entity{
    constructor(entityManager){
        super(entityManager)
        this.setClip([104,0,2,5])
        this.name = 'villager'
    }
    changeJob(job){
        this.setClip([104+job*2,0,2,5])

    }
}
export default Player