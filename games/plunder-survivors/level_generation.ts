import {
    IPoint,
    IEdge,
    ITriangle,
    ITriangleInTriangulation,
    ICircle,
    IVoronoiResult,
    IPolygon,
    IVertices3, IRegion
} from "./interfaces";
import Road, {ROAD_WIDTH} from "./road";
import {
    pointsAreEqual,
    areaOfVertices,
    edgeNormal,
    vectorFromEdge,
    midpointOfEdge,
    isPointAlongLine,
    edgesAreEqual,
    calculateCrossProduct, perpendicularDistanceFromPointToEdge, normalFromVector, randomFloat, distance
} from "./math";
import {PointPool} from "./pools";

export function roadsAndRegionsFromPoints(points: IPoint[], boundingBox: IPoint): {
    roads: Road[],
    regions: IRegion[],
    edges: IEdge[],
    polygons: IPolygon[]
} {
    const triangles = triangulate(points, boundingBox);
    const {edges, polygons} = voronoiOfDelaunayTriangles(triangles, boundingBox);

    let regions = regionsFromPolygons(polygons, boundingBox);

    const roads: Road[] = [];
    for (const edge of edges) {
        const road = roadFromEdge(edge, boundingBox);
        if (road) roads.push(road);
    }

    addDropOffPoints(regions, roads, boundingBox);

    return {roads, regions, edges: edgesWithDuplicatesRemoved(edges), polygons};
}

function addDropOffPoints(regions: IRegion[], roads: Road[], boundingBox: IPoint) {
    for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        const regionEdges = edgesFromPolygon(region);
        const midpointOfPolygon = centerOfVertices(region.vertices);

        let minDist = Number.MAX_VALUE;
        let dropOffPoint: IPoint = {x: 0, y: 0};

        for (const edge of regionEdges) {
            const midpoint = midpointOfEdge(edge);
            for (const road of roads) {
                // const dist = perpendicularDistanceFromPointToEdge(midpoint, road.edge);
                const dist = perpendicularDistanceFromPointToEdge(midpointOfPolygon, road.edge);
                if (dist && dist < minDist) {
                    const normal = {x: 0, y: 0};
                    normalFromVector(vectorFromEdge(edge, normal), normal);
                    const x = midpoint.x + normal.x * -ROAD_WIDTH/2
                    const y = midpoint.y + normal.y * -ROAD_WIDTH/2;

                    // check if x and y are in bounds
                    if (x < 0 || x > boundingBox.x || y < 0 || y > boundingBox.y) continue;

                    minDist = dist;

                    // I think negative because maybe the normal is pointing in the wrong direction?
                    dropOffPoint.x = x;
                    dropOffPoint.y = y;
                }
            }
        }

        region.dropOffPoint = dropOffPoint;
    }
}

function edgesWithDuplicatesRemoved(edges: IEdge[]): IEdge[] {
    const newEdges: IEdge[] = [];
    for (const edge of edges) {
        if (newEdges.findIndex((edge2) => edgesAreEqual(edge, edge2)) === -1) {
            newEdges.push(edge);
        }
    }

    return newEdges;
}


export function voronoiOfDelaunayTriangles(triangles: ITriangleInTriangulation[], boundingBox: IPoint): IVoronoiResult {
    const edges = voronoiEdgesOfDelaunayTriangles(triangles, boundingBox);
    const polygons = voronoiPolygonsOfDelaunayTriangles(triangles, boundingBox);
    return {edges, polygons}
}

function voronoiEdgesOfDelaunayTriangles(triangles: ITriangleInTriangulation[], boundingBox: IPoint): IEdge[] {
    let voronoiEdges: IEdge[] = [];
    for (const triangle of triangles) {
        for (const neighbor of triangle.neighbors) {
            const triangleCenter = triangle.circumcircle.center;
            const neighborCenter = neighbor.circumcircle.center;
            const edge: IEdge = {v0: triangleCenter, v1: neighborCenter};
            if (!edgeListContainsEdge(voronoiEdges, edge)) voronoiEdges.push(edge);
        }
    }

    // return voronoiEdges
    return clipEdgesToBoundingBox(voronoiEdges, boundingBox);
}

