import { absDiv, getElement, coloredIngredientNames } from "./utils";
import { createAttendant } from "./attendant";
import { createPatient } from "./patient";
import { theme } from "./theme";
import { notify, beginLevel } from "./events";
import { type Level } from "./data";
import { i18n } from "./i18n";

export function createWaitingLounge(width: number, height: number) {
  let isGameDone = false;
  let currentLevel: Level;
  setTimeout(() => {
    const container = getElement(import.meta.env.VITE_ID_WAITING_LOUNGE);
    function startLevel(event: WindowEventMap["newLevel"]) {
      currentLevel = event.detail.level;
      createAttendant(container);
      window.dispatchEvent(
        notify(
          [
            currentLevel.requiredIngredientsCount === 1
              ? i18n.level1Callout
              : i18n.levelNCallout(currentLevel.requiredIngredientsCount),
            i18n.levelParams(currentLevel.requiredIngredientsCount),
            i18n.ingredientList(
              getDiseasesAndIngredients(currentLevel.diseasesIngredients),
            ),
          ],
          () => {
            window.dispatchEvent(beginLevel());
            createPatient(container, currentLevel);
          },
        ),
      );
    }
    function gameOver() {
      isGameDone = true;
      console.debug("Game over!");
      createAttendant(container);
      window.dispatchEvent(
        notify([i18n.gameOver + i18n.teardownIntructions], undefined, true),
      );
    }
    function gameComplete() {
      isGameDone = true;
      console.debug("Game complete!");
      createAttendant(container);
      window.dispatchEvent(
        notify([i18n.gameComplete + i18n.teardownIntructions], undefined, true),
      );
    }
    function callNextPatient(event: WindowEventMap["patientLeave"]) {
      const level = event.detail.patient.level;
      if (level === currentLevel && !isGameDone) {
        createPatient(container, event.detail.patient.level);
      }
    }
    window.addEventListener("newLevel", startLevel);
    window.addEventListener("patientLeave", callNextPatient);
    window.addEventListener("gameOver", gameOver);
    window.addEventListener("gameComplete", gameComplete);
    window.addEventListener("reset", () => {
      window.removeEventListener("newLevel", startLevel);
      window.removeEventListener("patientLeave", callNextPatient);
      window.removeEventListener("gameOver", gameOver);
      window.removeEventListener("gameComplete", gameComplete);
    });
    // Create attendant by default while the game hasn't started
    createAttendant(container);
  });
  return absDiv(
    "",
    import.meta.env.VITE_ID_WAITING_LOUNGE,
    width,
    height,
    theme.layers.patient,
  );
}

function getDiseasesAndIngredients(
  diseasesIngredients: Level["diseasesIngredients"],
) {
  return diseasesIngredients
    .map(([disease, ingredients]) => {
      return `🧪 ${disease.name}: ${coloredIngredientNames(ingredients)}`;
    })
    .join("\n");
}
