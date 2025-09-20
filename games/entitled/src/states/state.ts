import { story } from "../interaction/story";
import { Game } from "../core/game";
import { getElementById } from "../core/resources";
import { weapons } from "../interaction/weapons";

export const GAME_OVER_STATE = 'game-over';
export const INTRO_STATE = 'intro';
export const PLAY_STATE = 'play';
export const ROYALTY_SPEAKS_STATE = 'royalty-speaks';
export const WIN_STATE = 'win';

export class StateManager {
  public states = [
    new IntroState(),
    new RoyaltySpeaksState(),
    new PlayState(),
    new GameOverState(),
    new WinState(),
  ];
  public activeState: State;

  constructor() {
    this.activeState = this.states[0];
  }

  update(dt, game: Game) {
    this.activeState.update(dt, game);

    if (this.activeState.isDone(game)) {
      console.log("Prev state: ", this.activeState.name);
      this.activeState.end(game);
      const nextStateName = this.activeState.getNextStateName(game);
      this.activeState = this.states.find(state => state.name === nextStateName);
      this.activeState.start(game);
      console.log("New state: ", this.activeState.name);
    }
  }
}

export abstract class State {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public abstract getNextStateName(game: Game): string;
  public abstract isDone(game: Game): boolean;
  public abstract reset();
  public abstract update(dt: number, game: Game);

  public start(game: Game) {

  }

  public end(game: Game) {

  }
}

export class IntroState extends State {
  public cameraState = { ...story.flyPath[0] };
  public nextCameraState = { ...story.flyPath[1] };
  public cameraStateIndex = 0;
  public currentTime = 0;
  public duration = 2000;
  public isInteracted = false;

  constructor() {
    super(INTRO_STATE);
  }

  public getNextStateName(game: Game): string {
    return ROYALTY_SPEAKS_STATE;
  }

  public isDone(game: Game): boolean {
    return game.input.keypressed || game.input.mouseDown;
  }

  public reset() {
    this.currentTime = 0;
    this.cameraStateIndex = 0;
    this.cameraState = story.flyPath[this.cameraStateIndex];
    this.nextCameraState = story.flyPath[this.cameraStateIndex + 1];
  }

  public update(dt: number, game: Game) {
    this.currentTime += dt;

    if (this.currentTime > this.duration) {
      this.currentTime = 0;
      this.cameraStateIndex++;

      if (this.cameraStateIndex >= story.flyPath.length) {
        this.cameraStateIndex = 0;
        this.cameraState = story.flyPath[this.cameraStateIndex];
        this.nextCameraState = story.flyPath[this.cameraStateIndex + 1];
      } else {
        this.cameraState = this.nextCameraState;
        this.nextCameraState = story.flyPath[this.cameraStateIndex];
      }
    }

    const d = this.currentTime / this.duration;

    game.camera.angle = this.cameraState.angle + (this.nextCameraState.angle - this.cameraState.angle) * d;
    game.camera.distance = this.cameraState.distance + (this.nextCameraState.distance - this.cameraState.distance) * d;
    game.camera.horizon = this.cameraState.horizon + (this.nextCameraState.horizon - this.cameraState.horizon) * d;
    game.camera.position.x = this.cameraState.position.x + (this.nextCameraState.position.x - this.cameraState.position.x) * d;
    game.camera.position.y = this.cameraState.position.y + (this.nextCameraState.position.y - this.cameraState.position.y) * d;
    game.camera.position.z = this.cameraState.position.z + (this.nextCameraState.position.z - this.cameraState.position.z) * d;
  }

  public start(game: Game) {
    game.reset();
    game.input.start();
  }

  public end(game: Game) {
    getElementById('banner-start').style.display = 'none';
    game.input.stop();
  }
}

export class RoyaltySpeaksState extends State {
  public minDuration = 500;
  public time = 0;
  public isWeaponShown = false;
  public banner;

  constructor() {
    super(ROYALTY_SPEAKS_STATE);
    this.banner = getElementById("banner-roalty-speaks");
  }

  public getNextStateName(game: Game): string {
    return PLAY_STATE;
  }

