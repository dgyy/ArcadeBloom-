import GameLoop from "./game/GameLoop.js";
import { makeStore } from "./game/store.js";
import { gameOverHandler, restartGame } from "./game/gameOver.js";
import { startingHandler, startGame } from "./game/starting.js";
import {
  startedHandler,
  addUnit,
  startBattle,
  selectUnit,
  updateUnitCommand,
  updateCamera,
} from "./game/started.js";
import GameOverScreen from "./game/GameOverScreen.js";
import TitleScreen from "./game/TitleScreen.js";
import Board from "./game/Board.js";
import PlacingUnitsOverlay from "./game/PlacingUnitsOverlay.js";
import SelectedUnit from "./game/SelectedUnit.js";
import Timer from "./game/Timer.js";

const level = {
  cellSize: 32,
  rows: 30,
  cols: 30,
};
const camera = {
  offsetX: 0,
  offsetY: 0,
};
const initialState = {
  gameState: "STARTING", // STARTING, STARTED, PAUSED, GAME_OVER
  startedState: "PLACING_UNITS",
  maxUnits: 30,
  units: [],
  selectedUnitID: null,
  level,
  teams: [
    {
      teamID: "PLAYER",
      name: "Player",
      color: "#3e63dd",
    },
    {
      teamID: "CPU",
      name: "CPU",
      color: "#e54d2e",
    },
  ],
  camera,
  startedAt: null,
  timeLimit: 2 * 60 * 1000, // 5 minutes
  winningTeamID: null,
};

const store = makeStore(initialState, (state, action, payload) => {
  const reducers = {
    STARTING: startingHandler,
    STARTED: startedHandler,
    GAME_OVER: gameOverHandler,
  };

  return reducers[state.gameState](state, action, payload) || state;
});

let gcd = 0;
const gameLoop = new GameLoop(({ timeElapsed, gameTime }) => {
  gcd += timeElapsed;
  if (gcd >= 1000) {
    store.dispatch({ type: "TICK" });
    gcd = 0;
  }
  store.dispatch({ type: "TICK_PROGRESS", payload: { gameTime } });
});

const render = (state) => {
  if (state.gameState === "GAME_OVER") {
    gameLoop.stop();

    GameOverScreen({
      state,
      onRestartGame: () => {
        store.dispatch(restartGame({ initialState }));
      },
    });
  } else {
    GameOverScreen.remove();
  }

  if (state.gameState === "STARTING") {
    TitleScreen({
      startGame: () => {
        store.dispatch(startGame());
        gameLoop.start();
      },
    });
  } else {
    TitleScreen.remove();
  }

  if (state.gameState === "STARTED") {
    Board({
      state,
      onClick: ({ row, col }) => {
        if (state.startedState === "BATTLING") {
          store.dispatch(selectUnit({ row, col }));
          return;
        }

        store.dispatch(
          addUnit({
            teamID: "PLAYER",
            command: "HOLD",
            position: { row, col },
          })
        );
      },
      onUpdateCamera: (camera) => {
        store.dispatch(updateCamera(camera));
      },
    });

    if (state.startedState === "PLACING_UNITS") {
      PlacingUnitsOverlay({
        maxUnits: state.maxUnits,
        unitsPlaced: state.units.length,
        onDone: () => store.dispatch(startBattle()),
      });
    } else {
      PlacingUnitsOverlay.remove();
    }

    let selectedUnit;
    if (state.selectedUnitID) {
      selectedUnit = state.units.find((u) => u.unitID === state.selectedUnitID);
    }

    if (state.startedState === "BATTLING") {
      Timer({
        startedAt: state.startedAt,
        timeLimit: state.timeLimit,
      });
      SelectedUnit({
        unit: selectedUnit,
        units: state.units,
        onCommand: (command) => {
          store.dispatch(updateUnitCommand(command));
        },
      });
    } else {
      Timer.remove();
      SelectedUnit.remove();
    }
  } else {
    Board.remove();
    PlacingUnitsOverlay.remove();
    Timer.remove();
    SelectedUnit.remove();
  }
};

store.onChange((state) => {
  render(state);
});

render(store.state);
