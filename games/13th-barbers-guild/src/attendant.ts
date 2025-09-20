import { getElement, wrapper } from "./utils";
import { character1 as character } from "./character";
import { Health } from "./types";

export function createAttendant(container: HTMLElement) {
  setTimeout(() => {
    getElement("pnt");
  });
  container.innerHTML = wrapper(
    character(Health.Good),
    character.width,
    character.height,
    {
      id: "pnt",
      style: "position: absolute; right: 30px; bottom: 30px",
    },
  );
}
