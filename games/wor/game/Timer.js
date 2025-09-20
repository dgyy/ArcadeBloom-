let isInitialized = false;

function Timer({ timeLimit, startedAt }) {
  if (!isInitialized) {
    const el = document.createElement("div");
    el.id = "timer";
    el.innerHTML = `
      TIME LEFT
      <div id="timer-bar">
        <div id="timer-bar-border">
          <div id="timer-bar-inner"></div>
        </div>
      </div>
    `;

    const gameEl = document.querySelector("#game");
    gameEl.appendChild(el);

    isInitialized = true;
  }

  const now = Date.now();
  const timeElapsed = now - startedAt;
  const timeLeft = timeLimit - timeElapsed;
  const timeLeftPercent = Math.floor((timeLeft / timeLimit) * 100);
  const timerBarInnerEl = document.querySelector("#timer-bar-inner");
  timerBarInnerEl.style.width = `${timeLeftPercent}%`;
}
Timer.remove = function () {
  isInitialized = false;
  const el = document.querySelector("#timer");
  if (el) {
    el.remove();
  }
};
export default Timer;
