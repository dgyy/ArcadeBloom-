function removeActionOverlay(type){
    document.querySelectorAll(`.${type}`).forEach(square => {square.classList.remove(`${type}`);});
}

function removeAllOverlays(){
    removeActionOverlay("movable");
    removeActionOverlay("attackable");
}

function convertToHtml([x,y]){
    return document.querySelector(`.x${x}.y${y}`);
}

function updateElement(selector, content) {
    document.querySelector(selector).innerHTML = content;
}

function getProperties(unit){
    let properties = {
        owner: unit.owner,
        name: unit.name,
        health: unit.health,
        movement: unit.movement,
        range: unit.range,
        damage: unit.damage,
    };

    return properties;
}

function handleUnitsEvents(context, units, eventType, eventFunc) {
    units.forEach((unit) => {
        let location = convertCoordToHTMLElement(unit.coord);
        let unitEvent = () => eventFunc.call(context, unit);
        context.events.push([location, unitEvent]);
        location.addEventListener(eventType, unitEvent);
    });
}