function voronoiPolygonsOfDelaunayTriangles(triangles: ITriangleInTriangulation[], boundingBox: IPoint): IPolygon[] {
    const voronoiRegions: IPolygon[] = [];
    const clippedRegions: IPolygon[] = [];
    const pointMap = new Map<string, IPolygon>();

    for (const triangle of triangles) {
        const points: IPoint[] = [triangle.vertices[0], triangle.vertices[1], triangle.vertices[2]];
        for (const point of points) {
            const key = keyFromPoint(point);
            if (!pointMap.has(key)) {
                const region: IPolygon = {
                    vertices: [],
                    center: point
                };
                pointMap.set(key, region); // Add the region to the map.
                voronoiRegions.push(region); // Add the region to the list of regions.
            }
            // Add each triangle's circumcenter to the region's vertices.
            pointMap.get(key).vertices.push(triangle.circumcircle.center);
        }
    }

    // After all vertices are added, make sure they are in counter-clockwise order.
    for (let region of voronoiRegions) {
        const centroid = centerOfVertices(region.vertices)
        region.vertices = sortVertices(region.vertices, centroid);
        region = clipPolygonToBoundingBox(region, boundingBox);
        clippedRegions.push(region);
    }

    return clippedRegions.filter(region => region.vertices.length > 0);
}

// Sutherland–Hodgman algorithm
function clipPolygonToBoundingBox(polygon: IPolygon, boundingBox: IPoint): IPolygon {
    let vertices = polygon.vertices;

    // Define the bounding box edges
    const box = [
        {start: {x: 0, y: 0}, end: {x: boundingBox.x, y: 0}},             // Top edge
        {start: {x: boundingBox.x, y: 0}, end: {x: boundingBox.x, y: boundingBox.y}}, // Right edge
        {start: {x: boundingBox.x, y: boundingBox.y}, end: {x: 0, y: boundingBox.y}}, // Bottom edge
        {start: {x: 0, y: boundingBox.y}, end: {x: 0, y: 0}}             // Left edge
    ];

    for (const {start, end} of box) {
        const newVertices = [];
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length; // Next vertex index
            const p1 = vertices[i], p2 = vertices[j];

            const inside1 = (p1.x - start.x) * (end.y - start.y) < (p1.y - start.y) * (end.x - start.x);
            const inside2 = (p2.x - start.x) * (end.y - start.y) < (p2.y - start.y) * (end.x - start.x);

            if (inside1 !== inside2) { // If vertices straddle the edge
                const intersection = intersectionOfPoints(start, end, p1, p2);
                if (intersection) newVertices.push(intersection); // Add intersection point
            }
            if (inside2) {
                newVertices.push(p2); // Keep vertices on the inside
            }
        }
        vertices = newVertices;
    }

    return {...polygon, vertices};
}

function isSubsegmentOfBoundary(edge: IEdge, boundaryEdges: IEdge[]): boolean {
    for (const boundaryEdge of boundaryEdges) {
        // Check if both edge vertices lie on the boundary edge.
        if (isPointAlongLine(edge.v0, boundaryEdge) && isPointAlongLine(edge.v1, boundaryEdge)) {
            return true;
        }
    }
    return false;
}

function regionsFromPolygons(polygons: IPolygon[], boundingBox: IPoint): IRegion[] {
    const regions: IRegion[] = [];
    for (const polygon of polygons) {
        const region = regionFromPolygon(polygon, boundingBox);
        if (region) regions.push(region);
    }

    return regions;
}

function regionFromPolygon(polygon: IPolygon, boundingBox): IRegion | null {
    const polygonEdges = edgesFromPolygon(polygon);
    const boundaryEdges = boundaryEdgesFromBoundingBox(boundingBox);
    const internalEdges = [];
    for (const edge of polygonEdges) {
        if (!isSubsegmentOfBoundary(edge, boundaryEdges)) internalEdges.push(edge);
    }
    const insideEdges = shrinkPolygon(polygonEdges, ROAD_WIDTH / 2, true, boundingBox);

    if (!insideEdges) return null;

    const smallerPolygon = polygonFromEdges(insideEdges);

    const smallerPolygonEdges = edgesFromPolygon(smallerPolygon);
    const moreInsideEdges = shrinkPolygon(smallerPolygonEdges, ROAD_WIDTH/4, true, boundingBox);
    if (!moreInsideEdges) return null;
    const evenSmallerPolygon = polygonFromEdges(moreInsideEdges);

    return {
        vertices: smallerPolygon.vertices,
        center: smallerPolygon.center,
        edges: internalEdges,
        insideEdges: insideEdges,
        polygonEdges,
        dropOffPoint: {x: 0, y: 0},
        type: "empty",
        shrunkPolygon: evenSmallerPolygon,
        gold: [],
        speed: 0,
    }
}

