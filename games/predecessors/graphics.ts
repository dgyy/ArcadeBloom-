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

import playerNorthStandSvg from './images/player_n_stand.svg';
import playerNorthWalk1Svg from './images/player_n_walk_1.svg';
import playerNorthWalk2Svg from './images/player_n_walk_2.svg';

import playerSouthStandSvg from './images/player_s_stand.svg';
import playerSouthWalk1Svg from './images/player_s_walk_1.svg';
import playerSouthWalk2Svg from './images/player_s_walk_2.svg';

import playerWestStandSvg from './images/player_w_stand.svg';
import playerWestWalk1Svg from './images/player_w_walk1.svg';
import playerWestWalk2Svg from './images/player_w_walk2.svg';

import treeSvg from './images/tree.svg';

import crossSvg from './images/cross.svg';

export const canvas = document.querySelector('canvas') as HTMLCanvasElement;
export const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

const loadImage = (url: string): HTMLImageElement => {
    const img = new Image();
    img.src = url;
    return img;
};

export const playerNorthStandImage = loadImage(playerNorthStandSvg);
export const playerNorthWalk1Image = loadImage(playerNorthWalk1Svg);
export const playerNorthWalk2Image = loadImage(playerNorthWalk2Svg);

export const playerSouthStandImage = loadImage(playerSouthStandSvg);
export const playerSouthWalk1Image = loadImage(playerSouthWalk1Svg);
export const playerSouthWalk2Image = loadImage(playerSouthWalk2Svg);

export const playerWestStandImage = loadImage(playerWestStandSvg);
export const playerWestWalk1Image = loadImage(playerWestWalk1Svg);
export const playerWestWalk2Image = loadImage(playerWestWalk2Svg);

export const treeImage = loadImage(treeSvg);
export const TREE_IMAGE_WIDTH = 100;
export const TREE_IMAGE_HEIGHT = 135;

export const crossImage = loadImage(crossSvg);
export const CROSS_IMAGE_WIDTH = 40;
export const CROSS_IMAGE_HEIGHT = 54;
