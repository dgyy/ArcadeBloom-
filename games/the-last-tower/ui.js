function getFormattedDuration(durationMs) {
  let durationSec = durationMs / 1000;
  const durationMin = Math.floor(durationSec / 60);

  let durationStr = `${durationSec.toFixed()}s`;
  if (durationMin > 0) {
    durationSec = durationSec % 60;
    durationStr = `${durationMin.toFixed()}m ${durationSec.toFixed()}s`;
  }

  return durationStr;
}

/**
 * @param {import("./gameState").GameState} gameState
 */
export function showDefeat(gameState) {
  const {
    time: { currentFrameTime, startTime },
    entities: { player },
  } = gameState;

  document.body.dataset.stage = "defeat";

  const durationMs = currentFrameTime - startTime;
  let durationStr = getFormattedDuration(durationMs);

  document.querySelector("#duration").innerHTML = durationStr;
  document.querySelector("#killed").innerHTML = player.killed;

  const bestEffortTime = localStorage.getItem(`0ctothorp.js13k23.bestDurationMs`) || "0";
  const bestEffortKills = localStorage.getItem(`0ctothorp.js13k23.bestKills`) || "0";
  if (Math.floor(durationMs) > Number(bestEffortTime)) {
    localStorage.setItem(`0ctothorp.js13k23.bestDurationMs`, durationMs.toFixed());
  }
  if (player.killed > Number(bestEffortKills)) {
    localStorage.setItem(`0ctothorp.js13k23.bestKills`, player.killed.toFixed());
  }

  if (Number(bestEffortTime) > 0) {
    document.querySelector("#best-effort-p").classList.remove("dispnone");
    document.querySelector("#best-effort-v").innerHTML = getFormattedDuration(Number(bestEffortTime));
    document.querySelector("#best-effort-kills").innerHTML = bestEffortKills;
  }
}
