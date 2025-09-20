import { ColorRGB, glMeshDraw, glMeshCreate, Mesh, Program, glSetModelTransform } from './gl';
import {
    Matrix3,
    matrixCopy,
    matrixCreate,
    matrixMultiply,
    matrixMultiplyVector,
    matrixTranslateVector,
    Vec2,
    vectorCreate,
} from './glm';
import * as manModelData from '../art/knight.svg';
import * as swordModelData from '../art/sword.svg';
import * as goldModelData from '../art/gold.svg';
import * as backgroundModelData from '../art/background.svg';
import * as treeModelData from '../art/tree.svg';
import { COLOR_PRECISION, COORDINATES_PRECISION } from './config';

export const enum ModelType {
    Knight,
    Sword,
    Gold,
    Background,
    Tree,
}

const modelStorage = new WeakMap<Program, Map<ModelType, Array<Mesh>>>();

export const enum PolygonProperty {
    Vertices,
    Indices,
    Color,
    TransformOrigin,
}

export type Polygon = {
    [PolygonProperty.Vertices]: Array<number>;
    [PolygonProperty.Indices]: Array<number>;
    [PolygonProperty.Color]: ColorRGB;
    [PolygonProperty.TransformOrigin]: [number, number];
};

export const enum ModelDataProperty {
    Polygons,
    ParentMap,
    MaterialMap,
}

export type ModelData = {
    [ModelDataProperty.Polygons]: Array<Polygon>;
    [ModelDataProperty.ParentMap]: Array<number>;
    [ModelDataProperty.MaterialMap]: { [componentId: number]: number };
};

const enum ModelMeshProperty {
    TransformOrigin,
    Color,
}

export type ModelMesh = {
    [ModelMeshProperty.TransformOrigin]: Vec2;
    [ModelMeshProperty.Color]: ColorRGB;
};

const enum ObjectComponentProperty {
    Mesh,
    Matrix,
}

export type ObjectComponent = {
    [ObjectComponentProperty.Mesh]: ModelMesh;
    [ObjectComponentProperty.Matrix]: Matrix3;
};

const enum ModelProperty {
    Meshes,
    ParentMap,
    MaterialMap,
    TransformOrder,
}

type Model = {
    [ModelProperty.Meshes]: Array<ModelMesh>;
    [ModelProperty.ParentMap]: Array<number>;
    [ModelProperty.MaterialMap]: { [componentId: number]: number };
    [ModelProperty.TransformOrder]: Array<number>;
};

const enum ObjectProperty {
    Components,
    ModelType,
    Transform,
    Subobjects,
    ColorOverrides,
    MaterialType,
    MaterialOverrides,
}

export const enum MaterialType {
    Invisible = -1,
    Solid = 0,
    Matte = 1,
    Shiny = 2,
    Logo = 3,
}

export type Object = {
    [ObjectProperty.Components]: Array<ObjectComponent>;
    [ObjectProperty.ModelType]: ModelType;
    [ObjectProperty.Transform]: Matrix3;
    [ObjectProperty.Subobjects]: {
        [componentId: number]: Object;
    };
    [ObjectProperty.ColorOverrides]: {
        [componentId: number]: ColorRGB;
    };
    [ObjectProperty.MaterialType]: MaterialType;
    [ObjectProperty.MaterialOverrides]: {
        [componentId: number]: number;
    };
};

const modelMeshFromPolygon = (polygon: Polygon): ModelMesh => {
    const transformCoordinate = (c: number) => c / COORDINATES_PRECISION;
    const transformColor = (c: number) => c / COLOR_PRECISION;

    return {
        [ModelMeshProperty.TransformOrigin]: vectorCreate(
            ...(polygon[PolygonProperty.TransformOrigin].map(transformCoordinate) || [0, 0])
        ),
        [ModelMeshProperty.Color]: polygon[PolygonProperty.Color].map(transformColor) as ColorRGB,
    };
};

