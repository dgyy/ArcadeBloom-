// assumes no offsets
function translateLocationToCoords(layers, mazeGrid, mazeLocation) {
    switch (mazeLocation) {
        case BOTTOM_CENTER:
            return new MazeCoordinates(layers, mazeGrid[layers].length / 2);
        case LEFT_CENTER:
            return new MazeCoordinates(layers, 3 * mazeGrid[layers].length / 4);
        case RIGHT_CENTER:
            return new MazeCoordinates(layers, mazeGrid[layers].length / 4);
        case TOP_CENTER:
            return new MazeCoordinates(layers, 0);
        default:
            console.error("Invalid maze location given: " + mazeLocation);
            break;
    }
}

function translateMazeCoordinatesToWorldPos(maze, mazeCoords) {
    let radius = (mazeCoords.layer - 0.5) * CELL_HEIGHT + INNER_RADIUS;
    let layerCellCount = maze.grid[mazeCoords.layer].length;
    let angleIncr = 2 * Math.PI / layerCellCount;
    let effectiveCell = (mazeCoords.cell + maze.offsets[mazeCoords.layer]) % layerCellCount;
    let angle = (effectiveCell + 0.5) * angleIncr;
    return new BABYLON.Vector3(Math.sin(angle) * radius, Math.cos(angle) * radius + 1, 0);
}