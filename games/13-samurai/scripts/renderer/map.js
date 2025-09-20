const map = [[-31.06, -56.98, -3.23, -73.72, -3.23, -73.72, 32.67, -69.44, 32.67, -69.44, 2.36, -58.51, 2.36, -58.51, -15.41, -54.75, -15.41, -54.75, -31.06, -56.98], [10.53, 79.08, -2.05, 69.02, -2.05, 69.02, -1.58, 74.84, -1.58, 74.84, -4.29, 82.49, -4.29, 82.49, 10.53, 79.08], [-7.49, 74.98, -7.79, 69.29, -7.79, 69.29, -19.84, 60.3, -19.84, 60.3, -12.46, 79.29, -12.46, 79.29, -4.29, 82.49, -4.29, 82.49, -1.58, 74.84, -1.58, 74.84, -7.49, 74.98], [-2.05, 69.02, 16.19, 65.23, 16.19, 65.23, 10.53, 79.08, 10.53, 79.08, -2.05, 69.02], [2.36, -58.51, 32.67, -69.44, 32.67, -69.44, 37.34, -31.8, 37.34, -31.8, 24.18, 7.45, 24.18, 7.45, 16.16, 15.93, 16.16, 15.93, 3.28, 39.47, 3.28, 39.47, 12.11, 51.29, 12.11, 51.29, 16.19, 65.23, 16.19, 65.23, -2.05, 69.02, -2.05, 69.02, -7.79, 69.29, -7.79, 69.29, -19.84, 60.3, -19.84, 60.3, -16.44, 45.64, -16.44, 45.64, -6.36, 37.48, -6.36, 37.48, -21.77, 9.29, -21.77, 9.29, -31.66, -23.52, -31.66, -23.52, -31.06, -56.98, -31.06, -56.98, -15.41, -54.75, -15.41, -54.75, -14.89, -25.64, -14.89, -25.64, -2.8, -10.44, -2.8, -10.44, 9.46, -5.55, 9.46, -5.55, 24.79, -29.85, 24.79, -29.85, 2.36, -58.51]];

var pointIsOnMap = (x, y) => {
    //for each polygon on the walking map verify if the count of intersecting edges is odd or not. 
    //If it's not odd the point is inside one of the polygons of the walking map.
    for (const polygon of map) {
        let count = 0;
        for (let i = 0; i < polygon.length; i += 4) {
            let edgeStartX = polygon[i], edgeStartY = polygon[i + 1], edgeEndX = polygon[i + 2], edgeEndY = polygon[i + 3];
            if ((y < edgeStartY !== y < edgeEndY) && x < edgeStartX + ((y - edgeStartY) / (edgeEndY - edgeStartY)) * (edgeEndX - edgeStartX)) count += 1;
        }
        // when we find the first non odd value we get out of the function and say the point is inside the map
        if (count % 2 !== 0) return true;
    }
    return false;
}


drawMap = (context, camera) => {
    // x and y offset of the map relative to screen top
    const xOffset = 70, yOffset = 100;
    // draw the map
    context.fillStyle = "rgba(191, 191, 191,.2)";
    map.forEach(polygon => {
        context.beginPath();
        for (let i = 0; i < polygon.length; i += 2) context.lineTo(xOffset + polygon[i], yOffset + polygon[i + 1]);
        context.fill();
    });
    // draw the player as a blue square
    let playerX = xOffset + camera.position.x;
    let playerZ = yOffset + camera.position.z;
    context.fillStyle = "blue";
    context.fillRect(playerX - 2, playerZ - 2, 4, 4);
    // draw player direction as a white line
    context.strokeStyle = "white";
    context.beginPath();
    context.moveTo(playerX, playerZ);
    context.lineTo(playerX + 10 * Math.cos(camera.yaw + Math.PI / 2), playerZ + 10 * Math.sin(camera.yaw + Math.PI / 2));
    context.stroke();
    // draw all npcs
    context.fillStyle = "red";
    npcs.forEach(npc => { context.fillRect(xOffset + npc.position.x - 2, yOffset + npc.position.z - 2, 4, 4); });

    // draw npc count
    context.fillText(npcs.length, 60, 20);

    context.fillText(Math.round(camera.position.x), 30, 200);
    context.fillText(Math.round(camera.position.z), 30, 250);
}