export const modelCreate = (data: ModelData): Model => {
    const meshes = data[ModelDataProperty.Polygons].map(polygon => modelMeshFromPolygon(polygon));

    const calculateLevel = (index: number) => {
        let level = 0;
        let current = index;
        while (typeof data[ModelDataProperty.ParentMap][current] === 'number') {
            level++;
            current = data[ModelDataProperty.ParentMap][current];
        }

        return level;
    };

    const transformOrder = data[ModelDataProperty.ParentMap].map((parentId, index) => index);
    transformOrder.sort((a, b) => calculateLevel(a) - calculateLevel(b));

    return {
        [ModelProperty.Meshes]: meshes,
        [ModelProperty.ParentMap]: data[ModelDataProperty.ParentMap],
        [ModelProperty.MaterialMap]: data[ModelDataProperty.MaterialMap],
        [ModelProperty.TransformOrder]: transformOrder,
    };
};

const modelsData = {
    [ModelType.Knight]: manModelData.model,
    [ModelType.Sword]: swordModelData.model,
    [ModelType.Gold]: goldModelData.model,
    [ModelType.Background]: backgroundModelData.model,
    [ModelType.Tree]: treeModelData.model,
};

const models = {
    [ModelType.Knight]: modelCreate(manModelData.model),
    [ModelType.Sword]: modelCreate(swordModelData.model),
    [ModelType.Gold]: modelCreate(goldModelData.model),
    [ModelType.Background]: modelCreate(backgroundModelData.model),
    [ModelType.Tree]: modelCreate(treeModelData.model),
};

export const objectCreate = (modelType: ModelType): Object => {
    const components = models[modelType][ModelProperty.Meshes].map(mesh => objectComponentFromMesh(mesh));

    return {
        [ObjectProperty.Components]: components,
        [ObjectProperty.ModelType]: modelType,
        [ObjectProperty.Transform]: matrixCreate(),
        [ObjectProperty.Subobjects]: {},
        [ObjectProperty.ColorOverrides]: {},
        [ObjectProperty.MaterialType]: undefined,
        [ObjectProperty.MaterialOverrides]: {},
    };
};

export const objectSetSubObject = (object: Object, componentId: number, subobject: Object = null) => {
    if (subobject === undefined) {
        delete object[ObjectProperty.Subobjects][componentId];
    } else {
        object[ObjectProperty.Subobjects][componentId] = subobject;
    }
};

export const objectSetMaterialOverride = (object: Object, componentId: number, material: number = undefined) => {
    if (material === undefined) {
        delete object[ObjectProperty.MaterialOverrides][componentId];
    } else {
        object[ObjectProperty.MaterialOverrides][componentId] = material;
    }
};

export const objectSetColorOverride = (object: Object, componentId: number, color: ColorRGB = undefined) => {
    if (color === undefined) {
        delete object[ObjectProperty.ColorOverrides][componentId];
    } else {
        object[ObjectProperty.ColorOverrides][componentId] = color;
    }
};

export const objectGetColorOverride = (object: Object, componentId: number) => {
    return object[ObjectProperty.ColorOverrides][componentId];
};

export const objectSetMaterial = (object: Object, material: MaterialType) => {
    object[ObjectProperty.MaterialType] = material;
};

const objectComponentFromMesh = (mesh: ModelMesh): ObjectComponent => {
    return {
        [ObjectComponentProperty.Mesh]: mesh,
        [ObjectComponentProperty.Matrix]: matrixCreate(),
    };
};

export const objectTransformComponent = (object: Object, componentId: number) => {
    const component = object[ObjectProperty.Components][componentId];
    const subobject = object[ObjectProperty.Subobjects][componentId];
    const matrix = component[ObjectComponentProperty.Matrix];

    const model = models[object[ObjectProperty.ModelType]];
    const parentId = model[ModelProperty.ParentMap][componentId];
    if (typeof parentId === 'number') {
        matrixCopy(matrix, object[ObjectProperty.Components][parentId][ObjectComponentProperty.Matrix]);
    } else {
        matrixCopy(matrix, object[ObjectProperty.Transform]);
    }
    matrixTranslateVector(matrix, component[ObjectComponentProperty.Mesh][ModelMeshProperty.TransformOrigin]);

    if (subobject) {
        matrixCopy(objectGetRootTransform(subobject), matrix);
        objectApplyTransforms(subobject);
    }
};

