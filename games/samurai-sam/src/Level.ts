import { vec2, canvasFixedSize, Music, timeDelta, rand } from './littlejs';

import { Arrow } from './Arrow';
import { Lantern } from './Lantern';
import { MySvg } from './MySvg';
import { ColorToSliceType } from './ColorToSliceType';
import { blue, red } from './colors';
import { smoothstep } from './smoothstep';
import { emit, on } from './gameEvents';
import { getColorFromSliceColor } from './colorUtils';
import { bambooPath, mongolHemlMainPath, mongolHemlTopPath } from './svgPaths';
import { handleSvgCollisions } from './handleSvgCollisions';
import { SceneManager } from './SceneManager';
import { addScore, setCurrentScore } from './scoreUtils';

export class Level {
  arrows: Arrow[] = [];
  lanterns: Lantern[] = [];
  bamboos: MySvg[] = [];
  music: Music;
  ellapsedPlayTime = 0;
  bpm = 120;
  bps = this.bpm / 60;
  currentColorToSlice: ColorToSliceType = 'r';
  nextColorToSlice: ColorToSliceType = 'b';
  maxColorSize = 6;
  currentWave = 0;
  sliceColorMaxLifeTime = 7; // how long the current slice color is active
  currentSliceColorEllapseTime = 0;
  waveDuration = 7;
  currentWaveEllapseTime = 0;
  helm: MySvg;
  helmTop: MySvg;

  constructor(private sceneManager: SceneManager) {
    this.music = sceneManager.levelMusic;
    on('split', this.onSplit);
    on('wave', this.onNewWave);
  }

  createHelm(sliceColor: ColorToSliceType) {
    const randomDirection = Math.random() * 300;
    const speed = vec2(rand(0.5, 1.5) * -1, 0);
    let helmX = -350;
    if (randomDirection >= 150) {
      helmX = canvasFixedSize.x + 350;
      speed.x *= -1;
    }

    const helmY = rand(canvasFixedSize.y / 2 + 300, canvasFixedSize.y / 2 - 300);

    this.helm = new MySvg(
      mongolHemlMainPath,
      null,
      sliceColor,
      getColorFromSliceColor(sliceColor),
      vec2(helmX, helmY),
      speed,
      vec2(0, 0),
      0
    );
    this.helmTop = new MySvg(
      mongolHemlTopPath,
      null,
      sliceColor,
      getColorFromSliceColor(sliceColor),
      vec2(helmX + 50, helmY - 40),
      speed,
      vec2(0, 0),
      0
    );
    this.helm.gameObjectType = 'h';
    this.helmTop.gameObjectType = 'ht';
  }
  onSplit = (evt) => {
    if (this.sceneManager.currentScene != 'l') return;
    const other = evt.detail.data.svg;
    const point = evt.detail.data.intersectionPoint;
    const slicedColor = other.sliceColor;
    if (!slicedColor) {
      addScore(other, point);
      return; // slicing is OK regardless of sliceColor
    }
    if (slicedColor == this.currentColorToSlice) {
      addScore(other, point);
    } else {
      emit('killed', { msg: 'Sam, you cut the wrong color' });
    }
  };
  update() {
    this.arrows.forEach((s) => s.update());
    this.lanterns.forEach((s) => s.update());
    this.bamboos.forEach((s) => {
      s.update();
      handleSvgCollisions(s);
    });
    this.ellapsedPlayTime += timeDelta;
    if (this.helm) {
      this.helm.update();
      handleSvgCollisions(this.helm);
    }
    if (this.helmTop) {
      this.helmTop.update();
      handleSvgCollisions(this.helmTop);
    }

    this.updateColorToSlice();
    this.handleWaves();
  }
  render(ctx) {
    this.arrows.forEach((s) => s.render(ctx));
    this.lanterns.forEach((s) => s.render(ctx));
    this.bamboos.forEach((s) => s.render(ctx));

    if (this.helm) this.helm.render(ctx);
    if (this.helmTop) this.helmTop.render(ctx);

    this.renderTutorial(ctx);

    this.animateColorsToSliceBar(ctx);
  }

  updateColorToSlice() {
    if (this.ellapsedPlayTime == 0) return;

    this.currentSliceColorEllapseTime += timeDelta;
    if (this.currentSliceColorEllapseTime >= this.sliceColorMaxLifeTime) {
      this.currentSliceColorEllapseTime = 0;
      this.currentColorToSlice = this.nextColorToSlice;
      this.nextColorToSlice = this.getRandomSliceColor();
      emit('toslice', { colorToSlice: this.currentColorToSlice });
    }
  }

