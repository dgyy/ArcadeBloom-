let Geo = (function () {

    dX = line => line.x2 - line.x1;

    dY = line => line.y2 - line.y1;

    minX = line => Math.min(line.x1, line.x2);

    maxX = line => Math.max(line.x1, line.x2);

    minY = line => Math.min(line.y1, line.y2);

    maxY = line => Math.max(line.y1, line.y2);

    len = line => Math.sqrt(Math.pow(dY(line), 2) + Math.pow(dY(line), 2));

    distanceBetween = (point1, point2) => Math.sqrt(Math.pow(point1.y - point2.y, 2) + Math.pow(point1.x - point2.x, 2));

    closestPoint = (point, line) => {
        var atob = { x: dX(line), y: dY(line) };
        var atop = { x: point.x - line.x1, y: point.y - line.y1 };
        var len = atob.x * atob.x + atob.y * atob.y;
        var dot = atop.x * atob.x + atop.y * atob.y;
        var t = Math.min(1, Math.max( 0, dot / len ));
        return {
            x: line.x1 + atob.x * t,
            y: line.y1 + atob.y * t
        };
    }

    isPointClose = (point, line, maxDist) => distanceBetween(point, closestPoint(point, line)) < maxDist;

    createPoint = (x, y) => { return { x : x, y : y } }

    createLine = (x1, y1, x2, y2) => { return { x1 : x1, y1 : y1, x2 : x2, y2 : y2 } }

    toVector = line => createPoint(line.x2 - line.x1, line.y2 - line.y1);
    
    normalize = vector => {
        var len = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (len === 0) {
            return createPoint(1, 0);
        }
        return createPoint(vector.x / len, vector.y / len);
    }

    polarAngle = vector => {
        var angle = Math.atan(vector.y / vector.x);
        var quadrant = vector.x >= 0 && vector.y >= 0 ? 1 : (vector.x < 0 && vector.y >= 0 ? 2 : vector.x < 0 ? 3 : 4);
        switch (quadrant) {
            case 2 : return Math.PI + angle;
            case 3 : return Math.PI + angle;
            case 4 : return 2 * Math.PI + angle;
            default : return angle;
        }
    }
    
    isPointInBox = (point, box) => !(point.x < minX(box) || point.x > maxX(box) || point.y < minY(box) || point.y > maxY(box));

    lineBoundingBox = line => {
        return { 
            x1 : Math.min(line.x1, line.x2), 
            y1 : Math.min(line.y1, line.y2), 
            x2 : Math.max(line.x1, line.x2), 
            y2 : Math.max(line.y1, line.y2), 
        };
    }

    polyBoundingBox = polygon => {
        let xs = polygon.map(p => p.x);
        let ys = polygon.map(p => p.y);
        return { 
            x1 : xs.reduce((a,b) => Math.min(a,b)), 
            y1 : ys.reduce((a,b) => Math.min(a,b)), 
            x2 : xs.reduce((a,b) => Math.max(a,b)), 
            y2 : ys.reduce((a,b) => Math.max(a,b)) 
        };
    }

    overlap = (box1, box2) => !(box1.x2 < box2.x1 || box1.y2 < box2.y1 || box2.x2 < box1.x1 || box2.y2 < box1.y1);

    onSameSide = (line, p1, p2) => {
        let box = lineBoundingBox(line);
        let dx = box.x2 - box.x1;
        let dy = box.y2 - box.y1;
        let dx1 = p1.x - box.x1;
        let dy1 = p1.y - box.y1;
        let dx2 = p2.x - box.x2;
        let dy2 = p2.y - box.y2;
        return (dx * dy1 - dy * dx1) * (dx * dy2 - dy * dx2) > 0;
    }

    intersect = (line1, line2) => {
        let box1 = lineBoundingBox(line1);
        let box2 = lineBoundingBox(line2);
        
        return overlap(box1, box2) && 
            !onSameSide(line1, { x : line2.x1, y : line2.y1 }, { x : line2.x2, y : line2.y2 }) &&
            !onSameSide(line2, { x : line1.x1, y : line1.y1 }, { x : line1.x2, y : line1.y2 });
    }

    isPointInPolygon = (point, polygon) => {
        var intersections = 0;
        let box = polyBoundingBox(polygon);

        // Create a horizontal line from the test point, ending just to the right of the bounding box.
        let testLine = createLine(point.x, point.y, box.x2 + 1, point.y);

        for (var i = 0; i < polygon.length-1; i++) {
            var edge = _getEdge(polygon, i);
            var nextEdge = _getEdge(polygon, i+1);
            if (_checkIntersection(testLine, edge, nextEdge)) {
                intersections += 1;
            }
        }

        // If we have an odd number of intersections, the point was inside the polygon
        return intersections % 2 == 1;
    }

    _getEdge = (polygon, index) => {
        var p1, p2;
        if (index >= polygon.length-1) {
            p1 = polygon[polygon.length-1];
            p2 = polygon[0];
        }
        else {
            p1 = polygon[index];
            p2 = polygon[index+1];
        }
        return createLine(p1.x, p1.y, p2.x, p2.y);
    }

    _checkIntersection = (testLine, edge, nextEdge) => {
        let edgeBox = lineBoundingBox(edge);
        let nextEdgeBox = lineBoundingBox(nextEdge);
        //console.log("checking " + testLine + " against " + edgeBox + " and " + nextEdgeBox);
        if (testLine.y1 == edgeBox.bottom && testLine.x1 < edgeBox.right) {
            // The test line crosses an end node of the edge line. We now calculate the 
            // vertical direction of the edge line, and of the next edge line. If these 
            // two successive edge lines go "in the same vertical direction" (i.e. a 
            // shape similar to "|", ">" or "<"), an intersection has occurred. If they
            // don't (i.e. they form a shape similar to "-", "/\", or "V"), no intersection
            // has occurred.

            let edgeBoxDeltaY = edgeBox.bottom - edgeBox.Top;
            let nextEdgeBoxDeltaY = nextEdgeBox.bottom - nextEdgeBox.Top;
            return (edgeBoxDeltaY > 0 && nextEdgeBoxDeltaY >= 0) ||
                   (edgeBoxDeltaY < 0 && nextEdgeBoxDeltaY <= 0);
        }

        if (testLine.y1 == edgeBox.top) {
            // The test line crosses the edge line's start node - don't count as intersection
            return false;
        }

        // The test line crosses neither of the two nodes of the edge line. 
        // Check if the two lines intersect.
        return intersect(testLine, edge);
    }

    toPolygon = lines => {
        let result = [];
        lines.forEach(line => {
            result.push({ x : line.x1, y : line.y1 });
        });
        var lastLine = lines[lines.length-1];
        result.push({ x : lastLine.x1, y : lastLine.y1 });
        return result;
    }

    area = polygon => {
        var area = 0;
        var j = polygon.length-1;
        for (var i = 0; i < polygon.length; i++) { 
            area += (polygon[j].x + polygon[i].x) * (polygon[j].y - polygon[i].y); 
            j = i;
        }   
        return Math.abs(area / 2); 
    }
    
    // point / vector: x, y
    // line / box: x1, y1, x2, y2
    // polygon: Array of point
    return {
        dy : dY,                             // line => num
        dx : dX,                             // line => num
        minX : minX,                         // line => num
        minY : minY,                         // line => num
        maxX : maxX,                         // line => num
        maxY : maxY,                         // line => num
        len : len,                           // line => num
        distanceBetween : distanceBetween,   // (point, point) => num
        closestPoint : closestPoint,         // (point, line) => point
        isPointClose : isPointClose,         // (point, line, num) => bool
        createPoint : createPoint,           // (num, num) => point
        createVector : createPoint,          // (num, num) => vector
        normalize : normalize,               // vector => vector
        createLine : createLine,             // (num, num, num, num) => line
        toVector : toVector,                 // line => vector, e.g. (5, 7, 15, 11) => (10, 4)
        polarAngle : polarAngle,             // vector => num
        overlap : overlap,                   // (box, box) => bool
        isPointInBox : isPointInBox,         // (point, box) => bool
        lineBoundingBox : lineBoundingBox,   // line => box
        polyBoundingBox : polyBoundingBox,   // polygon => box
        onSameSide : onSameSide,             // (line, point, point) => bool
        intersect : intersect,               // (line, line) => bool  
        isPointInPolygon : isPointInPolygon, // (point, polygon) => bool
        toPolygon : toPolygon,               // [line] => [point]
        area : area,                         // polygon => num
    }
})();
