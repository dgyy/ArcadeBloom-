class View{
    constructor(){
        this.displayGrid();
    }

    displayGrid(){
        let gridContainer = document.querySelector(".gridarea");
        for (let y = 1; y < 26; y++) {
            for (let x = 1; x < 26; x++) {
                gridContainer.innerHTML += `<div class ="square x${x} y${y}"><div class = "square_overlay"></div></div>`
            }   
        }
    }

    displayMapFeatures(map){
        map.aestheticFeatures.forEach((feature)=>{
            for (let x = feature[0][0]; x <= feature[1][0]; x++){
                for (let y = feature[0][1]; y <= feature[1][1]; y++){
                    let square = convertCoordToHTMLElement([x,y]);
                    square.classList.add(feature[2]);
                }
            }
        });

        map.impassableFeatures.forEach((feature)=>{
            for (let x = feature[0][0]; x <= feature[1][0]; x++){
                for (let y = feature[0][1]; y <= feature[1][1]; y++){
                    let square = convertCoordToHTMLElement([x,y]);
                    square.classList.add(feature[2]);
                }
            }
        });

        map.buildableFeatures.forEach((feature)=>{
            for (let x = feature[0][0]; x <= feature[1][0]; x++){
                for (let y = feature[0][1]; y <= feature[1][1]; y++){
                    let square = convertCoordToHTMLElement([x,y]);
                    square.classList.add(feature[2]);
                }
            }
        });
    }

    displayUnits(units){
        units.forEach((unit)=>{
            let location = convertCoordToHTMLElement(unit.coord).childNodes[0];

            
            location.classList.add("unit");
            location.classList.add(unit.owner);
            location.classList.add(unit.name);
        });
    }

    displayBuildings(buildings){
        buildings.forEach((building)=>{
            let location = convertCoordToHTMLElement(building.coord).childNodes[0];

            location.classList.add("building");
            location.classList.add(building.owner);
            location.classList.add(building.name);

        });
    }

    displayBuilding(building){
        let location = convertCoordToHTMLElement(building.coord).childNodes[0];
        location.classList.add("building");
        location.classList.add(building.owner);
        location.classList.add(building.name);
    }

    displayMovableSquares(movable){
        // console.log(movable);
        movable.forEach((square)=>{
            document.querySelector(`.x${square[0]}.y${square[1]}`).childNodes[0].classList.add("movable")
        });
    }

    displayAttackableSquares(attackable){
        attackable.forEach((square)=>{
            square = convertToHtml(square);
            square.childNodes[0].classList.add("attackable");
        })
    }

    drawUnit(unit, player){

        let location = convertCoordToHTMLElement(unit.coord);
        location.childNodes[0].classList.add(unit.name);
        location.childNodes[0].classList.add(player);
    }

    eraseUnit(unit, player){
        // console.log(unit);
        let location = convertCoordToHTMLElement(unit.coord);
        location.childNodes[0].classList.remove(unit.name);
        location.childNodes[0].classList.remove(player);
    }

    
    eraseBuilding(building, player){
        // console.log(unit);
        let location = convertCoordToHTMLElement(building.coord);
        location.childNodes[0].classList.remove(building.name);
        location.childNodes[0].classList.remove(player);
        location.childNodes[0].classList.remove("building");
        
    }


}