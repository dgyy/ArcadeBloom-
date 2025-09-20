let isInitialized = false;
function TitleScreen({ startGame }) {
  if (!isInitialized) {
    const gameEl = document.querySelector("#game");
    gameEl.innerHTML = `
      <div id="title-screen">
        <h1>wör</h1>
        <p></p>
        <button id="start-button" class="btn">Start</button>
      </div>
    `;
    const startBtn = document.querySelector("#start-button");
    startBtn.addEventListener("click", () => {
      startGame();
    });
    isInitialized = true;
  }
}
TitleScreen.remove = function () {
  if (isInitialized) {
    isInitialized = false;
    const titleScreenEl = document.querySelector("#title-screen");
    titleScreenEl.remove();
  }
};
export default TitleScreen;
