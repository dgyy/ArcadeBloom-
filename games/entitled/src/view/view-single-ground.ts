import { Camera } from "./camera";
import { Ground } from "../ground";
import { RED } from "../core/resources";
import { Input } from "../interaction/input";

const { floor } = Math;

export class ViewSingleGround {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public imagedata: ImageData;

  public bufarray: ArrayBuffer; // color data
  public buf8: Uint8Array; // the same array but with bytes
  public buf32: Uint32Array; // the same array but with 32-Bit words
  public hiddenYs: Int32Array;
  public bgColor = 0xFFE09090;

  public camera: Camera;
  public ground: Ground;
  public input: Input;

  constructor(
    canvas: HTMLCanvasElement,
    camera: Camera,
    ground: Ground,
    input: Input,
  ) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");

    if (context === null) {
      throw new Error('Could not load context 2d');
    }

    this.context = context;
    this.camera = camera;
    this.ground = ground;
    this.input = input;

    this.resize();
  }

  drawVerticalLine(x: number, yTop: number, yBottom: number, color: number, screenWidth: number) {
    x = x | 0;
    yTop = yTop | 0;
    yBottom = yBottom | 0;
    color = color | 0;
    const buf32 = this.buf32;
    if (yTop < 0) yTop = 0;
    if (yTop > yBottom) return;

    // get offset on screen for the vertical line
    let offset = ((yTop * screenWidth) + x) | 0;
    for (let k = yTop; k < yBottom; k++) {
      buf32[offset | 0] = color | 0;
      offset += screenWidth | 0;
    }
  }

  drawBackground() {
    this.buf32.fill(this.bgColor | 0);
  }

  // Show the back buffer on screen
  flip() {
    this.imagedata.data.set(this.buf8);
    this.context.putImageData(this.imagedata, 0, 0);
  }

  render() {
    const { hiddenYs, camera, ground, canvas, input } = this;
    const { units, unitsColor } = ground;
    const mapWidth = ground.width - 1;
    const mapHeight = ground.height - 1;
    const screenWidth = canvas.width | 0;
    const screenHeight = canvas.height | 0;
    const sinAngle = Math.sin(camera.angle);
    const cosAngle = Math.cos(camera.angle);
    // const inputX = input.position.x / screenWidth;
    // const inputY = input.position.y / screenHeight;
    hiddenYs.fill(canvas.height);
    // const ix = -cosAngle * inputX + sinAngle * inputY;
    // const iy = sinAngle * inputX + cosAngle * inputY;

    let deltaz = 1.;

    // Draw from front to back
    for (let z = 1; z < camera.distance; z += deltaz) {
      // 90 degree field of view

      let pLeftX = -cosAngle * z - sinAngle * z;
      let pLeftY = sinAngle * z - cosAngle * z;
      const pRightX = cosAngle * z - sinAngle * z;
      const pRightY = -sinAngle * z - cosAngle * z;

      const w = pRightX - pLeftX;
      const h = pRightY - pLeftY;

      // const iix = ix * w;
      // const iiy = iy * h;

      const dx = w / screenWidth;
      const dy = h / screenHeight;
      pLeftX += camera.position.x;
      pLeftY += camera.position.y;
      const invz = 1. / z * 240.;

      for (let i = 0; i < screenWidth; i++) {
        if (pLeftY < 0 || pLeftY >= 1024 || pLeftX < 0 || pLeftX >= 1024) {
          pLeftX += dx;
          pLeftY += dy;
          continue;
        }

        const mapOffset = ((floor(pLeftY) & mapWidth) << ground.shift) + (floor(pLeftX) & mapHeight) | 0;
        let heightOnScreen = (camera.position.z - ground.altitude[mapOffset]) * invz + camera.horizon | 0;
        let color = ground.color[mapOffset];

        // if (Math.abs(pLeftX - iix) < 10
        //   && Math.abs(pLeftY - iiy) < 10
        //   // && Math.abs(heightOnScreen - camera.position.z) < 10
        //   ) {
        //     color = RED;
        // }

        this.drawVerticalLine(
          i,
          heightOnScreen | 0,
          hiddenYs[i],
          color,
          screenWidth
        );

        if (units[mapOffset] > 0) {
          heightOnScreen = (camera.position.z - ground.altitude[mapOffset] - units[mapOffset]) * invz + camera.horizon | 0;
          this.drawVerticalLine(
            i,
            heightOnScreen | 0,
            hiddenYs[i],
            unitsColor[mapOffset],
            screenWidth
          );
        }

        if (heightOnScreen < hiddenYs[i]) {
          hiddenYs[i] = heightOnScreen;
        }

        pLeftX += dx;
        pLeftY += dy;
      }

      deltaz += 0.005;
    }
  }

  resize() {
    let aspect = window.innerWidth / window.innerHeight;

    this.canvas.width = window.innerWidth < 800 ? window.innerWidth : 800;
    this.canvas.height = this.canvas.width / aspect;

    this.imagedata = this.context.createImageData(this.canvas.width, this.canvas.height);
    this.bufarray = new ArrayBuffer(this.imagedata.width * this.imagedata.height * 4);
    this.buf8 = new Uint8Array(this.bufarray);
    this.buf32 = new Uint32Array(this.bufarray);

    this.hiddenYs = new Int32Array(this.canvas.width);
  }
}
