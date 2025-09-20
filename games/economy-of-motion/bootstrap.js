import { SCREENW, SCREENH } from "./constants.js";
import { Video } from "./Video.js";
import { Input } from "./Input.js";
import { Audio } from "./Audio.js";
import { Game } from "./Game.js";

window.addEventListener("load", () => {
  const game = new Game(new Video(), new Audio(), new Input());
  
  /*IGNORE{*/
  // When we're loaded from source, the songs and stages 
  game.whenReady().then(() => {
  /*}IGNORE*/
  
  game.begin();
  
  /*IGNORE{*/
  }).catch(error => {
    console.error(error);
  });
  /*}IGNORE*/
});
