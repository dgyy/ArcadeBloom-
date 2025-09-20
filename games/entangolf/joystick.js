const JOYSTICK_RADIUS = 250;
const JOYSTICK_INNER_RADIUS = JOYSTICK_RADIUS / 2;

export default class Joystick {
    constructor(gameCanvas, clickCallback, releaseCallback, moveCallback) {
      this.canvas = gameCanvas;
      this.clickCallback = clickCallback;
      this.releaseCallback = releaseCallback;
      this.moveCallback = moveCallback;
      this.outerPos = { x: 0, y: 0 };
      this.innerPos = { x: 0, y: 0 };
      this.normalizedPos = { x: 0, y: 0 };
      this.currentPos = { x: 0, y: 0 };
      this.pressed = false;
      this.boundingRect = this.canvas.getBoundingClientRect();
      this.addEventListeners(this.canvas);
    }

    resize() {
        this.boundingRect = this.canvas.getBoundingClientRect();
    }
    addEventListeners(element) {
        element.addEventListener("mousedown", this.mousePressed.bind(this), { capture: true, passive: false});
        window.addEventListener("mousemove", this.mouseMoved.bind(this), { capture: true, passive: false});
        window.addEventListener("mouseup", this.inputReleased.bind(this), { capture: true, passive: false});

        element.addEventListener("touchstart", this.touchPressed.bind(this), { capture: true, passive: false});
        window.addEventListener("touchend", this.inputReleased.bind(this), { capture: true, passive: false});

        window.addEventListener("touchmove", this.touchMoved.bind(this),{ capture: true, passive: false});
        window.addEventListener("touchcancel", this.inputReleased.bind(this), { capture: true, passive: false});
    }
    updateNormalizedJoystickPos() {
        this.normalizedPos.x = (this.innerPos.x - this.outerPos.x) / JOYSTICK_RADIUS;
        this.normalizedPos.y = (this.outerPos.y - this.innerPos.y) / JOYSTICK_RADIUS;
    }

    setCurrentPosFromEvent(e) {
        const rect = canvas.getBoundingClientRect();
        let x, y;

        if (e instanceof MouseEvent) {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        } else if (e instanceof TouchEvent) {
            const touch = event.touches[0];
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        }

        x *= canvas.width / rect.width;
        y *= canvas.height / rect.height;

        this.currentPos.x = x;
        this.currentPos.y = y;
    }

    xPosFromEvent(e) {
        let x = 0;

        if (e instanceof MouseEvent) {
            x = e.clientX ;

        } else if (e instanceof TouchEvent) {
            x = e.changedTouches[0].clientX;
        }

        return (x - this.boundingRect.left) * (this.canvas.width / this.boundingRect.width);
    }

    yPosFromEvent(e) {
        let y = 0;

        if (e instanceof MouseEvent) {
            y = e.clientY ;

        } else if (e instanceof TouchEvent) {
            y = e.changedTouches[0].clientY;
        }

        return (y - this.boundingRect.top) * (this.canvas.height / this.boundingRect.height);
    }
    touchPressed(e) {
        e.preventDefault();
        this.setCurrentPosFromEvent(e);
        this.inputPressed(this.xPosFromEvent(e), this.yPosFromEvent(e));
    }

    touchMoved(e) {
        e.preventDefault();
        this.setCurrentPosFromEvent(e);
        this.inputMoved(this.xPosFromEvent(e), this.yPosFromEvent(e));
    }

    mousePressed(e) {
        e.preventDefault();
        this.setCurrentPosFromEvent(e);
        this.inputPressed(this.xPosFromEvent(e), this.yPosFromEvent(e));
    }

    mouseMoved(e) {
        e.preventDefault();
        this.setCurrentPosFromEvent(e);
        this.inputMoved(this.xPosFromEvent(e), this.yPosFromEvent(e));
    }

    inputPressed(x, y) {
        this.pressed = true;
        this.outerPos.x = x;
        this.outerPos.y = y;
        this.innerPos.x = x;
        this.innerPos.y = y;

        this.updateNormalizedJoystickPos();
        this.clickCallback();
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
        this.moveCallback();
    }

    inputReleased(e) {
        if (this.pressed == false) return;
        e.preventDefault();
        e.stopPropagation();

        this.pressed = false;

        this.outerPos.x = 0;
        this.outerPos.y = 0;
        this.innerPos.x = 0;
        this.innerPos.y = 0;
        this.updateNormalizedJoystickPos();
        this.releaseCallback();
    }

    draw(ctx) {
        if (!this.pressed) return;
        this.drawOuterJoystick(ctx);
        this.drawInnerJoystick(ctx);
    }

    drawOuterJoystick(ctx) {
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 6;

        ctx.beginPath();
        ctx.arc(this.outerPos.x, this.outerPos.y, JOYSTICK_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    drawInnerJoystick(ctx) {
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