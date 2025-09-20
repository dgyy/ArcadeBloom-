class Computer{
    constructor(level){

        switch (level) {
            case 1:
                this.supply = 5;
                this.units =[

                    new Unit("computer", VILLAGER, [4,3], {type:"farmer", farm:[5,3]}),
                    new Unit("computer", VILLAGER, [4,4], {type:"farmer", farm:[5,4]}),
                    new Unit("computer", VILLAGER, [7,3], {type:"farmer", farm:[6,3]}),
                    new Unit("computer", VILLAGER, [7,4], {type:"farmer", farm:[6,4]}),
                    new Unit("computer", VILLAGER, [22,3], {type:"builder", buildings:[["yurt",[21,4]],["yurt",[22,4]],["yurt",[22,3]],["yurt",[23,4]],["yurt",[23,3]], ["yurt",[24,3]], ["yurt",[24,4]]], }),

                ]

                this.buildings =[
                    new Building("computer", FARM, [5,3]),
                    new Building("computer", FARM, [5,4]),
                    new Building("computer", FARM, [6,3]),
                    new Building("computer", FARM, [6,4]),

                    new Building("computer", YURT, [19,3], ["villager"]),
                    new Building("computer", YURT, [19,4], ["villager"]),
                    new Building("computer", YURT, [20,3], ["villager"]),
                    new Building("computer", YURT, [20,4], ["villager"]),
                    new Building("computer", YURT, [21,3], ["villager"]),
                ]

                this.resources = {food:0, gold:0}
                break;
        
            default:
                break;
        }
    }

    computerTurn(){
        this.units.forEach(
            (unit)=>{
                // console.log(unit.AI_behaviour.type);
                unit.moved = false;
                unit.attacked = false;

                if (unit.AI_behaviour.type ==="farmer"){
                    if (Math.abs(unit.coord[0] - unit.AI_behaviour.farm[0] <= 1) && Math.abs(unit.coord[1] - unit.AI_behaviour.farm[1] <=1)){
                        this.resources.food +=1;
                        // console.log(unit, "farmed. Food is now at:",this.resources.food);
                    }
                    else{
                        unit.findClosestPath(unit.AI_behaviour.farm);
                    }
                }

                else if (unit.AI_behaviour.type === "builder"){
                    if (unit.AI_behaviour.buildings.length >= 1){
                        let building_location = unit.AI_behaviour.buildings[0][1];

                        if(unit.coord[0]>=building_location[0]){

                            controller.view.eraseUnit(unit, "computer");
                            unit.move([building_location[0]+1, building_location[1]]);
                            controller.view.drawUnit(unit, "computer");
                            // controller.view.displayAll();
                            if(unit.AI_behaviour.buildings[0][0] === "yurt" && this.resources.food > 5){
                                this.resources.food -=5;
                                unit.build(YURT, building_location, ["villager"]);
                                this.supply +=1;
                                unit.AI_behaviour.buildings.shift();
                            }
                        }
                    }


                }

                else if (unit.AI_behaviour.type ==="aggressive"){
                    // console.log("HERE");
                    let target = unit.findClosestEnemy();
                    // console.log(target);
                    // console.log(target);
                    let attackable = unit.calculatePossibleAttacks();
                    attackable.forEach((attackSquare)=>{
                        if(convertToHtml(target).toString() === convertToHtml(attackSquare).toString()){
                            let enemy = getEntityAt(target);
                            console.log(enemy);
                            if (enemy){
                                unit.attack(target);
                                if(enemy.health <= 0){
                                    enemy.destroySelf();
                                }
                            }
                        }
                    })

                    unit.findClosestPath(target);
                }

                
                if (controller.player.units.length ===0){
                    alert("You Lost!");
                }
            }

        )

        // console.log(this.units.length);
        // console.log(this.supply);
        // console.log(this.resources.food);
        this.buildings.forEach((building)=>{

            if (building.name === "yurt"){
                
                if(building.unitPriorities !== undefined ){
                    let building_location = building.coord;
                    let unit_location = building.calculateNearestFreeSpot(building_location, 1);
                    // console.log(unit_location);
                    if ((building.unitPriorities[0] === "villager") && (this.resources.food > 2) && (this.supply > this.units.length) && (unit_location != undefined)){
                        building.produce(VILLAGER, unit_location);
                        this.resources.food -= 2;
                    }
                }

            }
        })

    }

}