export const objectTransformApplyComponent = (object: Object, componentId: number, transform: Matrix3) => {
    const component = object[ObjectProperty.Components][componentId];
    const subobject = object[ObjectProperty.Subobjects][componentId];
    const matrix = component[ObjectComponentProperty.Matrix];

    matrixMultiply(matrix, matrix, transform);
    if (subobject) {
        matrixCopy(objectGetRootTransform(subobject), matrix);
        const model = models[subobject[ObjectProperty.ModelType]];
        for (const subComponentId of model[ModelProperty.TransformOrder]) {
            objectTransformApplyComponent(subobject, subComponentId, transform);
        }
    }
};

export const objectApplyTransforms = (object: Object) => {
    const model = models[object[ObjectProperty.ModelType]];
    for (const componentId of model[ModelProperty.TransformOrder]) {
        objectTransformComponent(object, componentId);
    }
};

export const objectDraw = (object: Object, program: Program) => {
    const componentsLength = object[ObjectProperty.Components].length;
    const meshes = meshesLoad(program, object[ObjectProperty.ModelType]);
    for (let componentId = 0; componentId < componentsLength; componentId++) {
        const material = objectGetComponentMaterial(object, componentId);
        if (material === MaterialType.Invisible) {
            continue;
        }

        const subobject = object[ObjectProperty.Subobjects][componentId];
        if (subobject !== undefined) {
            if (subobject !== null) {
                // matrixCopy(objectGetRootTransform(subobject), objectGetComponentTransform(object, componentId));
                objectDraw(subobject, program);
            }
            continue;
        }

        const component = object[ObjectProperty.Components][componentId];
        glSetModelTransform(program, component[ObjectComponentProperty.Matrix]);
        const modelMesh = component[ObjectComponentProperty.Mesh];
        const color = object[ObjectProperty.ColorOverrides][componentId] || modelMesh[ModelMeshProperty.Color];
        glMeshDraw(program, meshes[componentId], color, material);
    }
};

const objectGetComponentMaterial = (object: Object, componentId: number) => {
    const model = models[object[ObjectProperty.ModelType]];
    const material =
        object[ObjectProperty.MaterialOverrides][componentId] ||
        object[ObjectProperty.MaterialType] ||
        model[ModelProperty.MaterialMap][componentId];

    return material;
};

const meshesLoad = (program: Program, modelType: ModelType) => {
    if (!modelStorage.has(program)) {
        modelStorage.set(program, new Map());
    }

    const programModels = modelStorage.get(program);
    if (!programModels.has(modelType)) {
        const modelData = modelsData[modelType];
        programModels.set(
            modelType,
            modelData[ModelDataProperty.Polygons].map(polygon => {
                const transformCoordinate = (c: number) => c / COORDINATES_PRECISION;
                return glMeshCreate(
                    program,
                    polygon[PolygonProperty.Vertices].map(transformCoordinate),
                    polygon[PolygonProperty.Indices]
                );
            })
        );
    }

    return programModels.get(modelType);
};

export const objectGetComponentTransform = (object: Object, componentId: number) =>
    object[ObjectProperty.Components][componentId][ObjectComponentProperty.Matrix];

export const objectCalculateomponentTransformedOrigin = (object: Object, componentId: number, result: Vec2) => {
    const componentTransform = objectGetComponentTransform(object, componentId);
    result[0] = 0;
    result[1] = 0;
    matrixMultiplyVector(result, componentTransform);
    return result;
};

export const objectGetRootTransform = (object: Object) => object[ObjectProperty.Transform];

export const objectGetComponentTransformOrder = (object: Object) => {
    const model = models[object[ObjectProperty.ModelType]];
    return model[ModelProperty.TransformOrder];
};