export function polygonFromEdges(edges: IEdge[]): IPolygon {
    const vertices: IPoint[] = [];
    for (const edge of edges) {
        vertices.push(edge.v0);
    }
    return {
        vertices: vertices,
        center: centerOfVertices(vertices)
    }
}

export function edgesFromPolygon(polygon: IPolygon): IEdge[] {
    const edges: IEdge[] = [];
    const vertices = sortVertices(polygon.vertices, polygon.center);
    for (let i = 0; i < vertices.length; i++) {
        const v0 = vertices[i];
        const v1 = vertices[(i + 1) % vertices.length];
        if (distance(v0,v1) > 1) edges.push({v0, v1});
    }
    // return sortEdges(edges, polygon.center);
    return edges;
}

function boundaryEdgesFromBoundingBox(boundingBox: IPoint): IEdge[] {
    const {x, y} = boundingBox;
    return [
        {v0: {x: 0, y: 0}, v1: {x, y: 0}},
        {v0: {x, y: 0}, v1: {x, y}},
        {v0: {x, y}, v1: {x: 0, y}},
        {v0: {x: 0, y}, v1: {x: 0, y: 0}}
    ];
}

// Still have a bug where if a new edge needs to be added to
// the offset polygon... it just doesn't do that.
export function shrinkPolygon(edges: IEdge[], distance: number, clip: boolean = true, boundingBox: IPoint): IEdge[] | null {
    let offsetEdges: IEdge[] = [];
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        // if edge is part of the boundary, don't offset it.
        if (isSubsegmentOfBoundary(edge, boundaryEdgesFromBoundingBox(boundingBox))) {
            offsetEdges.push(edge);
            continue;
        }

        const normal = PointPool.get();
        // const normal = edgeNormal(edge);
        edgeNormal(edge, normal);

        const offset: IPoint = {
            x: normal.x * distance,
            y: normal.y * distance
        };

        let points: IPoint[] = [
            {
                x: edge.v0.x + offset.x,
                y: edge.v0.y + offset.y
            },
            {
                x: edge.v1.x + offset.x,
                y: edge.v1.y + offset.y
            }];

        // TODO: don't genearate new objects
        offsetEdges.push({
            v0: points[0],
            v1: points[1]
        });

        PointPool.release(normal);
    }

    offsetEdges = clipEdgesToBoundingBox(offsetEdges, boundingBox);
    // offsetEdges = offsetEdges.filter(edge => edgeLength(edge) > distance);

    if (!clip) return offsetEdges;

    let newEdges = calculateNewEdges(offsetEdges);

    if (newEdges.length < 3) return null;

    const polygon = polygonFromEdges(newEdges);

    const TOO_SMALL_AREA = .1;
    if (areaOfVertices(polygon.vertices) <= TOO_SMALL_AREA) return null;

    return newEdges;
}

function calculateNewEdges(edges: IEdge[]): IEdge[] {
    let newEdges = reconstructEdges(edges);

    // Remove reversed edges
    const originalVectors = [];
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const originalVector = {x: edge.v1.x - edge.v0.x, y: edge.v1.y - edge.v0.y};
        originalVectors.push(originalVector);
    }

    newEdges = newEdges.filter((newEdge, index) => {
        const newVector = {x: newEdge.v1.x - newEdge.v0.x, y: newEdge.v1.y - newEdge.v0.y};
        const crossProduct = calculateCrossProduct(originalVectors[index], newVector);
        return crossProduct >= 0;  // keep the edge if it's not reversed
    });

    return reconstructEdges(newEdges);

}

