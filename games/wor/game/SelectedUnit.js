let isInitialized = false;
let onCommandFn = null;

const handleKeyDownCommand = (e) => {
  const keyCommandMap = {
    ArrowUp: "ATTACK_UP",
    ArrowDown: "ATTACK_DOWN",
    ArrowLeft: "ATTACK_LEFT",
    ArrowRight: "ATTACK_RIGHT",
    " ": "HOLD",
    w: "ATTACK_UP",
    s: "ATTACK_DOWN",
    a: "ATTACK_LEFT",
    d: "ATTACK_RIGHT",
  };
  const command = keyCommandMap[e.key];
  if (command) {
    onCommandFn(command);
  }
};

function SelectedUnit({ unit, onCommand }) {
  onCommandFn = onCommand;
  if (!isInitialized) {
    const selectedUnitEl = document.createElement("div");
    selectedUnitEl.id = "selected-unit";
    selectedUnitEl.innerHTML = `
      <div id="selected-unit-actions" class="hidden pad">
        <button data-command="ATTACK_UP" class="up">
          <i class="icon icon--large icon-up-arrow"></i>
        </button>
        <button data-command="ATTACK_DOWN" class="down">
          <i class="icon icon--large icon-down-arrow"></i>
        </button>
        <button data-command="ATTACK_LEFT" class="left">
          <i class="icon icon--large icon-left-arrow"></i>
        </button>
        <button data-command="ATTACK_RIGHT" class="right">
          <i class="icon icon--large icon-right-arrow"></i>
        </button>
        <button data-command="HOLD" class="middle">
          <i class="icon icon--large icon-hold"></i>
        </button>
      </div>
    `;

    const gameEl = document.querySelector("#game");
    gameEl.appendChild(selectedUnitEl);

    document.querySelectorAll("[data-command]").forEach((btn) => {
      btn.addEventListener("click", () => {
        onCommandFn(btn.dataset.command);
      });
    });

    document.addEventListener("keydown", handleKeyDownCommand);

    isInitialized = true;
  }

  const selectedUnitActionsEl = document.querySelector(
    "#selected-unit-actions"
  );
  if (unit) {
    selectedUnitActionsEl.classList.remove("hidden");
  } else {
    selectedUnitActionsEl.classList.add("hidden");
  }
}
SelectedUnit.remove = function () {
  if (isInitialized) {
    const selectedUnitEl = document.querySelector("#selected-unit");
    selectedUnitEl.remove();
    document.removeEventListener("keydown", handleKeyDownCommand);
    isInitialized = false;
  }
};
export default SelectedUnit;
