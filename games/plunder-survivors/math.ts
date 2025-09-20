import {IEdge, IPoint, IPolygon, IVector} from "./interfaces";
import {PointPool} from "./pools";
export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

export function subtractVectors(a: IVector, b: IVector, out: IPoint): IPoint {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
}

export function addVectors(a: IPoint, b: IPoint, out: IPoint): IPoint {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
}

export function scaleVector(a: IPoint, scalar: number, out: IPoint): IPoint {
    out.x = a.x * scalar;
    out.y = a.y * scalar;
    return out;
}
export function normalizeAndScaleVector(a: IPoint, scalar: number, out: IPoint): IPoint {
    return scaleVector(normalizeVector(a, out), scalar, out);
}

export function normalizeVector(vector: IPoint, out: IPoint): IPoint {
    const length = Math.hypot(vector.x , vector.y);

    if (length === 0) {
        out.x = 0;
        out.y = 0;
        return out;
    }

    const x = vector.x / length;
    const y = vector.y / length;
    out.x = x;
    out.y = y;
    return out;
}
export function vectorFromEdge(edge: IEdge, out: IVector): IVector {
    const x= edge.v1.x - edge.v0.x;
    const y = edge.v1.y - edge.v0.y;
    out.x = x;
    out.y = y;
    return out;
}

export function edgeNormal(edge: IEdge, out: IVector): IVector {
    vectorFromEdge(edge, out)
    normalFromVector(out, out)
    return out;
}

export function dot(a: IPoint, b: IPoint): number {
    return a.x * b.x + a.y * b.y;
}
export function calculateAngle(px: number, py: number, bx: number, by: number): number {
    return Math.atan2(by - py, bx - px);
}

export function normalFromVector(vector: IVector, out:IPoint): IPoint {
    const x= -vector.y;
    const y = vector.x;
    out.x = x;
    out.y = y;
    return normalizeVector(out, out);
}

export function perpendicularDistanceFromPointToEdge(point: IPoint, edge: IEdge): number | null {
    const l2 = squaredDistance(edge.v0, edge.v1);

    // Handle case where edge is a point
    if (l2 === 0) return distance(point, edge.v0);

    // t is the projection factor of the point onto the infinite line defined by the edge
    const t = ((point.x - edge.v0.x) * (edge.v1.x - edge.v0.x) +
        (point.y - edge.v0.y) * (edge.v1.y - edge.v0.y)) / l2;

    // If t is outside the [0, 1] range, there's no perpendicular intersection
    if (t < 0 || t > 1) return null;

    const projection: IPoint = {
        x: edge.v0.x + t * (edge.v1.x - edge.v0.x),
        y: edge.v0.y + t * (edge.v1.y - edge.v0.y)
    };

    return distance(point, projection);
}

export function midpointOfEdge(edge: IEdge): IPoint {
    return {
        x: (edge.v0.x + edge.v1.x) / 2,
        y: (edge.v0.y + edge.v1.y) / 2,
    };
}

export function calculateCrossProduct(a: IPoint, b: IPoint): number {
    return a.x * b.y - a.y * b.x;
}

export function squaredDistance(point1: IPoint, point2: IPoint): number {
    const { x: x1, y: y1 } = point1;
    const { x: x2, y: y2 } = point2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
}
export function distance(p1: IPoint, p2: IPoint): number {
    return Math.sqrt(squaredDistance(p1, p2));
}

export function isPointAlongLine(point: IPoint, edge: IEdge): boolean {
    const crossProduct = (point.y - edge.v0.y) * (edge.v1.x - edge.v0.x) - (point.x - edge.v0.x) * (edge.v1.y - edge.v0.y);

    // If crossProduct is not approximately 0, the point is not on the line.
    if (Math.abs(crossProduct) > .001) {
        return false;
    }

    return true;
}

export function pointsAreEqual(p1: IPoint, p2: IPoint, tolerance: number = 0.0): boolean {
    return Math.abs(p1.x - p2.x) <= tolerance && Math.abs(p1.y - p2.y) <= tolerance;
}

export function areaOfVertices(vertices: IPoint[]): number {
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
        const j = (i + 1) % vertices.length;
        area += vertices[i].x * vertices[j].y;
        area -= vertices[i].y * vertices[j].x;
    }
    area /= 2;
    return area;
}

export function edgesAreEqual(e1: IEdge, e2: IEdge, slop: number = 0): boolean {
    return (pointsAreEqual(e1.v0, e2.v0, slop) && pointsAreEqual(e1.v1, e2.v1, slop)) || (pointsAreEqual(e1.v0, e2.v1, slop) && pointsAreEqual(e1.v1, e2.v0, slop));
}

const trigCache = {};

// building up trig cache
for (let i = 0; i < 2*Math.PI; i+=.001) {
   getSin(i);
   getCos(i);
}

function normalizeAngle(angle: number): number {
    return (angle + 2*Math.PI) % (2*Math.PI);
}
export function getCos(angle: number): number {
    angle = normalizeAngle(angle)
    const lookup = Math.floor(angle * 100);
    setTrigCache(lookup);
    return trigCache[lookup].cos;
}

function setTrigCache(lookup: number): void {
    if (!trigCache[lookup]) {
        // console.log("setting trig cache for", lookup);
        const angle = lookup / 100;
        trigCache[lookup] = {
            cos: Math.cos(angle),
            sin: Math.sin(angle)
        };
    }
}

export function getSin(angle: number): number {
    angle = normalizeAngle(angle)
    const lookup = Math.floor(angle * 100);
    setTrigCache(lookup);
    return trigCache[lookup].sin;
}

