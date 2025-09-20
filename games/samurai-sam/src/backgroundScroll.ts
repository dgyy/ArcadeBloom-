import { canvasFixedSize, timeDelta } from './littlejs';

import { dimBlue, dimRed, lightBlack } from './colors';
import { on } from './gameEvents';
import { ColorToSliceType } from './ColorToSliceType';

let currentBgScroll = 900; // padding + rect height + num rectangles/2
const maxBgScroll = 900;
const rectangles = 20;
const bgPadding = 130;
const minScrollSpeed = 15;
// const maxScrollSpeed = 180;
let currentScrollSpeed = 15;
let colorToSlice: ColorToSliceType;

export function listenForColtoToSliceEvents() {
  const onToSlice = (evt) => {
    colorToSlice = evt.detail.data.colorToSlice;
  };
  on('toslice', onToSlice);
}

// export function listenForSplitEvents() {
//   const onSplit = (_evt) => {
//     console.log('on split in bg scroll', currentScrollSpeed);
//     currentScrollSpeed += 35;
//     if (currentScrollSpeed >= maxScrollSpeed) currentScrollSpeed = maxScrollSpeed;
//   };
//   on('split', onSplit);
// }

export function renderBackgroundScroll(ctx) {
  currentBgScroll = (currentBgScroll + timeDelta * currentScrollSpeed) % maxBgScroll;
  currentScrollSpeed -= timeDelta * 30;
  if (currentScrollSpeed <= minScrollSpeed) currentScrollSpeed = minScrollSpeed;

  ctx.save();
  ctx.fillStyle = lightBlack;
  if (colorToSlice == 'r') {
    ctx.fillStyle = dimRed;
  } else if (colorToSlice == 'b') {
    ctx.fillStyle = dimBlue;
  }
  for (let i = -10; i < rectangles; i++) {
    const posY = currentBgScroll + i * bgPadding;
    ctx.fillRect(-10, posY, canvasFixedSize.x + 20, 30);
  }
  ctx.restore();
}

// listenForSplitEvents();
listenForColtoToSliceEvents();
