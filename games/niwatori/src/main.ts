import { init, GameLoop, initKeys, initPointer, keyPressed } from "kontra";
import Map from "./Map.js";
import Tileset from "./Tileset.js";

init();
initPointer();
initKeys();

const LAST_MAP_COUNT = 10;
let mapNumber = -1;

Tileset.load().then((tileset) => {
  let map: Map | undefined;
  let mapLoading: boolean = false;
  let mapReady: boolean = false;

  let loop = GameLoop({
    update: function () {
      if (mapLoading) {
        return;
      }

      if (!map || map.levelComplete) {
        mapLoading = true;
        mapReady = false;

        mapNumber = (mapNumber + 1) % LAST_MAP_COUNT;
        Map.load(mapNumber, tileset).then((m) => {
          map = m;

          mapLoading = false;
        });
        return;
      }

      if (!mapReady && !keyPressed(["arrowup", "w"])) {
        mapReady = true;
      }
      if (!mapReady) {
        return;
      }

      if (keyPressed(["arrowup", "w"])) {
        map.movePlayer(0, -1);
      }
      if (keyPressed(["arrowdown", "s"])) {
        map.movePlayer(0, 1);
      }
      if (keyPressed(["arrowleft", "a"])) {
        map.movePlayer(-1, 0);
      }
      if (keyPressed(["arrowright", "d"])) {
        map.movePlayer(1, 0);
      }
      if (keyPressed(["r"])) {
        map.init();
      }

      map.update();
    },
    render: function () {
      if (!map) {
        return;
      }

      map.render();
    },
  });

  loop.start();
});
