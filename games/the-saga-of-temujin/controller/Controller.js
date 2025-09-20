
class Controller{
    constructor(){
        this.view = new View();
        this.map = new Map(1);
        this.player = new Player(1);
        this.computer = new Computer(1);
        this.finishTurn = document.querySelector(".finishRound");

        this.events=[];
        this.takenSpots = [];

        this.startGame();
    }

    displayAll(){
        this.view.displayMapFeatures(this.map);
        this.view.displayUnits(this.player.units);
        this.view.displayBuildings(this.player.buildings);
        this.view.displayUnits(this.computer.units);
        this.view.displayBuildings(this.computer.buildings);
    }

    startGame(){
        this.displayAll();
        this.assignClickEvents();
        this.finishTurn.addEventListener("click", ()=>{this.endPlayerTurn()})

    }

    endPlayerTurn(){

        this.player.units.forEach((unit)=>{unit.resetMovement();})
        removeActionOverlay();

        this.computer.computerTurn();
    }

    assignClickEvents(){

        handleUnitsEvents(this, this.player.units, "click", this.displayMovementPossibilities);
        handleUnitsEvents(this, this.player.units, "mouseover", this.displayHoverInfo);
        handleUnitsEvents(this, this.computer.units, "mouseover", this.displayHoverInfo);

    }

    displayHoverInfo(unit){
        
        let imgName = unit.name
        imgName[0].toUpperCase() + imgName[0].slice(1);
        updateElement(".imgHover", `<img src=${imgName}.png></img>`);

        let properties = getProperties(unit);
        properties.build = "<br>N.A. in hover";
    
        for (let prop in properties) {
            updateElement(`.${prop}Hover`, `<b>${prop}: ${properties[prop]}</b>`);
        }
    }

    displaySelectInfo(unit){
        
        let imgName = unit.name
        imgName[0].toUpperCase() + imgName[0].slice(1);

        updateElement(".imgSelect", `<img src=${imgName}.png></img>`);

        let properties = getProperties(unit);
        properties.build = "<br>N.A. in hover";
    
        for (let prop in properties) {
            updateElement(`.${prop}Select`, `<b>${prop}: ${properties[prop]}</b>`);
        }
    
        if (unit.name === "villager") {
            updateElement(".buildSelect", `<b>build: <br> <button class ="yurtButton">Yurt</button> <button class="farmButton">Farm</button></b>`);
            document.querySelector(".yurtButton").addEventListener("click", () => unit.calculatePossibleBuilds("yurt"));
            document.querySelector(".farmButton").addEventListener("click", () => unit.calculatePossibleBuilds("farm"));
        } else {
            updateElement(".buildSelect", `<b>build: <br>Can't Build</b>`);
        }

        
    }

    displayUnitMovement(unit, move){

        removeAllOverlays();
        this.view.eraseUnit(unit, "player");
        unit.move(move);
        this.view.drawUnit(unit, "player");
        this.refreshEvents();

    }

    displayMovementPossibilities(unit){
        this.displaySelectInfo(unit);
        if(document.querySelectorAll(".movable").length !== 0 || document.querySelectorAll(".attackable").length !== 0){
            removeAllOverlays();
            return
        }

        this.refreshEvents();

        let movable = unit.calculatePossibleMoves();
        let attackable = unit.calculatePossibleAttacks();


        if(movable){
            movable.forEach((move)=>{

                let movement = convertToHtml(move);
                let unitMovementEvent = ()=>this.displayUnitMovement(unit, move);

                this.events.push([movement, unitMovementEvent]);
                movement.addEventListener("click", unitMovementEvent);
            });
            this.view.displayMovableSquares(movable);
        }

        if(attackable){
            attackable.forEach((attack)=>{

                let attackment = convertToHtml(attack);
                let unitAttackmentEvent = () => unit.attack(attack);

                this.events.push([attackment, unitAttackmentEvent]);
                attackment.addEventListener("click", unitAttackmentEvent);
            })
            this.view.displayAttackableSquares(attackable);
        }

    }

    refreshEvents(){
        this.events.forEach((event)=>{
            event[0].removeEventListener("click", event[1]);
            event[0].removeEventListener("mouseover", event[1]);
        });
        this.assignClickEvents();
    }

    calculateBuildableSpots(){
        let buildable = [];

        this.map.features.forEach((feature)=>{
            if (feature[2] === "dark_dirt"){
                buildable.push(feature);
            }
        })

        return buildable;
    }

    checkMovable(spot){
        this.updateTakenSpots();
        let condition_one = this.map.checkPassableTerrain(spot);
        let condition_two = !(this.takenSpotIncludes(spot));
        if (condition_one && condition_two){
            return true;
        }
        else{
            return false;
        }
    }

    takenSpotIncludes(spot){
        let conditionResult = false;
        this.takenSpots.forEach((taken)=>{
            // console.log(convertCoordToHTMLElement(taken));
            if(taken.toString() === spot.toString()){
                conditionResult = true;
            }

        })
        return conditionResult;
    }

    updateTakenSpots(){

        this.takenSpots = [
            ...this.player.units.map(unit => unit.coord),
            ...this.computer.units.map(unit => unit.coord),
            ...this.player.buildings.map(building => building.coord),
            ...this.computer.buildings.map(building => building.coord)
        ];

        this.map.impassableFeatures.forEach((feature)=>{

            let rangeX = Math.abs(feature[1][0] - feature[0][0] );
            let rangeY = Math.abs(feature [1][1] - feature[0][1]);
            // console.log(rangeX, rangeY);


            for (let x = feature[0][0]; x <= feature[0][0]+rangeX; x++){

                for (let y = feature[0][1]; y <= feature[0][1]+rangeY; y++){

                    this.takenSpots.push([x,y]);
                    // console.log(x,y);
                }
            }
        });

        // console.log("TAKEN SPOTS =",this.takenSpots);

        return this.takenSpots;
    }

    


}

let controller = new Controller();