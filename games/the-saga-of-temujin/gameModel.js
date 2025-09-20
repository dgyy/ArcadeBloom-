class Player{
    constructor(level){

        switch (level) {
            case 1:
                this.units =[
                    new Unit(VILLAGER, [20,22]),
                    new Unit(CAVALRY, [18,22]),
                ]

                this.buildings =[
                    new Building("stables", 75, document.querySelector('.x22.y22'),4),
                ]
                break;
        
            default:
                break;
        }
    }

    resetMovement(){
        this.units.forEach((unit)=>{
            unit.moved=false;
        });
    }

    getUnits(){
        return this.units;
    }

    getBuildings(){
        return this.buildings;
    }

    destroyUnit(unit){
        let unit_index = this.units.indexOf(unit);
        this.units.splice(unit_index,1);
    }

    destroyBuilding(building){
        let building_index = this.buildings.indexOf(building);
        this.buildings.splice(building_index,1);
    }

    playerTurn(){
        this.units.forEach((unit)=>{
            let event = () => unit.displayActions(event);
            unit.location.addEventListener("click", event);
        })
    }

}

const VILLAGER = {name:"villager", health:10, range:2, damage:1, movement:1}
const CAVALRY = {name:"cavalry", health:15, range:2, damage:5, movement:3}

class Unit{
    constructor(base_stats, coord, AI_behaviour){
        this.name = base_stats.name,
        this.health = base_stats.health,
        this.range = base_stats.range,
        this.damage = base_stats.damage,
        this.movement = base_stats.movement,

        this.coord = coord;
        this.location = findHtmlSquareElement(this.coord),

        this.movable_events = [];
        this.attackable_events = [];
        this.selectable_events = [];
        
        this.moved = false;
        this.attacked = false;
        this.selected = false;


        this.AI_behaviour = AI_behaviour;
    }

    move(location, coord){
        console.log(this);
        if(this.selected===true){
            this.coord = coord;
            this.location.innerHTML="<div class='square_overlay'></div>";
            this.moved = true;
    
            this.location = location;
            this.toggleSelection();
            controller.updateView();

            this.clearMovable();
            this.moved=true;
        }

    }

    attack(location){
        
    }

    clearMovable(){
        let movable = document.querySelectorAll(".movable");
        if(movable.length != 0){
            movable.forEach(square => {
                console.log(square, square.classList);
                square.classList.remove("movable");
                console.log(square, square.classList);
            });
        }

        this.movable_events.forEach((event)=>{
            event[0].removeEventListener("click",event[1]);
        });

        this.movable_events = [];

    }

    displayActions(event){

        this.toggleSelection();
        if(this.selected===true){
            if (this.moved === false){
                this.displayMovement(event);
            }
            if (this.attacked === false){
                this.displayAttack();
            }
        }

        // this.selected=true;

    }

    displayMovement(event){
        this.selectable_events.push([this.location, event]);
        console.log(this.movable_events);
        // let x_range = [this.coord[0]-this.movement,this.coord[0]+this.movement];
        let x_range = calculateBounds(this.coord[0], this.movement);
        let y_range = calculateBounds(this.coord[1], this.movement);
        

        for (let x = x_range[0]; x <= x_range[1]; x++) {
            for (let y = y_range[0]; y <= y_range[1]; y++) {
                let movable = document.querySelector(`.x${x}.y${y}`).childNodes[0];
                if(movable.parentElement !== this.location && !(movable.classList.contains("player"))&& !(movable.classList.contains("computer"))){
                    movable.classList.add("movable");
                    let movable_function = ()=>{this.move(movable.parentElement, [x,y])};
                    this.movable_events.push([movable, movable_function]);
                    movable.addEventListener("click", movable_function);

                }
                
            }                
        }

        // this.displayAttack();
    }

    displayAttack(){

        let x_range = calculateBounds(this.coord[0], this.range);
        let y_range = calculateBounds(this.coord[1], this.range);

        for (let x = x_range[0]; x <= x_range[1]; x++) {
            for (let y = y_range[0]; y <= y_range[1]; y++) {
                let potentialAttack = document.querySelector(`.x${x}.y${y}`).childNodes[0];
                if(potentialAttack.classList.contains("computer")){
                    console.log(potentialAttack);
                    potentialAttack.classList.add("attackable");
                    let attackable_function = ()=>{this.attack(potentialAttack.parentElement, [x,y])};
                    this.attackable_events.push([potentialAttack, attackable_function]);
                    // movable.addEventListener("click", movable_function);

                }
                
            }                
        }

    }

    toggleSelection(){
        this.selected = !(this.selected);
        if (!this.selected){
            console.log("Clear Movable");
            this.clearMovable();
        }
    }

