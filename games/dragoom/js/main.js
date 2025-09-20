import Game from "./Game.js";

(async () => {
  const gameboard = document.querySelector("#gameboard");
  const scoreEl = document.querySelector("#score-tracker");
  const roundEl = document.querySelector("#round-tracker");
  const titleScreen = document.querySelector("#title-screen");
  const scoreboard = document.querySelector(".scoreboard");
  const gameOverScreen = document.querySelector("#game-over-screen");
  const finalScore = document.querySelector("#final-score");
  const finalRound = document.querySelector("#final-round");

  const onGameOver = ({ score, round }) => {
    gameOverScreen.classList.remove("hidden");
    gameboard.classList.add("hidden");
    scoreboard.classList.add("hidden");
    finalScore.textContent = score;
    finalRound.textContent = round;
  };

  let game = new Game(gameboard, scoreEl, roundEl, onGameOver);

  const startButton = document.querySelector("#start-button");
  startButton.addEventListener("click", async () => {
    gameboard.classList.remove("hidden");
    scoreboard.classList.remove("hidden");
    titleScreen.classList.add("hidden");
    await game.start();
  });

  const restartBtn = document.querySelector("#restart");
  restartBtn.addEventListener("click", async () => {
    gameOverScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");
    game = new Game(gameboard, scoreEl, roundEl, onGameOver);
  });

  gameboard.addEventListener("click", (e) => {
    if (!e.target.matches("#gameboard-canvas")) {
      return;
    }
    const { offsetX, offsetY } = e;
    game.handleClick(offsetX, offsetY);
  });
})();
