import { tick } from "./tick.js";

export const withinRange = (selectedUnit, unit) => {
  if (selectedUnit.teamID !== unit.teamID || unit.unitState === "DEAD") {
    return false;
  }

  return (
    (selectedUnit.position.row === unit.position.row &&
      selectedUnit.position.col === unit.position.col + 1) ||
    (selectedUnit.position.row === unit.position.row &&
      selectedUnit.position.col === unit.position.col - 1) ||
    (selectedUnit.position.col === unit.position.col &&
      selectedUnit.position.row === unit.position.row + 1) ||
    (selectedUnit.position.col === unit.position.col &&
      selectedUnit.position.row === unit.position.row - 1) ||
    (selectedUnit.position.row === unit.position.row + 1 &&
      selectedUnit.position.col === unit.position.col + 1) ||
    (selectedUnit.position.row === unit.position.row + 1 &&
      selectedUnit.position.col === unit.position.col - 1) ||
    (selectedUnit.position.row === unit.position.row - 1 &&
      selectedUnit.position.col === unit.position.col + 1) ||
    (selectedUnit.position.row === unit.position.row - 1 &&
      selectedUnit.position.col === unit.position.col - 1)
  );
};

export const enemiesWithinRange = ({ units, unit }) => {
  return units.filter((u) => {
    if (u.teamID === unit.teamID || u.unitState === "DEAD") {
      return false;
    }

    const { row: unitRow, col: unitCol } = unit.position;
    const { row, col } = u.position;

    return (
      (unitRow === row && unitCol === col + 1) ||
      (unitRow === row && unitCol === col - 1) ||
      (unitCol === col && unitRow === row + 1) ||
      (unitCol === col && unitRow === row - 1)
    );
  });
};

function canPlaceUnit(state, position) {
  const {
    units,
    level: { rows },
    maxUnits,
  } = state;

  // only teamID of player can place units, and only on the bottom half of the board
  if (position.row < rows / 2) {
    console.debug("cannot place unit on top half of board");
    return false;
  }

  if (units.length >= maxUnits) {
    console.debug("cannot place unit, max units reached");
    return false;
  }

  const isCellEmpty =
    units.find(
      (u) => u.position.row === position.row && u.position.col === position.col
    ) === undefined;
  if (isCellEmpty === false) {
    console.debug("cannot place unit, unit already at position");
    return false;
  }

  return true;
}

export const addUnit = ({ teamID, position, command }) => ({
  type: "ADD_UNIT",
  payload: {
    teamID,
    position,
    command,
  },
});

export const selectUnit = ({ col, row }) => ({
  type: "SELECT_UNIT",
  payload: {
    col,
    row,
  },
});

export const startBattle = () => ({
  type: "START_BATTLE",
});

// TODO: Rename this, it is technically updating all of the selected units commands
export const updateUnitCommand = (command) => ({
  type: "UPDATE_UNIT_COMMAND",
  payload: {
    command,
  },
});

export const updateCamera = (camera) => ({
  type: "UPDATE_CAMERA",
  payload: {
    camera,
  },
});

