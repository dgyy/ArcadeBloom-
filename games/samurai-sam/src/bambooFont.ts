import { vec2, canvasFixedSize } from './littlejs';

import { MySvg } from './MySvg';
import { bambooPath } from './svgPaths';
import { red } from './colors';
import { tween, tweenRot } from './tween';

export function createS(startOffset = vec2(0, 0)) {
  const offsetX = startOffset.x;
  const s1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  s1.rotateSvg(10);
  s1.rotateSvg(10);
  s1.rotateSvg(10);
  s1.rotateSvg(10);
  s1.rotateSvg(5);
  s1.translateSvg(vec2(140 + offsetX, 100));
  const s2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  s2.rotateSvg(-10);
  s2.rotateSvg(-10);
  s2.rotateSvg(-10);
  s2.rotateSvg(-10);
  s2.rotateSvg(-5);
  s2.translateSvg(vec2(50 + offsetX, 160));
  const s3 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  s3.rotateSvg(10);
  s3.rotateSvg(10);
  s3.rotateSvg(10);
  s3.rotateSvg(10);
  s3.rotateSvg(5);
  s3.translateSvg(vec2(140 + offsetX, 190));
  return [s1, s2, s3];
}
export function createA(startOffset = vec2(0, 0)) {
  const offsetX = startOffset.x;
  const a1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  a1.rotateSvg(10);
  a1.rotateSvg(10);
  a1.translateSvg(vec2(220 + offsetX, 150));
  const a2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  a2.rotateSvg(-10);
  a2.rotateSvg(-10);
  a2.translateSvg(vec2(230 + offsetX, 160));
  const a3 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  for (let i = 0; i < 8; i++) {
    a3.rotateSvg(10);
  }
  a3.rotateSvg(5);
  a3.translateSvg(vec2(290 + offsetX, 200));
  return [a1, a2, a3];
}
export function createM(startOffset = vec2(0, 0)) {
  const offsetX = startOffset.x;
  const m1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  m1.translateSvg(vec2(320 + offsetX, 150));
  const m2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  m2.rotateSvg(-10);
  m2.rotateSvg(-10);
  m2.rotateSvg(-5);
  m2.translateSvg(vec2(330 + offsetX, 150));
  const m3 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  m3.rotateSvg(10);
  m3.rotateSvg(10);
  m3.rotateSvg(5);
  m3.translateSvg(vec2(430 + offsetX, 150));
  const m4 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  m4.translateSvg(vec2(435 + offsetX, 150));
  return [m1, m2, m3, m4];
}

export function createP() {
  const p1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const p2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const p3 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));

  for (let i = 0; i < 5; i++) {
    p2.rotateSvg(-10);
    p3.rotateSvg(10);
  }
  p2.translateSvg(vec2(-20, -5));
  p3.translateSvg(vec2(70, 20));

  return [p1, p2, p3];
}

export function createL() {
  const l1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const l2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));

  for (let i = 0; i < 17; i++) {
    l2.rotateSvg(5);
  }
  l2.translateSvg(vec2(100, 100));
  return [l1, l2];
}
export function createY() {
  const y1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const y2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));

  for (let i = 0; i < 3; i++) {
    y1.rotateSvg(10);
    y2.rotateSvg(-10);
  }
  y2.translateSvg(vec2(-75, -20));

  return [y1, y2];
}

