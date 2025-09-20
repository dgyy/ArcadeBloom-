const FARM = {name: "farm", health: 75, height: 1, length:1, width: 1};
const YURT = {name: "yurt", health: 75, height: 1, length:1, width: 1};
const STABLES = {name: "stables", health: 75, height: 2, length:2, width: 2, resources: {food: 50, gold:10}};

class Building{
    constructor(owner, base_stats, coord, unitPriorities ){
        this.owner = owner;

        this.name   = base_stats.name;
        this.health = base_stats.health;
        this.width = base_stats.width;
        this.height = base_stats.height;
        this.length = base_stats.length;
        this.resources = base_stats.resources;

        //coord is the top left point - the building may be 2x2
        this.coord = coord;
        this.coords = this.calculateCoords();

        this.unitPriorities = unitPriorities; //the units that the AI will try to build
        this.destroyed = false;
    }

    calculateCoords(){
        let coords = []; 

        for (let x = this.coord[0]; x < this.coord[0] + this.length; x++) {
            for (let y = this.coord[1]; y < this.coord[1] + this.height; y++) {
                coords.push([x,y]);
            }
        }

        return coords
    }

    produce(unit, coord){
        
        let unitObject;

        if(this.owner === "player"){

            unitObject = new Unit ("player", unit, coord);
            controller.player.units.push(unitObject);

        }

        if(this.owner === "computer"){

            unitObject = new Unit ("computer", unit, coord, {type:"aggressive"});
            controller.computer.units.push(unitObject);
        }

        controller.view.drawUnit(unitObject, "computer")

    }

    calculateNearestFreeSpot(location, range){
        for (let i = location[0]-range; i < location[0]+range; i++){
            for (let j = location[1]-range; j < location[1]+range; j++){
                let spot = [i,j]
                controller.updateTakenSpots();
                if(!controller.takenSpotIncludes(spot)){
                    return spot;
                }

            }
        }
    }

    destroySelf(){
        if(this.owner === "player"){
            for (const [index, building] of controller.player.buildings.entries()) {
                if ((building === this) && (this.destroyed === false)){

                    controller.player.buildings.splice(index, 1);

                    controller.view.eraseBuilding(this, this.owner);
                    this.destroyed = true;
                    return;
                }
                
            }
        }

        if(this.owner === "computer"){
            for (const [index, building] of controller.computer.buildings.entries()) {
                if ((building === this) && (this.destroyed === false)){

                    controller.computer.buildings.splice(index, 1);

                    controller.view.eraseBuilding(this, this.owner);
                    this.destroyed = true;
                    return;
                }
                
            }
        }


    }
}