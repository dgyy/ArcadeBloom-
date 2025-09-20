import { type Ingredient } from "./data";
import { wrapper, getElement, move, rect, rotate, ellipsis } from "./utils";
import { theme } from "./theme";
import { potionClick, potionRelease } from "./events";

type Column = 1 | 2 | 3;

const centerDeltaY = 15;

export function createPotions(ingredients: Ingredient[]) {
  const positions = Array.from(generatePositions());
  return ingredients
    .map((ingredient, index) => createPotion(ingredient, ...positions[index]))
    .join("");
}

function* generatePositions() {
  const x1 = 115;
  const x2 = 320;
  const x3 = 530;
  const y1 = 192;
  const y2 = 395;
  const columns = [
    [
      [x1, y1],
      [x1, y2],
    ],
    [
      [x2, y1 + centerDeltaY],
      [x2, y2 + centerDeltaY],
    ],
    [
      [x3, y1],
      [x3, y2],
    ],
  ];
  let columnIndex = 0;
  for (const column of columns) {
    columnIndex++;
    for (const position of column) {
      yield [position[0], position[1], columnIndex as Column] as const;
    }
  }
}

function createPotion(
  ingredient: Ingredient,
  x: number,
  y: number,
  column: Column,
) {
  setTimeout(() => {
    configEvents(ingredient);
  });
  return [
    potion(ingredient.id, ingredient.color, x, y, column),
    label(ingredient.name, x, y, column),
  ].join("");
}

function potion(
  id: string,
  color: string,
  x: number,
  y: number,
  column: Column,
) {
  const position = column === 3 ? 0 : 6;
  const capY = 25;
  return wrapper(
    move(
      rotate(
        [
          move(shape(theme.black50, 66, 66, true), 3, 3 + capY), // shadow
          move(shape(color, 66, 66), position, capY), // body
          move(rotate(rect(24, 30, color), -10), 21 + position, 12), // extension
          move(
            rotate(ellipsis(11.9, 6, 11.9, 6, color), -10),
            20 + position,
            6,
          ), // extension curvature
          move(rotate(rect(14, 17, theme.potionCap), -10), 24 + position, 0), // cap
          move(
            rotate(ellipsis(7, 3, 7, 3, theme.potionCap), -10),
            26.5 + position,
            14,
          ), // cap bottom
          move(
            rotate(
              ellipsis(6.5, 3, 6.5, 3, theme.potionCork, theme.potionCap, 1),
              -10,
            ),
            24 + position,
            -3,
          ), // cap top
          move(shape(theme.black30, 50, 50), position + 8, 8 + capY), // internal shadow
        ].join(""),
        10,
      ),
      3,
      0,
    ),
    75,
    75 + capY,
    { id, style: `top: ${y}px; left: ${x}px; z-index: ${theme.layers.potion}` },
  );
}

function shape(color: string, width: number, height: number, blur?: boolean) {
  let filter = "";
  if (blur === true) {
    filter = "filter:blur(4px)";
  }
  return wrapper(
    `
<g transform="translate(-510 143)">
<path d="m557-96c-4.6 4.6-26 8.1-32 5.1-5.8-3-16-23-15-29 1-6.4 17-22 23-23 6.4-1 26 9 29 15s-0.49 28-5.1 32z" fill="${color}" fill-opacity="1"/>
</g>`,
    width,
    height,
    { style: `cursor: move; ${filter}`, viewBoxWidth: 53, viewBoxHeight: 53 },
  );
}

export function configEvents(ingredient: Ingredient) {
  let canDrag = false;
  let clicked = false;
  let initialX = 0;
  let initialY = 0;
  let deltaX = 0;
  let deltaY = 0;

  const element = getElement(ingredient.id);
  function begin({
    clientX,
    clientY,
  }: Pick<MouseEvent, "clientX" | "clientY">) {
    if (!canDrag) {
      return;
    }
    clicked = true;
    initialX = clientX;
    initialY = clientY;
    element.dispatchEvent(potionClick(ingredient));
    element.style.zIndex = theme.layers.activePotion;
  }
  function move({ clientX, clientY }: Pick<MouseEvent, "clientX" | "clientY">) {
    if (clicked) {
      deltaX = (clientX - initialX) / window.scale;
      deltaY = (clientY - initialY) / window.scale;
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      element.style.pointerEvents = "none";
    }
  }
  function moveToStart() {
    deltaX = 0;
    deltaY = 0;
    element.style.transform = "";
    element.style.pointerEvents = "";
    element.style.zIndex = theme.layers.potion;
  }
  function end() {
    if (clicked) {
      clicked = false;
      moveToStart();
      element.dispatchEvent(potionRelease(ingredient));
    }
  }
  const moveByTouch = (event: TouchEvent) => {
    move(event.changedTouches[0]);
  };
  const beginByTouch = (event: TouchEvent) => {
    begin(event.changedTouches[0]);
  };
  const enableDrag = () => {
    canDrag = true;
  };
  const disableDrag = () => {
    canDrag = false;
  };
  const cancelDrag = () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("touchmove", moveByTouch);
    window.removeEventListener("mouseup", end);
    window.removeEventListener("touchend", end);
    window.removeEventListener("patientCalled", enableDrag);
    window.removeEventListener("patientDone", disableDrag);
    disableDrag();
    moveToStart();
  };
  element.addEventListener("mousedown", begin);
  element.addEventListener("touchstart", beginByTouch);
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", moveByTouch);
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);
  window.addEventListener("patientCalled", enableDrag);
  window.addEventListener("patientDone", disableDrag);
  window.addEventListener("gameOver", cancelDrag);
  window.addEventListener("reset", () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("touchmove", moveByTouch);
    window.removeEventListener("mouseup", end);
    window.removeEventListener("touchend", end);
    window.removeEventListener("patientCalled", enableDrag);
    window.removeEventListener("patientDone", disableDrag);
    window.removeEventListener("gameOver", cancelDrag);
  });
}

function label(name: string, x: number, y: number, column: Column) {
  let rotation = 0;
  let width = 120;
  if (column === 1) {
    rotation = 12;
    width = 110;
  } else if (column === 3) {
    rotation = -12;
    width = 110;
  }
  const left = x - 20;
  let top = y - 60;
  if (column === 2) {
    top += 5;
  }
  return `<p style="left: ${left}px; top: ${top}px; width: ${width}px; transform: rotate(${rotation}deg)">${name}</p>`;
}
