import type { Level, Ingredient, Patient } from "./data";

declare global {
  interface Window {
    scale: number;
  }

  interface GlobalEventHandlersEventMap {
    reset: CustomEvent;
    notify: CustomEvent<{
      messages: string[];
      onDismissed?: () => void;
      preventDismiss?: boolean;
    }>;
    dismiss: CustomEvent;
    newLevel: CustomEvent<{ level: Level }>;
    beginLevel: CustomEvent;
    scoreMaxed: CustomEvent;
    levelComplete: CustomEvent;
    potionClick: CustomEvent<{ ingredient: Ingredient }>;
    potionRelease: CustomEvent<{ ingredient: Ingredient }>;
    cauldronDrop: CustomEvent<{ ingredient: Ingredient }>;
    cauldronPrepared: CustomEvent<{ ingredient: Ingredient }>;
    patientCalled: CustomEvent<{ patient: Patient }>;
    patientDone: CustomEvent<{ patient: Patient }>;
    patientLeave: CustomEvent<{ patient: Patient }>;
    gameOver: CustomEvent;
  }
}
