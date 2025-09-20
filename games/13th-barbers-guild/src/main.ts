import "../style/style.css";
import { generateIngredients, generateLevels } from "./data";
import { createWalls } from "./walls";
import { createShelves } from "./shelves";
import { createPotions } from "./potions";
import { createCauldron } from "./cauldron";
import { createScore } from "./score";
import { createTimer } from "./timer";
import { createNotifications } from "./notifications";
import { createWaitingLounge } from "./waitingLounge";
import { getElement } from "./utils";
import { notify, dismiss, newLevel, reset, gameComplete } from "./events";
import { configSound, startSound } from "./sounds";
import { i18n } from "./i18n";

const ingredients = generateIngredients();

const width = 720;
const height = 800;

function runApp() {
  listenToEvents();
  renderApp();
}

function renderApp() {
  const [scale, isLandscape] = getFluidDimensions();
  window.scale = scale;
  const root = getScaledRoot(scale, isLandscape);
  root.innerHTML = `
    ${createWalls(width, height)}
    ${createCauldron(height)}
    ${createPotions(ingredients)}
    ${createShelves(width, height)}
    ${createScore()}
    ${createTimer()}
    ${createNotifications(width, height)}
    ${createWaitingLounge(width, height)}
  `;
  // Init app in the next event cycle so all listeners are in place
  setTimeout(initApp);
}

function initApp() {
  const levelGenerator = generateLevels(ingredients);
  function createLevel() {
    const level = levelGenerator.next().value;
    console.debug("New level:", level);
    if (level) {
      dispatchEvent(newLevel(level));
    } else {
      dispatchEvent(gameComplete());
    }
  }
  window.dispatchEvent(notify([i18n.welcome, i18n.instructions], createLevel));
  window.addEventListener("levelComplete", createLevel);
  configSound();
}

function getFluidDimensions() {
  const menuHeight = 42;
  const xRate = window.innerWidth / width;
  const yRate = (window.innerHeight - menuHeight) / height;
  const scale = Math.min(xRate, yRate);
  return [scale, xRate > yRate] as const;
}

function getScaledRoot(scale: number, isLandscape: boolean) {
  const root = getElement("app");
  root.style.setProperty("transform", `scale(${scale})`);
  root.style.setProperty("transform-origin", isLandscape ? "top" : "left top");
  return root;
}

function listenToEvents() {
  const root = getElement("app");
  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      window.dispatchEvent(reset());
      renderApp(); // reset application
    }
    if (event.key === " ") {
      window.dispatchEvent(dismiss());
    }
  });
  // Dismiss on mouseup, which covers also mobile environments
  window.addEventListener("mouseup", () => {
    window.dispatchEvent(dismiss());
  });
  // Reset on resize
  window.addEventListener("resize", () => {
    const [scale, isLandscape] = getFluidDimensions();
    window.scale = scale;
    root.style.setProperty("transform", `scale(${scale})`);
    root.style.setProperty(
      "transform-origin",
      isLandscape ? "top" : "left top",
    );
  });
  for (const button of getElement("menu").querySelectorAll("button, a")) {
    button.addEventListener("mouseup", (event) => {
      event.stopPropagation();
    });
  }
  getElement("reset").addEventListener("click", (event) => {
    event.stopPropagation();
    window.dispatchEvent(reset());
    renderApp(); // reset application
  });
  getElement("music").addEventListener("click", (event) => {
    event.stopPropagation();
    startSound(event.target as HTMLElement);
  });
}

runApp();
