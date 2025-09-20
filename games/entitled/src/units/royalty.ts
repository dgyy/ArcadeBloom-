import { YELLOW } from "../core/resources";
import { TEAM, Unit } from "./unit"

export class Royalty extends Unit {

}

export const createRoyalty = (x: number, y: number) => {
  const a = new Royalty(x, y, 50, YELLOW);
  a.team = TEAM.ROYALTY;
  a.maxSpeed = 0.01;
  return a;
};
