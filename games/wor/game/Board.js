import { withinRange } from "./started.js";

let isInitialized = false;
let onClickFn = null;
let onUpdateCameraFn = null;

function findTeam(teams, teamID) {
  const team = teams.find((t) => t.teamID === teamID);
  return team;
}

let spriteSheet = null;

function Board({ state, onClick, onUpdateCamera }) {
  const {
    level: { cellSize, rows, cols },
    teams,
    units,
    selectedUnitID,
  } = state;

  onClickFn = onClick;
  onUpdateCameraFn = onUpdateCamera;
  if (!isInitialized) {
    spriteSheet = document.querySelector("#sprite-sheet");
    const canvasWidth = cellSize * cols;
    const canvasHeight = cellSize * rows;

    const boardEl = document.createElement("div");
    boardEl.id = "board";
    boardEl.innerHTML = `
      <canvas id="board-canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
    `;

    const gameEl = document.querySelector("#game");
    gameEl.appendChild(boardEl);

    let isDragging = false;
    let clickStartX = null;
    let clickStartY = null;
    let lastX = null;
    let lastY = null;
    boardEl.addEventListener("pointerdown", (e) => {
      e.preventDefault();

      clickStartX = e.offsetX;
      clickStartY = e.offsetY;
      isDragging = false;

      const handleContextMenu = (e) => {
        e.preventDefault();
      };

      // Bug in iOS Safari movementX/Y: https://bugs.webkit.org/show_bug.cgi?id=248119
      lastX = e.clientX;
      lastY = e.clientY;

      const handleMouseMove = (e) => {
        const x = e.offsetX;
        const y = e.offsetY;
        if (clickStartX && clickStartY) {
          const deltaX = x - clickStartX;
          const deltaY = y - clickStartY;
          if (Math.abs(deltaX) > cellSize || Math.abs(deltaY) > cellSize) {
            isDragging = true;
          }
        }

        if (isDragging) {
          let movementX = e.movementX;
          let movementY = e.movementY;

          // Bug in iOS Safari movementX/Y: https://bugs.webkit.org/show_bug.cgi?id=248119
          if (movementX === undefined || movementY === undefined) {
            movementX = e.clientX - lastX;
            movementY = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
          }

          onUpdateCameraFn({
            movement: {
              x: movementX,
              y: movementY,
            },
          });
        }
      };

      const handleMouseUp = () => {
        if (!isDragging) {
          const row = Math.floor(clickStartY / cellSize);
          const col = Math.floor(clickStartX / cellSize);
          onClickFn({ row, col });
        }
        cleanup();
      };

      const handleMouseLeave = () => {
        cleanup();
      };

      const cleanup = () => {
        clickStartX = null;
        clickStartY = null;
        isDragging = false;
        boardEl.removeEventListener("pointermove", handleMouseMove);
        boardEl.removeEventListener("pointerup", handleMouseUp);
        boardEl.removeEventListener("contextmenu", handleContextMenu);
        boardEl.removeEventListener("pointerleave", handleMouseLeave);
      };

      boardEl.addEventListener("pointermove", handleMouseMove);
      boardEl.addEventListener("pointerup", handleMouseUp);
      boardEl.addEventListener("contextmenu", handleContextMenu);
      boardEl.addEventListener("pointerleave", handleMouseLeave);
    });

    isInitialized = true;
  }

  const canvas = document.querySelector("#board-canvas");
  canvas.width = cellSize * cols;
  canvas.height = cellSize * rows;

  // camera stuff
  const camera = state.camera;
  canvas.style.transform = `translate3d(${camera.offsetX}px, ${camera.offsetY}px, 0)`;
  canvas.style.width = `${cellSize * cols}px`;
  canvas.style.height = `${cellSize * rows}px`;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const frames = {
    BOX_SELECTOR_1: 0,
    BOX_SELECTOR_2: 1,
    GRASS: 3,
    TEXTURED_GRASS: 4,
    HIGHLIGHTED_BOX_1: 6,
    HIGHLIGHTED_BOX_2: 5,

    PLAYER: {
      DEAD: 23,
      IDLE: 7,
      IDLE_DOWN: 7,
      MOVING_DOWN: 7,
      IDLE_UP: 8,
      MOVING_UP: 8,
      IDLE_RIGHT: 9,
      MOVING_RIGHT: 9,
      IDLE_LEFT: 10,
      MOVING_LEFT: 10,
      ATTACKING_DOWN: 11,
      ATTACKING_UP: 12,
      ATTACKING_RIGHT: 13,
      ATTACKING_LEFT: 14,
    },
    CPU: {
      DEAD: 24,
      IDLE: 15,
      IDLE_DOWN: 15,
      MOVING_DOWN: 15,
      IDLE_UP: 16,
      MOVING_UP: 16,
      IDLE_RIGHT: 17,
      MOVING_RIGHT: 17,
      IDLE_LEFT: 18,
      MOVING_LEFT: 18,
      ATTACKING_DOWN: 19,
      ATTACKING_UP: 20,
      ATTACKING_RIGHT: 21,
      ATTACKING_LEFT: 22,
    },
  };

  // draw a grid with black border and white background
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      // pick random grass frame
      const grassFrame = [frames.GRASS, frames.TEXTURED_GRASS][
        (row % 2 ? 1 : 0) ^ (col % 2 ? 1 : 0)
      ];

      ctx.drawImage(
        spriteSheet,
        grassFrame * 16,
        0,
        16,
        16,
        col * cellSize,
        row * cellSize,
        cellSize,
        cellSize
      );

      if (state.startedState === "PLACING_UNITS" && row < rows / 2) {
        ctx.drawImage(
          spriteSheet,
          frames.HIGHLIGHTED_BOX_2 * 16,
          0,
          16,
          16,
          col * cellSize,
          row * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }

  units.sort((a, b) => a.zIndex - b.zIndex);

  const selectedUnit = units.find((u) => u.unitID === selectedUnitID);

  units.forEach((u) => {
    const { row, col } = u.position;

    const unitFrame = u.frame;
    let unitState = u.unitState;
    if (unitFrame === 1) {
      unitState = unitState.replace("ATTACKING", "IDLE");
    }

    const frame = frames[u.teamID][unitState];

    ctx.drawImage(
      spriteSheet,
      frame * 16,
      0,
      16,
      16,
      col * cellSize,
      row * cellSize,
      cellSize,
      cellSize
    );

    if (selectedUnitID && selectedUnitID === u.unitID) {
      ctx.drawImage(
        spriteSheet,
        frames.BOX_SELECTOR_1 * 16,
        0,
        16,
        16,
        col * cellSize,
        row * cellSize,
        cellSize,
        cellSize
      );
    }
    if (selectedUnitID && withinRange(selectedUnit, u)) {
      ctx.drawImage(
        spriteSheet,
        frames.BOX_SELECTOR_1 * 16,
        0,
        16,
        16,
        col * cellSize,
        row * cellSize,
        cellSize,
        cellSize
      );
    }
  });

  // draw health bars
  units.forEach((u) => {
    if (u.unitState === "DEAD" || u.hp === 100) {
      return;
    }

    ctx.fillStyle = findTeam(teams, u.teamID).color;
    const width = (u.hp / 100) * cellSize;
    const maxWidth = cellSize - 4;
    const height = 4;
    const x = u.position.col * cellSize + 2;
    const y = u.position.row * cellSize - 5;
    ctx.fillRect(x, y, Math.min(width, maxWidth), height);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(x + 0.5, y + 0.5, maxWidth, height);
  });
}

Board.remove = () => {
  if (isInitialized) {
    isInitialized = false;
    const boardEl = document.querySelector("#board");
    boardEl.remove();
  }
};

export default Board;
