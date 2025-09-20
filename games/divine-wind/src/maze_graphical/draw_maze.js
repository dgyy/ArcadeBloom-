// draw maze and init rotation layers
function initGraphicalMaze(maze, scene, mazeOrigin) {
    const rotationLayers = [];
    for (let layer = 0; layer < maze.grid.length; layer++) {
        let rotationOrigin = new BABYLON.TransformNode("layer " + layer, scene);
        rotationOrigin.setParent(mazeOrigin);
        let rotationLayer = new MazeRotationLayer(rotationOrigin, maze.grid[layer].length, scene, maze.offsets[layer]);
        rotationLayers.push(rotationLayer);
        const angleIncr = 2 * Math.PI / maze.grid[layer].length;
        const radius = INNER_RADIUS + CELL_HEIGHT * layer;
        // draw maze walls
        let outerWallPaths = [[]]; // holds the paths for outer walls
        for (let cell = 0, angle = 0; cell < maze.grid[layer].length; cell++, angle += angleIncr) {
            let currOuterWallPath = outerWallPaths[outerWallPaths.length - 1];
            if (maze.grid[layer][cell].outer0) {
                if (currOuterWallPath.length === 0) {
                    currOuterWallPath.push(
                        new BABYLON.Vector3(radius * Math.sin(angle), radius * Math.cos(angle), 0)
                    );
                }
                currOuterWallPath.push(
                    new BABYLON.Vector3(
                        radius * Math.sin(angle + angleIncr / 2), 
                        radius * Math.cos(angle + angleIncr / 2),
                        0
                    )
                );
            } else if (currOuterWallPath.length > 0) {
                outerWallPaths.push([]);
                currOuterWallPath = outerWallPaths[outerWallPaths.length - 1];
            }
            if (maze.grid[layer][cell].outer1) {
                if (currOuterWallPath.length === 0) {
                    currOuterWallPath.push(
                        new BABYLON.Vector3(
                            radius * Math.sin(angle + angleIncr / 2), 
                            radius * Math.cos(angle + angleIncr / 2),
                            0
                        )
                    );
                }
                currOuterWallPath.push(
                    new BABYLON.Vector3(
                        radius * Math.sin(angle + angleIncr), 
                        radius * Math.cos(angle + angleIncr),
                        0
                    )
                );
            } else if (currOuterWallPath.length > 0) {
                outerWallPaths.push([]);
                currOuterWallPath = outerWallPaths[outerWallPaths.length - 1];
            }
            if (maze.grid[layer][cell].clockwise) {
                let options = {
                    path: [
                        new BABYLON.Vector3(
                            radius * Math.sin(angle + angleIncr), 
                            radius * Math.cos(angle + angleIncr),
                            0
                        ),
                        new BABYLON.Vector3(
                            (radius - CELL_HEIGHT) * Math.sin(angle + angleIncr), 
                            (radius - CELL_HEIGHT) * Math.cos(angle + angleIncr),
                            0
                        )
                    ],
                    radius: WALL_WIDTH,
                    cap: BABYLON.Mesh.CAP_ALL
                };
                let wall = BABYLON.MeshBuilder.CreateTube("clockwise wall", options, scene);
                wall.isPickable = false;
                wall.setParent(rotationLayer.origin);
                rotationLayer.addWallMesh(wall);
            }
        }
        for (let path of outerWallPaths) {
            if (path.length === 0) continue;
            let options = {
                path: path,
                radius: WALL_WIDTH,
                cap: BABYLON.Mesh.CAP_ALL
            };
            let wall = BABYLON.MeshBuilder.CreateTube("outer wall", options, scene);
            wall.isPickable = false;
            wall.setParent(rotationLayer.origin);
            rotationLayer.addWallMesh(wall);
        }
    }
    return rotationLayers;
}