function reconstructEdges(edges: IEdge[]): IEdge[] {
    const intersections: IPoint[] = [];
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const index1 = (i + 1) % edges.length;
        const intersection = lineIntersection(edge, edges[index1]);
        if (intersection) intersections.push(intersection);
    }

    const newEdges: IEdge[] = [];
    for (let i = 0; i < intersections.length; i++) {
        const v0 = intersections[i];
        const v1 = intersections[(i + 1) % intersections.length];
        newEdges.push({v0, v1});
    }

    return newEdges;
}

function clipEdgesToBoundingBox(edges: IEdge[], boundingBox: IPoint): IEdge[] {
    return edges.map((edge) => clipEdgeToBoundingBox(edge, boundingBox)).filter((edge) => edge !== null) as IEdge[];
}

// Cohen–Sutherland algorithm
function clipEdgeToBoundingBox(edge: IEdge, boundingBox: IPoint): IEdge | null {

    const OUT_LEFT = 1;
    const OUT_RIGHT = 2;
    const OUT_BOTTOM = 4;
    const OUT_TOP = 8;

    const epsilon = 0.0001; // Define a small tolerance value

    function computeOutCode(x: number, y: number): number {
        let code = 0;

        if (y < 0) {
            code |= OUT_BOTTOM;
        } else if (y > boundingBox.y + epsilon) { // Allow for a small tolerance
            code |= OUT_TOP;
        }

        if (x < 0) {
            code |= OUT_LEFT;
        } else if (x > boundingBox.x + epsilon) { // Allow for a small tolerance
            code |= OUT_RIGHT;
        }

        return code;
    }

    let x0 = edge.v0.x;
    let y0 = edge.v0.y;
    let x1 = edge.v1.x;
    let y1 = edge.v1.y;

    let outcode0 = computeOutCode(x0, y0);
    let outcode1 = computeOutCode(x1, y1);

    let accept = false;

    while (true) {
        if (!(outcode0 | outcode1)) {
            accept = true;
            break;
        } else if (outcode0 & outcode1) {
            break;
        } else {
            let x, y;

            const outcodeOut = outcode0 ? outcode0 : outcode1;

            if (outcodeOut & OUT_TOP) {
                x = x0 + (x1 - x0) * (boundingBox.y - y0) / (y1 - y0);
                y = boundingBox.y;
            } else if (outcodeOut & OUT_BOTTOM) {
                x = x0 + (x1 - x0) * (0 - y0) / (y1 - y0);
                y = 0;
            } else if (outcodeOut & OUT_RIGHT) {
                y = y0 + (y1 - y0) * (boundingBox.x - x0) / (x1 - x0);
                x = boundingBox.x;
            } else if (outcodeOut & OUT_LEFT) {
                y = y0 + (y1 - y0) * (0 - x0) / (x1 - x0);
                x = 0;
            }

            if (outcodeOut === outcode0) {
                x0 = x;
                y0 = y;
                outcode0 = computeOutCode(x0, y0);
            } else {
                x1 = x;
                y1 = y;
                outcode1 = computeOutCode(x1, y1);
            }
        }
    }

    if (accept) {
        const v0: IPoint = {x: x0, y: y0};
        const v1: IPoint = {x: x1, y: y1};

        return {v0, v1};
    }

    return null;
}

function keyFromPoint(point: IPoint): string {
    return `${point.x}-${point.y}`;
}

// Calculate the intersection of two lines using determinants.
export function intersectionOfPoints(p1: IPoint, p2: IPoint, q1: IPoint, q2: IPoint): IPoint {
    const A1 = p2.y - p1.y;
    const B1 = p1.x - p2.x;
    const C1 = A1 * p1.x + B1 * p1.y;

    const A2 = q2.y - q1.y;
    const B2 = q1.x - q2.x;
    const C2 = A2 * q1.x + B2 * q1.y;

    const det = A1 * B2 - A2 * B1;

    const intersection = {x: (B2 * C1 - B1 * C2) / det, y: (A1 * C2 - A2 * C1) / det};

    return intersection;
}

function perpendicularBisector(start: IPoint, end: IPoint): IEdge {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const directionX = end.y - start.y;
    const directionY = -(end.x - start.x);
    const length = Math.hypot(directionX, directionY);
    const normalizedDirectionX = directionX / length;
    const normalizedDirectionY = directionY / length;

    return {
        v0: {
            x: midX + normalizedDirectionX,
            y: midY + normalizedDirectionY,
        },
        v1: {
            x: midX - normalizedDirectionX,
            y: midY - normalizedDirectionY,
        },
    };
}

