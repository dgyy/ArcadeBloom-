import { CollisionBlock } from "@/classes/CollisionBlock";
import { Box } from "@/model/common.model";
import { drawEngine } from "./draw-engine";

export function parse2D(array: Array<number>) {
    const rows = [];
    for (let i = 0; i < array.length; i += 32) {
        rows.push(array.slice(i, i + 32));
    }

    return rows;
}

export function createArrayFrom2D(array: Array<number>, symbolKey: any) {
    const objects: Array<any> = [];
    array.forEach((row: any, yIndex: any) => {
        row.forEach((symbol: any, xIndex: any) => {
            if (symbol == symbolKey) {
                let position: DOMPoint = new DOMPoint(0, 0);
                // Push new collision into new collision block array.
                position.x = xIndex * 16;
                position.y = (yIndex * 16);
                objects.push(
                    new CollisionBlock(position)
                )
            }
        });
    });

    return objects;
}

export function collisions(objectA: Box, objectB: Box) {
    return (objectA.position.x <= objectB.position.x + objectB.width &&
        objectA.position.x + objectA.width >= objectB.position.x &&
        objectA.position.y + objectA.height >= objectB.position.y &&
        objectA.position.y <= objectB.position.y + objectB.height);
}

export function debugBox(gameObject: any, color: string) {
    drawEngine.context.strokeStyle = color;
    drawEngine.context.lineWidth = 1;
    drawEngine.context.beginPath();
    drawEngine.context.rect(gameObject.position.x, gameObject.position.y, gameObject.width, gameObject.height);
    drawEngine.context.stroke();
}

export function fadeIn(element: any, duration: number, onComplete?: () => void) {
    let startTime: number | null = null;

    function animate(timestamp: number) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const opacity = Math.min(1, elapsed / duration);

        element.style.opacity = opacity.toString();

        if (opacity < 1) {
            requestAnimationFrame(animate);
        } else {
            if (onComplete) {
                onComplete();
            }
        }
    }

    requestAnimationFrame(animate);
}

export function fadeOut(element: any, duration: number, onComplete?: () => void) {
    let startTime: number | null = null;

    function animate(timestamp: number) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const opacity = 1 - Math.min(1, elapsed / duration);

        element.style.opacity = opacity.toString();

        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            if (onComplete) {
                onComplete();
            }
        }
    }

    requestAnimationFrame(animate);
}

export function degreeToRadian(degree: number) {
    return Math.PI/180 * degree;
}

export function lerp(start: number, end: number, speed: number) {
    return start +(end-start) * speed;
}