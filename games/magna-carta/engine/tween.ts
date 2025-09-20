import { Entity } from "./entity";
import { clamp01 } from "./math";
import { Vector, lerp } from "./vector";

type TweenType = "none" | "move" | "scale";

export class Tween {
    public time = 0;
    private target: Vector;
    private start: Vector;
    private startTime: number;
    private duration: number;
    private active: boolean;
    private type: TweenType = "none";

    constructor(private entity: Entity, private easer: (val: number) => number = easeBounceOut) {
    }

    public scale(target: Vector, duration: number): void {
        this.type = "scale";
        const p = this.entity.scale;
        this.start = { x: p.x, y: p.y };
        this.startTween(target, duration);
    }

    public move(target: Vector, duration: number): void {
        this.type = "move";
        const p = this.entity.p;
        this.start = { x: p.x, y: p.y };
        this.startTween(target, duration);
    }

    private startTween(target: Vector, duration: number): void {
        this.target = target;
        this.duration = duration * 1000;
        this.active = true;
        this.startTime = -1;
    }

    public update(tick: number): void {
        if(this.startTime < 0 || this.type == "none") {
            this.startTime = tick;
            return;
        }
        if(!this.active) return;
        this.time = clamp01((tick - this.startTime) / this.duration);
        if(!this.start || !this.target) return;
        const p = lerp(this.start, this.target, this.time, this.easer);
        
        if(this.type == "move") this.entity.p = { x: p.x, y: p.y };
        if(this.type == "scale") this.entity.scale = { x: p.x, y: p.y };

        this.active = this.time < 1;
    }
}

export const easeQuadOut = (p: number): number => {
    return -(p * (p - 2));
}

export const easeBounceOut = (p: number): number => {
    if(p < 4/11.0)
    {
        return (121 * p * p)/16.0;
    }
    else if(p < 8/11.0)
    {
        return (363/40.0 * p * p) - (99/10.0 * p) + 17/5.0;
    }
    else if(p < 9/10.0)
    {
        return (4356/361.0 * p * p) - (35442/1805.0 * p) + 16061/1805.0;
    }
    else
    {
        return (54/5.0 * p * p) - (513/25.0 * p) + 268/25.0;
    }
}