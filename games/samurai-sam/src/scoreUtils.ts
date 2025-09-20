import { MySvg } from './MySvg';
import { off, on } from './gameEvents';
import { vec2, timeDelta, overlayContext } from './littlejs';
import { smoothstep } from './smoothstep';

const STORAGE_PREFIX = 'sam-';
let currentScore: number = 0;
let highScore = getStoredHighscore();

export function getStoredHighscore() {
  const highScore = localStorage.getItem(`${STORAGE_PREFIX}highscore`);
  if (highScore) {
    return parseFloat(highScore);
  }
  return 0;
}

export function setCurrentScore(score: number) {
  currentScore = score;
}

function saveHighScore(score = 0) {
  highScore = score;
  localStorage.setItem(`${STORAGE_PREFIX}highscore`, `` + score);
}

export function getCurrentScore() {
  return currentScore;
}

export function addScore(svg: MySvg, point: vec2) {
  let score = 10;
  switch (svg.gameObjectType) {
    case 'f':
      score = 45;
      break;
    case 'a':
      score = 5;
      break;
    case 'l':
      score = 15;
      break;
    case 'h':
      score = 20;
      break;
    case 'ht':
      score = 25;
      break;
    default:
      score = 10;
  }
  startScoreRoutine(svg, point, score);
}

function startScoreRoutine(svg: MySvg, point: vec2, score: number) {
  const to = vec2(35, 55);
  const duration = 1;
  let ellapsedTime = 0;
  let from: vec2 = point.copy();

  // TODO (johnedvard) maybe use tween instead
  const onTick = () => {
    ellapsedTime += timeDelta;
    const ratio = ellapsedTime / duration;
    const x = smoothstep(from.x, to.x, ratio);
    const y = smoothstep(from.y, to.y, ratio);
    overlayContext.save();
    const fontSize = smoothstep(48, 10, ratio);
    overlayContext.font = `${fontSize}px serif`;
    overlayContext.fillStyle = svg.fill || 'white';
    overlayContext.fillText(score, x, y);
    overlayContext.restore();
    if (ellapsedTime >= duration) {
      currentScore += score;
      if (currentScore > highScore) {
        saveHighScore(currentScore);
      }
      off('tick', onTick);
    }
  };
  on('tick', onTick);
}
