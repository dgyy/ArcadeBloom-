
const VILLAGER = {name:"villager", health:10, range:2, damage:1, movement:1}
const CAVALRY = {name:"cavalry", health:15, range:2, damage:5, movement:3}


class Unit{
    constructor(owner, base_stats, coord, AI_behaviour){
        this.owner = owner,

        this.name = base_stats.name,
        this.health = base_stats.health,
        this.range = base_stats.range,
        this.damage = base_stats.damage,
        this.movement = base_stats.movement,
        this.coord = coord;

        this.movable_events = [];
        this.attackable_events = [];
        this.selectable_events = [];
        
        this.moved = false;
        this.attacked = false;
        this.selected = false;

        this.destroyed = false;


        this.AI_behaviour = AI_behaviour;
    }

    calculatePossibleMoves(){
        if(this.moved === false){
            let potentialSpots = movementRangeSquares(this.coord, this.movement);
            let possibleSpots = []
            potentialSpots.forEach((spot)=>{

                if (controller.checkMovable(spot) && !(spot.toString() == this.coord.toString())){
                    possibleSpots.push(spot);
                }
            })
            
            return (possibleSpots);
        }

    }

    calculatePossibleAttacks(){

        let attackableSquares = [];
        if (this.attacked === false){
            let x_range = calculateBounds(this.coord[0], this.range);
            let y_range = calculateBounds(this.coord[1], this.range);

            for (let x = x_range[0]; x <= x_range[1]; x++) {
                for (let y = y_range[0]; y <= y_range[1]; y++) {
                    // let potentialSpot = document.querySelector(`.x${x}.y${y}`);
                    let potentialSpot = [x,y];
                    let enemy;

                    if (this.owner === "player"){
                        enemy = "computer"
                    }
                    else{
                        enemy = "player"
                    }


                    // if(potentialSpot.classList.contains(enemy) || potentialSpot.childNodes[0].classList.contains(enemy)){
                    //     attackableSquares.push(potentialSpot);
                    // }
                    if((getEntityAt(potentialSpot)!== undefined && getEntityAt(potentialSpot).owner === enemy)){
                        attackableSquares.push(potentialSpot);
                    }
                }                
            }
        }

        return (attackableSquares);

    }

    calculatePossibleBuilds(buildingName){
        alert("Future Feature");
    }

    move(coord){
        this.coord = coord;
        this.moved = true;
        
        controller.updateTakenSpots();
    }

    resetMovement(){
        this.moved = false;
        this.attacked = false;
    }

    attack(location){
        let enemy = getEntityAt(location);
        enemy.health -= this.damage;

        if(enemy.health <= 0){
            enemy.destroySelf();
            controller.updateTakenSpots();
        }
        
        this.attacked = true;
        removeAllOverlays();
        controller.refreshEvents();
    }


    toggleSelection(){
        this.selected = !(this.selected);
    }

    findClosestPath(destination){
        let possibleMoves = this.calculatePossibleMoves();
        // possibleMoves.push(this.coord);
        // console.log(possibleMoves, this);
        if (possibleMoves.includes(destination)){
            controller.view.eraseUnit(this, this.owner);
            this.move(destination);
            controller.view.drawUnit(this, this.owner);
        }

        else{
            
            let distanceX = 26;
            let distanceY = 26;

            let moveX;
            let moveY;

            possibleMoves.forEach((move)=>{
                // console.log(move, destination, Math.abs(destination[1]-move[1]));
                if (Math.abs(destination[1] - move[1]) < distanceY){
                    distanceY = Math.abs(destination[1] - move[1]);
                    moveY = move[1];
                }
            })

            possibleMoves.forEach((move)=>{
                if(move[1] === moveY){
                    if (Math.abs(destination[0] - move[0]) < distanceX){
                        distanceX = Math.abs(destination[0] - move[0])
                        moveX = move[0];
                    }
                }

            })


            controller.view.eraseUnit(this, this.owner);
            this.move([moveX,moveY]);
            controller.view.drawUnit(this, this.owner);
        }

    }

    build(building, coord, unitPref){

        let buildingEntity = new Building(this.owner, building, coord)
        controller.view.displayBuilding(buildingEntity);

        if(this.owner === "player"){
            controller.player.buildings.push(new Building ("player", building, coord))
        }

        if(this.owner === "computer"){
            controller.computer.buildings.push(new Building ("computer", building, coord, unitPref))
        }

    }

    findClosestEnemy(){
        let closestDistance = 26;
        // console.log(controller.player.units);
        let selectedUnit = controller.player.units[0];

        controller.player.units.forEach((unit)=>{
            // let x_gap = unit.coord[0] - this.coord[0];
            let y_gap = unit.coord[1] - this.coord[1];

            // if (x_gap < closestDistance){
            //     closestDistance = x_gap;
            //     selectedUnit = unit;
            // }
            if (y_gap < closestDistance){
                closestDistance = y_gap;
                selectedUnit = unit;
            }
        });

        return selectedUnit.coord;
    }

    destroySelf(){
        if(this.owner === "player"){
            for (const [index, unit] of controller.player.units.entries()) {
                if ((unit === this) && (this.destroyed === false)){

                    controller.player.units.splice(index, 1);

                    controller.view.eraseUnit(this, this.owner);
                    this.destroyed = true;
                    return;
                }
                
            }
        }

        if(this.owner === "computer"){
            for (const [index, unit] of controller.computer.units.entries()) {
                if ((unit === this) && (this.destroyed === false)){

                    controller.computer.units.splice(index, 1);

                    controller.view.eraseUnit(this, this.owner);
                    this.destroyed = true;

                    if(controller.computer.units.length === 0){
                        alert("You Win!")
                    }
                    return;
                }
                
            }
        }


    }

}