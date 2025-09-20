/*
 * Name          : joy.js
 * @original-author : Roberto D'Amico (Bobboteck)
 * Last modified : 09.07.2024
 * Modified by   : Jakob Turner (https://github.com/JakeTurner616/js13k-2024)
 *
 * Description of Modifications:
 * - Added support for a second joystick (StickStatus2) to handle dual joystick functionality.
 * - Refactored the code to include only the necessary logic for joystick functionality.
 * - Removed support for cardinal direction and other features not needed for this version.
 *
 * The original MIT License applies to this file:
 * 
 * The MIT License (MIT)
 *
 * This file is part of the JoyStick Project (https://github.com/bobboteck/JoyStick).
 * Copyright (c) 2015 Roberto D'Amico (Bobboteck).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
export let StickStatus = { x: 0, y: 0 };
export let StickStatus2 = { x: 0, y: 0 };
const color = "rgba(0, 170, 0, 0.3)";
export class JoyStick {
    constructor(container, parameters = {}, callback = () => {}) {
        this.title = parameters.title || "joystick";
        this.internalFillColor = color;
        this.internalLineWidth = 2;
        this.externalLineWidth = 3;
        this.externalStrokeColor = color;

        this.callback = callback;

        // Set up canvas
        const objContainer = document.getElementById(container);
        objContainer.style.touchAction = "none";
        this.canvas = document.createElement("canvas");
        this.canvas.id = this.title;
        this.canvas.width = parameters.width || objContainer.clientWidth;
        this.canvas.height = parameters.height || objContainer.clientHeight;
        objContainer.appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");

        // Initialize joystick parameters
        this.pressed = 0;
        this.internalRadius = (this.canvas.width - ((this.canvas.width / 2) + 10)) / 2;
        this.maxMoveStick = this.internalRadius + 5;
        this.externalRadius = this.internalRadius + 50;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.movedX = this.centerX;
        this.movedY = this.centerY;

        // Touch event listeners
        if ("ontouchstart" in document.documentElement) {
            this.canvas.addEventListener("touchstart", this.onTouchStart.bind(this), false);
            document.addEventListener("touchmove", this.onTouchMove.bind(this), false);
            document.addEventListener("touchend", this.onTouchEnd.bind(this), false);
        }

        // Initial drawing
        this.drawExternal();
        this.drawInternal();
    }

    drawExternal() {
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.externalRadius, 0, 2 * Math.PI, false);
        this.context.lineWidth = this.externalLineWidth;
        this.context.strokeStyle = this.externalStrokeColor;
        this.context.stroke();
    }

    drawInternal() {
        this.context.beginPath();
        this.context.arc(this.movedX, this.movedY, this.internalRadius, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.internalFillColor;
        this.context.fill();
        this.context.lineWidth = this.internalLineWidth;
    }

    onTouchStart(event) {
        this.pressed = 1;
        this.touchId = event.targetTouches[0].identifier;
    }

    onTouchMove(event) {
        if (this.pressed === 1 && event.targetTouches[0].target === this.canvas) {
            const rect = this.canvas.getBoundingClientRect();
            this.movedX = event.targetTouches[0].clientX - rect.left;
            this.movedY = event.targetTouches[0].clientY - rect.top;

            const deltaX = this.movedX - this.centerX;
            const deltaY = this.movedY - this.centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > this.maxMoveStick) {
                const ratio = this.maxMoveStick / distance;
                this.movedX = this.centerX + deltaX * ratio;
                this.movedY = this.centerY + deltaY * ratio;
            }

            this.updateStickStatus();
        }
    }

    onTouchEnd(event) {
        if (event.changedTouches[0].identifier !== this.touchId) return;
        this.pressed = 0;

            this.movedX = this.centerX;
            this.movedY = this.centerY;

        this.updateStickStatus();
    }

    updateStickStatus() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawExternal();
        this.drawInternal();

        const normalizedX = (this.movedX - this.centerX) / this.maxMoveStick;
        const normalizedY = (this.movedY - this.centerY) / this.maxMoveStick;

        const status = this.title === "joystick1" ? StickStatus : StickStatus2;
        status.x = (normalizedX * 100).toFixed();
        status.y = (-normalizedY * 100).toFixed();

        this.callback(status);
    }
}