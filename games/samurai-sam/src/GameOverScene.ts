import { canvasFixedSize, vec2 } from './littlejs';

import { SceneManager } from './SceneManager';
import { MySvg } from './MySvg';
import { bambooPath } from './svgPaths';
import { red } from './colors';
import { handleSvgCollisions } from './handleSvgCollisions';
import { emit, on } from './gameEvents';
import { createPlayButton, createWeb3Button } from './bambooFont';
import { getStoredHighscore } from './scoreUtils';

export class GameOverScene {
  cross: MySvg[] = [];
  playButton: MySvg[] = [];
  web3Button: MySvg[] = [];
  isEventInProgress = false;
  killedMsg = '';
  constructor(private sceneManager: SceneManager) {
    on('split', this.onSplit);
    on('killed', this.onKilled);
  }
  onKilled = (evt) => {
    const msg = evt.detail.data.msg;
    this.killedMsg = msg;
  };
  onSplit = (evt) => {
    if (this.sceneManager.currentScene != 'g') return;
    const other = evt.detail.data.svg;
    this.playButton.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        this.isEventInProgress = true;
        emit('play');
      }
    });
    this.web3Button.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        this.isEventInProgress = true;
        emit('web3');
      }
    });
  };
  update() {
    this.cross.forEach((svg) => {
      svg.update();
      handleSvgCollisions(svg, 2);
    });
    this.playButton.forEach((svg) => {
      svg.update();
      handleSvgCollisions(svg, 1);
    });
    this.web3Button.forEach((svg) => {
      svg.update();
      handleSvgCollisions(svg, 1);
    });
  }
  render(ctx) {
    ctx.save();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    this.cross.forEach((svg) => svg.render(ctx));
    this.playButton.forEach((svg) => svg.render(ctx));
    this.web3Button.forEach((svg) => svg.render(ctx));
    this.renderHighScore(ctx);
    this.renderKilledMsg(ctx);
    ctx.restore();
  }

  renderKilledMsg(ctx) {
    ctx.font = `${28}px serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(this.killedMsg, canvasFixedSize.x / 2, 400);
  }
  renderHighScore(ctx) {
    const score = getStoredHighscore();
    ctx.font = `${32}px serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`Highscore: ${score}`, canvasFixedSize.x / 2, 200);
  }
  start() {
    this.isEventInProgress = false;
    this.playButton.length = 0;
    this.web3Button.length = 0;
    this.cross.length = 0;
    const bamboo1 = new MySvg(bambooPath, null, null, red);
    const bamboo2 = new MySvg(bambooPath, null, null, red);
    bamboo1.setGravityScale(0);
    bamboo2.setGravityScale(0);
    for (let i = 0; i < 8; i++) {
      bamboo1.rotateSvg(5);
      bamboo2.rotateSvg(-5);
    }
    bamboo1.translateSvg(vec2(80, -15));

    this.cross.push(bamboo1, bamboo2);
    this.cross.forEach((svg) => svg.translateSvg(vec2(canvasFixedSize.x / 2 - 40, 50)));
    this.playButton = createPlayButton();
    this.web3Button = createWeb3Button();
  }
}
