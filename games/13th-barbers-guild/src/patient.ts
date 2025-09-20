import { type Level, type Patient } from "./data";
import { wrapper, cycle } from "./utils";
import { character2, character3, character4 } from "./character";
import { notify, patientCalled, patientDone, patientLeave } from "./events";

const characters = [character2, character3, character4];

export function createPatient(container: HTMLElement, level: Level) {
  const patient = level.getRandomPatient();
  console.debug(
    `Patient with: ${patient.disease.name}, ingredients: ${patient.ingredients
      .map(({ name }) => name)
      .join(" + ")}`,
  );
  const character = cycle(characters);
  function addIngredient(event: WindowEventMap["cauldronPrepared"]) {
    patient.giveIngredient(event.detail.ingredient);
    renderPatient(container, patient, character);
    if (patient.hasLeft()) {
      window.dispatchEvent(patientDone(patient));
      setTimeout(() => {
        window.removeEventListener("cauldronPrepared", addIngredient);
      });
    }
  }
  window.addEventListener("cauldronPrepared", addIngredient);
  renderPatient(container, patient, character);
  window.dispatchEvent(patientCalled(patient));
}

function renderPatient(
  container: HTMLElement,
  patient: Patient,
  character: typeof character2,
) {
  window.dispatchEvent(
    notify([patient.getSymptoms()], () => {
      if (patient.hasLeft()) {
        window.dispatchEvent(patientLeave(patient));
      }
    }),
  );
  container.innerHTML = wrapper(
    character(patient.health),
    character.width,
    character.height,
    {
      id: "pnt",
      style: "position: absolute; right: 30px; bottom: 30px",
    },
  );
}
