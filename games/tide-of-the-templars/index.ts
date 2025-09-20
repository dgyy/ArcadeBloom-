import {init, initKeys, keyPressed, GameLoop, Sprite, collides} from 'kontra';
import rockImageSrc from "../assets/rock.png";
import boatImageSrc from "../assets/boat.png";
import fishImageSrc from "../assets/fish.png";
import waterSvg from "../assets/water.svg";

    let remainingLife = 100
    let hoursPassed = 0
    let { canvas } = init();
    let sprites = [];
    let rocks = [];
    let fishArray = [];
    const bodyDocument = document.getElementsByTagName("body")[0]
    const daysElement = document.getElementById("days-passed")
    const gameoverElement = document.getElementById("gameover")
    const background = document.getElementById('background')
    background.style.backgroundImage = `url(${waterSvg}), url(${waterSvg}), url(${waterSvg})`
    background.style.backgroundSize = '1200px' // I know, weird. This is to fix a bug in firefox...
    const UP = 'arrowup';
    const DOWN = 'arrowdown';
    function timePassed(reset=false) {
      hoursPassed = reset ? 0 : hoursPassed+1;
      if(hoursPassed % 12 == 0) bodyDocument.classList.toggle('night');
      if(hoursPassed % 24 == 0) daysElement.innerHTML = `Day ${Math.floor(hoursPassed/24)+1}`;
    }

    const loop = GameLoop({
      update() {
                sprites.map(sprite => {
          sprite.update();
        })},
        render() {
          sprites.map(sprite => sprite.render());
        }
      });

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const rockImage = new Image();
    rockImage.src = rockImageSrc;
    let fishImage = new Image();
    fishImage.src = fishImageSrc;

    function createSprite(props) {
      let sprite = Sprite({
        x: canvas.width,
        y: Math.random() * canvas.height,
        radius: 6,
        ...props,
        update() {
          this.x -= props.speed*((hoursPassed/24)+1);
          if (this.x < -props.width) {
            this.x = 600;
            this.y = Math.random() * 600;
            this.collided = false;
            this.opacity = 1;
          }
        }
      });
      return sprite;
    }
    
    function createRock() {
      let rock = createSprite({
        width: 30,
        height: 30,
        image: rockImage,
        speed: 2,
        collided: false
      });
      rocks.push(rock);
      sprites.push(rock);
    }
    
    function createFish() {
      let fish = createSprite({
        width: 60,
        height: 15,
        image: fishImage,
        speed: 3,
        collided: false,
        opacity: 1
      });
      fishArray.push(fish);
      sprites.push(fish);
    }

    function initSprites(){
      for (let i = 0; i < 4; i++) {
        setTimeout(createRock, i * 1000);
      }
      for (let i = 0; i < 2; i++) {
        setTimeout(createFish, i * 5000);
      }
    }

    function gameover() {
      loop.stop()
      document.getElementById("result").innerHTML = `You survived at sea for ${hoursPassed} hours`
      gameoverElement.style.display = 'block'
      const restartButton = document.querySelector('#restart');

      restartButton.addEventListener('click', () => {
        restart();
      });
    }
    
    async function crashAnimation() {
      for (let i = 0; i < 3; i++) {
        bodyDocument.style.transition = 'none'
        bodyDocument.style.filter = 'invert(0.4)'
        await sleep(150)
        bodyDocument.style.filter = ''
        await sleep(150)
        bodyDocument.style.transition = ''
      }
    }

    function changeLife(newLife) {
      remainingLife = Math.min(Math.max(newLife, 0), 100);
      const lifebar = document.getElementById("lifebar");
      lifebar.style.width = `${remainingLife}%`;
      if(remainingLife == 0) gameover();
    }

    let shipImage = new Image();
    shipImage.src = boatImageSrc;

    function shipSprite() {
      let ship = Sprite({
        x: 100,
        y: canvas.height / 2,
        radius: 6,
        image: shipImage,
        update() {
          // move the ship up and down
          if (keyPressed(UP) || keyPressed('w')) {
            this.ddy = -1; // move the ship up by setting its vertical acceleration to -2
          } else if (keyPressed(DOWN) || keyPressed('s')) {
            this.ddy = 1; // move the ship down by setting its vertical acceleration to 2
          } else {
            this.ddy = 0; // reset the vertical acceleration if neither up nor down key is pressed
          }
          
          // rotate the ship based on the acceleration
          this.rotation = (1/30)*this.dy
          
          // limit the ship's movement to the canvas
          if (this.y < 0) {
            this.y = 0;
            this.dy = 0;
          } else if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.dy = 0;
          }
          
          // check for collisions with rocks
          rocks.forEach(rock => {
            if (!rock.collided && collides(this, rock)) {
              rock.collided = true
              changeLife(remainingLife - 30)
              crashAnimation()
            }
          });

          // check for collisions with fish
          fishArray.forEach(fish => {
            if (!fish.collided && collides(this, fish)) {
              fish.collided = true
              changeLife(remainingLife + 10)
              fish.opacity = 0
            }
          });
          
          this.advance();
        }
      });
      sprites.push(ship);
    };

    shipImage.onload = shipSprite

    setInterval(timePassed, 1500);
    initKeys();

    function restart() {
      sprites = []
      changeLife(100)
      timePassed(true)
      initSprites()
      shipSprite()
      bodyDocument.classList.remove('night')
      loop.start()
      gameoverElement.style.display = ''
    }

    window.onload = () => {
      const startButton = document.getElementById('start-button');
      const startScreen = document.getElementById('start-screen');
  
      startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        restart()
      });
    };



