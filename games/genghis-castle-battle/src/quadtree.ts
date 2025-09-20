import { AABB } from "./aabb";
import { Vector2 } from "./vector";

export class QuadTreeNodes {
    public northWest: QuadTree;
    public northEast: QuadTree;
    public southWest: QuadTree;
    public southEast: QuadTree;

    public asArray(): QuadTree[] {
        return [this.northWest, this.northEast, this.southWest, this.southEast];
    }
}

export class QuadTree {
    public readonly capacity = 4;

    public points: Vector2[] = [];

    public divided = false;

    public nodes = new QuadTreeNodes();

    constructor(public bounds: AABB) { }

    public remove(point: Vector2): boolean {
        const match = this.points.findIndex(({ x, y }) => x === point.x && y === point.y);
        if (match !== -1) {
            this.points.splice(match);
            return true;
        }

        return false;
    }

    /**
     * Insert a point into the QuadTree
     * @param point
     */
    public insert(point: Vector2): boolean {
        if (!this.bounds.containsPoint(point)) {
            return false;
        }

        if (!this.divided && this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        return (
            this.nodes.northWest.insert(point) ||
            this.nodes.northEast.insert(point) ||
            this.nodes.southWest.insert(point) ||
            this.nodes.southEast.insert(point)
        );
    }

    /**
     * Find all points that appear with in a given range
     * @param range
     */
    public queryRange(range: AABB): Vector2[] {
        const pointsInRange: Vector2[] = [];

        if (!this.bounds.intersects(range)) {
            return pointsInRange;
        }

        if (this.divided) {
            pointsInRange.push(...this.nodes.northWest.queryRange(range));
            pointsInRange.push(...this.nodes.northEast.queryRange(range));
            pointsInRange.push(...this.nodes.southWest.queryRange(range));
            pointsInRange.push(...this.nodes.southEast.queryRange(range));

            return pointsInRange;
        }

        for (const p of this.points) {
            if (range.containsPoint(p)) {
                pointsInRange.push(p);
            }
        }

        return pointsInRange;
    }

    /**
     * Create four children that fully divide this quad into four quads of equal areas
     * @private
     */
    private subdivide() {
        if (this.divided) {
            return;
        }
        this.divided = true;

        const { x, y } = this.bounds.pos;
        const width = this.bounds.width / 2;
        const height = this.bounds.height / 2;

        const northWest = new AABB(width, height, new Vector2(x, y));
        const northEast = new AABB(width, height, new Vector2(x + width, y));
        const southWest = new AABB(width, height, new Vector2(x, y + height));
        const southEast = new AABB(width, height, new Vector2(x + width, y + height));

        this.nodes.northWest = new QuadTree(northWest);
        this.nodes.northEast = new QuadTree(northEast);
        this.nodes.southWest = new QuadTree(southWest);
        this.nodes.southEast = new QuadTree(southEast);

        for (const p of this.points) {
            this.nodes.northWest.insert(p);
            this.nodes.northEast.insert(p);
            this.nodes.southWest.insert(p);
            this.nodes.southEast.insert(p);
        }

        this.points = [];
    }
}