import { HEX, PURPLE } from "../core/resources";

export type Name = string;
export type Power = number;
export type Price = number;
export type ProjectileCount = number;
export type Weapon = [Name, HEX, Power, ProjectileCount, Price];

export const weapons: Weapon[] = [
  // ['Entitlement', PURPLE, 10, 1, 20],
  // ['Nationalism', RED, 10, 1, 20],
  // ['Patriotism', RED, 10, 1, 20],
  // ['Prejudice', RED, 10, 1, 20],
  // ['Privilege', WHITE, 10, 1, 20],
  // ['Slurs', RED, 10, 1, 20],
  // ['Superstition', RED, 10, 1, 20],
];
