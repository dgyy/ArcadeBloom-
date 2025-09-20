function getDirection(position1, position2) {
  if (position1.row === position2.row) {
    return position1.col > position2.col ? "LEFT" : "RIGHT";
  }
  if (position1.col === position2.col) {
    return position1.row > position2.row ? "UP" : "DOWN";
  }

  throw new Error("Invalid direction");
}

function battle(enemiesWithinRange, unit) {
  let unitState = unit.unitState;
  let enemyTarget = unit.enemyTarget;

  const enemyTargetIsAlive = enemiesWithinRange.find(
    (u) => u.unitID === enemyTarget.unitID
  );

  if (!enemyTargetIsAlive) {
    const newEnemyTarget = enemiesWithinRange[0];
    const direction = getDirection(unit.position, newEnemyTarget.position);
    unitState = `ATTACKING_${direction}`;
    enemyTarget = { unitID: newEnemyTarget.unitID };
  }

  const enemiesTargetingUnit = enemiesWithinRange.filter(
    (u) => u.enemyTarget?.unitID === unit.unitID
  );

  const battle = enemiesTargetingUnit.reduce(
    (acc, u) => {
      const critted = Math.random() < 0.1;
      const blocked = Math.random() < 0.1;
      const missed = Math.random() < 0.1;
      if (missed) {
        return {
          ...acc,
          misses: acc.misses + 1,
        };
      }
      if (blocked && !critted) {
        return {
          ...acc,
          blocks: acc.blocks + 1,
          dmg: acc.dmg + u.dmg / 2,
        };
      }
      if (critted && !blocked) {
        return {
          ...acc,
          crits: acc.crits + 1,
          dmg: acc.dmg + u.dmg * 2,
        };
      }

      return {
        ...acc,
        hits: acc.hits + 1,
        dmg: acc.dmg + u.dmg,
      };
    },
    {
      misses: 0,
      crits: 0,
      blocks: 0,
      hits: 0,
      dmg: 0,
    }
  );

  const hp = Math.max(unit.hp - battle.dmg, 0);
  if (hp === 0) {
    unitState = "DEAD";
  }

  return {
    ...unit,
    hp,
    unitState,
    lastBattle: battle,
    enemyTarget,
    zIndex: unitState === "DEAD" ? 1 : 10,
  };
}

function target(enemiesWithinRange, unit) {
  const enemy = enemiesWithinRange[0];
  const direction = getDirection(unit.position, enemy.position);

  return {
    ...unit,
    unitState: `ATTACKING_${direction}`,
    enemyTarget: { unitID: enemy.unitID },
  };
}

function getNextPosition({ direction, position: { col, row } }) {
  switch (direction) {
    case "UP":
      return { row: row - 1, col };
    case "DOWN":
      return { row: row + 1, col };
    case "LEFT":
      return { row, col: col - 1 };
    case "RIGHT":
      return { row, col: col + 1 };
  }
}

function positionKey(position) {
  return `${position.row},${position.col}`;
}

function getEnemiesWithinRange(units, unit) {
  return units.filter((u) => {
    if (u.unitState === "DEAD" || u.teamID === unit.teamID) {
      return false;
    }

    // check if enemy in an adjacent cell
    return (
      (u.position.row === unit.position.row &&
        Math.abs(u.position.col - unit.position.col) === 1) ||
      (u.position.col === unit.position.col &&
        Math.abs(u.position.row - unit.position.row) === 1)
    );
  });
}

function tick(state) {
  const newUnits = state.units.map((unit) => {
    if (unit.unitState === "DEAD") {
      return unit;
    }

    const enemiesWithinRange = getEnemiesWithinRange(state.units, unit);
    // if there is an enemy in range target it
    if (enemiesWithinRange.length > 0) {
      if (unit.unitState.startsWith("ATTACKING")) {
        // target was chosen, time to battle
        return battle(enemiesWithinRange, unit);
      } else {
        // select a new target
        return target(enemiesWithinRange, unit);
      }
    } else {
      let unitState = "IDLE";
      if (unit.command.startsWith("ATTACK")) {
        const direction = unit.command.split("_")[1];
        unitState = `IDLE_${direction}`;
      }
      return {
        ...unit,
        unitState,
        enemyTarget: null,
        lastBattle: null,
      };
    }
  });

  const predictedPositions = [];
  const placements = new Map();

  newUnits
    .filter((u) => u.unitState !== "DEAD")
    .forEach((unit) => {
      let nextPosition = null;
      const willMove = () => {
        if (
          unit.unitState.startsWith("IDLE") &&
          unit.command.startsWith("ATTACK")
        ) {
          // predict movement
          const direction = unit.command.split("_")[1];
          nextPosition = getNextPosition({
            direction,
            position: unit.position,
          });
          if (
            nextPosition.row >= 0 &&
            nextPosition.row < state.level.rows &&
            nextPosition.col >= 0 &&
            nextPosition.col < state.level.cols
          ) {
            return true;
          }
        }

        return false;
      };

      if (willMove()) {
        predictedPositions.push({
          unitID: unit.unitID,
          nextPosition,
          prevPosition: unit.position,
        });
      } else {
        // place static units
        predictedPositions.push({
          unitID: unit.unitID,
          nextPosition: unit.position,
          prevPosition: unit.position,
        });
      }
      placements.set(positionKey(unit.position), unit.unitID);
    });

  const buildTrees = () => {
    const nodes = newUnits
      .filter((u) => u.unitState !== "DEAD")
      .map((unit) => ({
        unitID: unit.unitID,
        children: [],
      }));
    const rootNodes = [];
    nodes.forEach((node) => {
      const predictedPosition = predictedPositions.find(
        (p) => p.unitID === node.unitID
      );
      const targetUnitID = predictedPositions.find(
        (p) =>
          p.unitID !== node.unitID &&
          p.prevPosition.row === predictedPosition.nextPosition.row &&
          p.prevPosition.col === predictedPosition.nextPosition.col
      );
      if (targetUnitID) {
        const targetNode = nodes.find((n) => n.unitID === targetUnitID.unitID);
        targetNode.children.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  };

  const trees = buildTrees({ state, predictedPositions });

  const processTrees = (trees) => {
    trees.forEach((tree) => {
      const { nextPosition, prevPosition } = predictedPositions.find(
        (p) => p.unitID === tree.unitID
      );
      const cellIsEmpty = !placements.has(positionKey(nextPosition));
      if (cellIsEmpty) {
        placements.set(positionKey(nextPosition), tree.unitID);
        placements.delete(positionKey(prevPosition));

        const unitIdx = newUnits.findIndex((u) => u.unitID === tree.unitID);
        const unit = newUnits[unitIdx];
        const direction = unit.command.split("_")[1];
        newUnits.splice(unitIdx, 1, {
          ...unit,
          unitState: `MOVING_${direction}`,
          position: nextPosition,
        });
        processTrees(tree.children);
      }
    });
  };

  processTrees(trees);

  return {
    ...state,
    units: newUnits,
  };
}

// unitState: "IDLE", "ATTACKING_UP", "ATTACKING_DOWN", "ATTACKING_LEFT", "ATTACKING_RIGHT", "DEAD"
// MOVING_UP, MOVING_DOWN, MOVING_LEFT, MOVING_RIGHT

export { tick };