function circleFromPoints(points: IPoint[]): ICircle {
    const center = centerOfVertices(points);
    center.x /= points.length;
    center.y /= points.length;

    const radius = points.reduce((max, point) => Math.max(max, distance(center, point)), 0);

    return {center, radius};
}

function circumcircleOfTriangle(triangle: ITriangle): ICircle {
    const p0 = triangle.vertices[0];
    const p1 = triangle.vertices[1];
    const p2 = triangle.vertices[2]

    // Calculate bisectors of triangle sides
    const bisector01 = perpendicularBisector(p0, p1);
    const bisector12 = perpendicularBisector(p1, p2);

    // Calculate intersection of bisectors (circumcenter)
    const circumcenter = lineIntersection(bisector01, bisector12);


    return {
        center: circumcenter,
        radius: distance(circumcenter, p0),
    };
}

function sortVertices(vertices: IPoint[], center: IPoint): IPoint[] {
    return vertices.sort((a, b) => {
        const aAngle = angleOfPoint(a, center);
        const bAngle = angleOfPoint(b, center);
        return aAngle - bAngle;
    });
}

function angleOfPoint(point: IPoint, center: IPoint): number {
    const x = point.x - center.x;
    const y = point.y - center.y;
    return Math.atan2(y, x);
}
export function centerOfVertices(vertices: IPoint[]): IPoint {
    let point = vertices.reduce((sum, point) => ({x: sum.x + point.x, y: sum.y + point.y}), {x: 0, y: 0});
    point.x /= vertices.length;
    point.y /= vertices.length;
    return point;
}
function lineIntersection(edg1: IEdge, edge2: IEdge): IPoint | null {
    const x1 = edg1.v0.x;
    const y1 = edg1.v0.y;
    const x2 = edg1.v1.x;
    const y2 = edg1.v1.y;

    const x3 = edge2.v0.x;
    const y3 = edge2.v0.y;
    const x4 = edge2.v1.x;
    const y4 = edge2.v1.y;

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    // Check if the lines are parallel or coincident
    if (denominator === 0) return null;

    const intersectX =
        ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
        denominator;
    const intersectY =
        ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
        denominator;

    // TODO: don't generate new object
    return {x: intersectX, y: intersectY};
}

// Create a triangle that contains the circle using 30-60-90 triangle rules: https://www.youtube.com/watch?v=mulFsXCBw80
// Note that the video above has a mistake (the half side is r * sqrt(3) not r * sqrt(2))
function circumscribingTriangle(circle: ICircle): ITriangle {
    let {center, radius} = circle;

    // Calculate the bottom side of the 30-60-90 triangle, which is half the length of the side of the equilateral triangle
    const side = radius * Math.sqrt(3);
    // Calculate the hypotenuse of the 30-60-90 triangle, which is the radius of the circumcircle of the equilateral triangle
    const hypotenuse = radius * 2;

    // Top
    const v0 = {
        x: center.x,
        y: center.y + hypotenuse
    };

    // Left bottom
    const v1 = {
        x: center.x - side,
        y: center.y - radius
    };

    // Right bottom
    const v2 = {
        x: center.x + side,
        y: center.y - radius
    };

    const vertices: IVertices3 = [v0, v1, v2];
    const centerOfTriangle = centerOfVertices(vertices);
    return {vertices, center: centerOfTriangle};
}

// https://www.gorillasun.de/blog/bowyer-watson-algorithm-for-delaunay-triangulation/#the-super-triangle
export function triangulate(vertices: IPoint[], size: IPoint): ITriangleInTriangulation[] {
    // Create bounding 'super' triangle

    // const superTriangle = circumscribingTriangle(circleFromPoints(vertices));
    const biggerSize = {x: size.x * 10, y: size.y * 10};
    const superTriangle = circumscribingTriangle(circleFromPoints(boxVerticesForSize(biggerSize).vertices));
    const superDelaunayTriangle = {
        circumcircle: circumcircleOfTriangle(superTriangle),
        neighbors: [], ...superTriangle
    };

    // Initialize triangles while adding bounding triangle
    let triangles: ITriangleInTriangulation[] = [superDelaunayTriangle];

    // Add each vertex to the triangulation
    for (const vertex of vertices) {
        triangles = addVertexToTriangulation(vertex, triangles);
    }

    for (const triangle of triangles) {
        const neighbors = neighborDelaunayTriangles(triangle, triangles);
        triangle.neighbors = [...neighbors];
    }

    return triangles;
}

