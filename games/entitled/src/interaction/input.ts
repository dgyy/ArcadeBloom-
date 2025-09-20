import { Camera } from "../view/camera";
import { Vec3 } from "../core/vec3";

const setMousePosition = (e: MouseEvent, v: Vec3) => {
  // For Chrome
  if (e.type.startsWith('touch')) {
    // @ts-ignore it is a fix for touch screen too
    v.x = e.targetTouches[0].pageX;
    // @ts-ignore it is a fix for touch screen too
    v.y = e.targetTouches[0].pageY;
  } else {
    v.x = e.pageX;
    v.y = e.pageY;
  }
};

export class Input {
  public forwardbackward: number = 0;
  public leftright: number = 0;
  public updown: number = 0;
  public lookup: boolean = false;
  public lookdown: boolean = false;
  public startPosition = new Vec3();
  public position = new Vec3();
  public mouseDown = false;
  public keypressed: boolean = false;
  public camera: Camera;
  public isDisabled = true;

  constructor(camera: Camera) {
    this.camera = camera;
  }

  onMouseDown = (e: MouseEvent) => {
    if (this.isDisabled) {
      return;
    }
    // e.preventDefault();

    this.forwardbackward = 3.;
    this.mouseDown = true;

    setMousePosition(e, this.startPosition);
    setMousePosition(e, this.position);

    return false;
  }

  onMouseUp = () => {
    if (this.isDisabled) {
      return;
    }
    this.mouseDown = false;
    this.forwardbackward = 0;
    this.leftright = 0;
    this.updown = 0;

    return false;
  }

  onMouseMove = (e: MouseEvent) => {
    if (this.isDisabled) {
      return;
    }
    e.preventDefault();
    setMousePosition(e, this.position);

    if (!this.mouseDown || this.forwardbackward == 0) {
      return;
    }

    const { x, y } = this.position;

    this.leftright = (this.startPosition[0] - x) / window.innerWidth * 2;
    this.camera.horizon = 100 + (this.startPosition[1] - y) / window.innerHeight * 500;
    this.updown = (this.startPosition[1] - y) / window.innerHeight * 10;

    return false;
  }

  onKeysDown = (e: KeyboardEvent) => {
    if (this.isDisabled) {
      return;
    }

    switch (e.keyCode) {
      case 37:    // left cursor
      case 65:    // a
        this.leftright = +1.;
        break;
      case 39:    // right cursor
      case 68:    // d
        this.leftright = -1.;
        break;
      case 38:    // cursor up
      case 87:    // w
        this.forwardbackward = 3.;
        break;
      case 40:    // cursor down
      case 83:    // s
        this.forwardbackward = -3.;
        break;
      case 82:    // r
        this.updown = +2.;
        break;
      case 70:    // f
        this.updown = -2.;
        break;
      case 69:    // e
        this.lookup = true;
        break;
      case 81:    //q
        this.lookdown = true;
        break;
      default:
        return;
    }

    return false;
  }

  onKeysUp = (e: KeyboardEvent) => {
    if (this.isDisabled) {
      return;
    }

    switch (e.keyCode) {
      case 37:    // left cursor
      case 65:    // a
        this.leftright = 0;
        break;
      case 39:    // right cursor
      case 68:    // d
        this.leftright = 0;
        break;
      case 38:    // cursor up
      case 87:    // w
        this.forwardbackward = 0;
        break;
      case 40:    // cursor down
      case 83:    // s
        this.forwardbackward = 0;
        break;
      case 82:    // r
        this.updown = 0;
        break;
      case 70:    // f
        this.updown = 0;
        break;
      case 69:    // e
        this.lookup = false;
        break;
      case 81:    //q
        this.lookdown = false;
        break;
      default:
        return;
    }
    return false;
  }

  start() {
    this.mouseDown = false;
    this.forwardbackward = 0;
    this.leftright = 0;
    this.updown = 0;
    this.isDisabled = false;
  }

  stop() {
    this.mouseDown = false;
    this.forwardbackward = 0;
    this.leftright = 0;
    this.updown = 0;
    this.isDisabled = true;
  }
}