  handleWaves() {
    this.currentWaveEllapseTime += timeDelta;
    if (this.currentWaveEllapseTime >= this.waveDuration) {
      this.currentWaveEllapseTime = 0;
      emit('wave', { wave: ++this.currentWave });
    }
  }
  animateColorsToSliceBar(ctx) {
    // middle color
    ctx.beginPath();
    ctx.fillStyle = getColorFromSliceColor(this.currentColorToSlice);
    let centerPos = vec2(canvasFixedSize.x / 2, 50);
    const radius = smoothstep(10, 5, 0.5 + Math.sin(this.ellapsedPlayTime * 3) / 2);
    let outerRadius = 6;
    let innerRadius = 0;
    ctx.moveTo(centerPos.x, centerPos.y);
    ctx.arc(centerPos.x, centerPos.y, outerRadius + radius, 0, Math.PI * 2, false); // outer (filled)
    ctx.arc(centerPos.x, centerPos.y, innerRadius, 0, Math.PI * 2, true); // outer (unfills it)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    // animate next color coming
    ctx.beginPath();
    ctx.fillStyle = getColorFromSliceColor(this.nextColorToSlice);
    const distance = this.currentSliceColorEllapseTime;
    const travelled = smoothstep(0, canvasFixedSize.x / 2, distance / this.sliceColorMaxLifeTime);
    centerPos = vec2(canvasFixedSize.x - travelled, 50);
    outerRadius = 1;
    innerRadius = radius / 1.5;
    ctx.moveTo(centerPos.x, centerPos.y);
    ctx.arc(centerPos.x, centerPos.y, outerRadius + radius, 0, Math.PI * 2, false); // outer (filled)
    ctx.arc(centerPos.x, centerPos.y, innerRadius, 0, Math.PI * 2, true); // outer (unfills it)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  renderColorToScliceCircle(ctx, color: ColorToSliceType, centerPos: vec2, isFirstCircle = false) {
    ctx.save();
    switch (color) {
      case 'r':
        ctx.fillStyle = red;
        break;
      case 'b':
        ctx.fillStyle = blue;
        break;
    }

    ctx.beginPath();
    const radius = smoothstep(10, 5, 0.5 + Math.sin(this.ellapsedPlayTime * 3) / 2);
    const outerRadius = isFirstCircle ? 6 : 1;
    const innerRadius = isFirstCircle ? 0 : radius / 1.5;
    ctx.moveTo(centerPos.x, centerPos.y);
    ctx.arc(centerPos.x, centerPos.y, outerRadius + radius, 0, Math.PI * 2, false); // outer (filled)
    ctx.arc(centerPos.x, centerPos.y, innerRadius, 0, Math.PI * 2, true); // outer (unfills it)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  start() {
    // Always start the first and second color with red and blue. Acts like a tutorial
    setCurrentScore(0);
    this.currentColorToSlice = 'r';
    this.nextColorToSlice = 'b';
    // reset
    this.lanterns.length = 0;
    this.bamboos.length = 0;
    this.arrows.length = 0;

    // start first wave
    for (let i = 0; i < 2; i++) {
      this.lanterns.push(new Lantern(vec2(i * 146, canvasFixedSize.y - 100), 'r'));
    }
    this.ellapsedPlayTime = 0;
    this.currentWave = 0;
    this.currentSliceColorEllapseTime = 0;
    this.currentWaveEllapseTime = 0;
    this.waveDuration = 7;
    this.sliceColorMaxLifeTime = 7;
    emit('toslice', { colorToSlice: this.currentColorToSlice });
    this.music.stop();
    this.music.play();
  }

  getRandomSliceColor() {
    const randomNum = Math.floor(Math.random() * 2);
    switch (randomNum) {
      case 0:
        return 'r';
      case 1:
        return 'b';
      default:
        return 'r';
    }
  }

  onNewWave = (_evt) => {
    this.removeUnusedObjects();
    if (this.sceneManager.currentScene != 'l') return;
    if (this.currentWave == 1) {
      for (let i = 0; i < 2; i++) {
        this.lanterns.push(new Lantern(vec2(600 + i * 146, canvasFixedSize.y + 200), 'b', vec2(-1, 0)));
      }
    }
    if (this.currentWave == 2) {
      this.arrows.push(new Arrow(vec2(canvasFixedSize.x / 2, -300), vec2(0, -1)));
    }
    if (this.currentWave == 3 || this.currentWave == 4) {
      for (let i = 0; i < 2; i++) {
        const sliceColor = i ? 'r' : 'b';
        let x = 70 + Math.random() * (canvasFixedSize.x / 2 - 140);
        if (i) x = 70 + canvasFixedSize.x / 2 + Math.random() * (canvasFixedSize.x / 2 - 200);
        const bamboo = new MySvg(bambooPath, null, sliceColor, getColorFromSliceColor(sliceColor));
        bamboo.setScale(2);
        bamboo.translateSvg(vec2(x, -300));
        this.bamboos.push(bamboo);
      }
    }
    // Add arrows for every 5 wave
    if (this.currentWave % 5 == 0) {
      let speed = Math.max(-3.5, (this.currentWave / 5) * -1);
      for (let i = 0; i < 3; i++) {
        const x = 200 + i * 210 + Math.random() * 70;
        const y = -300 + i * (Math.random() * 20);
        this.arrows.push(new Arrow(vec2(x, y), vec2(0, speed)));
      }
    }
    if (this.currentWave == 6) {
      this.spawnLanterns();
      this.spawnBamboos();
      this.waveDuration = 6;
    }
    if (this.currentWave >= 7) {
      this.waveDuration = 5;
      if (this.currentWave % 2 == 0) {
        const sliceColor = this.getRandomSliceColor();
        let x = 70 + Math.random() * (canvasFixedSize.x - 200);
        const bamboo = new MySvg(bambooPath, null, sliceColor, getColorFromSliceColor(sliceColor));
        bamboo.setScale(2);
        bamboo.translateSvg(vec2(x, -200));
        this.bamboos.push(bamboo);
      }
      if (this.currentWave % 3 == 0) {
        this.spawnLanterns();
        this.createHelm(this.currentColorToSlice);
      }
      if ((this.currentWave + 1) % 4 == 0) {
        if (this.currentWave >= 15) {
          this.spawnBamboos(5);
        } else {
          this.spawnBamboos(4);
        }
      }
    }
    if (this.currentWave == 15) {
      this.sliceColorMaxLifeTime = 4;
    }
    if (this.currentWave == 25) {
      this.sliceColorMaxLifeTime = 3;
    }
    if (this.currentWave == 35) {
      this.sliceColorMaxLifeTime = 2;
    }
    if (this.currentWave == 50) {
      this.sliceColorMaxLifeTime = 1.5;
    }
    if (this.currentWave == 75) {
      this.sliceColorMaxLifeTime = 1;
    }
  };