function boxVerticesForSize(size: IPoint): IPolygon {
    return {
        vertices: [
            {x: 0, y: 0},
            {x: size.x, y: 0},
            {x: size.x, y: size.y},
            {x: 0, y: size.y},
        ],


        center: {x: size.x / 2, y: size.y / 2},
    }
}

function addVertexToTriangulation(vertex: IPoint, triangles: ITriangleInTriangulation[]): ITriangleInTriangulation[] {
    let edges = [];

    // Remove triangles with circumcircles containing the vertex
    const trianglesToKeep = triangles.filter((triangle) => {
        if (isPointInCircumcircle(vertex, triangle)) {
            // Add edges of removed triangle to edge list
            edges.push({v0: triangle.vertices[0], v1: triangle.vertices[1]});
            edges.push({v0: triangle.vertices[1], v1: triangle.vertices[2]});
            edges.push({v0: triangle.vertices[2], v1: triangle.vertices[0]});
            return false;
        }
        return true;
    });

    // Get unique edges
    edges = uniqueEdges(edges);

    // Create new triangles from the unique edges of the removed triangles and the new vertex
    for (const edge of edges) {
        const center = centerOfVertices([edge.v0, edge.v1, vertex])
        const circumcircle = circumcircleOfTriangle({vertices: [edge.v0, edge.v1, vertex], center});
        trianglesToKeep.push({vertices: [edge.v0, edge.v1, vertex], circumcircle, neighbors: [], center});
    };

    return trianglesToKeep;
}


function isPointInCircumcircle(point: IPoint, triangle: ITriangle): boolean {
    const circle = circumcircleOfTriangle(triangle);

    const dx = point.x - circle.center.x;
    const dy = point.y - circle.center.y;
    const distanceSquared = dx * dx + dy * dy;

    return distanceSquared <= circle.radius * circle.radius;
}

function uniqueEdges(edges) {
    const uniqueEdges = [];
    for (let i = 0; i < edges.length; ++i) {
        let isUnique = true;

        // See if edge is unique
        for (let j = 0; j < edges.length; ++j) {
            if (i != j && edgesAreEqual(edges[i], edges[j])) {
                isUnique = false;
                break;
            }
        }

        // Edge is unique, add to unique edges array
        if (isUnique) uniqueEdges.push(edges[i]);
    }

    return uniqueEdges;
}

function roadFromEdge(edge: IEdge, boundingBox: IPoint): Road {
    return new Road(edge, boundingBox);

}

function neighborDelaunayTriangles(targetTriangle: ITriangleInTriangulation, triangles: ITriangleInTriangulation[]): ITriangleInTriangulation[] {
    const neighbors: ITriangleInTriangulation[] = [];

    for (const triangle of triangles) {
        if (isNeighborTriangle(targetTriangle, triangle)) {
            neighbors.push(triangle);
        }
    }

    return neighbors;
}

function isNeighborTriangle(triangle1: ITriangle, triangle2: ITriangle): boolean {
    let sharedVertices = 0;

    if (hasSharedVertex(triangle1.vertices[0], triangle2)) sharedVertices++;
    if (hasSharedVertex(triangle1.vertices[1], triangle2)) sharedVertices++;
    if (hasSharedVertex(triangle1.vertices[2], triangle2)) sharedVertices++;

    return sharedVertices === 2;
}

function hasSharedVertex(vertex: IPoint, triangle: ITriangle): boolean {
    return (
        pointsAreEqual(vertex, triangle.vertices[0]) ||
        pointsAreEqual(vertex, triangle.vertices[1]) ||
        pointsAreEqual(vertex, triangle.vertices[2])
    );
}


function edgeListContainsEdge(edgeList: IEdge[], edge: IEdge, slop: number = 0.0): boolean {
    for (const e of edgeList) {
        if (edgesAreEqual(e, edge, slop)) return true;
    }
    return false;
}

