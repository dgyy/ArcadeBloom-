import { vec2, timeDelta, Music, canvasFixedSize } from './littlejs';

import { MySvg } from './MySvg';
import { handleSvgCollisions } from './handleSvgCollisions';
import { tweenRot } from './tween';
import { emit, on } from './gameEvents';
import { createA, createM, createPlayButton, createS, createWeb3Button } from './bambooFont';
import { SceneManager } from './SceneManager';
import { smoothstep } from './smoothstep';

export class MainMenu {
  letters: MySvg[] = [];
  playButton: MySvg[] = [];
  web3Button: MySvg[] = [];
  ellapsedTime = 0;
  music: Music;
  isChangingScene = false;
  hasInteracted = false;
  constructor(private sceneManager: SceneManager) {
    this.createTitle();
    this.playButton = createPlayButton();
    this.web3Button = createWeb3Button();
    this.music = this.sceneManager.mainMenuMusic;

    on('split', this.onSplit);
    this.listenForInteractive();
  }
  listenForInteractive() {
    const onInteractive = () => {
      if (this.hasInteracted) return;
      this.hasInteracted = true;
    };
    document.addEventListener('touchstart', onInteractive);
    document.addEventListener('mousedown', onInteractive);
  }

  createTitle() {
    const startOffset: vec2 = vec2(62, 0);
    const sSvgs = createS(startOffset);
    const aSvgs = createA(startOffset);
    const mSvgs = createM(startOffset);

    this.letters.push(...sSvgs);
    this.letters.push(...aSvgs);
    this.letters.push(...mSvgs);

    this.letters.forEach((s) => s.setGravityScale(0));
    tweenRot(this.letters, -0.1, 0.1, 2, true);
  }

  onSplit = (evt: CustomEvent) => {
    if (this.sceneManager.currentScene != 'm') return;
    const other = evt.detail.data.svg;
    this.playButton.forEach((svg) => {
      if (svg == other) {
        this.isChangingScene = true;
        this.music.stop();
        emit('play');
      }
    });
    this.web3Button.forEach((svg) => {
      if (svg == other) {
        this.isChangingScene = true;
        this.music.stop();
        emit('web3');
      }
    });
  };

  update() {
    // if (!this.music.isPlaying() && !this.isChangingScene) this.music.play();
    this.ellapsedTime += timeDelta;
    this.letters.forEach((s) => handleSvgCollisions(s));
    this.playButton.forEach((s) => handleSvgCollisions(s, 1));
    this.web3Button.forEach((s) => handleSvgCollisions(s, 1));
  }

  render(ctx) {
    ctx.save();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    this.letters.forEach((l) => l.render(ctx));
    this.playButton.forEach((s) => s.render(ctx));
    this.web3Button.forEach((s) => s.render(ctx));
    ctx.restore();

    this.renderSliceHelp(ctx);
  }

  helpEllapsedTime = 0;
  helpDuration = 1;
  renderSliceHelp(ctx) {
    if (!this.hasInteracted) return;
    this.helpEllapsedTime = (this.helpEllapsedTime + timeDelta) % (this.helpDuration * 2);
    if (this.helpEllapsedTime >= 1.1) return;
    const startPos = vec2(canvasFixedSize.x / 2 - 150, 800);
    const endPos = vec2(canvasFixedSize.x / 2 + 150, 700);
    const x = smoothstep(startPos.x, endPos.x, this.helpEllapsedTime / this.helpDuration);
    const y = smoothstep(startPos.y, endPos.y, this.helpEllapsedTime / this.helpDuration);
    ctx.save();
    ctx.font = '42px serif';
    ctx.shadowColor = 'black';
    ctx.fillText('👆', x, y);
    ctx.restore();
  }
}
