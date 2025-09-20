import { setTimeSpeedScale, timeDelta, overlayContext, canvasFixedSize, Sound, Music } from './littlejs';

import { GameOverScene } from './GameOverScene';
import { Level } from './Level';
import { MainMenu } from './MainMenu';
import { Web3Scene } from './Web3Scene';
import { off, on } from './gameEvents';
import { startSceneTransition } from './startSceneTransition';
import { killedSfx, menuSong, song } from './music';
import { Hud } from './Hud';
import { IntroScene } from './IntroScene';

type SceneType = 'm' | 'l' | 'w' | 'g' | 'i' | '';
export class SceneManager {
  currentScene: SceneType = 'i';
  mainMenu: MainMenu;
  level: Level;
  web3Scene: Web3Scene;
  gameOverScene: GameOverScene;
  introScene: IntroScene;
  hud: Hud;
  isChangingScenes = false;
  isOnKillProcedure = false;
  hasInteracted = false;
  killSound: Sound;
  mainMenuMusic: Music;
  levelMusic: Music;

  constructor() {
    this.killSound = new Sound(killedSfx);
    this.mainMenuMusic = new Music(menuSong);
    this.levelMusic = new Music(song);
    this.mainMenuMusic.loop = true;
    this.levelMusic.loop = true;
    this.introScene = new IntroScene();
    this.listenForInteractive();
    on('play', this.onPlay);
    on('web3', this.onWeb3);
    on('killed', this.onKilled);
  }

  listenForInteractive() {
    const onInteractive = () => {
      if (this.hasInteracted) return;
      this.changeScene('m');
      this.mainMenuMusic.play();
      this.createScenes();
      this.hasInteracted = true;
    };
    document.addEventListener('touchstart', onInteractive);
    document.addEventListener('mousedown', onInteractive);
  }
  createScenes() {
    this.mainMenu = new MainMenu(this);
    this.level = new Level(this);
    this.web3Scene = new Web3Scene(this);
    this.gameOverScene = new GameOverScene(this);
    this.hud = new Hud();
  }

  changeScene(sceneType: SceneType) {
    this.isChangingScenes = true;
    // TODO (johnedvard) start an animation, and return a p
    const onMiddle = () => {
      this.currentScene = '';
    };
    const onEnded = () => {
      this.currentScene = sceneType;
      this.isChangingScenes = false;
      switch (sceneType) {
        case 'l':
          return this.level.start();
        case 'w':
          return this.web3Scene.start();
        case 'g':
          return this.gameOverScene.start();
      }
    };
    startSceneTransition(1.5, onMiddle, onEnded);
  }

  startOnKilledProcedure() {
    this.isOnKillProcedure = true;
    this.killSound.play();

    const maxTime = 1.5;
    let ellapsedTime = 0;
    const onTick = (_evt) => {
      ellapsedTime += timeDelta;
      if (ellapsedTime <= 1) {
        overlayContext.fillStyle = `rgba(200, 200, 200, ${Math.min(0.9, ellapsedTime)})`;
        overlayContext.moveTo(0, 0);
        overlayContext.fillRect(0, 0, canvasFixedSize.x, canvasFixedSize.y);
        setTimeSpeedScale(0.3);
      } else {
        overlayContext.fillStyle = `rgba(200, 200, 200, ${Math.max(0, 1.9 - ellapsedTime)})`;
        overlayContext.moveTo(0, 0);
        overlayContext.fillRect(0, 0, canvasFixedSize.x, canvasFixedSize.y);
        setTimeSpeedScale(Math.min(1, ellapsedTime - 0.8));
      }
      if (ellapsedTime >= 1 && !this.isChangingScenes) {
        this.changeScene('g');
      }
      if (ellapsedTime >= maxTime) {
        this.isOnKillProcedure = false;
        setTimeSpeedScale(1);
        off('tick', onTick);
      }
    };
    on('tick', onTick);
  }
  onKilled = (_customEvent: CustomEvent) => {
    if (this.isChangingScenes || this.isOnKillProcedure) return;
    this.startOnKilledProcedure();
  };

  onPlay = (_customEvent: CustomEvent) => {
    if (this.isChangingScenes) return;
    this.changeScene('l');
  };

  onWeb3 = (_customEvent: CustomEvent) => {
    if (this.isChangingScenes) return;
    this.changeScene('w');
  };

  update() {
    if (this.currentScene != '' && this.currentScene != 'm' && this.currentScene != 'w' && this.currentScene != 'i') {
      this.hud.update();
    }
    switch (this.currentScene) {
      case 'l':
        return this.level.update();
      case 'm':
        return this.mainMenu.update();
      case 'w':
        return this.web3Scene.update();
      case 'g':
        return this.gameOverScene.update();
      case 'i':
        return this.introScene.update();
    }
  }
  render(ctx) {
    if (this.currentScene != '' && this.currentScene != 'm' && this.currentScene != 'w' && this.currentScene != 'i') {
      this.hud.render();
    }
    switch (this.currentScene) {
      case 'l':
        return this.level.render(ctx);
      case 'm':
        return this.mainMenu.render(ctx);
      case 'w':
        return this.web3Scene.render(ctx);
      case 'g':
        return this.gameOverScene.render(ctx);
      case 'i':
        return this.introScene.render(ctx);
    }
  }
}
