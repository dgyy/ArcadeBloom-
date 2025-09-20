import { mouseIsDown, mousePosScreen, Sound, vec2 } from './littlejs';

import { darkPink, lightBlue } from './colors';
import { lightSaberDrawSfx, haloSaberDrawSfx } from './music';
import { LightSaber } from './LightSaber';
import { getHaloSaber, getLightSaber } from './near';
import { HaloSaber } from './HaloSaber';

export const mousePoints = [];
export const maxDraws = 6;
let selectedDrawColor = 'white';
let equippedDrawColor = 'white';
let isUseSelectedColor = false; // swap between selected and equipped
let lightSaberDrawSound = new Sound(lightSaberDrawSfx);
let haloSaberDrawSound = new Sound(haloSaberDrawSfx);
let selectedDrawSound: Sound;
let equippedDrawSound: Sound;
let lightSaber: LightSaber = null;
let haloSaber: HaloSaber = null;
let equippedSword: HaloSaber | LightSaber | null = null;
let selectedSword: HaloSaber | LightSaber | null = null;

function removeMouseDraggings() {
  for (let i = mousePoints.length - 1; i >= 0; i--) {
    if (mousePoints[i].draws <= 0) {
      mousePoints.splice(i, 1);
    }
  }
}

function getColorToDraw() {
  if (isUseSelectedColor) return selectedDrawColor;
  return equippedDrawColor;
}

function getDrawSound() {
  if (isUseSelectedColor) return selectedDrawSound;
  return equippedDrawSound;
}

function getCurrentSword() {
  if (isUseSelectedColor) return selectedSword;
  return equippedSword;
}

export function drawTouchLine(ctx) {
  if (!mousePoints.length) return;

  // cleanup leftover mouse points
  if (!mouseIsDown(0)) {
    mousePoints[0].draws--;
  }

  ctx.strokeStyle = getColorToDraw();

  const sword = getCurrentSword();
  if (sword) {
    const pos = mousePoints[mousePoints.length - 1];
    if (pos) {
      sword.setPos(vec2(pos.x, pos.y));
      sword.render(ctx);
    }
  }
  const drawSound = getDrawSound();
  if (drawSound) {
    drawSound.play();
  }
  for (let i = 0; i < mousePoints.length - 1; i++) {
    const prev = mousePoints[i];
    const next = mousePoints[i + 1];
    if (prev.draws > 0 && next.draws > 0) {
      ctx.lineWidth = prev.draws * 2;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
    prev.draws--;
  }
  removeMouseDraggings();
}

export function updateMouseControls() {
  if (!mouseIsDown(0)) return;
  const pos = mousePosScreen;

  mousePoints.splice(mousePoints.length, 0, {
    x: pos.x,
    y: pos.y,
    draws: maxDraws,
  }); // add to start of queue
}

export function setIsUseSelectedColor(value: boolean) {
  isUseSelectedColor = value;
}
export function setSelectedDragColor(color: string) {
  selectedDrawColor = color;
  selectedDrawSound = getDrawSoundFromColor(color);
  selectedSword = getSwordFromColor(color);
}
export function setEquippedDragColor(color: string) {
  equippedDrawColor = color;
  equippedDrawSound = getDrawSoundFromColor(color);
  equippedSword = getSwordFromColor(color);
}

function getSwordFromColor(color: string) {
  if (color == darkPink) {
    if (!haloSaber) {
      const originalSaber = getHaloSaber();
      haloSaber = new HaloSaber(originalSaber.getCollection());
      haloSaber.setPos(vec2(0, 0));
      haloSaber.translate(vec2(-124, 0));
      haloSaber.setScale(vec2(-1, 1));
    }
    return haloSaber;
  } else if (color == lightBlue) {
    if (!lightSaber) {
      const originalSaber = getLightSaber();
      lightSaber = new LightSaber(originalSaber.getCollection());
      lightSaber.setPos(vec2(0, 0));
      lightSaber.translate(vec2(-83, 0));
      lightSaber.setScale(vec2(-1, 1));
    }
    return lightSaber;
  } else {
    return null;
  }
}

function getDrawSoundFromColor(color: string) {
  switch (color) {
    case lightBlue:
      return lightSaberDrawSound;
    case darkPink:
      return haloSaberDrawSound;
    default:
      return null;
  }
}
