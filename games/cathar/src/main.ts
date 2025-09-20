import {init, GameLoop, initKeys, load} from 'kontra'
import {initMouse} from "./utils/mouse";
import Game from "./game";
import {setCanvasBoundaries} from "./utils/utils";

const {canvas} = init();
setCanvasBoundaries(canvas)

initKeys()
initMouse(canvas);


GameLoop({
    update: () => Game.getInstance().update(),
    render: () => Game.getInstance().render()
}).start()
