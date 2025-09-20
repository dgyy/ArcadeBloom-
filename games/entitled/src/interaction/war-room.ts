import { Game } from "../core/game";
import { randInRange } from "../core/rand";
import { BLACK, FLAMINGO, HEX, LIGHT_BLUE, PURPLE, RED, WHITE, getElementById } from "../core/resources";
import { createTower } from "../units/tower";
import { Weapon, weapons } from "./weapons";

export class WarRoom {
  public activeWeapon = 0;
  public selectorEl;
  public containerEl;
  public buildButton;
  public game: Game;

  constructor(containerEl, selectorEl, game: Game) {
    this.selectorEl = selectorEl;
    this.containerEl = containerEl;
    this.buildButton = getElementById("build-button");
    this.game = game;
    this.buildButton.addEventListener("click", this.buildTower, { capture: true }, true);
  }

  buildTower = (e) => {
    e.stopPropagation();
    e.preventDefault()
    console.log("build");
    const [name, color, power, projectiles, price] = weapons[this.activeWeapon];
    this.game.actors.push(
      createTower(
        randInRange(400, 600),
        randInRange(400, 600),
        color,
        power,
        projectiles
      )
    );
    return false;
  }

  setTowers() {
    this.selectorEl.innerHTML = '';

    weapons.map(([a, color], i) => {
      const option = document.createElement('option') as HTMLOptionElement;
      option.value = `${i + 1}`;
      option.innerHTML = a;
      return option;
    }).forEach(option => this.selectorEl.appendChild(option));
  }

  selectWeapon = (e) => {
    this.activeWeapon = e.target.selectedIndex;
    console.log("selected", this.activeWeapon);
  }

  getActiveWeapon(): Weapon {
    return weapons[this.activeWeapon];
  }

  show() {
    this.containerEl.className = "";
  }

  hide() {
    this.containerEl.className = "hidden";
  }
}

export const createWarRoom = (game: Game) => {
  const warRoomContainer = getElementById("war-room");
  const towerSelect = getElementById("towers") as HTMLSelectElement;
  const a = new WarRoom(warRoomContainer, towerSelect, game);
  a.setTowers();
  towerSelect.addEventListener("change", a.selectWeapon);

  return a;
};
