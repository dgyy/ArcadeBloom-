import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/constants/game-conts";

class DrawEngine {
  context: CanvasRenderingContext2D;

  constructor() {
    this.context = c2d.getContext('2d', { alpha: false, desynchronized: false });
    this.context.canvas.width = CANVAS_WIDTH;
    this.context.canvas.height = CANVAS_HEIGHT;
    this.context.imageSmoothingEnabled = false;
  }

  get canvasWidth() {
    return this.context.canvas.width;
  }

  get canvasHeight() {
    return this.context.canvas.height;
  }

  drawText(text: string, fontSize: number, x: number, y: number, color = 'white', textAlign: 'center' | 'left' | 'right' = 'center') {
    const context = c2d.getContext('2d', { alpha: false, desynchronized: false });
    // context.canvas.width = window.innerWidth;
    // context.canvas.height = window.innerHeight;
    context.imageSmoothingEnabled = false;

    context.font = `${fontSize}px Impact, sans-serif-black`;
    context.textAlign = textAlign;
    context.strokeStyle = 'black';
    context.lineWidth = 4
    context.strokeText(text, x, y);
    context.fillStyle = color;
    context.fillText(text, x, y);
  }

  getBuffer(): CanvasRenderingContext2D {
    const context = c2d.getContext('2d', { alpha: false, desynchronized: true })
    context.canvas.width = CANVAS_WIDTH;
    context.canvas.height = CANVAS_HEIGHT;
    context.imageSmoothingEnabled = false;
    return context;
  }
}

export const drawEngine = new DrawEngine();
