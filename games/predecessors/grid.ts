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

export interface GridPosition {
    xi: number;
    yi: number;
}

export class Grid<T> {
    xCount: number;
    yCount: number;

    private items: T[];

    constructor(xCount: number, yCount: number, defaultValue: T) {
        this.xCount = xCount;
        this.yCount = yCount;
        this.items = new Array<T>(xCount * yCount).fill(defaultValue);
    }

    get(xIndex: number, yIndex: number): T | undefined {
        return this.items[yIndex * this.xCount + xIndex];
    }

    set(xIndex: number, yIndex: number, value: T): void {
        this.items[yIndex * this.xCount + xIndex] = value;
    }

    everyNearby(
        xi: number,
        yi: number,
        predicate: (item: T | undefined) => boolean,
    ) {
        return (
            predicate(this.get(xi - 1, yi - 1)) &&
            predicate(this.get(xi, yi - 1)) &&
            predicate(this.get(xi + 1, yi - 1)) &&
            predicate(this.get(xi - 1, yi)) &&
            predicate(this.get(xi + 1, yi)) &&
            predicate(this.get(xi - 1, yi + 1)) &&
            predicate(this.get(xi, yi + 1)) &&
            predicate(this.get(xi + 1, yi + 1))
        );
    }
}
