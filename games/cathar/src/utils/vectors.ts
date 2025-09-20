import {GameObject, Vector} from "kontra";

const getRotatedVector = (v: Vector, radiant: number) => Vector(
    Math.cos(radiant)*v.x - Math.sin(radiant)*v.y,
    Math.sin(radiant)*v.x + Math.cos(radiant)*v.y
)

const getVectorBetweenGameObjects = (source: GameObject, destination: GameObject) => {
    const d = destination.world ? {x: destination.world.x, y: destination.world.y} : {x: destination.x, y: destination.y}
    const s = source.world ? {x: source.world.x, y: source.world.y} : {x: source.x, y: source.y}
    return Vector(
        d.x - s.x,
        d.y - s.y
    )
}

export {getRotatedVector, getVectorBetweenGameObjects}