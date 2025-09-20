import {
    Animatable,
    AnimatedProperty,
    animatableCreate,
    animatableDraw,
    animatableGetRootTransform,
    animatableTransform,
    animationElementCreate,
    animationElementGetValue,
    animationElementSetValue,
    boundElementCreate,
} from './animation';
import { Program } from './gl';
import { matrixScale, matrixSetIdentity, matrixTranslateVector, Vec2, vectorCreate } from './glm';
import { ModelType, objectCreate } from './model';
import * as modelData from '../art/background.svg';
import { FLOOR_LEVEL, GAME_WIDTH, VIRTUAL_HEIGHT } from './game';

const enum BackgroundProperties {
    Position,
    Animatable,
    CastleElement,
    Layer1Element,
    Layer2Element,
    LogoXElement,
    LogoScaleElement,
    LetterYElements,
}

export type Background = ReturnType<typeof backgroundCreate>;

const enum TreeProperties {
    Position,
    Animatable,
}

export type Tree = {
    [TreeProperties.Position]: Vec2;
    [TreeProperties.Animatable]: Animatable;
};

let background: Background = null;
let tree: Animatable;
const treePosition = vectorCreate(0, 0);

export const backgroundCreate = (position: Vec2) => {
    const castleX = animationElementCreate(0);
    const layer1X = animationElementCreate(0);
    const layer2X = animationElementCreate(0);
    const logoX = animationElementCreate(0);
    const logoScale = animationElementCreate(1);
    const letterDY = animationElementCreate(VIRTUAL_HEIGHT * 0.7);
    const letterUY = animationElementCreate(VIRTUAL_HEIGHT * 0.7);
    const letterEY = animationElementCreate(VIRTUAL_HEIGHT * 0.7);
    const letterLY = animationElementCreate(VIRTUAL_HEIGHT * 0.7);
    const letterOY = animationElementCreate(VIRTUAL_HEIGHT * 0.7);

    const background = {
        [BackgroundProperties.Position]: position,
        [BackgroundProperties.Animatable]: animatableCreate(objectCreate(ModelType.Background), [
            boundElementCreate(castleX, modelData.castleComponentId, AnimatedProperty.TranslationX),
            boundElementCreate(layer1X, modelData.mountainLayer1ComponentId, AnimatedProperty.TranslationX),
            boundElementCreate(layer2X, modelData.mountainLayer2ComponentId, AnimatedProperty.TranslationX),
            boundElementCreate(logoX, modelData.logoComponentId, AnimatedProperty.TranslationX),
            boundElementCreate(letterDY, modelData.dComponentId, AnimatedProperty.TranslationY),
            boundElementCreate(letterUY, modelData.uComponentId, AnimatedProperty.TranslationY),
            boundElementCreate(letterEY, modelData.eComponentId, AnimatedProperty.TranslationY),
            boundElementCreate(letterLY, modelData.lComponentId, AnimatedProperty.TranslationY),
            boundElementCreate(letterOY, modelData.oComponentId, AnimatedProperty.TranslationY),
            boundElementCreate(logoScale, modelData.logoComponentId, AnimatedProperty.ScaleX),
            boundElementCreate(logoScale, modelData.logoComponentId, AnimatedProperty.ScaleY),
        ]),
        [BackgroundProperties.CastleElement]: castleX,
        [BackgroundProperties.Layer1Element]: layer1X,
        [BackgroundProperties.Layer2Element]: layer2X,
        [BackgroundProperties.LogoXElement]: logoX,
        [BackgroundProperties.LogoScaleElement]: logoScale,
        [BackgroundProperties.LetterYElements]: [letterDY, letterUY, letterEY, letterLY, letterOY],
    };

    return background;
};

export const backgroundDraw = (
    program: Program,
    currentViewPosition: number,
    currentViewScale: number,
    menu: boolean
) => {
    const matrix = animatableGetRootTransform(background[BackgroundProperties.Animatable]);
    matrixSetIdentity(matrix);
    matrixTranslateVector(matrix, background[BackgroundProperties.Position]);

    animationElementSetValue(background[BackgroundProperties.CastleElement], -currentViewPosition * 0.5);
    animationElementSetValue(background[BackgroundProperties.Layer1Element], -currentViewPosition * 0.6);
    animationElementSetValue(background[BackgroundProperties.Layer2Element], -currentViewPosition * 0.8);
    animationElementSetValue(background[BackgroundProperties.LogoXElement], -currentViewPosition);
    animationElementSetValue(background[BackgroundProperties.LogoScaleElement], 1 / currentViewScale);

    const logoYTarget = menu ? VIRTUAL_HEIGHT * 0.2 : VIRTUAL_HEIGHT * 0.7;

    const logoElements = background[BackgroundProperties.LetterYElements];
    let i = logoElements.length;
    while (i--) {
        const letterY = logoElements[i];
        let letterYValue = animationElementGetValue(letterY);
        letterYValue += (logoYTarget - letterYValue) * (0.03 + i * 0.03);
        animationElementSetValue(letterY, letterYValue);
    }

    animatableTransform(background[BackgroundProperties.Animatable]);
    animatableDraw(background[BackgroundProperties.Animatable], program);

    const trees = 30;
    let j = trees;
    let randomizer = 0xfffff;
    while (j--) {
        const factor = 1 - j / trees;
        treePosition[1] = FLOOR_LEVEL + 55 - 45 * factor;
        randomizer = (randomizer * 1103534 + 123456) & 0x7fffffff;
        treePosition[0] =
            -GAME_WIDTH / 2 + (randomizer % GAME_WIDTH) - currentViewPosition * (10 * (1 / (trees * (1 + factor))));
        const treeMatrix = animatableGetRootTransform(tree);
        matrixSetIdentity(treeMatrix);
        matrixTranslateVector(treeMatrix, treePosition);
        matrixScale(treeMatrix, 0.1 + factor * 0.9, 0.1 + factor * 0.9);
        animatableTransform(tree);
        animatableDraw(tree, program);
    }
};

export const backgroundInit = () => {
    background = backgroundCreate(vectorCreate(0, -VIRTUAL_HEIGHT * 0.1));
    tree = animatableCreate(objectCreate(ModelType.Tree), []);
};

export const backgroundGetPosition = (background: Background) => background[BackgroundProperties.Position];
