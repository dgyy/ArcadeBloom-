import { Game } from "./Game";
import { King } from "./units/King";
import { Swordman } from "./units/Swordman";

const game = new Game(document.getElementById('canvas'));

const basic = new King(3, 8);
game.add(basic);

for(let i=5; i<7; i++) {
  for (let j=6; j<11; j++) {
    const unit = new Swordman(i, j);
    game.add(unit);
  }
}
for(let i=10; i<12; i++) {
  for (let j=7; j<10; j++) {
    const unit = new Swordman(i, j, 'enemy');
    game.add(unit);
  }
}

game.loop();
