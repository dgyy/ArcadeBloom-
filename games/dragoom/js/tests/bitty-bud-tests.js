import Qunit from "qunit";
import "npm:qunit/qunit/qunit.css";

import BittyBudGameObject from "../BittyBudGameObject.js";

Qunit.module("Bitty-Bud");

const STUB_GAME_2 = {
  zIndexSize: 10,
  removeGameObject: () => {},
  isCellBlocked: () => {},
};

Qunit.test("getting random object ID", (assert) => {
  const b1 = new BittyBudGameObject(STUB_GAME_2, 0, 0);
  assert.ok(b1.gameObjectID, "random ID");

  const b2 = new BittyBudGameObject(STUB_GAME_2, 1, 1);
  assert.notEqual(b1.gameObjectID, b2.gameObjectID, "different IDs");
});

Qunit.test("is blocking", (assert) => {
  const b1 = new BittyBudGameObject(STUB_GAME_2, 0, 0);
  assert.true(b1.isBlocking(), "is blocking");
});

Qunit.test("is at position", (assert) => {
  const b1 = new BittyBudGameObject(STUB_GAME_2, 0, 0);
  assert.true(b1.isAt(0, 0), "is at position");
  assert.false(b1.isAt(1, 0), "is not at position");
});

Qunit.test("initial render state", (assert) => {
  const bt = new BittyBudGameObject(STUB_GAME_2, 0, 0);
  bt.update();
  const renderState = bt.getRenderState();
  assert.deepEqual(
    renderState,
    [
      {
        position: [0, 0],
        moving: null,
        movingProgress: null,
        offsetY: -3,
        zIndex: 1,
        spriteID: "BITTY_BUD_IDLE_1",
      },
    ],
    "initial data"
  );
});

Qunit.test("ignite", (assert) => {
  const bt = new BittyBudGameObject(STUB_GAME_2, 0, 0);
  bt.ignite();
  bt.update();
  const renderState = bt.getRenderState()[0];
  assert.ok(renderState.spriteID.startsWith("BITTY_BUD_HOTT"), "ignited");
});

Qunit.test("animating", (assert) => {
  assert.expect(1);
  STUB_GAME_2.removeGameObject = () => {
    assert.ok(true, "removed");
  };
  const bt = new BittyBudGameObject(STUB_GAME_2, 0, 0);
  bt.update();
  bt.ignite({ dieAfterFrames: 1 });
  bt.update();
});
