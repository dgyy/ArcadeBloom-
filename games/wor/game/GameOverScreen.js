let isInitialized = false;
let onRestartGameFn = null;

function GameOverScreen({ state, onRestartGame }) {
  if (!isInitialized) {
    const el = document.createElement("div");
    el.id = "game-over-screen";
    el.innerHTML = `
      <h2>Game Over</h2>
      <h3 id="winner"></h3>
      <p>
        <button id="restart-button" class="btn">Play Again</button>
      </p>
    `;
    const gameEl = document.querySelector("#game");
    gameEl.appendChild(el);

    const restartBtn = document.querySelector("#restart-button");
    restartBtn.addEventListener("click", () => {
      onRestartGameFn();
    });
    isInitialized = true;
  }

  onRestartGameFn = onRestartGame;

  const winnerEl = document.querySelector("#winner");
  const winningTeam = state.teams.find((t) => t.teamID === state.winningTeamID);
  winnerEl.textContent = `${winningTeam.name} wins!`;
  winnerEl.style.color = winningTeam.color;
}
GameOverScreen.remove = function () {
  if (isInitialized) {
    isInitialized = false;
    const el = document.querySelector("#game-over-screen");
    el.remove();
  }
};
export default GameOverScreen;
