import {
    Animatable,
    animatableBeginStep,
    animatableDraw,
    animatableGetRootTransform,
    animatableSetOriginComponent,
    animatableTransform,
    animatableTransformApply,
} from './animation';
import { Program } from './gl';
import { Vec2, matrixSetIdentity, matrixTranslateVector, vectorCreate } from './glm';

const enum DropProperties {
    Position,
    Animatable,
    OriginComponentId,
    DirectionLeft,
    TimePassed,
}

export type Drop = {
    [DropProperties.Position]: Vec2;
    [DropProperties.Animatable]: Animatable;
    [DropProperties.OriginComponentId]: number;
    [DropProperties.DirectionLeft]: boolean;
    [DropProperties.TimePassed]: number;
};

export const dropCreate = (
    animatable: Animatable,
    originComponentId: number,
    x: number,
    directionLeft: boolean
): Drop => {
    return {
        [DropProperties.Position]: vectorCreate(x, 0),
        [DropProperties.Animatable]: animatable,
        [DropProperties.OriginComponentId]: originComponentId,
        [DropProperties.DirectionLeft]: directionLeft,
        [DropProperties.TimePassed]: 0,
    };
};

export const dropDraw = (drop: Drop, program: Program) => {
    const animatable = drop[DropProperties.Animatable];
    const matrix = animatableGetRootTransform(animatable);
    matrixSetIdentity(matrix);
    animatableTransform(animatable);
    animatableSetOriginComponent(animatable, drop[DropProperties.OriginComponentId]);
    matrixSetIdentity(matrix);
    matrixTranslateVector(matrix, drop[DropProperties.Position]);
    animatableTransformApply(animatable, matrix);

    animatableDraw(animatable, program);
};

const animationDuration = 500;
export const dropStep = (drop: Drop, timePassed: number) => {
    animatableBeginStep(drop[DropProperties.Animatable]);

    if (drop[DropProperties.TimePassed] > animationDuration) {
        return;
    }
    const curveHeight = 50;
    drop[DropProperties.TimePassed] += timePassed;
    drop[DropProperties.Position][1] =
        -70 + curveHeight - Math.pow((drop[DropProperties.TimePassed] * 2) / animationDuration - 1, 2) * curveHeight;
    drop[DropProperties.Position][0] +=
        ((drop[DropProperties.DirectionLeft] ? -1 : 1) * 100 * timePassed) / animationDuration;
};

export const dropIsPickable = (drop: Drop, x: number) =>
    drop[DropProperties.TimePassed] > animationDuration && Math.abs(x - drop[DropProperties.Position][0]) < 15;
