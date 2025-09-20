import { wrapper, rect, ellipsis, move, getElement, blur, id } from "./utils";
import { Health } from "./types";
import { theme } from "./theme";
import { levelComplete, scoreMaxed } from "./events";

const limit = Number(import.meta.env.VITE_PATIENT_LIMIT);
const width = 400;
const height = 20;
const deltaX = 120;
const deltaY = 30;
const margin = 6;
const coinMargin = 12;

export function createScore() {
  let points = 0;
  function updateBar() {
    const newWidth = (width - margin) * (points / limit);
    const element = getElement(import.meta.env.VITE_ID_SCORE);
    const rect = element.querySelector("rect:last-child");
    rect?.setAttribute("width", `${newWidth}`);
    const coins = getElement(import.meta.env.VITE_ID_COINS);
    coins.style.transform = `translateX(${newWidth}px)`;
  }
  function incrementScore(event: WindowEventMap["patientDone"]) {
    if (event.detail.patient.health !== Health.Cured) {
      return;
    }
    points++;
    updateBar();
    if (points === limit) {
      window.dispatchEvent(scoreMaxed());
    }
  }
  function informLevelComplete() {
    if (points === limit) {
      points = 0;
      updateBar();
      window.dispatchEvent(levelComplete());
    }
  }
  window.addEventListener("patientDone", incrementScore);
  window.addEventListener("patientLeave", informLevelComplete);
  window.addEventListener("reset", () => {
    window.removeEventListener("patientDone", incrementScore);
    window.removeEventListener("patientLeave", informLevelComplete);
  });
  return scoreBar;
}

const bar1 = rect(width, height, theme.scoreBack, height / 2);

const bar2 = move(
  rect(0, height - margin, theme.scoreFront, (height - margin) / 2),
  margin / 2,
  margin / 2,
);

function coin(x: number, y: number) {
  const width = 12;
  const coinFront = move(
    ellipsis(width, width, width, width, theme.scoreFront),
    deltaX + x,
    deltaY + y,
  );
  const coinBack = move(
    ellipsis(width, width, width, width, theme.coinBack),
    deltaX + x - 2,
    deltaY + y + 2,
  );
  const coinShadow = blur(
    move(
      ellipsis(width, width, width, width, theme.black(0.2)),
      deltaX + x - 4,
      deltaY + y + 4,
    ),
    2,
  );
  return coinShadow + coinBack + coinFront;
}

const coins = id(
  import.meta.env.VITE_ID_COINS,
  move(coin(0, -6) + coin(6, 3) + coin(12, -6), -19, 0),
);

const content = move(bar1 + bar2, deltaX, deltaY);

const scoreBar = wrapper(
  content + coins,
  width + deltaX + coinMargin,
  height + deltaY + coinMargin,
  {
    id: import.meta.env.VITE_ID_SCORE,
  },
);
