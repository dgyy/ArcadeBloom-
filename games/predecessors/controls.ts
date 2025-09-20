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

// These must match the definitions in KeyboardEvent.code
export type Key =
    | 'ArrowLeft'
    | 'ArrowRight'
    | 'ArrowUp'
    | 'ArrowDown'
    | 'KeyW'
    | 'KeyA'
    | 'KeyS'
    | 'KeyD';

export type Controls = Record<Key, boolean>;

const createControls = (): Controls => ({
    ['ArrowLeft']: false,
    ['ArrowRight']: false,
    ['ArrowUp']: false,
    ['ArrowDown']: false,
    ['KeyW']: false,
    ['KeyA']: false,
    ['KeyS']: false,
    ['KeyD']: false,
});

let controls: Controls = createControls();

const onKeyDown = (event: KeyboardEvent): void => {
    if (event.code in controls) {
        controls[event.code as Key] = true;
    }
};

const onKeyUp = (event: KeyboardEvent): void => {
    if (event.code in controls) {
        controls[event.code as Key] = false;
    }
};

export const initializeControls = (): void => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', () => {
        controls = createControls();
    });
};

export const waitForAnyKey = (): Promise<void> => {
    return new Promise((resolve) => {
        const listener = (): void => {
            window.removeEventListener('keydown', listener);
            resolve();
        };

        window.addEventListener('keydown', listener);
    });
};

export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const waitForEnter = (): Promise<void> => {
    return new Promise((resolve) => {
        const listener = (event: KeyboardEvent): void => {
            if (event.code === 'Enter') {
                window.removeEventListener('keydown', listener);
                resolve();
            }
        };

        window.addEventListener('keydown', listener);
    });
};

export const getControls = (): Controls => controls;