export const startedHandler = (state, action) => {
  if (action.type === "UPDATE_CAMERA") {
    const {
      camera: { movement },
    } = action.payload;

    const offsetX = state.camera.offsetX + movement.x;
    const offsetY = state.camera.offsetY + movement.y;

    return {
      ...state,
      camera: {
        ...state.camera,
        offsetX,
        offsetY,
      },
    };
  } else if (action.type === "UPDATE_UNIT_COMMAND") {
    const { command } = action.payload;

    const selectedUnit = state.units.find(
      (u) => u.unitID === state.selectedUnitID
    );

    return {
      ...state,
      units: state.units.map((u) => {
        if (state.selectedUnitID === u.unitID || withinRange(selectedUnit, u)) {
          return {
            ...u,
            command,
          };
        }

        return u;
      }),
    };
  } else if (action.type === "SELECT_UNIT") {
    const { col, row } = action.payload;

    const selectedUnit = state.units.find(
      (u) =>
        u.position.row === row &&
        u.position.col === col &&
        u.teamID === "PLAYER" &&
        u.unitState !== "DEAD"
    );

    return {
      ...state,
      selectedUnitID: selectedUnit?.unitID || null,
    };
  } else if (action.type === "START_BATTLE") {
    // add units based on state.maxUnits to the CPU team in the top half of the board
    // at random but grid aligned positions
    const cpuUnits = [];
    for (let i = 0; i < state.maxUnits; i++) {
      const unitID = Math.random().toString(36).substr(2, 9);
      const position = {
        row: Math.floor((Math.random() * state.level.rows) / 2),
        col: Math.floor(Math.random() * state.level.cols),
      };
      cpuUnits.push({
        teamID: "CPU",
        unitID,
        frame: 0,
        position,
        command: "ATTACK_DOWN",
        unitState: "IDLE",
        hp: 100,
        dmg: 10,
        enemyTarget: null,
        lastBattle: null,
        zIndex: 10,
      });
    }

    return {
      ...state,
      startedState: "BATTLING",
      startedAt: Date.now(),
      units: [...state.units, ...cpuUnits],
    };
  } else if (action.type === "TICK_PROGRESS") {
    const { gameTime } = action.payload;
    // update units frame after a certain amount of time
    const units = state.units.map((u) => {
      if (u.unitState === "DEAD") {
        return u;
      }

      if (u.unitState.startsWith("ATTACKING")) {
        let t = 0;
        const frames = [{ duration: 200 }, { duration: 300 }].map((f) => ({
          ...f,
          start: f.duration,
          end: (t += f.duration),
        }));
        const totalDuration = frames.reduce((acc, f) => acc + f.duration, 0);

        let frame = frames.findIndex((f) => {
          return gameTime % totalDuration <= f.end;
        });

        return {
          ...u,
          frame,
        };
      }

      if (u.unitState.startsWith("MOVING")) {
        let t = 0;
        const frames = [{ duration: 200 }, { duration: 300 }].map((f) => ({
          ...f,
          start: f.duration,
          end: (t += f.duration),
        }));
        const totalDuration = frames.reduce((acc, f) => acc + f.duration, 0);

        let frame = frames.findIndex((f) => {
          return gameTime % totalDuration <= f.end;
        });

        return {
          ...u,
          frame,
        };
      }

      return u;
    });

    return {
      ...state,
      units,
    };
  } else if (action.type === "TICK") {
    console.log("tick");
    if (state.startedState === "BATTLING") {
      const now = Date.now();
      const timerExpired = now - state.startedAt > state.timeLimit;
      const teamsAlive = state.teams.filter(
        (t) =>
          !state.units
            .filter((u) => u.teamID === t.teamID)
            .every((u) => u.unitState === "DEAD")
      );
      if (teamsAlive.length === 1 || timerExpired) {
        let winningTeamID = teamsAlive[0].teamID;
        if (teamsAlive.length > 1) {
          // find the team with the most units alive
          const teamUnitCounts = teamsAlive.map((t) => ({
            teamID: t.teamID,
            count: state.units.filter(
              (u) => u.teamID === t.teamID && u.unitState !== "DEAD"
            ).length,
          }));
          const maxUnits = Math.max(...teamUnitCounts.map((t) => t.count));
          const winningTeam = teamUnitCounts.find((t) => t.count === maxUnits);
          winningTeamID = winningTeam.teamID;
        }

        return {
          ...state,
          gameState: "GAME_OVER",
          winningTeamID,
        };
      }
    }
    return tick(state);
  } else if (action.type === "ADD_UNIT") {
    const { teamID, position, command } = action.payload;

    if (!canPlaceUnit(state, position, teamID)) {
      return state;
    }

    const unitID = Math.random().toString(36).substr(2, 9);
    const unit = {
      teamID,
      unitID,
      frame: 0,
      position,
      hp: 100,
      dmg: 10,
      command,
      unitState: "IDLE",
      enemyTarget: null,
      lastBattle: null,
      zIndex: 10,
    };

    return {
      ...state,
      units: [...state.units, unit],
    };
  }

  return state;
};