    findClosestPath(destination){
        this.displayMovement()
        console.log(destination);
        console.log(document.querySelector(`.x${destination[0]}.y${destination[1]}`));
        if(document.querySelector(`.x${destination[0]}.y${destination[1]}`).childNodes[0].classList.contains("movable")){
            this.selected = true;
            this.move(document.querySelector(`.x${destination[0]}.y${destination[1]}`), destination);
            controller.updateView();
            this.selected = false;
        }
        else{
            this.move(this.location, this.coords);
            controller.updateView();
        }
    }
}

class Building{
    constructor(name, health, location, size){
        this.name=name,
        this.health = health,
        this.location = location,
        this.size = size
    }
}

// let cavalry_archer= new Unit("Cavalry Archer", null, 2, 5, 3);

class Computer{
    constructor(level){
        switch (level) {
            case 1:
                this.units =[

                    new Unit(VILLAGER, [4,3], {type:"farmer", farm:[5,3]}),
                    new Unit(VILLAGER, [4,4], {type:"farmer", farm:[5,4]}),
                    new Unit(VILLAGER, [7,3], {type:"farmer", farm:[6,3]}),
                    new Unit(VILLAGER, [7,4], {type:"farmer", farm:[6,4]}),
                    new Unit(VILLAGER, [22,3], {type:"builder", buildings:[["yurt",[21,4]],["yurt",[22,4]],["yurt",[22,3]],["yurt",[23,4]],["yurt",[23,3]], ["yurt",[24,3]], ["yurt",[24,4]]], }),

                ]

                this.buildings =[
                    new Building("farm", 75, document.querySelector('.x5.y3'),1),
                    new Building("farm", 75, document.querySelector('.x5.y4'),1),
                    new Building("farm", 75, document.querySelector('.x6.y3'),1),
                    new Building("farm", 75, document.querySelector('.x6.y4'),1),

                    new Building("yurt", 75, document.querySelector('.x19.y3'),1),
                    new Building("yurt", 75, document.querySelector('.x19.y4'),1),
                    new Building("yurt", 75, document.querySelector('.x20.y3'),1),
                    new Building("yurt", 75, document.querySelector('.x20.y4'),1),
                    new Building("yurt", 75, document.querySelector('.x21.y3'),1),
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
                console.log(unit);
                if (unit.AI_behaviour.type ==="farmer"){
                    if (Math.abs(unit.coord[0] - unit.AI_behaviour.farm[0] <= 1) && Math.abs(unit.coord[1] - unit.AI_behaviour.farm[1] <=1)){
                        this.resources.food +=1;
                        console.log(unit, "farmed. Food is now at:",this.resources.food);
                    }
                    else{
                        unit.findClosestPath(unit.AI_behaviour.farm);
                    }
                }

                else if (unit.AI_behaviour.type === "builder"){
                    if (unit.AI_behaviour.buildings.length >= 1){
                        let building_location = unit.AI_behaviour.buildings[0][1];
                        if(unit.coord[0]>=building_location[0]){
                            unit.findClosestPath([building_location[0]+1, building_location[1]]);
                            if(unit.AI_behaviour.buildings[0][0] === "yurt" && this.resources.food > 5){
                                this.resources.food -=5;
                                let square = findHtmlSquareElement(building_location).innerHTML=`<div class = "yurt computer square_overlay"></div>`
                                unit.AI_behaviour.buildings.shift();
                                console.log(square);
                            }
                        }
                    }


                }
            }
        )
    }

}

class Map{
    constructor(level){

        switch (level) {
            case 1:
                this.features = [
                    
                    [this.calculateBoxXY([1,1], [25,6]),"dirt"],
                    [this.calculateBoxXY([2,2], [24,5]),"dark_dirt"],

                    [this.calculateBoxXY([19,21], [24,24]),"dirt"],
                    [this.calculateBoxXY([20,22], [23,23]),"dark_dirt"],
                    
                    [this.calculateBoxXY([1,12], [25,13]),"river"],

                    [this.calculateBoxXY([12,11], [14,14]),"bridge"],
                ]

                break;
        
            default:
                break;
        }
    }

    calculateBoxXY(topLeft, bottomRight){
        if (bottomRight == null){bottomRight = topLeft};
        let leftX = topLeft[0];
        let rightX = bottomRight[0];

        let topY = topLeft[1];
        let bottomY = bottomRight[1];

        let coords= [];

        for (let i = 0; i <= rightX-leftX; i++){
            for (let j=0; j <= bottomY-topY; j++){
                coords.push([leftX+i, topY+j])
            }
        }
        let squareElements =[]

        coords.forEach((point)=>{
        
            let htmlSquare = document.querySelector(`.x${point[0]}.y${point[1]}`)
            squareElements.push(htmlSquare);
        });

        return squareElements;

    }
}