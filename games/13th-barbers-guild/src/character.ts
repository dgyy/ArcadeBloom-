import {
  wrapper,
  rect,
  ellipsis,
  move,
  resize,
  rotate,
  hmirror,
  blur,
} from "./utils";
import { theme } from "./theme";
import { Health } from "./types";

const faceColors: Record<number, string> = {
  [Health.Bad]: theme.characterSick,
  [Health.Dead]: theme.characterDead,
};

const back = (health: Health) =>
  move(
    rect(98, 98, faceColors[health] ?? theme.character, 35, theme.black(), 2),
    2,
    2,
  );

const opacity = move(rect(94, 94, theme.white(0.3), 35), 6, 0);

const eye = ellipsis(5, 5, 5, 5, theme.black());

const eyeDecoration = `<path d="m2.2 0.5c-1.9 1.8-2.6 4.9 0 8.3" fill="none" stroke="${theme.black()}" stroke-width="1.5" stroke-linecap="round"/>`;

const deadEyeLine = (direction: 1 | -1) =>
  move(rotate(rect(16, 2, theme.black()), direction * 45), direction * -5, 5);

const deadEye = wrapper(deadEyeLine(1) + deadEyeLine(-1), 16, 16);

const curedEye = `<path d="m0.689 6c5.73-8.6 11.6-4.98 15.3 0.0886" fill="none" stroke="#000" stroke-width="1.65"/>`;

const face = (health: Health) =>
  [
    back(health),
    opacity,
    health !== Health.Dead && health !== Health.Cured
      ? move(eye, 10, 40) + move(eye, 40, 40)
      : "",
    health === Health.Bad
      ? move(eyeDecoration, 6, 40) + hmirror(move(eyeDecoration, 52, 40))
      : "",
    health === Health.Dead
      ? move(deadEye, 7.5, 36.5) + move(deadEye, 37.5, 36.5)
      : "", // instead of orig eye's position
    health === Health.Cured
      ? move(curedEye, 7, 40) + move(curedEye, 37, 40)
      : "",
  ].join("");

const shadow = blur(move(rect(94, 94, theme.black(0.3), 35), 2, 8), 4);

const hair1 = move(
  resize(
    `<path d="m18.1 33.6c4.48-14.8 3.53-19.5-3.5-20.7-2.17 6.77-12.5 5.61-14.3 2.88-0.076-6.38 1.08-14.9 12-15.5 3.6-0.191 7.65 1.39 9.38 5.54 7.97-0.938 8.67 20.6 1.78 27.4z" fill="#fc0" stroke="#000" stroke-linejoin="round" stroke-width=".606"/>`,
    4,
    4,
  ),
  0,
  0,
);

const group = (health: Health) =>
  wrapper(shadow + move(face(health), 6, 0), 106, 106);

function createWrapper(
  content: (health: Health) => string,
  width: number,
  height: number,
) {
  const character = (health: Health) => wrapper(content(health), width, height);
  character.width = width;
  character.height = height;
  return character;
}

const mask = `
<g transform="translate(-106 -82.5)">
<g transform="matrix(.265 0 0 .265 285 183)">
<g fill="none" stroke="#000" stroke-width="2.3">
<path d="m-598-318 84.7-61.1"/>
<path d="m-598-318 48.7 47"/>
<path d="m-623-318-52-50.2"/>
</g>
<path d="m-650-345c29.6 10.8 59.2 6.91 88.8 0-6.77 20.1-8.93 40.6 0 62.1-28.1-18-55.3-11-82.4-2.13l-4.98-4.87c3.05-15.7 4.92-32.3-1.43-55.1z" fill="#fff" stop-color="#000000" stroke="#000" stroke-width="3.98"/>
<g fill="none">
<path d="m-565-302c-29.1-7.86-55.6-7.45-79.6 0.753" stroke="#f2f2f2" stroke-width="6.1"/>
<path d="m-565-298c-29.1-7.86-55.6-7.45-79.6 0.753" stroke="#000" stroke-width="2.3"/>
</g>
<g transform="rotate(180 -605 -315)" fill="none">
<path d="m-565-302c-29.1-7.86-55.6-7.45-79.6 0.753" stroke="#f2f2f2" stroke-width="6.1"/>
<path d="m-565-298c-29.1-7.86-55.6-7.45-79.6 0.753" stroke="#000" stroke-width="2.3"/>
</g>
<path d="m-650-345c29.6 10.8 59.2 6.91 88.8 0-6.77 20.1-8.93 40.6 0 62.1-28.1-18-55.3-11-82.4-2.13l-4.98-4.87c3.05-15.7 4.92-32.3-1.43-55.1z" fill="none" stop-color="#000000" stroke="#000" stroke-width="3.98"/>
</g>
</g>`;

export const character1 = createWrapper(
  (health: Health) =>
    move(group(health), 0, 35) +
    move(hair1, 7, 0) +
    move(resize(mask, 1.9, 1.9), 7, 80),
  121,
  141,
);

let hair2 = resize(
  `<path d="m140 268c46.6-154 1.96-204-137-145 13.3-58.2 34.7-104 127-120 122 78.8 184 253 10.7 265z" fill="#603d33" stroke="#000" stroke-linejoin="round" stroke-width="4.74"/>`,
  0.5,
  0.5,
);
for (let i = 0; i < 4; i++) {
  hair2 =
    move(ellipsis(10, 10, 10, 10, "#666"), 5 + i * 10, 45 - i * 2.5) + hair2;
}

export const character2 = createWrapper(
  (health: Health) => move(group(health), 0, 35) + move(hair2, 7, 0),
  132,
  141,
);

let hair3 = move(
  resize(
    `<path d="m43.8 67.3c12.3-40.7-6.28-53.5-43.1-38 3.5-15.4 11.1-45.6 60.4-16.6-8.9 6.5 4.9 38.5-17.2 54.6z" fill="#800" stroke="#000" stroke-linejoin="round" stroke-width="1.2"/>`,
    2,
    2,
  ),
  8,
  0,
);

for (let i = 0; i < 10; i++) {
  let y = 40 - 2 * i;
  if (i > 4) {
    y = 40 - 20 + i ** 1.5;
  }
  hair3 = move(rect(7, 25, "#d45500", 3), 12 + 9 * i, y) + hair3;
}

export const character3 = createWrapper(
  (health: Health) => move(group(health), 0, 35) + move(hair3, 0, 0),
  132,
  141,
);

const hair4 = resize(
  `<g transform="translate(-67.7 -105)" stroke="#000">
<path d="m105 175c9.27-30.6-6.77-42.7-13.9-40.6-7.04 1.21-6.42-0.288-11.6-1.89-6.93 0.171-6.69 11.8-11.2 12.3-1.94-25 2.17-37.4 24.9-38.8 43.9-2.33 41.3 65.4 11.8 68.9z" fill="#4d4d4d" stroke-linejoin="round" stroke-width="1.26"/>
<path d="m90.5 107 10.9 0.0201c-9.28 9.04-11.2 22-10.5 35.3h-10.3c0.0514-13.7-2.62-28.9 9.89-35.3z" fill="#3f3f3f" stop-color="#000000" stroke-width=".973"/>
</g>`,
  1.9,
  1.9,
);

export const character4 = createWrapper(
  (health: Health) => move(group(health), 0, 35) + move(hair4, 7, 0),
  121,
  141,
);
