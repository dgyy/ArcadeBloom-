import { vec2, EngineObject, gravity, getTimeSpeedScale, Sound, timeDelta } from './littlejs';

import { parseSvg } from './parseSvg';

import { makeSvgPathCommandsAbsolute } from './makeSvgPathCommandsAbsolute';
import { Cmd } from './types/Cmd';
import { translateCoordinates } from './translateCoordinates';
import { IntersectionPoint } from './types/IntersectionPoint';
import { createNewSvgs } from './createNewSvgs';
import { splitCubicCurve } from './splitCubicCurve';
import { splitSvgInTwo } from './splitSvgInTwo';
import { assignIdsToCmds } from './assignIdsToCmds';
import { rotateCoordinates } from './rotateCoordinates';
import { emit } from './gameEvents';
import { scaleCoordinates } from './scaleCoodinates';
import { ColorToSliceType } from './ColorToSliceType';
import { getSliceSfx } from './music';
import { GameObjectType } from './GameObjectType';

export class MySvg extends EngineObject {
  public path: string;
  public fill: string | CanvasGradient;
  public pos: vec2;
  public velocity: vec2;
  public size: vec2;
  public cmds: Cmd[];
  public current2DPath: { path?: string; path2D?: Path2D } = {};
  public intersectionPoints: IntersectionPoint[] = [];
  public children: MySvg[] = [];
  public sliceColor: ColorToSliceType | null = null;
  public gameObjectType: GameObjectType = '';
  public killedTime = 0; //

  private sliceSound: Sound;
  private centerPos: vec2 = vec2(0, 0);
  private gravitationScale: number = 1;
  // TODO constructor override if we want to use cmd instead of path?
  constructor(
    path: string,
    cmds: Cmd[],
    sliceColor: ColorToSliceType,
    fill: string | CanvasGradient,
    pos: vec2 = vec2(0, 0),
    velocity: vec2 = vec2(0, 0),
    size: vec2 = vec2(1, 1),
    gravitationScale = 1
  ) {
    super(pos, size);
    this.size = size;
    this.pos = pos;
    this.path = path;
    this.sliceColor = sliceColor;
    this.fill = fill;
    this.velocity = velocity;
    this.gravitationScale = gravitationScale;
    this.centerPos = pos.copy();
    // const randomSliceSfx = sliceSfxs[Math.floor(Math.random() * sliceSfxs.length)];
    this.sliceSound = new Sound(getSliceSfx(), 0);
    if (this.path) {
      this.cmds = parseSvg(path);
      makeSvgPathCommandsAbsolute(this.cmds); // Note: mutates the commands in place!
      translateCoordinates(this.cmds, this.pos); // move the svg according to position
    } else if (cmds) {
      this.cmds = [...cmds];
    }
    assignIdsToCmds(this.cmds);
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }

