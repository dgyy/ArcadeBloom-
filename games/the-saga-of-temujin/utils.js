function convertCoordToHTMLElement(coord){
    let html = document.querySelector(`.x${coord[0]}.y${coord[1]}`);
    return html;
}

function getEntityAt(location){
    let checkable = [];

    controller.player.units.forEach((unit)=>{
        checkable.push(unit);
    })

    controller.player.buildings.forEach((building)=>{
        checkable.push(building);
    })

    controller.computer.units.forEach((unit)=>{
        checkable.push(unit);
    })

    controller.computer.buildings.forEach((building)=>{
        checkable.push(building);
    })

    for (let x = 0; x < checkable.length; x++){
        if(checkable[x].coord.toString() === location.toString()){
            return checkable[x];
        }
    }
    
}