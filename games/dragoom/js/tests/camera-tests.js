import Qunit from "qunit";
import "npm:qunit/qunit/qunit.css";

import Camera from "../Camera.js";

QUnit.module("Camera");

const STUB_GAME_1 = {
  cellsX: 8,
  cellsY: 8,
};

Qunit.test("creating", (assert) => {
  const camera = Camera.create(STUB_GAME_1);
  assert.true(camera instanceof Camera, "is a Camera");
});

Qunit.test("getting render state", (assert) => {
  const camera = Camera.create(STUB_GAME_1);
  const renderState = camera.getRenderState();
  assert.true(typeof renderState === "object", "is an object");
  assert.true("position" in renderState, "has position");
  assert.true("zoom" in renderState, "has zoom");
});

Qunit.test("initial position in the middle", (assert) => {
  const tests = [
    { cellsX: 3, cellsY: 3, expected: [1, 1] }, // 0, 1, 2
    { cellsX: 8, cellsY: 8, expected: [4, 4] }, // 0, 1, 2, 3, 4, 5, 6, 7
    { cellsX: 9, cellsY: 9, expected: [4, 4] }, // 0, 1, 2, 3, 4, 5, 6, 7, 8
  ];

  tests.forEach((t) => {
    const camera = Camera.create(t);
    const renderState = camera.getRenderState();
    const [x, y] = renderState.position;
    assert.equal(x, t.expected[0], `x is ${t.expected[0]}`);
    assert.equal(y, t.expected[1], `y is ${t.expected[1]}`);
  });
});

Qunit.test("zooming in", (assert) => {
  const camera = Camera.create(STUB_GAME_1);
  camera.zoom("IN");
  const renderState = camera.getRenderState();
  assert.equal(renderState.zoom, 2, "zoom is 2");
});

Qunit.test("zooming out", (assert) => {
  const camera = Camera.create(STUB_GAME_1);
  camera.zoom("IN");
  camera.zoom("OUT");
  const renderState = camera.getRenderState();
  assert.equal(renderState.zoom, 1, "zoom is 1");
});

Qunit.test("zoom in maxes out", (assert) => {
  const camera = Camera.create(STUB_GAME_1);
  camera.zoom("IN");
  camera.zoom("IN");
  camera.zoom("IN");
  camera.zoom("IN");
  camera.zoom("IN");
  const renderState = camera.getRenderState();
  assert.equal(renderState.zoom, 4, "zoom is 4");
});

Qunit.test("zoom out min", (assert) => {
  const camera = Camera.create(STUB_GAME_1);
  camera.zoom("OUT");
  camera.zoom("OUT");
  camera.zoom("OUT");
  camera.zoom("OUT");
  camera.zoom("OUT");
  const renderState = camera.getRenderState();
  assert.equal(renderState.zoom, 1, "zoom is 1");
});

Qunit.test("zooming in and out", (assert) => {
  const camera = Camera.create(STUB_GAME_1);
  camera.zoom("IN");
  camera.zoom("IN");
  camera.zoom("OUT");
  camera.zoom("OUT");
  camera.zoom("IN");
  camera.zoom("OUT");
  camera.zoom("IN");
  const renderState = camera.getRenderState();
  assert.equal(renderState.zoom, 2, "zoom is 2");
});

Qunit.test("moving", (assert) => {
  const tests = [
    { directions: ["UP"], expected: [1, 0] },
    { directions: ["UP", "UP"], expected: [1, 0] },
    { directions: ["UP", "UP", "UP"], expected: [1, 0] },
    { directions: ["DOWN", "UP", "UP", "UP"], expected: [1, 0] },
    { directions: ["DOWN"], expected: [1, 2] },
    { directions: ["DOWN", "DOWN"], expected: [1, 3] },
    { directions: ["DOWN", "DOWN", "DOWN"], expected: [1, 3] },
    { directions: ["UP", "DOWN", "DOWN", "DOWN"], expected: [1, 3] },
    { directions: ["LEFT"], expected: [0, 1] },
    { directions: ["LEFT", "LEFT"], expected: [0, 1] },
    { directions: ["LEFT", "LEFT", "LEFT"], expected: [0, 1] },
    { directions: ["RIGHT", "LEFT", "LEFT", "LEFT"], expected: [0, 1] },
    { directions: ["RIGHT"], expected: [2, 1] },
    { directions: ["RIGHT", "RIGHT"], expected: [3, 1] },
    { directions: ["RIGHT", "RIGHT", "RIGHT"], expected: [3, 1] },
    { directions: ["LEFT", "RIGHT", "RIGHT", "RIGHT"], expected: [3, 1] },
  ];

  tests.forEach((t) => {
    const camera = Camera.create({
      cellsX: 3,
      cellsY: 3,
    });
    t.directions.forEach((direction) => camera.move(direction));
    const renderState = camera.getRenderState();

    const assertionName = t.directions.join(", ");
    assert.deepEqual(renderState.position, t.expected, `${assertionName}`);
  });
});
