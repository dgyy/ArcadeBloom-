let isInitialized = false;
let onDoneFn = null;
function PlacingUnitsOverlay({ maxUnits, unitsPlaced, onDone }) {
  onDoneFn = onDone;

  if (!isInitialized) {
    const overlayEl = document.createElement("div");
    overlayEl.id = "placing-units-overlay";
    overlayEl.classList.add("command-bar");
    overlayEl.innerHTML = `
      <h3>Place your units<div id="placing-units-overlay-status"></div></h3>
      <button id="done-button" class="btn">battle</button>
    `;
    const doneBtn = overlayEl.querySelector("#done-button");
    doneBtn.addEventListener("click", () => {
      onDoneFn();
    });
    const gameEl = document.querySelector("#game");
    gameEl.appendChild(overlayEl);
    isInitialized = true;
  }

  const statusEl = document.querySelector("#placing-units-overlay-status");
  statusEl.innerHTML = `${unitsPlaced}/${maxUnits}`;

  const doneBtn = document.querySelector("#done-button");
  if (maxUnits === unitsPlaced) {
    doneBtn.removeAttribute("disabled");
  } else {
    // doneBtn.setAttribute("disabled", "");
  }
}
PlacingUnitsOverlay.remove = function () {
  if (isInitialized) {
    isInitialized = false;
    const overlayEl = document.querySelector("#placing-units-overlay");
    overlayEl.remove();
  }
};
export default PlacingUnitsOverlay;
