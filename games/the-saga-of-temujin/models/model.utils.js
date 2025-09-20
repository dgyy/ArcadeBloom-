function calculateBounds(centre, range){
    let calculatedBound = [centre - range, centre + range];
    return adjustBounds(calculatedBound);
}

function adjustBounds(adjustableBounds){
    //prevent out of bound errors (grid goes from 1-25 (x and y axis))
    let bounds = adjustableBounds;
    if(bounds[0] < 1){bounds[0] = 1};
    if(bounds[1] > 25){bounds[1] = 25};
    return bounds;
}

//UnitModel
function movementRangeSquares(coord, movement){
    let movableSquares = [];
    let x_range = calculateBounds(coord[0], movement);
    let y_range = calculateBounds(coord[1], movement);

    for (let x = x_range[0]; x <= x_range[1]; x++) {
        for (let y = y_range[0]; y <= y_range[1]; y++) {
            movableSquares.push([x,y]);
        }                
    }
    

    return (movableSquares);
}