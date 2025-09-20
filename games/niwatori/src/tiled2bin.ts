import fs from "fs";
import path from "path";
import { TiledMap, MapFile } from "./types.js";

function encodeTiledMapToGameMap(json: string): MapFile {
  const { width, height, layers }: TiledMap = JSON.parse(json);

  const gameMap: MapFile = { width, height, layers: {} };
  layers.forEach(({ data, name }) => {
    if (name === "background") {
      return;
    }

    gameMap.layers[name] = data;
  });

  return gameMap;
}

(function main() {
  const [_node, _script, srcDir, destDir] = process.argv;

  if (!srcDir || !destDir) {
    console.error("Usage: node bin/tiled2js.js [tiledDir] [distDir]");
    return;
  }

  fs.readdir(srcDir, function (err, files) {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      if (!file || !file.endsWith(".tmj") || file === "template.tmj") {
        return;
      }

      console.log(`processing map file ${file}`);
      fs.readFile(path.join(srcDir, file), function (err, buffer) {
        if (err) {
          console.error(err);
          return;
        }

        fs.writeFile(
          path.join(destDir, file.replace(/\.tmj$/, ".json")),
          JSON.stringify(encodeTiledMapToGameMap(buffer.toString())),
          function (err) {
            if (err) {
              console.error(err);
            }
          },
        );
      });
    });
  });
})();
