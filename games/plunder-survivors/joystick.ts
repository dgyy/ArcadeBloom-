import { IPoint, IInputState} from "./interfaces";

const JOYSTICK_RADIUS = 100;
const JOYSTICK_INNER_RADIUS = JOYSTICK_RADIUS / 2;
const DOUBLE_TAP_THRESHOLD = 300;
export class Joystick {
    canvas: HTMLCanvasElement;
    outerPos: IPoint = { x: 0, y: 0 };
    innerPos: IPoint = { x: 0, y: 0 };
    normalizedPos: IPoint = { x: 0, y: 0 };
    pressed: boolean = false;
    lastTapTime: number = 0;
    boundingRect: DOMRect;

    callback: () => void;

    constructor(gameCanvas: HTMLCanvasElement, callback: () => void) {
        this.canvas = gameCanvas;
        this.callback = callback;

        this.addEventListeners(this.canvas);
        this.boundingRect = this.canvas.getBoundingClientRect();
    }

    resize() {
        this.boundingRect = this.canvas.getBoundingClientRect();
    }
    addEventListeners(element: HTMLElement) {
        element.addEventListener("mousedown", this.mousePressed.bind(this), { capture: true, passive: false});
        element.addEventListener("mousemove", this.mouseMoved.bind(this), { capture: true, passive: false});
        element.addEventListener("mouseup", this.inputReleased.bind(this), { capture: true, passive: false});

        element.addEventListener("touchstart", this.touchPressed.bind(this), { capture: true, passive: false});
        element.addEventListener("touchend", this.inputReleased.bind(this), { capture: true, passive: false});

        element.addEventListener("touchmove", this.touchMoved.bind(this),{ capture: true, passive: false});
        element.addEventListener("touchcancel", this.inputReleased.bind(this), { capture: true, passive: false});
    }
    updateNormalizedJoystickPos() {
        this.normalizedPos.x = (this.innerPos.x - this.outerPos.x) / JOYSTICK_RADIUS;
        this.normalizedPos.y = (this.outerPos.y - this.innerPos.y) / JOYSTICK_RADIUS;
    }


    xPosFromEvent(e: MouseEvent | TouchEvent) {
        let x = 0;

        if (e instanceof MouseEvent) {
            x = e.clientX ;

        } else if (e instanceof TouchEvent) {
            x = e.changedTouches[0].clientX;
        }

        return (x - this.boundingRect.left) * (this.canvas.width / this.boundingRect.width);
    }

    yPosFromEvent(e: MouseEvent | TouchEvent) {
        let y = 0;

        if (e instanceof MouseEvent) {
            y = e.clientY ;

        } else if (e instanceof TouchEvent) {
            y = e.changedTouches[0].clientY;
        }

        return (y - this.boundingRect.top) * (this.canvas.height / this.boundingRect.height);
    }
    touchPressed(e: TouchEvent) {
        e.preventDefault();
        this.inputPressed(this.xPosFromEvent(e), this.yPosFromEvent(e));
    }

    touchMoved(e: TouchEvent) {
        e.preventDefault();
        this.inputMoved(this.xPosFromEvent(e), this.yPosFromEvent(e));
    }

    mousePressed(e: MouseEvent) {
        e.preventDefault();
        this.inputPressed(this.xPosFromEvent(e), this.yPosFromEvent(e));
    }

    mouseMoved(e: MouseEvent) {
        e.preventDefault();
        this.inputMoved(this.xPosFromEvent(e), this.yPosFromEvent(e));
    }

    inputPressed(x: number, y: number) {
        this.pressed = true;
        this.outerPos.x = x;
        this.outerPos.y = y;
        this.innerPos.x = x;
        this.innerPos.y = y;

        const currentTime = Date.now();

        this.lastTapTime = currentTime;

        this.updateNormalizedJoystickPos();
        this.callback();
    }

    inputMoved(x, y) {
        if (!this.pressed) return;

        const xDiff = x - this.outerPos.x;
        const yDiff = y - this.outerPos.y;
        const magnitude = Math.hypot(xDiff, yDiff);

        this.innerPos.x = x;
        this.innerPos.y = y;

        if (magnitude > JOYSTICK_RADIUS) {
            const xIntersection = xDiff / magnitude * JOYSTICK_RADIUS;
            const yIntersection = yDiff / magnitude * JOYSTICK_RADIUS;
            this.innerPos.x = this.outerPos.x + xIntersection;
            this.innerPos.y = this.outerPos.y + yIntersection;
        }

        this.updateNormalizedJoystickPos();
        this.callback();

    }

    inputReleased(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        e.stopPropagation();

        this.pressed = false;
        this.outerPos.x = 0;
        this.outerPos.y = 0;
        this.innerPos.x = 0;
        this.innerPos.y = 0;
        this.updateNormalizedJoystickPos();
        this.callback();
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.pressed) return;
        this.drawOuterJoystick(ctx);
        this.drawInnerJoystick(ctx);
    }
    drawOuterJoystick(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 6;

        ctx.beginPath();
        ctx.arc(this.outerPos.x, this.outerPos.y, JOYSTICK_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    drawInnerJoystick(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "#F0E68C";
        ctx.lineWidth = 6;
        ctx.beginPath();

        ctx.arc(
            this.innerPos.x,
            this.innerPos.y,
            JOYSTICK_INNER_RADIUS,
            0,
            2 * Math.PI
        );

        // ctx.stroke();
        ctx.fillStyle = "#F0E68C";
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.closePath();
    }
}