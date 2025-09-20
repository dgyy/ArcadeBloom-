import { vec2, mainContext, canvasFixedSize, gravity, getTimeSpeedScale, timeDelta } from './littlejs';

import { MySvg } from './MySvg';
import { lanternBodyPath, lanternTipPath } from './svgPaths';
import { handleSvgCollisions } from './handleSvgCollisions';
import { ColorToSliceType } from './ColorToSliceType';
import { getColorFromSliceColor, getSecondaryColorFromSliceColor } from './colorUtils';

export class Lantern {
  svgBody: MySvg;
  svgTipTop: MySvg;
  svgTipBot: MySvg;
  gradient: CanvasGradient;
  centerPos: vec2 = vec2(0, 0);
  pos: vec2 = vec2(0, 0);
  velocity: vec2 = vec2(0, 0);
  gravitationScale = -1.4;
  sliceColor: ColorToSliceType;
  shouldRotate = false;
  killedTime = 0;
  constructor(
    startPos = vec2(0, canvasFixedSize.y),
    sliceColor: ColorToSliceType,
    velocity = vec2(1, 0),
    shouldRotate = false
  ) {
    this.shouldRotate = shouldRotate;
    this.sliceColor = sliceColor;
    this.svgBody = new MySvg(
      lanternBodyPath,
      null,
      sliceColor,
      getColorFromSliceColor(sliceColor),
      vec2(startPos.x, startPos.y),
      vec2(0, 0),
      vec2(39, 77)
    );
    this.svgBody.setGameObjectType('l');
    this.svgTipTop = new MySvg(
      lanternTipPath,
      null,
      null,
      'black',
      vec2(startPos.x + 9, startPos.y - 4),
      vec2(0, 0),
      vec2(20, 6)
    );
    this.svgTipBot = new MySvg(
      lanternTipPath,
      null,
      null,
      'black',
      vec2(startPos.x + 9, startPos.y + 74),
      vec2(0, 0),
      vec2(20, 6)
    );
    // The outer circle is at x=100, y=100, with radius=70

    this.centerPos = vec2(startPos.x + 19, startPos.y + 40); // make up for height and width as well
    this.velocity = velocity;
    this.getSvgs().forEach((svg) => {
      svg.setGravityScale(0);
    });
    this.pos = vec2(0, 0);
  }

  getSvgs() {
    return [this.svgBody, this.svgTipTop, this.svgTipBot];
  }

  isCut() {
    return this.svgBody.isCut();
  }

  update() {
    if (this.svgBody.isCut()) {
      this.killedTime += timeDelta;
      this.svgTipTop.setGravityScale(27);
      this.svgTipBot.setGravityScale(22);
      this.svgTipBot.rotateSvg(-0.1, this.svgTipBot.getCenterPos());
      this.svgTipTop.rotateSvg(0.1, this.svgTipTop.getCenterPos());
      this.svgBody.velocity.x = this.velocity.x;
      this.svgTipTop.velocity.x = this.velocity.x;
      this.svgTipBot.velocity.x = this.velocity.x;
      return;
    }
    const centerPos = this.getCenterPos();
    this.velocity.y -= gravity * this.gravitationScale * getTimeSpeedScale();
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
    this.getSvgs().forEach((svg) => {
      if (this.shouldRotate) {
        svg.rotateSvg(-1, vec2(centerPos.x, centerPos.y));
      }
      svg.update(vec2(-this.velocity.x, -this.velocity.y));
    });
    handleSvgCollisions(this.svgBody);
  }
  render(ctx) {
    ctx.save();
    ctx.shadowBlur = 0;
    this.getSvgs().forEach((svg) => svg.render(ctx));
    // const x = this.centerPos.x + this.pos.x;
    // const y = this.centerPos.y + this.pos.y;
    this.gradient = mainContext.createRadialGradient(
      canvasFixedSize.x / 2,
      canvasFixedSize.y / 2,
      0,
      -100,
      -100,
      canvasFixedSize.y
    );

    // Add three color stops
    this.gradient.addColorStop(0, getColorFromSliceColor(this.sliceColor));
    this.gradient.addColorStop(0.5, getSecondaryColorFromSliceColor(this.sliceColor));
    this.gradient.addColorStop(1, getColorFromSliceColor(this.sliceColor));
    this.svgBody.fill = this.gradient;
    ctx.restore();
    // this.debugCenterPoint(ctx);
  }
  debugCenterPoint(ctx) {
    ctx.save();
    ctx.fillStyle = 'green';

    const x = this.centerPos.x + this.pos.x;
    const y = this.centerPos.y + this.pos.y;
    ctx.moveTo(x, y);
    ctx.arc(x, y, 5, 0, 2 * Math.PI); // startpoint
    ctx.fill();

    ctx.restore();
  }
  getCenterPos(): vec2 {
    const centerX = this.centerPos.x + this.pos.x;
    const centerY = this.centerPos.y + this.pos.y;
    return vec2(centerX, centerY);
  }
}