  public isDone(game: Game): boolean {
    if (this.time > this.minDuration && this.isWeaponShown) {
      if (game.input.keypressed || game.input.mouseDown) {
        weapons.push(story.waves[story.waveIndex].newWeapon);
        return true;
      }
    }

    return false;
  }

  public reset() {
    this.time = 0;
    this.isWeaponShown = false;
  }

  public update(dt: number, game: Game) {
    this.time += dt;

    if (this.time > this.minDuration && !this.isWeaponShown) {
      if (game.input.keypressed || game.input.mouseDown) {
        this.isWeaponShown = true;
        this.time = 0;
        getElementById("speak").innerText = `"The new weapon is '${story.waves[story.waveIndex].newWeapon[0]}'!"`
      }
    }
  }

  public start(game: Game) {
    const { royaltyView } = story;
    game.camera.angle = royaltyView.angle;
    game.camera.distance = royaltyView.distance;
    game.camera.horizon = royaltyView.horizon;
    game.camera.position.x = royaltyView.position.x;
    game.camera.position.y = royaltyView.position.y;
    game.camera.position.z = royaltyView.position.z;
    this.banner.className = "";
    getElementById("speak").innerText = `"${story.waves[story.waveIndex].phrase}"`;
    game.warRoom.setTowers();
    game.input.stop()
    setTimeout(() => game.input.start(), 500);
  }

  public end(game: Game) {
    this.banner.className = "hidden";
    this.reset();
    game.input.stop();
    game.warRoom.setTowers();
  }
}

export class PlayState extends State {
  public time = 0;
  public attackIndex = 0;
  public attack = story.waves[story.waveIndex].attacks[0];
  public fightOver = false;
  public win = false;

  constructor() {
    super(PLAY_STATE);
  }

  public getNextStateName(game: Game): string {
    return this.win || game.royalty.isRemovable ? GAME_OVER_STATE : ROYALTY_SPEAKS_STATE;
  }

  public isDone(game: Game): boolean {
    return this.fightOver || game.royalty.isRemovable;
  }

  public reset() {
    this.fightOver = false;
    this.attackIndex = 0;
    this.attack = story.waves[story.waveIndex].attacks[0]
    this.win = false;
  }

  public update(dt: number, game: Game) {
    this.time += dt;

    if (this.time > this.attack[1]) {
      this.time = 0;
      game.spawnWave(this.attack[0]);
      this.attackIndex++;

      if (this.attackIndex >= story.waves[story.waveIndex].attacks.length) {
        this.attackIndex = 0;
        this.fightOver = true;
        story.waveIndex++;

        if (story.waveIndex >= story.waves.length) {
          story.waveIndex = 0;
          this.win = true;
        }
      }

      this.attack = story.waves[story.waveIndex].attacks[this.attackIndex];
    }
  }

  public start(game: Game) {
    const { fightPos } = story;
    game.camera.angle = fightPos.angle;
    game.camera.distance = fightPos.distance;
    game.camera.horizon = fightPos.horizon;
    game.camera.position.x = fightPos.position.x;
    game.camera.position.y = fightPos.position.y;
    game.camera.position.z = fightPos.position.z;

    game.warRoom.show();
    // game.input.start();
  }

  public end(game: Game) {
    game.warRoom.hide();
    this.reset();
    game.input.stop();
  }
}

export class GameOverState extends State {
  public time = 0;

  constructor() {
    super(GAME_OVER_STATE);
  }

  public getNextStateName(game: Game): string {
    return INTRO_STATE;
  }

  public isDone(game: Game): boolean {
    return this.time < 5000;
  }

  public reset() {

  }

  public update(dt: number, game: Game) {
    this.time += dt;
  }

  public start(game: Game) {
    getElementById("banner-end").className = "";
  }

  public end() {
    getElementById("banner-end").className = "hidden";
  }
}

export class WinState extends State {
  constructor() {
    super(WIN_STATE);
  }

  public getNextStateName(game: Game): string {
    return INTRO_STATE;
  }

  public isDone(game: Game): boolean {
    return false;
  }

  public reset() {

  }

  public update(dt: number, game: Game) {

  }
}
