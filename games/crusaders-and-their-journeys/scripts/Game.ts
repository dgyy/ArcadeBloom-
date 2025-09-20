
import GameObject, { IPosition, ISize } from "./objects/GameObject";
import Enemy from "./entities/Enemy";
import Player from "./entities/Player";
import { formatTime, getRandomIntInclusive } from "./utils";

interface IKilled {
  civilians: number;
  infecteds: number;
  robbers: number;
}

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  enemy: Enemy;
  killed: IKilled;
  diffTime: Date;
  hikingEndTime: Date;
  start: boolean;
  voiceSynthesizer: SpeechSynthesisUtterance;
  readonly voiceTexts: string[] = [
    "Onward towards victory!",
    "For faith and glory!",
    "Join the holy fight!",
    "Unite for the sacred cause!",
    "Our blood for the holy land!",
    "The righteous crusaders!",
    "Death before dishonor!",
    "In the name of God!",
    "Fight for your beliefs!",
    "Together we stand!",
    "Crusaders never surrender!",
    "Victory or death!",
    "Honor and glory await!",
    "A holy journey!",
    "A quest for the eternal reward!",
    "Knights of the cross!",
    "Unleash the warrior in you!",
    "A battle for freedom!",
  ];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { willReadFrequently: false, alpha: false });
    this.resize();

    this.start = true;
    this.killed = {
      civilians: 0,
      infecteds: 0,
      robbers: 0
    };

    if (window.hasOwnProperty("speechSynthesis")) {
      this.voiceSynthesizer = new SpeechSynthesisUtterance();
      this.voiceSynthesizer.lang = "en-US";
      this.voiceSynthesizer.voice = window.speechSynthesis.getVoices()[1];
    }

    this.player = new Player(this.ctx);

    setTimeout(() => {
      this.enemy = new Enemy(this.ctx, this.player);
    });

    this.init();
  }
  init(): void {
    this.setEvents();
    this.resize();
    setTimeout(() => {
      this.render();
    });
  }

  setEvents(): void {
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("keydown", (e) => {
      if (this.start && (e.code === "Enter" || e.code === "Space")) {
        this.start = false;
        this.canvas.requestFullscreen();
        this.player.init();
        this.enemy.init();

        const startTime = new Date();
        this.hikingEndTime = new Date();
        this.hikingEndTime.setMinutes(startTime.getMinutes() + getRandomIntInclusive(1, 5));

        this.startVoice();
      }
    });
  }
  startVoice(): void {
    if (this.voiceSynthesizer && !this.isFinish) {
      this.voiceSynthesizer.addEventListener("end", () => {
        this.startVoice();
      });
      setTimeout(() => {
        this.voiceSynthesizer.voice = window.speechSynthesis.getVoices()[1];
        this.voiceSynthesizer.text = this.voiceTexts[getRandomIntInclusive(0, this.voiceTexts.length - 1)];
        window.speechSynthesis.speak(this.voiceSynthesizer);
      }, 15000);
    }
  }

  resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  render(tFrame?: number): void {
    if (this.isPause) {
      return;
    }
    requestAnimationFrame(this.render.bind(this));
    if (this.start) {
      this.showPopup();
      return;
    }
    this.diffTime = new Date(this.hikingEndTime.getTime() - new Date().getTime());
    this.draw();
    this.player.render(tFrame);
    this.drawWaterArea();
    this.enemy.render(tFrame);
    this.collisionDetection();
    // this.drawFog();
    this.drawInfo();
    this.checkEndGame();
  }

  showPopup(): void {
    this.drawBackground();
    this.ctx.save();
    this.ctx.font = "bold 20px Courier New";
    this.ctx.fillStyle = "#333";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Don't go beyond the land.", this.canvas.width / 2, this.canvas.height / 3);
    this.ctx.fillText("Don't kill civilians.", this.canvas.width / 2, this.canvas.height / 3 + 30);
    this.ctx.fillText("Save at least one crusader.", this.canvas.width / 2, this.canvas.height / 3 + 60);
    this.ctx.fillText("Finish the hike.", this.canvas.width / 2, this.canvas.height / 3 + 90);
    this.ctx.fillText("Good luck!", this.canvas.width / 2, this.canvas.height / 3 + 120);
    this.ctx.fillText("Press Enter or Space to start.", this.canvas.width / 2, this.canvas.height / 3 + 180);
    this.ctx.restore();
  }

  collisionDetection(): void {
    this.player.crusaders.forEach(crusader => {
      if (this.isCollisionWithWater(crusader)) {
        this.player.killCrusader(crusader.id);
      }
      this.enemy.infecteds.forEach(infected => {
        if (infected.isCollisionWithObject(crusader)) {
          this.player.killCrusader(crusader.id);
          this.enemy.moveTo = this.enemy.getRandomPosition(infected.sprite.config.frameSize);
        }
      });
      this.enemy.robbers.forEach(robber => {
        if (robber.isCollisionWithObject(crusader)) {
          this.enemy.killRobber(robber.id);
          this.killed.robbers++;
        }
      });
      this.enemy.bulletList.forEach(enemyBullet => {
        if (enemyBullet.isCollisionWithObject(crusader)) {
          this.enemy.destroyBullet(enemyBullet.id);
          this.player.killCrusader(crusader.id);
        }
      });
    });

    this.player.bulletList.forEach(playerBullet => {
      if (this.isCollisionWithWater(playerBullet)) {
        this.player.destroyBullet(playerBullet.id);
      }
      this.enemy.civilians.forEach(civilian => {
        if (civilian.isCollisionWithObject(playerBullet)) {
          this.player.destroyBullet(playerBullet.id);
          this.enemy.killCivilian(civilian.id);
          this.killed.civilians++;
        }
      });
      this.enemy.infecteds.forEach(infected => {
        if (infected.isCollisionWithObject(playerBullet)) {
          this.player.destroyBullet(playerBullet.id);
          this.enemy.killInfected(infected.id);
          this.killed.infecteds++;
        }
      });
      this.enemy.robbers.forEach(robber => {
        if (robber.isCollisionWithObject(playerBullet)) {
          this.player.destroyBullet(playerBullet.id);
          this.enemy.killRobber(robber.id);
          this.killed.robbers++;
        }
      });
      this.enemy.bulletList.forEach(enemyBullet => {
        if (enemyBullet.isCollisionWithObject(playerBullet)) {
          this.player.destroyBullet(playerBullet.id);
          this.enemy.destroyBullet(enemyBullet.id);
        }
      });
    });

    this.enemy.bulletList.forEach(enemyBullet => {
      if (this.isCollisionWithWater(enemyBullet)) {
        this.enemy.destroyBullet(enemyBullet.id);
      }
    });
  }
  isCollisionWithWater(object: GameObject): boolean {
    return object.position.x < this.waterAreaSize / 2 || object.position.x + object.size.width > this.canvas.width - this.waterAreaSize ||
      object.position.y < this.waterAreaSize || object.position.y + object.size.height > this.canvas.height - this.waterAreaSize;
  }

  isFinish = false;
  isPause = false;
  checkEndGame(): void {
    if (!this.isFinish && (!this.player.crusaders.length || this.killed.civilians >= 20 || (this.getFormatTime() === "00:00" || this.diffTime.getMinutes() >= 10))) {
      this.isFinish = true;
      setTimeout(() => {
        this.isPause = true;
        this.setResult();
      }, 50);
    }
  }
  setResult(): void {
    let message: string = "You " + (this.getFormatTime() === "00:00" && this.player.crusaders.length && this.killed.civilians < 20 ?
      "win!" :
      "lost!");
    message += "\nRepeat?";
    alert(message);
    document.location.reload();
  }

  draw() {
    this.drawBackground();
  }

  gradientBGy: number = 0;
  drawBackground(): void {
    this.ctx.save();
    const gradient = this.ctx.createLinearGradient(0, this.gradientBGy++ % this.canvas.height, 0, this.canvas.height + this.gradientBGy); // ASK - gradientBGy += 2?
    if (this.gradientBGy >= this.canvas.height) {
      this.gradientBGy = -this.canvas.height;
    }
    gradient.addColorStop(0, "#EADBC8");
    gradient.addColorStop(0.33, "#DAC0A3");
    gradient.addColorStop(0.66, "#DAC0A3");
    gradient.addColorStop(1, "#EADBC8");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  waterAreaSize: number = 10;
  drawWaterArea(): void {
    this.ctx.save();
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, "#02AABD");
    gradient.addColorStop(1, "#00CDAC");
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 20;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  fogWidth = 0;
  fogRevert: boolean = false;
  isFogStop: boolean = false;
  flag = 0;
  drawFog() { // TODO: radius with resize
    const radius = this.canvas.width;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineWidth = this.fogWidth;

    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, "#868F96");
    gradient.addColorStop(1, "#596164");

    const circleInnerLength = 400;
    const circleOuterLength = (((radius))) - this.flag++;
    // console.error(circleInnerLength, circleOuterLength);



    this.ctx.strokeStyle = gradient;
    if (!this.isFogStop) {
      // if (this.fogWidth >= radius - this.fogWidth) {  // TODO: fog visible area
      if (circleOuterLength <= circleInnerLength) {  // TODO: fog visible area
        this.fogRevert = true;
        this.stopFog();
      } else if (this.fogWidth <= 0) {
        this.fogRevert = false;
        this.stopFog();
      }
      this.setFogWidth();
    }
    // this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 400, 0, 2 * Math.PI);
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.restore();
  }
  setFogWidth(): void {
    const fogStep: number = 5 * (this.fogRevert ? -1 : 1);
    this.fogWidth += fogStep;
  }
  stopFog(): void {
    this.isFogStop = true;
    setTimeout(() => {
      this.isFogStop = false;
      this.setFogWidth();
    }, 5000);
  }

  drawInfo(): void {
    this.ctx.save();
    this.ctx.font = "16px Courier New";
    this.ctx.fillText(`Crusaders: ${this.player.crusaders.length}`, 15, 25);
    this.ctx.fillText(`Civilians killed: ${this.killed.civilians}`, 15, 45);
    this.ctx.fillText(`Infecteds killed: ${this.killed.infecteds}`, 15, 65);
    this.ctx.fillText(`Robbers killed: ${this.killed.robbers}`, 15, 85);
    this.ctx.fillText(`Hiking time: ${this.getFormatTime()}`, 15, this.canvas.height - 20);
    this.ctx.restore();
  }
  getFormatTime(): string {
    return formatTime(this.diffTime.getMinutes()) + ":" + formatTime(this.diffTime.getSeconds())
  }
}
