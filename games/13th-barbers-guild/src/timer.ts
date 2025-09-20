import {
  wrapper,
  ellipsis,
  move,
  resize,
  vmirror,
  getElement,
  blur,
  rotate,
} from "./utils";
import { gameOver } from "./events";
import { theme } from "./theme";

const height = 100;
let hasBeginBeforeEnding = false;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

export function createTimer() {
  setTimeout(() => {
    const timer = getElement<SVGSVGElement>(import.meta.env.VITE_ID_TIMER);
    const animations = timer.querySelectorAll("animate");

    animations[0].addEventListener("endEvent", () => {
      // Move event ending to the next event cycle to catch a duplicate call before begin
      setTimeout(() => {
        if (!hasBeginBeforeEnding) {
          timeoutId = setTimeout(
            () => {
              window.dispatchEvent(gameOver());
            },
            Number(import.meta.env.VITE_CAULDRON_TIMEOUT),
          );
        }
        hasBeginBeforeEnding = false;
      });
    });
    animations[0].addEventListener("beginEvent", () => {
      hasBeginBeforeEnding = true;
    });

    function initTimer() {
      timer.unpauseAnimations();
    }
    function stopTimer() {
      timer.pauseAnimations();
    }
    function resetTimer() {
      animations.forEach((element) => {
        element.beginElement();
      });
      stopTimer();
    }
    window.addEventListener("patientCalled", initTimer);
    window.addEventListener("newLevel", resetTimer);
    window.addEventListener("scoreMaxed", stopTimer);
    window.addEventListener("reset", () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("patientCalled", initTimer);
      window.removeEventListener("newLevel", resetTimer);
      window.removeEventListener("scoreMaxed", stopTimer);
    });
    resetTimer();
  });
  return wrapper(
    gradient() + gradient(true) + move(group, 0, 0),
    74,
    height + 4,
    {
      id: import.meta.env.VITE_ID_TIMER,
      style: "top: 10px; left: 560px",
    },
  );
}

function gradient(reverse: boolean = false) {
  const gradientColor = "#c8ab37";
  return `<defs>
<linearGradient id="${import.meta.env.VITE_ID_TIMER_GRADIENT}_${
    reverse ? "r" : "d"
  }" x1="0" x2="0" y1="-20" y2="57" gradientUnits="userSpaceOnUse">
${gradientStop(gradientColor, reverse ? 0 : 1, 0)}/>
${gradientStop(gradientColor, reverse ? 0 : 1, 0)}>
  <animate attributeName="offset" dur="${
    import.meta.env.VITE_TIME_LIMIT
  }s" values="0;1" repeatCount="1" fill="freeze" pause />
</stop>
${gradientStop(gradientColor, reverse ? 1 : 0, 0)}>
  <animate attributeName="offset" dur="${
    import.meta.env.VITE_TIME_LIMIT
  }s" values="0;1" repeatCount="1" fill="freeze" pause />
</stop>
${gradientStop(gradientColor, reverse ? 1 : 0, 1)}/>
</linearGradient>
</defs>`;
}

function gradientStop(color: string, opacity: number, offset: number) {
  return `<stop stop-color="${color}" stop-opacity="${opacity}" offset="${offset}"`;
}

const coverLid = ellipsis(35, 10, 35, 10, "#784421");
const coverShadow = move(ellipsis(35, 10, 35, 10, "#28170b"), 0, 5);
const cover = coverShadow + coverLid;

const path =
  "M 0,0 C 0,-20.654185 70,-21.872077 70,0 70,22.378835 39.954921,54.914604 35,55 30.084107,55.084723 0,21.945938 0,0 Z";
const triangle = (color: string) => `<path d="${path}" fill="${color}" />`;

const shadow = (color: string) =>
  blur(
    move(resize(triangle(color), 0.9, 0.75), 8, 20) +
      move(vmirror(resize(triangle(color), 0.9, 0.65)), 8, -20) +
      move(ellipsis(35, 10, 35, 10, color), 4, height - 21),
    4,
  );

const group = resize(
  [
    shadow(theme.black(0.3)),
    move(resize(triangle("#afe"), 0.9, 0.75), 4, 20),
    move(cover, 0, height - 21),
    move(vmirror(resize(triangle("#afe"), 0.9, 0.65)), 4, -18),
    move(
      resize(
        triangle(`url(#${import.meta.env.VITE_ID_TIMER_GRADIENT}_r)`),
        0.65,
        0.5,
      ),
      12,
      24,
    ),
    move(
      vmirror(
        resize(
          triangle(`url(#${import.meta.env.VITE_ID_TIMER_GRADIENT}_d)`),
          0.65,
          0.5,
        ),
      ),
      12,
      -20,
    ),
    cover,
    move(rotate(ellipsis(7, 12, 7, 12, theme.white(0.3)), -25), 29, 8),
    vmirror(move(rotate(ellipsis(7, 12, 7, 12, theme.white(0.3)), -25), 29, 0)),
  ].join(""),
  0.8,
  1,
);