  setGameObjectType(gameObjectType: GameObjectType) {
    this.gameObjectType = gameObjectType;
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

  rotateSvg(angle: number, centerPoint = vec2(0, 0)) {
    rotateCoordinates(this.cmds, angle, centerPoint);
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }
  translateSvg(distance: vec2) {
    const transCoord = distance.copy().add(this.pos);
    this.centerPos.x = transCoord.x;
    this.centerPos.y = transCoord.y;
    translateCoordinates(this.cmds, transCoord);
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }
  setPos(pos: vec2) {
    const diff = pos.copy().subtract(this.pos);
    translateCoordinates(this.cmds, diff);
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    // this.centerPos.x = this.pos.x;
    // this.centerPos.y = this.pos.y;
  }
  getCenterPos() {
    const centerX = this.centerPos.x + this.pos.x;
    const centerY = this.centerPos.y + this.pos.y;
    return vec2(centerX, centerY);
  }

  update(addedVelocity = vec2(0, 0)) {
    if (this.isCut()) {
      this.killedTime += timeDelta;
      return;
    }
    const prevPos = vec2(this.pos.x, this.pos.y);
    this.velocity.y += gravity * this.gravitationScale * getTimeSpeedScale();
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
    this.pos.y += addedVelocity.y;
    this.pos.x += addedVelocity.x;

    translateCoordinates(this.cmds, prevPos.subtract(this.pos));
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }
  render(ctx) {
    if (!ctx) return;
    // this.debugIntersectionPoints(ctx);
    if (this.children.length) {
      this.children.forEach((svg) => svg.render(ctx));
      return;
    }

    // this.debugCenterPoint(ctx);
    ctx.save();
    ctx.lineWidth = 5;
    ctx.beginPath(); // Start a new path
    ctx.fillStyle = this.fill || 'blue';
    // Only for debugging:
    // this.cmds.forEach((c) => {
    //   if (!c) return;
    //   switch (c.code) {
    //     case 'M':
    //       ctx.moveTo(c.x, c.y);
    //       break;
    //     case 'Z':
    //       ctx.lineTo(c.x, c.y);
    //       break;
    //     case 'C':
    //       const { x0, y0, x1, y1, x2, y2, x, y } = c;
    //       if (c.isIntersectionPoint) {
    //         ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
    //         ctx.moveTo(x0, y0);
    //         ctx.arc(x0, y0, 2, 0, 2 * Math.PI); // startpoint
    //         ctx.moveTo(x1, y1);
    //         // ctx.arc(x1, y1, 2, 0, 2 * Math.PI); // controlpoint 1
    //         ctx.moveTo(x2, y2);
    //         // ctx.arc(x2, y2, 2, 0, 2 * Math.PI); // controlpoint 2
    //         ctx.moveTo(x, y);
    //         ctx.arc(x, y, 2, 0, 2 * Math.PI);
    //       }
    //       break;
    //   }
    //   if (c.command == 'closepath') {
    //     ctx.closePath();
    //   }
    // });

    ctx.fill(this.current2DPath.path2D);
    ctx.restore();
  }

  debugIntersectionPoints(ctx) {
    ctx.save();
    ctx.fillStyle = 'green';
    this.getIntersectionPoints().forEach(({ intersectionPoint }) => {
      const x = intersectionPoint.x;
      const y = intersectionPoint.y;
      ctx.moveTo(x, y);
      ctx.arc(x, y, 5, 0, 2 * Math.PI); // startpoint
      ctx.fill();
    });
    ctx.restore();
  }

  addCmds(start, deleteCount, cmds: Cmd[]) {
    translateCoordinates(cmds, this.pos);
    this.cmds.splice(start, deleteCount, ...cmds);
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }

  getIntersectionPoints() {
    return this.intersectionPoints;
  }

  addIntersectionPoint(intersectionPoint: IntersectionPoint) {
    this.intersectionPoints.push(intersectionPoint);
    if (this.intersectionPoints.length == 1) {
      const newSvg1 = new MySvg(
        null,
        this.cmds,
        this.sliceColor,
        'yellow',
        this.pos.copy(),
        this.velocity.copy(),
        this.size.copy(),
        this.gravitationScale
      ); // create a copy to manage the intersection
      // add the intersection point to the existing SVG, splitting the curve
      const p = this.intersectionPoints[0];
      let cmdIndex = -1;
      const cmd: Cmd = this.cmds.find((cmd, index) => {
        cmdIndex = index;
        return cmd.id == p.id;
      });
      if (!cmd) return;
      if (cmd.code == 'C') {
        const newCurves2 = splitCubicCurve(cmd, p.intersectionPoint);
        newCurves2[1].isIntersectionPoint = true;

        translateCoordinates(newCurves2, newSvg1.pos.copy().multiply(vec2(-1, -1))); // translate the coordinates back to origin.
        newSvg1.addCmds(cmdIndex, 1, newCurves2);
        this.setCmds(newSvg1.cmds);
      }
    }

    if (this.intersectionPoints.length == 2) {
      // create new svgs if the object has more than 1 cut
      // TODO make one cut on the existing SVG instead of checking intersection points. If the svg has two cuts, split it
      const newSvgs = createNewSvgs(this, this.intersectionPoints[1]);
      if (newSvgs && newSvgs.length && !this.children.length) {
        splitSvgInTwo(newSvgs);

        newSvgs.forEach((svg) => {
          this.children.push(svg);
        });
        this.sliceSound.play();
        emit('split', { svg: this, intersectionPoint: this.intersectionPoints[1].intersectionPoint });
      }
    }
  }

  getCmdsAsPathString(): string {
    let res = '';
    this.cmds.forEach((cmd) => {
      switch (cmd.code) {
        case 'M':
          res += `M${cmd.x},${cmd.y}`;
          break;
        case 'C':
          // res += `C146.847,3.02 163.476,37.537 168.534,79.245`
          res += `C${cmd.x1},${cmd.y1} ${cmd.x2},${cmd.y2} ${cmd.x},${cmd.y}`;
          break;
        case 'Z':
          res += 'Z';
          break;
      }
    });
    return res;
  }

  setGravityScale(scale: number) {
    this.gravitationScale = scale;
  }

  getGravityScale() {
    return this.gravitationScale;
  }

  setCmds(cmds: Cmd[]) {
    this.cmds = cmds;
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }

  isCut() {
    return this.children.length > 0;
  }

  setScale(scale: number | vec2) {
    if (scale && !scale.x) scale = vec2(scale, scale);
    scaleCoordinates(this.cmds, scale);
    this.current2DPath.path2D = new Path2D(this.getCmdsAsPathString());
    this.current2DPath.path = this.getCmdsAsPathString();
  }

  addChild(svg: MySvg) {
    this.children.push(svg);
  }
}
