import { tick } from "./game/tick.js";

((module, test) => {
  module("Tick");

  test("nothing changes without units", (assert) => {
    const level = { rows: 10, cols: 10 };
    const state = {
      level,
      units: [],
      unitGrid: Array.from({ length: level.rows }, () =>
        Array.from({ length: level.cols }, () => null)
      ),
    };
    assert.deepEqual(tick(state), state, "state is unchanged");
  });

  test("two moving units can't move past each other", (assert) => {
    const level = { rows: 1, cols: 3 };
    const unitGrid = Array.from({ length: level.rows }, () =>
      Array.from({ length: level.cols }, () => null)
    );
    const units = [];
    units.push({
      unitID: "unit1",
      command: "ATTACK_RIGHT",
      position: { row: 0, col: 0 },
    });
    unitGrid[0][0] = "unit1";
    units.push({
      unitID: "unit2",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 2 },
    });
    unitGrid[0][2] = "unit2";
    const state = {
      level,
      units,
      unitGrid,
    };

    let newState = tick(state);

    assert.equal(newState.units[0].unitID, "unit1", "unit1 is unchanged");
    assert.deepEqual(
      newState.units[0].position,
      { row: 0, col: 1 },
      "unit1 moved right"
    );

    assert.equal(newState.units[1].unitID, "unit2", "unit2 is unchanged");
    assert.deepEqual(
      newState.units[1].position,
      { row: 0, col: 2 },
      "unit2 didn't move"
    );

    newState = tick(newState);

    assert.deepEqual(
      newState.units[0].position,
      { row: 0, col: 1 },
      "unit1 didn't move"
    );
    assert.deepEqual(
      newState.units[1].position,
      { row: 0, col: 2 },
      "unit2 didn't move"
    );
  });

  test("units move over dead units", (assert) => {
    const level = { rows: 1, cols: 3 };
    const units = [
      {
        unitID: "unit1",
        unitState: "IDLE",
        command: "ATTACK_RIGHT",
        position: { row: 0, col: 0 },
      },
      {
        unitID: "unit2",
        command: "HOLD",
        unitState: "DEAD",
        position: { row: 0, col: 1 },
      },
    ];
    const state = {
      level,
      units,
    };

    const unit1 = units.findIndex((u) => u.unitID === "unit1");
    const unit2 = units.findIndex((u) => u.unitID === "unit2");

    let newState = tick(state);

    assert.deepEqual(
      newState.units[unit1].position,
      { row: 0, col: 1 },
      "unit1 moved onto dead unit"
    );
    assert.deepEqual(
      newState.units[unit2].position,
      { row: 0, col: 1 },
      "unit2 didn't move"
    );

    newState = tick(newState);

    assert.deepEqual(
      newState.units[unit1].position,
      { row: 0, col: 2 },
      "unit1 moved past dead unit"
    );
    assert.deepEqual(
      newState.units[unit2].position,
      { row: 0, col: 1 },
      "unit2 didn't move"
    );
  });

  test("units cannot move off the map", (assert) => {
    const level = { rows: 2, cols: 2 };
    const unitGrid = Array.from({ length: level.rows }, () =>
      Array.from({ length: level.cols }, () => null)
    );
    const units = [];
    units.push({
      unitID: "unit1",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 0 },
    });
    unitGrid[0][0] = "unit1";
    const state = {
      level,
      units,
      unitGrid,
    };

    let newState = tick(state);

    assert.deepEqual(
      newState.units[0].position,
      { row: 0, col: 0 },
      "unit doesn't move off the map"
    );

    newState.units[0].command = "ATTACK_UP";

    newState = tick(newState);

    assert.deepEqual(
      newState.units[0].position,
      { row: 0, col: 0 },
      "unit doesn't move off the map"
    );

    newState.units[0].command = "ATTACK_RIGHT";

    newState = tick(newState);
    newState = tick(newState);
    newState = tick(newState);

    assert.deepEqual(
      newState.units[0].position,
      { row: 0, col: 1 },
      "unit doesn't move off the map"
    );

    newState.units[0].command = "ATTACK_DOWN";
    newState = tick(newState);
    newState = tick(newState);
    newState = tick(newState);

    assert.deepEqual(
      newState.units[0].position,
      { row: 1, col: 1 },
      "unit doesn't move off the map"
    );
  });

  test("units dont stack at the edge", (assert) => {
    const level = { rows: 1, cols: 4 };
    const unitGrid = Array.from({ length: level.rows }, () =>
      Array.from({ length: level.cols }, () => null)
    );
    const units = [];
    units.push({
      unitID: "unit1",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 0 },
    });
    unitGrid[0][0] = "unit1";
    units.push({
      unitID: "unit2",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 1 },
    });
    unitGrid[0][1] = "unit2";
    units.push({
      unitID: "unit3",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 2 },
    });
    unitGrid[0][2] = "unit3";
    units.push({
      unitID: "unit4",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 3 },
    });
    unitGrid[0][3] = "unit4";
    const state = {
      level,
      units,
      unitGrid,
    };

    let newState = tick(state);

    assert.deepEqual(
      newState.units[0].position,
      { row: 0, col: 0 },
      "unit1 doesn't move off the map"
    );
    assert.deepEqual(
      newState.units[1].position,
      { row: 0, col: 1 },
      "unit2 doesn't stack onto unit1"
    );
    assert.deepEqual(
      newState.units[2].position,
      { row: 0, col: 2 },
      "unit3 doesn't stack onto unit2"
    );
    assert.deepEqual(
      newState.units[3].position,
      { row: 0, col: 3 },
      "unit4 doesn't stack onto unit3"
    );
  });

  test("units dont stack not at edge", (assert) => {
    const level = { rows: 1, cols: 5 };
    const unitGrid = Array.from({ length: level.rows }, () =>
      Array.from({ length: level.cols }, () => null)
    );
    const units = [];
    units.push({
      unitID: "unit1",
      command: "HOLD",
      position: { row: 0, col: 1 },
    });
    unitGrid[0][1] = "unit1";
    units.push({
      unitID: "unit2",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 2 },
    });
    unitGrid[0][2] = "unit2";
    units.push({
      unitID: "unit3",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 3 },
    });
    unitGrid[0][3] = "unit3";
    units.push({
      unitID: "unit4",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 4 },
    });
    unitGrid[0][4] = "unit4";
    const state = {
      level,
      units,
      unitGrid,
    };

    let newState = tick(state);

    assert.deepEqual(
      newState.units[0].position,
      { row: 0, col: 1 },
      "unit1 doesn't move"
    );
    assert.deepEqual(
      newState.units[1].position,
      { row: 0, col: 2 },
      "unit2 doesn't move"
    );
    assert.deepEqual(
      newState.units[2].position,
      { row: 0, col: 3 },
      "unit3 doesn't move"
    );
    assert.deepEqual(
      newState.units[3].position,
      { row: 0, col: 4 },
      "unit4 doesn't move"
    );
  });

  test("units dont stack again", (assert) => {
    const level = { rows: 1, cols: 3 };
    const unitGrid = Array.from({ length: level.rows }, () =>
      Array.from({ length: level.cols }, () => null)
    );
    const units = [];
    units.push({
      unitID: "unit2",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 2 },
    });
    unitGrid[0][2] = "unit2";

    units.push({
      unitID: "unit0",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 0 },
    });
    unitGrid[0][0] = "unit0";

    units.push({
      unitID: "unit1",
      command: "ATTACK_LEFT",
      position: { row: 0, col: 1 },
    });
    unitGrid[0][1] = "unit1";
    const state = {
      level,
      units,
      unitGrid,
    };

    let newState = tick(state);

    assert.deepEqual(
      newState.units[1].position,
      { row: 0, col: 0 },
      "unit0 doesn't move"
    );
    assert.deepEqual(
      newState.units[2].position,
      { row: 0, col: 1 },
      "unit1 doesn't move"
    );
    assert.deepEqual(
      newState.units[0].position,
      { row: 0, col: 2 },
      "unit2 doesn't move"
    );
  });
})(window.QUnit.module, window.QUnit.test);
