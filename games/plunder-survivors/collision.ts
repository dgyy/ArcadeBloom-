import {
    IPoint,
    IPoolPoint, ICollision, IVector,
} from "./interfaces";
import {subtractVectors, addVectors, scaleVector, normalizeVector, dot, normalFromVector} from "./math";
import {PointPool} from "./pools";


export function findCollisions(entity: IPoint[], otherEntities: IPoint[][], collisions: ICollision[]): number {
    let count = 0;
    for (let i = 0; i < otherEntities.length; i++) {
        const other = otherEntities[i];
        const collision = collisions[count];
        const found = findCollision(entity, other, collision);
        if (collision.depth > 0) count++;
    }

    return count;
}
function findCollision(entity1: IPoint[], entity2: IPoint[], out: ICollision): ICollision {
    const start = PointPool.get();
    const end = PointPool.get();
    const depth = getSeparation(entity1, entity2, start, end);
    if (depth <= 0) {
        PointPool.release(start);
        PointPool.release(end);
        out.edge.v0.x = 0;
        out.edge.v0.y = 0;
        out.edge.v1.x = 0;
        out.edge.v1.y = 0;
        out.depth = 0;
        return out;
    }
    out.edge.v0.x = start.x;
    out.edge.v0.y = start.y;
    out.edge.v1.x = end.x;
    out.edge.v1.y = end.y;
    out.depth = depth;

    PointPool.release(start);
    PointPool.release(end);
    return out;
}

function normalAtIndex(vertices: IPoint[], index: number, out: IPoint): IVector {
    vectorAtIndex(vertices, index, out);
    return normalFromVector(out, out);
}
function vectorAtIndex(vertices: IPoint[], index: number, out: IPoint): IVector {
    const currentVertex = vertices[index];
    const nextVertex = vertices[(index + 1) % vertices.length];
    return subtractVectors(currentVertex, nextVertex, out);
}

function getSeparation(entity1: IPoint[], entity2: IPoint[], start: IPoint, end: IPoint): number {
    const axis1 = PointPool.get(0, 0);
    const point1 = PointPool.get(0, 0);
    const axis2 = PointPool.get(0, 0);
    const point2 = PointPool.get(0, 0);
    const normal = PointPool.get(0, 0);
    const scaled = PointPool.get(0, 0);

    const a = findMinSeparation(entity1, entity2, axis1, point1);
    const b = findMinSeparation(entity2, entity1, axis2, point2);
    let depth = 0;

    if (a >= 0 || b >= 0) {
        PointPool.release(axis1);
        PointPool.release(point1);
        PointPool.release(axis2);
        PointPool.release(point2);
        PointPool.release(normal);
        PointPool.release(scaled);
        return depth;
    }

    if (a > b) {
        depth = -1 * a;
        normalFromVector(axis1,normal);

        start.x = point1.x;
        start.y = point1.y;
        addVectors(point1, scaleVector(normal, depth, scaled), point2);
        end.x = point2.x;
        end.y = point2.y;
    } else {
        depth = -1 * b;
        normalFromVector(axis2, normal);
        scaleVector(normal, -1, point1);
        normal.x = point1.x;
        normal.y = point1.y;
        end.x = point2.x;
        end.y = point2.y;
        subtractVectors(point2, scaleVector(normal, depth, scaled), start);
    }

    PointPool.release(axis1);
    PointPool.release(point1);
    PointPool.release(axis2);
    PointPool.release(point2);
    PointPool.release(normal);
    PointPool.release(scaled);

    return depth;
}
function findMinSeparation(verticesA: IPoint[], verticesB: IPoint[], axis: IPoint, point: IPoint): number {
    let separation = Number.NEGATIVE_INFINITY;
    const minVertex = PointPool.get();
    const normal = PointPool.get();
    const bMinusA = PointPool.get();
    let i = 0;

    for (const va of verticesA) {
        normalAtIndex(verticesA, i, normal);
        let minOverlap = Number.POSITIVE_INFINITY;
        for (const vb of verticesB) {

            const dotProduct = dot(subtractVectors(vb, va, bMinusA), normal);
            if (dotProduct < minOverlap) {
                minOverlap = dotProduct
                minVertex.x = vb.x;
                minVertex.y = vb.y;
            }
        }

        if (minOverlap > separation) {
            separation = minOverlap;
            vectorAtIndex(verticesA, i, axis);
            point.x = minVertex.x;
            point.y = minVertex.y;
        }
        i++;
    }

    PointPool.release(bMinusA);
    PointPool.release(normal);
    PointPool.release(minVertex);

    return separation;
}

export function circlesCollide(x1: number, y1: number, radius1: number, x2: number, y2: number, radius2: number): boolean {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distance = Math.hypot(dx, dy);
    return distance <= radius1 + radius2;
}
