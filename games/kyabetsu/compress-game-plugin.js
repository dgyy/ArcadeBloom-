export default function compressGame() {
  return {
    name: 'compress-game',

    transform(src, id) {
      if (id.endsWith("sprites.js")) {
        const code = src.replaceAll(/\n/g, "").replaceAll(/\s\s+/g, " ");
        return {
          code
        }
      } else if (id.includes("scenes/") || id.endsWith("game.js") || id.endsWith("engine.js")) {
        const code = src
          .replaceAll(/collect/g, "c")
          .replaceAll(/playSound/g, "p")
          .replaceAll(/drawHUD/g, "h")
          .replaceAll(/drawObjects/g, "o")
          .replaceAll(/drawEntities/g, "e")
          .replaceAll(/functions/g, "f")
          .replaceAll(/setScene/g, "s")
          .replaceAll(/getEntity/g, "g")
          .replaceAll(/getEntityEl/g, "y")
          .replaceAll(/setEntityProps/g, "a")
          .replaceAll(/onTooltip/g, "t")
          .replaceAll(/onSceneLeave/g, "l")
        return {
          code
        }
      }
    }
  }
}