  spawnBamboos(num = 4) {
    for (let i = 0; i < num; i++) {
      let sliceColor = this.getRandomSliceColor();
      setTimeout(
        (sliceColor) => {
          let x = 70 + i * 150 + Math.random() * 50;
          const bamboo = new MySvg(bambooPath, null, sliceColor, getColorFromSliceColor(sliceColor));
          bamboo.setScale(1.25);
          bamboo.translateSvg(vec2(x, -200));
          this.bamboos.push(bamboo);
        },
        i * 100,
        sliceColor
      );
    }
  }

  spawnLanterns() {
    for (let i = 0; i < 4; i++) {
      const lantern = new Lantern(vec2(50 + i * 220, canvasFixedSize.y), this.getRandomSliceColor());
      if (lantern.centerPos.x >= canvasFixedSize.x / 2 + 200) {
        lantern.velocity = vec2(rand(0.2, 1) * -1, rand(0, 0.2));
      } else {
        lantern.velocity = vec2(rand(0.2, 1), rand(0, 0.2));
      }
      lantern.shouldRotate = true;
      this.lanterns.push(lantern);
    }
  }

  removeUnusedObjects() {
    for (let i = this.bamboos.length - 1; i >= 0; i--) {
      const svg = this.bamboos[i];
      if (Math.abs(svg.pos.y) > canvasFixedSize.y + 1000 || (svg.isCut() && svg.killedTime >= 5)) {
        this.bamboos.splice(i, 1);
      }
    }
    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const lantern = this.lanterns[i];
      if (
        Math.abs(lantern.getCenterPos().y) >= canvasFixedSize.y + 1000 ||
        (lantern.isCut() && lantern.killedTime >= 5)
      ) {
        this.lanterns.splice(i, 1);
      }
    }
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      const arrow = this.arrows[i];
      if (Math.abs(arrow.getPos().y) > canvasFixedSize.y + 1000 || (arrow.isCut() && arrow.killedTime >= 5)) {
        this.arrows.splice(i, 1);
      }
    }
    if (this.helm && (Math.abs(this.helm.pos.x) > canvasFixedSize.x + 2000 || this.helm.killedTime >= 5)) {
      this.helm = null;
    }
    if (this.helmTop && (Math.abs(this.helmTop.pos.x) > canvasFixedSize.x + 2000 || this.helmTop.killedTime >= 5)) {
      this.helmTop = null;
    }
  }

  renderTutorial(ctx) {
    ctx.save();
    ctx.font = `${28}px serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.moveTo(canvasFixedSize.x / 2, 350);
    ctx.lineTo(canvasFixedSize.x / 2, 75);
    ctx.moveTo(canvasFixedSize.x / 2, 75);
    ctx.lineTo(canvasFixedSize.x / 2 + 10, 90);
    ctx.moveTo(canvasFixedSize.x / 2, 75);
    ctx.lineTo(canvasFixedSize.x / 2 - 10, 90);
    const sameColorTxt = 'Only slice same color';
    if (this.currentWave == 0) {
      ctx.fillText(`${sameColorTxt} (now red)`, canvasFixedSize.x / 2, 400);
      ctx.strokeStyle = red;
      ctx.stroke();
    } else if (this.currentWave == 1) {
      ctx.fillText(`${sameColorTxt} (now blue)`, canvasFixedSize.x / 2, 400);
      ctx.strokeStyle = blue;
      ctx.stroke();
    } else if (this.currentWave == 2) {
      ctx.fillText('WARNING. Slice arrow or die', canvasFixedSize.x / 2, 400);
    }
    ctx.restore();
  }
}
