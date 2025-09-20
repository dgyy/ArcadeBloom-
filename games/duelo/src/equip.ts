import { Animatable, animatableCreate } from './animation';
import { MaterialType, ModelType, Object, objectCreate, objectSetColorOverride, objectSetMaterial } from './model';
import * as knightModelData from '../art/knight.svg';
import * as swordModelData from '../art/sword.svg';
import {
    knightApplyArmorOverrides,
    knightApplyBootsOverrides,
    knightApplyGauntletOverrides,
    knightApplyHelmetOverrides,
} from './knight';
import { ColorRGB } from './gl';

export const enum EquippedIdsProperties {
    SwordId,
    GauntletsId,
    BootsId,
    HelmetId,
    ArmorId,
}

export type EquippedIds = {
    [EquippedIdsProperties.SwordId]?: number;
    [EquippedIdsProperties.GauntletsId]?: number;
    [EquippedIdsProperties.BootsId]?: number;
    [EquippedIdsProperties.HelmetId]?: number;
    [EquippedIdsProperties.ArmorId]?: number;
};

const TYPE_NAMES = ['SWORD', 'GAUNTLETS', 'BOOTS', 'HELMET', 'ARMOR'];
const MATERIAL_NAMES = ['BRONZE', 'IRON', 'STEEL', 'GOLD', 'DRAGON', 'EMERALD'];

export const CROWN_ID = 33;
export const EQUIP_TYPES = TYPE_NAMES.length;
export const ITEM_LEVELS = MATERIAL_NAMES.length;
const ITEM_TYPES = EQUIP_TYPES * ITEM_LEVELS;

export const equipGetType = (itemId: number) => (itemId % EQUIP_TYPES) as EquippedIdsProperties;
export const equipGetLevel = (itemId: number) => (itemId / EQUIP_TYPES) | 0;

export const equipGetItemId = (type: EquippedIdsProperties, level: number = 0) =>
    level >= 0 ? type + level * EQUIP_TYPES : -1;

export const equipGetRandomId = (): number => (Math.random() * ITEM_TYPES) | 0;

export const equipGetSwordId = (equippedIds: EquippedIds): number | undefined => {
    return equippedIds[EquippedIdsProperties.SwordId];
};

export const equipCreateSwordObject = (itemId: number): Object => {
    const object = objectCreate(ModelType.Sword);
    objectSetColorOverride(object, swordModelData.metalComponentId, equipGetColor(itemId));
    return object;
};

export const equipCreateAnimatable = (itemId: number): Animatable => {
    const knight = objectCreate(ModelType.Knight);
    objectSetMaterial(knight, MaterialType.Invisible);
    switch (equipGetType(itemId)) {
        case EquippedIdsProperties.SwordId:
            return animatableCreate(equipCreateSwordObject(itemId), []);
        case EquippedIdsProperties.GauntletsId: {
            knightApplyGauntletOverrides(knight, itemId);
            return animatableCreate(knight, []);
        }
        case EquippedIdsProperties.BootsId: {
            knightApplyBootsOverrides(knight, itemId);
            return animatableCreate(knight, []);
        }
        case EquippedIdsProperties.HelmetId: {
            debugger;
            knightApplyHelmetOverrides(knight, itemId);
            return animatableCreate(knight, []);
        }
        case EquippedIdsProperties.ArmorId: {
            knightApplyArmorOverrides(knight, itemId);
            return animatableCreate(knight, []);
        }
    }
};

export const equipGetOriginComponentId = (itemId: number): number => {
    if (itemId === CROWN_ID) {
        return knightModelData.crownComponentId;
    }

    switch (equipGetType(itemId)) {
        case EquippedIdsProperties.SwordId:
            return swordModelData.centerComponentId;
        case EquippedIdsProperties.GauntletsId:
            return knightModelData.gauntletsCenterComponentId;
        case EquippedIdsProperties.BootsId:
            return knightModelData.bootsCenterComponentId;
        case EquippedIdsProperties.HelmetId:
            return knightModelData.helmetComponentId;
        case EquippedIdsProperties.ArmorId:
            return knightModelData.bodyComponentId;
    }
};

export const equipGetName = (itemId: number): string => {
    if (itemId === CROWN_ID) {
        return 'CROWN';
    }

    const type = equipGetType(itemId);
    const level = equipGetLevel(itemId);
    return `${MATERIAL_NAMES[level]} ${TYPE_NAMES[type]}`;
};

const equipColors: Array<ColorRGB> = [
    [0.75, 0.54, 0.44], // bronze
    [0.3, 0.3, 0.3], // iron
    [0.6, 0.6, 0.6], // steel
    [0.83, 0.69, 0.22], // gold
    [0.7, 0.0, 0.0], // dragon
    [0.5, 0.7, 0.5], // emerald
];

export const equipGetColor = (itemId: number): ColorRGB => {
    const level = equipGetLevel(itemId);
    return equipColors[level];
};

export const equipGetAttack = (itemId: number): number => {
    return itemId >= 0 ? Math.pow(2, equipGetLevel(itemId) + 1) : 0;
};

export const equipGetDefense = (itemId: number): number => {
    return itemId >= 0 ? Math.pow(2, equipGetLevel(itemId)) * equipGetType(itemId) : 0;
};
