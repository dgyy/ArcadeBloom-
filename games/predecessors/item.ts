/*
 *  Copyright 2023 Sami Heikkinen, Tero Jäntti
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { GameObject, Movement } from './gameobject';
import {
    CROSS_IMAGE_HEIGHT,
    CROSS_IMAGE_WIDTH,
    context,
    crossImage,
} from './graphics';

const collisionWidth = CROSS_IMAGE_WIDTH * 0.6;
const collisionHeight = collisionWidth / 2;

const xMargin = (CROSS_IMAGE_WIDTH - collisionWidth) / 2;

export class Item implements GameObject {
    x: number = 0;
    y: number = 0;
    width: number = collisionWidth;
    height: number = collisionHeight;

    draw(): void {
        context.save();

        const x = this.x - xMargin;
        const y = this.y - (CROSS_IMAGE_HEIGHT - this.height);
        context.translate(x, y);

        context.drawImage(
            crossImage,
            0,
            0,
            CROSS_IMAGE_WIDTH,
            CROSS_IMAGE_HEIGHT,
        );

        context.restore();

        // DRAWING COLLISION AREA FOR DEBUGGING:
        // (must be after context.restore() call)
        // context.strokeStyle = 'red';
        // context.strokeRect(this.x, this.y, this.width, this.height);
    }

    // eslint-disable-next-line
    move(_: Movement): void {}
}
