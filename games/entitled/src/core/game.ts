"use strict";

import { Camera } from "../view/camera";
import { Ground } from "../ground/ground";
import { createPeasant } from "../units/peasant";
import { Input } from "../interaction/input";
import { View } from "../view";
import { TEAM, Unit } from "../units/unit";
import { rand, randInRange } from "./rand";
import { createTower } from "../units/tower";
import { Royalty, createRoyalty } from "../units/royalty";
import { WarRoom, createWarRoom } from "../interaction/war-room";
import { StateManager } from "../states/state";

export class Game {
  public isRunning = false;
  public input: Input;
  public camera: Camera;
  public ground: Ground;
  public view: View;
  public actors: Unit[];
  public royalty: Royalty;
  public warRoom: WarRoom;
  public stateManager: StateManager;

  constructor(canvas: HTMLCanvasElement) {
    this.camera = new Camera();
    this.input = new Input(this.camera);
    this.ground = new Ground();
    this.ground.load();
    this.view = new View(canvas, this.camera, this.ground, this.input);
    this.stateManager = new StateManager();

    const halfW = this.ground.width / 2 | 0;
    const halfH = this.ground.height / 2 | 0;

    this.royalty = createRoyalty(halfW, halfH);
    this.actors = [
      this.royalty,
      // createTower(halfW + 30, halfH),
      // createTower(halfW, halfH + 30),
      // createTower(halfW + 30, halfH + 30),
      // createTower(halfW - 30, halfH - 30),
      // createTower(halfW + 30, halfH - 30),
      // createTower(halfW - 30, halfH - 30),
    ];

    // this.spawnWave();
    this.warRoom = createWarRoom(this);
    this.warRoom.hide();
    this.input.start();
  }

  spawnWave(numberOfPeasants: number) {
    const halfHeight = this.ground.height / 2;

    for (let i = 0; i < numberOfPeasants; i++) {
      const peasant = createPeasant(
        100 + rand(50) | 0,
        randInRange(halfHeight - 50, halfHeight + 50) | 0,
      );
      peasant.target = this.royalty;
      this.actors.push(peasant)
    }
  }

  getOneInRange({ position, range }: Unit, targetTeam: TEAM): Unit | undefined {
    for (let i = 0; i < this.actors.length; i++) {
      const a = this.actors[i];

      if (!a.isRemovable && a.team === targetTeam && a.position.manhattanDistXY(position) < range) {
        return a;
      }
    }
  }

  update(dt: number) {
    this.stateManager.update(dt, this);
    this.camera.update(dt, this.input, this.ground);
    this.ground.clearUnits();

    this.actors.forEach(a => {
      a.update(dt, this);
      this.ground.setUnit(a);
      return !a.isRemovable;
    });
  }

  draw(dt: number) {
    this.view.drawBackground();
    this.view.render();
    this.view.flip();
  }

  reset() {
    this.actors = [this.royalty];
  }
}