export function createQ() {
  const o = createO();
  const q = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  for (let i = 0; i < 8; i++) {
    q.rotateSvg(-5);
  }
  q.translateSvg(vec2(27, 70));
  return [...o, q];
}
export function createO() {
  const svgs = createU();
  const o = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  for (let i = 0; i < 17; i++) {
    o.rotateSvg(5);
  }
  o.translateSvg(vec2(100, 0));

  return [...svgs, o];
}
export function createI() {
  const i = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  return [i];
}
export function createG() {
  const svgs = createL();
  const g1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const g2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  for (let i = 0; i < 17; i++) {
    g2.rotateSvg(5);
  }
  g1.translateSvg(vec2(80, 30));
  g2.translateSvg(vec2(150, 50));
  return [...svgs, g1, g2];
}
export function createN() {
  const n1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const n2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const n3 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  n2.rotateSvg(-10);
  n2.rotateSvg(-10);
  n2.rotateSvg(-5);
  n2.translateSvg(vec2(10, 10));
  n3.translateSvg(vec2(60, 0));
  return [n1, n3, n2];
}
export function createE() {
  const e1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const e2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const e3 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const e4 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  for (let i = 0; i < 17; i++) {
    e2.rotateSvg(5);
    e3.rotateSvg(5);
    e4.rotateSvg(5);
  }
  e2.translateSvg(vec2(100, 10));
  e3.translateSvg(vec2(100, 50));
  e4.translateSvg(vec2(100, 100));
  return [e1, e2, e3, e4];
}
export function createB() {
  const b1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  return [b1, ...create3()];
}
export function create3() {
  const b2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const b3 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const b4 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const b5 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));

  for (let i = 0; i < 5; i++) {
    b3.rotateSvg(10);
    b5.rotateSvg(10);
  }
  b3.translateSvg(vec2(90, 0));
  b5.translateSvg(vec2(90, 60));
  for (let i = 0; i < 17; i++) {
    b2.rotateSvg(5);
    b4.rotateSvg(5);
  }
  b2.translateSvg(vec2(100, -10));
  b4.translateSvg(vec2(100, 50));

  return [b2, b3, b4, b5];
}
export function createU() {
  const u3 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  const [u1, u2] = createL();
  u3.translateSvg(vec2(65, 0));
  return [u1, u2, u3];
}

export function createW() {
  const m1 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  m1.translateSvg(vec2(0, 0));
  const m2 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  m2.rotateSvg(-10);
  m2.rotateSvg(-10);
  m2.rotateSvg(-5);
  m2.translateSvg(vec2(40, 20));
  const m3 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  m3.rotateSvg(10);
  m3.rotateSvg(10);
  m3.rotateSvg(5);
  m3.translateSvg(vec2(50, 20));
  const m4 = new MySvg(bambooPath, null, 'r', red, vec2(0, 0));
  m4.translateSvg(vec2(95, 0));
  return [m1, m2, m3, m4];
}

export function createPlayButton() {
  const pSvgs = createP();
  const lSvgs = createL();
  const aSvgs2 = createA();
  const ySvgs = createY();
  lSvgs.forEach((svg) => svg.translateSvg(vec2(100, 0)));
  aSvgs2.forEach((svg) => svg.translateSvg(vec2(30, -140)));
  ySvgs.forEach((svg) => svg.translateSvg(vec2(390, 20)));

  const playButton = [...pSvgs, ...lSvgs, ...aSvgs2, ...ySvgs];
  playButton.forEach((s) => {
    s.setScale(0.5);
    s.setGravityScale(0);
  });
  tween(playButton, vec2(canvasFixedSize.x / 2 - 90, canvasFixedSize.y), vec2(canvasFixedSize.x / 2 - 90, 700), 1);
  tweenRot(playButton, -0.05, 0.05, 1, true);
  return playButton;
}

export function createWeb3Button() {
  const w = createW();
  w.forEach((l) => {
    l.setScale(0.25);
    l.translateSvg(vec2(30, 0));
  });
  const e = createE();
  const b = createB();
  const w3 = create3();

  e.forEach((e) => {
    e.setScale(0.25);
    e.translateSvg(vec2(70, 0));
  });
  b.forEach((svg) => {
    svg.setScale(0.25);
    svg.translateSvg(vec2(100, 0));
  });
  w3.forEach((svg) => {
    svg.setScale(0.25);
    svg.translateSvg(vec2(150, 0));
  });

  const web3Button = [...w, ...e, ...b, ...w3];
  web3Button.forEach((s) => s.setGravityScale(0));
  tween(
    web3Button,
    vec2(canvasFixedSize.x / 2 - 100, canvasFixedSize.y),
    vec2(canvasFixedSize.x / 2 - 100, canvasFixedSize.y - 100),
    1
  );
  tweenRot(web3Button, -0.1, 0.1, 1.3, true);
  return web3Button;
}
